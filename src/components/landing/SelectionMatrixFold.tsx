import React from 'react';
import { motion } from 'framer-motion';
import Fold from './Fold';
import { ShieldCheck, Zap, Heart, Activity, Crown, ArrowUpRight, MessageSquare, Lock, EyeOff, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const BENTO_ITEMS = [
  {
    title: "Identity Verification",
    desc: "every member is verified to ensure a secure and genuine community.",
    icon: ShieldCheck,
    badges: ["Verified Profiles Only", "0% Ghosting"],
    color: "mat-rose",
    bg: "bg-mat-ivory shadow-sm"
  },
  {
    title: "Precision Matching",
    desc: "real-time matching based on lifestyle, values, and activity. no fake algorithms, just real choices.",
    icon: Zap,
    alignment: "98.4%",
    color: "mat-gold",
    bg: "bg-mat-ivory shadow-sm"
  },
  {
    title: "Safe Haven",
    desc: "a private community designed for high-value dialogue and long-term meaningful connection.",
    icon: Heart,
    footer: "End-to-End Encrypted",
    color: "mat-rose",
    bg: "bg-mat-ivory shadow-sm"
  },
  {
    title: "Quality Network",
    desc: "enhance your profile through verified activity and positive interactions.",
    icon: Activity,
    footer: "Verified status active",
    color: "mat-gold",
    bg: "bg-mat-ivory shadow-xl border-mat-gold/20"
  }
];

const SelectionMatrixFold: React.FC = () => {
  return (
    <Fold id="matrix" className="bg-mat-cream py-16 lg:py-24 border-b border-mat-gold/10">
      <div className="space-y-12 lg:space-y-16">
        {/* Header */}
        <div className="text-left space-y-4 max-w-2xl">
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-mat-wine/60">The Infrastructure</span>
          <h2 className="text-5xl md:text-7xl font-display text-mat-slate leading-[0.9] uppercase tracking-tighter">
            Member <br />
            <span className="text-mat-gold/30 italic font-display">Selection</span>
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
              className={`group relative p-5 lg:p-6 flex flex-col justify-between min-h-[220px] lg:min-h-[240px] border border-mat-gold/10 backdrop-blur-md overflow-hidden ${item.bg}`}
            >
              <div className="space-y-4 relative z-10">
                <div className={`w-10 h-10 flex items-center justify-center rounded-xl bg-mat-gold/5 border border-mat-gold/20 text-mat-gold shadow-md`}>
                  <item.icon className="w-5 h-5" strokeWidth={1} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-display text-mat-slate uppercase leading-none tracking-tight">
                    {item.title.split(' ')[0]} <br/>
                    <span className={`text-mat-gold italic font-display`}>{item.title.split(' ')[1]}</span>
                  </h3>
                  <p className="text-mat-slate/40 font-light text-[11px] leading-relaxed max-w-xs uppercase tracking-wide">
                    {item.desc}
                  </p>
                </div>
              </div>

              {/* Unique Bottom Elements */}
              <div className="relative z-10 w-full pt-4 border-t border-mat-gold/10 mt-4">
                {item.badges && (
                  <div className="flex gap-2">
                    {item.badges.map(b => (
                      <Badge key={b} variant="outline" className="px-3 py-1 text-[8px] font-black uppercase border-mat-gold/10 text-mat-slate/40">
                        {b}
                      </Badge>
                    ))}
                  </div>
                )}
                
                {item.alignment && (
                  <div className="space-y-3">
                    <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-mat-gold">
                      <span>Compatibility</span>
                      <span>{item.alignment}</span>
                    </div>
                    <div className="h-1 bg-mat-gold/10 rounded-full overflow-hidden">
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
                    <span className="text-[9px] font-black uppercase text-mat-slate/30 italic tracking-widest">{item.footer}</span>
                    <ArrowUpRight className="w-5 h-5 text-mat-slate/20 group-hover:text-mat-gold transition-colors" />
                  </div>
                )}
              </div>

              {/* Decorative Background Icon */}
              <item.icon 
                size={220} 
                strokeWidth={0.5} 
                className="absolute -bottom-10 -right-10 opacity-[0.02] rotate-12 group-hover:rotate-0 transition-transform duration-1000 pointer-events-none text-mat-slate" 
              />
            </motion.div>
          ))}
        </div>
      </div>
    </Fold>
  );
};

export default SelectionMatrixFold;
