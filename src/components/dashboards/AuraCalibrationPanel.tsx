import React from 'react';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";

interface AuraCalibrationPanelProps {
  integrity: number;
}

export const AuraCalibrationPanel: React.FC<AuraCalibrationPanelProps> = ({ integrity }) => {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (integrity / 100) * circumference;
  
  const auraColor = integrity > 80 ? 'var(--color-mat-rose-gold)' : 
                    integrity > 50 ? 'var(--color-mat-gold)' : 
                    '#444';

  return (
    <div className="relative w-32 h-32 flex items-center justify-center group/aura" style={{ '--aura-color': auraColor } as any}>
      <svg className="w-full h-full -rotate-90">
        <circle cx="64" cy="64" r={radius} fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
        <motion.circle 
          cx="64" cy="64" r={radius} fill="transparent" 
          stroke={auraColor} strokeWidth="4" strokeLinecap="round"
          className="aura-meter-ring"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
        />
      </svg>
      <div className={cn(
        "absolute inset-4 rounded-full flex flex-col items-center justify-center transition-all duration-700",
        integrity > 70 ? "aura-glow-rose" : "aura-glow-gold"
      )}>
        <span className="text-2xl font-black text-white leading-none italic">{integrity}%</span>
        <span className="text-[7px] uppercase tracking-widest text-white/40 mt-1">Aura Level</span>
      </div>
    </div>
  );
};
