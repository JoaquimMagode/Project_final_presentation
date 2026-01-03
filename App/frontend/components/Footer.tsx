
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { APP_ICONS } from '../constants';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-white">
            <div className="bg-emerald-600 p-1.5 rounded-lg">
              {APP_ICONS.Health}
            </div>
            <span className="font-bold text-xl tracking-tight">AfriHealth</span>
          </div>
          <p className="text-sm leading-relaxed text-slate-400">
            Empowering African patients with direct, transparent access to world-class medical treatment in India. No middlemen, just care.
          </p>
          <div className="flex gap-4">
            <Facebook className="w-5 h-5 hover:text-emerald-500 cursor-pointer" />
            <Twitter className="w-5 h-5 hover:text-emerald-500 cursor-pointer" />
            <Instagram className="w-5 h-5 hover:text-emerald-500 cursor-pointer" />
            <Linkedin className="w-5 h-5 hover:text-emerald-500 cursor-pointer" />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-white font-bold uppercase tracking-widest text-xs">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/hospitals" className="hover:text-emerald-500 transition-colors">Find Hospitals</Link></li>
            <li><Link to="/visa" className="hover:text-emerald-500 transition-colors">Visa Information</Link></li>
            <li><Link to="/services" className="hover:text-emerald-500 transition-colors">Travel & Hotels</Link></li>
            <li><Link to="/register" className="hover:text-emerald-500 transition-colors">Register as Patient</Link></li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-white font-bold uppercase tracking-widest text-xs">Support</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-emerald-500" /> +91-987-654-3210</li>
            <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-emerald-500" /> care@afrihealth.in</li>
            <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-emerald-500" /> Gurgaon, Haryana, India</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-white font-bold uppercase tracking-widest text-xs">Newsletter</h3>
          <p className="text-xs text-slate-400 italic">Get monthly updates on medical travel and health tips.</p>
          <div className="flex bg-slate-800 rounded-xl p-1">
            <input type="email" placeholder="Email" className="bg-transparent border-none outline-none text-xs px-3 w-full" />
            <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-xs font-bold">Join</button>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold uppercase tracking-widest">
        <p>&copy; 2023 AfriHealth Connect. All Rights Reserved.</p>
        <div className="flex gap-6">
          <span className="hover:text-white cursor-pointer">Privacy Policy</span>
          <span className="hover:text-white cursor-pointer">Terms of Service</span>
          <span className="hover:text-white cursor-pointer">Cookie Settings</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
