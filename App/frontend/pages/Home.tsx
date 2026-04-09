

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLang } from '../App';
import { TRANSLATIONS, APP_ICONS } from '../constants';
import { ArrowRight, CheckCircle2, Globe2, Search, MapPin, Stethoscope } from 'lucide-react';

const Home: React.FC = () => {
  const { lang } = useLang();
  const t = TRANSLATIONS[lang];
  const navigate = useNavigate();
  const [searchMode, setSearchMode] = useState<'destination' | 'procedure'>('destination');
  const [destination, setDestination] = useState('');
  const [procedure, setProcedure] = useState('');

  const indianCities = [
    'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata', 'Ahmedabad'
  ];

  const medicalProcedures = [
    'Cardiology', 'Neurology & Neurosurgery', 'Orthopedics', 'Obstetrics & Gynecology',
    'Urology', 'Dermatology', 'Primary Care Physician'
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchMode === 'destination' && destination) {
      navigate(`/hospitals?destination=${destination}`);
    } else if (searchMode === 'procedure' && procedure) {
      navigate(`/hospitals?procedure=${procedure}`);
    }
  };

  return (
    <div className="animate-in fade-in duration-700">
      {/* Hero Section - Cedars-Sinai Style */}
      <section className="bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 ">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <h1 className="text-5xl md:text-6xl font-serif leading-tight text-slate-900">
                Find Your Medical<br />Treatment in India
              </h1>
              
              {/* Search Filter */}
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="flex gap-6 border-b border-slate-200">
                  <button
                    type="button"
                    onClick={() => setSearchMode('destination')}
                    className={`pb-2 font-semibold transition-colors ${
                      searchMode === 'destination'
                        ? 'border-b-2 border-slate-900 text-slate-900'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Destination
                  </button>
                  <button
                    type="button"
                    onClick={() => setSearchMode('procedure')}
                    className={`pb-2 font-semibold transition-colors ${
                      searchMode === 'procedure'
                        ? 'border-b-2 border-slate-900 text-slate-900'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Procedure
                  </button>
                </div>
                
                {/* Dropdowns */}
                <div className="space-y-3">
                  {searchMode === 'destination' ? (
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        <MapPin className="w-4 h-4 inline mr-1" />
                        Destination in India
                      </label>
                      <select 
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        className="w-full p-4 border border-slate-300 rounded focus:ring-2 focus:ring-slate-900 focus:border-slate-900 bg-white"
                      >
                        <option value="">Select a city</option>
                        {indianCities.map(city => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        <Stethoscope className="w-4 h-4 inline mr-1" />
                        Type of Procedure
                      </label>
                      <select 
                        value={procedure}
                        onChange={(e) => setProcedure(e.target.value)}
                        className="w-full p-4 border border-slate-300 rounded focus:ring-2 focus:ring-slate-900 focus:border-slate-900 bg-white"
                      >
                        <option value="">Select a procedure</option>
                        {medicalProcedures.map(proc => (
                          <option key={proc} value={proc}>{proc}</option>
                        ))}
                      </select>
                    </div>
                  )}
                  
                  <button 
                    type="submit"
                    className="w-full bg-slate-900 text-white font-semibold py-4 rounded hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                  >
                    <Search className="w-5 h-5" />
                    Find Hospitals
                  </button>
                </div>
              </form>
              
              {/* Badge */}
              <div className="flex items-center gap-3 pt-4">
                <div className="flex gap-2">
                  <div className="w-12 h-12 bg-slate-200 rounded flex items-center justify-center text-xs font-bold">🇮🇳</div>
                </div>
                <div>
                  <div className="font-bold text-slate-900">Verified Indian</div>
                  <div className="text-slate-600">Healthcare Providers</div>
                </div>
              </div>
            </div>
            
            {/* Right Image */}
            <div className="relative h-[800px] hidden lg:block">
              <img 
                src="doctor.png" 
                alt="Medical Professional" 
                className="absolute right-0 bottom-0 h-full w-auto object-cover object-center"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Banner - Full Width */}
      <section className="w-full bg-blue-100 py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            {/* Quote */}
            <div className="lg:col-span-2">
              <blockquote className="text-xl md:text-2xl font-serif text-slate-900 leading-relaxed mb-4">
                "My recovery was almost immediate. I had worried that the treatment wouldn't be a silver bullet, but it was. My goal was to get my life back, and in the hands of a skilled surgeon, I did."
              </blockquote>
              <p className="text-sm text-slate-700">Terry Carroll, Dr. Kim's patient</p>
            </div>
            
            {/* Doctor Info */}
            <div className="flex flex-col items-center lg:items-end gap-4">
              <div className="text-center lg:text-right">
                <div className="font-bold text-slate-900 text-lg">Dr. Sang Kim</div>
                <div className="text-sm text-slate-600">Director, Orthopaedic Spine Trauma</div>
              </div>
              <button className="px-6 py-2 border-2 border-slate-900 text-slate-900 font-semibold rounded hover:bg-slate-900 hover:text-white transition-colors">
                View Profile
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Remaining Sections Container */}
      <div className="max-w-7xl mx-auto px-4 py-6">

      {/* India Medical Treatment Filter - Removed duplicate section */}

      {/* Quick Links */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div className="bg-white border border-slate-200 p-6 hover:shadow-lg transition-shadow">
          <div className="text-slate-900 mb-3">{APP_ICONS.Hospital}</div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Find a Hospital</h3>
          <p className="text-sm text-slate-600 mb-4">Access top-rated medical facilities</p>
          <Link to="/hospitals" className="text-slate-900 font-semibold text-sm hover:underline">Learn More →</Link>
        </div>
        
        <div className="bg-white border border-slate-200 p-6 hover:shadow-lg transition-shadow">
          <div className="text-slate-900 mb-3">{APP_ICONS.Visa}</div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Visa Assistance</h3>
          <p className="text-sm text-slate-600 mb-4">Medical visa application help</p>
          <Link to="/visa" className="text-slate-900 font-semibold text-sm hover:underline">Learn More →</Link>
        </div>
        
        <div className="bg-white border border-slate-200 p-6 hover:shadow-lg transition-shadow">
          <div className="text-slate-900 mb-3">{APP_ICONS.Hotel}</div>
          <h3 className="text-lg font-bold text-slate-900 mb-2\">Travel Support</h3>
          <p className="text-sm text-slate-600 mb-4">Accommodation and assistance</p>
          <Link to="/services" className="text-slate-900 font-semibold text-sm hover:underline">Learn More →</Link>
        </div>
      </section>

      {/* Trust Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
        {[
          { label: 'Verified Hospitals', icon: APP_ICONS.Verified },
          { label: 'Secure Reports', icon: <CheckCircle2 className="w-5 h-5" /> },
          { label: 'Zero Commissions', icon: <CheckCircle2 className="w-5 h-5" /> },
          { label: 'Direct Payments', icon: <CheckCircle2 className="w-5 h-5" /> },
        ].map((badge, i) => (
          <div key={i} className="flex items-center gap-2 bg-white p-3 border border-slate-200">
            <div className="text-slate-900">{badge.icon}</div>
            <span className="text-xs font-bold text-slate-700">{badge.label}</span>
          </div>
        ))}
      </div>

      {/* How It Works */}
      <section className="bg-slate-50 -mx-4 px-4 py-16 mb-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {t.steps.map((step: any, i: number) => (
              <div key={i} className="bg-white p-6 border-l-4 border-slate-900">
                <div className="text-4xl font-bold text-slate-900 mb-3">{i + 1}</div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-sm text-slate-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      </div>

      {/* Find the Care You're Looking For - Full Width */}
      <section className="w-full bg-slate-800 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-serif text-white text-center mb-2">Find the care you're looking for</h2>
          <div className="w-24 h-1 bg-slate-600 mx-auto mb-12"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Virtual Care Card */}
            <div className="bg-slate-700 p-8 rounded flex flex-col ">
              <div>
                <p className="text-sm text-slate-300 mb-2">Got Care with Cedars-Sinai Connect</p>
                <h3 className="text-3xl font-serif text-white mb-6">24/7 Virtual Care</h3>
                <ul className="space-y-4">
                  <li className="flex gap-3 text-slate-200 text-sm">
                    <span className="text-red-500 mt-1">●</span>
                    <span>Connect with providers for illnesses like flu, UTIs and rashes (ages 3+) or chronic conditions (ages 18+)</span>
                  </li>
                  <li className="flex gap-3 text-slate-200 text-sm">
                    <span className="text-red-500 mt-1">●</span>
                    <span>Get care in minutes or schedule an appointment on your schedule</span>
                  </li>
                  <li className="flex gap-3 text-slate-200 text-sm">
                    <span className="text-red-500 mt-1">●</span>
                    <span>Available 24/7, including weekends and holidays</span>
                  </li>
                </ul>
              </div>
              <div className="flex justify-center mt-auto pt-8">
                <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-red-500 transition-colors">
                  <ArrowRight className="w-5 h-5 text-slate-800" />
                </button>
              </div>
            </div>

            {/* Primary Care Card */}
            <div className="bg-slate-700 p-8 rounded flex flex-col">
              <div>
                <p className="text-sm text-slate-300 mb-2">Find the right doctor for you</p>
                <h3 className="text-3xl font-serif text-white mb-6">Primary Care</h3>
                <ul className="space-y-4">
                  <li className="flex gap-3 text-slate-200 text-sm">
                    <span className="text-red-500 mt-1">●</span>
                    <span>More than 30 convenient locations</span>
                  </li>
                  <li className="flex gap-3 text-slate-200 text-sm">
                    <span className="text-red-500 mt-1">●</span>y
                    
                    <span>Online scheduling available</span>
                  </li>
                </ul>
              </div>
              <div className="flex justify-center mt-auto pt-8">
                <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-red-500 transition-colors">
                  <ArrowRight className="w-5 h-5 text-slate-800" />
                </button>
              </div>
            </div>

            {/* Urgent Care Card */}
            <div className="bg-slate-700 p-8 rounded flex flex-col">
              <div>
                <p className="text-sm text-slate-300 mb-2">Got help now</p>
                <h3 className="text-3xl font-serif text-white mb-6">Urgent Care</h3>
                <ul className="space-y-4">
                  <li className="flex gap-3 text-slate-200 text-sm">
                    <span className="text-red-500 mt-1">●</span>
                    <span>Open 7 days a week</span>
                  </li>
                  <li className="flex gap-3 text-slate-200 text-sm">
                    <span className="text-red-500 mt-1">●</span>
                    <span>Accepts most insurance</span>
                  </li>
                </ul>
              </div>
              <div className="flex justify-center mt-auto pt-8">
                <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-red-500 transition-colors">
                  <ArrowRight className="w-5 h-5 text-slate-800" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">Patient Stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white border border-slate-200 p-8">
              <p className="text-slate-700 mb-6 leading-relaxed">
                "IMAP Solution connected me directly to Apollo Hospital. I got my visa and treatment without any stress."
              </p>
              <div className="flex items-center gap-3">
                <img src="https://picsum.photos/seed/pat1/48/48" className="w-12 h-12 rounded-full" />
                <div>
                  <div className="font-bold text-slate-900">Obinna K.</div>
                  <div className="text-sm text-slate-600">Lagos, Nigeria</div>
                </div>
              </div>
            </div>
            <div className="bg-white border border-slate-200 p-8">
              <p className="text-slate-700 mb-6 leading-relaxed">
                "The Portuguese support made everything clear. Direct communication with the doctor was a game changer."
              </p>
              <div className="flex items-center gap-3">
                <img src="https://picsum.photos/seed/pat2/48/48" className="w-12 h-12 rounded-full" />
                <div>
                  <div className="font-bold text-slate-900">Maria S.</div>
                  <div className="text-sm text-slate-600">Maputo, Mozambique</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
