import React from 'react';
import { motion } from 'framer-motion';
import Fold from './Fold';
import { ShieldCheck, Zap, Heart, Activity, Crown, ArrowUpRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const BENTO_ITEMS = [
  {
    title: "Identity Verification",
    desc: "Every initiate undergoes a multi-layer verification sequence to ensure the sanctuary's absolute integrity.",
    icon: ShieldCheck,
    badges: ["Verified Souls Only", "0% Ghosting"],
    color: "mat-rose",
    bg: "bg-mat-rose/5"
  },
  {
    title: "Instant Synchronicity",
    desc: "Real-time matching based on intent, standing, and presence score. No algorithms, just alignment.",
    icon: Zap,
    alignment: "98.4%",
    color: "mat-gold",
    bg: "bg-mat-gold/5"
  },
  {
    title: "Safe Haven",
    desc: "A private sanctuary designed for high-value dialogue and long-term meaningful connection.",
    icon: Heart,
    footer: "End-to-End Encrypted",
    color: "mat-rose",
    bg: "bg-white/5"
  },
  {
    title: "Standing Hierarchy",
    desc: "Earn your standing through verified presence, absolute integrity, and community contribution.",
    icon: Activity,
    footer: "Verified Protocol active",
    color: "mat-cream",
    bg: "bg-mat-obsidian border-mat-rose/20"
  }
];

const SelectionMatrixFold: React.FC = () => {
  return (
    <Fold id="matrix" className="bg-mat-obsidian py-16 lg:py-24">
      <div className="space-y-12 lg:space-y-16">
        {/* Header */}
        <div className="text-left space-y-4 max-w-2xl">
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-mat-rose/40">The Infrastructure</span>
          <h2 className="text-5xl md:text-7xl font-display text-mat-cream leading-[0.9] uppercase tracking-tighter">
            Selection <br />
            <span className="text-white/20 italic">Architecture</span>
          </h2>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {BENTO_ITEMS.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
              className={`group relative p-8 lg:p-10 flex flex-col justify-between min-h-[300px] lg:min-h-[320px] border border-white/5 backdrop-blur-md overflow-hidden ${item.bg}`}
            >
              <div className="space-y-8 relative z-10">
                <div className={`w-14 h-14 flex items-center justify-center rounded-2xl bg-${item.color}/10 border border-${item.color}/20 text-white shadow-lg`}>
                  <item.icon className="w-7 h-7" strokeWidth={1} />
                </div>
                <div className="space-y-4">
                  <h3 className="text-3xl font-display text-mat-cream uppercase leading-none tracking-tight">
                    {item.title.split(' ')[0]} <br/>
                    <span className={`text-${item.color} italic font-serif`}>{item.title.split(' ')[1]}</span>
                  </h3>
                  <p className="text-mat-cream/40 font-light text-sm leading-relaxed max-w-xs uppercase tracking-wide">
                    {item.desc}
                  </p>
                </div>
              </div>

              {/* Unique Bottom Elements */}
              <div className="relative z-10 w-full pt-8 border-t border-white/5 mt-8">
                {item.badges && (
                  <div className="flex gap-2">
                    {item.badges.map(b => (
                      <Badge key={b} variant="outline" className="px-3 py-1 text-[8px] font-black uppercase border-white/5 text-mat-cream/40">
                        {b}
                      </Badge>
                    ))}
                  </div>
                )}
                
                {item.alignment && (
                  <div className="space-y-3">
                    <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-mat-gold">
                      <span>Matrix Alignment</span>
                      <span>{item.alignment}</span>
                    </div>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ x: "-100%" }}
                        whileInView={{ x: "0%" }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="h-full w-full bg-mat-gold shadow-[0_0_10px_#BFA06A]" 
                      />
                    </div>
                  </div>
                )}

                {item.footer && (
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black uppercase text-white/30 italic tracking-widest">{item.footer}</span>
                    <ArrowUpRight className="w-5 h-5 text-white/20 group-hover:text-mat-gold transition-colors" />
                  </div>
                )}
              </div>

              {/* Decorative Background Icon */}
              <item.icon 
                size={220} 
                strokeWidth={0.5} 
                className="absolute -bottom-10 -right-10 opacity-[0.02] rotate-12 group-hover:rotate-0 transition-transform duration-1000 pointer-events-none text-white" 
              />
            </motion.div>
          ))}
        </div>
      </div>
    </Fold>
  );
};

export default SelectionMatrixFold;
