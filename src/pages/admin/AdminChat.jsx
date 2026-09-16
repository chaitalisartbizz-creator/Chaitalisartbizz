import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MessageSquare, Calendar, ChevronRight, User, RefreshCw, Smartphone, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export default function AdminChat() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/chat/sessions`);
      setSessions(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleSelectSession = async (sessionId) => {
    try {
      const res = await axios.get(`${API_URL}/chat/session/${sessionId}`);
      setSelectedSession(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const filteredSessions = sessions.filter(s => 
    s.visitorId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col md:flex-row gap-6 h-[calc(100vh-120px)]">
      {/* Sidebar List */}
      <div className="w-full md:w-1/3 flex flex-col bg-white border border-[#C9A84C]/30 rounded-2xl shadow-sm overflow-hidden h-full shrink-0">
        <div className="p-4 border-b border-[#C9A84C]/20 bg-[#F2EDE4]/30 flex flex-col gap-3 shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="font-cinzel font-bold text-lg text-[#2C2C2C] flex items-center gap-2">
              <MessageSquare size={18} className="text-[#C9A84C]" /> Chat Sessions
            </h2>
            <button onClick={fetchSessions} className="p-1.5 text-stone-500 hover:text-[#C9A84C] hover:bg-white rounded-lg transition-colors">
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input 
              type="text"
              placeholder="Search visitor ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#C9A84C]/30 rounded-lg focus:outline-none focus:border-[#C9A84C]"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading && sessions.length === 0 ? (
            <div className="p-8 text-center text-stone-400 text-sm">Loading sessions...</div>
          ) : filteredSessions.length === 0 ? (
            <div className="p-8 text-center text-stone-400 text-sm">No chat sessions found.</div>
          ) : (
            <div className="divide-y divide-[#C9A84C]/10">
              {filteredSessions.map(session => {
                const latestMsg = session.messages?.[0];
                const isSelected = selectedSession?.id === session.id;
                return (
                  <button
                    key={session.id}
                    onClick={() => handleSelectSession(session.id)}
                    className={`w-full text-left p-4 hover:bg-[#F2EDE4]/30 transition-colors flex items-start gap-3 ${isSelected ? 'bg-[#F2EDE4]/50 border-l-2 border-[#C9A84C]' : 'border-l-2 border-transparent'}`}
                  >
                    <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center shrink-0 border border-stone-200">
                      <User size={18} className="text-stone-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-bold text-stone-800 truncate pr-2">
                          {session.visitorId.substring(0, 12)}...
                        </span>
                        <span className="text-[10px] text-stone-400 whitespace-nowrap">
                          {new Date(session.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 truncate">
                        {latestMsg ? (
                          <span className={latestMsg.sender === 'user' ? 'font-medium text-stone-700' : ''}>
                            {latestMsg.sender === 'bot' ? 'Bot: ' : ''}{latestMsg.text}
                          </span>
                        ) : 'No messages'}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Main Chat View */}
      <div className="flex-1 bg-white border border-[#C9A84C]/30 rounded-2xl shadow-sm flex flex-col h-full overflow-hidden">
        {selectedSession ? (
          <>
            <div className="p-4 border-b border-[#C9A84C]/20 bg-[#F2EDE4]/30 flex flex-wrap items-center justify-between gap-4 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white border border-[#C9A84C]/40 flex items-center justify-center">
                  <User size={20} className="text-[#C9A84C]" />
                </div>
                <div>
                  <h3 className="font-bold text-stone-800">Visitor: {selectedSession.visitorId}</h3>
                  <div className="flex items-center gap-2 text-[10px] text-stone-500">
                    <Calendar size={12} /> Started {new Date(selectedSession.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#25D366]/10 text-[#25D366] text-xs font-bold rounded-lg border border-[#25D366]/30 hover:bg-[#25D366]/20 transition-colors">
                <Smartphone size={14} /> Send WhatsApp invite
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 bg-[#F2EDE4]/10 flex flex-col gap-4">
              {selectedSession.messages?.map((msg, i) => (
                <div key={msg.id || i} className={`flex ${msg.sender === 'user' ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[70%] p-3.5 rounded-2xl text-sm shadow-sm relative group ${
                    msg.sender === 'user' 
                      ? 'bg-[#F2EDE4] text-stone-800 rounded-tl-sm border border-[#C9A84C]/20' 
                      : 'bg-stone-800 text-[#C9A84C] rounded-tr-sm'
                  }`}>
                    {msg.sender === 'user' && <div className="text-[10px] text-stone-500 font-bold mb-1">User</div>}
                    {msg.sender === 'bot' && <div className="text-[10px] text-stone-400 font-bold mb-1">Bot</div>}
                    
                    <div>{msg.text}</div>
                    
                    <div className="text-[10px] text-right mt-1 opacity-60">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
              {selectedSession.messages?.length === 0 && (
                <div className="m-auto text-stone-400 text-sm">No messages in this session.</div>
              )}
            </div>
            
            <div className="p-4 border-t border-[#C9A84C]/20 bg-stone-50 flex items-center justify-center text-xs text-stone-500">
              Admin reply feature is currently read-only.
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-stone-400">
            <MessageSquare size={48} className="mb-4 text-stone-200" />
            <p>Select a chat session to view history</p>
          </div>
        )}
      </div>
    </div>
  );
}
