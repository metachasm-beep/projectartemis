import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

/**
 * 🌊 LiquidMesh: Reactive High-Fidelity Fluid Background
 * Implements cursor-following mesh gradients and refractive textures
 * for the 'Liquid Glassmorphism' aesthetic.
 */
export const LiquidMesh: React.FC = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 50, stiffness: 300 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX / window.innerWidth);
      mouseY.set(e.clientY / window.innerHeight);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const gradientX = useTransform(smoothX, [0, 1], ['20%', '80%']);
  const gradientY = useTransform(smoothY, [0, 1], ['20%', '80%']);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-mat-ivory pointer-events-none">
      {/* 🔮 Primary Reactive Pulse (Liquid Glow) */}
      <motion.div 
        className="absolute inset-0 will-change-transform"
        style={{
          background: useTransform(
            [gradientX, gradientY],
            ([x, y]) => `radial-gradient(circle at ${x} ${y}, rgba(77, 159, 255, 0.15) 0%, transparent 60%)`
          )
        }}
      />

      {/* 🫧 Ambient Secondary Drifts */}
      <div 
        className="absolute inset-0 opacity-20 mix-blend-multiply"
        style={{
          background: `
            radial-gradient(circle at 10% 20%, rgba(255, 77, 141, 0.1) 0%, transparent 40%),
            radial-gradient(circle at 90% 80%, rgba(77, 159, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(201, 110, 80, 0.05) 0%, transparent 70%)
          `
        }}
      />

      {/* 📽️ High-Fidelity Refractive Texture (Moving Noise) */}
      <motion.div 
        animate={{ 
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{ 
          duration: 40, 
          repeat: Infinity, 
          ease: "linear" 
        }}
        className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundSize: '400px 400px'
        }}
      />

      {/* 🏺 Prismatic Vignette */}
      <div className="absolute inset-0 bg-gradient-to-tr from-mat-accent-blue/5 via-transparent to-mat-accent-rose/5" />
      <div className="absolute inset-0 backdrop-blur-[2px]" />
    </div>
  );
};

export default LiquidMesh;
