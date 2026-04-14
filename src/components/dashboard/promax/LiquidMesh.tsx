import React from 'react';
import { motion } from 'framer-motion';

/**
 * 🎨 PerformanceMesh: GPU-Optimized Apple Inspired Background
 * Replaces expensive CSS blurs and SVG turbulence with hardware-accelerated 
 * mesh gradients and a static noise texture.
 */
export const LiquidMesh: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-mat-obsidian pointer-events-none">
      {/* 🔮 Optimized Mesh Surface (Hardware Accelerated) */}
      <div 
        className="absolute inset-0 opacity-40 mix-blend-screen will-change-transform"
        style={{
          background: `
            radial-gradient(circle at 20% 30%, rgba(0, 113, 227, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(134, 134, 139, 0.1) 0%, transparent 40%),
            radial-gradient(circle at 50% 80%, rgba(0, 113, 227, 0.12) 0%, transparent 60%),
            radial-gradient(circle at 10% 90%, rgba(29, 29, 31, 0.3) 0%, transparent 50%)
          `
        }}
      />

      {/* 🌊 Subtle Ambient Drift (Opacity & Scale Only - Zero Lag) */}
      <motion.div 
        animate={{ 
          opacity: [0.3, 0.5, 0.3],
          scale: [1, 1.1, 1],
        }}
        transition={{ 
          duration: 20, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at center, rgba(0, 113, 227, 0.05) 0%, transparent 70%)'
        }}
      />

      {/* 🎞️ Performant High-Fidelity Grain (Base64 Tiled Noise) */}
      <div 
        className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* 🌑 Apple 'Pro' Vignette (Focus Layer) */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20" />
    </div>
  );
};
