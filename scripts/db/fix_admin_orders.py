import re

with open('src/pages/admin/AdminOrders.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

mobile_view = '''              <div>
                {/* Mobile View */}
                <div className="block lg:hidden space-y-4">
                  {filteredOrders.length === 0 ? (
                    <div className="py-12 text-center bg-gray-50/50 rounded-2xl border border-gray-100">
                      <div className="inline-flex flex-col items-center gap-3 text-gray-400">
                        <Package size={42} className="text-gray-200" />
                        <p className="text-base font-bold text-gray-500">No orders found</p>
                      </div>
                    </div>
                  ) : (
                    filteredOrders.map(order => {
                      const isExpanded   = expandedRow === order.id;
                      const itemList     = parseItems(order.items);
                      const itemCount    = itemList.length || order.itemCount || '-';
                      const orderTotal   = order.total || order.totalAmount || 0;
                      const customerName = order.customerName || order.name || '-';
                      const phone        = order.phone || order.customerPhone || '-';
                      const payMethod    = order.paymentMethod || order.payment || '-';
                      const payStatus    = order.paymentStatus || 'PENDING';
                      const ordStatus    = order.status || 'PENDING';
                      const shortId      = String(order.id).slice(-6).toUpperCase();

                      return (
                        <div key={order.id} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                          <div className="flex items-center justify-between mb-3 border-b border-gray-50 pb-3">
                            <span className="font-mono font-bold text-gray-700 text-sm">#{shortId}</span>
                            <span className="text-xs text-gray-500 font-medium">{formatDate(order.createdAt)}</span>
                          </div>
                          
                          <div className="space-y-2 mb-4">
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-gray-500 flex items-center gap-1"><User size={14}/> {customerName}</span>
                              <span className="font-bold text-gray-800 flex items-center gap-1"><IndianRupee size={12} /> {orderTotal}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-gray-500 flex items-center gap-1"><Phone size={14}/> {phone}</span>
                              <span className="text-gray-600 font-medium">{itemCount} items</span>
                            </div>
                          </div>

                          <div className="flex gap-2 mb-4 flex-wrap">
                            <select
                              value={ordStatus}
                              onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                              className={\	ext-xs font-bold px-2.5 py-1.5 rounded-lg border-0 appearance-none pr-8 cursor-pointer relative \\}
                              style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2214%22%20height%3D%2214%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 6px center' }}
                            >
                              {ORDER_STATUSES.map(s => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                            
                            <select
                              value={payStatus}
                              onChange={(e) => updatePaymentStatus(order.id, e.target.value)}
                              className={\	ext-xs font-bold px-2.5 py-1.5 rounded-lg border-0 appearance-none pr-8 cursor-pointer relative \\}
                              style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2214%22%20height%3D%2214%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 6px center' }}
                            >
                              {['PENDING', 'PAID', 'FAILED'].map(s => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                            <span className="bg-gray-100 text-gray-600 text-xs px-2.5 py-1.5 rounded-lg font-bold">{payMethod}</span>
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => toggleExpand(order.id)}
                              className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-600 text-sm font-bold py-2 rounded-xl transition-colors flex items-center justify-center gap-1"
                            >
                              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />} Items
                            </button>
                            <button
                              onClick={() => deleteOrder(order.id)}
                              className="w-10 h-10 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl flex items-center justify-center transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>

                          {isExpanded && (
                            <div className="mt-4 bg-gray-50 rounded-xl p-3 space-y-3">
                              {itemList.length > 0 ? itemList.map((itm, i) => (
                                <div key={i} className="flex gap-3">
                                  {itm.img ? (
                                    <div className="w-12 h-12 rounded-lg bg-gray-200 overflow-hidden shrink-0">
                                      <img src={itm.img} alt={itm.name} className="w-full h-full object-cover" />
                                    </div>
                                  ) : (
                                    <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center text-gray-400 shrink-0">
                                      <ShoppingBag size={20} />
                                    </div>
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-gray-700 truncate">{itm.name || 'Unknown Item'}</p>
                                    <div className="flex gap-3 mt-1 text-xs text-gray-500">
                                      <span>Qty: {itm.quantity || 1}</span>
                                      <span className="font-medium text-gray-700">₹{itm.price || 0}</span>
                                    </div>
                                  </div>
                                </div>
                              )) : (
                                <p className="text-sm text-gray-500 text-center py-2">No item details available.</p>
                              )}
                              {order.address && (
                                <div className="pt-3 border-t border-gray-200">
                                  <p className="text-xs font-bold text-gray-500 mb-1">Shipping Address</p>
                                  <p className="text-sm text-gray-700 leading-tight whitespace-pre-line">{order.address}</p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Desktop View */}
                <div className="hidden lg:block overflow-x-auto">
'''

target = "              <div className=\"overflow-x-auto\">\n"

new_content = content.replace(target, mobile_view)
new_content = new_content.replace('</table', '</table\n              ></div>\n            </div>')

with open('src/pages/admin/AdminOrders.jsx', 'w', encoding='utf-8') as f:
    f.write(new_content)
