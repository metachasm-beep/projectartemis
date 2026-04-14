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
      <motion.div 
        animate={{ 
          x: ['0%', '2%', '-1%', '0%'],
          y: ['0%', '1%', '2%', '0%'],
          scale: [1, 1.05, 0.98, 1]
        }}
        transition={{ 
          duration: 30, 
          repeat: Infinity, 
          ease: "linear" 
        }}
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

      {/* 🎞️ High-Fashion Grain (Static & Subtle) */}
      <div 
        className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundSize: '150px 150px'
        }}
      />

      {/* 🌈 Spectral Prismatic Edge */}
      <div className="absolute inset-0 bg-gradient-to-tr from-mat-rose-gold/[0.03] via-transparent to-mat-gold/[0.03]" />
    </div>
  );
};

export default LiquidMesh;
