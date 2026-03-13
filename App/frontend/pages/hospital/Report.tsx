import React, { useState } from 'react';
import { 
  FileText, Download, Calendar, Filter, TrendingUp, TrendingDown, 
  Users, DollarSign, Activity, BarChart3, PieChart, Eye, Share2 
} from 'lucide-react';

const Report: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState('overview');
  const [dateRange, setDateRange] = useState('month');
  const [exportFormat, setExportFormat] = useState('pdf');

  const reportTypes = [
    { id: 'overview', name: 'Hospital Overview', icon: BarChart3 },
    { id: 'financial', name: 'Financial Report', icon: DollarSign },
    { id: 'patient', name: 'Patient Analytics', icon: Users },
    { id: 'department', name: 'Department Performance', icon: Activity },
    { id: 'staff', name: 'Staff Performance', icon: Users }
  ];

  const recentReports = [
    {
      id: '1',
      name: 'Monthly Financial Summary',
      type: 'Financial',
      date: '2024-01-15',
      status: 'Generated',
      size: '2.4 MB'
    },
    {
      id: '2',
      name: 'Patient Satisfaction Survey',
      type: 'Patient Analytics',
      date: '2024-01-14',
      status: 'Generated',
      size: '1.8 MB'
    },
    {
      id: '3',
      name: 'Department Efficiency Report',
      type: 'Department Performance',
      date: '2024-01-13',
      status: 'Processing',
      size: '3.2 MB'
    },
    {
      id: '4',
      name: 'Quarterly Overview',
      type: 'Hospital Overview',
      date: '2024-01-10',
      status: 'Generated',
      size: '4.1 MB'
    }
  ];

  const keyMetrics = {
    totalPatients: { value: 8750, change: 12.5, trend: 'up' },
    revenue: { value: 1250000, change: 8.3, trend: 'up' },
    occupancyRate: { value: 87, change: -2.1, trend: 'down' },
    satisfaction: { value: 4.6, change: 5.2, trend: 'up' }
  };

  const departmentData = [
    { name: 'Emergency', patients: 2450, revenue: 485000, efficiency: 92 },
    { name: 'Cardiology', patients: 1850, revenue: 720000, efficiency: 88 },
    { name: 'Orthopedics', patients: 1200, revenue: 450000, efficiency: 85 },
    { name: 'Neurology', patients: 980, revenue: 380000, efficiency: 90 },
    { name: 'Pediatrics', patients: 1450, revenue: 290000, efficiency: 94 }
  ];

  const MetricCard = ({ title, value, change, trend, icon: Icon, format = 'number' }: any) => {
    const formatValue = (val: number) => {
      if (format === 'currency') return `$${(val / 1000).toFixed(0)}K`;
      if (format === 'percentage') return `${val}%`;
      if (format === 'rating') return `${val}/5`;
      return val.toLocaleString();
    };

    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 bg-teal-100 rounded-lg">
            <Icon className="w-6 h-6 text-teal-600" />
          </div>
          <div className={`flex items-center text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {trend === 'up' ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
            {change}%
          </div>
        </div>
        <div className="text-2xl font-bold text-gray-900 mb-1">{formatValue(value)}</div>
        <div className="text-sm text-gray-600">{title}</div>
      </div>
    );
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600">Generate and view comprehensive hospital reports</p>
        </div>
        <div className="flex gap-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <button className="bg-teal-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-teal-700 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total Patients"
          value={keyMetrics.totalPatients.value}
          change={keyMetrics.totalPatients.change}
          trend={keyMetrics.totalPatients.trend}
          icon={Users}
        />
        <MetricCard
          title="Total Revenue"
          value={keyMetrics.revenue.value}
          change={keyMetrics.revenue.change}
          trend={keyMetrics.revenue.trend}
          icon={DollarSign}
          format="currency"
        />
        <MetricCard
          title="Bed Occupancy"
          value={keyMetrics.occupancyRate.value}
          change={keyMetrics.occupancyRate.change}
          trend={keyMetrics.occupancyRate.trend}
          icon={Activity}
          format="percentage"
        />
        <MetricCard
          title="Patient Satisfaction"
          value={keyMetrics.satisfaction.value}
          change={keyMetrics.satisfaction.change}
          trend={keyMetrics.satisfaction.trend}
          icon={Users}
          format="rating"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report Types */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Report Types</h3>
            <div className="space-y-2">
              {reportTypes.map((report) => (
                <button
                  key={report.id}
                  onClick={() => setSelectedReport(report.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    selectedReport === report.id
                      ? 'bg-teal-50 text-teal-700 border border-teal-200'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <report.icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{report.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Export Options */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Export Options</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
                <select
                  value={exportFormat}
                  onChange={(e) => setExportFormat(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="pdf">PDF</option>
                  <option value="excel">Excel</option>
                  <option value="csv">CSV</option>
                  <option value="word">Word</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <input
                    type="date"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
              <button className="w-full bg-teal-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-teal-700 transition-colors">
                Generate Report
              </button>
            </div>
          </div>
        </div>

        {/* Main Report Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Department Performance Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Department Performance</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Department</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Patients</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Revenue</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Efficiency</th>
                  </tr>
                </thead>
                <tbody>
                  {departmentData.map((dept, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-3 px-4 font-medium text-gray-900">{dept.name}</td>
                      <td className="py-3 px-4 text-gray-900">{dept.patients.toLocaleString()}</td>
                      <td className="py-3 px-4 text-gray-900">${dept.revenue.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-teal-600 h-2 rounded-full"
                              style={{ width: `${dept.efficiency}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900">{dept.efficiency}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Reports */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Recent Reports</h3>
              <button className="text-teal-600 font-medium text-sm hover:text-teal-700">View All</button>
            </div>
            <div className="space-y-4">
              {recentReports.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-teal-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{report.name}</h4>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>{report.type}</span>
                        <span>{new Date(report.date).toLocaleDateString()}</span>
                        <span>{report.size}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      report.status === 'Generated' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {report.status}
                    </span>
                    <div className="flex items-center gap-1">
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <Eye className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <Download className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <Share2 className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Report;