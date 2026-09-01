import React, { useState, useEffect } from 'react';
import { Clock, Tag, Star, ShoppingBag, Heart, Flame, Zap, Copy, Check, ArrowRight, ShieldCheck, Palette } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import ScrollReveal from '../components/ScrollReveal';
import LiveBackground from '../components/LiveBackground';
import MediaDisplay from '../components/MediaDisplay';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useData } from '../context/DataContext';

const COUPONS = [
  { id: 1, title: 'FESTIVE ART BUNDLE', sub: 'Flat 25% Off Custom Gift Combos', expiry: '3 Days Left', color1: '#2C2C2C', color2: '#C9A84C', emoji: '🎉', code: 'ARTFEST25' },
  { id: 2, title: 'CREATE SPECIAL', sub: '10% Extra Off Sitewide on All Orders', expiry: 'Ongoing', color1: '#8B5E7A', color2: '#C0737A', emoji: '✨', code: 'ART10' },
  { id: 3, title: 'PORTRAIT LOVE', sub: '20% Off Custom Portrait Orders', expiry: '5 Days Left', color1: '#A8873A', color2: '#C9A84C', emoji: '🎨', code: 'PORTRAIT20' },
  { id: 4, title: 'RESIN MAGIC', sub: '15% Off All Resin Art Pieces', expiry: '4 Days Left', color1: '#6B7FA3', color2: '#4A5D8A', emoji: '🌟', code: 'RESIN15' },
];

