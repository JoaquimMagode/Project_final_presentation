
import React from 'react';
import { Plane, CheckCircle2, AlertTriangle, FileText, Download, ExternalLink } from 'lucide-react';

const VisaGuidance: React.FC = () => {
  return (
    <div className="space-y-10 pb-20 max-w-3xl mx-auto">
      <div className="text-center space-y-3">
        <div className="w-20 h-20 bg-emerald-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
          <Plane className="w-10 h-10 text-emerald-600" />
        </div>
        <h1 className="text-3xl font-black text-slate-900">Medical Visa Guide</h1>
        <p className="text-slate-500 font-medium">Direct process for African patients traveling to India.</p>
      </div>

      {/* Step by Step */}
      <section className="space-y-6">
        <h2 className="text-xl font-black text-slate-900 flex items-center gap-2 px-2">
          Step-by-Step Process
        </h2>
        
        <div className="space-y-4">
          {[
            { step: 1, title: 'Get Invitation Letter', desc: 'Hospital in India provides a stamped Medical Invitation Letter (MIL) once they review your case.' },
            { step: 2, title: 'Apply Online', desc: 'Fill out the e-Medical Visa form at the official Indian Government portal.' },
            { step: 3, title: 'Biometrics', desc: 'Visit your local Indian Embassy if physical biometrics are required for your country.' },
            { step: 4, title: 'Visa Grant', desc: 'Once approved (usually 3-7 days), you receive your e-Visa via email.' }
          ].map((s) => (
            <div key={s.step} className="bg-white p-5 rounded-2xl border border-slate-200 flex gap-4">
              <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black shrink-0">
                {s.step}
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-900">{s.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Checklist */}
      <div className="bg-slate-900 rounded-3xl p-8 text-white space-y-6">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="w-6 h-6 text-emerald-400" />
          <h2 className="text-xl font-black">Document Checklist</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            'Passport (6 months validity)',
            'Hospital Invitation Letter',
            'Local Doctor Referral Letter',
            'Bank Statements (3 months)',
            'Recent Passport Photos',
            'Yellow Fever Certificate',
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/10">
              <FileText className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-bold text-slate-200">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Rejection Tips */}
      <div className="bg-amber-50 rounded-3xl p-6 border border-amber-200 space-y-4">
        <div className="flex items-center gap-3 text-amber-700">
          <AlertTriangle className="w-6 h-6" />
          <h2 className="text-lg font-black">Common Rejection Reasons</h2>
        </div>
        <ul className="space-y-3 text-sm font-medium text-amber-900/80 list-disc pl-5">
          <li>Mismatch between passport name and medical reports.</li>
          <li>Insufficient funds shown in bank statements for the procedure cost.</li>
          <li>Missing the official stamp from the Indian hospital on the invite.</li>
          <li>Invalid or expired Yellow Fever vaccination card.</li>
        </ul>
      </div>

      {/* Sample Docs */}
      <div className="space-y-4">
        <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs px-2">Sample Documents</h3>
        <div className="grid grid-cols-2 gap-4">
          <button className="p-4 bg-white border border-slate-200 rounded-2xl flex flex-col items-center gap-3 hover:border-emerald-300 transition-colors group">
            <Download className="w-6 h-6 text-slate-400 group-hover:text-emerald-500" />
            <span className="text-xs font-black text-slate-600">Visa Invite Sample</span>
          </button>
          <button className="p-4 bg-white border border-slate-200 rounded-2xl flex flex-col items-center gap-3 hover:border-emerald-300 transition-colors group">
            <Download className="w-6 h-6 text-slate-400 group-hover:text-emerald-500" />
            <span className="text-xs font-black text-slate-600">Referral Form Sample</span>
          </button>
        </div>
      </div>

      {/* Apply Button */}
      <div className="text-center">
        <a 
          href="https://indianvisaonline.gov.in/evisa/tvoa.html"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 px-8 py-4 bg-emerald-600 text-white font-bold rounded-2xl shadow-xl shadow-emerald-200 hover:bg-emerald-700 hover:translate-y-[-2px] transition-all"
        >
          <Plane className="w-5 h-5" />
          Apply Here - Official Indian Visa Portal
          <ExternalLink className="w-5 h-5" />
        </a>
        <p className="text-sm text-slate-500 mt-3">Opens official Indian government visa website</p>
      </div>
    </div>
  );
};

export default VisaGuidance;
