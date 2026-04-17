import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  Heart, 
  Sparkles,
  Eye,
  Star,
  X,
  HelpCircle,
  ArrowRight,
  Zap,
  Fingerprint,
  Waves
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { FAQ } from '@/components/FAQ';
import { VerificationPaymentModal } from '@/components/verification/VerificationPaymentModal';
import { useAuth } from '@/hooks/useAuth';

/**
 * 🍎 GlassPill: An ultra-premium glass-morphic stat pill
 */
const GlassPill = ({ label, value, icon, delay = 0 }: { label: string, value: string, icon: React.ReactNode, delay?: number }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.9, y: 30 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    transition={{ delay, duration: 1, ease: [0.16, 1, 0.3, 1] }}
    className="mat-glass-thick mat-glass-pill group cursor-default hover:scale-[1.02] transition-transform duration-700"
  >
     <span className="mat-text-apple-display text-[8px] tracking-[0.4em] mb-3 opacity-40 group-hover:opacity-100 transition-opacity">
        {label}
     </span>
     <div className="flex items-center gap-6">
        <div className="p-3 rounded-full bg-white/40 text-mat-noir/40 group-hover:text-mat-rose-gold transition-colors">
           {icon}
        </div>
        <h3 className="mat-text-fluid-huge text-4xl lg:text-5xl text-mat-noir leading-none tracking-tighter">
           {value}
        </h3>
     </div>
  </motion.div>
);

interface WomenSanctuaryProps {
  profile: any;
  metrics: { 
    matches: number; 
    sessionSeconds: number;
    profilesViewed?: number;
    profilesEngaged?: number;
    saves?: number;
    responseRate?: string;
    vibeRating?: number;
    activeStreak?: number;
    safetyLevel?: string;
    profileViews?: number;
  };
  setIsEditing: (val: boolean) => void;
  onBeginDiscovery?: () => void;
}

