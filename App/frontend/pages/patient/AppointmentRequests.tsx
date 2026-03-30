import React, { useState, useEffect } from 'react';
import { 
  Calendar, Clock, MapPin, Search, Filter, 
  Plus, CheckCircle, XCircle, AlertCircle, Eye, Edit2, 
  Trash2, Building2, History, FileText
} from 'lucide-react';
import { patientsAPI, hospitalsAPI, appointmentsAPI } from '../../services/api';

interface Appointment {
  id: string;
  hospital_name: string;
  hospital_city: string;
  hospital_address: string;
  appointment_date: string;
  appointment_time: string;
  type: 'consultation' | 'procedure' | 'follow_up' | 'telemedicine';
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  reason: string;
  notes?: string;
  consultation_fee?: number;
  created_at: string;
}

interface Hospital {
  id: number;
  name: string;
  city: string;
  address: string;
  specialties: string[];
  phone?: string;
}

const AppointmentRequests: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'appointments' | 'history' | 'book'>('appointments');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [allAppointments, setAllAppointments] = useState<Appointment[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);

  const [bookingForm, setBookingForm] = useState({
    hospitalId: '',
    date: '',
    time: '',
    type: 'consultation' as 'consultation' | 'procedure' | 'follow_up' | 'telemedicine',
    reason: '',
    notes: ''
  });

  useEffect(() => {
    fetchAppointments();
    fetchHospitals();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await appointmentsAPI.getAppointments();
      if (response.success) {
        const formattedAppointments = response.data.appointments.map((apt: any) => ({
          id: apt.id.toString(),
          hospital_name: apt.hospital_name,
          hospital_city: apt.hospital_city,
          hospital_address: apt.hospital_address,
          appointment_date: apt.appointment_date,
          appointment_time: apt.appointment_time,
          type: apt.type,
          status: apt.status,
          reason: apt.reason,
          notes: apt.notes,
          consultation_fee: apt.consultation_fee,
          created_at: apt.created_at
        }));
        
        setAllAppointments(formattedAppointments);
        // Filter current/upcoming appointments for main view
        const currentAppointments = formattedAppointments.filter((apt: Appointment) => 
          ['pending', 'confirmed'].includes(apt.status)
        );
        setAppointments(currentAppointments);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const fetchHospitals = async () => {
    try {
      const response = await hospitalsAPI.getHospitals({ limit: 100 });
      if (response.success) {
        setHospitals(response.data.hospitals || []);
      }
    } catch (err: any) {
      console.error('Failed to load hospitals:', err);
    }
  };

  const filteredAppointments = (appointmentList: Appointment[]) => {
    return appointmentList.filter(appointment => {
      const matchesSearch = appointment.hospital_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           appointment.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           appointment.hospital_city.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterStatus === 'all' || appointment.status === filterStatus;
      return matchesSearch && matchesFilter;
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'no_show': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      case 'no_show': return <XCircle className="w-4 h-4" />;
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

      await appointmentsAPI.createAppointment({
        hospital_id: parseInt(bookingForm.hospitalId),
        appointment_date: bookingForm.date,
        appointment_time: bookingForm.time,
        type: bookingForm.type,
        reason: bookingForm.reason,
        notes: bookingForm.notes
      });

      setSuccess('Appointment booked successfully!');
      setShowBookingModal(false);
      setBookingForm({
        hospitalId: '',
        date: '',
        time: '',
        type: 'consultation',
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

  const handleCancelAppointment = async (appointmentId: string) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) return;
    
    try {
      setLoading(true);
      await appointmentsAPI.updateAppointment(parseInt(appointmentId), 'cancelled');
      setSuccess('Appointment cancelled successfully');
      fetchAppointments();
    } catch (err: any) {
      setError(err.message || 'Failed to cancel appointment');
    } finally {
      setLoading(false);
    }
  };

  const AppointmentCard = ({ appointment, showActions = true }: { appointment: Appointment, showActions?: boolean }) => (
    <div className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-semibold text-gray-900">{appointment.hospital_name}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(appointment.status)}`}>
              {getStatusIcon(appointment.status)}
              {appointment.status}
            </span>
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
              {appointment.type}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{appointment.hospital_city}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Building2 className="w-4 h-4" />
                <span>{appointment.hospital_address}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>{new Date(appointment.appointment_date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>{appointment.appointment_time}</span>
              </div>
            </div>
          </div>

          <div className="mb-3">
            <p className="text-sm text-gray-700"><strong>Reason:</strong> {appointment.reason}</p>
            {appointment.notes && (
              <p className="text-sm text-gray-600 mt-1"><strong>Notes:</strong> {appointment.notes}</p>
            )}
            {appointment.consultation_fee && (
              <p className="text-sm text-gray-600 mt-1"><strong>Fee:</strong> ${appointment.consultation_fee}</p>
            )}
          </div>

          <div className="text-xs text-gray-500">
            Booked on: {new Date(appointment.created_at).toLocaleDateString()}
          </div>
        </div>

        {showActions && (
          <div className="flex items-center gap-2 ml-4">
            <button className="p-2 hover:bg-gray-200 rounded-lg">
              <Eye className="w-4 h-4 text-gray-600" />
            </button>
            {appointment.status === 'pending' && (
              <>
                <button className="p-2 hover:bg-gray-200 rounded-lg">
                  <Edit2 className="w-4 h-4 text-gray-600" />
                </button>
                <button 
                  onClick={() => handleCancelAppointment(appointment.id)}
                  className="p-2 hover:bg-gray-200 rounded-lg"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hospital Appointments</h1>
          <p className="text-gray-600">Manage your hospital appointments and view your medical history</p>
        </div>
        <button
          onClick={() => {
            setActiveTab('book');
            setShowBookingModal(true);
          }}
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
              Current Appointments
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'history'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <History className="w-4 h-4 inline mr-1" />
              Appointment History
            </button>
          </nav>
        </div>

        {/* Current Appointments Tab */}
        {activeTab === 'appointments' && (
          <div className="p-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">
                  {appointments.filter(a => a.status === 'pending').length}
                </div>
                <div className="text-sm text-yellow-700">Pending</div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {appointments.filter(a => a.status === 'confirmed').length}
                </div>
                <div className="text-sm text-blue-700">Confirmed</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {allAppointments.filter(a => a.status === 'completed').length}
                </div>
                <div className="text-sm text-green-700">Completed</div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {allAppointments.filter(a => a.status === 'cancelled').length}
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
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
              </select>
            </div>

            {/* Appointments List */}
            <div className="space-y-4">
              {filteredAppointments(appointments).map((appointment) => (
                <AppointmentCard key={appointment.id} appointment={appointment} />
              ))}
            </div>

            {filteredAppointments(appointments).length === 0 && (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No current appointments</h3>
                <p className="text-gray-600">Book a new appointment to get started.</p>
              </div>
            )}
          </div>
        )}

        {/* Appointment History Tab */}
        {activeTab === 'history' && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Complete Appointment History</h3>
              <div className="text-sm text-gray-600">
                Total appointments: {allAppointments.length}
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search appointment history..."
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
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="no_show">No Show</option>
              </select>
            </div>

            {/* History List */}
            <div className="space-y-4">
              {filteredAppointments(allAppointments).map((appointment) => (
                <AppointmentCard key={appointment.id} appointment={appointment} showActions={false} />
              ))}
            </div>

            {filteredAppointments(allAppointments).length === 0 && (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No appointment history found</h3>
                <p className="text-gray-600">Try adjusting your search criteria.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Book Hospital Appointment</h3>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Hospital *</label>
                <select
                  value={bookingForm.hospitalId}
                  onChange={(e) => setBookingForm({ ...bookingForm, hospitalId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Choose a hospital</option>
                  {hospitals.map(hospital => (
                    <option key={hospital.id} value={hospital.id}>
                      {hospital.name} - {hospital.city}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Time *</label>
                  <select
                    value={bookingForm.time}
                    onChange={(e) => setBookingForm({ ...bookingForm, time: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select time</option>
                    <option value="09:00">9:00 AM</option>
                    <option value="09:30">9:30 AM</option>
                    <option value="10:00">10:00 AM</option>
                    <option value="10:30">10:30 AM</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="11:30">11:30 AM</option>
                    <option value="14:00">2:00 PM</option>
                    <option value="14:30">2:30 PM</option>
                    <option value="15:00">3:00 PM</option>
                    <option value="15:30">3:30 PM</option>
                    <option value="16:00">4:00 PM</option>
                    <option value="16:30">4:30 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Appointment Type</label>
                <select
                  value={bookingForm.type}
                  onChange={(e) => setBookingForm({ ...bookingForm, type: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="consultation">Consultation</option>
                  <option value="procedure">Procedure</option>
                  <option value="follow_up">Follow-up</option>
                  <option value="telemedicine">Telemedicine</option>
                </select>
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
                  placeholder="Any additional information for the hospital"
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