import React, { useState, useEffect } from 'react';
import { 
  Calendar, Clock, User, MapPin, Phone, Search, Filter, 
  Plus, CheckCircle, XCircle, AlertCircle, Eye, Edit2, 
  Trash2, Star, Video, MessageCircle
} from 'lucide-react';
import { patientsAPI, hospitalsAPI } from '../../services/api';

interface Appointment {
  id: string;
  doctorName: string;
  specialty: string;
  hospital: string;
  date: string;
  time: string;
  type: 'in-person' | 'telemedicine';
  status: 'scheduled' | 'pending' | 'completed' | 'cancelled';
  reason: string;
  notes?: string;
  rating?: number;
}

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  hospital: string;
  rating: number;
  experience: string;
  availableSlots: string[];
  consultationFee: number;
  image: string;
}

const AppointmentRequests: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'appointments' | 'book'>('appointments');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedHospital, setSelectedHospital] = useState<any>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [hospitals, setHospitals] = useState<any[]>([]);

  useEffect(() => {
    fetchAppointments();
    fetchHospitals();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await patientsAPI.getPatientAppointments();
      if (response.success) {
        const formattedAppointments = response.data.appointments.map((apt: any) => ({
          id: apt.id.toString(),
          doctorName: apt.doctor_name || 'Doctor',
          specialty: apt.reason || 'Consultation',
          hospital: apt.hospital_name || 'Hospital',
          date: apt.appointment_date,
          time: apt.appointment_time,
          type: 'in-person' as 'in-person' | 'telemedicine',
          status: apt.status as 'scheduled' | 'pending' | 'completed' | 'cancelled',
          reason: apt.reason || apt.notes || 'Consultation',
          notes: apt.notes
        }));
        setAppointments(formattedAppointments);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const fetchHospitals = async () => {
    try {
      const response = await hospitalsAPI.getHospitals();
      if (response.success) {
        setHospitals(response.data.hospitals || []);
      }
    } catch (err: any) {
      console.error('Failed to load hospitals:', err);
    }
  };

  const searchHospitals = async (searchTerm: string) => {
    try {
      const response = await hospitalsAPI.searchHospitals({ name: searchTerm });
      if (response.success) {
        setHospitals(response.data.hospitals || []);
      }
    } catch (err: any) {
      console.error('Failed to search hospitals:', err);
    }
  };

  const [availableDoctors] = useState<Doctor[]>([]);

  const [bookingForm, setBookingForm] = useState({
    hospitalId: '',
    doctorName: '',
    date: '',
    time: '',
    type: 'in-person' as 'in-person' | 'telemedicine',
    reason: '',
    notes: ''
  });

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.hospital.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || appointment.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const handleBookingSubmit = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      if (!bookingForm.hospitalId || !bookingForm.date || !bookingForm.time || !bookingForm.reason) {
        setError('Please fill in all required fields');
        return;
      }

      await patientsAPI.createAppointment({
        hospital_id: parseInt(bookingForm.hospitalId),
        doctor_name: bookingForm.doctorName || 'Doctor',
        appointment_date: bookingForm.date,
        appointment_time: bookingForm.time,
        reason: bookingForm.reason
      });

      setSuccess('Appointment booked successfully!');
      setShowBookingModal(false);
      setBookingForm({
        hospitalId: '',
        doctorName: '',
        date: '',
        time: '',
        type: 'in-person',
        reason: '',
        notes: ''
      });
      
      // Refresh appointments
      fetchAppointments();
    } catch (err: any) {
      setError(err.message || 'Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
          <p className="text-gray-600">Manage your appointments and book new consultations</p>
        </div>
        <button
          onClick={() => setActiveTab('book')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Book Appointment
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          {success}
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('appointments')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'appointments'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              My Appointments
            </button>
            <button
              onClick={() => setActiveTab('book')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'book'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Book New Appointment
            </button>
          </nav>
        </div>

        {/* My Appointments Tab */}
        {activeTab === 'appointments' && (
          <div className="p-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {appointments.filter(a => a.status === 'scheduled').length}
                </div>
                <div className="text-sm text-blue-700">Scheduled</div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">
                  {appointments.filter(a => a.status === 'pending').length}
                </div>
                <div className="text-sm text-yellow-700">Pending</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {appointments.filter(a => a.status === 'completed').length}
                </div>
                <div className="text-sm text-green-700">Completed</div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {appointments.filter(a => a.status === 'cancelled').length}
                </div>
                <div className="text-sm text-red-700">Cancelled</div>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search appointments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="scheduled">Scheduled</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Appointments List */}
            <div className="space-y-4">
              {filteredAppointments.map((appointment) => (
                <div key={appointment.id} className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{appointment.doctorName}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(appointment.status)}`}>
                          {getStatusIcon(appointment.status)}
                          {appointment.status}
                        </span>
                        {appointment.type === 'telemedicine' && (
                          <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                            <Video className="w-3 h-3" />
                            Telemedicine
                          </span>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <User className="w-4 h-4" />
                            <span>{appointment.specialty}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="w-4 h-4" />
                            <span>{appointment.hospital}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(appointment.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span>{appointment.time}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mb-3">
                        <p className="text-sm text-gray-700"><strong>Reason:</strong> {appointment.reason}</p>
                        {appointment.notes && (
                          <p className="text-sm text-gray-600 mt-1"><strong>Notes:</strong> {appointment.notes}</p>
                        )}
                      </div>

                      {appointment.status === 'completed' && appointment.rating && (
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-sm text-gray-600">Your rating:</span>
                          <div className="flex">{renderStars(appointment.rating)}</div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      {appointment.status === 'scheduled' && appointment.type === 'telemedicine' && (
                        <button className="px-3 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors flex items-center gap-2">
                          <Video className="w-4 h-4" />
                          Join Call
                        </button>
                      )}
                      <button className="p-2 hover:bg-gray-200 rounded-lg">
                        <Eye className="w-4 h-4 text-gray-600" />
                      </button>
                      {appointment.status === 'scheduled' && (
                        <button className="p-2 hover:bg-gray-200 rounded-lg">
                          <Edit2 className="w-4 h-4 text-gray-600" />
                        </button>
                      )}
                      <button className="p-2 hover:bg-gray-200 rounded-lg">
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredAppointments.length === 0 && (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
                <p className="text-gray-600">Try adjusting your search or book a new appointment.</p>
              </div>
            )}
          </div>
        )}

        {/* Book New Appointment Tab */}
        {activeTab === 'book' && (
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Available Doctors</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableDoctors.map((doctor) => (
                <div key={doctor.id} className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={doctor.image}
                      alt={doctor.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900">{doctor.name}</h4>
                      <p className="text-sm text-gray-600">{doctor.specialty}</p>
                      <div className="flex items-center gap-1 mt-1">
                        {renderStars(Math.floor(doctor.rating))}
                        <span className="text-sm text-gray-600 ml-1">({doctor.rating})</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{doctor.hospital}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <User className="w-4 h-4" />
                      <span>{doctor.experience} experience</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>${doctor.consultationFee} consultation fee</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Available Today:</p>
                    <div className="flex flex-wrap gap-2">
                      {doctor.availableSlots.slice(0, 3).map((slot, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                          {slot}
                        </span>
                      ))}
                      {doctor.availableSlots.length > 3 && (
                        <span className="text-xs text-gray-500">+{doctor.availableSlots.length - 3} more</span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedDoctor(doctor);
                      setShowBookingModal(true);
                    }}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Book Appointment
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedHospital && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">
                Book Appointment at {selectedHospital.name}
              </h3>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Doctor Name (Optional)</label>
                  <input
                    type="text"
                    value={bookingForm.doctorName}
                    onChange={(e) => setBookingForm({ ...bookingForm, doctorName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter doctor name if known"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Date *</label>
                  <input
                    type="date"
                    value={bookingForm.date}
                    onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Time *</label>
                <select
                  value={bookingForm.time}
                  onChange={(e) => setBookingForm({ ...bookingForm, time: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select time</option>
                  <option value="09:00">9:00 AM</option>
                  <option value="10:00">10:00 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="14:00">2:00 PM</option>
                  <option value="15:00">3:00 PM</option>
                  <option value="16:00">4:00 PM</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Appointment Type</label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="in-person"
                      checked={bookingForm.type === 'in-person'}
                      onChange={(e) => setBookingForm({ ...bookingForm, type: e.target.value as 'in-person' | 'telemedicine' })}
                      className="mr-2"
                    />
                    In-Person Visit
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="telemedicine"
                      checked={bookingForm.type === 'telemedicine'}
                      onChange={(e) => setBookingForm({ ...bookingForm, type: e.target.value as 'in-person' | 'telemedicine' })}
                      className="mr-2"
                    />
                    Telemedicine
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Visit *</label>
                <textarea
                  value={bookingForm.reason}
                  onChange={(e) => setBookingForm({ ...bookingForm, reason: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe your symptoms or reason for the appointment"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes (Optional)</label>
                <textarea
                  value={bookingForm.notes}
                  onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Any additional information for the doctor"
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => setShowBookingModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleBookingSubmit}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Booking...' : 'Book Appointment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentRequests;