import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLang } from '../App';
import { TRANSLATIONS, APP_ICONS } from '../constants';
import { hospitalsAPI } from '../services/api';
import {
  ArrowRight, CheckCircle2, MapPin, Stethoscope,
  ShieldCheck, Star, Users, Building2, Globe2,
  HeartPulse, Plane, Clock, ChevronRight,
} from 'lucide-react';

/* ─── stat data ─── */
const STATS = [
  { value: '50+',  label: 'Verified Hospitals',  icon: <Building2 className="w-5 h-5" /> },
  { value: '10K+', label: 'Patients Helped',      icon: <Users className="w-5 h-5" /> },
  { value: '30+',  label: 'Countries Served',     icon: <Globe2 className="w-5 h-5" /> },
  { value: '4.9',  label: 'Average Rating',       icon: <Star className="w-5 h-5" /> },
];

/* ─── how it works steps ─── */
const HOW_STEPS = [
  { num: '01', icon: <HeartPulse className="w-6 h-6" />, color: 'bg-rose-50 text-rose-600', title: 'Upload Reports', desc: 'Securely share your medical history with verified doctors.' },
  { num: '02', icon: <Stethoscope className="w-6 h-6" />, color: 'bg-blue-50 text-blue-600', title: 'Book Consultation', desc: 'Get direct responses from specialist doctors within hours.' },
  { num: '03', icon: <Plane className="w-6 h-6" />, color: 'bg-amber-50 text-amber-600', title: 'Plan Your Trip', desc: 'Visa, travel, and accommodation assistance provided.' },
  { num: '04', icon: <ShieldCheck className="w-6 h-6" />, color: 'bg-emerald-50 text-emerald-600', title: 'Safe Treatment', desc: 'A fully guided, stress-free medical journey.' },
];

/* ─── trust badges ─── */
const TRUST_BADGES = [
  { label: 'JCI Accredited',      icon: <ShieldCheck className="w-4 h-4" /> },
  { label: 'Zero Hidden Fees',    icon: <CheckCircle2 className="w-4 h-4" /> },
  { label: 'Direct Hospital Line', icon: <CheckCircle2 className="w-4 h-4" /> },
  { label: 'HIPAA Compliant',     icon: <CheckCircle2 className="w-4 h-4" /> },
];

/* ─── specialties quick-links ─── */
const SPECIALTIES = [
  { label: 'Cardiology',    icon: '🫀', path: '/specialties/cardiology' },
  { label: 'Orthopedics',   icon: '🦴', path: '/specialties/orthopedics' },
  { label: 'Neurology',     icon: '🧠', path: '/specialties/neurology' },
  { label: 'Oncology',      icon: '🔬', path: '/specialties/oncology' },
  { label: 'Fertility',     icon: '🌸', path: '/specialties/fertility' },
  { label: 'Eye Surgery',   icon: '👁️',  path: '/specialties/eye-surgery' },
  { label: 'Dental',        icon: '🦷', path: '/specialties/dental' },
  { label: 'Urology',       icon: '⚕️',  path: '/specialties/urology' },
];

/* ─── testimonials ─── */
const TESTIMONIALS = [
  {
    quote: 'IMAP Solution connected me directly to Apollo Hospital. I got my visa and treatment without any stress. The team guided me every step of the way.',
    name: 'Obinna K.',
    location: 'Lagos, Nigeria',
    avatar: 'https://picsum.photos/seed/pat1/48/48',
    rating: 5,
  },
  {
    quote: 'The Portuguese support made everything crystal clear. Direct communication with the doctor was a game changer for my family.',
    name: 'Maria S.',
    location: 'Maputo, Mozambique',
    avatar: 'https://picsum.photos/seed/pat2/48/48',
    rating: 5,
  },
  {
    quote: 'From visa documents to post-op care, every detail was handled. I felt safe and cared for throughout my entire journey.',
    name: 'Amara D.',
    location: 'Nairobi, Kenya',
    avatar: 'https://picsum.photos/seed/pat3/48/48',
    rating: 5,
  },
];

