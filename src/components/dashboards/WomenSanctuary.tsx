import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { 
  ShieldCheck, 
  Zap, 
  Heart, 
  Activity, 
  Sparkles,
  MessageCircle,
  Eye,
  Star,
  Compass,
  X,
  LayoutGrid,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Briefcase,
  GraduationCap,
  Ruler,
  Calendar,
  Bookmark,
  Edit3,
  Settings,
  HelpCircle,
  Clock,
  MousePointer2,
  Flame
} from 'lucide-react';

import { LiquidMesh } from '@/components/dashboard/promax/LiquidMesh';
import { GlassCard } from '@/components/dashboard/promax/GlassCard';
import { cn } from '@/lib/utils';
import { FAQ } from '@/components/FAQ';
import { VerificationPaymentModal } from '@/components/verification/VerificationPaymentModal';
import { useAuth } from '@/hooks/useAuth';
import { PostProcessOverlay } from '@/components/dashboard/promax/PostProcessOverlay';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

/**
 * ✨ SparkleParticles: Subtle "Design Spell" for that magical touch
 */
const SparkleParticles = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full opacity-0"
          initial={{ 
            x: Math.random() * 100 + "%", 
            y: Math.random() * 100 + "%",
            scale: 0 
          }}
          animate={{ 
            opacity: [0, 0.8, 0],
            scale: [0, 1.5, 0],
            y: ["-5%", "5%"]
          }}
          transition={{
            duration: 2 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "easeInOut"
          }}
          style={{
            filter: 'blur(1px)',
            boxShadow: '0 0 10px #fff'
          }}
        />
      ))}
    </div>
  );
};

/**
 * 💎 GemstoneCard: High-fidelity "Digital Jewelry" bento tile
 */
