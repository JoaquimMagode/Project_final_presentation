import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../App';
import { ShieldCheck, Eye, EyeOff, AlertCircle, Home, User, Building2, ArrowRight, ArrowLeft, CheckCircle, HeartPulse } from 'lucide-react';
import { authAPI } from '../services/api';

const INDIA_STATES: Record<string, string[]> = {
  'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Kurnool', 'Tirupati', 'Rajahmundry', 'Kakinada', 'Kadapa', 'Anantapur'],
  'Arunachal Pradesh': ['Itanagar', 'Naharlagun', 'Pasighat', 'Tawang', 'Ziro', 'Bomdila'],
  'Assam': ['Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat', 'Nagaon', 'Tinsukia', 'Tezpur', 'Bongaigaon', 'Dhubri'],
  'Bihar': ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Purnia', 'Darbhanga', 'Bihar Sharif', 'Arrah', 'Begusarai', 'Katihar'],
  'Chhattisgarh': ['Raipur', 'Bhilai', 'Bilaspur', 'Korba', 'Durg', 'Rajnandgaon', 'Jagdalpur', 'Raigarh', 'Ambikapur'],
  'Goa': ['Panaji', 'Margao', 'Vasco da Gama', 'Mapusa', 'Ponda', 'Bicholim'],
  'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar', 'Junagadh', 'Gandhinagar', 'Anand', 'Navsari', 'Morbi', 'Mehsana'],
  'Haryana': ['Faridabad', 'Gurgaon', 'Panipat', 'Ambala', 'Yamunanagar', 'Rohtak', 'Hisar', 'Karnal', 'Sonipat', 'Panchkula'],
  'Himachal Pradesh': ['Shimla', 'Dharamshala', 'Solan', 'Mandi', 'Kullu', 'Manali', 'Baddi', 'Nahan', 'Palampur'],
  'Jharkhand': ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro', 'Deoghar', 'Phusro', 'Hazaribagh', 'Giridih', 'Ramgarh'],
  'Karnataka': ['Bangalore', 'Mysore', 'Hubli', 'Mangalore', 'Belgaum', 'Gulbarga', 'Davanagere', 'Bellary', 'Bijapur', 'Shimoga', 'Tumkur', 'Udupi'],
  'Kerala': ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Kollam', 'Palakkad', 'Alappuzha', 'Malappuram', 'Kannur', 'Kottayam'],
  'Madhya Pradesh': ['Bhopal', 'Indore', 'Jabalpur', 'Gwalior', 'Ujjain', 'Sagar', 'Dewas', 'Satna', 'Ratlam', 'Rewa', 'Murwara', 'Singrauli'],
  'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Thane', 'Nashik', 'Aurangabad', 'Solapur', 'Kolhapur', 'Amravati', 'Nanded', 'Sangli', 'Jalgaon', 'Akola', 'Latur'],
  'Manipur': ['Imphal', 'Thoubal', 'Bishnupur', 'Churachandpur', 'Senapati'],
  'Meghalaya': ['Shillong', 'Tura', 'Jowai', 'Nongstoin', 'Williamnagar'],
  'Mizoram': ['Aizawl', 'Lunglei', 'Champhai', 'Serchhip', 'Kolasib'],
  'Nagaland': ['Kohima', 'Dimapur', 'Mokokchung', 'Tuensang', 'Wokha'],
  'Odisha': ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Brahmapur', 'Sambalpur', 'Puri', 'Balasore', 'Bhadrak', 'Baripada', 'Jharsuguda'],
  'Punjab': ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda', 'Mohali', 'Firozpur', 'Pathankot', 'Hoshiarpur', 'Batala'],
  'Rajasthan': ['Jaipur', 'Jodhpur', 'Kota', 'Bikaner', 'Ajmer', 'Udaipur', 'Bhilwara', 'Alwar', 'Bharatpur', 'Sikar', 'Pali', 'Sri Ganganagar'],
  'Sikkim': ['Gangtok', 'Namchi', 'Gyalshing', 'Mangan'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli', 'Tiruppur', 'Vellore', 'Erode', 'Thoothukudi', 'Dindigul', 'Thanjavur'],
  'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Ramagundam', 'Khammam', 'Mahbubnagar', 'Nalgonda', 'Adilabad', 'Suryapet'],
  'Tripura': ['Agartala', 'Dharmanagar', 'Udaipur', 'Kailasahar', 'Belonia'],
  'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Agra', 'Varanasi', 'Meerut', 'Allahabad', 'Bareilly', 'Aligarh', 'Moradabad', 'Saharanpur', 'Gorakhpur', 'Noida', 'Ghaziabad', 'Mathura', 'Firozabad'],
  'Uttarakhand': ['Dehradun', 'Haridwar', 'Roorkee', 'Haldwani', 'Rudrapur', 'Kashipur', 'Rishikesh', 'Nainital', 'Mussoorie'],
  'West Bengal': ['Kolkata', 'Howrah', 'Durgapur', 'Asansol', 'Siliguri', 'Bardhaman', 'Malda', 'Baharampur', 'Habra', 'Kharagpur', 'Shantipur', 'Dankuni'],
  'Delhi': ['New Delhi', 'Dwarka', 'Rohini', 'Janakpuri', 'Laxmi Nagar', 'Saket', 'Pitampura', 'Karol Bagh', 'Connaught Place', 'Vasant Kunj'],
  'Jammu & Kashmir': ['Srinagar', 'Jammu', 'Anantnag', 'Sopore', 'Baramulla', 'Kathua', 'Udhampur'],
  'Ladakh': ['Leh', 'Kargil'],
  'Chandigarh': ['Chandigarh'],
  'Puducherry': ['Puducherry', 'Karaikal', 'Mahe', 'Yanam'],
  'Andaman & Nicobar Islands': ['Port Blair', 'Diglipur', 'Rangat'],
  'Dadra & Nagar Haveli and Daman & Diu': ['Daman', 'Diu', 'Silvassa'],
  'Lakshadweep': ['Kavaratti', 'Agatti', 'Amini'],
};

