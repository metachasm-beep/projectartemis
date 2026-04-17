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
  Bookmark,
  TrendingUp,
  Camera
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { FAQ } from '@/components/FAQ';
import { VerificationPaymentModal } from '@/components/verification/VerificationPaymentModal';
import { useAuth } from '@/hooks/useAuth';

/**
 * 🎞️ EditorialBlock: A high-fashion stat block with vertical labels
 */
const EditorialBlock = ({ label, value, delay = 0 }: { label: string, value: string, delay?: number }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 1, ease: [0.16, 1, 0.3, 1] }}
    className="flex items-start gap-4 p-6 lg:p-10 border-b border-mat-silk/10 group"
  >
    <div className="mat-text-vertical mat-text-editorial-caps text-[8px] tracking-[0.5em] text-mat-silk/30 group-hover:text-mat-silk transition-colors">
       {label}
    </div>
    <div className="space-y-1">
       <h3 className="mat-text-chic-serif text-5xl lg:text-7xl text-mat-silk uppercase">
          {value}
       </h3>
       <div className="h-px w-12 bg-mat-silk group-hover:w-full transition-all duration-700 origin-left" />
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
    { label: 'Neural Index', value: `${completeness}%` },
    { label: 'Matches',      value: String(metrics.matches || 0) },
    { label: 'Visibility',   value: String(metrics.profileViews || 0) },
    { label: 'Sanctum Rank', value: metrics.safetyLevel ?? 'Gold' },
  ];

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden bg-mat-cashmere flex flex-col selection:bg-mat-silk selection:text-white">
      
      {/* 🎞️ EDITORIAL AURA CANVAS ═════════════════════ */}
      <main className="flex-1 w-full flex flex-col lg:flex-row min-h-0">
        
        {/* Left: Huge Photo Hero (Desktop: 50%, Mobile: Top 40%) */}
        <div className="flex-1 relative overflow-hidden h-[45dvh] lg:h-full">
           <motion.div 
             initial={{ scale: 1.1, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             transition={{ duration: 1.5, ease: "circOut" }}
             className="w-full h-full"
           >
              <img 
                src={profile?.photos?.[0] || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=1200"} 
                alt="Editorial Aura" 
                className="w-full h-full object-cover grayscale brightness-90 hover:grayscale-0 hover:brightness-100 transition-all duration-[2000ms]"
              />
              
              {/* Overlay Content */}
              <div className="absolute inset-0 bg-gradient-to-t from-mat-silk/80 via-transparent to-transparent flex flex-col justify-end p-8 lg:p-20">
                 <motion.div
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ delay: 0.5, duration: 1 }}
                   className="space-y-4"
                 >
                    <span className="mat-text-editorial-caps text-[10px] tracking-[1em] text-white/50">Issue No. 001</span>
                    <h1 className="mat-text-chic-serif text-7xl lg:text-[10rem] text-white leading-none uppercase tracking-tighter">
                       {profile?.full_name?.split(' ')[0] || 'aspirant'}
                    </h1>
                 </motion.div>
              </div>
           </motion.div>
           
           {/* Floating Floating UI detail */}
           <div className="absolute top-12 left-12 flex items-center gap-4 text-white/40">
              <Camera size={14} />
              <span className="mat-text-editorial-caps text-[8px] tracking-[0.5em]">Identity Captured</span>
           </div>
        </div>

        {/* Right: The Grid & Intel (Desktop: 50%, Mobile: Scrollable Bottom) */}
        <div className="flex-1 flex flex-col min-h-0 bg-white lg:bg-transparent overflow-y-auto custom-scrollbar">
           
           {/* Primary Navigation / Actions */}
           <div className="flex border-b border-mat-silk/10">
              <button 
                onClick={onBeginDiscovery}
                className="flex-1 p-10 lg:p-16 bg-mat-silk text-white hover:bg-mat-silk/90 transition-all group flex items-center justify-between"
              >
                 <span className="mat-text-chic-serif text-3xl lg:text-4xl">Enter Discovery</span>
                 <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
              </button>
              <button 
                onClick={() => setIsEditing(true)}
                className="p-10 lg:p-16 border-l border-mat-silk/10 hover:bg-mat-cashmere transition-all"
              >
                 <span className="mat-text-editorial-caps text-[10px] tracking-[0.4em] text-mat-silk">Curate</span>
              </button>
           </div>

           {/* Stats Board */}
           <div className="grid grid-cols-1 lg:grid-cols-2 flex-1">
              {stats.map((stat, i) => (
                <EditorialBlock key={i} {...stat} delay={0.2 * i} />
              ))}
           </div>

           {/* Verification Footnote */}
           <div className="p-10 lg:p-20 flex flex-col lg:flex-row items-center justify-between gap-12 mt-auto">
              {!isVerified ? (
                 <div className="flex flex-col gap-6 w-full lg:w-auto">
                    <p className="mat-text-editorial-caps text-[9px] tracking-[0.5em] text-mat-silk/30">Authentication Pending</p>
                    <button 
                      onClick={() => setShowVerification(true)}
                      className="px-12 py-5 border border-mat-silk text-mat-silk mat-text-editorial-caps text-[10px] tracking-[0.6em] font-black hover:bg-mat-silk hover:text-white transition-all"
                    >
                      Apply for Verification
                    </button>
                 </div>
              ) : (
                 <div className="flex items-center gap-6">
                    <ShieldCheck size={32} className="text-mat-silk opacity-20" />
                    <span className="mat-text-editorial-caps text-[11px] tracking-[0.5em] text-mat-silk">Identity Authenticated</span>
                 </div>
              )}
              
              <button 
                onClick={() => setShowFAQ(true)}
                className="group flex items-center gap-6"
              >
                 <HelpCircle size={20} className="text-mat-silk/20 group-hover:text-mat-silk transition-colors" />
                 <span className="mat-text-editorial-caps text-[9px] tracking-[0.3em] text-mat-silk/30 group-hover:text-mat-silk transition-colors">Sanctum Gnosis</span>
              </button>
           </div>

        </div>

      </main>

      {/* 🎞️ MODALS ═══════════════════════════════════════ */}
      <AnimatePresence>
        {showFAQ && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-0 bg-mat-silk text-white"
            onClick={() => setShowFAQ(false)}
          >
            <div className="w-full h-full flex flex-col relative" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setShowFAQ(false)} 
                className="absolute top-12 right-12 w-16 h-16 border border-white/20 text-white hover:bg-white hover:text-mat-silk transition-all duration-500 z-20 flex items-center justify-center rounded-full"
              >
                <X size={24} />
              </button>
              
              <div className="flex-1 w-full overflow-y-auto custom-scrollbar px-8 md:px-32 py-32 lg:py-48">
                <div className="max-w-6xl mx-auto">
                   <span className="mat-text-editorial-caps text-[12px] tracking-[1em] text-white/40 mb-12 block text-center">Protocol Gnosis</span>
                   <div className="pointer-events-auto grayscale invert brightness-200"><FAQ /></div>
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
