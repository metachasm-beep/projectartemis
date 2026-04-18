import React from 'react';
import { Crown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface MatriarchLogoProps {
  className?: string;
  iconOnly?: boolean;
}

export const MatriarchLogo: React.FC<MatriarchLogoProps> = ({ className, iconOnly = false }) => {
  return (
    <div className={cn("flex flex-col items-center gap-6 select-none mat-perspective-1000", className)}>
      <motion.div 
        whileHover={{ rotateY: 15, rotateX: -10, scale: 1.1 }}
        className="relative flex items-center justify-center w-20 h-20 rounded-2xl mat-iridescent-glass mat-transform-3d transition-all duration-700 shadow-2xl"
      >
        <Crown 
          className="w-10 h-10 text-white/90 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" 
          strokeWidth={0.5}
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-mat-gold/20 via-transparent to-white/20 animate-pulse" />
      </motion.div>
      
      {!iconOnly && (
        <span 
          className="font-body text-xl md:text-2xl font-light tracking-[0.8em] uppercase mat-text-holographic whitespace-nowrap"
        >
          MATRIARCH
        </span>
      )}
    </div>
  );
};

export default MatriarchLogo;
