import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useData } from '../../context/DataContext';
import { useCart } from '../../context/CartContext';
import { Layout, Image as ImageIcon, Percent, Grid, Settings, Loader2, Save, ExternalLink } from 'lucide-react';
import UploadField from '../../components/UploadField';

export default function AdminSiteEditor() {
  const { slides, banners, deals, categories, frontendSettings, refreshData } = useData();
  const { showToast } = useCart();
  const [activeTab, setActiveTab] = useState('hero');
  const [isSaving, setIsSaving] = useState(false);

  // Local state for editing
  const [localSettings, setLocalSettings] = useState(frontendSettings || {});
  const [localSlides, setLocalSlides] = useState(slides || []);
  const [localBanners, setLocalBanners] = useState(banners || []);
  const [localDeals, setLocalDeals] = useState(deals || []);
  
  useEffect(() => {
    setLocalSettings(frontendSettings || {});
    setLocalSlides(slides || []);
    setLocalBanners(banners || []);
    setLocalDeals(deals || []);
  }, [slides, banners, deals, categories, frontendSettings]);

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      await axios.put('/api/settings', localSettings);
      await refreshData();
      showToast('Settings saved successfully!');
    } catch (err) {
      console.error(err);
      showToast('Error saving settings.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveSlides = async () => {
    setIsSaving(true);
    try {
      // In a real scenario, you'd sync each slide, here we just assume sequential updates or bulk
      for (const slide of localSlides) {
        if (slide.id) await axios.put(`/api/slides/${slide.id}`, slide);
      }
      await refreshData();
      showToast('Slides saved successfully!');
    } catch (err) {
      console.error(err);
      showToast('Error saving slides.');
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: 'hero', label: 'Hero Section', icon: ImageIcon },
    { id: 'branding', label: 'Global Branding', icon: Settings },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'hero':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold font-cinzel text-[#1A1A1A]">Hero Carousel Editor</h2>
              <button onClick={handleSaveSlides} disabled={isSaving} className="bg-[#1A1A1A] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#C9A84C] transition-colors disabled:opacity-50">
                {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                Save Changes
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                {localSlides.map((slide, idx) => (
                  <div key={slide.id || idx} className="border border-gray-100 rounded-xl p-4 relative">
                    <h3 className="font-bold mb-4">Slide {idx + 1}</h3>
                    <UploadField 
                      label="Desktop Image"
                      value={slide.heroImage}
                      onChange={(url) => {
                        const newSlides = [...localSlides];
                        newSlides[idx].heroImage = url;
                        setLocalSlides(newSlides);
                      }}
                      recommendedSize="1920×700px"
                      maxSize="3MB"
                    />
                  </div>
                ))}
              </div>
              
              <div className="bg-gray-100 rounded-2xl p-4 overflow-hidden h-fit sticky top-24">
                <h3 className="font-bold text-gray-500 mb-4 flex items-center gap-2"><ExternalLink size={16}/> Live Preview</h3>
                <div className="w-full aspect-[192/70] relative rounded-xl overflow-hidden shadow-lg bg-black">
                  {localSlides[0]?.heroImage && (
                    <img src={localSlides[0].heroImage} alt="Preview" className="w-full h-full object-cover" />
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'branding':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold font-cinzel text-[#1A1A1A]">Global Branding</h2>
              <button onClick={handleSaveSettings} disabled={isSaving} className="bg-[#1A1A1A] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#C9A84C] transition-colors disabled:opacity-50">
                {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                Save Settings
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <UploadField 
                  label="Site Logo"
                  value={localSettings.logoBase64}
                  onChange={(url) => setLocalSettings(prev => ({...prev, logoBase64: url}))}
                  recommendedSize="200×200px"
                  maxSize="500KB"
                  formats="PNG (transparent)"
                />
              </div>
              
              <div className="bg-gray-100 rounded-2xl p-4 overflow-hidden h-fit sticky top-24">
                <h3 className="font-bold text-gray-500 mb-4 flex items-center gap-2"><ExternalLink size={16}/> Live Preview</h3>
                <div className="w-full bg-white p-4 shadow-lg flex items-center gap-4">
                   {localSettings.logoBase64 ? (
                     <img src={localSettings.logoBase64} className="h-12 w-12 object-contain rounded-full" alt="Logo" />
                   ) : (
                     <div className="h-12 w-12 bg-gray-200 rounded-full" />
                   )}
                   <div className="font-cinzel font-bold text-xl text-[#1A1A1A]">CHAITALI'S ARTBIZZ</div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-cinzel font-bold text-[#1A1A1A]">Site Editor</h1>
        <p className="text-gray-500 mt-2">Visually edit homepage sections with live preview</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                activeTab === tab.id 
                  ? 'bg-[#1A1A1A] text-[#C9A84C] shadow-md' 
                  : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-100'
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {renderTabContent()}
    </div>
  );
}
