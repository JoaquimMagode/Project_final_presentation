import React, { useState, useEffect, useRef } from 'react';
import {
  HiOutlineBuildingOffice2, HiOutlinePlus, HiOutlineUsers, HiOutlineCurrencyDollar,
  HiOutlineDocumentText, HiOutlineCog6Tooth, HiOutlineUser, HiOutlineMagnifyingGlass,
  HiOutlineCheckCircle, HiOutlineXCircle, HiOutlinePencilSquare, HiOutlineNoSymbol,
  HiOutlineEye, HiOutlineXMark, HiOutlineClock, HiOutlineChevronDown,
  HiOutlineArrowRightOnRectangle, HiOutlineBell, HiOutlineCloudArrowUp,
  HiOutlineShieldCheck, HiOutlineHome, HiOutlineTag,
} from 'react-icons/hi2';
import { HeartPulse } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../App';
import { useNavigate } from 'react-router-dom';

// Data
const indianStates = ['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Delhi','Jammu and Kashmir','Ladakh'];
const citiesByState: Record<string, string[]> = { Maharashtra:['Mumbai','Pune','Nagpur','Nashik'], Delhi:['New Delhi','Central Delhi','South Delhi'], Karnataka:['Bangalore','Mysore','Mangalore'], 'Tamil Nadu':['Chennai','Coimbatore','Madurai'], Telangana:['Hyderabad','Warangal'], 'West Bengal':['Kolkata','Howrah','Siliguri'], Gujarat:['Ahmedabad','Surat','Vadodara'], Rajasthan:['Jaipur','Jodhpur','Udaipur'], Punjab:['Chandigarh','Ludhiana','Amritsar'], Haryana:['Gurgaon','Faridabad'], 'Uttar Pradesh':['Lucknow','Kanpur','Agra','Varanasi'], 'Madhya Pradesh':['Bhopal','Indore'], Kerala:['Thiruvananthapuram','Kochi'], Bihar:['Patna','Gaya'] };
const medicalSpecialties = ['Cardiology','Neurology','Orthopedics','Oncology','Gastroenterology','Pulmonology','Nephrology','Endocrinology','Dermatology','Ophthalmology','ENT','Urology','Gynecology','Pediatrics','Psychiatry','General Surgery','Cardiac Surgery','Neurosurgery','Transplant Surgery','Critical Care'];
const accreditationOptions = ['JCI Accredited','NABH Verified','ISO 9001:2015','NABL Certified','HIPAA Compliant','CGHS Empanelled','Ayushman Bharat'];

const sidebarGroups = [
  { label: 'Overview', items: [
    { id: 'DASHBOARD', label: 'Dashboard', icon: HiOutlineHome },
  ]},
  { label: 'Hospitals', items: [
    { id: 'HOSPITAL_MANAGEMENT', label: 'Management', icon: HiOutlineBuildingOffice2 },
    { id: 'ADD_HOSPITAL', label: 'Add Hospital', icon: HiOutlinePlus },
    { id: 'MANAGE_HOSPITALS', label: 'All Hospitals', icon: HiOutlineBuildingOffice2 },
  ]},
  { label: 'Platform', items: [
    { id: 'PATIENTS', label: 'Patients', icon: HiOutlineUsers },
    { id: 'REVENUE', label: 'Revenue', icon: HiOutlineCurrencyDollar },
    { id: 'REPORTS', label: 'Reports', icon: HiOutlineDocumentText },
    { id: 'SETTINGS', label: 'Settings', icon: HiOutlineCog6Tooth },
  ]},
];

const statusCfg: Record<string, string> = { Active: 'bg-green-50 text-green-700', 'Pending Approval': 'bg-yellow-50 text-yellow-700', Suspended: 'bg-red-50 text-red-700' };

const SuperAdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('DASHBOARD');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [curSpecialty, setCurSpecialty] = useState('');
  const [curAccred, setCurAccred] = useState('');
  const [form, setForm] = useState({ name: '', state: '', city: '', country: 'India', specialties: [] as string[], commissionRate: 8, contactEmail: '', contactPhone: '', address: '', accreditations: [] as string[], description: '', logo: null as File | null, logoPreview: '' });

  const [hospitals, setHospitals] = useState([
    { id: 1, name: 'Apollo Hospitals Mumbai', state: 'Maharashtra', city: 'Mumbai', specialties: ['Cardiology','Oncology'], commissionRate: 8, status: 'Active', patients: 245 },
    { id: 2, name: 'Fortis Memorial Research', state: 'Delhi', city: 'New Delhi', specialties: ['Transplant Surgery','Neurology'], commissionRate: 10, status: 'Active', patients: 189 },
    { id: 3, name: 'Max Healthcare Delhi', state: 'Delhi', city: 'New Delhi', specialties: ['Orthopedics','Gastroenterology'], commissionRate: 7, status: 'Pending Approval', patients: 0 },
    { id: 4, name: 'Medanta Gurgaon', state: 'Haryana', city: 'Gurgaon', specialties: ['Cardiac Surgery'], commissionRate: 9, status: 'Active', patients: 156 },
  ]);

  const summary = { total: hospitals.length, active: hospitals.filter(h => h.status === 'Active').length, patients: hospitals.reduce((s, h) => s + h.patients, 0), revenue: 125400, pending: hospitals.filter(h => h.status === 'Pending Approval').length };
  const adminName = user?.name || 'Super Admin';

  useEffect(() => {
    const outside = (e: MouseEvent) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setProfileOpen(false); };
    const toggle = () => setSidebarOpen(p => !p);
    document.addEventListener('mousedown', outside);
    window.addEventListener('toggleSidebar', toggle);
    return () => { document.removeEventListener('mousedown', outside); window.removeEventListener('toggleSidebar', toggle); };
  }, []);

  const handleAddHospital = (e: React.FormEvent) => {
    e.preventDefault();
    setHospitals([...hospitals, { id: hospitals.length + 1, name: form.name, state: form.state, city: form.city, specialties: form.specialties, commissionRate: form.commissionRate, status: 'Pending Approval', patients: 0 }]);
    setForm({ name: '', state: '', city: '', country: 'India', specialties: [], commissionRate: 8, contactEmail: '', contactPhone: '', address: '', accreditations: [], description: '', logo: null, logoPreview: '' });
    setTab('MANAGE_HOSPITALS');
  };
  const handleLogo = (e: React.ChangeEvent<HTMLInputElement>) => { const f = e.target.files?.[0]; if (f) { const r = new FileReader(); r.onload = ev => setForm(p => ({ ...p, logo: f, logoPreview: ev.target?.result as string })); r.readAsDataURL(f); } };
  const addSpec = () => { if (curSpecialty && !form.specialties.includes(curSpecialty)) { setForm(p => ({ ...p, specialties: [...p.specialties, curSpecialty] })); setCurSpecialty(''); } };
  const addAccred = () => { if (curAccred && !form.accreditations.includes(curAccred)) { setForm(p => ({ ...p, accreditations: [...p.accreditations, curAccred] })); setCurAccred(''); } };
  const inputCls = "w-full px-3 py-2 text-sm border border-gray-200 focus:outline-none focus:border-gray-400";

  return (
    <div className="flex h-screen bg-gray-50/80">
      {/* Sidebar */}
      <motion.aside animate={{ width: sidebarOpen ? 248 : 68 }} transition={{ duration: 0.2, ease: 'easeInOut' }}
        className="bg-slate-900 flex flex-col overflow-hidden shrink-0 border-r border-slate-800">
        <div className="h-14 flex items-center gap-3 px-4 border-b border-slate-800/60">
          <div className="w-8 h-8 rounded-md bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white shrink-0 shadow-sm shadow-emerald-500/20">
            <HeartPulse className="w-4 h-4" />
          </div>
          <AnimatePresence>{sidebarOpen && (
            <motion.div initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -4 }} className="min-w-0">
              <p className="text-white font-semibold text-sm leading-tight truncate">IMAP Solution</p>
              <p className="text-slate-500 text-[10px] leading-tight">Super Admin</p>
            </motion.div>
          )}</AnimatePresence>
        </div>

        <nav className="flex-1 py-3 px-3 overflow-y-auto space-y-5">
          {sidebarGroups.map(g => (
            <div key={g.label}>
              <AnimatePresence>{sidebarOpen && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="text-[10px] font-semibold uppercase tracking-widest text-slate-600 px-3 mb-2">{g.label}</motion.p>
              )}</AnimatePresence>
              <div className="space-y-0.5">
                {g.items.map(item => {
                  const active = tab === item.id;
                  return (
                    <button key={item.id} onClick={() => setTab(item.id)}
                      className={`relative w-full flex items-center gap-3 px-3 py-2 rounded-md text-[13px] transition-all ${active ? 'bg-slate-800 text-white font-medium' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-300'}`}>
                      {active && <motion.div layoutId="saActiveIndicator" className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 bg-emerald-400 rounded-r-full" transition={{ type: 'spring', stiffness: 350, damping: 30 }} />}
                      <item.icon className={`w-[18px] h-[18px] shrink-0 ${active ? 'text-emerald-400' : ''}`} />
                      <AnimatePresence>{sidebarOpen && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="truncate">{item.label}</motion.span>}</AnimatePresence>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-slate-800/60 p-3">
          <div className={`flex items-center ${sidebarOpen ? 'gap-3' : 'justify-center'}`}>
            <div className="w-8 h-8 rounded-md bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center text-[11px] text-slate-200 font-semibold shrink-0">{adminName.charAt(0)}</div>
            <AnimatePresence>{sidebarOpen && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 min-w-0">
                <p className="text-xs font-medium text-slate-200 truncate">{adminName}</p>
                <p className="text-[10px] text-slate-500 truncate">Super Admin</p>
              </motion.div>
            )}</AnimatePresence>
            <AnimatePresence>{sidebarOpen && (
              <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => { logout(); navigate('/login'); }}
                className="p-1.5 rounded-md hover:bg-slate-800 text-slate-500 hover:text-red-400 transition-colors shrink-0" title="Logout">
                <HiOutlineArrowRightOnRectangle className="w-4 h-4" />
              </motion.button>
            )}</AnimatePresence>
          </div>
        </div>
      </motion.aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-14 bg-white border-b border-gray-200/80 flex items-center justify-between px-5 shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(p => !p)} className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
            </button>
            <div className="hidden sm:flex items-center gap-2 bg-gray-50 rounded-md px-3 py-2 w-64 border border-gray-200">
              <HiOutlineMagnifyingGlass className="w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Search…" className="bg-transparent text-sm outline-none w-full text-gray-600 placeholder-gray-400" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500">
              <HiOutlineBell className="w-5 h-5" /><span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="relative" ref={dropdownRef}>
              <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-md hover:bg-gray-50 transition-colors">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-xs font-semibold">{adminName.charAt(0)}</div>
                <div className="hidden md:block text-left"><p className="text-xs font-medium text-gray-800 leading-tight">{adminName}</p><p className="text-[10px] text-gray-400">Super Admin</p></div>
                <HiOutlineChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1.5 z-50">
                  <button onClick={() => { setTab('SETTINGS'); setProfileOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-2"><HiOutlineCog6Tooth className="w-4 h-4" /> Settings</button>
                  <hr className="my-1 border-gray-100" />
                  <button onClick={() => { logout(); navigate('/login'); }} className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 flex items-center gap-2"><HiOutlineArrowRightOnRectangle className="w-4 h-4" /> Logout</button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto">

          {/* Dashboard */}
          {tab === 'DASHBOARD' && (
            <div className="p-6 max-w-[1400px] mx-auto space-y-5">
              <div><h1 className="text-lg font-bold text-gray-900">Dashboard</h1><p className="text-xs text-gray-500">Platform overview</p></div>
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                {([
                  { l: 'Total Hospitals', v: summary.total, icon: HiOutlineBuildingOffice2, a: 'bg-blue-500' },
                  { l: 'Active', v: summary.active, icon: HiOutlineCheckCircle, a: 'bg-emerald-500' },
                  { l: 'Patients', v: summary.patients, icon: HiOutlineUsers, a: 'bg-violet-500' },
                  { l: 'Revenue', v: `$${summary.revenue.toLocaleString()}`, icon: HiOutlineCurrencyDollar, a: 'bg-amber-500' },
                  { l: 'Pending', v: summary.pending, icon: HiOutlineClock, a: 'bg-red-500' },
                ] as const).map(s => (
                  <div key={s.l} className="bg-white rounded-lg px-4 py-3.5 border border-gray-200 flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-md flex items-center justify-center shrink-0 ${s.a}`}><s.icon className="w-[18px] h-[18px] text-white" /></div>
                    <div><p className="text-[11px] text-gray-500 leading-none">{s.l}</p><p className="text-lg font-bold text-gray-900 leading-tight mt-0.5">{s.v}</p></div>
                  </div>
                ))}
              </div>

              {/* Recent Hospitals */}
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="px-5 py-3.5 border-b border-gray-200"><h3 className="text-sm font-semibold text-gray-900">Recent Hospitals</h3></div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead><tr className="border-b border-gray-100 bg-gray-50/60">
                      {['Hospital', 'Location', 'Specialties', 'Status', 'Patients'].map(h => <th key={h} className="px-5 py-2.5 text-left text-[11px] font-medium text-gray-500 uppercase tracking-wider">{h}</th>)}
                    </tr></thead>
                    <tbody className="divide-y divide-gray-100">
                      {hospitals.slice(0, 4).map(h => (
                        <tr key={h.id} className="hover:bg-gray-50/60 transition-colors">
                          <td className="px-5 py-3 text-sm font-medium text-gray-900">{h.name}</td>
                          <td className="px-5 py-3 text-xs text-gray-600">{h.city}, {h.state}</td>
                          <td className="px-5 py-3"><div className="flex flex-wrap gap-1">{h.specialties.slice(0, 2).map((s, i) => <span key={i} className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] rounded-md font-medium">{s}</span>)}{h.specialties.length > 2 && <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] rounded-md">+{h.specialties.length - 2}</span>}</div></td>
                          <td className="px-5 py-3"><span className={`text-[10px] font-medium px-2 py-0.5 rounded-md ${statusCfg[h.status] || 'bg-gray-100 text-gray-600'}`}>{h.status}</span></td>
                          <td className="px-5 py-3 text-xs text-gray-700">{h.patients}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Hospital Management */}
          {tab === 'HOSPITAL_MANAGEMENT' && (
            <div className="p-6 max-w-[1400px] mx-auto space-y-5">
              <div><h1 className="text-lg font-bold text-gray-900">Hospital Management</h1><p className="text-xs text-gray-500">Overview of medical staff and operations</p></div>
              <div className="grid grid-cols-3 gap-4">
                {([{ l: 'Total Doctors', v: '42', a: 'bg-emerald-500' }, { l: 'Requests', v: '12', a: 'bg-yellow-500' }, { l: 'Confirmed', v: '128', a: 'bg-blue-500' }] as const).map(s => (
                  <div key={s.l} className="bg-white rounded-lg px-4 py-3.5 border border-gray-200 flex items-center gap-3">
                    <div className={`w-2 h-8 rounded-full ${s.a}`}></div>
                    <div><p className="text-[11px] text-gray-500">{s.l}</p><p className="text-lg font-bold text-gray-900 leading-tight">{s.v}</p></div>
                  </div>
                ))}
              </div>
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="px-5 py-3.5 border-b border-gray-200 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-900">Medical Staff</h3>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white text-xs font-medium rounded-md hover:bg-emerald-700"><HiOutlinePlus className="w-3.5 h-3.5" /> Add Doctor</button>
                </div>
                <div className="text-center py-12"><HiOutlineBuildingOffice2 className="w-10 h-10 text-gray-300 mx-auto mb-2" /><p className="text-sm text-gray-400">No hospitals found</p></div>
              </div>
            </div>
          )}

          {/* Add Hospital */}
          {tab === 'ADD_HOSPITAL' && (
            <div className="p-6 max-w-[1400px] mx-auto space-y-5">
              <div><h1 className="text-lg font-bold text-gray-900">Add Hospital</h1><p className="text-xs text-gray-500">Register a new hospital to the network</p></div>
              <form onSubmit={handleAddHospital} className="bg-white border border-gray-200 divide-y divide-gray-100">
                {/* Logo */}
                <div className="p-5">
                  <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wide mb-2">Logo</label>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 border border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50">
                      {form.logoPreview ? <img src={form.logoPreview} alt="" className="w-full h-full object-cover" /> : <HiOutlineCloudArrowUp className="w-5 h-5 text-gray-400" />}
                    </div>
                    <div><input type="file" accept="image/*" onChange={handleLogo} className="hidden" id="logo-upload" />
                      <label htmlFor="logo-upload" className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium hover:bg-gray-200 cursor-pointer transition-colors">Choose File</label>
                      <p className="text-[10px] text-gray-400 mt-1">PNG, JPG up to 2MB</p>
                    </div>
                  </div>
                </div>

                {/* Basic Info */}
                <div className="p-5 space-y-4">
                  <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">Basic Information</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wide mb-1">Hospital Name</label><input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className={inputCls} placeholder="e.g. Apollo Hospitals" /></div>
                    <div><label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wide mb-1">Country</label><select value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} className={inputCls}><option>India</option><option>Thailand</option><option>Singapore</option></select></div>
                    <div><label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wide mb-1">State</label><select required value={form.state} onChange={e => setForm({ ...form, state: e.target.value, city: '' })} className={inputCls}><option value="">Select</option>{indianStates.map(s => <option key={s}>{s}</option>)}</select></div>
                    <div><label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wide mb-1">City</label><select required value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} className={inputCls} disabled={!form.state}><option value="">Select</option>{form.state && citiesByState[form.state]?.map(c => <option key={c}>{c}</option>)}</select></div>
                  </div>
                  <div><label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wide mb-1">Commission Rate (%)</label><input type="number" min={1} max={20} value={form.commissionRate} onChange={e => setForm({ ...form, commissionRate: +e.target.value })} className={inputCls + ' w-24'} /></div>
                </div>

                {/* Specialties */}
                <div className="p-5 space-y-3">
                  <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">Specialties</p>
                  <div className="flex gap-2">
                    <select value={curSpecialty} onChange={e => setCurSpecialty(e.target.value)} className={inputCls + ' flex-1'}><option value="">Select specialty</option>{medicalSpecialties.map(s => <option key={s}>{s}</option>)}</select>
                    <button type="button" onClick={addSpec} className="px-3 py-2 bg-gray-900 text-white text-xs font-medium hover:bg-gray-800">Add</button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">{form.specialties.map(s => (
                    <span key={s} className="px-2 py-1 bg-emerald-50 text-emerald-700 text-[11px] font-medium flex items-center gap-1"><HiOutlineTag className="w-3 h-3" />{s}<button type="button" onClick={() => setForm(p => ({ ...p, specialties: p.specialties.filter(x => x !== s) }))}><HiOutlineXMark className="w-3 h-3" /></button></span>
                  ))}</div>
                </div>

                {/* Contact */}
                <div className="p-5 space-y-4">
                  <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">Contact & Details</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wide mb-1">Email</label><input type="email" value={form.contactEmail} onChange={e => setForm({ ...form, contactEmail: e.target.value })} className={inputCls} placeholder="admin@hospital.com" /></div>
                    <div><label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wide mb-1">Phone</label><input type="tel" value={form.contactPhone} onChange={e => setForm({ ...form, contactPhone: e.target.value })} className={inputCls} placeholder="+91 98765 43210" /></div>
                  </div>
                  <div><label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wide mb-1">Address</label><textarea value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} rows={2} className={inputCls + ' resize-none'} placeholder="Full address" /></div>
                  <div><label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wide mb-1">Description</label><textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className={inputCls + ' resize-none'} placeholder="Brief description" /></div>
                </div>

                {/* Accreditations */}
                <div className="p-5 space-y-3">
                  <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">Accreditations</p>
                  <div className="flex gap-2">
                    <select value={curAccred} onChange={e => setCurAccred(e.target.value)} className={inputCls + ' flex-1'}><option value="">Select</option>{accreditationOptions.map(a => <option key={a}>{a}</option>)}</select>
                    <button type="button" onClick={addAccred} className="px-3 py-2 bg-gray-900 text-white text-xs font-medium hover:bg-gray-800">Add</button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">{form.accreditations.map(a => (
                    <span key={a} className="px-2 py-1 bg-blue-50 text-blue-700 text-[11px] font-medium flex items-center gap-1"><HiOutlineShieldCheck className="w-3 h-3" />{a}<button type="button" onClick={() => setForm(p => ({ ...p, accreditations: p.accreditations.filter(x => x !== a) }))}><HiOutlineXMark className="w-3 h-3" /></button></span>
                  ))}</div>
                </div>

                {/* Actions */}
                <div className="p-5 flex gap-2">
                  <button type="submit" className="px-4 py-2 bg-gray-900 text-white text-sm font-medium hover:bg-gray-800">Add Hospital</button>
                  <button type="button" onClick={() => setForm({ name: '', state: '', city: '', country: 'India', specialties: [], commissionRate: 8, contactEmail: '', contactPhone: '', address: '', accreditations: [], description: '', logo: null, logoPreview: '' })}
                    className="px-4 py-2 border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50">Clear</button>
                </div>
              </form>
            </div>
          )}

          {/* Manage Hospitals */}
          {tab === 'MANAGE_HOSPITALS' && (
            <div className="p-6 max-w-[1400px] mx-auto space-y-5">
              <div className="flex items-center justify-between">
                <div><h1 className="text-lg font-bold text-gray-900">All Hospitals</h1><p className="text-xs text-gray-500">Network management</p></div>
                <button onClick={() => setTab('ADD_HOSPITAL')} className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 text-white text-xs font-medium rounded-md hover:bg-emerald-700"><HiOutlinePlus className="w-3.5 h-3.5" /> Add Hospital</button>
              </div>
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead><tr className="border-b border-gray-100 bg-gray-50/60">
                      {['Hospital', 'Location', 'Specialties', 'Commission', 'Status', 'Patients', ''].map(h => <th key={h} className="px-5 py-2.5 text-left text-[11px] font-medium text-gray-500 uppercase tracking-wider">{h}</th>)}
                    </tr></thead>
                    <tbody className="divide-y divide-gray-100">
                      {hospitals.map(h => (
                        <tr key={h.id} className="hover:bg-gray-50/60 transition-colors">
                          <td className="px-5 py-3 text-sm font-medium text-gray-900">{h.name}</td>
                          <td className="px-5 py-3 text-xs text-gray-600">{h.city}, {h.state}</td>
                          <td className="px-5 py-3"><div className="flex flex-wrap gap-1">{h.specialties.slice(0, 2).map((s, i) => <span key={i} className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] rounded-md font-medium">{s}</span>)}{h.specialties.length > 2 && <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] rounded-md">+{h.specialties.length - 2}</span>}</div></td>
                          <td className="px-5 py-3 text-xs text-gray-700">{h.commissionRate}%</td>
                          <td className="px-5 py-3"><span className={`text-[10px] font-medium px-2 py-0.5 rounded-md ${statusCfg[h.status] || 'bg-gray-100 text-gray-600'}`}>{h.status}</span></td>
                          <td className="px-5 py-3 text-xs text-gray-700">{h.patients}</td>
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-1">
                              <button className="p-1 text-gray-400 hover:text-emerald-600"><HiOutlinePencilSquare className="w-3.5 h-3.5" /></button>
                              <button className="p-1 text-gray-400 hover:text-blue-600"><HiOutlineEye className="w-3.5 h-3.5" /></button>
                              <button className="p-1 text-gray-400 hover:text-red-500"><HiOutlineNoSymbol className="w-3.5 h-3.5" /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Settings */}
          {tab === 'SETTINGS' && (
            <div className="p-6 max-w-[1400px] mx-auto space-y-5">
              <div><h1 className="text-lg font-bold text-gray-900">Platform Settings</h1><p className="text-xs text-gray-500">Configure IMAP Solution</p></div>
              <div className="bg-white border border-gray-200 p-5 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wide mb-1">Platform Name</label><input className={inputCls} defaultValue="IMAP Solution" /></div>
                  <div><label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wide mb-1">Default Commission (%)</label><input type="number" className={inputCls} defaultValue="8" /></div>
                </div>
                <div><label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wide mb-1">Support Email</label><input type="email" className={inputCls} defaultValue="support@imapsolution.com" /></div>
                <button className="px-4 py-2 bg-gray-900 text-white text-sm font-medium hover:bg-gray-800">Save Settings</button>
              </div>
            </div>
          )}

          {/* Placeholder tabs */}
          {['PATIENTS', 'REVENUE', 'REPORTS'].includes(tab) && (
            <div className="p-6 max-w-[1400px] mx-auto">
              <div><h1 className="text-lg font-bold text-gray-900">{tab === 'PATIENTS' ? 'Patient Overview' : tab === 'REVENUE' ? 'Revenue & Commissions' : 'System Reports'}</h1><p className="text-xs text-gray-500">Coming soon</p></div>
              <div className="mt-8 text-center py-16 bg-white border border-gray-200 rounded-lg">
                <HiOutlineDocumentText className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-400">This section is under development</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
