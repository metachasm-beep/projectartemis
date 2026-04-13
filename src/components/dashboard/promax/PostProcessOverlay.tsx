import React from 'react';

/**
 * 🎞️ PostProcessOverlay: Global Aesthetic Filter
 * Applies chromatic aberration and procedural grain to the entire viewport.
 */
export const PostProcessOverlay: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-[999] overflow-hidden">
      {/* 🏗️ Static Grain Mask */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      
      {/* 🌈 Fixed Chromatic Aberration Filter (SVG) */}
      <svg className="hidden">
        <defs>
          <filter id="chromatic-aberration">
            <feOffset in="SourceGraphic" dx="1.5" dy="0" result="red" />
            <feOffset in="SourceGraphic" dx="-1.5" dy="0" result="blue" />
            <feColorMatrix in="red" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="redOnly" />
            <feColorMatrix in="blue" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="blueOnly" />
            <feBlend in="redOnly" in2="blueOnly" mode="screen" />
          </filter>
        </defs>
      </svg>

      <style>{`
        .post-process-bloom {
          filter: contrast(1.1) brightness(1.05) saturate(1.1);
        }
      `}</style>
    </div>
  );
};

export default PostProcessOverlay;
