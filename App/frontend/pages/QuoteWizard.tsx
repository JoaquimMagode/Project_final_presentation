import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Info, Minus, Plus, ChevronDown, User } from 'lucide-react';
import { MOCK_HOSPITALS } from '../constants';

const AGE_GROUPS = ['16–17', '18–24', '25–29', '30–49', '50+'];
const DURATIONS = ['1 week', '2 weeks', '3 weeks', '1 month', '2 months'];

const MOCK_STAYS = [
  { name: 'Radisson Blu', distance: '1.2 km from hospital', pricePerWeek: 420 },
  { name: 'Lemon Tree Hotel', distance: '2.5 km from hospital', pricePerWeek: 280 },
  { name: 'OYO Townhouse', distance: '3.0 km from hospital', pricePerWeek: 140 },
];

interface PersonForm {
  gender: 'male' | 'female' | '';
  ageGroup: string;
}

const emptyPerson = (): PersonForm => ({ gender: '', ageGroup: '' });

const PersonCard: React.FC<{
  index: number;
  label: string;
  data: PersonForm;
  onChange: (data: PersonForm) => void;
}> = ({ index, label, data, onChange }) => (
  <div className="border border-slate-200 rounded-2xl p-4 space-y-4 bg-slate-50">
    <div className="flex items-center gap-2">
      <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center">
        <User className="w-3.5 h-3.5 text-emerald-600" />
      </div>
      <span className="text-sm font-bold text-slate-700">{label}</span>
    </div>

    {/* Gender */}
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-slate-500">
        Gender <span className="text-red-400">*</span>
      </label>
      <div className="flex gap-2">
        {(['male', 'female'] as const).map(g => (
          <button
            key={g}
            type="button"
            onClick={() => onChange({ ...data, gender: g })}
            className={`flex-1 py-2 rounded-xl border text-xs font-semibold capitalize transition-colors ${
              data.gender === g
                ? 'bg-emerald-600 border-emerald-600 text-white'
                : 'border-slate-200 bg-white text-slate-600 hover:border-emerald-400'
            }`}
          >
            {g}
          </button>
        ))}
      </div>
    </div>

    {/* Age group */}
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-slate-500">
        Age Group <span className="text-red-400">*</span>
      </label>
      <div className="flex flex-wrap gap-1.5">
        {AGE_GROUPS.map(ag => (
          <button
            key={ag}
            type="button"
            onClick={() => onChange({ ...data, ageGroup: ag })}
            className={`px-3 py-1.5 rounded-full border text-xs font-semibold transition-colors ${
              data.ageGroup === ag
                ? 'bg-emerald-600 border-emerald-600 text-white'
                : 'border-slate-200 bg-white text-slate-600 hover:border-emerald-400'
            }`}
          >
            {ag}
          </button>
        ))}
      </div>
    </div>
  </div>
);

