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
      <div ref={containerRef} className="h-full flex flex-col justify-center space-y-4 lg:space-y-12 py-6 lg:py-12">
        <div className="space-y-2 flex flex-col items-center md:items-start text-center md:text-left">
          <motion.span 
            className="px-4 py-1 border border-mat-gold/10 uppercase tracking-[0.4em] font-black text-[8px] md:text-[9px] bg-mat-gold/5 text-mat-wine rounded-none inline-block"
          >
            The Distinction
          </motion.span>
          <motion.h2 
            style={{ x: titleX }}
            className="text-3xl md:text-7xl font-display text-mat-slate uppercase leading-none opacity-90"
          >
            Chaos vs <span className="text-mat-gold/80 italic">Order</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-8 border border-mat-gold/10 p-0.5 md:p-1">
          <div className="bg-mat-ivory/40 p-4 md:p-10 space-y-4 md:space-y-8 border border-mat-gold/5">
            <div className="flex items-center gap-3 md:gap-4">
              <ZapOff className="text-mat-rose w-4 h-4 md:w-5 md:h-5" strokeWidth={1} />
              <h3 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-mat-slate/30">The Landscape</h3>
            </div>
            <h2 className="text-xl md:text-5xl font-display text-mat-slate uppercase leading-tight">
              Noise is <br /><span className="text-mat-gold/60 italic font-display tracking-normal">The Default</span>
            </h2>
            <div className="space-y-2 md:space-y-4 pt-1">
              {["Endless swiping loops", "Low-intent matches", "Chaotic inboxes", "Fake data scarcity", "No real feminine control"].map(item => (
                <div key={item} className="flex items-center gap-2 md:gap-3 text-mat-slate/40 group">
                  <X className="w-3 h-3 md:w-4 md:h-4 text-mat-rose" strokeWidth={3} />
                  <span className="text-[8px] md:text-[9px] font-bold uppercase tracking-[0.2em]">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-mat-ivory p-4 md:p-10 space-y-4 md:space-y-8 border border-mat-gold/20 relative overflow-hidden shadow-xl">
            {/* Ambient Gold Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-mat-gold/1 blur-[100px] pointer-events-none" />
            
            <div className="flex items-center gap-3 md:gap-4 relative z-10">
              <Crown className="text-mat-gold w-4 h-4 md:w-5 md:h-5" strokeWidth={1} />
              <h3 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-mat-gold">The Protocol</h3>
            </div>
            <h2 className="text-xl md:text-5xl font-display text-mat-slate uppercase leading-tight relative z-10">
              Quality is <br /><span className="text-mat-gold italic font-display tracking-normal">Engineered</span>
            </h2>
            <div className="space-y-2 md:space-y-4 pt-1 relative z-10">
              {["Female-controlled matching", "Curated male visibility", "Deliberate discovery", "Structured communication", "Premium trust and safety"].map(item => (
                <div key={item} className="flex items-center gap-2 md:gap-3 text-mat-slate/80">
                  <div className="w-1 md:w-1.5 h-1 md:h-1.5 bg-mat-gold rounded-full shadow-[0_0_12px_#BFA06A]" />
                  <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em]">{item}</span>
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
