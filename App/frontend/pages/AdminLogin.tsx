import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (email === 'admin@afrihealth.com' && password === 'password') {
      navigate('/admin');
    } else {
      setError('Invalid admin credentials');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-black text-gray-900">Admin Access</h1>
          <p className="text-gray-500 font-medium">IMAP Platform Administration</p>
        </div>

        <form onSubmit={handleLogin} className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm space-y-6">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-gray-500 flex items-center gap-2">
                <Mail className="w-3 h-3" /> Admin Email
              </label>
              <input 
                required 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                placeholder="admin@afrihealth.com" 
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-gray-500 flex items-center gap-2">
                <Lock className="w-3 h-3" /> Password
              </label>
              <input 
                required 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                placeholder="••••••••" 
              />
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
            className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-200 hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            Access Admin Dashboard <ArrowRight className="w-5 h-5" />
          </button>
        </form>
        
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-xs text-blue-800 font-medium text-center">
          <strong>Credentials:</strong> admin@afrihealth.com / password
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;