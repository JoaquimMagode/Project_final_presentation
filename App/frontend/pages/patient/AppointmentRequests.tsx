import React, { useState, useEffect } from 'react';
import {
  HiOutlineCalendarDays, HiOutlineClock, HiOutlineMapPin, HiOutlineMagnifyingGlass,
  HiOutlinePlus, HiOutlineCheckCircle, HiOutlineXCircle, HiOutlineExclamationCircle,
  HiOutlineEye, HiOutlinePencilSquare, HiOutlineTrash, HiOutlineBuildingOffice2,
  HiOutlineDocumentText, HiOutlinePaperAirplane, HiOutlineCurrencyDollar, HiOutlineXMark, HiOutlineUser,
} from 'react-icons/hi2';
import { patientsAPI, hospitalsAPI, appointmentsAPI } from '../../services/api';
import { quoteStore, Quote } from '../../services/quoteStore';

interface Appointment {
  id: string; hospital_name: string; hospital_city: string; hospital_address: string;
  appointment_date: string; appointment_time: string; type: string; status: string;
  reason: string; notes?: string; consultation_fee?: number; created_at: string;
}
interface Hospital { id: number; name: string; city: string; address: string; specialties: string[]; phone?: string; }

const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
const statusCfg: Record<string, { bg: string; icon: any }> = {
  pending: { bg: 'bg-yellow-50 text-yellow-700', icon: HiOutlineClock },
  confirmed: { bg: 'bg-blue-50 text-blue-700', icon: HiOutlineCheckCircle },
  completed: { bg: 'bg-green-50 text-green-700', icon: HiOutlineCheckCircle },
  cancelled: { bg: 'bg-red-50 text-red-700', icon: HiOutlineXCircle },
  no_show: { bg: 'bg-gray-100 text-gray-600', icon: HiOutlineXCircle },
};
const Badge = ({ status }: { status: string }) => {
  const c = statusCfg[status] || statusCfg.pending; const Icon = c.icon;
  return <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium ${c.bg}`}><Icon className="w-3 h-3" />{status.replace('_', ' ')}</span>;
};

const AppointmentRequests: React.FC = () => {
  const [tab, setTab] = useState<'appointments' | 'history' | 'quotes'>('appointments');
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showBooking, setShowBooking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [allAppointments, setAllAppointments] = useState<Appointment[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [form, setForm] = useState({ hospitalId: '', date: '', time: '', type: 'consultation', reason: '', notes: '' });

  useEffect(() => { fetchAppointments(); fetchHospitals(); setQuotes(quoteStore.getQuotes()); }, []);

  const fetchAppointments = async () => {
    try { setLoading(true); const res = await appointmentsAPI.getAppointments();
      if (res.success) { const all = res.data.appointments.map((a: any) => ({ id: a.id.toString(), hospital_name: a.hospital_name, hospital_city: a.hospital_city, hospital_address: a.hospital_address, appointment_date: a.appointment_date, appointment_time: a.appointment_time, type: a.type, status: a.status, reason: a.reason, notes: a.notes, consultation_fee: a.consultation_fee, created_at: a.created_at }));
        setAllAppointments(all); setAppointments(all.filter((a: Appointment) => ['pending', 'confirmed'].includes(a.status))); }
    } catch (e: any) { setError(e.message || 'Failed to load'); } finally { setLoading(false); }
  };
  const fetchHospitals = async () => { try { const res = await hospitalsAPI.getHospitals({ limit: 100 }); if (res.success) setHospitals(res.data.hospitals || []); } catch {} };

  const filter = (list: Appointment[]) => list.filter(a => {
    const s = a.hospital_name.toLowerCase().includes(search.toLowerCase()) || a.reason.toLowerCase().includes(search.toLowerCase());
    return s && (filterStatus === 'all' || a.status === filterStatus);
  });

  const handleBook = async () => {
    if (!form.hospitalId || !form.date || !form.time || !form.reason) { setError('Fill all required fields'); return; }
    try { setLoading(true); setError('');
      await appointmentsAPI.createAppointment({ hospital_id: parseInt(form.hospitalId), appointment_date: form.date, appointment_time: form.time, type: form.type, reason: form.reason, notes: form.notes });
      setSuccess('Appointment booked!'); setShowBooking(false); setForm({ hospitalId: '', date: '', time: '', type: 'consultation', reason: '', notes: '' }); fetchAppointments();
    } catch (e: any) { setError(e.message || 'Failed'); } finally { setLoading(false); }
  };
  const handleCancel = async (id: string) => { if (!confirm('Cancel this appointment?')) return; try { setLoading(true); await appointmentsAPI.updateAppointment(parseInt(id), 'cancelled'); setSuccess('Cancelled'); fetchAppointments(); } catch (e: any) { setError(e.message); } finally { setLoading(false); } };
  const handleAcceptQuote = (id: string) => { quoteStore.acceptQuote(id); setQuotes(quoteStore.getQuotes()); setSuccess('Quote accepted!'); };
  const handleDeclineQuote = (id: string) => { quoteStore.declineQuote(id); setQuotes(quoteStore.getQuotes()); };

  const pending = appointments.filter(a => a.status === 'pending').length;
  const confirmed = appointments.filter(a => a.status === 'confirmed').length;
  const completed = allAppointments.filter(a => a.status === 'completed').length;
  const cancelled = allAppointments.filter(a => a.status === 'cancelled').length;
  const inputCls = "w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500";
  const tabs = [
    { id: 'appointments' as const, label: 'Current' },
    { id: 'history' as const, label: 'History' },
    { id: 'quotes' as const, label: 'Quotes', badge: quotes.filter(q => q.status === 'pending').length },
  ];

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div><h1 className="text-lg font-bold text-gray-900">Appointments</h1><p className="text-xs text-gray-500">Manage your hospital appointments</p></div>
        <button onClick={() => setShowBooking(true)} className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 text-white text-xs font-medium rounded-md hover:bg-emerald-700">
          <HiOutlinePlus className="w-3.5 h-3.5" /> Book Appointment
        </button>
      </div>

      {error && <div className="p-3 bg-red-50 border border-red-200 rounded-md text-xs text-red-700 flex items-center gap-2"><HiOutlineExclamationCircle className="w-4 h-4" />{error}</div>}
      {success && <div className="p-3 bg-green-50 border border-green-200 rounded-md text-xs text-green-700 flex items-center gap-2"><HiOutlineCheckCircle className="w-4 h-4" />{success}</div>}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {([{ l: 'Pending', v: pending, c: 'bg-yellow-500' }, { l: 'Confirmed', v: confirmed, c: 'bg-blue-500' }, { l: 'Completed', v: completed, c: 'bg-emerald-500' }, { l: 'Cancelled', v: cancelled, c: 'bg-red-500' }]).map(s => (
          <div key={s.l} className="bg-white rounded-lg px-4 py-3 border border-gray-200 flex items-center gap-3">
            <div className={`w-2 h-8 rounded-full ${s.c}`}></div>
            <div><p className="text-[11px] text-gray-500">{s.l}</p><p className="text-lg font-bold text-gray-900 leading-tight">{s.v}</p></div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200 px-5">
          <nav className="flex gap-6">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`py-3 text-xs font-medium border-b-2 transition-colors ${tab === t.id ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                {t.label}
                {t.badge ? <span className="ml-1 bg-amber-500 text-white text-[10px] rounded-full px-1.5 py-0.5">{t.badge}</span> : null}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-5">
          {/* Search */}
          {(tab === 'appointments' || tab === 'history') && (
            <div className="flex gap-2 mb-4">
              <div className="flex-1 relative">
                <HiOutlineMagnifyingGlass className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500 w-full" />
              </div>
              <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-md px-3 py-1.5">
                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="bg-transparent text-xs font-medium text-gray-600 outline-none cursor-pointer">
                  <option value="all">All Status</option><option value="pending">Pending</option><option value="confirmed">Confirmed</option>
                  {tab === 'history' && <><option value="completed">Completed</option><option value="cancelled">Cancelled</option></>}
                </select>
              </div>
            </div>
          )}

          {/* Appointment list */}
          {(tab === 'appointments' || tab === 'history') && (
            <div className="space-y-2.5">
              {filter(tab === 'appointments' ? appointments : allAppointments).map(a => (
                <div key={a.id} className="bg-gray-50 rounded-md p-4 hover:bg-gray-100/80 transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <p className="text-sm font-medium text-gray-900">{a.hospital_name}</p>
                        <Badge status={a.status} />
                        <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-md font-medium capitalize">{a.type}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] text-gray-500 mb-1.5">
                        <span className="flex items-center gap-1"><HiOutlineMapPin className="w-3 h-3" />{a.hospital_city}</span>
                        <span className="flex items-center gap-1"><HiOutlineCalendarDays className="w-3 h-3" />{fmtDate(a.appointment_date)}</span>
                        <span className="flex items-center gap-1"><HiOutlineBuildingOffice2 className="w-3 h-3" />{a.hospital_address}</span>
                        <span className="flex items-center gap-1"><HiOutlineClock className="w-3 h-3" />{a.appointment_time}</span>
                      </div>
                      <p className="text-xs text-gray-600"><span className="font-medium">Reason:</span> {a.reason}</p>
                      {a.consultation_fee && <p className="text-xs text-gray-500 mt-0.5">Fee: ₹{a.consultation_fee}</p>}
                    </div>
                    {tab === 'appointments' && (
                      <div className="flex items-center gap-1 shrink-0">
                        <button className="p-1.5 text-gray-400 hover:text-emerald-600 rounded-md hover:bg-white"><HiOutlineEye className="w-3.5 h-3.5" /></button>
                        {a.status === 'pending' && <>
                          <button className="p-1.5 text-gray-400 hover:text-blue-600 rounded-md hover:bg-white"><HiOutlinePencilSquare className="w-3.5 h-3.5" /></button>
                          <button onClick={() => handleCancel(a.id)} className="p-1.5 text-gray-400 hover:text-red-500 rounded-md hover:bg-white"><HiOutlineTrash className="w-3.5 h-3.5" /></button>
                        </>}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {filter(tab === 'appointments' ? appointments : allAppointments).length === 0 && (
                <div className="text-center py-10"><HiOutlineCalendarDays className="w-10 h-10 text-gray-300 mx-auto mb-2" /><p className="text-sm text-gray-400">No appointments found</p></div>
              )}
            </div>
          )}

          {/* Quotes */}
          {tab === 'quotes' && (
            <div className="space-y-3">
              {quotes.length === 0 ? (
                <div className="text-center py-10"><HiOutlinePaperAirplane className="w-10 h-10 text-gray-300 mx-auto mb-2" /><p className="text-sm text-gray-400">No quotes yet</p></div>
              ) : quotes.map(q => (
                <div key={q.id} className="bg-gray-50 border border-gray-200 rounded-md p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-gray-900">{q.hospitalName}</p>
                        <span className={`text-[10px] px-2 py-0.5 rounded-md font-medium ${q.status === 'pending' ? 'bg-amber-50 text-amber-700' : q.status === 'accepted' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>{q.status}</span>
                      </div>
                      <p className="text-xs text-gray-600">{q.reason}</p>
                      <p className="text-[11px] text-gray-400">{fmtDate(q.appointmentDate)} · {q.appointmentTime}</p>
                      <p className="text-lg font-bold text-emerald-600">{q.currency} {q.amount.toLocaleString()}</p>
                    </div>
                    {q.status === 'pending' && (
                      <div className="flex flex-col gap-1.5 shrink-0">
                        <button onClick={() => handleAcceptQuote(q.id)} className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-medium rounded-md hover:bg-emerald-700">Accept</button>
                        <button onClick={() => handleDeclineQuote(q.id)} className="px-3 py-1.5 border border-red-200 text-red-600 text-xs font-medium rounded-md hover:bg-red-50">Decline</button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Booking Modal */}
      {showBooking && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-md max-h-[90vh] overflow-y-auto border border-gray-200 shadow-lg">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200">
              <h3 className="text-[13px] font-semibold text-gray-900">New Appointment</h3>
              <button onClick={() => setShowBooking(false)} className="p-1 hover:bg-gray-100 transition-colors">
                <HiOutlineXMark className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            {/* Form */}
            <div className="px-5 py-4 space-y-4">
              <div>
                <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wide mb-1">Hospital</label>
                <select value={form.hospitalId} onChange={e => setForm({ ...form, hospitalId: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-200 bg-white focus:outline-none focus:border-gray-400">
                  <option value="">Select hospital</option>
                  {hospitals.map(h => <option key={h.id} value={h.id}>{h.name} – {h.city}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wide mb-1">Date</label>
                  <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 text-sm border border-gray-200 bg-white focus:outline-none focus:border-gray-400" />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wide mb-1">Time</label>
                  <select value={form.time} onChange={e => setForm({ ...form, time: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-200 bg-white focus:outline-none focus:border-gray-400">
                    <option value="">Select</option>
                    {['09:00','09:30','10:00','10:30','11:00','11:30','14:00','14:30','15:00','15:30','16:00'].map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wide mb-1">Type</label>
                <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-200 bg-white focus:outline-none focus:border-gray-400">
                  <option value="consultation">Consultation</option>
                  <option value="procedure">Procedure</option>
                  <option value="follow_up">Follow-up</option>
                  <option value="telemedicine">Telemedicine</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wide mb-1">Reason</label>
                <textarea value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} rows={2}
                  className="w-full px-3 py-2 text-sm border border-gray-200 bg-white focus:outline-none focus:border-gray-400 resize-none"
                  placeholder="Describe symptoms or reason" />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wide mb-1">Notes <span className="text-gray-300 normal-case tracking-normal">optional</span></label>
                <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={2}
                  className="w-full px-3 py-2 text-sm border border-gray-200 bg-white focus:outline-none focus:border-gray-400 resize-none"
                  placeholder="Additional information" />
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-gray-200 flex gap-2">
              <button onClick={() => setShowBooking(false)}
                className="flex-1 px-4 py-2 text-sm font-medium border border-gray-200 hover:bg-gray-50 transition-colors text-gray-600">
                Cancel
              </button>
              <button onClick={handleBook} disabled={loading}
                className="flex-1 px-4 py-2 text-sm font-medium bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-50 transition-colors">
                {loading ? 'Booking…' : 'Book Appointment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentRequests;
