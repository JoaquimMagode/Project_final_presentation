import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  MapPin, ShieldCheck, Phone, Mail, Users, Award, X, Calendar,
  DollarSign, Stethoscope, Heart, Globe, CheckCircle, AlertCircle,
  Bed, UserCheck, ArrowLeft, Lock, Wrench, ExternalLink
} from 'lucide-react';
import { hospitalsAPI } from '../services/api';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface Hospital {
  id: number; name: string; email: string; phone: string;
  address: string; city: string; state: string; country: string; postal_code: string;
  latitude: number; longitude: number; specialties: string[]; accreditations: string[];
  commission_rate: number; logo_url: string; description: string; website_url: string;
  established_year: number; bed_capacity: number; status: string;
  admin_name: string; admin_email: string; created_at: string; updated_at: string;
  services?: Service[];
}

interface Service {
  id: number; service_name: string; service_category: string;
  description: string; price: number; currency: string; duration_minutes: number;
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
  const [toast, setToast] = useState('');
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  const availableTimes = ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'];

  useEffect(() => { if (id) fetchHospitalDetails(); }, [id]);

  // Auto-dismiss toast notifications
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(''), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  // Close booking modal on Escape key
  useEffect(() => {
    if (!showBookingModal) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeBookingModal(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [showBookingModal]);

  const closeBookingModal = () => {
    setShowBookingModal(false);
    setSelectedDoctor(null);
    setSelectedDate('');
    setSelectedTime('');
  };

  // Geocode hospital address using Nominatim (OpenStreetMap)
  const geocodeAddress = async (h: Hospital): Promise<[number, number] | null> => {
    if (h.latitude && h.longitude) return [h.latitude, h.longitude];
    const query = encodeURIComponent(`${h.name}, ${h.city}, ${h.state}, India`);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`, {
        headers: { 'Accept-Language': 'en' }
      });
      const data = await res.json();
      if (data.length > 0) return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
    } catch {}
    return null;
  };

  useEffect(() => {
    if (!hospital || !mapRef.current || !isLoggedIn) return;
    // Destroy previous map instance
    if (mapInstanceRef.current) { mapInstanceRef.current.remove(); mapInstanceRef.current = null; }

    geocodeAddress(hospital).then(coords => {
      if (!coords || !mapRef.current) return;
      const [lat, lng] = coords;
      const map = L.map(mapRef.current).setView([lat, lng], 15);
      mapInstanceRef.current = map;
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);
      L.marker([lat, lng])
        .addTo(map)
        .bindPopup(`<b>${hospital.name}</b><br/>${hospital.address || hospital.city}`)
        .openPopup();
    });

    return () => { if (mapInstanceRef.current) { mapInstanceRef.current.remove(); mapInstanceRef.current = null; } };
  }, [hospital, isLoggedIn]);

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
    <div className="max-w-5xl mx-auto p-6 space-y-6" aria-busy="true" aria-label="Loading hospital details">
      <div className="skeleton h-4 w-32 rounded-full" />
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="h-2 bg-slate-100" />
        <div className="p-8">
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="skeleton w-24 h-24 rounded-xl shrink-0" />
            <div className="flex-1 space-y-3">
              <div className="skeleton h-5 w-40 rounded-full" />
              <div className="skeleton h-7 w-2/3" />
              <div className="skeleton h-4 w-1/2" />
              <div className="skeleton h-16 w-full max-w-2xl" />
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-100">
            {[0, 1, 2, 3].map(i => <div key={i} className="skeleton h-16 rounded-xl" />)}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="skeleton h-40 rounded-2xl" />
        <div className="skeleton h-40 rounded-2xl" />
      </div>
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
          <button onClick={() => navigate('/login', { state: { from: `/hospital/${id}` } })} className="px-6 py-2.5 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors">Sign In</button>
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
      <button onClick={() => navigate(-1)} className="px-5 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">Go Back</button>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6 animate-in">
      {/* Back */}
      <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 text-sm font-medium transition-colors" aria-label="Back to hospitals list">
        <ArrowLeft className="w-4 h-4" /> Back to Hospitals
      </button>

      {/* Hero Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Top accent bar */}
        <div className="h-2 bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-500" />

        <div className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Logo */}
            <div className="flex-shrink-0 mx-auto sm:mx-0">
              {hospital.logo_url ? (
                <img src={hospital.logo_url} alt={`${hospital.name} logo`} className="w-24 h-24 rounded-2xl object-cover border border-slate-100 shadow-sm ring-1 ring-slate-100" />
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-3xl font-black shadow-sm">
                  {hospital.name.charAt(0)}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-3">
                {hospital.status === 'active' && (
                  <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full inline-flex items-center gap-1 border border-emerald-100">
                    <CheckCircle className="w-3.5 h-3.5" /> Verified
                  </span>
                )}
                {hospital.accreditations?.[0] && (
                  <span className="bg-teal-50 text-teal-700 text-xs font-bold px-2.5 py-1 rounded-full inline-flex items-center gap-1 border border-teal-100">
                    <ShieldCheck className="w-3.5 h-3.5" /> {hospital.accreditations[0]}
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-1.5 tracking-tight">{hospital.name}</h1>
              <p className="text-slate-500 text-sm flex items-center justify-center sm:justify-start gap-1.5 mb-3">
                <MapPin className="w-4 h-4 flex-shrink-0 text-slate-400" />
                <span>{hospital.address}, {hospital.city}, {hospital.state}, {hospital.country}{hospital.postal_code && ` - ${hospital.postal_code}`}</span>
              </p>
              {hospital.description && (
                <p className="text-slate-600 text-sm leading-relaxed mb-4 max-w-2xl mx-auto sm:mx-0">{hospital.description}</p>
              )}

              {/* Contact row */}
              <div className="flex flex-wrap justify-center sm:justify-start gap-x-4 gap-y-2 text-sm text-slate-600 mb-5">
                {hospital.phone && (
                  <a href={`tel:${hospital.phone}`} className="flex items-center gap-1.5 hover:text-emerald-700 transition-colors"><Phone className="w-4 h-4 text-emerald-500" />{hospital.phone}</a>
                )}
                {hospital.email && (
                  <a href={`mailto:${hospital.email}`} className="flex items-center gap-1.5 hover:text-emerald-700 transition-colors"><Mail className="w-4 h-4 text-emerald-500" />{hospital.email}</a>
                )}
                {hospital.website_url && (
                  <a href={hospital.website_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-emerald-600 hover:underline">
                    <Globe className="w-4 h-4" /> Website
                  </a>
                )}
                {hospital.admin_name && (
                  <span className="flex items-center gap-1.5"><UserCheck className="w-4 h-4 text-emerald-500" />{hospital.admin_name}</span>
                )}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap justify-center sm:justify-start gap-3">
                <button onClick={() => setShowBookingModal(true)} className="px-5 py-2.5 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 shadow-sm hover:shadow transition-all flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4" /> Book Consultation
                </button>
                <button onClick={() => setToast('Quote request sent — we will contact you within 24 hours.')} className="px-5 py-2.5 bg-white text-slate-800 border border-slate-200 font-semibold rounded-xl hover:border-emerald-300 hover:text-emerald-700 transition-colors flex items-center gap-2 text-sm">
                  <DollarSign className="w-4 h-4" /> Get Quote
                </button>
              </div>
            </div>
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t border-slate-100">
            {hospital.bed_capacity && (
              <div className="flex flex-col items-center gap-1 bg-slate-50 rounded-xl py-3 px-2">
                <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center"><Bed className="w-5 h-5 text-emerald-600" /></div>
                <div className="text-xl font-black text-slate-900 leading-none">{hospital.bed_capacity}</div>
                <div className="text-[11px] text-slate-400 font-medium uppercase tracking-wide">Beds</div>
              </div>
            )}
            {doctors.length > 0 && (
              <div className="flex flex-col items-center gap-1 bg-slate-50 rounded-xl py-3 px-2">
                <div className="w-9 h-9 rounded-lg bg-teal-100 flex items-center justify-center"><Stethoscope className="w-5 h-5 text-teal-600" /></div>
                <div className="text-xl font-black text-slate-900 leading-none">{doctors.length}</div>
                <div className="text-[11px] text-slate-400 font-medium uppercase tracking-wide">Doctors</div>
              </div>
            )}
            {hospital.established_year && (
              <div className="flex flex-col items-center gap-1 bg-slate-50 rounded-xl py-3 px-2">
                <div className="w-9 h-9 rounded-lg bg-violet-100 flex items-center justify-center"><Award className="w-5 h-5 text-violet-600" /></div>
                <div className="text-xl font-black text-slate-900 leading-none">{hospital.established_year}</div>
                <div className="text-[11px] text-slate-400 font-medium uppercase tracking-wide">Established</div>
              </div>
            )}
            {statistics?.total_patients > 0 && (
              <div className="flex flex-col items-center gap-1 bg-slate-50 rounded-xl py-3 px-2">
                <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center"><Users className="w-5 h-5 text-amber-600" /></div>
                <div className="text-xl font-black text-slate-900 leading-none">{statistics.total_patients}</div>
                <div className="text-[11px] text-slate-400 font-medium uppercase tracking-wide">Patients</div>
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
              <Heart className="w-4 h-4 text-rose-500" /> Medical Specializations
            </h2>
            <div className="flex flex-wrap gap-2">
              {hospital.specialties.map((s, i) => (
                <span key={i} className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1.5 rounded-lg text-sm font-medium">{s}</span>
              ))}
            </div>
          </div>
        )}

        {hospital.accreditations?.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" /> Accreditations & Certifications
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

      {/* Services */}
      {hospital.services && hospital.services.length > 0 && (() => {
        const grouped = hospital.services.reduce((acc: Record<string, Service[]>, s: Service) => {
          const cat = s.service_category || 'General';
          if (!acc[cat]) acc[cat] = [];
          acc[cat].push(s);
          return acc;
        }, {});
        return (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-base font-bold text-gray-800 mb-5 flex items-center gap-2">
              <Wrench className="w-4 h-4 text-violet-500" /> Services & Procedures
              <span className="ml-1 text-xs font-normal text-gray-400">({hospital.services!.length} services)</span>
            </h2>
            <div className="space-y-5">
              {Object.entries(grouped).map(([category, services]: [string, Service[]]) => (
                <div key={category}>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{category}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {services.map((s: Service) => (
                      <div key={s.id} className="border border-gray-100 rounded-xl p-3 hover:border-violet-200 transition-colors">
                        <p className="font-semibold text-gray-900 text-sm mb-1">{s.service_name}</p>
                        {s.description && <p className="text-xs text-gray-500 mb-2 line-clamp-2">{s.description}</p>}
                        <div className="flex items-center justify-between text-xs">
                          {s.price ? (
                            <span className="font-bold text-emerald-600">{formatCurrency(s.price)}</span>
                          ) : <span />}
                          {s.duration_minutes && (
                            <span className="text-gray-400">{s.duration_minutes} min</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* Map */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-red-500" /> Location & Directions
        </h2>
        <p className="text-sm text-gray-500 mb-3 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5" />
          {hospital.address}, {hospital.city}, {hospital.state}, {hospital.country}
          {hospital.postal_code && ` - ${hospital.postal_code}`}
        </p>
        <div ref={mapRef} className="w-full h-72 rounded-xl overflow-hidden border border-gray-100 z-0" />
        <a
          href={`https://www.openstreetmap.org/search?query=${encodeURIComponent(`${hospital.name}, ${hospital.city}, India`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1.5 text-sm text-emerald-600 hover:underline"
        >
          <ExternalLink className="w-3.5 h-3.5" /> Open in OpenStreetMap
        </a>
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
              <div key={doctor.id} className="border border-slate-100 rounded-xl p-4 hover:border-emerald-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                <div className="flex items-start gap-3 mb-3">
                  {doctor.profile_picture_url ? (
                    <img src={doctor.profile_picture_url} alt={doctor.name} className="w-12 h-12 rounded-full object-cover flex-shrink-0 ring-1 ring-slate-100" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {doctor.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  )}
                  <div className="min-w-0">
                    <h3 className="font-bold text-slate-900 text-sm truncate">{doctor.name}</h3>
                    <p className="text-xs text-emerald-600 font-medium">{doctor.specialization}</p>
                    {doctor.sub_specialization && <p className="text-xs text-slate-400">{doctor.sub_specialization}</p>}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                  <span>{doctor.experience_years} yrs exp.</span>
                  {doctor.consultation_fee && <span className="font-semibold text-emerald-600">{formatCurrency(doctor.consultation_fee)}</span>}
                </div>

                {doctor.qualification && <p className="text-xs text-slate-500 mb-2">{doctor.qualification}</p>}

                {doctor.languages_spoken?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {doctor.languages_spoken.map((lang, i) => (
                      <span key={i} className="bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded text-xs">{lang}</span>
                    ))}
                  </div>
                )}

                <button
                  onClick={() => { setSelectedDoctor(doctor); setShowBookingModal(true); }}
                  className="w-full py-2 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
                  aria-label={`Book an appointment with ${doctor.name}`}
                >
                  Book Appointment
                </button>

                {doctor.bio && (
                  <p className="text-xs text-slate-500 mt-3 pt-3 border-t border-slate-100 leading-relaxed line-clamp-2">{doctor.bio}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTA Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 text-white shadow-sm">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <h2 className="text-lg font-bold mb-1">Ready to Get Started?</h2>
            <p className="text-emerald-50 text-sm">Contact {hospital.name} for consultation and treatment planning.</p>
            <div className="flex flex-wrap justify-center sm:justify-start gap-4 mt-2 text-sm text-emerald-50">
              {hospital.phone && <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" />{hospital.phone}</span>}
              {hospital.email && <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" />{hospital.email}</span>}
            </div>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <button onClick={() => setShowBookingModal(true)} className="px-5 py-2.5 bg-white text-emerald-700 font-bold rounded-xl hover:bg-emerald-50 transition-colors text-sm">
              Book Consultation
            </button>
            <button onClick={() => setToast('Medical opinion request sent — we will contact you within 24 hours.')} className="px-5 py-2.5 bg-emerald-500/40 text-white font-bold rounded-xl hover:bg-emerald-500/60 transition-colors text-sm border border-white/30">
              Request Opinion
            </button>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 fade-in"
          role="dialog"
          aria-modal="true"
          aria-labelledby="booking-modal-title"
          onClick={closeBookingModal}
        >
          <div className="bg-white rounded-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 id="booking-modal-title" className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-500" /> Book Consultation
              </h3>
              <button onClick={closeBookingModal} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors" aria-label="Close booking dialog">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="mb-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <p className="font-semibold text-slate-900 text-sm">{hospital.name}</p>
              <p className="text-xs text-slate-500">{hospital.city}, {hospital.state}</p>
            </div>

            {selectedDoctor && (
              <div className="mb-4 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                <p className="font-semibold text-emerald-900 text-sm">Dr. {selectedDoctor.name}</p>
                <p className="text-xs text-emerald-600">{selectedDoctor.specialization}</p>
                {selectedDoctor.consultation_fee && (
                  <p className="text-xs text-emerald-700 font-semibold mt-0.5">Fee: {formatCurrency(selectedDoctor.consultation_fee)}</p>
                )}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="booking-date" className="block text-sm font-semibold text-slate-700 mb-1.5">Select Date</label>
                <input id="booking-date" type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm" />
              </div>

              <div>
                <span className="block text-sm font-semibold text-slate-700 mb-1.5">Select Time</span>
                <div className="grid grid-cols-3 gap-2">
                  {availableTimes.map(time => (
                    <button key={time} onClick={() => setSelectedTime(time)}
                      aria-pressed={selectedTime === time}
                      className={`py-2 text-xs font-semibold rounded-lg border transition-colors ${selectedTime === time ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-300'}`}>
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 text-sm text-emerald-700 space-y-1">
                <p className="font-semibold text-emerald-900 mb-2">What's included</p>
                {['30-minute consultation', 'Direct access to specialists', 'Medical report review', 'Treatment plan discussion'].map(item => (
                  <p key={item} className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />{item}</p>
                ))}
              </div>

              <button onClick={handleBookConsultation} disabled={!selectedDate || !selectedTime}
                className="w-full py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed transition-colors text-sm">
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast notification */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 fade-in" role="status" aria-live="polite">
          <div className="flex items-center gap-2.5 bg-slate-900 text-white text-sm font-medium px-4 py-3 rounded-xl shadow-lg max-w-md">
            <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{toast}</span>
            <button onClick={() => setToast('')} className="ml-2 text-slate-400 hover:text-white transition-colors" aria-label="Dismiss notification">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HospitalDetail;
