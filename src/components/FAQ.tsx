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
    <section id="faq" className="w-full flex justify-center py-10">
      <div className="w-full max-w-5xl flex flex-col">
        {/* Cinematic Modernism Layout: Stark, raw lines, extreme high contrast */}
        <div className="flex flex-col border-t-2 border-current">
          {FAQ_DATA.map((item, i) => (
            <div 
              key={i}
              className="flex flex-col border-b border-current/20 transition-all duration-700"
            >
              <button 
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full py-10 md:py-14 flex items-start justify-between text-left group"
              >
                <div className="flex items-start gap-8 md:gap-14 w-[85%]">
                  <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.4em] opacity-30 mt-2 shrink-0">
                     0{i + 1}
                  </span>
                  <span className="font-serif italic text-4xl md:text-5xl lg:text-6xl leading-[1.1] tracking-tighter group-hover:opacity-50 transition-opacity">
                    {item.question}
                  </span>
                </div>
                <div className="mt-2 opacity-40 group-hover:opacity-100 transition-opacity shrink-0">
                  {openIndex === i ? <Minus size={28} strokeWidth={1} /> : <Plus size={28} strokeWidth={1} />}
                </div>
              </button>

              <AnimatePresence>
                {openIndex === i && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="pb-14 pl-[4.5rem] md:pl-[6.5rem]">
                      <p className="text-[12px] md:text-[13px] leading-relaxed tracking-[0.1em] opacity-70 uppercase font-bold max-w-3xl">
                        {item.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        <div className="pt-24 pb-12 text-center w-full flex flex-col items-center">
            <span className="text-[10px] uppercase font-black tracking-[0.4em] opacity-40 mb-8">Unresolved Inquiries</span>
            <button 
               onClick={() => window.location.href = 'mailto:support@matriarch.app'}
               className="inline-flex items-center justify-center border-2 border-current px-12 py-5 text-[11px] font-black uppercase tracking-[0.3em] hover:bg-current hover:text-[#f5f0ea] transition-all duration-500"
            >
               Request Oracle Support
            </button>
        </div>
      </div>
    </section>
  );
};
