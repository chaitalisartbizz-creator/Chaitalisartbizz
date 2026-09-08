import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useData } from '../../context/DataContext';
import { useCart } from '../../context/CartContext';
import { ImageIcon, Loader2, Save, ExternalLink } from 'lucide-react';
import UploadField from '../../components/UploadField';

export default function AdminSlides() {
  const { slides, products, categories, refreshData } = useData();
  const { showToast } = useCart();
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [localSlides, setLocalSlides] = useState(slides || []);

  useEffect(() => {
    setLocalSlides(slides || []);
  }, [slides]);

  const handleSaveSlides = async () => {
    setIsSaving(true);
    setSaveError(null);
    try {
      for (const s of localSlides) {
        if (s.id) {
          await axios.put(`/api/slides/${s.id}`, s);
        } else {
          await axios.post('/api/slides', s);
        }
      }
      showToast('Carousel updated successfully');
      refreshData();
    } catch (err) {
      console.error(err);
      setSaveError('Failed to save slides. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const addSlide = () => {
    setLocalSlides([...localSlides, { heroImage: '', mobileImage: '', linkUrl: '', title: '', subtitle: '', cta: '', gradient: '', tag: '', badge: '' }]);
  };

  const removeSlide = async (idx, id) => {
    if (window.confirm('Are you sure you want to remove this slide?')) {
      if (id) {
        try {
          await axios.delete(`/api/slides/${id}`);
          refreshData();
        } catch (err) {
          console.error(err);
          alert('Failed to delete slide from server');
          return;
        }
      }
      const newSlides = [...localSlides];
      newSlides.splice(idx, 1);
      setLocalSlides(newSlides);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-cinzel font-bold text-[#1A1A1A]">Hero Slides</h1>
        <p className="text-gray-500 mt-2">Visually edit homepage carousel with live preview</p>
      </div>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-xl font-bold font-cinzel text-[#1A1A1A]">Hero Carousel Editor</h2>
          <div className="flex gap-2 w-full sm:w-auto">
            <button 
              onClick={addSlide}
              className="w-full sm:w-auto bg-white border border-gray-200 text-gray-800 px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors shadow-sm"
            >
              + Add Slide
            </button>
            <button 
              onClick={handleSaveSlides}
              disabled={isSaving}
              className="w-full sm:w-auto bg-[#1A1A1A] text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-[#C9A84C] transition-colors disabled:opacity-50 shadow-sm"
            >
              {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        {saveError && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 font-medium">
            {saveError}
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <div className="space-y-6">
            {localSlides.map((slide, idx) => (
              <div key={idx} className="border border-gray-100 rounded-xl p-4 relative bg-white shadow-sm">
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
                  recommendedSize="1920x700px"
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
                    recommendedSize="800x1000px"
                    maxSize="2MB"
                  />
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-semibold text-[#1A1A1A] mb-1.5">Link URL (Optional)</label>
                  <input 
                    type="text" 
                    list="slide-links"
                    placeholder="e.g., /category/Resin Art or /product/123" 
                    value={slide.linkUrl || ''} 
                    onChange={e => {
                      const newSlides = [...localSlides];
                      newSlides[idx].linkUrl = e.target.value;
                      setLocalSlides(newSlides);
                    }} 
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/20 focus:border-[#C9A84C] transition-all text-sm" 
                  />
                  <datalist id="slide-links">
                    {categories?.map(c => <option key={`cat-${c.id}`} value={`/category/${encodeURIComponent(c.label)}`}>Category: {c.label}</option>)}
                    {products?.map(p => <option key={`prod-${p.id}`} value={`/product/${p.id}`}>Product: {p.name}</option>)}
                  </datalist>
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-gray-100 rounded-2xl p-4 overflow-hidden h-fit sticky top-24">
            <h3 className="font-bold text-gray-500 mb-4 flex items-center gap-2"><ExternalLink size={16}/> Live Preview</h3>
            <div className="w-full relative rounded-xl overflow-hidden shadow-lg bg-black flex items-center justify-center text-gray-600">
              {localSlides[0]?.heroImage ? (
                <img src={localSlides[0].heroImage} alt="Preview" className="w-full h-auto block" />
              ) : (
                <div className="aspect-[192/70] flex items-center justify-center">No image preview</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
