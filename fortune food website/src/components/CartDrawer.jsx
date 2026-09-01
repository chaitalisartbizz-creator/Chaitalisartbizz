import React, { useState } from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Tag, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import CheckoutModal from './CheckoutModal';

export default function CartDrawer() {
  const {
    cartOpen, setCartOpen,
    cartItems, cartTotal, cartCount,
    removeFromCart, updateQty, clearCart,
  } = useCart();
  const navigate = useNavigate();
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const savings = cartItems.reduce((s, i) => s + (i.mrp - i.price) * i.qty, 0);
  const freeShippingTarget = 999;
  const isFreeDelivery = cartTotal >= freeShippingTarget;

  if (!cartOpen && !checkoutOpen) return null;

  const handleOrderSuccess = (orderId) => {
    setCheckoutOpen(false);
    setCartOpen(false);
    clearCart();
  };

  return (
    <>
      {/* Cart Drawer */}
      {cartOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-[90]"
            onClick={() => setCartOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="fixed top-0 right-0 h-full w-full max-w-sm md:max-w-md bg-white z-[100] flex flex-col shadow-2xl border-l border-amber-200"
            style={{ animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}>

            {/* Header */}
            <div className="bg-gradient-to-r from-[#5c3110] via-[#d97706] to-[#b45309] px-5 py-4 flex items-center justify-between flex-shrink-0 shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 border border-amber-300/40 flex items-center justify-center">
                  <ShoppingBag size={20} className="text-amber-300" />
                </div>
                <div>
                  <p className="text-amber-50 font-cinzel font-bold text-lg leading-tight">My Fortune Cart</p>
                  <p className="text-amber-200 text-xs font-semibold">{cartCount} item{cartCount !== 1 ? 's' : ''} • Purity Guaranteed</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {cartItems.length > 0 && (
                  <button onClick={clearCart}
                    className="text-amber-200 text-xs font-bold hover:text-white transition-colors border border-amber-300/40 px-2.5 py-1 rounded-full">
                    Clear All
                  </button>
                )}
                <button onClick={() => setCartOpen(false)}
                  className="bg-black/20 rounded-full p-1.5 hover:bg-black/40 transition-colors">
                  <X size={18} className="text-amber-100" />
                </button>
              </div>
            </div>

            {/* Free Shipping Progress Indicator */}
            <div className="bg-amber-50 border-b border-amber-200/80 px-5 py-3">
              <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                <span className="text-amber-900 flex items-center gap-1">
                  <ShieldCheck size={14} className="text-amber-700" /> Express Farm Shipping
                </span>
                <span className={isFreeDelivery ? 'text-emerald-700' : 'text-amber-800'}>
                  {isFreeDelivery ? '🎉 FREE SHIPPING UNLOCKED!' : `Add ₹${freeShippingTarget - cartTotal} more`}
                </span>
              </div>
              <div className="h-2 w-full bg-amber-200/80 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-amber-500 to-emerald-600 transition-all duration-300"
                  style={{ width: `${Math.min(100, (cartTotal / freeShippingTarget) * 100)}%` }}
                />
              </div>
            </div>

            {/* Items list */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-16 px-4">
                  <div className="w-20 h-20 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-4xl mb-4 shadow-inner">
                    🌰
                  </div>
                  <p className="text-stone-800 font-cinzel font-bold text-lg">Your cart is empty!</p>
                  <p className="text-stone-500 text-xs mt-1 max-w-xs">Explore our Kashmiri saffron, jumbo almonds, organic spices & festive hampers.</p>
                  <button
                    onClick={() => { setCartOpen(false); navigate('/category'); }}
                    className="mt-6 bg-gradient-to-r from-[#5c3110] to-[#d97706] text-amber-100 font-bold text-sm px-7 py-3 rounded-xl hover:from-[#3b1c06] hover:to-[#b45309] transition-all shadow-md flex items-center gap-2">
                    <ShoppingBag size={16} /> Discover Organic Harvest
                  </button>
                </div>
              ) : (
                cartItems.map(item => (
                  <div key={item.id}
                    className="bg-white rounded-2xl border border-amber-100 p-3 flex items-center gap-3 shadow-sm hover:border-amber-300 transition-all">
                    {/* Product Image */}
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-amber-50 flex-shrink-0 border border-amber-200 p-0.5">
                      <img src={item.img} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] text-[#d97706] font-bold uppercase tracking-wider">{item.brand || 'Fortune Food'}</p>
                        {item.selectedWeight && (
                          <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-1.5 py-0.5 rounded">
                            {item.selectedWeight}
                          </span>
                        )}
                      </div>
                      <p className="text-stone-800 text-xs font-bold leading-snug line-clamp-2 mt-0.5">{item.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-stone-900 font-black text-sm">₹{item.price}</span>
                        {item.mrp && <span className="text-stone-400 text-[10px] line-through">₹{item.mrp}</span>}
                        {item.tag && <span className="text-emerald-700 text-[9px] font-bold bg-emerald-50 px-1.5 py-0.5 rounded">{item.tag}</span>}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center border border-amber-200 rounded-lg overflow-hidden bg-amber-50/50">
                          <button onClick={() => updateQty(item.id, -1)}
                            className="w-6 h-6 flex items-center justify-center hover:bg-amber-200 text-stone-700 transition-colors">
                            <Minus size={11} />
                          </button>
                          <span className="w-7 text-center text-xs font-bold text-stone-800">{item.qty}</span>
                          <button onClick={() => updateQty(item.id, 1)}
                            className="w-6 h-6 flex items-center justify-center hover:bg-amber-200 text-[#d97706] transition-colors">
                            <Plus size={11} />
                          </button>
                        </div>
                        <span className="text-stone-500 text-xs">= <span className="font-bold text-stone-800">₹{item.price * item.qty}</span></span>
                        <button onClick={() => removeFromCart(item.id)}
                          className="ml-auto p-1.5 rounded-lg hover:bg-red-50 hover:text-red-600 text-stone-300 transition-colors">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary & Checkout */}
            {cartItems.length > 0 && (
              <div className="flex-shrink-0 border-t border-amber-200 bg-amber-50/40 px-5 py-4 space-y-3">
                {savings > 0 && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2 flex items-center gap-2">
                    <span className="text-emerald-600 text-sm">✨</span>
                    <p className="text-emerald-800 text-xs font-bold">
                      Organic Purity Savings: <span className="font-black">₹{savings}</span>
                    </p>
                  </div>
                )}

                <div className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-600">Subtotal ({cartCount} items)</span>
                    <span className="text-stone-800 font-bold">₹{cartTotal}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-600">Express Delivery</span>
                    <span className={isFreeDelivery ? 'text-emerald-700 font-bold' : 'text-stone-800 font-semibold'}>
                      {isFreeDelivery ? 'FREE 🎉' : '₹79'}
                    </span>
                  </div>
                  <div className="border-t border-amber-200 pt-2 flex justify-between">
                    <span className="text-stone-900 font-bold font-cinzel">Grand Total</span>
                    <span className="text-[#5c3110] font-black text-xl">
                      ₹{cartTotal + (isFreeDelivery ? 0 : 79)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => { setCheckoutOpen(true); setCartOpen(false); }}
                  className="w-full bg-gradient-to-r from-[#5c3110] via-[#d97706] to-[#b45309] text-amber-50 font-bold text-sm py-3.5 rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all flex items-center justify-center gap-2">
                  Proceed to Secure Checkout <ArrowRight size={16} />
                </button>
                <button onClick={() => setCartOpen(false)}
                  className="w-full text-stone-500 text-xs font-bold py-1 hover:text-[#d97706] transition-colors">
                  Continue Shopping
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        cartItems={cartItems}
        cartTotal={cartTotal + (isFreeDelivery ? 0 : 79)}
        onOrderSuccess={handleOrderSuccess}
      />

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);   opacity: 1; }
        }
      `}</style>
    </>
  );
}
