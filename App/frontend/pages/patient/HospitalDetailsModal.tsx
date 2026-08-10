import React, { useState, useEffect, useRef } from 'react';
import {
  X, MapPin, ShieldCheck, Phone, Mail, Calendar, DollarSign,
  Stethoscope, Heart, Award, Users, Wrench, ExternalLink,
  CheckCircle, AlertCircle, Clock, Bed, Star, Building2,
} from 'lucide-react';
import { hospitalsAPI, appointmentsAPI } from '../../services/api';
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
  address: string; city: string; state: string; country: string;
  specialties: string[]; accreditations: string[]; description: string;
  logo_url: string; bed_capacity?: number; established_year?: number;
  status: string; admin_name?: string;
  services?: Service[]; doctors?: Doctor[];
  latitude?: number; longitude?: number;
}

interface Service {
  id: number; service_name: string; service_category: string;
  description: string; price: number; currency: string; duration_minutes: number;
}

interface Doctor {
  id: number; name: string; specialization: string; sub_specialization: string;
  qualification: string; experience_years: number; consultation_fee: number;
  languages_spoken: string[]; bio: string; profile_picture_url: string;
}

interface Statistics {
  total_appointments: number; completed_appointments: number; total_patients: number;
}

type BookingType = 'consultation' | 'procedure' | 'follow_up' | 'telemedicine';

interface HospitalDetailsModalProps {
  hospitalId: string;
  isOpen: boolean;
  onClose: () => void;
}

const TIMES = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
];

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(amount);

