import React, { useState } from 'react';
import {
  HiOutlineQuestionMarkCircle, HiOutlineMagnifyingGlass, HiOutlineBookOpen,
  HiOutlineChatBubbleLeftRight, HiOutlinePhone, HiOutlineEnvelope,
  HiOutlineDocumentText, HiOutlineVideoCamera, HiOutlineUsers,
  HiOutlineChevronRight, HiOutlineCalendarDays, HiOutlineCreditCard,
} from 'react-icons/hi2';

const PatientHelp: React.FC = () => {
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('All');
  const [expanded, setExpanded] = useState<string | null>(null);

  const categories = [
    { id: 'All', name: 'All Topics', icon: HiOutlineQuestionMarkCircle },
    { id: 'appointments', name: 'Appointments', icon: HiOutlineCalendarDays },
    { id: 'reports', name: 'Reports', icon: HiOutlineDocumentText },
    { id: 'account', name: 'Account', icon: HiOutlineUsers },
    { id: 'billing', name: 'Billing', icon: HiOutlineCreditCard },
    { id: 'technical', name: 'Technical', icon: HiOutlineChatBubbleLeftRight },
  ];

  const faqs = [
    { id: '1', q: 'How do I book an appointment?', a: 'Go to Appointments, click "Book New Appointment", select doctor, date, and time.', category: 'appointments', popular: true },
    { id: '2', q: 'How do I upload medical reports?', a: 'Navigate to Medical Reports and click "Upload Report". Drag and drop or select files (PDF, JPG, PNG up to 10MB).', category: 'reports', popular: true },
    { id: '3', q: 'Can I cancel or reschedule?', a: 'Yes, up to 24 hours before. Go to your appointments and click edit.', category: 'appointments', popular: true },
    { id: '4', q: 'How do I update my profile?', a: 'Go to Settings → Account to update personal info and contacts.', category: 'account', popular: false },
    { id: '5', q: 'Forgot my password?', a: 'Click "Forgot Password" on login. We\'ll email reset instructions.', category: 'technical', popular: false },
    { id: '6', q: 'How do I add insurance info?', a: 'Go to profile settings, Insurance tab. Enter provider and policy number.', category: 'billing', popular: false },
  ];

  const filtered = faqs.filter(f => (cat === 'All' || f.category === cat) && (search === '' || f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase())));

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-5">
      <div className="text-center">
        <h1 className="text-lg font-bold text-gray-900">Help & Support</h1>
        <p className="text-xs text-gray-500">Find answers and get support</p>
      </div>

      <div className="max-w-xl mx-auto relative">
        <HiOutlineMagnifyingGlass className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input type="text" placeholder="Search help articles..." value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500" />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {([
          { title: 'Live Chat', desc: 'Instant help', icon: HiOutlineChatBubbleLeftRight, accent: 'bg-blue-50 text-blue-600' },
          { title: 'Call Support', desc: 'Speak directly', icon: HiOutlinePhone, accent: 'bg-green-50 text-green-600' },
          { title: 'Video Guides', desc: 'Step-by-step', icon: HiOutlineVideoCamera, accent: 'bg-violet-50 text-violet-600' },
          { title: 'Email Us', desc: 'Detailed message', icon: HiOutlineEnvelope, accent: 'bg-amber-50 text-amber-600' },
        ]).map(a => (
          <button key={a.title} className="bg-white rounded-lg p-4 border border-gray-200 hover:border-gray-300 text-left transition-colors">
            <div className={`w-8 h-8 rounded-md flex items-center justify-center mb-2 ${a.accent}`}><a.icon className="w-4 h-4" /></div>
            <p className="text-xs font-semibold text-gray-900">{a.title}</p>
            <p className="text-[11px] text-gray-500">{a.desc}</p>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-lg border border-gray-200 p-3">
            <h3 className="text-xs font-semibold text-gray-900 mb-2 px-2">Categories</h3>
            <div className="space-y-0.5">
              {categories.map(c => (
                <button key={c.id} onClick={() => setCat(c.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-left text-xs transition-colors ${cat === c.id ? 'bg-emerald-50 text-emerald-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}>
                  <c.icon className="w-3.5 h-3.5" />{c.name}
                </button>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-xs font-semibold text-gray-900 mb-3">Support Hours</h3>
            <div className="space-y-2 text-[11px]">
              {[['Mon–Fri', '8AM–8PM'], ['Saturday', '9AM–5PM'], ['Sunday', '10AM–4PM']].map(([d, h]) => (
                <div key={d} className="flex justify-between"><span className="text-gray-500">{d}</span><span className="font-medium text-gray-900">{h}</span></div>
              ))}
            </div>
            <div className="mt-3 p-2 bg-green-50 rounded-md flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
              <span className="text-[10px] font-medium text-green-700">Currently Available</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="px-5 py-3.5 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900">FAQ</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <div className="text-center py-10"><HiOutlineQuestionMarkCircle className="w-10 h-10 text-gray-300 mx-auto mb-2" /><p className="text-sm text-gray-400">No articles found</p></div>
              ) : filtered.map(f => (
                <div key={f.id}>
                  <button onClick={() => setExpanded(expanded === f.id ? null : f.id)}
                    className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-medium text-gray-900">{f.q}</p>
                      {f.popular && <span className="text-[9px] bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded-md font-medium">Popular</span>}
                    </div>
                    <HiOutlineChevronRight className={`w-3.5 h-3.5 text-gray-400 transition-transform shrink-0 ${expanded === f.id ? 'rotate-90' : ''}`} />
                  </button>
                  {expanded === f.id && <div className="px-5 pb-4"><p className="text-[11px] text-gray-600 leading-relaxed">{f.a}</p></div>}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 bg-emerald-50 rounded-lg p-5 border border-emerald-200">
            <h3 className="text-xs font-semibold text-gray-900 mb-3">Still need help?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {([
                { label: 'Call Us', value: '1-800-HEALTH-1', icon: HiOutlinePhone, bg: 'bg-blue-50', fg: 'text-blue-600' },
                { label: 'Email Us', value: 'support@healthcare.com', icon: HiOutlineEnvelope, bg: 'bg-green-50', fg: 'text-green-600' },
                { label: 'Live Chat', value: 'Available 24/7', icon: HiOutlineChatBubbleLeftRight, bg: 'bg-violet-50', fg: 'text-violet-600' },
              ]).map(c => (
                <div key={c.label} className="flex items-center gap-2.5">
                  <div className={`w-7 h-7 rounded-md flex items-center justify-center ${c.bg}`}><c.icon className={`w-3.5 h-3.5 ${c.fg}`} /></div>
                  <div><p className="text-xs font-medium text-gray-900">{c.label}</p><p className="text-[10px] text-gray-500">{c.value}</p></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientHelp;
