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
  Infinity as InfinityIcon,
  Circle
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { FAQ } from '@/components/FAQ';
import { VerificationPaymentModal } from '@/components/verification/VerificationPaymentModal';
import { useAuth } from '@/hooks/useAuth';

/**
 * 🎨 AuraMetric: A symmetrically designed floating stat
 */
const AuraMetric = ({ label, value, icon, delay = 0 }: { label: string, value: string, icon: React.ReactNode, delay?: number }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
    className="flex flex-col items-center justify-center gap-4 py-8 px-4"
  >
     <div className="text-white/40 mb-2">
        {icon}
     </div>
     <div className="space-y-1">
        <h3 className="mat-text-fluid-huge text-4xl lg:text-5xl text-white font-extralight tracking-[0.1em] lowercase leading-none">
           {value}
        </h3>
        <p className="mat-text-editorial-caps text-[9px] tracking-[0.5em] text-white/40 uppercase">
           {label}
        </p>
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
    { label: 'Views',      value: String(metrics.profileViews || 0),   icon: <Eye size={18} /> },
    { label: 'Trust',      value: `${completeness}%`,                   icon: <ShieldCheck size={18} /> },
    { label: 'Matches',    value: String(metrics.matches || 0),         icon: <Heart size={18} /> },
    { label: 'Status',     value: metrics.safetyLevel ?? 'Gold',        icon: <Star size={18} /> },
  ];

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden mat-aura-fluid-bg flex flex-col selection:bg-white selection:text-black">
      
      {/* 🎨 GENERATIVE FLUID LAYERS ══════════════════ */}
      <div className="absolute inset-0 z-0">
         <div className="mat-aura-fluid-layer" style={{ animationDelay: '0s' }} />
         <div className="mat-aura-fluid-layer" style={{ animationDelay: '-5s', opacity: 0.6 }} />
         <div className="mat-aura-fluid-layer" style={{ animationDelay: '-10s', opacity: 0.4 }} />
         
         {/* Deep Overlay to ensure text readability */}
         <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]" />
      </div>

      {/* 🎨 SYMMETRICAL UI ═══════════════════════════ */}
      <main className="relative z-10 flex-1 w-full max-w-5xl mx-auto flex flex-col items-center justify-between py-12 lg:py-24 px-8 overflow-y-auto custom-scrollbar">
        
        {/* Top: Minimal Status Detail */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
          className="flex flex-col items-center gap-4 mb-8"
        >
           <div className="flex items-center gap-3">
              <Circle size={8} className="fill-white/20 text-transparent animate-pulse" />
              <span className="mat-text-editorial-caps text-[10px] tracking-[0.8em] text-white/50 uppercase">Protocol Active</span>
           </div>
        </motion.div>

        {/* Center: The Aura Identity Focus */}
        <div className="flex flex-col items-center gap-12 text-center">
           <motion.div 
             initial={{ scale: 0.8, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
             className="relative"
           >
              {/* Floating Decorative Rings */}
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-12 border border-white/5 rounded-full"
              />
              <motion.div 
                animate={{ rotate: -360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-8 border border-white/10 rounded-full"
              />
              
              <div className="w-48 h-48 lg:w-64 lg:h-64 rounded-full border border-white/20 p-4 relative group">
                 <div className="w-full h-full rounded-full overflow-hidden grayscale hover:grayscale-0 transition-all duration-1000 shadow-[0_0_80px_rgba(255,255,255,0.1)]">
                    <img 
                      src={profile?.photos?.[0] || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=800"} 
                      alt="Aura" 
                      className="w-full h-full object-cover scale-110 group-hover:scale-105 transition-transform duration-1000"
                    />
                 </div>
              </div>

              {/* Verified Badge */}
              {isVerified && (
                 <motion.div 
                   initial={{ opacity: 0, scale: 0 }}
                   animate={{ opacity: 1, scale: 1 }}
                   transition={{ delay: 1 }}
                   className="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow-xl"
                 >
                    <ShieldCheck size={16} className="text-black" />
                 </motion.div>
              )}
           </motion.div>

           <div className="space-y-4">
              <h1 className="mat-text-fluid-huge text-6xl lg:text-8xl text-white font-extralight tracking-tighter leading-none">
                 {profile?.full_name?.split(' ')[0] || 'aspirant'}<span className="text-white/40">.</span>
              </h1>
              <div className="flex items-center justify-center gap-6">
                 <div className="h-px w-8 bg-white/20" />
                 <span className="mat-text-editorial-caps text-[10px] tracking-[0.4em] text-white/40 uppercase">v5.2.0 fluid aura</span>
                 <div className="h-px w-8 bg-white/20" />
              </div>
           </div>
        </div>

        {/* Bottom: Symmetrical Stats Grid */}
        <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-4 mt-12 border-t border-white/5">
           {stats.map((stat, i) => (
             <AuraMetric key={i} {...stat} delay={0.2 * i} />
           ))}
        </div>

        {/* Global Discovery Control */}
        <div className="flex flex-col items-center gap-12 w-full mt-12">
           <motion.button 
             whileHover={{ scale: 1.05 }}
             whileTap={{ scale: 0.95 }}
             onClick={onBeginDiscovery}
             className="px-16 py-6 rounded-full bg-white text-black mat-text-editorial-caps text-[10px] tracking-[0.5em] font-black shadow-[0_20px_50px_rgba(255,255,255,0.2)] hover:shadow-[0_20px_80px_rgba(255,255,255,0.4)] transition-all flex items-center gap-4 group"
           >
             Enter Discovery <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
           </motion.button>

           <div className="flex gap-12">
              <button onClick={() => setIsEditing(true)} className="mat-text-editorial-caps text-[9px] tracking-[0.4em] text-white/40 hover:text-white transition-colors">Curate Profile</button>
              <button onClick={() => setShowFAQ(true)} className="mat-text-editorial-caps text-[9px] tracking-[0.4em] text-white/40 hover:text-white transition-colors">Gnosis Registry</button>
              {!isVerified && (
                 <button onClick={() => setShowVerification(true)} className="mat-text-editorial-caps text-[9px] tracking-[0.4em] text-white/40 hover:text-white transition-colors">Apply Verification</button>
              )}
           </div>
        </div>

      </main>

      {/* 🎨 MODALS ═══════════════════════════════════════ */}
      <AnimatePresence>
        {showFAQ && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-0 bg-black/90 backdrop-blur-3xl"
            onClick={() => setShowFAQ(false)}
          >
            <div className="w-full h-full flex flex-col relative" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setShowFAQ(false)} 
                className="absolute top-12 right-12 w-16 h-16 border border-white/20 text-white/40 hover:text-white transition-all duration-500 z-20 flex items-center justify-center rounded-full"
              >
                <X size={24} />
              </button>
              
              <div className="flex-1 w-full overflow-y-auto custom-scrollbar px-8 md:px-32 py-32 lg:py-48 text-white">
                <div className="max-w-6xl mx-auto">
                   <span className="mat-text-editorial-caps text-[12px] tracking-[1em] text-white/20 mb-12 block text-center uppercase">System Intel</span>
                   <div className="pointer-events-auto opacity-70 grayscale invert brightness-200"><FAQ /></div>
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
