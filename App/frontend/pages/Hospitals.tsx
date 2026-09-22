import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { hospitalsAPI } from '../services/api';
import {
  Search, MapPin, ShieldCheck, Lock, Award, Stethoscope,
  SlidersHorizontal, ArrowRight, ChevronRight,
} from 'lucide-react';

const GUEST_LIMIT = 3;

const Hospitals: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('user');

  const [filtersMap, setFiltersMap]     = useState<Record<string, Record<string, string[]>>>({});
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity]   = useState('');
  const [selectedSpec, setSelectedSpec]   = useState('');
  const [filteredHospitals, setFilteredHospitals] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading]         = useState(false);

  /* derived filter options */
  const states = Object.keys(filtersMap).sort();
  const cities  = selectedState ? Object.keys(filtersMap[selectedState] || {}).sort() : [];
  const specs   = selectedState && selectedCity
    ? (filtersMap[selectedState]?.[selectedCity] || [])
    : selectedState
    ? [...new Set(Object.values(filtersMap[selectedState] || {}).flat())].sort()
    : [];

  useEffect(() => {
    hospitalsAPI.getFilters().then(setFiltersMap).catch(() => {});
  }, []);

  const fetchHospitals = async (state: string, city: string, spec: string) => {
    setLoading(true);
    try {
      const res: any = await hospitalsAPI.searchHospitals({
        state: state || undefined,
        location: city || undefined,
        specialization: spec || undefined,
      });
      setFilteredHospitals(res?.data?.hospitals || []);
    } catch {
      setFilteredHospitals([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const destination = searchParams.get('destination') || '';
    const procedure   = searchParams.get('procedure')   || '';
    setSelectedCity(destination);
    setSelectedSpec(procedure);
    setHasSearched(true);
    fetchHospitals('', destination, procedure);
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    fetchHospitals(selectedState, selectedCity, selectedSpec);
  };

  const handleStateChange = (state: string) => { setSelectedState(state); setSelectedCity(''); setSelectedSpec(''); };
  const handleCityChange  = (city: string)  => { setSelectedCity(city); setSelectedSpec(''); };

  const visibleHospitals = isLoggedIn ? filteredHospitals : filteredHospitals.slice(0, GUEST_LIMIT);

  return (
    <div className="animate-in">

      {/* ═══════════════════════════════════════
          HERO + SEARCH
      ═══════════════════════════════════════ */}
      <section className="relative bg-white border-b border-slate-100 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-white to-blue-50/30 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12">
          {/* breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-slate-400 mb-6" aria-label="Breadcrumb">
            <span className="hover:text-slate-600 cursor-pointer" onClick={() => navigate('/')}>Home</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-slate-600 font-medium">Hospitals</span>
          </nav>

          <div className="max-w-3xl space-y-3 mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full text-xs font-semibold text-emerald-700">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Filter by city, state, or specialty
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900">
              Find the Right<br />
              <span className="gradient-text">Hospital for You</span>
            </h1>
            <p className="text-slate-500 text-lg">Search India's top JCI & NABH-accredited medical facilities</p>
          </div>

          {/* ── Search form (inline, matches Patient dashboard) ── */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Search className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-bold text-gray-900">Filter Hospitals</span>
              {(selectedState || selectedCity || selectedSpec) && (
                <span className="ml-auto text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  {[selectedState, selectedCity, selectedSpec].filter(Boolean).length} active
                </span>
              )}
            </div>
            <form onSubmit={handleSearch}>
              <div className="flex flex-col md:flex-row md:items-center gap-3">
                {/* State */}
                <div className="relative flex-1 min-w-[150px]">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <select value={selectedState} onChange={e => handleStateChange(e.target.value)}
                    className="w-full pl-9 pr-8 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm appearance-none bg-white cursor-pointer">
                    <option value="">All States ({states.length})</option>
                    {states.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                {/* City */}
                <div className="relative flex-1 min-w-[150px]">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <select value={selectedCity} onChange={e => handleCityChange(e.target.value)} disabled={!selectedState}
                    className="w-full pl-9 pr-8 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm appearance-none bg-white disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                    <option value="">{selectedState ? `All Cities (${cities.length})` : 'City'}</option>
                    {cities.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                {/* Specialization */}
                <div className="relative flex-1 min-w-[150px]">
                  <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <select value={selectedSpec} onChange={e => setSelectedSpec(e.target.value)} disabled={!selectedState}
                    className="w-full pl-9 pr-8 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm appearance-none bg-white disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                    <option value="">{selectedState ? `All Specializations (${specs.length})` : 'Specialization'}</option>
                    {specs.map(sp => <option key={sp} value={sp}>{sp}</option>)}
                  </select>
                </div>

                {/* Submit */}
                <button type="submit"
                  className="bg-emerald-600 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 text-sm flex-shrink-0">
                  <Search className="w-4 h-4" /> Search
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          RESULTS
      ═══════════════════════════════════════ */}
      {hasSearched && (
        <section className="py-8 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">

            {loading ? (
              /* skeleton loader — grid */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                {[1, 2, 3, 4, 5].map(n => (
                  <div key={n} className="bg-white rounded-2xl border border-gray-200 overflow-hidden animate-pulse">
                    <div className="h-36 bg-gray-100" />
                    <div className="p-5 space-y-2">
                      <div className="h-4 bg-gray-100 rounded w-2/3" />
                      <div className="h-3 bg-gray-100 rounded w-1/2" />
                      <div className="h-3 bg-gray-100 rounded w-full" />
                      <div className="h-6 bg-gray-100 rounded w-1/3 mt-3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredHospitals.length > 0 ? (
              <>
                {/* result count */}
                <div className="flex items-center justify-between mb-6">
                  <p className="text-sm text-slate-500">
                    Showing <span className="font-bold text-slate-900">{visibleHospitals.length}</span>
                    {!isLoggedIn && ` of ${filteredHospitals.length}`} hospitals
                    {selectedCity && <> in <span className="font-bold text-slate-900">{selectedCity}</span></>}
                  </p>
                  {!isLoggedIn && (
                    <span className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-full px-3 py-1 font-semibold">
                      Sign in to see all results
                    </span>
                  )}
                </div>

                {/* cards — grid, matches Patient dashboard */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                  {visibleHospitals.map(hospital => {
                    const loc = [hospital.city, hospital.state].filter(Boolean).join(', ');
                    const isAccredited = (hospital.accreditations || []).length > 0;
                    return (
                      <div
                        key={hospital.id}
                        onClick={() => navigate(`/hospital/${hospital.id}`)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate(`/hospital/${hospital.id}`); } }}
                        className="group cursor-pointer bg-white rounded-sm border border-gray-200 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all overflow-hidden flex flex-col focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                      >
                        {/* Image / banner */}
                        <div className="relative h-36 bg-gradient-to-br from-emerald-500 to-emerald-700 overflow-hidden">
                          {hospital.logo_url ? (
                            <img src={hospital.logo_url} alt={hospital.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center relative">
                              <MapPin className="w-12 h-12 text-white/40" />
                              <span className="absolute text-5xl font-black text-white/90">{hospital.name.charAt(0)}</span>
                            </div>
                          )}
                          <div className="absolute top-3 left-3">
                            <span className="text-white drop-shadow" title={isAccredited ? 'Accredited' : 'Verified'}>
                              <ShieldCheck className="w-5 h-5" />
                            </span>
                          </div>
                        </div>

                        {/* Body */}
                        <div className="p-5 flex flex-col flex-1">
                          <h3 className="font-bold text-gray-900 leading-tight line-clamp-1">{hospital.name}</h3>
                          <p className="text-gray-400 text-xs flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3 flex-shrink-0" /> {loc || 'India'}
                          </p>
                          <p className="text-sm text-gray-500 mt-2 line-clamp-2 leading-relaxed min-h-[40px]">
                            {hospital.description || `${hospital.name} is part of our accredited hospital network${loc ? ` in ${loc}` : ''}.`}
                          </p>

                          {(hospital.specialties || []).length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-3">
                              {(hospital.specialties || []).slice(0, 3).map((s: string, i: number) => (
                                <span key={i} className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-bold px-2 py-0.5 rounded-md">{s}</span>
                              ))}
                              {(hospital.specialties || []).length > 3 && (
                                <span className="bg-gray-100 text-gray-500 text-[10px] font-bold px-2 py-0.5 rounded-md">+{(hospital.specialties || []).length - 3} more</span>
                              )}
                            </div>
                          )}

                          {isAccredited && (
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {(hospital.accreditations || []).slice(0, 2).map((a: string, i: number) => (
                                <span key={i} className="text-[10px] font-semibold text-gray-500 flex items-center gap-1">
                                  <Award className="w-3 h-3 text-amber-500" /> {a}
                                </span>
                              ))}
                            </div>
                          )}

                          <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-100 mt-4">
                            <div className="flex items-center gap-1.5 text-xs">
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                              <span className="font-semibold text-gray-700">Accredited</span>
                            </div>
                            <button
                              onClick={(e) => { e.stopPropagation(); navigate(`/hospital/${hospital.id}`); }}
                              aria-label="View details"
                              className="flex items-center justify-center p-2 text-emerald-600 hover:text-emerald-700 group-hover:translate-x-0.5 transition-all">
                              <ArrowRight className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Guest gate */}
                {!isLoggedIn && filteredHospitals.length > GUEST_LIMIT && (
                  <div className="mt-8 bg-white rounded-2xl border border-slate-100 shadow-sm p-8 text-center space-y-4">
                    <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto">
                      <Lock className="w-7 h-7 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-lg font-bold text-slate-900">See all {filteredHospitals.length} hospitals</p>
                      <p className="text-sm text-slate-500 mt-1">Create a free account to unlock full listings, direct contact, and booking.</p>
                    </div>
                    <div className="flex gap-3 justify-center">
                      <button onClick={() => navigate('/register')} className="btn-primary">
                        Register Free <ArrowRight className="w-4 h-4" />
                      </button>
                      <button onClick={() => navigate('/login')} className="btn-secondary">
                        Sign In
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              /* Empty state */
              <div className="py-20 text-center space-y-4">
                <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto">
                  <Search className="w-9 h-9 text-slate-300" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">No hospitals found</h3>
                  <p className="text-sm text-slate-500 mt-1 max-w-xs mx-auto">
                    Try adjusting your filters — selecting a broader state or removing the specialty filter often helps.
                  </p>
                </div>
                <button
                  onClick={() => { setSelectedState(''); setSelectedCity(''); setSelectedSpec(''); fetchHospitals('', '', ''); }}
                  className="btn-secondary mx-auto"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════
          HOW IT WORKS
      ═══════════════════════════════════════ */}
      <section className="py-16 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mb-10">
            <div className="section-divider" />
            <h2 className="text-3xl font-bold text-slate-900">How It Works</h2>
            <p className="text-slate-500 mt-2 text-sm max-w-lg">Simple steps to find and connect with the right hospital</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { step: '01', title: 'Search & Filter',   desc: 'Enter your condition and location to find matching hospitals.' },
              { step: '02', title: 'Compare Options',   desc: 'Review ratings, specializations, and response times.' },
              { step: '03', title: 'Request Opinion',   desc: 'Connect directly with specialists for a consultation.' },
              { step: '04', title: 'Get Full Support',  desc: 'Visa, travel, and accommodation assistance included.' },
            ].map((item, i) => (
              <div key={item.step} className="relative bg-slate-50 rounded-2xl p-6 border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/30 transition-colors">
                {i < 3 && <div className="hidden lg:block absolute top-8 -right-2.5 w-5 h-0.5 bg-slate-200 z-10" />}
                <span className="text-3xl font-black text-slate-200 mb-4 block">{item.step}</span>
                <h3 className="text-base font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hospitals;
