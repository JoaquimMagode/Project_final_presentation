import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle, Headphones } from 'lucide-react';

const contactInfo = [
  { icon: <Phone className="w-5 h-5 text-emerald-600" />, label: 'Phone', value: '1-800-IMAP-CARE', sub: 'Mon–Fri, 8am–8pm IST' },
  { icon: <Mail className="w-5 h-5 text-emerald-600" />, label: 'Email', value: 'support@imapsolution.com', sub: 'We reply within 24 hours' },
  { icon: <MapPin className="w-5 h-5 text-emerald-600" />, label: 'Head Office', value: 'Mumbai, Maharashtra, India', sub: 'Serving patients worldwide' },
  { icon: <Clock className="w-5 h-5 text-emerald-600" />, label: 'Support Hours', value: '24/7 Emergency Line', sub: '+91-98765-43210' },
];

const Contact: React.FC = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.name && form.email && form.message) setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-12 h-12 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Message Sent!</h2>
        <p className="text-slate-500">Thank you for reaching out. Our team will get back to you within 24 hours.</p>
        <button
          onClick={() => setSubmitted(false)}
          className="px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">

      {/* Hero */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="flex items-center justify-center gap-2 text-emerald-600 text-sm font-semibold">
          <Headphones className="w-4 h-4" /> Get in Touch
        </div>
        <h1 className="text-4xl font-bold text-slate-900">Contact Us</h1>
        <p className="text-slate-500">
          Have questions about treatment options, hospitals, or your journey to India?
          Our patient support team is here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Contact Info */}
        <div className="space-y-4">
          {contactInfo.map(c => (
            <div key={c.label} className="bg-white border border-slate-200 rounded-2xl p-5 flex items-start gap-4 hover:shadow-md hover:border-emerald-400 transition-all">
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center flex-shrink-0">{c.icon}</div>
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide">{c.label}</p>
                <p className="font-bold text-slate-900 text-sm mt-0.5">{c.value}</p>
                <p className="text-xs text-slate-500 mt-0.5">{c.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Send Us a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name *</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="Your full name"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Email Address *</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Subject</label>
              <select
                name="subject"
                value={form.subject}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
              >
                <option value="">Select a subject</option>
                <option value="appointment">Appointment Inquiry</option>
                <option value="hospital">Hospital Information</option>
                <option value="travel">Travel & Visa Support</option>
                <option value="billing">Billing & Payments</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Message *</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                rows={5}
                placeholder="Tell us how we can help you..."
                className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              Send Message
            </button>
          </form>
        </div>
      </div>

    </div>
  );
};

export default Contact;
