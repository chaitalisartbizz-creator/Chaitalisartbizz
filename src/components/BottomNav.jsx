import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Grid, Tag, BookOpen, User, Palette } from 'lucide-react';
import { motion } from 'framer-motion';

const NAV_ITEMS = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: Grid, label: 'Catalogue', path: '/category' },
  { icon: Tag, label: 'Deals', path: '/offers' },
  { icon: Palette, label: 'Hub', path: '/hub' },
  { icon: User, label: 'Account', path: '/account' },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="fixed bottom-5 left-0 right-0 mx-auto z-50 md:hidden w-[94%] max-w-[400px]">
      <div className="bg-[#f9f9f9]/70 backdrop-blur-[25px] saturate-[1.8] border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.12)] rounded-[2rem] px-2 py-2.5 flex items-center justify-between relative overflow-hidden">
        <div className="absolute inset-0 rounded-[2rem] border border-white/20 pointer-events-none" />
        
        {NAV_ITEMS.map(({ icon: Icon, label, path }) => {
          const active = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className="relative flex flex-col items-center flex-1 z-10"
            >
              {active && (
                <motion.div 
                  layoutId="bottom-nav-active"
                  className="absolute inset-0 bg-[#C9A84C]/15 rounded-2xl -m-1"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              
              <Icon
                size={22}
                className={`relative z-10 transition-colors duration-300 ${active ? 'text-[#2C2C2C]' : 'text-stone-500'}`}
                strokeWidth={active ? 2.5 : 2}
              />
              <span className={`relative z-10 text-[9px] font-semibold mt-1 tracking-wide transition-colors duration-300 ${active ? 'text-[#2C2C2C]' : 'text-stone-500'}`}>
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
