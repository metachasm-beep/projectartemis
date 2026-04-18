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
        className="relative flex items-center justify-center w-20 h-20 rounded-2xl mat-satin-rose mat-transform-3d transition-all duration-700 shadow-xl overflow-hidden"
      >
        <Crown 
          className="w-10 h-10 text-white drop-shadow-lg" 
          strokeWidth={1}
        />
      </motion.div>
      
      {!iconOnly && (
        <span 
          className="text-xl md:text-2xl mat-text-editorial tracking-[0.4em] uppercase whitespace-nowrap"
        >
          MATRIARCH
        </span>
      )}
    </div>
  );
};

export default MatriarchLogo;
