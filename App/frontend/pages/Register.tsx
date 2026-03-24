
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../App';
import { ShieldCheck, ArrowLeft, Upload, User, Eye, EyeOff, AlertCircle, Home } from 'lucide-react';
import { authAPI, uploadAPI } from '../services/api';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    country: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      
      // Validate file types and sizes
      const validFiles = newFiles.filter(file => {
        const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
        const maxSize = 10 * 1024 * 1024; // 10MB
        
        if (!validTypes.includes(file.type)) {
          setError(`Invalid file type: ${file.name}. Only PDF, JPG, and PNG files are allowed.`);
          return false;
        }
        
        if (file.size > maxSize) {
          setError(`File too large: ${file.name}. Maximum size is 10MB.`);
          return false;
        }
        
        return true;
      });
      
      if (validFiles.length > 0) {
        setUploadedFiles(prev => [...prev, ...validFiles]);
        setError(''); // Clear any previous errors
      }
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userData = {
        email: formData.email,
        password: formData.password,
        name: `${formData.firstName} ${formData.lastName}`,
        phone: formData.phone,
        role: 'patient'
      };

      const response = await authAPI.register(userData);
      
      if (response.success) {
        const { user, token } = response.data;
        
        // Store token
        localStorage.setItem('token', token);
        
        // Upload files if any
        if (uploadedFiles.length > 0) {
          try {
            await uploadAPI.uploadDocuments(uploadedFiles);
          } catch (uploadError) {
            console.warn('File upload failed:', uploadError);
            // Continue with registration even if file upload fails
          }
        }
        
        // Update auth context
        login(user.name, 'PATIENT');
        
        // Navigate to patient dashboard
        navigate('/patient-dashboard', { replace: true });
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
          <h1 className="text-3xl font-black text-slate-900">Create Patient Account</h1>
          <p className="text-slate-500 font-medium">Join IMAP Solution to start your medical journey.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-slate-500">First Name</label>
                <input 
                  required 
                  type="text" 
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 outline-none focus:ring-2 focus:ring-emerald-500 transition-all" 
                  placeholder="John" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-slate-500">Last Name</label>
                <input 
                  required 
                  type="text" 
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 outline-none focus:ring-2 focus:ring-emerald-500 transition-all" 
                  placeholder="Doe" 
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-slate-500">Email Address</label>
              <input 
                required 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 outline-none focus:ring-2 focus:ring-emerald-500 transition-all" 
                placeholder="name@email.com" 
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-slate-500">Password</label>
              <div className="relative">
                <input 
                  required 
                  type={showPassword ? 'text' : 'password'} 
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 pr-12 outline-none focus:ring-2 focus:ring-emerald-500 transition-all" 
                  placeholder="Enter password" 
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-slate-500">Country of Residence</label>
              <select 
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                required
              >
                <option value="">Select Country</option>
                <option value="Nigeria">Nigeria</option>
                <option value="Mozambique">Mozambique</option>
                <option value="Kenya">Kenya</option>
                <option value="Ghana">Ghana</option>
                <option value="South Africa">South Africa</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-slate-500">WhatsApp Number</label>
              <input 
                required 
                type="tel" 
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 outline-none focus:ring-2 focus:ring-emerald-500 transition-all" 
                placeholder="+234 ..." 
              />
            </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-wider text-slate-500">Upload Verification Docs</label>
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
                <p className="text-xs font-bold text-slate-400">Click to upload documents</p>
                <p className="text-xs text-slate-400">PDF, JPG, PNG (ID / Medical Reports)</p>
              </label>
            </div>
            
            {uploadedFiles.length > 0 && (
              <div className="space-y-2 mt-3">
                <p className="text-xs font-bold text-slate-600">Uploaded Files ({uploadedFiles.length})</p>
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-slate-50 p-2 rounded-lg">
                    <span className="text-sm text-slate-700">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-xs text-red-600 hover:text-red-700 font-medium"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 bg-emerald-600 text-white font-black rounded-2xl shadow-xl shadow-emerald-200 hover:bg-emerald-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating Account...' : 'Create Patient Account'}
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
