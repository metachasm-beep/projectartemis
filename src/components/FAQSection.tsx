import React from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Zap, 
  ShieldCheck, 
  ArrowUpRight, 
  Clock, 
  Activity,
  UserCheck,
  ChevronRight,
  Sparkles,
  Search
} from 'lucide-react';
import { cn } from "@/lib/utils";

const FAQ_DATA = [
  {
    category: "I. The Elite Ranking System",
    icon: Trophy,
    color: "text-mat-gold",
    items: [
      {
        q: "What is my 'Absolute Rank'?",
        a: "Your Absolute Rank is your exclusive position in the Matriarch global sanctuary. Unlike standard platforms, we do not allow tied rankings. Your rank determines your visibility to high-tier women. Rank #1 is the ultimate position of prestige."
      },
      {
        q: "How are the Tiers defined?",
        a: "Aspirants are segmented into exclusive brackets: 'The Choice' (Top 10), 'Ascendant' (Top 5%), 'Paragon' (Top 15%), 'Noble' (Top 30%), and 'Vanguard' (Top 60%). Higher tiers unlock enhanced discovery features and priority response protocols."
      },
      {
        q: "Why did my rank drop overnight?",
        a: "The Sanctuary is a living ecosystem. If a new member joins with a higher integrity score or executes an Aura Jump, the rankings reflow immediately. To maintain your position, ensure your Profile Integrity is at 100%."
      }
    ]
  },
  {
    category: "II. Aura Token Economy",
    icon: Zap,
    color: "text-mat-rose-gold",
    items: [
      {
        q: "What are Aura Tokens used for?",
        a: "Aura is the currency of attention. You can use tokens to execute 'Aspirational Leaps' (jumping percentages of the population) or to 'Ping' high-tier profiles with priority messages. Aura directly influences your Rank Score."
      },
      {
        q: "How do I earn more Aura?",
        a: "Aura can be acquired through the Sanctuary Store. Occasionally, the Architect rewards Aura for exceptional profile resonance or for participating in high-integrity surveys."
      },
      {
        q: "Is an Aura Jump permanent?",
        a: "A jump awards permanent Rank Score points. However, as more men join and optimize their profiles, your relative position may change. Continuous calibration is key to staying in the 'Ascendant' tier."
      }
    ]
  },
  {
    category: "III. The Integrity Protocol",
    icon: ShieldCheck,
    color: "text-mat-gold-dark",
    items: [
      {
        q: "What is my 'Integrity Score'?",
        a: "A measure of your transparency and resonance. Completing your bio, uploading verified photos, and providing professional details increases your score. Reach 100% to unlock a permanent +5000 Rank Score bonus."
      },
      {
        q: "How does Verification impact me?",
        a: "Verified profiles (Biometric/Aadhaar sync) are given 400% higher visibility and absolute priority in the ranking algorithm. A verified Aspirant will almost always outrank an unverified one, regardless of other metrics."
      },
      {
        q: "What is Rank Decay?",
        a: "Sanctuary absence leads to resonance loss. Beyond a 3-day grace period, your rank score decays by 2% daily. Regular activity (Gazing/Messaging) ensures your status remains active and locked."
      }
    ]
  }
];

export const FAQSection: React.FC = () => {
  return (
    <div className="space-y-16 pb-20">
      {/* 🏛️ Header Section */}
      <div className="text-center space-y-6 pt-12">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-3 px-6 py-2 rounded-full border border-mat-gold/20 bg-mat-gold/5 backdrop-blur-md"
        >
          <Sparkles size={14} className="text-mat-gold" />
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-mat-gold">Protocol Intelligence</span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mat-text-fluid-huge text-mat-wine italic"
        >
          Platform <br /><span className="text-mat-rose/20">Mechanics.</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl mx-auto text-mat-wine/60 text-lg font-light leading-relaxed"
        >
          Welcome to the Matriarch Manual. Here we define the logic of the sanctuary—the rules of engagement, the currency of attention, and the path to the Ascendant tier.
        </motion.p>
      </div>

      {/* 📜 FAQ Grid */}
      <div className="grid grid-cols-1 gap-12 max-w-5xl mx-auto">
        {FAQ_DATA.map((section, sIdx) => (
          <motion.div 
            key={section.category}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: sIdx * 0.1 }}
            className="space-y-8"
          >
            <div className="flex items-center gap-4 px-4">
              <div className={cn("p-3 rounded-2xl bg-white shadow-xl", section.color)}>
                 <section.icon size={24} />
              </div>
              <h2 className="text-2xl font-bold text-mat-wine italic tracking-tight">{section.category}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {section.items.map((item, iIdx) => (
                <div 
                  key={iIdx} 
                  className="group relative bg-white/40 hover:bg-white/80 backdrop-blur-md border border-white/60 p-8 rounded-[2rem] shadow-xl transition-all duration-500 hover:-translate-y-2 cursor-default h-full flex flex-col"
                >
                  <div className="absolute top-6 right-8 text-mat-gold/20 group-hover:text-mat-gold transition-colors">
                     <ChevronRight size={20} />
                  </div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-mat-wine mb-4 leading-tight">
                    {item.q}
                  </h3>
                  <p className="text-sm text-mat-wine/70 leading-relaxed font-light mt-auto">
                    {item.a}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* 🍷 Bottom Call to action */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="max-w-4xl mx-auto mt-24 p-12 rounded-[3rem] bg-mat-obsidian text-white relative overflow-hidden shadow-2xl"
      >
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
           <Trophy size={200} />
        </div>
        
        <div className="relative z-10 flex flex-col items-center text-center space-y-8">
           <div className="w-20 h-20 rounded-full bg-mat-gold/20 flex items-center justify-center border border-mat-gold/30">
              <Zap size={32} className="text-mat-gold" />
           </div>
           <div>
             <h3 className="text-3xl font-bold italic mb-3">Ready to ascend?</h3>
             <p className="text-white/40 text-sm tracking-widest uppercase">Your elite rank is waiting to be claimed.</p>
           </div>
           
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md">
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
                 <span className="block text-2xl font-black text-mat-gold mb-1">100%</span>
                 <span className="text-[9px] uppercase tracking-widest text-white/40">Integrity Target</span>
              </div>
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
                 <span className="block text-2xl font-black text-mat-gold mb-1">Verified</span>
                 <span className="text-[9px] uppercase tracking-widest text-white/40">Priority Goal</span>
              </div>
           </div>
        </div>
      </motion.div>
    </div>
  );
};
