import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, X, Send, ShieldCheck, ChevronDown, RefreshCw, Check, CheckCheck } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
// Quick function to get visitor ID from localStorage
const getVisitorId = () => {
  let vid = localStorage.getItem('visitorId');
  if (!vid) {
    vid = 'v_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('visitorId', vid);
  }
  return vid;
};

// --- Helper for grouping and dates ---
const groupMessages = (messages) => {
  const grouped = [];
  let currentGroup = null;
  let currentDate = null;

  messages.forEach((msg, index) => {
    const msgDate = new Date(msg.timestamp || Date.now());
    const dateString = msgDate.toLocaleDateString();

    if (dateString !== currentDate) {
      grouped.push({ type: 'date', date: dateString });
      currentDate = dateString;
      currentGroup = null; // force new group on new day
    }

    if (!currentGroup || currentGroup.sender !== msg.sender || (msgDate - new Date(currentGroup.messages[currentGroup.messages.length - 1].timestamp)) > 60000) {
      currentGroup = {
        type: 'messageGroup',
        sender: msg.sender,
        messages: []
      };
      grouped.push(currentGroup);
    }
    currentGroup.messages.push({ ...msg, index });
  });

  return grouped;
};

const formatTime = (isoString) => {
  if (!isoString) return '';
  return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export default function ChatBot() {
  const { user, isAuthenticated } = useAuth();
  const { frontendSettings } = useData();
  const navigate = useNavigate();
  
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const messagesEndRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const inputRef = useRef(null);
  const visitorId = getVisitorId();

  // Load chat history from backend on open
  useEffect(() => {
    const loadSession = async () => {
      try {
        const storedSessionId = localStorage.getItem('chatSessionId');
        if (storedSessionId) {
          const res = await axios.get(`${API_URL}/chat/session/${storedSessionId}`);
          setSessionId(res.data.id);
          setMessages(res.data.messages);
        }
      } catch (e) {
        console.error("Failed to load session", e);
      }
    };
    if (isOpen && !sessionId) {
      loadSession();
    }
  }, [isOpen, sessionId]);

  // Initial greeting
  useEffect(() => {
    if (isOpen && messages.length === 0 && !isTyping) {
      const greeting = isAuthenticated 
        ? `Welcome back to Chaitali's Artbizz, ${user?.name?.split(' ')[0] || 'friend'}! ✨ How can I assist you with your creative art projects today?`
        : `Greetings! I am your Artbizz Assistant. How can I help you discover our unique resin artworks today?`;
      
      handleBotResponse(greeting, true);
    }
  }, [isOpen, messages.length, isAuthenticated, user]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    setUnreadCount(0);
  };

  useEffect(() => {
    if (!showScrollButton) {
      scrollToBottom();
    } else {
      if (messages.length > 0 && messages[messages.length - 1].sender === 'bot') {
        setUnreadCount(prev => prev + 1);
      }
    }
  }, [messages]);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const isScrolledUp = scrollHeight - scrollTop - clientHeight > 100;
    setShowScrollButton(isScrolledUp);
    if (!isScrolledUp) setUnreadCount(0);
  };

  const handleInput = (e) => {
    setInputValue(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  };

  const saveMessageToBackend = async (text, sender, currentSessionId = sessionId) => {
    try {
      const res = await axios.post(`${API_URL}/chat/message`, {
        visitorId,
        text,
        sender,
        sessionId: currentSessionId
      });
      if (res.data.sessionId && !currentSessionId) {
        setSessionId(res.data.sessionId);
        localStorage.setItem('chatSessionId', res.data.sessionId);
      }
      return res.data.message;
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;
    const text = inputValue.trim();
    setInputValue('');
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }

    const tempId = Date.now().toString();
    const newUserMsg = { id: tempId, text, sender: 'user', timestamp: new Date().toISOString(), status: 'sending' };
    setMessages(prev => [...prev, newUserMsg]);

    const savedMsg = await saveMessageToBackend(text, 'user');
    
    setMessages(prev => prev.map(m => m.id === tempId ? { ...m, status: savedMsg ? 'sent' : 'error' } : m));

    // Simulate intent detection and bot response
    setIsTyping(true);
    setTimeout(() => {
      processIntentAndRespond(text);
    }, 1500);
  };

  const processIntentAndRespond = async (text) => {
    const lower = text.toLowerCase();
    let reply = "I'm still learning! Would you like to explore our collections or speak to Chaitali?";
    let isRich = false;
    let richType = null;

    if (lower.includes('track') || lower.includes('order')) {
      reply = "I can help you track your order. Please visit your account page to see live status.";
      isRich = true;
      richType = 'track';
    } else if (lower.includes('refund') || lower.includes('return') || lower.includes('cancel')) {
      reply = "I understand you have questions about returns or refunds. For this, it's best to speak directly with us on WhatsApp.";
      isRich = true;
      richType = 'human';
    } else if (lower.includes('human') || lower.includes('agent') || lower.includes('owner') || lower.includes('chaitali')) {
      reply = "I'll connect you directly with Chaitali on WhatsApp for personalized assistance.";
      isRich = true;
      richType = 'human';
    } else if (lower.includes('custom') || lower.includes('portrait')) {
      reply = "We love doing custom work! You can request a custom portrait or resin art piece directly from our Hub.";
      isRich = true;
      richType = 'custom';
    }

    await handleBotResponse(reply, false, isRich ? richType : null);
  };

  const handleBotResponse = async (text, isInitial = false, richType = null) => {
    setIsTyping(true);
    
    // Simulate streaming by adding a placeholder that we will update
    const tempId = 'bot_' + Date.now().toString();
    setMessages(prev => [...prev, { id: tempId, text: '', sender: 'bot', timestamp: new Date().toISOString(), richType }]);
    setIsTyping(false);

    let currentText = '';
    const speed = 20; // ms per char
    
    for (let i = 0; i < text.length; i++) {
      currentText += text[i];
      setMessages(prev => prev.map(m => m.id === tempId ? { ...m, text: currentText } : m));
      await new Promise(r => setTimeout(r, speed));
    }

    // Save to backend after fully "streamed"
    await saveMessageToBackend(text, 'bot');
    
    // Mark previous user messages as 'read' (delivered state simulation)
    setMessages(prev => prev.map(m => m.sender === 'user' && m.status === 'sent' ? { ...m, status: 'read' } : m));
  };

  const handleMenuAction = (action) => {
    if (action === 'shop') {
      navigate('/category');
      setIsOpen(false);
    } else if (action === 'custom') {
      navigate('/hub');
      setIsOpen(false);
    } else if (action === 'track') {
      navigate('/account');
      setIsOpen(false);
    }
  };

  const groupedElements = groupMessages(messages);

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
                style={{ height: '600px', maxHeight: '82vh' }}
              >
              {/* Header */}
              <div className="bg-gradient-to-r from-[#2C2C2C] via-[#1A1A1A] to-[#2C2C2C] p-4 flex items-center justify-between shadow-md relative z-20">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full border-2 border-[#C9A84C] bg-white p-0.5 flex items-center justify-center overflow-hidden flex-shrink-0">
                    <img src="/logo.jpg" alt="Artbizz Logo" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <h3 className="text-[#F2EDE4] font-bold leading-tight font-cinzel text-sm">Artbizz Assistant</h3>
                    <p className="text-[#C9A84C] text-[10px] uppercase font-bold tracking-wider flex items-center gap-1">
                      <ShieldCheck size={11} className="text-emerald-400" /> Online
                    </p>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-[#F2EDE4] hover:text-white transition-colors p-1 bg-black/20 rounded-full hover:bg-black/40">
                  <X size={18} />
                </button>
              </div>

              {/* Chat Messages */}
              <div 
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto p-4 bg-[#F2EDE4]/30 flex flex-col gap-4 relative"
              >
                {groupedElements.map((group, idx) => {
                  if (group.type === 'date') {
                    return (
                      <div key={`date-${idx}`} className="flex justify-center my-2">
                        <span className="text-[10px] font-bold text-stone-400 bg-stone-100 px-3 py-1 rounded-full uppercase tracking-wider">{group.date}</span>
                      </div>
                    );
                  }

                  return (
                    <div key={`group-${idx}`} className={`flex ${group.sender === 'user' ? 'justify-end' : 'justify-start'} w-full`}>
                      {group.sender === 'bot' && (
                        <div className="w-7 h-7 rounded-full border border-[#C9A84C] bg-white p-0.5 mr-2 flex-shrink-0 self-end mb-1">
                          <img src="/logo.jpg" alt="Bot" className="w-full h-full object-contain rounded-full" />
                        </div>
                      )}
                      
                      <div className={`flex flex-col gap-1 max-w-[75%]`}>
                        {group.messages.map((msg, mIdx) => {
                          const isLast = mIdx === group.messages.length - 1;
                          return (
                            <div key={msg.id || mIdx} className="group relative flex flex-col">
                              <div className={`p-3 text-sm shadow-sm relative ${
                                msg.sender === 'user' 
                                  ? 'bg-gradient-to-r from-[#2C2C2C] to-[#1A1A1A] text-[#F0DFA0] rounded-2xl rounded-tr-sm' 
                                  : 'bg-white border border-[#C9A84C]/40 text-stone-800 rounded-2xl rounded-tl-sm'
                              }`}>
                                {msg.text}
                                
                                {/* Hover Timestamp */}
                                <div className={`absolute top-1/2 -translate-y-1/2 ${msg.sender === 'user' ? '-left-12' : '-right-12'} opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-stone-400 font-medium whitespace-nowrap`}>
                                  {formatTime(msg.timestamp)}
                                </div>
                              </div>
                              
                              {/* Status Indicators for User */}
                              {msg.sender === 'user' && (
                                <div className="self-end mt-0.5 flex items-center gap-1">
                                  {msg.status === 'sending' && <span className="text-[10px] text-stone-400">Sending...</span>}
                                  {msg.status === 'sent' && <Check size={12} className="text-stone-400" />}
                                  {msg.status === 'read' && <CheckCheck size={12} className="text-blue-500" />}
                                  {msg.status === 'error' && (
                                    <button className="text-[10px] text-red-500 flex items-center gap-1" onClick={() => {
                                      // simple retry logic visual only for now
                                      setMessages(prev => prev.map(m => m.id === msg.id ? {...m, status: 'sending'} : m));
                                      setTimeout(() => setMessages(prev => prev.map(m => m.id === msg.id ? {...m, status: 'sent'} : m)), 1000);
                                    }}>
                                      <RefreshCw size={10} /> Retry
                                    </button>
                                  )}
                                </div>
                              )}

                              {/* Rich Action Cards */}
                              {msg.richType === 'track' && (
                                <div className="mt-2 flex flex-col gap-2">
                                  <button onClick={() => handleMenuAction('track')} className="w-full bg-[#F2EDE4]/50 hover:bg-[#F2EDE4] text-[#2C2C2C] border border-[#C9A84C]/40 py-2 px-3 rounded-xl text-xs font-bold transition-colors text-left flex items-center gap-2">
                                    <span>📦</span> Open My Orders
                                  </button>
                                </div>
                              )}
                              {msg.richType === 'custom' && (
                                <div className="mt-2 flex flex-col gap-2">
                                  <button onClick={() => handleMenuAction('custom')} className="w-full bg-[#F2EDE4]/50 hover:bg-[#F2EDE4] text-[#2C2C2C] border border-[#C9A84C]/40 py-2 px-3 rounded-xl text-xs font-bold transition-colors text-left flex items-center gap-2">
                                    <span>✨</span> Go to Creator Hub
                                  </button>
                                </div>
                              )}
                              {msg.richType === 'human' && (
                                <div className="mt-2 flex flex-col gap-2">
                                  <a href={`https://wa.me/${(frontendSettings?.whatsappNumber || '917020821578').replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="w-full bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/40 py-2 px-3 rounded-xl text-xs font-bold transition-colors text-left flex items-center gap-2">
                                    <span>💬</span> Connect on WhatsApp
                                  </a>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}

                {/* Inline Typing Indicator */}
                {isTyping && (
                  <div className="flex justify-start w-full">
                    <div className="w-7 h-7 rounded-full border border-[#C9A84C] bg-white p-0.5 mr-2 flex-shrink-0 self-end mb-1">
                      <img src="/logo.jpg" alt="Bot" className="w-full h-full object-contain rounded-full" />
                    </div>
                    <div className="bg-white border border-[#C9A84C]/40 p-3 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1.5 self-end h-[38px]">
                      <div className="w-1.5 h-1.5 bg-[#C9A84C] rounded-full animate-bounce" />
                      <div className="w-1.5 h-1.5 bg-[#C9A84C] rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
                      <div className="w-1.5 h-1.5 bg-[#C9A84C] rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} className="h-1" />
              </div>

              {/* Scroll to bottom button */}
              <AnimatePresence>
                {showScrollButton && (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    onClick={scrollToBottom}
                    className="absolute bottom-[80px] left-1/2 -translate-x-1/2 bg-stone-900/80 backdrop-blur-md text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg flex items-center gap-2 hover:bg-stone-900 transition-colors z-30"
                  >
                    <ChevronDown size={14} />
                    {unreadCount > 0 ? `${unreadCount} new message${unreadCount > 1 ? 's' : ''}` : 'Scroll to bottom'}
                  </motion.button>
                )}
              </AnimatePresence>

              {/* Smart Composer */}
              <div className="p-3.5 bg-white border-t border-[#C9A84C]/30 relative z-20">
                <div className="flex items-end gap-2 bg-[#F2EDE4]/50 border border-[#C9A84C]/40 rounded-2xl p-1.5 focus-within:border-[#C9A84C] focus-within:ring-1 focus-within:ring-[#C9A84C]/20 transition-all">
                  <textarea
                    ref={inputRef}
                    value={inputValue}
                    onChange={handleInput}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder="Type your message..."
                    className="flex-1 bg-transparent max-h-[120px] min-h-[40px] resize-none px-3 py-2.5 text-sm focus:outline-none scrollbar-thin scrollbar-thumb-[#C9A84C]/30 scrollbar-track-transparent text-stone-800"
                    rows={1}
                  />
                  <button
                    onClick={handleSend}
                    disabled={!inputValue.trim()}
                    className="mb-1 mr-1 bg-gradient-to-r from-[#2C2C2C] to-[#1A1A1A] hover:shadow-lg text-[#C9A84C] p-2.5 rounded-xl transition-all disabled:opacity-50 disabled:shadow-none shrink-0"
                  >
                    <Send size={16} />
                  </button>
                </div>
                <div className="text-[10px] text-stone-400 font-medium text-center mt-2 flex items-center justify-center gap-1">
                  <ShieldCheck size={10} /> Secure Chat
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toggle Floating Action Button */}
        <button
          aria-label="Toggle Chatbot"
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 bg-gradient-to-tr from-[#2C2C2C] to-[#1A1A1A] text-[#C9A84C] rounded-full flex items-center justify-center shadow-2xl hover:shadow-[0_0_25px_rgba(201,168,76,0.5)] transition-all transform hover:scale-105 active:scale-95 border-2 border-[#C9A84C]/30 relative z-10"
        >
          {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
        </button>
      </div>
    </>
  );
}
