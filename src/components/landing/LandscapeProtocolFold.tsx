import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Fold from './Fold';
import { ZapOff, Crown, X } from 'lucide-react';

const LandscapeProtocolFold: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const titleX = useTransform(scrollYProgress, [0, 1], [15, -15]);

  return (
    <Fold id="landscape-protocol" className="bg-mat-cream border-t border-black/5 py-0 overflow-hidden">
      <div ref={containerRef} className="h-full flex flex-col justify-center space-y-8 lg:space-y-12 py-12">
        <div className="space-y-4 flex flex-col items-center md:items-start text-center md:text-left">
          <motion.span 
            className="px-4 py-1 border border-black/10 uppercase tracking-[0.4em] font-black text-[9px] bg-black/5 text-mat-obsidian rounded-none inline-block"
          >
            The Distinction
          </motion.span>
          <motion.h2 
            style={{ x: titleX }}
            className="text-4xl md:text-7xl font-display text-mat-obsidian uppercase leading-none opacity-90"
          >
            Chaos vs <span className="text-black/20 italic">Order</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 border border-black/5 p-1">
          <div className="bg-black/[0.02] p-10 space-y-8 border border-black/5">
            <div className="flex items-center gap-4">
              <ZapOff className="text-mat-rose w-5 h-5" strokeWidth={1} />
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-mat-obsidian/30">The Landscape</h3>
            </div>
            <h2 className="text-3xl md:text-5xl font-display text-mat-obsidian uppercase leading-tight">
              Noise is <br /><span className="text-black/10 italic font-serif lowercase tracking-normal">The Default</span>
            </h2>
            <div className="space-y-4 pt-2">
              {["Endless swiping loops", "Low-intent matches", "Chaotic inboxes", "Fake data scarcity", "No real feminine control"].map(item => (
                <div key={item} className="flex items-center gap-3 text-mat-obsidian/40 group">
                  <X className="w-4 h-4 text-mat-rose" strokeWidth={3} />
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em]">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-mat-obsidian p-10 space-y-8 border border-black/5 relative overflow-hidden">
            {/* Ambient Gold Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-mat-gold/5 blur-[100px] pointer-events-none" />
            
            <div className="flex items-center gap-4 relative z-10">
              <Crown className="text-mat-gold w-5 h-5" strokeWidth={1} />
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-mat-gold">The Protocol</h3>
            </div>
            <h2 className="text-3xl md:text-5xl font-display text-mat-cream uppercase leading-tight relative z-10">
              Quality is <br /><span className="text-mat-gold italic font-serif lowercase tracking-normal">Engineered</span>
            </h2>
            <div className="space-y-4 pt-2 relative z-10">
              {["Female-controlled matching", "Curated male visibility", "Deliberate discovery", "Structured communication", "Premium trust and safety"].map(item => (
                <div key={item} className="flex items-center gap-3 text-mat-cream/80">
                  <div className="w-1.5 h-1.5 bg-mat-gold rounded-full shadow-[0_0_12px_#BFA06A]" />
                  <span className="text-[9px] font-black uppercase tracking-[0.2em]">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Fold>
  );
};

export default LandscapeProtocolFold;
