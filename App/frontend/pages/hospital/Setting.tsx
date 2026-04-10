import React, { useState } from 'react';
import {
  HiOutlineCog6Tooth, HiOutlineUser, HiOutlineBuildingOffice2, HiOutlineBell,
  HiOutlineShieldCheck, HiOutlineCreditCard, HiOutlineGlobeAlt,
  HiOutlineEye, HiOutlineEyeSlash,
} from 'react-icons/hi2';

const Setting: React.FC = () => {
  const [tab, setTab] = useState('profile');
  const [showPw, setShowPw] = useState(false);
  const [notifs, setNotifs] = useState({ appointments: true, payments: true, reports: false, marketing: false });

  const tabs = [
    { id: 'profile', name: 'Hospital Profile', icon: HiOutlineBuildingOffice2 },
    { id: 'account', name: 'Account', icon: HiOutlineUser },
    { id: 'notifications', name: 'Notifications', icon: HiOutlineBell },
    { id: 'security', name: 'Security', icon: HiOutlineShieldCheck },
    { id: 'billing', name: 'Billing', icon: HiOutlineCreditCard },
    { id: 'preferences', name: 'Preferences', icon: HiOutlineGlobeAlt },
  ];

  const inputCls = "w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500";

  const renderTab = () => {
    switch (tab) {
      case 'profile': return (
        <div className="space-y-5">
          <h3 className="text-sm font-semibold text-gray-900">Hospital Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[['Hospital Name', 'Apollo Hospitals Mumbai'], ['Registration No.', 'MH-MUM-2023-001'], ['Phone', '+91 22 1234 5678'], ['Email', 'admin@apollomumbai.com']].map(([l, v]) => (
              <div key={l}><label className="block text-xs font-medium text-gray-600 mb-1">{l}</label><input type="text" defaultValue={v} className={inputCls} /></div>
            ))}
            <div className="md:col-span-2"><label className="block text-xs font-medium text-gray-600 mb-1">Address</label><textarea rows={2} defaultValue="123 Medical District, Andheri East, Mumbai 400069" className={inputCls} /></div>
            {[['City', 'Mumbai'], ['State', 'Maharashtra']].map(([l, v]) => (
              <div key={l}><label className="block text-xs font-medium text-gray-600 mb-1">{l}</label><input type="text" defaultValue={v} className={inputCls} /></div>
            ))}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Specialties</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {['Cardiology', 'Neurology', 'Orthopedics', 'Oncology', 'Pediatrics', 'Gynecology'].map(s => (
                <label key={s} className="flex items-center gap-2 text-xs text-gray-700"><input type="checkbox" defaultChecked className="rounded text-emerald-600" />{s}</label>
              ))}
            </div>
          </div>
        </div>
      );
      case 'account': return (
        <div className="space-y-5">
          <h3 className="text-sm font-semibold text-gray-900">Administrator Account</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[['Full Name', 'Dr. Rajesh Kumar'], ['Email', 'rajesh.kumar@apollomumbai.com'], ['Phone', '+91 98765 43210'], ['Position', 'Hospital Administrator']].map(([l, v]) => (
              <div key={l}><label className="block text-xs font-medium text-gray-600 mb-1">{l}</label><input type="text" defaultValue={v} className={inputCls} /></div>
            ))}
          </div>
          <h3 className="text-sm font-semibold text-gray-900">Change Password</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <label className="block text-xs font-medium text-gray-600 mb-1">Current Password</label>
              <input type={showPw ? 'text' : 'password'} className={inputCls + ' pr-9'} />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 bottom-2.5">
                {showPw ? <HiOutlineEyeSlash className="w-4 h-4 text-gray-400" /> : <HiOutlineEye className="w-4 h-4 text-gray-400" />}
              </button>
            </div>
            <div><label className="block text-xs font-medium text-gray-600 mb-1">New Password</label><input type="password" className={inputCls} /></div>
          </div>
        </div>
      );
      case 'notifications': return (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-900">Email Notifications</h3>
          {Object.entries(notifs).map(([k, v]) => {
            const labels: Record<string, [string, string]> = {
              appointments: ['New Appointments', 'Notified when new appointments are booked'],
              payments: ['Payment Notifications', 'Updates on payment transactions'],
              reports: ['Weekly Reports', 'Performance and analytics reports'],
              marketing: ['Marketing Updates', 'Product updates and promotions'],
            };
            const [title, desc] = labels[k] || [k, ''];
            return (
              <div key={k} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div><p className="text-xs font-medium text-gray-900">{title}</p><p className="text-[11px] text-gray-500">{desc}</p></div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={v} onChange={() => setNotifs(p => ({ ...p, [k]: !p[k as keyof typeof p] }))} className="sr-only peer" />
                  <div className="w-9 h-5 bg-gray-200 peer-checked:bg-emerald-600 rounded-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4"></div>
                </label>
              </div>
            );
          })}
        </div>
      );
      case 'security': return (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-900">Security Settings</h3>
          <div className="p-4 bg-green-50 rounded-md border border-green-200">
            <div className="flex items-center gap-2 mb-1"><HiOutlineShieldCheck className="w-4 h-4 text-green-600" /><span className="text-xs font-medium text-green-800">Two-Factor Authentication</span></div>
            <p className="text-[11px] text-green-700 mb-2">Add extra security to your account</p>
            <button className="px-3 py-1.5 bg-green-600 text-white rounded-md text-xs hover:bg-green-700">Enable 2FA</button>
          </div>
          <div className="p-4 bg-gray-50 rounded-md">
            <p className="text-xs font-medium text-gray-900 mb-2">Login Sessions</p>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between"><span className="text-gray-600">Chrome on Windows</span><span className="text-green-600">Active</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Mobile – Android</span><button className="text-red-500 hover:text-red-600">Revoke</button></div>
            </div>
          </div>
        </div>
      );
      case 'billing': return (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-900">Billing</h3>
          <div className="p-3 bg-blue-50 rounded-md border border-blue-200">
            <p className="text-xs font-medium text-blue-800">Current Plan: Professional</p>
            <p className="text-[11px] text-blue-600">₹2,999/month · Next billing: Jan 15, 2024</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-xs font-medium text-gray-600 mb-1">Billing Email</label><input type="email" defaultValue="billing@apollomumbai.com" className={inputCls} /></div>
            <div><label className="block text-xs font-medium text-gray-600 mb-1">GST Number</label><input type="text" defaultValue="27AABCU9603R1ZX" className={inputCls} /></div>
          </div>
          <h3 className="text-sm font-semibold text-gray-900">Payment History</h3>
          <div className="space-y-1.5">
            {['Dec 15, 2023', 'Nov 15, 2023', 'Oct 15, 2023'].map(d => (
              <div key={d} className="flex items-center justify-between p-2.5 bg-gray-50 rounded-md text-xs">
                <div><p className="font-medium text-gray-900">{d}</p><p className="text-[10px] text-gray-400">Professional Plan</p></div>
                <div className="text-right"><p className="font-medium text-gray-900">₹2,999</p><p className="text-[10px] text-green-600">Paid</p></div>
              </div>
            ))}
          </div>
        </div>
      );
      case 'preferences': return (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-900">Display Preferences</h3>
          {[['Language', ['English', 'Hindi', 'Marathi']], ['Timezone', ['Asia/Kolkata (IST)', 'Asia/Dubai (GST)', 'UTC']], ['Date Format', ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD']]].map(([label, opts]) => (
            <div key={label as string}><label className="block text-xs font-medium text-gray-600 mb-1">{label as string}</label>
              <select className={inputCls}>{(opts as string[]).map(o => <option key={o}>{o}</option>)}</select>
            </div>
          ))}
        </div>
      );
      default: return null;
    }
  };

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-5">
      <div><h1 className="text-lg font-bold text-gray-900">Settings</h1><p className="text-xs text-gray-500">Manage hospital and account settings</p></div>
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
            <div className="p-5">{renderTab()}</div>
            <div className="px-5 py-3 border-t border-gray-200 flex justify-end">
              <button className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white text-xs font-medium rounded-md hover:bg-emerald-700">
                <HiOutlineCog6Tooth className="w-3.5 h-3.5" /> Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Setting;
