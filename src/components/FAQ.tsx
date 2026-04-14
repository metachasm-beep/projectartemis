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
    answer: "Verification ensures our community remains a safe space for real people. By verifying your identity via Aadhaar, we eliminate bots and fake profiles, ensuring that everyone you meet is real and committed.",
    icon: ShieldCheck
  },
  {
    question: "How do Activity Points work?",
    answer: "Points are earned for staying active on the platform. You get 10 points daily just for signing in. Regular streaks grant larger rewards: 100 points for a 7-day streak, and 1000 for 30 days. These can be used to boost your visibility or unlock advanced discovery filters.",
    icon: Zap
  },
  {
    question: "My profile is verified but not 'Active'?",
    answer: "Profiles are fully activated once the ID Verification is complete. If you are verified but still see an inactive status, please refresh your dashboard or contact our support team.",
    icon: Users
  },
  {
    question: "How do connections work?",
    answer: "Women can browse all verified profiles in the community. For men, your profile is presented to others based on your engagement score and visibility boosts.",
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
          Help <span className="mat-text-gradient-gold">Center</span>
        </h2>
        <p className="mat-text-label-pro">Common Questions</p>
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
            <p className="mat-text-label-pro opacity-40">Still have questions about your account?</p>
            <Button 
               variant="outline" 
               className="h-16 px-12 rounded-2xl border-mat-gold/30 text-mat-gold hover:bg-mat-gold/10 font-black uppercase tracking-[0.3em] text-[10px] shadow-mat-gold/20"
               onClick={() => window.location.href = 'mailto:support@matriarch.app'}
            >
               Contact Support
            </Button>
         </div>
      </div>
    </section>
  );
};
