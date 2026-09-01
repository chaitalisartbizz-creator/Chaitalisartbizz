import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Star, Heart, ShoppingBag, ChevronRight, ShieldCheck, Truck, RotateCcw, Plus, Minus, Award, Sparkles, CheckCircle2 } from 'lucide-react';
import Header from '../components/Header';
import ScrollReveal from '../components/ScrollReveal';
import MediaDisplay from '../components/MediaDisplay';
import { useCart } from '../context/CartContext';
import { useData } from '../context/DataContext';

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products } = useData();
  const { addToCart, toggleWishlist, isWishlisted, setCartOpen } = useCart();
  
  const product = products.find(p => String(p.id) === String(id));
  const [activeImage, setActiveImage] = useState(0);
  const [selectedWeight, setSelectedWeight] = useState('250g');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen mesh-bg flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <h2 className="text-2xl font-cinzel font-bold text-stone-900 mb-2">Artwork Not Found</h2>
          <p className="text-stone-500 mb-6">The requested creative piece does not exist.</p>
          <button onClick={() => navigate('/category')} className="bg-[#2C2C2C] text-[#C9A84C] px-6 py-3 rounded-xl font-bold hover:bg-[#1A1A1A] transition-colors">
            Return to Art Catalogue
          </button>
        </div>
      </div>
    );
  }

  // Options Multipliers
  const sizeOptions = [
    { label: 'Standard', multiplier: 1.0 },
    { label: 'Large', multiplier: 1.5 },
    { label: 'Premium Finish', multiplier: 2.0 },
  ];

  const currentMultiplier = sizeOptions.find(w => w.label === selectedWeight)?.multiplier || 1.0;
  const computedPrice = Math.round(product.price * currentMultiplier);
  const computedMrp   = product.mrp ? Math.round(product.mrp * currentMultiplier) : Math.round(computedPrice * 1.3);

  const gallery = [product.img, ...(product.images ? (typeof product.images === 'string' ? JSON.parse(product.images) : product.images) : [])];
  const relatedProducts = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <div className="min-h-screen mesh-bg">
      <Header />
      
      <main className="pb-28 md:pb-16 pt-4">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          
          {/* Breadcrumbs */}
          <ScrollReveal>
            <div className="flex items-center gap-2 text-xs md:text-sm text-stone-500 mb-6 overflow-x-auto whitespace-nowrap pb-1">
              <Link to="/" className="hover:text-[#C9A84C] transition-colors">Home</Link>
              <ChevronRight size={13} />
              <Link to="/category" state={{ category: product.category }} className="hover:text-[#C9A84C] transition-colors">{product.category}</Link>
              <ChevronRight size={13} />
              <span className="text-stone-900 font-bold truncate">{product.name}</span>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14 bg-white/90 backdrop-blur-md rounded-3xl p-5 md:p-10 border border-[#C9A84C]/30 shadow-xl">
            
            {/* Image Gallery */}
            <ScrollReveal>
              <div className="flex flex-col-reverse md:flex-row gap-4">
                {/* Thumbnails */}
                <div className="flex md:flex-col gap-3 overflow-x-auto md:w-20 flex-shrink-0 hide-scrollbar">
                  {gallery.map((img, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setActiveImage(idx)}
                      className={`w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${activeImage === idx ? 'border-[#C9A84C] shadow-md' : 'border-[#F2EDE4] opacity-70 hover:opacity-100'}`}
                    >
                      <MediaDisplay src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover bg-[#F2EDE4]" />
                    </button>
                  ))}
                </div>
                
                {/* Main Product Showcase */}
                <div className="flex-1 bg-[#F2EDE4]/50 rounded-2xl md:rounded-3xl overflow-hidden relative aspect-square md:aspect-auto md:h-[480px] border border-[#C9A84C]/30">
                  {product.tag && (
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-[#2C2C2C] to-[#1A1A1A] text-[#C9A84C] text-xs font-bold px-3 py-1.5 rounded-lg shadow-md z-10">
                      {product.tag}
                    </div>
                  )}
                  <button className="absolute top-4 right-4 p-2.5 bg-white/90 rounded-full hover:scale-110 text-stone-600 transition-all z-10 shadow-md"
                    onClick={() => toggleWishlist(product)}>
                    <Heart size={20} className={isWishlisted(product.id) ? "fill-red-500 text-red-500" : ""} />
                  </button>
                  <MediaDisplay src={gallery[activeImage]} alt={product.name} className="w-full h-full object-cover p-2" />
                </div>
              </div>
            </ScrollReveal>

            {/* Product Details */}
            <ScrollReveal delay={100}>
              <div className="flex flex-col">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[#A8873A] font-bold text-xs tracking-wider uppercase bg-[#F2EDE4] px-2.5 py-1 rounded-full">{product.brand || "Chaitali's Artbizz"}</span>
                  <span className="text-emerald-700 text-xs font-bold flex items-center gap-1"><ShieldCheck size={14} /> 100% Handcrafted</span>
                </div>
                
                <h1 className="text-xl md:text-3xl font-cinzel font-bold text-stone-900 leading-tight mb-2">{product.name}</h1>
                
                <div className="flex items-center gap-3 mb-5">
                  <div className="flex items-center gap-1 bg-emerald-600 text-white px-2 py-0.5 rounded-md">
                    <Star size={14} className="fill-white" />
                    <span className="font-bold text-xs">{product.rating}</span>
                  </div>
                  <span className="text-xs text-stone-500 font-medium">({product.reviews?.toLocaleString() || 120} Lab Verified Reviews)</span>
                </div>

                {/* Pricing Calculation */}
                <div className="flex items-baseline gap-3 mb-6 bg-[#F2EDE4]/80 p-4 rounded-2xl border border-[#C9A84C]/30">
                  <span className="text-3xl md:text-4xl font-black text-[#2C2C2C]">₹{computedPrice}</span>
                  {computedMrp && <span className="text-base md:text-lg text-stone-400 line-through font-semibold">₹{computedMrp}</span>}
                  <span className="ml-auto text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-lg">
                    Save ₹{computedMrp - computedPrice}
                  </span>
                </div>

                {/* Pack Size / Weight Variable Selector */}
                <div className="mb-6">
                  <p className="text-xs font-bold text-stone-700 uppercase tracking-wide mb-2 flex items-center justify-between">
                    <span>Select Size / Finish</span>
                    <span className="text-[#C9A84C]">{selectedWeight}</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {sizeOptions.map(w => (
                      <button
                        key={w.label}
                        onClick={() => setSelectedWeight(w.label)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                          selectedWeight === w.label
                            ? 'bg-[#2C2C2C] text-[#C9A84C] border-[#2C2C2C] shadow-md scale-105'
                            : 'bg-white text-stone-700 border-[#C9A84C]/40 hover:border-[#C9A84C]'
                        }`}
                      >
                        {w.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity modifier */}
                <div className="mb-8 flex items-center justify-between border-t border-b border-[#C9A84C]/20 py-4">
                  <span className="text-sm font-bold text-stone-700">Quantity</span>
                  <div className="flex items-center border border-[#C9A84C]/30 rounded-xl overflow-hidden bg-[#F2EDE4]/50">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3.5 py-2 text-stone-600 hover:bg-[#C9A84C]/20 transition-colors"><Minus size={14}/></button>
                    <span className="w-10 text-center font-bold text-stone-900 text-sm">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="px-3.5 py-2 text-stone-600 hover:bg-[#C9A84C]/20 transition-colors"><Plus size={14}/></button>
                  </div>
                </div>

                {/* Desktop Action Buttons */}
                <div className="hidden md:flex gap-3 mb-6">
                  <button 
                    onClick={() => {
                      for(let i = 0; i < quantity; i++) {
                        addToCart({ ...product, price: computedPrice, mrp: computedMrp, selectedWeight });
                      }
                      setCartOpen(true);
                    }}
                    className="flex-1 bg-white border-2 border-[#C9A84C] text-[#2C2C2C] py-3.5 rounded-xl font-bold text-base hover:bg-[#F2EDE4] transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                    <ShoppingBag size={18} />
                    Add to Cart
                  </button>
                  <button 
                    onClick={() => {
                      for(let i = 0; i < quantity; i++) {
                        addToCart({ ...product, price: computedPrice, mrp: computedMrp, selectedWeight });
                      }
                      setCartOpen(true);
                    }}
                    className="flex-1 bg-gradient-to-r from-[#2C2C2C] via-[#1A1A1A] to-[#2C2C2C] text-[#C9A84C] py-3.5 rounded-xl font-bold text-base hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    Buy Now
                  </button>
                </div>

                {/* Purity Assurance Badges */}
                <div className="grid grid-cols-3 gap-3 border border-[#C9A84C]/40 rounded-2xl p-3.5 bg-[#F2EDE4]/40">
                  <div className="flex flex-col items-center text-center gap-1.5">
                    <ShieldCheck size={18} className="text-emerald-700" />
                    <span className="text-[11px] font-bold text-stone-700">100% Handcrafted</span>
                  </div>
                  <div className="flex flex-col items-center text-center gap-1.5">
                    <Truck size={18} className="text-[#A8873A]" />
                    <span className="text-[11px] font-bold text-stone-700">Safe Shipping</span>
                  </div>
                  <div className="flex flex-col items-center text-center gap-1.5">
                    <Award size={18} className="text-[#8B5E7A]" />
                    <span className="text-[11px] font-bold text-stone-700">Premium Quality</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>

          </div>

          {/* Details & Nutritional Accordions */}
          <ScrollReveal delay={200}>
            <div className="mt-12 bg-white/90 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-[#C9A84C]/40 shadow-lg">
              <div className="flex gap-6 border-b border-[#C9A84C]/30 mb-6 overflow-x-auto">
                {['description', 'customization options', 'quality guarantee'].map(tab => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-3 text-sm font-bold capitalize whitespace-nowrap transition-all border-b-2 ${activeTab === tab ? 'border-[#C9A84C] text-[#2C2C2C]' : 'border-transparent text-stone-400 hover:text-stone-700'}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <div className="text-stone-700 text-sm leading-relaxed">
                {activeTab === 'description' && (
                  <div className="space-y-3">
                    <p className="font-semibold text-stone-900">{product.description}</p>
                    <p>Every piece is uniquely designed and handcrafted with precision to ensure it perfectly aligns with your vision. We carefully package every item to ensure it arrives safely at your doorstep.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2">
                      <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs"><CheckCircle2 size={15} /> Custom made to order</div>
                      <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs"><CheckCircle2 size={15} /> Durable & Long-lasting</div>
                      <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs"><CheckCircle2 size={15} /> Precision detailing</div>
                      <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs"><CheckCircle2 size={15} /> Secure eco-friendly packaging</div>
                    </div>
                  </div>
                )}
                {activeTab === 'customization options' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#F2EDE4]/50 p-4 rounded-2xl border border-[#C9A84C]/30">
                    <div><p className="text-xs text-stone-500 font-bold">Personalised Text</p><p className="font-black text-stone-900">Available</p></div>
                    <div><p className="text-xs text-stone-500 font-bold">Color Theme</p><p className="font-black text-stone-900">Customizable</p></div>
                    <div><p className="text-xs text-stone-500 font-bold">Size</p><p className="font-black text-stone-900">Standard / Large / Premium</p></div>
                    <div><p className="text-xs text-stone-500 font-bold">Turnaround Time</p><p className="font-black text-stone-900">5-7 Business Days</p></div>
                  </div>
                )}
                {activeTab === 'quality guarantee' && (
                  <div className="space-y-2">
                    <p className="font-bold text-[#2C2C2C]">Chaitali's Artbizz Quality Assurance:</p>
                    <p>We use premium resin, high-grade canvases, and the best digital tools to craft your masterpieces. Every product undergoes strict visual inspection before dispatch.</p>
                  </div>
                )}
              </div>
            </div>
          </ScrollReveal>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <ScrollReveal delay={300}>
              <div className="mt-12">
                <h3 className="text-2xl font-cinzel font-bold text-stone-900 mb-6">You May Also Like</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {relatedProducts.map((p, idx) => (
                    <div key={idx} onClick={() => navigate(`/product/${p.id}`)} className="bg-white rounded-2xl p-3 border border-[#C9A84C]/30 shadow-sm hover:shadow-xl transition-all cursor-pointer">
                      <div className="relative bg-[#F2EDE4]/50 rounded-xl overflow-hidden aspect-square mb-2">
                        <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
                      </div>
                      <p className="text-xs font-bold text-[#A8873A]">{p.brand}</p>
                      <h4 className="font-bold text-stone-800 text-xs line-clamp-1 mt-0.5">{p.name}</h4>
                      <p className="font-black text-stone-900 text-sm mt-1">₹{p.price}</p>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          )}

        </div>
      </main>

      {/* Sticky Mobile Add To Cart Bar */}
      <div
        className="md:hidden fixed left-3 right-3 z-[70] bg-white/95 backdrop-blur-md border border-[#C9A84C] shadow-2xl flex flex-col gap-2 px-4 py-3 rounded-2xl"
        style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 76px)' }}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0 pr-2">
            <p className="text-xs font-bold text-stone-800 truncate">{product.name}</p>
            <p className="font-black text-[#2C2C2C] text-base leading-tight">₹{computedPrice} <span className="text-xs text-[#2C2C2C] font-bold bg-[#C9A84C]/30 px-1.5 py-0.5 rounded">{selectedWeight}</span></p>
          </div>
          <div className="flex items-center border border-[#C9A84C]/30 rounded-lg overflow-hidden flex-shrink-0 h-9 bg-[#F2EDE4]">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-2.5 text-stone-600 font-bold"><Minus size={13}/></button>
            <span className="w-6 text-center font-bold text-stone-900 text-xs">{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)} className="px-2.5 text-stone-600 font-bold"><Plus size={13}/></button>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => { 
              for(let i=0; i<quantity; i++) addToCart({ ...product, price: computedPrice, mrp: computedMrp, selectedWeight });
              setCartOpen(true);
            }}
            className="flex-1 bg-gradient-to-r from-[#2C2C2C] to-[#1A1A1A] text-[#C9A84C] py-2.5 rounded-xl font-bold text-xs shadow-md flex items-center justify-center gap-1"
          >
            <ShoppingBag size={14} /> Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
