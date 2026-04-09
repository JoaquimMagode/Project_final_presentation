import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Plane, Car, HeartHandshake, Languages, FileText, ChevronRight, Mail, X } from 'lucide-react';

interface Extras {
  airportTransfer: boolean;
  localTransport: boolean;
  caretaker: boolean;
  translator: boolean;
  visaCourier: boolean;
}

const EXTRAS_CONFIG = [
  {
    key: 'airportTransfer' as keyof Extras,
    icon: <Plane className="w-5 h-5" />,
    title: 'Airport Transfer',
    description: 'We can arrange pickup from the airport and transport to your hospital or accommodation.',
    label: 'I need airport transfer',
    cost: 35,
  },
  {
    key: 'localTransport' as keyof Extras,
    icon: <Car className="w-5 h-5" />,
    title: 'Local Transportation',
    description: 'Daily transport between your accommodation and hospital.',
    label: 'I need local transport',
    cost: 15,
  },
  {
    key: 'caretaker' as keyof Extras,
    icon: <HeartHandshake className="w-5 h-5" />,
    title: 'Medical Assistant',
    description: 'A trained assistant to help during your recovery period.',
    label: 'I need a caretaker',
    cost: 20,
  },
  {
    key: 'translator' as keyof Extras,
    icon: <Languages className="w-5 h-5" />,
    title: 'Translator',
    description: 'Language assistance during hospital visits.',
    label: 'I need a translator',
    cost: 20,
  },
];

const Toggle: React.FC<{ checked: boolean; onChange: () => void; label: string }> = ({ checked, onChange, label }) => (
  <label className="flex items-center gap-3 cursor-pointer select-none">
    <div
      onClick={onChange}
      className={`relative w-11 h-6 rounded-full transition-colors ${checked ? 'bg-emerald-600' : 'bg-slate-200'}`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`}
      />
    </div>
    <span className="text-sm text-slate-700 font-medium">{label}</span>
  </label>
);

const QuoteExtras: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const prevState = (location.state as any) ?? {};

  const [extras, setExtras] = useState<Extras>({
    airportTransfer: false,
    localTransport: false,
    caretaker: false,
    translator: false,
    visaCourier: false,
  });

  const [showEmailModal, setShowEmailModal] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const toggle = (key: keyof Extras) => setExtras(prev => ({ ...prev, [key]: !prev[key] }));

  const handleReset = () =>
    setExtras({ airportTransfer: false, localTransport: false, caretaker: false, translator: false, visaCourier: false });

  const handleContinue = () => setShowEmailModal(true);

  const handleSendQuote = async () => {
    if (!email || !/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
      setEmailError('Please enter a valid email address.');
      return;
    }
    setEmailError('');

    const selectedExtras = EXTRAS_CONFIG
      .filter(e => extras[e.key])
      .map(e => ({ title: e.title, cost: e.cost }));
    if (extras.visaCourier) selectedExtras.push({ title: 'Visa Support (one-time)', cost: 25 });

    try {
      const res = await fetch('http://localhost:5000/api/email/send-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          city: prevState.city,
          procedure: prevState.procedure,
          extras: selectedExtras,
          totalExtras,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
    } catch (err) {
      setEmailError('Failed to send email. Please try again.');
      return;
    }

    navigate('/quote/summary', { state: { ...prevState, extras, email } });
  };

  const totalExtras = EXTRAS_CONFIG.reduce((sum, e) => sum + (extras[e.key] ? e.cost : 0), 0)
    + (extras.visaCourier ? 25 : 0);

  return (
    <>
    <div className="min-h-screen bg-slate-50 flex items-start justify-center py-10 px-4">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-md p-8 space-y-6">

        {/* Step indicator */}
        <div className="space-y-1">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Step 2 / 4</p>
          <h1 className="text-xl font-bold text-slate-900">Select Extras</h1>
        </div>

        {/* Extras sections */}
        <div className="divide-y divide-slate-100">
          {EXTRAS_CONFIG.map(item => (
            <div key={item.key} className="py-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600">{item.icon}</div>
                <div>
                  <p className="font-bold text-slate-800 text-sm">{item.title}</p>
                  <p className="text-xs text-slate-400">+${item.cost} / day</p>
                </div>
              </div>
              <p className="text-sm text-slate-500">{item.description}</p>
              <Toggle
                checked={extras[item.key]}
                onChange={() => toggle(item.key)}
                label={item.label}
              />
            </div>
          ))}

          {/* Visa & Documentation — checkbox style */}
          <div className="py-5 space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-slate-800 text-sm">Visa Support</p>
                <p className="text-xs text-slate-400">+$25 one-time</p>
              </div>
            </div>
            <p className="text-sm text-slate-500">Help with visa processing and document handling.</p>
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={extras.visaCourier}
                onChange={() => toggle('visaCourier')}
                className="w-4 h-4 accent-emerald-600 rounded"
              />
              <span className="text-sm text-slate-700 font-medium">Visa document courier service</span>
            </label>
          </div>
        </div>

        {/* Cost estimate */}
        {totalExtras > 0 && (
          <div className="flex justify-between items-center bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3">
            <span className="text-sm font-semibold text-emerald-700">Extras estimate</span>
            <span className="text-sm font-black text-emerald-700">+${totalExtras} / day</span>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-col gap-3 pt-2">
          <button
            onClick={handleContinue}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-colors text-sm tracking-wide flex items-center justify-center gap-2"
          >
            CONTINUE <ChevronRight className="w-4 h-4" />
          </button>
          <div className="flex gap-3">
            <button
              onClick={() => navigate(-1)}
              className="flex-1 py-2.5 rounded-xl border-2 border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-colors"
            >
              BACK
            </button>
            <button
              onClick={handleReset}
              className="flex-1 py-2.5 rounded-xl border-2 border-blue-200 text-blue-600 font-semibold text-sm hover:bg-blue-50 transition-colors"
            >
              RESET YOUR QUOTE
            </button>
          </div>
        </div>
      </div>
    </div>

      {/* Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Send Quote to Your Email</h3>
              <button onClick={() => setShowEmailModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-slate-500">Enter your email address and we'll send you a copy of your quote.</p>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Email Address *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setEmailError(''); }}
                  placeholder="you@example.com"
                  className="w-full pl-9 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 text-sm"
                />
              </div>
              {emailError && <p className="text-xs text-red-500 mt-1">{emailError}</p>}
            </div>

            <div className="flex gap-3 pt-1">
              <button
                onClick={() => setShowEmailModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSendQuote}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold flex items-center justify-center gap-2"
              >
                <Mail className="w-4 h-4" /> Send & Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default QuoteExtras;
