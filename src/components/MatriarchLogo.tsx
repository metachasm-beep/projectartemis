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
          className="w-8 h-8 text-black" 
          strokeWidth={1.5}
        />
      </div>
      
      {!iconOnly && (
        <span className="font-display text-2xl font-black tracking-tight text-black">
          MATRIARCH
          <span className="text-black">.</span>
        </span>
      )}
    </div>
  );
};

export default MatriarchLogo;
