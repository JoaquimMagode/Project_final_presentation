import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Star, Clock } from 'lucide-react';
import { MOCK_HOSPITALS } from '../constants';

const COST_MAP: Record<string, string> = {
  'Apollo Hospitals Mumbai': '€1,200–€3,500',
  'Fortis Hospital Mumbai': '€1,000–€3,000',
  'Lilavati Hospital Mumbai': '€900–€2,800',
  'Max Healthcare Delhi': '€1,100–€3,200',
  'Fortis Memorial Research Institute Delhi': '€1,300–€4,000',
  'Apollo Hospitals Delhi': '€1,000–€3,000',
  'Apollo Hospitals Bangalore': '€950–€2,900',
  'Manipal Hospital Bangalore': '€1,000–€3,100',
  'Fortis Hospital Bangalore': '€900–€2,700',
  'Apollo Hospitals Chennai': '€1,100–€3,300',
  'Fortis Malar Hospital Chennai': '€1,000–€3,000',
  'Gleneagles Global Hospital Chennai': '€850–€2,600',
  'Apollo Hospitals Hyderabad': '€900–€2,800',
  'Fortis Hospital Hyderabad': '€850–€2,600',
  'Care Hospital Hyderabad': '€750–€2,400',
  'Apollo Hospitals Pune': '€800–€2,500',
  'Deenanath Mangeshkar Hospital Pune': '€750–€2,300',
  'Inamdar Hospital Pune': '€700–€2,100',
  'Apollo Hospitals Kolkata': '€800–€2,500',
  'Fortis Hospital Kolkata': '€750–€2,300',
  'Peerless Hospital Kolkata': '€650–€2,000',
  'Apollo Hospitals Ahmedabad': '€750–€2,400',
  'Shardaben Hospital Ahmedabad': '€650–€2,000',
  'Shalby Hospital Ahmedabad': '€600–€1,900',
};

const DISTANCE_MAP: Record<string, string> = {
  h1: '4.2 km', h2: '6.1 km', h3: '3.8 km', h4: '5.0 km', h5: '7.3 km',
  h6: '4.5 km', h7: '3.2 km', h8: '5.8 km', h9: '6.4 km', h10: '4.1 km',
  h11: '5.5 km', h12: '7.0 km', h13: '3.9 km', h14: '5.2 km', h15: '6.8 km',
  h16: '4.3 km', h17: '5.7 km', h18: '6.2 km', h19: '3.5 km', h20: '4.9 km',
  h21: '6.6 km', h22: '4.0 km', h23: '5.3 km', h24: '6.1 km',
};

const LocationDetail: React.FC = () => {
  const { city } = useParams<{ city: string }>();
  const navigate = useNavigate();

  const cityName = city ? city.charAt(0).toUpperCase() + city.slice(1) : '';
  const hospitals = MOCK_HOSPITALS.filter(h => h.location.toLowerCase() === city?.toLowerCase());

  if (hospitals.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <p className="text-slate-500">No hospitals found for this location.</p>
        <button onClick={() => navigate('/locations')} className="mt-4 text-emerald-600 font-semibold">← Back to Locations</button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
      <button onClick={() => navigate('/locations')} className="flex items-center gap-2 text-sm text-slate-500 hover:text-emerald-600 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Locations
      </button>

      <div className="space-y-1">
        <div className="flex items-center gap-2 text-emerald-600 text-sm font-semibold">
          <MapPin className="w-4 h-4" /> {cityName}, India
        </div>
        <h1 className="text-3xl font-bold text-slate-900">Hospitals in {cityName}</h1>
        <p className="text-slate-500">{hospitals.length} verified hospitals available</p>
      </div>

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
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {DISTANCE_MAP[h.id] ?? '5 km'} from centre</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {h.responseTime}</span>
            </div>

            <div className="flex flex-wrap gap-1 mb-3">
              {h.specializations.slice(0, 3).map(s => (
                <span key={s} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{s}</span>
              ))}
              {h.specializations.length > 3 && (
                <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">+{h.specializations.length - 3} more</span>
              )}
            </div>

            <p className="text-sm font-bold text-emerald-600 mb-4">{COST_MAP[h.name] ?? '€700–€2,500'}</p>

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
  );
};

export default LocationDetail;
