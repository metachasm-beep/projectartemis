import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  AlertCircle
} from 'lucide-react';

import { LiquidMesh } from '@/components/dashboard/promax/LiquidMesh';
import { GlassCard } from '@/components/dashboard/promax/GlassCard';
import { Dock } from '@/components/dashboard/promax/Dock';
import { cn } from '@/lib/utils';
import { FAQ } from '@/components/FAQ';
import { AadhaarVerification } from '@/components/AadhaarVerification';
import { useAuth } from '@/hooks/useAuth';
import { PostProcessOverlay } from '@/components/dashboard/promax/PostProcessOverlay';
import { TooltipProvider } from '@/components/ui/tooltip';

interface WomenSanctuaryProps {
  profile: any;
  metrics: { 
    matches: number; 
    sessionSeconds: number;
    profilesViewed?: number;
    profilesEngaged?: number;
    responseRate?: string;
    vibeRating?: number;
    activeStreak?: number;
    safetyLevel?: string;
  };
  setIsEditing: (val: boolean) => void;
  onBeginDiscovery?: () => void;
}

/**
 * 🏛️ Women's Sanctuary 4.0: Chiaroscuro Atelier
 * Ferrari editorial luxury meets Apple skeuomorphic depth.
 * Ivory/Noir/Rose Gold, embossed bento tiles, cinematic portrait.
 */
