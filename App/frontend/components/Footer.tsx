import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Facebook, Twitter, Instagram, Linkedin,
  Mail, Phone, MapPin, HeartPulse, ArrowRight,
  ExternalLink,
} from 'lucide-react';

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) { setSubscribed(true); setEmail(''); }
  };

  const year = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-400">

      {/* ─── CTA Banner ─── */}
      <div className="bg-emerald-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-white font-bold text-lg">Ready to find your hospital?</p>
            <p className="text-emerald-100 text-sm mt-0.5">Join thousands of patients who found trusted care in India.</p>
          </div>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-emerald-700 font-bold rounded-xl
                       hover:bg-emerald-50 transition-colors text-sm shadow-sm whitespace-nowrap shrink-0"
          >
            Get Started Free <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* ─── Main grid ─── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-14 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand column */}
          <div className="space-y-5 lg:col-span-1">
            <Link to="/" className="inline-flex items-center gap-2.5 group">
              <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center group-hover:bg-emerald-500 transition-colors shadow-sm">
                <HeartPulse className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg text-white tracking-tight">
                IMAP <span className="text-emerald-400">Solution</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400 max-w-xs">
              Empowering African patients with direct, transparent access to world-class medical treatment in India. No middlemen — just care.
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-3">
              {[
                { Icon: Facebook,  href: '#', label: 'Facebook' },
                { Icon: Twitter,   href: '#', label: 'Twitter'  },
                { Icon: Instagram, href: '#', label: 'Instagram'},
                { Icon: Linkedin,  href: '#', label: 'LinkedIn' },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-emerald-600 text-slate-400 hover:text-white
                             flex items-center justify-center transition-all duration-150"
                >
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div className="space-y-4">
            <h3 className="text-white text-xs font-bold uppercase tracking-widest">Explore</h3>
            <ul className="space-y-2.5">
              {[
                { label: 'Find Hospitals',      path: '/hospitals'  },
                { label: 'Specialties',          path: '/specialties'},
                { label: 'Visa Information',     path: '/visa'       },
                { label: 'Travel & Hotels',      path: '/services'   },
                { label: 'About Us',             path: '/about'      },
                { label: 'Contact',              path: '/contact'    },
              ].map(l => (
                <li key={l.path}>
                  <Link
                    to={l.path}
                    className="text-sm text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-1.5 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-slate-600 group-hover:bg-emerald-500 transition-colors" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-white text-xs font-bold uppercase tracking-widest">Contact Us</h3>
            <ul className="space-y-3">
              <li>
                <a href="tel:+919876543210" className="flex items-start gap-2.5 text-sm hover:text-emerald-400 transition-colors group">
                  <div className="w-7 h-7 rounded-lg bg-slate-800 group-hover:bg-emerald-600/20 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors">
                    <Phone className="w-3.5 h-3.5 text-emerald-500" />
                  </div>
                  <span>+91-987-654-3210</span>
                </a>
              </li>
              <li>
                <a href="mailto:care@imapsolution.in" className="flex items-start gap-2.5 text-sm hover:text-emerald-400 transition-colors group">
                  <div className="w-7 h-7 rounded-lg bg-slate-800 group-hover:bg-emerald-600/20 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors">
                    <Mail className="w-3.5 h-3.5 text-emerald-500" />
                  </div>
                  <span>care@imapsolution.in</span>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-2.5 text-sm">
                  <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                  </div>
                  <span>Gurgaon, Haryana, India</span>
                </div>
              </li>
              <li>
                <a
                  href="https://wa.me/919876543210"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors mt-1"
                >
                  Chat on WhatsApp <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-white text-xs font-bold uppercase tracking-widest">Stay Updated</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Monthly insights on medical travel, health tips, and hospital news.
            </p>
            {subscribed ? (
              <div className="flex items-center gap-2 px-4 py-3 bg-emerald-900/40 border border-emerald-700/50 rounded-xl text-sm text-emerald-400 font-medium">
                ✓ You're subscribed — thank you!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-200
                             placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500
                             focus:border-transparent transition-all"
                />
                <button
                  type="submit"
                  className="w-full px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold
                             rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  Subscribe <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
            {/* Accreditation logos placeholder */}
            <div className="flex items-center gap-2 pt-2">
              {['JCI', 'NABH', 'ISO'].map(badge => (
                <span key={badge} className="px-2 py-0.5 border border-slate-700 rounded text-[10px] font-bold text-slate-500 tracking-wide">
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ─── Bottom bar ─── */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-[11px] text-slate-600">
            &copy; {year} IMAP Solution Connect. All Rights Reserved.
          </p>
          <div className="flex items-center gap-4 text-[11px] font-semibold text-slate-600">
            <span className="hover:text-slate-300 cursor-pointer transition-colors">Privacy Policy</span>
            <span className="text-slate-700">·</span>
            <span className="hover:text-slate-300 cursor-pointer transition-colors">Terms of Service</span>
            <span className="text-slate-700">·</span>
            <span className="hover:text-slate-300 cursor-pointer transition-colors">Cookie Settings</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
