import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  { icon: Package, label: 'My Orders', sub: 'Active & past orders', color: '#d97706' },
  { icon: Heart, label: 'My Wishlist', sub: 'Saved dry fruits & spices', color: '#EC4899' },
  { icon: MapPin, label: 'Saved Addresses', sub: 'Delivery locations', color: '#10B981' },
  { icon: CreditCard, label: 'Payment Methods', sub: 'UPI, Cards & Wallets', color: '#6366F1' },
  { icon: Gift, label: 'Fortune Club Rewards', sub: 'Purity points & coupons', color: '#b45309' },
  { icon: HelpCircle, label: 'Purity Support', sub: 'Chat with Purity Assistant', color: '#0EA5E9' },
  { icon: ShieldCheck, label: 'Quality Guarantee', sub: 'Organic certificates', color: '#14B8A6' },
];

export default function AccountPage() {
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('Profile');
  const { wishlistItems, removeFromWishlist, addToCart, isInCart, showToast } = useCart();

  /* GUEST VIEW */
  if (!user) {
    return (
      <div className="min-h-screen mesh-bg">
        <Header />
        <main className="pb-24 md:pb-12">
          
          <ScrollReveal>
            <div className="bg-gradient-to-r from-[#5c3110] via-[#d97706] to-[#b45309] text-amber-50 shadow-xl border-b border-amber-400/40">
              <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <span className="text-amber-200 text-xs font-bold uppercase tracking-widest bg-amber-900/40 px-3 py-1 rounded-full border border-amber-300/30">
                    Fortune Food Purity Club
                  </span>
                  <h1 className="font-cinzel font-bold text-3xl md:text-5xl mt-3">Welcome to Fortune Food</h1>
                  <p className="text-amber-100 text-sm md:text-base mt-2 max-w-lg">Sign in to track organic saffron orders, earn purity reward coins, and manage saved delivery addresses.</p>
                  
                  <div className="flex flex-wrap gap-3 mt-6 justify-center md:justify-start">
                    <button onClick={() => navigate('/login')} className="bg-amber-400 text-stone-950 font-bold px-8 py-3 rounded-xl shadow-md hover:bg-amber-300 transition-all text-sm">
                      Sign In Now
                    </button>
                    <button onClick={() => navigate('/login')} className="bg-stone-900/50 text-amber-100 font-bold px-8 py-3 rounded-xl border border-amber-300/40 hover:bg-stone-900 transition-all text-sm">
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
              <h2 className="font-cinzel font-bold text-xl md:text-2xl text-stone-900 text-center mb-8">Fortune Member Privileges</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: Package, label: 'Live Farm Tracking', sub: 'Real-time dispatch updates', color: '#d97706' },
                  { icon: Heart, label: 'Wishlist Lock', sub: 'Save favorite harvests', color: '#EC4899' },
                  { icon: Gift, label: 'Fortune Coins', sub: 'Earn cashback on dry fruits', color: '#b45309' },
                  { icon: ShieldCheck, label: 'Purity Certificate', sub: 'Lab reports on every batch', color: '#10B981' },
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className="bg-white/90 backdrop-blur-md rounded-2xl border border-amber-200 p-5 text-center shadow-sm">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 bg-amber-50">
                        <Icon size={22} style={{ color: item.color }} />
                      </div>
                      <p className="font-bold text-stone-900 text-sm">{item.label}</p>
                      <p className="text-stone-500 text-xs mt-1">{item.sub}</p>
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
          <div className="bg-gradient-to-r from-[#5c3110] via-[#d97706] to-[#b45309] text-amber-50 border-b border-amber-400/40 shadow-xl">
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-amber-200/20 border-2 border-amber-300 flex items-center justify-center text-3xl font-black text-amber-300 shadow">
                    {user?.name?.[0]?.toUpperCase() || 'F'}
                  </div>
                  <div>
                    <h1 className="font-cinzel font-bold text-xl md:text-3xl">Namaste, {user?.name || 'Valued Member'} ✨</h1>
                    <p className="text-amber-200 text-xs md:text-sm">{user?.email}</p>
                    <span className="inline-block mt-1 text-[10px] font-bold bg-amber-400 text-stone-950 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      Gold Purity Member
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isAdmin && (
                    <button onClick={() => navigate('/admin')} className="bg-amber-400 text-stone-950 text-xs font-bold px-4 py-2.5 rounded-xl shadow hover:bg-amber-300 transition-all">
                      ⚙️ Admin Portal
                    </button>
                  )}
                  <button onClick={() => logout()} className="bg-stone-950/40 border border-amber-300/40 text-amber-100 text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-stone-950 transition-all flex items-center gap-1.5">
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
              <div className="bg-white/90 backdrop-blur-md rounded-3xl border border-amber-200 p-4 shadow-sm space-y-1">
                {MENU_ITEMS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.label}
                      onClick={() => setActiveTab(item.label)}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                        activeTab === item.label
                          ? 'bg-[#5c3110] text-amber-200 shadow-md'
                          : 'text-stone-700 hover:bg-amber-50'
                      }`}
                    >
                      <Icon size={16} style={{ color: activeTab === item.label ? '#fef3c7' : item.color }} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </aside>

            {/* Tab Body */}
            <div className="flex-1 min-w-0 bg-white/90 backdrop-blur-md rounded-3xl border border-amber-200 p-6 md:p-8 shadow-sm">
              {activeTab === 'Profile' || activeTab === 'My Orders' ? (
                <div>
                  <h2 className="font-cinzel font-bold text-xl text-stone-900 mb-4">My Orders & Recent Harvest Purchases</h2>
                  <div className="bg-amber-50/50 p-6 rounded-2xl border border-amber-200 text-center">
                    <Package size={40} className="mx-auto text-[#d97706] mb-2" />
                    <p className="font-bold text-stone-800 text-sm">No Active Orders</p>
                    <p className="text-stone-500 text-xs mt-1">Explore our Kashmiri saffron and organic dry fruits catalogue to place your first order.</p>
                    <button onClick={() => navigate('/category')} className="mt-4 bg-[#5c3110] text-amber-200 font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-amber-600 hover:text-white transition-all">
                      Browse Store Catalogue
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
                        <div key={item.id} className="border border-amber-200 rounded-2xl p-3 flex gap-3 items-center">
                          <img src={item.img} alt={item.name} className="w-16 h-16 rounded-xl object-cover" />
                          <div className="flex-1">
                            <p className="font-bold text-stone-900 text-xs">{item.name}</p>
                            <p className="font-black text-[#5c3110] text-sm">₹{item.price}</p>
                          </div>
                          <button onClick={() => addToCart(item)} className="bg-[#d97706] text-white text-xs font-bold px-3 py-1.5 rounded-xl">Add</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <h2 className="font-cinzel font-bold text-xl text-stone-900 mb-2">{activeTab}</h2>
                  <p className="text-stone-500 text-xs">Section under active sync with Fortune Food server database.</p>
                </div>
              )}
            </div>

          </div>
        </div>

      </main>
    </div>
  );
}
