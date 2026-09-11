import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';
import { handleImageUpload } from '../../utils/imageUpload';
import { useData } from '../../context/DataContext';
import { useCart } from '../../context/CartContext';
import { Plus, Edit2, Trash2, X, Search, Image as ImageIcon, Loader2, Info } from 'lucide-react';
import LinkUrlInput from '../../components/LinkUrlInput';

export default function AdminFeaturedCollections() {
  const { banners, refreshData } = useData();
  const { showToast } = useCart();
  const [editing, setEditing] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const defaultBanner = {
    title: '', subtitle: '', badge: '', link: '', mediaUrl: ''
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editing.id) {
        await axios.put(`/api/banners/${editing.id}`, editing);
        showToast('Featured collection updated successfully!');
      } else {
        await axios.post('/api/banners', editing);
        showToast('New featured collection added!');
      }
      await refreshData();
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      showToast('Error saving featured collection.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this featured collection?')) {
      try {
        await axios.delete(`/api/banners/${id}`);
        showToast('Featured collection deleted.');
        await refreshData();
      } catch (err) {
        console.error(err);
        showToast('Error deleting featured collection.');
      }
    }
  };

  const filteredBanners = (banners || []).filter(b => 
    (b.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (b.subtitle || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden animate-fade-in">
      <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50/30">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Featured Art Collections</h2>
          <p className="text-sm text-gray-500">Manage hero banners on the homepage</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search collections..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/20 focus:border-[#C9A84C] transition-all text-sm"
            />
          </div>
          <button 
            onClick={() => { setEditing(defaultBanner); setIsModalOpen(true); }}
            className="flex items-center justify-center gap-2 bg-[#C9A84C] hover:bg-[#A8873A] text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-[#C9A84C]/20 whitespace-nowrap"
          >
            <Plus size={18} /> <span className="hidden sm:inline">Add Collection</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 text-gray-500 text-sm border-b border-gray-100">
              <th className="p-4 font-semibold pl-6">Banner Image</th>
              <th className="p-4 font-semibold">Details</th>
              <th className="p-4 font-semibold">Link URL</th>
              <th className="p-4 font-semibold text-right pr-6">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredBanners.map(b => (
              <tr key={b.id} className="hover:bg-gray-50/30 transition-colors group">
                <td className="p-4 pl-6">
                  <div className="w-32 h-20 rounded-xl overflow-hidden shadow-sm">
                    {b.mediaUrl ? (
                      <img src={b.mediaUrl} alt={b.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100"><ImageIcon size={20}/></div>
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <span className="font-bold text-gray-800 block">{b.title}</span>
                  <span className="text-sm text-gray-500 block">{b.subtitle}</span>
                  {b.badge && <span className="inline-block mt-1 bg-[#C9A84C]/20 text-[#C9A84C] border border-[#C9A84C]/30 rounded-full px-2 py-0.5 text-[10px] font-bold">{b.badge}</span>}
                </td>
                <td className="p-4 text-sm font-mono text-gray-500">{b.link}</td>
                <td className="p-4 pr-6">
                  <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                    <button title="Edit" onClick={() => { setEditing(b); setIsModalOpen(true); }} className="p-2 text-blue-500 hover:bg-blue-100 rounded-xl transition-colors">
                      <Edit2 size={18} />
                    </button>
                    <button title="Delete" onClick={() => handleDelete(b.id)} className="p-2 text-red-500 hover:bg-red-100 rounded-xl transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredBanners.length === 0 && (
              <tr>
                <td colSpan="4" className="p-12 text-center">
                  <div className="inline-flex flex-col items-center justify-center text-gray-400">
                    <ImageIcon size={48} className="mb-4 text-gray-300" />
                    <p className="text-lg font-medium text-gray-500">No featured collections found</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && createPortal(
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[300] flex items-center justify-center p-4 animate-fade-in">
          <form onSubmit={handleSave} className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50/50">
              <h3 className="text-xl font-bold text-gray-800">{editing.id ? 'Edit Collection' : 'Add Collection'}</h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className="w-8 h-8 flex items-center justify-center bg-white border rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="overflow-y-auto flex-1 p-6 space-y-5">
              
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex flex-col gap-4">
                <label className="block text-sm font-bold text-gray-700">Banner Image <span className="text-red-500">*</span></label>
                <div className="flex gap-4">
                  <div className="w-40 h-24 rounded-xl border shadow-sm flex items-center justify-center overflow-hidden shrink-0 bg-white">
                    {editing.mediaUrl ? (
                      editing.mediaUrl.match(/\.(mp4|webm|mov)$/i) || editing.mediaUrl.includes('video') ? (
                        <video src={editing.mediaUrl} className="w-full h-full object-cover" autoPlay muted loop playsInline />
                      ) : (
                        <img src={editing.mediaUrl} alt="Preview" className="w-full h-full object-cover" />
                      )
                    ) : (
                      <ImageIcon size={32} className="text-gray-300" />
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <input type="url" placeholder="Paste URL here..." value={editing.mediaUrl || ''} onChange={e => setEditing({...editing, mediaUrl: e.target.value})} className="w-full p-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/20 focus:border-[#C9A84C] transition-all text-sm" />
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">OR</span>
                      <label className={`relative overflow-hidden cursor-pointer ${isUploading ? 'bg-gray-100 opacity-90' : 'bg-white hover:bg-gray-50'} px-4 py-2 rounded-xl border border-gray-200 flex items-center gap-2 text-sm font-medium transition-colors text-gray-700 z-0`}>
                        {isUploading && (
                          <div 
                            className="absolute inset-0 bg-[#C9A84C]/20 transition-all duration-300 -z-10"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        )}
                        {isUploading ? <><Loader2 className="animate-spin text-[#C9A84C]" size={16} /> <span className="font-bold">{uploadProgress}%</span></> : 'Upload Media'}
                        <input type="file" accept="image/*,video/mp4,video/webm" className="hidden" disabled={isUploading} onChange={async (e) => {
                            if (e.target.files && e.target.files[0]) {
                              setIsUploading(true);
                              setUploadProgress(0);
                              try {
                                const base64 = await handleImageUpload(e.target.files[0], setUploadProgress);
                                setEditing({...editing, mediaUrl: base64});
                              } catch(err) {
                                console.error("Upload failed", err);
                                alert("Media upload failed");
                              } finally {
                                setIsUploading(false);
                                setUploadProgress(0);
                              }
                            }
                        }} />
                      </label>
                    </div>
                    <p className="text-xs text-amber-600 mt-2 font-medium flex items-center gap-1 bg-amber-50 p-2 rounded-lg border border-amber-100">
                      <Info size={14} className="shrink-0" /> Recommended: 1920×1080px (Image) or 1080p (Video). Max: 5MB
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Title</label>
                  <input type="text" placeholder="e.g. Resin Art Collection" value={editing.title || ''} onChange={e => setEditing({...editing, title: e.target.value})} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/20 focus:border-[#C9A84C] text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Subtitle</label>
                  <input type="text" placeholder="e.g. Handcrafted with love" value={editing.subtitle || ''} onChange={e => setEditing({...editing, subtitle: e.target.value})} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/20 focus:border-[#C9A84C] text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Badge</label>
                  <input type="text" placeholder="e.g. Bestseller" value={editing.badge || ''} onChange={e => setEditing({...editing, badge: e.target.value})} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/20 focus:border-[#C9A84C] text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Link URL</label>
                  <LinkUrlInput 
                    placeholder="e.g. /category/Resin Art" 
                    value={editing.link} 
                    onChange={(val) => setEditing({...editing, link: val})} 
                  />
                </div>
              </div>
            </div>
            <div className="p-6 border-t bg-gray-50/50 flex justify-end gap-3">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 border border-gray-200 bg-white rounded-xl hover:bg-gray-50 font-bold text-gray-600 transition-colors">Cancel</button>
              <button type="submit" className="px-6 py-2.5 bg-[#C9A84C] hover:bg-[#A8873A] text-white rounded-xl font-bold shadow-lg shadow-[#C9A84C]/20 transition-all hover:-translate-y-0.5">
                {editing.id ? 'Save Changes' : 'Create Collection'}
              </button>
            </div>
          </form>
        </div>
      , document.body)}
    </div>
  );
}
