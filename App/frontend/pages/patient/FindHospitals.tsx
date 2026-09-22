import React, { useState, useEffect, useRef } from 'react';
import {
  Search, MapPin, ShieldCheck, Building2, AlertCircle, ArrowLeft, ArrowRight,
  Phone, Mail, Calendar, DollarSign, Stethoscope, Heart, Award,
  Users, Wrench, ExternalLink, CheckCircle, ChevronDown, X, Clock,
  Bed, Star, Globe, Copy, Check
} from 'lucide-react';
import { hospitalsAPI, appointmentsAPI } from '../../services/api';
import { CalendarScheduler } from '../../components/CalendarScheduler';
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



const TIMES = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
];

// Fallback sample reviews (used until a hospital reviews API is available)
const SAMPLE_REVIEWS: { id: number; name: string; country: string; rating: number; date: string; text: string }[] = [
  { id: 1, name: 'Ananya Sharma', country: 'India',          rating: 5, date: 'Sep 2026', text: 'Excellent care and very professional staff. The doctors took time to explain everything clearly.' },
  { id: 2, name: 'James Okafor',  country: 'Nigeria',        rating: 4, date: 'Aug 2026', text: 'Clean facility and short waiting time. Booking an appointment was smooth and hassle-free.' },
  { id: 3, name: 'Sarah Ahmed',   country: 'United Kingdom', rating: 5, date: 'Jul 2026', text: 'Highly recommend. The nursing team was attentive and the follow-up was thorough.' },
  { id: 4, name: 'Omar Al-Farsi', country: 'UAE',            rating: 5, date: 'Jun 2026', text: 'Travelled from abroad for treatment — the international patient support made everything easy.' },
];

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(amount);

