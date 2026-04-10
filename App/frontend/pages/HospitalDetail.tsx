import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  MapPin, ShieldCheck, Phone, Mail, Users, Award, X, Calendar,
  DollarSign, Stethoscope, Heart, Globe, CheckCircle, AlertCircle,
  Bed, UserCheck, ArrowLeft, Lock
} from 'lucide-react';
import { hospitalsAPI } from '../services/api';

interface Hospital {
  id: number; name: string; email: string; phone: string;
  address: string; city: string; state: string; country: string; postal_code: string;
  latitude: number; longitude: number; specialties: string[]; accreditations: string[];
  commission_rate: number; logo_url: string; description: string; website_url: string;
  established_year: number; bed_capacity: number; status: string;
  admin_name: string; admin_email: string; created_at: string; updated_at: string;
}

interface Doctor {
  id: number; name: string; email: string; phone: string;
  specialization: string; sub_specialization: string; qualification: string;
  experience_years: number; consultation_fee: number; languages_spoken: string[];
  bio: string; profile_picture_url: string; license_number: string; status: string;
}

interface Statistics {
  total_patients: number; total_appointments: number;
  completed_appointments: number; total_revenue: number;
}

const HospitalDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('user');
  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  const availableTimes = ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'];

  useEffect(() => { if (id) fetchHospitalDetails(); }, [id]);

  const fetchHospitalDetails = async () => {
    try {
      setLoading(true);
      const response = await hospitalsAPI.getHospitalById(id!);
      if (response.success) {
        setHospital(response.data.hospital);
        setDoctors(response.data.doctors || []);
        setStatistics(response.data.statistics);
      } else { setError('Hospital not found'); }
    } catch (err: any) { setError(err.message || 'Failed to load hospital details'); }
    finally { setLoading(false); }
  };

  const handleBookConsultation = () => {
    if (selectedDate && selectedTime) {
      navigate('/payment', { state: { hospital, doctor: selectedDoctor, date: selectedDate, time: selectedTime } });
    }
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(amount);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <span className="ml-3 text-gray-500">Loading hospital details...</span>
    </div>
  );

  if (!isLoggedIn) return (
    <div className="max-w-5xl mx-auto p-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-8 text-sm">
        <ArrowLeft className="w-4 h-4" /> Back to Hospitals
      </button>
      <div className="flex flex-col items-center justify-center py-24 text-center space-y-5">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
          <Lock className="w-8 h-8 text-slate-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Sign in to View Hospital Details</h2>
          <p className="text-slate-500 max-w-sm">Create a free account or sign in to access full hospital information and book appointments.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => navigate('/login', { state: { from: `/hospital/${id}` } })} className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">Sign In</button>
          <button onClick={() => navigate('/register')} className="px-6 py-2.5 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors">Register</button>
        </div>
      </div>
    </div>
  );

  if (error || !hospital) return (
    <div className="max-w-5xl mx-auto p-6 text-center py-20">
      <AlertCircle className="w-14 h-14 text-red-400 mx-auto mb-4" />
      <h2 className="text-xl font-bold text-gray-900 mb-2">Hospital Not Found</h2>
      <p className="text-gray-500 mb-5">{error}</p>
      <button onClick={() => navigate(-1)} className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Go Back</button>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Back */}
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-gray-800 text-sm transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Hospitals
      </button>

      {/* Hero Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Top accent bar */}
        <div className="h-2 bg-gradient-to-r from-blue-500 via-blue-600 to-emerald-500" />

        <div className="p-8">
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Logo */}
            <div className="flex-shrink-0">
              {hospital.logo_url ? (
                <img src={hospital.logo_url} alt={hospital.name} className="w-24 h-24 rounded-xl object-cover border border-gray-100 shadow-sm" />
              ) : (
                <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-3xl font-black shadow-sm">
                  {hospital.name.charAt(0)}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {hospital.status === 'active' && (
                  <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 border border-emerald-100">
                    <CheckCircle className="w-3.5 h-3.5" /> Verified
                  </span>
                )}
                {hospital.accreditations?.[0] && (
                  <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 border border-blue-100">
                    <ShieldCheck className="w-3.5 h-3.5" /> {hospital.accreditations[0]}
                  </span>
                )}
              </div>

              <h1 className="text-2xl font-black text-gray-900 mb-1">{hospital.name}</h1>
              <p className="text-gray-500 text-sm flex items-center gap-1.5 mb-3">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                {hospital.address}, {hospital.city}, {hospital.state}, {hospital.country}
                {hospital.postal_code && ` - ${hospital.postal_code}`}
              </p>
              {hospital.description && (
                <p className="text-gray-600 text-sm leading-relaxed mb-4 max-w-2xl">{hospital.description}</p>
              )}

              {/* Contact row */}
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-5">
                {hospital.phone && (
                  <span className="flex items-center gap-1.5"><Phone className="w-4 h-4 text-blue-500" />{hospital.phone}</span>
                )}
                {hospital.email && (
                  <span className="flex items-center gap-1.5"><Mail className="w-4 h-4 text-blue-500" />{hospital.email}</span>
                )}
                {hospital.website_url && (
                  <a href={hospital.website_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-blue-600 hover:underline">
                    <Globe className="w-4 h-4" /> Website
                  </a>
                )}
                {hospital.admin_name && (
                  <span className="flex items-center gap-1.5"><UserCheck className="w-4 h-4 text-blue-500" />{hospital.admin_name}</span>
                )}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-3">
                <button onClick={() => setShowBookingModal(true)} className="px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4" /> Book Consultation
                </button>
                <button onClick={() => alert('Quote request sent! We will contact you within 24 hours.')} className="px-5 py-2.5 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2 text-sm">
                  <DollarSign className="w-4 h-4" /> Get Quote
                </button>
              </div>
            </div>
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-gray-100">
            {hospital.bed_capacity && (
              <div className="text-center">
                <div className="text-2xl font-black text-blue-600 flex items-center justify-center gap-1">
                  <Bed className="w-5 h-5" />{hospital.bed_capacity}
                </div>
                <div className="text-xs text-gray-400 mt-0.5">Beds</div>
              </div>
            )}
            {doctors.length > 0 && (
              <div className="text-center">
                <div className="text-2xl font-black text-emerald-600 flex items-center justify-center gap-1">
                  <Stethoscope className="w-5 h-5" />{doctors.length}
                </div>
                <div className="text-xs text-gray-400 mt-0.5">Doctors</div>
              </div>
            )}
            {hospital.established_year && (
              <div className="text-center">
                <div className="text-2xl font-black text-purple-600">{hospital.established_year}</div>
                <div className="text-xs text-gray-400 mt-0.5">Established</div>
              </div>
            )}
            {statistics?.total_patients > 0 && (
              <div className="text-center">
                <div className="text-2xl font-black text-orange-500 flex items-center justify-center gap-1">
                  <Users className="w-5 h-5" />{statistics.total_patients}
                </div>
                <div className="text-xs text-gray-400 mt-0.5">Patients Served</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Specialties & Accreditations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {hospital.specialties?.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-500" /> Medical Specialties
            </h2>
            <div className="flex flex-wrap gap-2">
              {hospital.specialties.map((s, i) => (
                <span key={i} className="bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1.5 rounded-lg text-sm font-medium">{s}</span>
              ))}
            </div>
          </div>
        )}

        {hospital.accreditations?.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" /> Accreditations
            </h2>
            <div className="space-y-2">
              {hospital.accreditations.map((a, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" /> {a}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Doctors */}
      {doctors.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-base font-bold text-gray-800 mb-5 flex items-center gap-2">
            <Stethoscope className="w-4 h-4 text-blue-500" /> Medical Team
            <span className="ml-1 text-xs font-normal text-gray-400">({doctors.length} doctors)</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {doctors.map((doctor) => (
              <div key={doctor.id} className="border border-gray-100 rounded-xl p-4 hover:border-blue-200 hover:shadow-sm transition-all">
                <div className="flex items-start gap-3 mb-3">
                  {doctor.profile_picture_url ? (
                    <img src={doctor.profile_picture_url} alt={doctor.name} className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {doctor.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  )}
                  <div className="min-w-0">
                    <h3 className="font-bold text-gray-900 text-sm truncate">{doctor.name}</h3>
                    <p className="text-xs text-blue-600 font-medium">{doctor.specialization}</p>
                    {doctor.sub_specialization && <p className="text-xs text-gray-400">{doctor.sub_specialization}</p>}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                  <span>{doctor.experience_years} yrs exp.</span>
                  {doctor.consultation_fee && <span className="font-semibold text-emerald-600">{formatCurrency(doctor.consultation_fee)}</span>}
                </div>

                {doctor.qualification && <p className="text-xs text-gray-500 mb-2">{doctor.qualification}</p>}

                {doctor.languages_spoken?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {doctor.languages_spoken.map((lang, i) => (
                      <span key={i} className="bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded text-xs">{lang}</span>
                    ))}
                  </div>
                )}

                <button
                  onClick={() => { setSelectedDoctor(doctor); setShowBookingModal(true); }}
                  className="w-full py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Book Appointment
                </button>

                {doctor.bio && (
                  <p className="text-xs text-gray-500 mt-3 pt-3 border-t border-gray-100 leading-relaxed line-clamp-2">{doctor.bio}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTA Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold mb-1">Ready to Get Started?</h2>
            <p className="text-blue-100 text-sm">Contact {hospital.name} for consultation and treatment planning.</p>
            <div className="flex flex-wrap gap-4 mt-2 text-sm text-blue-100">
              {hospital.phone && <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" />{hospital.phone}</span>}
              {hospital.email && <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" />{hospital.email}</span>}
            </div>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <button onClick={() => setShowBookingModal(true)} className="px-5 py-2.5 bg-white text-blue-700 font-bold rounded-lg hover:bg-blue-50 transition-colors text-sm">
              Book Consultation
            </button>
            <button onClick={() => alert('Medical opinion request sent! We will contact you within 24 hours.')} className="px-5 py-2.5 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-400 transition-colors text-sm border border-blue-400">
              Request Opinion
            </button>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-500" /> Book Consultation
              </h3>
              <button onClick={() => { setShowBookingModal(false); setSelectedDoctor(null); setSelectedDate(''); setSelectedTime(''); }} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="mb-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
              <p className="font-semibold text-gray-900 text-sm">{hospital.name}</p>
              <p className="text-xs text-gray-500">{hospital.city}, {hospital.state}</p>
            </div>

            {selectedDoctor && (
              <div className="mb-4 p-3 bg-blue-50 rounded-xl border border-blue-100">
                <p className="font-semibold text-blue-900 text-sm">Dr. {selectedDoctor.name}</p>
                <p className="text-xs text-blue-600">{selectedDoctor.specialization}</p>
                {selectedDoctor.consultation_fee && (
                  <p className="text-xs text-emerald-600 font-semibold mt-0.5">Fee: {formatCurrency(selectedDoctor.consultation_fee)}</p>
                )}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Select Date</label>
                <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Select Time</label>
                <div className="grid grid-cols-3 gap-2">
                  {availableTimes.map(time => (
                    <button key={time} onClick={() => setSelectedTime(time)}
                      className={`py-2 text-xs font-semibold rounded-lg border transition-colors ${selectedTime === time ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'}`}>
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-sm text-blue-700 space-y-1">
                <p className="font-semibold text-blue-900 mb-2">What's included</p>
                {['30-minute consultation', 'Direct access to specialists', 'Medical report review', 'Treatment plan discussion'].map(item => (
                  <p key={item} className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />{item}</p>
                ))}
              </div>

              <button onClick={handleBookConsultation} disabled={!selectedDate || !selectedTime}
                className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors text-sm">
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HospitalDetail;
