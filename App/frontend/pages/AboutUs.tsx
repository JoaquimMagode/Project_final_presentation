import React from 'react';
import { Heart, Globe, ShieldCheck, Users, Award, TrendingUp } from 'lucide-react';

const stats = [
  { label: 'Hospitals Partnered', value: '50+' },
  { label: 'Patients Served', value: '10,000+' },
  { label: 'Countries Reached', value: '30+' },
  { label: 'Years of Experience', value: '8+' },
];

const values = [
  { icon: <ShieldCheck className="w-6 h-6 text-emerald-600" />, title: 'Transparency', desc: 'No hidden fees or intermediaries. Direct access to verified hospitals.' },
  { icon: <Globe className="w-6 h-6 text-emerald-600" />, title: 'Global Access', desc: 'Connecting international patients to world-class Indian healthcare.' },
  { icon: <Heart className="w-6 h-6 text-emerald-600" />, title: 'Patient First', desc: 'Every decision is made with patient safety and comfort in mind.' },
  { icon: <Users className="w-6 h-6 text-emerald-600" />, title: 'Community', desc: 'Building trust between patients, hospitals, and support teams.' },
  { icon: <Award className="w-6 h-6 text-emerald-600" />, title: 'Accredited Partners', desc: 'Only verified and accredited hospitals are listed on our platform.' },
  { icon: <TrendingUp className="w-6 h-6 text-emerald-600" />, title: 'Continuous Growth', desc: 'Constantly expanding our network and improving our services.' },
];

const team = [
  { name: 'Dr. Arjun Mehta', role: 'Founder & CEO', img: 'https://picsum.photos/seed/team1/80/80' },
  { name: 'Priya Sharma', role: 'Head of Patient Relations', img: 'https://picsum.photos/seed/team2/80/80' },
  { name: 'Rahul Verma', role: 'Chief Technology Officer', img: 'https://picsum.photos/seed/team3/80/80' },
  { name: 'Aisha Khan', role: 'Medical Partnerships Director', img: 'https://picsum.photos/seed/team4/80/80' },
];

const AboutUs: React.FC = () => (
  <div className="max-w-7xl mx-auto px-4 py-12 space-y-16">

    {/* Hero */}
    <div className="text-center space-y-4 max-w-3xl mx-auto">
      <div className="flex items-center justify-center gap-2 text-emerald-600 text-sm font-semibold">
        <Heart className="w-4 h-4" /> Our Story
      </div>
      <h1 className="text-4xl font-bold text-slate-900">About IMAP Solution</h1>
      <p className="text-slate-500 text-lg leading-relaxed">
        IMAP Solution was founded with a single mission — to eliminate the barriers between international patients
        and world-class medical care in India. We connect patients directly with top hospitals, removing
        intermediaries and ensuring transparent, affordable, and timely healthcare.
      </p>
    </div>

    {/* Stats */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {stats.map(s => (
        <div key={s.label} className="bg-emerald-50 rounded-2xl p-6 text-center">
          <p className="text-3xl font-bold text-emerald-600">{s.value}</p>
          <p className="text-sm text-slate-600 mt-1">{s.label}</p>
        </div>
      ))}
    </div>

    {/* Mission */}
    <div className="bg-white border border-slate-200 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row gap-8 items-center">
      <div className="flex-1 space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Our Mission</h2>
        <p className="text-slate-500 leading-relaxed">
          We believe every patient deserves access to the best medical care regardless of where they live.
          India is home to some of the world's finest hospitals and specialists — IMAP Solution makes that
          care accessible, affordable, and stress-free for international patients.
        </p>
        <p className="text-slate-500 leading-relaxed">
          From initial consultation to post-treatment follow-up, we guide patients every step of the way,
          providing support for travel, accommodation, and communication with hospital teams.
        </p>
      </div>
      <div className="flex-shrink-0">
        <img src="https://picsum.photos/seed/mission/320/220" alt="Mission" className="rounded-2xl w-full md:w-80 object-cover" />
      </div>
    </div>

    {/* Values */}
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900 text-center">Our Values</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {values.map(v => (
          <div key={v.title} className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-md hover:border-emerald-400 transition-all">
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center mb-4">{v.icon}</div>
            <h3 className="font-bold text-slate-900 mb-1">{v.title}</h3>
            <p className="text-sm text-slate-500">{v.desc}</p>
          </div>
        ))}
      </div>
    </div>

    {/* Team */}
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900 text-center">Meet the Team</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {team.map(m => (
          <div key={m.name} className="bg-white border border-slate-200 rounded-2xl p-6 text-center hover:shadow-md transition-all">
            <img src={m.img} alt={m.name} className="w-16 h-16 rounded-full mx-auto mb-3 object-cover" />
            <p className="font-bold text-slate-900 text-sm">{m.name}</p>
            <p className="text-xs text-slate-500 mt-1">{m.role}</p>
          </div>
        ))}
      </div>
    </div>

  </div>
);

export default AboutUs;
