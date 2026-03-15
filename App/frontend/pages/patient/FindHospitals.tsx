import React, { useState, useEffect } from 'react';
import { MOCK_HOSPITALS } from '../../constants';
import { Search, MapPin, Clock, ShieldCheck, Building2 } from 'lucide-react';
import HospitalDetailsModal from './HospitalDetailsModal';

const FindHospitals: React.FC = () => {
  const [city, setCity] = useState('');
  const [procedure, setProcedure] = useState('');
  const [filteredHospitals, setFilteredHospitals] = useState<typeof MOCK_HOSPITALS>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedHospitalId, setSelectedHospitalId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const indianCities = [
    'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata', 'Ahmedabad'
  ];

  const medicalProcedures = [
    'Cardiology', 'Orthopedics', 'Neurology & Neurosurgery', 'Obstetrics & Gynecology',
    'Urology', 'Dermatology', 'Primary Care Physician', 'Cancer Treatment',
    'Cardiac Surgery', 'Orthopedic Surgery', 'Neurosurgery', 'Kidney Transplant',
    'Liver Transplant', 'Eye Surgery', 'Cosmetic Surgery', 'Dental Treatment',
    'IVF Treatment', 'Spine Surgery', 'Joint Replacement'
  ];

  useEffect(() => {
    if (hasSearched) {
      let filtered = MOCK_HOSPITALS;
      
      // If no filters are applied, show all hospitals
      if (!city && !procedure) {
        setFilteredHospitals(filtered);
        return;
      }
      
      if (city) {
        filtered = filtered.filter(h => 
          h.location.toLowerCase().includes(city.toLowerCase())
        );
      }
      
      if (procedure) {
        // More flexible matching for procedures
        filtered = filtered.filter(h => 
          h.specializations.some(s => {
            const spec = s.toLowerCase();
            const proc = procedure.toLowerCase();
            
            // Direct match
            if (spec.includes(proc)) return true;
            
            // Special mappings for common searches
            if (proc.includes('cardiac') && spec.includes('cardiology')) return true;
            if (proc.includes('orthopedic') && spec.includes('orthopedics')) return true;
            if (proc.includes('neuro') && spec.includes('neurology')) return true;
            if (proc.includes('gynec') && spec.includes('obstetrics')) return true;
            if (proc.includes('primary') && spec.includes('primary care')) return true;
            
            return false;
          })
        );
      }
      
      setFilteredHospitals(filtered);
    }
  }, [city, procedure, hasSearched]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
  };

  const handleViewDetails = (hospitalId: string) => {
    setSelectedHospitalId(hospitalId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedHospitalId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Find Hospitals</h1>
        <p className="text-gray-600">Search for hospitals by city and medical procedure</p>
      </div>

      {/* Search Form */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                City in India
              </label>
              <select 
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="">Select a city</option>
                {indianCities.map(cityName => (
                  <option key={cityName} value={cityName}>{cityName}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Building2 className="w-4 h-4 inline mr-1" />
                Medical Procedure
              </label>
              <select 
                value={procedure}
                onChange={(e) => setProcedure(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="">Select a procedure</option>
                {medicalProcedures.map(proc => (
                  <option key={proc} value={proc}>{proc}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button 
              type="submit"
              className="flex-1 bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <Search className="w-5 h-5" />
              {city || procedure ? 'Search Hospitals' : 'Show All Hospitals'}
            </button>
            
            {(city || procedure) && (
              <button 
                type="button"
                onClick={() => {
                  setCity('');
                  setProcedure('');
                  setHasSearched(false);
                }}
                className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Results */}
      {hasSearched && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Search Results ({filteredHospitals.length} hospitals found)
            </h2>
          </div>

          {filteredHospitals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredHospitals.map(hospital => (
                <div key={hospital.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <img 
                      src={hospital.logo} 
                      alt={hospital.name}
                      className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-bold text-gray-900">{hospital.name}</h3>
                        <div className="text-right">
                          <div className="text-xl font-bold text-gray-900">{hospital.rating}</div>
                          <div className="text-xs text-gray-500">Rating</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 text-gray-600 mb-3">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{hospital.location}</span>
                      </div>

                      <div className="flex items-center gap-2 text-gray-600 mb-3">
                        <ShieldCheck className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-green-600">{hospital.accreditation}</span>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-3">
                        {hospital.specializations.slice(0, 2).map((spec, i) => (
                          <span key={i} className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                            {spec}
                          </span>
                        ))}
                        {hospital.specializations.length > 2 && (
                          <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full">
                            +{hospital.specializations.length - 2} more
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-gray-600 mb-4">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">Response: {hospital.responseTime}</span>
                      </div>

                      <button 
                        onClick={() => handleViewDetails(hospital.id)}
                        className="w-full bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        View Details & Book Appointment
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No hospitals found</h3>
              <p className="text-gray-600">
                {city && procedure 
                  ? `No hospitals found for "${procedure}" in "${city}". Try adjusting your search criteria.`
                  : city
                  ? `No hospitals found in "${city}". Try selecting a different city.`
                  : procedure
                  ? `No hospitals found for "${procedure}". Try selecting a different procedure.`
                  : 'Please select a city or procedure to search for hospitals.'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Hospital Details Modal */}
      {selectedHospitalId && (
        <HospitalDetailsModal
          hospitalId={selectedHospitalId}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default FindHospitals;