const COUNTRY_CODES = [
  { flag: '🇳🇬', name: 'Nigeria', code: '+234' },
  { flag: '🇲🇿', name: 'Mozambique', code: '+258' },
  { flag: '🇰🇪', name: 'Kenya', code: '+254' },
  { flag: '🇬🇭', name: 'Ghana', code: '+233' },
  { flag: '🇿🇦', name: 'South Africa', code: '+27' },
  { flag: '🇹🇿', name: 'Tanzania', code: '+255' },
  { flag: '🇺🇬', name: 'Uganda', code: '+256' },
  { flag: '🇪🇹', name: 'Ethiopia', code: '+251' },
  { flag: '🇮🇳', name: 'India', code: '+91' },
  { flag: '🇺🇸', name: 'United States', code: '+1' },
  { flag: '🇬🇧', name: 'United Kingdom', code: '+44' },
  { flag: '🇦🇪', name: 'UAE', code: '+971' },
  { flag: '🇸🇦', name: 'Saudi Arabia', code: '+966' },
  { flag: '🇶🇦', name: 'Qatar', code: '+974' },
  { flag: '🇰🇼', name: 'Kuwait', code: '+965' },
  { flag: '🇧🇭', name: 'Bahrain', code: '+973' },
  { flag: '🇴🇲', name: 'Oman', code: '+968' },
  { flag: '🇨🇦', name: 'Canada', code: '+1' },
  { flag: '🇦🇺', name: 'Australia', code: '+61' },
  { flag: '🇸🇬', name: 'Singapore', code: '+65' },
  { flag: '🇲🇾', name: 'Malaysia', code: '+60' },
  { flag: '🇧🇩', name: 'Bangladesh', code: '+880' },
  { flag: '🇵🇰', name: 'Pakistan', code: '+92' },
  { flag: '🇳🇵', name: 'Nepal', code: '+977' },
  { flag: '🇱🇰', name: 'Sri Lanka', code: '+94' },
  { flag: '🇿🇲', name: 'Zambia', code: '+260' },
  { flag: '🇿🇼', name: 'Zimbabwe', code: '+263' },
  { flag: '🇷🇼', name: 'Rwanda', code: '+250' },
  { flag: '🇸🇳', name: 'Senegal', code: '+221' },
  { flag: '🇨🇮', name: "Côte d'Ivoire", code: '+225' },
  { flag: '🇨🇲', name: 'Cameroon', code: '+237' },
  { flag: '🇩🇿', name: 'Algeria', code: '+213' },
  { flag: '🇲🇦', name: 'Morocco', code: '+212' },
  { flag: '🇪🇬', name: 'Egypt', code: '+20' },
  { flag: '🌍', name: 'Other', code: '+0' },
];