const QuoteWizard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const quoteData = (location.state as any) ?? {};

  const [patient, setPatient] = useState<PersonForm>(emptyPerson());
  const [companions, setCompanions] = useState<PersonForm[]>([]);
  const [duration, setDuration] = useState('1 week');
  const [results, setResults] = useState<typeof MOCK_STAYS | null>(null);

  const hospital = MOCK_HOSPITALS.find(h => h.id === quoteData.hospitalId) ?? MOCK_HOSPITALS[0];

  const addCompanion = () => {
    if (companions.length < 4) setCompanions(prev => [...prev, emptyPerson()]);
  };

  const removeCompanion = () => {
    if (companions.length > 0) setCompanions(prev => prev.slice(0, -1));
  };

  const updateCompanion = (i: number, data: PersonForm) => {
    setCompanions(prev => prev.map((c, idx) => (idx === i ? data : c)));
  };

  const weekMultiplier = (d: string) => {
    const map: Record<string, number> = { '1 week': 1, '2 weeks': 2, '3 weeks': 3, '1 month': 4, '2 months': 8 };
    return map[d] ?? 1;
  };

  const allValid =
    patient.gender !== '' &&
    patient.ageGroup !== '' &&
    companions.every(c => c.gender !== '' && c.ageGroup !== '');

  const [showContinue, setShowContinue] = useState(false);

  const handleFind = () => {
    if (!allValid) return;
    setResults(MOCK_STAYS);
    setShowContinue(true);
  };

  const handleReset = () => {
    setPatient(emptyPerson());
    setCompanions([]);
    setDuration('1 week');
    setResults(null);
  };

  const fieldClass =
    'w-full bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 text-slate-800 text-sm font-medium';

  return (
    <div className="min-h-screen bg-slate-50 flex items-start justify-center py-10 px-4">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-md p-8 space-y-6">

        {/* Step indicator */}
        <div className="space-y-1">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Step 1 / 4</p>
          <h1 className="text-xl font-bold text-slate-900">Select your Accommodation</h1>
        </div>

        {/* Info box */}
        <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl p-4">
          <Info className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
          <p className="text-sm text-blue-700">
            To find the best accommodation for you, we need some additional details.
          </p>
        </div>

        {/* Hospital context */}
        <p className="text-xs text-slate-500">
          Searching near <span className="font-semibold text-slate-700">{hospital.name}</span>, {hospital.location}
        </p>

        {/* Patient (you) */}
        <PersonCard
          index={0}
          label="You (Patient)"
          data={patient}
          onChange={setPatient}
        />

        {/* Companions */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-500">
              Companions ({companions.length} / 4)
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={removeCompanion}
                disabled={companions.length === 0}
                className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-100 disabled:opacity-30 transition-colors"
              >
                <Minus className="w-3.5 h-3.5 text-slate-600" />
              </button>
              <span className="text-sm font-bold text-slate-800 w-4 text-center">{companions.length}</span>
              <button
                type="button"
                onClick={addCompanion}
                disabled={companions.length >= 4}
                className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-100 disabled:opacity-30 transition-colors"
              >
                <Plus className="w-3.5 h-3.5 text-slate-600" />
              </button>
            </div>
          </div>

          {companions.map((c, i) => (
            <PersonCard
              key={i}
              index={i + 1}
              label={`Companion ${i + 1}`}
              data={c}
              onChange={data => updateCompanion(i, data)}
            />
          ))}
        </div>

        {/* Duration */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-500">Duration of Stay</label>
          <div className="relative">
            <select value={duration} onChange={e => setDuration(e.target.value)} className={`${fieldClass} pr-9`}>
              {DURATIONS.map(d => <option key={d}>{d}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
          <p className="text-xs text-slate-400">This duration refers only to your accommodation period.</p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-3 pt-2">
          <button
            onClick={handleFind}
            disabled={!allValid}
            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold py-3 rounded-xl transition-colors text-sm tracking-wide"
          >
            FIND ACCOMMODATION
          </button>
          <div className="flex gap-3">
            <button
              onClick={handleReset}
              className="flex-1 py-2.5 rounded-xl border-2 border-blue-200 text-blue-600 font-semibold text-sm hover:bg-blue-50 transition-colors"
            >
              RESET YOUR QUOTE
            </button>
            <button
              onClick={() => navigate('/quote/extras', { state: quoteData })}
              className="flex-1 py-2.5 rounded-xl border-2 border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-colors"
            >
              SKIP ACCOMMODATION
            </button>
          </div>
        </div>

        {/* Results */}
        {results && (
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Recommended Stays — {duration} · {1 + companions.length} {1 + companions.length === 1 ? 'person' : 'people'}
            </p>
            {results.map(stay => {
              const total = stay.pricePerWeek * weekMultiplier(duration) * (1 + companions.length * 0.3);
              return (
                <div key={stay.name} className="flex justify-between items-center bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
                  <div>
                    <p className="font-bold text-slate-800 text-sm">{stay.name}</p>
                    <p className="text-xs text-slate-400">{stay.distance}</p>
                  </div>
                  <span className="text-emerald-600 font-black text-sm">${Math.round(total)}</span>
                </div>
              );
            })}
            <button
              onClick={() => navigate('/quote/extras', { state: { ...quoteData, patient, companions, duration } })}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-colors text-sm tracking-wide mt-2"
            >
              CONTINUE TO EXTRAS →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuoteWizard;
