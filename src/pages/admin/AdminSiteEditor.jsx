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
      for (const slide of localSlides) {
        if (slide.id) {
          await axios.put(`/api/slides/${slide.id}`, slide);
        } else {
          await axios.post(`/api/slides`, slide);
        }
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

  const addSlide = () => {
    setLocalSlides([...localSlides, { heroImage: '', mobileImage: '', title: '', subtitle: '', cta: '', gradient: '', tag: '', badge: '' }]);
  };

  const removeSlide = async (idx, id) => {
    if (confirm('Are you sure you want to remove this slide?')) {
      if (id) {
        try {
          await axios.delete(`/api/slides/${id}`);
          await refreshData();
        } catch (err) {
          console.error(err);
          showToast('Error removing slide.');
          return;
        }
      }
      const newSlides = [...localSlides];
      newSlides.splice(idx, 1);
      setLocalSlides(newSlides);
      showToast('Slide removed.');
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
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl font-bold font-cinzel text-[#1A1A1A]">Hero Carousel Editor</h2>
              <div className="flex gap-2 w-full sm:w-auto">
                <button onClick={addSlide} className="w-full sm:w-auto bg-white border border-gray-200 text-gray-800 px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
                  + Add Slide
                </button>
                <button onClick={handleSaveSlides} disabled={isSaving} className="w-full sm:w-auto bg-[#1A1A1A] text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-[#C9A84C] transition-colors disabled:opacity-50">
                  {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                  Save Changes
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <div className="space-y-6 bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-sm">
                {localSlides.length === 0 && (
                  <div className="text-center text-gray-500 py-8">
                    No slides added yet. Click "Add Slide" to begin.
                  </div>
                )}
                {localSlides.map((slide, idx) => (
                  <div key={slide.id || idx} className="border border-gray-100 rounded-xl p-4 relative">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold">Slide {idx + 1}</h3>
                      <button onClick={() => removeSlide(idx, slide.id)} className="text-red-500 hover:text-red-700 text-sm font-medium">
                        Remove
                      </button>
                    </div>
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
                    <div className="mt-4">
                      <UploadField 
                        label="Mobile Image (Optional)"
                        value={slide.mobileImage}
                        onChange={(url) => {
                          const newSlides = [...localSlides];
                          newSlides[idx].mobileImage = url;
                          setLocalSlides(newSlides);
                        }}
                        recommendedSize="800×1000px"
                        maxSize="2MB"
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="bg-gray-100 rounded-2xl p-4 overflow-hidden h-fit sticky top-24">
                <h3 className="font-bold text-gray-500 mb-4 flex items-center gap-2"><ExternalLink size={16}/> Live Preview</h3>
                <div className="w-full aspect-[192/70] relative rounded-xl overflow-hidden shadow-lg bg-black flex items-center justify-center text-gray-600">
                  {localSlides[0]?.heroImage ? (
                    <img src={localSlides[0].heroImage} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    "No image preview"
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'branding':
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl font-bold font-cinzel text-[#1A1A1A]">Global Branding</h2>
              <button onClick={handleSaveSettings} disabled={isSaving} className="w-full sm:w-auto bg-[#1A1A1A] text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-[#C9A84C] transition-colors disabled:opacity-50">
                {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                Save Settings
              </button>
            </div>
            
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <div className="space-y-6 bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-sm">
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
                <div className="w-full bg-white p-3 sm:p-4 shadow-lg flex items-center gap-3 sm:gap-4 overflow-hidden rounded-xl">
                   {localSettings.logoBase64 ? (
                     <img src={localSettings.logoBase64} className="h-10 w-10 sm:h-12 sm:w-12 object-contain rounded-full shrink-0" alt="Logo" />
                   ) : (
                     <div className="h-10 w-10 sm:h-12 sm:w-12 bg-gray-200 rounded-full shrink-0" />
                   )}
                   <div className="font-cinzel font-bold text-base sm:text-xl text-[#1A1A1A] truncate">CHAITALI'S ARTBIZZ</div>
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
