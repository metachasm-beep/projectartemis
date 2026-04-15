import React from 'react';
import { motion } from 'framer-motion';

/**
 * 🌊 LiquidMesh 2.0: The Haute Foundation
 * Re-engineered for the 'Editorial Luxury' system.
 * Features slow ambient drift, ivory/cashmere tones, and silk-textures.
 */
export const LiquidMesh: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-mat-bone pointer-events-none">
      {/* 🔮 Ambient Silk Drift (Ivory Pulse) */}
      <div 
        className="absolute -inset-[50%] opacity-[0.4] blur-[120px]"
        style={{
          background: `
            radial-gradient(circle at 20% 30%, var(--color-mat-cashmere) 0%, transparent 60%),
            radial-gradient(circle at 80% 70%, #EAE0D5 0%, transparent 50%)
          `
        }}
      />

      {/* 🏺 Editorial Vignette (Rose Gold Mist) */}
      <div 
        className="absolute inset-0 opacity-[0.08]"
        style={{
          background: `radial-gradient(circle at 50% 50%, transparent 40%, var(--color-mat-rose-gold) 100%)`
        }}
      />

      {/* 🎞️ High-Fashion Grain (Static Soft Mask) */}
      <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      {/* 🌈 Spectral Prismatic Edge */}
      <div className="absolute inset-0 bg-gradient-to-tr from-mat-rose-gold/[0.03] via-transparent to-mat-gold/[0.03]" />
    </div>
  );
};

export default LiquidMesh;
