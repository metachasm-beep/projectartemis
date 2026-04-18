import React from 'react';
import { Crown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MatriarchLogoProps {
  className?: string;
  iconOnly?: boolean;
}

export const MatriarchLogo: React.FC<MatriarchLogoProps> = ({ className, iconOnly = false }) => {
  return (
    <div className={cn("flex flex-col items-center gap-4 select-none px-12 py-6 rounded-full mat-glass-silk", className)}>
      <div className="relative flex items-center justify-center">
        <Crown 
          className="w-10 h-10 text-slate-800" 
          strokeWidth={1}
        />
      </div>
      
      {!iconOnly && (
        <span className="font-body text-2xl font-semibold tracking-[0.5em] text-slate-900 whitespace-nowrap">
          MATRIARCH
        </span>
      )}
    </div>
  );
};

export default MatriarchLogo;
