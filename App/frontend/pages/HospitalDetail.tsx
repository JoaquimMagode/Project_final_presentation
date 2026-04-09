import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Star, MapPin, Clock, ShieldCheck, Phone, Mail, Users, Award, Camera, X, Calendar, 
  DollarSign, Building2, Stethoscope, Heart, Activity, FileText, Globe, 
  CheckCircle, AlertCircle, Bed, UserCheck, TrendingUp, ArrowLeft, Lock
} from 'lucide-react';
import { hospitalsAPI } from '../services/api';

interface Hospital {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  latitude: number;
  longitude: number;
  specialties: string[];
  accreditations: string[];
  commission_rate: number;
  logo_url: string;
  description: string;
  website_url: string;
  established_year: number;
  bed_capacity: number;
  status: string;
  admin_name: string;
  admin_email: string;
  created_at: string;
  updated_at: string;
}

interface Doctor {
  id: number;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  sub_specialization: string;
  qualification: string;
  experience_years: number;
  consultation_fee: number;
  languages_spoken: string[];
  bio: string;
  profile_picture_url: string;
  license_number: string;
  status: string;
}

interface Statistics {
  total_patients: number;
  total_appointments: number;
  completed_appointments: number;
  total_revenue: number;
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

  const availableTimes = [
    '09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'
  ];

  useEffect(() => {
    if (id) {
      fetchHospitalDetails();
    }
  }, [id]);

