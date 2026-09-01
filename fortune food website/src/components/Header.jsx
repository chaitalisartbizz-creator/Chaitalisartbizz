import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Search, Heart, ShoppingBag, ChevronDown,
  MapPin, Phone, User, Tag, Sparkles, Award
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import Fuse from 'fuse.js';

const NAV_LINKS = [
  { label: 'Home',           path: '/' },
  { label: 'Store Catalogue',path: '/category', hasDropdown: true },
  { label: 'Deals & Offers', path: '/offers' },
  { label: 'Wellness Hub',   path: '/hub' },
  { label: 'My Account',     path: '/account' },
];

const SHOP_DROPS = [
  { label: '🌰 Dry Fruits',    sub: 'Almonds, Cashews, Figs, Walnuts' },
  { label: '🌿 Exotic Spices', sub: 'Kashmiri Saffron, Cardamom, Pepper' },
  { label: '🥜 Gourmet Nuts',  sub: 'Roasted Pistachios, Macadamia' },
  { label: '🌱 Healthy Seeds', sub: 'Chia, Flax, Pumpkin Seeds' },
  { label: '🫒 Pure Ghee & Oils', sub: 'A2 Gir Cow Ghee, Mustard Oil' },
  { label: '🎁 Festive Gift Boxes', sub: 'Luxury Hampers & Royal Chests' },
];

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartCount, wishlistItems, setCartOpen } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { products, frontendSettings } = useData();
  const settings = frontendSettings || {};
  const wishlistCount = wishlistItems ? wishlistItems.length : 0;

  const [shopOpen, setShopOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const suggestions = React.useMemo(() => {
    if (!query.trim() || !products) return [];
    const fuse = new Fuse(products, {
      keys: ['name', 'brand', 'category', 'petType'],
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
      <div className="hidden md:block bg-[#5c3110] text-amber-50 text-xs">
        <div className="max-w-[1600px] mx-auto px-6 py-1.5 flex items-center justify-between">
          <div className="flex items-center gap-4 text-amber-200">
            <span className="flex items-center gap-1.5 font-medium"><Phone size={11} /> Helpline: 1800-FORTUNE (367886)</span>
            <span className="flex items-center gap-1.5"><MapPin size={11} /> Farm Direct Sourcing | 100% Lab Certified</span>
          </div>
          <div className="flex items-center gap-4 text-amber-200">
            <span className="flex items-center gap-1"><Award size={11} className="text-amber-400" /> FSSAI Certified Organic</span>
            <span>|</span>
            <span>🚚 Free Express Shipping on Orders Over ₹999</span>
            <span>|</span>
            <button onClick={() => navigate('/offers')} className="text-amber-300 font-bold hover:text-white transition-colors flex items-center gap-1">
              <Sparkles size={11} /> Promo Code: PURITY10
            </button>
          </div>
        </div>
      </div>

      {/* ── MAIN NAVIGATION HEADER ── */}
      <header className="bg-white/95 backdrop-blur-md sticky top-0 z-50 border-b border-amber-200/60 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-2.5 flex items-center gap-4">

          {/* Brand Logo */}
          <button onClick={() => navigate('/')} className="flex-shrink-0 flex items-center gap-3 group">
            <div className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center overflow-hidden rounded-full border-2 border-amber-400 shadow-md bg-amber-50 p-1 group-hover:scale-105 transition-transform duration-300">
              <img src="/logo.png" alt="Fortune Food Logo" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col leading-none text-left hidden sm:flex">
              <span className="text-[#5c3110] font-cinzel font-bold text-lg md:text-xl tracking-tight group-hover:text-[#d97706] transition-colors">FORTUNE FOOD</span>
              <span className="text-[9px] md:text-[10px] text-[#2563eb] font-bold tracking-wider uppercase mt-0.5">Promise of Purity</span>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 ml-4">
            {NAV_LINKS.map(link => (
              <div key={link.label} className="relative group">
                <button
                  onClick={() => !link.hasDropdown && navigate(link.path)}
                  onMouseEnter={() => link.hasDropdown && setShopOpen(true)}
                  onMouseLeave={() => link.hasDropdown && setShopOpen(false)}
                  className={`desk-nav-link flex items-center gap-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
                    isActive(link.path)
                      ? 'text-[#d97706] active'
                      : 'text-stone-700 hover:text-[#d97706] hover:bg-amber-50'
                  }`}
                >
                  {link.label}
                  {link.hasDropdown && <ChevronDown size={13} className="opacity-60" />}
                </button>

                {link.hasDropdown && (
                  <div
                    onMouseEnter={() => setShopOpen(true)}
                    onMouseLeave={() => setShopOpen(false)}
                    className={`absolute top-full left-0 mt-1 w-80 bg-white rounded-2xl shadow-2xl border border-amber-200 overflow-hidden transition-all duration-200 ${
                      shopOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'
                    }`}
                  >
                    <div className="p-2.5">
                      {SHOP_DROPS.map(d => (
                        <button
                          key={d.label}
                          onClick={() => { 
                            const categoryName = d.label.split(' ').slice(1).join(' ');
                            navigate('/category', { state: { category: categoryName } }); 
                            setShopOpen(false); 
                          }}
                          className="w-full flex items-start gap-3 px-3 py-2.5 rounded-xl hover:bg-amber-50 transition-colors text-left group"
                        >
                          <span className="text-xl flex-shrink-0 mt-0.5">{d.label.split(' ')[0]}</span>
                          <div>
                            <p className="text-stone-800 font-bold text-sm group-hover:text-[#d97706] transition-colors">
                              {d.label.substring(d.label.indexOf(' ') + 1)}
                            </p>
                            <p className="text-stone-400 text-xs">{d.sub}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                    <div className="bg-amber-50/80 px-4 py-2.5 border-t border-amber-100 flex justify-between items-center">
                      <button onClick={() => { navigate('/category'); setShopOpen(false); }}
                        className="text-[#d97706] text-xs font-bold hover:underline">
                        View All Categories →
                      </button>
                      <span className="text-[10px] text-amber-800 font-bold bg-amber-200/60 px-2 py-0.5 rounded-full">100% Organic</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Search Input Bar */}
          <div className="flex-1 min-w-0 max-w-xs md:max-w-lg lg:max-w-xl">
            <div className="search-bar relative flex items-center bg-amber-50/60 border border-amber-200/80 rounded-xl px-3 py-2 gap-2 transition-all duration-200 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-300/40">
              <Search size={15} className="text-amber-700/60 flex-shrink-0" />
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
                placeholder="Search 'Kashmiri Saffron', 'Jumbo Almonds', 'Organic Cardamom'..."
                className="flex-1 bg-transparent text-sm text-stone-800 placeholder-amber-800/40 outline-none min-w-0 font-medium"
              />
              {query && (
                <button onClick={() => { setQuery(''); setShowSuggestions(false); }} className="text-stone-400 hover:text-stone-600">
                  <span className="text-xs font-bold">✕</span>
                </button>
              )}
              <button onClick={handleSearch} className="hidden md:flex items-center gap-1.5 bg-gradient-to-r from-[#d97706] to-[#f59e0b] hover:from-[#b45309] hover:to-[#d97706] rounded-lg px-3 py-1 flex-shrink-0 shadow-sm transition-all">
                <Search size={13} className="text-white" />
                <span className="text-white text-xs font-bold">Search</span>
              </button>
              <button onClick={handleSearch} className="md:hidden bg-[#d97706] rounded-lg p-1.5 flex-shrink-0">
                <Search size={14} className="text-white" />
              </button>

              {/* Suggestions Dropdown */}
              {showSuggestions && query.trim() !== '' && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-amber-200 overflow-hidden z-50">
                  {suggestions.length > 0 ? (
                    <div className="py-2">
                      {suggestions.map((item, idx) => (
                        <div 
                          key={idx} 
                          className="px-4 py-2 hover:bg-amber-50 cursor-pointer flex items-center gap-3 transition-colors"
                          onClick={() => {
                            navigate(`/product/${item.id}`);
                            setShowSuggestions(false);
                            setQuery('');
                          }}
                        >
                          {item.img && (
                            <img src={item.img} alt={item.name} className="w-9 h-9 object-cover rounded-md flex-shrink-0 border border-amber-200" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-stone-800 truncate">{item.name}</p>
                            <p className="text-xs text-amber-700 font-medium truncate">{item.category} • ₹{item.price}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-sm text-stone-500">
                      No matching products for "{query}"
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
              onClick={() => navigate('/account')}
              className="relative p-2 rounded-xl hover:bg-amber-100/50 transition-colors"
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
              className="relative p-2 rounded-xl hover:bg-amber-100/50 transition-colors"
              aria-label="Cart"
            >
              <ShoppingBag size={22} className="text-stone-700" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#d97706] text-white text-[9px] font-bold rounded-full w-4.5 h-4.5 flex items-center justify-center badge-pulse shadow-md">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Account / Login */}
            {isAuthenticated ? (
              <button
                onClick={() => navigate('/account')}
                className="hidden md:flex items-center gap-2 ml-1 px-3.5 py-2 bg-amber-100/80 hover:bg-amber-200/80 text-[#5c3110] rounded-xl transition-colors font-bold text-sm border border-amber-200"
              >
                <User size={16} />
                <span>{user?.name?.split(' ')[0] || 'Account'}</span>
              </button>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="hidden md:flex items-center gap-2 ml-1 px-3.5 py-2 bg-[#5c3110] hover:bg-[#3b1c06] text-amber-50 rounded-xl transition-colors font-bold text-sm shadow-sm"
              >
                <User size={16} />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>

        {/* Category Strip */}
        <div className="border-t border-amber-100 bg-amber-50/50 py-1.5 px-4 md:px-6">
          <div className="max-w-[1600px] mx-auto flex items-center gap-2 overflow-x-auto scrollbar-hide">
            {[
              { label: '✨ Kashmiri Saffron', category: 'Exotic Spices', query: 'Saffron' },
              { label: '🌰 Jumbo Almonds', category: 'Dry Fruits', query: 'Almond' },
              { label: '🥜 King Cashews', category: 'Dry Fruits', query: 'Cashew' },
              { label: '🌿 Green Cardamom', category: 'Exotic Spices', query: 'Cardamom' },
              { label: '🍇 Afghan Anjeer', category: 'Dry Fruits', query: 'Anjeer' },
              { label: '💎 Salted Pistachios', category: 'Dry Fruits', query: 'Pista' },
              { label: '🫒 Pure A2 Ghee', category: 'Pure Ghee & Oils', query: 'Ghee' },
              { label: '🌱 Chia & Flax Seeds', category: 'Healthy Seeds', query: 'Seeds' },
              { label: '🎁 Festive Gift Boxes', category: 'Festive Gift Boxes', query: '' },
            ].map((item) => {
              const currentCat = location.state?.category;
              const currentQuery = location.state?.searchQuery || '';
              const isSelected = (currentCat === item.category && (!item.query || currentQuery.toLowerCase().includes(item.query.toLowerCase()))) ||
                                 (currentQuery && item.query && currentQuery.toLowerCase().includes(item.query.toLowerCase()));
              return (
                <button
                  key={item.label}
                  onClick={() => navigate('/category', { state: { category: item.category, searchQuery: item.query } })}
                  className={`flex-shrink-0 text-xs font-bold px-3 py-1 rounded-full border transition-all whitespace-nowrap ${
                    isSelected
                      ? 'bg-[#5c3110] text-amber-300 border-[#5c3110] shadow-sm'
                      : 'bg-white/80 text-stone-700 border-amber-200 hover:border-[#d97706] hover:text-[#d97706] hover:bg-amber-50'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </header>
    </>
  );
}
