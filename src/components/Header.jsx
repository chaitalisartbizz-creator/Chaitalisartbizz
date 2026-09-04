import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Search, Heart, ShoppingBag, ChevronDown,
  MapPin, Phone, User, Tag, Sparkles, Award, Palette, Menu, X
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import Fuse from 'fuse.js';

const NAV_LINKS = [
  { label: 'Home',           path: '/' },
  { label: 'Art Catalogue',  path: '/category', hasDropdown: true },
  { label: 'Deals & Offers', path: '/offers' },
  { label: 'Instagram Feeds', path: '/feeds', isIcon: true },
  { label: 'Training Program',   path: '/hub' },
];

const SHOP_DROPS = [
  { label: '🪡 Hand Embroidery', sub: 'Shirt, T-shirt, Scarf, Hoop' },
  { label: '🎨 Fabric Painting', sub: 'Shirt, T-shirt, Scarf, Hoop' },
  { label: '🧸 Baby Welcome Frame', sub: 'Different sizes available' },
  { label: '🖼️ Canvas Painting', sub: 'Custom handpainted canvas art' },
  { label: '🕯️ Candles', sub: 'Photo candle jar, Scented, Mithai, Flower, Decorative, 12 Scents, Uurli (Diwali)' },
  { label: '✨ Resin Art', sub: 'Clock, Tray, Table, Frame, Varmala Preservation, Baby Kit Set, 3D Photo Frame, Religious Frames (Mahadev, Ganpati, Golden Temple, Asivusa, Navkar Mantra), Haldi/Mehendi/Ring Platter, Rakhi, Jewellery (Earrings, Bracelet, Bangles, Pendant, Necklace)' },
  { label: '📷 3D Photo Creation', sub: 'Custom 3D photo creations' },
  { label: '🎁 Packing (Trousseau)', sub: 'Engagement, Baby Shower, Naming Ceremony, Shadi, Rukvat, Bouquets (Candle, Money, Chocolate, Flower, Photo), Hampers' },
  { label: '🎯 Activity Zone', sub: 'Thumb Print Tree, String Art, Reveal Photo Frame' },
  { label: '🪔 Diwali Spl', sub: 'Toran, Bandhanwar, Shubh Labh, Tea Light Holder, Decorated Panti' },
];

