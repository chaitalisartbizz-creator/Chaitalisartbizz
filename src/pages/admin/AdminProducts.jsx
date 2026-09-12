import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';
import { handleImageUpload } from '../../utils/imageUpload';
import MediaDisplay from '../../components/MediaDisplay';
import { TableRowSkeleton } from '../../components/Skeleton';
import { useData } from '../../context/DataContext';
import { useCart } from '../../context/CartContext';
import { Plus, Edit2, Trash2, X, Search, Image as ImageIcon, Package, Loader2, Copy, Star } from 'lucide-react';
import AdminCategories from './AdminCategories';

function AdminProductsContent() {
  const { products, setProducts, categories, refreshData, loading } = useData();
  const { showToast } = useCart();
  const [editing, setEditing] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [isUploadingPrimary, setIsUploadingPrimary] = useState(false);
  const [primaryProgress, setPrimaryProgress] = useState(0);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);
  const [galleryProgress, setGalleryProgress] = useState(0);

  const defaultProduct = { 
    name: '', brand: '', subcategories: [], petType: 'Resin Art', category: '', price: '', mrp: '', 
    rating: 4.5, reviews: 0, img: '', images: [], tag: '', badge: '',
    description: '', features: '', customization: '', quality: '',
    tab1Name: '', tab2Name: '', tab3Name: '', variants: ''
  };

  const DEFAULT_BRANDS = ['Wall Clocks', 'Name Plates', 'Geode Art', 'Mantra Frames', 'Pooja Thali', 'Keychains', 'Coasters'];
  const uniqueBrands = [...new Set([...DEFAULT_BRANDS, ...(products || []).map(p => p.brand).filter(Boolean)])];

  const availableSubCategories = React.useMemo(() => {
    if (editing?.category) {
      const selectedCat = categories.find(c => c.label.toLowerCase() === editing.category.toLowerCase());
      let catSubs = [];
      if (selectedCat && selectedCat.sub) {
        catSubs = selectedCat.sub.split(',').map(s => s.trim()).filter(Boolean);
      }
      const productSubs = (products || [])
        .filter(p => p.category?.toLowerCase() === editing.category.toLowerCase())
        .flatMap(p => p.subcategories && p.subcategories.length > 0 ? p.subcategories : (p.brand ? [p.brand] : []))
        .filter(Boolean);
      
      const currentSubs = editing?.subcategories || [];
      return [...new Set([...catSubs, ...productSubs, ...currentSubs])];
    }
    return [];
  }, [editing?.category, editing?.subcategories, categories, products]);

  const DEFAULT_MEDIUMS = ['Resin Art', 'Acrylic', 'MDF Board', 'Digital Portrait', 'Oil Painting', 'Watercolor', 'Mixed Media', 'Charcoal', 'Pencil Sketch', 'Alcohol Ink', 'Fluid Art', 'Lippan Art'];
  const uniqueMediums = [...new Set([...DEFAULT_MEDIUMS, ...(products || []).map(p => p.petType).filter(Boolean)])];

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const subs = Array.isArray(editing.subcategories) ? editing.subcategories : [];
      // brand = primary subcategory (first checked) for backward compatibility
      const primaryBrand = subs[0] || editing.brand || '';
      const payload = {
        ...editing,
        price: Number(editing.price),
        mrp: Number(editing.mrp),
        brand: primaryBrand,
        subcategories: JSON.stringify(subs),
      };
      if (editing.id) {
        await axios.put(`/api/products/${editing.id}`, payload).catch(err => console.warn('API error:', err));
        if (typeof setProducts === 'function') {
          setProducts(prev => prev.map(p => p.id === editing.id ? { ...p, ...payload, subcategories: subs } : p));
        }
        showToast('Product updated successfully!');
      } else {
        const newProd = { ...payload, id: Date.now(), subcategories: subs };
        await axios.post('/api/products', payload).catch(err => console.warn('API error:', err));
        if (typeof setProducts === 'function') {
          setProducts(prev => [...prev, newProd]);
        }
        showToast('New product added!');
      }
      if (typeof refreshData === 'function') {
        try { await refreshData(); } catch (e) {}
      }
    } catch (err) {
      console.error(err);
      showToast('Error saving product.');
    } finally {
      setIsModalOpen(false);
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setIsSubmitting(true);
      try {
        await axios.delete(`/api/products/${id}`).catch(err => console.warn('API error:', err));
        if (typeof setProducts === 'function') {
          setProducts(prev => prev.filter(p => p.id !== id));
        }
        if (typeof refreshData === 'function') {
          try { await refreshData(); } catch (e) {}
        }
        showToast('Product deleted.');
      } catch (err) {
        console.error(err);
        showToast('Error deleting product.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Parse subcategories from JSON string (stored in DB) → array (used in UI)
  const parseSubcategories = (p) => {
    if (Array.isArray(p.subcategories)) return p.subcategories;
    if (typeof p.subcategories === 'string' && p.subcategories.startsWith('[')) {
      try { return JSON.parse(p.subcategories); } catch { /* fall through */ }
    }
    // Legacy: single brand string → wrap in array
    return p.brand ? [p.brand] : [];
  };

  const openEdit = (p) => {
    setEditing({ ...p, subcategories: parseSubcategories(p) });
    setIsModalOpen(true);
  };

  const handleDuplicate = (p) => {
    const duplicatedProduct = { ...p, subcategories: parseSubcategories(p) };
    delete duplicatedProduct.id;
    duplicatedProduct.name = `${duplicatedProduct.name} (Copy)`;
    setEditing(duplicatedProduct);
    setIsModalOpen(true);
  };

  const filteredProducts = products.filter(p => {
    const search = (searchQuery || '').toLowerCase();
    const name = p.name ? String(p.name).toLowerCase() : '';
    const brand = p.brand ? String(p.brand).toLowerCase() : '';
    return name.includes(search) || brand.includes(search);
  });

  return (
    <>
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden animate-fade-in">
        {/* Header & Search */}
      <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50/30">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Products</h2>
          <p className="text-sm text-gray-500">Manage your store's inventory</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/20 focus:border-[#C9A84C] transition-all text-sm"
            />
          </div>
          <button 
            onClick={() => { setEditing(defaultProduct); setIsModalOpen(true); }}
            className="flex items-center justify-center gap-2 bg-[#C9A84C] hover:bg-[#A8873A] text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-[#C9A84C]/20 whitespace-nowrap"
          >
            <Plus size={18} /> <span className="hidden sm:inline">Add Product</span>
          </button>
        </div>
      </div>

      <div>
        {/* Mobile View */}
        <div className="block lg:hidden space-y-4 p-4">
          {loading ? (
            <div className="p-8 text-center text-gray-500"><Loader2 className="animate-spin mx-auto mb-2" size={24} /> Loading...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-12 text-center bg-gray-50/50 rounded-2xl border border-gray-100">
              <Package size={42} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500 font-bold">No products found.</p>
            </div>
          ) : (
            filteredProducts.map(p => (
              <div key={p.id} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex items-center gap-4 relative">
                <div className="w-20 h-20 shrink-0 rounded-xl bg-gray-100 overflow-hidden border border-gray-200/50">
                  {p.img ? (
                    <MediaDisplay src={p.img} alt={p.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400"><ImageIcon size={20}/></div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0 pr-8">
                  <h3 className="font-bold text-gray-800 text-sm truncate mb-1">{p.name}</h3>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-gray-800 font-bold text-sm">₹{p.price}</span>
                    {p.mrp && <span className="text-xs text-gray-400 line-through">₹{p.mrp}</span>}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-[10px] uppercase font-bold tracking-wider">
                    <span className="font-mono text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded normal-case tracking-normal">ID: {p.id}</span>
                    {p.tag && <span className="text-[#C9A84C]">{p.tag}</span>}
                    {p.badge && <span className="text-white bg-[#C9A84C] px-1.5 py-0.5 rounded">{p.badge}</span>}
                  </div>
                </div>

                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <button title="Edit Product" onClick={() => { openEdit(p); }} className="p-2 text-blue-500 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors">
                    <Edit2 size={16} />
                  </button>
                  <button title="Duplicate Product" onClick={() => handleDuplicate(p)} className="p-2 text-green-500 bg-green-50 hover:bg-green-100 rounded-xl transition-colors">
                    <Copy size={16} />
                  </button>
                  <button title="Delete Product" onClick={() => handleDelete(p.id)} className="p-2 text-red-500 bg-red-50 hover:bg-red-100 rounded-xl transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 text-gray-500 text-sm border-b border-gray-100">
              <th className="p-4 font-semibold pl-6">Product</th>
              <th className="p-4 font-semibold">Sub-Category</th>
              <th className="p-4 font-semibold">Price</th>
              <th className="p-4 font-semibold">Status/Badge</th>
              <th className="p-4 font-semibold text-right pr-6">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading && products.length === 0 ? (
              <>
                <TableRowSkeleton />
                <TableRowSkeleton />
                <TableRowSkeleton />
                <TableRowSkeleton />
                <TableRowSkeleton />
              </>
            ) : (
              <>
                {filteredProducts.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50/30 transition-colors group">
                    <td className="p-4 pl-6 flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-gray-100 overflow-hidden border border-gray-200/50">
                        {p.img ? (
                          <MediaDisplay src={p.img} alt={p.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400"><ImageIcon size={20}/></div>
                        )}
                      </div>
                      <div>
                        <span className="font-bold text-gray-800 block">{p.name}</span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] font-mono text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">ID: {p.id}</span>
                          {p.tag && <span className="text-xs text-[#C9A84C] font-medium">{p.tag}</span>}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      {(() => {
                        const subs = Array.isArray(p.subcategories)
                          ? p.subcategories
                          : (typeof p.subcategories === 'string' && p.subcategories.startsWith('[')
                              ? (() => { try { return JSON.parse(p.subcategories); } catch { return []; } })()
                              : p.brand ? [p.brand] : []);
                        if (subs.length === 0) return <span className="text-gray-400">-</span>;
                        return (
                          <div className="flex flex-wrap gap-1">
                            {subs.map((s, i) => (
                              <span key={s} className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${i === 0 ? 'bg-[#C9A84C]/20 text-[#A8873A]' : 'bg-gray-100 text-gray-500'}`}>{s}</span>
                            ))}
                          </div>
                        );
                      })()}
                    </td>
                    <td className="p-4">
                      <span className="text-gray-800 font-bold block">₹{p.price}</span>
                      {p.mrp && <span className="text-xs text-gray-400 line-through">₹{p.mrp}</span>}
                    </td>
                    <td className="p-4">
                      {p.badge ? (
                        <span className="bg-[#F2EDE4] text-[#2C2C2C] px-3 py-1 rounded-lg text-xs font-bold">{p.badge}</span>
                      ) : (
                        <span className="text-gray-400 text-xs">-</span>
                      )}
                    </td>
                    <td className="p-4 pr-6">
                      <div className="flex items-center justify-end gap-2">
                        <button title="Edit Product" data-testid={`edit-btn-${p.id}`} onClick={() => { openEdit(p); }} className="p-2 text-blue-500 hover:bg-blue-100 rounded-xl transition-colors">
                          <Edit2 size={18} />
                        </button>
                        <button title="Duplicate Product" data-testid={`dup-btn-${p.id}`} onClick={() => handleDuplicate(p)} className="p-2 text-green-500 hover:bg-green-100 rounded-xl transition-colors">
                          <Copy size={18} />
                        </button>
                        <button title="Delete Product" data-testid={`del-btn-${p.id}`} onClick={() => handleDelete(p.id)} className="p-2 text-red-500 hover:bg-red-100 rounded-xl transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan="5" className="p-12 text-center">
                      <div className="inline-flex flex-col items-center justify-center text-gray-400">
                        <Package size={48} className="mb-4 text-gray-300" />
                        <p className="text-lg font-medium text-gray-500">No products found</p>
                        <p className="text-sm">Try adjusting your search or add a new product.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            )}
          </tbody>
          </table>
        </div>
      </div>
      </div>

      {/* Modal */}
      {isModalOpen && createPortal(
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[300] flex items-center justify-center p-4 animate-fade-in">
          <form id="productForm" onSubmit={handleSave} className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50/50">
              <h3 className="text-xl font-bold text-gray-800">{editing.id ? 'Edit Product' : 'Add New Product'}</h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className="w-8 h-8 flex items-center justify-center bg-white border rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="overflow-y-auto flex-1 p-6">
              <div className="space-y-6">
                
                {/* Image Preview Area */}
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex gap-6 items-center">
                  <div className="w-24 h-24 rounded-xl bg-white border shadow-sm flex items-center justify-center overflow-hidden shrink-0">
                    {editing.img ? (
                      <MediaDisplay src={editing.img} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon size={32} className="text-gray-300" />
                    )}
                  </div>
                  <div className="flex-1">
                    <label htmlFor="img" className="block text-sm font-bold text-gray-700 mb-1">Primary Image <span className="text-red-500">*</span></label>
                    <div className="flex gap-2">
                      <input id="img" type="url" placeholder="Paste URL here..." value={editing.img || ''} onChange={e => setEditing({...editing, img: e.target.value})} className="flex-1 p-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/20 focus:border-[#C9A84C] transition-all text-sm" />
                      <span className="text-sm text-gray-500 flex items-center">OR</span>
                      <label className={`relative overflow-hidden cursor-pointer ${isUploadingPrimary ? 'bg-gray-100 opacity-90' : 'bg-gray-100 hover:bg-gray-200'} px-4 py-2.5 rounded-xl border border-gray-200 flex items-center gap-2 text-sm font-medium transition-colors text-gray-700 z-0`}>
                        {isUploadingPrimary && (
                          <div 
                            className="absolute inset-0 bg-[#C9A84C]/20 transition-all duration-300 -z-10"
                            style={{ width: `${primaryProgress}%` }}
                          />
                        )}
                        {isUploadingPrimary ? <><Loader2 className="animate-spin text-[#C9A84C]" size={16} /> <span className="font-bold">{primaryProgress}%</span></> : 'Upload File'}
                        <input type="file" accept="image/*,video/*" className="hidden" disabled={isUploadingPrimary} onChange={async (e) => {
                            if (e.target.files && e.target.files[0]) {
                              setIsUploadingPrimary(true);
                              setPrimaryProgress(0);
                              try {
                                const base64 = await handleImageUpload(e.target.files[0], setPrimaryProgress);
                                setEditing({...editing, img: base64});
                              } catch(err) {
                                console.error("Upload failed", err);
                                alert("Image upload failed");
                              } finally {
                                setIsUploadingPrimary(false);
                                setPrimaryProgress(0);
                              }
                            }
                        }} />
                      </label>
                    </div>
                    <p className="text-xs text-amber-600 mt-2 font-medium flex items-center gap-1 bg-amber-50 p-2 rounded-lg border border-amber-100">
                      <span className="font-bold">📐 Recommended:</span> 400×400px (square) image or MP4 video. Max: 5MB
                    </p>
                  </div>
                </div>

                {/* Additional Images */}
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-3">
                  <label className="block text-sm font-bold text-gray-700">Additional Images (Gallery)</label>
                  <div className="flex gap-2">
                    <input 
                      type="url" 
                      placeholder="https://example.com/other-image.jpg" 
                      value={newImageUrl} 
                      onChange={e => setNewImageUrl(e.target.value)} 
                      className="flex-1 p-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/20 focus:border-[#C9A84C] transition-all text-sm" 
                    />
                    <button 
                      type="button"
                      onClick={() => {
                        if (newImageUrl && !(editing.images || []).includes(newImageUrl)) {
                          setEditing({ ...editing, images: [...(editing.images || []), newImageUrl] });
                          setNewImageUrl('');
                        }
                      }}
                      className="bg-[#C9A84C] text-white px-4 rounded-xl font-bold hover:bg-[#A8873A] transition-colors"
                    >
                      Add URL
                    </button>
                    <label className={`relative overflow-hidden cursor-pointer ${isUploadingGallery ? 'bg-gray-100 opacity-90' : 'bg-gray-100 hover:bg-gray-200'} px-4 py-2.5 rounded-xl border border-gray-200 flex items-center gap-2 text-sm font-medium transition-colors text-gray-700 z-0`}>
                      {isUploadingGallery && (
                        <div 
                          className="absolute inset-0 bg-[#C9A84C]/20 transition-all duration-300 -z-10"
                          style={{ width: `${galleryProgress}%` }}
                        />
                      )}
                      {isUploadingGallery ? <><Loader2 className="animate-spin text-[#C9A84C]" size={16} /> <span className="font-bold">{galleryProgress}%</span></> : 'Upload'}
                      <input type="file" accept="image/*,video/*" className="hidden" disabled={isUploadingGallery} onChange={async (e) => {
                          if (e.target.files && e.target.files[0]) {
                            setIsUploadingGallery(true);
                            setGalleryProgress(0);
                            try {
                              const base64 = await handleImageUpload(e.target.files[0], setGalleryProgress);
                              setEditing({ ...editing, images: [...(editing.images || []), base64] });
                            } catch(err) {
                              console.error("Upload failed", err);
                              alert("Image upload failed");
                            } finally {
                              setIsUploadingGallery(false);
                              setGalleryProgress(0);
                            }
                          }
                      }} />
                    </label>
                  </div>
                  {(editing.images && editing.images.length > 0) && (
                    <div className="flex flex-wrap gap-3 mt-3">
                      {editing.images.map((imgUrl, idx) => (
                        <div key={idx} className="relative w-16 h-16 rounded-xl border bg-white overflow-hidden group">
                          <MediaDisplay src={imgUrl} className="w-full h-full object-cover" alt="Additional" />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex flex-col">
                            <button 
                              type="button"
                              title="Set as Primary"
                              onClick={() => {
                                const newImages = [...editing.images];
                                newImages.splice(idx, 1);
                                if (editing.img) {
                                  newImages.push(editing.img); // move old primary to gallery
                                }
                                setEditing({ ...editing, img: imgUrl, images: newImages });
                              }}
                              className="flex-1 text-white flex items-center justify-center hover:bg-black/30 transition-colors pb-0"
                            >
                              <Star size={14} />
                            </button>
                            <button 
                              type="button" 
                              title="Remove"
                              onClick={() => setEditing({ ...editing, images: editing.images.filter((_, i) => i !== idx) })}
                              className="flex-1 text-white flex items-center justify-center hover:bg-black/30 transition-colors pt-0"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-1">Product Name <span className="text-red-500">*</span></label>
                    <input id="name" required type="text" placeholder="e.g. Custom Couple Portrait" value={editing.name || ''} onChange={e => setEditing({...editing, name: e.target.value})} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/20 focus:border-[#C9A84C] transition-all text-sm" />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="category" className="block text-sm font-bold text-gray-700 mb-1">Main Category <span className="text-red-500">*</span></label>
                    <select 
                      id="category" 
                      required 
                      value={editing.category || ''} 
                      onChange={e => setEditing({...editing, category: e.target.value})} 
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/20 focus:border-[#C9A84C] transition-all text-sm"
                    >
                      <option value="" disabled>Select the main category</option>
                      {categories.map(c => <option key={c.label} value={c.label}>{c.label}</option>)}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-bold text-gray-700">
                        Sub-Categories / Collections <span className="text-red-500">*</span>
                      </label>
                      {(editing.subcategories || []).length > 0 && (
                        <span className="text-xs font-bold text-[#C9A84C] bg-[#C9A84C]/10 px-2 py-0.5 rounded-full">
                          {(editing.subcategories || []).length} selected
                        </span>
                      )}
                    </div>

                    {/* Checkbox grid */}
                    <div className="border border-gray-200 rounded-xl p-3 bg-gray-50 max-h-44 overflow-y-auto space-y-1">
                      {availableSubCategories.length === 0 && (
                        <p className="text-xs text-gray-400 text-center py-2">Select a Main Category first to see sub-categories</p>
                      )}
                      {availableSubCategories.map(sub => {
                        const checked = (editing.subcategories || []).includes(sub);
                        return (
                          <label key={sub} className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors ${checked ? 'bg-[#C9A84C]/15 border border-[#C9A84C]/40' : 'hover:bg-gray-100 border border-transparent'}`}>
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => {
                                const current = editing.subcategories || [];
                                const updated = checked
                                  ? current.filter(s => s !== sub)
                                  : [...current, sub];
                                setEditing({ ...editing, subcategories: updated });
                              }}
                              className="w-4 h-4 accent-[#C9A84C] rounded"
                            />
                            <span className={`text-sm ${checked ? 'font-bold text-[#2C2C2C]' : 'text-gray-700'}`}>{sub}</span>
                            {checked && (editing.subcategories || [])[0] === sub && (
                              <span className="ml-auto text-[9px] font-black bg-[#C9A84C] text-white px-1.5 py-0.5 rounded-full uppercase tracking-wide">Primary</span>
                            )}
                          </label>
                        );
                      })}
                    </div>

                    {/* Add custom subcategory */}
                    <div className="flex gap-2 mt-2">
                      <input
                        type="text"
                        placeholder="+ Type a new sub-category and press Add"
                        className="flex-1 p-2 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/20 focus:border-[#C9A84C] transition-all"
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const val = e.target.value.trim();
                            if (val && !(editing.subcategories || []).includes(val)) {
                              setEditing({ ...editing, subcategories: [...(editing.subcategories || []), val] });
                            }
                            e.target.value = '';
                          }
                        }}
                        id="custom-sub-input"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const inp = document.getElementById('custom-sub-input');
                          const val = inp?.value.trim();
                          if (val && !(editing.subcategories || []).includes(val)) {
                            setEditing({ ...editing, subcategories: [...(editing.subcategories || []), val] });
                          }
                          if (inp) inp.value = '';
                        }}
                        className="px-3 py-2 bg-[#2C2C2C] hover:bg-[#C9A84C] text-[#C9A84C] hover:text-[#2C2C2C] border border-[#2C2C2C]/20 rounded-xl text-xs font-bold transition-colors whitespace-nowrap"
                      >
                        + Add
                      </button>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1">First checked = Primary (shown in filters). Product appears in ALL selected sub-categories.</p>
                  </div>

                  <div>
                    <label htmlFor="petType" className="block text-sm font-bold text-gray-700 mb-1">Art Medium <span className="text-red-500">*</span></label>
                    <div className="flex gap-2">
                      <input id="petType" list="medium-list" required type="text" placeholder="Select or type a custom one..." value={editing.petType || ''} onChange={e => setEditing({...editing, petType: e.target.value})} className="flex-1 p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/20 focus:border-[#C9A84C] transition-all text-sm" />
                      <datalist id="medium-list">
                        {uniqueMediums.map(m => <option key={m} value={m} />)}
                      </datalist>
                      <button 
                        type="button" 
                        onClick={() => {
                          const val = prompt('Enter new art medium:');
                          if (val) setEditing({...editing, petType: val});
                        }}
                        className="px-3 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 transition-colors whitespace-nowrap"
                      >
                        + Add
                      </button>
                    </div>
                  </div>



                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="price" className="block text-sm font-bold text-gray-700 mb-1">Selling Price <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₹</span>
                        <input id="price" required min="0" type="number" step="any" value={editing.price === 0 ? 0 : (editing.price || '')} onChange={e => setEditing({...editing, price: e.target.value})} className="w-full pl-7 p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/20 focus:border-[#C9A84C] transition-all text-sm" />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="mrp" className="block text-sm font-bold text-gray-700 mb-1">MRP <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₹</span>
                        <input id="mrp" required min="0" type="number" step="any" value={editing.mrp === 0 ? 0 : (editing.mrp || '')} onChange={e => setEditing({...editing, mrp: e.target.value})} className="w-full pl-7 p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/20 focus:border-[#C9A84C] transition-all text-sm" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                    <div className="flex justify-between items-center mb-3">
                      <label className="block text-sm font-bold text-gray-700">Custom Sizes & Rates (Optional)</label>
                      <div className="flex gap-2">
                        <button 
                          type="button"
                          onClick={() => {
                            const shoeSizes = [6, 7, 8, 9, 10, 11, 12];
                            const basePrice = editing.price || 0;
                            const newVariants = shoeSizes.map(size => `${size}|${basePrice}`).join('\n');
                            const current = editing.variants ? editing.variants + '\n' + newVariants : newVariants;
                            setEditing({...editing, variants: current});
                          }}
                          className="text-xs font-bold text-emerald-600 flex items-center gap-1 hover:bg-emerald-50 px-2 py-1 rounded"
                        >
                          <Plus size={14} /> Add Shoe Sizes
                        </button>
                        <button 
                          type="button"
                          onClick={() => {
                            const current = editing.variants ? editing.variants.split('\n').filter(Boolean) : [];
                            current.push('|');
                            setEditing({...editing, variants: current.join('\n')});
                          }}
                          className="text-xs font-bold text-[#C9A84C] flex items-center gap-1 hover:bg-[#C9A84C]/10 px-2 py-1 rounded"
                        >
                          <Plus size={14} /> Add Variant
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {(!editing.variants || editing.variants.trim() === '') ? (
                        <p className="text-xs text-gray-400 text-center py-3 border border-dashed border-gray-200 rounded-xl bg-white italic">No variants added yet. Click 'Add Variant' to add sizes.</p>
                      ) : (
                        editing.variants.split('\n').map((line, idx) => {
                          // Ignore empty lines if any managed to slip through during rendering
                          const [size = '', price = ''] = line.split('|');
                          return (
                            <div key={idx} className="flex gap-2 items-center">
                              <input 
                                type="text" 
                                placeholder='Size (e.g. 12" x 3")' 
                                value={size}
                                onChange={e => {
                                  const lines = editing.variants.split('\n');
                                  lines[idx] = `${e.target.value}|${price}`;
                                  setEditing({...editing, variants: lines.join('\n')});
                                }}
                                className="flex-1 p-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/20 focus:border-[#C9A84C] text-sm"
                              />
                              <input 
                                type="number" 
                                placeholder="Rate (₹)" 
                                value={price}
                                onChange={e => {
                                  const lines = editing.variants.split('\n');
                                  lines[idx] = `${size}|${e.target.value}`;
                                  setEditing({...editing, variants: lines.join('\n')});
                                }}
                                className="w-24 p-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/20 focus:border-[#C9A84C] text-sm"
                              />
                              <button 
                                type="button"
                                onClick={() => {
                                  const lines = editing.variants.split('\n');
                                  lines.splice(idx, 1);
                                  setEditing({...editing, variants: lines.join('\n')});
                                }}
                                className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Remove Variant"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Highlight Tag</label>
                    <input type="text" placeholder="e.g. 20% OFF" value={editing.tag || ''} onChange={e => setEditing({...editing, tag: e.target.value})} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/20 focus:border-[#C9A84C] transition-all text-sm" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Status Badge</label>
                    <input type="text" placeholder="e.g. ✨ Bestseller" value={editing.badge || ''} onChange={e => setEditing({...editing, badge: e.target.value})} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/20 focus:border-[#C9A84C] transition-all text-sm" />
                  </div>

                  <div className="md:col-span-2 mt-4">
                    <h3 className="text-sm font-bold text-gray-700 mb-3 border-b border-gray-200 pb-2">Product Details Tabs (Optional)</h3>
                    
                    <div className="space-y-4">
                      <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm space-y-3">
                        <div className="flex gap-3">
                          <div className="flex-1">
                            <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-wider">Tab 1 Name</label>
                            <input type="text" placeholder="Description" value={editing.tab1Name || ''} onChange={e => setEditing({...editing, tab1Name: e.target.value})} className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/20 focus:border-[#C9A84C] transition-all text-sm font-bold text-gray-700" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-600 mb-1">Description Content</label>
                          <textarea placeholder="Main description paragraph..." value={editing.description || ''} onChange={e => setEditing({...editing, description: e.target.value})} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/20 focus:border-[#C9A84C] transition-all text-sm min-h-[60px]" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-600 mb-1">Features/Bullets - One per line</label>
                          <textarea placeholder="Custom made to order&#10;Durable & Long-lasting" value={editing.features || ''} onChange={e => setEditing({...editing, features: e.target.value})} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/20 focus:border-[#C9A84C] transition-all text-sm min-h-[60px]" />
                        </div>
                      </div>
                      
                      <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm space-y-3">
                        <div className="flex gap-3">
                          <div className="flex-1">
                            <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-wider">Tab 2 Name</label>
                            <input type="text" placeholder="Customization Options" value={editing.tab2Name || ''} onChange={e => setEditing({...editing, tab2Name: e.target.value})} className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/20 focus:border-[#C9A84C] transition-all text-sm font-bold text-gray-700" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-600 mb-1">Tab 2 Content</label>
                          <textarea placeholder="Leave blank to use default..." value={editing.customization || ''} onChange={e => setEditing({...editing, customization: e.target.value})} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/20 focus:border-[#C9A84C] transition-all text-sm min-h-[60px]" />
                        </div>
                      </div>

                      <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm space-y-3">
                        <div className="flex gap-3">
                          <div className="flex-1">
                            <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-wider">Tab 3 Name</label>
                            <input type="text" placeholder="Quality Guarantee" value={editing.tab3Name || ''} onChange={e => setEditing({...editing, tab3Name: e.target.value})} className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/20 focus:border-[#C9A84C] transition-all text-sm font-bold text-gray-700" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-600 mb-1">Tab 3 Content</label>
                          <textarea placeholder="Leave blank to use default..." value={editing.quality || ''} onChange={e => setEditing({...editing, quality: e.target.value})} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/20 focus:border-[#C9A84C] transition-all text-sm min-h-[60px]" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t bg-gray-50/50 flex justify-end gap-3">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 border border-gray-200 bg-white rounded-xl hover:bg-gray-50 font-bold text-gray-600 transition-colors">Cancel</button>
              <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 bg-[#C9A84C] hover:bg-[#A8873A] text-white rounded-xl font-bold shadow-lg shadow-[#C9A84C]/20 transition-all hover:-translate-y-0.5 flex items-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0">
                {isSubmitting ? <><Loader2 className="animate-spin" size={16} /> Saving...</> : editing.id ? 'Save Changes' : 'Create Product'}
              </button>
            </div>
          </form>
        </div>
      , document.body)}
    </>
  );
}

export default function AdminProducts() {
  const [tab, setTab] = useState('products');
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex space-x-2 bg-gray-100 p-1 rounded-xl w-fit">
        <button 
          className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${tab === 'products' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-500 hover:text-gray-700'}`} 
          onClick={() => setTab('products')}
        >
          Art Catalogue (Products)
        </button>
        <button 
          className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${tab === 'categories' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-500 hover:text-gray-700'}`} 
          onClick={() => setTab('categories')}
        >
          Art Categories (Folders)
        </button>
      </div>
      {tab === 'products' ? <AdminProductsContent /> : <AdminCategories />}
    </div>
  );
}
