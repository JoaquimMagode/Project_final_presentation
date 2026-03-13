
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MOCK_HOSPITALS } from '../constants';
import { Search, MapPin, ArrowRight, Clock, ShieldCheck } from 'lucide-react';

const Hospitals: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [condition, setCondition] = useState('');
  const [location, setLocation] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredHospitals, setFilteredHospitals] = useState<typeof MOCK_HOSPITALS>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const popularSearches = ['Primary Care Physician', 'Obstetrics & Gynecology', 'Neurology & Neurosurgery', 'Cardiology', 'Urology', 'Dermatology', 'Orthopaedics'];
  
  const moreSpecialties = [
    'Orthopaedics', 'Neurology & Neurosurgery', 'Spine',
    'Cancer', 'Heart', 'Obstetrics & Gynecology',
    'Urology', 'Digestive & Liver Diseases', 'Ear, Nose & Throat',
    'Lung', 'Surgery', 'Transplant'
  ];

  // Load search parameters from URL on component mount
  useEffect(() => {
    const destination = searchParams.get('destination') || '';
    const procedure = searchParams.get('procedure') || '';
    
    if (destination || procedure) {
      setCondition(procedure || destination);
      setLocation(destination);
      setHasSearched(true);
    } else {
      // Show all hospitals by default
      setHasSearched(true);
    }
  }, [searchParams]);

  // Filter hospitals whenever condition, location, or searchTerm changes
  useEffect(() => {
    if (hasSearched) {
      const filtered = MOCK_HOSPITALS.filter(h => {
        const matchesCondition = condition === '' || h.specializations.some(s => s.toLowerCase().includes(condition.toLowerCase()));
        const matchesLocation = location === '' || h.location.toLowerCase().includes(location.toLowerCase());
        const matchesSearch = searchTerm === '' || h.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCondition && matchesLocation && matchesSearch;
      });
      setFilteredHospitals(filtered.length > 0 ? filtered : MOCK_HOSPITALS);
    }
  }, [condition, location, searchTerm, hasSearched]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
  };

  const handleSpecialtyClick = (specialty: string) => {
    setCondition(specialty);
    setHasSearched(true);
  };

  const handlePopularSearchClick = (search: string) => {
    setCondition(search);
    setHasSearched(true);
  };

  return (
    <div>
      {/* Find Hospitals Hero Section */}
      <section className="w-full bg-gradient-to-br from-slate-900 to-slate-800 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-serif text-white text-center mb-12">Find Hospitals</h1>
          
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
                  onClick={() => handlePopularSearchClick(search)}
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



      {/* Hospitals Results Section - Always Show */}
      <section className="w-full bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Found Hospitals</h2>
            
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Search by hospital name..."
                className="w-full bg-white border border-slate-200 rounded-lg py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium text-slate-900"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Results Count */}
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest px-1 mb-8">
            Found {filteredHospitals.length} Hospital{filteredHospitals.length !== 1 ? 's' : ''}
          </p>

          {/* Hospitals Grid */}
          {filteredHospitals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredHospitals.map(hospital => (
                <div key={hospital.id} className="bg-white border border-slate-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <img 
                          src={hospital.logo} 
                          alt={hospital.name}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div>
                          <h3 className="text-lg font-bold text-slate-900">{hospital.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <ShieldCheck className="w-4 h-4 text-emerald-600" />
                            <span className="text-sm font-semibold text-emerald-600">{hospital.accreditation}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-slate-900">{hospital.rating}</div>
                        <div className="text-xs text-slate-500">Rating</div>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-2 text-slate-600 mb-4">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{hospital.location}</span>
                    </div>

                    {/* Specializations */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {hospital.specializations.map((spec, i) => (
                        <span key={i} className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-full">
                          {spec}
                        </span>
                      ))}
                    </div>

                    {/* Response Time */}
                    <div className="flex items-center gap-2 text-slate-600 mb-6 pb-6 border-b border-slate-200">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm font-semibold">Response Time: {hospital.responseTime}</span>
                    </div>

                    {/* Action Button */}
                    <button className="w-full px-4 py-2 bg-slate-900 text-white rounded font-bold hover:bg-slate-800 transition-colors">
                      Request Opinion
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center space-y-4">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
                <Search className="w-10 h-10 text-slate-300" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg">No hospitals found</h3>
                <p className="text-slate-500 text-sm mt-2">Try adjusting your search criteria.</p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Hospitals;
