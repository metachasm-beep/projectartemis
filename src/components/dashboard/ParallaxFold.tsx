import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ParallaxFoldProps {
  bgImage: string;
  children: React.ReactNode;
  parallaxSpeed?: number;
  overlayClassName?: string;
  className?: string;
  isDark?: boolean;
}

/**
 * 🏔️ ParallaxFold
 * Immersive vertical segment with hardware-accelerated parallax background.
 * Part of the Sovereign Fold Protocol.
 * GSD Compliant: Modular, PWA Optimized.
 */
export const ParallaxFold: React.FC<ParallaxFoldProps> = ({
  bgImage,
  children,
  parallaxSpeed = 0.3,
  overlayClassName = "bg-mat-cream/40",
  className = "",
  isDark = false
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Calculate parallax offset and immersive scale
  const y = useTransform(scrollYProgress, [0, 1], ["0%", `${parallaxSpeed * 100}%`]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.1, 1]);

  return (
    <div 
      ref={containerRef}
      className={`relative min-h-screen w-full overflow-hidden ${className} ${isDark ? 'text-mat-cream' : 'text-mat-wine'}`}
    >
      {/* 🖼️ Sharp Immersive Parallax Background */}
      <motion.div 
        style={{ y, scale }}
        className="absolute inset-x-0 top-[-20%] h-[140%] w-full z-0 pointer-events-none will-change-transform transform-gpu"
      >
        <img 
          src={bgImage} 
          alt="" 
          className="w-full h-full object-cover filter brightness-[0.85] saturate-[1.1]"
        />
        {/* Layered overlays to preserve legibility and transition */}
        <div className={`absolute inset-0 z-10 ${isDark ? 'bg-mat-obsidian/80' : overlayClassName}`} />
        <div className="absolute inset-0 z-20 bg-gradient-to-b from-transparent via-transparent to-black/10" />
      </motion.div>

      {/* 💎 Content Layer */}
      <div className="relative z-30 container mx-auto px-6 py-32 md:py-48 h-full flex flex-col justify-center">
        {children}
      </div>
    </div>
  );
};
