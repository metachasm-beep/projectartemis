import React from 'react';
import { Crown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MatriarchLogoProps {
  className?: string;
  iconOnly?: boolean;
}

export const MatriarchLogo: React.FC<MatriarchLogoProps> = ({ className, iconOnly = false }) => {
  return (
    <div className={cn("flex flex-col items-center gap-2 select-none mat-perspective-1000", className)}>
      <motion.div 
        whileHover={{ rotateY: 10, rotateX: -10, scale: 1.05 }}
        className="relative flex items-center justify-center mat-transform-3d transition-transform duration-500"
      >
        <Crown 
          className="w-12 h-12 text-[#D4AF37] drop-shadow-[0_10px_20px_rgba(212,175,55,0.4)]" 
          strokeWidth={1}
          style={{ filter: 'drop-shadow(0 2px 0 #B8860B) drop-shadow(0 4px 0 #996515) drop-shadow(0 15px 30px rgba(0,0,0,0.3))' }}
        />
      </motion.div>
      
      {!iconOnly && (
        <span 
          className="font-body text-3xl md:text-5xl font-bold tracking-[0.5em] text-transparent bg-clip-text bg-gradient-to-b from-[#F7EF8A] via-[#D4AF37] to-[#B8860B] whitespace-nowrap mat-3d-depth"
        >
          MATRIARCH
        </span>
      )}
    </div>
  );
};

export default MatriarchLogo;
