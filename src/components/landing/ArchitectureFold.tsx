import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Fold from './Fold';
import { Heart, ZapOff, Crown, X } from 'lucide-react';
import { SEO_COPY } from '@/content/copy';

const ArchitectureFold: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const titleX = useTransform(scrollYProgress, [0, 1], [-100, 100]);

  return (
    <Fold id="architecture" className="py-24 bg-mat-obsidian border-t border-mat-rose/10">
      <div ref={containerRef} className="space-y-32">
        {/* Section 1: The Steps */}
        <div className="space-y-16">
          <div className="space-y-6">
            <motion.span 
              className="px-4 py-1 border border-mat-rose/20 uppercase tracking-[0.4em] font-black text-[9px] bg-mat-rose/5 text-mat-rose rounded-none inline-block"
            >
              The Architecture
            </motion.span>
            <motion.h2 
              style={{ x: titleX }}
              className="text-5xl md:text-8xl font-display text-mat-cream uppercase leading-none opacity-90"
            >
              How it <span className="text-mat-rose/30 italic">Works</span>
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {SEO_COPY.landing.how_it_works.steps.map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/5 backdrop-blur-sm border border-white/5 p-10 group hover:border-mat-gold/30 transition-all duration-700 flex flex-col justify-between min-h-[400px]"
              >
                <div className="space-y-8">
                  <div className="w-14 h-14 bg-mat-cream/5 border border-mat-cream/10 flex items-center justify-center group-hover:bg-mat-gold group-hover:text-mat-obsidian transition-all duration-500">
                    <Heart className="w-7 h-7" strokeWidth={1} />
                  </div>
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] mb-3 text-mat-rose/40 italic">{step.title}</h3>
                    <h4 className="text-3xl md:text-4xl font-display text-mat-cream leading-tight uppercase tracking-tight">{step.label}</h4>
                  </div>
                </div>
                <p className="text-sm text-mat-cream/40 leading-relaxed font-light mt-8 border-t border-white/5 pt-8">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Section 2: Pain vs Solution Protocol */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 border border-white/5 p-1">
          <div className="bg-white/2 p-12 space-y-10 border border-white/5">
            <div className="flex items-center gap-4">
              <ZapOff className="text-mat-rose/30 w-6 h-6" strokeWidth={1} />
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-mat-cream/30">The Landscape</h3>
            </div>
            <h2 className="text-4xl md:text-6xl font-display text-mat-cream uppercase leading-tight">
              Noise is <br /><span className="text-mat-cream/20 italic font-serif lowercase tracking-normal">The Default</span>
            </h2>
            <div className="space-y-6 pt-4">
              {["Endless swiping loops", "Low-intent matches", "Chaotic inboxes", "Fake data scarcity", "No real feminine control"].map(item => (
                <div key={item} className="flex items-center gap-4 text-mat-cream/40 group">
                  <X className="w-4 h-4 text-mat-rose/40" strokeWidth={3} />
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em]">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-mat-gold/[0.03] p-12 space-y-10 border border-mat-gold/10 relative overflow-hidden">
            {/* Ambient Gold Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-mat-gold/10 blur-[100px] pointer-events-none" />
            
            <div className="flex items-center gap-4 relative z-10">
              <Crown className="text-mat-gold w-6 h-6" strokeWidth={1} />
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-mat-gold">The Protocol</h3>
            </div>
            <h2 className="text-4xl md:text-6xl font-display text-mat-cream uppercase leading-tight relative z-10">
              Quality is <br /><span className="text-mat-gold italic font-serif lowercase tracking-normal">Engineered</span>
            </h2>
            <div className="space-y-6 pt-4 relative z-10">
              {["Female-controlled matching", "Curated male visibility", "Deliberate discovery", "Structured communication", "Premium trust and safety"].map(item => (
                <div key={item} className="flex items-center gap-4 text-mat-cream">
                  <div className="w-1.5 h-1.5 bg-mat-gold rounded-full shadow-[0_0_12px_#BFA06A]" />
                  <span className="text-[11px] font-black uppercase tracking-[0.2em]">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Fold>
  );
};

export default ArchitectureFold;
