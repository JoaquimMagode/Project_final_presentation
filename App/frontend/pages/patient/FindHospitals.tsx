import React, { useState, useEffect, useRef } from 'react';
import {
  Search, MapPin, ShieldCheck, Building2, AlertCircle, ArrowLeft,
  Phone, Mail, Calendar, DollarSign, Stethoscope, Heart, Award,
  Users, Wrench, ExternalLink, CheckCircle, ChevronDown, X, Clock,
  Bed, Star
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

const INDIAN_CITIES = [
  'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata',
  'Ahmedabad', 'New Delhi', 'Mohali', 'Chandigarh', 'Jaipur', 'Surat',
];

const PROCEDURES = [
  'Cardiology', 'Orthopedics', 'Neurology', 'Oncology', 'Urology',
  'Dermatology', 'Gastroenterology', 'Nephrology', 'Pulmonology',
  'Endocrinology', 'Ophthalmology', 'ENT', 'Obstetrics & Gynecology',
  'Cardiac Surgery', 'Neurosurgery', 'Spine Surgery', 'Joint Replacement',
  'Kidney Transplant', 'Liver Transplant', 'IVF Treatment',
];

const TIMES = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
];

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(amount);

// ── Map sub-component ────────────────────────────────────────────────────────
const HospitalMap: React.FC<{ hospital: Hospital }> = ({ hospital }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;
    if (mapInstanceRef.current) { mapInstanceRef.current.remove(); mapInstanceRef.current = null; }

    const init = async () => {
      let lat: number | null = null;
      let lng: number | null = null;

      if (hospital.latitude && hospital.longitude) {
        lat = hospital.latitude;
        lng = hospital.longitude;
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
      <div ref={mapRef} className="w-full h-64 rounded-xl overflow-hidden border border-gray-100 z-0" />
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

// ── Hospital Detail View ─────────────────────────────────────────────────────
interface DetailViewProps {
  hospital: Hospital;
  statistics: Statistics | null;
  onBack: () => void;
}

const HospitalDetailView: React.FC<DetailViewProps> = ({ hospital, statistics, onBack }) => {
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    date: '', time: '', type: 'consultation' as BookingType, reason: '', notes: '',
  });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'services' | 'doctors' | 'location'>('overview');

  const services = hospital.services || [];
  const doctors = hospital.doctors || [];

  const groupedServices: Record<string, Service[]> = services.reduce((acc: Record<string, Service[]>, s) => {
    const cat = s.service_category || 'General';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(s);
    return acc;
  }, {} as Record<string, Service[]>);

  const handleBook = async () => {
    if (!bookingForm.date || !bookingForm.time || !bookingForm.reason) {
      setBookingError('Please fill in all required fields.');
      return;
    }
    try {
      setBookingLoading(true);
      setBookingError('');
      await appointmentsAPI.createAppointment({
        hospital_id: hospital.id,
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

  const TABS = [
    { key: 'overview', label: 'Overview' },
    { key: 'services', label: `Services${services.length ? ` (${services.length})` : ''}` },
    { key: 'doctors', label: `Doctors${doctors.length ? ` (${doctors.length})` : ''}` },
    { key: 'location', label: 'Location' },
  ] as const;

  return (
    <div className="space-y-5">
      {/* Back */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Results
      </button>

      {/* Success banner */}
      {bookingSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-emerald-700 font-semibold flex items-center gap-2">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          Appointment booked successfully! You will receive a confirmation shortly.
        </div>
      )}

      {/* Hero Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-blue-500 via-blue-600 to-emerald-500" />
        <div className="p-6">
          <div className="flex items-start gap-5">
            {/* Logo */}
            {hospital.logo_url ? (
              <img src={hospital.logo_url} alt={hospital.name}
                className="w-20 h-20 rounded-xl object-cover border border-gray-100 shadow-sm flex-shrink-0"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            ) : (
              <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-3xl font-black shadow-sm flex-shrink-0">
                {hospital.name.charAt(0)}
              </div>
            )}

            <div className="flex-1 min-w-0">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 border border-emerald-100">
                  <CheckCircle className="w-3.5 h-3.5" /> Verified
                </span>
                {(hospital.accreditations || []).slice(0, 2).map((a, i) => (
                  <span key={i} className="bg-blue-50 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 border border-blue-100">
                    <ShieldCheck className="w-3.5 h-3.5" /> {a}
                  </span>
                ))}
              </div>

              <h1 className="text-xl font-black text-gray-900 mb-1">{hospital.name}</h1>
              <p className="text-gray-500 text-sm flex items-center gap-1.5 mb-2">
                <MapPin className="w-4 h-4 flex-shrink-0 text-gray-400" />
                {[hospital.address, hospital.city, hospital.state, hospital.country].filter(Boolean).join(', ')}
              </p>
              {hospital.description && (
                <p className="text-gray-600 text-sm leading-relaxed">{hospital.description}</p>
              )}
            </div>
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5 pt-5 border-t border-gray-100">
            {hospital.bed_capacity ? (
              <div className="text-center">
                <div className="text-xl font-black text-blue-600 flex items-center justify-center gap-1">
                  <Bed className="w-4 h-4" />{hospital.bed_capacity}
                </div>
                <div className="text-xs text-gray-400 mt-0.5">Beds</div>
              </div>
            ) : null}
            {doctors.length > 0 && (
              <div className="text-center">
                <div className="text-xl font-black text-emerald-600 flex items-center justify-center gap-1">
                  <Stethoscope className="w-4 h-4" />{doctors.length}
                </div>
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
                <div className="text-xl font-black text-orange-500 flex items-center justify-center gap-1">
                  <Users className="w-4 h-4" />{statistics.total_patients}
                </div>
                <div className="text-xs text-gray-400 mt-0.5">Patients Served</div>
              </div>
            )}
          </div>

          {/* Contact row */}
          <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-gray-100 text-sm text-gray-600">
            {hospital.phone && (
              <span className="flex items-center gap-1.5"><Phone className="w-4 h-4 text-blue-400" />{hospital.phone}</span>
            )}
            {hospital.email && (
              <span className="flex items-center gap-1.5"><Mail className="w-4 h-4 text-blue-400" />{hospital.email}</span>
            )}
          </div>

          {/* CTA buttons */}
          <div className="flex gap-3 mt-4">
            <button onClick={() => { setShowBookingForm(true); setBookingSuccess(false); }}
              className="flex-1 bg-blue-600 text-white font-semibold py-2.5 rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm">
              <Calendar className="w-4 h-4" /> Book Appointment
            </button>
            <button onClick={() => alert('Quote request sent! We will contact you within 24 hours.')}
              className="flex-1 bg-emerald-600 text-white font-semibold py-2.5 rounded-xl hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 text-sm">
              <DollarSign className="w-4 h-4" /> Get Quote
            </button>
          </div>
        </div>
      </div>

      {/* Booking Form */}
      {showBookingForm && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-500" /> Book Appointment
            </h3>
            <button onClick={() => { setShowBookingForm(false); setBookingError(''); }}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          {bookingError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" /> {bookingError}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Date *</label>
              <input type="date" value={bookingForm.date}
                min={new Date().toISOString().split('T')[0]}
                onChange={e => setBookingForm({ ...bookingForm, date: e.target.value })}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Time *</label>
              <select value={bookingForm.time}
                onChange={e => setBookingForm({ ...bookingForm, time: e.target.value })}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm">
                <option value="">Choose time</option>
                {TIMES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Appointment Type</label>
            <select value={bookingForm.type}
              onChange={e => setBookingForm({ ...bookingForm, type: e.target.value as BookingType })}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm">
              <option value="consultation">Consultation</option>
              <option value="procedure">Procedure</option>
              <option value="follow_up">Follow-up</option>
              <option value="telemedicine">Telemedicine</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Reason for Visit *</label>
            <textarea value={bookingForm.reason} rows={3}
              onChange={e => setBookingForm({ ...bookingForm, reason: e.target.value })}
              placeholder="Describe your symptoms or reason for the appointment"
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-none" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Additional Notes (Optional)</label>
            <textarea value={bookingForm.notes} rows={2}
              onChange={e => setBookingForm({ ...bookingForm, notes: e.target.value })}
              placeholder="Any additional information for the hospital"
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-none" />
          </div>

          <div className="flex gap-3">
            <button onClick={handleBook}
              disabled={!bookingForm.date || !bookingForm.time || !bookingForm.reason || bookingLoading}
              className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors text-sm">
              {bookingLoading ? 'Booking…' : 'Confirm Booking'}
            </button>
            <button onClick={() => { setShowBookingForm(false); setBookingError(''); }}
              className="px-5 py-3 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors text-sm">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex border-b border-gray-100 overflow-x-auto">
          {TABS.map(tab => (
            <button key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-3.5 text-sm font-semibold whitespace-nowrap transition-colors border-b-2 ${
                activeTab === tab.key
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* ── Overview tab ── */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Specializations */}
              {(hospital.specialties || []).length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <Heart className="w-4 h-4 text-rose-500" /> Medical Specializations
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {hospital.specialties.map((s, i) => (
                      <span key={i} className="bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1.5 rounded-lg text-sm font-medium">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Accreditations */}
              {(hospital.accreditations || []).length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-500" /> Accreditations & Certifications
                  </h3>
                  <div className="space-y-2">
                    {hospital.accreditations.map((a, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" /> {a}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* About */}
              {hospital.description && (
                <div>
                  <h3 className="text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-gray-400" /> About
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{hospital.description}</p>
                </div>
              )}
            </div>
          )}

          {/* ── Services tab ── */}
          {activeTab === 'services' && (
            <div>
              {services.length === 0 ? (
                <div className="text-center py-10 text-gray-400">
                  <Wrench className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No services listed yet.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {Object.entries(groupedServices).map(([category, items]) => (
                    <div key={category}>
                      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">{category}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {items.map((s) => (
                          <div key={s.id} className="border border-gray-100 rounded-xl p-4 hover:border-violet-200 hover:shadow-sm transition-all">
                            <p className="font-semibold text-gray-900 text-sm mb-1">{s.service_name}</p>
                            {s.description && (
                              <p className="text-xs text-gray-500 mb-2 line-clamp-2">{s.description}</p>
                            )}
                            <div className="flex items-center justify-between text-xs mt-2">
                              {s.price ? (
                                <span className="font-bold text-emerald-600">{formatCurrency(s.price)}</span>
                              ) : <span />}
                              {s.duration_minutes ? (
                                <span className="text-gray-400 flex items-center gap-1">
                                  <Clock className="w-3 h-3" />{s.duration_minutes} min
                                </span>
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

          {/* ── Doctors tab ── */}
          {activeTab === 'doctors' && (
            <div>
              {doctors.length === 0 ? (
                <div className="text-center py-10 text-gray-400">
                  <Stethoscope className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No doctors listed yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {doctors.map((doctor) => (
                    <div key={doctor.id} className="border border-gray-100 rounded-xl p-4 hover:border-blue-200 hover:shadow-sm transition-all">
                      <div className="flex items-start gap-3 mb-3">
                        {doctor.profile_picture_url ? (
                          <img src={doctor.profile_picture_url} alt={doctor.name}
                            className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                            {doctor.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </div>
                        )}
                        <div className="min-w-0">
                          <h3 className="font-bold text-gray-900 text-sm truncate">{doctor.name}</h3>
                          <p className="text-xs text-blue-600 font-medium">{doctor.specialization}</p>
                          {doctor.sub_specialization && (
                            <p className="text-xs text-gray-400">{doctor.sub_specialization}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                        {doctor.experience_years > 0 && <span>{doctor.experience_years} yrs exp.</span>}
                        {doctor.consultation_fee > 0 && (
                          <span className="font-semibold text-emerald-600">{formatCurrency(doctor.consultation_fee)}</span>
                        )}
                      </div>
                      {doctor.qualification && (
                        <p className="text-xs text-gray-500 mb-2">{doctor.qualification}</p>
                      )}
                      {doctor.languages_spoken?.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {doctor.languages_spoken.map((lang, i) => (
                            <span key={i} className="bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded text-xs">{lang}</span>
                          ))}
                        </div>
                      )}
                      {doctor.bio && (
                        <p className="text-xs text-gray-500 mt-3 pt-3 border-t border-gray-100 leading-relaxed line-clamp-2">{doctor.bio}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── Location tab ── */}
          {activeTab === 'location' && (
            <div className="space-y-3">
              <div className="flex items-start gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <span>{[hospital.address, hospital.city, hospital.state, hospital.country].filter(Boolean).join(', ')}</span>
              </div>
              <HospitalMap hospital={hospital} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Hospital List Card ────────────────────────────────────────────────────────
const HospitalListCard: React.FC<{ hospital: Hospital; onViewDetails: (id: number) => void }> = ({ hospital, onViewDetails }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden">
    <div className="p-5 flex gap-4">
      {hospital.logo_url ? (
        <img src={hospital.logo_url} alt={hospital.name}
          className="w-16 h-16 rounded-xl object-cover border border-gray-100 flex-shrink-0"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
      ) : (
        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-2xl font-black flex-shrink-0">
          {hospital.name.charAt(0)}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap gap-1 mb-1.5">
          {(hospital.accreditations || []).slice(0, 2).map((a, i) => (
            <span key={i} className="bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-wide px-2 py-0.5 rounded-full flex items-center gap-0.5 border border-emerald-100">
              <ShieldCheck className="w-2.5 h-2.5" /> {a}
            </span>
          ))}
        </div>
        <h3 className="font-bold text-gray-900 leading-tight truncate">{hospital.name}</h3>
        <p className="text-gray-400 text-xs flex items-center gap-1 mt-0.5">
          <MapPin className="w-3 h-3" /> {hospital.city}{hospital.state ? `, ${hospital.state}` : ''}
        </p>
      </div>
    </div>
    {(hospital.specialties || []).length > 0 && (
      <div className="px-5 pb-3">
        <div className="flex flex-wrap gap-1">
          {hospital.specialties.slice(0, 4).map((s, i) => (
            <span key={i} className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-md">{s}</span>
          ))}
          {hospital.specialties.length > 4 && (
            <span className="bg-slate-100 text-slate-400 text-[10px] font-bold px-2 py-0.5 rounded-md">+{hospital.specialties.length - 4} more</span>
          )}
        </div>
      </div>
    )}
    <div className="px-5 pb-4 flex items-center justify-between border-t border-gray-50 pt-3">
      <div className="flex items-center gap-1.5 text-xs text-gray-500">
        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
        <span className="font-semibold text-gray-700">Accredited</span>
      </div>
      <button
        onClick={() => onViewDetails(hospital.id)}
        className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-blue-600 transition-colors">
        View Details
      </button>
    </div>
  </div>
);

// ── Main FindHospitals page ───────────────────────────────────────────────────
const FindHospitals: React.FC = () => {
  const [city, setCity] = useState('');
  const [procedure, setProcedure] = useState('');
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [filteredHospitals, setFilteredHospitals] = useState<Hospital[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Detail state
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState('');

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await hospitalsAPI.getHospitals({ limit: 200 });
      if (res.success) setHospitals(res.data.hospitals || []);
      else setError('Failed to load hospitals');
    } catch (err: any) {
      setError(err.message || 'Failed to load hospitals');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    try {
      setLoading(true);
      setError('');
      const res = (city || procedure)
        ? await hospitalsAPI.searchHospitals({
            ...(city && { city }),
            ...(procedure && { specialization: procedure }),
          })
        : await hospitalsAPI.getHospitals({ limit: 200 });
      if (res.success) setFilteredHospitals(res.data.hospitals || []);
      else { setError('Failed to search hospitals'); setFilteredHospitals([]); }
    } catch (err: any) {
      setError(err.message || 'Failed to search hospitals');
      setFilteredHospitals([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (hospitalId: number) => {
    setDetailLoading(true);
    setDetailError('');
    setSelectedHospital(null);
    setStatistics(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    try {
      const res = await hospitalsAPI.getHospitalById(String(hospitalId));
      if (res.success) {
        setSelectedHospital(res.data.hospital);
        setStatistics(res.data.statistics || null);
      } else {
        setDetailError('Failed to load hospital details.');
      }
    } catch (err: any) {
      setDetailError(err.message || 'Failed to load hospital details.');
    } finally {
      setDetailLoading(false);
    }
  };

  const handleBack = () => {
    setSelectedHospital(null);
    setDetailError('');
    setStatistics(null);
  };

  // ── Loading spinner for detail ────────────────────────────────────────────
  if (detailLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3" />
        <span className="text-gray-500">Loading hospital details…</span>
      </div>
    );
  }

  // ── Detail error (no hospital loaded) ────────────────────────────────────
  if (detailError && !selectedHospital) {
    return (
      <div className="space-y-5">
        <button onClick={handleBack}
          className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Results
        </button>
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
          <p className="text-red-600 font-semibold mb-4">{detailError}</p>
        </div>
      </div>
    );
  }

  // ── Detail view ───────────────────────────────────────────────────────────
  if (selectedHospital) {
    return <HospitalDetailView hospital={selectedHospital} statistics={statistics} onBack={handleBack} />;
  }

  // ── Search / List view ───────────────────────────────────────────────────
  const displayList = hasSearched ? filteredHospitals : hospitals;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Find Hospitals</h1>
        <p className="text-gray-500 text-sm">Search from our network of accredited hospitals across India</p>
      </div>

      {/* Search form */}
      <form onSubmit={handleSearch} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">City / Location</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <select value={city} onChange={e => setCity(e.target.value)}
                className="w-full pl-9 pr-8 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none bg-white">
                <option value="">All Cities</option>
                {INDIAN_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Specialization / Procedure</label>
            <div className="relative">
              <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <select value={procedure} onChange={e => setProcedure(e.target.value)}
                className="w-full pl-9 pr-8 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none bg-white">
                <option value="">All Specializations</option>
                {PROCEDURES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button type="submit" disabled={loading}
            className="flex-1 bg-blue-600 text-white font-semibold py-2.5 rounded-xl hover:bg-blue-700 disabled:bg-blue-300 transition-colors flex items-center justify-center gap-2 text-sm">
            <Search className="w-4 h-4" />
            {loading ? 'Searching…' : 'Search Hospitals'}
          </button>
          {(city || procedure || hasSearched) && (
            <button type="button" onClick={() => { setCity(''); setProcedure(''); setHasSearched(false); setFilteredHospitals([]); setError(''); }}
              className="px-4 py-2.5 border border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors text-sm flex items-center gap-1.5">
              <X className="w-4 h-4" /> Clear
            </button>
          )}
        </div>
      </form>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-red-600 text-sm font-medium">{error}</p>
          <button onClick={fetchAll} className="ml-auto text-sm text-blue-600 font-semibold hover:underline">Retry</button>
        </div>
      )}

      {/* Results header */}
      {!loading && !error && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            {hasSearched
              ? `${filteredHospitals.length} hospital${filteredHospitals.length !== 1 ? 's' : ''} found`
              : `${hospitals.length} hospital${hospitals.length !== 1 ? 's' : ''} available`}
          </p>
        </div>
      )}

      {/* Hospital cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
              <div className="flex gap-4">
                <div className="w-16 h-16 bg-gray-100 rounded-xl flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-gray-100 rounded w-1/3" />
                  <div className="h-4 bg-gray-100 rounded w-2/3" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : displayList.length === 0 && (hasSearched || !loading) ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <Building2 className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <h3 className="font-bold text-gray-700 mb-1">No hospitals found</h3>
          <p className="text-gray-400 text-sm">Try adjusting your search criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayList.map(hospital => (
            <HospitalListCard key={hospital.id} hospital={hospital} onViewDetails={handleViewDetails} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FindHospitals;
