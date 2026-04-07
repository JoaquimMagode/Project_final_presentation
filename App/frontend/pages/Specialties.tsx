import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Bone, Brain, Sparkles, Baby, Eye, Smile, Activity, ArrowRight, Stethoscope } from 'lucide-react';

export const SPECIALTIES = [
  {
    key: 'cardiology',
    name: 'Cardiology',
    icon: <Heart className="w-7 h-7" />,
    description: 'Heart surgeries, bypass procedures, angioplasty, and cardiac rehabilitation.',
    color: 'text-red-500',
    bg: 'bg-red-50',
    border: 'hover:border-red-400',
  },
  {
    key: 'orthopedics',
    name: 'Orthopedics',
    icon: <Bone className="w-7 h-7" />,
    description: 'Joint replacement, spine surgery, sports injuries, and bone treatments.',
    color: 'text-blue-500',
    bg: 'bg-blue-50',
    border: 'hover:border-blue-400',
  },
  {
    key: 'neurology',
    name: 'Neurology',
    icon: <Brain className="w-7 h-7" />,
    description: 'Brain tumour removal, stroke care, epilepsy treatment, and neurosurgery.',
    color: 'text-purple-500',
    bg: 'bg-purple-50',
    border: 'hover:border-purple-400',
  },
  {
    key: 'cosmetic-surgery',
    name: 'Cosmetic Surgery',
    icon: <Sparkles className="w-7 h-7" />,
    description: 'Rhinoplasty, liposuction, facelifts, and reconstructive procedures.',
    color: 'text-pink-500',
    bg: 'bg-pink-50',
    border: 'hover:border-pink-400',
  },
  {
    key: 'fertility',
    name: 'Fertility',
    icon: <Baby className="w-7 h-7" />,
    description: 'IVF, IUI, egg freezing, and advanced reproductive treatments.',
    color: 'text-amber-500',
    bg: 'bg-amber-50',
    border: 'hover:border-amber-400',
  },
  {
    key: 'eye-surgery',
    name: 'Eye Surgery',
    icon: <Eye className="w-7 h-7" />,
    description: 'LASIK, cataract removal, retinal surgery, and glaucoma treatment.',
    color: 'text-cyan-500',
    bg: 'bg-cyan-50',
    border: 'hover:border-cyan-400',
  },
  {
    key: 'dental',
    name: 'Dental',
    icon: <Smile className="w-7 h-7" />,
    description: 'Implants, veneers, full-mouth rehabilitation, and cosmetic dentistry.',
    color: 'text-teal-500',
    bg: 'bg-teal-50',
    border: 'hover:border-teal-400',
  },
  {
    key: 'urology',
    name: 'Urology',
    icon: <Activity className="w-7 h-7" />,
    description: 'Kidney stones, prostate treatment, bladder surgery, and transplants.',
    color: 'text-indigo-500',
    bg: 'bg-indigo-50',
    border: 'hover:border-indigo-400',
  },
];

const Specialties: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-10">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-emerald-600 text-sm font-semibold">
          <Stethoscope className="w-4 h-4" /> Medical Specialties
        </div>
        <h1 className="text-4xl font-bold text-slate-900">Find Care by Specialty</h1>
        <p className="text-slate-500 max-w-xl">
          Browse treatments by medical specialty and find the best hospitals in India for your specific needs.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {SPECIALTIES.map(s => (
          <div
            key={s.key}
            onClick={() => navigate(`/specialties/${s.key}`)}
            className={`bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md ${s.border} transition-all group cursor-pointer`}
          >
            <div className={`w-14 h-14 ${s.bg} ${s.color} rounded-2xl flex items-center justify-center mb-4`}>
              {s.icon}
            </div>
            <h2 className="text-base font-bold text-slate-900 mb-2">{s.name}</h2>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">{s.description}</p>
            <button className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-slate-50 group-hover:bg-emerald-600 group-hover:text-white text-slate-700 text-xs font-bold transition-colors`}>
              View Hospitals <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Specialties;
