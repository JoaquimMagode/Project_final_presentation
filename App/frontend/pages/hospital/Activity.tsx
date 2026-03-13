import React, { useState } from 'react';
import { 
  Activity as ActivityIcon, Clock, User, Calendar, 
  CheckCircle, AlertCircle, XCircle, Filter, Search 
} from 'lucide-react';

interface ActivityLog {
  id: string;
  user: string;
  action: string;
  target: string;
  timestamp: string;
  type: 'success' | 'warning' | 'error' | 'info';
  details: string;
}

const Activity: React.FC = () => {
  const [filterType, setFilterType] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const [activities] = useState<ActivityLog[]>([
    {
      id: '1',
      user: 'Dr. Sarah Wilson',
      action: 'Created',
      target: 'Patient Record',
      timestamp: '2024-01-15T10:30:00Z',
      type: 'success',
      details: 'New patient John Smith added to system'
    },
    {
      id: '2',
      user: 'Michael Brown',
      action: 'Updated',
      target: 'Appointment',
      timestamp: '2024-01-15T09:15:00Z',
      type: 'info',
      details: 'Appointment rescheduled for Maria Garcia'
    },
    {
      id: '3',
      user: 'System',
      action: 'Failed',
      target: 'Payment Processing',
      timestamp: '2024-01-15T08:45:00Z',
      type: 'error',
      details: 'Payment failed for invoice INV-2024-003'
    },
    {
      id: '4',
      user: 'Emily Davis',
      action: 'Completed',
      target: 'Lab Test',
      timestamp: '2024-01-15T08:00:00Z',
      type: 'success',
      details: 'Blood test results uploaded for patient ID 12345'
    },
    {
      id: '5',
      user: 'James Miller',
      action: 'Warning',
      target: 'Inventory',
      timestamp: '2024-01-15T07:30:00Z',
      type: 'warning',
      details: 'Low stock alert for medication XYZ-123'
    }
  ]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      case 'info': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-4 h-4" />;
      case 'warning': return <AlertCircle className="w-4 h-4" />;
      case 'error': return <XCircle className="w-4 h-4" />;
      case 'info': return <ActivityIcon className="w-4 h-4" />;
      default: return <ActivityIcon className="w-4 h-4" />;
    }
  };

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.target.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'All' || activity.type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Activity Log</h1>
          <p className="text-gray-600">Monitor system activities and user actions</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-green-600">
            {activities.filter(a => a.type === 'success').length}
          </div>
          <div className="text-sm text-gray-600">Successful Actions</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-yellow-600">
            {activities.filter(a => a.type === 'warning').length}
          </div>
          <div className="text-sm text-gray-600">Warnings</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-red-600">
            {activities.filter(a => a.type === 'error').length}
          </div>
          <div className="text-sm text-gray-600">Errors</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-blue-600">
            {activities.filter(a => a.type === 'info').length}
          </div>
          <div className="text-sm text-gray-600">Info Actions</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg p-4 mb-6 shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search activities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="All">All Types</option>
            <option value="success">Success</option>
            <option value="warning">Warning</option>
            <option value="error">Error</option>
            <option value="info">Info</option>
          </select>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Recent Activities</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {filteredActivities.map((activity) => (
            <div key={activity.id} className="p-4 hover:bg-gray-50">
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-lg ${getTypeColor(activity.type)}`}>
                  {getTypeIcon(activity.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-900">{activity.user}</span>
                    <span className="text-gray-600">{activity.action}</span>
                    <span className="font-medium text-gray-900">{activity.target}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{activity.details}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(activity.timestamp).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Activity;