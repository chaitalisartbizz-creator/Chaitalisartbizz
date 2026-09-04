import React, { useState } from 'react';
import axios from 'axios';
import { useData } from '../../context/DataContext';
import { useCart } from '../../context/CartContext';
import { Video, Plus, Trash2, Loader2, Info } from 'lucide-react';

export default function AdminInstagram() {
  const { instagramFeeds, refreshData } = useData();
  const { showToast } = useCart();
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!url.includes('instagram.com')) {
      return showToast('Please enter a valid Instagram URL');
    }
    setLoading(true);
    try {
      await axios.post('/api/instagram', { url });
      showToast('Instagram feed added successfully!');
      setUrl('');
      await refreshData();
    } catch (error) {
      showToast('Failed to add feed');
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this feed?')) return;
    try {
      await axios.delete(`/api/instagram/${id}`);
      showToast('Feed deleted');
      await refreshData();
    } catch (error) {
      showToast('Failed to delete feed');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Video className="text-[#C9A84C]" size={28} /> Instagram Feeds
        </h2>
        <p className="text-gray-500 text-sm mt-1">Manage Instagram reels and posts displayed on your website.</p>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-[#C9A84C]/20 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-2 h-full bg-[#C9A84C]" />
        
        <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Instagram Post URL</label>
            <input 
              type="text" 
              value={url} 
              onChange={(e) => setUrl(e.target.value)} 
              placeholder="e.g. https://www.instagram.com/p/Dch4BriSnAv/" 
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="bg-[#2C2C2C] text-[#F0DFA0] px-6 py-3 rounded-xl font-bold hover:bg-[#C9A84C] hover:text-[#2C2C2C] transition-colors whitespace-nowrap flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
            Add Reel
          </button>
        </form>

        <div className="mt-4 flex items-start gap-2 text-stone-500 text-xs bg-stone-50 p-3 rounded-xl border border-stone-100">
          <Info size={16} className="text-[#C9A84C] flex-shrink-0 mt-0.5" />
          <p>
            Paste the full URL of the Instagram Reel or Post. The website will automatically format it for embedded playback. 
            Note that some browsers or devices may prevent automatic playback with sound.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(instagramFeeds || []).map((feed) => (
          <div key={feed.id} className="bg-white rounded-3xl border border-[#C9A84C]/20 shadow-lg overflow-hidden flex flex-col group relative">
            <button 
              onClick={() => handleDelete(feed.id)}
              className="absolute top-3 right-3 z-20 bg-red-500/90 text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 hover:scale-110"
              title="Delete Feed"
            >
              <Trash2 size={16} />
            </button>
            <div className="relative bg-stone-100 p-2 min-h-[400px] flex items-center justify-center">
              <iframe 
                src={(feed.url.split('?')[0].endsWith('/') ? feed.url.split('?')[0] : feed.url.split('?')[0] + '/') + 'embed/captioned?autoplay=0'}
                className="w-full h-[500px] border-none rounded-2xl bg-white"
                scrolling="no"
                allowTransparency="true"
                allow="autoplay; encrypted-media; picture-in-picture"
                title="Instagram Preview"
              />
            </div>
            <div className="p-4 border-t border-stone-100 bg-stone-50 text-center">
              <a href={feed.url} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline break-all">
                {feed.url}
              </a>
            </div>
          </div>
        ))}
        {(!instagramFeeds || instagramFeeds.length === 0) && (
          <div className="col-span-full py-12 text-center text-stone-500 border-2 border-dashed border-stone-200 rounded-3xl bg-stone-50">
            <Video className="mx-auto text-stone-300 mb-3" size={48} />
            <p className="font-bold text-stone-700">No Instagram Feeds Yet</p>
            <p className="text-sm mt-1">Add a post URL above to display it on the website.</p>
          </div>
        )}
      </div>
    </div>
  );
}
