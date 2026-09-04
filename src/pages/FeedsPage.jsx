import React from 'react';
import Header from '../components/Header';
import LiveBackground from '../components/LiveBackground';
import { Video, Heart, MessageCircle, Play } from 'lucide-react';
import { motion } from 'framer-motion';

export default function FeedsPage() {
  return (
    <div className="min-h-screen bg-[#F2EDE4] font-sans pb-24 md:pb-0">
      <Header />
      <div className="relative pt-24 pb-12 px-4 md:px-8 max-w-[1600px] mx-auto min-h-screen">
        <LiveBackground theme="cream-waves" className="fixed inset-0 opacity-40 pointer-events-none" />
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center justify-center p-3 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 rounded-2xl mb-4 shadow-lg"
            >
              <Video size={32} className="text-white" />
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-cinzel font-bold text-[#2C2C2C] mb-3"
            >
              Our Viral Feeds
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-stone-500 max-w-lg mx-auto"
            >
              Join our growing Instagram family! Check out our latest viral creations and behind-the-scenes magic.
            </motion.p>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col md:flex-row gap-8 justify-center items-start"
          >
            {/* Instagram Embed */}
            <div className="w-full md:w-[400px] bg-white p-2 rounded-[2rem] shadow-2xl border border-stone-100 flex-shrink-0 mx-auto">
              <div className="rounded-[1.5rem] overflow-hidden bg-stone-50 relative min-h-[600px] flex items-center justify-center">
                <iframe 
                  src="https://www.instagram.com/p/Dch4BriSnAv/embed/captioned" 
                  className="w-full h-[750px] border-none"
                  scrolling="no"
                  allowTransparency="true"
                  allow="encrypted-media"
                  title="Instagram Reel"
                />
              </div>
            </div>

            {/* Engagement Stats Side Panel */}
            <div className="flex-1 w-full glass-panel rounded-3xl p-6 md:p-8 mt-4 md:mt-12 text-center md:text-left">
              <h3 className="font-cinzel font-bold text-2xl text-[#C9A84C] mb-2">Trending Now! 🚀</h3>
              <p className="text-stone-600 mb-8 leading-relaxed">
                This beautiful creation went absolutely viral! Thank you for the overwhelming love and support. Watch the reel to see the magic unfold.
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/60 p-4 rounded-2xl flex flex-col items-center justify-center border border-[#C9A84C]/20 shadow-sm">
                  <Play size={28} className="text-stone-700 mb-2" />
                  <span className="font-bold text-2xl text-[#2C2C2C]">Viral</span>
                  <span className="text-xs text-stone-500 uppercase tracking-widest font-semibold mt-1">Reel Views</span>
                </div>
                <div className="bg-white/60 p-4 rounded-2xl flex flex-col items-center justify-center border border-[#C9A84C]/20 shadow-sm">
                  <Heart size={28} className="text-pink-500 mb-2 fill-pink-500" />
                  <span className="font-bold text-2xl text-[#2C2C2C]">Loved</span>
                  <span className="text-xs text-stone-500 uppercase tracking-widest font-semibold mt-1">By Fans</span>
                </div>
                <div className="col-span-2 bg-gradient-to-r from-[#C9A84C] to-[#A8873A] p-4 rounded-2xl flex flex-col items-center justify-center shadow-md text-white">
                  <MessageCircle size={28} className="mb-2" />
                  <span className="font-bold text-xl">Hundreds of Comments</span>
                  <span className="text-xs text-[#F2EDE4] mt-1 font-medium">Join the conversation on Instagram!</span>
                </div>
              </div>
              
              <a 
                href="https://www.instagram.com/p/Dch4BriSnAv/" 
                target="_blank" 
                rel="noreferrer"
                className="mt-8 flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 text-white font-bold text-lg hover:shadow-lg hover:shadow-pink-500/30 transition-all hover:-translate-y-1"
              >
                <Video size={20} /> Watch on Instagram
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
