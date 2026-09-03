import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Package, Image, Percent,
  Menu, X, Settings, Users, ShoppingBag, CreditCard, Music2, Activity, Palette, Bell, Layout
} from 'lucide-react';
import LiveBackground from '../components/LiveBackground';

const NAV_ITEMS = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/live', label: 'Live Website', icon: Activity },
  { path: '/admin/site-editor', label: 'Site Editor', icon: Layout },
  { path: '/admin/products', label: 'Art Catalogue', icon: Palette },
  { path: '/admin/categories', label: 'Art Categories', icon: Image },
  { path: '/admin/slides', label: 'Hero Slides', icon: Image },
  { path: '/admin/deals', label: 'Deals & Promos', icon: Percent },
  { path: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { path: '/admin/customers', label: 'Customers', icon: Users },
  { path: '/admin/retention', label: 'Analytics', icon: Activity },
  { path: '/admin/notifications', label: 'Push Notifications', icon: Bell },
  { path: '/admin/payment', label: 'Payment Config', icon: CreditCard },
  { path: '/admin/music', label: 'Studio Music', icon: Music2 },
  { path: '/admin/settings', label: 'Store Settings', icon: Settings },
];

export default function AdminLayout() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className="min-h-screen bg-[#F2EDE4]/40 flex font-sans relative overflow-hidden">
      <LiveBackground theme="cream-waves" className="fixed top-0 left-0 w-full h-full opacity-60 pointer-events-none" />
      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-stone-900/50 z-40 md:hidden backdrop-blur-sm"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-[#1A1A1A] text-[#F0DFA0] border-r border-[#C9A84C]/30 shadow-2xl transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 z-50 flex flex-col`}>
        <div className="h-16 flex items-center justify-between px-5 border-b border-[#C9A84C]/20 shrink-0">
          <Link to="/admin" className="font-cinzel font-bold text-base text-[#C9A84C] flex items-center gap-2.5">
            <img src="/logo.jpg" alt="Chaitali's Artbizz" className="w-9 h-9 rounded-full border-2 border-[#C9A84C] object-cover" />
            <div className="flex flex-col leading-none">
              <span className="text-[#F0DFA0] text-sm font-bold">CHAITALI'S</span>
              <span className="text-[#C9A84C] text-xs tracking-widest">ARTBIZZ</span>
            </div>
          </Link>
          <button className="md:hidden p-2 text-[#C9A84C]" onClick={toggleSidebar}>
            <X size={20} />
          </button>
        </div>
        <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive 
                    ? 'bg-gradient-to-r from-[#2C2C2C] to-[#A8873A] text-[#F0DFA0] shadow-md border border-[#C9A84C]/30' 
                    : 'text-[#F0DFA0]/60 hover:bg-[#2C2C2C] hover:text-[#C9A84C]'
                }`}
              >
                <Icon size={16} className={isActive ? 'text-[#C9A84C]' : ''} />
                <span>{item.label}</span>
                {item.label === 'Orders' && (
                  <span className="ml-auto text-[10px] bg-[#C9A84C] text-[#1A1A1A] font-black px-1.5 py-0.5 rounded-full">NEW</span>
                )}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-[#C9A84C]/20">
          <Link to="/" className="flex items-center justify-center gap-2 text-xs font-bold text-[#C9A84C] hover:text-[#2C2C2C] bg-[#C9A84C]/10 hover:bg-[#C9A84C] py-2.5 rounded-xl transition-all border border-[#C9A84C]/30">
            ← Back to Art Store
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 flex flex-col min-h-screen">
        <header className="h-16 bg-white/90 backdrop-blur-md border-b border-[#C9A84C]/30 flex items-center px-4 md:px-8 gap-2 md:gap-4 sticky top-0 z-30 shadow-sm">
          <button className="md:hidden p-2 -ml-2 text-stone-700 shrink-0" onClick={toggleSidebar}>
            <Menu size={24} />
          </button>
          <h1 className="font-cinzel font-bold text-sm md:text-lg text-[#2C2C2C] truncate">
            {NAV_ITEMS.find(item => item.path === location.pathname)?.label || "Admin Portal"}
          </h1>
          <div className="ml-auto flex items-center gap-3 shrink-0">
            <span className="text-xs text-stone-500 font-semibold hidden sm:block">Artbizz Studio Admin</span>
            <Link to="/" className="text-[10px] md:text-xs font-bold text-[#2C2C2C] bg-gradient-to-r from-[#C9A84C] to-[#A8873A] hover:shadow-md px-3 py-2 rounded-xl transition-all whitespace-nowrap">
              Live Store →
            </Link>
          </div>
        </header>
        
        <div className="flex-1 p-4 md:p-8 overflow-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
