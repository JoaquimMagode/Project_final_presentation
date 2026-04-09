import React, { useState, useEffect } from 'react';
import {
  Users, Search, Eye, Phone, Mail, Calendar, DollarSign,
  X, User, MapPin, Heart, AlertCircle, CreditCard
} from 'lucide-react';

interface Patient {
  id: number;
  name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  gender: string;
  address: string;
  blood_group: string;
  allergies: string;
  medical_history: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  total_appointments: number;
  last_visit: string;
  total_paid: number;
  appointments?: any[];
  payments?: any[];
}

const API = 'http://localhost:5000/api/hospital-dashboard';

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`,
  'Content-Type': 'application/json',
});

const fmt = (d: string) => d ? new Date(d).toLocaleDateString() : 'N/A';
const fmtCurrency = (n: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(n || 0);

const Patients: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    fetchPatients();
  }, [currentPage, searchTerm]);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${API}/patients?page=${currentPage}&limit=10&search=${searchTerm}`,
        { headers: authHeaders() }
      );
      if (res.ok) {
        const data = await res.json();
        setPatients(data.data.patients);
        setTotalPages(data.data.pagination.pages);
        setTotal(data.data.pagination.total);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const openDetail = async (id: number) => {
    setDetailLoading(true);
    setSelectedPatient(patients.find(p => p.id === id) || null);
    try {
      const res = await fetch(`${API}/patients/${id}`, { headers: authHeaders() });
      if (res.ok) {
        const data = await res.json();
        setSelectedPatient(data.data.patient);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setDetailLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Patients</h1>
          <p className="text-gray-600">Manage your hospital patients</p>
        </div>
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search patients..."
            value={searchTerm}
            onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Patients', value: total, icon: Users, color: 'bg-blue-100 text-blue-600' },
          { label: 'Active Patients', value: patients.filter(p => p.total_appointments > 0).length, icon: Users, color: 'bg-teal-100 text-teal-600' },
          { label: 'Total Revenue', value: fmtCurrency(patients.reduce((s, p) => s + (p.total_paid || 0), 0)), icon: DollarSign, color: 'bg-yellow-100 text-yellow-600' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{label}</p>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
            </div>
            <div className={`p-3 rounded-lg ${color}`}><Icon className="w-6 h-6" /></div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Patient List</h3>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
          </div>
        ) : patients.length === 0 ? (
          <div className="text-center py-12 text-gray-400">No patients found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {['Patient', 'Contact', 'Appointments', 'Last Visit', 'Total Paid', 'Actions'].map(h => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {patients.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 font-bold">
                          {p.name?.charAt(0)?.toUpperCase() || 'P'}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{p.name || 'N/A'}</div>
                          <div className="text-xs text-gray-500 capitalize">
                            {p.gender || '—'}{p.date_of_birth ? ` • ${new Date().getFullYear() - new Date(p.date_of_birth).getFullYear()} yrs` : ''}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center gap-1"><Mail className="w-3 h-3 text-gray-400" />{p.email || '—'}</div>
                      <div className="text-sm text-gray-500 flex items-center gap-1"><Phone className="w-3 h-3 text-gray-400" />{p.phone || '—'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">{p.total_appointments}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{fmt(p.last_visit)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{fmtCurrency(p.total_paid)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => openDetail(p.id)}
                        className="flex items-center gap-1 text-teal-600 hover:text-teal-800 text-sm font-medium"
                      >
                        <Eye className="w-4 h-4" /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="px-6 py-3 border-t border-gray-100 flex items-center justify-between">
            <span className="text-sm text-gray-700">Page {currentPage} of {totalPages}</span>
            <div className="flex gap-2">
              <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}
                className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50">Previous</button>
              <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50">Next</button>
            </div>
          </div>
        )}
      </div>

      {/* Patient Detail Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 text-xl font-bold">
                  {selectedPatient.name?.charAt(0)?.toUpperCase() || 'P'}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedPatient.name}</h2>
                  <p className="text-sm text-gray-500 capitalize">
                    {selectedPatient.gender || '—'}{selectedPatient.date_of_birth
                      ? ` • ${new Date().getFullYear() - new Date(selectedPatient.date_of_birth).getFullYear()} years old`
                      : ''}
                  </p>
                </div>
              </div>
              <button onClick={() => setSelectedPatient(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {detailLoading ? (
              <div className="flex items-center justify-center h-48">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
              </div>
            ) : (
              <div className="p-6 space-y-6">
                {/* Summary Stats */}
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: 'Appointments', value: selectedPatient.total_appointments, icon: Calendar, color: 'bg-blue-50 text-blue-600' },
                    { label: 'Last Visit', value: fmt(selectedPatient.last_visit), icon: Calendar, color: 'bg-green-50 text-green-600' },
                    { label: 'Total Paid', value: fmtCurrency(selectedPatient.total_paid), icon: CreditCard, color: 'bg-yellow-50 text-yellow-600' },
                  ].map(({ label, value, icon: Icon, color }) => (
                    <div key={label} className={`rounded-xl p-4 ${color.split(' ')[0]}`}>
                      <Icon className={`w-5 h-5 mb-1 ${color.split(' ')[1]}`} />
                      <p className="text-xs text-gray-500">{label}</p>
                      <p className="font-bold text-gray-900 text-sm">{value}</p>
                    </div>
                  ))}
                </div>

                {/* Contact Info */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2"><User className="w-4 h-4" /> Contact Information</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div><span className="text-gray-500">Email</span><p className="font-medium text-gray-900">{selectedPatient.email || '—'}</p></div>
                    <div><span className="text-gray-500">Phone</span><p className="font-medium text-gray-900">{selectedPatient.phone || '—'}</p></div>
                    <div><span className="text-gray-500">Date of Birth</span><p className="font-medium text-gray-900">{fmt(selectedPatient.date_of_birth)}</p></div>
                    <div><span className="text-gray-500">Blood Group</span><p className="font-medium text-gray-900">{selectedPatient.blood_group || '—'}</p></div>
                    <div className="col-span-2"><span className="text-gray-500">Address</span><p className="font-medium text-gray-900">{selectedPatient.address || '—'}</p></div>
                  </div>
                </div>

                {/* Medical Info */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2"><Heart className="w-4 h-4" /> Medical Information</h3>
                  <div className="grid grid-cols-1 gap-3 text-sm">
                    <div><span className="text-gray-500">Allergies</span><p className="font-medium text-gray-900">{selectedPatient.allergies || '—'}</p></div>
                    <div><span className="text-gray-500">Medical History</span><p className="font-medium text-gray-900">{selectedPatient.medical_history || '—'}</p></div>
                  </div>
                </div>

                {/* Emergency Contact */}
                {(selectedPatient.emergency_contact_name || selectedPatient.emergency_contact_phone) && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2"><AlertCircle className="w-4 h-4" /> Emergency Contact</h3>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div><span className="text-gray-500">Name</span><p className="font-medium text-gray-900">{selectedPatient.emergency_contact_name || '—'}</p></div>
                      <div><span className="text-gray-500">Phone</span><p className="font-medium text-gray-900">{selectedPatient.emergency_contact_phone || '—'}</p></div>
                    </div>
                  </div>
                )}

                {/* Appointment History */}
                {selectedPatient.appointments && selectedPatient.appointments.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2"><Calendar className="w-4 h-4" /> Appointment History</h3>
                    <div className="space-y-2">
                      {selectedPatient.appointments.slice(0, 5).map((apt: any) => (
                        <div key={apt.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg text-sm">
                          <div>
                            <p className="font-medium text-gray-900">{apt.reason || 'Consultation'}</p>
                            <p className="text-xs text-gray-500">{fmt(apt.appointment_date)}</p>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                            apt.status === 'completed' ? 'bg-green-100 text-green-700' :
                            apt.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                            apt.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
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