  const fetchHospitalDetails = async () => {
    try {
      setLoading(true);
      const response = await hospitalsAPI.getHospitalById(id!);
      
      if (response.success) {
        setHospital(response.data.hospital);
        setDoctors(response.data.doctors || []);
        setStatistics(response.data.statistics);
      } else {
        setError('Hospital not found');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load hospital details');
    } finally {
      setLoading(false);
    }
  };

  const handleBookConsultation = () => {
    if (selectedDate && selectedTime) {
      // Navigate to payment with booking details
      navigate('/payment', {
        state: {
          hospital: hospital,
          doctor: selectedDoctor,
          date: selectedDate,
          time: selectedTime
        }
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'suspended': return <AlertCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading hospital details...</span>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Hospitals
        </button>
        <div className="flex flex-col items-center justify-center py-24 text-center space-y-6">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center">
            <Lock className="w-10 h-10 text-slate-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Login to View Hospital Details</h2>
            <p className="text-slate-500">Create a free account or sign in to access full hospital information and book appointments.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => navigate('/login', { state: { from: `/hospital/${id}` } })} className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors">Sign In</button>
            <button onClick={() => navigate('/register')} className="px-6 py-3 border border-slate-300 text-slate-700 font-bold rounded-xl hover:bg-slate-100 transition-colors">Register</button>
          </div>
        </div>
      </div>
    );
  }

  if (error || !hospital) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center py-12">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Hospital Not Found</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Hospitals
      </button>

      {/* Hospital Header */}
      <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Hospital Logo */}
          <div className="flex-shrink-0">
            {hospital.logo_url ? (
              <img 
                src={hospital.logo_url} 
                alt={`${hospital.name} Logo`} 
                className="w-32 h-32 rounded-xl object-cover border border-gray-100 shadow-sm" 
              />
            ) : (
              <div className="w-32 h-32 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                {hospital.name.charAt(0)}
              </div>
            )}
          </div>

          {/* Hospital Info */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${getStatusColor(hospital.status)}`}>
                    {getStatusIcon(hospital.status)}
                    {hospital.status.charAt(0).toUpperCase() + hospital.status.slice(1)}
                  </span>
                  {hospital.accreditations && hospital.accreditations.length > 0 && (
                    <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4" />
                      {hospital.accreditations[0]}
                    </span>
                  )}
                </div>
                <h1 className="text-3xl font-black text-gray-900 mb-2">{hospital.name}</h1>
                <div className="flex items-center gap-2 text-gray-600 mb-3">
                  <MapPin className="w-4 h-4" />
                  <span>{hospital.address}, {hospital.city}, {hospital.state}, {hospital.country}</span>
                  {hospital.postal_code && <span>- {hospital.postal_code}</span>}
                </div>
                {hospital.description && (
                  <p className="text-gray-600 mb-4 leading-relaxed">{hospital.description}</p>
                )}
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {isLoggedIn ? (
                <>
                  {hospital.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-blue-600" />
                      <span className="font-medium">Phone:</span>
                      <span>{hospital.phone}</span>
                    </div>
                  )}
                  {hospital.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-blue-600" />
                      <span className="font-medium">Email:</span>
                      <span>{hospital.email}</span>
                    </div>
                  )}
                </>
              ) : (
                <div className="col-span-2 flex items-center gap-2 text-sm text-slate-500 bg-slate-50 p-3 rounded-lg">
                  <Lock className="w-4 h-4" />
                  <span>Sign in to view contact details</span>
                  <button onClick={() => navigate('/login')} className="ml-auto text-emerald-600 font-bold hover:underline">Sign In</button>
                </div>
              )}
              {hospital.website_url && (
                <div className="flex items-center gap-2 text-sm">
                  <Globe className="w-4 h-4 text-blue-600" />
                  <span className="font-medium">Website:</span>
                  <a href={hospital.website_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Visit Website</a>
                </div>
              )}
              {hospital.admin_name && isLoggedIn && (
                <div className="flex items-center gap-2 text-sm">
                  <UserCheck className="w-4 h-4 text-blue-600" />
                  <span className="font-medium">Administrator:</span>
                  <span>{hospital.admin_name}</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mb-6">
              {isLoggedIn ? (
                <>
                  <button onClick={() => setShowBookingModal(true)} className="flex-1 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                    <Calendar className="w-5 h-5" /> Book Consultation
                  </button>
                  <button onClick={() => alert('Quote request sent! We will contact you within 24 hours.')} className="flex-1 px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2">
                    <DollarSign className="w-5 h-5" /> Get Quote
                  </button>
                </>
              ) : (
                <div className="flex-1 p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3">
                  <Lock className="w-5 h-5 text-slate-400 flex-shrink-0" />
                  <span className="text-sm text-slate-600">Sign in to book a consultation</span>
                  <button onClick={() => navigate('/login', { state: { from: `/hospital/${id}` } })} className="ml-auto px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700">Sign In</button>
                </div>
              )}
            </div>

            {/* Hospital Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {hospital.bed_capacity && (
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 flex items-center justify-center gap-1">
                    <Bed className="w-5 h-5" />
                    {hospital.bed_capacity}
                  </div>
                  <div className="text-xs text-gray-500">Beds</div>
                </div>
              )}
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600 flex items-center justify-center gap-1">
                  <Stethoscope className="w-5 h-5" />
                  {doctors.length}
                </div>
                <div className="text-xs text-gray-500">Doctors</div>
              </div>
              {hospital.established_year && (
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{hospital.established_year}</div>
                  <div className="text-xs text-gray-500">Established</div>
                </div>
              )}
              {statistics && (
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600 flex items-center justify-center gap-1">
                    <Users className="w-5 h-5" />
                    {statistics.total_patients}
                  </div>
                  <div className="text-xs text-gray-500">Patients</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Hospital Statistics Dashboard */}
      {statistics && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Hospital Performance
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <div className="text-3xl font-bold text-blue-600 mb-2">{statistics.total_appointments}</div>
              <div className="text-sm text-blue-700 font-medium">Total Appointments</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <div className="text-3xl font-bold text-green-600 mb-2">{statistics.completed_appointments}</div>
              <div className="text-sm text-green-700 font-medium">Completed</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-xl">
              <div className="text-3xl font-bold text-purple-600 mb-2">{statistics.total_patients}</div>
              <div className="text-sm text-purple-700 font-medium">Total Patients</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-xl">
              <div className="text-3xl font-bold text-orange-600 mb-2">{formatCurrency(statistics.total_revenue)}</div>
              <div className="text-sm text-orange-700 font-medium">Revenue</div>
            </div>
          </div>
        </div>
      )}

      {/* Specialties and Services */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Specialties */}
        {hospital.specialties && hospital.specialties.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5" />
              Medical Specialties
            </h2>
            <div className="flex flex-wrap gap-2">
              {hospital.specialties.map((specialty, index) => (
                <span key={index} className="bg-blue-100 text-blue-700 px-3 py-2 rounded-lg text-sm font-semibold">
                  {specialty}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Accreditations */}
        {hospital.accreditations && hospital.accreditations.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Award className="w-5 h-5" />
              Accreditations & Certifications
            </h2>
            <div className="space-y-2">
              {hospital.accreditations.map((accreditation, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  {accreditation}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Doctors Section */}
      {doctors.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Stethoscope className="w-5 h-5" />
            Our Medical Team ({doctors.length} Doctors)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doctor) => (
              <div key={doctor.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  {doctor.profile_picture_url ? (
                    <img 
                      src={doctor.profile_picture_url} 
                      alt={doctor.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
                      {doctor.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-1">{doctor.name}</h3>
                    <p className="text-sm text-blue-600 font-medium mb-1">{doctor.specialization}</p>
                    {doctor.sub_specialization && (
                      <p className="text-xs text-gray-500 mb-2">{doctor.sub_specialization}</p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                      <span>{doctor.experience_years} years exp.</span>
                      {doctor.consultation_fee && (
                        <span className="font-medium text-green-600">
                          {formatCurrency(doctor.consultation_fee)}
                        </span>
                      )}
                    </div>
                    {doctor.qualification && (
                      <p className="text-xs text-gray-600 mb-2">{doctor.qualification}</p>
                    )}
                    {doctor.languages_spoken && doctor.languages_spoken.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {doctor.languages_spoken.map((lang, index) => (
                          <span key={index} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                            {lang}
                          </span>
                        ))}
                      </div>
                    )}
                    <button 
                      onClick={() => {
                        setSelectedDoctor(doctor);
                        setShowBookingModal(true);
                      }}
                      className="w-full mt-2 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Book Appointment
                    </button>
                  </div>
                </div>
                {doctor.bio && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-600 leading-relaxed">{doctor.bio}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contact Information */}
      <div className="bg-gradient-to-r from-blue-50 to-emerald-50 rounded-2xl border border-gray-200 p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Ready to Get Started?</h2>
            <p className="text-gray-600 mb-3">Contact {hospital.name} for consultation and treatment</p>
            <div className="flex flex-col sm:flex-row gap-4 text-sm text-gray-600">
              {hospital.phone && (
                <span className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  {hospital.phone}
                </span>
              )}
              {hospital.email && (
                <span className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {hospital.email}
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setShowBookingModal(true)}
              className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors"
            >
              Book Consultation
            </button>
            <button 
              onClick={() => alert('Medical opinion request sent! We will contact you within 24 hours.')}
              className="px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors"
            >
              Request Opinion
            </button>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Book Consultation
              </h3>
              <button 
                onClick={() => {
                  setShowBookingModal(false);
                  setSelectedDoctor(null);
                  setSelectedDate('');
                  setSelectedTime('');
                }}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Hospital Info */}
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-900">{hospital.name}</h4>
              <p className="text-sm text-gray-600">{hospital.city}, {hospital.state}</p>
            </div>

            {/* Selected Doctor */}
            {selectedDoctor && (
              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900">Dr. {selectedDoctor.name}</h4>
                <p className="text-sm text-blue-700">{selectedDoctor.specialization}</p>
                {selectedDoctor.consultation_fee && (
                  <p className="text-sm text-green-600 font-medium">
                    Consultation Fee: {formatCurrency(selectedDoctor.consultation_fee)}
                  </p>
                )}
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Select Date</label>
                <input 
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Select Time</label>
                <div className="grid grid-cols-2 gap-2">
                  {availableTimes.map(time => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`p-2 text-sm font-semibold rounded-lg border transition-colors ${
                        selectedTime === time 
                          ? 'bg-blue-600 text-white border-blue-600' 
                          : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-xl">
                <h4 className="font-semibold text-blue-900 mb-2">Consultation Details</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• 30-minute consultation</li>
                  <li>• Direct access to hospital specialists</li>
                  <li>• Medical report review included</li>
                  <li>• Treatment plan discussion</li>
                  <li>• Follow-up recommendations</li>
                </ul>
              </div>
              
              <button 
                onClick={handleBookConsultation}
                disabled={!selectedDate || !selectedTime}
                className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
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