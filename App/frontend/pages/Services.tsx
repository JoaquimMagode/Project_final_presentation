
import React from 'react';
import { MOCK_ASSISTANCE, APP_ICONS } from '../constants';
import { Hotel, Plane, MapPin, CheckCircle2, PhoneCall } from 'lucide-react';

const Services: React.FC = () => {
  return (
    <div className="space-y-12 pb-20">
      <section className="text-center py-8 space-y-4">
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight">Patient Assistance & Services</h1>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium">
          We support your entire journey—from airport arrival to luxury hotel stays and local guidance.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-6">
          <div className="flex items-center gap-3 text-emerald-600">
            <div className="p-3 bg-emerald-50 rounded-2xl">
              <Hotel className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-black">Medical Stays</h2>
          </div>
          <p className="text-sm text-slate-500 leading-relaxed">
            Curated selection of hotels near major hospitals with medical-friendly menus, wheelchair access, and flexible check-outs.
          </p>
          <div className="space-y-4">
            {MOCK_ASSISTANCE.filter(a => a.type === 'HOTEL').map(hotel => (
              <div key={hotel.id} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm group hover:border-emerald-500 transition-all">
                <h3 className="font-bold text-slate-900 mb-1">{hotel.title}</h3>
                <p className="text-xs text-slate-500 mb-3">{hotel.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-emerald-600 font-black text-xs">{hotel.priceRange} / Night</span>
                  <button className="text-emerald-600 font-bold text-xs uppercase group-hover:underline">Inquire</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-3 text-blue-600">
            <div className="p-3 bg-blue-50 rounded-2xl">
              <Plane className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-black">Travel & Logistics</h2>
          </div>
          <p className="text-sm text-slate-500 leading-relaxed">
            Hassle-free airport pickups, inter-city transfers, and ambulance services for critical care patients.
          </p>
          <div className="space-y-4">
            {MOCK_ASSISTANCE.filter(a => a.type === 'TRAVEL').map(travel => (
              <div key={travel.id} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm group hover:border-blue-500 transition-all">
                <h3 className="font-bold text-slate-900 mb-1">{travel.title}</h3>
                <p className="text-xs text-slate-500 mb-3">{travel.description}</p>
                <button className="w-full py-2 bg-slate-50 rounded-lg text-xs font-bold text-slate-600 group-hover:bg-blue-600 group-hover:text-white transition-all">Book Service</button>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-3 text-amber-600">
            <div className="p-3 bg-amber-50 rounded-2xl">
              <MapPin className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-black">Local Support</h2>
          </div>
          <p className="text-sm text-slate-500 leading-relaxed">
            Translators, local SIM cards, currency exchange, and 24/7 patient coordinators to help you navigate India.
          </p>
          <div className="space-y-4">
            {MOCK_ASSISTANCE.filter(a => a.type === 'LOCAL').map(local => (
              <div key={local.id} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm group hover:border-amber-500 transition-all">
                <h3 className="font-bold text-slate-900 mb-1">{local.title}</h3>
                <p className="text-xs text-slate-500 mb-3">{local.description}</p>
                <div className="flex items-center gap-2 text-[10px] font-black text-amber-600 uppercase">
                  <PhoneCall className="w-3 h-3" /> 24/7 Available
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className="bg-emerald-600 rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-2">
          <h2 className="text-3xl font-black">Need a Customized Plan?</h2>
          <p className="text-emerald-100 font-medium">Talk to our local coordinators to arrange everything before you land.</p>
        </div>
        <button className="bg-white text-emerald-600 px-8 py-4 rounded-2xl font-black shadow-xl hover:scale-105 transition-all">
          Contact Assistance
        </button>
      </section>
    </div>
  );
};

export default Services;
