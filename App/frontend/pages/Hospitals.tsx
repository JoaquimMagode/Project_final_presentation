import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { hospitalsAPI } from '../services/api';
import { Search, MapPin, ShieldCheck, Lock, Bed, Phone, Mail, Globe, Award, Stethoscope } from 'lucide-react';

const GUEST_LIMIT = 3;

const Hospitals: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('user');
  const [condition, setCondition] = useState('');
  const [location, setLocation] = useState('');
  const [filteredHospitals, setFilteredHospitals] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const popularSearches = ['Cardiology', 'Orthopedics', 'Neurology & Neurosurgery', 'Obstetrics & Gynecology', 'Urology', 'Dermatology'];

  const fetchHospitals = async (city: string, specialization: string) => {
    setLoading(true);
    try {
      const res: any = await hospitalsAPI.searchHospitals({
        location: city || undefined,
        specialization: specialization || undefined,
        name: (!specialization && !city) ? undefined : undefined,
      });
      setFilteredHospitals(res?.data?.hospitals || []);
    } catch {
      setFilteredHospitals([]);
    } finally {
      setLoading(false);
    }
  };

  // Load search parameters from URL on component mount
  useEffect(() => {
    const destination = searchParams.get('destination') || '';
    const procedure = searchParams.get('procedure') || '';
    setLocation(destination);
    setCondition(procedure);
    setHasSearched(true);
    fetchHospitals(destination, procedure);
  }, [searchParams]);

  const handleHospitalClick = (hospitalId: number) => {
    navigate(`/hospital/${hospitalId}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    fetchHospitals(location, condition);
  };

  const handlePopularSearchClick = (search: string) => {
    setCondition(search);
    setHasSearched(true);
    fetchHospitals(location, search);
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
            {loading ? (
              <p className="text-sm text-slate-500 py-8">Loading hospitals...</p>
            ) : (
            <>
            {/* Results Count */}
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-8">
              Found {filteredHospitals.length} Hospital{filteredHospitals.length !== 1 ? 's' : ''}
              {!isLoggedIn && ` — showing ${Math.min(GUEST_LIMIT, filteredHospitals.length)} of ${filteredHospitals.length}`}
            </p>

            {/* Hospitals List */}
            {filteredHospitals.length > 0 ? (
              <>
                <div className="flex flex-col gap-4">
                  {(isLoggedIn ? filteredHospitals : filteredHospitals.slice(0, GUEST_LIMIT)).map(hospital => (
                  <div
                    key={hospital.id}
                    onClick={() => handleHospitalClick(hospital.id)}
                    className="bg-white border border-slate-200 rounded-xl hover:shadow-lg hover:border-slate-300 transition-all duration-300 cursor-pointer overflow-hidden"
                  >
                    {/* Top accent */}
                    <div className="h-1 bg-gradient-to-r from-blue-500 to-emerald-500" />
                    <div className="p-5">
                      <div className="flex items-start gap-4">
                        {/* Logo */}
                        {hospital.logo_url ? (
                          <img src={hospital.logo_url} alt={hospital.name} className="w-16 h-16 rounded-xl object-cover flex-shrink-0 border border-slate-100" />
                        ) : (
                          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center flex-shrink-0 text-white text-2xl font-black">
                            {hospital.name.charAt(0)}
                          </div>
                        )}

                        {/* Main Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 flex-wrap mb-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="text-base font-bold text-slate-900">{hospital.name}</h3>
                              {hospital.status === 'active' && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 border border-emerald-200 rounded-full text-xs font-semibold text-emerald-700">
                                  <ShieldCheck className="w-3 h-3" /> Verified
                                </span>
                              )}
                              {hospital.accreditations?.length > 0 && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 border border-blue-200 rounded-full text-xs font-semibold text-blue-700">
                                  <Award className="w-3 h-3" />{hospital.accreditations[0]}
                                </span>
                              )}
                            </div>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleHospitalClick(hospital.id); }}
                              className="px-4 py-2 bg-slate-900 text-white rounded-lg font-bold text-sm hover:bg-slate-800 transition-colors whitespace-nowrap flex-shrink-0"
                            >
                              View Details
                            </button>
                          </div>

                          <div className="flex items-center gap-1 text-slate-500 text-sm mb-2">
                            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                            <span>{hospital.address || hospital.city}{hospital.state ? `, ${hospital.state}` : ''}{hospital.country ? `, ${hospital.country}` : ''}</span>
                          </div>

                          {hospital.description && (
                            <p className="text-xs text-slate-500 mb-2 line-clamp-2">{hospital.description}</p>
                          )}

                          {/* Contact */}
                          <div className="flex flex-wrap gap-3 text-xs text-slate-500 mb-3">
                            {hospital.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{hospital.phone}</span>}
                            {hospital.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{hospital.email}</span>}
                            {hospital.website_url && <span className="flex items-center gap-1 text-blue-600"><Globe className="w-3 h-3" />Website</span>}
                            {hospital.bed_capacity && <span className="flex items-center gap-1"><Bed className="w-3 h-3" />{hospital.bed_capacity} beds</span>}
                            {hospital.established_year && <span>Est. {hospital.established_year}</span>}
                          </div>

                          {/* Specialties */}
                          {(hospital.specialties || []).length > 0 && (
                            <div className="mb-2">
                              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                                <Stethoscope className="w-3 h-3" /> Specializations
                              </p>
                              <div className="flex flex-wrap gap-1.5">
                                {(hospital.specialties || []).map((spec: string, i: number) => (
                                  <span key={i} className="px-2.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-100 text-xs font-medium rounded-full">{spec}</span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Accreditations */}
                          {(hospital.accreditations || []).length > 1 && (
                            <div>
                              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                                <Award className="w-3 h-3" /> Accreditations
                              </p>
                              <div className="flex flex-wrap gap-1.5">
                                {(hospital.accreditations || []).map((acc: string, i: number) => (
                                  <span key={i} className="px-2.5 py-0.5 bg-amber-50 text-amber-700 border border-amber-100 text-xs font-medium rounded-full">{acc}</span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
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
                      ? `No hospitals found for "${condition}" in "${location}".`
                      : condition
                      ? `No hospitals found for "${condition}".`
                      : location
                      ? `No hospitals found in "${location}".`
                      : 'Try adjusting your search criteria.'}
                  </p>
                </div>
              </div>
            )}
            </>
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
