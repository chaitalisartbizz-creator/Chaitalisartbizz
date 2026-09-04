import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import axios from 'axios';

export const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [slides, setSlides] = useState([]);
  const [banners, setBanners] = useState([]);
  const [categories, setCategories] = useState([]);
  const [deals, setDeals] = useState([]);
  const [products, setProducts] = useState([]);
  const [frontendSettings, setFrontendSettings] = useState(null);
  const [instagramFeeds, setInstagramFeeds] = useState([]);
  const [loading, setLoading] = useState(true);

  const [fcmToken, setFcmToken] = useState(null);
  const hasRequestedPermission = useRef(false);

  const [visitorId] = useState(() => {
    let vid = localStorage.getItem('chaitali-artbizz-vid');
    if (!vid) {
      vid = 'vid_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('chaitali-artbizz-vid', vid);
    }
    return vid;
  });

  const [activityLog, setActivityLog] = useState([]);

  const logActivity = (action, details = '') => {
    const type = action === 'Page View' ? 'pageview' : 'interaction';
    
    axios.post('/api/analytics/track', {
      type,
      visitorId,
      page: type === 'pageview' ? details.replace('Visited ', '') : '',
      action,
      details,
      fcmToken
    }).catch(err => console.error("Failed to track:", err));
  };

  const refreshData = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/data');
      const { slides, categories, deals, products, frontendSettings, banners, instagramFeeds } = res.data;
      setSlides(slides || []);
      setCategories(categories || []);
      setDeals(deals || []);
      setProducts(products || []);
      setFrontendSettings(frontendSettings || null);
      setBanners(banners || []);
      setInstagramFeeds(instagramFeeds || []);
    } catch (error) {
      console.error("Failed to fetch initial data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  useEffect(() => {
    if (frontendSettings) {
      document.title = `${frontendSettings.storeName || "Chaitali's Artbizz"} | ${frontendSettings.tagline || 'Imagine. We Will Create.'}`;
    }
  }, [frontendSettings]);

  return (
    <DataContext.Provider value={{
      slides, setSlides,
      banners, setBanners,
      categories, setCategories,
      deals, setDeals,
      products, setProducts,
      frontendSettings, setFrontendSettings,
      instagramFeeds, setInstagramFeeds,
      activityLog, logActivity,
      loading,
      refreshData
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
