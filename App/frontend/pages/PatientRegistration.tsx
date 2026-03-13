import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../App';
import { ShieldCheck, ArrowLeft, Upload, User, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  dateOfBirth: string;
  gender: string;
  bloodType: string;
  medicalHistory: string[];
  allergies: string;
  currentMedications: string;
  documents: File[];
}

const PatientRegistration: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: '',
    dateOfBirth: '',
    gender: '',
    bloodType: '',
    medicalHistory: [],
    allergies: '',
    currentMedications: '',
    documents: [],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const medicalConditions = [
    'Diabetes', 'Hypertension', 'Heart Disease', 'Asthma', 'Cancer',
    'Arthritis', 'Thyroid Disorder', 'Kidney Disease', 'Liver Disease', 'Mental Health'
  ];

  const validateStep = (stepNum: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (stepNum === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email';
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
      if (!formData.country) newErrors.country = 'Country is required';
    }

    if (stepNum === 2) {
      if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
      if (!formData.gender) newErrors.gender = 'Gender is required';
      if (!formData.bloodType) newErrors.bloodType = 'Blood type is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleMedicalHistoryToggle = (condition: string) => {
    setFormData(prev => ({
      ...prev,
      medicalHistory: prev.medicalHistory.includes(condition)
        ? prev.medicalHistory.filter(c => c !== condition)
        : [...prev.medicalHistory, condition]
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData(prev => ({
        ...prev,
        documents: [...prev.documents, ...Array.from(e.target.files || [])]
      }));
    }
  };

  const handleRemoveDocument = (index: number) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep(step)) {
      if (step < 3) {
        setStep(step + 1);
      } else {
        login(`${formData.firstName} ${formData.lastName}`, 'PATIENT');
        navigate('/dashboard');
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 animate-in slide-in-from-bottom-4 duration-500">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-slate-500 font-bold text-sm hover:text-slate-900 transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" /> Go Back
      </button>

      <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-black text-slate-900">Patient Registration</h1>
        <p className="text-slate-500 font-medium">Step {step} of 3 - Complete your profile</p>
      </div>

      {/* Progress Bar */}
      <div className="flex gap-2 mb-8">
        {[1, 2, 3].map(s => (
          <div
            key={s}
            className={`h-2 flex-1 rounded-full transition-all ${
              s <= step ? 'bg-emerald-600' : 'bg-slate-200'
            }`}
          />
        ))}
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
        {/* Step 1: Basic Information */}
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-slate-500">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={`w-full bg-slate-50 border rounded-xl p-4 outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
                    errors.firstName ? 'border-red-500' : 'border-slate-200'
                  }`}
                  placeholder="John"
                />
                {errors.firstName && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.firstName}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-slate-500">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={`w-full bg-slate-50 border rounded-xl p-4 outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
                    errors.lastName ? 'border-red-500' : 'border-slate-200'
                  }`}
                  placeholder="Doe"
                />
                {errors.lastName && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.lastName}</p>}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-slate-500">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full bg-slate-50 border rounded-xl p-4 outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
                  errors.email ? 'border-red-500' : 'border-slate-200'
                }`}
                placeholder="john@email.com"
              />
              {errors.email && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.email}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-slate-500">WhatsApp Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full bg-slate-50 border rounded-xl p-4 outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
                    errors.phone ? 'border-red-500' : 'border-slate-200'
                  }`}
                  placeholder="+234 ..."
                />
                {errors.phone && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.phone}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-slate-500">Country of Residence</label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className={`w-full bg-slate-50 border rounded-xl p-4 outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
                    errors.country ? 'border-red-500' : 'border-slate-200'
                  }`}
                >
                  <option value="">Select Country</option>
                  <option value="Nigeria">Nigeria</option>
                  <option value="Mozambique">Mozambique</option>
                  <option value="Kenya">Kenya</option>
                  <option value="Ghana">Ghana</option>
                  <option value="South Africa">South Africa</option>
                </select>
                {errors.country && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.country}</p>}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Health Information */}
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900">Health Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-slate-500">Date of Birth</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  className={`w-full bg-slate-50 border rounded-xl p-4 outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
                    errors.dateOfBirth ? 'border-red-500' : 'border-slate-200'
                  }`}
                />
                {errors.dateOfBirth && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.dateOfBirth}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-slate-500">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className={`w-full bg-slate-50 border rounded-xl p-4 outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
                    errors.gender ? 'border-red-500' : 'border-slate-200'
                  }`}
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {errors.gender && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.gender}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-slate-500">Blood Type</label>
                <select
                  name="bloodType"
                  value={formData.bloodType}
                  onChange={handleInputChange}
                  className={`w-full bg-slate-50 border rounded-xl p-4 outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
                    errors.bloodType ? 'border-red-500' : 'border-slate-200'
                  }`}
                >
                  <option value="">Select</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
                {errors.bloodType && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.bloodType}</p>}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-wider text-slate-500">Medical History (Select all that apply)</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {medicalConditions.map(condition => (
                  <label key={condition} className="flex items-center gap-2 cursor-pointer p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.medicalHistory.includes(condition)}
                      onChange={() => handleMedicalHistoryToggle(condition)}
                      className="w-4 h-4 rounded accent-emerald-600"
                    />
                    <span className="text-sm font-medium text-slate-700">{condition}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-slate-500">Allergies</label>
              <textarea
                name="allergies"
                value={formData.allergies}
                onChange={handleInputChange}
                placeholder="List any allergies (e.g., Penicillin, Peanuts)"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 outline-none focus:ring-2 focus:ring-emerald-500 transition-all resize-none"
                rows={3}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-slate-500">Current Medications</label>
              <textarea
                name="currentMedications"
                value={formData.currentMedications}
                onChange={handleInputChange}
                placeholder="List current medications and dosages"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 outline-none focus:ring-2 focus:ring-emerald-500 transition-all resize-none"
                rows={3}
              />
            </div>
          </div>
        )}

        {/* Step 3: Documents & Verification */}
        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900">Documents & Verification</h2>

            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-slate-500">Upload Medical Documents</label>
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center gap-2 hover:border-emerald-300 transition-colors cursor-pointer bg-slate-50/50">
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                  accept=".pdf,.jpg,.jpeg,.png"
                />
                <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-2">
                  <Upload className="w-8 h-8 text-slate-300" />
                  <p className="text-xs font-bold text-slate-400">Click to upload or drag and drop</p>
                  <p className="text-xs text-slate-400">PDF, JPG, PNG (Max 10MB each)</p>
                </label>
              </div>
            </div>

            {formData.documents.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-600 uppercase">Uploaded Documents ({formData.documents.length})</p>
                <div className="space-y-2">
                  {formData.documents.map((doc, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-200">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-emerald-600" />
                        <span className="text-sm font-medium text-slate-700">{doc.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveDocument(idx)}
                        className="text-xs font-bold text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-start gap-3 bg-emerald-50 p-4 rounded-xl border border-emerald-200">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <p className="text-xs text-emerald-700 leading-relaxed font-medium">
                Your medical documents are encrypted and stored securely. Only verified hospitals can access them with your consent.
              </p>
            </div>

            <div className="flex items-start gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
                We comply with HIPAA and GDPR guidelines. Your data is never shared without explicit consent.
              </p>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-4 pt-6 border-t border-slate-200">
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="flex-1 px-6 py-3 border border-slate-300 text-slate-900 font-bold rounded-xl hover:bg-slate-50 transition-colors"
            >
              Previous
            </button>
          )}
          <button
            type="submit"
            className="flex-1 px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 active:scale-[0.98] transition-all"
          >
            {step === 3 ? 'Complete Registration' : 'Next'}
          </button>
        </div>

        <div className="text-center text-sm">
          <p className="text-slate-500">Already have an account? <Link to="/login" className="text-emerald-600 font-bold">Log in</Link></p>
        </div>
      </form>
    </div>
  );
};

export default PatientRegistration;
