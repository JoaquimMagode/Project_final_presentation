import React from 'react';
import { Link } from 'react-router-dom';
import { Hospital } from '../types';
import { Star, MapPin, Clock, ShieldCheck, ArrowRight } from 'lucide-react';

interface Props {
  hospital: Hospital;
}

const HospitalCard: React.FC<Props> = ({ hospital }) => {
  return (
    <div className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg
                    hover:-translate-y-0.5 transition-all duration-200 overflow-hidden">

      {/* top accent strip */}
      <div className="h-1 bg-gradient-to-r from-emerald-400 to-teal-500" />

      <div className="p-5">
        <div className="flex gap-4">

          {/* Logo */}
          <div className="shrink-0">
            <img
              src={hospital.logo}
              alt={hospital.name}
              className="w-14 h-14 rounded-xl object-cover border border-slate-100 shadow-sm"
              onError={e => {
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(hospital.name)}&background=059669&color=fff&bold=true&size=56`;
              }}
            />
          </div>

          {/* Main info */}
          <div className="flex-1 min-w-0">
            {/* accreditation badge */}
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 border border-emerald-200
                               text-emerald-700 text-[10px] font-bold rounded-full">
                <ShieldCheck className="w-3 h-3" />
                {hospital.accreditation}
              </span>
            </div>

            <h3 className="font-bold text-slate-900 leading-snug truncate">{hospital.name}</h3>

            <div className="flex items-center gap-1 mt-1 text-slate-500 text-xs">
              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
              <span className="truncate">{hospital.location}</span>
            </div>
          </div>

          {/* Rating pill */}
          {hospital.rating && (
            <div className="shrink-0 flex flex-col items-center justify-center">
              <div className="flex items-center gap-1 px-2.5 py-1 bg-amber-50 border border-amber-200 rounded-xl">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span className="text-sm font-bold text-amber-700">{hospital.rating}</span>
              </div>
            </div>
          )}
        </div>

        {/* Specializations */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {hospital.specializations.slice(0, 4).map(s => (
            <span key={s} className="px-2.5 py-0.5 bg-slate-50 border border-slate-100 text-slate-600 text-[11px] font-medium rounded-full">
              {s}
            </span>
          ))}
          {hospital.specializations.length > 4 && (
            <span className="px-2.5 py-0.5 bg-slate-50 border border-slate-100 text-slate-400 text-[11px] font-medium rounded-full">
              +{hospital.specializations.length - 4} more
            </span>
          )}
        </div>

        {/* Footer row */}
        <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-50">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-lg bg-emerald-50 flex items-center justify-center">
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide leading-none">Response</p>
              <p className="text-sm font-bold text-emerald-700 leading-tight">{hospital.responseTime}</p>
            </div>
          </div>

          <Link
            to={`/hospital/${hospital.id}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-emerald-600
                       text-white text-xs font-bold rounded-xl transition-colors group-hover:bg-emerald-600"
          >
            View Details <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HospitalCard;
