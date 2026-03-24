import React, { useState } from 'react';
import { 
  Building2, Plus, Users, DollarSign, FileText, Settings, 
  Bell, User, Search, CheckCircle, XCircle, Edit, Ban, Eye,
  Save, X, MapPin, Stethoscope, Shield, Clock, HeartPulse, Upload, Tag
} from 'lucide-react';

const SuperAdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('DASHBOARD');
  const [showAddHospital, setShowAddHospital] = useState(false);
  const [newHospital, setNewHospital] = useState({
    name: '',
    state: '',
    city: '',
    country: 'India',
    specialties: [] as string[],
    commissionRate: 8,
    contactEmail: '',
    contactPhone: '',
    address: '',
    accreditations: [] as string[],
    description: '',
    logo: null as File | null,
    logoPreview: ''
  });
  const [currentSpecialty, setCurrentSpecialty] = useState('');
  const [currentAccreditation, setCurrentAccreditation] = useState('');

  // Indian States and Cities data
  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
    'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
    'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
    'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu and Kashmir', 'Ladakh'
  ];

  const citiesByState: { [key: string]: string[] } = {
    'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad', 'Solapur', 'Kolhapur'],
    'Delhi': ['New Delhi', 'Central Delhi', 'North Delhi', 'South Delhi', 'East Delhi', 'West Delhi'],
    'Karnataka': ['Bangalore', 'Mysore', 'Hubli', 'Mangalore', 'Belgaum', 'Gulbarga'],
    'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli'],
    'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Khammam'],
    'West Bengal': ['Kolkata', 'Howrah', 'Durgapur', 'Asansol', 'Siliguri'],
    'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar'],
    'Rajasthan': ['Jaipur', 'Jodhpur', 'Kota', 'Bikaner', 'Ajmer', 'Udaipur'],
    'Punjab': ['Chandigarh', 'Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala'],
    'Haryana': ['Gurgaon', 'Faridabad', 'Panipat', 'Ambala', 'Yamunanagar'],
    'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Ghaziabad', 'Agra', 'Meerut', 'Varanasi', 'Allahabad'],
    'Madhya Pradesh': ['Bhopal', 'Indore', 'Gwalior', 'Jabalpur', 'Ujjain'],
    'Bihar': ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Purnia'],
    'Odisha': ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Berhampur'],
    'Kerala': ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Kollam'],
    'Assam': ['Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat'],
    'Jharkhand': ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro'],
    'Chhattisgarh': ['Raipur', 'Bhilai', 'Korba', 'Bilaspur'],
    'Uttarakhand': ['Dehradun', 'Haridwar', 'Roorkee', 'Haldwani'],
    'Himachal Pradesh': ['Shimla', 'Dharamshala', 'Solan', 'Mandi'],
    'Jammu and Kashmir': ['Srinagar', 'Jammu', 'Anantnag'],
    'Goa': ['Panaji', 'Margao', 'Vasco da Gama'],
    'Tripura': ['Agartala'],
    'Manipur': ['Imphal'],
    'Nagaland': ['Kohima', 'Dimapur'],
    'Mizoram': ['Aizawl'],
    'Arunachal Pradesh': ['Itanagar'],
    'Meghalaya': ['Shillong'],
    'Sikkim': ['Gangtok']
  };

  const medicalSpecialties = [
    'Cardiology', 'Neurology', 'Orthopedics', 'Oncology', 'Gastroenterology',
    'Pulmonology', 'Nephrology', 'Endocrinology', 'Dermatology', 'Ophthalmology',
    'ENT', 'Urology', 'Gynecology', 'Pediatrics', 'Psychiatry', 'Radiology',
    'Anesthesiology', 'Emergency Medicine', 'General Surgery', 'Plastic Surgery',
    'Cardiac Surgery', 'Neurosurgery', 'Transplant Surgery', 'Dental Surgery',
    'Physiotherapy', 'Critical Care', 'Infectious Diseases', 'Rheumatology'
  ];

  const accreditationOptions = [
    'JCI Accredited', 'NABH Verified', 'ISO 9001:2015 Certified', 'NABL Certified',
    'AAHRPP Accredited', 'CAP Accredited', 'AABB Accredited', 'Green OT Certified',
    'HIPAA Compliant', 'CGHS Empanelled', 'ESIC Approved', 'Ayushman Bharat Empanelled'
  ];

  // Mock data for existing hospitals
  const [hospitals, setHospitals] = useState([
    { id: 1, name: 'Apollo Hospitals Mumbai', state: 'Maharashtra', city: 'Mumbai', country: 'India', specialties: ['Cardiology', 'Oncology'], commissionRate: 8, status: 'Active', patients: 245 },
    { id: 2, name: 'Fortis Memorial Research Institute', state: 'Delhi', city: 'New Delhi', country: 'India', specialties: ['Transplant Surgery', 'Neurology'], commissionRate: 10, status: 'Active', patients: 189 },
    { id: 3, name: 'Max Healthcare Delhi', state: 'Delhi', city: 'New Delhi', country: 'India', specialties: ['Orthopedics', 'Gastroenterology'], commissionRate: 7, status: 'Pending Approval', patients: 0 },
    { id: 4, name: 'Medanta Gurgaon', state: 'Haryana', city: 'Gurgaon', country: 'India', specialties: ['Cardiac Surgery'], commissionRate: 9, status: 'Active', patients: 156 }
  ]);

  const summaryData = {
    totalHospitals: hospitals.length,
    activeHospitals: hospitals.filter(h => h.status === 'Active').length,
    totalPatients: hospitals.reduce((sum, h) => sum + h.patients, 0),
    totalRevenue: 125400,
    pendingApprovals: hospitals.filter(h => h.status === 'Pending Approval').length
  };

  const sidebarItems = [
    { id: 'DASHBOARD', label: 'Dashboard', icon: Building2 },
    { id: 'ADD_HOSPITAL', label: 'Add Hospital', icon: Plus },
    { id: 'MANAGE_HOSPITALS', label: 'Manage Hospitals', icon: Building2 },
    { id: 'PATIENTS', label: 'Patient Overview', icon: Users },
    { id: 'REVENUE', label: 'Revenue & Commissions', icon: DollarSign },
    { id: 'REPORTS', label: 'System Reports', icon: FileText },
    { id: 'SETTINGS', label: 'Platform Settings', icon: Settings }
  ];

  const handleAddHospital = (e: React.FormEvent) => {
    e.preventDefault();
    const hospital = {
      id: hospitals.length + 1,
      name: newHospital.name,
      state: newHospital.state,
      city: newHospital.city,
      country: newHospital.country,
      specialties: newHospital.specialties,
      commissionRate: newHospital.commissionRate,
      status: 'Pending Approval',
      patients: 0
    };
    setHospitals([...hospitals, hospital]);
    setNewHospital({
      name: '', state: '', city: '', country: 'India', specialties: [], commissionRate: 8,
      contactEmail: '', contactPhone: '', address: '', accreditations: [], description: '',
      logo: null, logoPreview: ''
    });
    setShowAddHospital(false);
    setActiveTab('MANAGE_HOSPITALS');
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewHospital({...newHospital, logo: file});
      const reader = new FileReader();
      reader.onload = (e) => {
        setNewHospital(prev => ({...prev, logoPreview: e.target?.result as string}));
      };
      reader.readAsDataURL(file);
    }
  };

  const addSpecialty = () => {
    if (currentSpecialty && !newHospital.specialties.includes(currentSpecialty)) {
      setNewHospital({
        ...newHospital,
        specialties: [...newHospital.specialties, currentSpecialty]
      });
      setCurrentSpecialty('');
    }
  };

  const removeSpecialty = (specialty: string) => {
    setNewHospital({
      ...newHospital,
      specialties: newHospital.specialties.filter(s => s !== specialty)
    });
  };

  const addAccreditation = () => {
    if (currentAccreditation && !newHospital.accreditations.includes(currentAccreditation)) {
      setNewHospital({
        ...newHospital,
        accreditations: [...newHospital.accreditations, currentAccreditation]
      });
      setCurrentAccreditation('');
    }
  };

  const removeAccreditation = (accreditation: string) => {
    setNewHospital({
      ...newHospital,
      accreditations: newHospital.accreditations.filter(a => a !== accreditation)
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Pending Approval': return 'bg-yellow-100 text-yellow-800';
      case 'Suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg border-r border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-600 p-2 rounded-lg text-white">
              <HeartPulse className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">IMAP Solution</h1>
              <p className="text-sm text-slate-600">Super Admin Panel</p>
            </div>
          </div>
        </div>
        
        <nav className="mt-6">
          {sidebarItems.map(item => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-6 py-3 text-left hover:bg-emerald-50 transition-colors ${
                  activeTab === item.id ? 'bg-emerald-50 text-emerald-700 border-r-2 border-emerald-600' : 'text-slate-600'
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
        <header className="bg-white shadow-sm border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold text-slate-900">
                {sidebarItems.find(item => item.id === activeTab)?.label}
              </h2>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-slate-400 hover:text-slate-600">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">Super Admin</p>
                  <p className="text-xs text-slate-500">System Administrator</p>
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
                <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-500">Total Hospitals</p>
                      <p className="text-2xl font-bold text-slate-900">{summaryData.totalHospitals}</p>
                    </div>
                    <Building2 className="w-8 h-8 text-emerald-600" />
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-500">Active Hospitals</p>
                      <p className="text-2xl font-bold text-slate-900">{summaryData.activeHospitals}</p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-500">Total Patients</p>
                      <p className="text-2xl font-bold text-slate-900">{summaryData.totalPatients}</p>
                    </div>
                    <Users className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-500">Total Revenue</p>
                      <p className="text-2xl font-bold text-slate-900">${summaryData.totalRevenue.toLocaleString()}</p>
                    </div>
                    <DollarSign className="w-8 h-8 text-emerald-600" />
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-500">Pending Approvals</p>
                      <p className="text-2xl font-bold text-slate-900">{summaryData.pendingApprovals}</p>
                    </div>
                    <Clock className="w-8 h-8 text-yellow-600" />
                  </div>
                </div>
              </div>

              {/* Recent Hospitals Table */}
              <div className="bg-white rounded-lg shadow-sm border border-slate-200">
                <div className="p-6 border-b border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-900">Recent Hospital Additions</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Hospital Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Location</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Specialties</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Patients</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {hospitals.slice(0, 4).map(hospital => (
                        <tr key={hospital.id} className="hover:bg-slate-50">
                          <td className="px-6 py-4 text-sm font-medium text-slate-900">{hospital.name}</td>
                          <td className="px-6 py-4 text-sm text-slate-900">{hospital.city}, {hospital.state}</td>
                          <td className="px-6 py-4 text-sm text-slate-900">
                            <div className="flex flex-wrap gap-1">
                              {hospital.specialties.slice(0, 2).map((specialty, idx) => (
                                <span key={idx} className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs rounded-full">
                                  {specialty}
                                </span>
                              ))}
                              {hospital.specialties.length > 2 && (
                                <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">
                                  +{hospital.specialties.length - 2} more
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(hospital.status)}`}>
                              {hospital.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-900">{hospital.patients}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ADD_HOSPITAL' && (
            <div className="max-w-4xl">
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-slate-900">Add New Hospital to IMAP Solution Network</h3>
                </div>
                
                <form onSubmit={handleAddHospital} className="space-y-6">
                  {/* Hospital Logo Upload */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Hospital Logo</label>
                    <div className="flex items-center gap-4">
                      <div className="w-24 h-24 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center overflow-hidden">
                        {newHospital.logoPreview ? (
                          <img src={newHospital.logoPreview} alt="Logo preview" className="w-full h-full object-cover" />
                        ) : (
                          <div className="text-center">
                            <Upload className="w-8 h-8 text-slate-400 mx-auto mb-1" />
                            <span className="text-xs text-slate-500">Upload Logo</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="hidden"
                          id="logo-upload"
                        />
                        <label
                          htmlFor="logo-upload"
                          className="px-4 py-2 bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200 cursor-pointer transition-colors"
                        >
                          Choose Logo
                        </label>
                        <p className="text-xs text-slate-500 mt-1">PNG, JPG up to 2MB</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Hospital Name *</label>
                      <input
                        type="text"
                        required
                        value={newHospital.name}
                        onChange={(e) => setNewHospital({...newHospital, name: e.target.value})}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="e.g., Apollo Hospitals Mumbai"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Country</label>
                      <select
                        value={newHospital.country}
                        onChange={(e) => setNewHospital({...newHospital, country: e.target.value})}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      >
                        <option value="India">India</option>
                        <option value="Thailand">Thailand</option>
                        <option value="Singapore">Singapore</option>
                        <option value="Malaysia">Malaysia</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">State *</label>
                      <select
                        required
                        value={newHospital.state}
                        onChange={(e) => {
                          setNewHospital({...newHospital, state: e.target.value, city: ''});
                        }}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      >
                        <option value="">Select State</option>
                        {indianStates.map(state => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">City *</label>
                      <select
                        required
                        value={newHospital.city}
                        onChange={(e) => setNewHospital({...newHospital, city: e.target.value})}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        disabled={!newHospital.state}
                      >
                        <option value="">Select City</option>
                        {newHospital.state && citiesByState[newHospital.state]?.map(city => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Commission Rate (%)</label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={newHospital.commissionRate}
                      onChange={(e) => setNewHospital({...newHospital, commissionRate: parseInt(e.target.value)})}
                      className="w-32 px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>

                  {/* Medical Specialties */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Medical Specialties *</label>
                    <div className="flex gap-2 mb-3">
                      <select
                        value={currentSpecialty}
                        onChange={(e) => setCurrentSpecialty(e.target.value)}
                        className="flex-1 px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      >
                        <option value="">Select a specialty</option>
                        {medicalSpecialties.map(specialty => (
                          <option key={specialty} value={specialty}>{specialty}</option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={addSpecialty}
                        className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {newHospital.specialties.map((specialty, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm flex items-center gap-2"
                        >
                          <Tag className="w-3 h-3" />
                          {specialty}
                          <button
                            type="button"
                            onClick={() => removeSpecialty(specialty)}
                            className="text-emerald-600 hover:text-emerald-800"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    {newHospital.specialties.length === 0 && (
                      <p className="text-sm text-slate-500 mt-2">Please add at least one medical specialty</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Contact Email</label>
                      <input
                        type="email"
                        value={newHospital.contactEmail}
                        onChange={(e) => setNewHospital({...newHospital, contactEmail: e.target.value})}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="admin@hospital.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Contact Phone</label>
                      <input
                        type="tel"
                        value={newHospital.contactPhone}
                        onChange={(e) => setNewHospital({...newHospital, contactPhone: e.target.value})}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Full Address</label>
                    <textarea
                      value={newHospital.address}
                      onChange={(e) => setNewHospital({...newHospital, address: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Complete hospital address"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Hospital Description</label>
                    <textarea
                      value={newHospital.description}
                      onChange={(e) => setNewHospital({...newHospital, description: e.target.value})}
                      rows={4}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Brief description of hospital facilities and services"
                    />
                  </div>

                  {/* Accreditations */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Accreditations</label>
                    <div className="flex gap-2 mb-3">
                      <select
                        value={currentAccreditation}
                        onChange={(e) => setCurrentAccreditation(e.target.value)}
                        className="flex-1 px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      >
                        <option value="">Select an accreditation</option>
                        {accreditationOptions.map(accreditation => (
                          <option key={accreditation} value={accreditation}>{accreditation}</option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={addAccreditation}
                        className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {newHospital.accreditations.map((accreditation, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-2"
                        >
                          <Shield className="w-3 h-3" />
                          {accreditation}
                          <button
                            type="button"
                            onClick={() => removeAccreditation(accreditation)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      type="submit"
                      className="px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      Add Hospital to Network
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewHospital({
                        name: '', state: '', city: '', country: 'India', specialties: [], commissionRate: 8,
                        contactEmail: '', contactPhone: '', address: '', accreditations: [], description: '',
                        logo: null, logoPreview: ''
                      })}
                      className="px-6 py-2 border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 transition-colors"
                    >
                      Clear Form
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'MANAGE_HOSPITALS' && (
            <div className="bg-white rounded-lg shadow-sm border border-slate-200">
              <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">Hospital Network Management</h3>
                <button
                  onClick={() => setActiveTab('ADD_HOSPITAL')}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add New Hospital
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Hospital Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Location</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Specialties</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Commission Rate</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Patients</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {hospitals.map(hospital => (
                      <tr key={hospital.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 text-sm font-medium text-slate-900">{hospital.name}</td>
                        <td className="px-6 py-4 text-sm text-slate-900">{hospital.city}, {hospital.state}</td>
                        <td className="px-6 py-4 text-sm text-slate-900">
                          <div className="flex flex-wrap gap-1">
                            {hospital.specialties.slice(0, 3).map((specialty, idx) => (
                              <span key={idx} className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs rounded-full">
                                {specialty}
                              </span>
                            ))}
                            {hospital.specialties.length > 3 && (
                              <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">
                                +{hospital.specialties.length - 3} more
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-900">{hospital.commissionRate}%</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(hospital.status)}`}>
                            {hospital.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-900">{hospital.patients}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button className="p-1 text-emerald-600 hover:bg-emerald-50 rounded">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="p-1 text-slate-600 hover:bg-slate-50 rounded">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-1 text-red-600 hover:bg-red-50 rounded">
                              <Ban className="w-4 h-4" />
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

          {activeTab === 'SETTINGS' && (
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-6">IMAP Solution Platform Settings</h3>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Platform Name</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" 
                      defaultValue="IMAP Solution - Medical Tourism Platform" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Default Commission Rate (%)</label>
                    <input 
                      type="number" 
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" 
                      defaultValue="8" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Support Email</label>
                  <input 
                    type="email" 
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" 
                    defaultValue="support@imapsolution.com" 
                  />
                </div>
                <button className="px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors">
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

export default SuperAdminDashboard;