import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, X, Send, Sparkles, ShieldCheck } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export default function ChatBot() {
  const { user, login, register, checkUserExists, isAuthenticated } = useAuth();
  const { frontendSettings } = useData();
  const settings = frontendSettings || {};
  const navigate = useNavigate();
  
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [step, setStep] = useState('INITIAL');
  
  const [capturedName, setCapturedName] = useState('');
  const [capturedContact, setCapturedContact] = useState('');
  const [authMode, setAuthMode] = useState('');
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  // Auto-open chatbot assistant after 12 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen((prev) => prev || true);
    }, 12000);
    return () => clearTimeout(timer);
  }, []);

  // Initialize greeting
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      if (isAuthenticated) {
        setStep('MAIN_MENU');
        setMessages([
          { sender: 'bot', text: `Welcome back to Chaitali's Artbizz, ${user?.name?.split(' ')[0]}! ✨ How can I assist you with your creative art projects today?`, isMenu: true }
        ]);
      } else {
        setStep('ASK_NAME');
        setMessages([
          { sender: 'bot', text: `Greetings! I am your Artbizz Assistant. May I know your name to recommend our unique resin artworks and custom pieces?` }
        ]);
      }
    }
  }, [isOpen, isAuthenticated, user, messages.length]);

  const addMessage = (text, sender, isMenu = false) => {
    setMessages(prev => [...prev, { text, sender, isMenu }]);
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;
    const input = inputValue.trim();
    setInputValue('');

    if (step === 'VERIFY_AUTH') {
      addMessage('••••••••', 'user');
    } else {
      addMessage(input, 'user');
    }

    if (step === 'ASK_NAME') {
      setCapturedName(input);
      setStep('ASK_CONTACT');
      setTimeout(() => {
        addMessage(`Pleasure to meet you, ${input}! Please share your phone or email so we can save your art preferences.`, 'bot');
      }, 500);
      return;
    }

    if (step === 'ASK_CONTACT') {
      setCapturedContact(input);
      setLoading(true);
      
      try {
        const exists = await checkUserExists(input);
        if (exists) {
          setAuthMode('login');
          setStep('VERIFY_AUTH');
          addMessage('Welcome back! Please enter your password to access your VIP Artbizz account.', 'bot');
        } else {
          setAuthMode('register');
          setStep('VERIFY_AUTH');
          addMessage("Welcome to the Chaitali's Artbizz family! Create a password to claim your welcome discount.", 'bot');
        }
      } catch (err) {
        console.error(err);
        addMessage("Something went wrong. Please try again.", 'bot');
      } finally {
        setLoading(false);
      }
      return;
    }

    if (step === 'VERIFY_AUTH') {
      setLoading(true);
      try {
        if (authMode === 'login') {
          await login(capturedContact, input);
        } else {
          await register(capturedName, capturedContact, input);
        }
        setStep('MAIN_MENU');
        addMessage("You are successfully logged in! How can I serve you today?", 'bot', true);
      } catch (err) {
        addMessage(err.message + ". Please try again.", 'bot');
      } finally {
        setLoading(false);
      }
      return;
    }
  };

  const handleMenuAction = (action) => {
    if (action === 'shop') {
      navigate('/category');
      setIsOpen(false);
    } else if (action === 'purity') {
      navigate('/hub');
      setIsOpen(false);
    } else if (action === 'offers') {
      navigate('/offers');
      setIsOpen(false);
    } else if (action === 'track') {
      navigate('/account');
      setIsOpen(false);
    }
  };

  return (
    <>
      <div className="fixed bottom-24 md:bottom-6 right-5 z-[110]">
        <AnimatePresence>
          {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute bottom-16 right-0 w-[calc(100vw-2.5rem)] sm:w-96 bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#C9A84C]/30 flex flex-col"
                style={{ height: '520px', maxHeight: '82vh' }}
              >
              {/* Header */}
              <div className="bg-gradient-to-r from-[#2C2C2C] via-[#1A1A1A] to-[#2C2C2C] p-4 flex items-center justify-between shadow-md">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full border-2 border-[#C9A84C] bg-white p-0.5 flex items-center justify-center overflow-hidden flex-shrink-0">
                    <img src="/logo.jpg" alt="Artbizz Logo" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <h3 className="text-[#F2EDE4] font-bold leading-tight font-cinzel text-sm">Artbizz Assistant</h3>
                    <p className="text-[#C9A84C] text-[10px] uppercase font-bold tracking-wider flex items-center gap-1">
                      <ShieldCheck size={11} className="text-emerald-400" /> Premium Quality
                    </p>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-[#F2EDE4] hover:text-white transition-colors p-1 bg-black/20 rounded-full hover:bg-black/40">
                  <X size={18} />
                </button>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 bg-[#F2EDE4]/30 flex flex-col gap-3.5">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm shadow-sm ${msg.sender === 'user' ? 'bg-[#2C2C2C] text-[#C9A84C] rounded-tr-xs font-medium' : 'bg-white border border-[#C9A84C]/40 text-stone-800 rounded-tl-xs'}`}>
                      {msg.text}
                      {msg.isMenu && (
                        <div className="mt-3 flex flex-col gap-2">
                          <button onClick={() => handleMenuAction('shop')} className="w-full bg-[#F2EDE4]/50 hover:bg-[#F2EDE4] text-[#2C2C2C] border border-[#C9A84C]/40 py-2 px-3 rounded-xl text-xs font-bold transition-colors text-left flex items-center gap-2">
                            <span>🎨</span> Explore Art Collections
                          </button>
                          <button onClick={() => handleMenuAction('purity')} className="w-full bg-[#F2EDE4]/50 hover:bg-[#F2EDE4] text-[#2C2C2C] border border-[#C9A84C]/40 py-2 px-3 rounded-xl text-xs font-bold transition-colors text-left flex items-center gap-2">
                            <span>✨</span> Custom Portrait Request
                          </button>
                          <button onClick={() => handleMenuAction('offers')} className="w-full bg-[#F2EDE4]/50 hover:bg-[#F2EDE4] text-[#2C2C2C] border border-[#C9A84C]/40 py-2 px-3 rounded-xl text-xs font-bold transition-colors text-left flex items-center gap-2">
                            <span>🎁</span> Exclusive Offers
                          </button>
                          <button onClick={() => handleMenuAction('track')} className="w-full bg-[#F2EDE4]/50 hover:bg-[#F2EDE4] text-[#2C2C2C] border border-[#C9A84C]/40 py-2 px-3 rounded-xl text-xs font-bold transition-colors text-left flex items-center gap-2">
                            <span>📦</span> Track My Request
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-[#C9A84C]/40 p-3 rounded-2xl rounded-tl-xs shadow-sm flex items-center gap-2">
                      <div className="w-2 h-2 bg-[#C9A84C] rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-[#C9A84C] rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
                      <div className="w-2 h-2 bg-[#C9A84C] rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              {step !== 'MAIN_MENU' && (
                <div className="p-3.5 bg-white border-t border-[#C9A84C]/30">
                  <div className="flex items-center gap-2">
                    <input
                      type={step === 'VERIFY_AUTH' ? 'password' : 'text'}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                      disabled={loading}
                      placeholder={step === 'VERIFY_AUTH' ? "Enter password..." : "Type your message..."}
                      className="flex-1 bg-[#F2EDE4]/30 border border-[#C9A84C]/30 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#C9A84C] transition-all disabled:opacity-50"
                    />
                    <button
                      onClick={handleSend}
                      disabled={!inputValue.trim() || loading}
                      className="bg-gradient-to-r from-[#2C2C2C] to-[#1A1A1A] hover:shadow-lg text-[#C9A84C] p-2.5 rounded-xl transition-all disabled:opacity-50 shadow-md"
                    >
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* WhatsApp direct line */}
        {!isOpen && (
          <a
            href="https://wa.me/919876543210?text=Hi%20Artbizz%2C%20I%20would%20like%20to%20inquire%20about%20a%20custom%20artwork"
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-[72px] right-1 w-12 h-12 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform"
            aria-label="Chat on WhatsApp"
          >
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M12.031 0C5.38 0 0 5.383 0 12.037c0 2.128.552 4.195 1.6 6.02L.15 23.4l5.485-1.439a11.967 11.967 0 006.396 1.836h.005c6.648 0 12.032-5.385 12.032-12.04C24 5.378 18.681 0 12.031 0zm0 21.8c-1.8 0-3.565-.483-5.11-1.397l-.367-.217-3.8.995 1.016-3.7-.238-.38A9.97 9.97 0 012.035 12.04c0-5.508 4.484-9.995 9.996-9.995 5.512 0 9.994 4.487 9.994 9.995 0 5.51-4.482 9.995-9.994 9.995v.001l-.001-.236zm5.486-7.502c-.302-.151-1.785-.882-2.062-.982-.278-.1-.48-.152-.682.15-.202.302-.783.982-.96 1.182-.176.202-.353.228-.655.076-1.503-.761-2.614-1.424-3.626-2.923-.255-.378-.026-.583.125-.733.136-.135.302-.352.453-.527.151-.177.202-.303.303-.504.1-.202.05-.378-.025-.528-.076-.151-.682-1.641-.934-2.247-.246-.593-.497-.512-.682-.522-.176-.008-.378-.008-.58-.008s-.53.076-.807.378c-.278.303-1.06 1.034-1.06 2.52s1.085 2.923 1.236 3.125c.15.202 2.13 3.25 5.158 4.557 2.052.887 2.872 1.004 3.93 1.004.832 0 2.552-.983 2.898-1.921.346-.94.346-1.745.245-1.921-.1-.176-.378-.278-.68-.428z" />
            </svg>
          </a>
        )}

        {/* Toggle Floating Action Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 bg-gradient-to-tr from-[#2C2C2C] to-[#1A1A1A] text-[#C9A84C] rounded-full flex items-center justify-center shadow-2xl hover:shadow-[0_0_25px_rgba(201,168,76,0.5)] transition-all transform hover:scale-105 active:scale-95 border-2 border-[#C9A84C]/30 relative z-10"
        >
          {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
        </button>
      </div>
    </>
  );
}
