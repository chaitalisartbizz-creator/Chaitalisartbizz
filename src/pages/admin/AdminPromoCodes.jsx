import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';
import { useData } from '../../context/DataContext';
import { useCart } from '../../context/CartContext';
import { Plus, Edit2, Trash2, X, Search, Tag, Loader2 } from 'lucide-react';

export default function AdminPromoCodes() {
  const { promoCodes, refreshData } = useData();
  const { showToast } = useCart();
  const [editing, setEditing] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const defaultPromo = {
    title: '', sub: '', expiry: '', color1: '#2C2C2C', color2: '#C9A84C', emoji: '🎉', code: ''
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editing.id) {
        await axios.put(`/api/promoCodes/${editing.id}`, editing);
        showToast('Promo code updated successfully!');
      } else {
        await axios.post('/api/promoCodes', editing);
        showToast('New promo code added!');
      }
      await refreshData();
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      showToast('Error saving promo code.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this promo code?')) {
      try {
        await axios.delete(`/api/promoCodes/${id}`);
        showToast('Promo code deleted.');
        await refreshData();
      } catch (err) {
        console.error(err);
        showToast('Error deleting promo code.');
      }
    }
  };

  const filteredPromos = (promoCodes || []).filter(p => 
    (p.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.code || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden animate-fade-in">
      <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50/30">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Promo Codes</h2>
          <p className="text-sm text-gray-500">Manage active promo codes and coupons</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search codes..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/20 focus:border-[#C9A84C] transition-all text-sm"
            />
          </div>
          <button 
            onClick={() => { setEditing(defaultPromo); setIsModalOpen(true); }}
            className="flex items-center justify-center gap-2 bg-[#C9A84C] hover:bg-[#A8873A] text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-[#C9A84C]/20 whitespace-nowrap"
          >
            <Plus size={18} /> <span className="hidden sm:inline">Add Code</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 text-gray-500 text-sm border-b border-gray-100">
              <th className="p-4 font-semibold pl-6">Promo Info</th>
              <th className="p-4 font-semibold">Code & Expiry</th>
              <th className="p-4 font-semibold text-right pr-6">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredPromos.map(p => (
              <tr key={p.id} className="hover:bg-gray-50/30 transition-colors group">
                <td className="p-4 pl-6 flex items-center gap-4">
                  <div className="text-4xl">{p.emoji}</div>
                  <div>
                    <span className="font-bold text-gray-800 block">{p.title}</span>
                    <span className="text-xs text-gray-500">{p.sub}</span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex flex-col gap-1">
                    <span className="bg-green-100 text-green-800 px-2.5 py-1 rounded-lg text-xs font-bold w-fit font-mono">{p.code}</span>
                    <span className="text-xs text-gray-400 font-medium">{p.expiry}</span>
                  </div>
                </td>
                <td className="p-4 pr-6">
                  <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                    <button title="Edit" onClick={() => { setEditing(p); setIsModalOpen(true); }} className="p-2 text-blue-500 hover:bg-blue-100 rounded-xl transition-colors">
                      <Edit2 size={18} />
                    </button>
                    <button title="Delete" onClick={() => handleDelete(p.id)} className="p-2 text-red-500 hover:bg-red-100 rounded-xl transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredPromos.length === 0 && (
              <tr>
                <td colSpan="3" className="p-12 text-center">
                  <div className="inline-flex flex-col items-center justify-center text-gray-400">
                    <Tag size={48} className="mb-4 text-gray-300" />
                    <p className="text-lg font-medium text-gray-500">No promo codes found</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && createPortal(
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[300] flex items-center justify-center p-4 animate-fade-in">
          <form onSubmit={handleSave} className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50/50">
              <h3 className="text-xl font-bold text-gray-800">{editing.id ? 'Edit Promo Code' : 'Add Promo Code'}</h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className="w-8 h-8 flex items-center justify-center bg-white border rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="overflow-y-auto flex-1 p-6 space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Title <span className="text-red-500">*</span></label>
                <input required type="text" placeholder="e.g. FESTIVE ART BUNDLE" value={editing.title} onChange={e => setEditing({...editing, title: e.target.value})} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/20 focus:border-[#C9A84C] text-sm" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Subtitle <span className="text-red-500">*</span></label>
                <input required type="text" placeholder="e.g. Flat 25% Off Custom Gift Combos" value={editing.sub} onChange={e => setEditing({...editing, sub: e.target.value})} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/20 focus:border-[#C9A84C] text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Promo Code <span className="text-red-500">*</span></label>
                  <input required type="text" placeholder="e.g. ARTFEST25" value={editing.code} onChange={e => setEditing({...editing, code: e.target.value.toUpperCase()})} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/20 focus:border-[#C9A84C] text-sm font-mono uppercase" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Expiry Text <span className="text-red-500">*</span></label>
                  <input required type="text" placeholder="e.g. 3 Days Left" value={editing.expiry} onChange={e => setEditing({...editing, expiry: e.target.value})} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/20 focus:border-[#C9A84C] text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Emoji</label>
                  <input required type="text" placeholder="🎉" value={editing.emoji} onChange={e => setEditing({...editing, emoji: e.target.value})} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/20 focus:border-[#C9A84C] text-center text-xl" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Color 1</label>
                  <input required type="color" value={editing.color1} onChange={e => setEditing({...editing, color1: e.target.value})} className="w-full h-[46px] p-1 bg-gray-50 border border-gray-200 rounded-xl cursor-pointer" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Color 2</label>
                  <input required type="color" value={editing.color2} onChange={e => setEditing({...editing, color2: e.target.value})} className="w-full h-[46px] p-1 bg-gray-50 border border-gray-200 rounded-xl cursor-pointer" />
                </div>
              </div>
              <div className="mt-4 p-4 rounded-xl text-center" style={{ backgroundImage: `linear-gradient(to right, ${editing.color1}, ${editing.color2})` }}>
                <span className="text-[#F0DFA0] font-cinzel font-bold">{editing.title || 'Preview'}</span>
              </div>
            </div>
            <div className="p-6 border-t bg-gray-50/50 flex justify-end gap-3">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 border border-gray-200 bg-white rounded-xl hover:bg-gray-50 font-bold text-gray-600 transition-colors">Cancel</button>
              <button type="submit" className="px-6 py-2.5 bg-[#C9A84C] hover:bg-[#A8873A] text-white rounded-xl font-bold shadow-lg shadow-[#C9A84C]/20 transition-all hover:-translate-y-0.5">
                {editing.id ? 'Save Changes' : 'Create Promo Code'}
              </button>
            </div>
          </form>
        </div>
      , document.body)}
    </div>
  );
}
