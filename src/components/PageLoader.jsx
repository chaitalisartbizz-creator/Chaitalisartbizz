import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { requestNotificationPermission } from '../firebase';

const PARTICLE_COUNT = typeof window !== 'undefined' && window.innerWidth < 768 ? 20 : 40;
const particles = Array.from({ length: PARTICLE_COUNT }).map((_, i) => {
  const size = Math.random() * 5 + 1.5;
  const initialX = Math.random() * 100;
  const initialY = Math.random() * 100;
  const duration = Math.random() * 10 + 8;
  const delay = Math.random() * 4;
  return { id: i, size, initialX, initialY, duration, delay };
});

function GoldenArtDust() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[5]">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0, x: `${p.initialX}vw`, y: `${p.initialY}vh` }}
          animate={{
            opacity: [0, 0.9, 0.9, 0],
            x: [`${p.initialX}vw`, `${p.initialX + 25}vw`],
            y: [`${p.initialY}vh`, `${p.initialY - 30}vh`],
          }}
          transition={{ duration: p.duration, repeat: Infinity, ease: "linear", delay: p.delay }}
          className="absolute rounded-full bg-[#C9A84C] shadow-[0_0_12px_3px_rgba(201,168,76,0.9)] blur-[0.5px]"
          style={{ width: p.size, height: p.size }}
        />
      ))}
    </div>
  );
}

const quotes = [
  "Imagine It — We Will Create It.",
  "Every Artwork Tells Your Story.",
  "Handcrafted with Passion & Love.",
  "Custom Art for Every Occasion.",
  "Turning Imagination into Reality."
];

