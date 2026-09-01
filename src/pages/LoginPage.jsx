import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { ChevronLeft, ArrowRight, Lock, ShieldCheck, Mail } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';

export default function LoginPage() {
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [email, setEmail] = useState('chaitalisartbizz@gmail.com');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      await loginWithGoogle();
      navigate('/account');
    } catch (err) {
      setError(err.message || 'Google Sign-In failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Admin authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#C9A84C]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#8B5E7A]/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#C0737A]/10 rounded-full blur-[100px] pointer-events-none" />
      
      <button 
        onClick={() => showAdminLogin ? setShowAdminLogin(false) : navigate(-1)} 
        className="absolute top-6 left-6 z-20 flex items-center gap-2 text-[#C9A84C] hover:text-white transition-colors bg-white/5 px-4 py-2 rounded-xl backdrop-blur-sm border border-[#C9A84C]/20"
      >
        <ChevronLeft size={16} /> {showAdminLogin ? 'Back to Sign In' : 'Back to Art Store'}
      </button>

      <ScrollReveal>
        <div className="w-full max-w-md relative z-10">
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-[#2C2C2C] rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden border-2 border-[#C9A84C]/50 shadow-2xl">
              <img src="/logo.jpg" alt="Chaitali's Artbizz Logo" className="w-full h-full object-cover rounded-full" />
            </div>
            <h1 className="font-cinzel font-bold text-3xl text-[#F0DFA0]">
              {showAdminLogin ? 'Admin Portal' : "Welcome to Chaitali's Artbizz"}
            </h1>
            <p className="text-[#C9A84C]/70 text-sm mt-1.5">
              {showAdminLogin ? 'Secure access for store management.' : 'Sign in to access your orders and exclusive art.'}
            </p>
          </div>

          <div className="bg-[#2C2C2C]/90 border border-[#C9A84C]/30 rounded-3xl p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
            
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl text-xs text-center font-bold mb-4">
                {error}
              </div>
            )}

            {!showAdminLogin ? (
              <div className="relative z-10 flex flex-col gap-4">
                
                <button 
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="w-full bg-white text-gray-800 font-bold py-3.5 rounded-xl hover:bg-gray-100 hover:shadow-lg transition-all flex items-center justify-center gap-3 disabled:opacity-70"
                >
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google Logo" className="w-5 h-5" />
                  {loading ? 'Signing in...' : 'Continue with Google'}
                </button>

                <div className="mt-4 pt-4 border-t border-[#C9A84C]/20">
                  <button 
                    onClick={() => setShowAdminLogin(true)}
                    className="w-full bg-[#C9A84C]/10 border border-[#C9A84C]/30 text-[#C9A84C] hover:bg-[#C9A84C] hover:text-[#1A1A1A] font-bold py-2.5 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5"
                  >
                    <ShieldCheck size={16} /> Admin Portal Access ⚡
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleAdminEmailLogin} className="relative z-10 flex flex-col gap-4">
                
                <button 
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="w-full bg-white text-gray-800 font-bold py-2 rounded-xl hover:bg-gray-100 transition-all flex items-center justify-center gap-2 mb-2 text-sm disabled:opacity-70"
                >
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google Logo" className="w-4 h-4" />
                  Admin Sign in with Google
                </button>

                <div className="flex items-center gap-3 my-2">
                  <div className="h-px bg-[#C9A84C]/20 flex-1"></div>
                  <span className="text-xs text-[#C9A84C]/50 uppercase tracking-widest font-bold">OR Email</span>
                  <div className="h-px bg-[#C9A84C]/20 flex-1"></div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#C9A84C]/80 uppercase tracking-wider mb-1 block">Admin Email</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C9A84C]/40" />
                    <input 
                      type="email" 
                      required 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-black/40 border border-[#C9A84C]/20 focus:border-[#C9A84C] rounded-xl pl-11 pr-4 py-3 text-white placeholder-[#C9A84C]/30 text-sm outline-none transition-all"
                      placeholder="admin@chaitaliartbizz.com"
                    />
                  </div>
                </div>

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
                  {loading ? 'Authenticating...' : 'Sign In as Admin'}
                  {!loading && <ArrowRight size={16} />}
                </button>

              </form>
            )}
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}
