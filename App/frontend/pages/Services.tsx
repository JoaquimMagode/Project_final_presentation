
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { hospitalsAPI } from '../services/api';
import { MapPinned, CalendarDays, Clock, ChevronDown, Stethoscope } from 'lucide-react';
import ContactAssistanceModal from '../components/ContactAssistanceModal';

const FindMyMatch: React.FC = () => {
  const navigate = useNavigate();
  const [searchMode, setSearchMode] = useState<'city' | 'procedure'>('city');
  const [allHospitals, setAllHospitals] = useState<any[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [procedures, setProcedures] = useState<string[]>([]);
  const [city, setCity] = useState('');
  const [procedure, setProcedure] = useState('');
  const [hospital, setHospital] = useState<any>(null);

  useEffect(() => {
    hospitalsAPI.getHospitals({ limit: 100 }).then((res: any) => {
      const hospitals = res?.data?.hospitals || [];
      setAllHospitals(hospitals);
      const uniqueCities = [...new Set<string>(hospitals.map((h: any) => h.city).filter(Boolean))];
      const uniqueProcs = [...new Set<string>(hospitals.flatMap((h: any) => h.specialties || []).filter(Boolean))];
      setCities(uniqueCities);
      setProcedures(uniqueProcs);
      if (uniqueCities.length) setCity(uniqueCities[0]);
      if (uniqueProcs.length) setProcedure(uniqueProcs[0]);
      const first = hospitals.find((h: any) => h.city === uniqueCities[0]);
      if (first) setHospital(first);
    }).catch(() => {});
  }, []);

  const filteredHospitals = searchMode === 'city'
    ? allHospitals.filter(h => h.city === city)
    : allHospitals.filter(h => (h.specialties || []).some((s: string) => s.toLowerCase().includes(procedure.toLowerCase())));

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCity(e.target.value);
    const first = allHospitals.find(h => h.city === e.target.value);
    setHospital(first || null);
  };

  const handleProcedureChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setProcedure(e.target.value);
    const first = allHospitals.find(h => (h.specialties || []).some((s: string) => s.toLowerCase().includes(e.target.value.toLowerCase())));
    setHospital(first || null);
  };

  const fieldClass = "w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 text-slate-800 text-sm font-medium";

  return (
    <div className="bg-white border border-slate-200 rounded-3xl shadow-md p-6 max-w-md mx-auto mb-12">
      <h2 className="text-xl font-bold text-slate-900 mb-6">Find My Match</h2>

      {/* Search Mode Toggle */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => { setSearchMode('city'); const first = allHospitals.find(h => h.city === city); setHospital(first || null); }}
          className={`flex-1 py-2 px-4 rounded-xl font-semibold text-sm transition-all ${
            searchMode === 'city' ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <MapPinned className="w-4 h-4 inline mr-2" />
          By City
        </button>
        <button
          onClick={() => { setSearchMode('procedure'); const first = allHospitals.find(h => (h.specialties || []).some((s: string) => s.toLowerCase().includes(procedure.toLowerCase()))); setHospital(first || null); }}
          className={`flex-1 py-2 px-4 rounded-xl font-semibold text-sm transition-all ${
            searchMode === 'procedure' ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Stethoscope className="w-4 h-4 inline mr-2" />
          By Procedure
        </button>
      </div>

      <div className="space-y-4">
        {searchMode === 'city' ? (
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Destination</label>
            <div className="relative">
              <MapPinned className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select value={city} onChange={handleCityChange} className={`${fieldClass} pl-9 pr-9`}>
                {cities.map(c => <option key={c}>{c}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Type of Procedure</label>
            <div className="relative">
              <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select value={procedure} onChange={handleProcedureChange} className={`${fieldClass} pl-9 pr-9`}>
                {procedures.map(p => <option key={p}>{p}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
        )}

        {/* Hospital */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">Hospital</label>
          <div className="relative">
            <select
              value={hospital?.id ?? ''}
              onChange={e => setHospital(filteredHospitals.find(h => String(h.id) === e.target.value) || null)}
              className={`${fieldClass} pr-9`}
            >
              {filteredHospitals.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Start Date */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">Start Date</label>
          <div className="relative">
            <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="date" defaultValue="2026-04-13" className={`${fieldClass} pl-9`} />
          </div>
        </div>

        {/* Duration */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">Duration</label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <select defaultValue="1 week" className={`${fieldClass} pl-9 pr-9`}>
              {['1 week', '2 weeks', '3 weeks', '1 month', '2 months'].map(d => <option key={d}>{d}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      <button
        onClick={() => navigate('/quote', { state: { hospitalId: hospital?.id, city: searchMode === 'city' ? city : hospital?.city, procedure: searchMode === 'procedure' ? procedure : undefined } })}
        className="mt-6 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-2xl transition-colors text-sm tracking-wide"
      >
        GET A QUOTE
      </button>
    </div>
  );
};

const Services: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  return (
    <div className="space-y-12 pb-20">
      {showModal && <ContactAssistanceModal onClose={() => setShowModal(false)} />}
      <FindMyMatch />
      <section className="bg-emerald-600 rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-2">
          <h2 className="text-3xl font-black">Need a Customized Plan?</h2>
          <p className="text-emerald-100 font-medium">Talk to our local coordinators to arrange everything before you land.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-white text-emerald-600 px-8 py-4 rounded-2xl font-black shadow-xl hover:scale-105 transition-all"
        >
          Contact Assistance
        </button>
      </section>
    </div>
  );
};

export default Services;
