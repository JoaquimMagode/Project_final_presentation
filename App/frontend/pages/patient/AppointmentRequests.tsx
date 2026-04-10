import React, { useState, useEffect } from 'react';
import {
  Calendar, Clock, MapPin, Search, Plus, CheckCircle, XCircle,
  AlertCircle, Eye, Edit2, Trash2, Building2, History, FileText,
  Send, DollarSign, Filter, X
} from 'lucide-react';
import { patientsAPI, hospitalsAPI, appointmentsAPI } from '../../services/api';
import { quoteStore, Quote } from '../../services/quoteStore';
import QuotePDF from '../../components/QuotePDF';

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

const HospitalCombobox: React.FC<{ hospitals: Hospital[]; value: string; onChange: (v: string) => void }> = ({ hospitals, value, onChange }) => {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const selected = hospitals.find(h => h.id.toString() === value);
  const filteredList = query
    ? hospitals.filter(h => h.name.toLowerCase().includes(query.toLowerCase()) || h.city.toLowerCase().includes(query.toLowerCase()))
    : hospitals;
  return (
    <div className="relative">
      <input
        type="text"
        value={open ? query : selected ? `${selected.name} — ${selected.city}` : query}
        onChange={e => { setQuery(e.target.value); onChange(''); setOpen(true); }}
        onFocus={() => { setOpen(true); if (selected) setQuery(''); }}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder="Type or select a hospital..."
        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {open && filteredList.length > 0 && (
        <ul className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
          {filteredList.map(h => (
            <li key={h.id}
              onMouseDown={() => { onChange(h.id.toString()); setQuery(''); setOpen(false); }}
              className={`px-3 py-2 text-sm cursor-pointer hover:bg-blue-50 hover:text-blue-700 ${
                value === h.id.toString() ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'
              }`}>
              {h.name} <span className="text-gray-400">— {h.city}</span>
            </li>
          ))}
        </ul>
      )}
      {open && query && filteredList.length === 0 && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg px-3 py-2 text-sm text-gray-400">
          No hospitals found
        </div>
      )}
    </div>
  );
};

const STATUS_CONFIG = {
  pending:   { color: 'bg-amber-50 text-amber-700 border-amber-200',      icon: Clock },
  confirmed: { color: 'bg-blue-50 text-blue-700 border-blue-200',         icon: CheckCircle },
  completed: { color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle },
  cancelled: { color: 'bg-red-50 text-red-700 border-red-200',            icon: XCircle },
  no_show:   { color: 'bg-gray-100 text-gray-600 border-gray-200',        icon: XCircle },
};

