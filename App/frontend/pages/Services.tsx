
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_HOSPITALS } from '../constants';
import { MapPinned, CalendarDays, Clock, ChevronDown, Stethoscope } from 'lucide-react';
import ContactAssistanceModal from '../components/ContactAssistanceModal';

const CITIES = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata', 'Ahmedabad'];
const PROCEDURES = ['Cardiology', 'Neurology & Neurosurgery', 'Orthopedics', 'Obstetrics & Gynecology', 'Urology', 'Dermatology', 'Primary Care Physician'];


const FindMyMatch: React.FC = () => {
  const navigate = useNavigate();
  const [searchMode, setSearchMode] = useState<'city' | 'procedure'>('city');
  const [city, setCity] = useState('Mumbai');
  const [procedure, setProcedure] = useState(PROCEDURES[0]);
  const [hospital, setHospital] = useState(MOCK_HOSPITALS[0].id);
  const [showResults, setShowResults] = useState(false);

  const filteredHospitals = searchMode === 'city' 
    ? MOCK_HOSPITALS.filter(h => h.location === city)
    : MOCK_HOSPITALS.filter(h => h.specializations.includes(procedure));
  const selectedHospital = MOCK_HOSPITALS.find(h => h.id === hospital) ?? filteredHospitals[0];

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCity(e.target.value);
    const first = MOCK_HOSPITALS.find(h => h.location === e.target.value);
    if (first) setHospital(first.id);
    setShowResults(false);
  };

  const fieldClass = "w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 text-slate-800 text-sm font-medium";

  return (
    <div className="bg-white border border-slate-200 rounded-3xl shadow-md p-6 max-w-md mx-auto mb-12">
      <h2 className="text-xl font-bold text-slate-900 mb-6">Find My Match</h2>

      {/* Search Mode Toggle */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => { setSearchMode('city'); setHospital(MOCK_HOSPITALS.filter(h => h.location === city)[0]?.id); setShowResults(false); }}
          className={`flex-1 py-2 px-4 rounded-xl font-semibold text-sm transition-all ${
            searchMode === 'city'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <MapPinned className="w-4 h-4 inline mr-2" />
          By City
        </button>
        <button
          onClick={() => { setSearchMode('procedure'); setHospital(MOCK_HOSPITALS.filter(h => h.specializations.includes(procedure))[0]?.id); setShowResults(false); }}
          className={`flex-1 py-2 px-4 rounded-xl font-semibold text-sm transition-all ${
            searchMode === 'procedure'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Stethoscope className="w-4 h-4 inline mr-2" />
          By Procedure
        </button>
      </div>

      <div className="space-y-4">
        {/* City or Procedure Selection */}
        {searchMode === 'city' ? (
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Destination</label>
            <div className="relative">
              <MapPinned className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select value={city} onChange={handleCityChange} className={`${fieldClass} pl-9 pr-9`}>
                {CITIES.map(c => <option key={c}>{c}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Type of Procedure</label>
            <div className="relative">
              <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select 
                value={procedure} 
                onChange={(e) => { 
                  setProcedure(e.target.value); 
                  const first = MOCK_HOSPITALS.find(h => h.specializations.includes(e.target.value));
                  if (first) setHospital(first.id);
                  setShowResults(false);
                }} 
                className={`${fieldClass} pl-9 pr-9`}
              >
                {PROCEDURES.map(p => <option key={p}>{p}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
        )}

        {/* Hospital */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">Hospital</label>
          <div className="relative">
            <select value={hospital} onChange={e => { setHospital(e.target.value); setShowResults(false); }} className={`${fieldClass} pr-9`}>
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
        onClick={() => navigate('/quote', { state: { hospitalId: hospital, city: searchMode === 'city' ? city : selectedHospital?.location, procedure: searchMode === 'procedure' ? procedure : undefined } })}
        className="mt-6 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-2xl transition-colors text-sm tracking-wide"
      >
        GET A QUOTE
      </button>

      {showResults && (
        <div className="mt-6 space-y-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Recommended Stays near {selectedHospital?.name}</p>
          {MOCK_STAYS.map(stay => (
            <div key={stay.id} className="flex justify-between items-center bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3">
              <div>
                <p className="font-bold text-slate-800 text-sm">{stay.name}</p>
                <p className="text-xs text-slate-400">{stay.distance}</p>
              </div>
              <span className="text-emerald-600 font-black text-sm">{stay.price}</span>
            </div>
          ))}

          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mt-4">Add-ons</p>
          {ADDONS.map(addon => (
            <div key={addon.label} className="flex justify-between items-center bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3">
              <div className="flex items-center gap-2 text-slate-700 text-sm font-medium">
                {addon.icon} {addon.label}
              </div>
              <span className="text-slate-500 text-xs font-bold">{addon.price}</span>
            </div>
          ))}
        </div>
      )}
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
