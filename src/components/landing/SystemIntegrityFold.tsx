import React from 'react';
import { motion } from 'framer-motion';
import Fold from './Fold';
import { ShieldCheck, MessageSquare, Lock, EyeOff, ChevronRight } from 'lucide-react';

const SystemIntegrityFold: React.FC = () => {
  return (
    <Fold id="integrity" className="bg-mat-cream py-12 lg:py-16 border-b border-black/5 overflow-hidden">
      <div className="h-full flex flex-col justify-center space-y-10">
        {/* Header */}
        <div className="space-y-4">
          <h2 className="text-4xl md:text-7xl font-display text-mat-obsidian uppercase leading-[0.85] tracking-tighter">
            System <br /> <span className="text-black/10 italic font-serif lowercase tracking-normal">Integrity</span>
          </h2>
          <p className="text-md text-mat-obsidian/60 font-light max-w-lg uppercase tracking-widest text-[10px]">
            Designed for women who value their time and selective attention.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-12 gap-4 h-auto lg:h-[500px]">
          {/* Card 1: Communication */}
          <motion.div 
            whileHover={{ scale: 0.99 }}
            className="col-span-12 md:col-span-8 bg-black/[0.03] border border-black/5 p-8 flex flex-col justify-between relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <MessageSquare className="w-32 h-32 rotate-12" />
            </div>
            <div className="space-y-4 relative z-10">
              <h3 className="text-2xl font-display text-mat-obsidian uppercase">Communication <br/><span className="italic font-serif opacity-30">Isolation</span></h3>
              <p className="text-sm text-black/40 max-w-sm uppercase tracking-wide leading-relaxed">
                Direct, unbuffered access is restricted. Every interaction passes through our elite mediation protocol.
              </p>
            </div>
            <div className="text-[10px] font-bold text-mat-obsidian/20 tracking-[0.4em] uppercase pt-4 border-t border-black/5">Protocol v2.4 Active</div>
          </motion.div>

          {/* Card 2: Verification */}
          <motion.div 
            whileHover={{ scale: 0.99 }}
            className="col-span-12 md:col-span-4 bg-mat-obsidian text-mat-cream p-8 flex flex-col justify-between border border-black/5 shadow-2xl"
          >
            <ShieldCheck className="w-8 h-8 text-mat-gold mb-8" />
            <div className="space-y-2">
              <h3 className="text-xl font-display uppercase tracking-tight">Multi-Layer <br/> Verification</h3>
              <p className="text-[10px] opacity-40 uppercase tracking-widest">Biometric // Standing // Referral</p>
            </div>
          </motion.div>

          {/* Card 3: Privacy */}
          <motion.div 
            whileHover={{ scale: 0.99 }}
            className="col-span-12 md:col-span-4 bg-white p-8 border border-black/5 shadow-sm space-y-4"
          >
            <Lock className="w-5 h-5 text-mat-obsidian/20" />
            <h3 className="text-lg font-display uppercase text-mat-obsidian">Privacy <br/>Infrastructure</h3>
            <p className="text-[9px] text-black/30 leading-relaxed uppercase tracking-widest">Zero-knowledge proofs for absolute anonymity in public tiers.</p>
          </motion.div>

          {/* Card 4: Discovery */}
          <motion.div 
            whileHover={{ scale: 0.99 }}
            className="col-span-12 md:col-span-5 bg-mat-gold/[0.05] border border-mat-gold/20 p-8 flex flex-col justify-center gap-4 group"
          >
            <EyeOff className="w-6 h-6 text-mat-gold group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-display uppercase text-mat-obsidian">Selective <br/>Discovery</h3>
            <div className="w-12 h-0.5 bg-mat-gold/30" />
          </motion.div>

          {/* Card 5: Moderation */}
          <motion.div 
            whileHover={{ scale: 0.99 }}
            className="col-span-12 md:col-span-3 bg-black/[0.02] border border-black/5 p-8 flex items-end justify-between"
          >
            <h3 className="text-sm font-black uppercase tracking-[0.3em] text-mat-obsidian/40 vertical-text rotate-180">Moderated</h3>
            <ChevronRight className="w-6 h-6 text-black/10" />
          </motion.div>
        </div>
      </div>
    </Fold>
  );
};

export default SystemIntegrityFold;
