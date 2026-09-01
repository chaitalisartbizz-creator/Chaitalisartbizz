import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Package, Image, Percent,
  Menu, X, Settings, Users, ShoppingBag, CreditCard, Music2, Activity
} from 'lucide-react';

const NAV_ITEMS = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/live', label: 'Live Website', icon: Activity },
  { path: '/admin/products', label: 'Products Catalogue', icon: Package },
  { path: '/admin/categories', label: 'Category Banners', icon: Image },
  { path: '/admin/slides', label: 'Hero Slides', icon: Image },
  { path: '/admin/deals', label: 'Offer Zone', icon: Percent },
  { path: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { path: '/admin/customers', label: 'Customers', icon: Users },
  { path: '/admin/retention', label: 'Analytics', icon: Activity },
  { path: '/admin/payment', label: 'Payment Config', icon: CreditCard },
  { path: '/admin/settings', label: 'Store Settings', icon: Settings },
];

export default function AdminLayout() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className="min-h-screen bg-amber-50/40 flex font-sans">
      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-stone-900/50 z-40 md:hidden backdrop-blur-sm"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-stone-900 text-amber-50 border-r border-amber-900/40 shadow-xl transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 z-50 flex flex-col`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-amber-900/30 shrink-0">
          <Link to="/admin" className="font-cinzel font-bold text-lg text-amber-400 flex items-center gap-2">
            <img src="/logo.png" alt="Logo" className="w-8 h-8 rounded-full bg-white p-0.5 object-contain" />
            Fortune Food
          </Link>
          <button className="md:hidden p-2 text-amber-200" onClick={toggleSidebar}>
            <X size={20} />
          </button>
        </div>
        <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                  isActive 
                    ? 'bg-gradient-to-r from-[#5c3110] to-[#d97706] text-amber-100 shadow-md' 
                    : 'text-amber-200/70 hover:bg-stone-800 hover:text-amber-200'
                }`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
                {item.label === 'Orders' && (
                  <span className="ml-auto text-[10px] bg-amber-400 text-stone-950 font-black px-1.5 py-0.5 rounded-full">NEW</span>
                )}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-amber-900/30">
          <Link to="/" className="flex items-center justify-center gap-2 text-xs font-bold text-amber-300 hover:text-white bg-amber-900/40 hover:bg-amber-900/60 py-2.5 rounded-xl transition-all border border-amber-400/20">
            ← Back to Storefront
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 flex flex-col min-h-screen">
        <header className="h-16 bg-white/90 backdrop-blur-md border-b border-amber-200/80 flex items-center px-4 md:px-8 gap-4 sticky top-0 z-30 shadow-sm">
          <button className="md:hidden p-2 -ml-2 text-stone-700" onClick={toggleSidebar}>
            <Menu size={24} />
          </button>
          <h1 className="font-cinzel font-bold text-base md:text-lg text-stone-900">
            {NAV_ITEMS.find(item => item.path === location.pathname)?.label || 'Fortune Food Admin Portal'}
          </h1>
          <div className="ml-auto flex items-center gap-3">
            <span className="text-xs text-stone-500 font-semibold hidden sm:block">Fortune Food HQ Admin</span>
            <Link to="/" className="text-xs font-bold text-amber-50 bg-gradient-to-r from-[#5c3110] to-[#d97706] hover:shadow-md px-4 py-2 rounded-xl transition-all">
              Live Storefront →
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
