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
  Menu,
  Infinity as InfinityIcon
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { FAQ } from '@/components/FAQ';
import { VerificationPaymentModal } from '@/components/verification/VerificationPaymentModal';
import { useAuth } from '@/hooks/useAuth';

/**
 * 🧵 ThreadStat: A minimalist stat that sits on a gold line
 */
const ThreadStat = ({ label, value, icon, delay = 0 }: { label: string, value: string, icon: React.ReactNode, delay?: number }) => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: delay + 0.5, duration: 1 }}
    className="flex flex-col gap-2 p-6 lg:p-10 relative"
  >
    <div className="text-mat-gold/40 mb-2">{icon}</div>
    <h3 className="mat-text-luxury-serif text-5xl lg:text-6xl tracking-widest text-white/90">
      {value}
    </h3>
    <p className="mat-text-thread-label">{label}</p>
    
    {/* Decorative corner thread */}
    <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-mat-gold/20" />
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
    { label: 'Views',      value: String(metrics.profileViews || 0),   icon: <Eye size={16} /> },
    { label: 'Trust',      value: `${completeness}%`,                   icon: <ShieldCheck size={16} /> },
    { label: 'Matches',    value: String(metrics.matches || 0),         icon: <Heart size={16} /> },
    { label: 'Status',     value: metrics.safetyLevel ?? 'Gold',        icon: <Star size={16} /> },
  ];

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden bg-black flex flex-col selection:bg-mat-gold selection:text-black">
      
      {/* 🧵 GOLD THREAD CANVAS ═════════════════════════ */}
      <main className="flex-1 w-full flex flex-col lg:flex-row min-h-0 relative">
        
        {/* Decorative Grid Lines (The Threads) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
           <motion.div 
             initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 2, ease: "circOut" }}
             className="absolute top-1/2 left-0 w-full h-px bg-mat-gold/10 origin-left" 
           />
           <motion.div 
             initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 2, ease: "circOut", delay: 0.5 }}
             className="absolute top-0 left-1/2 w-px h-full bg-mat-gold/10 origin-top" 
           />
           {/* Additional subtle threads */}
           <div className="absolute top-[25%] left-0 w-full h-[0.5px] bg-mat-gold/5" />
           <div className="absolute top-[75%] left-0 w-full h-[0.5px] bg-mat-gold/5" />
           <div className="absolute top-0 left-[25%] w-[0.5px] h-full bg-mat-gold/5" />
           <div className="absolute top-0 left-[75%] w-[0.5px] h-full bg-mat-gold/5" />
        </div>

        {/* Identity & Discovery (Left Column) */}
        <div className="flex-1 flex flex-col justify-center px-8 lg:px-24 py-12 lg:py-0 z-10 relative">
           <motion.div
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ duration: 1.2, ease: "circOut" }}
           >
              <span className="mat-text-thread-label mb-6 block">Matriarch Sanctum</span>
              <h1 className="mat-text-luxury-serif text-6xl lg:text-8xl mb-8">
                 {profile?.full_name?.split(' ')[0] || 'Existence'}<span className="text-mat-gold">.</span>
              </h1>
              <p className="max-w-md text-white/40 text-[11px] leading-relaxed tracking-wider mb-12">
                 Welcome to your digital sanctuary. Your neural thread is currently synchronized with the global merit index.
              </p>

              <div className="flex flex-wrap gap-8 items-center">
                 <button 
                   onClick={onBeginDiscovery}
                   className="group relative px-12 py-6 overflow-hidden"
                 >
                    <div className="absolute inset-0 border border-mat-gold/30 group-hover:border-mat-gold transition-colors" />
                    <motion.div 
                      initial={{ width: 0 }} whileHover={{ width: '100%' }}
                      className="absolute bottom-0 left-0 h-[2px] bg-mat-gold transition-all duration-700"
                    />
                    <span className="mat-text-thread-label text-white group-hover:text-mat-gold transition-colors flex items-center gap-3">
                       Discovery <ArrowRight size={14} />
                    </span>
                 </button>

                 {!isVerified && (
                   <button 
                     onClick={() => setShowVerification(true)}
                     className="mat-text-thread-label hover:text-white transition-colors"
                   >
                     Apply Verification
                   </button>
                 )}
              </div>
           </motion.div>
        </div>

        {/* Metrics & Aura (Right Column) */}
        <div className="flex-1 flex flex-col z-10 relative">
           {/* Top Stats */}
           <div className="grid grid-cols-2 flex-1 items-center">
              {stats.map((stat, i) => (
                <ThreadStat key={i} {...stat} delay={i * 0.15} />
              ))}
           </div>

           {/* Bottom Center Focus: The Aura Orb */}
           <div className="flex-1 flex items-center justify-center p-12 lg:p-24 relative overflow-hidden">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
                className="relative"
              >
                 {/* Decorative circular threads */}
                 <div className="absolute -inset-12 border border-mat-gold/10 rounded-full animate-[spin_30s_linear_infinite]" />
                 <div className="absolute -inset-8 border border-mat-gold/5 rounded-full animate-[spin_20s_linear_infinite_reverse]" />
                 
                 <div className="w-48 h-48 lg:w-64 lg:h-64 rounded-full border border-mat-gold/20 p-4 relative group">
                    <div className="w-full h-full rounded-full overflow-hidden grayscale hover:grayscale-0 transition-all duration-1000">
                       <img 
                         src={profile?.photos?.[0] || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=800"} 
                         alt="Aura" 
                         className="w-full h-full object-cover scale-110"
                       />
                    </div>
                    {/* Corner accents */}
                    <div className="absolute -top-4 -left-4 w-8 h-8 border-t-2 border-l-2 border-mat-gold/30" />
                    <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b-2 border-r-2 border-mat-gold/30" />
                 </div>

                 {/* Floating Label */}
                 <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
                    <InfinityIcon size={14} className="text-mat-gold/30" />
                    <p className="mat-text-thread-label text-[7px] tracking-[1.5em] opacity-20 whitespace-nowrap">Sanctuary Syncing...</p>
                 </div>
              </motion.div>
           </div>
        </div>

      </main>

      {/* 🧵 SYSTEM FOOTER ═══════════════════════════════ */}
      <footer className="shrink-0 w-full px-8 py-8 lg:px-24 border-t border-mat-gold/5 flex justify-between items-center bg-black">
         <div className="flex gap-16">
            <div className="space-y-2">
               <span className="mat-text-thread-label opacity-30">Selection ID</span>
               <p className="text-[10px] font-bold text-white/20 tracking-widest">{profile?.user_id?.slice(0,12) || 'A7_PROTOCOL'}</p>
            </div>
            <div className="space-y-2">
               <span className="mat-text-thread-label opacity-30">Status</span>
               <p className="text-[10px] font-bold text-mat-gold/40 tracking-widest uppercase">Operational</p>
            </div>
         </div>

         <div className="flex items-center gap-6">
            <button onClick={() => setIsEditing(true)} className="mat-text-thread-label hover:text-white transition-colors">Edit Identity</button>
            <button onClick={() => setShowFAQ(true)} className="p-2 text-white/20 hover:text-mat-gold transition-colors"><HelpCircle size={18} /></button>
         </div>
      </footer>

      {/* 🧵 MODALS ═══════════════════════════════════════ */}
      <AnimatePresence>
        {showFAQ && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-0 bg-black"
            onClick={() => setShowFAQ(false)}
          >
            <div className="w-full h-full flex flex-col relative" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setShowFAQ(false)} 
                className="absolute top-12 right-12 w-16 h-16 border border-mat-gold text-mat-gold hover:bg-mat-gold hover:text-black transition-all duration-500 z-20 flex items-center justify-center rounded-full"
              >
                <X size={24} />
              </button>
              
              <div className="flex-1 w-full overflow-y-auto custom-scrollbar px-8 md:px-32 py-32 lg:py-48">
                <div className="max-w-6xl mx-auto">
                   <span className="mat-text-thread-label text-[12px] tracking-[1em] text-mat-gold mb-16 block text-center">Protocol Gnosis</span>
                   <div className="pointer-events-auto grayscale invert"><FAQ /></div>
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
