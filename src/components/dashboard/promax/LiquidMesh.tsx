import React from 'react';
import { motion } from 'framer-motion';

/**
 * 🎨 PerformanceMesh: GPU-Optimized Apple Inspired Background
 * Replaces expensive CSS blurs and SVG turbulence with hardware-accelerated 
 * mesh gradients and a static noise texture.
 */
export const LiquidMesh: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-mat-cream pointer-events-none">
      {/* 🔮 Optimized Mesh Surface (Hardware Accelerated) */}
      <div 
        className="absolute inset-0 opacity-20 mix-blend-multiply will-change-transform"
        style={{
          background: `
            radial-gradient(circle at 20% 30%, rgba(201, 110, 80, 0.2) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(132, 148, 131, 0.2) 0%, transparent 40%),
            radial-gradient(circle at 50% 80%, rgba(201, 110, 80, 0.15) 0%, transparent 60%),
            radial-gradient(circle at 10% 90%, rgba(132, 148, 131, 0.25) 0%, transparent 50%)
          `
        }}
      />

      {/* 🌊 Subtle Ambient Drift (Opacity & Scale Only - Zero Lag) */}
      <motion.div 
        animate={{ 
          opacity: [0.1, 0.2, 0.1],
          scale: [1, 1.05, 1],
        }}
        transition={{ 
          duration: 15, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at center, rgba(201, 110, 80, 0.1) 0%, transparent 70%)'
        }}
      />

      {/* 🎞️ Performant High-Fidelity Grain (Base64 Tiled Noise) */}
      <div 
        className="absolute inset-0 opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* 🏺 Sanctuary Vignette (Soft Depth) */}
      <div className="absolute inset-0 bg-gradient-to-t from-mat-cream via-transparent to-mat-cream/40" />
      <div className="absolute inset-0 bg-gradient-to-r from-mat-cream/30 via-transparent to-mat-cream/30" />
    </div>
  );
};
