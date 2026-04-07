import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Star, Clock } from 'lucide-react';
import { MOCK_HOSPITALS } from '../constants';
import { SPECIALTIES } from './Specialties';

// Map specialty keys to the specialization strings used in MOCK_HOSPITALS
const SPECIALTY_MAP: Record<string, string[]> = {
  cardiology:        ['Cardiology'],
  orthopedics:       ['Orthopedics'],
  neurology:         ['Neurology & Neurosurgery'],
  'cosmetic-surgery':['Dermatology'],
  fertility:         ['Obstetrics & Gynecology'],
  'eye-surgery':     ['Eye Surgery'],
  dental:            ['Dental'],
  urology:           ['Urology'],
};

const PRICE_RANGE: Record<string, string> = {
  cardiology:        '€2,000–€8,000',
  orthopedics:       '€1,500–€6,000',
  neurology:         '€2,500–€10,000',
  'cosmetic-surgery':'€800–€4,000',
  fertility:         '€1,200–€5,000',
  'eye-surgery':     '€500–€2,500',
  dental:            '€300–€2,000',
  urology:           '€1,000–€4,500',
};

const SpecialtyDetail: React.FC = () => {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();

  const specialty = SPECIALTIES.find(s => s.key === type);
  const matchTerms = SPECIALTY_MAP[type ?? ''] ?? [];

  const hospitals = MOCK_HOSPITALS.filter(h =>
    h.specializations.some(sp => matchTerms.some(t => sp.toLowerCase().includes(t.toLowerCase())))
  );

  const recommendedCities = [...new Set(hospitals.map(h => h.location))];

  if (!specialty) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <p className="text-slate-500">Specialty not found.</p>
        <button onClick={() => navigate('/specialties')} className="mt-4 text-emerald-600 font-semibold">← Back to Specialties</button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
      <button onClick={() => navigate('/specialties')} className="flex items-center gap-2 text-sm text-slate-500 hover:text-emerald-600 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Specialties
      </button>

      {/* Header */}
      <div className="flex items-start gap-5">
        <div className={`w-16 h-16 ${specialty.bg} ${specialty.color} rounded-2xl flex items-center justify-center shrink-0`}>
          {specialty.icon}
        </div>
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-slate-900">{specialty.name}</h1>
          <p className="text-slate-500 max-w-xl">{specialty.description}</p>
          <p className="text-sm font-bold text-emerald-600">Estimated cost: {PRICE_RANGE[type ?? ''] ?? '€500–€5,000'}</p>
        </div>
      </div>

      {/* Recommended cities */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Recommended Cities</p>
        <div className="flex flex-wrap gap-2">
          {recommendedCities.map(city => (
            <button
              key={city}
              onClick={() => navigate(`/locations/${city.toLowerCase()}`)}
              className="flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full hover:bg-emerald-100 transition-colors"
            >
              <MapPin className="w-3 h-3" /> {city}
            </button>
          ))}
        </div>
      </div>

      {/* Hospitals */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{hospitals.length} hospitals offering {specialty.name}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hospitals.map(h => (
            <div key={h.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-emerald-400 transition-all">
              <div className="flex items-start justify-between mb-3">
                <img src={h.logo} alt={h.name} className="w-12 h-12 rounded-xl object-cover" />
                <span className="text-xs font-semibold bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full">{h.accreditation}</span>
              </div>

              <h2 className="font-bold text-slate-900 mb-1">{h.name}</h2>

              <div className="flex items-center gap-3 text-xs text-slate-400 mb-3">
                <span className="flex items-center gap-1"><Star className="w-3 h-3 text-amber-400 fill-amber-400" /> {h.rating}</span>
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {h.location}</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {h.responseTime}</span>
              </div>

              <div className="flex flex-wrap gap-1 mb-3">
                {h.specializations.slice(0, 3).map(s => (
                  <span key={s} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{s}</span>
                ))}
              </div>

              <p className="text-sm font-bold text-emerald-600 mb-4">{PRICE_RANGE[type ?? ''] ?? '€500–€5,000'}</p>

              <button
                onClick={() => navigate('/quote', { state: { hospitalId: h.id, city: h.location } })}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors"
              >
                Get Quote
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SpecialtyDetail;
