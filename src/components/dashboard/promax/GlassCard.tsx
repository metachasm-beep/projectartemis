import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  noPadding?: boolean;
  allowOverflow?: boolean;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

/**
 * 🥂 GlassCard 2.0: The Silk Frame
 * Redesigned for a 'Modern, Sleek, Feminine' editorial aesthetic.
 * Focuses on extreme border precision, high transparency, and static textures.
 */
export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className,
  delay = 0,
  noPadding = false,
  onClick
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
      className={cn(
        "relative group transition-all duration-700 bg-white/5 border border-white/10 rounded-[1.25rem]",
        !allowOverflow && "overflow-hidden",
        className
      )}
      onClick={onClick}
    >
      {/* 🧩 Static Glass Base (Backdrop blur) */}
      <div className="absolute inset-0 mat-glass-refraction z-0 pointer-events-none" />
      
      {/* 🔮 Dynamic Glare Layer - Handled as a static fade on hover for max performance */}
      <motion.div 
        className="absolute w-full h-full bg-white opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500 pointer-events-none z-10"
      />
      
      {/* 🎞️ Micro-Grain Texture (Static) */}
      <div className="absolute inset-0 opacity-[0.01] pointer-events-none z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      
      <div className={cn("relative z-30 h-full", !noPadding && "p-8")}>
        {children}
      </div>
    </motion.div>
  );
};
