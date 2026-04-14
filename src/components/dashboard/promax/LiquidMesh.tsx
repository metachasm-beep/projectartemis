import React from 'react';
import { motion } from 'framer-motion';

/**
 * 🎨 LiquidMesh: High-Performance 'Sovereign' Background
 * Replaces GPU-intensive Aurora WebGL shader with optimized CSS/SVG.
 * Uses hardware-accelerated transforms for zero-lag immersive visuals.
 */
export const LiquidMesh: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-mat-obsidian pointer-events-none">
      {/* 🌫️ The Mist: Layered Radial Blobs */}
      <div className="absolute inset-0 opacity-40 blur-[130px] scale-150">
        
        {/* Deep Wine Pool (Main Anchor) */}
        <motion.div 
          animate={{ 
            x: [0, 100, -50, 0],
            y: [0, -80, 150, 0],
            scale: [1, 1.2, 0.9, 1],
            rotate: [0, 45, -20, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-mat-wine/40"
        />

        {/* Golden Glimmer (Secondary Accent) */}
        <motion.div 
          animate={{ 
            x: [0, -150, 80, 0],
            y: [0, 120, -100, 0],
            scale: [1, 0.8, 1.1, 1],
            rotate: [0, -30, 60, 0]
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-mat-gold/10"
        />

        {/* Ambient Void (Tertiary Balance) */}
        <motion.div 
          animate={{ 
            x: [0, 60, -100, 0],
            y: [0, -150, 70, 0],
            scale: [1.2, 1, 1.3, 1.2],
          }}
          transition={{ duration: 35, repeat: Infinity, ease: "easeInOut", delay: 5 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[#1a0d10]"
        />

        {/* Edge Radiance (Vignette Softener) */}
        <motion.div 
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-gradient-radial from-transparent via-mat-wine/5 to-transparent"
        />
      </div>

      {/* 🎞️ Film Grain Overlay (High-Fidelity Texture) */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none">
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <filter id="grainy-noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#grainy-noise)" />
        </svg>
      </div>

      {/* 🌑 Obsidian Vignette (Focus Layer) */}
      <div className="absolute inset-0 bg-gradient-to-t from-mat-obsidian via-transparent to-mat-obsidian/40" />
      <div className="absolute inset-0 bg-gradient-to-r from-mat-obsidian/20 via-transparent to-mat-obsidian/20" />
    </div>
  );
};
