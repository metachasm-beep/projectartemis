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
  LayoutGrid,
  X,
  Bookmark,
  HelpCircle,
  ArrowRight,
  TrendingUp,
  Award
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { FAQ } from '@/components/FAQ';
import { VerificationPaymentModal } from '@/components/verification/VerificationPaymentModal';
import { useAuth } from '@/hooks/useAuth';

/**
 * 🍷 VelvetStat: A low-blur, glassmorphic stat card
 */
const VelvetStat = ({ label, value, icon, delay = 0 }: { label: string, value: string, icon: React.ReactNode, delay?: number }) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.8 }}
    className="mat-velvet-card p-6 lg:p-8 rounded-3xl flex flex-col gap-4 group hover:bg-white/[0.05] transition-colors"
  >
    <div className="flex justify-between items-start">
      <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.05] text-mat-rose-gold group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <TrendingUp size={14} className="text-white/10 group-hover:text-mat-rose-gold transition-colors" />
    </div>
    <div>
      <h3 className="mat-text-velvet-huge text-4xl lg:text-5xl mb-1">
        {value}
      </h3>
      <p className="mat-text-editorial-caps text-[9px] tracking-[0.3em] opacity-30 group-hover:opacity-60 transition-opacity">
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
    { label: 'Profile Views',  value: String(metrics.profileViews || 0),   icon: <Eye size={20} /> },
    { label: 'Trust Score',    value: `${completeness}%`,                   icon: <ShieldCheck size={20} /> },
    { label: 'Sanctuary Rank', value: metrics.safetyLevel ?? 'Gold',        icon: <Award size={20} /> },
    { label: 'Active Matches', value: String(metrics.matches || 0),         icon: <Heart size={20} /> },
  ];

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden bg-[#050505] text-white flex flex-col mat-cinematic-grain selection:bg-mat-rose-gold selection:text-white">
      
      {/* 🍷 VELVET CANVAS ══════════════════════════════ */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 lg:px-12 py-8 lg:py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-0 overflow-y-auto custom-scrollbar">
        
        {/* Left: Identity Hero (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-8">
           <div className="mat-velvet-card p-8 lg:p-10 rounded-[40px] flex flex-col items-center text-center gap-6 relative overflow-hidden group">
              {/* Animated Glow behind Aura */}
              <div className="absolute inset-0 bg-gradient-to-b from-mat-rose-gold/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.2 }}
                className="relative w-48 h-48 lg:w-56 lg:h-56 z-10"
              >
                 <div className="w-full h-full rounded-full border-2 border-white/5 p-3 relative">
                    <div className="w-full h-full rounded-full overflow-hidden border border-mat-rose-gold/20 shadow-[0_0_50px_rgba(183,110,121,0.1)]">
                       <img 
                         src={profile?.photos?.[0] || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=800"} 
                         alt="Aura" 
                         className="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-[3000ms]"
                       />
                    </div>
                    {/* Pulsing Ring */}
                    <motion.div 
                      animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0, 0.1] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="absolute -inset-4 rounded-full border border-mat-rose-gold/30"
                    />
                 </div>

                 {/* Status Badge */}
                 <div className="absolute bottom-4 right-4 bg-mat-rose-gold p-2 rounded-full shadow-lg border border-white/20">
                    <Sparkles size={14} className="text-white" />
                 </div>
              </motion.div>

              <div className="space-y-2 z-10">
                 <h1 className="mat-text-velvet-huge text-5xl lg:text-6xl text-white">
                    {profile?.full_name?.split(' ')[0] || 'Aspirant'}<span className="text-mat-rose-gold">.</span>
                 </h1>
                 <p className="mat-text-editorial-caps text-[10px] tracking-[0.5em] text-white/40">Verified Sanctuary Identity</p>
              </div>

              <div className="flex gap-4 w-full z-10 mt-4">
                 <button 
                   onClick={() => setIsEditing(true)}
                   className="flex-1 py-4 rounded-2xl bg-white/5 border border-white/10 mat-text-editorial-caps text-[9px] tracking-[0.4em] hover:bg-white/10 transition-all"
                 >
                   Curate
                 </button>
                 <button 
                   onClick={() => setShowFAQ(true)}
                   className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                 >
                   <HelpCircle size={18} className="opacity-40" />
                 </button>
              </div>
           </div>

           {/* Quick Actions Card */}
           <div className="mat-velvet-card p-8 rounded-[40px] flex flex-col gap-6">
              <h4 className="mat-text-editorial-caps text-[10px] tracking-[0.4em] opacity-40">Quick Actions</h4>
              <div className="space-y-4">
                 {!isVerified && (
                   <button 
                     onClick={() => setShowVerification(true)}
                     className="w-full py-5 rounded-2xl bg-gradient-to-r from-mat-rose-gold to-mat-gold/50 text-white mat-text-editorial-caps text-[9px] tracking-[0.4em] font-black hover:brightness-110 transition-all shadow-[0_10px_30px_rgba(183,110,121,0.3)]"
                   >
                     Apply Verification
                   </button>
                 )}
                 <button 
                   onClick={onBeginDiscovery}
                   className="w-full py-5 rounded-2xl bg-white text-mat-noir mat-text-editorial-caps text-[9px] tracking-[0.4em] font-black hover:bg-mat-rose-gold hover:text-white transition-all flex items-center justify-center gap-3"
                 >
                   Enter Discovery <ArrowRight size={14} />
                 </button>
              </div>
           </div>
        </div>

        {/* Right: Metrics & Intel (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-8">
           {/* Top Stats Row */}
           <div className="grid grid-cols-2 lg:grid-cols-2 gap-6 h-full lg:h-1/2">
              {stats.map((stat, i) => (
                <VelvetStat key={i} {...stat} delay={0.2 * i} />
              ))}
           </div>

           {/* Bottom Content Area: System Status */}
           <div className="mat-velvet-card flex-1 rounded-[40px] p-8 lg:p-10 flex flex-col justify-between relative overflow-hidden group">
              {/* Subtle Pattern overlay */}
              <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)', backgroundSize: '32px 32px' }} />
              
              <div className="flex justify-between items-start z-10">
                 <div className="space-y-1">
                    <h4 className="mat-text-editorial-caps text-[10px] tracking-[0.4em] text-mat-rose-gold">Sanctuary Health</h4>
                    <p className="text-white/40 text-[11px] font-light max-w-xs leading-relaxed">Your neural footprint is currently optimized. Your trust score has increased by 4% this week.</p>
                 </div>
                 <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[9px] font-bold text-green-500 uppercase tracking-widest">Active</span>
                 </div>
              </div>

              <div className="grid grid-cols-3 gap-8 z-10 mt-12">
                 {[
                   { label: 'Network', value: 'Prime' },
                   { label: 'Privacy', value: 'Stealth' },
                   { label: 'Storage', value: 'Cloud' }
                 ].map((item, i) => (
                    <div key={i} className="space-y-2">
                       <p className="mat-text-editorial-caps text-[8px] tracking-[0.3em] opacity-30">{item.label}</p>
                       <p className="text-xl font-light text-white/90">{item.value}</p>
                    </div>
                 ))}
              </div>

              {/* Progress Detail */}
              <div className="w-full h-[1px] bg-white/5 my-8" />
              
              <div className="flex justify-between items-end z-10">
                 <div className="flex -space-x-3">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-[#0A0A0A] bg-white/10 overflow-hidden">
                         <img src={`https://i.pravatar.cc/100?u=${i}`} className="w-full h-full object-cover grayscale opacity-50" alt="avatar" />
                      </div>
                    ))}
                    <div className="w-8 h-8 rounded-full border-2 border-[#0A0A0A] bg-mat-rose-gold flex items-center justify-center text-[10px] font-bold">+12</div>
                 </div>
                 <p className="mat-text-editorial-caps text-[8px] tracking-[0.3em] opacity-30">Selection Index v5.2.0 Velvet</p>
              </div>
           </div>
        </div>

      </main>

      {/* ══ MODALS ═══════════════════════════════════════ */}
      <AnimatePresence>
        {showFAQ && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-0 bg-[#050505]"
            onClick={() => setShowFAQ(false)}
          >
            <div className="w-full h-full flex flex-col relative" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setShowFAQ(false)} 
                className="absolute top-12 right-12 w-16 h-16 border border-mat-rose-gold text-mat-rose-gold hover:bg-mat-rose-gold hover:text-white transition-all duration-500 z-20 flex items-center justify-center rounded-full"
              >
                <X size={24} />
              </button>
              
              <div className="flex-1 w-full overflow-y-auto custom-scrollbar px-8 md:px-32 py-32 lg:py-48">
                <div className="max-w-6xl mx-auto">
                   <span className="mat-text-editorial-caps text-[12px] tracking-[1em] text-mat-rose-gold mb-12 block text-center">Protocol Gnosis</span>
                   <div className="pointer-events-auto"><FAQ /></div>
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
