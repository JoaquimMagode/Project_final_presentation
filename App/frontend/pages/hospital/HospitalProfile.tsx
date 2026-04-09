import React, { useState, useEffect } from 'react';
import { Building2, Mail, Phone, MapPin, Edit2, Save, AlertCircle, User, Globe } from 'lucide-react';
import { authAPI } from '../../services/api';

const HospitalProfile: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [hospitalData, setHospitalData] = useState({
    id: 0,
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    country: 'India',
    description: '',
    specialties: [] as string[],
    status: '',
  });

  const [adminData, setAdminData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await authAPI.getProfile();
        if (res.success) {
          const { user, hospital } = res.data;
          setAdminData({ name: user.name, email: user.email, phone: user.phone || '' });
          if (hospital) {
            setHospitalData({
              id: hospital.id,
              name: hospital.name || '',
              email: hospital.email || '',
              phone: hospital.phone || '',
              address: hospital.address || '',
              city: hospital.city || '',
              state: hospital.state || '',
              country: hospital.country || 'India',
              description: hospital.description || '',
              specialties: Array.isArray(hospital.specialties) ? hospital.specialties : [],
              status: hospital.status || '',
            });
          }
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');

      // Update admin user info
      await authAPI.updateProfile({ name: adminData.name, phone: adminData.phone });

      // Update hospital info
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/hospitals/${hospitalData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          name: hospitalData.name,
          email: hospitalData.email,
          phone: hospitalData.phone,
          address: hospitalData.address,
          city: hospitalData.city,
          state: hospitalData.state,
          country: hospitalData.country,
          description: hospitalData.description,
          specialties: hospitalData.specialties,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update hospital');

      setSuccess('Profile saved successfully');
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const handleSpecialtyToggle = (specialty: string) => {
    setHospitalData(prev => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter(s => s !== specialty)
        : [...prev.specialties, specialty],
    }));
  };

  const commonSpecialties = [
    'Cardiology', 'Neurology', 'Orthopedics', 'Oncology', 'Pediatrics',
    'Gynecology', 'Ophthalmology', 'Dermatology', 'Urology', 'Nephrology',
    'Gastroenterology', 'Pulmonology', 'Endocrinology', 'Psychiatry', 'Dental',
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
        <span className="ml-2 text-gray-600">Loading profile...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hospital Profile</h1>
          <p className="text-gray-600">Manage your hospital and administrator information</p>
        </div>
        <button
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50"
        >
          {saving ? (
            <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> Saving...</>
          ) : isEditing ? (
            <><Save className="w-4 h-4" /> Save Changes</>
          ) : (
            <><Edit2 className="w-4 h-4" /> Edit Profile</>
          )}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" /> {error}
        </div>
      )}
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">{success}</div>
      )}

      {/* Hospital Info */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
            <Building2 className="w-6 h-6 text-teal-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Hospital Information</h2>
            {hospitalData.status && (
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                hospitalData.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
              }`}>
                {hospitalData.status}
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { label: 'Hospital Name', field: 'name', icon: Building2 },
            { label: 'Email', field: 'email', icon: Mail, type: 'email' },
            { label: 'Phone', field: 'phone', icon: Phone, type: 'tel' },
            { label: 'City', field: 'city', icon: MapPin },
            { label: 'State', field: 'state', icon: MapPin },
            { label: 'Country', field: 'country', icon: Globe },
          ].map(({ label, field, type = 'text' }) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              {isEditing ? (
                <input
                  type={type}
                  value={(hospitalData as any)[field]}
                  onChange={e => setHospitalData(prev => ({ ...prev, [field]: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              ) : (
                <p className="text-gray-900">{(hospitalData as any)[field] || <span className="text-gray-400">Not set</span>}</p>
              )}
            </div>
          ))}

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            {isEditing ? (
              <textarea
                value={hospitalData.address}
                onChange={e => setHospitalData(prev => ({ ...prev, address: e.target.value }))}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            ) : (
              <p className="text-gray-900">{hospitalData.address || <span className="text-gray-400">Not set</span>}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            {isEditing ? (
              <textarea
                value={hospitalData.description}
                onChange={e => setHospitalData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            ) : (
              <p className="text-gray-900">{hospitalData.description || <span className="text-gray-400">Not set</span>}</p>
            )}
          </div>
        </div>

        {/* Specialties */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">Specialties</label>
          {isEditing ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {commonSpecialties.map(s => (
                <label key={s} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hospitalData.specialties.includes(s)}
                    onChange={() => handleSpecialtyToggle(s)}
                    className="rounded text-teal-600"
                  />
                  <span className="text-sm text-gray-700">{s}</span>
                </label>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {hospitalData.specialties.length > 0
                ? hospitalData.specialties.map(s => (
                    <span key={s} className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm">{s}</span>
                  ))
                : <span className="text-gray-400 text-sm">No specialties listed</span>
              }
            </div>
          )}
        </div>
      </div>

      {/* Admin Info */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <User className="w-6 h-6 text-blue-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">Administrator Account</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            {isEditing ? (
              <input
                type="text"
                value={adminData.name}
                onChange={e => setAdminData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            ) : (
              <p className="text-gray-900">{adminData.name}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <p className="text-gray-900">{adminData.email}</p>
            <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            {isEditing ? (
              <input
                type="tel"
                value={adminData.phone}
                onChange={e => setAdminData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            ) : (
              <p className="text-gray-900">{adminData.phone || <span className="text-gray-400">Not set</span>}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalProfile;
