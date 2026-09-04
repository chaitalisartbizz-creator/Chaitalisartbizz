import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';
import { handleImageUpload } from '../../utils/imageUpload';
import { useData } from '../../context/DataContext';
import { useCart } from '../../context/CartContext';
import { Plus, Edit2, Trash2, X, Search, Image as ImageIcon, Tag, Loader2 } from 'lucide-react';

export default function AdminCategories() {
  const { categories, refreshData } = useData();
  const { showToast } = useCart();
  const [editing, setEditing] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const defaultCategory = {
    label: '', emoji: '', img: '', bg: '#FFFFFF', sub: ''
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editing.id) {
        await axios.put(`/api/categories/${editing.id}`, editing);
        showToast('Category updated successfully!');
      } else {
        await axios.post('/api/categories', editing);
        showToast('New category added!');
      }
      await refreshData();
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      showToast('Error saving category.');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this category?')) {
      try {
        await axios.delete(`/api/categories/${id}`);
        showToast('Category deleted.');
        await refreshData();
      } catch (err) {
        console.error(err);
        showToast('Error deleting category.');
      }
    }
  };

  const filteredCategories = categories.filter(c => 
    c.label?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.sub?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Tag className="text-[#C9A84C]" size={28} /> Product Categories
          </h2>
          <p className="text-gray-500 text-sm mt-1">Manage store categories, images, and sub-categories</p>
        </div>
        <div className="flex w-full sm:w-auto gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search categories..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/20 focus:border-[#C9A84C] transition-all"
            />
          </div>
          <button 
            onClick={() => { setEditing(defaultCategory); setIsModalOpen(true); }}
            className="flex items-center justify-center gap-2 bg-[#C9A84C] hover:bg-[#A8873A] text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-[#C9A84C]/20 whitespace-nowrap"
          >
            <Plus size={18} /> <span className="hidden sm:inline">Add Category</span>
          </button>
        </div>
      </div>

      <div>
        {/* Mobile View */}
        <div className="block lg:hidden space-y-4 p-4">
          {filteredCategories.map(cat => (
            <div key={cat.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 flex items-center gap-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center border shrink-0" style={{ backgroundColor: cat.bg || '#FFF' }}>
                  {cat.img ? (
                    <img src={cat.img} alt={cat.label} className="w-full h-full object-cover rounded-full mix-blend-multiply" />
                  ) : (
                    <span className="text-3xl">{cat.emoji}</span>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800">{cat.label}</h3>
                  {cat.sub && <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{cat.sub}</p>}
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 border-t flex justify-between gap-3">
                <button onClick={() => { setEditing(cat); setIsModalOpen(true); }} className="flex-1 py-2 bg-white border rounded-xl text-gray-600 font-semibold text-sm hover:bg-gray-50 flex justify-center items-center gap-2">
                  <Edit2 size={16} /> Edit
                </button>
                <button onClick={() => handleDelete(cat.id)} className="flex-1 py-2 bg-white border border-red-100 rounded-xl text-red-500 font-semibold text-sm hover:bg-red-50 flex justify-center items-center gap-2">
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View */}
        <div className="hidden lg:block bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-5 font-bold text-sm text-gray-500 uppercase tracking-wider w-24">Image</th>
                <th className="p-5 font-bold text-sm text-gray-500 uppercase tracking-wider">Category & Sub-categories</th>
                <th className="p-5 font-bold text-sm text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.map(cat => (
                <tr key={cat.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors group">
                  <td className="p-5">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center border shadow-sm" style={{ backgroundColor: cat.bg || '#FFF' }}>
                      {cat.img ? (
                        <img src={cat.img} alt={cat.label} className="w-full h-full object-cover rounded-full mix-blend-multiply" />
                      ) : (
                        <span className="text-2xl">{cat.emoji}</span>
                      )}
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="font-bold text-gray-800 text-lg flex items-center gap-2">
                      {cat.label}
                    </div>
                    {cat.sub && <div className="text-sm text-gray-500 mt-1 max-w-lg">{cat.sub}</div>}
                  </td>
                  <td className="p-5">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => { setEditing(cat); setIsModalOpen(true); }} className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => handleDelete(cat.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredCategories.length === 0 && (
            <div className="p-12 text-center text-gray-500">
              No categories found. Click "Add Category" to create one.
            </div>
          )}
        </div>
      </div>
    </div>

    {isModalOpen && createPortal(
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[300] flex items-center justify-center p-4 animate-fade-in">
          <form id="categoryForm" onSubmit={handleSave} className="bg-white rounded-3xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50/50">
              <h3 className="text-xl font-bold text-gray-800">{editing.id ? 'Edit Category' : 'Add New Category'}</h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className="w-8 h-8 flex items-center justify-center bg-white border rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="overflow-y-auto flex-1 p-6">
              <div className="space-y-6">
                
                {/* Image Preview Area */}
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex gap-6 items-center">
                  <div className="w-20 h-20 rounded-full border shadow-sm flex items-center justify-center overflow-hidden shrink-0" style={{ backgroundColor: editing.bg || '#FFF' }}>
                    {editing.img ? (
                      <img src={editing.img} alt="Preview" className="w-full h-full object-cover mix-blend-multiply" />
                    ) : (
                      <span className="text-3xl">{editing.emoji || <ImageIcon size={24} className="text-gray-300"/>}</span>
                    )}
                  </div>
                  <div className="flex-1 space-y-3">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Image <span className="text-red-500">*</span></label>
                      <div className="flex gap-2">
                        <input type="url" placeholder="Paste URL here..." value={editing.img || ''} onChange={e => setEditing({...editing, img: e.target.value})} className="flex-1 p-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/20 focus:border-[#C9A84C] transition-all text-sm" />
                        <span className="text-sm text-gray-500 flex items-center">OR</span>
                        <label className={`cursor-pointer ${isUploading ? 'bg-gray-200 opacity-70' : 'bg-gray-100 hover:bg-gray-200'} px-4 py-2.5 rounded-xl border border-gray-200 flex items-center gap-2 text-sm font-medium transition-colors text-gray-700`}>
                          {isUploading ? <><Loader2 className="animate-spin" size={16} /> Uploading...</> : 'Upload'}
                          <input type="file" accept="image/*" className="hidden" disabled={isUploading} onChange={async (e) => {
                              if (e.target.files && e.target.files[0]) {
                                setIsUploading(true);
                                try {
                                  const base64 = await handleImageUpload(e.target.files[0]);
                                  setEditing({...editing, img: base64});
                                } catch(err) {
                                  console.error("Upload failed", err);
                                  alert("Image upload failed");
                                } finally {
                                  setIsUploading(false);
                                }
                              }
                          }} />
                        </label>
                      </div>
                      <p className="text-[10px] text-gray-500 mt-1">Recommended size: 200x200px (Transparent PNG)</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Category Label <span className="text-red-500">*</span></label>
                    <input required type="text" placeholder="e.g. Resin Clocks" value={editing.label || ''} onChange={e => setEditing({...editing, label: e.target.value})} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/20 focus:border-[#C9A84C] transition-all text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Sub-categories</label>
                    <input type="text" placeholder="e.g. Shirts, t-shirts, scarves" value={editing.sub || ''} onChange={e => setEditing({...editing, sub: e.target.value})} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/20 focus:border-[#C9A84C] transition-all text-sm" />
                    <p className="text-xs text-gray-500 mt-1">Comma-separated list of items under this category.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Emoji</label>
                      <input type="text" placeholder="e.g. 🎨" value={editing.emoji || ''} onChange={e => setEditing({...editing, emoji: e.target.value})} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/20 focus:border-[#C9A84C] transition-all text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Background Color</label>
                      <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl p-1 focus-within:ring-2 focus-within:ring-[#C9A84C]/20 focus-within:border-[#C9A84C] transition-all">
                        <input type="color" value={editing.bg || '#FFFFFF'} onChange={e => setEditing({...editing, bg: e.target.value})} className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent" />
                        <input required type="text" value={editing.bg || '#FFFFFF'} onChange={e => setEditing({...editing, bg: e.target.value})} className="w-full bg-transparent border-none focus:outline-none text-sm uppercase font-medium text-gray-700" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t bg-gray-50/50 flex justify-end gap-3">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 border border-gray-200 bg-white rounded-xl hover:bg-gray-50 font-bold text-gray-600 transition-colors">Cancel</button>
              <button type="submit" className="px-6 py-2.5 bg-[#C9A84C] hover:bg-[#A8873A] text-white rounded-xl font-bold shadow-lg shadow-[#C9A84C]/20 transition-all hover:-translate-y-0.5">
                {editing.id ? 'Save Changes' : 'Create Category'}
              </button>
            </div>
          </form>
        </div>
      , document.body)}
    </>
  );
}
