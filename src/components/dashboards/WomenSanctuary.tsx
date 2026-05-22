import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  Heart, 
  Eye,
  Star,
  X,
  HelpCircle,
  ArrowRight,
  Fingerprint,
  Sparkles,
  Compass,
  Clock,
  BookOpen
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { FAQ } from '@/components/FAQ';
import { VerificationPaymentModal } from '@/components/verification/VerificationPaymentModal';
import { useAuth } from '@/hooks/useAuth';
import { BrainstormingModal } from '@/components/agentic/BrainstormingModal';
import { Playbook } from '@/components/agentic/Playbook';

/**
 * 🍎 GlassMetric: A compact, high-contrast stat card for zero-scroll layouts
 */
const GlassMetric = ({ label, value, icon, delay = 0 }: { label: string, value: string, icon: React.ReactNode, delay?: number }) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.8 }}
    className="mat-glass-thick rounded-[24px] p-4 flex flex-col items-center justify-center text-center gap-1 flex-1 min-w-0"
  >
     <div className="text-mat-noir/30 mb-1 scale-75 lg:scale-100">
        {icon}
     </div>
     <div className="flex flex-col items-center">
        <h3 className="mat-text-fluid-huge text-2xl lg:text-3xl text-mat-noir leading-none font-black mb-1">
           {value}
        </h3>
        <span className="mat-text-apple-display text-[9px] lg:text-[11px] tracking-[0.4em] text-mat-noir font-bold uppercase">
           {label}
        </span>
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
    totalAspirants?: number;
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
  const [showArchitect, setShowArchitect] = React.useState(false);
  const [showPlaybook, setShowPlaybook] = React.useState(false);
  const { refreshProfile } = useAuth();

  const isVerified = profile?.is_verified;
  const completeness = profile?.profile_completeness ?? 94;

  const age = profile?.date_of_birth 
    ? new Date().getFullYear() - new Date(profile.date_of_birth).getFullYear() 
    : null;

  const discoveryDepth = Math.min(100, Math.round(((metrics.profilesEngaged || 0) / (metrics.totalAspirants || 100)) * 100));
  const immersionHours = Math.round((metrics.sessionSeconds || 0) / 3600);

  return (
    <div className="relative w-full min-h-[100dvh] landscape:min-h-0 landscape:h-auto overflow-hidden landscape:overflow-y-auto mat-apple-bg flex flex-col selection:bg-mat-noir selection:text-white pt-[72px]">
      
      {/* 🍎 BACKGROUND DEPTH ════════════════════════ */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
         <div className="absolute top-0 right-0 w-64 h-64 bg-mat-rose-gold/20 rounded-full blur-[100px]" />
         <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px]" />
      </div>

      {/* 🍎 ZERO-SCROLL CORE ══════════════════════════ */}
      <main className="relative z-10 flex-1 w-full max-w-4xl mx-auto flex flex-col justify-between p-6 lg:p-12 min-h-0">
        
        {/* 1. COMPACT HERO */}
        <div className="flex flex-col items-center text-center gap-4 lg:gap-8 flex-shrink-0">
           <motion.div 
             initial={{ scale: 0.9, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             transition={{ duration: 1 }}
             className="relative"
           >
              <div className="w-32 h-32 lg:w-48 lg:h-48 rounded-full border-2 border-white shadow-xl overflow-hidden relative z-10 group">
                 <img 
                   src={profile?.photos?.[0] || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=800"} 
                   alt="Identity" 
                   className="w-full h-full object-cover grayscale brightness-95"
                 />
                 <div className="absolute inset-0 bg-white/5 backdrop-blur-[1px]" />
              </div>
              <div className="absolute -bottom-1 -right-1 p-2 bg-white rounded-full shadow-lg border border-mat-noir/5 z-20">
                 <Fingerprint size={14} className="text-mat-rose-gold" />
              </div>
           </motion.div>

            <div className="space-y-2 lg:space-y-3">
              <h1 className="mat-text-fluid-huge text-4xl lg:text-7xl text-mat-noir leading-none tracking-tight lowercase">
                 {profile?.full_name?.split(' ')[0] || 'aspirant'}<span className="text-mat-rose-gold">.</span>
              </h1>
              
              <div className="flex flex-col items-center gap-1">
                <p className="mat-text-apple-display text-[10px] lg:text-[12px] tracking-[0.2em] text-mat-noir font-bold uppercase">
                  {age ? `${age} • ` : ''}{profile?.city || 'Sanctuary'}
                </p>
                {profile?.bio && (
                  <p className="mat-text-apple-display text-[9px] lg:text-[11px] max-w-xs text-mat-noir/60 italic leading-relaxed">
                    "{profile.bio}"
                  </p>
                )}
              </div>

              <p className="mat-text-apple-display text-[7px] lg:text-[9px] tracking-[0.4em] text-mat-noir/20 uppercase mt-4">Identity Authenticated</p>
            </div>
        </div>

        {/* 2. SYMMETRICAL STATS GRID (2 COLUMNS) */}
        <div className="w-full grid grid-cols-2 gap-3 lg:gap-6 my-4 lg:my-8 flex-shrink-0 max-w-2xl mx-auto">
           <GlassMetric label="Matches" value={String(metrics.matches || 0)} icon={<Heart size={18} />} delay={0.1} />
           <GlassMetric label="Discovery" value={`${discoveryDepth}%`} icon={<Compass size={18} />} delay={0.2} />
           <GlassMetric label="Immersion" value={`${immersionHours}h`} icon={<Clock size={18} />} delay={0.3} />
           <GlassMetric label="Rank" value={metrics.safetyLevel ?? 'Gold'} icon={<Star size={18} />} delay={0.4} />
        </div>

        {/* 3. COMPACT CONTROLS */}
        <div className="w-full flex flex-col items-center gap-6 lg:gap-10 mt-auto flex-shrink-0 pb-6">
           {profile?.is_influencer ? (
             <motion.button 
               whileHover={{ scale: 1.02 }}
               whileTap={{ scale: 0.98 }}
               onClick={() => setIsEditing(true)}
               className="w-full lg:w-96 py-5 rounded-[100px] bg-mat-noir text-white mat-text-apple-display text-[9px] tracking-[0.4em] font-bold shadow-2xl hover:bg-mat-rose-gold transition-all flex items-center justify-center gap-3 group"
             >
               Edit Profile <Sparkles size={14} className="group-hover:rotate-12 transition-transform" />
             </motion.button>
           ) : (
             <motion.button 
               whileHover={{ scale: 1.02 }}
               whileTap={{ scale: 0.98 }}
               onClick={onBeginDiscovery}
               className="w-full lg:w-96 py-5 rounded-[100px] bg-mat-noir text-white mat-text-apple-display text-[9px] tracking-[0.4em] font-bold shadow-2xl hover:bg-mat-rose-gold transition-all flex items-center justify-center gap-3 group"
             >
               Enter Discovery <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
             </motion.button>
           )}

           <div className="flex items-center justify-center gap-12 w-full max-w-lg text-mat-noir/30">
              <button onClick={() => setShowArchitect(true)} className="flex items-center gap-2 text-mat-rose-gold hover:text-mat-noir transition-colors group">
                 <Sparkles size={12} className="group-hover:rotate-12 transition-transform" />
                 <span className="mat-text-apple-display text-[8px] tracking-[0.2em] font-black uppercase">Architect</span>
              </button>

              <button onClick={() => setShowPlaybook(true)} className="flex items-center gap-2 hover:text-mat-noir transition-colors group">
                 <Compass size={12} className="group-hover:rotate-45 transition-transform" />
                 <span className="mat-text-apple-display text-[8px] tracking-[0.2em] font-black uppercase">Playbook</span>
              </button>

              {!isVerified && (
                 <button onClick={() => window.location.href = '/verify'} className="flex items-center gap-2 text-mat-rose-gold animate-pulse">
                    <ShieldCheck size={12} />
                    <span className="mat-text-apple-display text-[8px] tracking-[0.2em] font-black uppercase">Verify</span>
                 </button>
              )}


              <button 
                onClick={() => window.open('https://blogs.matriarchindia.com', '_blank')} 
                className="flex items-center gap-2 hover:text-mat-noir transition-colors group"
              >
                 <BookOpen size={12} className="group-hover:scale-110 transition-transform" />
                 <span className="mat-text-apple-display text-[8px] tracking-[0.2em] font-black uppercase">Blogs</span>
              </button>

              <button onClick={() => setShowFAQ(true)} className="mat-text-apple-display text-[8px] tracking-[0.2em] hover:text-mat-noir transition-colors uppercase font-bold">Knowledge</button>
           </div>
        </div>

      </main>

      {/* 🍎 MODALS ═══════════════════════════════════════ */}
      <BrainstormingModal isOpen={showArchitect} onClose={() => setShowArchitect(false)} />
      
      <AnimatePresence>
        {showPlaybook && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-0 bg-white/60 backdrop-blur-[50px]"
            onClick={() => setShowPlaybook(false)}
          >
            <div className="w-full h-full flex flex-col relative pt-[72px]" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setShowPlaybook(false)} 
                className="absolute top-20 right-8 w-12 h-12 border border-mat-noir/10 text-mat-noir/40 hover:text-mat-rose-gold transition-all duration-500 z-20 flex items-center justify-center rounded-full bg-white shadow-lg"
              >
                <X size={20} />
              </button>
              
              <div className="flex-1 w-full overflow-y-auto custom-scrollbar px-6 py-12">
                <div className="max-w-4xl mx-auto">
                   <Playbook />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showFAQ && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-0 bg-white/60 backdrop-blur-[50px]"
            onClick={() => setShowFAQ(false)}
          >
            <div className="w-full h-full flex flex-col relative pt-[72px]" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setShowFAQ(false)} 
                className="absolute top-20 right-8 w-12 h-12 border border-mat-noir/10 text-mat-noir/40 hover:text-mat-rose-gold transition-all duration-500 z-20 flex items-center justify-center rounded-full bg-white shadow-lg"
              >
                <X size={20} />
              </button>
              
              <div className="flex-1 w-full overflow-y-auto custom-scrollbar px-6 py-12">
                <div className="max-w-2xl mx-auto">
                   <span className="mat-text-apple-display text-[10px] tracking-[1em] text-mat-noir/20 mb-8 block text-center uppercase">Sanctum Intel</span>
                   <div className="pointer-events-auto opacity-70"><FAQ /></div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>


    </div>
  );
};

export default WomenSanctuary;
