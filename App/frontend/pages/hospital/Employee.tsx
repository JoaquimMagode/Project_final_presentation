import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Mail, Phone, Calendar, Eye, Edit, Trash2, X, Shield, CreditCard, UserCheck, Bed, ChevronDown } from 'lucide-react';

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
    department: 'Administration',
    description: 'Overall system control and configuration.',
    permissions: ['Full access to all modules', 'Add/Edit/Delete hospitals and users', 'View system-wide reports', 'Manage subscriptions and billing', 'Control data security and permissions'],
  },
  {
    value: 'Receptionist',
    label: 'Receptionist / Front Desk',
    icon: UserCheck,
    color: 'bg-blue-100 text-blue-700',
    department: 'Front Desk',
    description: 'Handle patient interactions and appointment scheduling.',
    permissions: ['Access to appointment scheduling', 'Patient registration and check-in/out', 'Access to patient demographic data', 'Handle billing initiation', 'Limited access to clinical information'],
  },
  {
    value: 'Accountant',
    label: 'Accountant / Billing Staff',
    icon: CreditCard,
    color: 'bg-green-100 text-green-700',
    department: 'Finance',
    description: 'Manage financial transactions and billing.',
    permissions: ['Access to billing and payment modules', 'Generate invoices and receipts', 'Handle insurance claims', 'Process payments and refunds', 'Create financial reports'],
  },
  {
    value: 'Ward Manager',
    label: 'Ward Manager / Bed Manager',
    icon: Bed,
    color: 'bg-orange-100 text-orange-700',
    department: 'Ward Management',
    description: 'Oversee inpatient accommodations.',
    permissions: ['Access to bed and ward management', 'Manage bed allocation and availability', 'Track patient admissions and discharges', 'Coordinate with nursing staff'],
  },
];

const getRoleConfig = (position: string) =>
  ROLES.find(r => r.value === position) || ROLES[1];

const EMPTY_FORM = { name: '', email: '', phone: '', position: 'Receptionist', department: 'Front Desk', salary: '', hire_date: '', employee_id: '', status: 'active' };

