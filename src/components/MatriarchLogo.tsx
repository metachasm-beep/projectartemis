import React from 'react';
import { Crown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MatriarchLogoProps {
  className?: string;
  iconOnly?: boolean;
}

export const MatriarchLogo: React.FC<MatriarchLogoProps> = ({ className, iconOnly = false }) => {
  return (
    <div className={cn("flex flex-col items-center gap-2 select-none", className)}>
      <div className="relative flex items-center justify-center">
        <Crown 
          className="w-10 h-10 text-mat-rose-gold" 
          strokeWidth={1.5}
        />
      </div>
      
      {!iconOnly && (
        <span className="font-display text-3xl font-bold tracking-[0.3em] uppercase bg-gradient-to-b from-[#D4AF37] via-[#F7EF8A] to-[#D4AF37] bg-clip-text text-transparent whitespace-nowrap drop-shadow-sm">
          MATRIARCH
        </span>
      )}
    </div>
  );
};

export default MatriarchLogo;
