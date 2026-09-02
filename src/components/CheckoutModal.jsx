import React, { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, ArrowRight, ArrowLeft, CheckCircle2, MapPin, Phone, User, Package, Truck, ChevronDown, ChevronUp, ShieldCheck, Mail } from 'lucide-react';
import axios from 'axios';
import { useData } from '../context/DataContext';

const DELIVERY_THRESHOLD = 999;
const DELIVERY_CHARGE    = 79;

function deliveryFee(subtotal) {
  return subtotal >= DELIVERY_THRESHOLD ? 0 : DELIVERY_CHARGE;
}

function grandTotal(subtotal) {
  return subtotal + deliveryFee(subtotal);
}

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (document.getElementById('razorpay-script')) { resolve(true); return; }
    const script = document.createElement('script');
    script.id  = 'razorpay-script';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload  = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

function buildWhatsAppMessage(orderId, customerInfo, cartItems, total, paymentMethod) {
  const itemLines = cartItems
    .map(i => `- ${i.name} ${i.selectedWeight ? `(${i.selectedWeight})` : ''} x${i.qty} = ₹${i.price * i.qty}`)
    .join('\n');
  return encodeURIComponent(
    `✨ New Artbizz Order #${orderId}\nCustomer: ${customerInfo.name}\nPhone: ${customerInfo.phone}\nAddress: ${customerInfo.address}\n\nItems:\n${itemLines}\n\nTotal Amount: ₹${total}\nPayment Method: ${paymentMethod}`
  );
}

const stepVariants = {
  enter:  (dir) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { duration: 0.28, ease: 'easeOut' } },
  exit:   (dir) => ({ x: dir > 0 ? -60 : 60, opacity: 0, transition: { duration: 0.2, ease: 'easeIn' } }),
};