export const WomenSanctuary: React.FC<WomenSanctuaryProps> = ({ 
  profile,
  metrics, 
  setIsEditing,
  onBeginDiscovery 
}) => {
  const [showFAQ, setShowFAQ] = React.useState(false);
  const [showVerification, setShowVerification] = React.useState(false);
  const { refreshProfile } = useAuth();

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
  };

  /** 10 stats → 2 rows of 5 */
  const stats = [
    { label: 'Profile Views',   value: '4.2k',                                      icon: <Eye size={14} />,          accent: 'from-rose-100 to-rose-50' },
    { label: 'Trust Score',     value: `${profile?.profile_completeness || 99}%`,    icon: <ShieldCheck size={14} />,  accent: 'from-amber-100 to-amber-50' },
    { label: 'Matches',         value: String(metrics.matches || '0'),               icon: <Heart size={14} />,        accent: 'from-pink-100 to-pink-50' },
    { label: 'Profiles Viewed', value: String(metrics.profilesViewed || '142'),      icon: <LayoutGrid size={14} />,   accent: 'from-violet-100 to-violet-50' },
    { label: 'Interactions',    value: String(metrics.profilesEngaged || '28'),      icon: <MessageCircle size={14} />,accent: 'from-sky-100 to-sky-50' },
    { label: 'Time Online',     value: formatTime(metrics.sessionSeconds || 12400),  icon: <Activity size={14} />,     accent: 'from-emerald-100 to-emerald-50' },
    { label: 'Response Rate',   value: metrics.responseRate || 'High',              icon: <Sparkles size={14} />,     accent: 'from-fuchsia-100 to-fuchsia-50' },
    { label: 'Vibe Rating',     value: String(metrics.vibeRating || '9.8'),         icon: <Compass size={14} />,      accent: 'from-orange-100 to-orange-50' },
    { label: 'Daily Streak',    value: `${metrics.activeStreak || 12}d`,            icon: <Zap size={14} />,          accent: 'from-yellow-100 to-yellow-50' },
    { label: 'Security Level',  value: metrics.safetyLevel || 'Elite',             icon: <Star size={14} />,         accent: 'from-teal-100 to-teal-50' },
  ];

  const isVerified = profile?.is_verified;

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#f5f0ea] selection:bg-mat-rose-gold selection:text-white flex flex-col">
      {/* 🌊 Liquid Foundation */}
      <LiquidMesh />
      <PostProcessOverlay />

      {/* ══════════════════════════════════════════
          🏛️  SANCTUARY CANVAS
      ══════════════════════════════════════════ */}
      <main className="relative z-10 w-full flex-1 flex flex-col px-6 py-3 lg:px-14 lg:pt-4 min-h-0 gap-4">

        {/* ── HEADER ROW ─────────────────────────────── */}
        <header className="flex flex-row items-start justify-between shrink-0 gap-4">
          
          {/* Left: Editorial Title */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-1"
          >
            <div className="flex items-center gap-3">
              <span className="w-8 h-[1px] bg-mat-rose-gold" />
              <span className="mat-text-editorial-caps text-[8px] text-mat-noir/40 tracking-[0.25em]">Sanctuary Alpha</span>
            </div>
            <h1 className="mat-text-editorial-huge text-4xl lg:text-5xl text-mat-noir leading-none">
              Sovereign <span className="text-mat-rose-gold italic font-medium">Existence.</span>
            </h1>
          </motion.div>

          {/* Right: Avatars + Identity Protocol Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="flex items-center gap-3 shrink-0"
          >
            {/* Cascaded member avatars */}
            <div className="flex -space-x-2.5 items-center">
              {[
                "1494790108377-be9c29b29330",
                "1534528741775-53994a69daeb",
                "1531746020798-e6953c6e8e04"
              ].map((id, i) => (
                <div key={i} className="w-9 h-9 rounded-full border-2 border-[#f5f0ea] overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.15)] hover:scale-110 hover:z-10 transition-transform cursor-pointer relative z-0">
                  <img
                    src={`https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=80&w=100`}
                    alt="Sanctuary Member"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
              <div className="w-9 h-9 rounded-full border-2 border-[#f5f0ea] bg-[#e8e2d8] flex items-center justify-center text-[8px] mat-text-editorial-caps text-mat-noir/50 shadow-sm">
                +1.2k
              </div>
            </div>

            {/* ── IDENTITY PROTOCOL: ~30% header width, inline status ── */}
            <div
              className={cn(
                "flex items-center gap-2.5 px-4 py-2 rounded-full",
                // Skeuomorphic raised pill
                "bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d]",
                "shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_4px_12px_rgba(0,0,0,0.4),0_1px_3px_rgba(0,0,0,0.3)]",
                "border border-[rgba(255,255,255,0.06)]",
                "cursor-pointer hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_6px_20px_rgba(0,0,0,0.5)] transition-all duration-500"
              )}
              style={{ width: '30%', minWidth: 180 }}
              onClick={!isVerified ? () => setShowVerification(true) : undefined}
            >
              <div className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0",
                isVerified
                  ? "bg-mat-rose-gold/20 text-mat-rose-gold"
                  : "bg-amber-500/20 text-amber-400"
              )}>
                {isVerified ? <CheckCircle2 size={13} /> : <AlertCircle size={13} />}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="mat-text-editorial-caps text-[6px] text-mat-rose-gold tracking-[0.3em] whitespace-nowrap">Identity Protocol</span>
                <span className={cn("text-[10px] font-medium leading-none truncate", isVerified ? "text-white/80" : "text-amber-400/90")}>
                  {isVerified ? "Sovereign Verified" : "Authenticate Now"}
                </span>
              </div>
              {!isVerified && (
                <div className="ml-auto flex-shrink-0 w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              )}
              {isVerified && (
                <div className="ml-auto flex-shrink-0 w-1.5 h-1.5 rounded-full bg-mat-rose-gold animate-pulse" />
              )}
            </div>
          </motion.div>
        </header>

        {/* ── MAIN GRID ──────────────────────────────── */}
        <TooltipProvider>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 flex-1 min-h-0 pb-16">

            {/* ── PROFILE TRUMP CARD ─────────────────── */}
            <div className="md:col-span-3 h-full">
              <div className={cn(
                "h-full rounded-2xl overflow-hidden flex flex-col group/card",
                // Apple-style skeuomorphic card: raised surface
                "bg-gradient-to-b from-[#fdfcfa] to-[#f0ece4]",
                "shadow-[inset_0_1px_0_rgba(255,255,255,0.9),inset_0_-1px_0_rgba(0,0,0,0.05),0_8px_24px_rgba(0,0,0,0.10),0_2px_6px_rgba(0,0,0,0.07)]",
                "border border-[rgba(0,0,0,0.06)]"
              )}>
                {/* Portrait */}
                <div className="relative h-[52%] overflow-hidden shrink-0">
                  <img 
                    src={profile?.photos?.[0] || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=600"} 
                    alt={profile?.full_name} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover/card:scale-105"
                  />
                  {/* Vignette gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 bg-white/15 backdrop-blur-lg border border-white/20 rounded-full mat-text-editorial-caps text-[6px] text-white shadow-sm">
                      Live Essence
                    </span>
                  </div>
                </div>

                {/* Info panel */}
                <div className="flex-grow p-4 flex flex-col justify-between bg-gradient-to-b from-transparent to-[#ede8e0]/30">
                  <div>
                    <h2 className="mat-text-editorial-huge text-xl text-mat-noir leading-none">{profile?.full_name || 'User'}</h2>
                    <p className="mat-text-editorial-caps text-[7px] text-mat-rose-gold mt-0.5">{profile?.city || 'The Sanctuary'}</p>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <button 
                      onClick={() => setIsEditing(true)}
                      className={cn(
                        "flex-grow py-2 text-[8px] mat-text-editorial-caps rounded-full transition-all duration-500",
                        "bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] text-white",
                        "shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_3px_8px_rgba(0,0,0,0.3)]",
                        "hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_5px_14px_rgba(0,0,0,0.4)] hover:from-mat-rose-gold hover:to-mat-rose-gold/80",
                        "active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)] active:scale-[0.98]"
                      )}
                    >
                      Edit Profile
                    </button>
                    <button className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                      "bg-gradient-to-b from-white to-[#e8e2d8]",
                      "shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_2px_4px_rgba(0,0,0,0.12)]",
                      "border border-[rgba(0,0,0,0.07)]",
                      "hover:shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] active:scale-[0.96] text-mat-noir/50"
                    )}>
                      <LayoutGrid size={12} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* ── STATS: 5 columns × 2 rows ──────────── */}
            <div className="md:col-span-9 grid grid-cols-5 grid-rows-2 gap-3 h-full">
              {stats.map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.1 + idx * 0.04, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className={cn(
                    "relative flex flex-col justify-between p-3 lg:p-4 rounded-2xl overflow-hidden group/stat",
                    "transition-all duration-300 cursor-default",
                    // Skeuomorphic raised tile — Apple / Ferrari luxury material
                    "bg-gradient-to-b from-[#fdfcfa] to-[#ece8e0]",
                    "shadow-[inset_0_1px_0_rgba(255,255,255,0.95),inset_0_-1px_0_rgba(0,0,0,0.05),0_4px_10px_rgba(0,0,0,0.08),0_1px_3px_rgba(0,0,0,0.05)]",
                    "border border-[rgba(0,0,0,0.06)]",
                    "hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.90),0_6px_16px_rgba(0,0,0,0.12),0_2px_5px_rgba(0,0,0,0.06)]",
                    "hover:translate-y-[-1px]",
                    "active:shadow-[inset_0_2px_6px_rgba(0,0,0,0.12)] active:translate-y-0"
                  )}
                >
                  {/* Accent colour wash (top-right corner glow) */}
                  <div className={cn(
                    "absolute -top-4 -right-4 w-20 h-20 rounded-full blur-2xl opacity-50 bg-gradient-to-br",
                    stat.accent
                  )} />

                  {/* Icon chip + Label row */}
                  <div className="flex items-center gap-1.5 mb-1">
                    <div className={cn(
                      "w-6 h-6 rounded-lg flex items-center justify-center shrink-0",
                      "bg-gradient-to-br from-white to-[#ede8e0]",
                      "shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_1px_3px_rgba(0,0,0,0.10)]",
                      "border border-[rgba(0,0,0,0.06)] text-mat-rose-gold",
                      "group-hover/stat:bg-gradient-to-br group-hover/stat:from-mat-rose-gold/90 group-hover/stat:to-mat-rose-gold group-hover/stat:text-white group-hover/stat:border-mat-rose-gold/20 transition-all duration-500"
                    )}>
                      {stat.icon}
                    </div>
                    <h3 className="mat-text-editorial-caps text-[7px] text-mat-noir/40 tracking-[0.15em] uppercase leading-none truncate">{stat.label}</h3>
                  </div>

                  {/* Value — fills card width */}
                  <div>
                    <p className="mat-text-editorial-huge text-2xl lg:text-3xl text-mat-noir leading-none tracking-tight">{stat.value}</p>
                  </div>

                  {/* Thin progress underline */}
                  <div className="absolute bottom-0 left-3 right-3 h-[1.5px] bg-mat-noir/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${55 + Math.abs(Math.sin(idx * 1.3)) * 40}%` }}
                      transition={{ duration: 1.8, delay: 0.5 + idx * 0.06 }}
                      className="h-full bg-gradient-to-r from-mat-rose-gold/60 to-mat-rose-gold/20"
                    />
                  </div>
                </motion.div>
              ))}
            </div>

          </div>
        </TooltipProvider>

        {/* ── COMMAND DOCK ───────────────────────────── */}
        <div className="fixed bottom-6 lg:bottom-8 left-1/2 -translate-x-1/2 z-50">
          <Dock 
            onShowFAQ={() => setShowFAQ(true)}
            onShowVerification={!isVerified ? () => setShowVerification(true) : undefined}
            hideLogout={true}
          />
        </div>
      </main>

      {/* ══════════════════════════════════════════
          🧩 FAQ MODAL
      ══════════════════════════════════════════ */}
      <AnimatePresence>
        {showFAQ && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-12 backdrop-blur-3xl bg-mat-noir/20"
            onClick={() => setShowFAQ(false)}
          >
            <GlassCard className="w-full max-w-5xl p-0 h-auto max-h-[85vh] overflow-hidden rounded-[3rem]" delay={0} onClick={(e: React.MouseEvent) => e.stopPropagation()}>
              <button 
                onClick={() => setShowFAQ(false)}
                className="absolute top-8 right-8 w-12 h-12 bg-mat-noir/5 rounded-full flex items-center justify-center text-mat-noir/40 hover:text-mat-rose-gold transition-all z-20"
              >
                <X size={22} />
              </button>
              <div className="p-10 lg:p-20 space-y-12 overflow-y-auto max-h-[80vh] custom-scrollbar">
                <div className="space-y-4">
                  <h3 className="mat-text-editorial-caps">The Oracle</h3>
                  <h2 className="mat-text-editorial-huge text-6xl text-mat-noir leading-none">
                    Sanctuary <span className="italic font-medium text-mat-rose-gold">Knowledge.</span>
                  </h2>
                </div>
                <div className="pointer-events-auto prose max-w-none">
                  <FAQ />
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════
          🧩 VERIFICATION MODAL
      ══════════════════════════════════════════ */}
      <AnimatePresence>
        {showVerification && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] flex items-center justify-center p-12 bg-mat-noir/40 backdrop-blur-2xl" 
            onClick={() => setShowVerification(false)}
          >
            <GlassCard className="w-full max-w-2xl p-0 rounded-[3rem]" delay={0} onClick={(e: React.MouseEvent) => e.stopPropagation()}>
              <button onClick={() => setShowVerification(false)} className="absolute top-8 right-8 text-mat-noir/20 hover:text-mat-rose-gold z-20">
                <X size={26} />
              </button>
              <div className="p-14">
                <AadhaarVerification 
                  userId={profile?.user_id} 
                  onVerified={async () => {
                    await refreshProfile();
                    setShowVerification(false);
                  }} 
                />
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WomenSanctuary;
