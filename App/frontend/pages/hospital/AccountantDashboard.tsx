import React, { useState, useEffect } from 'react';
import { Home, CreditCard, FileText, HelpCircle, LogOut, DollarSign, TrendingUp } from 'lucide-react';
import { useAuth } from '../../App';
import Payments from './Payments';
import Report from './Report';
import HelpCenter from './HelpCenter';

type Page = 'dashboard' | 'payments' | 'report' | 'help';

const NAV: { page: Page; icon: typeof Home; label: string }[] = [
  { page: 'dashboard', icon: Home,       label: 'Home' },
  { page: 'payments',  icon: CreditCard, label: 'Payments & Billing' },
  { page: 'report',    icon: FileText,   label: 'Financial Reports' },
  { page: 'help',      icon: HelpCircle, label: 'Help' },
];

const AccountantDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activePage, setActivePage] = useState<Page>('dashboard');
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:5000/api/hospital-dashboard/stats', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => setStats(data?.data))
      .catch(() => {});
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-56 bg-green-800 flex flex-col">
        <div className="p-5 border-b border-green-700">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <CreditCard className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-white text-sm font-semibold truncate">{user?.name}</p>
              <p className="text-green-300 text-xs">Accountant</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {NAV.map(({ page, icon: Icon, label }) => (
            <button
              key={page}
              onClick={() => setActivePage(page)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium ${
                activePage === page ? 'bg-green-700 text-white' : 'text-green-100 hover:bg-green-700'
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="text-left">{label}</span>
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-green-700">
          <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-green-100 hover:bg-green-700 text-sm">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
          <h2 className="font-semibold text-gray-800 capitalize">{activePage === 'dashboard' ? 'Accountant Dashboard' : activePage}</h2>
          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">Accountant / Billing Staff</span>
        </div>

        <div className="p-6">
          {activePage === 'dashboard' && (
            <div className="space-y-6">
              <div className="bg-green-700 rounded-2xl p-6 text-white">
                <p className="text-green-200 text-sm">Welcome back 👋</p>
                <h1 className="text-2xl font-bold mt-1">{user?.name}</h1>
                <p className="text-green-200 text-sm mt-1">Accountant / Billing Staff</p>
              </div>

              {/* Finance Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-gray-500">Total Revenue</p>
                    <DollarSign className="w-5 h-5 text-green-500" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    ₹{(stats?.total_revenue || 0).toLocaleString('en-IN')}
                  </p>
                </div>
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-gray-500">Appointments</p>
                    <TrendingUp className="w-5 h-5 text-blue-500" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{stats?.total_appointments || 0}</p>
                </div>
              </div>

              {/* Quick Access */}
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => setActivePage('payments')}
                  className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-left">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mb-3">
                    <CreditCard className="w-5 h-5 text-green-600" />
                  </div>
                  <p className="font-semibold text-gray-900">Payments & Billing</p>
                  <p className="text-xs text-gray-500 mt-0.5">Invoices, receipts, payments</p>
                </button>
                <button onClick={() => setActivePage('report')}
                  className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-left">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mb-3">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <p className="font-semibold text-gray-900">Financial Reports</p>
                  <p className="text-xs text-gray-500 mt-0.5">Generate & view reports</p>
                </button>
              </div>

              {/* Permissions */}
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <p className="text-sm font-semibold text-gray-700 mb-3">Your Permissions</p>
                <ul className="space-y-2">
                  {['Access to billing and payment modules', 'Generate invoices and receipts', 'Handle insurance claims', 'Process payments and refunds', 'Create financial reports'].map(p => (
                    <li key={p} className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0" />{p}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          {activePage === 'payments' && <Payments />}
          {activePage === 'report'   && <Report />}
          {activePage === 'help'     && <HelpCenter />}
        </div>
      </main>
    </div>
  );
};

export default AccountantDashboard;
