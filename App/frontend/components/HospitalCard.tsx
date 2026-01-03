
import React from 'react';
import { Link } from 'react-router-dom';
import { Hospital } from '../types';
import { Star, MapPin, Clock, ShieldCheck } from 'lucide-react';

interface Props {
  hospital: Hospital;
}

const HospitalCard: React.FC<Props> = ({ hospital }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all active:scale-[0.98]">
      <div className="p-4 flex gap-4">
        <img src={hospital.logo} alt={hospital.name} className="w-16 h-16 rounded-xl object-cover border border-slate-100 shrink-0" />
        <div className="flex-1">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              {hospital.accreditation}
            </span>
          </div>
          <h3 className="font-bold text-slate-900 leading-tight mb-1">{hospital.name}</h3>
          <p className="text-slate-500 text-xs flex items-center gap-1">
            <MapPin className="w-3 h-3 text-slate-400" /> {hospital.location}
          </p>
        </div>
      </div>
      
      <div className="px-4 pb-4">
        <div className="flex flex-wrap gap-1 mb-4">
          {hospital.specializations.map(s => (
            <span key={s} className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-1 rounded-md">
              {s}
            </span>
          ))}
        </div>
        
        <div className="flex items-center justify-between pt-3 border-t border-slate-50">
          <div className="flex flex-col">
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-tighter">Response Time</span>
            <div className="flex items-center gap-1 text-emerald-600 font-bold text-sm">
              <Clock className="w-3 h-3" />
              {hospital.responseTime}
            </div>
          </div>
          <Link 
            to={`/register?hospitalId=${hospital.id}`}
            className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors"
          >
            Request Opinion
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HospitalCard;
