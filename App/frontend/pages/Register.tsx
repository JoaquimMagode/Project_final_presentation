import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../App';
import { ShieldCheck, ArrowLeft, Eye, EyeOff, AlertCircle, Home, User, Building2 } from 'lucide-react';
import { authAPI } from '../services/api';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [role, setRole] = useState<'patient' | 'hospital_admin'>('patient');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [patientData, setPatientData] = useState({ firstName: '', lastName: '', email: '', password: '', phone: '', country: '' });
  const [hospitalData, setHospitalData] = useState({ hospitalName: '', email: '', password: '', phone: '', city: '', state: '', address: '' });

  const handlePatientChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setPatientData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleHospitalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHospitalData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      let userData: any;
      if (role === 'patient') {
        userData = {
          email: patientData.email,
          password: patientData.password,
          name: `${patientData.firstName} ${patientData.lastName}`,
          phone: patientData.phone,
          role: 'patient',
          country: patientData.country,
        };
      } else {
        userData = {
          email: hospitalData.email,
          password: hospitalData.password,
          name: hospitalData.hospitalName,
          phone: hospitalData.phone,
          role: 'hospital_admin',
        };
      }

      const response = await authAPI.register(userData);
      if (response.success) {
        const { user, token } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify({ name: user.name, role: user.role === 'hospital_admin' ? 'hospital' : 'patient' }));
        login(user.name, (user.role === 'hospital_admin' ? 'hospital' : 'patient') as any);
        navigate(role === 'patient' ? '/patient' : '/hospital', { replace: true });
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-slate-50 border border-slate-200 rounded-xl p-4 outline-none focus:ring-2 focus:ring-emerald-500 transition-all";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-xl w-full space-y-8 animate-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 font-bold text-sm hover:text-slate-900 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Go Back
          </button>
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-emerald-600 font-bold text-sm hover:text-emerald-700 transition-colors">
            <Home className="w-4 h-4" /> Home
          </button>
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black text-slate-900">Create Account</h1>
          <p className="text-slate-500 font-medium">Join IMAP Solution to start your medical journey.</p>
        </div>

        {/* Role Toggle */}
        <div className="flex gap-2 bg-slate-100 p-1 rounded-2xl">
          <button
            type="button"
            onClick={() => setRole('patient')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${role === 'patient' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <User className="w-4 h-4" /> Patient
          </button>
          <button
            type="button"
            onClick={() => setRole('hospital_admin')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${role === 'hospital_admin' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Building2 className="w-4 h-4" /> Hospital
          </button>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
          <div className="space-y-4">
            {role === 'patient' ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase tracking-wider text-slate-500">First Name</label>
                    <input required type="text" name="firstName" value={patientData.firstName} onChange={handlePatientChange} className={inputClass} placeholder="John" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase tracking-wider text-slate-500">Last Name</label>
                    <input required type="text" name="lastName" value={patientData.lastName} onChange={handlePatientChange} className={inputClass} placeholder="Doe" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-500">Email Address</label>
                  <input required type="email" name="email" value={patientData.email} onChange={handlePatientChange} className={inputClass} placeholder="name@email.com" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-500">Password</label>
                  <div className="relative">
                    <input required type={showPassword ? 'text' : 'password'} name="password" value={patientData.password} onChange={handlePatientChange} className={`${inputClass} pr-12`} placeholder="Enter password" minLength={6} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-500">Country of Residence</label>
                  <select required name="country" value={patientData.country} onChange={handlePatientChange} className={inputClass}>
                    <option value="">Select Country</option>
                    <option>Nigeria</option>
                    <option>Mozambique</option>
                    <option>Kenya</option>
                    <option>Ghana</option>
                    <option>South Africa</option>
                    <option>Tanzania</option>
                    <option>Uganda</option>
                    <option>Ethiopia</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-500">WhatsApp Number</label>
                  <input required type="tel" name="phone" value={patientData.phone} onChange={handlePatientChange} className={inputClass} placeholder="+234 ..." />
                </div>
              </>
            ) : (
              <>
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-500">Hospital Name</label>
                  <input required type="text" name="hospitalName" value={hospitalData.hospitalName} onChange={handleHospitalChange} className={inputClass} placeholder="Apollo Hospital Mumbai" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-500">Official Email</label>
                  <input required type="email" name="email" value={hospitalData.email} onChange={handleHospitalChange} className={inputClass} placeholder="admin@hospital.com" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-500">Password</label>
                  <div className="relative">
                    <input required type={showPassword ? 'text' : 'password'} name="password" value={hospitalData.password} onChange={handleHospitalChange} className={`${inputClass} pr-12`} placeholder="Enter password" minLength={6} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-500">Contact Phone</label>
                  <input required type="tel" name="phone" value={hospitalData.phone} onChange={handleHospitalChange} className={inputClass} placeholder="+91 ..." />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase tracking-wider text-slate-500">City</label>
                    <input required type="text" name="city" value={hospitalData.city} onChange={handleHospitalChange} className={inputClass} placeholder="Mumbai" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase tracking-wider text-slate-500">State</label>
                    <input required type="text" name="state" value={hospitalData.state} onChange={handleHospitalChange} className={inputClass} placeholder="Maharashtra" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-500">Address</label>
                  <input required type="text" name="address" value={hospitalData.address} onChange={handleHospitalChange} className={inputClass} placeholder="123 Medical Street" />
                </div>
                <div className="flex items-start gap-3 bg-amber-50 p-4 rounded-xl border border-amber-200">
                  <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-700 leading-relaxed font-medium">
                    Hospital accounts require verification by our admin team before full access is granted. You will be notified once approved.
                  </p>
                </div>
              </>
            )}
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-emerald-600 text-white font-black rounded-2xl shadow-xl shadow-emerald-200 hover:bg-emerald-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating Account...' : role === 'patient' ? 'Create Patient Account' : 'Register Hospital'}
          </button>

          <div className="flex items-start gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
            <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
              Your data is stored securely and only shared with verified partners. We follow HIPAA and GDPR guidelines for medical data privacy.
            </p>
          </div>

          <div className="text-center text-sm">
            <p className="text-slate-500">Already have an account? <Link to="/login" className="text-emerald-600 font-bold">Log in</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
