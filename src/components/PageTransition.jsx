import { motion } from 'framer-motion';
import React from 'react';

export default function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="w-full min-h-screen"
    >
      {/* Top golden shimmer accent indicator on page change */}
      <motion.div 
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#5c3110] via-amber-400 to-[#d97706] z-[999] origin-left shadow-[0_0_12px_rgba(245,158,11,0.8)]"
      />
      {children}
    </motion.div>
  );
}
