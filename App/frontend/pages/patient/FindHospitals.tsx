import React, { useState, useEffect } from 'react';
import { Search, MapPin, Clock, ShieldCheck, Building2, AlertCircle } from 'lucide-react';
import { hospitalsAPI } from '../../services/api';
import HospitalDetailsModal from './HospitalDetailsModal';

const FindHospitals: React.FC = () => {
  const [city, setCity] = useState('');
  const [procedure, setProcedure] = useState('');
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [filteredHospitals, setFilteredHospitals] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedHospitalId, setSelectedHospitalId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const indianCities = [
    'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata', 'Ahmedabad',
    'New Delhi', 'Mohali', 'Karnataka', 'Tamil Nadu', 'Punjab'
  ];

  const medicalProcedures = [
    'Cardiology', 'Orthopedics', 'Neurology & Neurosurgery', 'Obstetrics & Gynecology',
    'Urology', 'Dermatology', 'Primary Care Physician', 'Cancer Treatment',
    'Cardiac Surgery', 'Orthopedic Surgery', 'Neurosurgery', 'Kidney Transplant',
    'Liver Transplant', 'Eye Surgery', 'Cosmetic Surgery', 'Dental Treatment',
    'IVF Treatment', 'Spine Surgery', 'Joint Replacement'
  ];

  useEffect(() => {
    fetchAllHospitals();
  }, []);

  const fetchAllHospitals = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await hospitalsAPI.getHospitals({ limit: 100 });
      if (response.success) {
        setHospitals(response.data.hospitals || []);
      } else {
        setError('Failed to load hospitals');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load hospitals');
      console.error('Error fetching hospitals:', err);
    } finally {
      setLoading(false);
    }
  };

  const searchHospitals = async () => {
    try {
      setLoading(true);
      setError('');
      
      let searchParams: any = {};
      
      if (city) {
        searchParams.city = city;
      }
      if (procedure) {
        searchParams.specialization = procedure;
      }
      
      const response = city || procedure 
        ? await hospitalsAPI.searchHospitals(searchParams)
        : await hospitalsAPI.getHospitals({ limit: 100 });
        
      if (response.success) {
        setFilteredHospitals(response.data.hospitals || []);
      } else {
        setError('Failed to search hospitals');
        setFilteredHospitals([]);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to search hospitals');
      setFilteredHospitals([]);
      console.error('Error searching hospitals:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    await searchHospitals();
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

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2 text-red-700">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Searching hospitals...</p>
        </div>
      )}

      {/* Results */}
      {hasSearched && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Search Results ({filteredHospitals.length} hospitals found)
            </h2>
          </div>

          {!loading && filteredHospitals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredHospitals.map(hospital => (
                <div key={hospital.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-8 h-8 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-bold text-gray-900">{hospital.name}</h3>
                        <div className="text-right">
                          <div className="text-xl font-bold text-gray-900">4.5</div>
                          <div className="text-xs text-gray-500">Rating</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 text-gray-600 mb-3">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{hospital.city}, {hospital.state}</span>
                      </div>

                      <div className="text-sm text-gray-600 mb-3">
                        {hospital.address}
                      </div>

                      {hospital.specialties && hospital.specialties.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {hospital.specialties.slice(0, 2).map((spec: string, i: number) => (
                            <span key={i} className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                              {spec}
                            </span>
                          ))}
                          {hospital.specialties.length > 2 && (
                            <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full">
                              +{hospital.specialties.length - 2} more
                            </span>
                          )}
                        </div>
                      )}

                      {hospital.phone && (
                        <div className="flex items-center gap-2 text-gray-600 mb-4">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm">{hospital.phone}</span>
                        </div>
                      )}

                      <button 
                        onClick={() => handleViewDetails(hospital.id.toString())}
                        className="w-full bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        View Details & Book Appointment
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : hasSearched && !loading ? (
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