import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Fold from './Fold';
import { ShieldCheck, X } from 'lucide-react';

const SECURITY_DATA: Record<string, string> = {
  "Communication Isolation": "Secure, P2P encrypted messaging that bypasses standard cellular networks and keeps all sanctuary dialogue contained.",
  "Verification Journey": "A multi-step authenticity ritual that uses cryptographic proof to verify identity without compromising personal data.",
  "Privacy Infrastructure": "An obsidian-grade security architecture designed to mask metadata and ensure absolute user anonymity across the grid.",
  "Selective Discovery": "A deliberate, non-algorithmic discovery engine that prioritizes meaningful alignment over high-volume scanning.",
  "Moderated Mechanics": "A rigorous, human-in-the-loop oversight protocol that maintains the sanctuary's integrity and quality standards.",
  "Elite Referral Protocols": "A closed-loop entry system requiring high-reputation referrals to ensure only the most aligned aspirants are invited."
};

const SECURITY_POINTS = Object.keys(SECURITY_DATA);

const SecurityFold: React.FC = () => {
  const [selectedProtocol, setSelectedProtocol] = useState<string | null>(null);

  return (
    <Fold id="security" className="bg-mat-cream py-12 lg:py-16 border-b border-mat-gold/10">
      <div className="space-y-12 lg:space-y-16">
        {/* Section 1: Grace & Security */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          <div className="space-y-6 lg:space-y-8">
            <motion.div 
              initial={{ rotate: -10, scale: 0.9 }}
              whileInView={{ rotate: 0, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="w-20 h-20 lg:w-24 lg:h-24 border border-mat-gold/20 grid place-items-center bg-mat-ivory backdrop-blur-xl shadow-sm"
            >
              <ShieldCheck className="w-10 h-10 lg:w-12 lg:h-12 text-mat-gold" strokeWidth={1} />
            </motion.div>
            <h2 className="text-4xl md:text-7xl font-display text-mat-slate uppercase leading-[0.85]">
              Grace <br /><span className="text-mat-gold/20 italic font-display tracking-normal">& Security.</span>
            </h2>
            <p className="text-lg text-mat-slate/40 font-light max-w-xl leading-relaxed">
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
                onClick={() => setSelectedProtocol(item)}
                className="p-6 lg:p-8 border border-mat-gold/5 bg-mat-ivory/40 hover:bg-mat-ivory hover:border-mat-gold/20 transition-all duration-500 cursor-pointer group shadow-sm active:scale-95"
              >
                <span className="text-[9px] font-black uppercase tracking-[0.4em] group-hover:tracking-[0.5em] transition-all">
                  {item}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Section 2: Brand Statement */}
        <div className="text-left relative z-10 space-y-8 lg:space-y-12 border-t border-mat-gold/10 pt-12 lg:pt-16">
          <span className="text-[10px] font-black uppercase tracking-[0.8em] text-mat-slate/10">Private // Selective // System</span>
          <div className="max-w-4xl space-y-8">
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="text-3xl md:text-5xl font-display leading-tight text-mat-slate uppercase tracking-tight"
            >
              "Matriarch is for women who are done performing for algorithms. It creates an <span className="text-mat-gold italic font-display tracking-normal">elegant dynamic</span> of choice."
            </motion.p>
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: 120 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="h-px bg-mat-gold" 
            />
            <div className="text-2xl font-display text-mat-slate uppercase tracking-widest opacity-20">Matriarch</div>
          </div>
        </div>
      </div>

      {/* Protocol Explanation Modal */}
      <AnimatePresence>
        {selectedProtocol && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProtocol(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-md bg-black/20"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-mat-ivory p-12 max-w-lg w-full border border-mat-gold/30 shadow-2xl relative text-center space-y-8"
            >
              <button 
                onClick={() => setSelectedProtocol(null)}
                className="absolute top-4 right-4 text-mat-slate/20 hover:text-mat-wine transition-colors"
              >
                <X size={20} strokeWidth={1} />
              </button>
              
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-mat-gold">Security Protocol</span>
                <h3 className="text-3xl font-display text-mat-slate uppercase leading-none">{selectedProtocol}</h3>
              </div>
              
              <div className="w-12 h-px bg-mat-gold/30 mx-auto" />
              
              <p className="text-lg text-mat-slate/60 font-light leading-relaxed">
                {SECURITY_DATA[selectedProtocol]}
              </p>
              
              <div className="pt-4">
                <button 
                  onClick={() => setSelectedProtocol(null)}
                  className="px-8 py-3 bg-mat-wine text-mat-cream text-[10px] font-black uppercase tracking-widest hover:bg-mat-gold hover:text-mat-wine transition-all"
                >
                  Confirm Understanding
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Fold>
  );
};

export default SecurityFold;
