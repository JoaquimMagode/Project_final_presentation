import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MOCK_HOSPITALS } from '../constants';
import { searchService, SearchFilters } from '../services/searchService';
import { Search, MapPin, ArrowRight, Clock, ShieldCheck, ChevronDown, X, Sliders } from 'lucide-react';

const HospitalsAdvanced: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState<SearchFilters>({});
  const [filteredHospitals, setFilteredHospitals] = useState<typeof MOCK_HOSPITALS>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'rating' | 'responseTime' | 'name'>('rating');
  const [minRating, setMinRating] = useState(0);
  const [diseaseInput, setDiseaseInput] = useState('');
  const [diseaseSuggestions, setDiseaseSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const allSpecializations = searchService.getAllSpecializations(MOCK_HOSPITALS);
  const allLocations = searchService.getAllLocations(MOCK_HOSPITALS);

  // Load search parameters from URL
  useEffect(() => {
    const destination = searchParams.get('destination') || '';
    const procedure = searchParams.get('procedure') || '';
    
    if (destination || procedure) {
      setFilters({
        disease: procedure || destination,
        location: destination,
      });
    }
  }, [searchParams]);

  // Update filtered hospitals when filters change
  useEffect(() => {
    let results = searchService.filterHospitals(MOCK_HOSPITALS, filters);
    results = searchService.sortHospitals(results, sortBy);
    setFilteredHospitals(results);
  }, [filters, sortBy]);

  // Handle disease input with suggestions
  const handleDiseaseChange = (value: string) => {
    setDiseaseInput(value);
    if (value.length > 0) {
      const suggestions = searchService.getDiseaseSuggestions(value);
      setDiseaseSuggestions(suggestions);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSelectDisease = (disease: string) => {
    setDiseaseInput(disease);
    setFilters(prev => ({ ...prev, disease }));
    setShowSuggestions(false);
  };

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined
    }));
  };

  const clearFilters = () => {
    setFilters({});
    setDiseaseInput('');
    setMinRating(0);
    setSortBy('rating');
  };

  const activeFilterCount = Object.values(filters).filter(v => v).length;

  return (
    <div>
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-br from-slate-900 to-slate-800 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-serif text-white text-center mb-12">Find Hospitals & Doctors</h1>
          
          {/* Main Search Form */}
          <div className="bg-white rounded-lg p-8 mb-8">
            <form className="flex flex-col md:flex-row gap-4 mb-6">
              {/* Disease/Condition Search */}
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search by disease or condition..."
                  value={diseaseInput}
                  onChange={(e) => handleDiseaseChange(e.target.value)}
                  onFocus={() => diseaseInput.length > 0 && setShowSuggestions(true)}
                  className="w-full px-4 py-3 border border-slate-300 rounded outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
                />
                {showSuggestions && diseaseSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-300 rounded shadow-lg z-10">
                    {diseaseSuggestions.map((disease, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectDisease(disease)}
                        className="w-full text-left px-4 py-2 hover:bg-slate-100 transition-colors text-sm"
                      >
                        {disease}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Location Search */}
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="City or location..."
                  value={filters.location || ''}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
                />
                <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />
              </div>

              {/* Search Button */}
              <button
                type="button"
                className="px-8 py-3 bg-black text-white rounded font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
              >
                <Search className="w-5 h-5" />
                Search
              </button>
            </form>

            {/* Quick Filters */}
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm font-bold text-slate-700">Quick Filters:</span>
              {['Cardiology', 'Orthopedics', 'Neurology', 'Oncology'].map((spec, i) => (
                <button
                  key={i}
                  onClick={() => handleFilterChange('specialization', spec)}
                  className={`text-sm font-semibold px-3 py-1 rounded-full transition-colors ${
                    filters.specialization === spec
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-700 hover:text-slate-900 pb-1 border-b-2 border-transparent hover:border-slate-900'
                  }`}
                >
                  {spec}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="w-full bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          {/* Filters & Sorting Bar */}
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <h2 className="text-3xl font-bold text-slate-900">Results</h2>
              <span className="text-sm font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                {filteredHospitals.length}
              </span>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2 border border-slate-300 rounded font-semibold text-sm outline-none focus:ring-2 focus:ring-slate-900"
              >
                <option value="rating">Sort by Rating</option>
                <option value="responseTime">Sort by Response Time</option>
                <option value="name">Sort by Name</option>
              </select>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 rounded font-semibold text-sm transition-colors ${
                  showFilters
                    ? 'bg-slate-900 text-white'
                    : 'border border-slate-300 text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Sliders className="w-4 h-4" />
                Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
              </button>

              {/* Clear Filters */}
              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-sm font-semibold text-red-600 hover:text-red-700"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>

          {/* Advanced Filters Panel */}
          {showFilters && (
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Specialization Filter */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-slate-600">Specialization</label>
                  <select
                    value={filters.specialization || ''}
                    onChange={(e) => handleFilterChange('specialization', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded outline-none focus:ring-2 focus:ring-slate-900 text-sm"
                  >
                    <option value="">All Specializations</option>
                    {allSpecializations.map(spec => (
                      <option key={spec} value={spec}>{spec}</option>
                    ))}
                  </select>
                </div>

                {/* Location Filter */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-slate-600">Location</label>
                  <select
                    value={filters.location || ''}
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded outline-none focus:ring-2 focus:ring-slate-900 text-sm"
                  >
                    <option value="">All Locations</option>
                    {allLocations.map(loc => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>

                {/* Minimum Rating Filter */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-slate-600">Minimum Rating</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="0"
                      max="5"
                      step="0.5"
                      value={filters.minRating || 0}
                      onChange={(e) => handleFilterChange('minRating', parseFloat(e.target.value))}
                      className="flex-1"
                    />
                    <span className="text-sm font-bold text-slate-900 w-8">{filters.minRating || 0}</span>
                  </div>
                </div>

                {/* Response Time Filter */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-slate-600">Max Response Time</label>
                  <select
                    value={filters.maxResponseTime || ''}
                    onChange={(e) => handleFilterChange('maxResponseTime', e.target.value ? parseInt(e.target.value) : undefined)}
                    className="w-full px-3 py-2 border border-slate-300 rounded outline-none focus:ring-2 focus:ring-slate-900 text-sm"
                  >
                    <option value="">Any Time</option>
                    <option value="30">Within 30 minutes</option>
                    <option value="60">Within 1 hour</option>
                    <option value="120">Within 2 hours</option>
                    <option value="240">Within 4 hours</option>
                  </select>
                </div>
              </div>
            </div>
          )}

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
                      <span className="text-sm font-semibold">Response: {hospital.responseTime}</span>
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
                <p className="text-slate-500 text-sm mt-2">Try adjusting your search criteria or filters.</p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default HospitalsAdvanced;
