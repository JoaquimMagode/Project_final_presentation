import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { hospitalsAPI } from '../services/api';
import {
  Search, MapPin, ShieldCheck, Lock, Bed, Phone,
  Mail, Globe, Award, Stethoscope, SlidersHorizontal,
  ArrowRight, ChevronRight,
} from 'lucide-react';

const GUEST_LIMIT = 3;

/* shared input style */
const selectCls = `w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-700
  focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all
  appearance-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed`;

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

          {/* ── Search form ── */}
          <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6">
            <form onSubmit={handleSearch}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* State */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> State
                  </label>
                  <select value={selectedState} onChange={e => handleStateChange(e.target.value)} className={selectCls}>
                    <option value="">All States</option>
                    {states.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                {/* City */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> City
                  </label>
                  <select value={selectedCity} onChange={e => handleCityChange(e.target.value)} disabled={!selectedState} className={selectCls}>
                    <option value="">{selectedState ? 'All Cities' : 'Select state first'}</option>
                    {cities.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                {/* Specialization */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-1">
                    <Stethoscope className="w-3 h-3" /> Specialty
                  </label>
                  <select value={selectedSpec} onChange={e => setSelectedSpec(e.target.value)} disabled={!selectedState} className={selectCls}>
                    <option value="">All Specialties</option>
                    {specs.map(sp => <option key={sp} value={sp}>{sp}</option>)}
                  </select>
                </div>

                {/* Submit */}
                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full h-[46px] bg-emerald-600 hover:bg-emerald-700 text-white font-semibold
                               rounded-xl transition-colors shadow-sm hover:shadow-md flex items-center
                               justify-center gap-2 text-sm"
                  >
                    <Search className="w-4 h-4" /> Search Hospitals
                  </button>
                </div>
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
              /* skeleton loader */
              <div className="space-y-4">
                {[1, 2, 3].map(n => (
                  <div key={n} className="bg-white rounded-2xl border border-slate-100 p-5 space-y-3">
                    <div className="flex gap-4">
                      <div className="skeleton w-16 h-16 rounded-xl" />
                      <div className="flex-1 space-y-2 pt-1">
                        <div className="skeleton h-4 w-48 rounded-md" />
                        <div className="skeleton h-3 w-32 rounded-md" />
                        <div className="skeleton h-3 w-56 rounded-md" />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {[80, 100, 70, 90].map(w => (
                        <div key={w} className={`skeleton h-5 rounded-full`} style={{ width: w }} />
                      ))}
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

                {/* cards */}
                <div className="space-y-4">
                  {visibleHospitals.map(hospital => (
                    <div
                      key={hospital.id}
                      onClick={() => navigate(`/hospital/${hospital.id}`)}
                      className="group bg-white rounded-2xl border border-slate-100 shadow-sm
                                 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer overflow-hidden"
                    >
                      {/* top accent */}
                      <div className="h-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-blue-400" />

                      <div className="p-5 sm:p-6">
                        <div className="flex items-start gap-4">
                          {/* Logo */}
                          {hospital.logo_url ? (
                            <img
                              src={hospital.logo_url}
                              alt={hospital.name}
                              className="w-16 h-16 rounded-xl object-cover border border-slate-100 shadow-sm flex-shrink-0"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600
                                           flex items-center justify-center flex-shrink-0 text-white text-2xl font-black shadow-sm">
                              {hospital.name.charAt(0)}
                            </div>
                          )}

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            {/* title row */}
                            <div className="flex items-start justify-between gap-3 flex-wrap mb-1.5">
                              <div className="flex items-center gap-2 flex-wrap min-w-0">
                                <h3 className="text-base font-bold text-slate-900 truncate">{hospital.name}</h3>
                                {hospital.status === 'active' && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 border border-emerald-200 rounded-full text-[11px] font-semibold text-emerald-700">
                                    <ShieldCheck className="w-3 h-3" /> Verified
                                  </span>
                                )}
                                {hospital.accreditations?.length > 0 && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 border border-blue-200 rounded-full text-[11px] font-semibold text-blue-700">
                                    <Award className="w-3 h-3" />{hospital.accreditations[0]}
                                  </span>
                                )}
                              </div>
                              <button
                                onClick={e => { e.stopPropagation(); navigate(`/hospital/${hospital.id}`); }}
                                className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-emerald-600
                                           text-white text-xs font-bold rounded-xl transition-colors whitespace-nowrap
                                           flex-shrink-0 group-hover:bg-emerald-600"
                              >
                                View Details <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* location */}
                            <div className="flex items-center gap-1 text-slate-500 text-sm mb-2">
                              <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                              <span className="truncate">
                                {hospital.address || hospital.city}
                                {hospital.state   ? `, ${hospital.state}`   : ''}
                                {hospital.country ? `, ${hospital.country}` : ''}
                              </span>
                            </div>

                            {hospital.description && (
                              <p className="text-xs text-slate-500 mb-3 line-clamp-2 leading-relaxed">{hospital.description}</p>
                            )}

                            {/* contact chips */}
                            <div className="flex flex-wrap gap-2 text-xs text-slate-500 mb-3">
                              {hospital.phone       && <span className="flex items-center gap-1 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-full"><Phone  className="w-3 h-3" />{hospital.phone}</span>}
                              {hospital.email       && <span className="flex items-center gap-1 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-full"><Mail   className="w-3 h-3" />{hospital.email}</span>}
                              {hospital.website_url && <span className="flex items-center gap-1 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full text-blue-600"><Globe  className="w-3 h-3" />Website</span>}
                              {hospital.bed_capacity  && <span className="flex items-center gap-1 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-full"><Bed    className="w-3 h-3" />{hospital.bed_capacity} beds</span>}
                              {hospital.established_year && <span className="bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-full">Est. {hospital.established_year}</span>}
                            </div>

                            {/* specialties */}
                            {(hospital.specialties || []).length > 0 && (
                              <div className="mb-2">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                                  <Stethoscope className="w-3 h-3" /> Specializations
                                </p>
                                <div className="flex flex-wrap gap-1.5">
                                  {(hospital.specialties || []).map((spec: string, i: number) => (
                                    <span key={i} className="px-2.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-100 text-[11px] font-medium rounded-full">{spec}</span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* accreditations */}
                            {(hospital.accreditations || []).length > 1 && (
                              <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                                  <Award className="w-3 h-3" /> Accreditations
                                </p>
                                <div className="flex flex-wrap gap-1.5">
                                  {(hospital.accreditations || []).map((acc: string, i: number) => (
                                    <span key={i} className="px-2.5 py-0.5 bg-amber-50 text-amber-700 border border-amber-100 text-[11px] font-medium rounded-full">{acc}</span>
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
