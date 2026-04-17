import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useScroll } from 'framer-motion';
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
import { cn } from '@/lib/utils';
import { FAQ } from '@/components/FAQ';
import { VerificationPaymentModal } from '@/components/verification/VerificationPaymentModal';
import { useAuth } from '@/hooks/useAuth';
import { PostProcessOverlay } from '@/components/dashboard/promax/PostProcessOverlay';

/**
 * 🪐 FloatingGeometry: Multi-layered parallax shards
 */
const FloatingGeometry = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40">
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          animate={{ 
            y: [0, -40, 0],
            rotate: [0, 180, 360],
            opacity: [0.2, 0.5, 0.2] 
          }}
          transition={{
            duration: 10 + Math.random() * 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute border border-white/10 rounded-full"
          style={{
            width: Math.random() * 300 + 100 + "px",
            height: Math.random() * 300 + 100 + "px",
            left: Math.random() * 100 + "%",
            top: Math.random() * 100 + "%",
            filter: "blur(20px)",
            background: "radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)"
          }}
        />
      ))}
    </div>
  );
};

/**
 * ✨ SparkleParticles: Subtle "Design Spell"
 */
const SparkleParticles = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full opacity-0"
          initial={{ x: Math.random() * 100 + "%", y: Math.random() * 100 + "%", scale: 0 }}
          animate={{ opacity: [0, 0.8, 0], scale: [0, 1.5, 0], y: ["-5%", "5%"] }}
          transition={{ duration: 2 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 5 }}
          style={{ filter: 'blur(1px)', boxShadow: '0 0 10px #fff' }}
        />
      ))}
    </div>
  );
};

/**
 * 💎 GemstoneCard: Enhanced with materials and magnetic snapping
 */
