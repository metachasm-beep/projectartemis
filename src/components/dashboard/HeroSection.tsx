import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from "@/components/ui/badge";
import { maskReveal, scaleInBreathe, springSlide } from '@/utils/animations';
import heroWoman from '@/assets/hero_woman.jpg';

interface HeroSectionProps {
  displayName?: string;
  points?: number;
  onBoost?: () => void;
}

/**
 * 🏛️ Sovereign Hero Section
 * Implements Mask-Reveal headlines and Scale-In Breathe ritual.
 * GSD Compliant: Modular, Hardware Accelerated.
 */
export const HeroSection: React.FC<HeroSectionProps> = ({ 
  points = 0, 
  onBoost 
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 pb-16 border-b border-mat-rose/20 relative pt-12 overflow-hidden">
      <div className="space-y-8 relative z-10">
        <motion.div variants={springSlide}>
          <Badge variant="outline" className="mat-text-label-pro px-8 py-3 border-mat-rose/30 text-mat-rose rounded-full bg-white/40 backdrop-blur-md">
            The Inner Sanctuary
          </Badge>
        </motion.div>
        
        <div className="overflow-hidden">
          <motion.div 
            variants={maskReveal} 
            className="mat-text-display-pro text-mat-wine leading-[0.9] transform-gpu"
          >
            Welcome to the <br />
            <span className="text-mat-rose/30 italic">Inner Sanctuary.</span>
          </motion.div>
        </div>
      </div>

      {/* 🌸 Hero Background Ritual */}
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none overflow-hidden blur-2xl md:blur-none">
        <motion.img 
          variants={scaleInBreathe} 
          initial="initial"
          animate={["animate", "breathe"]}
          src={heroWoman} 
          className="w-full h-full object-cover transform-gpu"
        />
      </div>
    </div>
  );
};
