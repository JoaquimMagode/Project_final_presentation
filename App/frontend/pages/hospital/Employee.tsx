import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Mail, Phone, Eye, Edit, Trash2, ArrowLeft, Shield, CreditCard, UserCheck, Bed, CheckCircle, X } from 'lucide-react';

interface Employee {
  id: number;
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  salary: number;
  hire_date: string;
  status: string;
  employee_id: string;
}

const ROLES = [
  {
    value: 'Super Admin',
    label: 'Super Admin',
    icon: Shield,
    color: 'bg-purple-100 text-purple-700',
    border: 'border-purple-300',
    department: 'Administration',
    description: 'Overall system control and configuration.',
    permissions: ['Full access to all modules', 'Add/Edit/Delete hospitals and users', 'View system-wide reports', 'Manage subscriptions and billing', 'Control data security and permissions'],
  },
  {
    value: 'Receptionist',
    label: 'Receptionist / Front Desk',
    icon: UserCheck,
    color: 'bg-blue-100 text-blue-700',
    border: 'border-blue-300',
    department: 'Front Desk',
    description: 'Handle patient interactions and appointment scheduling.',
    permissions: ['Access to appointment scheduling', 'Patient registration and check-in/out', 'Access to patient demographic data', 'Handle billing initiation', 'Limited access to clinical information'],
  },
  {
    value: 'Accountant',
    label: 'Accountant / Billing Staff',
    icon: CreditCard,
    color: 'bg-green-100 text-green-700',
    border: 'border-green-300',
    department: 'Finance',
    description: 'Manage financial transactions and billing.',
    permissions: ['Access to billing and payment modules', 'Generate invoices and receipts', 'Handle insurance claims', 'Process payments and refunds', 'Create financial reports'],
  },
  {
    value: 'Ward Manager',
    label: 'Ward Manager / Bed Manager',
    icon: Bed,
    color: 'bg-orange-100 text-orange-700',
    border: 'border-orange-300',
    department: 'Ward Management',
    description: 'Oversee inpatient accommodations.',
    permissions: ['Access to bed and ward management', 'Manage bed allocation and availability', 'Track patient admissions and discharges', 'Coordinate with nursing staff'],
  },
];

const getRoleConfig = (position: string) => ROLES.find(r => r.value === position) || ROLES[1];

const EMPTY_FORM = {
  name: '', email: '', phone: '', position: 'Receptionist',
  department: 'Front Desk', salary: '', hire_date: '', employee_id: '', status: 'active',
};

type View = 'list' | 'add' | 'edit' | 'detail';

