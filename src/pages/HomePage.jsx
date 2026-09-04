import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ChevronLeft, ChevronRight, Star, ShoppingBag, Heart,
  Sparkles, ArrowRight, Award, ShieldCheck, Palette, Brush
} from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import { useData } from '../context/DataContext';
import { useCart } from '../context/CartContext';
import ScrollReveal from '../components/ScrollReveal';
import MediaDisplay from '../components/MediaDisplay';
import LiveBackground from '../components/LiveBackground';
import TypewriterText from '../components/TypewriterText';

/* ── HERO CAROUSEL ── */
function HeroCarousel() {
  const { slides } = useData();
  const [cur, setCur] = useState(0);
  const [auto, setAuto] = useState(true);
  const ref = useRef(null);
  const next = () => setCur(c => (c + 1) % (slides.length || 1));
  const prev = () => setCur(c => (c - 1 + slides.length) % (slides.length || 1));
  
  useEffect(() => {
    if (auto && slides.length > 0) { ref.current = setInterval(next, 4800); }
    return () => clearInterval(ref.current);
  }, [auto, cur, slides.length]);
  
  if (!slides || slides.length === 0) return null;
  const s = slides[cur] || slides[0];

  return (
    <motion.div 
      initial={{ opacity: 1, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-10 max-w-[1600px] mx-auto w-full px-4 md:px-6 mb-4"
    >
      <div
        className="relative overflow-hidden rounded-3xl w-full shadow-2xl border border-[#C9A84C]/40"
        onMouseEnter={() => setAuto(false)}
        onMouseLeave={() => setAuto(true)}
      >
        {s.mobileImage ? (
          <>
            <div className="block md:hidden">
              <MediaDisplay src={s.mobileImage} alt="Hero Banner Mobile" className="w-full h-auto object-cover max-h-[600px]" loading="eager" />
            </div>
            <div className="hidden md:block">
              <MediaDisplay src={s.heroImage} alt="Hero Banner Desktop" className="w-full h-auto object-cover max-h-[520px]" loading="eager" />
            </div>
          </>
        ) : s.heroImage ? (
          <MediaDisplay src={s.heroImage} alt="Hero Banner" className="w-full h-auto object-cover max-h-[520px]" loading="eager" />
        ) : null}
        
        {/* Navigation Arrows */}
        <button onClick={prev} className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-md rounded-full p-2 md:p-3 shadow-lg hover:bg-[#C9A84C] hover:text-white transition-all z-20">
          <ChevronLeft size={18} className="text-stone-800 hover:text-white" />
        </button>
        <button onClick={next} className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-md rounded-full p-2 md:p-3 shadow-lg hover:bg-[#C9A84C] hover:text-white transition-all z-20">
          <ChevronRight size={18} className="text-stone-800 hover:text-white" />
        </button>

        {/* Indicator Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {slides.map((_, i) => (
            <button key={i} onClick={() => setCur(i)}
              className={`h-2.5 rounded-full transition-all duration-300 ${i === cur ? 'bg-[#C9A84C] w-8' : 'bg-white/60 w-2.5'}`} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ── SITE HERO BANNERS ── */
function SiteHeroBannersSection() {
  const { banners } = useData();
  const navigate = useNavigate();
  if (!banners || banners.length === 0) return null;
  return (
    <section className="relative z-10 max-w-[1600px] mx-auto w-full px-4 md:px-6 mb-8">
      <div className="relative overflow-hidden rounded-3xl p-6 md:p-8 border border-[#C9A84C]/40 shadow-2xl">
        <LiveBackground theme="kintsugi-fluid" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between mb-6 md:mb-8 gap-4">
          <div>
            <h2 className="text-[#F0DFA0] font-cinzel font-bold text-2xl md:text-4xl flex items-center gap-2">
              Featured Art Collections <Sparkles className="text-[#C9A84C]" size={28} />
            </h2>
            <p className="text-[#C9A84C]/80 text-sm md:text-base font-medium mt-1">
              Explore our exclusive artworks & custom creation packages
            </p>
          </div>
        </div>

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          {banners.map((b, idx) => (
            <ScrollReveal key={b.id || idx} delay={idx * 150} animation="scale-up-smooth" className="h-full">
              <div 
                onClick={() => navigate(b.link || '/category')}
                className="group relative overflow-hidden rounded-2xl h-[280px] md:h-[340px] shadow-xl border-2 border-[#C9A84C]/20 hover:border-[#C9A84C] cursor-pointer bg-[#2C2C2C] transition-all duration-500 hover:shadow-2xl hover:shadow-[#C9A84C]/20"
              >
                <MediaDisplay 
                  src={b.mediaUrl} 
                  alt={b.title || 'Art Banner'} 
                  className="w-full h-full object-cover group-hover:scale-110 group-hover:rotate-1 transition-transform duration-1000 opacity-70 group-hover:opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-[#1A1A1A]/60 to-transparent opacity-90 group-hover:opacity-80 transition-opacity" />

                <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#C9A84C]/20 backdrop-blur-md rounded-full border border-[#C9A84C]/30 text-[#F0DFA0] text-xs font-black tracking-widest mb-3">
                    <Star size={10} className="fill-[#F0DFA0]" /> {b.badge || 'EXCLUSIVE'}
                  </div>
                  <h3 className="text-2xl md:text-3xl font-cinzel font-bold text-white mb-2 leading-tight drop-shadow-lg">{b.title}</h3>
                  <p className="text-stone-300 text-sm font-medium line-clamp-2 max-w-md drop-shadow-md">{b.subtitle}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── QUICK CATEGORIES ── */
function QuickCategories() {
  const { categories } = useData();
  const navigate = useNavigate();
  // Duplicate categories to ensure seamless infinite scrolling
  const infiniteCategories = [...categories, ...categories, ...categories, ...categories];

  return (
    <section className="relative z-10 max-w-[1600px] mx-auto w-full px-4 md:px-6 mb-4">
      <div className="relative overflow-hidden rounded-3xl p-5 md:p-7 border border-[#C9A84C]/40 shadow-xl bg-[#1A1A1A]">
        
        <LiveBackground theme="3d-floating" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between mb-6 md:mb-8 gap-4">
          <div>
            <h2 className="text-[#F0DFA0] font-cinzel font-bold text-2xl md:text-4xl tracking-tight flex items-center gap-2">
              Explore Art Collections <Palette className="text-[#C9A84C]" size={24} />
            </h2>
            <p className="text-[#C9A84C]/80 text-sm md:text-base font-medium mt-1">
              Custom Portraits, Resin Art, Digital Designs, Personalised Gifts & Much More.
            </p>
          </div>
          <button onClick={() => navigate('/category')}
            className="flex-shrink-0 flex items-center gap-1.5 bg-[#C9A84C] hover:bg-[#A8873A] text-[#2C2C2C] text-xs md:text-sm font-bold px-5 py-2.5 rounded-full transition-all shadow-md">
            View All Collections <ArrowRight size={14} />
          </button>
        </div>

        {/* Infinite Scrolling Marquee */}
        <div className="relative z-10 mt-4 overflow-hidden py-3" style={{ maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}>
          <motion.div 
            className="flex gap-4 md:gap-6 w-max"
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          >
            {infiniteCategories.map((cat, idx) => (
              <button key={`${cat.label}-${idx}`} onClick={() => navigate('/category', { state: { category: cat.label } })}
                className="flex-shrink-0 flex flex-col items-center gap-3 group focus:outline-none w-24 sm:w-32 md:w-44 cursor-pointer">
                <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-44 md:h-44 rounded-2xl md:rounded-3xl border-2 border-[#C9A84C]/40 bg-[#1A1A1A] overflow-hidden shadow-lg group-hover:border-[#C9A84C] group-hover:scale-105 transition-all duration-300 relative">
                  <img src={cat.img} alt={cat.label} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <span className="text-xs md:text-sm font-bold text-[#F0DFA0] text-center leading-tight group-hover:text-[#C9A84C] transition-colors">{cat.label}</span>
              </button>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ── CUSTOM PORTRAITS SECTION ── */
function CustomPortraitsSection({ cat, products, addToCart, toggleWishlist, isInCart, isWishlisted, navigate }) {
  const hero = products[0];
  const rest = products.slice(1);

  return (
    <section className="relative z-10 max-w-[1600px] mx-auto w-full px-4 md:px-6">
      <div className="relative overflow-hidden rounded-3xl p-6 md:p-8 border border-[#C9A84C]/40 shadow-2xl  text-[#F0DFA0]">
        
        <LiveBackground theme="golden-cracks" />

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 pb-4 border-b border-[#C9A84C]/30 gap-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl p-2.5 bg-[#C9A84C]/20 rounded-2xl border border-[#C9A84C]/40 shadow-inner">🖼️</span>
            <div>
              <h2 className="text-[#F0DFA0] font-cinzel font-bold text-2xl md:text-4xl flex items-center gap-2">
                {cat.label} Studio <span className="text-xs font-bold text-[#2C2C2C] bg-[#C9A84C] px-3 py-0.5 rounded-full border border-[#A8873A]">({products.length} Artworks)</span>
              </h2>
              <p className="text-[#C9A84C]/80 text-xs md:text-sm mt-0.5">Handcrafted pet portraits, family portraits & caricatures made with love 🎨</p>
            </div>
          </div>
          <button onClick={() => navigate('/category', { state: { category: cat.label } })}
            className="flex items-center gap-1.5 text-[#2C2C2C] text-xs md:text-sm font-bold bg-[#C9A84C] hover:bg-[#A8873A] px-5 py-2.5 rounded-full transition-all shadow-lg">
            View All Portraits ({products.length}) <ArrowRight size={14} />
          </button>
        </div>

        {/* Layout: Left Hero Spotlight + Right Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Left Hero Card */}
          {hero && (
            <div className="lg:col-span-4 bg-[#1A1A1A]/80 rounded-2xl border-2 border-[#C9A84C]/60 p-5 flex flex-col justify-between shadow-2xl relative overflow-hidden group">
              <div className="absolute top-3 left-3 z-10 bg-[#C9A84C] text-[#2C2C2C] text-[10px] font-black uppercase px-2.5 py-1 rounded-md shadow flex items-center gap-1">
                <Sparkles size={11} /> SPOTLIGHT ARTWORK
              </div>
              <button onClick={(e) => { e.preventDefault(); toggleWishlist(hero); }} 
                className="absolute top-3 right-3 z-10 bg-[#2C2C2C]/90 rounded-full p-2 text-stone-300 hover:text-red-500 transition-colors">
                <Heart size={16} className={isWishlisted(hero.id) ? 'fill-red-500 text-red-500' : ''} />
              </button>

              <Link to={`/product/${hero.id}`} className="relative h-60 rounded-xl overflow-hidden mb-4 block">
                <MediaDisplay src={hero.img} alt={hero.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-transparent opacity-80" />
              </Link>

              <div>
                <span className="text-[10px] text-[#C9A84C] font-bold uppercase tracking-widest">{hero.badge || 'CUSTOM PORTRAIT'}</span>
                <Link to={`/product/${hero.id}`} className="font-cinzel text-[#F0DFA0] font-bold text-lg md:text-xl leading-tight block mt-1 hover:text-[#C9A84C]">
                  {hero.name}
                </Link>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center bg-[#C9A84C] text-[#2C2C2C] rounded px-2 py-0.5 text-xs font-bold gap-1">
                    <Star size={10} className="fill-[#2C2C2C]" /> {hero.rating}
                  </div>
                  <span className="text-[#C9A84C]/60 text-xs">({hero.reviews} Happy Clients)</span>
                </div>

                <div className="flex items-baseline gap-2 mt-3">
                  <span className="text-2xl font-black text-[#C9A84C]">₹{hero.price}</span>
                  {hero.mrp && <span className="text-[#F0DFA0]/40 text-sm line-through">₹{hero.mrp}</span>}
                </div>

                <button onClick={() => addToCart(hero)}
                  className={`w-full mt-4 text-xs md:text-sm font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-md ${
                    isInCart(hero.id) ? 'bg-emerald-600 text-white' : 'bg-[#C9A84C] hover:bg-[#A8873A] text-[#2C2C2C]'
                  }`}>
                  <ShoppingBag size={14} /> {isInCart(hero.id) ? 'Added to Cart ✓' : 'Order This Portrait'}
                </button>
              </div>
            </div>
          )}

          {/* Right Grid */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5 content-start">
            {rest.map((p, idx) => (
              <ScrollReveal key={p.id} delay={idx * 60} animation="scale-up" className="h-full">
                <div className="bg-[#1A1A1A]/70 rounded-2xl border border-[#C9A84C]/30 overflow-hidden hover:border-[#C9A84C] transition-all group flex flex-col h-full shadow-lg">
                  <Link to={`/product/${p.id}`} className="relative h-36 bg-[#2C2C2C] overflow-hidden block">
                    <MediaDisplay src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute top-1.5 left-1.5 bg-[#C9A84C]/90 text-[#2C2C2C] text-[8px] font-extrabold px-1.5 py-0.5 rounded">{p.tag || 'CUSTOM'}</div>
                  </Link>
                  <div className="p-2.5 flex flex-col flex-1">
                    <p className="text-[8px] text-[#C9A84C] font-bold uppercase tracking-wider line-clamp-1">{p.badge || 'Custom Portrait'}</p>
                    <Link to={`/product/${p.id}`} className="text-[#F0DFA0] text-xs font-bold leading-tight mt-0.5 line-clamp-2 hover:text-[#C9A84C]">
                      {p.name}
                    </Link>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#C9A84C]/20">
                      <span className="text-[#C9A84C] font-black text-xs">₹{p.price}</span>
                      <button onClick={() => addToCart(p)}
                        className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                          isInCart(p.id) ? 'bg-emerald-600 text-white' : 'bg-[#C9A84C]/20 hover:bg-[#C9A84C] hover:text-[#2C2C2C] text-[#C9A84C]'
                        }`}>
                        <ShoppingBag size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── RESIN ART SECTION ── */
function ResinArtSection({ cat, products, addToCart, toggleWishlist, isInCart, isWishlisted, navigate }) {
  return (
    <section className="relative z-10 max-w-[1600px] mx-auto w-full px-4 md:px-6">
      <div className="relative overflow-hidden rounded-3xl p-6 md:p-8 border border-[#8B5E7A]/40 shadow-xl  text-[#F0DFA0]">
        
        <LiveBackground theme="resin-flow" />

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-4 border-b border-[#8B5E7A]/30 gap-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl p-2.5 bg-[#8B5E7A]/30 rounded-2xl border border-[#8B5E7A]/40 shadow-inner">🌿</span>
            <div>
              <h2 className="text-[#F0DFA0] font-cinzel font-bold text-2xl md:text-4xl flex items-center gap-2">
                {cat.label} Studio <span className="text-xs font-bold text-white bg-[#8B5E7A] px-3 py-0.5 rounded-full border border-[#8B5E7A]/80">({products.length} Pieces)</span>
              </h2>
              <p className="text-[#C9A84C]/70 text-xs md:text-sm mt-0.5">Handmade resin trays, clocks, frames, jewellery & home décor 🌿</p>
            </div>
          </div>
          <button onClick={() => navigate('/category', { state: { category: cat.label } })}
            className="flex items-center gap-1.5 text-white text-xs md:text-sm font-bold bg-[#8B5E7A] hover:bg-[#7A4E6A] px-5 py-2.5 rounded-full transition-all shadow-md">
            Explore All Resin Art ({products.length}) <ArrowRight size={14} />
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {products.map((p, idx) => (
            <ScrollReveal key={p.id} delay={idx * 70} animation="scale-up" className="h-full">
              <div className="bg-[#1A0F18]/90 rounded-2xl border border-[#8B5E7A]/40 overflow-hidden shadow-md hover:border-[#C9A84C] transition-all cursor-pointer group flex flex-col h-full">
                <Link to={`/product/${p.id}`} className="relative h-40 bg-[#2E1728] overflow-hidden block">
                  <MediaDisplay src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <span className="absolute top-2 left-2 bg-[#8B5E7A]/90 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow">
                    {p.badge || 'RESIN'}
                  </span>
                  <button onClick={(e) => { e.preventDefault(); toggleWishlist(p); }}
                    className="absolute top-2 right-2 bg-[#1A0F18]/80 rounded-full p-1.5 text-[#C9A84C] hover:text-red-500 transition-colors">
                    <Heart size={13} className={isWishlisted(p.id) ? 'fill-red-500 text-red-500' : ''} />
                  </button>
                </Link>

                <div className="p-3 flex flex-col flex-1 justify-between">
                  <div>
                    <span className="text-[9px] text-[#C9A84C] font-bold uppercase tracking-wider">{p.tag || 'HANDMADE'}</span>
                    <Link to={`/product/${p.id}`} className="text-[#F0DFA0] text-xs font-bold leading-tight block mt-0.5 line-clamp-2 hover:text-[#C9A84C]">
                      {p.name}
                    </Link>
                  </div>

                  <div className="mt-3">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-[#C9A84C] font-black text-sm">₹{p.price}</span>
                      {p.mrp && <span className="text-[#F0DFA0]/40 text-[10px] line-through">₹{p.mrp}</span>}
                    </div>

                    <button onClick={() => addToCart(p)}
                      className={`w-full mt-2 text-[11px] font-bold py-2 rounded-xl transition-all flex items-center justify-center gap-1 ${
                        isInCart(p.id) ? 'bg-emerald-600 text-white' : 'bg-[#8B5E7A] hover:bg-[#C9A84C] hover:text-[#2C2C2C] text-white'
                      }`}>
                      <ShoppingBag size={11} /> {isInCart(p.id) ? 'Added ✓' : 'Order Now'}
                    </button>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── DIGITAL DESIGNS SECTION ── */
function DigitalDesignsSection({ cat, products, addToCart, toggleWishlist, isInCart, isWishlisted, navigate }) {
  const topTwo = products.slice(0, 2);
  const bottomFour = products.slice(2);

  return (
    <section className="relative z-10 max-w-[1600px] mx-auto w-full px-4 md:px-6">
      <div className="relative overflow-hidden rounded-3xl p-6 md:p-8 border border-[#6B7FA3]/30 shadow-2xl  text-[#F0DFA0]">
        
        <LiveBackground theme="dark-particles" />

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 pb-4 border-b border-[#6B7FA3]/30 gap-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl p-2.5 bg-[#6B7FA3]/20 rounded-2xl border border-[#6B7FA3]/30 shadow-inner">✨</span>
            <div>
              <h2 className="text-[#F0DFA0] font-cinzel font-bold text-2xl md:text-4xl flex items-center gap-2">
                {cat.label} Studio <span className="text-xs font-bold text-[#0A1220] bg-[#6B7FA3] px-3 py-0.5 rounded-full border border-[#6B7FA3]/80">({products.length} Designs)</span>
              </h2>
              <p className="text-[#6B7FA3]/80 text-xs md:text-sm mt-0.5">Logos, invitations, social media creatives & digital art 💻</p>
            </div>
          </div>
          <button onClick={() => navigate('/category', { state: { category: cat.label } })}
            className="flex items-center gap-1.5 text-[#0A1220] text-xs md:text-sm font-bold bg-[#6B7FA3] hover:bg-[#8A9EC0] px-5 py-2.5 rounded-full transition-all shadow-md">
            View All Digital Designs ({products.length}) <ArrowRight size={14} />
          </button>
        </div>

        {/* Bento Layout */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {topTwo.map((p) => (
              <div key={p.id} className="bg-[#0A1220]/80 rounded-2xl border border-[#6B7FA3]/40 p-4 flex gap-4 items-center shadow-xl group hover:border-[#C9A84C] transition-all">
                <Link to={`/product/${p.id}`} className="relative w-36 h-36 rounded-xl overflow-hidden flex-shrink-0 bg-[#111B2E] block">
                  <MediaDisplay src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <span className="absolute top-1.5 left-1.5 bg-[#6B7FA3] text-white text-[8px] font-extrabold px-2 py-0.5 rounded">{p.badge || 'DIGITAL'}</span>
                </Link>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] text-[#C9A84C] font-bold uppercase tracking-wider">{p.tag || 'PREMIUM DESIGN'}</span>
                    <Link to={`/product/${p.id}`} className="font-cinzel text-[#F0DFA0] font-bold text-base md:text-lg leading-tight block mt-0.5 hover:text-[#C9A84C]">
                      {p.name}
                    </Link>
                    <div className="flex items-center gap-1.5 mt-2">
                      <Star size={12} className="fill-[#C9A84C] text-[#C9A84C]" />
                      <span className="text-xs font-bold text-[#F0DFA0]">{p.rating} Rating</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#6B7FA3]/20">
                    <span className="text-xl font-black text-[#C9A84C]">₹{p.price}</span>
                    <button onClick={() => addToCart(p)}
                      className={`text-xs font-bold px-4 py-2 rounded-xl transition-all ${
                        isInCart(p.id) ? 'bg-emerald-600 text-white' : 'bg-[#6B7FA3] hover:bg-[#C9A84C] hover:text-[#2C2C2C] text-white'
                      }`}>
                      {isInCart(p.id) ? 'Added ✓' : 'Order Now'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {bottomFour.map((p, idx) => (
              <ScrollReveal key={p.id} delay={idx * 60} animation="scale-up" className="h-full">
                <div className="bg-[#0A1220]/70 rounded-2xl border border-[#6B7FA3]/30 overflow-hidden p-3 hover:border-[#C9A84C] transition-all group flex flex-col h-full shadow-md">
                  <Link to={`/product/${p.id}`} className="relative h-32 rounded-xl overflow-hidden bg-[#111B2E] block mb-2">
                    <MediaDisplay src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </Link>

                  <div className="flex flex-col flex-1 justify-between">
                    <div>
                      <p className="text-[8px] text-[#6B7FA3] font-bold uppercase">{p.badge || 'Digital Design'}</p>
                      <Link to={`/product/${p.id}`} className="text-[#F0DFA0] text-xs font-bold leading-tight block mt-0.5 line-clamp-2 hover:text-[#C9A84C]">
                        {p.name}
                      </Link>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <span className="text-[#C9A84C] font-black text-sm">₹{p.price}</span>
                      <button onClick={() => addToCart(p)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
                          isInCart(p.id) ? 'bg-emerald-600 text-white' : 'bg-[#6B7FA3]/20 hover:bg-[#C9A84C] hover:text-[#2C2C2C] text-[#6B7FA3]'
                        }`}>
                        {isInCart(p.id) ? 'Added ✓' : 'Order'}
                      </button>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── PERSONALISED GIFTS SECTION ── */
function PersonalisedGiftsSection({ cat, products, addToCart, toggleWishlist, isInCart, isWishlisted, navigate }) {
  return (
    <section className="relative z-10 max-w-[1600px] mx-auto w-full px-4 md:px-6">
      <div className="relative overflow-hidden rounded-3xl p-6 md:p-8 border border-[#C0737A]/40 shadow-xl text-[#F0DFA0]">
        
        <LiveBackground theme="cream-waves" />

        {/* Header */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-4 border-b border-[#C0737A]/30 gap-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl p-2.5 bg-[#C0737A]/10 rounded-2xl border border-[#C0737A]/30 shadow-sm">🎁</span>
            <div>
              <h2 className="text-white font-cinzel font-bold text-2xl md:text-4xl flex items-center gap-2">
                {cat.label} <span className="text-xs font-bold text-white bg-[#C0737A] px-3 py-0.5 rounded-full border border-[#C0737A]/80">({products.length} Items)</span>
              </h2>
              <p className="text-stone-300 text-xs md:text-sm mt-0.5">Custom mugs, cushions, photo frames, name plates & hampers 🎁</p>
            </div>
          </div>
          <button onClick={() => navigate('/category', { state: { category: cat.label } })}
            className="flex items-center gap-1.5 text-white text-xs md:text-sm font-bold bg-[#C0737A] hover:bg-[#A85F65] px-5 py-2.5 rounded-full transition-all shadow-md">
            View All Gifts ({products.length}) <ArrowRight size={14} />
          </button>
        </div>

        {/* 6 Clean Cards Grid */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {products.map((p, idx) => (
            <ScrollReveal key={p.id} delay={idx * 65} animation="scale-up" className="h-full">
              <div className="bg-white rounded-2xl border border-[#C0737A]/20 p-3 overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer group flex flex-col h-full">
                <Link to={`/product/${p.id}`} className="relative h-36 bg-[#F9F5F0] rounded-xl overflow-hidden block mb-2">
                  <MediaDisplay src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <span className="absolute top-1.5 left-1.5 bg-[#C0737A] text-white text-[8px] font-bold px-2 py-0.5 rounded-full shadow">
                    {p.badge || 'PERSONALISED'}
                  </span>
                  <button onClick={(e) => { e.preventDefault(); toggleWishlist(p); }}
                    className="absolute top-1.5 right-1.5 bg-white/90 rounded-full p-1.5 shadow-sm hover:scale-110 transition-transform">
                    <Heart size={12} className={isWishlisted(p.id) ? 'fill-red-500 text-red-500' : 'text-stone-400'} />
                  </button>
                </Link>

                <div className="flex flex-col flex-1 justify-between">
                  <div>
                    <span className="text-[9px] text-[#C0737A] font-bold uppercase tracking-wider">{p.tag || 'CUSTOM GIFT'}</span>
                    <Link to={`/product/${p.id}`} className="text-stone-800 text-xs font-bold leading-tight block mt-0.5 line-clamp-2 hover:text-[#C0737A]">
                      {p.name}
                    </Link>
                  </div>

                  <div className="mt-3 pt-2 border-t border-[#C0737A]/10">
                    <div className="flex items-baseline gap-1">
                      <span className="text-[#2C2C2C] font-black text-sm">₹{p.price}</span>
                      {p.mrp && <span className="text-stone-400 text-[10px] line-through">₹{p.mrp}</span>}
                    </div>

                    <button onClick={() => addToCart(p)}
                      className={`w-full mt-2 text-[11px] font-bold py-1.5 rounded-xl transition-all flex items-center justify-center gap-1 ${
                        isInCart(p.id) ? 'bg-emerald-700 text-white' : 'bg-[#C0737A] hover:bg-[#A85F65] text-white shadow-sm'
                      }`}>
                      <ShoppingBag size={11} /> {isInCart(p.id) ? 'Added ✓' : 'Gift This'}
                    </button>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── DECOR ART SECTION ── */
function DecorArtSection({ cat, products, addToCart, toggleWishlist, isInCart, isWishlisted, navigate }) {
  const hero = products[0];
  const rest = products.slice(1);

  return (
    <section className="relative z-10 max-w-[1600px] mx-auto w-full px-4 md:px-6">
      <div className="relative overflow-hidden rounded-3xl p-6 md:p-8 border border-[#C9A84C]/60 shadow-xl text-[#F0DFA0]">
        
        <LiveBackground theme="cream-waves" />

        {/* Header */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between mb-8 pb-4 border-b border-[#C9A84C]/30 gap-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl p-2.5 bg-[#C9A84C]/20 rounded-2xl border border-[#C9A84C]/40 shadow-sm">💐</span>
            <div>
              <h2 className="text-[#F0DFA0] font-cinzel font-bold text-2xl md:text-4xl flex items-center gap-2">
                {cat.label} Collection <span className="text-xs font-bold text-[#2C2C2C] bg-[#C9A84C] px-3 py-0.5 rounded-full border border-[#A8873A]">({products.length} Pieces)</span>
              </h2>
              <p className="text-[#C9A84C]/80 text-xs md:text-sm mt-0.5">Wall art, mandala, fluid art, macramé & more 💐</p>
            </div>
          </div>
          <button onClick={() => navigate('/category', { state: { category: cat.label } })}
            className="flex items-center gap-1.5 text-[#2C2C2C] text-xs md:text-sm font-bold bg-[#C9A84C] hover:bg-[#A8873A] px-5 py-2.5 rounded-full transition-all shadow-md">
            View All Décor Art ({products.length}) <ArrowRight size={14} />
          </button>
        </div>

        {/* Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Left Feature Banner */}
          {hero && (
            <div className="lg:col-span-4 bg-gradient-to-br from-[#2C2C2C] to-[#1A1A1A] rounded-2xl p-5 text-[#F0DFA0] flex flex-col justify-between shadow-xl relative overflow-hidden group">
              <div className="absolute top-3 left-3 z-10 bg-[#C9A84C] text-[#2C2C2C] text-[10px] font-black uppercase px-2.5 py-1 rounded-md shadow flex items-center gap-1">
                <Award size={12} /> FEATURED ARTWORK
              </div>

              <Link to={`/product/${hero.id}`} className="relative h-56 rounded-xl overflow-hidden mb-4 block">
                <MediaDisplay src={hero.img} alt={hero.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </Link>

              <div>
                <span className="text-[10px] text-[#C9A84C] font-bold uppercase tracking-wider">{hero.badge || 'WALL ART'}</span>
                <Link to={`/product/${hero.id}`} className="font-cinzel text-[#F0DFA0] font-bold text-lg md:text-xl leading-tight block mt-1 hover:text-[#C9A84C]">
                  {hero.name}
                </Link>
                <p className="text-[#C9A84C]/80 text-xs mt-2 line-clamp-2">Hand-painted with passion to transform your living spaces into art galleries.</p>

                <div className="flex items-baseline gap-2 mt-4">
                  <span className="text-2xl font-black text-[#C9A84C]">₹{hero.price}</span>
                  {hero.mrp && <span className="text-[#F0DFA0]/50 text-sm line-through">₹{hero.mrp}</span>}
                </div>

                <button onClick={() => addToCart(hero)}
                  className={`w-full mt-4 text-xs md:text-sm font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-md ${
                    isInCart(hero.id) ? 'bg-emerald-600 text-white' : 'bg-[#C9A84C] hover:bg-[#A8873A] text-[#2C2C2C]'
                  }`}>
                  <ShoppingBag size={14} /> {isInCart(hero.id) ? 'Added to Cart ✓' : 'Add Décor Art to Cart'}
                </button>
              </div>
            </div>
          )}

          {/* Right 5 Product Cards Grid */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
            {rest.map((p, idx) => (
              <ScrollReveal key={p.id} delay={idx * 60} animation="scale-up" className="h-full">
                <div className="bg-white/90 rounded-2xl border border-[#C9A84C]/30 overflow-hidden hover:border-[#C9A84C] transition-all group flex flex-col h-full shadow-sm p-2.5">
                  <Link to={`/product/${p.id}`} className="relative h-32 bg-[#F9F5F0] rounded-xl overflow-hidden block mb-2">
                    <MediaDisplay src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <span className="absolute top-1 left-1 bg-[#C9A84C] text-[#2C2C2C] text-[8px] font-bold px-1.5 py-0.5 rounded">{p.tag || 'HANDMADE'}</span>
                  </Link>

                  <div className="flex flex-col flex-1 justify-between">
                    <div>
                      <p className="text-[8px] text-[#C9A84C] font-bold uppercase line-clamp-1">{p.badge || 'Décor Art'}</p>
                      <Link to={`/product/${p.id}`} className="text-stone-800 text-xs font-bold leading-tight block mt-0.5 line-clamp-2 hover:text-[#C9A84C]">
                        {p.name}
                      </Link>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#C9A84C]/20">
                      <span className="text-[#2C2C2C] font-black text-xs">₹{p.price}</span>
                      <button onClick={() => addToCart(p)}
                        className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                          isInCart(p.id) ? 'bg-emerald-600 text-white' : 'bg-[#2C2C2C] hover:bg-[#C9A84C] hover:text-[#2C2C2C] text-[#F0DFA0]'
                        }`}>
                        <ShoppingBag size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── FESTIVE PACKAGES SECTION ── */
function FestivePackagesSection({ cat, products, addToCart, toggleWishlist, isInCart, isWishlisted, navigate }) {
  return (
    <section className="relative z-10 max-w-[1600px] mx-auto w-full px-4 md:px-6">
      <div className="relative overflow-hidden rounded-3xl p-6 md:p-8 border border-[#C9A84C]/50 shadow-2xl  text-[#F0DFA0]">
        
        <LiveBackground theme="gold-mesh" />

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 pb-4 border-b border-[#C9A84C]/30 gap-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl p-2.5 bg-[#C9A84C]/20 rounded-2xl border border-[#C9A84C]/40 shadow-inner">📦</span>
            <div>
              <h2 className="text-[#F0DFA0] font-cinzel font-bold text-2xl md:text-4xl flex items-center gap-2">
                {cat.label} <span className="text-xs font-bold text-[#2C2C2C] bg-[#C9A84C] px-3 py-0.5 rounded-full border border-[#A8873A]">({products.length} Packages)</span>
              </h2>
              <p className="text-[#C9A84C]/80 text-xs md:text-sm mt-0.5">Custom art gift combos for weddings, birthdays & celebrations 🎉</p>
            </div>
          </div>
          <button onClick={() => navigate('/category', { state: { category: cat.label } })}
            className="flex items-center gap-1.5 text-[#2C2C2C] text-xs md:text-sm font-bold bg-[#C9A84C] hover:bg-[#A8873A] px-5 py-2.5 rounded-full transition-all shadow-lg">
            Explore All Packages ({products.length}) <ArrowRight size={14} />
          </button>
        </div>

        {/* 6 Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {products.map((p, idx) => (
            <ScrollReveal key={p.id} delay={idx * 70} animation="scale-up" className="h-full">
              <div className="bg-[#1A1410]/90 rounded-2xl border border-[#C9A84C]/40 overflow-hidden shadow-xl hover:border-[#C9A84C] transition-all cursor-pointer group flex flex-col h-full">
                <Link to={`/product/${p.id}`} className="relative h-40 bg-[#2A2010] overflow-hidden block">
                  <MediaDisplay src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute top-2 left-2 bg-[#C9A84C] text-[#2C2C2C] text-[9px] font-black px-2 py-0.5 rounded shadow flex items-center gap-1">
                    <Sparkles size={10} /> {p.badge || 'FESTIVE SET'}
                  </div>
                  <button onClick={(e) => { e.preventDefault(); toggleWishlist(p); }}
                    className="absolute top-2 right-2 bg-[#1A1410]/80 rounded-full p-1.5 text-[#C9A84C] hover:text-red-500 transition-colors">
                    <Heart size={13} className={isWishlisted(p.id) ? 'fill-red-500 text-red-500' : ''} />
                  </button>
                </Link>

                <div className="p-3 flex flex-col flex-1 justify-between">
                  <div>
                    <span className="text-[9px] text-[#C9A84C] font-bold uppercase tracking-wider">{p.tag || 'CELEBRATION SPECIAL'}</span>
                    <Link to={`/product/${p.id}`} className="font-cinzel text-[#F0DFA0] text-xs font-bold leading-tight block mt-0.5 line-clamp-2 hover:text-[#C9A84C]">
                      {p.name}
                    </Link>
                  </div>

                  <div className="mt-3">
                    <div className="flex items-baseline gap-1">
                      <span className="text-[#C9A84C] font-black text-sm">₹{p.price}</span>
                      {p.mrp && <span className="text-[#F0DFA0]/40 text-[10px] line-through">₹{p.mrp}</span>}
                    </div>

                    <button onClick={() => addToCart(p)}
                      className={`w-full mt-2 text-[11px] font-bold py-2 rounded-xl transition-all flex items-center justify-center gap-1 ${
                        isInCart(p.id) ? 'bg-emerald-600 text-white' : 'bg-gradient-to-r from-[#C9A84C] to-[#A8873A] hover:from-[#A8873A] hover:to-[#C9A84C] text-[#2C2C2C] shadow-md'
                      }`}>
                      <ShoppingBag size={11} /> {isInCart(p.id) ? 'Added ✓' : 'Gift Now 🎁'}
                    </button>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── CATEGORY SECTIONS GRID ── */
function CategorySectionsGrid() {
  const { categories, products } = useData();
  const { addToCart, toggleWishlist, isInCart, isWishlisted } = useCart();
  const navigate = useNavigate();

  return (
    <div className="space-y-4 md:space-y-6 mb-4">
      {categories.map((cat) => {
        const catProducts = products.filter(p => p.category === cat.label);
        const props = { cat, products: catProducts, addToCart, toggleWishlist, isInCart, isWishlisted, navigate };

        if (cat.label === 'Custom Portraits') return <CustomPortraitsSection key={cat.label} {...props} />;
        if (cat.label === 'Resin Art') return <ResinArtSection key={cat.label} {...props} />;
        if (cat.label === 'Digital Designs') return <DigitalDesignsSection key={cat.label} {...props} />;
        if (cat.label === 'Personalised Gifts') return <PersonalisedGiftsSection key={cat.label} {...props} />;
        if (cat.label === 'Decor Art') return <DecorArtSection key={cat.label} {...props} />;
        if (cat.label === 'Festive Packages') return <FestivePackagesSection key={cat.label} {...props} />;

        // Fallback for any dynamic new categories
        return (
          <section key={cat.label} className="relative z-10 max-w-[1600px] mx-auto w-full px-4 md:px-6 mb-6">
            <div className="glass-panel rounded-3xl p-4 md:p-6 relative overflow-hidden">
              <LiveBackground theme="cream-waves" />
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between mb-4 pb-3 border-b border-[#C9A84C]/30 gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl p-2 bg-[#C9A84C]/20 rounded-2xl border border-[#C9A84C]/30 shadow-sm">{cat.emoji || '✨'}</span>
                  <div>
                    <h2 className="text-[#F0DFA0] font-cinzel font-bold text-xl md:text-3xl flex items-center gap-2">
                      {cat.label} <span className="text-xs font-bold text-[#2C2C2C] bg-[#C9A84C] px-2 py-0.5 rounded-full">({catProducts.length})</span>
                    </h2>
                  </div>
                </div>
                <button onClick={() => navigate('/category', { state: { category: cat.label } })}
                  className="flex items-center gap-1.5 text-[#2C2C2C] text-xs font-bold bg-[#C9A84C] hover:bg-[#A8873A] hover:text-[#2C2C2C] px-4 py-2 rounded-full transition-all">
                  View All <ArrowRight size={12} />
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {catProducts.map((p, idx) => (
                  <ScrollReveal key={p.id} delay={idx * 50} animation="scale-up" className="h-full">
                    <div className="bg-white/80 rounded-xl border border-[#C9A84C]/20 overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col h-full">
                      <Link to={`/product/${p.id}`} className="h-28 bg-[#F2EDE4] overflow-hidden block">
                        <MediaDisplay src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      </Link>
                      <div className="p-2.5 flex flex-col flex-1 justify-between">
                        <Link to={`/product/${p.id}`} className="text-[#2C2C2C] text-xs font-bold leading-tight line-clamp-2 hover:text-[#C9A84C]">{p.name}</Link>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-[#2C2C2C] font-black text-xs">₹{p.price}</span>
                          <button onClick={() => addToCart(p)} className={`p-1 rounded-lg ${isInCart(p.id) ? 'bg-emerald-600 text-white' : 'bg-[#C9A84C]/20 hover:bg-[#C9A84C] hover:text-[#2C2C2C] text-[#C9A84C]'}`}>
                            <ShoppingBag size={11} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}

/* ── TRUST BADGES ── */
function TrustBadges() {
  return (
    <section className="relative z-10 max-w-[1600px] mx-auto w-full px-4 md:px-6 mb-8">
      <div className="relative overflow-hidden rounded-3xl p-6 md:p-8 border border-[#C9A84C]/40 shadow-xl ">
        <LiveBackground theme="brand-rich" />
        
        <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {[
            { icon: <Brush size={28} className="text-[#C9A84C]" />, title: '100% Handmade', sub: 'Every piece crafted by hand with love' },
            { icon: <ShieldCheck size={28} className="text-[#C9A84C]" />, title: 'Quality Assured', sub: 'Premium materials only' },
            { icon: <Heart size={28} className="text-[#C9A84C]" />, title: '5000+ Happy Clients', sub: 'Trusted by art lovers across India' },
            { icon: <Award size={28} className="text-[#C9A84C]" />, title: 'Custom Orders', sub: 'Your imagination, our creation' },
          ].map((b, i) => (
            <ScrollReveal key={i} delay={i * 100} animation="scale-up-smooth" className="h-full">
              <div className="bg-[#F9F5F0] rounded-2xl p-5 flex flex-col items-center text-center gap-3 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 h-full justify-center border border-[#C9A84C]/20 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10">
                  <div className="mb-2 inline-flex items-center justify-center p-3 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/20 group-hover:bg-[#C9A84C]/20 transition-colors">
                    {b.icon}
                  </div>
                  <p className="font-cinzel font-bold text-sm md:text-base text-[#2C2C2C] mb-1 uppercase">
                    <TypewriterText text={b.title} delay={(i * 100) + 300} />
                  </p>
                  <p className="text-xs text-stone-500 font-medium">{b.sub}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── DEALS TICKER ── */
function DealsTicker() {
  const { deals } = useData();
  const navigate = useNavigate();
  if (!deals || deals.length === 0) return null;

  const items = [...deals, ...deals];

  return (
    <div className="relative z-10 max-w-[1600px] mx-auto w-full px-4 md:px-6 mb-4">
      <div className="overflow-hidden rounded-2xl border border-[#C9A84C]/40 bg-[#2C2C2C] py-3 cursor-pointer" onClick={() => navigate('/offers')}>
        <div className="animate-marquee flex gap-8">
          {items.map((d, i) => (
            <span key={i} className="flex-shrink-0 flex items-center gap-3 text-[#F0DFA0] font-bold text-sm">
              <span className="text-[#C9A84C]">✦</span>
              <span className="text-[#C9A84C] font-mono font-black tracking-widest">{d.code}</span>
              <span>{d.title}</span>
              <span className="bg-[#C9A84C] text-[#2C2C2C] px-2 py-0.5 rounded-full text-[10px] font-black">{d.badge || d.discount}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── MAIN HOME PAGE ── */
export default function HomePage() {
  const { loading } = useData();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen mesh-bg">
      <Header />
      <main className="flex-1 pb-24 md:pb-8 space-y-4 md:space-y-6 pt-2">
        <HeroCarousel />
        <DealsTicker />
        <TrustBadges />
        <QuickCategories />
        <SiteHeroBannersSection />
        <CategorySectionsGrid />
      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-[#2C2C2C] text-[#F0DFA0] border-t border-[#C9A84C]/30 pt-10 pb-24 md:pb-10">
        <div className="max-w-[1600px] mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <img src="/logo.jpg" alt="Chaitali's Artbizz" className="w-14 h-14 rounded-full border-2 border-[#C9A84C] object-cover" />
                <div>
                  <p className="font-cinzel font-bold text-[#F0DFA0] text-lg">CHAITALI'S</p>
                  <p className="font-cinzel text-[#C9A84C] tracking-widest text-sm">ARTBIZZ</p>
                </div>
              </div>
              <p className="text-[#C9A84C]/80 text-sm leading-relaxed italic">"Imagine. We Will Create."</p>
              <p className="text-stone-500 text-xs mt-2">Handcrafted art & personalised gifts made with love.</p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-cinzel font-bold text-[#C9A84C] mb-4 uppercase tracking-wider text-sm">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                {['Home', 'Art Catalogue', 'Deals & Offers', 'Training Program', 'My Account'].map(l => (
                  <li key={l}><button onClick={() => navigate(l === 'Home' ? '/' : l === 'Art Catalogue' ? '/category' : l === 'Deals & Offers' ? '/offers' : l === 'Training Program' ? '/hub' : '/account')} className="text-stone-400 hover:text-[#C9A84C] transition-colors">{l}</button></li>
                ))}
              </ul>
            </div>

            {/* Art Categories */}
            <div>
              <h4 className="font-cinzel font-bold text-[#C9A84C] mb-4 uppercase tracking-wider text-sm">Art Categories</h4>
              <ul className="space-y-2 text-sm">
                {['Custom Portraits', 'Resin Art', 'Digital Designs', 'Personalised Gifts', 'Decor Art', 'Festive Packages'].map(c => (
                  <li key={c}><button onClick={() => navigate('/category', { state: { category: c } })} className="text-stone-400 hover:text-[#C9A84C] transition-colors">{c}</button></li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-cinzel font-bold text-[#C9A84C] mb-4 uppercase tracking-wider text-sm">Get In Touch</h4>
              <ul className="space-y-2 text-sm text-stone-400">
                <li>📱 +91 98765 43210</li>
                <li>📧 hello@chaitaliartbizz.com</li>
                <li>📍 India (Shipping Nationwide)</li>
                <li className="pt-2">
                  <div className="flex gap-3">
                    <a href="https://www.instagram.com/chaitalis_artbizz/" target="_blank" rel="noopener noreferrer" className="text-[#C9A84C] hover:text-white transition-colors text-xs font-bold">Instagram</a>
                    {['Facebook', 'WhatsApp'].map(s => (
                      <span key={s} className="text-[#C9A84C] hover:text-white cursor-pointer transition-colors text-xs font-bold">{s}</span>
                    ))}
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-[#C9A84C]/20 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-stone-500 text-xs">© 2026 Chaitali's Artbizz. All rights reserved. Made with ❤️ in India.</p>
            <p className="text-[#C9A84C] text-xs font-bold italic">Imagine. We Will Create.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}



