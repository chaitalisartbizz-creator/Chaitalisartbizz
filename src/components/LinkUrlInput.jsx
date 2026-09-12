import React, { useState } from 'react';
import { Search, Link as LinkIcon, ChevronDown } from 'lucide-react';
import { useData } from '../context/DataContext';
import { encodeUrlParam } from '../utils/urlEncoder';

export default function LinkUrlInput({ value, onChange, placeholder = "e.g., /category?c=Resin%20Art or /product/123", className = "" }) {
  const { categories, products } = useData();
  const [showDropdown, setShowDropdown] = useState(false);

  // Group products by category
  const productsByCategory = React.useMemo(() => {
    const grouped = {};
    if (products) {
      products.forEach(p => {
        if (!grouped[p.category]) grouped[p.category] = [];
        grouped[p.category].push(p);
      });
    }
    return grouped;
  }, [products]);

  return (
    <div className="relative">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={`w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-[#C9A84C] ${className}`}
          />
        </div>
        <button
          type="button"
          onClick={() => setShowDropdown(!showDropdown)}
          className="px-3 py-2 bg-stone-100 border border-stone-200 rounded-lg hover:bg-stone-200 text-stone-600 transition-colors flex items-center gap-1"
          title="Browse available links"
        >
          <Search className="w-4 h-4" />
          <ChevronDown className="w-3 h-3" />
        </button>
      </div>

      {showDropdown && (
        <div className="absolute top-full right-0 mt-2 w-72 bg-white border border-stone-200 rounded-xl shadow-xl z-50 max-h-[400px] overflow-y-auto">
          <div className="p-2 space-y-4">
            
            {/* Quick Links */}
            <div>
              <div className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2 px-2">Pages</div>
              <div className="space-y-1">
                {['/', '/category', '/offers', '/cart'].map(path => (
                  <button
                    key={path}
                    onClick={() => { onChange(path); setShowDropdown(false); }}
                    className="w-full text-left px-3 py-1.5 text-sm text-stone-600 hover:bg-stone-50 rounded-lg transition-colors"
                  >
                    {path}
                  </button>
                ))}
              </div>
            </div>

            {/* Categories */}
            {categories?.length > 0 && (
              <div>
                <div className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2 px-2">Categories</div>
                <div className="space-y-1">
                  {categories.map(c => (
                    <React.Fragment key={c.id}>
                      <button
                        onClick={() => { onChange(`/category?c=${encodeUrlParam(c.label)}`); setShowDropdown(false); }}
                        className="w-full text-left px-3 py-1.5 text-sm font-medium text-[#C9A84C] hover:bg-[#C9A84C]/5 rounded-lg transition-colors"
                      >
                        {c.label}
                      </button>
                      {c.sub && c.sub.split(',').map(sub => sub.trim()).filter(Boolean).map(sub => (
                        <button
                          key={`sub-${c.id}-${sub}`}
                          onClick={() => { onChange(`/category?c=${encodeUrlParam(c.label)}&s=${encodeUrlParam(sub)}`); setShowDropdown(false); }}
                          className="w-full text-left pl-6 pr-3 py-1.5 text-xs text-stone-500 hover:bg-stone-50 rounded-lg transition-colors"
                        >
                          ↳ {sub}
                        </button>
                      ))}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}

            {/* Products */}
            {products?.length > 0 && (
              <div>
                <div className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2 px-2">Products</div>
                <div className="space-y-1">
                  {products.map(p => (
                    <button
                      key={`prod-${p.id}`}
                      onClick={() => { onChange(`/product/${p.id}`); setShowDropdown(false); }}
                      className="w-full text-left px-3 py-1.5 text-sm text-stone-600 hover:bg-stone-50 rounded-lg transition-colors truncate"
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
