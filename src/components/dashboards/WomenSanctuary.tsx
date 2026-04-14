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
  AlertCircle,
  MapPin,
  Briefcase,
  GraduationCap,
  Ruler,
  Calendar,
  Bookmark,
  Edit3,
} from 'lucide-react';

import { LiquidMesh } from '@/components/dashboard/promax/LiquidMesh';
import { GlassCard } from '@/components/dashboard/promax/GlassCard';
import { Dock } from '@/components/dashboard/promax/Dock';
import { cn } from '@/lib/utils';
import { FAQ } from '@/components/FAQ';
import { AadhaarVerification } from '@/components/AadhaarVerification';
import { useAuth } from '@/hooks/useAuth';
import { PostProcessOverlay } from '@/components/dashboard/promax/PostProcessOverlay';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

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
 * 🏛️ Women's Sanctuary 5.0: Trump Card Edition
 * Rich profile data card + auto-sizing skeuomorphic stat chips.
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

  const isVerified = profile?.is_verified;
  const completeness = profile?.profile_completeness ?? 94;

  /* ── Bio data pulled from profile ── */
  const age         = profile?.age ?? (profile?.date_of_birth ? new Date().getFullYear() - new Date(profile.date_of_birth).getFullYear() : 26);
  const occupation  = profile?.occupation ?? 'Creative Director';
  const education   = profile?.education ?? 'Post Graduate';
  const height      = profile?.height ? `${profile.height} cm` : '165 cm';
  const bio         = profile?.bio ?? 'Curating beauty, silence, and intentional connection. Here for depth — not noise.';
  const interests   = profile?.interests ?? ['Art', 'Travel', 'Yoga', 'Literature', 'Film'];
  const memberSince = profile?.created_at ? new Date(profile.created_at).getFullYear() : 2024;

  /* ── Engagement stats ── */
  const stats = [
    { label: 'Profile Views',   value: '4.2k',                                     icon: <Eye size={13} />,          accent: 'from-rose-100 to-rose-50' },
    { label: 'Trust Score',     value: `${completeness}%`,                          icon: <ShieldCheck size={13} />,  accent: 'from-amber-100 to-amber-50' },
    { label: 'Matches',         value: String(metrics.matches || 0),                icon: <Heart size={13} />,        accent: 'from-pink-100 to-pink-50' },
    { label: 'Profiles Viewed', value: String(metrics.profilesViewed || 142),       icon: <LayoutGrid size={13} />,   accent: 'from-violet-100 to-violet-50' },
    { label: 'Interactions',    value: String(metrics.profilesEngaged || 28),       icon: <MessageCircle size={13} />,accent: 'from-sky-100 to-sky-50' },
    { label: 'Time Online',     value: formatTime(metrics.sessionSeconds || 12400), icon: <Activity size={13} />,     accent: 'from-emerald-100 to-emerald-50' },
    { label: 'Response Rate',   value: metrics.responseRate ?? 'High',              icon: <Sparkles size={13} />,     accent: 'from-fuchsia-100 to-fuchsia-50' },
    { label: 'Vibe Rating',     value: String(metrics.vibeRating ?? 9.8),           icon: <Compass size={13} />,      accent: 'from-orange-100 to-orange-50' },
    { label: 'Daily Streak',    value: `${metrics.activeStreak ?? 12}d`,            icon: <Zap size={13} />,          accent: 'from-yellow-100 to-yellow-50' },
    { label: 'Security Level',  value: metrics.safetyLevel ?? 'Elite',              icon: <Star size={13} />,         accent: 'from-teal-100 to-teal-50' },
  ];

  /* ─── Skeuomorphic raised surface class ─── */
  const SkeuSurface = "bg-gradient-to-b from-[#fdfcfa] to-[#ede8e0] shadow-[inset_0_1px_0_rgba(255,255,255,0.95),inset_0_-1px_0_rgba(0,0,0,0.05),0_4px_12px_rgba(0,0,0,0.08),0_1px_3px_rgba(0,0,0,0.05)] border border-[rgba(0,0,0,0.06)]";

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#f5f0ea] selection:bg-mat-rose-gold selection:text-white flex flex-col">
      <LiquidMesh />
      <PostProcessOverlay />

      <main className="relative z-10 w-full flex-1 flex flex-col px-6 py-3 lg:px-14 lg:pt-4 min-h-0 gap-3">

        {/* ══ HEADER ══════════════════════════════════════ */}
        <header className="flex flex-row items-start justify-between shrink-0 gap-4">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="space-y-0.5">
            <div className="flex items-center gap-3">
              <span className="w-7 h-[1px] bg-mat-rose-gold" />
              <span className="mat-text-editorial-caps text-[7px] text-mat-noir/40 tracking-[0.25em]">Sanctuary Alpha</span>
            </div>
            <h1 className="mat-text-editorial-huge text-4xl lg:text-5xl text-mat-noir leading-none">
              Sovereign <span className="text-mat-rose-gold italic font-medium">Existence.</span>
            </h1>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.12 }} className="flex items-center gap-3 shrink-0">
            {/* Cascaded avatars */}
            <div className="flex -space-x-2.5">
              {["1494790108377-be9c29b29330","1534528741775-53994a69daeb","1531746020798-e6953c6e8e04"].map((id, i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-[#f5f0ea] overflow-hidden shadow-md hover:scale-110 hover:z-10 transition-transform cursor-pointer relative">
                  <img src={`https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=80&w=80`} alt="Member" className="w-full h-full object-cover" />
                </div>
              ))}
              <div className="w-8 h-8 rounded-full border-2 border-[#f5f0ea] bg-[#e8e2d8] flex items-center justify-center text-[7px] mat-text-editorial-caps text-mat-noir/50 shadow-sm">+1.2k</div>
            </div>

            {/* Identity Protocol pill — ~30% header width */}
            <button
              onClick={!isVerified ? () => setShowVerification(true) : undefined}
              style={{ minWidth: 190 }}
              className={cn(
                "flex items-center gap-2.5 px-4 py-2 rounded-full transition-all duration-400",
                "bg-gradient-to-b from-[#1c1c1c] to-[#0e0e0e]",
                "shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_4px_14px_rgba(0,0,0,0.45)]",
                "border border-[rgba(255,255,255,0.05)]",
                !isVerified && "hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_6px_20px_rgba(0,0,0,0.55)] cursor-pointer",
                isVerified && "cursor-default"
              )}
            >
              <div className={cn("w-6 h-6 rounded-full flex items-center justify-center shrink-0", isVerified ? "bg-mat-rose-gold/20 text-mat-rose-gold" : "bg-amber-500/20 text-amber-400")}>
                {isVerified ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
              </div>
              <div className="flex flex-col items-start min-w-0">
                <span className="mat-text-editorial-caps text-[6px] text-mat-rose-gold tracking-[0.3em] whitespace-nowrap">Identity Protocol</span>
                <span className={cn("text-[10px] font-medium leading-tight truncate", isVerified ? "text-white/70" : "text-amber-400")}>
                  {isVerified ? "Sovereign Verified" : "Authenticate Now"}
                </span>
              </div>
              <div className={cn("ml-auto shrink-0 w-1.5 h-1.5 rounded-full animate-pulse", isVerified ? "bg-mat-rose-gold" : "bg-amber-400")} />
            </button>
          </motion.div>
        </header>

        {/* ══ MAIN BODY ════════════════════════════════════ */}
        <TooltipProvider>
          <div className="flex-1 min-h-0 flex flex-col items-center justify-center relative w-full h-full pb-8 md:pb-12">

            {/* ── SPATIAL TRUMP CARD ISLAND ────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                "w-[85%] sm:w-[70%] max-w-2xl h-[68%] sm:h-[72vh] rounded-[2.5rem] lg:rounded-[3rem] overflow-hidden flex flex-col group/card relative z-10",
                "bg-white/60 backdrop-blur-3xl border border-white/60",
                "shadow-[0_45px_100px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.9),0_2px_15px_rgba(0,0,0,0.05)]",
              )}
            >
              {/* Portrait */}
              <div className="relative h-[65%] overflow-hidden shrink-0">
                <img
                  src={profile?.photos?.[0] || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=600"}
                  alt={profile?.full_name}
                  className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover/card:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                {/* Name overlay on portrait */}
                <div className="absolute bottom-4 left-5 right-5">
                  <h2 className="mat-text-editorial-huge text-3xl md:text-4xl text-white leading-none drop-shadow-xl">
                    {profile?.full_name || 'Sovereign'}
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-white/90 text-[12px] font-light shadow-sm">{age} yrs</span>
                    {isVerified && <CheckCircle2 size={12} className="text-mat-rose-gold drop-shadow-sm" />}
                  </div>
                </div>
                {/* Live badge */}
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full mat-text-editorial-caps text-[7px] text-white shadow-[0_2px_8px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.3)] border border-white/20">
                    ● Live
                  </span>
                </div>
              </div>

              {/* Bio data */}
              <div className="flex-1 p-5 md:p-8 flex flex-col justify-between overflow-y-auto custom-scrollbar relative z-10 bg-gradient-to-b from-white/40 to-[#f5f0ea]/80">

                {/* Bio quote */}
                <p className="text-[11px] md:text-xs text-mat-noir/65 italic leading-relaxed border-l-[3px] border-mat-rose-gold/40 pl-3 mb-4">
                  "{bio}"
                </p>

                {/* Stat rows */}
                <div className="space-y-2.5 mb-4">
                  {[
                    { icon: <MapPin size={11} />,        label: 'Location',    value: profile?.city || 'Delhi' },
                    { icon: <Briefcase size={11} />,     label: 'Profession',  value: occupation },
                    { icon: <GraduationCap size={11} />, label: 'Education',   value: education },
                    { icon: <Ruler size={11} />,         label: 'Height',      value: height },
                  ].map((row, i) => (
                    <div key={i} className="flex items-center gap-3 px-3.5 py-2 rounded-xl bg-white/50 backdrop-blur-xl border border-white/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_2px_5px_rgba(0,0,0,0.03)]">
                      <span className="text-mat-rose-gold shrink-0 opacity-80">{row.icon}</span>
                      <span className="mat-text-editorial-caps text-[7px] text-mat-noir/40 tracking-wider uppercase shrink-0 w-20">{row.label}</span>
                      <span className="text-[10px] md:text-[11px] text-mat-noir font-medium truncate">{row.value}</span>
                    </div>
                  ))}
                </div>

                {/* Profile completeness bar */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="mat-text-editorial-caps text-[7px] text-mat-noir/40 tracking-wider uppercase">Profile Complete</span>
                    <span className="text-[9px] font-semibold text-mat-rose-gold">{completeness}%</span>
                  </div>
                  <div className="h-[3px] bg-mat-noir/10 rounded-full overflow-hidden shadow-inner">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${completeness}%` }}
                      transition={{ duration: 1.5, delay: 0.5 }}
                      className="h-full bg-gradient-to-r from-mat-rose-gold/60 to-mat-rose-gold rounded-full"
                    />
                  </div>
                </div>

                {/* CTA */}
                <button
                  onClick={() => setIsEditing(true)}
                  className={cn(
                    "w-full flex items-center justify-center gap-2 py-3 md:py-3.5 rounded-xl text-[9px] md:text-[10px] mat-text-editorial-caps transition-all duration-400 font-medium",
                    "bg-gradient-to-b from-[#1c1c1c] to-[#0a0a0a] text-white",
                    "shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_4px_12px_rgba(0,0,0,0.25)] border border-black",
                    "hover:from-mat-rose-gold hover:to-mat-rose-gold/90 hover:shadow-[0_6px_16px_rgba(183,110,121,0.3)] hover:border-mat-rose-gold",
                  )}
                >
                  <Edit3 size={12} />
                  Edit Sanctuary Profile
                </button>
              </div>
            </motion.div>

            {/* ── ORBITAL STATS DOCK ───────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                "absolute bottom-4 md:bottom-8 z-20 flex items-center gap-2 md:gap-3 px-4 md:px-6 py-3 md:py-3.5 rounded-full overflow-x-auto custom-scrollbar max-w-full",
                "bg-white/70 backdrop-blur-2xl border border-white/80",
                "shadow-[0_20px_40px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,1)]"
              )}
            >
              {stats.map((stat, idx) => (
                <Tooltip key={idx}>
                  <TooltipTrigger asChild>
                    <motion.div
                      whileHover={{ scale: 1.15, y: -4 }}
                      whileTap={{ scale: 0.95 }}
                      className={cn(
                        "relative shrink-0 w-10 h-10 md:w-[3.25rem] md:h-[3.25rem] rounded-full flex items-center justify-center cursor-pointer overflow-hidden group/orb",
                        "bg-gradient-to-b from-white to-[#ece8e0]",
                        "shadow-[0_4px_10px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,1)] border border-[rgba(0,0,0,0.04)]",
                        "text-mat-rose-gold transition-all duration-300"
                      )}
                    >
                      {/* Inner accent glow (blooms on hover) */}
                      <div className={cn(
                        "absolute inset-0 rounded-full opacity-0 group-hover/orb:opacity-100 transition-opacity duration-500 blur-lg pointer-events-none",
                        stat.accent
                      )} />
                      
                      <div className="relative z-10 group-hover/orb:scale-110 transition-transform duration-300">
                        {React.cloneElement(stat.icon as React.ReactElement, { size: 18 })}
                      </div>
                      
                      {/* Micro progress indicator ring (replaces the linear bar) */}
                      <div className="absolute bottom-1 w-4 md:w-5 h-[2px] bg-mat-noir/5 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-mat-rose-gold/80" 
                          style={{ width: `${50 + Math.abs(Math.sin((idx) * 1.5)) * 45}%` }} 
                        />
                      </div>
                    </motion.div>
                  </TooltipTrigger>
                  <TooltipContent side="top" sideOffset={14} className="bg-[#1c1c1c] text-white border-white/10 rounded-xl px-5 py-3 shadow-2xl backdrop-blur-xl">
                    <p className="mat-text-editorial-huge text-2xl leading-none mb-1.5">{stat.value}</p>
                    <p className="mat-text-editorial-caps text-[8px] text-white/50 tracking-widest uppercase">{stat.label}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </motion.div>

          </div>
        </TooltipProvider>

        {/* ── COMMAND DOCK ─────────────────────────── */}
        <div className="fixed bottom-6 lg:bottom-8 left-1/2 -translate-x-1/2 z-50">
          <Dock
            onShowFAQ={() => setShowFAQ(true)}
            onShowVerification={!isVerified ? () => setShowVerification(true) : undefined}
            hideLogout={true}
          />
        </div>
      </main>

      {/* ══ FAQ MODAL ══════════════════════════════════ */}
      <AnimatePresence>
        {showFAQ && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-12 backdrop-blur-3xl bg-mat-noir/20"
            onClick={() => setShowFAQ(false)}
          >
            <GlassCard className="w-full max-w-5xl p-0 h-auto max-h-[85vh] overflow-hidden rounded-[3rem]" delay={0} onClick={(e: React.MouseEvent) => e.stopPropagation()}>
              <button onClick={() => setShowFAQ(false)} className="absolute top-8 right-8 w-12 h-12 bg-mat-noir/5 rounded-full flex items-center justify-center text-mat-noir/40 hover:text-mat-rose-gold transition-all z-20">
                <X size={22} />
              </button>
              <div className="p-10 lg:p-20 space-y-10 overflow-y-auto max-h-[80vh] custom-scrollbar">
                <div>
                  <h3 className="mat-text-editorial-caps mb-2">The Oracle</h3>
                  <h2 className="mat-text-editorial-huge text-6xl text-mat-noir leading-none">Sanctuary <span className="italic font-medium text-mat-rose-gold">Knowledge.</span></h2>
                </div>
                <div className="pointer-events-auto prose max-w-none"><FAQ /></div>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══ VERIFICATION MODAL ══════════════════════════ */}
      <AnimatePresence>
        {showVerification && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] flex items-center justify-center p-12 bg-mat-noir/40 backdrop-blur-2xl"
            onClick={() => setShowVerification(false)}
          >
            <GlassCard className="w-full max-w-2xl p-0 rounded-[3rem]" delay={0} onClick={(e: React.MouseEvent) => e.stopPropagation()}>
              <button onClick={() => setShowVerification(false)} className="absolute top-8 right-8 text-mat-noir/20 hover:text-mat-rose-gold z-20"><X size={26} /></button>
              <div className="p-14">
                <AadhaarVerification
                  userId={profile?.user_id}
                  onVerified={async () => { await refreshProfile(); setShowVerification(false); }}
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
