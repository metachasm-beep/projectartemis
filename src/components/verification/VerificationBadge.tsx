import React from 'react';
import { ShieldCheck, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export const VerificationBadge: React.FC<{ verified?: boolean; className?: string }> = ({ verified, className = "" }) => {
  if (!verified) return null;

  return (
    <motion.div 
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`relative flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 border border-mat-gold/50 backdrop-blur-md overflow-hidden group ${className}`}
    >
      {/* Holographic Glint Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none" />
      
      <div className="relative text-mat-gold flex items-center justify-center">
        <ShieldCheck size={14} className="drop-shadow-[0_0_8px_rgba(212,175,55,0.8)]" />
      </div>
      
      <span className="relative text-[9px] font-black uppercase tracking-[0.2em] text-mat-cream">
        Trust Verified
      </span>

      <Sparkles size={8} className="absolute -top-1 -right-1 text-mat-gold animate-pulse" />
    </motion.div>
  );
};
