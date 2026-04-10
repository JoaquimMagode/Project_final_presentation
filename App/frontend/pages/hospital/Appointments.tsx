import React, { useState, useEffect } from 'react';
import {
  HiOutlineCalendarDays, HiOutlineClock, HiOutlineUser, HiOutlinePhone,
  HiOutlineEnvelope, HiOutlineCheckCircle, HiOutlineXCircle,
  HiOutlineExclamationCircle, HiOutlineEye, HiOutlinePaperAirplane,
  HiOutlineXMark, HiOutlineDocumentText, HiOutlineCurrencyDollar,
} from 'react-icons/hi2';
import { quoteStore } from '../../services/quoteStore';

interface Appointment {
  id: number; appointment_date: string; appointment_time: string; type: string;
  reason: string; status: string; consultation_fee: number; patient_name: string;
  patient_email: string; patient_phone: string; notes?: string;
}
interface QuoteForm { amount: string; currency: string; notes: string; patientEmail: string; }

const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
const fmtTime = (t: string) => {
  if (!t) return 'N/A';
  const d = t.includes('T') ? new Date(t) : new Date(`1970-01-01T${t}`);
  return isNaN(d.getTime()) ? t : d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
};
const fmtCurrency = (n: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(n || 0);

const statusCfg: Record<string, { bg: string; icon: any }> = {
  pending: { bg: 'bg-yellow-50 text-yellow-700', icon: HiOutlineExclamationCircle },
  confirmed: { bg: 'bg-blue-50 text-blue-700', icon: HiOutlineCheckCircle },
  completed: { bg: 'bg-green-50 text-green-700', icon: HiOutlineCheckCircle },
  cancelled: { bg: 'bg-red-50 text-red-700', icon: HiOutlineXCircle },
  no_show: { bg: 'bg-gray-100 text-gray-600', icon: HiOutlineXCircle },
};

const Badge = ({ status }: { status: string }) => {
  const c = statusCfg[status] || statusCfg.pending;
  const Icon = c.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium ${c.bg}`}>
      <Icon className="w-3 h-3" />{status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
    </span>
  );
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

  useEffect(() => { setQuoteSent(quoteStore.getQuotes().map(q => parseInt(q.appointmentId))); }, []);
  useEffect(() => { fetchAppointments(); }, [statusFilter, dateFilter]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      if (dateFilter) params.append('date', dateFilter);
      const res = await fetch(`http://localhost:5000/api/hospital-dashboard/appointments?${params}`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      if (res.ok) { const data = await res.json(); setAppointments(data.data.appointments); }
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/appointments/${id}`, {
        method: 'PUT', headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) fetchAppointments();
    } catch (e) { console.error(e); }
  };

  const handleSendQuote = () => {
    if (!quoteTarget || !quoteForm.amount || !quoteForm.patientEmail) return;
    quoteStore.saveQuote({
      appointmentId: quoteTarget.id.toString(), hospitalName: 'Hospital', hospitalCity: '',
      patientName: quoteTarget.patient_name, reason: quoteTarget.reason,
      appointmentDate: quoteTarget.appointment_date, appointmentTime: quoteTarget.appointment_time,
      amount: parseFloat(quoteForm.amount), currency: quoteForm.currency, notes: quoteForm.notes,
    });
    const subject = encodeURIComponent(`Medical Quote – ${quoteTarget.reason}`);
    const body = encodeURIComponent(`Dear ${quoteTarget.patient_name},\n\nReason: ${quoteTarget.reason}\nDate: ${fmtDate(quoteTarget.appointment_date)}\nTime: ${quoteTarget.appointment_time}\nAmount: ${quoteForm.currency} ${parseFloat(quoteForm.amount).toLocaleString()}${quoteForm.notes ? `\nNotes: ${quoteForm.notes}` : ''}\n\nBest regards,\nIMAP Solution`);
    window.open(`mailto:${quoteForm.patientEmail}?subject=${subject}&body=${body}`);
    setQuoteSent(prev => [...prev, quoteTarget.id]);
    setQuoteTarget(null);
    setQuoteForm({ amount: '', currency: 'INR', notes: '', patientEmail: '' });
  };

  const stats = {
    total: appointments.length,
    pending: appointments.filter(a => a.status === 'pending').length,
    confirmed: appointments.filter(a => a.status === 'confirmed').length,
    completed: appointments.filter(a => a.status === 'completed').length,
    cancelled: appointments.filter(a => a.status === 'cancelled').length,
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600"></div></div>;

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-gray-900">Appointments</h1>
          <p className="text-xs text-gray-500">Manage hospital appointments</p>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-md px-3 py-1.5">
            <HiOutlineExclamationCircle className="w-3.5 h-3.5 text-gray-400" />
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
              className="bg-transparent text-xs font-medium text-gray-600 outline-none cursor-pointer pr-1">
              <option value="">All Status</option>
              <option value="pending">Pending</option><option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option><option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-md px-3 py-1.5">
            <HiOutlineCalendarDays className="w-3.5 h-3.5 text-gray-400" />
            <input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)}
              className="bg-transparent text-xs font-medium text-gray-600 outline-none cursor-pointer" />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {([
          { label: 'Total', value: stats.total, accent: 'bg-slate-500' },
          { label: 'Pending', value: stats.pending, accent: 'bg-yellow-500' },
          { label: 'Confirmed', value: stats.confirmed, accent: 'bg-blue-500' },
          { label: 'Completed', value: stats.completed, accent: 'bg-emerald-500' },
          { label: 'Cancelled', value: stats.cancelled, accent: 'bg-red-500' },
        ] as const).map(s => (
          <div key={s.label} className="bg-white rounded-lg px-4 py-3 border border-gray-200 flex items-center gap-3">
            <div className={`w-2 h-8 rounded-full ${s.accent}`}></div>
            <div>
              <p className="text-[11px] text-gray-500">{s.label}</p>
              <p className="text-lg font-bold text-gray-900 leading-tight">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-5 py-3.5 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900">Appointment List</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                {['Patient', 'Date & Time', 'Type & Reason', 'Status', 'Fee', 'Actions'].map(h => (
                  <th key={h} className="px-5 py-2.5 text-left text-[11px] font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {appointments.map(a => (
                <tr key={a.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="px-5 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-emerald-50 rounded-md flex items-center justify-center shrink-0">
                        <HiOutlineUser className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{a.patient_name}</p>
                        <p className="text-[11px] text-gray-400 flex items-center gap-1"><HiOutlinePhone className="w-3 h-3" />{a.patient_phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap">
                    <p className="text-xs font-medium text-gray-900">{fmtDate(a.appointment_date)}</p>
                    <p className="text-[11px] text-gray-400">{fmtTime(a.appointment_time)}</p>
                  </td>
                  <td className="px-5 py-3">
                    <p className="text-xs font-medium text-gray-900 capitalize">{a.type}</p>
                    <p className="text-[11px] text-gray-400 max-w-[180px] truncate">{a.reason}</p>
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap"><Badge status={a.status} /></td>
                  <td className="px-5 py-3 whitespace-nowrap text-xs font-medium text-gray-900">{fmtCurrency(a.consultation_fee)}</td>
                  <td className="px-5 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      {a.status === 'pending' && (<>
                        <button onClick={() => updateStatus(a.id, 'confirmed')} className="text-[11px] px-2 py-1 bg-green-50 text-green-700 rounded-md hover:bg-green-100">Confirm</button>
                        <button onClick={() => updateStatus(a.id, 'cancelled')} className="text-[11px] px-2 py-1 bg-red-50 text-red-600 rounded-md hover:bg-red-100">Cancel</button>
                      </>)}
                      {a.status === 'confirmed' && (<>
                        <button onClick={() => updateStatus(a.id, 'completed')} className="text-[11px] px-2 py-1 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100">Complete</button>
                        {!quoteSent.includes(a.id) ? (
                          <button onClick={() => setQuoteTarget(a)} className="text-[11px] px-2 py-1 bg-emerald-50 text-emerald-700 rounded-md hover:bg-emerald-100 flex items-center gap-1">
                            <HiOutlinePaperAirplane className="w-3 h-3" /> Quote
                          </button>
                        ) : <span className="text-[10px] text-gray-400 px-2">Sent</span>}
                      </>)}
                      <button onClick={() => setSelectedAppointment(a)} className="p-1 text-gray-400 hover:text-emerald-600">
                        <HiOutlineEye className="w-3.5 h-3.5" />
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
            <HiOutlineCalendarDays className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-400">No appointments found</p>
          </div>
        )}
      </div>

      {/* Quote Modal */}
      {quoteTarget && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-5 space-y-4 border border-gray-200">
            <h3 className="text-sm font-bold text-gray-900">Send Quote to {quoteTarget.patient_name}</h3>
            <p className="text-xs text-gray-500">{quoteTarget.reason} — {fmtDate(quoteTarget.appointment_date)}</p>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Patient Email *</label>
              <input type="email" value={quoteForm.patientEmail} onChange={e => setQuoteForm({ ...quoteForm, patientEmail: e.target.value })}
                placeholder={quoteTarget.patient_email || 'patient@email.com'}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500" />
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-600 mb-1">Amount *</label>
                <input type="number" value={quoteForm.amount} onChange={e => setQuoteForm({ ...quoteForm, amount: e.target.value })}
                  placeholder="15000" className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Currency</label>
                <select value={quoteForm.currency} onChange={e => setQuoteForm({ ...quoteForm, currency: e.target.value })}
                  className="px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500">
                  <option>INR</option><option>USD</option><option>EUR</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Notes</label>
              <textarea value={quoteForm.notes} onChange={e => setQuoteForm({ ...quoteForm, notes: e.target.value })} rows={2}
                placeholder="Payment terms, coverage details…"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500" />
            </div>
            <div className="flex gap-2 pt-1">
              <button onClick={() => setQuoteTarget(null)} className="flex-1 px-4 py-2 text-sm border border-gray-200 rounded-md hover:bg-gray-50">Cancel</button>
              <button onClick={handleSendQuote} disabled={!quoteForm.amount || !quoteForm.patientEmail}
                className="flex-1 px-4 py-2 text-sm bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50 flex items-center justify-center gap-1.5">
                <HiOutlinePaperAirplane className="w-3.5 h-3.5" /> Send Quote
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg border border-gray-200">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-emerald-50 rounded-md flex items-center justify-center">
                  <HiOutlineUser className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-gray-900">{selectedAppointment.patient_name}</h2>
                  <p className="text-[10px] text-gray-400">Appointment #{selectedAppointment.id}</p>
                </div>
              </div>
              <button onClick={() => setSelectedAppointment(null)} className="p-1.5 hover:bg-gray-100 rounded-md">
                <HiOutlineXMark className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Status</span>
                <Badge status={selectedAppointment.status} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-md p-3">
                  <p className="text-[10px] text-gray-400 flex items-center gap-1 mb-0.5"><HiOutlineCalendarDays className="w-3 h-3" /> Date</p>
                  <p className="font-semibold text-gray-900 text-xs">{fmtDate(selectedAppointment.appointment_date)}</p>
                </div>
                <div className="bg-gray-50 rounded-md p-3">
                  <p className="text-[10px] text-gray-400 flex items-center gap-1 mb-0.5"><HiOutlineClock className="w-3 h-3" /> Time</p>
                  <p className="font-semibold text-gray-900 text-xs">{fmtTime(selectedAppointment.appointment_time)}</p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-md p-3">
                <p className="text-[10px] text-gray-400 flex items-center gap-1 mb-0.5"><HiOutlineDocumentText className="w-3 h-3" /> Type & Reason</p>
                <p className="font-semibold text-gray-900 text-xs capitalize">{selectedAppointment.type}</p>
                <p className="text-gray-600 text-xs mt-0.5">{selectedAppointment.reason}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-gray-400">Patient Contact</p>
                <p className="text-xs text-gray-700 flex items-center gap-1.5"><HiOutlineEnvelope className="w-3.5 h-3.5 text-gray-400" />{selectedAppointment.patient_email || '—'}</p>
                <p className="text-xs text-gray-700 flex items-center gap-1.5"><HiOutlinePhone className="w-3.5 h-3.5 text-gray-400" />{selectedAppointment.patient_phone || '—'}</p>
              </div>
              <div className="flex items-center justify-between bg-emerald-50 rounded-md p-3">
                <span className="text-xs text-emerald-700 flex items-center gap-1.5"><HiOutlineCurrencyDollar className="w-4 h-4" /> Consultation Fee</span>
                <span className="font-bold text-emerald-800 text-sm">{fmtCurrency(selectedAppointment.consultation_fee)}</span>
              </div>
              {selectedAppointment.notes && (
                <div><p className="text-[10px] text-gray-400 mb-1">Notes</p><p className="text-xs text-gray-700 bg-gray-50 rounded-md p-2.5">{selectedAppointment.notes}</p></div>
              )}
              <div className="flex gap-2 pt-1">
                {selectedAppointment.status === 'pending' && (<>
                  <button onClick={() => { updateStatus(selectedAppointment.id, 'confirmed'); setSelectedAppointment(null); }}
                    className="flex-1 py-2 bg-green-600 text-white rounded-md text-xs font-medium hover:bg-green-700">Confirm</button>
                  <button onClick={() => { updateStatus(selectedAppointment.id, 'cancelled'); setSelectedAppointment(null); }}
                    className="flex-1 py-2 bg-red-50 text-red-600 rounded-md text-xs font-medium hover:bg-red-100">Cancel</button>
                </>)}
                {selectedAppointment.status === 'confirmed' && (
                  <button onClick={() => { updateStatus(selectedAppointment.id, 'completed'); setSelectedAppointment(null); }}
                    className="flex-1 py-2 bg-blue-600 text-white rounded-md text-xs font-medium hover:bg-blue-700">Mark Completed</button>
                )}
                <button onClick={() => setSelectedAppointment(null)}
                  className="flex-1 py-2 border border-gray-200 text-gray-700 rounded-md text-xs font-medium hover:bg-gray-50">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;
