import React, { useState, useEffect, useRef } from 'react';

const LOADING_TEXTS = [
  "正在推演星宿方位...",
  "五行生克流转中...",
  "卦象凝聚成形...",
];

const FINISHED_TEXT = "天机已显";

interface RitualLoaderProps {
  status: 'loading' | 'finishing';
  onFinish: () => void;
}

// ========================================
// CELESTIAL ORB COMPONENT
// ========================================
const CelestialOrb: React.FC<{ active: boolean }> = ({ active }) => {
  return (
    <div className={`relative w-40 h-40 ${active ? 'animate-pulse-glow' : ''}`}>
      {/* Outer Ring */}
      <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full">
        <circle
          cx="100"
          cy="100"
          r="95"
          fill="none"
          stroke="url(#goldGradient)"
          strokeWidth="1"
          className={`origin-center ${active ? 'animate-[spin_20s_linear_infinite]' : ''}`}
        />
        <circle
          cx="100"
          cy="100"
          r="85"
          fill="none"
          stroke="url(#jadeGradient)"
          strokeWidth="1"
          className={`origin-center ${active ? 'animate-[spin_15s_linear_infinite_reverse]' : ''}`}
        />
      </svg>

      {/* Tai Chi Symbol */}
      <div className={`absolute inset-8 ${active ? 'animate-[spin_8s_linear_infinite]' : ''}`}>
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#d4af37" />
              <stop offset="100%" stopColor="#c4a432" />
            </linearGradient>
            <linearGradient id="jadeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4a7c59" />
              <stop offset="100%" stopColor="#7ba05b" />
            </linearGradient>
            <linearGradient id="darkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1a2342" />
              <stop offset="100%" stopColor="#0a0f1e" />
            </linearGradient>
          </defs>

          {/* Outer Circle */}
          <circle cx="50" cy="50" r="48" fill="none" stroke="url(#goldGradient)" strokeWidth="2" />

          {/* Yang Side (Light) */}
          <path
            d="M50,2 A48,48 0 0,1 50,98 A24,24 0 0,1 50,50 A24,24 0 0,0 50,2 Z"
            fill="url(#darkGradient)"
            stroke="none"
          />

          {/* Yin Side (Dark) */}
          <path
            d="M50,50 A24,24 0 0,1 50,98 A48,48 0 0,1 50,2 A24,24 0 0,0 50,50 Z"
            fill="url(#jadeGradient)"
            stroke="none"
          />

          {/* Yang Dot */}
          <circle cx="50" cy="26" r="7" fill="#d4af37" opacity="0.9">
            <animate
              attributeName="opacity"
              values="0.6;1;0.6"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>

          {/* Yin Dot */}
          <circle cx="50" cy="74" r="7" fill="#0a0f1e" opacity="0.9">
            <animate
              attributeName="opacity"
              values="0.6;1;0.6"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>
        </svg>
      </div>

      {/* Floating Particles Around Orb */}
      {active && Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-amber-400/60 rounded-full"
          style={{
            left: '50%',
            top: '50%',
            width: '3px',
            height: '3px',
            animation: `orbit ${4 + i * 0.5}s linear infinite`,
            animationDelay: `${i * 0.5}s`
          }}
        />
      ))}
    </div>
  );
};

// ========================================
// MAIN RITUAL LOADER COMPONENT
// ========================================
const RitualLoader: React.FC<RitualLoaderProps> = ({ status, onFinish }) => {
  const [textIndex, setTextIndex] = useState(0);

  // Reset index when starting loading
  useEffect(() => {
    if (status === 'loading') {
      setTextIndex(0);
    }
  }, [status]);

  // Loop through texts while loading
  useEffect(() => {
    if (status === 'loading') {
      const interval = setInterval(() => {
        setTextIndex(prev => {
          const nextIndex = prev + 1;
          return nextIndex < LOADING_TEXTS.length ? nextIndex : prev;
        });
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [status]);

  // Handle finishing state
  useEffect(() => {
    if (status === 'finishing') {
      const timer = setTimeout(() => {
        onFinish();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [status, onFinish]);

  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-10">

      {/* Celestial Orb */}
      <div className="animate-float">
        <CelestialOrb active={status === 'loading'} />
      </div>

      {/* Sacred Text Display */}
      <div className="text-center space-y-4">
        <div className="text-2xl md:text-3xl font-brush text-amber-200 tracking-widest min-h-[3rem]">
          {status === 'loading' ? LOADING_TEXTS[textIndex] : FINISHED_TEXT}
        </div>

        {/* Decorative Line */}
        <div className="flex items-center justify-center gap-4">
          <div className="w-16 h-px bg-gradient-to-r from-transparent to-amber-500/30"></div>
          <span className="text-amber-500/40 text-sm">✦</span>
          <div className="w-16 h-px bg-gradient-to-l from-transparent to-amber-500/30"></div>
        </div>

        {/* Subtitle */}
        <p className={`text-sm text-amber-100/60 font-serif-sc tracking-wider ${
          status === 'finishing' ? 'animate-fade-in' : ''
        }`}>
          {status === 'loading'
            ? '天机流转，稍候片刻...'
            : '卦象已成，神谕降临'
          }
        </p>
      </div>

    </div>
  );
};

export default RitualLoader;

// Add custom animation for orbit
const style = document.createElement('style');
style.textContent = `
  @keyframes orbit {
    from {
      transform: translate(-50%, -50%) rotate(0deg) translateX(90px);
    }
    to {
      transform: translate(-50%, -50%) rotate(360deg) translateX(90px);
    }
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  @keyframes spin-reverse {
    from { transform: rotate(360deg); }
    to { transform: rotate(0deg); }
  }
`;

if (typeof document !== 'undefined') {
  document.head.appendChild(style);
}