const Home: React.FC = () => {
  const { lang } = useLang();
  const t = TRANSLATIONS[lang];
  const navigate = useNavigate();
  const [searchMode, setSearchMode] = useState<'destination' | 'procedure'>('destination');
  const [destination, setDestination] = useState('');
  const [procedure, setProcedure]     = useState('');
  const [indianCities, setIndianCities]         = useState<string[]>([]);
  const [medicalProcedures, setMedicalProcedures] = useState<string[]>([]);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    hospitalsAPI.getHospitals({ limit: 1000 }).then((res: any) => {
      const hospitals = res?.data?.hospitals || [];
      const cities    = [...new Set<string>(hospitals.map((h: any) => h.city).filter(Boolean))];
      const specs     = [...new Set<string>(hospitals.flatMap((h: any) => h.specialties || []).filter(Boolean))];
      setIndianCities(cities);
      setMedicalProcedures(specs);
    }).catch(() => {});
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchMode === 'destination' && destination) navigate(`/hospitals?destination=${destination}`);
    else if (searchMode === 'procedure' && procedure) navigate(`/hospitals?procedure=${procedure}`);
  };

  const selectCls = `w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-700
    focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all
    appearance-none cursor-pointer`;

  return (
    <div className="animate-in">

      {/* ═══════════════════════════════════════
          HERO
      ═══════════════════════════════════════ */}
      <section className="relative bg-white overflow-hidden">
        {/* subtle bg gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/60 via-white to-blue-50/40 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-0 lg:pt-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-end">

            {/* Left — copy + search */}
            <div className="space-y-8 pb-12 lg:pb-16">
              {/* pill badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full text-xs font-semibold text-emerald-700">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Trusted by 10,000+ patients across 30+ countries
              </div>

              {/* headline */}
              <div className="space-y-3">
                <h1 className="text-4xl sm:text-5xl xl:text-6xl font-bold leading-[1.1] tracking-tight text-slate-900">
                  World-Class Medical<br />
                  <span className="gradient-text">Care in India,</span><br />
                  Made Simple.
                </h1>
                <p className="text-lg text-slate-500 max-w-md leading-relaxed">
                  Connect directly with top-accredited Indian hospitals. No agents, no hidden fees — just transparent, guided care.
                </p>
              </div>

              {/* search widget */}
              <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-5 space-y-4">
                {/* mode toggle */}
                <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
                  {(['destination', 'procedure'] as const).map(mode => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setSearchMode(mode)}
                      className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all duration-150
                        ${searchMode === mode
                          ? 'bg-white text-slate-900 shadow-sm'
                          : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      {mode === 'destination' ? (
                        <span className="flex items-center justify-center gap-1.5"><MapPin className="w-3.5 h-3.5" />By City</span>
                      ) : (
                        <span className="flex items-center justify-center gap-1.5"><Stethoscope className="w-3.5 h-3.5" />By Procedure</span>
                      )}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleSearch} className="flex gap-2">
                  <div className="flex-1">
                    {searchMode === 'destination' ? (
                      <select value={destination} onChange={e => setDestination(e.target.value)} className={selectCls}>
                        <option value="">Select a city in India…</option>
                        {indianCities.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    ) : (
                      <select value={procedure} onChange={e => setProcedure(e.target.value)} className={selectCls}>
                        <option value="">Select a procedure…</option>
                        {medicalProcedures.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl
                               transition-colors shadow-sm hover:shadow-md flex items-center gap-2 whitespace-nowrap text-sm"
                  >
                    Find Hospitals <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                {/* quick trust note */}
                <p className="text-xs text-slate-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  All hospitals are JCI/NABH accredited and verified by our team
                </p>
              </div>

              {/* CTA pair */}
              <div className="flex flex-wrap gap-3">
                <Link to="/register" className="btn-primary">
                  Get Started Free <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/about" className="btn-secondary">
                  How It Works
                </Link>
              </div>
            </div>

            {/* Right — doctor image */}
            <div className="relative hidden lg:flex justify-end items-end h-[560px]">
              {/* floating stats card */}
              <div className="absolute left-0 top-10 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 z-10 space-y-3 w-52">
                {STATS.slice(0, 2).map(s => (
                  <div key={s.label} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                      {s.icon}
                    </div>
                    <div>
                      <p className="text-lg font-bold text-slate-900 leading-none">{s.value}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{s.label}</p>
                    </div>
                  </div>
                ))}
              </div>
              {/* floating response badge */}
              <div className="absolute right-4 top-16 bg-white rounded-xl shadow-lg border border-slate-100 px-4 py-2.5 z-10 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-xs font-semibold text-slate-700">Response in &lt; 2 hrs</p>
              </div>
              <img
                src="doctor.png"
                alt="Medical Professional"
                className="relative z-0 h-full w-auto object-contain object-bottom drop-shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          STATS BAR
      ═══════════════════════════════════════ */}
      <section className="bg-slate-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 divide-y md:divide-y-0 md:divide-x divide-slate-700">
            {STATS.map(s => (
              <div key={s.label} className="flex items-center gap-3 py-4 md:py-0 md:px-6 first:pt-0 last:pb-0 md:first:pl-0">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0">
                  {s.icon}
                </div>
                <div>
                  <p className="text-2xl font-bold text-white leading-none">{s.value}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          SPECIALTIES GRID
      ═══════════════════════════════════════ */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="section-divider" />
              <h2 className="text-3xl font-bold text-slate-900">Treatments We Cover</h2>
              <p className="text-slate-500 mt-2 text-sm">Expert care across 20+ medical specialties</p>
            </div>
            <Link to="/specialties" className="hidden sm:flex items-center gap-1 text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {SPECIALTIES.map(s => (
              <Link
                key={s.label}
                to={s.path}
                className="group flex items-center gap-3 p-4 bg-slate-50 hover:bg-emerald-50 border border-slate-100
                           hover:border-emerald-200 rounded-xl transition-all duration-150 hover:shadow-sm"
              >
                <span className="text-2xl leading-none">{s.icon}</span>
                <span className="text-sm font-semibold text-slate-700 group-hover:text-emerald-700 transition-colors">
                  {s.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          HOW IT WORKS
      ═══════════════════════════════════════ */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <div className="section-divider mx-auto" />
            <h2 className="text-3xl font-bold text-slate-900">How It Works</h2>
            <p className="text-slate-500 mt-2 text-sm max-w-md mx-auto">Four simple steps to get world-class treatment in India</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(t.steps || HOW_STEPS).map((step: any, i: number) => {
              const s = HOW_STEPS[i];
              return (
                <div key={i} className="relative bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                  {/* connector line */}
                  {i < 3 && (
                    <div className="hidden lg:block absolute top-8 -right-3 w-6 h-0.5 bg-slate-200 z-10" />
                  )}
                  <div className={`w-12 h-12 rounded-2xl ${s.color} flex items-center justify-center mb-4`}>
                    {s.icon}
                  </div>
                  <span className="text-xs font-black text-slate-300 tracking-widest">{s.num}</span>
                  <h3 className="text-base font-bold text-slate-900 mt-1 mb-2">{step.title || s.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{step.desc || s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          QUICK LINKS — 3 cards
      ═══════════════════════════════════════ */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: APP_ICONS.Hospital,
                color: 'bg-blue-50 text-blue-600',
                title: 'Find a Hospital',
                desc: 'Search and compare India\'s top JCI-accredited facilities by city or specialty.',
                cta: 'Browse Hospitals',
                path: '/hospitals',
              },
              {
                icon: APP_ICONS.Visa,
                color: 'bg-amber-50 text-amber-600',
                title: 'Visa Assistance',
                desc: 'Step-by-step guidance for your Indian medical visa application.',
                cta: 'Learn More',
                path: '/visa',
              },
              {
                icon: APP_ICONS.Hotel,
                color: 'bg-emerald-50 text-emerald-600',
                title: 'Travel & Stay',
                desc: 'Accommodation, airport transfers, and language translation services.',
                cta: 'View Services',
                path: '/services',
              },
            ].map(card => (
              <div key={card.title} className="group bg-white border border-slate-100 rounded-2xl p-6 hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5">
                <div className={`w-12 h-12 rounded-2xl ${card.color} flex items-center justify-center mb-4`}>
                  {card.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{card.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-4">{card.desc}</p>
                <Link
                  to={card.path}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
                >
                  {card.cta} <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          TRUST BADGES
      ═══════════════════════════════════════ */}
      <section className="py-6 bg-emerald-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-wrap justify-center gap-6 md:gap-10">
            {TRUST_BADGES.map(b => (
              <div key={b.label} className="flex items-center gap-2 text-white/90">
                <div className="text-emerald-200">{b.icon}</div>
                <span className="text-sm font-semibold">{b.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          TESTIMONIALS
      ═══════════════════════════════════════ */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <div className="section-divider mx-auto" />
            <h2 className="text-3xl font-bold text-slate-900">Patient Stories</h2>
            <p className="text-slate-500 mt-2 text-sm">Real experiences from people like you</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-4"
              >
                {/* stars */}
                <div className="flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                {/* quote */}
                <p className="text-slate-600 text-sm leading-relaxed flex-1">"{t.quote}"</p>
                {/* attribution */}
                <div className="flex items-center gap-3 pt-3 border-t border-slate-50">
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100" />
                  <div>
                    <p className="text-sm font-bold text-slate-900">{t.name}</p>
                    <p className="text-xs text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />{t.location}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* dots */}
          <div className="flex justify-center gap-2 mt-6">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveTestimonial(i)}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${i === activeTestimonial ? 'bg-emerald-600 w-5' : 'bg-slate-300'}`}
                aria-label={`Testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          CTA BANNER
      ═══════════════════════════════════════ */}
      <section className="py-16 bg-slate-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-xs font-semibold text-emerald-400">
            <Clock className="w-3.5 h-3.5" /> Average response under 2 hours
          </div>
          <h2 className="text-4xl font-bold text-white leading-tight">
            Ready to start your<br />
            <span className="text-emerald-400">healing journey?</span>
          </h2>
          <p className="text-slate-400 leading-relaxed">
            Join thousands of patients who found trusted, affordable care in India — without middlemen, without stress.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/register" className="btn-primary text-base px-6 py-3">
              Create Free Account <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/hospitals" className="px-6 py-3 rounded-xl border border-slate-600 text-slate-300 hover:border-slate-400 hover:text-white font-semibold text-sm transition-colors">
              Browse Hospitals
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
