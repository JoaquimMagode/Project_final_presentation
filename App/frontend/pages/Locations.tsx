import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, ArrowRight } from 'lucide-react';
import { hospitalsAPI } from '../services/api';

const CITY_META: Record<string, { description: string; price: string; emoji: string }> = {
  Mumbai:    { description: 'Top hospitals for cardiac and orthopedic treatments', price: 'From €300/week', emoji: '🏙️' },
  Delhi:     { description: 'Leading centres for neurosurgery and cancer care',    price: 'From €280/week', emoji: '🕌' },
  Bangalore: { description: 'Advanced technology and fertility specialists',        price: 'From €260/week', emoji: '🌿' },
  Chennai:   { description: 'Renowned for eye surgery and transplants',             price: 'From €240/week', emoji: '🌊' },
  Hyderabad: { description: 'Affordable care with world-class oncology',            price: 'From €220/week', emoji: '💎' },
  Pune:      { description: 'Emerging hub for orthopedics and wellness',            price: 'From €200/week', emoji: '🏔️' },
  Kolkata:   { description: 'Trusted for cardiology and general surgery',           price: 'From €190/week', emoji: '🌉' },
  Ahmedabad: { description: 'Growing medical tourism with modern facilities',       price: 'From €180/week', emoji: '🏛️' },
};

const DEFAULT_META = { description: 'Quality medical care available', price: 'From €200/week', emoji: '🏥' };

const Locations: React.FC = () => {
  const navigate = useNavigate();
  const [cityMap, setCityMap] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    hospitalsAPI.getHospitals({ limit: 200 }).then((res: any) => {
      const hospitals = res?.data?.hospitals || [];
      const counts: Record<string, number> = {};
      hospitals.forEach((h: any) => {
        if (h.city) counts[h.city] = (counts[h.city] || 0) + 1;
      });
      setCityMap(counts);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const cities = Object.keys(cityMap);

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

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
        </div>
      ) : cities.length === 0 ? (
        <p className="text-slate-500">No locations found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {cities.map(city => {
            const meta = CITY_META[city] ?? DEFAULT_META;
            return (
              <div
                key={city}
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-emerald-400 transition-all group cursor-pointer"
                onClick={() => navigate(`/locations/${city.toLowerCase()}`)}
              >
                <div className="text-4xl mb-4">{meta.emoji}</div>
                <h2 className="text-lg font-bold text-slate-900 mb-1">{city}</h2>
                <p className="text-xs text-slate-500 mb-3 leading-relaxed">{meta.description}</p>
                <p className="text-xs text-slate-400 mb-1">{cityMap[city]} hospital{cityMap[city] !== 1 ? 's' : ''} available</p>
                <p className="text-sm font-bold text-emerald-600 mb-4">{meta.price}</p>
                <button className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-slate-50 group-hover:bg-emerald-600 group-hover:text-white text-slate-700 text-xs font-bold transition-colors">
                  View Hospitals <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Locations;
