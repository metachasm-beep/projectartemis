import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  Zap, 
  Heart, 
  Activity, 
  Sparkles,
  Eye,
  Star,
  X,
  HelpCircle,
  ArrowRight,
  Fingerprint,
  Cpu,
  Waves
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { FAQ } from '@/components/FAQ';
import { VerificationPaymentModal } from '@/components/verification/VerificationPaymentModal';
import { useAuth } from '@/hooks/useAuth';

/**
 * 💡 NeonStat: A high-tech stat card with diffused neon glow
 */
const NeonStat = ({ label, value, icon, color = "#B76E79", delay = 0 }: { label: string, value: string, icon: React.ReactNode, color?: string, delay?: number }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, duration: 0.8 }}
    style={{ "--neon-color": color } as any}
    className={cn(
      "p-6 lg:p-10 rounded-[40px] bg-white/[0.02] flex flex-col justify-between group transition-all duration-500",
      color === "#B76E79" ? "mat-neon-border-rose" : "mat-neon-border-violet"
    )}
  >
    <div className="flex justify-between items-start">
       <div className="p-4 rounded-3xl bg-white/[0.03] text-white/80 group-hover:animate-neon-breathe transition-all">
          {icon}
       </div>
       <Zap size={14} className="text-white/5 group-hover:text-white/20" />
    </div>
    <div className="mt-8">
       <h3 className={cn("mat-text-liquid-neon text-5xl lg:text-6xl font-extralight tracking-tighter mb-2")}>
          {value}
       </h3>
       <p className="mat-text-editorial-caps text-[9px] tracking-[0.5em] opacity-20 group-hover:opacity-40 transition-opacity">
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
    { label: 'Sanctuary Trust', value: `${completeness}%`, icon: <ShieldCheck />, color: "#B76E79" },
    { label: 'Neural Matches',  value: String(metrics.matches || 0), icon: <Heart />, color: "#8B5CF6" },
  ];

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden bg-[#020202] text-white flex flex-col mat-cinematic-grain selection:bg-violet-500 selection:text-white">
      
      {/* 💡 NEON SANCTUM CANVAS ════════════════════════ */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-6 lg:p-12 flex flex-col lg:grid lg:grid-cols-12 gap-6 min-h-0 overflow-y-auto lg:overflow-hidden custom-scrollbar">
        
        {/* Left: Bio-Identity Hero (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
           <div className="flex-1 rounded-[50px] bg-white/[0.01] border border-white/[0.05] p-10 flex flex-col items-center justify-center text-center gap-10 relative overflow-hidden group">
              {/* Diffused Atmosphere Glows */}
              <div className="absolute -top-20 -left-20 w-80 h-80 bg-mat-rose-gold/10 rounded-full blur-[120px] animate-pulse" />
              <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-violet-500/10 rounded-full blur-[120px] animate-pulse" />

              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.5 }}
                className="relative z-10"
              >
                 <div className="w-56 h-56 lg:w-64 lg:h-64 rounded-full border border-white/5 p-4 relative group-hover:scale-105 transition-transform duration-1000">
                    <div className="w-full h-full rounded-full overflow-hidden border border-white/10 shadow-[0_0_80px_rgba(255,255,255,0.05)]">
                       <img 
                         src={profile?.photos?.[0] || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=800"} 
                         alt="Aura" 
                         className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-[2000ms]"
                       />
                    </div>
                    {/* Bio-scanner line */}
                    <motion.div 
                      animate={{ top: ['0%', '100%', '0%'] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                      className="absolute left-0 right-0 h-px bg-mat-rose-gold/40 shadow-[0_0_15px_rgba(183,110,121,1)] z-20 pointer-events-none"
                    />
                 </div>
              </motion.div>

              <div className="space-y-4 z-10">
                 <h1 className="text-6xl lg:text-7xl font-thin tracking-tighter text-white/90">
                    {profile?.full_name?.split(' ')[0] || 'Aspirant'}<span className="text-mat-rose-gold animate-pulse">_</span>
                 </h1>
                 <div className="flex items-center justify-center gap-4">
                    <span className="mat-text-editorial-caps text-[9px] tracking-[0.6em] text-white/30 uppercase">Protocol Authenticated</span>
                    <Fingerprint size={12} className="text-mat-rose-gold" />
                 </div>
              </div>

              <div className="w-full grid grid-cols-2 gap-4 z-10">
                 <button onClick={() => setIsEditing(true)} className="py-5 rounded-3xl bg-white/[0.03] border border-white/10 text-[9px] uppercase tracking-widest font-black hover:bg-white/10 transition-all">Curate</button>
                 <button onClick={() => setShowFAQ(true)} className="py-5 rounded-3xl bg-white/[0.03] border border-white/10 text-white/40 hover:text-white transition-all flex items-center justify-center"><HelpCircle size={18} /></button>
              </div>
           </div>
        </div>

        {/* Right: Metrics & System (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
           {/* Top Stats Row */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full lg:h-1/2">
              {stats.map((stat, i) => (
                <NeonStat key={i} {...stat} delay={0.2 * i} />
              ))}
           </div>

           {/* Bottom: Discovery & Verification */}
           <div className="flex-1 grid grid-cols-1 md:grid-cols-1 gap-6">
              <div className="rounded-[50px] bg-white/[0.01] border border-white/5 p-10 flex flex-col lg:flex-row items-center justify-between gap-10 group relative overflow-hidden">
                 <div className="space-y-4 z-10">
                    <div className="flex items-center gap-3">
                       <Waves size={16} className="text-violet-400" />
                       <h4 className="mat-text-editorial-caps text-[10px] tracking-[0.4em] text-violet-400">Neural Discovery</h4>
                    </div>
                    <p className="text-white/30 text-[12px] font-light max-w-xs leading-relaxed">Your profile is currently broadcasting. 14 potential matches are within your resonance radius.</p>
                 </div>

                 <div className="relative z-10">
                    <button 
                      onClick={onBeginDiscovery}
                      className="group relative w-32 h-32 rounded-full border border-white/10 flex items-center justify-center hover:border-violet-500/50 transition-all duration-700"
                    >
                       <div className="absolute inset-2 rounded-full border border-dashed border-white/5 group-hover:animate-[spin_10s_linear_infinite]" />
                       <ArrowRight size={32} className="text-white group-hover:translate-x-1 group-hover:text-violet-400 transition-all" />
                    </button>
                 </div>
              </div>

              <div className="flex gap-6">
                 <button 
                   onClick={() => setShowVerification(true)}
                   className="flex-1 py-6 rounded-3xl bg-white text-black mat-text-editorial-caps text-[10px] tracking-[0.5em] font-black hover:bg-mat-rose-gold hover:text-white transition-all shadow-[0_20px_60px_rgba(0,0,0,0.5)] flex items-center justify-center gap-4"
                 >
                   Apply Verification <Sparkles size={16} />
                 </button>
                 <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 flex items-center justify-center">
                    <Cpu size={20} className="text-white/20" />
                 </div>
              </div>
           </div>
        </div>

      </main>

      {/* 💡 MODALS ═══════════════════════════════════════ */}
      <AnimatePresence>
        {showFAQ && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-0 bg-[#020202]"
            onClick={() => setShowFAQ(false)}
          >
            <div className="w-full h-full flex flex-col relative" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setShowFAQ(false)} 
                className="absolute top-12 right-12 w-16 h-16 border border-white/10 text-white/40 hover:text-mat-rose-gold transition-all duration-500 z-20 flex items-center justify-center rounded-full bg-white/5 backdrop-blur-xl"
              >
                <X size={24} />
              </button>
              
              <div className="flex-1 w-full overflow-y-auto custom-scrollbar px-8 md:px-32 py-32 lg:py-48">
                <div className="max-w-6xl mx-auto">
                   <span className="mat-text-editorial-caps text-[12px] tracking-[1em] text-mat-rose-gold mb-12 block text-center">Sanctum Registry</span>
                   <div className="pointer-events-auto opacity-80"><FAQ /></div>
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
