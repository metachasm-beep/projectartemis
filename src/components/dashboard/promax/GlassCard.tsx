import React, { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = '',
  delay = 0 
}) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const [isHovered, setIsHovered] = useState(false);

  const springConfig = { damping: 25, stiffness: 200 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const background = useTransform(
    [smoothX, smoothY],
    ([x, y]) => `radial-gradient(600px circle at ${x}px ${y}px, rgba(114, 47, 55, 0.15), transparent 40%)`
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#0a0a0a]/60 backdrop-blur-3xl shadow-2xl transition-shadow duration-300 group ${className}`}
      style={{
        boxShadow: isHovered ? '0 0 40px rgba(114, 47, 55, 0.1)' : 'none'
      }}
    >
      {/* 🔮 Reactive Spectral Border */}
      <motion.div 
        className="absolute inset-0 pointer-events-none z-0"
        style={{ background }}
      />
      
      {/* 🏗️ Industrial Grain Detail */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
      
      {/* 🌈 Edge Highlight */}
      <div className="absolute inset-0 border border-white/5 rounded-[2.5rem] pointer-events-none" />

      <div className="relative z-10 p-8 h-full">
        {children}
      </div>
    </motion.div>
  );
};
