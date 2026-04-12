import React from 'react';
import { motion } from 'framer-motion';
import Fold from './Fold';
import { ShieldCheck, MessageSquare, Lock, EyeOff, ChevronRight } from 'lucide-react';
import DotGrid from '@/components/bits/DotGrid';

const SystemIntegrityFold: React.FC = () => {
  return (
    <Fold id="integrity" className="bg-mat-obsidian border-b border-white/5 overflow-hidden relative min-h-[100dvh] flex items-center justify-center">
      {/* Background Layer: Lightweight CSS dot pattern — no WebGL */}
      <div className="absolute inset-0 opacity-[0.12] pointer-events-none">
        <DotGrid
          dotSize={3}
          gap={28}
          baseColor="#BFA06A"
        />
      </div>

      <div className="w-full max-w-7xl mx-auto px-6 py-20 relative z-10 flex flex-col justify-center space-y-16">
        {/* Header */}
        <div className="space-y-6 text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-3 py-1 border border-mat-gold/30 rounded-full text-[10px] text-mat-gold tracking-[0.3em] uppercase mb-4"
          >
            Security Manifest
          </motion.div>
          <h2 className="text-5xl md:text-8xl font-display text-mat-cream uppercase leading-[0.85] tracking-tighter">
            System <br /> <span className="text-white/10 italic font-serif lowercase tracking-normal">Integrity</span>
          </h2>
          <p className="text-md text-mat-cream/40 font-light max-w-lg uppercase tracking-widest text-[10px] mx-auto md:mx-0">
            A crystalline infrastructure protecting the selective attention of our collective.
          </p>
        </div>

        {/* Bento Grid: Refined for Glassmorphism against Dark Threads */}
        <div className="grid grid-cols-12 gap-6 h-auto">
          {/* Card 1: Communication */}
          <motion.div 
            whileHover={{ scale: 0.99 }}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="col-span-12 md:col-span-8 bg-white/[0.02] border border-white/10 backdrop-blur-xl p-10 flex flex-col justify-between relative overflow-hidden group min-h-[300px]"
          >
            <div className="absolute -top-10 -right-10 p-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
              <MessageSquare className="w-64 h-64 rotate-12" />
            </div>
            <div className="space-y-6 relative z-10">
              <h3 className="text-3xl font-display text-mat-cream uppercase tracking-tight">Isolated <br/><span className="italic font-serif opacity-30">Channels</span></h3>
              <p className="text-sm text-mat-cream/30 max-w-sm uppercase tracking-wide leading-relaxed">
                Direct access is physically impossible. Every packet of intent is resolved through multi-signature verified mediation.
              </p>
            </div>
            <div className="text-[10px] font-bold text-mat-gold/40 tracking-[0.4em] uppercase pt-4 border-t border-white/5">Protocol v2.4 Encrypted</div>
          </motion.div>

          {/* Card 2: Verification */}
          <motion.div 
            whileHover={{ scale: 0.99 }}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="col-span-12 md:col-span-4 bg-mat-gold/5 text-mat-cream p-10 flex flex-col justify-between border border-mat-gold/20 shadow-2xl min-h-[300px]"
          >
            <ShieldCheck className="w-10 h-10 text-mat-gold mb-8" />
            <div className="space-y-4">
              <h3 className="text-2xl font-display uppercase tracking-tight text-mat-gold">Elite <br/> Credentials</h3>
              <p className="text-[11px] opacity-40 uppercase tracking-[0.2em] leading-loose">Biometric Legacy <br/> Financial Standing <br/> Personal Referrals</p>
            </div>
          </motion.div>

          {/* Card 3: Privacy */}
          <motion.div 
            whileHover={{ scale: 0.99 }}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="col-span-12 md:col-span-4 bg-white/[0.02] p-10 border border-white/5 backdrop-blur-md space-y-6"
          >
            <Lock className="w-6 h-6 text-mat-gold/20" />
            <h3 className="text-xl font-display uppercase text-mat-cream">Zero-Knowledge <br/> Vault</h3>
            <p className="text-[10px] text-mat-cream/20 leading-relaxed uppercase tracking-widest">Identifying data is never stored; only the proof of eligibility persists.</p>
          </motion.div>

          {/* Card 4: Discovery */}
          <motion.div 
            whileHover={{ scale: 0.99 }}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="col-span-12 md:col-span-8 bg-mat-obsidian border border-white/10 p-10 flex flex-col justify-center gap-6 group min-h-[160px]"
          >
            <div className="flex items-center gap-6">
              <EyeOff className="w-8 h-8 text-mat-gold/50 group-hover:scale-110 transition-transform" />
              <h3 className="text-2xl font-display uppercase text-mat-cream tracking-widest">Ghost <br/> Discovery</h3>
            </div>
            <div className="w-24 h-0.5 bg-mat-gold/20" />
          </motion.div>
        </div>
      </div>
    </Fold>
  );
};

export default SystemIntegrityFold;
