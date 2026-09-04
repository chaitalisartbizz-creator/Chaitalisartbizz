import React, { Suspense, lazy, useState, useEffect, useRef } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import PageTransition from './components/PageTransition';
import { CartProvider } from './context/CartContext';
import { DataProvider } from './context/DataContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import CartDrawer from './components/CartDrawer';
import Toast from './components/Toast';
import BottomNav from './components/BottomNav';
import PageLoader from './components/PageLoader';
import ErrorBoundary from './components/ErrorBoundary';
import ChatBot from './components/ChatBot';
import TopBar from './components/TopBar';
import ActivityTracker from './components/ActivityTracker';
import { useData } from './context/DataContext';

// Lazy load pages
const HomePage = lazy(() => import('./pages/HomePage'));
const CategoryPage = lazy(() => import('./pages/CategoryPage'));
const FeedsPage = lazy(() => import('./pages/FeedsPage'));
const ProductPage = lazy(() => import('./pages/ProductPage'));
const OffersPage = lazy(() => import('./pages/OffersPage'));
const HubPage = lazy(() => import('./pages/HubPage'));
const AccountPage = lazy(() => import('./pages/AccountPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));

// Lazy load Admin pages
const AdminLayout = lazy(() => import('./layouts/AdminLayout'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'));
const AdminCategories = lazy(() => import('./pages/admin/AdminCategories'));
const AdminSlides = lazy(() => import('./pages/admin/AdminSlides'));
const AdminDeals = lazy(() => import('./pages/admin/AdminDeals'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));
const AdminCustomers = lazy(() => import('./pages/admin/AdminCustomers'));
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'));
const AdminPayment = lazy(() => import('./pages/admin/AdminPayment'));
const AdminMusic = lazy(() => import('./pages/admin/AdminMusic'));
const AdminLive = lazy(() => import('./pages/admin/AdminLive'));
const AdminSiteEditor = lazy(() => import('./pages/admin/AdminSiteEditor'));
const AdminRetention = lazy(() => import('./pages/admin/AdminRetention'));
const AdminNotifications = lazy(() => import('./pages/admin/AdminNotifications'));

// Protected Admin Route Component
const ProtectedAdminRoute = ({ children }) => {
  const { isAdmin } = useAuth();
  if (!isAdmin) return <Navigate to="/login" replace />;
  return children;
};

// Dramatic entrance animation — triggered by 'artbizz:loader-done' event from PageLoader
function ContentReveal({ children }) {
  const [revealed, setRevealed] = useState(() => {
    return sessionStorage.getItem('artbizz-visited') === 'true';
  });

  useEffect(() => {
    if (revealed) return;
    const handler = () => setRevealed(true);
    window.addEventListener('artbizz:loader-done', handler);
    // Safety fallback: always reveal after 8s no matter what
    const fallback = setTimeout(() => setRevealed(true), 8000);
    return () => {
      window.removeEventListener('artbizz:loader-done', handler);
      clearTimeout(fallback);
    };
  }, [revealed]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 30 }}
      animate={revealed
        ? { opacity: 1, scale: 1, y: 0 }
        : { opacity: 0, scale: 0.96, y: 30 }
      }
      transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

// Inner app that has access to DataContext
function AppInner() {
  const location = useLocation();
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const { frontendSettings, loading } = useData();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Sync audio state when audio element fires events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onPlay  = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    audio.addEventListener('play',  onPlay);
    audio.addEventListener('pause', onPause);
    return () => {
      audio.removeEventListener('play',  onPlay);
      audio.removeEventListener('pause', onPause);
    };
  }, []);

  // Update audio source when settings change (e.g. after page reload / DataContext load)
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const newSrc = frontendSettings?.siteAudioUrl || '/background.mp3';
    const currentSrc = audio.src;
    // Normalise: browser sets absolute src, so compare endings
    if (!currentSrc.endsWith(newSrc) && currentSrc !== newSrc) {
      const wasPlaying = !audio.paused;
      audio.src = newSrc;
      audio.load();
      if (wasPlaying) {
        audio.play().catch(() => {});
      }
    }
  }, [frontendSettings?.siteAudioUrl]);

  // Listen for audio changed event dispatched by AdminMusic after saving
  useEffect(() => {
    const handler = (e) => {
      const audio = audioRef.current;
      if (!audio) return;
      const wasPlaying = !audio.paused;
      audio.src = e.detail.url || '/background.mp3';
      audio.load();
      // Always try to play when admin explicitly saves new audio
      audio.volume = 0.3;
      audio.play().catch(() => {});
    };
    window.addEventListener('audioChanged', handler);
    return () => window.removeEventListener('audioChanged', handler);
  }, []);

  const handleToggleAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.volume = 0.3;
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  };

  return (
    <div className="min-h-screen w-full overflow-x-clip mesh-bg text-gray-800 font-sans relative">
      {/* PageLoader sits on top as a z-500 visual overlay — content always renders beneath it */}
      <PageLoader skip={false} dataReady={!loading} />

      {/* ContentReveal plays dramatic entrance animation when PageLoader fires 'artbizz:loader-done' */}
      <ContentReveal>
        <ActivityTracker />
        <Suspense fallback={
          <div className="fixed top-0 left-0 right-0 z-[999] h-1 bg-[#C9A84C]/30">
            <div className="h-full w-1/2 bg-[#C9A84C] animate-pulse" />
          </div>
        }>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              {/* Storefront Routes */}
              <Route path="/"         element={<PageTransition><HomePage /></PageTransition>} />
              <Route path="/category" element={<PageTransition><CategoryPage /></PageTransition>} />
              <Route path="/feeds"    element={<PageTransition><FeedsPage /></PageTransition>} />
              <Route path="/offers"   element={<PageTransition><OffersPage /></PageTransition>} />
              <Route path="/hub"      element={<PageTransition><HubPage /></PageTransition>} />
              <Route path="/account"  element={<PageTransition><AccountPage /></PageTransition>} />
              <Route path="/login"    element={<PageTransition><LoginPage /></PageTransition>} />
              <Route path="/product/:id" element={<PageTransition><ProductPage /></PageTransition>} />

              {/* Admin Routes */}
              <Route path="/admin" element={<PageTransition><ProtectedAdminRoute><AdminLayout /></ProtectedAdminRoute></PageTransition>}>
                <Route index element={<AdminDashboard />} />
                <Route path="live" element={<AdminLive />} />
                <Route path="site-editor" element={<AdminSiteEditor />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="categories" element={<AdminCategories />} />
                <Route path="slides" element={<AdminSlides />} />
                <Route path="deals" element={<AdminDeals />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="customers" element={<AdminCustomers />} />
                <Route path="payment" element={<AdminPayment />} />
                <Route path="music" element={<AdminMusic />} />
                <Route path="settings" element={<AdminSettings />} />
                <Route path="retention" element={<AdminRetention />} />
                <Route path="notifications" element={<AdminNotifications />} />
              </Route>
            </Routes>
          </AnimatePresence>
        </Suspense>

        <TopBar />
        <CartDrawer />
        {/* Global floating bottom nav — only visible on mobile */}
        <BottomNav />
      </ContentReveal>
      
      <ChatBot />
      <Toast />

      {/* Background audio */}
      <audio
        ref={audioRef}
        id="site-bg-audio"
        src={frontendSettings?.siteAudioUrl || '/background.mp3'}
        loop
        preload="none"
        className="hidden"
      />
      
      <button
        onClick={handleToggleAudio}
        title={isPlaying ? 'Pause Music' : 'Play Music'}
        className="md:bottom-6 fixed bottom-[100px] left-4 z-[75] group bg-[#2C2C2C]/90 hover:bg-[#C9A84C] text-[#F0DFA0] p-2.5 rounded-full backdrop-blur shadow-lg transition-all duration-200 border border-[#C9A84C]/30 hover:scale-110 hover:shadow-[0_0_20px_rgba(201,168,76,0.5)]"
        aria-label="Toggle Music"
      >
        <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-gray-900/90 text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          {isPlaying ? 'Pause Music' : 'Play Music'}
        </span>
        {isPlaying ? <Volume2 size={18} /> : <VolumeX size={18} />}
      </button>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <DataProvider>
          <CartProvider>
            <AppInner />
          </CartProvider>
        </DataProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
