import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useSpring, useMotionValue, useTransform } from 'framer-motion';
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
  Layers,
  Fingerprint
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { FAQ } from '@/components/FAQ';
import { VerificationPaymentModal } from '@/components/verification/VerificationPaymentModal';
import { useAuth } from '@/hooks/useAuth';

/**
 * 💿 HolographicCard: A card with borders that react to device tilt
 */
const HolographicCard = ({ children, className, tiltX, tiltY }: { children: React.ReactNode, className?: string, tiltX: any, tiltY: any }) => {
  const bgPos = useTransform(
    [tiltX, tiltY],
    ([x, y]: any) => `${50 + (x as number) * 0.5}% ${50 + (y as number) * 0.5}%`
  );

  return (
    <motion.div 
      className={cn("mat-holographic-border rounded-[32px] overflow-hidden group", className)}
      style={{ backgroundPosition: bgPos as any }}
    >
      <div className="bg-mat-bone/80 h-full w-full p-6 lg:p-8 flex flex-col justify-between">
        {children}
      </div>
    </motion.div>
  );
};

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

  // 📐 Tilt Motion Values
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springConfig = { damping: 20, stiffness: 150 };
  const tiltX = useSpring(x, springConfig);
  const tiltY = useSpring(y, springConfig);

  useEffect(() => {
    // Desktop: Mouse Move fallback
    const handleMouseMove = (e: MouseEvent) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      x.set((e.clientX - centerX) / 20);
      y.set((e.clientY - centerY) / 20);
    };

    // Mobile: Gyroscope tilt
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma !== null && e.beta !== null) {
        x.set(e.gamma);
        y.set(e.beta - 45); // Adjust for 45 deg natural holding angle
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('deviceorientation', handleOrientation);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, [x, y]);

  const isVerified = profile?.is_verified;
  const completeness = profile?.profile_completeness ?? 94;

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden mat-silk-bg selection:bg-mat-rose-gold selection:text-white">
      
      {/* 🌸 HOLOGRAPHIC SILK CANVAS ═══════════════════ */}
      <main className="h-full w-full max-w-[1600px] mx-auto p-6 lg:p-12 flex flex-col lg:grid lg:grid-cols-12 lg:grid-rows-6 gap-6 overflow-y-auto lg:overflow-hidden custom-scrollbar">
        
        {/* 1. Identity Focus (Mobile: Row 1, Desktop: Col 1-4, Row 1-4) */}
        <div className="lg:col-span-4 lg:row-span-4 flex flex-col gap-6">
           <HolographicCard tiltX={tiltX} tiltY={tiltY} className="flex-1 shadow-2xl">
              <div className="flex justify-between items-start mb-6">
                 <div className="p-4 rounded-3xl bg-mat-rose-gold/10 text-mat-rose-gold">
                    <Fingerprint size={24} />
                 </div>
                 <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-[9px] font-bold text-mat-noir/30 uppercase tracking-widest">Live Aura</span>
                 </div>
              </div>

              <div className="flex flex-col items-center text-center gap-6 mb-8">
                 <div className="relative group">
                    <div className="w-40 h-40 lg:w-48 lg:h-48 rounded-full border-4 border-white shadow-xl overflow-hidden relative z-10 transition-transform duration-700 group-hover:scale-105">
                       <img 
                         src={profile?.photos?.[0] || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=800"} 
                         alt="Aura" 
                         className="w-full h-full object-cover"
                       />
                    </div>
                    {/* Iridescent Glow */}
                    <div className="absolute -inset-4 bg-gradient-to-tr from-[#ff00ff]/20 via-[#00ffff]/20 to-[#ffff00]/20 rounded-full blur-2xl animate-silk-float opacity-50" />
                 </div>
                 
                 <div className="space-y-1">
                    <h1 className="mat-text-fluid-huge text-mat-noir leading-none lowercase">
                       {profile?.full_name?.split(' ')[0] || 'aspirant'}<span className="text-mat-rose-gold">.</span>
                    </h1>
                    <p className="mat-text-editorial-caps text-[10px] tracking-[0.4em] text-mat-noir/20">identity synchronized</p>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                 <button onClick={() => setIsEditing(true)} className="py-4 rounded-2xl bg-mat-noir text-white mat-text-editorial-caps text-[9px] tracking-[0.2em] hover:bg-mat-rose-gold transition-all">Curate</button>
                 <button onClick={() => setShowFAQ(true)} className="py-4 rounded-2xl bg-white border border-mat-noir/5 text-mat-noir/40 hover:text-mat-rose-gold transition-all flex items-center justify-center"><HelpCircle size={18} /></button>
              </div>
           </HolographicCard>
        </div>

        {/* 2. Primary Action (Mobile: Row 2, Desktop: Col 5-8, Row 1-3) */}
        <div className="lg:col-span-4 lg:row-span-3">
           <HolographicCard tiltX={tiltX} tiltY={tiltY} className="h-full bg-white shadow-xl">
              <div className="flex flex-col h-full justify-between">
                 <div className="space-y-4">
                    <h4 className="mat-text-editorial-caps text-[11px] tracking-[0.5em] text-mat-rose-gold">Sanctum Access</h4>
                    <p className="text-mat-noir/40 text-[13px] font-light leading-relaxed">Enter the discovery thread to explore aspirants aligned with your neural profile.</p>
                 </div>

                 <div className="relative py-12 flex justify-center items-center">
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }} className="absolute w-32 h-32 border border-dashed border-mat-rose-gold/20 rounded-full" />
                    <button 
                      onClick={onBeginDiscovery}
                      className="w-24 h-24 rounded-full bg-mat-noir text-white flex items-center justify-center hover:scale-110 transition-transform shadow-[0_15px_40px_rgba(0,0,0,0.2)]"
                    >
                      <ArrowRight size={32} strokeWidth={1} />
                    </button>
                 </div>

                 <div className="flex justify-between items-center text-[10px] font-bold text-mat-noir/20 uppercase tracking-widest">
                    <span>Protocol v5.2</span>
                    <Zap size={14} />
                 </div>
              </div>
           </HolographicCard>
        </div>

        {/* 3. Stats Grid (Col 9-12, Row 1-6) */}
        <div className="lg:col-span-4 lg:row-span-6 grid grid-cols-1 gap-6">
           {[
             { label: 'Trust Level', value: `${completeness}%`, icon: <ShieldCheck />, color: 'text-blue-500' },
             { label: 'Active Matches', value: String(metrics.matches || 0), icon: <Heart />, color: 'text-mat-rose-gold' },
             { label: 'Profile Reach', value: String(metrics.profileViews || 0), icon: <Eye />, color: 'text-mat-gold' },
             { label: 'Sanctuary Rank', value: metrics.safetyLevel ?? 'Gold', icon: <Star />, color: 'text-purple-500' }
           ].map((stat, i) => (
             <HolographicCard key={i} tiltX={tiltX} tiltY={tiltY} className="h-full">
                <div className="flex items-center gap-6">
                   <div className={cn("p-4 rounded-2xl bg-white shadow-inner", stat.color)}>
                      {React.cloneElement(stat.icon as any, { size: 24 })}
                   </div>
                   <div className="space-y-1">
                      <p className="mat-text-editorial-caps text-[9px] tracking-[0.4em] text-mat-noir/20">{stat.label}</p>
                      <h3 className="mat-text-fluid-huge text-3xl text-mat-noir !leading-tight">{stat.value}</h3>
                   </div>
                </div>
             </HolographicCard>
           ))}
        </div>

        {/* 4. Verification & System (Col 1-8, Row 4-6) */}
        <div className="lg:col-span-8 lg:row-span-3 flex gap-6">
           <HolographicCard tiltX={tiltX} tiltY={tiltY} className="flex-1">
              <div className="flex flex-col h-full justify-between">
                 <div className="flex justify-between items-start">
                    <div className="space-y-1">
                       <h4 className="mat-text-editorial-caps text-[11px] tracking-[0.5em] text-mat-rose-gold">Merit Index</h4>
                       <p className="text-mat-noir/40 text-[12px] font-light">Verification enhances sanctuary priority.</p>
                    </div>
                    <Sparkles size={18} className="text-mat-gold" />
                 </div>

                 <div className="mt-8">
                    {!isVerified ? (
                       <button 
                         onClick={() => setShowVerification(true)}
                         className="w-full py-6 rounded-[24px] bg-white border border-mat-gold text-mat-gold mat-text-editorial-caps text-[10px] tracking-[0.5em] font-black hover:bg-mat-gold hover:text-white transition-all shadow-lg"
                       >
                         Apply for Verification
                       </button>
                    ) : (
                       <div className="p-6 rounded-[24px] bg-green-500/5 border border-green-500/10 flex items-center justify-center gap-4">
                          <ShieldCheck className="text-green-500" />
                          <span className="mat-text-editorial-caps text-[10px] tracking-[0.4em] text-green-500">Identity Authenticated</span>
                       </div>
                    )}
                 </div>
              </div>
           </HolographicCard>

           <HolographicCard tiltX={tiltX} tiltY={tiltY} className="flex-1 hidden lg:flex">
              <div className="flex flex-col justify-between h-full">
                 <div className="p-4 rounded-2xl bg-mat-noir/5 w-fit">
                    <Layers size={20} className="text-mat-noir/30" />
                 </div>
                 <div className="space-y-2">
                    <p className="mat-text-editorial-caps text-[8px] tracking-[0.3em] opacity-20">Aura Engine Status</p>
                    <div className="flex items-center gap-2">
                       <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                       <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Synchronizing</span>
                    </div>
                 </div>
              </div>
           </HolographicCard>
        </div>

      </main>

      {/* 💿 MODALS ═══════════════════════════════════════ */}
      <AnimatePresence>
        {showFAQ && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-0 mat-silk-bg"
            onClick={() => setShowFAQ(false)}
          >
            <div className="w-full h-full flex flex-col relative" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setShowFAQ(false)} 
                className="absolute top-12 right-12 w-16 h-16 border border-mat-noir/10 text-mat-noir/40 hover:text-mat-rose-gold transition-all duration-500 z-20 flex items-center justify-center rounded-full bg-white shadow-xl"
              >
                <X size={24} />
              </button>
              
              <div className="flex-1 w-full overflow-y-auto custom-scrollbar px-8 md:px-32 py-32 lg:py-48">
                <div className="max-w-6xl mx-auto">
                   <span className="mat-text-editorial-caps text-[12px] tracking-[1em] text-mat-rose-gold mb-12 block text-center">Sanctuary Gnosis</span>
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
