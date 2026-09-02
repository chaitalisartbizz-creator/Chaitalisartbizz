import React from 'react';
import { motion } from 'framer-motion';

export default function ScrollReveal({ children, className = "", delay = 0, animation = "fade-up", once = true }) {
  
  const getVariants = () => {
    switch (animation) {
      case 'fade-left': 
        return {
          hidden: { opacity: 0, x: -50 },
          visible: { opacity: 1, x: 0 }
        };
      case 'fade-right':
        return {
          hidden: { opacity: 0, x: 50 },
          visible: { opacity: 1, x: 0 }
        };
      case 'fade-down':
        return {
          hidden: { opacity: 0, y: -40 },
          visible: { opacity: 1, y: 0 }
        };
      case 'scale-up':
      case 'scale-up-smooth':
        return {
          hidden: { opacity: 0, scale: 0.9, y: 20 },
          visible: { opacity: 1, scale: 1, y: 0 }
        };
      case 'blur-in':
        return {
          hidden: { opacity: 0, scale: 0.95, filter: 'blur(10px)' },
          visible: { opacity: 1, scale: 1, filter: 'blur(0px)' }
        };
      case '3d-flip':
        return {
          hidden: { opacity: 0, rotateX: 45, y: 50 },
          visible: { opacity: 1, rotateX: 0, y: 0 }
        };
      case 'fade-up-dramatic':
        return {
          hidden: { opacity: 0, y: 80 },
          visible: { opacity: 1, y: 0 }
        };
      case 'fade-up':
      default:
        return {
          hidden: { opacity: 0, y: 40 },
          visible: { opacity: 1, y: 0 }
        };
    }
  };

  const getTransition = () => {
    const baseDelay = delay / 1000;
    
    if (animation === 'fade-up-dramatic' || animation === 'scale-up-smooth' || animation === '3d-flip') {
      return {
        type: "spring",
        stiffness: 70,
        damping: 15,
        mass: 1,
        delay: baseDelay
      };
    }

    if (animation === 'blur-in') {
      return {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
        delay: baseDelay
      };
    }
    
    return {
      duration: 0.7,
      ease: [0.25, 0.1, 0.25, 1],
      delay: baseDelay
    };
  };

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-50px" }}
      variants={getVariants()}
      transition={getTransition()}
      style={{ willChange: "transform, opacity" }}
    >
      {children}
    </motion.div>
  );
}
