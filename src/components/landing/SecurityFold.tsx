import React from 'react';
import { motion } from 'framer-motion';
import Fold from './Fold';
import { ShieldCheck } from 'lucide-react';

const SECURITY_POINTS = [
  "Communication Isolation",
  "Verification Journey",
  "Privacy Infrastructure",
  "Selective Discovery",
  "Moderated Mechanics",
  "Elite Referral Protocols"
];

const SecurityFold: React.FC = () => {
  return (
    <Fold id="security" className="bg-mat-obsidian py-12 lg:py-16">
      <div className="space-y-12 lg:space-y-16">
        {/* Section 1: Grace & Security */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          <div className="space-y-6 lg:space-y-8">
            <motion.div 
              initial={{ rotate: -10, scale: 0.9 }}
              whileInView={{ rotate: 0, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="w-20 h-20 lg:w-24 lg:h-24 border border-white/20 grid place-items-center bg-white/5 backdrop-blur-xl"
            >
              <ShieldCheck className="w-10 h-10 lg:w-12 lg:h-12 text-mat-gold" strokeWidth={1} />
            </motion.div>
            <h2 className="text-4xl md:text-7xl font-display text-mat-cream uppercase leading-[0.85]">
              Grace <br /><span className="text-white/20 italic font-serif lowercase tracking-normal">& Security.</span>
            </h2>
            <p className="text-lg text-mat-cream/40 font-light max-w-xl leading-relaxed">
              Matriarch is designed to give women absolute control. Safety is not a feature; it is the fundamental architecture.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-3 lg:gap-4">
            {SECURITY_POINTS.map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 lg:p-8 border border-white/5 hover:bg-mat-cream hover:text-mat-obsidian transition-all duration-500 cursor-crosshair group"
              >
                <span className="text-[9px] font-black uppercase tracking-[0.4em] group-hover:tracking-[0.5em] transition-all">
                  {item}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Section 2: Brand Statement */}
        <div className="text-left relative z-10 space-y-8 lg:space-y-12 border-t border-white/5 pt-12 lg:pt-16">
          <span className="text-[10px] font-black uppercase tracking-[0.8em] text-white/10">Private // Selective // System</span>
          <div className="max-w-4xl space-y-8">
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="text-3xl md:text-5xl font-display leading-tight text-mat-cream uppercase tracking-tight"
            >
              "Matriarch is for women who are done performing for algorithms. It creates an <span className="text-mat-gold italic font-serif lowercase tracking-normal">elegant dynamic</span> of choice."
            </motion.p>
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: 120 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="h-px bg-mat-gold" 
            />
            <div className="text-2xl font-display text-mat-cream uppercase tracking-widest opacity-20">Matriarch</div>
          </div>
        </div>
      </div>
    </Fold>
  );
};

export default SecurityFold;
