import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Phone, Mail, CheckCircle, XCircle, AlertCircle, Eye, Send, X, FileText, DollarSign } from 'lucide-react';
import { quoteStore } from '../../services/quoteStore';

interface Appointment {
  id: number;
  appointment_date: string;
  appointment_time: string;
  type: string;
  reason: string;
  status: string;
  consultation_fee: number;
  patient_name: string;
  patient_email: string;
  patient_phone: string;
  notes?: string;
}

interface QuoteForm {
  amount: string;
  currency: string;
  notes: string;
  patientEmail: string;
}

const Appointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [quoteTarget, setQuoteTarget] = useState<Appointment | null>(null);
  const [quoteForm, setQuoteForm] = useState<QuoteForm>({ amount: '', currency: 'INR', notes: '', patientEmail: '' });
  const [quoteSent, setQuoteSent] = useState<number[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  useEffect(() => {
    const sent = quoteStore.getQuotes().map(q => parseInt(q.appointmentId));
    setQuoteSent(sent);
  }, []);

  const handleSendQuote = () => {
    if (!quoteTarget || !quoteForm.amount || !quoteForm.patientEmail) return;

    quoteStore.saveQuote({
      appointmentId: quoteTarget.id.toString(),
      hospitalName: 'Hospital',
      hospitalCity: '',
      patientName: quoteTarget.patient_name,
      reason: quoteTarget.reason,
      appointmentDate: quoteTarget.appointment_date,
      appointmentTime: quoteTarget.appointment_time,
      amount: parseFloat(quoteForm.amount),
      currency: quoteForm.currency,
      notes: quoteForm.notes,
    });

    const subject = encodeURIComponent(`Medical Quote – ${quoteTarget.reason}`);
    const body = encodeURIComponent(
`Dear ${quoteTarget.patient_name},

Please find your quote details below:

Reason: ${quoteTarget.reason}
Date: ${new Date(quoteTarget.appointment_date).toLocaleDateString()}
Time: ${quoteTarget.appointment_time}
Amount: ${quoteForm.currency} ${parseFloat(quoteForm.amount).toLocaleString()}
${quoteForm.notes ? `\nNotes: ${quoteForm.notes}` : ''}

To accept or decline this quote, please log in to your IMAP patient dashboard and go to Appointments → Quotes.

Best regards,
IMAP Solution`
    );

    window.open(`mailto:${quoteForm.patientEmail}?subject=${subject}&body=${body}`);

    setQuoteSent(prev => [...prev, quoteTarget.id]);
    setQuoteTarget(null);
    setQuoteForm({ amount: '', currency: 'INR', notes: '', patientEmail: '' });
  };

  useEffect(() => {
    fetchAppointments();
  }, [statusFilter, dateFilter]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      if (dateFilter) params.append('date', dateFilter);

      const response = await fetch(
        `http://localhost:5000/api/hospital-dashboard/appointments?${params.toString()}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setAppointments(data.data.appointments);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (appointmentId: number, newStatus: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/appointments/${appointmentId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        fetchAppointments(); // Refresh the list
      }
    } catch (error) {
      console.error('Error updating appointment:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle },
      confirmed: { color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
      completed: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      cancelled: { color: 'bg-red-100 text-red-800', icon: XCircle },
      no_show: { color: 'bg-gray-100 text-gray-800', icon: XCircle }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3" />
        {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return 'N/A';
    // Handle full ISO string (e.g. 1970-01-01T09:30:00.000Z) or plain HH:MM:SS
    const date = timeString.includes('T') ? new Date(timeString) : new Date(`1970-01-01T${timeString}`);
    if (isNaN(date.getTime())) return timeString;
    return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount || 0);
  };

  const getAppointmentStats = () => {
    const stats = {
      total: appointments.length,
      pending: appointments.filter(a => a.status === 'pending').length,
      confirmed: appointments.filter(a => a.status === 'confirmed').length,
      completed: appointments.filter(a => a.status === 'completed').length,
      cancelled: appointments.filter(a => a.status === 'cancelled').length
    };
    return stats;
  };

  const stats = getAppointmentStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
          <p className="text-gray-600">Manage hospital appointments</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Calendar className="w-6 h-6 text-gray-400" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <AlertCircle className="w-6 h-6 text-yellow-400" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Confirmed</p>
              <p className="text-2xl font-bold text-blue-600">{stats.confirmed}</p>
            </div>
            <CheckCircle className="w-6 h-6 text-blue-400" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
            </div>
            <CheckCircle className="w-6 h-6 text-green-400" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Cancelled</p>
              <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
            </div>
            <XCircle className="w-6 h-6 text-red-400" />
          </div>
        </div>
      </div>

      {/* Appointments Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Appointment List</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type & Reason
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {appointments.map((appointment) => (
                <tr key={appointment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-teal-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{appointment.patient_name}</div>
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {appointment.patient_phone}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {formatDate(appointment.appointment_date)}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                      <Clock className="w-4 h-4 text-gray-400" />
                      {formatTime(appointment.appointment_time)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900 capitalize">
                      {appointment.type}
                    </div>
                    <div className="text-sm text-gray-500 max-w-xs truncate">
                      {appointment.reason}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(appointment.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatCurrency(appointment.consultation_fee)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      {appointment.status === 'pending' && (
                        <>
                          <button
                            onClick={() => updateAppointmentStatus(appointment.id, 'confirmed')}
                            className="text-green-600 hover:text-green-900 text-xs px-2 py-1 bg-green-50 rounded"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                            className="text-red-600 hover:text-red-900 text-xs px-2 py-1 bg-red-50 rounded"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                      {appointment.status === 'confirmed' && (
                        <>
                          <button
                            onClick={() => updateAppointmentStatus(appointment.id, 'completed')}
                            className="text-blue-600 hover:text-blue-900 text-xs px-2 py-1 bg-blue-50 rounded"
                          >
                            Complete
                          </button>
                          {!quoteSent.includes(appointment.id) ? (
                            <button
                              onClick={() => setQuoteTarget(appointment)}
                              className="text-emerald-600 hover:text-emerald-900 text-xs px-2 py-1 bg-emerald-50 rounded flex items-center gap-1"
                            >
                              <Send className="w-3 h-3" /> Quote
                            </button>
                          ) : (
                            <span className="text-xs text-gray-400 px-2 py-1">Quote sent</span>
                          )}
                        </>
                      )}
                      <button
                        onClick={() => setSelectedAppointment(appointment)}
                        className="text-gray-600 hover:text-teal-600">
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {appointments.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No appointments found</p>
          </div>
        )}
      </div>

      {/* Send Quote Modal */}
      {quoteTarget && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Send Quote to {quoteTarget.patient_name}</h3>
            <p className="text-sm text-gray-500">Appointment: {quoteTarget.reason} — {new Date(quoteTarget.appointment_date).toLocaleDateString()}</p>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Patient Email *</label>
              <input
                type="email"
                value={quoteForm.patientEmail}
                onChange={e => setQuoteForm({ ...quoteForm, patientEmail: e.target.value })}
                placeholder={quoteTarget.patient_email || 'patient@email.com'}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <p className="text-xs text-gray-400 mt-1">The quote will be sent to this email address.</p>
            </div>

            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount *</label>
                <input
                  type="number"
                  value={quoteForm.amount}
                  onChange={e => setQuoteForm({ ...quoteForm, amount: e.target.value })}
                  placeholder="e.g. 15000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                <select
                  value={quoteForm.currency}
                  onChange={e => setQuoteForm({ ...quoteForm, currency: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option>INR</option>
                  <option>USD</option>
                  <option>EUR</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
              <textarea
                value={quoteForm.notes}
                onChange={e => setQuoteForm({ ...quoteForm, notes: e.target.value })}
                rows={3}
                placeholder="Include what's covered, payment terms, etc."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={() => setQuoteTarget(null)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                Cancel
              </button>
              <button
                onClick={handleSendQuote}
                disabled={!quoteForm.amount || !quoteForm.patientEmail}
                className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" /> Send Quote
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Appointment Detail Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">{selectedAppointment.patient_name}</h2>
                  <p className="text-xs text-gray-500">Appointment #{selectedAppointment.id}</p>
                </div>
              </div>
              <button onClick={() => setSelectedAppointment(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Status */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Status</span>
                {getStatusBadge(selectedAppointment.status)}
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-gray-500 text-xs mb-1"><Calendar className="w-3 h-3" /> Date</div>
                  <p className="font-semibold text-gray-900 text-sm">{formatDate(selectedAppointment.appointment_date)}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-gray-500 text-xs mb-1"><Clock className="w-3 h-3" /> Time</div>
                  <p className="font-semibold text-gray-900 text-sm">{formatTime(selectedAppointment.appointment_time)}</p>
                </div>
              </div>

              {/* Type & Reason */}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-gray-500 text-xs mb-1"><FileText className="w-3 h-3" /> Type & Reason</div>
                <p className="font-semibold text-gray-900 text-sm capitalize">{selectedAppointment.type}</p>
                <p className="text-gray-600 text-sm mt-1">{selectedAppointment.reason}</p>
              </div>

              {/* Patient Contact */}
              <div>
                <p className="text-xs text-gray-500 mb-2">Patient Contact</p>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Mail className="w-4 h-4 text-gray-400" />{selectedAppointment.patient_email || '—'}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Phone className="w-4 h-4 text-gray-400" />{selectedAppointment.patient_phone || '—'}
                  </div>
                </div>
              </div>

              {/* Fee */}
              <div className="flex items-center justify-between bg-teal-50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-teal-700 text-sm"><DollarSign className="w-4 h-4" /> Consultation Fee</div>
                <span className="font-bold text-teal-800">{formatCurrency(selectedAppointment.consultation_fee)}</span>
              </div>

              {/* Notes */}
              {selectedAppointment.notes && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Notes</p>
                  <p className="text-sm text-gray-700 bg-gray-50 rounded-xl p-3">{selectedAppointment.notes}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                {selectedAppointment.status === 'pending' && (
                  <>
                    <button
                      onClick={() => { updateAppointmentStatus(selectedAppointment.id, 'confirmed'); setSelectedAppointment(null); }}
                      className="flex-1 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
                    >Confirm</button>
                    <button
                      onClick={() => { updateAppointmentStatus(selectedAppointment.id, 'cancelled'); setSelectedAppointment(null); }}
                      className="flex-1 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100"
                    >Cancel</button>
                  </>
                )}
                {selectedAppointment.status === 'confirmed' && (
                  <button
                    onClick={() => { updateAppointmentStatus(selectedAppointment.id, 'completed'); setSelectedAppointment(null); }}
                    className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                  >Mark as Completed</button>
                )}
                <button
                  onClick={() => setSelectedAppointment(null)}
                  className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50"
                >Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;