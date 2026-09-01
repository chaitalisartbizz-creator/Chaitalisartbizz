import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  User, Package, Heart, MapPin, CreditCard, Bell, Gift, HelpCircle,
  Shield, ChevronRight, Star, ShoppingBag, LogOut, Plus, Trash2, CheckCircle, Clock, Settings,
  Sparkles, Award, ShieldCheck
} from 'lucide-react';
import Header from '../components/Header';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import ScrollReveal from '../components/ScrollReveal';

const MENU_ITEMS = [
  { icon: Package, label: 'My Orders', sub: 'Active & past orders', color: '#C9A84C' },
  { icon: Heart, label: 'My Wishlist', sub: 'Saved artwork & gifts', color: '#C0737A' },
  { icon: MapPin, label: 'Saved Addresses', sub: 'Delivery locations', color: '#6B7FA3' },
  { icon: CreditCard, label: 'Payment Methods', sub: 'UPI, Cards & Wallets', color: '#8B5E7A' },
  { icon: Gift, label: 'Artbizz Rewards', sub: 'Creative points & coupons', color: '#C9A84C' },
  { icon: HelpCircle, label: 'Studio Support', sub: 'Chat with Art Assistant', color: '#2C2C2C' },
  { icon: ShieldCheck, label: 'Quality Guarantee', sub: 'Premium materials used', color: '#A8873A' },
];

