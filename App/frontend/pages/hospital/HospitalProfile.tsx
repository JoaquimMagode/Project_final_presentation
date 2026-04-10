import React, { useState, useEffect } from 'react';
import {
  HiOutlineBuildingOffice2, HiOutlineEnvelope, HiOutlinePhone, HiOutlineMapPin,
  HiOutlinePencilSquare, HiOutlineCheckCircle, HiOutlineExclamationCircle,
  HiOutlineUser, HiOutlineGlobeAlt,
} from 'react-icons/hi2';
import { authAPI } from '../../services/api';

const inputCls = "w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500";

const HospitalProfile: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [hospital, setHospital] = useState({ id: 0, name: '', email: '', phone: '', address: '', city: '', state: '', country: 'India', description: '', specialties: [] as string[], status: '' });
  const [admin, setAdmin] = useState({ name: '', email: '', phone: '' });

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await authAPI.getProfile();
        if (res.success) {
          const { user, hospital: h } = res.data;
          setAdmin({ name: user.name, email: user.email, phone: user.phone || '' });
          if (h) setHospital({ id: h.id, name: h.name || '', email: h.email || '', phone: h.phone || '', address: h.address || '', city: h.city || '', state: h.state || '', country: h.country || 'India', description: h.description || '', specialties: Array.isArray(h.specialties) ? h.specialties : [], status: h.status || '' });
        }
      } catch (e: any) { setError(e.message || 'Failed to load'); } finally { setLoading(false); }
    })();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true); setError(''); setSuccess('');
      await authAPI.updateProfile({ name: admin.name, phone: admin.phone });
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/hospitals/${hospital.id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: hospital.name, email: hospital.email, phone: hospital.phone, address: hospital.address, city: hospital.city, state: hospital.state, country: hospital.country, description: hospital.description, specialties: hospital.specialties }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update');
      setSuccess('Profile saved'); setEditing(false);
    } catch (e: any) { setError(e.message || 'Failed to save'); } finally { setSaving(false); }
  };

  const toggleSpec = (s: string) => setHospital(p => ({ ...p, specialties: p.specialties.includes(s) ? p.specialties.filter(x => x !== s) : [...p.specialties, s] }));
  const specs = ['Cardiology', 'Neurology', 'Orthopedics', 'Oncology', 'Pediatrics', 'Gynecology', 'Ophthalmology', 'Dermatology', 'Urology', 'Nephrology', 'Gastroenterology', 'Pulmonology', 'Endocrinology', 'Psychiatry', 'Dental'];

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600"></div></div>;

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div><h1 className="text-lg font-bold text-gray-900">Hospital Profile</h1><p className="text-xs text-gray-500">Manage hospital and admin information</p></div>
        <button onClick={() => editing ? handleSave() : setEditing(true)} disabled={saving}
          className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 text-white text-xs font-medium rounded-md hover:bg-emerald-700 disabled:opacity-50">
          {saving ? <><div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div> Saving...</>
            : editing ? <><HiOutlineCheckCircle className="w-3.5 h-3.5" /> Save Changes</>
            : <><HiOutlinePencilSquare className="w-3.5 h-3.5" /> Edit Profile</>}
        </button>
      </div>

      {error && <div className="p-3 bg-red-50 border border-red-200 rounded-md text-xs text-red-700 flex items-center gap-2"><HiOutlineExclamationCircle className="w-4 h-4" />{error}</div>}
      {success && <div className="p-3 bg-green-50 border border-green-200 rounded-md text-xs text-green-700">{success}</div>}

      {/* Hospital Info */}
      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 bg-emerald-50 rounded-md flex items-center justify-center"><HiOutlineBuildingOffice2 className="w-5 h-5 text-emerald-600" /></div>
          <div>
            <h2 className="text-sm font-semibold text-gray-900">Hospital Information</h2>
            {hospital.status && <span className={`text-[10px] px-2 py-0.5 rounded-md ${hospital.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>{hospital.status}</span>}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {([
            ['Hospital Name', 'name', 'text'], ['Email', 'email', 'email'], ['Phone', 'phone', 'tel'],
            ['City', 'city', 'text'], ['State', 'state', 'text'], ['Country', 'country', 'text'],
          ] as const).map(([label, field, type]) => (
            <div key={field}>
              <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
              {editing ? <input type={type} value={(hospital as any)[field]} onChange={e => setHospital(p => ({ ...p, [field]: e.target.value }))} className={inputCls} />
                : <p className="text-sm text-gray-900">{(hospital as any)[field] || <span className="text-gray-400">Not set</span>}</p>}
            </div>
          ))}
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-gray-600 mb-1">Address</label>
            {editing ? <textarea value={hospital.address} onChange={e => setHospital(p => ({ ...p, address: e.target.value }))} rows={2} className={inputCls} />
              : <p className="text-sm text-gray-900">{hospital.address || <span className="text-gray-400">Not set</span>}</p>}
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
            {editing ? <textarea value={hospital.description} onChange={e => setHospital(p => ({ ...p, description: e.target.value }))} rows={3} className={inputCls} />
              : <p className="text-sm text-gray-900">{hospital.description || <span className="text-gray-400">Not set</span>}</p>}
          </div>
        </div>
        <div className="mt-5">
          <label className="block text-xs font-medium text-gray-600 mb-2">Specialties</label>
          {editing ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {specs.map(s => <label key={s} className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer"><input type="checkbox" checked={hospital.specialties.includes(s)} onChange={() => toggleSpec(s)} className="rounded text-emerald-600" />{s}</label>)}
            </div>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {hospital.specialties.length > 0 ? hospital.specialties.map(s => <span key={s} className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-md text-[11px] font-medium">{s}</span>)
                : <span className="text-xs text-gray-400">No specialties listed</span>}
            </div>
          )}
        </div>
      </div>

      {/* Admin Info */}
      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 bg-blue-50 rounded-md flex items-center justify-center"><HiOutlineUser className="w-5 h-5 text-blue-600" /></div>
          <h2 className="text-sm font-semibold text-gray-900">Administrator Account</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Full Name</label>
            {editing ? <input type="text" value={admin.name} onChange={e => setAdmin(p => ({ ...p, name: e.target.value }))} className={inputCls} />
              : <p className="text-sm text-gray-900">{admin.name}</p>}
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
            <p className="text-sm text-gray-900">{admin.email}</p>
            <p className="text-[10px] text-gray-400">Cannot be changed</p>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Phone</label>
            {editing ? <input type="tel" value={admin.phone} onChange={e => setAdmin(p => ({ ...p, phone: e.target.value }))} className={inputCls} />
              : <p className="text-sm text-gray-900">{admin.phone || <span className="text-gray-400">Not set</span>}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalProfile;
