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
  Menu
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { FAQ } from '@/components/FAQ';
import { VerificationPaymentModal } from '@/components/verification/VerificationPaymentModal';
import { useAuth } from '@/hooks/useAuth';

/**
 * 🖋️ EditorialStat: A high-fashion minimalist stat display
 */
const EditorialStat = ({ label, value, icon, delay = 0 }: { label: string, value: string, icon: React.ReactNode, delay?: number }) => (
  <motion.div 
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay, duration: 0.8 }}
    className="flex flex-col items-start gap-4 p-6 lg:p-10 border-r border-b border-mat-gold/10"
  >
    <div className="text-mat-gold opacity-50">{icon}</div>
    <div className="space-y-1">
      <h3 className="mat-text-fluid-huge leading-[0.7] text-mat-noir" style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}>
        {value}
      </h3>
      <p className="mat-text-editorial-label">{label}</p>
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
  const memberSince = profile?.created_at ? new Date(profile.created_at).getFullYear() : '--';

  const stats = [
    { label: 'Views',      value: String(metrics.profileViews || 0),          icon: <Eye size={18} /> },
    { label: 'Trust',      value: `${completeness}%`,                          icon: <ShieldCheck size={18} /> },
    { label: 'Matches',    value: String(metrics.matches || 0),                icon: <Heart size={18} /> },
    { label: 'Status',     value: metrics.safetyLevel ?? 'Gold',               icon: <Star size={18} /> },
  ];

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden bg-mat-bone flex flex-col selection:bg-mat-rose-gold selection:text-white">
      
      {/* ══ MINIMALIST NAV ══════════════════════════════ */}
      <nav className="relative z-20 w-full flex justify-between items-center px-8 py-8 lg:px-20 border-b border-mat-gold/10 shrink-0">
        <div className="flex items-center gap-12">
          <h2 className="mat-text-editorial-caps text-[10px] tracking-[1em] opacity-40">Matriarch Protocol</h2>
          <div className="hidden lg:flex items-center gap-8">
            {['Sanctuary', 'Identity', 'Discovery'].map((link) => (
              <span key={link} className="mat-text-editorial-caps text-[9px] tracking-[0.4em] cursor-pointer hover:text-mat-gold transition-colors">{link}</span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-6">
           <button onClick={() => setShowFAQ(true)} className="p-2 text-mat-noir/40 hover:text-mat-gold transition-colors">
              <HelpCircle size={20} strokeWidth={1.5} />
           </button>
           <button 
             onClick={() => setIsEditing(true)}
             className="hidden lg:block px-8 py-3 bg-mat-noir text-white mat-text-editorial-caps text-[9px] tracking-[0.4em] font-black hover:bg-mat-gold transition-all duration-500"
           >
             Curate Profile
           </button>
           <button className="lg:hidden p-2 text-mat-noir">
              <Menu size={24} strokeWidth={1.5} />
           </button>
        </div>
      </nav>

      {/* ══ EDITORIAL BODY ══════════════════════════════ */}
      <main className="flex-1 w-full flex flex-col lg:flex-row min-h-0">
        
        {/* Left: Huge Display Identity */}
        <div className="flex-[1.2] flex flex-col justify-center px-8 lg:px-20 py-12 lg:py-0 border-b lg:border-b-0 lg:border-r border-mat-gold/10">
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              <h1 className="mat-text-fluid-huge text-mat-noir leading-[0.8]">
                {profile?.full_name?.split(' ')[0] || 'Existence'}<span className="text-mat-gold">.</span>
              </h1>
              <div className="flex items-center gap-4 mt-8">
                 <div className="h-px w-12 bg-mat-gold/30" />
                 <p className="mat-text-editorial-caps text-[10px] tracking-[0.6em] text-mat-noir/30">Member Since {memberSince}</p>
              </div>
            </motion.div>

            <div className="flex flex-wrap gap-4 pt-12">
              {!isVerified && (
                <button 
                  onClick={() => setShowVerification(true)}
                  className="px-10 py-5 bg-mat-bone border border-mat-gold text-mat-gold mat-text-editorial-caps text-[10px] tracking-[0.5em] font-black hover:bg-mat-gold hover:text-white transition-all duration-700"
                >
                  Apply Verification
                </button>
              )}
              <button 
                onClick={onBeginDiscovery}
                className="px-10 py-5 bg-mat-noir text-white mat-text-editorial-caps text-[10px] tracking-[0.5em] font-black hover:bg-mat-gold transition-all duration-700 flex items-center gap-4 group"
              >
                Enter Discovery <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Right: The Grid & Aura */}
        <div className="flex-1 flex flex-col min-h-0">
          
          {/* Top: 2x2 Stats Grid */}
          <div className="grid grid-cols-2 flex-1">
            {stats.map((stat, i) => (
              <EditorialStat key={i} {...stat} delay={0.2 * i} />
            ))}
          </div>

          {/* Bottom: Aura Visual Focus */}
          <div className="relative h-1/3 lg:h-1/2 flex items-center justify-center p-8 overflow-hidden bg-mat-cashmere/20">
             {/* Subtle Background Pattern */}
             <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #000 1px, transparent 0)', backgroundSize: '40px 40px' }} />
             
             <motion.div 
               initial={{ scale: 0.9, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
               className="relative w-40 h-40 lg:w-64 lg:h-64 shrink-0"
             >
                <div className="w-full h-full rounded-full border border-mat-gold/20 p-2 relative">
                   <div className="w-full h-full rounded-full overflow-hidden grayscale hover:grayscale-0 transition-all duration-[2000ms] shadow-2xl">
                      <img 
                        src={profile?.photos?.[0] || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=800"} 
                        alt="Aura" 
                        className="w-full h-full object-cover scale-110"
                      />
                   </div>
                   
                   {/* Minimalist Orbitals */}
                   <motion.div 
                     animate={{ rotate: 360 }}
                     transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                     className="absolute -inset-4 border border-mat-gold/10 rounded-full"
                   />
                   <motion.div 
                     animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.6, 0.3] }}
                     transition={{ duration: 4, repeat: Infinity }}
                     className="absolute inset-0 rounded-full bg-mat-gold/5 blur-2xl -z-10"
                   />
                </div>
                
                {/* Floating Micro-UI detail */}
                <div className="absolute -right-12 top-1/2 -translate-y-1/2 rotate-90 hidden lg:block">
                   <p className="mat-text-editorial-caps text-[8px] tracking-[1.5em] opacity-20 whitespace-nowrap">Authentication Sequence Complete</p>
                </div>
             </motion.div>
          </div>
        </div>

      </main>

      {/* ══ SYSTEM FOOTER ═══════════════════════════════ */}
      <footer className="shrink-0 w-full px-8 py-6 lg:px-20 border-t border-mat-gold/10 flex justify-between items-center bg-white/50 backdrop-blur-sm">
         <div className="flex gap-8">
            <div className="flex flex-col">
               <span className="mat-text-editorial-label">Sanctum Registry</span>
               <span className="text-[10px] font-bold opacity-30 mt-1">ID_{profile?.user_id?.slice(0,8) || 'SYSTEM'}</span>
            </div>
            <div className="flex flex-col">
               <span className="mat-text-editorial-label">Selection Index</span>
               <span className="text-[10px] font-bold opacity-30 mt-1">v5.2.0 Ivory</span>
            </div>
         </div>

         <div className="flex items-center gap-4">
            <Sparkles size={14} className="text-mat-gold" />
            <span className="mat-text-editorial-caps text-[9px] tracking-[0.4em] opacity-30">All Protocols Optimal</span>
         </div>
      </footer>

      {/* ══ MODALS ═══════════════════════════════════════ */}
      <AnimatePresence>
        {showFAQ && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-0 bg-mat-bone"
            onClick={() => setShowFAQ(false)}
          >
            <div className="w-full h-full flex flex-col relative" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setShowFAQ(false)} 
                className="absolute top-12 right-12 w-16 h-16 border border-mat-gold text-mat-gold hover:bg-mat-gold hover:text-white transition-all duration-500 z-20 flex items-center justify-center rounded-full"
              >
                <X size={24} />
              </button>
              
              <div className="flex-1 w-full overflow-y-auto custom-scrollbar px-8 md:px-32 py-32 lg:py-48">
                <div className="max-w-6xl mx-auto">
                   <span className="mat-text-editorial-caps text-[12px] tracking-[1em] text-mat-gold mb-12 block">Gnosis Registry</span>
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