export default function PageLoader({ onFinish, skip, dataReady }) {
  const [hasEntered, setHasEntered] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [quoteIndex, setQuoteIndex] = useState(0);
  // Track whether we've already dismissed so we never call onFinish twice
  const dismissedRef = useRef(false);

  const dismiss = () => {
    if (dismissedRef.current) return;
    dismissedRef.current = true;
    setIsVisible(false);
    if (onFinish) onFinish();
  };

  // Phase 1: auto-dismiss with timeout once user has entered
  useEffect(() => {
    if (skip) return;
    if (!hasEntered) return;

    const quoteTimer = setInterval(() => {
      setQuoteIndex(prev => (prev + 1) % quotes.length);
    }, 2000);

    // Show loader for 1.5s if data is ready, else max 4s
    const waitTime = dataReady ? 1500 : 4000;
    const timer = setTimeout(dismiss, waitTime);

    return () => {
      clearInterval(quoteTimer);
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasEntered, skip]);

  // Phase 2: if dataReady flips to true while we're waiting, dismiss early
  useEffect(() => {
    if (!hasEntered || !dataReady || dismissedRef.current) return;
    // Give a 600ms grace period so the progress bar animation can finish
    const timer = setTimeout(dismiss, 600);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataReady, hasEntered]);

  const handleEnter = (e) => {
    if (e) e.stopPropagation();
    setHasEntered(true);

    // Audio — must happen synchronously in the click handler (user gesture required)
    try {
      const audio = document.getElementById('site-bg-audio');
      if (audio && typeof audio.play === 'function') {
        audio.volume = 0.3;
        audio.play().catch(() => {});
      }
    } catch (_) {}

    // Push notification — fire-and-forget in a detached task
    // NEVER await here — this must NOT block setHasEntered or the dismiss timer
    setTimeout(() => {
      try {
        requestNotificationPermission().then((token) => {
          if (!token) return;
          const visitorId = localStorage.getItem('visitorId');
          if (visitorId) {
            import('axios').then(({ default: axios }) => {
              axios.post('/api/analytics/track', {
                type: 'interaction',
                visitorId,
                action: 'Push Enabled',
                fcmToken: token
              }).catch(() => {});
            });
          }
        }).catch(() => {});
      } catch (_) {}
    }, 0);
  };

  const handleSkip = (e) => {
    if (e) e.stopPropagation();
    dismiss();
  };

  if (skip) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, filter: "blur(20px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 1.1, filter: "blur(15px)", transition: { duration: 0.8 } }}
          className="fixed inset-0 z-[500] flex items-center justify-center overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #1A1A1A 0%, #2C2C2C 30%, #3D2E1E 60%, #1A1A1A 100%)'
          }}
        >
          {/* Glowing Artistic Aura */}
          <div className="absolute inset-0 opacity-25 z-0 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#C9A84C] rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '4s' }} />
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#8B5E7A] rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />
            <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-[#C0737A] rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }} />
          </div>

          <GoldenArtDust />

          {!hasEntered ? (
            // ── ENTRY GATE ──
            <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 h-full">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="mb-8"
              >
                <div className="w-40 h-40 md:w-56 md:h-56 flex items-center justify-center overflow-hidden rounded-full border-2 border-[#C9A84C]/50 shadow-2xl mb-6 mx-auto">
                  <img src="/logo.jpg" alt="Chaitali's Artbizz Logo" className="w-full h-full object-cover rounded-full" />
                </div>
                <h1 className="text-2xl md:text-4xl font-cinzel font-bold tracking-widest text-[#F0DFA0] mb-2 drop-shadow-md">
                  CHAITALI'S ARTBIZZ
                </h1>
                <p className="text-sm text-[#C9A84C] tracking-[0.2em] uppercase font-light">
                  Fine Art Gallery
                </p>
              </motion.div>

              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="px-10 py-4 bg-gradient-to-r from-[#2C2C2C] to-[#1A1A1A] border-2 border-[#C9A84C] rounded-full text-[#F0DFA0] font-bold tracking-widest uppercase text-sm shadow-[0_0_20px_rgba(201,168,76,0.3)] hover:shadow-[0_0_30px_rgba(201,168,76,0.6)] hover:scale-105 transition-all duration-300"
                onClick={handleEnter}
              >
                Enter Gallery ✨
              </motion.button>
            </div>
          ) : (
            // ── LOADER SEQUENCE ──
            <div
              className="relative z-10 flex flex-col items-center justify-center text-center px-4 h-full cursor-pointer"
              onClick={handleSkip}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="mb-4"
              >
                <motion.div
                  animate={{ scale: [1, 1.03, 1], y: [0, -6, 0] }}
                  transition={{ duration: 3, ease: "easeInOut", repeat: Infinity }}
                  className="w-56 h-56 md:w-80 md:h-80 flex items-center justify-center drop-shadow-[0_0_35px_rgba(201,168,76,0.6)]"
                >
                  <div className="relative w-48 h-48 md:w-72 md:h-72 flex items-center justify-center overflow-hidden rounded-full border-4 border-[#C9A84C] shadow-2xl">
                    <img src="/logo.jpg" alt="Chaitali's Artbizz Logo" className="w-full h-full object-cover rounded-full relative z-10" />
                  </div>
                </motion.div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-3xl md:text-5xl font-cinzel font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#F0DFA0] via-[#C9A84C] to-[#F0DFA0] mb-1 drop-shadow-md"
              >
                CHAITALI'S
              </motion.h1>

              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-2xl md:text-4xl font-cinzel font-semibold tracking-[0.3em] text-transparent bg-clip-text bg-gradient-to-r from-[#C9A84C] via-[#8B5E7A] to-[#C9A84C] mb-2 drop-shadow-md"
              >
                ARTBIZZ
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-xs md:text-sm font-bold tracking-widest text-[#C9A84C] uppercase mb-4"
              >
                IMAGINE. WE WILL CREATE.
              </motion.p>

              {/* Cycling Quotes */}
              <div className="h-6 mb-8 flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={quoteIndex}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.3 }}
                    className="text-[#F0DFA0]/80 text-sm md:text-base italic font-medium tracking-wide"
                  >
                    &ldquo;{quotes[quoteIndex]}&rdquo;
                  </motion.p>
                </AnimatePresence>
              </div>

              {/* Progress Bar */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="w-48 md:w-64 mb-8"
              >
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden relative border border-[#C9A84C]/30">
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: dataReady ? "100%" : "85%" }}
                    transition={dataReady
                      ? { duration: 0.5, ease: "easeOut" }
                      : { duration: 4, ease: "easeOut" }
                    }
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#C9A84C] via-[#F0DFA0] to-[#C9A84C] shadow-[0_0_12px_rgba(201,168,76,0.9)]"
                  />
                </div>
              </motion.div>

              {/* Skip hint */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                transition={{ delay: 2, duration: 1 }}
                className="text-[#F0DFA0] text-xs tracking-widest uppercase font-light"
              >
                Tap anywhere to skip
              </motion.p>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