// ── Map sub-component ────────────────────────────────────────────────────────
const ModalHospitalMap: React.FC<{ hospital: Hospital }> = ({ hospital }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;
    if (mapInstanceRef.current) { mapInstanceRef.current.remove(); mapInstanceRef.current = null; }

    const init = async () => {
      let lat: number | null = null;
      let lng: number | null = null;

      if (hospital.latitude && hospital.longitude) {
        lat = hospital.latitude; lng = hospital.longitude;
      } else {
        try {
          const q = encodeURIComponent(`${hospital.name}, ${hospital.city}, ${hospital.state}, India`);
          const res = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${q}&format=json&limit=1`,
            { headers: { 'Accept-Language': 'en' } }
          );
          const data = await res.json();
          if (data.length > 0) { lat = parseFloat(data[0].lat); lng = parseFloat(data[0].lon); }
        } catch { /* fallback */ }
      }

      if (!lat || !lng || !mapRef.current) return;
      const map = L.map(mapRef.current).setView([lat, lng], 15);
      mapInstanceRef.current = map;
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);
      L.marker([lat, lng])
        .addTo(map)
        .bindPopup(`<b>${hospital.name}</b><br/>${hospital.address || hospital.city}`)
        .openPopup();
    };

    init();
    return () => { if (mapInstanceRef.current) { mapInstanceRef.current.remove(); mapInstanceRef.current = null; } };
  }, [hospital]);

  return (
    <div>
      <div ref={mapRef} className="w-full h-56 rounded-xl overflow-hidden border border-gray-100 z-0" />
      <a
        href={`https://www.openstreetmap.org/search?query=${encodeURIComponent(`${hospital.name}, ${hospital.city}, India`)}`}
        target="_blank" rel="noopener noreferrer"
        className="mt-2 inline-flex items-center gap-1.5 text-xs text-blue-600 hover:underline"
      >
        <ExternalLink className="w-3 h-3" /> Open in OpenStreetMap
      </a>
    </div>
  );
};

// ── Main Modal ───────────────────────────────────────────────────────────────
const HospitalDetailsModal: React.FC<HospitalDetailsModalProps> = ({ hospitalId, isOpen, onClose }) => {
  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'services' | 'doctors' | 'location'>('overview');

  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    date: '', time: '', type: 'consultation' as BookingType, reason: '', notes: '',
  });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    if (isOpen && hospitalId) {
      setActiveTab('overview');
      setShowBookingForm(false);
      setBookingSuccess(false);
      setBookingError('');
      setBookingForm({ date: '', time: '', type: 'consultation', reason: '', notes: '' });
      fetchDetails();
    }
  }, [isOpen, hospitalId]);

  // Prevent body scroll while modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      setError('');
      setHospital(null);
      setStatistics(null);
      const res = await hospitalsAPI.getHospitalById(hospitalId);
      if (res.success) {
        setHospital(res.data.hospital);
        setStatistics(res.data.statistics || null);
      } else {
        setError('Failed to load hospital details.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load hospital details.');
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async () => {
    if (!bookingForm.date || !bookingForm.time || !bookingForm.reason) {
      setBookingError('Please fill in all required fields.');
      return;
    }
    try {
      setBookingLoading(true);
      setBookingError('');
      await appointmentsAPI.createAppointment({
        hospital_id: parseInt(hospitalId),
        appointment_date: bookingForm.date,
        appointment_time: bookingForm.time,
        type: bookingForm.type,
        reason: bookingForm.reason,
        notes: bookingForm.notes,
      });
      setBookingSuccess(true);
      setShowBookingForm(false);
      setBookingForm({ date: '', time: '', type: 'consultation', reason: '', notes: '' });
    } catch (err: any) {
      setBookingError(err.message || 'Failed to book appointment.');
    } finally {
      setBookingLoading(false);
    }
  };

  if (!isOpen) return null;

  const services = hospital?.services || [];
  const doctors = hospital?.doctors || [];

  const groupedServices: Record<string, Service[]> = services.reduce((acc: Record<string, Service[]>, s) => {
    const cat = s.service_category || 'General';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(s);
    return acc;
  }, {} as Record<string, Service[]>);

  const TABS = [
    { key: 'overview' as const, label: 'Overview' },
    { key: 'services' as const, label: `Services${services.length ? ` (${services.length})` : ''}` },
    { key: 'doctors' as const, label: `Doctors${doctors.length ? ` (${doctors.length})` : ''}` },
    { key: 'location' as const, label: 'Location' },
  ];

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white w-full sm:rounded-2xl sm:max-w-3xl max-h-[95dvh] sm:max-h-[90vh] flex flex-col shadow-2xl">
        {/* Sticky header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <h2 className="text-lg font-bold text-gray-900">Hospital Details</h2>
          <button onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors" aria-label="Close">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 p-6 space-y-5">

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3" />
              <span className="text-gray-500">Loading hospital details…</span>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="py-16 text-center space-y-4">
              <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
              <p className="text-red-600 font-semibold">{error}</p>
              <button onClick={fetchDetails}
                className="px-5 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 text-sm font-semibold">
                Try Again
              </button>
            </div>
          )}

          {/* Success banner */}
          {bookingSuccess && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-emerald-700 font-semibold flex items-center gap-2">
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
              Appointment booked successfully! You will receive a confirmation shortly.
            </div>
          )}

          {hospital && (
            <>
              {/* Hero */}
              <div className="flex items-start gap-4">
                {hospital.logo_url ? (
                  <img src={hospital.logo_url} alt={hospital.name}
                    className="w-18 h-18 w-[72px] h-[72px] rounded-xl object-cover border border-gray-100 flex-shrink-0"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                ) : (
                  <div className="w-[72px] h-[72px] rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-2xl font-black flex-shrink-0">
                    {hospital.name.charAt(0)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-emerald-100">
                      <CheckCircle className="w-3 h-3" /> Verified
                    </span>
                    {(hospital.accreditations || []).slice(0, 2).map((a, i) => (
                      <span key={i} className="bg-blue-50 text-blue-700 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-blue-100">
                        <ShieldCheck className="w-3 h-3" /> {a}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-xl font-black text-gray-900 leading-tight">{hospital.name}</h3>
                  <p className="text-gray-500 text-sm flex items-center gap-1.5 mt-1">
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-gray-400" />
                    {[hospital.address, hospital.city, hospital.state, hospital.country].filter(Boolean).join(', ')}
                  </p>
                </div>
              </div>

              {/* Description */}
              {hospital.description && (
                <p className="text-sm text-gray-600 leading-relaxed">{hospital.description}</p>
              )}

              {/* Stats strip */}
              {(hospital.bed_capacity || doctors.length > 0 || hospital.established_year || (statistics && statistics.total_patients > 0)) && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 border-y border-gray-100">
                  {hospital.bed_capacity ? (
                    <div className="text-center">
                      <div className="text-xl font-black text-blue-600 flex items-center justify-center gap-1"><Bed className="w-4 h-4" />{hospital.bed_capacity}</div>
                      <div className="text-xs text-gray-400 mt-0.5">Beds</div>
                    </div>
                  ) : null}
                  {doctors.length > 0 && (
                    <div className="text-center">
                      <div className="text-xl font-black text-emerald-600 flex items-center justify-center gap-1"><Stethoscope className="w-4 h-4" />{doctors.length}</div>
                      <div className="text-xs text-gray-400 mt-0.5">Doctors</div>
                    </div>
                  )}
                  {hospital.established_year ? (
                    <div className="text-center">
                      <div className="text-xl font-black text-purple-600">{hospital.established_year}</div>
                      <div className="text-xs text-gray-400 mt-0.5">Established</div>
                    </div>
                  ) : null}
                  {statistics && statistics.total_patients > 0 && (
                    <div className="text-center">
                      <div className="text-xl font-black text-orange-500 flex items-center justify-center gap-1"><Users className="w-4 h-4" />{statistics.total_patients}</div>
                      <div className="text-xs text-gray-400 mt-0.5">Patients</div>
                    </div>
                  )}
                </div>
              )}

              {/* Contact */}
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                {hospital.phone && <span className="flex items-center gap-1.5"><Phone className="w-4 h-4 text-blue-400" />{hospital.phone}</span>}
                {hospital.email && <span className="flex items-center gap-1.5"><Mail className="w-4 h-4 text-blue-400" />{hospital.email}</span>}
              </div>

              {/* Tabs */}
              <div className="border border-gray-100 rounded-2xl overflow-hidden">
                <div className="flex border-b border-gray-100 overflow-x-auto">
                  {TABS.map(tab => (
                    <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                      className={`px-4 py-3 text-sm font-semibold whitespace-nowrap transition-colors border-b-2 flex-1 ${
                        activeTab === tab.key
                          ? 'border-blue-600 text-blue-600 bg-blue-50/40'
                          : 'border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                      }`}>
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="p-5">
                  {/* Overview */}
                  {activeTab === 'overview' && (
                    <div className="space-y-5">
                      {(hospital.specialties || []).length > 0 && (
                        <div>
                          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                            <Heart className="w-3.5 h-3.5 text-rose-400" /> Specializations
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {hospital.specialties.map((s, i) => (
                              <span key={i} className="bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1.5 rounded-lg text-sm font-medium">{s}</span>
                            ))}
                          </div>
                        </div>
                      )}

                      {(hospital.accreditations || []).length > 0 && (
                        <div>
                          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                            <Award className="w-3.5 h-3.5 text-amber-400" /> Accreditations
                          </h4>
                          <div className="space-y-2">
                            {hospital.accreditations.map((a, i) => (
                              <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                                <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" /> {a}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {!hospital.specialties?.length && !hospital.accreditations?.length && (
                        <p className="text-sm text-gray-400 text-center py-6">No additional details available.</p>
                      )}
                    </div>
                  )}

                  {/* Services */}
                  {activeTab === 'services' && (
                    <div>
                      {services.length === 0 ? (
                        <div className="text-center py-10 text-gray-400">
                          <Wrench className="w-10 h-10 mx-auto mb-2 opacity-30" />
                          <p className="text-sm">No services listed yet.</p>
                        </div>
                      ) : (
                        <div className="space-y-5">
                          {Object.entries(groupedServices).map(([category, items]) => (
                            <div key={category}>
                              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">{category}</h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {items.map((s) => (
                                  <div key={s.id} className="border border-gray-100 rounded-xl p-3 hover:border-violet-200 hover:shadow-sm transition-all">
                                    <p className="font-semibold text-gray-900 text-sm mb-1">{s.service_name}</p>
                                    {s.description && <p className="text-xs text-gray-500 mb-2 line-clamp-2">{s.description}</p>}
                                    <div className="flex items-center justify-between text-xs mt-1">
                                      {s.price ? <span className="font-bold text-emerald-600">{formatCurrency(s.price)}</span> : <span />}
                                      {s.duration_minutes ? (
                                        <span className="text-gray-400 flex items-center gap-1"><Clock className="w-3 h-3" />{s.duration_minutes} min</span>
                                      ) : null}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Doctors */}
                  {activeTab === 'doctors' && (
                    <div>
                      {doctors.length === 0 ? (
                        <div className="text-center py-10 text-gray-400">
                          <Stethoscope className="w-10 h-10 mx-auto mb-2 opacity-30" />
                          <p className="text-sm">No doctors listed yet.</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {doctors.map((doctor) => (
                            <div key={doctor.id} className="border border-gray-100 rounded-xl p-4 hover:border-blue-200 transition-all">
                              <div className="flex items-start gap-3">
                                {doctor.profile_picture_url ? (
                                  <img src={doctor.profile_picture_url} alt={doctor.name}
                                    className="w-11 h-11 rounded-full object-cover flex-shrink-0" />
                                ) : (
                                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                                    {doctor.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                  </div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between gap-2">
                                    <div>
                                      <h4 className="font-bold text-gray-900 text-sm">{doctor.name}</h4>
                                      <p className="text-xs text-blue-600 font-medium">{doctor.specialization}</p>
                                      {doctor.sub_specialization && <p className="text-xs text-gray-400">{doctor.sub_specialization}</p>}
                                    </div>
                                    {doctor.consultation_fee > 0 && (
                                      <span className="text-xs font-bold text-emerald-600 flex-shrink-0">{formatCurrency(doctor.consultation_fee)}</span>
                                    )}
                                  </div>
                                  <div className="flex flex-wrap gap-2 mt-1.5 text-xs text-gray-500">
                                    {doctor.experience_years > 0 && <span>{doctor.experience_years} yrs exp.</span>}
                                    {doctor.qualification && <span>{doctor.qualification}</span>}
                                  </div>
                                  {doctor.languages_spoken?.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-1.5">
                                      {doctor.languages_spoken.map((lang, i) => (
                                        <span key={i} className="bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded text-xs">{lang}</span>
                                      ))}
                                    </div>
                                  )}
                                  {doctor.bio && (
                                    <p className="text-xs text-gray-500 mt-2 leading-relaxed line-clamp-2">{doctor.bio}</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Location */}
                  {activeTab === 'location' && (
                    <div className="space-y-3">
                      <div className="flex items-start gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                        <span>{[hospital.address, hospital.city, hospital.state, hospital.country].filter(Boolean).join(', ')}</span>
                      </div>
                      <ModalHospitalMap hospital={hospital} />
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Sticky footer — booking actions or booking form */}
        {hospital && (
          <div className="border-t border-gray-100 px-6 py-4 flex-shrink-0 space-y-4">
            {!showBookingForm ? (
              <div className="flex gap-3">
                <button onClick={() => { setShowBookingForm(true); setBookingSuccess(false); }}
                  className="flex-1 bg-blue-600 text-white font-semibold py-2.5 rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm">
                  <Calendar className="w-4 h-4" /> Book Appointment
                </button>
                <button onClick={() => alert('Quote request sent! We will contact you within 24 hours.')}
                  className="flex-1 bg-emerald-600 text-white font-semibold py-2.5 rounded-xl hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 text-sm">
                  <DollarSign className="w-4 h-4" /> Get Quote
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-500" /> Book Appointment
                  </h4>
                  <button onClick={() => { setShowBookingForm(false); setBookingError(''); }}
                    className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                </div>

                {bookingError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" /> {bookingError}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Date *</label>
                    <input type="date" value={bookingForm.date}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={e => setBookingForm({ ...bookingForm, date: e.target.value })}
                      className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Time *</label>
                    <select value={bookingForm.time}
                      onChange={e => setBookingForm({ ...bookingForm, time: e.target.value })}
                      className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm">
                      <option value="">Choose time</option>
                      {TIMES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Type</label>
                  <select value={bookingForm.type}
                    onChange={e => setBookingForm({ ...bookingForm, type: e.target.value as BookingType })}
                    className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm">
                    <option value="consultation">Consultation</option>
                    <option value="procedure">Procedure</option>
                    <option value="follow_up">Follow-up</option>
                    <option value="telemedicine">Telemedicine</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Reason for Visit *</label>
                  <textarea value={bookingForm.reason} rows={2}
                    onChange={e => setBookingForm({ ...bookingForm, reason: e.target.value })}
                    placeholder="Describe your symptoms or reason for the appointment"
                    className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-none" />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Notes (Optional)</label>
                  <textarea value={bookingForm.notes} rows={2}
                    onChange={e => setBookingForm({ ...bookingForm, notes: e.target.value })}
                    placeholder="Any additional information"
                    className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-none" />
                </div>

                <button onClick={handleBook}
                  disabled={!bookingForm.date || !bookingForm.time || !bookingForm.reason || bookingLoading}
                  className="w-full py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors text-sm">
                  {bookingLoading ? 'Booking…' : 'Confirm Booking'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HospitalDetailsModal;
