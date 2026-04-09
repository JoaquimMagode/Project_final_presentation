import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Building2 } from 'lucide-react';
import { hospitalsAPI } from '../services/api';

const LocationDetail: React.FC = () => {
  const { city } = useParams<{ city: string }>();
  const navigate = useNavigate();
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const cityName = city ? city.charAt(0).toUpperCase() + city.slice(1) : '';

  useEffect(() => {
    if (!city) return;
    hospitalsAPI.getHospitals({ city: cityName, limit: 100 })
      .then((res: any) => setHospitals(res?.data?.hospitals || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [city]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (hospitals.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <p className="text-slate-500">No hospitals found for {cityName}.</p>
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
        <p className="text-slate-500">{hospitals.length} verified hospital{hospitals.length !== 1 ? 's' : ''} available</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hospitals.map(h => (
          <div key={h.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-emerald-400 transition-all">
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-emerald-600" />
              </div>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                h.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'
              }`}>
                {h.status}
              </span>
            </div>

            <h2 className="font-bold text-slate-900 mb-1">{h.name}</h2>
            <p className="text-xs text-slate-400 mb-3 flex items-center gap-1">
              <MapPin className="w-3 h-3" /> {h.city}{h.state ? `, ${h.state}` : ''}
            </p>

            {h.specialties?.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-4">
                {h.specialties.slice(0, 3).map((s: string) => (
                  <span key={s} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{s}</span>
                ))}
                {h.specialties.length > 3 && (
                  <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">+{h.specialties.length - 3} more</span>
                )}
              </div>
            )}

            <button
              onClick={() => navigate(`/hospital/${h.id}`)}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors"
            >
              View Hospital
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LocationDetail;
