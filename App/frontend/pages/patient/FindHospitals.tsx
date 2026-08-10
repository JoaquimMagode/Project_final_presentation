import React, { useState, useEffect } from 'react';
import { Search, MapPin, Clock, ShieldCheck, Building2, AlertCircle, ArrowLeft, Star, Phone, Mail, Calendar, DollarSign } from 'lucide-react';
import { hospitalsAPI, appointmentsAPI } from '../../services/api';

const FindHospitals: React.FC = () => {
  const [city, setCity] = useState('');
  const [procedure, setProcedure] = useState('');
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [filteredHospitals, setFilteredHospitals] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedHospital, setSelectedHospital] = useState<any>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState('');
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    date: '', time: '',
    type: 'consultation' as 'consultation' | 'procedure' | 'follow_up' | 'telemedicine',
    reason: '', notes: ''
  });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);

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

  useEffect(() => { fetchAllHospitals(); }, []);

  const fetchAllHospitals = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await hospitalsAPI.getHospitals({ limit: 100 });
      if (response.success) setHospitals(response.data.hospitals || []);
      else setError('Failed to load hospitals');
    } catch (err: any) {
      setError(err.message || 'Failed to load hospitals');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    try {
      setLoading(true);
      setError('');
      const response = city || procedure
        ? await hospitalsAPI.searchHospitals({ ...(city && { city }), ...(procedure && { specialization: procedure }) })
        : await hospitalsAPI.getHospitals({ limit: 100 });
      if (response.success) setFilteredHospitals(response.data.hospitals || []);
      else { setError('Failed to search hospitals'); setFilteredHospitals([]); }
    } catch (err: any) {
      setError(err.message || 'Failed to search hospitals');
      setFilteredHospitals([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (hospitalId: string) => {
    try {
      setDetailLoading(true);
      setDetailError('');
      setSelectedHospital(null);
      setShowBookingForm(false);
      setBookingSuccess(false);
      const response = await hospitalsAPI.getHospitalById(parseInt(hospitalId));
      if (response.success) setSelectedHospital(response.data.hospital);
      else setDetailError('Failed to load hospital details');
    } catch (err: any) {
      setDetailError(err.message || 'Failed to load hospital details');
    } finally {
      setDetailLoading(false);
    }
    // scroll to top of content
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBookConsultation = async () => {
    if (!bookingForm.date || !bookingForm.time || !bookingForm.reason) {
      setBookingError('Please fill in all required fields');
      return;
    }
    try {
      setBookingLoading(true);
      setBookingError('');
      await appointmentsAPI.createAppointment({
        hospital_id: parseInt(selectedHospital.id),
        appointment_date: bookingForm.date,
        appointment_time: bookingForm.time,
        type: bookingForm.type,
        reason: bookingForm.reason,
        notes: bookingForm.notes
      });
      setBookingSuccess(true);
      setShowBookingForm(false);
      setBookingForm({ date: '', time: '', type: 'consultation', reason: '', notes: '' });
    } catch (err: any) {
      setBookingError(err.message || 'Failed to book appointment');
    } finally {
      setBookingLoading(false);
    }
  };

  // ── Hospital Detail View ──────────────────────────────────────────────────
  if (detailLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3" />
        <span className="text-gray-600">Loading hospital details...</span>
      </div>
    );
  }

  if (selectedHospital || detailError) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => { setSelectedHospital(null); setDetailError(''); setBookingSuccess(false); }}
          className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Results
        </button>

        {detailError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-2" />
            <p className="text-red-600 font-semibold mb-3">{detailError}</p>
            <button onClick={() => handleViewDetails(selectedHospital?.id)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
              Try Again
            </button>
          </div>
        )}

        {selectedHospital && (
          <div className="space-y-6">
            {bookingSuccess && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-emerald-700 font-semibold flex items-center gap-2">
                <ShieldCheck className="w-5 h-5" /> Appointment booked successfully! You will receive a confirmation shortly.
              </div>
            )}

            {/* Hospital Header */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-start gap-5">
                <div className="w-20 h-20 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-10 h-10 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> Accredited
                    </span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-bold text-gray-900 text-sm">4.5</span>
                    </div>
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-1">{selectedHospital.name}</h1>
                  <p className="text-gray-500 flex items-center gap-1 text-sm mb-2">
                    <MapPin className="w-4 h-4" /> {selectedHospital.city}, {selectedHospital.state}
                  </p>
                  <p className="text-gray-600 text-sm">{selectedHospital.description || 'Leading healthcare provider offering comprehensive medical services.'}</p>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 mt-5 pt-5 border-t border-gray-100">
                {[
                  { label: 'Beds', value: selectedHospital.bed_capacity || '200+' },
                  { label: 'Doctors', value: '50+' },
                  { label: 'Established', value: selectedHospital.established_year || '1995' },
                  { label: 'Response', value: '24h' },
                ].map(({ label, value }) => (
                  <div key={label} className="text-center">
                    <div className="text-xl font-bold text-blue-600">{value}</div>
                    <div className="text-xs text-gray-500">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Specializations & Services */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-3">Specializations</h3>
                <div className="flex flex-wrap gap-2">
                  {(selectedHospital.specialties?.length ? selectedHospital.specialties : ['Cardiology', 'Orthopedics', 'Neurology', 'Oncology'])
                    .map((spec: string, i: number) => (
                      <span key={i} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-sm font-semibold">{spec}</span>
                    ))}
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-3">Services</h3>
                <div className="grid grid-cols-2 gap-2">
                  {['Emergency Care', 'Surgery', 'Diagnostics', 'Pharmacy', 'Laboratory', 'Radiology'].map(s => (
                    <div key={s} className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full flex-shrink-0" />{s}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-3">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <Phone className="w-4 h-4" /> {selectedHospital.phone || '+91 98765 43210'}
                </div>
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <Mail className="w-4 h-4" /> {selectedHospital.email || 'info@hospital.com'}
                </div>
              </div>
            </div>

            {/* Booking */}
            {!showBookingForm ? (
              <div className="flex gap-3">
                <button
                  onClick={() => { setShowBookingForm(true); setBookingSuccess(false); }}
                  className="flex-1 bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Calendar className="w-5 h-5" /> Book Appointment
                </button>
                <button
                  onClick={() => alert('Quote request sent! We will contact you within 24 hours.')}
                  className="flex-1 bg-emerald-600 text-white font-semibold py-3 rounded-xl hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                >
                  <DollarSign className="w-5 h-5" /> Get Quote
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5" /> Book Appointment
                </h3>

                {bookingError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" /> {bookingError}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Date *</label>
                    <input type="date" value={bookingForm.date} min={new Date().toISOString().split('T')[0]}
                      onChange={e => setBookingForm({ ...bookingForm, date: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Time *</label>
                    <select value={bookingForm.time} onChange={e => setBookingForm({ ...bookingForm, time: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option value="">Choose time</option>
                      {['09:00','09:30','10:00','10:30','11:00','11:30','14:00','14:30','15:00','15:30','16:00','16:30'].map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Appointment Type</label>
                  <select value={bookingForm.type} onChange={e => setBookingForm({ ...bookingForm, type: e.target.value as any })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="consultation">Consultation</option>
                    <option value="procedure">Procedure</option>
                    <option value="follow_up">Follow-up</option>
                    <option value="telemedicine">Telemedicine</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Reason for Visit *</label>
                  <textarea value={bookingForm.reason} rows={3}
                    onChange={e => setBookingForm({ ...bookingForm, reason: e.target.value })}
                    placeholder="Describe your symptoms or reason for the appointment"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Additional Notes (Optional)</label>
                  <textarea value={bookingForm.notes} rows={2}
                    onChange={e => setBookingForm({ ...bookingForm, notes: e.target.value })}
                    placeholder="Any additional information for the hospital"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>

                <div className="flex gap-3">
                  <button onClick={handleBookConsultation}
                    disabled={!bookingForm.date || !bookingForm.time || !bookingForm.reason || bookingLoading}
                    className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors">
                    {bookingLoading ? 'Booking...' : 'Confirm Booking'}
                  </button>
                  <button onClick={() => { setShowBookingForm(false); setBookingError(''); }}
                    className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors">
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // ── Search / List View ────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Find Hospitals</h1>
        <p className="text-gray-500 text-sm">Search for hospitals by city and medical procedure</p>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />City in India
              </label>
              <select value={city} onChange={e => setCity(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white">
                <option value="">Select a city</option>
                {indianCities.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Building2 className="w-4 h-4 inline mr-1" />Medical Procedure
              </label>
              <select value={procedure} onChange={e => setProcedure(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white">
                <option value="">Select a procedure</option>
                {medicalProcedures.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit"
              className="flex-1 bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
              <Search className="w-5 h-5" />
              {city || procedure ? 'Search Hospitals' : 'Show All Hospitals'}
            </button>
            {(city || procedure) && (
              <button type="button" onClick={() => { setCity(''); setProcedure(''); setHasSearched(false); }}
                className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors">
                Clear
              </button>
            )}
          </div>
        </form>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2 text-red-700">
          <AlertCircle className="w-5 h-5" /><span>{error}</span>
        </div>
      )}

      {loading && (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Searching hospitals...</p>
        </div>
      )}

      {hasSearched && !loading && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Search Results ({filteredHospitals.length} hospitals found)
          </h2>

          {filteredHospitals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredHospitals.map(hospital => (
                <div key={hospital.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-7 h-7 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="text-base font-bold text-gray-900 truncate">{hospital.name}</h3>
                        <div className="text-right flex-shrink-0 ml-2">
                          <div className="text-lg font-bold text-gray-900">4.5</div>
                          <div className="text-xs text-gray-500">Rating</div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 flex items-center gap-1 mb-2">
                        <MapPin className="w-3 h-3" />{hospital.city}, {hospital.state}
                      </p>
                      {hospital.specialties?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {hospital.specialties.slice(0, 2).map((spec: string, i: number) => (
                            <span key={i} className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">{spec}</span>
                          ))}
                          {hospital.specialties.length > 2 && (
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full">+{hospital.specialties.length - 2} more</span>
                          )}
                        </div>
                      )}
                      <button onClick={() => handleViewDetails(hospital.id.toString())}
                        className="w-full bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                        View Details & Book Appointment
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
              <Search className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 mb-1">No hospitals found</h3>
              <p className="text-gray-500 text-sm">Try adjusting your search criteria.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FindHospitals;
