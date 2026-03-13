import React, { useState } from 'react';
import { 
  CreditCard, DollarSign, Search, Filter, Download, Plus, Eye, 
  CheckCircle, XCircle, Clock, AlertCircle, TrendingUp, TrendingDown 
} from 'lucide-react';

interface Payment {
  id: string;
  patientName: string;
  invoiceNumber: string;
  amount: number;
  date: string;
  dueDate: string;
  status: 'Paid' | 'Pending' | 'Overdue' | 'Cancelled';
  paymentMethod: string;
  service: string;
  insuranceCovered: number;
}

const Payments: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);

  const [payments] = useState<Payment[]>([
    {
      id: '1',
      patientName: 'John Smith',
      invoiceNumber: 'INV-2024-001',
      amount: 1250.00,
      date: '2024-01-15',
      dueDate: '2024-02-15',
      status: 'Paid',
      paymentMethod: 'Credit Card',
      service: 'Cardiology Consultation',
      insuranceCovered: 750.00
    },
    {
      id: '2',
      patientName: 'Sarah Johnson',
      invoiceNumber: 'INV-2024-002',
      amount: 3500.00,
      date: '2024-01-14',
      dueDate: '2024-02-14',
      status: 'Pending',
      paymentMethod: 'Insurance',
      service: 'Surgery - Knee Replacement',
      insuranceCovered: 2800.00
    },
    {
      id: '3',
      patientName: 'Michael Brown',
      invoiceNumber: 'INV-2024-003',
      amount: 850.00,
      date: '2024-01-10',
      dueDate: '2024-01-25',
      status: 'Overdue',
      paymentMethod: 'Cash',
      service: 'Emergency Treatment',
      insuranceCovered: 0
    },
    {
      id: '4',
      patientName: 'Lisa Anderson',
      invoiceNumber: 'INV-2024-004',
      amount: 450.00,
      date: '2024-01-12',
      dueDate: '2024-02-12',
      status: 'Paid',
      paymentMethod: 'Debit Card',
      service: 'Lab Tests',
      insuranceCovered: 200.00
    }
  ]);

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'All' || payment.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Overdue': return 'bg-red-100 text-red-800';
      case 'Cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Paid': return <CheckCircle className="w-4 h-4" />;
      case 'Pending': return <Clock className="w-4 h-4" />;
      case 'Overdue': return <AlertCircle className="w-4 h-4" />;
      case 'Cancelled': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const totalRevenue = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const paidAmount = payments.filter(p => p.status === 'Paid').reduce((sum, payment) => sum + payment.amount, 0);
  const pendingAmount = payments.filter(p => p.status === 'Pending').reduce((sum, payment) => sum + payment.amount, 0);
  const overdueAmount = payments.filter(p => p.status === 'Overdue').reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payments & Billing</h1>
          <p className="text-gray-600">Manage patient payments and billing information</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-teal-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-teal-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Invoice
        </button>
      </div>

      {/* Revenue Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex items-center text-green-600 text-sm">
              <TrendingUp className="w-4 h-4 mr-1" />
              +12.5%
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">${totalRevenue.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Total Revenue</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex items-center text-green-600 text-sm">
              <TrendingUp className="w-4 h-4 mr-1" />
              +8.2%
            </div>
          </div>
          <div className="text-2xl font-bold text-green-600">${paidAmount.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Paid Amount</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="flex items-center text-yellow-600 text-sm">
              <TrendingDown className="w-4 h-4 mr-1" />
              -3.1%
            </div>
          </div>
          <div className="text-2xl font-bold text-yellow-600">${pendingAmount.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Pending Amount</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div className="flex items-center text-red-600 text-sm">
              <TrendingUp className="w-4 h-4 mr-1" />
              +15.3%
            </div>
          </div>
          <div className="text-2xl font-bold text-red-600">${overdueAmount.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Overdue Amount</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg p-4 mb-6 shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search payments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="All">All Status</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Overdue">Overdue</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Invoice</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Patient</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Service</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Amount</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Insurance</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Due Date</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div>
                      <div className="font-medium text-gray-900">{payment.invoiceNumber}</div>
                      <div className="text-sm text-gray-500">{new Date(payment.date).toLocaleDateString()}</div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-medium text-gray-900">{payment.patientName}</div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-sm text-gray-900">{payment.service}</div>
                    <div className="text-xs text-gray-500">{payment.paymentMethod}</div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-semibold text-gray-900">${payment.amount.toLocaleString()}</div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-sm text-gray-900">${payment.insuranceCovered.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">
                      Patient: ${(payment.amount - payment.insuranceCovered).toLocaleString()}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-sm text-gray-900">
                      {new Date(payment.dueDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${getStatusColor(payment.status)}`}>
                      {getStatusIcon(payment.status)}
                      {payment.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <Eye className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <Download className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <CreditCard className="w-4 h-4 text-green-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Invoice Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Create New Invoice</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Patient Name</label>
                  <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Service</label>
                  <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                  <input type="number" step="0.01" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Insurance Coverage</label>
                  <input type="number" step="0.01" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                  <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500">
                    <option>Credit Card</option>
                    <option>Debit Card</option>
                    <option>Cash</option>
                    <option>Insurance</option>
                    <option>Bank Transfer</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" rows={3}></textarea>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">
                Create Invoice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments;