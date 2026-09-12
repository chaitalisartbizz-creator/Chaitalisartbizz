const fs = require('fs');
const file = 'src/pages/admin/AdminProducts.jsx';
let content = fs.readFileSync(file, 'utf8');

// I will find the exact spot and replace it.
const searchBlock = `                    {/* Checkbox grid */}
                    <div className="border border-gray-200 rounded-xl p-3 bg-gray-50 max-h-44 overflow-y-auto space-y-1">
                      })}
                    </div>`;

const newBlock = `                    {/* Checkbox grid */}
                    <div className="border border-gray-200 rounded-xl p-3 bg-gray-50 max-h-44 overflow-y-auto space-y-1">
                      {allStoreSubCategories.length === 0 && (
                        <p className="text-xs text-gray-400 text-center py-2">No sub-categories found.</p>
                      )}
                      {allStoreSubCategories.map(sub => {
                        const checked = (editing.subcategories || []).includes(sub);
                        return (
                          <label key={sub} className={\`flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors \${checked ? 'bg-[#C9A84C]/15 border border-[#C9A84C]/40' : 'hover:bg-gray-100 border border-transparent'}\`}>
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
                            <span className={\`text-sm \${checked ? 'font-bold text-[#2C2C2C]' : 'text-gray-700'}\`}>{sub}</span>
                            {checked && (editing.subcategories || [])[0] === sub && (
                              <span className="ml-auto text-[9px] font-black bg-[#C9A84C] text-white px-1.5 py-0.5 rounded-full uppercase tracking-wide">Primary</span>
                            )}
                          </label>
                        );
                      })}
                    </div>`;

content = content.replace(searchBlock, newBlock);

fs.writeFileSync(file, content);
console.log('Fixed checkbox grid');