export const WomenSanctuary: React.FC<WomenSanctuaryProps> = ({ 
  profile,
  metrics, 
  setIsEditing,
  onBeginDiscovery 
}) => {
  const [showFAQ, setShowFAQ] = React.useState(false);
  const [showVerification, setShowVerification] = React.useState(false);
  const { refreshProfile } = useAuth();

  const isVerified = profile?.is_verified;
  const completeness = profile?.profile_completeness ?? 94;

  const stats = [
    { label: 'Sanctuary Merit',  value: `${completeness}%`, icon: <ShieldCheck size={20} /> },
    { label: 'Resonance',       value: String(metrics.matches || 0), icon: <Heart size={20} /> },
    { label: 'Neural Reach',    value: String(metrics.profileViews || 0), icon: <Eye size={20} /> },
    { label: 'Integrity Rank',  value: metrics.safetyLevel ?? 'Gold', icon: <Star size={20} /> },
  ];

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden mat-apple-bg flex flex-col selection:bg-mat-noir selection:text-white">
      
      {/* 🍎 CINEMATIC OVERLAYS ═══════════════════════ */}
      <div className="absolute inset-0 z-0 pointer-events-none">
         <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-mat-rose-gold/10 rounded-full blur-[120px] animate-pulse" />
         <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/5 rounded-full blur-[120px] animate-pulse" />
      </div>

      {/* 🍎 SYMMETRICAL CORE ══════════════════════════ */}
      <main className="relative z-10 flex-1 w-full max-w-4xl mx-auto flex flex-col items-center justify-between py-12 lg:py-20 px-8 overflow-y-auto custom-scrollbar">
        
        {/* 1. Symmetrical Identity Hero */}
        <div className="flex flex-col items-center gap-10 text-center">
           <motion.div 
             initial={{ scale: 0.9, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             transition={{ duration: 1.2, ease: "circOut" }}
             className="relative"
           >
              {/* Glass Ring Halo */}
              <div className="absolute -inset-8 border border-white/40 rounded-full backdrop-blur-3xl z-[-1]" />
              
              <div className="w-48 h-48 lg:w-56 lg:h-56 rounded-full border-4 border-white shadow-2xl overflow-hidden relative z-10 group">
                 <img 
                   src={profile?.photos?.[0] || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=800"} 
                   alt="Identity" 
                   className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]"
                 />
                 {/* Glass overlay on photo */}
                 <div className="absolute inset-0 bg-white/5 backdrop-blur-[1px] group-hover:backdrop-blur-0 transition-all duration-700" />
              </div>

              {/* Status Badge */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="absolute bottom-0 right-0 p-3 bg-white rounded-full shadow-lg border border-mat-noir/5"
              >
                 <Fingerprint size={16} className="text-mat-rose-gold" />
              </motion.div>
           </motion.div>

           <div className="space-y-3">
              <span className="mat-text-apple-display text-[9px] tracking-[0.6em] text-mat-noir/30">Sanctuary authenticated</span>
              <h1 className="mat-text-fluid-huge text-5xl lg:text-7xl text-mat-noir leading-none tracking-tight">
                 {profile?.full_name?.split(' ')[0] || 'aspirant'}<span className="text-mat-rose-gold opacity-50">.</span>
              </h1>
              <div className="flex items-center justify-center gap-4">
                 <div className="h-px w-6 bg-mat-noir/10" />
                 <Waves size={14} className="text-mat-rose-gold/40 animate-pulse" />
                 <div className="h-px w-6 bg-mat-noir/10" />
              </div>
           </div>
        </div>

        {/* 2. Cinematic Glass Stat Board */}
        <div className="w-full flex flex-col gap-4 mt-12">
           {stats.map((stat, i) => (
             <GlassPill key={i} {...stat} delay={0.2 * i} />
           ))}
        </div>

        {/* 3. Primary Control & Intel */}
        <div className="w-full flex flex-col items-center gap-12 mt-16">
           <motion.button 
             whileHover={{ scale: 1.02, y: -2 }}
             whileTap={{ scale: 0.98 }}
             onClick={onBeginDiscovery}
             className="w-full lg:w-96 py-6 rounded-[200px] bg-mat-noir text-white mat-text-apple-display text-[10px] tracking-[0.5em] font-bold shadow-2xl hover:bg-mat-rose-gold transition-all flex items-center justify-center gap-4 group"
           >
             Enter Thread <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
           </motion.button>

           <div className="flex items-center gap-12">
              <button onClick={() => setIsEditing(true)} className="mat-text-apple-display text-[8px] tracking-[0.3em] hover:text-mat-rose-gold transition-colors">Settings</button>
              <button onClick={() => setShowFAQ(true)} className="mat-text-apple-display text-[8px] tracking-[0.3em] hover:text-mat-rose-gold transition-colors">Registry</button>
              {!isVerified && (
                <button onClick={() => setShowVerification(true)} className="mat-text-apple-display text-[8px] tracking-[0.3em] text-mat-rose-gold font-black">Verify Identity</button>
              )}
           </div>
        </div>

      </main>

      {/* 🍎 MODALS ═══════════════════════════════════════ */}
      <AnimatePresence>
        {showFAQ && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-0 bg-white/60 backdrop-blur-[50px]"
            onClick={() => setShowFAQ(false)}
          >
            <div className="w-full h-full flex flex-col relative" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setShowFAQ(false)} 
                className="absolute top-12 right-12 w-16 h-16 border border-mat-noir/10 text-mat-noir/40 hover:text-mat-rose-gold transition-all duration-500 z-20 flex items-center justify-center rounded-full bg-white shadow-xl"
              >
                <X size={24} />
              </button>
              
              <div className="flex-1 w-full overflow-y-auto custom-scrollbar px-8 md:px-32 py-32 lg:py-48">
                <div className="max-w-4xl mx-auto">
                   <span className="mat-text-apple-display text-[12px] tracking-[1em] text-mat-noir/30 mb-12 block text-center uppercase">System registry</span>
                   <div className="pointer-events-auto opacity-70"><FAQ /></div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showVerification && (
          <VerificationPaymentModal
            onClose={() => setShowVerification(false)}
            onSuccess={async () => { await refreshProfile(); setShowVerification(false); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default WomenSanctuary;
