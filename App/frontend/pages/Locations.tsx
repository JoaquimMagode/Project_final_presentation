import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, ArrowRight } from 'lucide-react';
import { MOCK_HOSPITALS } from '../constants';

const CITY_META: Record<string, { description: string; price: string; emoji: string }> = {
  Mumbai:    { description: 'Top hospitals for cardiac and orthopedic treatments', price: 'From €300/week', emoji: '🏙️' },
  Delhi:     { description: 'Leading centres for neurosurgery and cancer care', price: 'From €280/week', emoji: '🕌' },
  Bangalore: { description: 'Advanced technology and fertility specialists', price: 'From €260/week', emoji: '🌿' },
  Chennai:   { description: 'Renowned for eye surgery and transplants', price: 'From €240/week', emoji: '🌊' },
  Hyderabad: { description: 'Affordable care with world-class oncology', price: 'From €220/week', emoji: '💎' },
  Pune:      { description: 'Emerging hub for orthopedics and wellness', price: 'From €200/week', emoji: '🏔️' },
  Kolkata:   { description: 'Trusted for cardiology and general surgery', price: 'From €190/week', emoji: '🌉' },
  Ahmedabad: { description: 'Growing medical tourism with modern facilities', price: 'From €180/week', emoji: '🏛️' },
};

const cities = [...new Set(MOCK_HOSPITALS.map(h => h.location))];

const Locations: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-10">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-emerald-600 text-sm font-semibold">
          <MapPin className="w-4 h-4" /> Destinations
        </div>
        <h1 className="text-4xl font-bold text-slate-900">Find Care by Location</h1>
        <p className="text-slate-500 max-w-xl">
          Explore top Indian cities for medical treatment. Each city offers world-class hospitals at a fraction of Western costs.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {cities.map(city => {
          const meta = CITY_META[city] ?? { description: 'Quality medical care available', price: 'From €200/week', emoji: '🏥' };
          const hospitalCount = MOCK_HOSPITALS.filter(h => h.location === city).length;
          return (
            <div
              key={city}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-emerald-400 transition-all group cursor-pointer"
              onClick={() => navigate(`/locations/${city.toLowerCase()}`)}
            >
              <div className="text-4xl mb-4">{meta.emoji}</div>
              <h2 className="text-lg font-bold text-slate-900 mb-1">{city}</h2>
              <p className="text-xs text-slate-500 mb-3 leading-relaxed">{meta.description}</p>
              <p className="text-xs text-slate-400 mb-1">{hospitalCount} hospitals available</p>
              <p className="text-sm font-bold text-emerald-600 mb-4">{meta.price}</p>
              <button className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-slate-50 group-hover:bg-emerald-600 group-hover:text-white text-slate-700 text-xs font-bold transition-colors">
                View Hospitals <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Locations;
