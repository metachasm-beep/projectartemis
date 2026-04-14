import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Minus, 
  Zap, 
  ShieldCheck, 
  Users,
  Search
} from 'lucide-react';
import { Button } from './ui/button';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    question: "Why is Aadhaar Verification mandatory?",
    answer: "SURVEILLANCE OF TRUTH. TO MAINTAIN THE SANCTUARY'S INTEGRITY, WE STRIP AWAY THE ARTIFICE. NO BOTS. NO LIES. ONLY VERIFIED HUMAN RESONANCE."
  },
  {
    question: "How do Activity Points work?",
    answer: "ENERGY AS CURRENCY. SIGNALS PULSE EVERY 24 HOURS. 10 HZ FOR ENTRY. STREAK MULTIPLIERS FOR CONSISTENCY. USE THEM TO PIERCE THE VEIL OF DISCOVERY."
  },
  {
    question: "My profile is verified but not 'Active'?",
    answer: "SYNCHRONIZATION LAG. THE REGISTRY IS ATOMIC. IF YOUR SEAL IS APPLIED BUT YOUR AURA IS STILL GAINING MASS, WAIT FOR THE NEXT SYSTEM REFLOW."
  },
  {
    question: "How do connections work?",
    answer: "THE GAZE IS SOVEREIGN. WOMEN OBSERVE THE TOTALITY. MEN ARE PRESENTED BASED ON INTEGRITY AND BOOSTS. INTENTIONALITY IS OUR ONLY PROTOCOL."
  }
];

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="w-full flex justify-center py-2 relative bg-transparent">
      {/* Cinematic Modernism: Raw, Stark, Architectural */}
      <div className="w-full max-w-6xl flex flex-col space-y-0">
        <div className="flex flex-col border-t-[1.5px] border-black">
          {FAQ_DATA.map((item, i) => (
            <div 
              key={i}
              className="flex flex-col border-b-[0.5px] border-black/10 hover:bg-black/[0.01] transition-colors duration-1000"
            >
              <button 
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full py-14 px-4 flex items-start justify-between text-left group"
              >
                <div className="flex items-start gap-12 md:gap-24">
                  <span className="text-[12px] font-black uppercase tracking-[0.5em] opacity-20 mt-3 tabular-nums">
                     {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="space-y-4">
                    <span className="font-serif italic text-4xl md:text-6xl lg:text-7xl leading-[0.9] tracking-tighter opacity-80 group-hover:opacity-100 transition-opacity duration-700">
                      {item.question}
                    </span>
                  </div>
                </div>
                <div className="mt-4 opacity-10 group-hover:opacity-100 transition-opacity shrink-0">
                  {openIndex === i ? <Minus size={32} strokeWidth={1} /> : <Plus size={32} strokeWidth={1} />}
                </div>
              </button>

              <AnimatePresence>
                {openIndex === i && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="pb-16 pl-16 md:pl-[12rem] pr-12">
                      <p className="text-[14px] md:text-[16px] leading-[1.6] tracking-[0.15em] opacity-60 uppercase font-black max-w-4xl">
                        {item.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        <div className="pt-32 pb-20 flex flex-col items-center">
            <div className="w-16 h-px bg-black opacity-20 mb-8" />
            <button 
               onClick={() => window.location.href = 'mailto:support@matriarch.app'}
               className="text-[12px] font-black uppercase tracking-[0.6em] opacity-40 hover:opacity-100 hover:tracking-[0.8em] transition-all duration-700 py-4"
            >
               Signal Protocol Architect
            </button>
        </div>
      </div>
    </section>
  );
};
