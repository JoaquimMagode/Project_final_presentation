
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../App';
import { TRANSLATIONS, APP_ICONS } from '../constants';
import { ArrowRight, CheckCircle2, Globe2, Search, MapPin, Stethoscope } from 'lucide-react';

const Home: React.FC = () => {
  const { lang } = useLang();
  const t = TRANSLATIONS[lang];
  const [destination, setDestination] = useState('');
  const [procedure, setProcedure] = useState('');

  const indianCities = [
    'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata', 'Ahmedabad'
  ];

  const medicalProcedures = [
    'Cardiac Surgery', 'Orthopedic Surgery', 'Cancer Treatment', 'Neurosurgery',
    'Kidney Transplant', 'Liver Transplant', 'Eye Surgery', 'Cosmetic Surgery',
    'Dental Treatment', 'IVF Treatment', 'Spine Surgery', 'Joint Replacement'
  ];

  const handleSearch = () => {
    // Navigate to hospitals page with search parameters
    console.log('Searching for:', { destination, procedure });
  };

  return (
    <div className="space-y-0 animate-in fade-in duration-700">
      {/* Hero Section - Cedars-Sinai Style */}
      <section className="relative -mx-4 mb-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <h1 className="text-5xl md:text-6xl font-serif leading-tight text-slate-900">
                Find Your Medical<br />Treatment in India
              </h1>
              
              {/* Search Filter */}
              <div className="space-y-4">
                <div className="flex gap-6 border-b border-slate-200">
                  <button className="pb-2 border-b-2 border-slate-900 font-semibold text-slate-900">Destination</button>
                  <button className="pb-2 text-slate-600 hover:text-slate-900">Procedure</button>
                </div>
                
                {/* Dropdowns */}
                <div className="space-y-3">
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
                  
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      <Stethoscope className="w-4 h-4 inline mr-1" />
                      Medical Procedure
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
                  
                  <button 
                    onClick={handleSearch}
                    className="w-full bg-slate-900 text-white font-semibold py-4 rounded hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                  >
                    <Search className="w-5 h-5" />
                    Search Hospitals
                  </button>
                </div>
              </div>
              
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
            <div className="relative h-[600px] hidden lg:block">
              <img 
                src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Medical Professional" 
                className="absolute right-0 bottom-0 h-full w-auto object-cover object-center"
              />
            </div>
          </div>
        </div>
      </section>

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
          <h3 className="text-lg font-bold text-slate-900 mb-2">Travel Support</h3>
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

      {/* Testimonials */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-slate-900 mb-8">Patient Stories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white border border-slate-200 p-8">
            <p className="text-slate-700 mb-6 leading-relaxed">
              "AfriHealth connected me directly to Apollo Hospital. I got my visa and treatment without any stress."
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
  );
};

export default Home;