// ── Time / date helpers for the CalendarScheduler ──
// 24h "HH:MM" → 12h display "hh:MM AM/PM"
const to12h = (t: string) => {
  const [hStr, m] = t.split(':');
  let h = parseInt(hStr, 10);
  const period = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${String(h).padStart(2, '0')}:${m} ${period}`;
};
// 12h display "hh:MM AM/PM" → 24h "HH:MM"
const to24h = (label: string) => {
  const [time, period] = label.split(' ');
  const [hStr, m] = time.split(':');
  let h = parseInt(hStr, 10);
  if (period === 'PM' && h !== 12) h += 12;
  if (period === 'AM' && h === 12) h = 0;
  return `${String(h).padStart(2, '0')}:${m}`;
};
// Date → local "YYYY-MM-DD"
const toISODate = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

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
        className="mt-2 inline-flex items-center gap-1.5 text-xs text-emerald-600 hover:underline"
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
  const [copied, setCopied] = useState(false);

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-5">
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

      {/* ── Hero: modern two-column (title/host left · image + info card right) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-8 items-start pt-2">
        {/* Left column */}
        <div>
          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 border border-emerald-100">
              <CheckCircle className="w-3.5 h-3.5" /> Verified
            </span>
            {(hospital.accreditations || []).slice(0, 2).map((a, i) => (
              <span key={i} className="bg-amber-50 text-amber-600 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 border border-amber-100">
                <ShieldCheck className="w-3.5 h-3.5" /> {a}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 leading-[1.1] tracking-tight mb-4">
            {hospital.name}
          </h1>

          {/* "Hosted by" style — organizer/admin */}
          <div className="flex items-center gap-3 mb-6">
            {hospital.logo_url ? (
              <img src={hospital.logo_url} alt={hospital.name}
                className="w-9 h-9 rounded-full object-cover border border-gray-200 flex-shrink-0"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            ) : (
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white text-sm font-black flex-shrink-0">
                {hospital.name.charAt(0)}
              </div>
            )}
            <div className="leading-tight">
              <p className="text-sm text-gray-500">Managed by <span className="font-bold text-gray-900">{hospital.admin_name || `${hospital.name} Admin`}</span></p>
              <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Accredited Provider
              </p>
            </div>
          </div>

          {/* Stats chips */}
          <div className="flex flex-wrap gap-2 mb-6">
            {hospital.bed_capacity ? (
              <span className="inline-flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-700"><Bed className="w-4 h-4 text-emerald-500" /><b>{hospital.bed_capacity}</b> Beds</span>
            ) : null}
            {doctors.length > 0 && (
              <span className="inline-flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-700"><Stethoscope className="w-4 h-4 text-emerald-500" /><b>{doctors.length}</b> Doctors</span>
            )}
            {hospital.established_year ? (
              <span className="inline-flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-700"><Award className="w-4 h-4 text-amber-500" />Est. <b>{hospital.established_year}</b></span>
            ) : null}
            {statistics && statistics.total_patients > 0 && (
              <span className="inline-flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-700"><Users className="w-4 h-4 text-emerald-500" /><b>{statistics.total_patients}</b> Patients</span>
            )}
          </div>

          {/* Details */}
          {hospital.description && (
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-1">Details</h2>
              <div className="h-0.5 w-10 bg-emerald-500 rounded-full mb-3" />
              <p className="text-gray-600 text-[15px] leading-relaxed whitespace-pre-line">{hospital.description}</p>
            </div>
          )}

          {/* ↓↓↓ scrollable content sections live inside the LEFT column ↓↓↓ */}

      {/* Booking Form */}
      {showBookingForm && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4 mt-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-500" /> Book Appointment
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

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Select Date &amp; Time *</label>
            <CalendarScheduler
              timeSlots={TIMES.map(to12h)}
              date={bookingForm.date ? new Date(bookingForm.date + 'T00:00:00') : undefined}
              time={bookingForm.time ? to12h(bookingForm.time) : undefined}
              onChange={({ date, time }) => setBookingForm({
                ...bookingForm,
                date: date ? toISODate(date) : bookingForm.date,
                time: time ? to24h(time) : bookingForm.time,
              })}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Appointment Type</label>
            <select value={bookingForm.type}
              onChange={e => setBookingForm({ ...bookingForm, type: e.target.value as BookingType })}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm">
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
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm resize-none" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Additional Notes (Optional)</label>
            <textarea value={bookingForm.notes} rows={2}
              onChange={e => setBookingForm({ ...bookingForm, notes: e.target.value })}
              placeholder="Any additional information for the hospital"
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm resize-none" />
          </div>

          <div className="flex gap-3">
            <button onClick={handleBook}
              disabled={!bookingForm.date || !bookingForm.time || !bookingForm.reason || bookingLoading}
              className="flex-1 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors text-sm">
              {bookingLoading ? 'Booking…' : 'Confirm Booking'}
            </button>
            <button onClick={() => { setShowBookingForm(false); setBookingError(''); }}
              className="px-5 py-3 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors text-sm">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ── Overview: specializations + accreditations ── */}
      {((hospital.specialties || []).length > 0 || (hospital.accreditations || []).length > 0) && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6 mt-6">
          {(hospital.specialties || []).length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-500" /> Medical Specializations
              </h3>
              <div className="flex flex-wrap gap-2">
                {hospital.specialties.map((s, i) => (
                  <span key={i} className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1.5 rounded-lg text-sm font-medium">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

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
        </div>
      )}

      {/* ── Services ── */}
      {services.length > 0 && (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mt-6">
        <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Wrench className="w-4 h-4 text-emerald-500" /> Services ({services.length})
        </h3>
        {(
          <div className="space-y-6">
            {Object.entries(groupedServices).map(([category, items]) => (
              <div key={category}>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">{category}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {items.map((s) => (
                    <div key={s.id} className="border border-gray-200 rounded-xl p-4 hover:border-emerald-200 hover:shadow-sm transition-all">
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

      {/* ── Doctors ── */}
      {doctors.length > 0 && (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mt-6">
        <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Stethoscope className="w-4 h-4 text-emerald-500" /> Doctors ({doctors.length})
        </h3>
        {(
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {doctors.map((doctor) => (
              <div key={doctor.id} className="border border-gray-200 rounded-xl p-4 hover:border-emerald-200 hover:shadow-sm transition-all">
                <div className="flex items-start gap-3 mb-3">
                  {doctor.profile_picture_url ? (
                    <img src={doctor.profile_picture_url} alt={doctor.name}
                      className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {doctor.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                  )}
                  <div className="min-w-0">
                    <h4 className="font-bold text-gray-900 text-sm truncate">{doctor.name}</h4>
                    <p className="text-xs text-emerald-600 font-medium">{doctor.specialization}</p>
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

      {/* ── Location ── */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mt-6">
        <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-emerald-500" /> Location
        </h3>
        <div className="flex items-start gap-2 text-sm text-gray-600 mb-3">
          <MapPin className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
          <span>{[hospital.address, hospital.city, hospital.state, hospital.country].filter(Boolean).join(', ')}</span>
        </div>
        <HospitalMap hospital={hospital} />
      </div>

      {/* ── Reviews & Ratings ── */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mt-6">
        {(() => {
          const reviews = (hospital as any).reviews as
            | { id?: number | string; name?: string; country?: string; rating: number; date?: string; text: string }[]
            | undefined;
          const list = (reviews && reviews.length > 0) ? reviews : SAMPLE_REVIEWS;
          const avg = list.reduce((s, r) => s + (r.rating || 0), 0) / list.length;
          return (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" /> Patient Reviews
                </h3>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map(n => (
                      <Star key={n} className={`w-4 h-4 ${n <= Math.round(avg) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
                    ))}
                  </div>
                  <span className="text-sm font-bold text-gray-900">{avg.toFixed(1)}</span>
                  <span className="text-xs text-gray-400">({list.length} review{list.length !== 1 ? 's' : ''})</span>
                </div>
              </div>

              <div className="space-y-4">
                {list.map((r, i) => (
                  <div key={r.id ?? i} className="border border-gray-100 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                        {(r.name || 'A').charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <div className="min-w-0">
                            <p className="font-semibold text-gray-900 text-sm truncate">{r.name || 'Anonymous'}</p>
                            {r.country && (
                              <p className="text-xs text-gray-400 flex items-center gap-1">
                                <Globe className="w-3 h-3" /> {r.country}
                              </p>
                            )}
                          </div>
                          {r.date && <span className="text-xs text-gray-400 flex-shrink-0">{r.date}</span>}
                        </div>
                        <div className="flex items-center gap-0.5 my-1">
                          {[1, 2, 3, 4, 5].map(n => (
                            <Star key={n} className={`w-3.5 h-3.5 ${n <= Math.round(r.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
                          ))}
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">{r.text}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          );
        })()}
      </div>

        </div>
        {/* ↑↑↑ end LEFT column (all scrollable content) ↑↑↑ */}

        {/* Right column — sticky sidebar */}
        <div className="space-y-4 lg:sticky lg:top-4 self-start">
          {/* Featured image (tilted / floating) */}
          <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-100 rotate-1 hover:rotate-0 transition-transform duration-300 bg-gradient-to-br from-emerald-500 to-emerald-700 aspect-[16/10]">
            {hospital.logo_url ? (
              <img src={hospital.logo_url} alt={hospital.name}
                className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            ) : (
              <div className="w-full h-full flex items-center justify-center relative">
                <Building2 className="w-16 h-16 text-white/40" />
                <span className="absolute text-6xl font-black text-white/90">{hospital.name.charAt(0)}</span>
              </div>
            )}
          </div>

          {/* Info card: contact + location + CTAs */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-4">
            {(hospital.phone || hospital.email) && (
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="min-w-0 text-sm">
                  {hospital.phone && <a href={`tel:${hospital.phone}`} className="block font-semibold text-gray-900 hover:text-emerald-600 transition-colors">{hospital.phone}</a>}
                  {hospital.email && <a href={`mailto:${hospital.email}`} className="block text-gray-500 hover:text-emerald-600 transition-colors truncate">{hospital.email}</a>}
                </div>
              </div>
            )}
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="min-w-0 text-sm flex-1">
                <p className="font-semibold text-gray-900">{hospital.name}</p>
                <p className="text-gray-500 leading-snug">{[hospital.address, hospital.city, hospital.state, hospital.country].filter(Boolean).join(', ')}</p>
              </div>
            </div>

            {/* Location text + copy */}
            {(() => {
              const fullLocation = [hospital.address, hospital.city, hospital.state, hospital.country].filter(Boolean).join(', ');
              return (
                <div className="flex items-center gap-2 pt-1 border-t border-gray-100">
                  <span className="text-xs text-gray-400 flex-1 truncate">{fullLocation}</span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard?.writeText(fullLocation);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 1500);
                    }}
                    className="flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors flex-shrink-0"
                    title="Copy location"
                  >
                    {copied ? <><Check className="w-3.5 h-3.5" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
                  </button>
                </div>
              );
            })()}
          </div>
        </div>
      </div>
      {/* ↑↑↑ end grid ↑↑↑ */}

      {/* Spacer so sticky bar doesn't cover content */}
      <div className="h-28" />

      {/* ── Sticky bottom action bar (modern floating pill) ── */}
      <div className="fixed bottom-5 left-0 right-0 z-40 px-4 pointer-events-none">
        <div className="max-w-5xl mx-auto pointer-events-auto">
          <div className="bg-emerald-600 rounded-full shadow-[0_10px_40px_rgb(0,0,0,0.25)] flex items-center gap-4 pl-8 pr-6 py-3.5">
            {/* Logo + name */}
            <div className="flex items-center gap-3.5 min-w-0 flex-1">
              {hospital.logo_url ? (
                <img src={hospital.logo_url} alt={hospital.name}
                  className="w-12 h-12 rounded-xl object-cover flex-shrink-0 border-2 border-white/30"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-white text-lg font-black flex-shrink-0">
                  {hospital.name.charAt(0)}
                </div>
              )}
              <div className="min-w-0">
                <p className="text-base font-bold text-white truncate">{hospital.name}</p>
                <p className="text-sm text-emerald-50/80 truncate flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />{[hospital.city, hospital.state].filter(Boolean).join(', ') || 'India'}
                </p>
              </div>
            </div>

            {/* Free badge */}
            <span className="hidden sm:inline-flex items-center text-sm font-semibold text-white border border-white/40 rounded-full px-4 py-2">
              Free consult
            </span>

            {/* Quote (share-like secondary) */}
            <button onClick={() => alert('Quote request sent! We will contact you within 24 hours.')}
              className="w-12 h-12 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors flex-shrink-0"
              title="Get a quote">
              <DollarSign className="w-5 h-5" />
            </button>

            {/* Primary CTA */}
            <button onClick={() => { setShowBookingForm(true); setBookingSuccess(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="bg-white text-emerald-700 font-bold text-base rounded-full px-8 py-3 hover:bg-emerald-50 transition-colors flex-shrink-0 flex items-center gap-2">
              <Calendar className="w-5 h-5" /> Book
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Hospital List Card (grid: image, title, description, tags, accredited) ──────
const HospitalListCard: React.FC<{ hospital: Hospital; onViewDetails: (id: number) => void }> = ({ hospital, onViewDetails }) => {
  const location = [hospital.city, hospital.state].filter(Boolean).join(', ');
  const isAccredited = (hospital.accreditations || []).length > 0;
  return (
    <div
      onClick={() => onViewDetails(hospital.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onViewDetails(hospital.id); } }}
      className="group cursor-pointer bg-white rounded-sm border border-gray-200 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all overflow-hidden flex flex-col focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
    >
      {/* Image / banner */}
      <div className="relative h-36 bg-gradient-to-br from-emerald-500 to-emerald-700 overflow-hidden">
        {hospital.logo_url ? (
          <img src={hospital.logo_url} alt={hospital.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Building2 className="w-12 h-12 text-white/40" />
            <span className="absolute text-5xl font-black text-white/90">{hospital.name.charAt(0)}</span>
          </div>
        )}
        {/* Accredited badge (icon only, no bg) */}
        <div className="absolute top-3 left-3">
          <span className="text-white drop-shadow" title={isAccredited ? 'Accredited' : 'Verified'}>
            <ShieldCheck className="w-5 h-5" />
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-gray-900 leading-tight line-clamp-1">{hospital.name}</h3>
        <p className="text-gray-400 text-xs flex items-center gap-1 mt-1">
          <MapPin className="w-3 h-3 flex-shrink-0" /> {location || 'India'}
        </p>

        {/* Description */}
        <p className="text-sm text-gray-500 mt-2 line-clamp-2 leading-relaxed min-h-[40px]">
          {hospital.description || `${hospital.name} is part of our accredited hospital network${location ? ` in ${location}` : ''}.`}
        </p>

        {/* Specialty tags */}
        {(hospital.specialties || []).length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {hospital.specialties.slice(0, 3).map((s, i) => (
              <span key={i} className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-bold px-2 py-0.5 rounded-md">{s}</span>
            ))}
            {hospital.specialties.length > 3 && (
              <span className="bg-gray-100 text-gray-500 text-[10px] font-bold px-2 py-0.5 rounded-md">+{hospital.specialties.length - 3} more</span>
            )}
          </div>
        )}

        {/* Accreditation chips */}
        {isAccredited && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {hospital.accreditations.slice(0, 2).map((a, i) => (
              <span key={i} className="text-[10px] font-semibold text-gray-500 flex items-center gap-1">
                <Award className="w-3 h-3 text-amber-500" /> {a}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-100 mt-4">
          <div className="flex items-center gap-1.5 text-xs">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="font-semibold text-gray-700">Accredited</span>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onViewDetails(hospital.id); }}
            aria-label="View details"
            className="flex items-center justify-center p-2 text-emerald-600 group-hover:text-emerald-700 transition-colors">
            <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Main FindHospitals page ───────────────────────────────────────────────────
const FindHospitals: React.FC = () => {
  const [filtersMap, setFiltersMap] = useState<Record<string, Record<string, string[]>>>({});
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedSpec, setSelectedSpec] = useState('');

  const states = Object.keys(filtersMap).sort();
  const cities = selectedState ? Object.keys(filtersMap[selectedState] || {}).sort() : [];
  const specializations = selectedState && selectedCity
    ? (filtersMap[selectedState]?.[selectedCity] || [])
    : selectedState
    ? [...new Set(Object.values(filtersMap[selectedState] || {}).flat())].sort()
    : [];

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

  useEffect(() => {
    hospitalsAPI.getFilters().then(setFiltersMap).catch(() => {});
    fetchAll();
  }, []);

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
      const res = (selectedState || selectedCity || selectedSpec)
        ? await hospitalsAPI.searchHospitals({
            ...(selectedState && { state: selectedState }),
            ...(selectedCity && { location: selectedCity }),
            ...(selectedSpec && { specialization: selectedSpec }),
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mr-3" />
        <span className="text-gray-500">Loading hospital details…</span>
      </div>
    );
  }

  // ── Detail error (no hospital loaded) ────────────────────────────────────
  if (detailError && !selectedHospital) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-5">
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
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Find Hospitals</h1>
        <p className="text-gray-500 text-sm">Search from our network of accredited hospitals across India</p>
      </div>

      {/* Search form */}
      <form onSubmit={handleSearch} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
        <div className="flex items-center gap-2 mb-4">
          <Search className="w-4 h-4 text-emerald-600" />
          <span className="text-sm font-bold text-gray-900">Filter Hospitals</span>
          {(selectedState || selectedCity || selectedSpec) && (
            <span className="ml-auto text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              {[selectedState, selectedCity, selectedSpec].filter(Boolean).length} active
            </span>
          )}
        </div>
        {/* Inline filter row */}
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          {/* State */}
          <div className="relative flex-1 min-w-[150px]">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <select value={selectedState}
              onChange={e => { setSelectedState(e.target.value); setSelectedCity(''); setSelectedSpec(''); }}
              className="w-full pl-9 pr-8 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm appearance-none bg-white cursor-pointer">
              <option value="">All States ({states.length})</option>
              {states.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          {/* City */}
          <div className="relative flex-1 min-w-[150px]">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <select value={selectedCity}
              onChange={e => { setSelectedCity(e.target.value); setSelectedSpec(''); }}
              disabled={!selectedState}
              className="w-full pl-9 pr-8 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm appearance-none bg-white disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
              <option value="">{selectedState ? `All Cities (${cities.length})` : 'City'}</option>
              {cities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          {/* Specialization */}
          <div className="relative flex-1 min-w-[150px]">
            <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <select value={selectedSpec}
              onChange={e => setSelectedSpec(e.target.value)}
              disabled={!selectedState}
              className="w-full pl-9 pr-8 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm appearance-none bg-white disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
              <option value="">{selectedState ? `All Specializations (${specializations.length})` : 'Specialization'}</option>
              {specializations.map(sp => <option key={sp} value={sp}>{sp}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          {/* Search */}
          <button type="submit" disabled={loading}
            className="bg-emerald-600 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-emerald-700 disabled:bg-emerald-300 transition-colors flex items-center justify-center gap-2 text-sm flex-shrink-0">
            <Search className="w-4 h-4" />
            {loading ? 'Searching…' : 'Search'}
          </button>

          {/* Clear */}
          {(selectedState || selectedCity || selectedSpec || hasSearched) && (
            <button type="button" onClick={() => { setSelectedState(''); setSelectedCity(''); setSelectedSpec(''); setHasSearched(false); setFilteredHospitals([]); setError(''); }}
              className="px-4 py-2.5 border border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors text-sm flex items-center justify-center gap-1.5 flex-shrink-0">
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
          <button onClick={fetchAll} className="ml-auto text-sm text-emerald-600 font-semibold hover:underline">Retry</button>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
            <div key={i} className="bg-white rounded-2xl border border-gray-200 overflow-hidden animate-pulse">
              <div className="h-36 bg-gray-100" />
              <div className="p-5 space-y-2">
                <div className="h-4 bg-gray-100 rounded w-2/3" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
                <div className="h-3 bg-gray-100 rounded w-full" />
                <div className="h-6 bg-gray-100 rounded w-1/3 mt-3" />
              </div>
            </div>
          ))}
        </div>
      ) : displayList.length === 0 && (hasSearched || !loading) ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <Building2 className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <h3 className="font-bold text-gray-700 mb-1">No hospitals found</h3>
          <p className="text-gray-400 text-sm">Try adjusting your search criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {displayList.map(hospital => (
            <HospitalListCard key={hospital.id} hospital={hospital} onViewDetails={handleViewDetails} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FindHospitals;
