import React, { useState } from 'react';
import { 
  BarChart3, Building2, Users, DollarSign, FileText, MessageSquare, 
  TrendingUp, Settings, Bell, User, Search, CheckCircle, XCircle, 
  Clock, Eye, Edit, Ban, Check, X, Download, AlertTriangle 
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('DASHBOARD');

  // Mock data
  const summaryData = {
    totalHospitals: 45,
    totalPatients: 1247,
    activeCases: 89,
    completedCases: 1158,
    totalCommission: 125400
  };

  const recentCases = [
    { id: 'C001', patient: 'Samuel Okafor', hospital: 'Fortis Memorial', status: 'In Progress', commission: 'Pending' },
    { id: 'C002', patient: 'Maria Santos', hospital: 'Apollo Chennai', status: 'Completed', commission: 'Paid' },
    { id: 'C003', patient: 'John Mwangi', hospital: 'Max Healthcare', status: 'New', commission: 'Pending' },
    { id: 'C004', patient: 'Grace Adebayo', hospital: 'Fortis Memorial', status: 'Completed', commission: 'Pending' }
  ];

  const hospitals = [
    { id: 1, name: 'Fortis Memorial Research Institute', country: 'India', specialties: 'Cardiology, Oncology', rate: 8, status: 'Active' },
    { id: 2, name: 'Apollo Hospitals Chennai', country: 'India', specialties: 'Transplants, Neurology', rate: 10, status: 'Active' },
    { id: 3, name: 'Max Healthcare Delhi', country: 'India', specialties: 'Orthopedics, Gastro', rate: 7, status: 'Pending Approval' },
    { id: 4, name: 'Medanta Gurgaon', country: 'India', specialties: 'Cardiac Surgery', rate: 9, status: 'Suspended' }
  ];

  const patientCases = [
    { id: 'C001', patient: 'Samuel Okafor', hospital: 'Fortis Memorial', treatment: 'Cardiac Surgery', status: 'In Progress', completed: false },
    { id: 'C002', patient: 'Maria Santos', hospital: 'Apollo Chennai', treatment: 'Liver Transplant', status: 'Completed', completed: true },
    { id: 'C003', patient: 'John Mwangi', hospital: 'Max Healthcare', treatment: 'Cancer Treatment', status: 'New', completed: false },
    { id: 'C004', patient: 'Grace Adebayo', hospital: 'Fortis Memorial', treatment: 'Orthopedic Surgery', status: 'Completed', completed: true }
  ];

  const commissions = [
    { hospital: 'Fortis Memorial', patients: 45, rate: 8, amount: 36000, status: 'Pending' },
    { hospital: 'Apollo Chennai', patients: 32, rate: 10, amount: 32000, status: 'Paid' },
    { hospital: 'Max Healthcare', patients: 28, rate: 7, status: 'Pending', amount: 19600 },
    { hospital: 'Medanta Gurgaon', patients: 15, rate: 9, amount: 13500, status: 'Paid' }
  ];

  const invoices = [
    { id: 'INV001', hospital: 'Fortis Memorial', period: 'Nov 2023', amount: 36000, dueDate: '2023-12-15', status: 'Pending' },
    { id: 'INV002', hospital: 'Apollo Chennai', period: 'Nov 2023', amount: 32000, dueDate: '2023-12-15', status: 'Paid' },
    { id: 'INV003', hospital: 'Max Healthcare', period: 'Oct 2023', amount: 19600, dueDate: '2023-11-15', status: 'Overdue' }
  ];

  const complaints = [
    { id: 'COMP001', submittedBy: 'Samuel Okafor (Patient)', type: 'Payment Issue', status: 'Open' },
    { id: 'COMP002', submittedBy: 'Fortis Memorial (Hospital)', type: 'Technical Support', status: 'Resolved' },
    { id: 'COMP003', submittedBy: 'Maria Santos (Patient)', type: 'Service Quality', status: 'Open' }
  ];

  const sidebarItems = [
    { id: 'DASHBOARD', label: 'Dashboard', icon: BarChart3 },
    { id: 'HOSPITALS', label: 'Available Hospitals', icon: Building2 },
    { id: 'REQUESTS', label: 'Hospital Requests', icon: Clock },
    { id: 'PATIENTS', label: 'Patients / Cases', icon: Users },
    { id: 'COMMISSIONS', label: 'Commissions', icon: DollarSign },
    { id: 'INVOICES', label: 'Invoices', icon: FileText },
    { id: 'COMPLAINTS', label: 'Complaints / Support', icon: MessageSquare },
    { id: 'REPORTS', label: 'Reports', icon: TrendingUp },
    { id: 'SETTINGS', label: 'Settings', icon: Settings }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': case 'Completed': case 'Paid': case 'Resolved': return 'bg-green-100 text-green-800';
      case 'Pending': case 'In Progress': case 'Open': return 'bg-yellow-100 text-yellow-800';
      case 'Suspended': case 'Overdue': return 'bg-red-100 text-red-800';
      case 'New': case 'Pending Approval': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-blue-600">IMAP Admin</h1>
          <p className="text-sm text-gray-500">International Medical Assistance Platform</p>
        </div>
        
        <nav className="mt-6">
          {sidebarItems.map(item => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-6 py-3 text-left hover:bg-blue-50 transition-colors ${
                  activeTab === item.id ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : 'text-gray-600'
                }`}
              >
                <IconComponent className="w-5 h-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold text-gray-900">
                {sidebarItems.find(item => item.id === activeTab)?.label}
              </h2>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-gray-400 hover:text-gray-600">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Admin User</p>
                  <p className="text-xs text-gray-500">Platform Administrator</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6 overflow-y-auto">
          {activeTab === 'DASHBOARD' && (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-5 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Total Hospitals</p>
                      <p className="text-2xl font-bold text-gray-900">{summaryData.totalHospitals}</p>
                    </div>
                    <Building2 className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Total Patients</p>
                      <p className="text-2xl font-bold text-gray-900">{summaryData.totalPatients}</p>
                    </div>
                    <Users className="w-8 h-8 text-green-600" />
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Active Cases</p>
                      <p className="text-2xl font-bold text-gray-900">{summaryData.activeCases}</p>
                    </div>
                    <Clock className="w-8 h-8 text-yellow-600" />
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Completed Cases</p>
                      <p className="text-2xl font-bold text-gray-900">{summaryData.completedCases}</p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Total Commission</p>
                      <p className="text-2xl font-bold text-gray-900">${summaryData.totalCommission.toLocaleString()}</p>
                    </div>
                    <DollarSign className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
              </div>

              {/* Recent Cases Table */}
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-6 border-b">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Patient Cases</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Case ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hospital Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Commission Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {recentCases.map(case_ => (
                        <tr key={case_.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">{case_.id}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{case_.patient}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{case_.hospital}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(case_.status)}`}>
                              {case_.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(case_.commission)}`}>
                              {case_.commission}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'HOSPITALS' && (
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-900">Available Hospitals</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hospital Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Country</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Specialties</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Commission Rate</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {hospitals.filter(h => h.status === 'Active').map(hospital => (
                      <tr key={hospital.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{hospital.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{hospital.country}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{hospital.specialties}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{hospital.rate}%</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(hospital.status)}`}>
                            {hospital.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="p-1 text-red-600 hover:bg-red-50 rounded">
                              <Ban className="w-4 h-4" />
                            </button>
                            <button className="p-1 text-gray-600 hover:bg-gray-50 rounded">
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'REQUESTS' && (
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-900">Hospital Partnership Requests</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hospital Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Country</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Specialties</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Requested Rate</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {hospitals.filter(h => h.status === 'Pending Approval' || h.status === 'Suspended').map(hospital => (
                      <tr key={hospital.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{hospital.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{hospital.country}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{hospital.specialties}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{hospital.rate}%</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(hospital.status)}`}>
                            {hospital.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button className="p-1 text-green-600 hover:bg-green-50 rounded">
                              <Check className="w-4 h-4" />
                            </button>
                            <button className="p-1 text-red-600 hover:bg-red-50 rounded">
                              <X className="w-4 h-4" />
                            </button>
                            <button className="p-1 text-gray-600 hover:bg-gray-50 rounded">
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'PATIENTS' && (
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-900">Patient Cases Management</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Case ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hospital Assigned</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Treatment Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Case Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Treatment Completed</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {patientCases.map(case_ => (
                      <tr key={case_.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{case_.id}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{case_.patient}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{case_.hospital}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{case_.treatment}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(case_.status)}`}>
                            {case_.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <input 
                            type="checkbox" 
                            checked={case_.completed}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                            readOnly
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'COMMISSIONS' && (
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-900">Commission Management</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hospital Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Completed Patients</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Commission Rate</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {commissions.map((commission, i) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{commission.hospital}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{commission.patients}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{commission.rate}%</td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">${commission.amount.toLocaleString()}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(commission.status)}`}>
                            {commission.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'INVOICES' && (
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-900">Invoice Management</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hospital Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Billing Period</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount Due</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {invoices.map(invoice => (
                      <tr key={invoice.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{invoice.id}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{invoice.hospital}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{invoice.period}</td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">${invoice.amount.toLocaleString()}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{invoice.dueDate}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(invoice.status)}`}>
                            {invoice.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                            <Download className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'COMPLAINTS' && (
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-900">Complaints & Support</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Complaint ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Submitted By</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Issue Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {complaints.map(complaint => (
                      <tr key={complaint.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{complaint.id}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{complaint.submittedBy}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{complaint.type}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(complaint.status)}`}>
                            {complaint.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'REPORTS' && (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Patient Growth</h3>
                  <div className="h-32 bg-gray-100 rounded flex items-center justify-center">
                    <p className="text-gray-500">Chart Placeholder</p>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue from Commissions</h3>
                  <div className="h-32 bg-gray-100 rounded flex items-center justify-center">
                    <p className="text-gray-500">Chart Placeholder</p>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Hospitals by Patients</h3>
                  <div className="h-32 bg-gray-100 rounded flex items-center justify-center">
                    <p className="text-gray-500">Chart Placeholder</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'SETTINGS' && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Default Commission Rate (%)</label>
                  <input type="number" className="w-32 px-3 py-2 border border-gray-300 rounded-md" defaultValue="8" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Platform Name</label>
                  <input type="text" className="w-64 px-3 py-2 border border-gray-300 rounded-md" defaultValue="IMAP - International Medical Assistance Platform" />
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Save Settings
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;