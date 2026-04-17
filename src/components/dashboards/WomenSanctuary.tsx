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
  Leaf,
  Wind,
  Flower2
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { FAQ } from '@/components/FAQ';
import { VerificationPaymentModal } from '@/components/verification/VerificationPaymentModal';
import { useAuth } from '@/hooks/useAuth';

/**
 * 🌸 KineticPetal: An organic shaped stat that sways gently
 */
const KineticPetal = ({ label, value, icon, variant = 1, delay = 0 }: { label: string, value: string, icon: React.ReactNode, variant?: number, delay?: number }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
    className={cn(
      "relative p-8 lg:p-12 flex flex-col justify-center items-center text-center gap-4 bg-white/40 backdrop-blur-sm border border-white/20 shadow-xl animate-petal-sway group",
      variant === 1 ? "mat-petal-shape-1" : variant === 2 ? "mat-petal-shape-2" : "mat-petal-shape-3"
    )}
    style={{ animationDelay: `${delay}s` }}
  >
     <div className="text-mat-moss opacity-40 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700">
        {icon}
     </div>
     <div className="space-y-1">
        <h3 className="mat-text-fluid-huge text-4xl lg:text-5xl text-mat-noir leading-none tracking-tighter">
           {value}
        </h3>
        <p className="mat-text-editorial-caps text-[8px] tracking-[0.4em] text-mat-moss font-bold">
           {label}
        </p>
     </div>
     
     {/* Decorative organic "vein" */}
     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.03] pointer-events-none">
        <Leaf size={120} strokeWidth={0.5} />
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
    { label: 'Trust Roots',  value: `${completeness}%`, icon: <ShieldCheck />, variant: 1 },
    { label: 'Blossoms',     value: String(metrics.matches || 0), icon: <Heart />, variant: 2 },
    { label: 'Sanctuary Sun',value: metrics.safetyLevel ?? 'Gold', icon: <Star />, variant: 3 },
    { label: 'Aura Reach',   value: String(metrics.profileViews || 0), icon: <Eye />, variant: 1 },
  ];

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden mat-bg-moss-gradient flex flex-col selection:bg-mat-moss selection:text-white">
      
      {/* 🌸 KINETIC PETAL CANVAS ══════════════════════ */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-6 lg:p-12 flex flex-col lg:grid lg:grid-cols-12 gap-8 min-h-0 overflow-y-auto custom-scrollbar">
        
        {/* Central Identity Petal (Huge) */}
        <div className="lg:col-span-5 flex flex-col justify-center gap-8">
           <motion.div 
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ duration: 1.5 }}
             className="relative p-12 lg:p-16 flex flex-col items-center text-center gap-8 bg-white/60 mat-petal-shape-3 shadow-2xl border border-white/40 group overflow-hidden"
           >
              {/* Floating Background Leaves */}
              <div className="absolute top-0 right-0 p-8 text-mat-moss/5 animate-bounce">
                 <Wind size={48} />
              </div>

              <div className="relative">
                 <div className="w-48 h-48 lg:w-56 lg:h-56 rounded-full border-8 border-white shadow-xl overflow-hidden relative z-10 transition-transform duration-1000 group-hover:scale-105">
                    <img 
                      src={profile?.photos?.[0] || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=800"} 
                      alt="Aura" 
                      className="w-full h-full object-cover"
                    />
                 </div>
                 {/* Petal Halo */}
                 <motion.div 
                   animate={{ rotate: 360 }}
                   transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                   className="absolute -inset-6 border-2 border-dashed border-mat-peach/40 rounded-full"
                 />
              </div>

              <div className="space-y-2">
                 <h1 className="mat-text-fluid-huge text-5xl lg:text-7xl text-mat-noir leading-none tracking-tighter">
                    {profile?.full_name?.split(' ')[0] || 'aspirant'}<span className="text-mat-peach">.</span>
                 </h1>
                 <p className="mat-text-editorial-caps text-[10px] tracking-[0.6em] text-mat-moss font-black uppercase">biomimetic identity</p>
              </div>

              <div className="flex gap-4 w-full">
                 <button onClick={() => setIsEditing(true)} className="flex-1 py-5 rounded-full bg-mat-noir text-white mat-text-editorial-caps text-[9px] tracking-[0.4em] hover:bg-mat-moss transition-all">Curate</button>
                 <button onClick={() => setShowFAQ(true)} className="p-5 rounded-full bg-white border border-mat-noir/5 text-mat-noir/40 hover:text-mat-moss transition-all"><HelpCircle size={18} /></button>
              </div>
           </motion.div>
        </div>

        {/* Floating Petal Stats (Right Side) */}
        <div className="lg:col-span-7 flex flex-col gap-8 justify-center">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {stats.map((stat, i) => (
                <div key={i} className={cn(i % 2 === 0 ? "lg:-translate-y-8" : "lg:translate-y-8")}>
                   <KineticPetal {...stat} delay={0.2 * i} />
                </div>
              ))}
           </div>

           {/* Discovery Seed (CTA) */}
           <div className="relative mt-8 group flex justify-center lg:justify-end">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                onClick={onBeginDiscovery}
                className="p-8 lg:p-12 rounded-full bg-mat-moss text-white flex items-center gap-6 cursor-pointer shadow-2xl hover:bg-mat-noir transition-all group"
              >
                 <div className="space-y-1">
                    <p className="mat-text-editorial-caps text-[9px] tracking-[0.5em] text-white/50">Discovery</p>
                    <h4 className="text-2xl font-light tracking-widest">Sow Resonance</h4>
                 </div>
                 <div className="p-4 rounded-full bg-white/10 group-hover:bg-mat-peach/20 transition-all">
                    <ArrowRight size={24} />
                 </div>
              </motion.div>
              
              {/* Floating Verification Leaf */}
              {!isVerified && (
                 <motion.button 
                   onClick={() => setShowVerification(true)}
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ delay: 1 }}
                   className="absolute -top-4 -left-4 lg:left-auto lg:right-48 p-4 rounded-full bg-mat-peach text-mat-noir shadow-lg flex items-center gap-2 hover:scale-110 transition-all"
                 >
                    <Sparkles size={14} />
                    <span className="mat-text-editorial-caps text-[8px] tracking-[0.2em] font-black">Verify</span>
                 </motion.button>
              )}
           </div>
        </div>

      </main>

      {/* 🌸 MODALS ═══════════════════════════════════════ */}
      <AnimatePresence>
        {showFAQ && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-0 bg-mat-bone"
            onClick={() => setShowFAQ(false)}
          >
            <div className="w-full h-full flex flex-col relative" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setShowFAQ(false)} 
                className="absolute top-12 right-12 w-16 h-16 border border-mat-noir/10 text-mat-noir/40 hover:text-mat-moss transition-all duration-500 z-20 flex items-center justify-center rounded-full bg-white shadow-xl"
              >
                <X size={24} />
              </button>
              
              <div className="flex-1 w-full overflow-y-auto custom-scrollbar px-8 md:px-32 py-32 lg:py-48">
                <div className="max-w-6xl mx-auto">
                   <span className="mat-text-editorial-caps text-[12px] tracking-[1em] text-mat-moss mb-12 block text-center">Gnosis Bloom</span>
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
