import React, { useState, useEffect } from 'react';
import {
  HiOutlineUsers, HiOutlineUserPlus, HiOutlineEnvelope, HiOutlinePhone,
  HiOutlineEye, HiOutlinePencilSquare, HiOutlineTrash, HiOutlineMapPin,
  HiOutlineCurrencyDollar, HiOutlineXMark,
} from 'react-icons/hi2';

interface Employee {
  id: number; user_id: number; name: string; email: string; phone: string;
  position: string; department: string; salary: number; hire_date: string;
  status: string; employee_id: string;
}

const fmtDate = (d: string) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A';
const fmtCurrency = (n: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(n || 0);

const statusCfg: Record<string, string> = {
  active: 'bg-green-50 text-green-700', inactive: 'bg-red-50 text-red-600', on_leave: 'bg-yellow-50 text-yellow-700',
};

const Employee: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => { fetchEmployees(); }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/hospital-dashboard/employees', {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      if (res.ok) { const data = await res.json(); setEmployees(data.data.employees); }
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const deptStats = employees.reduce((acc, e) => { const d = e.department || 'General'; acc[d] = (acc[d] || 0) + 1; return acc; }, {} as Record<string, number>);
  const avgSalary = employees.length > 0 ? employees.reduce((s, e) => s + (e.salary || 0), 0) / employees.length : 0;

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600"></div></div>;

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-gray-900">Employees</h1>
          <p className="text-xs text-gray-500">Manage hospital staff and employees</p>
        </div>
        <button onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 text-white text-xs font-medium rounded-md hover:bg-emerald-700">
          <HiOutlineUserPlus className="w-3.5 h-3.5" /> Add Employee
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {([
          { label: 'Total Employees', value: String(employees.length), icon: HiOutlineUsers, accent: 'bg-blue-500' },
          { label: 'Active Staff', value: String(employees.filter(e => e.status === 'active').length), icon: HiOutlineUsers, accent: 'bg-emerald-500' },
          { label: 'Departments', value: String(Object.keys(deptStats).length), icon: HiOutlineMapPin, accent: 'bg-violet-500' },
          { label: 'Avg. Salary', value: fmtCurrency(avgSalary), icon: HiOutlineCurrencyDollar, accent: 'bg-amber-500' },
        ] as const).map(s => (
          <div key={s.label} className="bg-white rounded-lg px-4 py-3.5 border border-gray-200 flex items-center gap-3">
            <div className={`w-9 h-9 rounded-md flex items-center justify-center shrink-0 ${s.accent}`}>
              <s.icon className="w-[18px] h-[18px] text-white" />
            </div>
            <div>
              <p className="text-[11px] text-gray-500 leading-none">{s.label}</p>
              <p className="text-lg font-bold text-gray-900 leading-tight mt-0.5">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Department Distribution */}
      <div className="bg-white rounded-lg p-5 border border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Department Distribution</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(deptStats).map(([name, count]) => (
            <div key={name} className="text-center p-3 bg-gray-50 rounded-md">
              <p className="text-xl font-bold text-gray-900">{count}</p>
              <p className="text-[11px] text-gray-500">{name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-5 py-3.5 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900">Employee List</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                {['Employee', 'Contact', 'Position', 'Department', 'Salary', 'Status', ''].map(h => (
                  <th key={h} className="px-5 py-2.5 text-left text-[11px] font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {employees.map(e => (
                <tr key={e.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="px-5 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-emerald-50 rounded-md flex items-center justify-center text-emerald-600 text-xs font-bold shrink-0">
                        {e.name?.charAt(0)?.toUpperCase() || 'E'}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{e.name}</p>
                        <p className="text-[11px] text-gray-400">ID: {e.employee_id || e.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap">
                    <p className="text-xs text-gray-700 flex items-center gap-1"><HiOutlineEnvelope className="w-3 h-3 text-gray-400" />{e.email}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1"><HiOutlinePhone className="w-3 h-3 text-gray-400" />{e.phone}</p>
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap">
                    <p className="text-xs font-medium text-gray-900">{e.position}</p>
                    <p className="text-[11px] text-gray-400">Joined {fmtDate(e.hire_date)}</p>
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap text-xs text-gray-700">{e.department || 'General'}</td>
                  <td className="px-5 py-3 whitespace-nowrap text-xs font-medium text-gray-900">{fmtCurrency(e.salary)}</td>
                  <td className="px-5 py-3 whitespace-nowrap">
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${statusCfg[e.status] || statusCfg.active}`}>
                      {e.status?.charAt(0).toUpperCase() + e.status?.slice(1).replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <button className="p-1 text-gray-400 hover:text-emerald-600"><HiOutlineEye className="w-3.5 h-3.5" /></button>
                      <button className="p-1 text-gray-400 hover:text-blue-600"><HiOutlinePencilSquare className="w-3.5 h-3.5" /></button>
                      <button className="p-1 text-gray-400 hover:text-red-500"><HiOutlineTrash className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {employees.length === 0 && (
          <div className="text-center py-12">
            <HiOutlineUsers className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-400">No employees found</p>
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-5 w-full max-w-md border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-900">Add New Employee</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 hover:bg-gray-100 rounded-md"><HiOutlineXMark className="w-4 h-4 text-gray-500" /></button>
            </div>
            <p className="text-xs text-gray-500 mb-3">Employee form fields: Name, Email, Phone, Position, Department, Salary</p>
            <div className="flex gap-2">
              <button onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-2 text-xs border border-gray-200 rounded-md hover:bg-gray-50">Cancel</button>
              <button onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-2 text-xs bg-emerald-600 text-white rounded-md hover:bg-emerald-700">Add Employee</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employee;