const Employee: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [viewingEmployee, setViewingEmployee] = useState<Employee | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Employee | null>(null);
  const [form, setForm] = useState<typeof EMPTY_FORM>({ ...EMPTY_FORM });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [filterRole, setFilterRole] = useState('');

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
    setShowAddModal(true);
  };

  const openEdit = (emp: Employee) => {
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
    setEditingEmployee(emp);
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
      const url = editingEmployee
        ? `http://localhost:5000/api/hospital-employees/${editingEmployee.id}`
        : 'http://localhost:5000/api/hospital-employees';
      const res = await fetch(url, {
        method: editingEmployee ? 'PUT' : 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, salary: form.salary ? parseFloat(form.salary) : null }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || 'Failed to save'); return; }
      setShowAddModal(false);
      setEditingEmployee(null);
      fetchEmployees();
    } catch { setError('Network error'); } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:5000/api/hospital-employees/${deleteTarget.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      setDeleteTarget(null);
      fetchEmployees();
    } catch { }
  };

  const filtered = filterRole ? employees.filter(e => e.position === filterRole) : employees;

  const roleCounts = ROLES.map(r => ({
    ...r,
    count: employees.filter(e => e.position === r.value).length,
  }));

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
          <p className="text-gray-600">Manage hospital staff by role</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">
          <UserPlus className="w-4 h-4" /> Add Employee
        </button>
      </div>

      {/* Role Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {roleCounts.map(({ value, label, icon: Icon, color, count, description }) => (
          <button
            key={value}
            onClick={() => setFilterRole(filterRole === value ? '' : value)}
            className={`bg-white rounded-xl p-5 shadow-sm border-2 text-left transition-all hover:shadow-md ${filterRole === value ? 'border-teal-500' : 'border-gray-100'}`}
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{count}</p>
            <p className="text-sm font-semibold text-gray-700 mt-0.5">{label}</p>
            <p className="text-xs text-gray-400 mt-1 line-clamp-2">{description}</p>
          </button>
        ))}
      </div>

      {/* Employee Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            {filterRole ? `${filterRole}s` : 'All Employees'}
            <span className="ml-2 text-sm font-normal text-gray-400">({filtered.length})</span>
          </h3>
          {filterRole && (
            <button onClick={() => setFilterRole('')} className="text-xs text-teal-600 hover:underline flex items-center gap-1">
              <X className="w-3 h-3" /> Clear filter
            </button>
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
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${emp.status === 'active' ? 'bg-green-100 text-green-700' : emp.status === 'inactive' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>
                        {emp.status?.charAt(0).toUpperCase() + emp.status?.slice(1)}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setViewingEmployee(emp)} className="p-1.5 hover:bg-teal-50 rounded-lg text-teal-600"><Eye className="w-4 h-4" /></button>
                        <button onClick={() => openEdit(emp)} className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-600"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => setDeleteTarget(emp)} className="p-1.5 hover:bg-red-50 rounded-lg text-red-500"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No employees found</p>
            <button onClick={openAdd} className="mt-3 text-teal-600 text-sm font-medium hover:underline">Add first employee</button>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {(showAddModal || editingEmployee) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">{editingEmployee ? 'Edit Employee' : 'Add New Employee'}</h3>
              <button onClick={() => { setShowAddModal(false); setEditingEmployee(null); }} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}

              {/* Role Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role *</label>
                <div className="grid grid-cols-2 gap-2">
                  {ROLES.map(({ value, label, icon: Icon, color }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => handleRoleChange(value)}
                      className={`flex items-center gap-2 p-3 rounded-xl border-2 text-left transition-all ${form.position === value ? 'border-teal-500 bg-teal-50' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      <span className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`}>
                        <Icon className="w-4 h-4" />
                      </span>
                      <span className="text-xs font-medium text-gray-700 leading-tight">{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Role Permissions Preview */}
              {form.position && (
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Permissions</p>
                  <ul className="space-y-1">
                    {getRoleConfig(form.position).permissions.map(p => (
                      <li key={p} className="text-xs text-gray-600 flex items-start gap-1.5">
                        <span className="text-teal-500 mt-0.5">✓</span>{p}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="e.g. Priya Sharma" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="email@hospital.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="+91 98765 43210" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
                  <input value={form.employee_id} onChange={e => setForm(f => ({ ...f, employee_id: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="EMP-001" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hire Date</label>
                  <input type="date" value={form.hire_date} onChange={e => setForm(f => ({ ...f, hire_date: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Salary (₹)</label>
                  <input type="number" value={form.salary} onChange={e => setForm(f => ({ ...f, salary: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="e.g. 35000" />
                </div>
                {editingEmployee && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500">
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t border-gray-100">
              <button onClick={() => { setShowAddModal(false); setEditingEmployee(null); }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">Cancel</button>
              <button onClick={handleSave} disabled={saving}
                className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-semibold hover:bg-teal-700 disabled:opacity-50">
                {saving ? 'Saving...' : editingEmployee ? 'Save Changes' : 'Add Employee'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewingEmployee && (() => {
        const role = getRoleConfig(viewingEmployee.position);
        const RoleIcon = role.icon;
        return (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-900">Employee Details</h3>
                <button onClick={() => setViewingEmployee(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="p-6 space-y-5">
                {/* Avatar + Name */}
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-teal-100 rounded-full flex items-center justify-center text-2xl font-bold text-teal-700">
                    {viewingEmployee.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-900">{viewingEmployee.name}</p>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${role.color}`}>
                      <RoleIcon className="w-3 h-3" />{viewingEmployee.position}
                    </span>
                  </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Email', value: viewingEmployee.email },
                    { label: 'Phone', value: viewingEmployee.phone },
                    { label: 'Department', value: viewingEmployee.department },
                    { label: 'Employee ID', value: viewingEmployee.employee_id || `#${viewingEmployee.id}` },
                    { label: 'Hire Date', value: viewingEmployee.hire_date ? new Date(viewingEmployee.hire_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—' },
                    { label: 'Salary', value: viewingEmployee.salary ? `₹${Number(viewingEmployee.salary).toLocaleString('en-IN')}` : '—' },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-gray-50 rounded-xl p-3">
                      <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">{label}</p>
                      <p className="text-sm font-medium text-gray-800 truncate">{value || '—'}</p>
                    </div>
                  ))}
                </div>

                {/* Permissions */}
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Role Permissions</p>
                  <ul className="space-y-1">
                    {role.permissions.map(p => (
                      <li key={p} className="text-xs text-gray-600 flex items-start gap-1.5">
                        <span className="text-teal-500 mt-0.5">✓</span>{p}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="flex gap-3 p-6 border-t border-gray-100">
                <button onClick={() => { setViewingEmployee(null); openEdit(viewingEmployee); }}
                  className="flex-1 py-2 bg-teal-600 text-white rounded-lg text-sm font-semibold hover:bg-teal-700">Edit</button>
                <button onClick={() => setViewingEmployee(null)}
                  className="flex-1 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">Close</button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Delete Confirm */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 space-y-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold text-gray-900">Remove Employee</h3>
              <p className="text-sm text-gray-500 mt-1">Are you sure you want to remove <strong>{deleteTarget.name}</strong>? This will mark them as terminated.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">Cancel</button>
              <button onClick={handleDelete} className="flex-1 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700">Remove</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employee;
