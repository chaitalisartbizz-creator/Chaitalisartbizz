import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { ChevronLeft, ArrowRight, Lock, Mail, User, ShieldCheck } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login, register } = useAuth();
  const { frontendSettings } = useData();
  const settings = frontendSettings || {};
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (isLogin) {
        await login(email, password);
      } else {
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
      await login('admin@fortunefood.com', 'admin123');
      navigate('/admin');
    } catch (err) {
      // Fallback local auth simulation
      navigate('/admin');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1c0c03] text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glowing organic amber lights */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#d97706]/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#5c3110]/30 rounded-full blur-[140px] pointer-events-none" />
      
      <button 
        onClick={() => navigate(-1)} 
        className="absolute top-6 left-6 z-20 flex items-center gap-2 text-amber-200 hover:text-white transition-colors bg-white/5 px-4 py-2 rounded-xl backdrop-blur-sm border border-amber-400/20"
      >
        <ChevronLeft size={16} /> Back to Store
      </button>

      <ScrollReveal>
        <div className="w-full max-w-md relative z-10">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden border-2 border-amber-400/40 p-2 shadow-2xl">
              <img src="/logo.png" alt="Fortune Food Logo" className="w-full h-full object-contain" />
            </div>
            <h1 className="font-cinzel font-bold text-3xl text-amber-100">
              {isLogin ? 'Welcome to Fortune Food' : 'Join Purity Rewards'}
            </h1>
            <p className="text-amber-200/70 text-xs mt-1.5">
              {isLogin ? 'Sign in to access organic harvest orders & rewards.' : 'Create an account for 100% pure organic delights.'}
            </p>
          </div>

          <div className="bg-[#2a1405]/90 border border-amber-400/30 rounded-3xl p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
            
            <form onSubmit={handleSubmit} className="relative z-10 flex flex-col gap-4">
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl text-xs text-center font-bold">
                  {error}
                </div>
              )}

              {!isLogin && (
                <div>
                  <label className="text-[11px] font-bold text-amber-200/80 uppercase tracking-wider mb-1 block">Full Name</label>
                  <div className="relative">
                    <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-200/40" />
                    <input 
                      type="text" 
                      required 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-black/40 border border-amber-400/20 focus:border-[#d97706] rounded-xl pl-11 pr-4 py-3 text-white placeholder-amber-200/30 text-sm outline-none transition-all"
                      placeholder="e.g. Ananya Sharma"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-[11px] font-bold text-amber-200/80 uppercase tracking-wider mb-1 block">Email / Username</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-200/40" />
                  <input 
                    type="text" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-black/40 border border-amber-400/20 focus:border-[#d97706] rounded-xl pl-11 pr-4 py-3 text-white placeholder-amber-200/30 text-sm outline-none transition-all"
                    placeholder="customer@fortunefood.com"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold text-amber-200/80 uppercase tracking-wider block">Password</label>
                </div>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-200/40" />
                  <input 
                    type="password" 
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-black/40 border border-amber-400/20 focus:border-[#d97706] rounded-xl pl-11 pr-4 py-3 text-white placeholder-amber-200/30 text-sm outline-none transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#5c3110] via-[#d97706] to-[#b45309] text-amber-100 font-bold py-3.5 rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-70"
              >
                {loading ? 'Authenticating...' : (isLogin ? 'Sign In' : 'Register Account')}
                {!loading && <ArrowRight size={16} />}
              </button>
            </form>

            {/* Quick Demo Credentials for Testing */}
            <div className="mt-6 pt-4 border-t border-amber-400/20">
              <button 
                onClick={handleDemoAdmin}
                className="w-full bg-amber-400/10 border border-amber-400/30 text-amber-200 hover:bg-amber-400 hover:text-stone-950 font-bold py-2.5 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5"
              >
                <ShieldCheck size={16} /> Demo Admin Portal Access 🔑
              </button>
            </div>

            <div className="relative z-10 mt-6 text-center">
              <p className="text-xs text-amber-200/60">
                {isLogin ? "New to Fortune Food?" : "Already a member?"}
                <button 
                  onClick={() => { setIsLogin(!isLogin); setError(''); }} 
                  className="text-amber-400 font-bold ml-1.5 hover:underline"
                >
                  {isLogin ? "Create Account" : "Log In"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}
