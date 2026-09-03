import React from 'react';
import { motion } from 'framer-motion';

export default function ScrollReveal({ children, className = "", delay = 0, animation = "fade-up", once = true }) {
  
  const getVariants = () => {
    switch (animation) {
      case 'fade-left': 
        return { hidden: { opacity: 0, x: -30 }, visible: { opacity: 1, x: 0 } };
      case 'fade-right':
        return { hidden: { opacity: 0, x: 30 }, visible: { opacity: 1, x: 0 } };
      case 'fade-down':
        return { hidden: { opacity: 0, y: -20 }, visible: { opacity: 1, y: 0 } };
      case 'scale-up':
      case 'scale-up-smooth':
        return { hidden: { opacity: 0, scale: 0.95, y: 10 }, visible: { opacity: 1, scale: 1, y: 0 } };
      case 'blur-in':
        return { hidden: { opacity: 0 }, visible: { opacity: 1 } };
      case '3d-flip':
        return { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };
      case 'fade-up-dramatic':
        return { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } };
      case 'fade-up':
      default:
        return { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };
    }
  };

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "200px 0px 0px 0px" }}
      variants={getVariants()}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1], delay: delay / 1000 }}
    >
      {children}
    </motion.div>
  );
}