export default function AccountPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState(location.state?.tab || 'Profile');
  
  useEffect(() => {
    if (location.state?.tab) {
      setActiveTab(location.state.tab);
    }
  }, [location.state]);
  const { wishlistItems, removeFromWishlist, addToCart, isInCart, showToast } = useCart();

  /* GUEST VIEW */
  if (!user) {
    return (
      <div className="min-h-screen mesh-bg">
        <Header />
        <main className="pb-24 md:pb-12">
          
          <ScrollReveal>
            <div className="bg-gradient-to-r from-[#2C2C2C] via-[#1A1A1A] to-[#2C2C2C] text-[#F0DFA0] shadow-xl border-b border-[#C9A84C]/40">
              <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <span className="text-[#C9A84C] text-xs font-bold uppercase tracking-widest bg-black/40 px-3 py-1 rounded-full border border-[#C9A84C]/30">
                    Artbizz VIP Club
                  </span>
                  <h1 className="font-cinzel font-bold text-3xl md:text-5xl mt-3">Welcome to Chaitali's Artbizz</h1>
                  <p className="text-[#C9A84C]/80 text-sm md:text-base mt-2 max-w-lg">Sign in to track your custom art orders, earn creative reward points, and manage saved delivery addresses.</p>
                  
                  <div className="flex flex-wrap gap-3 mt-6 justify-center md:justify-start">
                    <button onClick={() => navigate('/login')} className="bg-gradient-to-r from-[#A8873A] via-[#C9A84C] to-[#A8873A] text-[#1A1A1A] font-bold px-8 py-3 rounded-xl shadow-md hover:shadow-lg transition-all text-sm">
                      Sign In Now
                    </button>
                    <button onClick={() => navigate('/login')} className="bg-white/10 text-[#C9A84C] font-bold px-8 py-3 rounded-xl border border-[#C9A84C]/40 hover:bg-white/20 transition-all text-sm">
                      Create Account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Member Perks */}
          <ScrollReveal delay={100}>
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
              <h2 className="font-cinzel font-bold text-xl md:text-2xl text-[#2C2C2C] text-center mb-8">Artbizz Member Privileges</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: Package, label: 'Live Order Tracking', sub: 'Real-time studio updates', color: '#6B7FA3' },
                  { icon: Heart, label: 'Wishlist Lock', sub: 'Save favorite art pieces', color: '#C0737A' },
                  { icon: Gift, label: 'Creative Coins', sub: 'Earn cashback on artwork', color: '#C9A84C' },
                  { icon: ShieldCheck, label: 'Quality Guarantee', sub: 'Premium materials used', color: '#8B5E7A' },
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className="bg-white/90 backdrop-blur-md rounded-2xl border border-[#C9A84C]/30 p-5 text-center shadow-sm">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 bg-[#F2EDE4]">
                        <Icon size={22} style={{ color: item.color }} />
                      </div>
                      <p className="font-bold text-[#2C2C2C] text-sm">{item.label}</p>
                      <p className="text-[#2C2C2C]/60 text-xs mt-1">{item.sub}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </ScrollReveal>

        </main>
      </div>
    );
  }

  /* LOGGED IN VIEW */
  return (
    <div className="min-h-screen mesh-bg">
      <Header />
      <main className="pb-24 md:pb-12">

        {/* Profile Header */}
        <ScrollReveal>
          <div className="bg-gradient-to-r from-[#2C2C2C] via-[#1A1A1A] to-[#2C2C2C] text-[#F0DFA0] border-b border-[#C9A84C]/40 shadow-xl">
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-[#C9A84C]/20 border-2 border-[#C9A84C] flex items-center justify-center text-3xl font-black text-[#C9A84C] shadow">
                    {user?.name?.[0]?.toUpperCase() || 'C'}
                  </div>
                  <div>
                    <h1 className="font-cinzel font-bold text-xl md:text-3xl">Namaste, {user?.name || 'Valued Client'} ✨</h1>
                    <p className="text-[#C9A84C] text-xs md:text-sm">{user?.email}</p>
                    <span className="inline-block mt-1 text-[10px] font-bold bg-[#C9A84C] text-[#1A1A1A] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      Gold Member
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isAdmin && (
                    <button onClick={() => navigate('/admin')} className="bg-[#C9A84C] text-[#1A1A1A] text-xs font-bold px-4 py-2.5 rounded-xl shadow hover:bg-white transition-all">
                      ⚙️ Admin Portal
                    </button>
                  )}
                  <button onClick={() => logout()} className="bg-black/40 border border-[#C9A84C]/40 text-[#F0DFA0] text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-black transition-all flex items-center gap-1.5">
                    <LogOut size={14} /> Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Content Tabs */}
        <div className="max-w-7xl mx-auto px-4 md:px-6 mt-8">
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Sidebar */}
            <aside className="lg:w-64 flex-shrink-0">
              <div className="bg-white/90 backdrop-blur-md rounded-3xl border border-[#C9A84C]/30 p-4 shadow-sm space-y-1">
                {MENU_ITEMS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.label}
                      onClick={() => setActiveTab(item.label)}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                        activeTab === item.label
                          ? 'bg-[#2C2C2C] text-[#C9A84C] shadow-md'
                          : 'text-stone-700 hover:bg-[#F2EDE4]'
                      }`}
                    >
                      <Icon size={16} style={{ color: activeTab === item.label ? '#C9A84C' : item.color }} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </aside>

            {/* Tab Body */}
            <div className="flex-1 min-w-0 bg-white/90 backdrop-blur-md rounded-3xl border border-[#C9A84C]/30 p-6 md:p-8 shadow-sm">
              {activeTab === 'Profile' || activeTab === 'My Orders' ? (
                <div>
                  <h2 className="font-cinzel font-bold text-xl text-stone-900 mb-4">My Orders & Custom Requests</h2>
                  <div className="bg-[#F2EDE4]/50 p-6 rounded-2xl border border-[#C9A84C]/30 text-center">
                    <Package size={40} className="mx-auto text-[#C9A84C] mb-2" />
                    <p className="font-bold text-stone-800 text-sm">No Active Orders</p>
                    <p className="text-stone-500 text-xs mt-1">Explore our custom portraits and resin art catalogue to place your first order.</p>
                    <button onClick={() => navigate('/category')} className="mt-4 bg-[#2C2C2C] text-[#C9A84C] font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-[#C9A84C] hover:text-[#2C2C2C] transition-all">
                      Browse Art Catalogue
                    </button>
                  </div>
                </div>
              ) : activeTab === 'My Wishlist' ? (
                <div>
                  <h2 className="font-cinzel font-bold text-xl text-stone-900 mb-4">Saved Wishlist ({wishlistItems.length})</h2>
                  {wishlistItems.length === 0 ? (
                    <p className="text-stone-500 text-xs">Your wishlist is currently empty.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {wishlistItems.map((item) => (
                        <div key={item.id} className="border border-[#C9A84C]/30 rounded-2xl p-3 flex gap-3 items-center">
                          <img src={item.img} alt={item.name} className="w-16 h-16 rounded-xl object-cover" />
                          <div className="flex-1">
                            <p className="font-bold text-stone-900 text-xs">{item.name}</p>
                            <p className="font-black text-[#2C2C2C] text-sm">₹{item.price}</p>
                          </div>
                          <button onClick={() => addToCart(item)} className="bg-[#C9A84C] text-[#2C2C2C] text-xs font-bold px-3 py-1.5 rounded-xl hover:bg-[#2C2C2C] hover:text-[#C9A84C] transition-all">Add</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <h2 className="font-cinzel font-bold text-xl text-stone-900 mb-2">{activeTab}</h2>
                  <p className="text-stone-500 text-xs">Section under active sync with Chaitali's Artbizz server database.</p>
                </div>
              )}
            </div>

          </div>
        </div>

      </main>
    </div>
  );
}
