import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { MOCK_HOSPITALS } from '../constants';
import { Search, MapPin, ArrowRight, Clock, ShieldCheck, Lock } from 'lucide-react';

const GUEST_LIMIT = 3;

const Hospitals: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('user');
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
    let filtered = MOCK_HOSPITALS;
    
    if (condition) {
      filtered = filtered.filter(h => 
        h.specializations.some(s => s.toLowerCase().includes(condition.toLowerCase()))
      );
    }
    
    if (location) {
      filtered = filtered.filter(h => 
        h.location.toLowerCase().includes(location.toLowerCase())
      );
    }
    
    if (searchTerm) {
      filtered = filtered.filter(h => 
        h.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredHospitals(filtered);
  }, [condition, location, searchTerm]);

  const handleHospitalClick = (hospitalId: string) => {
    navigate(`/hospital/${hospitalId}`);
  };

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
      <section className="bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="space-y-8">
            <div>
              <h1 className="text-5xl md:text-6xl font-serif leading-tight text-slate-900 mb-4">
                Find Top Hospitals
              </h1>
              <p className="text-lg text-slate-600 max-w-2xl">Search and connect with India's leading medical facilities</p>
            </div>
          
            {/* Search Form */}
            <div className="bg-white rounded-lg p-8 shadow-sm border border-slate-200">
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder="Condition, procedure, or name"
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                    className="px-4 py-3 border border-slate-300 rounded focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none"
                  />
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="City or Zip Code"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-300 rounded focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none"
                    />
                    <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  </div>
                  <button
                    type="submit"
                    className="px-8 py-3 bg-slate-900 text-white rounded font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                  >
                    <Search className="w-5 h-5" />
                    Search
                  </button>
                </div>

                {/* Popular Searches */}
                <div className="flex flex-wrap gap-2 items-center pt-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Popular:</span>
                  {popularSearches.slice(0, 5).map((search, i) => (
                    <button
                      key={i}
                      onClick={() => handlePopularSearchClick(search)}
                      className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-1 border border-slate-200 rounded-full hover:border-slate-900 transition-colors"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Hospitals Results Section */}
      {hasSearched && (
        <section className="w-full bg-white py-4">
          <div className="max-w-7xl mx-auto px-4">
            {/* Results Count */}
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-8">
              Found {filteredHospitals.length} Hospital{filteredHospitals.length !== 1 ? 's' : ''}
              {!isLoggedIn && ` — showing ${Math.min(GUEST_LIMIT, filteredHospitals.length)} of ${filteredHospitals.length}`}
            </p>

            {/* Hospitals Grid */}
            {filteredHospitals.length > 0 ? (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {(isLoggedIn ? filteredHospitals : filteredHospitals.slice(0, GUEST_LIMIT)).map(hospital => (
                  <div 
                    key={hospital.id} 
                    onClick={() => handleHospitalClick(hospital.id)}
                    className="bg-white border border-slate-200 rounded-lg overflow-hidden hover:shadow-xl hover:border-slate-300 transition-all duration-300 cursor-pointer"
                  >
                    <div className="p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-4 flex-1">
                          <img 
                            src={hospital.logo} 
                            alt={hospital.name}
                            className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                          />
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-slate-900 mb-1">{hospital.name}</h3>
                            <div className="flex items-center gap-2">
                              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                              <span className="text-xs font-semibold text-emerald-600">{hospital.accreditation}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="text-2xl font-bold text-slate-900">{hospital.rating}</div>
                          <div className="text-xs text-slate-500">Rating</div>
                        </div>
                      </div>

                      {/* Location */}
                      <div className="flex items-center gap-2 text-slate-600 mb-4">
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                        <span className="text-sm">{hospital.location}</span>
                      </div>

                      {/* Specializations */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {hospital.specializations.slice(0, 3).map((spec, i) => (
                          <span key={i} className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-full">
                            {spec}
                          </span>
                        ))}
                        {hospital.specializations.length > 3 && (
                          <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-full">+{hospital.specializations.length - 3}</span>
                        )}
                      </div>

                      {/* Response Time */}
                      <div className="flex items-center gap-2 text-slate-600 mb-6 pb-6 border-b border-slate-200">
                        <Clock className="w-4 h-4 flex-shrink-0" />
                        <span className="text-sm font-semibold">Response: {hospital.responseTime}</span>
                      </div>

                      {/* Action Button */}
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleHospitalClick(hospital.id);
                        }}
                        className="w-full px-4 py-3 bg-slate-900 text-white rounded font-bold hover:bg-slate-800 transition-colors"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
                </div>

                {/* Login prompt for guests */}
                {!isLoggedIn && filteredHospitals.length > GUEST_LIMIT && (
                  <div className="mt-8 p-6 bg-slate-50 border border-slate-200 rounded-xl text-center space-y-3">
                    <Lock className="w-8 h-8 text-slate-400 mx-auto" />
                    <p className="font-bold text-slate-800">Sign in to see all {filteredHospitals.length} hospitals</p>
                    <p className="text-sm text-slate-500">Create a free account to access full listings, contact details, and booking.</p>
                    <div className="flex gap-3 justify-center">
                      <button onClick={() => navigate('/login')} className="px-5 py-2 bg-slate-900 text-white rounded font-bold hover:bg-slate-800 transition-colors">Sign In</button>
                      <button onClick={() => navigate('/register')} className="px-5 py-2 border border-slate-300 text-slate-700 rounded font-bold hover:bg-slate-100 transition-colors">Register</button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="py-20 text-center space-y-4">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
                  <Search className="w-10 h-10 text-slate-300" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">No hospitals found</h3>
                  <p className="text-slate-500 text-sm mt-2">
                    {condition && location 
                      ? `No hospitals found for "${condition}" in "${location}". Try adjusting your search criteria.`
                      : condition
                      ? `No hospitals found for "${condition}". Try adjusting your search criteria.`
                      : location
                      ? `No hospitals found in "${location}". Try adjusting your search criteria.`
                      : 'Try adjusting your search criteria.'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* How It Works Section */}
      <section className="w-full bg-slate-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-12">
            <h2 className="text-4xl md:text-5xl font-serif text-slate-900 mb-4">How It Works</h2>
            <p className="text-lg text-slate-600 max-w-2xl">Simple steps to find and connect with the right hospital for your needs</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: 1,
                title: 'Search & Filter',
                desc: 'Enter your condition and location to find hospitals matching your needs'
              },
              {
                step: 2,
                title: 'Compare Options',
                desc: 'Review ratings, specializations, and response times side by side'
              },
              {
                step: 3,
                title: 'Request Opinion',
                desc: 'Connect directly with hospital specialists for medical consultation'
              },
              {
                step: 4,
                title: 'Get Support',
                desc: 'Receive assistance with visa, travel, and accommodation arrangements'
              }
            ].map((item) => (
              <div key={item.step} className="bg-white p-8 rounded-lg border border-slate-200 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-4xl font-bold text-slate-900">{item.step}</div>
                  {item.step < 4 && <div className="hidden md:block text-2xl text-slate-300">→</div>}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hospitals;