const GemstoneCard = ({ 
  children, 
  delay = 0, 
  className = "", 
  material = "glass",
  isHolographic = false 
}: { 
  children: React.ReactNode, 
  delay?: number, 
  className?: string,
  material?: "glass" | "gold" | "silver" | "obsidian",
  isHolographic?: boolean
}) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-100, 100], [15, -15]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-100, 100], [-15, 15]), { stiffness: 150, damping: 20 });

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(event.clientX - centerX);
    mouseY.set(event.clientY - centerY);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  const materialClasses = {
    glass: "mat-gemstone-glass",
    gold: "mat-material-gold",
    silver: "mat-material-silver",
    obsidian: "mat-material-obsidian"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      transition={{ delay, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={cn(
        "mat-iridescent-border p-5 rounded-3xl transition-shadow hover:shadow-[0_40px_80px_rgba(0,0,0,0.15)] group cursor-pointer relative",
        materialClasses[material],
        isHolographic && "mat-holographic-foil",
        className
      )}
    >
      <div style={{ transform: "translateZ(30px)" }} className="relative z-10">
        {children}
      </div>
      {/* Dynamic Refractive Highlight */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" 
        style={{
          background: useTransform(
            [mouseX, mouseY],
            ([mx, my]) => `radial-gradient(circle at ${50 + (mx as number) / 2}% ${50 + (my as number) / 2}%, rgba(255,255,255,0.2) 0%, transparent 60%)`
          )
        }}
      />
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

  const isVerified = profile?.is_verified;
  const completeness = profile?.profile_completeness ?? 94;
  const memberSince = profile?.created_at ? new Date(profile.created_at).getFullYear() : '--';

  const stats = [
    { label: 'Profile Views',   value: String(metrics.profileViews || 0),          icon: <Eye size={13} />,          material: 'glass' as const },
    { label: 'Trust Score',     value: `${completeness}%`,                          icon: <ShieldCheck size={13} />,  material: 'silver' as const, isHolographic: isVerified },
    { label: 'Matches',         value: String(metrics.matches || 0),                icon: <Heart size={13} />,        material: 'gold' as const },
    { label: 'Selections',      value: String(metrics.profilesEngaged || 0),        icon: <LayoutGrid size={13} />,   material: 'glass' as const },
    { label: 'Saves',           value: String(metrics.saves || 0),                  icon: <Bookmark size={13} />,     material: 'glass' as const },
    { label: 'Time Online',     value: 'Active',                                    icon: <Activity size={13} />,     material: 'glass' as const },
    { label: 'Sanctum Rank',    value: metrics.safetyLevel ?? 'Standard',              icon: <Star size={13} />,         material: 'obsidian' as const },
    { label: 'Response Pulse',  value: metrics.responseRate || 'High',             icon: <Zap size={13} />,          material: 'glass' as const },
  ];

  const triggerResonance = () => {
    setIsResonating(true);
    setTimeout(() => setIsResonating(false), 2000);
  };

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden bg-[#0a0a0a] selection:bg-mat-rose-gold selection:text-white flex flex-col mat-cinematic-grain">
      <LiquidMesh />
      <FloatingGeometry />
      <PostProcessOverlay />
      <SparkleParticles />

      <main className="relative z-10 w-full flex-1 flex flex-col px-6 py-8 lg:px-20 lg:py-12 min-h-0">
        
        {/* ══ SOVEREIGN HEADER ══════════════════════════════ */}
        <header className="flex justify-between items-start shrink-0 mb-8 lg:mb-12">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <motion.span 
                animate={{ width: [16, 48, 16], opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="h-[1px] bg-mat-gold" 
              />
              <span className="mat-text-editorial-caps text-[10px] text-white/40 tracking-[0.8em] font-medium">Sovereign Sanctuary</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-light italic text-white leading-none tracking-tighter" style={{ fontFamily: 'var(--font-display)' }}>
              Existence<span className="text-mat-gold">.</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-6">
             <motion.button 
                whileHover={{ scale: 1.1, rotate: 180 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowFAQ(true)}
                className="w-14 h-14 rounded-full bg-white/5 backdrop-blur-3xl border border-white/10 flex items-center justify-center text-white/60 shadow-2xl hover:bg-white/10 transition-all duration-500"
             >
                <HelpCircle size={20} />
             </motion.button>
             <button 
               onClick={() => setIsEditing(true)}
               className="px-10 py-4 rounded-full bg-white text-mat-noir mat-text-editorial-caps text-[10px] tracking-[0.5em] font-black shadow-2xl hover:bg-mat-gold hover:text-white transition-all duration-700 hover:shadow-mat-gold/30"
             >
               Curate Identity
             </button>
          </div>
        </header>

        {/* ══ THE AURA MATRIX (Advanced Isometric) ═══════════════ */}
        <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-32 min-h-0 mat-perspective-1000">
          
          {/* Left Stats Column (Jewelry Materials) */}
          <div className="hidden lg:grid grid-cols-1 gap-10 w-64 mat-isometric-tilt">
             {[stats[0], stats[1], stats[2], stats[3]].map((stat, i) => (
                <GemstoneCard key={i} delay={0.1 * i} material={stat.material} isHolographic={stat.isHolographic}>
                   <div className="flex flex-col gap-4">
                      <div className="opacity-60">{React.cloneElement(stat.icon as React.ReactElement, { size: 18 })}</div>
                      <div className="space-y-1">
                         <p className={cn(
                           "text-4xl font-light italic leading-none",
                           stat.material === 'gold' ? 'text-white' : 'text-inherit'
                         )} style={{ fontFamily: 'var(--font-display)' }}>{stat.value}</p>
                         <p className="mat-text-editorial-caps text-[9px] tracking-[0.4em] font-black uppercase opacity-40">{stat.label}</p>
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
               transition={{ scale: { duration: 0.4, ease: "easeOut" }, opacity: { duration: 2, ease: [0.16, 1, 0.3, 1] } }}
               className="relative w-64 h-64 lg:w-[480px] lg:h-[480px] rounded-full p-3 bg-gradient-to-tr from-mat-gold/10 via-white/10 to-mat-rose-gold/10 shadow-[0_60px_120px_rgba(0,0,0,0.4)] group cursor-pointer"
             >
                {/* Breathe Interaction */}
                <motion.div 
                  animate={{ scale: [1, 1.08, 1], opacity: [0.1, 0.3, 0.1] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 rounded-full bg-white blur-3xl -z-10"
                />

                <div className="w-full h-full rounded-full overflow-hidden border border-white/20 relative shadow-inner">
                   <img 
                      src={profile?.photos?.[0] || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=800"} 
                      alt="Identity" 
                      className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-[2000ms] scale-105 group-hover:scale-100"
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                   
                   <AnimatePresence>
                     {isResonating && (
                       <motion.div 
                         initial={{ scale: 0, opacity: 1, borderWidth: 10 }}
                         animate={{ scale: 2.5, opacity: 0, borderWidth: 0 }}
                         className="absolute inset-0 rounded-full border-mat-gold z-20"
                       />
                     )}
                   </AnimatePresence>
                </div>

                {/* Cinematic Rings */}
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                   className="absolute -inset-10 border border-mat-gold/10 rounded-full pointer-events-none"
                />
                <motion.div animate={{ rotate: -360 }} transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                   className="absolute -inset-16 border border-white/5 rounded-full pointer-events-none"
                />
             </motion.div>
             
             <div className="mt-16 text-center">
                <h2 className="text-5xl lg:text-7xl font-light italic text-white leading-none tracking-tighter" style={{ fontFamily: 'var(--font-display)' }}>
                   {profile?.full_name || 'Sovereign'}
                </h2>
                <div className="flex items-center justify-center gap-4 mt-6">
                  <span className="w-1.5 h-1.5 rounded-full bg-mat-gold shadow-[0_0_10px_#D4AF37] animate-pulse" />
                  <p className="mat-text-editorial-caps text-[10px] text-white/30 tracking-[0.6em] font-black uppercase">Identity Registry: {profile?.user_id?.slice(0,8) || 'AUTHENTICATED'}</p>
                </div>
             </div>
          </div>

          {/* Right Stats Column (Advanced Materials) */}
          <div className="hidden lg:grid grid-cols-1 gap-10 w-64 mat-isometric-tilt" style={{ transform: 'rotateX(15deg) rotateY(10deg) rotateZ(-2deg)' }}>
             {[stats[4], stats[5], stats[6], stats[7]].map((stat, i) => (
                <GemstoneCard key={i} delay={0.4 + 0.1 * i} material={stat.material}>
                   <div className="flex flex-col gap-4">
                      <div className="opacity-60">{React.cloneElement(stat.icon as React.ReactElement, { size: 18 })}</div>
                      <div className="space-y-1">
                         <p className="text-4xl font-light italic leading-none" style={{ fontFamily: 'var(--font-display)' }}>{stat.value}</p>
                         <p className="mat-text-editorial-caps text-[9px] tracking-[0.4em] font-black uppercase opacity-40">{stat.label}</p>
                      </div>
                   </div>
                </GemstoneCard>
             ))}
          </div>

          {/* Mobile High-Density View */}
          <div className="grid lg:hidden grid-cols-2 gap-4 w-full px-4 mb-12">
             {stats.map((stat, i) => (
                <GemstoneCard key={i} delay={0.1 * i} material={stat.material} isHolographic={stat.isHolographic} className="p-4">
                   <div className="flex flex-col gap-2">
                      <div className="opacity-40">{React.cloneElement(stat.icon as React.ReactElement, { size: 14 })}</div>
                      <div className="space-y-0.5 overflow-hidden">
                         <p className="text-2xl font-light italic text-white leading-none" style={{ fontFamily: 'var(--font-display)' }}>{stat.value}</p>
                         <p className="mat-text-editorial-caps text-[7px] text-white/20 tracking-[0.2em] font-black truncate uppercase">{stat.label}</p>
                      </div>
                   </div>
                </GemstoneCard>
             ))}
          </div>

        </div>

        {/* ══ FOOTER SOVEREIGNTY ═══════════════════════════════ */}
        <footer className="shrink-0 mt-auto flex flex-col items-center gap-10 pb-6">
           {!isVerified && (
              <motion.button
                whileHover={{ scale: 1.05, y: -4, shadow: "0 20px 40px rgba(212,175,55,0.2)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowVerification(true)}
                className="flex items-center gap-4 px-10 py-5 bg-mat-gold/10 border border-mat-gold/30 rounded-full backdrop-blur-3xl group transition-all duration-500"
              >
                 <Sparkles size={20} className="text-mat-gold group-hover:rotate-[30deg] transition-transform duration-700" />
                 <span className="mat-text-editorial-caps text-[11px] text-mat-gold font-black tracking-[0.6em]">Elevate Status</span>
              </motion.button>
           )}
           
           <div className="flex items-center gap-8 opacity-20 mat-text-editorial-caps text-[9px] tracking-[0.6em] font-black uppercase text-white">
              <span>Sanctum v5.2</span>
              <span className="w-1 h-1 rounded-full bg-white/40" />
              <span>Sovereign Identity</span>
              <span className="w-1 h-1 rounded-full bg-white/40" />
              <span>Est. {memberSince}</span>
           </div>
        </footer>

      </main>

      <AnimatePresence>
        {showFAQ && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-0 backdrop-blur-[100px] bg-black/90"
            onClick={() => setShowFAQ(false)}
          >
            <div className="w-full h-full flex flex-col relative overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setShowFAQ(false)} 
                className="absolute top-12 right-12 w-20 h-20 bg-white text-black hover:bg-mat-gold hover:text-white transition-all duration-700 z-20 flex items-center justify-center rounded-full shadow-2xl"
              >
                <X size={28} />
              </button>
              
              <div className="flex-1 w-full overflow-y-auto custom-scrollbar px-8 md:px-32 py-40">
                <div className="max-w-7xl mx-auto space-y-32">
                  <div className="flex flex-col items-start space-y-10">
                    <span className="mat-text-editorial-caps text-[14px] tracking-[1em] text-mat-gold/40">Intelligence Protocol</span>
                    <h2 className="font-light italic text-8xl md:text-[12rem] tracking-tighter leading-[0.8] text-white" style={{ fontFamily: 'var(--font-display)' }}>
                      The Gnosis of <br /><span className="text-mat-gold">Selection.</span>
                    </h2>
                  </div>
                  <div className="w-full h-px bg-white/5" />
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

