import React, { useState } from 'react';
import {
  HiOutlineQuestionMarkCircle, HiOutlineMagnifyingGlass, HiOutlineBookOpen,
  HiOutlineChatBubbleLeftRight, HiOutlinePhone, HiOutlineEnvelope,
  HiOutlineDocumentText, HiOutlineVideoCamera, HiOutlineUsers, HiOutlineCog6Tooth,
} from 'react-icons/hi2';

const HelpCenter: React.FC = () => {
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('all');

  const categories = [
    { id: 'all', name: 'All Topics', icon: HiOutlineBookOpen },
    { id: 'appointments', name: 'Appointments', icon: HiOutlineDocumentText },
    { id: 'patients', name: 'Patient Mgmt', icon: HiOutlineUsers },
    { id: 'payments', name: 'Payments', icon: HiOutlineDocumentText },
    { id: 'settings', name: 'Settings', icon: HiOutlineCog6Tooth },
    { id: 'technical', name: 'Technical', icon: HiOutlineQuestionMarkCircle },
  ];

  const faqs = [
    { id: 1, category: 'appointments', q: 'How do I confirm a patient appointment?', a: 'Go to Appointments, find the pending one, and click "Confirm". The patient is notified automatically.' },
    { id: 2, category: 'appointments', q: 'Can I reschedule appointments?', a: 'Yes — click the appointment, select a new date/time, and notify the patient.' },
    { id: 3, category: 'patients', q: 'How do I view patient medical history?', a: 'Click any patient name in the Patients section to see their full history.' },
    { id: 4, category: 'payments', q: 'How are payments processed?', a: 'Payments go through our secure gateway automatically. View transactions in Payments.' },
    { id: 5, category: 'settings', q: 'How do I update hospital information?', a: 'Go to Settings → Hospital Profile to update details and specialties.' },
    { id: 6, category: 'technical', q: 'What browsers are supported?', a: 'Chrome, Firefox, Safari, and Edge — latest versions recommended.' },
  ];

  const contacts = [
    { type: 'Phone', value: '+91 1800-123-4567', desc: '24/7 Hotline', icon: HiOutlinePhone },
    { type: 'Email', value: 'support@imapsolution.com', desc: 'Technical Support', icon: HiOutlineEnvelope },
    { type: 'Chat', value: 'Live Chat', desc: '9 AM – 6 PM IST', icon: HiOutlineChatBubbleLeftRight },
  ];

  const filtered = faqs.filter(f => (cat === 'all' || f.category === cat) && (search === '' || f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase())));

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

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { title: 'Contact Support', desc: 'Get help from our team', icon: HiOutlineChatBubbleLeftRight },
          { title: 'Video Tutorials', desc: 'Step-by-step guides', icon: HiOutlineVideoCamera },
          { title: 'User Manual', desc: 'Full documentation', icon: HiOutlineBookOpen },
          { title: 'System Status', desc: 'Platform status', icon: HiOutlineCog6Tooth },
        ].map(a => (
          <button key={a.title} className="p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300 text-left transition-colors">
            <div className="flex items-center gap-2.5 mb-1.5">
              <div className="w-8 h-8 bg-emerald-50 rounded-md flex items-center justify-center"><a.icon className="w-4 h-4 text-emerald-600" /></div>
              <h3 className="text-xs font-semibold text-gray-900">{a.title}</h3>
            </div>
            <p className="text-[11px] text-gray-500">{a.desc}</p>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <h3 className="text-xs font-semibold text-gray-900 mb-3">Categories</h3>
            <div className="space-y-0.5">
              {categories.map(c => (
                <button key={c.id} onClick={() => setCat(c.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-left text-xs transition-colors ${cat === c.id ? 'bg-emerald-50 text-emerald-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}>
                  <c.icon className="w-3.5 h-3.5" />{c.name}
                </button>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <h3 className="text-xs font-semibold text-gray-900 mb-3">Contact</h3>
            <div className="space-y-3">
              {contacts.map(c => (
                <div key={c.type} className="flex items-start gap-2.5">
                  <div className="w-7 h-7 bg-gray-50 rounded-md flex items-center justify-center shrink-0"><c.icon className="w-3.5 h-3.5 text-gray-500" /></div>
                  <div><p className="text-xs font-medium text-gray-900">{c.value}</p><p className="text-[10px] text-gray-400">{c.desc}</p></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="px-5 py-3.5 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900">FAQ</h3>
            </div>
            <div className="p-5">
              {filtered.length > 0 ? (
                <div className="space-y-4">
                  {filtered.map(f => (
                    <div key={f.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                      <h4 className="text-xs font-medium text-gray-900 mb-1 flex items-start gap-2">
                        <HiOutlineQuestionMarkCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />{f.q}
                      </h4>
                      <p className="text-[11px] text-gray-600 ml-6">{f.a}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <HiOutlineQuestionMarkCircle className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">No articles found</p>
                  <button onClick={() => { setSearch(''); setCat('all'); }} className="mt-1 text-xs text-emerald-600 font-medium">Clear filters</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
