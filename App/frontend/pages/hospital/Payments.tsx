import React, { useState, useEffect } from 'react';
import {
  HiOutlineCreditCard, HiOutlineCurrencyDollar, HiOutlineArrowTrendingUp,
  HiOutlineCalendarDays, HiOutlineUser, HiOutlineCheckCircle,
  HiOutlineXCircle, HiOutlineClock, HiOutlineEye,
} from 'react-icons/hi2';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Payment {
  id: number; appointment_id: number; amount: number; commission_amount: number;
  payment_status: string; payment_method: string; payment_date: string;
  transaction_id: string; appointment_date: string; appointment_time: string;
  reason: string; patient_name: string; patient_email: string;
}

const fmtDate = (d: string) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A';
const fmtCurrency = (n: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(n || 0);

const statusCfg: Record<string, { bg: string; icon: any }> = {
  completed: { bg: 'bg-green-50 text-green-700', icon: HiOutlineCheckCircle },
  pending: { bg: 'bg-yellow-50 text-yellow-700', icon: HiOutlineClock },
  failed: { bg: 'bg-red-50 text-red-700', icon: HiOutlineXCircle },
  refunded: { bg: 'bg-gray-100 text-gray-600', icon: HiOutlineXCircle },
};

const Badge = ({ status }: { status: string }) => {
  const c = statusCfg[status] || statusCfg.pending;
  const Icon = c.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium ${c.bg}`}>
      <Icon className="w-3 h-3" />{status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const ChartTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-gray-900 text-white px-3 py-2 rounded-md text-xs shadow-lg">
        <p className="font-medium mb-1">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color }}>{p.name}: {fmtCurrency(p.value)}</p>
        ))}
      </div>
    );
  }
  return null;
};

const Payments: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => { fetchPayments(); }, [statusFilter]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      const res = await fetch(`http://localhost:5000/api/hospital-dashboard/payments?${params}`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      if (res.ok) { const data = await res.json(); setPayments(data.data.payments); }
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const completed = payments.filter(p => p.payment_status === 'completed');
  const totalRevenue = completed.reduce((s, p) => s + (p.amount || 0), 0);
  const totalCommission = completed.reduce((s, p) => s + (p.commission_amount || 0), 0);
  const netRevenue = totalRevenue - totalCommission;
  const avgAmount = completed.length > 0 ? totalRevenue / completed.length : 0;

  // Build chart data from payments grouped by month
  const chartData = (() => {
    const map = new Map<string, { revenue: number; commission: number }>();
    completed.forEach(p => {
      const d = p.payment_date || p.appointment_date;
      if (!d) return;
      const key = new Date(d).toLocaleDateString('en-US', { month: 'short' });
      const cur = map.get(key) || { revenue: 0, commission: 0 };
      cur.revenue += p.amount || 0;
      cur.commission += p.commission_amount || 0;
      map.set(key, cur);
    });
    return Array.from(map, ([month, v]) => ({ month, Revenue: v.revenue, Commission: v.commission }));
  })();

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600"></div></div>;

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-gray-900">Payments</h1>
          <p className="text-xs text-gray-500">Track hospital payments and revenue</p>
        </div>
        <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-md px-3 py-1.5">
          <HiOutlineCreditCard className="w-3.5 h-3.5 text-gray-400" />
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="bg-transparent text-xs font-medium text-gray-600 outline-none cursor-pointer pr-1">
            <option value="">All Status</option>
            <option value="completed">Completed</option><option value="pending">Pending</option>
            <option value="failed">Failed</option><option value="refunded">Refunded</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {([
          { label: 'Total Revenue', value: fmtCurrency(totalRevenue), sub: '+12.5% from last month', icon: HiOutlineCurrencyDollar, accent: 'bg-emerald-500' },
          { label: 'Net Revenue', value: fmtCurrency(netRevenue), sub: 'After commission', icon: HiOutlineArrowTrendingUp, accent: 'bg-blue-500' },
          { label: 'Completed', value: String(completed.length), sub: `Out of ${payments.length} total`, icon: HiOutlineCheckCircle, accent: 'bg-violet-500' },
          { label: 'Avg Payment', value: fmtCurrency(avgAmount), sub: 'Per transaction', icon: HiOutlineCreditCard, accent: 'bg-amber-500' },
        ] as const).map(s => (
          <div key={s.label} className="bg-white rounded-lg px-4 py-3.5 border border-gray-200 flex items-center gap-3">
            <div className={`w-9 h-9 rounded-md flex items-center justify-center shrink-0 ${s.accent}`}>
              <s.icon className="w-[18px] h-[18px] text-white" />
            </div>
            <div>
              <p className="text-[11px] text-gray-500 leading-none">{s.label}</p>
              <p className="text-lg font-bold text-gray-900 leading-tight mt-0.5">{s.value}</p>
              <p className="text-[10px] text-gray-400">{s.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-lg p-5 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-900">Revenue Overview</h3>
          <div className="flex gap-4 text-xs">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Revenue</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-400"></span> Commission</span>
          </div>
        </div>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="Revenue" fill="#10b981" radius={[3, 3, 0, 0]} barSize={20} />
              <Bar dataKey="Commission" fill="#f87171" radius={[3, 3, 0, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-48 flex items-center justify-center text-sm text-gray-400">No payment data to chart</div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-5 py-3.5 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900">Payment Transactions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                {['Transaction', 'Patient', 'Appointment', 'Amount', 'Status', 'Date', ''].map(h => (
                  <th key={h} className="px-5 py-2.5 text-left text-[11px] font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {payments.map(p => (
                <tr key={p.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="px-5 py-3 whitespace-nowrap">
                    <p className="text-xs font-medium text-gray-900">#{p.transaction_id || p.id}</p>
                    <p className="text-[11px] text-gray-400 capitalize">{p.payment_method || 'Online'}</p>
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 bg-emerald-50 rounded-md flex items-center justify-center shrink-0">
                        <HiOutlineUser className="w-3.5 h-3.5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-900">{p.patient_name}</p>
                        <p className="text-[11px] text-gray-400">{p.patient_email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap">
                    <p className="text-xs font-medium text-gray-900">{fmtDate(p.appointment_date)}</p>
                    <p className="text-[11px] text-gray-400 max-w-[160px] truncate">{p.reason}</p>
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap">
                    <p className="text-xs font-medium text-gray-900">{fmtCurrency(p.amount)}</p>
                    {p.commission_amount > 0 && <p className="text-[10px] text-red-500">-{fmtCurrency(p.commission_amount)}</p>}
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap"><Badge status={p.payment_status} /></td>
                  <td className="px-5 py-3 whitespace-nowrap text-xs text-gray-600">{fmtDate(p.payment_date)}</td>
                  <td className="px-5 py-3 whitespace-nowrap">
                    <button className="text-emerald-600 hover:text-emerald-700 flex items-center gap-1 text-xs font-medium">
                      <HiOutlineEye className="w-3.5 h-3.5" /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {payments.length === 0 && (
          <div className="text-center py-12">
            <HiOutlineCreditCard className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-400">No payments found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payments;
