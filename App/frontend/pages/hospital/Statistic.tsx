import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, Calendar, DollarSign, PieChart, Download, Filter } from 'lucide-react';

interface StatisticsData {
  monthlyRevenue: Array<{
    month: string;
    revenue: number;
    transactions: number;
  }>;
  appointmentStats: Array<{
    status: string;
    count: number;
  }>;
  patientDemographics: Array<{
    age_group: string;
    count: number;
  }>;
}

const Statistic: React.FC = () => {
  const [statistics, setStatistics] = useState<StatisticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('12months');

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(
        'http://localhost:5000/api/hospital-dashboard/statistics',
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setStatistics(data.data);
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  const formatMonth = (monthString: string) => {
    const [year, month] = monthString.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
  };

  const getStatusColor = (status: string) => {
    const colors = {
      completed: 'bg-green-500',
      confirmed: 'bg-blue-500',
      pending: 'bg-yellow-500',
      cancelled: 'bg-red-500',
      no_show: 'bg-gray-500'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-500';
  };

  const getAgeGroupColor = (ageGroup: string) => {
    const colors = {
      'Under 18': 'bg-purple-500',
      '18-35': 'bg-blue-500',
      '36-55': 'bg-green-500',
      'Over 55': 'bg-orange-500'
    };
    return colors[ageGroup as keyof typeof colors] || 'bg-gray-500';
  };

  const calculateTotalRevenue = () => {
    if (!statistics?.monthlyRevenue) return 0;
    return statistics.monthlyRevenue.reduce((sum, month) => sum + month.revenue, 0);
  };

  const calculateTotalTransactions = () => {
    if (!statistics?.monthlyRevenue) return 0;
    return statistics.monthlyRevenue.reduce((sum, month) => sum + month.transactions, 0);
  };

  const calculateTotalAppointments = () => {
    if (!statistics?.appointmentStats) return 0;
    return statistics.appointmentStats.reduce((sum, stat) => sum + stat.count, 0);
  };

  const calculateTotalPatients = () => {
    if (!statistics?.patientDemographics) return 0;
    return statistics.patientDemographics.reduce((sum, demo) => sum + demo.count, 0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Statistics</h1>
          <p className="text-gray-600">Hospital performance analytics and insights</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="12months">Last 12 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="3months">Last 3 Months</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(calculateTotalRevenue())}</p>
              <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3" />
                +15.3% from last period
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Appointments</p>
              <p className="text-2xl font-bold text-gray-900">{calculateTotalAppointments()}</p>
              <p className="text-xs text-blue-600 flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3" />
                +8.2% from last period
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Patients</p>
              <p className="text-2xl font-bold text-gray-900">{calculateTotalPatients()}</p>
              <p className="text-xs text-teal-600 flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3" />
                +12.1% from last period
              </p>
            </div>
            <div className="p-3 bg-teal-100 rounded-lg">
              <Users className="w-6 h-6 text-teal-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg. Revenue/Month</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(calculateTotalRevenue() / (statistics?.monthlyRevenue?.length || 1))}
              </p>
              <p className="text-xs text-purple-600 flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3" />
                +5.7% from last period
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Monthly Revenue</h3>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <BarChart3 className="w-4 h-4" />
              Last 12 months
            </div>
          </div>
          
          <div className="space-y-4">
            {statistics?.monthlyRevenue?.slice(0, 6).map((month, index) => {
              const maxRevenue = Math.max(...(statistics.monthlyRevenue?.map(m => m.revenue) || [0]));
              const percentage = maxRevenue > 0 ? (month.revenue / maxRevenue) * 100 : 0;
              
              return (
                <div key={month.month} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{formatMonth(month.month)}</span>
                    <span className="font-medium text-gray-900">{formatCurrency(month.revenue)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {month.transactions} transactions
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Appointment Status Distribution */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Appointment Status</h3>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <PieChart className="w-4 h-4" />
              Distribution
            </div>
          </div>
          
          <div className="space-y-4">
            {statistics?.appointmentStats?.map((stat) => {
              const total = calculateTotalAppointments();
              const percentage = total > 0 ? (stat.count / total) * 100 : 0;
              
              return (
                <div key={stat.status} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full ${getStatusColor(stat.status)}`}></div>
                    <span className="text-sm text-gray-600 capitalize">
                      {stat.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{stat.count}</div>
                    <div className="text-xs text-gray-500">{percentage.toFixed(1)}%</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Patient Demographics */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Patient Demographics</h3>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Users className="w-4 h-4" />
            Age distribution
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {statistics?.patientDemographics?.map((demo) => {
            const total = calculateTotalPatients();
            const percentage = total > 0 ? (demo.count / total) * 100 : 0;
            
            return (
              <div key={demo.age_group} className="text-center">
                <div className={`w-16 h-16 rounded-full ${getAgeGroupColor(demo.age_group)} mx-auto mb-3 flex items-center justify-center`}>
                  <span className="text-white font-bold text-lg">{demo.count}</span>
                </div>
                <div className="text-sm font-medium text-gray-900">{demo.age_group}</div>
                <div className="text-xs text-gray-500">{percentage.toFixed(1)}% of patients</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Performance Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Revenue Growth</p>
                <p className="text-xs text-gray-600">Monthly revenue increased by 15.3% compared to last period</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Patient Satisfaction</p>
                <p className="text-xs text-gray-600">Appointment completion rate is 85.2%, above industry average</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Peak Hours</p>
                <p className="text-xs text-gray-600">Most appointments scheduled between 10 AM - 2 PM</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommendations</h3>
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm font-medium text-blue-900">Optimize Scheduling</p>
              <p className="text-xs text-blue-700">Consider adding more slots during peak hours</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="text-sm font-medium text-green-900">Revenue Opportunity</p>
              <p className="text-xs text-green-700">Focus on services with highest profit margins</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <p className="text-sm font-medium text-yellow-900">Patient Retention</p>
              <p className="text-xs text-yellow-700">Implement follow-up programs for better outcomes</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistic;