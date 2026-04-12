import React from 'react';
import { motion } from 'framer-motion';
import Fold from './Fold';
import { UserCheck, Zap, Shield, Star, Crown, Lock } from 'lucide-react';

const FEATURES = [
  { title: "Women-first matching", desc: "Men do not browse women. Women decide who gets access to their time.", icon: UserCheck },
  { title: "Curated Discovery", desc: "Profiles are accessed through a smart system based on quality and relevance.", icon: Zap },
  { title: "Communication Modes", desc: "After matching, the woman selects exactly how the interaction starts.", icon: Shield },
  { title: "High-trust profiles", desc: "Verification and elite referrals are built into the core experience.", icon: Star },
  { title: "Intentional Standing", desc: "Men improve visibility through substance, not swiping volume.", icon: Crown },
  { title: "Private Architecture", desc: "Designed like a private salon, not a public attention feed.", icon: Lock },
];

const SystemIntegrityFold: React.FC = () => {
  return (
    <Fold id="integrity" className="bg-mat-cream py-32 border-b border-black/5">
      <div className="space-y-24">
        {/* Header */}
        <div className="mb-16 lg:mb-24 space-y-6">
          <h2 className="text-4xl md:text-8xl font-display text-mat-obsidian uppercase leading-[0.85]">
            System <br /> <span className="text-black/20 italic font-serif lowercase tracking-normal">Integrity</span>
          </h2>
          <p className="text-xl text-mat-obsidian/60 font-light max-w-xl">
            Designed for women who value their time and selective attention.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
          {FEATURES.map((f, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex gap-8 group"
            >
              <div className="shrink-0 pt-1">
                <f.icon 
                  className="w-10 h-10 text-mat-obsidian/20 group-hover:text-mat-rose transition-all duration-700" 
                  strokeWidth={1} 
                />
              </div>
              <div className="space-y-4">
                <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-mat-obsidian leading-tight">
                  {f.title}
                </h3>
                <p className="text-sm text-mat-obsidian/50 leading-relaxed font-medium">
                  {f.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Fold>
  );
};

export default SystemIntegrityFold;