const STATES = Object.keys(INDIA_STATES).sort();

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [role, setRole] = useState<'patient' | 'hospital_admin'>('patient');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [patientData, setPatientData] = useState({ firstName: '', lastName: '', email: '', password: '', phone: '', country: '' });
  const [phonePrefix, setPhonePrefix] = useState('+234');
  const [hospitalData, setHospitalData] = useState({ hospitalName: '', email: '', password: '', phone: '', city: '', state: '', address: '' });

  const handlePatientChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPatientData(prev => ({ ...prev, [name]: value }));
    if (name === 'country') {
      const found = COUNTRY_CODES.find(c => c.name === value);
      if (found) setPhonePrefix(found.code);
    }
    if (error) setError('');
  };

  const handleHospitalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (e.target.name === 'state') {
      setHospitalData(prev => ({ ...prev, state: e.target.value, city: '' }));
    } else {
      setHospitalData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }
    if (error) setError('');
  };

  const availableCities = hospitalData.state ? INDIA_STATES[hospitalData.state] || [] : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const userData = role === 'patient'
        ? { email: patientData.email, password: patientData.password, name: `${patientData.firstName} ${patientData.lastName}`, phone: `${phonePrefix}${patientData.phone}`, role: 'patient', country: patientData.country }
        : { email: hospitalData.email, password: hospitalData.password, name: hospitalData.hospitalName, phone: hospitalData.phone, role: 'hospital_admin' };

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

  const inputCls = `w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900
    outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent focus:bg-white
    transition-all placeholder-slate-400`;
  const labelCls = 'block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5';

  const patientBenefits = ['Book appointments at top Indian hospitals', 'Track your medical history', 'Direct communication with hospitals', 'Transparent pricing, no hidden fees'];
  const hospitalBenefits = ['Manage patient appointments efficiently', 'Access patient information securely', 'Analytics and reporting dashboard', 'Dedicated admin portal'];
  const benefits = role === 'patient' ? patientBenefits : hospitalBenefits;

  return (
    <div className="h-screen flex overflow-hidden">

      {/* ── Left panel ── */}
      <div className="hidden lg:flex lg:w-5/12 xl:w-[45%] flex-col justify-between p-10 relative overflow-hidden
                      bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950">
        {/* blobs */}
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-5 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
            <HeartPulse className="w-5 h-5 text-white" />
          </div>
          <span className="text-white font-bold text-xl tracking-tight">
            IMAP <span className="text-emerald-400">Solution</span>
          </span>
        </div>

        {/* Center */}
        <div className="relative space-y-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-xs font-semibold text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {role === 'patient' ? 'Start your medical journey' : 'Grow your hospital network'}
            </div>
            <h2 className="text-4xl font-bold text-white leading-tight">
              {role === 'patient' ? <>Start Your<br /><span className="text-emerald-400">Healing Journey</span></> : <>Grow Your<br /><span className="text-emerald-400">Hospital Network</span></>}
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              {role === 'patient'
                ? 'Access world-class medical care in India with zero intermediaries.'
                : 'Connect with international patients seeking quality healthcare in India.'}
            </p>
          </div>

          <div className="space-y-2.5">
            {benefits.map(b => (
              <div key={b} className="flex items-center gap-3">
                <div className="w-5 h-5 bg-emerald-500/20 border border-emerald-500/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-3 h-3 text-emerald-400" />
                </div>
                <p className="text-sm text-slate-300 font-medium">{b}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-slate-600 text-xs">© {new Date().getFullYear()} IMAP Solution. All rights reserved.</p>
      </div>

      {/* ── Right panel ── */}
      <div className="flex-1 flex flex-col bg-white overflow-hidden">
        {/* top bar */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-slate-100 flex-shrink-0">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <div className="flex items-center gap-2 lg:hidden">
            <div className="w-6 h-6 bg-emerald-600 rounded-lg flex items-center justify-center">
              <HeartPulse className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-slate-900 text-sm">IMAP Solution</span>
          </div>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-emerald-600 font-medium transition-colors"
          >
            <Home className="w-4 h-4" /> Home
          </button>
        </div>

        {/* form */}
        <div className="flex-1 flex items-center justify-center px-6 overflow-y-auto">
          <div className="w-full max-w-sm space-y-5 py-6">

            <div>
              <h1 className="text-2xl font-bold text-slate-900">Create account</h1>
              <p className="text-sm text-slate-500 mt-1">Join IMAP Solution to start your medical journey</p>
            </div>

            {/* Role toggle */}
            <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setRole('patient')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-semibold transition-all
                  ${role === 'patient' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <User className="w-3.5 h-3.5" /> Patient
              </button>
              <button
                type="button"
                onClick={() => setRole('hospital_admin')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-semibold transition-all
                  ${role === 'hospital_admin' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <Building2 className="w-3.5 h-3.5" /> Hospital
              </button>
            </div>

            {/* Form fields */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {role === 'patient' ? (
                <>
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className={labelCls}>First Name</label>
                      <input required type="text" name="firstName" value={patientData.firstName} onChange={handlePatientChange} className={inputCls} placeholder="John" />
                    </div>
                    <div>
                      <label className={labelCls}>Last Name</label>
                      <input required type="text" name="lastName" value={patientData.lastName} onChange={handlePatientChange} className={inputCls} placeholder="Doe" />
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Email Address</label>
                    <input required type="email" name="email" value={patientData.email} onChange={handlePatientChange} className={inputCls} placeholder="you@email.com" autoComplete="email" />
                  </div>
                  <div>
                    <label className={labelCls}>Password</label>
                    <div className="relative">
                      <input required type={showPassword ? 'text' : 'password'} name="password" value={patientData.password} onChange={handlePatientChange} className={`${inputCls} pr-10`} placeholder="Min. 6 characters" minLength={6} />
                      <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Country of Residence</label>
                    <select required name="country" value={patientData.country} onChange={handlePatientChange} className={inputCls}>
                      <option value="">Select your country</option>
                      {COUNTRY_CODES.map(c => (
                        <option key={c.name} value={c.name}>{c.flag} {c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>WhatsApp Number</label>
                    <div className="flex gap-2">
                      <select
                        value={phonePrefix}
                        onChange={e => setPhonePrefix(e.target.value)}
                        className={`${inputCls} w-28 flex-shrink-0`}
                      >
                        {COUNTRY_CODES.map(c => (
                          <option key={c.name} value={c.code}>{c.code}</option>
                        ))}
                      </select>
                      <input required type="tel" name="phone" value={patientData.phone} onChange={handlePatientChange} className={inputCls} placeholder="800 000 0000" />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className={labelCls}>Hospital Name</label>
                    <input required type="text" name="hospitalName" value={hospitalData.hospitalName} onChange={handleHospitalChange} className={inputCls} placeholder="Apollo Hospital Mumbai" />
                  </div>
                  <div>
                    <label className={labelCls}>Official Email</label>
                    <input required type="email" name="email" value={hospitalData.email} onChange={handleHospitalChange} className={inputCls} placeholder="admin@hospital.com" autoComplete="email" />
                  </div>
                  <div>
                    <label className={labelCls}>Password</label>
                    <div className="relative">
                      <input required type={showPassword ? 'text' : 'password'} name="password" value={hospitalData.password} onChange={handleHospitalChange} className={`${inputCls} pr-10`} placeholder="Min. 6 characters" minLength={6} />
                      <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Contact Phone</label>
                    <input required type="tel" name="phone" value={hospitalData.phone} onChange={handleHospitalChange} className={inputCls} placeholder="+91 ..." />
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className={labelCls}>State</label>
                      <select required name="state" value={hospitalData.state} onChange={handleHospitalChange} className={inputCls}>
                        <option value="">Select state</option>
                        {STATES.map(s => <option key={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>City</label>
                      <select required name="city" value={hospitalData.city} onChange={handleHospitalChange} className={`${inputCls} disabled:opacity-40`} disabled={!hospitalData.state}>
                        <option value="">{hospitalData.state ? 'Select city' : 'State first'}</option>
                        {availableCities.map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Address</label>
                    <input required type="text" name="address" value={hospitalData.address} onChange={handleHospitalChange} className={inputCls} placeholder="123 Medical Street" />
                  </div>
                  <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-xl px-3.5 py-2.5">
                    <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-700 font-medium leading-relaxed">Hospital accounts require admin verification before full access is granted.</p>
                  </div>
                </>
              )}

              {error && (
                <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl
                           flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md
                           disabled:opacity-50 text-sm"
              >
                {loading ? (
                  <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating…</>
                ) : (
                  <>{role === 'patient' ? 'Create Patient Account' : 'Register Hospital'} <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </form>

            <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-lg px-3 py-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
              <p className="text-[11px] text-gray-400">Your data is stored securely. HIPAA & GDPR compliant.</p>
            </div>

            <p className="text-center text-xs text-gray-500 pb-2">
              Already have an account?{' '}
              <Link to="/login" className="text-emerald-600 font-bold hover:underline">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