const AppointmentRequests: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'appointments' | 'history' | 'quotes'>('appointments');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [allAppointments, setAllAppointments] = useState<Appointment[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [viewingQuote, setViewingQuote] = useState<Quote | null>(null);

  const [bookingForm, setBookingForm] = useState({
    hospitalId: '', date: '', time: '',
    type: 'consultation' as 'consultation' | 'procedure' | 'follow_up' | 'telemedicine',
    reason: '', notes: ''
  });

  useEffect(() => {
    fetchAppointments();
    fetchHospitals();
    setQuotes(quoteStore.getQuotes());
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await appointmentsAPI.getAppointments();
      if (response.success) {
        const formatted = response.data.appointments.map((apt: any) => ({
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
        setAllAppointments(formatted);
        setAppointments(formatted.filter((a: Appointment) => ['pending', 'confirmed'].includes(a.status)));
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
      if (response.success) setHospitals(response.data.hospitals || []);
    } catch (err) { console.error('Failed to load hospitals:', err); }
  };

  const filtered = (list: Appointment[]) =>
    list.filter(a => {
      const matchSearch = [a.hospital_name, a.reason, a.hospital_city].some(f =>
        f?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      const matchStatus = filterStatus === 'all' || a.status === filterStatus;
      return matchSearch && matchStatus;
    });

  const handleBookingSubmit = async () => {
    if (!bookingForm.hospitalId || !bookingForm.date || !bookingForm.time || !bookingForm.reason) {
      setError('Please fill in all required fields'); return;
    }
    try {
      setLoading(true); setError(''); setSuccess('');
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
      setBookingForm({ hospitalId: '', date: '', time: '', type: 'consultation', reason: '', notes: '' });
      fetchAppointments();
    } catch (err: any) {
      setError(err.message || 'Failed to book appointment');
    } finally { setLoading(false); }
  };

  const handleCancel = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) return;
    try {
      setLoading(true);
      await appointmentsAPI.updateAppointment(parseInt(id), 'cancelled');
      setSuccess('Appointment cancelled successfully');
      fetchAppointments();
    } catch (err: any) {
      setError(err.message || 'Failed to cancel appointment');
    } finally { setLoading(false); }
  };

  const handleAcceptQuote = (id: string) => {
    quoteStore.acceptQuote(id);
    setQuotes(quoteStore.getQuotes());
    setSuccess('Quote accepted! A billing record has been created.');
  };

  const handleDeclineQuote = (id: string) => {
    quoteStore.declineQuote(id);
    setQuotes(quoteStore.getQuotes());
  };

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

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  const formatTime = (t: string) => {
    if (!t) return 'N/A';
    const date = t.includes('T') ? new Date(t) : new Date(`1970-01-01T${t}`);
    return isNaN(date.getTime()) ? t : date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(amount || 0);

  const stats = {
    pending:   allAppointments.filter(a => a.status === 'pending').length,
    confirmed: allAppointments.filter(a => a.status === 'confirmed').length,
    completed: allAppointments.filter(a => a.status === 'completed').length,
    cancelled: allAppointments.filter(a => a.status === 'cancelled').length,
  };

  const AppointmentCard = ({ appointment, showActions = true }: { appointment: Appointment; showActions?: boolean }) => (
    <div className="px-6 py-4 hover:bg-gray-50/60 transition-colors">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
          <Building2 className="w-5 h-5 text-blue-600" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="font-semibold text-gray-900 text-sm">{appointment.hospital_name}</span>
            {getStatusBadge(appointment.status)}
            <span className="text-xs text-gray-400 capitalize bg-gray-100 px-2 py-0.5 rounded-full">{appointment.type}</span>
          </div>
          <p className="text-sm text-gray-500 truncate mb-2">{appointment.reason}</p>
          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400">
            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{formatDate(appointment.appointment_date)}</span>
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{formatTime(appointment.appointment_time)}</span>
            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{appointment.hospital_city}</span>
            {appointment.consultation_fee && (
              <span className="flex items-center gap-1 font-medium text-gray-600"><DollarSign className="w-3.5 h-3.5" />{formatCurrency(appointment.consultation_fee)}</span>
            )}
          </div>
        </div>

        {showActions && (
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {appointment.status === 'pending' && (
              <button onClick={() => handleCancel(appointment.id)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const pendingQuotes = quotes.filter(q => q.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hospital Appointments</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage your appointments and medical history</p>
        </div>
        <button onClick={() => setShowBookingModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" /> Book Appointment
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
        </div>
      )}
      {success && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 text-sm flex items-center gap-2">
          <CheckCircle className="w-4 h-4 flex-shrink-0" />{success}
        </div>
      )}

      {/* Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Pending',   value: stats.pending,   color: 'text-amber-600',   bg: 'bg-amber-50',   border: 'border-amber-100' },
          { label: 'Confirmed', value: stats.confirmed, color: 'text-blue-600',    bg: 'bg-blue-50',    border: 'border-blue-100' },
          { label: 'Completed', value: stats.completed, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
          { label: 'Cancelled', value: stats.cancelled, color: 'text-red-500',     bg: 'bg-red-50',     border: 'border-red-100' },
        ].map(({ label, value, color, bg, border }) => (
          <div key={label} className={`${bg} border ${border} rounded-xl p-4 text-center`}>
            <p className={`text-2xl font-black ${color}`}>{value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Tabs + Content */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Tab Bar */}
        <div className="border-b border-gray-100 px-6 flex gap-6">
          {([
            { key: 'appointments', label: 'Current Appointments' },
            { key: 'history',      label: 'History', icon: History },
            { key: 'quotes',       label: 'Quotes',  icon: DollarSign, badge: pendingQuotes },
          ] as const).map(({ key, label, icon: Icon, badge }) => (
            <button key={key} onClick={() => setActiveTab(key)}
              className={`py-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === key ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}>
              {Icon && <Icon className="w-4 h-4" />}
              {label}
              {badge ? (
                <span className="ml-1 bg-amber-500 text-white text-xs rounded-full px-1.5 py-0.5">{badge}</span>
              ) : null}
            </button>
          ))}
        </div>

        {/* Search + Filter */}
        {(activeTab === 'appointments' || activeTab === 'history') && (
          <div className="px-6 py-4 border-b border-gray-50 flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" placeholder="Search by hospital, city or reason..."
                value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                {activeTab === 'history' && <option value="completed">Completed</option>}
                {activeTab === 'history' && <option value="cancelled">Cancelled</option>}
                {activeTab === 'history' && <option value="no_show">No Show</option>}
              </select>
            </div>
          </div>
        )}

        {/* Current Appointments */}
        {activeTab === 'appointments' && (
          <>
            <div className="px-6 py-3 flex items-center justify-between border-b border-gray-50">
              <span className="text-sm font-medium text-gray-700">Active Appointments</span>
              <span className="text-xs text-gray-400">{filtered(appointments).length} total</span>
            </div>
            {filtered(appointments).length === 0 ? (
              <div className="text-center py-16">
                <Calendar className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-400 text-sm">No current appointments</p>
                <button onClick={() => setShowBookingModal(true)} className="mt-3 text-blue-600 text-sm font-medium hover:underline">
                  Book your first appointment
                </button>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {filtered(appointments).map(a => <AppointmentCard key={a.id} appointment={a} />)}
              </div>
            )}
          </>
        )}

        {/* History */}
        {activeTab === 'history' && (
          <>
            <div className="px-6 py-3 flex items-center justify-between border-b border-gray-50">
              <span className="text-sm font-medium text-gray-700">All Appointments</span>
              <span className="text-xs text-gray-400">{filtered(allAppointments).length} total</span>
            </div>
            {filtered(allAppointments).length === 0 ? (
              <div className="text-center py-16">
                <FileText className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-400 text-sm">No appointment history found</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {filtered(allAppointments).map(a => <AppointmentCard key={a.id} appointment={a} showActions={false} />)}
              </div>
            )}
          </>
        )}

        {/* Quotes */}
        {activeTab === 'quotes' && (
          <div className="p-6">
            {quotes.length === 0 ? (
              <div className="text-center py-16">
                <Send className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-400 text-sm">No quotes received yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {quotes.map(quote => (
                  <div key={quote.id} className="py-4 first:pt-0 last:pb-0">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <DollarSign className="w-5 h-5 text-teal-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="font-semibold text-gray-900 text-sm">{quote.hospitalName}</span>
                          <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${
                            quote.status === 'pending'  ? 'bg-amber-50 text-amber-700 border-amber-200' :
                            quote.status === 'accepted' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                            'bg-red-50 text-red-600 border-red-200'
                          }`}>{quote.status}</span>
                        </div>
                        <p className="text-sm text-gray-500 mb-1">{quote.reason}</p>
                        <p className="text-xs text-gray-400 mb-2">{formatDate(quote.appointmentDate)} · {quote.appointmentTime}</p>
                        {quote.notes && <p className="text-xs text-gray-400 italic mb-2">{quote.notes}</p>}
                        <p className="text-lg font-black text-emerald-600">{quote.currency} {quote.amount.toLocaleString()}</p>
                      </div>
                      <div className="flex flex-col gap-2 flex-shrink-0">
                        <button onClick={() => setViewingQuote(quote)}
                          className="px-3 py-1.5 bg-teal-50 text-teal-700 border border-teal-200 text-xs font-semibold rounded-lg hover:bg-teal-100 flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5" /> View PDF
                        </button>
                        {quote.status === 'pending' && (
                          <>
                            <button onClick={() => handleAcceptQuote(quote.id)}
                              className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold rounded-lg hover:bg-emerald-100 flex items-center gap-1">
                              <CheckCircle className="w-3.5 h-3.5" /> Accept
                            </button>
                            <button onClick={() => handleDeclineQuote(quote.id)}
                              className="px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 text-xs font-semibold rounded-lg hover:bg-red-100 flex items-center gap-1">
                              <XCircle className="w-3.5 h-3.5" /> Decline
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {viewingQuote && <QuotePDF quote={viewingQuote} onClose={() => setViewingQuote(null)} />}

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">Book Hospital Appointment</h3>
              <button onClick={() => setShowBookingModal(false)} className="p-1.5 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Select Hospital *</label>
                <HospitalCombobox
                  hospitals={hospitals}
                  value={bookingForm.hospitalId}
                  onChange={val => setBookingForm({ ...bookingForm, hospitalId: val })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Date *</label>
                  <input type="date" value={bookingForm.date} onChange={e => setBookingForm({ ...bookingForm, date: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Time *</label>
                  <select value={bookingForm.time} onChange={e => setBookingForm({ ...bookingForm, time: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Select time</option>
                    {['09:00','09:30','10:00','10:30','11:00','11:30','14:00','14:30','15:00','15:30','16:00','16:30'].map(t => (
                      <option key={t} value={t}>{new Date(`1970-01-01T${t}`).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Appointment Type</label>
                <select value={bookingForm.type} onChange={e => setBookingForm({ ...bookingForm, type: e.target.value as any })}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="consultation">Consultation</option>
                  <option value="procedure">Procedure</option>
                  <option value="follow_up">Follow-up</option>
                  <option value="telemedicine">Telemedicine</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Reason for Visit *</label>
                <textarea value={bookingForm.reason} onChange={e => setBookingForm({ ...bookingForm, reason: e.target.value })}
                  rows={3} placeholder="Describe your symptoms or reason for the appointment"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Additional Notes (Optional)</label>
                <textarea value={bookingForm.notes} onChange={e => setBookingForm({ ...bookingForm, notes: e.target.value })}
                  rows={2} placeholder="Any additional information for the hospital"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>

            <div className="px-6 pb-6 flex gap-3">
              <button onClick={() => setShowBookingModal(false)}
                className="flex-1 px-4 py-2.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-700 font-medium">
                Cancel
              </button>
              <button onClick={handleBookingSubmit} disabled={loading}
                className="flex-1 px-4 py-2.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-semibold">
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
