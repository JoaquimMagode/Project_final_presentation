import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../App';
import { ShieldCheck, Eye, EyeOff, AlertCircle, Home, User, Building2, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
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

const STATES = Object.keys(INDIA_STATES).sort();

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
        ? { email: patientData.email, password: patientData.password, name: `${patientData.firstName} ${patientData.lastName}`, phone: patientData.phone, role: 'patient', country: patientData.country }
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

  const inputCls = 'w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:border-transparent transition-all placeholder-gray-400';
  const labelCls = 'block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1';

  const patientBenefits = ['Book appointments at top Indian hospitals', 'Track your medical history', 'Direct communication with hospitals', 'Transparent pricing, no hidden fees'];
  const hospitalBenefits = ['Manage appointments efficiently', 'Access patient information securely', 'Analytics and reporting dashboard', 'Dedicated admin portal'];
  const benefits = role === 'patient' ? patientBenefits : hospitalBenefits;

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-5/12 xl:w-1/2 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 flex-col justify-between p-10 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/5 rounded-full" />
          <div className="absolute top-1/3 -right-20 w-72 h-72 bg-white/5 rounded-full" />
          <div className="absolute -bottom-16 left-1/4 w-64 h-64 bg-white/5 rounded-full" />
        </div>

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <span className="text-white font-bold text-xl tracking-tight">IMAP Solution</span>
        </div>

        {/* Center content */}
        <div className="relative space-y-6">
          <div className="space-y-2">
            <h2 className="text-4xl font-black text-white leading-tight">
              {role === 'patient' ? 'Start Your\nHealing Journey' : 'Grow Your\nHospital Network'}
            </h2>
            <p className="text-emerald-100 text-sm leading-relaxed max-w-xs">
              {role === 'patient'
                ? 'Access world-class medical care in India with zero intermediaries.'
                : 'Connect with international patients seeking quality healthcare in India.'}
            </p>
          </div>

          <div className="space-y-3">
            {benefits.map(b => (
              <div key={b} className="flex items-center gap-3">
                <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-3 h-3 text-white" />
                </div>
                <p className="text-sm text-emerald-100 font-medium">{b}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-emerald-200 text-xs">© 2025 IMAP Solution. All rights reserved.</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col bg-white overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100 flex-shrink-0">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 font-medium transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <div className="flex items-center gap-2 lg:hidden">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="font-bold text-gray-900 text-sm">IMAP Solution</span>
          </div>
          <button onClick={() => navigate('/')} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-emerald-600 font-medium transition-colors">
            <Home className="w-4 h-4" /> Home
          </button>
        </div>

        {/* Form area */}
        <div className="flex-1 flex items-center justify-center px-6 overflow-y-auto">
          <div className="w-full max-w-sm space-y-4 py-4">
            {/* Heading */}
            <div>
              <h1 className="text-xl font-black text-gray-900">Create account</h1>
              <p className="text-xs text-gray-500 mt-0.5">Join IMAP Solution to start your medical journey</p>
            </div>

            {/* Role toggle */}
            <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
              <button type="button" onClick={() => setRole('patient')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-xs font-bold transition-all ${role === 'patient' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
                <User className="w-3.5 h-3.5" /> Patient
              </button>
              <button type="button" onClick={() => setRole('hospital_admin')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-xs font-bold transition-all ${role === 'hospital_admin' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
                <Building2 className="w-3.5 h-3.5" /> Hospital
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              {role === 'patient' ? (
                <>
                  <div className="grid grid-cols-2 gap-2">
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
                    <input required type="email" name="email" value={patientData.email} onChange={handlePatientChange} className={inputCls} placeholder="you@email.com" />
                  </div>
                  <div>
                    <label className={labelCls}>Password</label>
                    <div className="relative">
                      <input required type={showPassword ? 'text' : 'password'} name="password" value={patientData.password} onChange={handlePatientChange} className={`${inputCls} pr-9`} placeholder="Min. 6 characters" minLength={6} />
                      <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Country of Residence</label>
                    <select required name="country" value={patientData.country} onChange={handlePatientChange} className={inputCls}>
                      <option value="">Select country</option>
                      {['Nigeria', 'Mozambique', 'Kenya', 'Ghana', 'South Africa', 'Tanzania', 'Uganda', 'Ethiopia', 'Other'].map(c => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>WhatsApp Number</label>
                    <input required type="tel" name="phone" value={patientData.phone} onChange={handlePatientChange} className={inputCls} placeholder="+234 ..." />
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
                    <input required type="email" name="email" value={hospitalData.email} onChange={handleHospitalChange} className={inputCls} placeholder="admin@hospital.com" />
                  </div>
                  <div>
                    <label className={labelCls}>Password</label>
                    <div className="relative">
                      <input required type={showPassword ? 'text' : 'password'} name="password" value={hospitalData.password} onChange={handleHospitalChange} className={`${inputCls} pr-9`} placeholder="Min. 6 characters" minLength={6} />
                      <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Contact Phone</label>
                    <input required type="tel" name="phone" value={hospitalData.phone} onChange={handleHospitalChange} className={inputCls} placeholder="+91 ..." />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className={labelCls}>City</label>
                      <input required type="text" name="city" value={hospitalData.city} onChange={handleHospitalChange} className={inputCls} placeholder="Mumbai" />
                    </div>
                    <div>
                      <label className={labelCls}>State</label>
                      <input required type="text" name="state" value={hospitalData.state} onChange={handleHospitalChange} className={inputCls} placeholder="Maharashtra" />
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Address</label>
                    <input required type="text" name="address" value={hospitalData.address} onChange={handleHospitalChange} className={inputCls} placeholder="123 Medical Street" />
                  </div>
                  <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-700 font-medium">Hospital accounts require admin verification before full access is granted.</p>
                  </div>
                </>
              )}

              {error && (
                <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />{error}
                </div>
              )}

              <button type="submit" disabled={loading}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-all shadow-sm disabled:opacity-50 active:scale-[0.98]">
                {loading ? 'Creating account...' : role === 'patient' ? 'Create Patient Account' : 'Register Hospital'}
                <ArrowRight className="w-4 h-4" />
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
