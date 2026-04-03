import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Minus, 
  HelpCircle, 
  Zap, 
  ShieldCheck, 
  Users,
  Search
} from 'lucide-react';
import { Button } from './ui/button';

interface FAQItem {
  question: string;
  answer: string;
  icon: any;
}

const FAQ_DATA: FAQItem[] = [
  {
    question: "Why is Aadhaar Verification mandatory?",
    answer: "The 'Seal of Truth' ensures the Sanctuary remains a space of absolute authenticity. By verifying your identity via Aadhaar, we eliminate bots and bad actors, ensuring that every soul you meet is real and committed.",
    icon: ShieldCheck
  },
  {
    question: "How do Divine Blessings (Tokens) work?",
    answer: "Tokens are the lifeblood of visibility. You earn 10 tokens daily for simple presence. Streaks grant larger rewards: 100 tokens for 7 days, and 1000 for 30 days. These can be used for 'Presence Bumps' or unlocking discovery filters.",
    icon: Zap
  },
  {
    question: "My profile is verified but not 'Active'?",
    answer: "Profiles are activated once the Seal of Truth is applied (Aadhaar Verified). If you are verified but still see an inactive status, please Synchronization your dashboard or contact the Architect.",
    icon: Users
  },
  {
    question: "How do I find a Connection?",
    answer: "For Matriarchs, the 'Boundless Discovery' allows you to browse all verified Seekers. For Seekers, your story is presented to Matriarchs based on your Impact Score and Presence Bumps.",
    icon: Search
  }
];

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-20 space-y-16">
      <div className="text-center space-y-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/5 border border-white/10 mb-2">
          <HelpCircle className="text-mat-gold w-6 h-6" />
        </div>
        <h2 className="text-5xl mat-text-display-pro text-white leading-tight uppercase">
          Divine <span className="mat-text-gradient-gold">Wisdom</span>
        </h2>
        <p className="mat-text-label-pro">Frequently Asked Truths</p>
      </div>

      <div className="max-w-3xl mx-auto space-y-4">
        {FAQ_DATA.map((item, i) => (
          <div 
            key={i}
            className="mat-panel-premium bg-white/[0.02] border border-white/5 rounded-[2.5rem] overflow-hidden transition-all hover:bg-white/[0.04]"
          >
            <button 
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full p-8 md:p-10 flex items-center justify-between text-left group"
            >
              <div className="flex items-center gap-8">
                <div className={`p-4 rounded-[1.25rem] transition-all duration-500 ${openIndex === i ? 'bg-mat-gold text-black shadow-mat-gold' : 'bg-white/5 text-mat-gold'}`}>
                  <item.icon size={20} />
                </div>
                <span className="mat-text-label-pro !text-[11px] text-white group-hover:text-mat-gold transition-colors not-italic">
                  {item.question}
                </span>
              </div>
              <div className="text-white/20">
                {openIndex === i ? <Minus size={20} /> : <Plus size={20} />}
              </div>
            </button>

            <AnimatePresence>
              {openIndex === i && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                >
                  <div className="px-10 md:px-32 pb-10">
                    <p className="text-[13px] text-white/60 leading-relaxed font-medium italic">
                      {item.answer}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      <div className="max-w-3xl mx-auto pt-12 text-center">
         <div className="p-12 rounded-[3.5rem] mat-glass-premium border-white/5 bg-white/[0.02] space-y-8">
            <p className="mat-text-label-pro opacity-40">Still have questions about your journey?</p>
            <Button 
               variant="outline" 
               className="h-16 px-12 rounded-2xl border-mat-gold/30 text-mat-gold hover:bg-mat-gold/10 font-black uppercase tracking-[0.3em] text-[10px] shadow-mat-gold/20"
               onClick={() => window.location.href = 'mailto:architect@matriarch.app'}
            >
               Summon the Architect
            </Button>
         </div>
      </div>
    </section>
  );
};
