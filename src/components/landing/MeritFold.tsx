import React from 'react';
import { motion } from 'framer-motion';
import Fold from './Fold';
import { Crown, Zap, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const MeritFold: React.FC = () => {
  return (
    <Fold id="merit" className="bg-mat-obsidian py-32 border-b border-white/5">
      <div className="grid lg:grid-cols-2 gap-24 items-start pt-12">
        {/* Left: Copy and Stats */}
        <div className="space-y-12">
          <div className="space-y-6">
            <Badge variant="outline" className="px-5 py-1 uppercase tracking-[0.4em] font-black text-[9px] border-mat-gold/20 text-mat-gold/60 bg-mat-gold/5 rounded-none">
              The Seeker Protocol
            </Badge>
            <h2 className="text-5xl md:text-8xl font-display text-mat-cream uppercase leading-[0.9]">
              Excellence <br /><span className="text-white/20 italic">of Merit</span>
            </h2>
            <p className="text-xl text-mat-cream/60 font-light leading-relaxed max-w-xl">
              On Matriarch, visibility is not bought. It is earned through integrity, verification, and absolute standing.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/10">
            {[
              { label: "Integrity", val: "99%" },
              { label: "Elite Tier", val: "Top 1%" },
              { label: "Auth Status", val: "Verified" },
              { label: "Standing", val: "Absolute" }
            ].map(item => (
              <div key={item.label} className="space-y-2">
                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/30 italic">{item.label}</span>
                <span className="text-3xl md:text-5xl font-display text-mat-gold block tracking-tighter">{item.val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Merit UI Mockup + Rewards */}
        <div className="space-y-8 w-full max-w-lg mx-auto lg:max-w-none">
          {/* Card Mockup */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="mat-glass-deep border-mat-gold/20 p-8 md:p-12 bg-white/5 space-y-10 rounded-[2.5rem] relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-mat-gold/10 blur-[60px]" />
            
            <div className="flex justify-between items-center relative z-10">
              <div className="space-y-1">
                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-mat-gold italic">Merit Status</span>
                <h4 className="text-3xl md:text-4xl font-display text-mat-cream uppercase tracking-tight">Elite Tier</h4>
              </div>
              <div className="w-16 h-16 bg-mat-gold/10 backdrop-blur-xl border border-mat-gold/20 grid place-items-center rounded-2xl">
                <Crown className="w-8 h-8 text-mat-gold" strokeWidth={1} />
              </div>
            </div>

            <div className="space-y-4 relative z-10">
              <div className="flex justify-between items-end">
                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/30 italic">Visibility Index</span>
                <span className="text-4xl font-display text-mat-cream">99.4</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden relative">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: '99.4%' }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="absolute inset-y-0 left-0 bg-mat-gold shadow-[0_0_15px_#BFA06A]" 
                />
              </div>
            </div>
            
            <div className="pt-4 text-center">
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20">Absolute Priority Selection</span>
            </div>
          </motion.div>

          {/* Economy Mini Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {[
               { title: "Daily Entry", reward: "+10", icon: Zap },
               { title: "7 Day Streak", reward: "+100", icon: Star }
             ].map((item, i) => (
                <div key={i} className="bg-white/5 border border-white/5 p-6 rounded-3xl group hover:bg-mat-gold/10 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-mat-gold">
                      <item.icon size={18} />
                    </div>
                    <div>
                      <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30">{item.title}</h4>
                      <div className="text-2xl font-display text-mat-cream">{item.reward}</div>
                    </div>
                  </div>
                </div>
             ))}
          </div>
        </div>
      </div>
    </Fold>
  );
};

export default MeritFold;
