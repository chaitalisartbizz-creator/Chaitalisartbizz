import React, { forwardRef } from 'react';

const InvoiceTemplate = forwardRef(({ order, frontendSettings }, ref) => {
  if (!order) return null;

  const shortId = String(order.id).slice(-6).toUpperCase();
  const itemList = Array.isArray(order.items) 
    ? order.items 
    : (typeof order.items === 'string' ? JSON.parse(order.items || '[]') : []);

  const total = Number(order.total || order.totalAmount || 0);
  const dateObj = new Date(order.createdAt || order.date || Date.now());
  const formattedDate = dateObj.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  return (
    <div ref={ref} className="bg-white text-stone-800 font-sans" style={{ width: '800px', minHeight: '1000px', padding: '40px', boxSizing: 'border-box' }}>
      {/* Header */}
      <div className="flex justify-between items-start border-b-2 border-[#C9A84C] pb-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center overflow-hidden border border-[#C9A84C]">
            <img src="/logo.jpg" alt="Logo" className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-widest text-stone-900" style={{ fontFamily: 'Cinzel, serif' }}>CHAITALI'S ARTBIZZ</h1>
            <p className="text-sm text-[#A8873A] font-bold tracking-widest uppercase mt-1">Premium Handcrafted Art</p>
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-4xl font-black text-stone-200 uppercase tracking-widest mb-2">Invoice</h2>
          <p className="text-sm text-stone-500"><span className="font-bold text-stone-700">Invoice No:</span> #{shortId}</p>
          <p className="text-sm text-stone-500"><span className="font-bold text-stone-700">Date:</span> {formattedDate}</p>
        </div>
      </div>

      {/* Billing Info */}
      <div className="flex justify-between mb-10">
        <div className="w-1/2 pr-4">
          <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">Billed To</h3>
          <p className="text-lg font-bold text-stone-800 mb-1">{order.customerName || order.name || 'Customer'}</p>
          <p className="text-sm text-stone-600 mb-1">{order.phone || order.customerPhone || 'N/A'}</p>
          <p className="text-sm text-stone-600 leading-relaxed whitespace-pre-line">{order.address || order.deliveryAddress || 'No Address Provided'}</p>
        </div>
        <div className="w-1/2 pl-4 text-right">
          <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">Payment Details</h3>
          <p className="text-sm text-stone-600 mb-1"><span className="font-bold text-stone-700">Method:</span> {order.paymentMethod || order.payment || 'COD'}</p>
          <p className="text-sm text-stone-600 mb-1"><span className="font-bold text-stone-700">Status:</span> <span className={order.paymentStatus === 'PAID' ? 'text-green-600 font-bold' : 'text-stone-600'}>{order.paymentStatus || 'PENDING'}</span></p>
          <p className="text-sm text-stone-600"><span className="font-bold text-stone-700">Order Status:</span> {order.status || 'PENDING'}</p>
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-10">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-stone-50 text-stone-500 text-xs uppercase tracking-wider">
              <th className="px-4 py-3 font-bold rounded-l-lg border-y border-l border-stone-200">Item Description</th>
              <th className="px-4 py-3 font-bold text-center border-y border-stone-200">Weight/Variant</th>
              <th className="px-4 py-3 font-bold text-center border-y border-stone-200">Qty</th>
              <th className="px-4 py-3 font-bold text-right rounded-r-lg border-y border-r border-stone-200">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {itemList.map((itm, i) => (
              <tr key={i} className="group">
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    {itm.img && (
                      <div className="w-10 h-10 rounded-md bg-stone-100 overflow-hidden flex-shrink-0 border border-stone-200">
                        <img src={itm.img} alt={itm.name} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <p className="text-sm font-bold text-stone-700">{itm.name || 'Unknown Item'}</p>
                  </div>
                </td>
                <td className="px-4 py-4 text-center text-sm text-stone-600">
                  {itm.selectedWeight || '-'}
                </td>
                <td className="px-4 py-4 text-center text-sm font-bold text-stone-700">
                  {itm.quantity || 1}
                </td>
                <td className="px-4 py-4 text-right text-sm font-bold text-stone-800">
                  ₹{(Number(itm.price) || 0) * (Number(itm.quantity) || 1)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex justify-end mb-16">
        <div className="w-64 bg-stone-50 rounded-xl p-4 border border-stone-200">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-stone-500 font-bold">Subtotal</span>
            <span className="text-sm font-bold text-stone-700">₹{total}</span>
          </div>
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-stone-500 font-bold">Shipping</span>
            <span className="text-sm font-bold text-green-600">Free</span>
          </div>
          <div className="flex justify-between items-center pt-3 border-t border-stone-200">
            <span className="text-base text-stone-800 font-black uppercase">Total</span>
            <span className="text-xl font-black text-[#C9A84C]">₹{total}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto pt-8 border-t-2 border-stone-100 flex flex-col items-center">
        <h4 className="text-[#A8873A] font-bold text-lg mb-2" style={{ fontFamily: 'Cinzel, serif' }}>Thank you for your order!</h4>
        <p className="text-xs text-stone-500 mb-6 text-center max-w-md">We appreciate your support for handcrafted art. Each piece is made with love and precision.</p>
        
        <div className="flex items-center gap-8 text-sm text-stone-600 font-medium">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#C9A84C]"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            {frontendSettings?.supportPhone || '+91 97640 30635'}
          </div>
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#C9A84C]"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            @chaitalisartbizz
          </div>
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#C9A84C]"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
            chaitalisartbizzz.vercel.app
          </div>
        </div>
      </div>
    </div>
  );
});

InvoiceTemplate.displayName = 'InvoiceTemplate';
export default InvoiceTemplate;