const GemstoneCard = ({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-100, 100], [10, -10]), { stiffness: 100, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-100, 100], [-10, 10]), { stiffness: 100, damping: 30 });

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(event.clientX - centerX);
    y.set(event.clientY - centerY);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={cn(
        "mat-gemstone-glass mat-iridescent-border p-4 rounded-3xl transition-shadow hover:shadow-[0_32px_64px_rgba(0,0,0,0.12)] group cursor-pointer",
        className
      )}
    >
      <div style={{ transform: "translateZ(20px)" }} className="relative z-10">
        {children}
      </div>
      {/* Refractive Light Highlight */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
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
  const [isResonating, setIsResonating] = useState(false);
  const { refreshProfile } = useAuth();

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
  };

  const isVerified = profile?.is_verified;
  const completeness = profile?.profile_completeness ?? 94;
  const memberSince = profile?.created_at ? new Date(profile.created_at).getFullYear() : '--';

  const stats = [
    { label: 'Profile Views',   value: String(metrics.profileViews || 0),          icon: <Eye size={13} />,          accent: 'from-rose-100 to-rose-50' },
    { label: 'Trust Score',     value: `${completeness}%`,                          icon: <ShieldCheck size={13} />,  accent: 'from-amber-100 to-amber-50' },
    { label: 'Matches',         value: String(metrics.matches || 0),                icon: <Heart size={13} />,        accent: 'from-pink-100 to-pink-50' },
    { label: 'Selections',      value: String(metrics.profilesEngaged || 0),        icon: <LayoutGrid size={13} />,   accent: 'from-violet-100 to-violet-50' },
    { label: 'Saves',           value: String(metrics.saves || 0),                  icon: <Bookmark size={13} />,     accent: 'from-sky-100 to-sky-50' },
    { label: 'Time Online',     value: formatTime(metrics.sessionSeconds || 0),     icon: <Activity size={13} />,     accent: 'from-emerald-100 to-emerald-50' },
    { label: 'Sanctum Rank',    value: metrics.safetyLevel ?? 'Standard',              icon: <Star size={13} />,         accent: 'from-teal-100 to-teal-50' },
    { label: 'Response Pulse',  value: metrics.responseRate || 'High',             icon: <Zap size={13} />,          accent: 'from-yellow-100 to-yellow-50' },
  ];

  const triggerResonance = () => {
    setIsResonating(true);
    setTimeout(() => setIsResonating(false), 2000);
  };

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden bg-[#faf8f5] selection:bg-mat-rose-gold selection:text-white flex flex-col mat-cinematic-grain">
      <LiquidMesh />
      <PostProcessOverlay />
      <SparkleParticles />

      <main className="relative z-10 w-full flex-1 flex flex-col px-6 py-8 lg:px-20 lg:py-12 min-h-0">
        
        {/* ══ SOVEREIGN HEADER ══════════════════════════════ */}
        <header className="flex justify-between items-start shrink-0 mb-8 lg:mb-12">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <motion.span 
                animate={{ width: [16, 32, 16] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="h-[1px] bg-mat-rose-gold" 
              />
              <span className="mat-text-editorial-caps text-[9px] text-mat-noir/40 tracking-[0.6em]">Sovereign Sanctuary</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-medium italic text-mat-noir leading-none tracking-tighter" style={{ fontFamily: 'var(--font-display)' }}>
              Existence<span className="text-mat-rose-gold">.</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
             <motion.button 
                whileHover={{ scale: 1.05, rotate: 90 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowFAQ(true)}
                className="w-12 h-12 rounded-full bg-white/30 backdrop-blur-xl border border-white/40 flex items-center justify-center text-mat-noir/60 shadow-lg"
             >
                <HelpCircle size={18} />
             </motion.button>
             <button 
               onClick={() => setIsEditing(true)}
               className="px-8 py-3 rounded-full bg-mat-noir text-white mat-text-editorial-caps text-[9px] tracking-[0.4em] font-bold shadow-2xl hover:bg-mat-rose-gold transition-all duration-500 hover:shadow-mat-rose-gold/20"
             >
               Curate Identity
             </button>
          </div>
        </header>

        {/* ══ THE AURA MATRIX (Isometric Perspective) ═══════════════ */}
        <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-24 min-h-0 mat-perspective-1000">
          
          {/* Left Stats Column (Isometric Tilt) */}
          <div className="hidden lg:grid grid-cols-1 gap-8 w-56 mat-isometric-tilt">
             {[stats[0], stats[1], stats[2], stats[3]].map((stat, i) => (
                <GemstoneCard key={i} delay={0.1 * i}>
                   <div className="flex flex-col gap-3">
                      <div className="text-mat-rose-gold/60">{React.cloneElement(stat.icon as React.ReactElement, { size: 16 })}</div>
                      <div className="space-y-1">
                         <p className="text-3xl font-medium text-mat-noir italic leading-none" style={{ fontFamily: 'var(--font-display)' }}>{stat.value}</p>
                         <p className="mat-text-editorial-caps text-[8px] text-mat-noir/30 tracking-[0.3em] font-bold uppercase">{stat.label}</p>
                      </div>
                   </div>
                </GemstoneCard>
             ))}
          </div>

          {/* Central Aura Orb: Biomimetic Identity */}
          <div className="relative shrink-0 flex flex-col items-center">
             <motion.div 
               onTap={triggerResonance}
               initial={{ scale: 0.8, opacity: 0 }}
               animate={{ 
                 scale: isResonating ? 1.05 : 1,
                 opacity: 1 
               }}
               transition={{ 
                 scale: { duration: 0.4, ease: "easeOut" },
                 opacity: { duration: 1.5, ease: [0.16, 1, 0.3, 1] }
               }}
               className="relative w-56 h-56 lg:w-96 lg:h-96 rounded-full p-2 bg-gradient-to-tr from-mat-rose-gold/20 via-white/40 to-mat-gold/20 shadow-[0_40px_100px_rgba(0,0,0,0.1)] group cursor-pointer"
             >
                {/* Breathing Inner Halo */}
                <motion.div 
                  animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 rounded-full bg-gradient-to-tr from-mat-rose-gold/30 to-mat-gold/30 blur-2xl -z-10"
                />

                <div className="w-full h-full rounded-full overflow-hidden border border-white/60 relative">
                   <img 
                      src={profile?.photos?.[0] || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=800"} 
                      alt="Identity" 
                      className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-1000"
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-mat-noir/60 via-transparent to-transparent opacity-60" />
                   
                   {/* Resonance Wave Ripple */}
                   <AnimatePresence>
                     {isResonating && (
                       <motion.div 
                         initial={{ scale: 0, opacity: 0.8 }}
                         animate={{ scale: 2, opacity: 0 }}
                         exit={{ opacity: 0 }}
                         className="absolute inset-0 rounded-full border-4 border-white/50 z-20"
                       />
                     )}
                   </AnimatePresence>
                </div>

                {/* Refractive Rings */}
                <motion.div 
                   animate={{ rotate: 360 }}
                   transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                   className="absolute -inset-6 border-[0.5px] border-mat-gold/20 rounded-full pointer-events-none"
                />
                <motion.div 
                   animate={{ rotate: -360 }}
                   transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
                   className="absolute -inset-10 border-[0.5px] border-mat-rose-gold/10 rounded-full pointer-events-none"
                />
             </motion.div>
             
             {/* Sovereign Identity Labels */}
             <div className="mt-12 text-center">
                <h2 className="text-4xl lg:text-5xl font-medium italic text-mat-noir leading-none tracking-tighter" style={{ fontFamily: 'var(--font-display)' }}>
                   {profile?.full_name || 'Sovereign'}
                </h2>
                <div className="flex items-center justify-center gap-3 mt-4">
                  <span className="w-2 h-2 rounded-full bg-mat-rose-gold animate-pulse" />
                  <p className="mat-text-editorial-caps text-[9px] text-mat-noir/40 tracking-[0.5em] uppercase">Sanctum Registry: {profile?.user_id?.slice(0,8) || 'AUTHENTICATED'}</p>
                </div>
             </div>
          </div>

          {/* Right Stats Column (Isometric Tilt) */}
          <div className="hidden lg:grid grid-cols-1 gap-8 w-56 mat-isometric-tilt" style={{ transform: 'rotateX(10deg) rotateY(5deg) rotateZ(-1deg)' }}>
             {[stats[4], stats[5], stats[6], stats[7]].map((stat, i) => (
                <GemstoneCard key={i} delay={0.4 + 0.1 * i}>
                   <div className="flex flex-col gap-3">
                      <div className="text-mat-gold/60">{React.cloneElement(stat.icon as React.ReactElement, { size: 16 })}</div>
                      <div className="space-y-1">
                         <p className="text-3xl font-medium text-mat-noir italic leading-none" style={{ fontFamily: 'var(--font-display)' }}>{stat.value}</p>
                         <p className="mat-text-editorial-caps text-[8px] text-mat-noir/30 tracking-[0.3em] font-bold uppercase">{stat.label}</p>
                      </div>
                   </div>
                </GemstoneCard>
             ))}
          </div>

          {/* Mobile Grid (Compact Gemstone cards) */}
          <div className="grid lg:hidden grid-cols-2 gap-4 w-full px-4 mb-8">
             {stats.map((stat, i) => (
                <GemstoneCard key={i} delay={0.1 * i} className="p-3">
                   <div className="flex items-center gap-3">
                      <div className="text-mat-rose-gold shrink-0">{React.cloneElement(stat.icon as React.ReactElement, { size: 14 })}</div>
                      <div className="space-y-0.5 overflow-hidden">
                         <p className="text-xl font-medium text-mat-noir italic leading-none truncate" style={{ fontFamily: 'var(--font-display)' }}>{stat.value}</p>
                         <p className="mat-text-editorial-caps text-[6px] text-mat-noir/40 tracking-[0.2em] font-bold truncate uppercase">{stat.label}</p>
                      </div>
                   </div>
                </GemstoneCard>
             ))}
          </div>

        </div>

        {/* ══ FOOTER COMMANDS ═══════════════════════════════ */}
        <footer className="shrink-0 mt-auto flex flex-col items-center gap-8 pb-4">
           {!isVerified && (
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowVerification(true)}
                className="flex items-center gap-3 px-8 py-4 bg-mat-gold/5 border border-mat-gold/20 rounded-full backdrop-blur-xl group transition-all"
              >
                 <Sparkles size={16} className="text-mat-gold group-hover:rotate-12 transition-transform" />
                 <span className="mat-text-editorial-caps text-[9px] text-mat-gold font-bold tracking-[0.4em]">Elevate Credentials</span>
              </motion.button>
           )}
           
           <div className="flex items-center gap-6 opacity-30 mat-text-editorial-caps text-[8px] tracking-[0.4em] font-bold uppercase text-mat-noir">
              <span>Registry v5.0</span>
              <span className="w-1 h-1 rounded-full bg-mat-noir/40" />
              <span>Identity Sanctum</span>
              <span className="w-1 h-1 rounded-full bg-mat-noir/40" />
              <span>Est. {memberSince}</span>
           </div>
        </footer>

      </main>

      <AnimatePresence>
        {showFAQ && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-0 backdrop-blur-3xl bg-white/90"
            onClick={() => setShowFAQ(false)}
          >
            <div 
              className="w-full h-full flex flex-col relative bg-transparent overflow-hidden" 
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              <button 
                onClick={() => setShowFAQ(false)} 
                className="absolute top-12 right-12 w-16 h-16 bg-mat-noir text-white hover:bg-mat-rose-gold transition-all z-20 flex items-center justify-center rounded-full shadow-2xl"
              >
                <X size={24} />
              </button>
              
              <div className="flex-1 w-full overflow-y-auto custom-scrollbar px-8 md:px-24 py-32">
                <div className="max-w-6xl mx-auto space-y-24">
                  <div className="flex flex-col items-start space-y-8">
                    <span className="mat-text-editorial-caps text-[12px] tracking-[0.8em]">Sanctuary Intelligence</span>
                    <h2 className="italic text-7xl md:text-9xl tracking-tighter leading-[0.85] text-mat-noir" style={{ fontFamily: 'var(--font-display)' }}>
                      The Gnosis of <br /><span className="text-mat-rose-gold/40">Selection.</span>
                    </h2>
                  </div>
                  <div className="w-full h-px bg-mat-noir/5" />
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

