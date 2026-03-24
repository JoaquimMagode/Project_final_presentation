import React, { useState, useEffect } from 'react';
import { X, Star, MapPin, Clock, ShieldCheck, Phone, Mail, Calendar, DollarSign, Camera, Users, Award, Building2, AlertCircle } from 'lucide-react';
import { hospitalsAPI, patientsAPI } from '../../services/api';

interface HospitalDetailsModalProps {
  hospitalId: string;
  isOpen: boolean;
  onClose: () => void;
}

const HospitalDetailsModal: React.FC<HospitalDetailsModalProps> = ({ hospitalId, isOpen, onClose }) => {
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [hospital, setHospital] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);

  const availableTimes = [
    '09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'
  ];

  useEffect(() => {
    if (isOpen && hospitalId) {
      fetchHospitalDetails();
    }
  }, [isOpen, hospitalId]);

  const fetchHospitalDetails = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await hospitalsAPI.getHospitalById(parseInt(hospitalId));
      if (response.success) {
        setHospital(response.data.hospital);
      } else {
        setError('Failed to load hospital details');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load hospital details');
      console.error('Error fetching hospital details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookConsultation = () => {
    if (selectedDate && selectedTime) {
      alert(`Consultation booked for ${selectedDate} at ${selectedTime}. You will receive a confirmation email shortly.`);
      setShowBookingForm(false);
      setSelectedDate('');
      setSelectedTime('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Hospital Details</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Loading hospital details...</span>
            </div>
          )}

          {error && (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-2" />
                <p className="text-red-600 font-semibold">{error}</p>
                <button 
                  onClick={fetchHospitalDetails}
                  className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {hospital && (
            <>
              {/* Hospital Header */}
              <div className="flex items-start gap-6">
                <img 
                  src={hospital.logo_url || '/api/placeholder/80/80'} 
                  alt={hospital.name || 'Hospital'}
                  className="w-20 h-20 rounded-lg object-cover border border-gray-200"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/api/placeholder/80/80';
                  }}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4" />
                      {hospital.accreditations?.[0] || 'Accredited'}
                    </span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-bold text-gray-900">4.5</span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{hospital.name}</h3>
                  <p className="text-gray-600 flex items-center gap-2 mb-3">
                    <MapPin className="w-4 h-4" /> {hospital.city}, {hospital.state}
                  </p>
                  <p className="text-gray-600 mb-4">{hospital.description || 'Leading healthcare provider offering comprehensive medical services.'}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-xl font-bold text-blue-600">{hospital.bed_capacity || '200+'}</div>
                      <div className="text-xs text-gray-500">Beds</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-blue-600">50+</div>
                      <div className="text-xs text-gray-500">Doctors</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-blue-600">{hospital.established_year || '1995'}</div>
                      <div className="text-xs text-gray-500">Established</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-blue-600 flex items-center justify-center gap-1">
                        <Clock className="w-4 h-4" />
                        24h
                      </div>
                      <div className="text-xs text-gray-500">Response Time</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* About Section */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-bold text-gray-900 mb-2">About This Hospital</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {hospital.description || 'This hospital is committed to providing world-class healthcare services with state-of-the-art facilities and experienced medical professionals.'}
                </p>
              </div>

              {/* Specializations and Services */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold text-gray-900 mb-3">Specializations</h4>
                  <div className="flex flex-wrap gap-2">
                    {hospital.specialties && hospital.specialties.length > 0 ? (
                      hospital.specialties.map((spec: string, index: number) => (
                        <span key={index} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-sm font-semibold">
                          {spec}
                        </span>
                      ))
                    ) : (
                      ['Cardiology', 'Orthopedics', 'Neurology', 'Oncology'].map(spec => (
                        <span key={spec} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-sm font-semibold">
                          {spec}
                        </span>
                      ))
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-gray-900 mb-3">Services</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {['Emergency Care', 'Surgery', 'Diagnostics', 'Pharmacy', 'Laboratory', 'Radiology'].map(service => (
                      <div key={service} className="text-sm text-gray-600 flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        {service}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-bold text-gray-900 mb-3">Contact Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span className="text-sm">{hospital.phone || '+91 98765 43210'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">{hospital.email || 'info@hospital.com'}</span>
                  </div>
                </div>
              </div>

              {/* Booking Section */}
              {!showBookingForm ? (
                <div className="flex gap-3">
                  <button 
                    onClick={() => setShowBookingForm(true)}
                    className="flex-1 bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Calendar className="w-5 h-5" />
                    Book Consultation
                  </button>
                  <button 
                    onClick={() => alert('Quote request sent! We will contact you within 24 hours.')}
                    className="flex-1 bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <DollarSign className="w-5 h-5" />
                    Get Quote
                  </button>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Book Consultation
                  </h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Select Date</label>
                      <input 
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Select Time</label>
                      <div className="grid grid-cols-3 gap-2">
                        {availableTimes.map(time => (
                          <button
                            key={time}
                            onClick={() => setSelectedTime(time)}
                            className={`p-2 text-sm font-semibold rounded-lg border transition-colors ${
                              selectedTime === time 
                                ? 'bg-blue-600 text-white border-blue-600' 
                                : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h5 className="font-semibold text-blue-900 mb-2">Consultation Details</h5>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• 30-minute video consultation</li>
                        <li>• Direct access to hospital specialists</li>
                        <li>• Medical report review included</li>
                        <li>• Treatment plan discussion</li>
                      </ul>
                    </div>
                    
                    <div className="flex gap-3">
                      <button 
                        onClick={handleBookConsultation}
                        disabled={!selectedDate || !selectedTime || bookingLoading}
                        className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                      >
                        {bookingLoading ? 'Booking...' : 'Confirm Booking'}
                      </button>
                      <button 
                        onClick={() => {
                          setShowBookingForm(false);
                          setSelectedDate('');
                          setSelectedTime('');
                        }}
                        className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HospitalDetailsModal;