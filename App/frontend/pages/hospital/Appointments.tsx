import React, { useState } from 'react';
import { 
  Calendar, Clock, Plus, Search, Filter, Eye, Edit2, Trash2, 
  User, Phone, Mail, CheckCircle, XCircle, AlertCircle 
} from 'lucide-react';

interface Appointment {
  id: string;
  patientName: string;
  doctorName: string;
  date: string;
  time: string;
  type: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled' | 'No Show';
  duration: string;
  notes: string;
  patientPhone: string;
  patientEmail: string;
}

const Appointments: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);

  const [appointments] = useState<Appointment[]>([
    {
      id: '1',
      patientName: 'John Smith',
      doctorName: 'Dr. Sarah Wilson',
      date: '2024-01-15',
      time: '09:00',
      type: 'Consultation',
      status: 'Scheduled',
      duration: '30 min',
      notes: 'Regular checkup',
      patientPhone: '+1 234 567 8900',
      patientEmail: 'john.smith@email.com'
    },
    {
      id: '2',
      patientName: 'Maria Garcia',
      doctorName: 'Dr. Michael Brown',
      date: '2024-01-15',
      time: '10:30',
      type: 'Follow-up',
      status: 'Completed',
      duration: '45 min',
      notes: 'Post-surgery checkup',
      patientPhone: '+1 234 567 8901',
      patientEmail: 'maria.garcia@email.com'
    },
    {
      id: '3',
      patientName: 'David Johnson',
      doctorName: 'Dr. Emily Davis',
      date: '2024-01-15',
      time: '14:00',
      type: 'Surgery',
      status: 'Scheduled',
      duration: '120 min',
      notes: 'Knee replacement surgery',
      patientPhone: '+1 234 567 8902',
      patientEmail: 'david.johnson@email.com'
    },
    {
      id: '4',
      patientName: 'Lisa Anderson',
      doctorName: 'Dr. James Miller',
      date: '2024-01-15',
      time: '11:15',
      type: 'Consultation',
      status: 'No Show',
      duration: '30 min',
      notes: 'Cardiology consultation',
      patientPhone: '+1 234 567 8903',
      patientEmail: 'lisa.anderson@email.com'
    }
  ]);

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.doctorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'All' || appointment.status === filterStatus;
    const matchesDate = appointment.date === selectedDate;
    return matchesSearch && matchesFilter && matchesDate;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Scheduled': return 'bg-blue-100 text-blue-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      case 'No Show': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Scheduled': return <Clock className="w-4 h-4" />;
      case 'Completed': return <CheckCircle className="w-4 h-4" />;
      case 'Cancelled': return <XCircle className="w-4 h-4" />;
      case 'No Show': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const todayStats = {
    total: appointments.filter(a => a.date === selectedDate).length,
    scheduled: appointments.filter(a => a.date === selectedDate && a.status === 'Scheduled').length,
    completed: appointments.filter(a => a.date === selectedDate && a.status === 'Completed').length,
    cancelled: appointments.filter(a => a.date === selectedDate && (a.status === 'Cancelled' || a.status === 'No Show')).length
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
          <p className="text-gray-600">Manage patient appointments and schedules</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-teal-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-teal-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Schedule Appointment
        </button>
      </div>

      {/* Date Selector and Filters */}
      <div className="bg-white rounded-lg p-4 mb-6 shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-400" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search appointments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="All">All Status</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
              <option value="No Show">No Show</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-gray-900">{todayStats.total}</div>
          <div className="text-sm text-gray-600">Total Appointments</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-blue-600">{todayStats.scheduled}</div>
          <div className="text-sm text-gray-600">Scheduled</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-green-600">{todayStats.completed}</div>
          <div className="text-sm text-gray-600">Completed</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-red-600">{todayStats.cancelled}</div>
          <div className="text-sm text-gray-600">Cancelled/No Show</div>
        </div>
      </div>

      {/* Appointments List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">
            Appointments for {new Date(selectedDate).toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </h3>
        </div>
        
        <div className="divide-y divide-gray-100">
          {filteredAppointments.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No appointments found for the selected date and filters.</p>
            </div>
          ) : (
            filteredAppointments.map((appointment) => (
              <div key={appointment.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900">{appointment.time}</div>
                      <div className="text-xs text-gray-500">{appointment.duration}</div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900">{appointment.patientName}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(appointment.status)}`}>
                          {getStatusIcon(appointment.status)}
                          {appointment.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 mb-1">
                        <span className="font-medium">Dr:</span> {appointment.doctorName} • 
                        <span className="font-medium"> Type:</span> {appointment.type}
                      </div>
                      <div className="text-sm text-gray-500">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {appointment.patientPhone}
                          </span>
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {appointment.patientEmail}
                          </span>
                        </div>
                      </div>
                      {appointment.notes && (
                        <div className="text-sm text-gray-600 mt-1">
                          <span className="font-medium">Notes:</span> {appointment.notes}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <Eye className="w-4 h-4 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <Edit2 className="w-4 h-4 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Appointment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Schedule New Appointment</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Patient Name</label>
                  <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Doctor</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500">
                    <option>Dr. Sarah Wilson</option>
                    <option>Dr. Michael Brown</option>
                    <option>Dr. Emily Davis</option>
                    <option>Dr. James Miller</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                  <input type="time" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500">
                    <option>Consultation</option>
                    <option>Follow-up</option>
                    <option>Surgery</option>
                    <option>Emergency</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500">
                    <option>30 min</option>
                    <option>45 min</option>
                    <option>60 min</option>
                    <option>90 min</option>
                    <option>120 min</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Patient Phone</label>
                  <input type="tel" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Patient Email</label>
                  <input type="email" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" rows={3}></textarea>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">
                Schedule Appointment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;