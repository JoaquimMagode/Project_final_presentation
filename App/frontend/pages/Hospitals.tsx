
import React, { useState } from 'react';
import { MOCK_HOSPITALS } from '../constants';
import HospitalCard from '../components/HospitalCard';
import { Search, SlidersHorizontal, MapPin, ArrowRight } from 'lucide-react';

const Hospitals: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [condition, setCondition] = useState('');
  const [location, setLocation] = useState('');

  const specialties = ['All', 'Oncology', 'Cardiology', 'Neurology', 'Orthopedics', 'Transplants', 'IVF'];
  const popularSearches = ['Primary Care Physician', 'Obstetrics & Gynecology', 'Neurology & Neurosurgery', 'Cardiology', 'Urology', 'Dermatology', 'Orthopaedics'];
  
  const moreSpecialties = [
    'Orthopaedics', 'Neurology & Neurosurgery', 'Spine',
    'Cancer', 'Heart', 'Obstetrics & Gynecology',
    'Urology', 'Digestive & Liver Diseases', 'Ear, Nose & Throat',
    'Lung', 'Surgery', 'Transplant'
  ];

  const filtered = MOCK_HOSPITALS.filter(h => {
    const matchesSearch = h.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'All' || h.specializations.includes(selectedSpecialty);
    return matchesSearch && matchesSpecialty;
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', { condition, location });
  };

  return (
    <div>
      {/* Find a Doctor Hero Section */}
      <section className="w-full bg-gradient-to-br from-slate-900 to-slate-800 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-serif text-white text-center mb-12">Find a Doctor</h1>
          
          {/* Search Form */}
          <div className="bg-white rounded-lg p-8 mb-8">
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 mb-6">
              <input
                type="text"
                placeholder="Condition, procedure, or name"
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="flex-1 px-4 py-3 border border-slate-300 rounded outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
              />
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="City or Zip Code"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
                />
                <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />
              </div>
              <button
                type="submit"
                className="px-8 py-3 bg-black text-white rounded font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
              >
                <Search className="w-5 h-5" />
                Search
              </button>
            </form>

            {/* Popular Searches */}
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm font-bold text-slate-700">Popular Searches:</span>
              {popularSearches.map((search, i) => (
                <button
                  key={i}
                  onClick={() => setCondition(search)}
                  className="text-sm font-semibold text-slate-700 hover:text-slate-900 pb-1 border-b-2 border-transparent hover:border-slate-900 transition-colors"
                >
                  {search}
                </button>
              ))}
            </div>
          </div>

          {/* Featured Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Primary Care Card */}
            <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <div className="grid grid-cols-2">
                <div className="p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl font-serif text-slate-900 mb-3">Looking for a Primary Care doctor for yourself or a loved one?</h3>
                    <p className="text-sm text-slate-600 mb-6">Explore doctor bios, ratings, experience and training backgrounds to find a perfect fit in your neighborhood</p>
                  </div>
                  <button className="flex items-center gap-2 text-slate-900 font-bold hover:text-emerald-600 transition-colors">
                    Find a Primary Care Provider <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="bg-gray-200 h-64 md:h-auto">
                  <img 
                    src="https://picsum.photos/seed/doctor1/400/300" 
                    alt="Doctor" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Pediatric Card */}
            <div className="bg-blue-50 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <div className="p-6 flex flex-col justify-between h-full">
                <div>
                  <h3 className="text-2xl font-serif text-slate-900 mb-3">Guerin Children's Pediatric Primary Care</h3>
                  <p className="text-sm text-slate-600 mb-6">Our pediatricians provide expert care to infants, kids and teens.</p>
                </div>
                <div className="flex items-end justify-between">
                  <button className="flex items-center gap-2 text-slate-900 font-bold hover:text-emerald-600 transition-colors">
                    Find a Pediatrician <ArrowRight className="w-4 h-4" />
                  </button>
                  <div className="w-20 h-20">
                    <img 
                      src="https://picsum.photos/seed/pediatric/100/100" 
                      alt="Pediatric" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search More Specialties Section */}
      <section className="w-full bg-slate-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-serif text-slate-900 text-center mb-12">Search More Specialties</h2>
          <div className="w-24 h-1 bg-slate-200 mx-auto mb-12"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {moreSpecialties.map((specialty, i) => (
              <button
                key={i}
                onClick={() => setCondition(specialty)}
                className="bg-white p-6 rounded-lg border border-slate-200 hover:shadow-lg transition-shadow flex items-center justify-between group"
              >
                <span className="text-lg font-semibold text-slate-900 group-hover:text-emerald-600 transition-colors">{specialty}</span>
                <ArrowRight className="w-5 h-5 text-red-500 group-hover:translate-x-1 transition-transform" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Hospitals Section */}
      <section className="w-full bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 space-y-6">
          <div className="flex flex-col gap-4">
            <h2 className="text-3xl font-black text-slate-900">Verified Hospitals</h2>
            
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
      </section>
    </div>
  );
};

export default Hospitals;