const FLASH_PRODUCTS = [
  { id: 1, name: 'Custom Pet Portrait (A4)', price: 799, mrp: 999, img: 'https://images.unsplash.com/photo-1547756536-cde3673fa2e5?w=250&h=250&fit=crop', rating: 4.9, off: '20% OFF', left: 8 },
  { id: 2, name: 'Resin Art Tray (Handmade)', price: 649, mrp: 849, img: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=250&h=250&fit=crop', rating: 4.8, off: '23% OFF', left: 14 },
  { id: 3, name: 'Digital Logo Design', price: 499, mrp: 699, img: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=250&h=250&fit=crop', rating: 4.7, off: '28% OFF', left: 19 },
  { id: 4, name: 'Personalised Name Plate', price: 599, mrp: 799, img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=250&h=250&fit=crop', rating: 4.9, off: '25% OFF', left: 5 },
  { id: 5, name: 'Mandala Wall Art (Framed)', price: 1199, mrp: 1599, img: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=250&h=250&fit=crop', rating: 4.8, off: '25% OFF', left: 11 },
  { id: 6, name: 'Festive Gift Hamper (Custom)', price: 1499, mrp: 1999, img: 'https://images.unsplash.com/photo-1512909006721-3d6018887383?w=250&h=250&fit=crop', rating: 4.9, off: '25% OFF', left: 6 },
];

function CouponCard({ item, delay }) {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard?.writeText(item.code).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <ScrollReveal delay={delay} className="flex-shrink-0 md:flex-shrink min-w-[250px] h-full">
      <div 
        style={{ backgroundImage: `linear-gradient(to right, ${item.color1}, ${item.color2})` }}
        className="rounded-2xl p-5 text-[#F0DFA0] relative overflow-hidden h-full flex flex-col shadow-lg border border-[#C9A84C]/30"
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-4 translate-x-4" />
        <div className="text-3xl mb-2">{item.emoji}</div>
        <p className="font-cinzel font-bold text-lg leading-tight">{item.title}</p>
        <p className="text-[#F0DFA0]/80 text-xs mt-0.5 font-medium">{item.sub}</p>
        <div className="flex items-center gap-2 mt-4">
          <div className="flex-1 bg-black/20 border border-[#C9A84C]/40 border-dashed rounded-xl px-3 py-1.5 flex items-center justify-between">
            <span className="font-mono font-black text-sm tracking-widest text-[#F0DFA0]">{item.code}</span>
            <button onClick={copy} className="hover:scale-110 transition-transform">
              {copied ? <Check size={14} className="text-emerald-300" /> : <Copy size={14} className="text-[#C9A84C]" />}
            </button>
          </div>
        </div>
        <div className="flex items-center gap-1 mt-auto pt-3 text-[10px] text-[#F0DFA0]/80 font-bold">
          <Clock size={11} /> <span>{item.expiry}</span>
        </div>
      </div>
    </ScrollReveal>
  );
}

export default function OffersPage() {
  const { addToCart, isInCart } = useCart();
  const [timeLeft, setTimeLeft] = useState({ hrs: 6, min: 24, sec: 45 });
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hrs, min, sec } = prev;
        if (sec > 0) sec--;
        else {
          sec = 59;
          if (min > 0) min--;
          else {
            min = 59;
            if (hrs > 0) hrs--;
            else hrs = 24;
          }
        }
        return { hrs, min, sec };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-lato">
      <Header />
      <main className="pb-24 md:pb-12">

        {/* Hero */}
        <ScrollReveal>
          <div className="bg-gradient-to-r from-[#2C2C2C] via-[#1A1A1A] to-[#2C2C2C] relative overflow-hidden border-b border-[#C9A84C]/40 shadow-xl">
            <LiveBackground theme="festive-sparks" />
            
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16 relative text-[#F0DFA0] z-10">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
                <div className="md:w-1/2">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="flex items-center gap-2 mb-3"
                  >
                    <motion.div animate={{ rotate: [0, -15, 15, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                      <Flame size={22} className="text-[#C9A84C]" />
                    </motion.div>
                    <span className="text-[#C9A84C] text-xs font-black uppercase tracking-widest bg-[#C9A84C]/10 px-3 py-1 rounded-full border border-[#C9A84C]/20">Artbizz Deals Zone</span>
                  </motion.div>
                  
                  <motion.h1 
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="font-cinzel font-bold text-4xl md:text-5xl lg:text-6xl leading-tight drop-shadow-lg"
                  >
                    Art Offers & <span className="text-[#C9A84C]">Bundles</span> 🎉
                  </motion.h1>
                  
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-[#C9A84C]/80 text-base md:text-lg mt-4 max-w-md font-medium"
                  >
                    Custom portraits, resin art & personalised gifts at exclusive special prices for a limited time.
                  </motion.p>
                </div>
                
                {/* Animated Countdown Timer */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.7, delay: 0.5, type: 'spring', bounce: 0.4 }}
                  className="md:w-[40%] bg-black/40 backdrop-blur-xl border border-[#C9A84C]/40 rounded-3xl p-6 md:p-8 text-center shadow-[0_0_40px_rgba(201,168,76,0.15)] relative overflow-hidden"
                >
                  {/* Timer background glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#C9A84C]/5 to-transparent pointer-events-none" />
                  
                  <motion.p 
                    animate={{ textShadow: ["0px 0px 4px #C9A84C", "0px 0px 12px #C9A84C", "0px 0px 4px #C9A84C"] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-[#C9A84C] text-sm font-black uppercase tracking-widest mb-4 flex items-center gap-2 justify-center drop-shadow-md"
                  >
                    <Zap size={16} className="text-[#C9A84C]" /> Sale Ends In
                  </motion.p>
                  
                  <div className="flex items-center gap-3 justify-center">
                    {[
                      { val: timeLeft.hrs.toString().padStart(2, '0'), label: 'Hrs' },
                      { val: timeLeft.min.toString().padStart(2, '0'), label: 'Min' },
                      { val: timeLeft.sec.toString().padStart(2, '0'), label: 'Sec' }
                    ].map((t, i) => (
                      <React.Fragment key={t.label}>
                        <motion.div 
                          whileHover={{ scale: 1.05, y: -5 }}
                          className="text-center group"
                        >
                          <div className="bg-gradient-to-b from-[#F0DFA0] to-[#C9A84C] text-[#2C2C2C] font-black text-3xl md:text-4xl px-4 py-3 rounded-2xl min-w-[65px] md:min-w-[80px] shadow-lg border-b-4 border-[#A8873A] flex items-center justify-center relative overflow-hidden">
                            {/* Smooth Shimmer Effect */}
                            <motion.div 
                              animate={{ x: ['-200%', '200%'] }} 
                              transition={{ duration: 2.5, repeat: Infinity, ease: 'linear', delay: i * 0.3 }} 
                              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent w-full h-full skew-x-[-20deg]"
                            />
                            <span className="relative z-10">{t.val}</span>
                          </div>
                          <p className="text-[#C9A84C] text-[11px] mt-2 font-bold tracking-wider uppercase group-hover:text-[#F0DFA0] transition-colors">{t.label}</p>
                        </motion.div>
                        {t.label !== 'Sec' && (
                          <motion.span 
                            animate={{ opacity: [1, 0, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                            className="text-[#C9A84C] font-black text-3xl -mt-6"
                          >
                            :
                          </motion.span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        <div className="max-w-7xl mx-auto px-4 md:px-6">

          {/* Active Coupons Section */}
          <ScrollReveal delay={100}>
            <section className="relative z-10 overflow-hidden rounded-3xl p-6 md:p-8 border border-[#C9A84C]/40 shadow-xl mt-8 md:mt-10 mb-10">
              <LiveBackground theme="cream-waves" />
              <div className="relative z-10 flex items-center gap-2 mb-6 pb-4 border-b border-[#C9A84C]/30">
                <Tag size={24} className="text-[#C9A84C]" />
                <h2 className="text-[#F0DFA0] font-cinzel font-black text-2xl">Active Artbizz Promo Codes</h2>
              </div>
              <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {COUPONS.map((c, idx) => <CouponCard key={c.id} item={c} delay={idx * 100} />)}
              </div>
            </section>
          </ScrollReveal>

          {/* Flash Deals */}
          <ScrollReveal delay={100}>
            <section className="mt-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Zap size={18} className="text-[#C9A84C]" />
                  <h2 className="text-[#2C2C2C] font-cinzel font-bold text-xl">⚡ Limited Flash Art Deals</h2>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {FLASH_PRODUCTS.map((p, idx) => (
                  <ScrollReveal key={p.id} delay={(idx % 6) * 80} className="h-full">
                    <Link to={`/product/${p.id}`} className="block bg-white rounded-2xl border border-[#C9A84C]/30 overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer h-full flex flex-col">
                      <div className="relative bg-[#F2EDE4] overflow-hidden" style={{ height: 135 }}>
                        <MediaDisplay src={p.img} alt={p.name} className="w-full h-full object-cover" />
                        <span className="absolute top-2 left-2 bg-[#C9A84C] text-[#2C2C2C] text-[9px] font-bold px-2 py-0.5 rounded-md">{p.off}</span>
                        <div className="absolute bottom-0 left-0 right-0 bg-[#2C2C2C]/80 text-[#C9A84C] text-[9px] font-bold text-center py-0.5">
                          Only {p.left} spots left!
                        </div>
                      </div>
                      <div className="p-3 flex flex-col flex-1">
                        <p className="text-stone-800 text-xs font-bold leading-tight line-clamp-2">{p.name}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Star size={9} className="text-[#C9A84C] fill-[#C9A84C]" />
                          <span className="text-stone-600 text-[10px] font-bold">{p.rating}</span>
                        </div>
                        <div className="flex items-baseline gap-1 mt-1.5">
                          <span className="text-[#2C2C2C] font-black text-sm">₹{p.price}</span>
                          <span className="text-stone-400 text-[10px] line-through">₹{p.mrp}</span>
                        </div>
                        <div className="mt-auto pt-2">
                          <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToCart(p); }}
                            className={`w-full text-[10px] font-bold py-1.5 rounded-xl transition-all ${isInCart(p.id) ? 'bg-emerald-600 text-white' : 'bg-[#2C2C2C] text-[#C9A84C] hover:bg-[#C9A84C] hover:text-[#2C2C2C]'}`}>
                            {isInCart(p.id) ? '✓ Added' : '+ Order Now'}
                          </button>
                        </div>
                      </div>
                    </Link>
                  </ScrollReveal>
                ))}
              </div>
            </section>
          </ScrollReveal>

        </div>
      </main>
    </div>
  );
}

