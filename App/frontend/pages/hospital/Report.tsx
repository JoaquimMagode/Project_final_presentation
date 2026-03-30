import React, { useState } from 'react';
import { FileText, Download, Calendar, Filter, BarChart3, TrendingUp, Users, DollarSign, Eye, Share } from 'lucide-react';

const Report: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState('overview');
  const [dateRange, setDateRange] = useState('last30days');
  const [reportFormat, setReportFormat] = useState('pdf');

  const reportTypes = [
    {
      id: 'overview',
      name: 'Hospital Overview',
      description: 'Complete hospital performance summary',
      icon: BarChart3
    },
    {
      id: 'appointments',
      name: 'Appointments Report',
      description: 'Detailed appointment analytics',
      icon: Calendar
    },
    {
      id: 'revenue',
      name: 'Revenue Report',
      description: 'Financial performance and revenue analysis',
      icon: DollarSign
    },
    {
      id: 'patients',
      name: 'Patient Analytics',
      description: 'Patient demographics and statistics',
      icon: Users
    }
  ];

  const recentReports = [
    {
      id: 1,
      name: 'Monthly Revenue Report - December 2023',
      type: 'Revenue',
      date: '2024-01-01',
      size: '2.4 MB',
      format: 'PDF'
    },
    {
      id: 2,
      name: 'Patient Analytics - Q4 2023',
      type: 'Patients',
      date: '2023-12-31',
      size: '1.8 MB',
      format: 'Excel'
    },
    {
      id: 3,
      name: 'Appointment Summary - December 2023',
      type: 'Appointments',
      date: '2023-12-30',
      size: '1.2 MB',
      format: 'PDF'
    },
    {
      id: 4,
      name: 'Hospital Overview - December 2023',
      type: 'Overview',
      date: '2023-12-29',
      size: '3.1 MB',
      format: 'PDF'
    }
  ];

  const quickStats = [
    {
      title: 'Total Reports Generated',
      value: '156',
      change: '+12%',
      icon: FileText,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'This Month',
      value: '24',
      change: '+8%',
      icon: Calendar,
      color: 'bg-green-100 text-green-600'
    },
    {
      title: 'Most Downloaded',
      value: 'Revenue',
      change: '45%',
      icon: TrendingUp,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      title: 'Avg. Generation Time',
      value: '2.3s',
      change: '-15%',
      icon: BarChart3,
      color: 'bg-orange-100 text-orange-600'
    }
  ];

  const generateReport = () => {
    // In a real application, this would trigger report generation
    alert(`Generating ${reportTypes.find(r => r.id === selectedReport)?.name} for ${dateRange} in ${reportFormat.toUpperCase()} format`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600">Generate and manage hospital reports</p>
        </div>
        <button
          onClick={generateReport}
          className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
        >
          <FileText className="w-4 h-4" />
          Generate Report
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {quickStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3 h-3" />
                    {stat.change} from last month
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report Generator */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Generate New Report</h3>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Report Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Select Report Type</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {reportTypes.map((report) => {
                  const Icon = report.icon;
                  return (
                    <button
                      key={report.id}
                      onClick={() => setSelectedReport(report.id)}
                      className={`p-4 border rounded-lg text-left transition-colors ${
                        selectedReport === report.id
                          ? 'border-teal-500 bg-teal-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <Icon className={`w-5 h-5 ${selectedReport === report.id ? 'text-teal-600' : 'text-gray-400'}`} />
                        <span className="font-medium text-gray-900">{report.name}</span>
                      </div>
                      <p className="text-sm text-gray-600">{report.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="last7days">Last 7 Days</option>
                  <option value="last30days">Last 30 Days</option>
                  <option value="last3months">Last 3 Months</option>
                  <option value="last6months">Last 6 Months</option>
                  <option value="lastyear">Last Year</option>
                  <option value="custom">Custom Range</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
                <select
                  value={reportFormat}
                  onChange={(e) => setReportFormat(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="pdf">PDF</option>
                  <option value="excel">Excel</option>
                  <option value="csv">CSV</option>
                </select>
              </div>
            </div>

            {/* Report Preview */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Report Preview</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Type:</strong> {reportTypes.find(r => r.id === selectedReport)?.name}</p>
                <p><strong>Period:</strong> {dateRange.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</p>
                <p><strong>Format:</strong> {reportFormat.toUpperCase()}</p>
                <p><strong>Estimated Size:</strong> ~2.5 MB</p>
                <p><strong>Generation Time:</strong> ~3-5 seconds</p>
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={generateReport}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
            >
              <FileText className="w-4 h-4" />
              Generate Report
            </button>
          </div>
        </div>

        {/* Recent Reports */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Recent Reports</h3>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {recentReports.map((report) => (
                <div key={report.id} className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 text-sm truncate">{report.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500">{report.type}</span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500">{formatDate(report.date)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      {report.size} • {report.format}
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="text-gray-400 hover:text-gray-600">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-gray-400 hover:text-gray-600">
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="text-gray-400 hover:text-gray-600">
                        <Share className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <button className="w-full mt-4 text-center text-sm text-teal-600 hover:text-teal-700 font-medium">
              View All Reports
            </button>
          </div>
        </div>
      </div>

      {/* Report Templates */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Report Templates</h3>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                </div>
                <h4 className="font-medium text-gray-900">Monthly Summary</h4>
              </div>
              <p className="text-sm text-gray-600 mb-3">Comprehensive monthly performance report</p>
              <button className="text-sm text-teal-600 hover:text-teal-700 font-medium">Use Template</button>
            </div>
            
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
                <h4 className="font-medium text-gray-900">Financial Report</h4>
              </div>
              <p className="text-sm text-gray-600 mb-3">Detailed revenue and expense analysis</p>
              <button className="text-sm text-teal-600 hover:text-teal-700 font-medium">Use Template</button>
            </div>
            
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
                <h4 className="font-medium text-gray-900">Patient Report</h4>
              </div>
              <p className="text-sm text-gray-600 mb-3">Patient demographics and satisfaction metrics</p>
              <button className="text-sm text-teal-600 hover:text-teal-700 font-medium">Use Template</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Report;