import React, { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

/**
 * 💎 GlassCard: High-Fidelity Refractive Container
 * Implements 3D tilt, deep blur, and moving edge highlights
 * for the 'Liquid Glassmorphism' aesthetic.
 */
export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = '',
  delay = 0 
}) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 30, stiffness: 300 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [5, -5]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-5, 5]), springConfig);

  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseXPos = e.clientX - rect.left;
    const mouseYPos = e.clientY - rect.top;

    x.set(mouseXPos / width - 0.5);
    y.set(mouseYPos / height - 0.5);
    mouseX.set(mouseXPos);
    mouseY.set(mouseYPos);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  const glareBackground = useTransform(
    [smoothMouseX, smoothMouseY],
    ([xPos, yPos]) => `radial-gradient(400px circle at ${xPos}px ${yPos}px, rgba(255, 255, 255, 0.08), transparent 80%)`
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        perspective: 1000,
        transformStyle: "preserve-3d",
      }}
      className={`relative overflow-hidden group transition-all duration-700 ${className}`}
    >
      <div className="absolute inset-0 rounded-[2.5rem] mat-glass-refraction z-0" />
      
      {/* 🔮 Dynamic Glare Layer (Moves with cursor) */}
      <motion.div 
        className="absolute inset-0 pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: glareBackground }}
      />
      
      {/* 🎞️ Micro-Grain Texture */}
      <div 
        className="absolute inset-0 opacity-[0.02] pointer-events-none z-0" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
      
      {/* 🌈 Prismatic Edge Reflection */}
      <div className="absolute inset-0 border border-white/10 rounded-[2.5rem] pointer-events-none z-20 group-hover:border-white/20 transition-colors duration-500" />

      <motion.div 
        style={{ transform: "translateZ(20px)" }}
        className="relative z-30 p-8 h-full"
      >
        {children}
      </motion.div>
    </motion.div>
  );
};
