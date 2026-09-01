const fs=require('fs');
let p='src/pages/HomePage.jsx';
let c=fs.readFileSync(p, 'utf8');

const replacement = \unction QuickCategories() {
  const { categories } = useData();
  const navigate = useNavigate();
  // Duplicate categories to ensure seamless infinite scrolling
  const infiniteCategories = [...categories, ...categories, ...categories, ...categories];

  return (
    <section className="relative z-10 max-w-[1600px] mx-auto w-full px-4 md:px-6 mb-4">
      <div className="relative overflow-hidden rounded-3xl p-5 md:p-7 border border-[#C9A84C]/40 shadow-xl bg-gradient-to-br from-[#1A1A1A] via-[#2C2C2C] to-[#0F0F0F]">
        
        <LiveBackground theme="3d-floating" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between mb-6 md:mb-8 gap-4">
          <div>
            <h2 className="text-[#F0DFA0] font-cinzel font-bold text-2xl md:text-4xl tracking-tight flex items-center gap-2">
              Explore Art Collections <Palette className="text-[#C9A84C]" size={24} />
            </h2>
            <p className="text-[#C9A84C]/80 text-sm md:text-base font-medium mt-1">
              Custom Portraits, Resin Art, Digital Designs, Personalised Gifts & Much More.
            </p>
          </div>
          <button onClick={() => navigate('/category')}
            className="flex-shrink-0 flex items-center gap-1.5 bg-[#C9A84C] hover:bg-[#A8873A] text-[#2C2C2C] text-xs md:text-sm font-bold px-5 py-2.5 rounded-full transition-all shadow-md">
            View All Collections <ArrowRight size={14} />
          </button>
        </div>

        {/* Infinite Scrolling Marquee */}
        <div className="relative z-10 mt-4 overflow-hidden mask-edges py-3">
          <motion.div 
            className="flex gap-4 md:gap-6 w-max"
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
            whileHover={{ animationPlayState: 'paused' }} // Pauses animation on hover! (Requires CSS or we can leave it free flowing)
          >
            {infiniteCategories.map((cat, idx) => (
              <button key={\\-\\} onClick={() => navigate('/category', { state: { category: cat.label } })}
                className="flex-shrink-0 flex flex-col items-center gap-3 group focus:outline-none w-24 sm:w-32 md:w-44 cursor-pointer">
                <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-44 md:h-44 rounded-2xl md:rounded-3xl border-2 border-[#C9A84C]/40 bg-[#1A1A1A] overflow-hidden shadow-lg group-hover:border-[#C9A84C] group-hover:scale-105 transition-all duration-300 relative">
                  <img src={cat.img} alt={cat.label} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <span className="text-xs md:text-sm font-bold text-[#F0DFA0] text-center leading-tight group-hover:text-[#C9A84C] transition-colors">{cat.label}</span>
              </button>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}\;

const regex = /function QuickCategories\(\) \{[\s\S]*?<\/section>\s*\n\s*\}/m;
c = c.replace(regex, replacement);
fs.writeFileSync(p, c);
