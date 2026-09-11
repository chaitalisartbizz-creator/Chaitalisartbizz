import React, { useState } from 'react';
import AdminFlashDeals from './AdminFlashDeals';
import AdminPromoCodes from './AdminPromoCodes';
import AdminFeaturedCollections from './AdminFeaturedCollections';
import { Tag, Zap, Layout } from 'lucide-react';

export default function AdminDeals() {
  const [activeTab, setActiveTab] = useState('flash'); // 'flash', 'promos', 'featured'

  const tabs = [
    { id: 'flash', label: 'Flash Deals', icon: Zap, description: 'Manage homepage flash deals section' },
    { id: 'promos', label: 'Promo Codes', icon: Tag, description: 'Manage active promo codes and coupons' },
    { id: 'featured', label: 'Featured Collections', icon: Layout, description: 'Manage hero banners and collections' }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-2 border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex flex-col items-center justify-center gap-1 p-3 rounded-2xl transition-all ${
              activeTab === tab.id 
                ? 'bg-[#C9A84C] text-white shadow-lg shadow-[#C9A84C]/20' 
                : 'bg-transparent text-gray-500 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-2 font-bold">
              <tab.icon size={18} />
              {tab.label}
            </div>
            <span className={`text-[10px] sm:text-xs text-center ${activeTab === tab.id ? 'text-[#F0DFA0]' : 'text-gray-400'}`}>
              {tab.description}
            </span>
          </button>
        ))}
      </div>

      <div className="animate-fade-in">
        {activeTab === 'flash' && <AdminFlashDeals />}
        {activeTab === 'promos' && <AdminPromoCodes />}
        {activeTab === 'featured' && <AdminFeaturedCollections />}
      </div>
    </div>
  );
}
