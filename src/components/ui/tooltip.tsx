import React, { useState, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * 🍷 MATRIARCH Tooltip Sanctuary
 * A high-fidelity, Radix-like context structure with custom Framer Motion resonance.
 */

interface TooltipContextType {
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
}

const TooltipContext = createContext<TooltipContextType | undefined>(undefined);

export const TooltipProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => <>{children}</>;

export const Tooltip: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  return (
    <TooltipContext.Provider value={{ isVisible, setIsVisible }}>
      <div 
        className="relative inline-block"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
    </TooltipContext.Provider>
  );
};

export const TooltipTrigger: React.FC<{ children: React.ReactNode; asChild?: boolean }> = ({ children }) => {
  return <>{children}</>;
};

export const TooltipContent: React.FC<{ 
  align?: 'start' | 'center' | 'end';
  className?: string 
}> = ({ 
  children, 
  side = 'top',
  align = 'center',
  className = ""
}) => {
  const context = useContext(TooltipContext);
  if (!context) throw new Error("TooltipContent must be used within a Tooltip component.");

  const alignStyles = {
    start: 'left-0',
    center: 'left-1/2 -translate-x-1/2',
    end: 'right-0'
  };

  const positionClasses = {
    top: cn('bottom-full mb-3', alignStyles[align]),
    bottom: cn('top-full mt-3', alignStyles[align]),
    left: 'right-full top-1/2 -translate-y-1/2 mr-3',
    right: 'left-full top-1/2 -translate-y-1/2 ml-3'
  };

  const arrowStyles = {
    start: 'left-4',
    center: 'left-1/2 -translate-x-1/2',
    end: 'right-4'
  };

  const arrowClasses = {
    top: cn('top-full border-t-mat-wine', arrowStyles[align]),
    bottom: cn('bottom-full border-b-mat-wine', arrowStyles[align]),
    left: 'left-full top-1/2 -translate-y-1/2 border-l-mat-wine',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-mat-wine'
  };

  return (
    <AnimatePresence>
      {context.isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: side === 'top' ? 5 : side === 'bottom' ? -5 : 0 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: side === 'top' ? 5 : side === 'bottom' ? -5 : 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className={cn(
            "absolute z-[200] px-4 py-2 bg-mat-wine text-mat-cream text-[10px] font-bold uppercase tracking-widest rounded-xl shadow-mat-premium pointer-events-none whitespace-normal",
            positionClasses[side],
            className
          )}
        >
          {children}
          <div className={cn("absolute border-4 border-transparent", arrowClasses[side])} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
