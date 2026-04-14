import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

/**
 * 🥂 GlassCard 2.0: The Silk Frame
 * Redesigned for a 'Modern, Sleek, Feminine' editorial aesthetic.
 * Focuses on extreme border precision, high transparency, and static textures.
 */
export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className,
  delay = 0 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 1.2, 
        delay, 
        ease: [0.16, 1, 0.3, 1] 
      }}
      className={`relative overflow-hidden group transition-all duration-700 bg-white/5 border border-white/10 rounded-[2.5rem] ${className}`}
    >
      {/* 🧩 Static Glass Base (Backdrop blur) */}
      <div className="absolute inset-0 mat-glass-refraction z-0 pointer-events-none" />
      
      {/* 🔮 Dynamic Glare Layer - Handled as a moving blob for max performance */}
      <motion.div 
        className="absolute w-[300px] h-[300px] bg-white opacity-0 group-hover:opacity-[0.05] rounded-full blur-[60px] pointer-events-none z-10 transition-opacity duration-300"
        style={{ 
          x: useTransform(smoothMouseX, (v) => v - 150), 
          y: useTransform(smoothMouseY, (v) => v - 150) 
        }}
      />
      
      {/* 🎞️ Micro-Grain Texture (Static) */}
      <div 
        className="absolute inset-0 opacity-[0.01] pointer-events-none z-0" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
      
      <div className="relative z-30 p-8 h-full">
        {children}
      </div>
    </motion.div>
  );
};
