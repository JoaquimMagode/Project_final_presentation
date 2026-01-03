
import React, { useState } from 'react';
import { MOCK_HOSPITALS } from '../constants';
import HospitalCard from '../components/HospitalCard';
import { Search, SlidersHorizontal, MapPin } from 'lucide-react';

const Hospitals: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');

  const specialties = ['All', 'Oncology', 'Cardiology', 'Neurology', 'Orthopedics', 'Transplants', 'IVF'];

  const filtered = MOCK_HOSPITALS.filter(h => {
    const matchesSearch = h.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'All' || h.specializations.includes(selectedSpecialty);
    return matchesSearch && matchesSpecialty;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-black text-slate-900">Verified Hospitals</h1>
        
        {/* Search Bar */}
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-emerald-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search by hospital name or specialty..."
            className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium text-slate-900"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filters Scrollable */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          <div className="p-2 bg-slate-100 rounded-xl text-slate-500 shrink-0">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          {specialties.map(spec => (
            <button
              key={spec}
              onClick={() => setSelectedSpecialty(spec)}
              className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                selectedSpecialty === spec 
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' 
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-emerald-200'
              }`}
            >
              {spec}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <p className="text-sm font-bold text-slate-400 uppercase tracking-widest px-1">
        Found {filtered.length} Hospitals
      </p>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
        {filtered.map(h => (
          <HospitalCard key={h.id} hospital={h} />
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full py-20 text-center space-y-4">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
              <Search className="w-10 h-10 text-slate-300" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">No hospitals found</h3>
              <p className="text-slate-500 text-sm">Try adjusting your search or filters.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Hospitals;
