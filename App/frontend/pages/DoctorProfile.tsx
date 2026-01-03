
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_DOCTORS, MOCK_HOSPITALS } from '../constants';
import { ArrowLeft, MapPin, Award, Globe, MessageSquare } from 'lucide-react';

const DoctorProfile: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const doctor = MOCK_DOCTORS.find(d => d.id === id) || MOCK_DOCTORS[0];
  const hospital = MOCK_HOSPITALS.find(h => h.id === doctor.hospitalId);

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500 pb-20">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 font-bold text-sm">
        <ArrowLeft className="w-4 h-4" /> Back to Search
      </button>

      {/* Header Profile */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="bg-slate-900 h-24" />
        <div className="px-6 pb-6">
          <div className="relative -mt-12 mb-4">
            <img src={doctor.photo} alt={doctor.name} className="w-24 h-24 rounded-2xl border-4 border-white object-cover shadow-lg" />
          </div>
          <h1 className="text-2xl font-black text-slate-900">{doctor.name}</h1>
          <p className="text-emerald-600 font-bold mb-4">{doctor.specialization}</p>
          
          <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-50">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-bold text-slate-600">{doctor.experience} Exp</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-bold text-slate-600">{hospital?.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-bold text-slate-600">{doctor.languages.join(', ')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* About */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
        <h2 className="text-lg font-black text-slate-900">About Doctor</h2>
        <p className="text-slate-500 text-sm leading-relaxed font-medium">
          {doctor.bio}
          <br /><br />
          Dr. {doctor.name.split(' ')[1]} specializes in complex cases from international patients and has treated over 500+ patients from the African continent.
        </p>
      </div>

      {/* CTAs */}
      <div className="fixed bottom-24 left-4 right-4 md:static md:flex md:gap-4 md:bottom-0">
        <button className="w-full mb-3 md:mb-0 py-4 bg-emerald-600 text-white font-black rounded-2xl shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2">
          <MessageSquare className="w-5 h-5" /> Request Appointment
        </button>
        <button className="w-full py-4 bg-white border border-slate-200 text-slate-900 font-black rounded-2xl hover:border-emerald-300 transition-all">
          Download CV
        </button>
      </div>
    </div>
  );
};

export default DoctorProfile;
