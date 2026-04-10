import React, { useState, useEffect } from 'react';
import {
  HiOutlineUsers, HiOutlineMagnifyingGlass, HiOutlineEye, HiOutlinePhone,
  HiOutlineEnvelope, HiOutlineCalendarDays, HiOutlineCurrencyDollar,
  HiOutlineXMark, HiOutlineUser, HiOutlineMapPin, HiOutlineHeart,
  HiOutlineExclamationCircle, HiOutlineCreditCard, HiOutlineChevronLeft, HiOutlineChevronRight,
} from 'react-icons/hi2';

interface Patient {
  id: number; name: string; email: string; phone: string; date_of_birth: string;
  gender: string; address: string; blood_group: string; allergies: string;
  medical_history: string; emergency_contact_name: string; emergency_contact_phone: string;
  total_appointments: number; last_visit: string; total_paid: number;
  appointments?: any[]; payments?: any[];
}

const API = 'http://localhost:5000/api/hospital-dashboard';
const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' });
const fmt = (d: string) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A';
const fmtCurrency = (n: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(n || 0);

const Patients: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => { fetchPatients(); }, [currentPage, searchTerm]);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/patients?page=${currentPage}&limit=10&search=${searchTerm}`, { headers: authHeaders() });
      if (res.ok) { const data = await res.json(); setPatients(data.data.patients); setTotalPages(data.data.pagination.pages); setTotal(data.data.pagination.total); }
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const openDetail = async (id: number) => {
    setDetailLoading(true); setSelectedPatient(patients.find(p => p.id === id) || null);
    try { const res = await fetch(`${API}/patients/${id}`, { headers: authHeaders() }); if (res.ok) { const data = await res.json(); setSelectedPatient(data.data.patient); } }
    catch (e) { console.error(e); } finally { setDetailLoading(false); }
  };

  const statsData = [
    { label: 'Total Patients', value: total, icon: HiOutlineUsers, accent: 'bg-blue-500' },
    { label: 'Active Patients', value: patients.filter(p => p.total_appointments > 0).length, icon: HiOutlineUsers, accent: 'bg-emerald-500' },
    { label: 'Total Revenue', value: fmtCurrency(patients.reduce((s, p) => s + (p.total_paid || 0), 0)), icon: HiOutlineCurrencyDollar, accent: 'bg-amber-500' },
  ];

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-gray-900">Patients</h1>
          <p className="text-xs text-gray-500">Manage your hospital patients</p>
        </div>
        <div className="relative">
          <HiOutlineMagnifyingGlass className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input type="text" placeholder="Search patients..." value={searchTerm}
            onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 w-56" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {statsData.map(({ label, value, icon: Icon, accent }) => (
          <div key={label} className="bg-white rounded-lg px-4 py-3.5 border border-gray-200 flex items-center gap-3">
            <div className={`w-9 h-9 rounded-md flex items-center justify-center shrink-0 ${accent}`}>
              <Icon className="w-[18px] h-[18px] text-white" />
            </div>
            <div>
              <p className="text-[11px] text-gray-500 leading-none">{label}</p>
              <p className="text-lg font-bold text-gray-900 leading-tight mt-0.5">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-5 py-3.5 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900">Patient List</h3>
        </div>
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600"></div>
          </div>
        ) : patients.length === 0 ? (
          <div className="text-center py-12 text-sm text-gray-400">No patients found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/60">
                  {['Patient', 'Contact', 'Appointments', 'Last Visit', 'Total Paid', ''].map(h => (
                    <th key={h} className="px-5 py-2.5 text-left text-[11px] font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {patients.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-emerald-50 rounded-md flex items-center justify-center text-emerald-600 text-xs font-bold shrink-0">
                          {p.name?.charAt(0)?.toUpperCase() || 'P'}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{p.name || 'N/A'}</p>
                          <p className="text-[11px] text-gray-400 capitalize">{p.gender || '—'}{p.date_of_birth ? ` · ${new Date().getFullYear() - new Date(p.date_of_birth).getFullYear()} yrs` : ''}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap">
                      <p className="text-xs text-gray-700 flex items-center gap-1"><HiOutlineEnvelope className="w-3 h-3 text-gray-400" />{p.email || '—'}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1"><HiOutlinePhone className="w-3 h-3 text-gray-400" />{p.phone || '—'}</p>
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">{p.total_appointments}</span>
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap text-xs text-gray-600">{fmt(p.last_visit)}</td>
                    <td className="px-5 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{fmtCurrency(p.total_paid)}</td>
                    <td className="px-5 py-3 whitespace-nowrap">
                      <button onClick={() => openDetail(p.id)}
                        className="flex items-center gap-1 text-emerald-600 hover:text-emerald-700 text-xs font-medium">
                        <HiOutlineEye className="w-3.5 h-3.5" /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {totalPages > 1 && (
          <div className="px-5 py-3 border-t border-gray-200 flex items-center justify-between">
            <span className="text-xs text-gray-500">Page {currentPage} of {totalPages}</span>
            <div className="flex gap-1.5">
              <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}
                className="p-1.5 border border-gray-200 rounded-md disabled:opacity-40 hover:bg-gray-50 transition-colors">
                <HiOutlineChevronLeft className="w-3.5 h-3.5 text-gray-600" />
              </button>
              <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}
                className="p-1.5 border border-gray-200 rounded-md disabled:opacity-40 hover:bg-gray-50 transition-colors">
                <HiOutlineChevronRight className="w-3.5 h-3.5 text-gray-600" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Patient Detail Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-200">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-50 rounded-md flex items-center justify-center text-emerald-600 text-sm font-bold">
                  {selectedPatient.name?.charAt(0)?.toUpperCase() || 'P'}
                </div>
                <div>
                  <h2 className="text-sm font-bold text-gray-900">{selectedPatient.name}</h2>
                  <p className="text-[11px] text-gray-500 capitalize">
                    {selectedPatient.gender || '—'}{selectedPatient.date_of_birth ? ` · ${new Date().getFullYear() - new Date(selectedPatient.date_of_birth).getFullYear()} years old` : ''}
                  </p>
                </div>
              </div>
              <button onClick={() => setSelectedPatient(null)} className="p-1.5 hover:bg-gray-100 rounded-md">
                <HiOutlineXMark className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            {detailLoading ? (
              <div className="flex items-center justify-center h-48">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600"></div>
              </div>
            ) : (
              <div className="p-5 space-y-5">
                {/* Summary */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Appointments', value: selectedPatient.total_appointments, icon: HiOutlineCalendarDays, bg: 'bg-blue-50', fg: 'text-blue-600' },
                    { label: 'Last Visit', value: fmt(selectedPatient.last_visit), icon: HiOutlineCalendarDays, bg: 'bg-green-50', fg: 'text-green-600' },
                    { label: 'Total Paid', value: fmtCurrency(selectedPatient.total_paid), icon: HiOutlineCreditCard, bg: 'bg-amber-50', fg: 'text-amber-600' },
                  ].map(({ label, value, icon: Icon, bg, fg }) => (
                    <div key={label} className={`rounded-md p-3 ${bg}`}>
                      <Icon className={`w-4 h-4 mb-1 ${fg}`} />
                      <p className="text-[10px] text-gray-500">{label}</p>
                      <p className="font-bold text-gray-900 text-xs">{value}</p>
                    </div>
                  ))}
                </div>
                {/* Contact */}
                <div>
                  <h3 className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1.5"><HiOutlineUser className="w-3.5 h-3.5" /> Contact</h3>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div><span className="text-gray-400">Email</span><p className="font-medium text-gray-900">{selectedPatient.email || '—'}</p></div>
                    <div><span className="text-gray-400">Phone</span><p className="font-medium text-gray-900">{selectedPatient.phone || '—'}</p></div>
                    <div><span className="text-gray-400">DOB</span><p className="font-medium text-gray-900">{fmt(selectedPatient.date_of_birth)}</p></div>
                    <div><span className="text-gray-400">Blood Group</span><p className="font-medium text-gray-900">{selectedPatient.blood_group || '—'}</p></div>
                    <div className="col-span-2"><span className="text-gray-400">Address</span><p className="font-medium text-gray-900">{selectedPatient.address || '—'}</p></div>
                  </div>
                </div>
                {/* Medical */}
                <div>
                  <h3 className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1.5"><HiOutlineHeart className="w-3.5 h-3.5" /> Medical</h3>
                  <div className="grid grid-cols-1 gap-2 text-xs">
                    <div><span className="text-gray-400">Allergies</span><p className="font-medium text-gray-900">{selectedPatient.allergies || '—'}</p></div>
                    <div><span className="text-gray-400">History</span><p className="font-medium text-gray-900">{selectedPatient.medical_history || '—'}</p></div>
                  </div>
                </div>
                {/* Emergency */}
                {(selectedPatient.emergency_contact_name || selectedPatient.emergency_contact_phone) && (
                  <div>
                    <h3 className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1.5"><HiOutlineExclamationCircle className="w-3.5 h-3.5" /> Emergency Contact</h3>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div><span className="text-gray-400">Name</span><p className="font-medium text-gray-900">{selectedPatient.emergency_contact_name || '—'}</p></div>
                      <div><span className="text-gray-400">Phone</span><p className="font-medium text-gray-900">{selectedPatient.emergency_contact_phone || '—'}</p></div>
                    </div>
                  </div>
                )}
                {/* Appointment History */}
                {selectedPatient.appointments && selectedPatient.appointments.length > 0 && (
                  <div>
                    <h3 className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1.5"><HiOutlineCalendarDays className="w-3.5 h-3.5" /> Appointment History</h3>
                    <div className="space-y-1.5">
                      {selectedPatient.appointments.slice(0, 5).map((apt: any) => (
                        <div key={apt.id} className="flex items-center justify-between p-2.5 bg-gray-50 rounded-md text-xs">
                          <div>
                            <p className="font-medium text-gray-900">{apt.reason || 'Consultation'}</p>
                            <p className="text-[10px] text-gray-400">{fmt(apt.appointment_date)}</p>
                          </div>
                          <span className={`text-[10px] px-2 py-0.5 rounded-md font-medium ${
                            apt.status === 'completed' ? 'bg-green-50 text-green-700' :
                            apt.status === 'confirmed' ? 'bg-blue-50 text-blue-700' :
                            apt.status === 'cancelled' ? 'bg-red-50 text-red-700' : 'bg-yellow-50 text-yellow-700'
                          }`}>{apt.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Patients;
