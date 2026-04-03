import React from 'react';
import { Crown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MatriarchLogoProps {
  className?: string;
  iconOnly?: boolean;
}

export const MatriarchLogo: React.FC<MatriarchLogoProps> = ({ className, iconOnly = false }) => {
  return (
    <div className={cn("flex items-center gap-3 select-none", className)}>
      <div className="relative flex items-center justify-center">
        <Crown 
          className="w-8 h-8 text-matriarch-gold fill-matriarch-gold/20 filter drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]" 
          strokeWidth={1.5}
        />
        <div className="absolute inset-0 bg-matriarch-gold/20 blur-xl rounded-full" />
      </div>
      
      {!iconOnly && (
        <span className="font-display text-2xl font-semibold tracking-tight text-white">
          MATRIARCH
          <span className="text-matriarch-gold">.</span>
        </span>
      )}
    </div>
  );
};

export default MatriarchLogo;
