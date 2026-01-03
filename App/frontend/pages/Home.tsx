
import React from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../App';
import { TRANSLATIONS, APP_ICONS } from '../constants';
import { ArrowRight, CheckCircle2, Globe2 } from 'lucide-react';

const Home: React.FC = () => {
  const { lang } = useLang();
  const t = TRANSLATIONS[lang];

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {/* Hero Section */}
      <section className="text-center py-8 space-y-6">
        <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full border border-emerald-100 text-sm font-semibold">
          <Globe2 className="w-4 h-4" />
          Direct Access to Indian Care
        </div>
        
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-[1.1] tracking-tight">
          {t.heroTitle}
        </h1>
        
        <p className="text-slate-600 text-lg md:text-xl max-w-2xl mx-auto font-medium">
          {t.heroSubtext}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link 
            to="/register" 
            className="px-8 py-4 bg-emerald-600 text-white font-bold rounded-2xl shadow-xl shadow-emerald-200 hover:bg-emerald-700 hover:translate-y-[-2px] transition-all flex items-center justify-center gap-2"
          >
            {t.ctaSubmit} <ArrowRight className="w-5 h-5" />
          </Link>
          <Link 
            to="/hospitals" 
            className="px-8 py-4 bg-white text-slate-900 font-bold rounded-2xl border border-slate-200 hover:border-emerald-300 transition-all flex items-center justify-center gap-2"
          >
            {t.ctaFind}
          </Link>
        </div>
      </section>

      {/* Trust Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Verified Hospitals', icon: APP_ICONS.Verified },
          { label: 'Secure Reports', icon: <CheckCircle2 className="w-5 h-5" /> },
          { label: 'Zero Commissions', icon: <CheckCircle2 className="w-5 h-5" /> },
          { label: 'Direct Payments', icon: <CheckCircle2 className="w-5 h-5" /> },
        ].map((badge, i) => (
          <div key={i} className="flex items-center gap-2 bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
            <div className="text-emerald-500">{badge.icon}</div>
            <span className="text-xs font-bold text-slate-700">{badge.label}</span>
          </div>
        ))}
      </div>

      {/* How It Works */}
      <section className="bg-slate-900 text-white rounded-3xl p-8 md:p-12 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black tracking-tight">How It Works</h2>
          <p className="text-slate-400 font-medium">Simple 4-step process for your medical journey</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {t.steps.map((step: any, i: number) => (
            <div key={i} className="relative group">
              <div className="mb-4 w-12 h-12 bg-emerald-600 text-white flex items-center justify-center rounded-xl font-black text-xl group-hover:scale-110 transition-transform">
                {i + 1}
              </div>
              <h3 className="text-lg font-bold mb-1">{step.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
              {i < 3 && <div className="hidden md:block absolute top-6 left-16 right-0 h-[2px] bg-slate-800" />}
            </div>
          ))}
        </div>
      </section>

      {/* Flag Selector (African Focus) */}
      <section className="space-y-6">
        <h3 className="text-center font-bold text-slate-400 text-sm uppercase tracking-[0.2em]">Serving Patients From</h3>
        <div className="flex flex-wrap justify-center gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-700">
          <span className="text-4xl" title="Nigeria">🇳🇬</span>
          <span className="text-4xl" title="Mozambique">🇲🇿</span>
          <span className="text-4xl" title="Kenya">🇰🇪</span>
          <span className="text-4xl" title="Ghana">🇬🇭</span>
          <span className="text-4xl" title="South Africa">🇿🇦</span>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="bg-white rounded-3xl border border-slate-100 p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black text-slate-900">Success Stories</h2>
          <Link to="/register" className="text-emerald-600 font-bold text-sm">Join them today →</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-slate-50 rounded-2xl italic text-slate-600 text-sm relative">
            "I was scared of agents taking my money. AfriHealth connected me directly to Apollo Hospital. I got my visa and treatment without any stress."
            <div className="mt-4 not-italic font-bold text-slate-900 flex items-center gap-2">
              <img src="https://picsum.photos/seed/pat1/40/40" className="w-8 h-8 rounded-full" />
              Obinna K., Lagos
            </div>
          </div>
          <div className="p-6 bg-slate-50 rounded-2xl italic text-slate-600 text-sm relative">
            "The Portuguese support made everything clear for me coming from Maputo. Direct communication with the doctor was a game changer."
            <div className="mt-4 not-italic font-bold text-slate-900 flex items-center gap-2">
              <img src="https://picsum.photos/seed/pat2/40/40" className="w-8 h-8 rounded-full" />
              Maria S., Maputo
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
