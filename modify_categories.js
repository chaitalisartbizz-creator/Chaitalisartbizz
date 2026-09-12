const fs = require('fs');
const file = 'src/pages/admin/AdminCategories.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add products to useData
content = content.replace(
  'const { categories, refreshData } = useData();',
  'const { categories, products, refreshData } = useData();'
);

// 2. Add allStoreSubCategories memo
const memoCode = `
  const allStoreSubCategories = React.useMemo(() => {
    let allSubs = [];
    (categories || []).forEach(c => {
      if (c.sub) {
        allSubs.push(...c.sub.split(',').map(s => s.trim()).filter(Boolean));
      }
    });
    (products || []).forEach(p => {
      if (p.subcategories && p.subcategories.length > 0) allSubs.push(...p.subcategories);
      else if (p.brand) allSubs.push(p.brand);
    });
    return [...new Set(allSubs)].sort();
  }, [categories, products]);
`;
content = content.replace(
  'const defaultCategory = {',
  memoCode + '\n  const defaultCategory = {'
);

// 3. Replace the sub-categories input with the checklist UI
const oldSubInput = `                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Sub-categories</label>
                      <input type="text" placeholder="e.g. Shirts, t-shirts, scarves" value={editing.sub || ''} onChange={e => setEditing({...editing, sub: e.target.value})} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/20 focus:border-[#C9A84C] transition-all text-sm" />
                      <p className="text-xs text-gray-500 mt-1">Comma-separated list of items under this category.</p>
                    </div>`;

const newSubInput = `                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Sub-categories</label>
                      <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 max-h-48 overflow-y-auto">
                        <div className="grid grid-cols-2 gap-2">
                          {allStoreSubCategories.map(sub => {
                            const isChecked = (editing.sub || '').split(',').map(s => s.trim()).filter(Boolean).includes(sub);
                            return (
                              <label key={sub} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-100 p-1.5 rounded transition-colors">
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={(e) => {
                                    let current = (editing.sub || '').split(',').map(s => s.trim()).filter(Boolean);
                                    if (e.target.checked) {
                                      current.push(sub);
                                    } else {
                                      current = current.filter(s => s !== sub);
                                    }
                                    setEditing({...editing, sub: current.join(', ')});
                                  }}
                                  className="w-4 h-4 text-[#C9A84C] border-gray-300 rounded focus:ring-[#C9A84C]"
                                />
                                {sub}
                              </label>
                            );
                          })}
                        </div>
                        {allStoreSubCategories.length === 0 && (
                          <p className="text-sm text-gray-400 italic">No existing sub-categories found.</p>
                        )}
                      </div>
                      
                      {/* Add custom subcategory */}
                      <div className="flex gap-2 mt-2">
                        <input
                          type="text"
                          placeholder="+ Type a brand new sub-category"
                          className="flex-1 p-2 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/20 focus:border-[#C9A84C] transition-all"
                          onKeyDown={e => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              const val = e.target.value.trim();
                              let current = (editing.sub || '').split(',').map(s => s.trim()).filter(Boolean);
                              if (val && !current.includes(val)) {
                                current.push(val);
                                setEditing({ ...editing, sub: current.join(', ') });
                              }
                              e.target.value = '';
                            }
                          }}
                          id="cat-custom-sub-input"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const inp = document.getElementById('cat-custom-sub-input');
                            const val = inp?.value.trim();
                            let current = (editing.sub || '').split(',').map(s => s.trim()).filter(Boolean);
                            if (val && !current.includes(val)) {
                              current.push(val);
                              setEditing({ ...editing, sub: current.join(', ') });
                            }
                            if (inp) inp.value = '';
                          }}
                          className="px-3 py-2 bg-[#2C2C2C] hover:bg-[#C9A84C] text-[#C9A84C] hover:text-[#2C2C2C] border border-[#2C2C2C]/20 rounded-xl text-xs font-bold transition-colors whitespace-nowrap"
                        >
                          + Add
                        </button>
                      </div>
                      <p className="text-[10px] text-gray-400 mt-1">Select existing sub-categories from your store, or create new ones.</p>
                    </div>`;

content = content.replace(oldSubInput, newSubInput);

fs.writeFileSync(file, content);
console.log('Done modifying AdminCategories.jsx');
