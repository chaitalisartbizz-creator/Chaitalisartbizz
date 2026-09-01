import { motion } from 'framer-motion';
import React from 'react';

const transitionVariants = {
  initial: {
    opacity: 0,
    y: 16,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: [0.22, 1, 0.36, 1],
    }
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 1, 1], // ease-in
    }
  }
};

export default function PageTransition({ children }) {
  return (
    <motion.div
      variants={transitionVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="w-full min-h-screen"
      style={{ willChange: "transform, opacity" }}
    >
      {/* Top golden shimmer accent indicator on page change */}
      <motion.div 
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#5c3110] via-amber-400 to-[#d97706] z-[999] origin-left shadow-[0_0_12px_rgba(245,158,11,0.8)]"
      />
      {children}
    </motion.div>
  );
}
