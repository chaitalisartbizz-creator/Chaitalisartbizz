import React from 'react';
import { useData } from '../context/DataContext';

export default function LinkUrlInput({ value, onChange, placeholder = "e.g., /category?category=Resin%20Art or /product/123", className = "" }) {
  const { products, categories } = useData();

  // Create a unique ID for the datalist based on component instance
  const datalistId = React.useMemo(() => `links-${Math.random().toString(36).substring(2, 9)}`, []);

  return (
    <>
      <input 
        type="text" 
        list={datalistId}
        placeholder={placeholder} 
        value={value || ''} 
        onChange={e => onChange(e.target.value)} 
        className={className || "w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/20 focus:border-[#C9A84C] transition-all text-sm font-mono"} 
      />
      <datalist id={datalistId}>
        {categories?.map(c => {
          const cSubs = [...new Set([
            ...(c.sub ? c.sub.split(',').map(s => s.trim()).filter(Boolean) : []),
            ...(products?.filter(p => p.category === c.label).map(p => p.brand).filter(Boolean) || [])
          ])];
          return (
            <React.Fragment key={`cat-frag-${c.id}`}>
              <option value={`/category?category=${encodeURIComponent(c.label)}`}>Category: {c.label}</option>
              {cSubs.map(sub => (
                <option key={`sub-${c.id}-${sub}`} value={`/category?category=${encodeURIComponent(c.label)}&subcategory=${encodeURIComponent(sub)}`}>
                  Sub-category: {c.label} &gt; {sub}
                </option>
              ))}
            </React.Fragment>
          );
        })}
        {products?.map(p => (
          <option key={`prod-${p.id}`} value={`/product/${p.id}`}>Product: {p.name}</option>
        ))}
      </datalist>
    </>
  );
}