function StepProgress({ step }) {
  const steps = ['Address', 'Payment', 'Order Placed'];
  return (
    <div className="flex items-center justify-center gap-0 px-5 py-3 bg-[#F2EDE4]/50 border-b border-[#C9A84C]/30">
      {steps.map((label, i) => {
        const done    = i < step;
        const active  = i === step;
        return (
          <React.Fragment key={label}>
            <div className="flex flex-col items-center gap-1">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all duration-300 ${
                done   ? 'bg-emerald-600 text-white' :
                active ? 'bg-[#2C2C2C] text-[#C9A84C] shadow-[0_0_0_4px_rgba(201,168,76,0.2)]' :
                         'bg-[#F2EDE4] text-stone-400'
              }`}>
                {done ? '✓' : i + 1}
              </div>
              <span className={`text-[10px] font-bold tracking-wide ${active ? 'text-[#2C2C2C]' : done ? 'text-emerald-700' : 'text-stone-400'}`}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`h-0.5 w-12 mx-1 mb-3 rounded-full transition-all duration-500 ${i < step ? 'bg-emerald-500' : 'bg-[#C9A84C]/30'}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function Toast({ message, type }) {
  const bg = type === 'error' ? 'bg-red-500' : 'bg-emerald-600';
  return (
    <motion.div
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0,   opacity: 1 }}
      exit={{ y: -30,    opacity: 0 }}
      className={`${bg} text-white text-sm font-bold px-4 py-2.5 rounded-xl shadow-lg mx-5 mt-3 text-center`}
    >
      {message}
    </motion.div>
  );
}

function Field({ label, icon: Icon, error, children }) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-xs font-bold text-stone-600 mb-1.5 uppercase tracking-wide">
        {Icon && <Icon size={12} className="text-[#d97706]" />}
        {label}
      </label>
      {children}
      {error && <p className="text-red-500 text-[11px] mt-1 font-semibold">{error}</p>}
    </div>
  );
}

function MiniOrderSummary({ cartItems, cartTotal }) {
  const [open, setOpen] = useState(false);
  const fee   = deliveryFee(cartTotal);
  const total = grandTotal(cartTotal);
  const toFree = DELIVERY_THRESHOLD - cartTotal;

  return (
    <div className="rounded-2xl border border-[#C9A84C]/30 bg-[#F2EDE4]/80 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3"
      >
        <div className="flex items-center gap-2">
          <Package size={15} className="text-[#C9A84C]" />
          <span className="text-xs font-bold text-stone-800 uppercase tracking-wide">
            {cartItems.length} item{cartItems.length !== 1 ? 's' : ''}
          </span>
          {toFree > 0 && (
            <span className="flex items-center gap-1 text-[10px] font-bold text-stone-700 bg-[#C9A84C]/20 px-2 py-0.5 rounded-full">
              <Truck size={10} /> Add ₹{toFree} for FREE Shipping
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-black text-stone-900">₹{total}</span>
          {open ? <ChevronUp size={14} className="text-stone-400" /> : <ChevronDown size={14} className="text-stone-400" />}
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-3 space-y-1.5 border-t border-[#C9A84C]/30 pt-2">
              {cartItems.map(item => (
                <div key={item.id} className="flex justify-between text-xs text-stone-700">
                  <span className="line-clamp-1 flex-1 mr-2">{item.name} {item.selectedWeight ? `(${item.selectedWeight})` : ''} <span className="text-stone-400">×{item.qty}</span></span>
                  <span className="font-bold flex-shrink-0">₹{item.price * item.qty}</span>
                </div>
              ))}
              <div className="border-t border-[#C9A84C]/30 pt-1.5 space-y-0.5">
                <div className="flex justify-between text-xs text-stone-600">
                  <span>Subtotal</span><span>₹{cartTotal}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-stone-600">Priority Delivery</span>
                  <span className={fee === 0 ? 'text-emerald-700 font-bold' : 'text-stone-600'}>{fee === 0 ? 'FREE 🎉' : `₹${fee}`}</span>
                </div>
                <div className="flex justify-between text-sm font-black text-stone-900 pt-1 border-t border-[#C9A84C]/30">
                  <span>Grand Total</span><span>₹{total}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function OrderSummary({ cartItems, cartTotal }) {
  const fee   = deliveryFee(cartTotal);
  const total = grandTotal(cartTotal);
  return (
    <div className="bg-[#F2EDE4]/80 border border-[#C9A84C]/30 rounded-2xl p-4 space-y-2.5">
      <p className="text-xs font-bold text-stone-800 uppercase tracking-wide font-cinzel">Artbizz Summary</p>
      <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
        {cartItems.map(item => (
          <div key={item.id} className="flex justify-between text-xs">
            <span className="text-stone-700 line-clamp-1 flex-1 mr-2">
              {item.name} {item.selectedWeight ? `(${item.selectedWeight})` : ''} <span className="text-stone-400">×{item.qty}</span>
            </span>
            <span className="text-stone-900 font-bold flex-shrink-0">₹{item.price * item.qty}</span>
          </div>
        ))}
      </div>
      <div className="border-t border-[#C9A84C]/30 pt-2 space-y-1">
        <div className="flex justify-between text-xs text-stone-600">
          <span>Subtotal</span><span>₹{cartTotal}</span>
        </div>
        <div className="flex justify-between text-xs text-stone-600">
          <span>Priority Delivery</span>
          <span className={fee === 0 ? 'text-emerald-700 font-bold' : ''}>{fee === 0 ? 'FREE 🎉' : `₹${fee}`}</span>
        </div>
        <div className="flex justify-between text-sm font-black text-stone-900 pt-1 border-t border-[#C9A84C]/30">
          <span>Grand Total</span><span className="text-[#2C2C2C] font-extrabold text-base">₹{total}</span>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutModal({ isOpen, onClose, cartItems, cartTotal, onOrderSuccess }) {
  const { frontendSettings } = useData();

  const [step, setStep]     = useState(0);
  const [direction, setDir] = useState(1);

  const [form, setForm] = useState({ name: '', phone: '', address: '', pincode: '', city: '' });
  const [errors, setErrors] = useState({});

  const [payMethod, setPayMethod] = useState('COD');
  const [loading, setLoading]     = useState(false);
  const [orderStep, setOrderStep] = useState(null);
  const [toast, setToast]         = useState(null);
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  const showToast = useCallback((message, type = 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  const goTo = useCallback((nextStep) => {
    setDir(nextStep > step ? 1 : -1);
    setStep(nextStep);
  }, [step]);

  const handleClose = useCallback(() => {
    setStep(0); setDir(1);
    setForm({ name: '', phone: '', email: '', address: '', pincode: '', city: '' });
    setErrors({}); setPayMethod('COD'); setLoading(false);
    setToast(null); setConfirmedOrder(null);
    onClose();
  }, [onClose]);

  function validateForm() {
    const e = {};
    if (!form.name.trim())                   e.name    = 'Full Name is required.';
    if (!/^\d{10}$/.test(form.phone.trim())) e.phone   = 'Enter a valid 10-digit phone number.';
    if (form.email.trim() && !/\S+@\S+\.\S+/.test(form.email.trim())) e.email = 'Enter a valid email address.';
    if (!form.address.trim())                e.address = 'Please enter your shipping address.';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleContinue() {
    if (validateForm()) goTo(1);
  }

  async function placeCOD() {
    setLoading(true);
    setOrderStep('saving');
    try {
      const fullAddress = [form.address.trim(), form.city, form.pincode].filter(Boolean).join(', ');
      const res = await axios.post('/api/orders', {
        visitorId:       'anonymous',
        customerName:    form.name.trim(),
        customerPhone:   form.phone.trim(),
        customerEmail:   form.email.trim(),
        customerAddress: fullAddress,
        items:           JSON.stringify(cartItems.map(i => ({ id: i.id, name: i.name, weight: i.selectedWeight || '', qty: i.qty, price: i.price }))),
        total:           grandTotal(cartTotal),
        paymentMethod:   'COD',
      });
      setOrderStep('confirmed');
      await new Promise(r => setTimeout(r, 700));
      const orderId = res.data?.orderId || res.data?.order?.id || res.data?.id || `ARTBIZZ${Date.now()}`;
      setConfirmedOrder({ orderId, paymentMethod: 'Cash on Delivery (COD)' });
      setOrderStep('whatsapp');
      await new Promise(r => setTimeout(r, 500));
      goTo(2);
      onOrderSuccess && onOrderSuccess(orderId);
      // Removed automatic window.open to prevent mobile popup blockers.
      // The user can click the "Track Order via WhatsApp" button on the success screen.
    } catch (err) {
      showToast(err?.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
      setOrderStep(null);
    }
  }

  async function placeOnline() {
    const keyId = frontendSettings?.razorpayKeyId;
    if (!keyId) { showToast('Razorpay online gateway is pending config. Please use Cash on Delivery.'); return; }
    setLoading(true);
    try {
      const orderRes = await axios.post('/api/payment/create-order', { amount: grandTotal(cartTotal) * 100 });
      const rpOrder  = orderRes.data;
      const loaded   = await loadRazorpayScript();
      if (!loaded) { showToast('Could not load payment gateway. Please check internet connection.'); setLoading(false); return; }
      const options = {
        key: keyId, amount: rpOrder.amount, currency: rpOrder.currency || 'INR',
        name: 'Chaitali Artbizz',
        description: 'Custom Artworks & Resin Art Order', order_id: rpOrder.id,
        prefill: { name: form.name.trim(), contact: form.phone.trim() },
        theme: { color: '#C9A84C' },
        handler: async (response) => {
          try {
            await axios.post('/api/payment/verify', {
              razorpay_order_id:   response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature:  response.razorpay_signature,
            });
            const fullAddress = [form.address.trim(), form.city, form.pincode].filter(Boolean).join(', ');
            const saveRes = await axios.post('/api/orders', {
              visitorId: 'anonymous', customerName: form.name.trim(),
              customerPhone: form.phone.trim(), customerEmail: form.email.trim(), customerAddress: fullAddress,
              items: JSON.stringify(cartItems.map(i => ({ id: i.id, name: i.name, weight: i.selectedWeight || '', qty: i.qty, price: i.price }))),
              total: grandTotal(cartTotal), paymentMethod: 'ONLINE',
              razorpayOrderId: rpOrder.id, razorpayPaymentId: response.razorpay_payment_id,
            });
            const orderId = saveRes.data?.orderId || saveRes.data?.order?.id || saveRes.data?.id || `ARTBIZZ${Date.now()}`;
            setConfirmedOrder({ orderId, paymentMethod: 'Online Payment' });
            goTo(2);
            onOrderSuccess && onOrderSuccess(orderId);
          } catch (verifyErr) {
            showToast('Payment successful but order saving failed. Contact customer care.');
          } finally { setLoading(false); }
        },
        modal: { ondismiss: () => setLoading(false) },
      };
      new window.Razorpay(options).open();
    } catch (err) {
      showToast(err?.response?.data?.message || 'Could not initiate online payment. Try COD.');
      setLoading(false);
    }
  }

  async function handlePlaceOrder() {
    payMethod === 'COD' ? await placeCOD() : await placeOnline();
  }

  function openWhatsApp() {
    if (!confirmedOrder) return;
    const phone   = (frontendSettings?.whatsappOrderNumber || '919876543210').replace(/\D/g, '');
    const message = buildWhatsAppMessage(confirmedOrder.orderId, form, cartItems, grandTotal(cartTotal), confirmedOrder.paymentMethod);
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-stone-900/70 backdrop-blur-sm" onClick={handleClose} />

      {/* Main Sheet */}
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0,  opacity: 1 }}
        exit={{ y: 60,    opacity: 0 }}
        transition={{ type: 'spring', stiffness: 340, damping: 30 }}
        className="relative bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-amber-200"
        style={{ maxHeight: '93vh' }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#2C2C2C] via-[#1A1A1A] to-[#2C2C2C] px-5 py-4 flex items-center justify-between flex-shrink-0 shadow-md">
          <div className="flex items-center gap-2.5">
            <ShieldCheck size={20} className="text-[#C9A84C]" />
            <p className="text-[#F2EDE4] font-cinzel font-bold text-base leading-tight">Artbizz Checkout</p>
          </div>
          <button
            onClick={handleClose}
            className="bg-black/20 rounded-full p-1.5 hover:bg-black/40 transition-colors"
            aria-label="Close"
          >
            <X size={18} className="text-[#F2EDE4]" />
          </button>
        </div>

        {/* Progress steps */}
        {step < 2 && <StepProgress step={step} />}

        <AnimatePresence>
          {toast && <Toast key="toast" message={toast.message} type={toast.type} />}
        </AnimatePresence>

        {/* Body */}
        <div className="flex-1 overflow-y-auto relative">
          <AnimatePresence mode="wait" custom={direction}>

            {/* Step 0: Address Details */}
            {step === 0 && (
              <motion.div
                key="step-info"
                custom={direction}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="p-5 space-y-4"
              >
                <MiniOrderSummary cartItems={cartItems} cartTotal={cartTotal} />

                <div className="space-y-3">
                  <Field label="Full Name *" icon={User} error={errors.name}>
                    <input
                      type="text"
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="e.g. Ananya Sharma"
                      className={`w-full border ${errors.name ? 'border-red-400 bg-red-50' : 'border-[#C9A84C]/30'} bg-[#F2EDE4]/20 rounded-xl px-3.5 py-2.5 text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#C9A84C] transition`}
                    />
                  </Field>

                  <Field label="Mobile Number *" icon={Phone} error={errors.phone}>
                    <div className="flex gap-2">
                      <div className="flex items-center bg-[#F2EDE4]/70 border border-[#C9A84C]/30 rounded-xl px-3 py-2.5 text-sm font-bold text-stone-900 flex-shrink-0">
                        +91
                      </div>
                      <input
                        type="tel"
                        maxLength={10}
                        value={form.phone}
                        onChange={e => setForm(f => ({ ...f, phone: e.target.value.replace(/\D/g, '') }))}
                        placeholder="10-digit phone number"
                        className={`flex-1 border ${errors.phone ? 'border-red-400 bg-red-50' : 'border-[#C9A84C]/30'} bg-[#F2EDE4]/20 rounded-xl px-3.5 py-2.5 text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#C9A84C] transition`}
                      />
                    </div>
                  </Field>

                  <Field label="Email Address (Optional)" icon={Mail} error={errors.email}>
                    <input
                      type="email"
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      placeholder="For order receipt & tracking"
                      className={`w-full border ${errors.email ? 'border-red-400 bg-red-50' : 'border-[#C9A84C]/30'} bg-[#F2EDE4]/20 rounded-xl px-3.5 py-2.5 text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#C9A84C] transition`}
                    />
                  </Field>

                  <Field label="Delivery Address *" icon={MapPin} error={errors.address}>
                    <textarea
                      rows={2}
                      value={form.address}
                      onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                      placeholder="Flat/House No., Street, Landmark"
                      className={`w-full border ${errors.address ? 'border-red-400 bg-red-50' : 'border-[#C9A84C]/30'} bg-[#F2EDE4]/20 rounded-xl px-3.5 py-2.5 text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#C9A84C] transition resize-none`}
                    />
                  </Field>

                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Pincode">
                      <input
                        type="text"
                        maxLength={6}
                        value={form.pincode}
                        onChange={e => setForm(f => ({ ...f, pincode: e.target.value.replace(/\D/g, '') }))}
                        placeholder="400001"
                        className="w-full border border-[#C9A84C]/30 bg-[#F2EDE4]/20 rounded-xl px-3.5 py-2.5 text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#C9A84C] transition"
                      />
                    </Field>
                    <Field label="City">
                      <input
                        type="text"
                        value={form.city}
                        onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                        placeholder="Mumbai"
                        className="w-full border border-[#C9A84C]/30 bg-[#F2EDE4]/20 rounded-xl px-3.5 py-2.5 text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#C9A84C] transition"
                      />
                    </Field>
                  </div>
                </div>

                <button
                  onClick={handleContinue}
                  className="w-full bg-gradient-to-r from-[#2C2C2C] via-[#1A1A1A] to-[#2C2C2C] text-[#C9A84C] font-bold text-sm py-3.5 rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 border border-[#C9A84C]/30"
                >
                  Continue to Payment <ArrowRight size={16} />
                </button>
              </motion.div>
            )}

            {/* Step 1: Payment Selection */}
            {step === 1 && (
              <motion.div
                key="step-payment"
                custom={direction}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="p-5 space-y-4"
              >
                <button
                  onClick={() => goTo(0)}
                  className="flex items-center gap-1 text-xs text-[#2C2C2C] font-bold hover:underline"
                >
                  <ArrowLeft size={13} /> Edit Address
                </button>

                <div className="flex items-start gap-2 bg-[#F2EDE4]/60 border border-[#C9A84C]/30 rounded-xl px-3.5 py-2.5">
                  <MapPin size={14} className="text-[#C9A84C] mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-stone-700 uppercase tracking-wide mb-0.5">Shipping Address</p>
                    <p className="text-xs text-stone-800 font-bold truncate">{form.name}</p>
                    <p className="text-xs text-stone-500 line-clamp-1">{[form.address, form.city, form.pincode].filter(Boolean).join(', ')}</p>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <p className="text-xs font-bold text-stone-700 uppercase tracking-wide font-cinzel">Payment Method</p>

                  {[
                    { id: 'COD',    emoji: '💵', title: 'Cash on Delivery',  sub: 'Pay with cash upon delivery' },
                    { id: 'ONLINE', emoji: '💳', title: 'Online Payment',    sub: 'UPI, Credit/Debit Card, Net Banking' },
                  ].map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => setPayMethod(opt.id)}
                      className={`w-full text-left rounded-2xl border-2 p-4 transition-all ${
                        payMethod === opt.id
                          ? 'border-[#C9A84C] bg-[#F2EDE4] shadow-md'
                          : 'border-[#C9A84C]/30 bg-white hover:border-[#C9A84C]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{opt.emoji}</span>
                        <div className="flex-1">
                          <p className="font-bold text-stone-900 text-sm">{opt.title}</p>
                          <p className="text-stone-400 text-xs mt-0.5">{opt.sub}</p>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                          payMethod === opt.id ? 'border-[#C9A84C] bg-[#C9A84C]' : 'border-stone-300'
                        }`}>
                          {payMethod === opt.id && <div className="w-2 h-2 bg-white rounded-full" />}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                <OrderSummary cartItems={cartItems} cartTotal={cartTotal} />

                <button
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#2C2C2C] via-[#1A1A1A] to-[#2C2C2C] text-[#C9A84C] font-bold text-sm py-3.5 rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 border border-[#C9A84C]/30"
                >
                  {loading ? (
                    <div className="flex items-center gap-2 text-[#C9A84C] font-bold">
                      <span>Placing Order...</span>
                    </div>
                  ) : (
                    <><Package size={16} /> Confirm Order — ₹{grandTotal(cartTotal)}</>
                  )}
                </button>
              </motion.div>
            )}

            {/* Step 2: Order Confirmation */}
            {step === 2 && confirmedOrder && (
              <motion.div
                key="step-confirm"
                custom={direction}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="p-6 flex flex-col items-center text-center space-y-4"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 220, damping: 16, delay: 0.1 }}
                  className="w-20 h-20 bg-[#F2EDE4] rounded-full flex items-center justify-center shadow-lg border-2 border-[#C9A84C]"
                >
                  <CheckCircle2 size={46} className="text-[#C9A84C]" strokeWidth={2} />
                </motion.div>

                <div>
                  <h2 className="text-2xl font-cinzel font-bold text-stone-900 leading-tight">Order Confirmed!</h2>
                  <p className="text-[#C9A84C] font-bold text-sm mt-1">Order ID: #{confirmedOrder.orderId}</p>
                </div>

                <div className="bg-[#F2EDE4]/70 border border-[#C9A84C]/30 rounded-2xl w-full px-4 py-3.5 text-left space-y-2">
                  {[
                    { label: 'Customer', value: form.name },
                    { label: 'Phone',    value: `+91 ${form.phone}` },
                    ...(form.email ? [{ label: 'Email', value: form.email }] : []),
                    { label: 'Address',  value: [form.address, form.city, form.pincode].filter(Boolean).join(', ') },
                    { label: 'Payment',  value: confirmedOrder.paymentMethod },
                  ].map(row => (
                    <div key={row.label} className="flex justify-between items-start">
                      <span className="text-stone-500 text-xs w-16 flex-shrink-0">{row.label}</span>
                      <span className="text-stone-800 text-xs font-bold text-right">{row.value}</span>
                    </div>
                  ))}
                  <div className="border-t border-[#C9A84C]/30 pt-2 flex justify-between text-sm font-black text-stone-900">
                    <span>Total Amount</span>
                    <span className="text-[#2C2C2C] font-extrabold">₹{grandTotal(cartTotal)}</span>
                  </div>
                </div>

                <p className="text-stone-500 text-xs">
                  Thank you for choosing Artbizz. We are dispatching your 100% pure artworks! ✨
                </p>

                <button
                  onClick={openWhatsApp}
                  className="w-full bg-[#25D366] hover:bg-[#1fb855] text-white font-bold text-sm py-3.5 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <span className="text-base">💬</span> Track Order via WhatsApp
                </button>

                <button
                  onClick={handleClose}
                  className="w-full text-stone-500 text-xs font-bold py-1 hover:text-[#C9A84C] transition-colors"
                >
                  Return to Store →
                </button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
