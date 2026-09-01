import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import axios from 'axios';
import { ChevronLeft, ArrowRight, Lock, Phone, User, ShieldCheck, PhoneCall, KeyRound } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';

export default function LoginPage() {
  const [step, setStep] = useState(1); // 1: phone, 2: password (login), 3: name+password (register), 4: forgot
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login, register } = useAuth();
  const { frontendSettings } = useData();
  const navigate = useNavigate();

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      setError('Please enter a valid phone number');
      return;
    }
    setLoading(true);
    setError('');
    
    try {
      const email = `${phone}@chaitaliartbizz.com`;
      const res = await axios.post('/api/auth/check', { email });
      if (res.data.exists) {
        setStep(2); // Login
      } else {
        setStep(3); // Register
      }
    } catch (err) {
      setError('Failed to check account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const email = `${phone}@chaitaliartbizz.com`;
    
    try {
      if (step === 2) {
        // Login
        await login(email, password);
      } else if (step === 3) {
        // Register
        await register(name, email, password);
      }
      navigate('/account');
    } catch (err) {
      setError(err.message || 'Authentication failed. Try demo login below.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoAdmin = async () => {
    setLoading(true);
    try {
      await login('admin@chaitaliartbizz.com', 'admin123');
      navigate('/admin');
    } catch (err) {
      navigate('/admin');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Artistic Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#C9A84C]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#8B5E7A]/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#C0737A]/10 rounded-full blur-[100px] pointer-events-none" />
      
      <button 
        onClick={() => step > 1 ? setStep(1) : navigate(-1)} 
        className="absolute top-6 left-6 z-20 flex items-center gap-2 text-[#C9A84C] hover:text-white transition-colors bg-white/5 px-4 py-2 rounded-xl backdrop-blur-sm border border-[#C9A84C]/20"
      >
        <ChevronLeft size={16} /> {step > 1 ? 'Back' : 'Back to Art Store'}
      </button>

      <ScrollReveal>
        <div className="w-full max-w-md relative z-10">
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-[#2C2C2C] rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden border-2 border-[#C9A84C]/50 shadow-2xl">
              <img src="/logo.jpg" alt="Chaitali's Artbizz Logo" className="w-full h-full object-cover rounded-full" />
            </div>
            <h1 className="font-cinzel font-bold text-3xl text-[#F0DFA0]">
              {step === 1 ? "Welcome to Chaitali's Artbizz" : 
               step === 2 ? 'Welcome Back!' : 
               step === 3 ? 'Join Our Creative Family' : 'Reset Password'}
            </h1>
            <p className="text-[#C9A84C]/70 text-xs mt-1.5">
              {step === 1 ? 'Enter your mobile number to sign in or create an account.' : 
               step === 2 ? 'Please enter your password to continue.' : 
               step === 3 ? 'Create a password for your new account.' : ''}
            </p>
          </div>

          <div className="bg-[#2C2C2C]/90 border border-[#C9A84C]/30 rounded-3xl p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
            
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl text-xs text-center font-bold mb-4">
                {error}
              </div>
            )}

            {step === 1 && (
              <form onSubmit={handlePhoneSubmit} className="relative z-10 flex flex-col gap-4">
                <div>
                  <label className="text-[11px] font-bold text-[#C9A84C]/80 uppercase tracking-wider mb-1 block">Mobile Number</label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C9A84C]/40" />
                    <input 
                      type="tel" 
                      required 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 15))}
                      className="w-full bg-black/40 border border-[#C9A84C]/20 focus:border-[#C9A84C] rounded-xl pl-11 pr-4 py-3 text-white placeholder-[#C9A84C]/30 text-sm outline-none transition-all"
                      placeholder="e.g. 9876543210"
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading || phone.length < 10}
                  className="w-full bg-gradient-to-r from-[#A8873A] via-[#C9A84C] to-[#A8873A] text-[#1A1A1A] font-bold py-3.5 rounded-xl hover:shadow-lg hover:shadow-[#C9A84C]/30 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-70"
                >
                  {loading ? 'Checking...' : 'Continue'}
                  {!loading && <ArrowRight size={16} />}
                </button>
              </form>
            )}

            {(step === 2 || step === 3) && (
              <form onSubmit={handleAuthSubmit} className="relative z-10 flex flex-col gap-4">
                <div className="mb-2 p-3 bg-white/5 border border-white/10 rounded-xl flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#C9A84C]/20 flex items-center justify-center">
                    <Phone size={14} className="text-[#C9A84C]" />
                  </div>
                  <div>
                    <p className="text-[10px] text-[#C9A84C]/60 uppercase tracking-wider font-bold">Mobile Number</p>
                    <p className="text-sm font-semibold">{phone}</p>
                  </div>
                  <button type="button" onClick={() => setStep(1)} className="ml-auto text-xs text-[#C9A84C] hover:underline font-bold">Edit</button>
                </div>

                {step === 3 && (
                  <div>
                    <label className="text-[11px] font-bold text-[#C9A84C]/80 uppercase tracking-wider mb-1 block">Full Name</label>
                    <div className="relative">
                      <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C9A84C]/40" />
                      <input 
                        type="text" 
                        required 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-black/40 border border-[#C9A84C]/20 focus:border-[#C9A84C] rounded-xl pl-11 pr-4 py-3 text-white placeholder-[#C9A84C]/30 text-sm outline-none transition-all"
                        placeholder="e.g. Ananya Sharma"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold text-[#C9A84C]/80 uppercase tracking-wider block">Password</label>
                  </div>
                  <div className="relative">
                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C9A84C]/40" />
                    <input 
                      type="password" 
                      required 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-black/40 border border-[#C9A84C]/20 focus:border-[#C9A84C] rounded-xl pl-11 pr-4 py-3 text-white placeholder-[#C9A84C]/30 text-sm outline-none transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#A8873A] via-[#C9A84C] to-[#A8873A] text-[#1A1A1A] font-bold py-3.5 rounded-xl hover:shadow-lg hover:shadow-[#C9A84C]/30 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-70"
                >
                  {loading ? 'Authenticating...' : (step === 2 ? 'Sign In' : 'Create Account')}
                  {!loading && <ArrowRight size={16} />}
                </button>

                {step === 2 && (
                  <div className="text-center mt-2">
                    <button 
                      type="button"
                      onClick={() => setStep(4)}
                      className="text-xs text-[#C9A84C]/80 hover:text-[#C9A84C] font-bold transition-colors"
                    >
                      Forgot Password?
                    </button>
                  </div>
                )}
              </form>
            )}

            {step === 4 && (
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-[#C9A84C]/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#C9A84C]/40">
                  <KeyRound size={28} className="text-[#C9A84C]" />
                </div>
                <h3 className="text-lg font-bold text-[#F0DFA0] mb-2">Need to reset your password?</h3>
                <p className="text-sm text-white/80 mb-6">
                  For security reasons, please contact our support team to reset your password or recover your account.
                </p>
                <a 
                  href="tel:7020821578"
                  className="inline-flex items-center gap-2 bg-[#C9A84C] text-[#1A1A1A] font-bold px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-[#C9A84C]/30 transition-all mb-4"
                >
                  <PhoneCall size={18} /> Call Support: 7020821578
                </a>
                <div className="mt-2">
                  <button 
                    onClick={() => setStep(2)}
                    className="text-sm text-[#C9A84C] font-bold hover:underline"
                  >
                    Back to Login
                  </button>
                </div>
              </div>
            )}

            {/* Demo Admin Access */}
            {step === 1 && (
              <div className="mt-6 pt-4 border-t border-[#C9A84C]/20">
                <button 
                  onClick={handleDemoAdmin}
                  className="w-full bg-[#C9A84C]/10 border border-[#C9A84C]/30 text-[#C9A84C] hover:bg-[#C9A84C] hover:text-[#1A1A1A] font-bold py-2.5 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5"
                >
                  <ShieldCheck size={16} /> Admin Portal Access ⚡
                </button>
              </div>
            )}
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}
