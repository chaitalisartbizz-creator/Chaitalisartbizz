import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Grid3X3, Tag, Sparkles, User, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';

const NAV_ITEMS = [
  { label: 'Home',     icon: Home,     path: '/' },
  { label: 'Catalogue',icon: Grid3X3,  path: '/category' },
  { label: 'Offers',   icon: Tag,      path: '/offers' },
  { label: 'Wellness', icon: Sparkles, path: '/hub' },
  { label: 'Account',  icon: User,     path: '/account' },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartCount, setCartOpen } = useCart();
  const [pressed, setPressed] = useState(null);

  return (
    /* Only visible on mobile (< md) */
    <div
      className="md:hidden fixed z-[80] left-1/2 -translate-x-1/2"
      style={{
        bottom: 'calc(env(safe-area-inset-bottom, 0px) + 14px)',
        width: 'calc(100% - 28px)',
        maxWidth: '430px',
      }}
    >
      {/* Outer warm glow ring */}
      <div className="absolute inset-0 rounded-[28px] bg-gradient-to-r from-[#d97706]/35 via-[#f59e0b]/20 to-[#5c3110]/35 blur-xl pointer-events-none" />

      {/* Glass pill navigation */}
      <nav
        className="relative rounded-[28px] flex items-center px-2 py-2 gap-1"
        style={{
          background: 'rgba(255, 251, 235, 0.82)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(251, 191, 36, 0.4)',
          boxShadow:
            '0 12px 35px rgba(92,49,16,0.16), 0 2px 10px rgba(245,158,11,0.15), inset 0 1px 0 rgba(255,255,255,0.7)',
        }}
      >
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <button
              key={item.label}
              onClick={() => {
                setPressed(item.path);
                setTimeout(() => setPressed(null), 300);
                navigate(item.path);
              }}
              aria-label={item.label}
              className="relative flex-1 flex flex-col items-center justify-center py-2 rounded-[20px] transition-all duration-200 active:scale-90"
              style={{
                background: isActive
                  ? 'linear-gradient(135deg, rgba(245,158,11,0.22), rgba(217,119,6,0.12))'
                  : 'transparent',
                border: isActive
                  ? '1px solid rgba(217,119,6,0.3)'
                  : '1px solid transparent',
              }}
            >
              {/* Icon */}
              <motion.div
                animate={pressed === item.path ? { scale: [1, 0.8, 1.15, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                <Icon
                  size={20}
                  strokeWidth={isActive ? 2.5 : 1.8}
                  style={{
                    color: isActive ? '#d97706' : 'rgba(92,49,16,0.6)',
                    filter: isActive
                      ? 'drop-shadow(0 0 6px rgba(245,158,11,0.6))'
                      : 'none',
                    transition: 'all 0.2s ease',
                  }}
                />
              </motion.div>

              {/* Label */}
              <span
                className="text-[9px] font-bold mt-0.5 tracking-wide"
                style={{
                  color: isActive ? '#5c3110' : 'rgba(92,49,16,0.5)',
                  transition: 'color 0.2s ease',
                }}
              >
                {item.label}
              </span>

              {/* Active dot */}
              {isActive && (
                <motion.div
                  layoutId="nav-active-dot"
                  className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#d97706]"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
