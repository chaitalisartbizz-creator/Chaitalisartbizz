const fs = require('fs');
let p = 'src/components/LiveBackground.jsx';
let c = fs.readFileSync(p, 'utf8');

const theme = \
  if (theme === 'golden-cracks') {
    return (
      <div className={\\ bg-[#252525]\}>
        {/* Subtle grey wall noise texture */}
        <div className="absolute inset-0 opacity-40 mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

        {/* Golden Cracks SVG */}
        <svg className="absolute inset-0 w-full h-full opacity-90" viewBox="0 0 1600 800" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="gold-glow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C9A84C" stopOpacity="0.7" />
              <stop offset="50%" stopColor="#F0DFA0" stopOpacity="1" />
              <stop offset="100%" stopColor="#A8873A" stopOpacity="0.7" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          <motion.path
            d="M -100 200 Q 150 250 200 400 T 450 350 T 600 500 T 850 400 T 1100 550 T 1300 450 T 1700 600"
            fill="transparent"
            stroke="url(#gold-glow)"
            strokeWidth="3"
            filter="url(#glow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: [0, 1, 1, 0.5, 0], opacity: [0, 1, 1, 0.8, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.path
            d="M 300 -100 Q 350 150 250 300 T 400 500 T 350 900"
            fill="transparent"
            stroke="url(#gold-glow)"
            strokeWidth="2"
            filter="url(#glow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: [0, 1, 1, 0.5, 0], opacity: [0, 1, 1, 0.8, 0] }}
            transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
          />
          <motion.path
            d="M 850 900 Q 900 700 1000 650 T 1150 500 T 1350 550 T 1700 400"
            fill="transparent"
            stroke="url(#gold-glow)"
            strokeWidth="3.5"
            filter="url(#glow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: [0, 1, 1, 0.5, 0], opacity: [0, 1, 1, 0.8, 0] }}
            transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          />
          <motion.path
            d="M 450 350 L 520 280 L 580 300"
            fill="transparent"
            stroke="url(#gold-glow)"
            strokeWidth="1.5"
            filter="url(#glow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: [0, 1, 1, 0.5, 0], opacity: [0, 1, 1, 0.8, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          />
          <motion.path
            d="M 1150 500 L 1100 350 L 1150 250"
            fill="transparent"
            stroke="url(#gold-glow)"
            strokeWidth="1.5"
            filter="url(#glow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: [0, 1, 1, 0.5, 0], opacity: [0, 1, 1, 0.8, 0] }}
            transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
          />
        </svg>

        {/* Ambient gold glow */}
        <motion.div
          animate={{ opacity: [0.1, 0.25, 0.1] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,168,76,0.15)_0%,transparent_80%)]"
        />
      </div>
    );
  }
\;

c = c.replace(/return null;/, theme + '\\n  return null;');
fs.writeFileSync(p, c);
