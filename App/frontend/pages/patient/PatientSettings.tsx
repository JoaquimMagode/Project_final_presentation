import React, { useState, useEffect } from 'react';
import {
  HiOutlineUser, HiOutlineBell, HiOutlineShieldCheck, HiOutlineGlobeAlt,
  HiOutlineEye, HiOutlineEyeSlash, HiOutlineExclamationCircle, HiOutlineCog6Tooth,
} from 'react-icons/hi2';
import { patientsAPI, authAPI } from '../../services/api';
import { useAuth } from '../../App';

const PatientSettings: React.FC = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState('account');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notifs, setNotifs] = useState({ email: true, push: true, sms: false, appointments: true, reminders: true, reports: true, marketing: false });
  const [acct, setAcct] = useState({ firstName: '', lastName: '', email: '', phone: '', dateOfBirth: '', language: 'English', timezone: 'UTC-5', theme: 'light' });
  const [privacy, setPrivacy] = useState({ profileVisibility: 'private', shareData: false, twoFactor: false });

  useEffect(() => { (async () => {
    try { setLoading(true); const res = await patientsAPI.getPatientProfile();
      if (res.success) { const p = res.data.patient; setAcct(a => ({ ...a, firstName: p.name?.split(' ')[0] || '', lastName: p.name?.split(' ').slice(1).join(' ') || '', email: p.email || '', phone: p.phone || '', dateOfBirth: p.date_of_birth || '' })); }
    } catch (e: any) { setError(e.message); } finally { setLoading(false); }
  })(); }, []);

  const handleSave = async () => {
    try { setSaving(true); setError('');
      await authAPI.updateProfile({ name: `${acct.firstName} ${acct.lastName}`, phone: acct.phone });
      await patientsAPI.updatePatientProfile({ date_of_birth: acct.dateOfBirth });
    } catch (e: any) { setError(e.message); } finally { setSaving(false); }
  };

  const tabs = [
    { id: 'account', name: 'Account', icon: HiOutlineUser },
    { id: 'notifications', name: 'Notifications', icon: HiOutlineBell },
    { id: 'privacy', name: 'Privacy', icon: HiOutlineShieldCheck },
    { id: 'preferences', name: 'Preferences', icon: HiOutlineGlobeAlt },
  ];
  const inputCls = "w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500";
  const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only peer" />
      <div className="w-9 h-5 bg-gray-200 peer-checked:bg-emerald-600 rounded-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4"></div>
    </label>
  );

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600"></div></div>;

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-5">
      {error && <div className="p-3 bg-red-50 border border-red-200 rounded-md text-xs text-red-700 flex items-center gap-2"><HiOutlineExclamationCircle className="w-4 h-4" />{error}</div>}
      <div><h1 className="text-lg font-bold text-gray-900">Settings</h1><p className="text-xs text-gray-500">Manage your account and preferences</p></div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 p-3">
            <nav className="space-y-0.5">
              {tabs.map(t => (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-left text-xs transition-colors ${tab === t.id ? 'bg-emerald-50 text-emerald-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}>
                  <t.icon className="w-3.5 h-3.5" />{t.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-5">
              {tab === 'account' && (
                <div className="space-y-5">
                  <h3 className="text-sm font-semibold text-gray-900">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {([['First Name', 'firstName'], ['Last Name', 'lastName'], ['Email', 'email'], ['Phone', 'phone'], ['Date of Birth', 'dateOfBirth']] as const).map(([l, k]) => (
                      <div key={k}><label className="block text-xs font-medium text-gray-600 mb-1">{l}</label>
                        <input type={k === 'dateOfBirth' ? 'date' : k === 'email' ? 'email' : 'text'} value={(acct as any)[k]} onChange={e => setAcct(p => ({ ...p, [k]: e.target.value }))} className={inputCls} />
                      </div>
                    ))}
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 pt-4 border-t border-gray-100">Change Password</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative"><label className="block text-xs font-medium text-gray-600 mb-1">Current Password</label>
                      <input type={showPw ? 'text' : 'password'} className={inputCls + ' pr-9'} />
                      <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 bottom-2.5">{showPw ? <HiOutlineEyeSlash className="w-4 h-4 text-gray-400" /> : <HiOutlineEye className="w-4 h-4 text-gray-400" />}</button>
                    </div>
                    <div><label className="block text-xs font-medium text-gray-600 mb-1">New Password</label><input type="password" className={inputCls} /></div>
                  </div>
                </div>
              )}

              {tab === 'notifications' && (
                <div className="space-y-5">
                  <h3 className="text-sm font-semibold text-gray-900">Channels</h3>
                  {([['email', 'Email Notifications', 'Receive via email'], ['push', 'Push Notifications', 'Browser push'], ['sms', 'SMS Notifications', 'Text alerts']] as const).map(([k, t, d]) => (
                    <div key={k} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                      <div><p className="text-xs font-medium text-gray-900">{t}</p><p className="text-[11px] text-gray-500">{d}</p></div>
                      <Toggle checked={(notifs as any)[k]} onChange={() => setNotifs(p => ({ ...p, [k]: !(p as any)[k] }))} />
                    </div>
                  ))}
                  <h3 className="text-sm font-semibold text-gray-900 pt-2">Types</h3>
                  {([['appointments', 'Appointment Reminders', 'Upcoming appointments'], ['reports', 'Medical Reports', 'New reports available'], ['reminders', 'Health Reminders', 'Medication reminders']] as const).map(([k, t, d]) => (
                    <div key={k} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                      <div><p className="text-xs font-medium text-gray-900">{t}</p><p className="text-[11px] text-gray-500">{d}</p></div>
                      <Toggle checked={(notifs as any)[k]} onChange={() => setNotifs(p => ({ ...p, [k]: !(p as any)[k] }))} />
                    </div>
                  ))}
                </div>
              )}

              {tab === 'privacy' && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-900">Security</h3>
                  <div className="p-3 bg-green-50 rounded-md border border-green-200">
                    <div className="flex items-center gap-2 mb-1"><HiOutlineShieldCheck className="w-4 h-4 text-green-600" /><span className="text-xs font-medium text-green-800">Two-Factor Authentication</span></div>
                    <p className="text-[11px] text-green-700 mb-2">Extra security layer</p>
                    <button className="px-3 py-1.5 bg-green-600 text-white rounded-md text-xs hover:bg-green-700">Enable 2FA</button>
                  </div>
                  <div><label className="block text-xs font-medium text-gray-600 mb-1">Profile Visibility</label>
                    <select value={privacy.profileVisibility} onChange={e => setPrivacy(p => ({ ...p, profileVisibility: e.target.value }))} className={inputCls}>
                      <option value="private">Private</option><option value="doctors-only">Doctors Only</option><option value="public">Public</option>
                    </select></div>
                  <div className="flex items-center justify-between py-2">
                    <div><p className="text-xs font-medium text-gray-900">Share Data for Research</p><p className="text-[11px] text-gray-500">Anonymized data</p></div>
                    <Toggle checked={privacy.shareData} onChange={() => setPrivacy(p => ({ ...p, shareData: !p.shareData }))} />
                  </div>
                </div>
              )}

              {tab === 'preferences' && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-900">Language & Region</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label className="block text-xs font-medium text-gray-600 mb-1">Language</label>
                      <select value={acct.language} onChange={e => setAcct(p => ({ ...p, language: e.target.value }))} className={inputCls}>
                        <option>English</option><option>Spanish</option><option>French</option>
                      </select></div>
                    <div><label className="block text-xs font-medium text-gray-600 mb-1">Timezone</label>
                      <select value={acct.timezone} onChange={e => setAcct(p => ({ ...p, timezone: e.target.value }))} className={inputCls}>
                        <option value="UTC-5">Eastern (UTC-5)</option><option value="UTC-6">Central (UTC-6)</option><option value="UTC-8">Pacific (UTC-8)</option>
                      </select></div>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 pt-2">Theme</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {(['light', 'dark', 'auto'] as const).map(t => (
                      <div key={t} onClick={() => setAcct(p => ({ ...p, theme: t }))}
                        className={`border-[1.5px] rounded-md p-3 cursor-pointer transition-colors ${acct.theme === t ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:border-gray-300'}`}>
                        <div className={`w-full h-10 rounded-md mb-2 ${t === 'light' ? 'bg-white border border-gray-200' : t === 'dark' ? 'bg-gray-800' : 'bg-gradient-to-r from-white to-gray-800'}`}></div>
                        <p className="text-center text-xs font-medium capitalize">{t}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="px-5 py-3 border-t border-gray-200 flex justify-end">
              <button onClick={handleSave} disabled={saving}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white text-xs font-medium rounded-md hover:bg-emerald-700 disabled:opacity-50">
                <HiOutlineCog6Tooth className="w-3.5 h-3.5" /> {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientSettings;
