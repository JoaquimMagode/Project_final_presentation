import React, { useState } from 'react';
import { 
  BarChart3, TrendingUp, TrendingDown, Users, Calendar, 
  DollarSign, Activity, PieChart, LineChart 
} from 'lucide-react';

const Statistic: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('Month');
  const [selectedMetric, setSelectedMetric] = useState('Patients');

  const monthlyData = [
    { month: 'Jan', patients: 1200, revenue: 150000, appointments: 1800 },
    { month: 'Feb', patients: 1350, revenue: 165000, appointments: 1950 },
    { month: 'Mar', patients: 1180, revenue: 142000, appointments: 1720 },
    { month: 'Apr', patients: 1420, revenue: 178000, appointments: 2100 },
    { month: 'May', patients: 1580, revenue: 195000, appointments: 2300 },
    { month: 'Jun', patients: 1650, revenue: 205000, appointments: 2450 }
  ];

  const departmentStats = [
    { name: 'Cardiology', patients: 450, revenue: 85000, color: 'bg-red-500' },
    { name: 'Neurology', patients: 320, revenue: 65000, color: 'bg-blue-500' },
    { name: 'Orthopedics', patients: 280, revenue: 55000, color: 'bg-green-500' },
    { name: 'Emergency', patients: 600, revenue: 45000, color: 'bg-yellow-500' },
    { name: 'Pediatrics', patients: 380, revenue: 38000, color: 'bg-purple-500' }
  ];

  const StatCard = ({ title, value, change, changeType, icon: Icon, color }: any) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className={`flex items-center text-sm ${changeType === 'up' ? 'text-green-600' : 'text-red-600'}`}>
          {changeType === 'up' ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
          {change}
        </div>
      </div>
      <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-sm text-gray-600">{title}</div>
    </div>
  );

  const BarChart = ({ data, metric }: any) => {
    const maxValue = Math.max(...data.map((d: any) => d[metric.toLowerCase()]));
    
    return (
      <div className="h-64 flex items-end justify-between gap-2 p-4">
        {data.map((item: any, index: number) => {
          const height = (item[metric.toLowerCase()] / maxValue) * 200;
          return (
            <div key={index} className="flex flex-col items-center gap-2">
              <div className="text-xs text-gray-600 font-medium">
                {metric === 'Revenue' ? `$${(item[metric.toLowerCase()] / 1000).toFixed(0)}k` : item[metric.toLowerCase()]}
              </div>
              <div
                className="bg-teal-500 rounded-t-lg w-12 transition-all duration-300"
                style={{ height: `${height}px` }}
              />
              <div className="text-xs text-gray-500">{item.month}</div>
            </div>
          );
        })}
      </div>
    );
  };

  const PieChartComponent = ({ data }: any) => {
    const total = data.reduce((sum: number, item: any) => sum + item.patients, 0);
    let currentAngle = 0;

    return (
      <div className="flex items-center justify-center">
        <div className="relative w-48 h-48">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {data.map((item: any, index: number) => {
              const percentage = (item.patients / total) * 100;
              const angle = (percentage / 100) * 360;
              const startAngle = currentAngle;
              currentAngle += angle;

              const x1 = 50 + 40 * Math.cos((startAngle * Math.PI) / 180);
              const y1 = 50 + 40 * Math.sin((startAngle * Math.PI) / 180);
              const x2 = 50 + 40 * Math.cos(((startAngle + angle) * Math.PI) / 180);
              const y2 = 50 + 40 * Math.sin(((startAngle + angle) * Math.PI) / 180);

              const largeArcFlag = angle > 180 ? 1 : 0;

              return (
                <path
                  key={index}
                  d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                  className={item.color.replace('bg-', 'fill-')}
                  opacity="0.8"
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{total}</div>
              <div className="text-xs text-gray-600">Total Patients</div>
            </div>
          </div>
        </div>
        <div className="ml-8 space-y-2">
          {data.map((item: any, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
              <span className="text-sm text-gray-700">{item.name}</span>
              <span className="text-sm font-medium text-gray-900">({item.patients})</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Statistics & Analytics</h1>
          <p className="text-gray-600">Hospital performance metrics and insights</p>
        </div>
        <div className="flex gap-2">
          {['Week', 'Month', 'Quarter', 'Year'].map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedPeriod === period
                  ? 'bg-teal-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Patients"
          value="8,750"
          change="+12.5%"
          changeType="up"
          icon={Users}
          color="bg-blue-500"
        />
        <StatCard
          title="Total Revenue"
          value="$1.2M"
          change="+8.3%"
          changeType="up"
          icon={DollarSign}
          color="bg-green-500"
        />
        <StatCard
          title="Appointments"
          value="12,340"
          change="+15.2%"
          changeType="up"
          icon={Calendar}
          color="bg-purple-500"
        />
        <StatCard
          title="Bed Occupancy"
          value="87%"
          change="-2.1%"
          changeType="down"
          icon={Activity}
          color="bg-orange-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Monthly Trends */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Monthly Trends</h3>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="Patients">Patients</option>
              <option value="Revenue">Revenue</option>
              <option value="Appointments">Appointments</option>
            </select>
          </div>
          <BarChart data={monthlyData} metric={selectedMetric} />
        </div>

        {/* Department Distribution */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Patient Distribution by Department</h3>
          <PieChartComponent data={departmentStats} />
        </div>
      </div>

      {/* Department Performance Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Department Performance</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-6 font-semibold text-gray-900">Department</th>
                <th className="text-left py-3 px-6 font-semibold text-gray-900">Patients</th>
                <th className="text-left py-3 px-6 font-semibold text-gray-900">Revenue</th>
                <th className="text-left py-3 px-6 font-semibold text-gray-900">Avg. per Patient</th>
                <th className="text-left py-3 px-6 font-semibold text-gray-900">Growth</th>
              </tr>
            </thead>
            <tbody>
              {departmentStats.map((dept, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${dept.color}`}></div>
                      <span className="font-medium text-gray-900">{dept.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-900">{dept.patients.toLocaleString()}</td>
                  <td className="py-4 px-6 text-gray-900">${dept.revenue.toLocaleString()}</td>
                  <td className="py-4 px-6 text-gray-900">${Math.round(dept.revenue / dept.patients).toLocaleString()}</td>
                  <td className="py-4 px-6">
                    <span className="flex items-center text-green-600">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      +{(Math.random() * 20 + 5).toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Statistic;