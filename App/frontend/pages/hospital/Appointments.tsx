import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Phone, Mail, CheckCircle, XCircle, AlertCircle, Eye, Send, X, FileText, DollarSign, Filter } from 'lucide-react';
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

const STATUS_CONFIG = {
  pending:   { color: 'bg-amber-50 text-amber-700 border-amber-200',   dot: 'bg-amber-400',   icon: AlertCircle },
  confirmed: { color: 'bg-blue-50 text-blue-700 border-blue-200',      dot: 'bg-blue-500',    icon: CheckCircle },
  completed: { color: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500', icon: CheckCircle },
  cancelled: { color: 'bg-red-50 text-red-700 border-red-200',         dot: 'bg-red-400',     icon: XCircle },
  no_show:   { color: 'bg-gray-100 text-gray-600 border-gray-200',     dot: 'bg-gray-400',    icon: XCircle },
};

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
    setQuoteSent(quoteStore.getQuotes().map(q => parseInt(q.appointmentId)));
  }, []);

  useEffect(() => { fetchAppointments(); }, [statusFilter, dateFilter]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      if (dateFilter) params.append('date', dateFilter);
      const response = await fetch(`http://localhost:5000/api/hospital-dashboard/appointments?${params}`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
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

  const updateStatus = async (id: number, status: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/appointments/${id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (response.ok) fetchAppointments();
    } catch (error) {
      console.error('Error updating appointment:', error);
    }
  };

  const handleSendQuote = () => {
    if (!quoteTarget || !quoteForm.amount || !quoteForm.patientEmail) return;
    quoteStore.saveQuote({
      appointmentId: quoteTarget.id.toString(),
      hospitalName: 'Hospital', hospitalCity: '',
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
`Dear ${quoteTarget.patient_name},\n\nReason: ${quoteTarget.reason}\nDate: ${new Date(quoteTarget.appointment_date).toLocaleDateString()}\nTime: ${quoteTarget.appointment_time}\nAmount: ${quoteForm.currency} ${parseFloat(quoteForm.amount).toLocaleString()}${quoteForm.notes ? `\nNotes: ${quoteForm.notes}` : ''}\n\nTo accept or decline, log in to your IMAP patient dashboard → Appointments → Quotes.\n\nBest regards,\nIMAP Solution`
    );
    window.open(`mailto:${quoteForm.patientEmail}?subject=${subject}&body=${body}`);
    setQuoteSent(prev => [...prev, quoteTarget.id]);
    setQuoteTarget(null);
    setQuoteForm({ amount: '', currency: 'INR', notes: '', patientEmail: '' });
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  const formatTime = (t: string) => {
    if (!t) return 'N/A';
    const date = t.includes('T') ? new Date(t) : new Date(`1970-01-01T${t}`);
    return isNaN(date.getTime()) ? t : date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(amount || 0);

  const getStatusBadge = (status: string) => {
    const cfg = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.pending;
    const Icon = cfg.icon;
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.color}`}>
        <Icon className="w-3 h-3" />
        {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
      </span>
    );
  };

  const stats = {
    total:     appointments.length,
    pending:   appointments.filter(a => a.status === 'pending').length,
    confirmed: appointments.filter(a => a.status === 'confirmed').length,
    completed: appointments.filter(a => a.status === 'completed').length,
    cancelled: appointments.filter(a => a.status === 'cancelled').length,
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage and track patient appointments</p>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
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
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
          />
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: 'Total',     value: stats.total,     color: 'text-gray-700',    bg: 'bg-white',        border: 'border-gray-100' },
          { label: 'Pending',   value: stats.pending,   color: 'text-amber-600',   bg: 'bg-amber-50',     border: 'border-amber-100' },
          { label: 'Confirmed', value: stats.confirmed, color: 'text-blue-600',    bg: 'bg-blue-50',      border: 'border-blue-100' },
          { label: 'Completed', value: stats.completed, color: 'text-emerald-600', bg: 'bg-emerald-50',   border: 'border-emerald-100' },
          { label: 'Cancelled', value: stats.cancelled, color: 'text-red-500',     bg: 'bg-red-50',       border: 'border-red-100' },
        ].map(({ label, value, color, bg, border }) => (
          <div key={label} className={`${bg} border ${border} rounded-xl p-4 text-center`}>
            <p className={`text-2xl font-black ${color}`}>{value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Appointment Cards */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Appointment List</h3>
          <span className="text-xs text-gray-400">{appointments.length} total</span>
        </div>

        {appointments.length === 0 ? (
          <div className="text-center py-16">
            <Calendar className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No appointments found</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {appointments.map((appt) => {
              const cfg = STATUS_CONFIG[appt.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.pending;
              return (
                <div key={appt.id} className="px-6 py-4 hover:bg-gray-50/60 transition-colors">
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <User className="w-5 h-5 text-teal-600" />
                    </div>

                    {/* Main info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900 text-sm">{appt.patient_name}</span>
                        {getStatusBadge(appt.status)}
                        <span className="text-xs text-gray-400 capitalize bg-gray-100 px-2 py-0.5 rounded-full">{appt.type}</span>
                      </div>
                      <p className="text-sm text-gray-500 truncate mb-2">{appt.reason}</p>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400">
                        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{formatDate(appt.appointment_date)}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{formatTime(appt.appointment_time)}</span>
                        {appt.patient_phone && <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" />{appt.patient_phone}</span>}
                        <span className="flex items-center gap-1 font-medium text-gray-600"><DollarSign className="w-3.5 h-3.5" />{formatCurrency(appt.consultation_fee)}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {appt.status === 'pending' && (
                        <>
                          <button onClick={() => updateStatus(appt.id, 'confirmed')} className="px-3 py-1.5 text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors">
                            Confirm
                          </button>
                          <button onClick={() => updateStatus(appt.id, 'cancelled')} className="px-3 py-1.5 text-xs font-semibold bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition-colors">
                            Cancel
                          </button>
                        </>
                      )}
                      {appt.status === 'confirmed' && (
                        <>
                          <button onClick={() => updateStatus(appt.id, 'completed')} className="px-3 py-1.5 text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors">
                            Complete
                          </button>
                          {!quoteSent.includes(appt.id) ? (
                            <button onClick={() => setQuoteTarget(appt)} className="px-3 py-1.5 text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200 rounded-lg hover:bg-teal-100 transition-colors flex items-center gap-1">
                              <Send className="w-3 h-3" /> Quote
                            </button>
                          ) : (
                            <span className="text-xs text-gray-400 px-2">Quote sent</span>
                          )}
                        </>
                      )}
                      <button onClick={() => setSelectedAppointment(appt)} className="p-1.5 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Send Quote Modal */}
      {quoteTarget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Send Quote</h3>
              <button onClick={() => setQuoteTarget(null)} className="p-1.5 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-sm">
              <p className="font-semibold text-gray-900">{quoteTarget.patient_name}</p>
              <p className="text-gray-500">{quoteTarget.reason} — {formatDate(quoteTarget.appointment_date)}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Patient Email *</label>
              <input type="email" value={quoteForm.patientEmail}
                onChange={e => setQuoteForm({ ...quoteForm, patientEmail: e.target.value })}
                placeholder={quoteTarget.patient_email || 'patient@email.com'}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />
            </div>

            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount *</label>
                <input type="number" value={quoteForm.amount}
                  onChange={e => setQuoteForm({ ...quoteForm, amount: e.target.value })}
                  placeholder="e.g. 15000"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                <select value={quoteForm.currency} onChange={e => setQuoteForm({ ...quoteForm, currency: e.target.value })}
                  className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500">
                  <option>INR</option><option>USD</option><option>EUR</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
              <textarea value={quoteForm.notes} onChange={e => setQuoteForm({ ...quoteForm, notes: e.target.value })}
                rows={3} placeholder="Include what's covered, payment terms, etc."
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />
            </div>

            <div className="flex gap-3 pt-1">
              <button onClick={() => setQuoteTarget(null)} className="flex-1 px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-700">Cancel</button>
              <button onClick={handleSendQuote} disabled={!quoteForm.amount || !quoteForm.patientEmail}
                className="flex-1 px-4 py-2 text-sm bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 flex items-center justify-center gap-2 font-semibold">
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
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-900">{selectedAppointment.patient_name}</h2>
                  <p className="text-xs text-gray-400">Appointment #{selectedAppointment.id}</p>
                </div>
              </div>
              <button onClick={() => setSelectedAppointment(null)} className="p-1.5 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Status</span>
                {getStatusBadge(selectedAppointment.status)}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400 flex items-center gap-1 mb-1"><Calendar className="w-3 h-3" /> Date</p>
                  <p className="font-semibold text-gray-900 text-sm">{formatDate(selectedAppointment.appointment_date)}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400 flex items-center gap-1 mb-1"><Clock className="w-3 h-3" /> Time</p>
                  <p className="font-semibold text-gray-900 text-sm">{formatTime(selectedAppointment.appointment_time)}</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 flex items-center gap-1 mb-1"><FileText className="w-3 h-3" /> Type & Reason</p>
                <p className="font-semibold text-gray-900 text-sm capitalize">{selectedAppointment.type}</p>
                <p className="text-gray-600 text-sm mt-0.5">{selectedAppointment.reason}</p>
              </div>

              <div className="space-y-1.5">
                <p className="text-xs text-gray-400">Patient Contact</p>
                <div className="flex items-center gap-2 text-sm text-gray-700"><Mail className="w-4 h-4 text-gray-400" />{selectedAppointment.patient_email || '—'}</div>
                <div className="flex items-center gap-2 text-sm text-gray-700"><Phone className="w-4 h-4 text-gray-400" />{selectedAppointment.patient_phone || '—'}</div>
              </div>

              <div className="flex items-center justify-between bg-teal-50 border border-teal-100 rounded-xl p-3">
                <span className="flex items-center gap-2 text-teal-700 text-sm"><DollarSign className="w-4 h-4" /> Consultation Fee</span>
                <span className="font-bold text-teal-800">{formatCurrency(selectedAppointment.consultation_fee)}</span>
              </div>

              {selectedAppointment.notes && (
                <div>
                  <p className="text-xs text-gray-400 mb-1">Notes</p>
                  <p className="text-sm text-gray-700 bg-gray-50 rounded-xl p-3">{selectedAppointment.notes}</p>
                </div>
              )}

              <div className="flex gap-3 pt-1">
                {selectedAppointment.status === 'pending' && (
                  <>
                    <button onClick={() => { updateStatus(selectedAppointment.id, 'confirmed'); setSelectedAppointment(null); }}
                      className="flex-1 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700">Confirm</button>
                    <button onClick={() => { updateStatus(selectedAppointment.id, 'cancelled'); setSelectedAppointment(null); }}
                      className="flex-1 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm font-semibold hover:bg-red-100">Cancel</button>
                  </>
                )}
                {selectedAppointment.status === 'confirmed' && (
                  <button onClick={() => { updateStatus(selectedAppointment.id, 'completed'); setSelectedAppointment(null); }}
                    className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700">Mark as Completed</button>
                )}
                <button onClick={() => setSelectedAppointment(null)}
                  className="flex-1 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm font-semibold hover:bg-gray-50">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;
