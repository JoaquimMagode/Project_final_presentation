import React, { useState, useEffect, useRef } from 'react';
import { X, MessageCircle, Loader2, CheckCircle2 } from 'lucide-react';

const COUNTRIES = [
  'Afghanistan','Albania','Algeria','Angola','Argentina','Australia','Austria','Bangladesh',
  'Belgium','Bolivia','Brazil','Cambodia','Cameroon','Canada','Chile','China','Colombia',
  'Congo','Cuba','Denmark','Ecuador','Egypt','Ethiopia','Finland','France','Germany','Ghana',
  'Greece','Guatemala','Haiti','Honduras','Hungary','India','Indonesia','Iran','Iraq','Ireland',
  'Israel','Italy','Jamaica','Japan','Jordan','Kenya','Kuwait','Lebanon','Libya','Malaysia',
  'Mexico','Morocco','Mozambique','Myanmar','Nepal','Netherlands','New Zealand','Nicaragua',
  'Nigeria','Norway','Pakistan','Panama','Peru','Philippines','Poland','Portugal','Qatar',
  'Romania','Russia','Saudi Arabia','Senegal','Sierra Leone','Singapore','Somalia','South Africa',
  'South Korea','Spain','Sri Lanka','Sudan','Sweden','Switzerland','Syria','Tanzania','Thailand',
  'Tunisia','Turkey','Uganda','Ukraine','United Arab Emirates','United Kingdom','United States',
  'Uruguay','Venezuela','Vietnam','Yemen','Zambia','Zimbabwe','Other',
];

interface Props {
  onClose: () => void;
  context?: Record<string, any>;
}

const ContactAssistanceModal: React.FC<Props> = ({ onClose, context }) => {
  const [form, setForm] = useState({ name: '', contact: '', country: '', message: '' });
  const [errors, setErrors] = useState<{ name?: string; contact?: string }>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const validate = () => {
    const e: typeof errors = {};
    if (!form.name.trim()) e.name = 'Full name is required.';
    if (!form.contact.trim()) e.contact = 'Email or WhatsApp number is required.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/contact-assistance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, context }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setTimeout(onClose, 3000);
      } else {
        setErrors({ contact: data.message });
      }
    } catch {
      setErrors({ contact: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (err?: string) =>
    `w-full border ${err ? 'border-red-400' : 'border-slate-200'} rounded-xl px-4 py-3 text-sm text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600`;

  return (
    <div
      ref={overlayRef}
      onClick={e => { if (e.target === overlayRef.current) onClose(); }}
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4"
    >
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 relative animate-in fade-in zoom-in-95 duration-200">

        {/* Close */}
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 transition-colors">
          <X className="w-4 h-4 text-slate-500" />
        </button>

        {success ? (
          <div className="flex flex-col items-center gap-4 py-6 text-center">
            <CheckCircle2 className="w-14 h-14 text-emerald-500" />
            <p className="text-lg font-bold text-slate-800">Request Sent!</p>
            <p className="text-sm text-slate-500">Your request has been sent. Our team will contact you shortly.</p>
          </div>
        ) : (
          <>
            <h2 className="text-lg font-bold text-slate-900 mb-1">Need Help Planning Your Treatment?</h2>
            <p className="text-sm text-slate-500 mb-6">
              Our coordinators can assist you with hospitals, accommodation, and travel arrangements.
            </p>

            <div className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">
                  Full Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Your full name"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className={inputClass(errors.name)}
                />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
              </div>

              {/* Email or WhatsApp */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">
                  Email or WhatsApp Number <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="email@example.com or +1234567890"
                  value={form.contact}
                  onChange={e => setForm(f => ({ ...f, contact: e.target.value }))}
                  className={inputClass(errors.contact)}
                />
                {errors.contact && <p className="text-xs text-red-500 mt-1">{errors.contact}</p>}
              </div>

              {/* Country */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Country</label>
                <select
                  value={form.country}
                  onChange={e => setForm(f => ({ ...f, country: e.target.value }))}
                  className={inputClass()}
                >
                  <option value="">Select your country</option>
                  {COUNTRIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Message (optional)</label>
                <textarea
                  rows={3}
                  placeholder="Tell us about your needs..."
                  value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  className={`${inputClass()} resize-none`}
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-3 mt-6">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
              >
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</> : 'Request Assistance'}
              </button>

              <a
                href="https://wa.me/1234567890?text=Hi%20I%20need%20help%20with%20medical%20travel"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-green-500 text-green-600 font-semibold text-sm hover:bg-green-50 transition-colors"
              >
                <MessageCircle className="w-4 h-4" /> Chat on WhatsApp
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ContactAssistanceModal;