const InstagramGlowingLogo = () => (
  <div className="relative inline-flex items-center justify-center group overflow-visible px-2 py-0.5 rounded-lg">
    <div className="absolute inset-0 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity blur-[4px] rounded-lg" />
    <div className="flex items-center gap-1.5 font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600 drop-shadow-sm group-hover:drop-shadow-md transition-all">
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="18" height="18" viewBox="0 0 24 24" fill="none" 
        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" 
        className="text-pink-500 group-hover:scale-110 transition-transform duration-300"
      >
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
      </svg>
      FEEDS
    </div>
  </div>
);

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartCount, wishlistItems, setCartOpen } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { products, frontendSettings, categories } = useData();
  const settings = frontendSettings || {};
  const wishlistCount = wishlistItems ? wishlistItems.length : 0;

  const [shopOpen, setShopOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const suggestions = React.useMemo(() => {
    if (!query.trim() || !products) return [];
    const fuse = new Fuse(products, {
      keys: ['name', 'brand', 'category'],
      threshold: 0.4,
      distance: 100
    });
    return fuse.search(query).slice(0, 5).map(r => r.item);
  }, [query, products]);
  
  const handleSearch = () => {
    if (query.trim()) {
      navigate('/category', { state: { searchQuery: query } });
      setShopOpen(false);
      setShowSuggestions(false);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* ── TOP UTILITY BAR (desktop) ── */}
      <div className="hidden md:block bg-[#2C2C2C] text-[#F0DFA0] text-xs">
        <div className="max-w-[1600px] mx-auto px-6 py-1.5 flex items-center justify-between">
          <div className="flex items-center gap-4 text-[#C9A84C]">
            <span className="flex items-center gap-1.5 font-medium"><Phone size={11} /> Contact: +91 98765 43210</span>
            <span className="flex items-center gap-1.5"><MapPin size={11} /> Handcrafted with Love | 100% Custom Made</span>
          </div>
          <div className="flex items-center gap-4 text-[#C9A84C]">
            <span className="flex items-center gap-1"><Award size={11} className="text-[#C9A84C]" /> Trusted by 5000+ Happy Clients</span>
            <span>|</span>
            <span>🚚 Free Delivery on Orders Over ₹999</span>
            <span>|</span>
            <button onClick={() => navigate('/offers')} className="text-[#F0DFA0] font-bold hover:text-white transition-colors flex items-center gap-1">
              <Sparkles size={11} /> Promo Code: ART10
            </button>
          </div>
        </div>
      </div>

      {/* ── MAIN NAVIGATION HEADER ── */}
      <header className="sticky top-0 z-50 bg-white/60 backdrop-blur-2xl backdrop-saturate-[1.8] border-b border-white/50 shadow-[0_8px_32px_0_rgba(0,0,0,0.08)]">
        <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-2.5 flex items-center gap-4">

          {/* Brand Logo */}
          <button onClick={() => navigate('/')} className="flex-shrink-0 flex items-center gap-3 group">
            <div className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center overflow-hidden rounded-full border-2 border-[#C9A84C] shadow-md bg-[#F2EDE4] p-0.5 group-hover:scale-105 transition-transform duration-300">
              <img src="/logo.jpg" alt="Chaitali's Artbizz Logo" className="w-full h-full object-cover rounded-full" />
            </div>
            <div className="flex flex-col leading-none text-left hidden sm:flex">
              <span className="text-[#2C2C2C] font-cinzel font-bold text-lg md:text-xl tracking-tight group-hover:text-[#C9A84C] transition-colors">CHAITALI'S</span>
              <span className="text-[#8B5E7A] font-cinzel font-semibold text-sm md:text-base tracking-widest">ARTBIZZ</span>
              <span className="text-[9px] md:text-[10px] text-[#C9A84C] font-bold tracking-wider uppercase mt-0.5">Imagine. We Will Create.</span>
            </div>
          </button>

          {/* Spacer for Mobile to push action icons to the right */}
          <div className="flex-1 md:hidden" />

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 ml-2 lg:ml-4">
            {NAV_LINKS.map(link => (
              <div key={link.label} className="relative group">
                <button
                  onClick={() => !link.hasDropdown && navigate(link.path)}
                  onMouseEnter={() => link.hasDropdown && setShopOpen(true)}
                  onMouseLeave={() => link.hasDropdown && setShopOpen(false)}
                  className={`desk-nav-link flex items-center gap-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap ${
                    isActive(link.path)
                      ? 'text-[#C9A84C] active'
                      : 'text-stone-700 hover:text-[#C9A84C] hover:bg-black/5'
                  }`}
                >
                  {link.isIcon ? <InstagramGlowingLogo /> : link.label}
                  {link.hasDropdown && <ChevronDown size={13} className="opacity-60 flex-shrink-0" />}
                </button>

                {link.hasDropdown && (
                  <div
                    onMouseEnter={() => setShopOpen(true)}
                    onMouseLeave={() => setShopOpen(false)}
                    className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[44rem] bg-white/95 backdrop-blur-3xl backdrop-saturate-[2] rounded-2xl shadow-2xl border border-[#C9A84C]/20 overflow-hidden transition-all duration-200 z-[100] ${
                      shopOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'
                    }`}
                  >
                    <div className="p-4 grid grid-cols-2 gap-2">
                      {SHOP_DROPS.map(d => (
                        <button
                          key={d.label}
                          onClick={() => { 
                            const categoryName = d.label.split(' ').slice(1).join(' ');
                            navigate('/category', { state: { category: categoryName } }); 
                            setShopOpen(false); 
                          }}
                          className="w-full flex items-start gap-3 px-3 py-2.5 rounded-xl hover:bg-[#F2EDE4] transition-colors text-left group"
                        >
                          <span className="text-xl flex-shrink-0 mt-0.5">{d.label.split(' ')[0]}</span>
                          <div>
                            <p className="text-stone-900 font-bold text-sm group-hover:text-[#A8873A] transition-colors">
                              {d.label.substring(d.label.indexOf(' ') + 1)}
                            </p>
                            <p className="text-stone-500 text-xs leading-snug">{d.sub}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                    <div className="bg-black/5 px-4 py-2.5 border-t border-white/40 flex justify-between items-center">
                      <button onClick={() => { navigate('/category'); setShopOpen(false); }}
                        className="text-[#C9A84C] text-xs font-bold hover:underline">
                        View All Art Collections →
                      </button>
                      <span className="text-[10px] text-[#8B5E7A] font-bold bg-[#8B5E7A]/10 px-2 py-0.5 rounded-full">100% Custom</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {/* Dynamic Account/Login Link in Desktop Nav */}
            <button 
              onClick={() => navigate(isAuthenticated ? '/account' : '/login')}
              className={`font-cinzel font-bold text-sm lg:text-[15px] tracking-wide whitespace-nowrap transition-all ${
                isActive(isAuthenticated ? '/account' : '/login') 
                  ? 'text-[#C9A84C]' 
                  : 'text-stone-700 hover:text-[#C9A84C]'
              }`}
            >
              {isAuthenticated ? 'My Account' : 'Login / Sign Up'}
            </button>
          </nav>

          {/* Search, Actions & Icons */}
          <div className="hidden md:flex items-center gap-2 lg:gap-4 ml-auto">
            {/* Search */}
            <div className="relative">
              <div className="flex items-center bg-white/40 backdrop-blur-md rounded-full px-4 py-2 border border-white/60 shadow-inner focus-within:bg-white/80 focus-within:border-[#C9A84C] focus-within:ring-2 focus-within:ring-[#C9A84C]/20 transition-all w-48 lg:w-80">
              <Search size={15} className="text-[#C9A84C]/70 flex-shrink-0" />
              <input
                type="text"
                value={query}
                onChange={e => {
                  setQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                placeholder="Search 'Custom Portrait', 'Resin Art', 'Personalised Gift'..."
                className="flex-1 bg-transparent text-sm text-stone-800 placeholder-[#8B5E7A]/40 outline-none min-w-0 font-medium"
              />
              {query && (
                <button onClick={() => { setQuery(''); setShowSuggestions(false); }} className="text-stone-400 hover:text-stone-600">
                  <span className="text-xs font-bold">✕</span>
                </button>
              )}
              <button onClick={handleSearch} className="hidden md:flex items-center gap-1.5 bg-gradient-to-r from-[#C9A84C] to-[#A8873A] hover:from-[#A8873A] hover:to-[#C9A84C] rounded-lg px-3 py-1 flex-shrink-0 shadow-sm transition-all">
                <Search size={13} className="text-white" />
                <span className="text-white text-xs font-bold">Search</span>
              </button>
              <button onClick={handleSearch} className="md:hidden bg-[#C9A84C] rounded-lg p-1.5 flex-shrink-0">
                <Search size={14} className="text-white" />
              </button>
            </div>

            {/* Suggestions Dropdown */}
              {showSuggestions && query.trim() !== '' && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white/80 backdrop-blur-xl backdrop-saturate-[1.8] rounded-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.12)] border border-white/60 overflow-hidden z-50">
                  {suggestions.length > 0 ? (
                    <div className="py-2">
                      {suggestions.map((item, idx) => (
                        <div 
                          key={idx} 
                          className="px-4 py-2 hover:bg-black/5 cursor-pointer flex items-center gap-3 transition-colors"
                          onClick={() => {
                            navigate(`/product/${item.id}`);
                            setShowSuggestions(false);
                            setQuery('');
                          }}
                        >
                          {item.img && (
                            <img src={item.img} alt={item.name} className="w-9 h-9 object-cover rounded-md flex-shrink-0 border border-[#C9A84C]/30" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-stone-800 truncate">{item.name}</p>
                            <p className="text-xs text-[#C9A84C] font-medium truncate">{item.category} • ₹{item.price}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-sm text-stone-500">
                      No matching artworks for "{query}"
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {/* Wishlist */}
            <button
              onClick={() => navigate('/account', { state: { tab: 'My Wishlist' } })}
              className="relative p-2 rounded-xl hover:bg-[#F2EDE4] transition-colors"
              aria-label="Wishlist"
            >
              <Heart size={22} className="text-stone-700" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Trigger Button */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2 rounded-xl hover:bg-[#F2EDE4] transition-colors"
              aria-label="Cart"
            >
              <ShoppingBag size={22} className="text-stone-700" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#C9A84C] text-white text-[9px] font-bold rounded-full w-4.5 h-4.5 flex items-center justify-center badge-pulse shadow-md">
                  {cartCount}
                </span>
              )}
            </button>


            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 text-stone-700 hover:bg-[#F2EDE4] rounded-xl ml-1 transition-colors"
              aria-label="Open Menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>

        {/* Category Strip */}
        <div className="border-t border-[#C9A84C]/20 bg-[#F2EDE4]/50 py-1.5 px-4 md:px-6">
          <div className="max-w-[1600px] mx-auto flex items-center gap-2 overflow-x-auto scrollbar-hide">
            {(categories || []).map((cat) => {
              const currentCat = location.state?.category;
              const isSelected = currentCat === cat.label;
              return (
                <button
                  key={cat.id || cat.label}
                  onClick={() => navigate('/category', { state: { category: cat.label } })}
                  className={`flex-shrink-0 text-xs font-bold px-3 py-1 rounded-full border transition-all whitespace-nowrap ${
                    isSelected
                      ? 'bg-[#2C2C2C] text-[#C9A84C] border-[#2C2C2C] shadow-sm'
                      : 'bg-white/80 text-stone-700 border-[#C9A84C]/30 hover:border-[#C9A84C] hover:text-[#C9A84C] hover:bg-[#F2EDE4]'
                  }`}
                >
                  {cat.emoji && <span className="mr-1">{cat.emoji}</span>}{cat.label}
                </button>
              );
            })}
          </div>
        </div>
      </header>

        {/* Mobile Navigation Drawer */}
        <div 
          className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] transition-opacity duration-300 md:hidden ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
          onClick={() => setMobileMenuOpen(false)}
        >
          <div 
            className={`absolute top-0 right-0 w-[85%] max-w-[320px] h-full bg-[#FDFBF7] shadow-2xl transition-transform duration-300 transform flex flex-col ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b border-[#C9A84C]/30 bg-white">
              <div className="flex items-center gap-3">
                <img src="/logo.jpg" alt="Logo" className="w-10 h-10 rounded-full border border-[#C9A84C] object-cover" />
                <span className="font-cinzel font-bold text-[#2C2C2C]">Menu</span>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 bg-[#F2EDE4] text-stone-700 rounded-full">
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              <nav className="flex flex-col gap-2">
                {NAV_LINKS.map(link => (
                  <button
                    key={link.label}
                    onClick={() => {
                      if (!link.hasDropdown) {
                        navigate(link.path);
                        setMobileMenuOpen(false);
                      }
                    }}
                    className={`text-left px-4 py-3 rounded-xl font-bold transition-colors flex items-center justify-between ${
                      isActive(link.path) ? 'bg-[#2C2C2C] text-[#C9A84C]' : 'bg-white text-stone-700 hover:bg-[#F2EDE4]'
                    }`}
                  >
                    {link.isIcon ? <InstagramGlowingLogo /> : link.label}
                  </button>
                ))}
              </nav>

              <div className="pt-4 border-t border-stone-200">
                <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3 px-2">Art Collections</h4>
                <div className="space-y-2">
                  {SHOP_DROPS.map((drop, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        navigate('/category', { state: { category: drop.label.replace(/[^a-zA-Z\s]/g, '').trim() } });
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 rounded-xl bg-white text-sm font-semibold text-stone-700 flex flex-col gap-0.5 hover:bg-[#F2EDE4] transition-colors"
                    >
                      <span>{drop.label}</span>
                      <span className="text-[10px] text-stone-500 font-normal">{drop.sub}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-[#C9A84C]/30 bg-white">
              {isAuthenticated ? (
                <button
                  onClick={() => { navigate('/account'); setMobileMenuOpen(false); }}
                  className="w-full py-3 rounded-xl bg-[#2C2C2C] text-[#F0DFA0] font-bold flex items-center justify-center gap-2"
                >
                  <User size={18} /> My Account
                </button>
              ) : (
                <button
                  onClick={() => { navigate('/login'); setMobileMenuOpen(false); }}
                  className="w-full py-3 rounded-xl bg-[#C9A84C] text-[#2C2C2C] font-bold flex items-center justify-center gap-2"
                >
                  <User size={18} /> Sign In
                </button>
              )}
            </div>
          </div>
        </div>


    </>
  );
}
