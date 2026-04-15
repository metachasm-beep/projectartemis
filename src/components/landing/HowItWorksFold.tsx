import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Fold from './Fold';
import { SEO_COPY } from '@/content/copy';

const HowItWorksFold: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const titleX = useTransform(scrollYProgress, [0, 1], [-15, 15]);

  return (
    <Fold id="how-it-works" className="bg-mat-cream border-t border-mat-gold/10 py-0 overflow-hidden">
      <div ref={containerRef} className="h-full flex flex-col justify-center space-y-6 md:space-y-12 py-8 md:py-12">
        <div className="space-y-8 md:space-y-12">
          <div className="space-y-4 flex flex-col items-center md:items-start text-center md:text-left">
            <motion.span 
              className="px-4 py-1 border border-mat-rose/20 uppercase tracking-[0.4em] font-black text-[9px] bg-mat-rose/5 text-mat-rose rounded-none inline-block"
            >
              The Process
            </motion.span>
            <motion.h2 
              style={{ x: titleX }}
              className="text-4xl md:text-7xl font-display text-mat-slate uppercase leading-none opacity-90"
            >
              Step by <span className="text-mat-gold/30 italic">Step</span>
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-8">
            {SEO_COPY.landing.how_it_works.steps.map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-mat-ivory backdrop-blur-sm border border-mat-gold/10 p-2.5 md:p-8 group hover:border-mat-gold/40 transition-all duration-700 flex flex-col justify-between min-h-[auto] md:min-h-[300px] shadow-sm"
              >
                <div className="space-y-1.5 md:space-y-6 flex flex-col items-center md:items-start text-center md:text-left">
                  <div className="text-mat-rose font-black text-lg md:text-2xl group-hover:text-mat-gold transition-colors">
                    0{i + 1}
                  </div>
                  <div>
                    <h3 className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] mb-1 md:mb-2 text-mat-rose/40 italic">{step.title}</h3>
                    <h4 className="text-sm md:text-3xl font-display text-mat-slate leading-tight uppercase tracking-tight">{step.label}</h4>
                  </div>
                </div>
                <p className="text-[9px] md:text-[12px] text-mat-slate/40 text-center md:text-left leading-relaxed font-light mt-2 md:mt-6 border-t border-mat-gold/5 pt-2 md:pt-6 uppercase tracking-wider">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </Fold>
  );
};

export default HowItWorksFold;