const Employee: React.FC = () => {
  const [view, setView] = useState<View>('list');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Employee | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [createdPassword, setCreatedPassword] = useState('');

  useEffect(() => { fetchEmployees(); }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/hospital-employees', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setEmployees(data.data.employees || []);
      }
    } catch { } finally { setLoading(false); }
  };

  const openAdd = () => {
    setForm({ ...EMPTY_FORM });
    setError('');
    setView('add');
  };

  const openEdit = (emp: Employee) => {
    setSelected(emp);
    setForm({
      name: emp.name || '',
      email: emp.email || '',
      phone: emp.phone || '',
      position: emp.position || 'Receptionist',
      department: emp.department || 'Front Desk',
      salary: emp.salary?.toString() || '',
      hire_date: emp.hire_date ? emp.hire_date.split('T')[0] : '',
      employee_id: emp.employee_id || '',
      status: emp.status || 'active',
    });
    setError('');
    setView('edit');
  };

  const openDetail = (emp: Employee) => {
    setSelected(emp);
    setView('detail');
  };

  const handleRoleChange = (roleValue: string) => {
    const role = ROLES.find(r => r.value === roleValue);
    setForm(f => ({ ...f, position: roleValue, department: role?.department || f.department }));
  };

  const handleSave = async () => {
    if (!form.name || !form.email || !form.position) {
      setError('Name, email and role are required.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const isEdit = view === 'edit';
      const url = isEdit
        ? `http://localhost:5000/api/hospital-employees/${selected!.id}`
        : 'http://localhost:5000/api/hospital-employees';
      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, salary: form.salary ? parseFloat(form.salary) : null }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || 'Failed to save'); return; }
      await fetchEmployees();
      if (view === 'add' && data.data?.defaultPassword) {
        setCreatedPassword(data.data.defaultPassword);
      }
      setView('list');
    } catch { setError('Network error'); } finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:5000/api/hospital-employees/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      setDeleteConfirmId(null);
      if (view === 'detail') setView('list');
      fetchEmployees();
    } catch { }
  };

  const filtered = filterRole ? employees.filter(e => e.position === filterRole) : employees;
  const roleCounts = ROLES.map(r => ({ ...r, count: employees.filter(e => e.position === r.value).length }));

  // ── FORM PAGE (Add / Edit) ──────────────────────────────────────────────────
  if (view === 'add' || view === 'edit') {
    const role = getRoleConfig(form.position);
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button onClick={() => setView('list')} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{view === 'add' ? 'Add New Employee' : 'Edit Employee'}</h1>
            <p className="text-sm text-gray-500">{view === 'add' ? 'Fill in the details to add a new staff member' : `Editing ${selected?.name}`}</p>
          </div>
        </div>

        {error && <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">{error}</p>}

        {/* Role Selection */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm font-semibold text-gray-700 mb-4">Select Role *</p>
          <div className="grid grid-cols-2 gap-3">
            {ROLES.map(({ value, label, icon: Icon, color, border, description }) => (
              <button
                key={value}
                type="button"
                onClick={() => handleRoleChange(value)}
                className={`flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                  form.position === value ? `border-teal-500 bg-teal-50` : `border-gray-200 hover:border-gray-300`
                }`}
              >
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${color}`}>
                  <Icon className="w-4 h-4" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{label}</p>
                  <p className="text-xs text-gray-400 mt-0.5 leading-tight">{description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Permissions Preview */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm font-semibold text-gray-700 mb-3">
            Permissions for <span className={`px-2 py-0.5 rounded-full text-xs ${role.color}`}>{role.label}</span>
          </p>
          <ul className="space-y-2">
            {role.permissions.map(p => (
              <li key={p} className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-teal-500 flex-shrink-0" />{p}
              </li>
            ))}
          </ul>
        </div>

        {/* Employee Details */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
          <p className="text-sm font-semibold text-gray-700">Employee Details</p>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="e.g. Priya Sharma" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="email@hospital.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="+91 98765 43210" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
              <input value={form.employee_id} onChange={e => setForm(f => ({ ...f, employee_id: e.target.value }))}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="EMP-001" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hire Date</label>
              <input type="date" value={form.hire_date} onChange={e => setForm(f => ({ ...f, hire_date: e.target.value }))}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Salary (₹)</label>
              <input type="number" value={form.salary} onChange={e => setForm(f => ({ ...f, salary: e.target.value }))}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="e.g. 35000" />
            </div>
            {view === 'edit' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pb-8">
          <button onClick={() => setView('list')}
            className="flex-1 py-3 border border-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50">
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving}
            className="flex-1 py-3 bg-teal-600 text-white rounded-xl text-sm font-semibold hover:bg-teal-700 disabled:opacity-50">
            {saving ? 'Saving...' : view === 'add' ? 'Add Employee' : 'Save Changes'}
          </button>
        </div>
      </div>
    );
  }

  // ── DETAIL PAGE ─────────────────────────────────────────────────────────────
  if (view === 'detail' && selected) {
    const role = getRoleConfig(selected.position);
    const RoleIcon = role.icon;
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setView('list')} className="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">Employee Details</h1>
          </div>
          <div className="flex gap-2">
            <button onClick={() => openEdit(selected)}
              className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-xl text-sm font-semibold hover:bg-teal-700">
              <Edit className="w-4 h-4" /> Edit
            </button>
            <button onClick={() => setDeleteConfirmId(selected.id)}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl text-sm font-semibold hover:bg-red-100">
              <Trash2 className="w-4 h-4" /> Remove
            </button>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center text-2xl font-bold text-teal-700">
              {selected.name?.charAt(0)?.toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{selected.name}</h2>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mt-1 ${role.color}`}>
                <RoleIcon className="w-3 h-3" />{selected.position}
              </span>
            </div>
            <span className={`ml-auto px-3 py-1 rounded-full text-xs font-semibold ${
              selected.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {selected.status?.charAt(0).toUpperCase() + selected.status?.slice(1)}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Email', value: selected.email },
              { label: 'Phone', value: selected.phone },
              { label: 'Department', value: selected.department },
              { label: 'Employee ID', value: selected.employee_id || `#${selected.id}` },
              { label: 'Hire Date', value: selected.hire_date ? new Date(selected.hire_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '—' },
              { label: 'Salary', value: selected.salary ? `₹${Number(selected.salary).toLocaleString('en-IN')}` : '—' },
            ].map(({ label, value }) => (
              <div key={label} className="bg-gray-50 rounded-xl p-3">
                <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">{label}</p>
                <p className="text-sm font-medium text-gray-800">{value || '—'}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Role Info */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm font-semibold text-gray-700 mb-1">{role.label}</p>
          <p className="text-sm text-gray-500 mb-4">{role.description}</p>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Permissions</p>
          <ul className="space-y-2">
            {role.permissions.map(p => (
              <li key={p} className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-teal-500 flex-shrink-0" />{p}
              </li>
            ))}
          </ul>
        </div>

        {/* Delete Confirm */}
        {deleteConfirmId === selected.id && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
            <p className="text-sm font-semibold text-red-800 mb-1">Confirm Removal</p>
            <p className="text-sm text-red-600 mb-4">This will mark <strong>{selected.name}</strong> as terminated. Are you sure?</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirmId(null)} className="flex-1 py-2 border border-red-300 rounded-xl text-sm text-red-600 hover:bg-red-100">Cancel</button>
              <button onClick={() => handleDelete(selected.id)} className="flex-1 py-2 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700">Yes, Remove</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── LIST PAGE ────────────────────────────────────────────────────────────────
  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600" />
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employees</h1>
          <p className="text-gray-500 text-sm">Manage hospital staff by role</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 text-white rounded-xl text-sm font-semibold hover:bg-teal-700">
          <UserPlus className="w-4 h-4" /> Add Employee
        </button>
      </div>

      {/* New Employee Password Banner */}
      {createdPassword && (
        <div className="bg-teal-50 border border-teal-200 rounded-2xl p-4 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-teal-800 mb-0.5">✅ Employee account created</p>
            <p className="text-sm text-teal-700">
              Default login password: <span className="font-mono font-bold bg-teal-100 px-2 py-0.5 rounded">{createdPassword}</span>
            </p>
            <p className="text-xs text-teal-500 mt-1">Share this with the employee. They can change it after logging in.</p>
          </div>
          <button onClick={() => setCreatedPassword('')} className="text-teal-400 hover:text-teal-600 flex-shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Role Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {roleCounts.map(({ value, label, icon: Icon, color, count, description }) => (
          <button
            key={value}
            onClick={() => setFilterRole(filterRole === value ? '' : value)}
            className={`bg-white rounded-2xl p-5 shadow-sm border-2 text-left transition-all hover:shadow-md ${
              filterRole === value ? 'border-teal-500' : 'border-gray-100'
            }`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{count}</p>
            <p className="text-sm font-semibold text-gray-700 mt-0.5">{label}</p>
            <p className="text-xs text-gray-400 mt-1 line-clamp-2">{description}</p>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">
            {filterRole ? `${filterRole}s` : 'All Employees'}
            <span className="ml-2 text-sm font-normal text-gray-400">({filtered.length})</span>
          </h3>
          {filterRole && (
            <button onClick={() => setFilterRole('')} className="text-xs text-teal-600 hover:underline">Clear filter</button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {['Employee', 'Contact', 'Role', 'Department', 'Hire Date', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(emp => {
                const role = getRoleConfig(emp.position);
                const RoleIcon = role.icon;
                return (
                  <tr key={emp.id} className="hover:bg-gray-50">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-teal-100 rounded-full flex items-center justify-center font-semibold text-teal-700 text-sm flex-shrink-0">
                          {emp.name?.charAt(0)?.toUpperCase() || 'E'}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{emp.name}</p>
                          <p className="text-xs text-gray-400">{emp.employee_id || `#${emp.id}`}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1 text-sm text-gray-600"><Mail className="w-3.5 h-3.5 text-gray-400" />{emp.email || '—'}</div>
                      <div className="flex items-center gap-1 text-sm text-gray-500 mt-0.5"><Phone className="w-3.5 h-3.5 text-gray-400" />{emp.phone || '—'}</div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${role.color}`}>
                        <RoleIcon className="w-3 h-3" />{emp.position || '—'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600">{emp.department || '—'}</td>
                    <td className="px-5 py-4 text-sm text-gray-600">
                      {emp.hire_date ? new Date(emp.hire_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        emp.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {emp.status?.charAt(0).toUpperCase() + emp.status?.slice(1)}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {deleteConfirmId === emp.id ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-red-600 font-medium">Remove?</span>
                          <button onClick={() => handleDelete(emp.id)} className="text-xs px-2 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700">Yes</button>
                          <button onClick={() => setDeleteConfirmId(null)} className="text-xs px-2 py-1 border border-gray-300 rounded-lg hover:bg-gray-50">No</button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button onClick={() => openDetail(emp)} className="p-1.5 hover:bg-teal-50 rounded-lg text-teal-600"><Eye className="w-4 h-4" /></button>
                          <button onClick={() => openEdit(emp)} className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-600"><Edit className="w-4 h-4" /></button>
                          <button onClick={() => setDeleteConfirmId(emp.id)} className="p-1.5 hover:bg-red-50 rounded-lg text-red-500"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <Users className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No employees found</p>
            <button onClick={openAdd} className="mt-3 text-teal-600 text-sm font-medium hover:underline">Add first employee</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Employee;
