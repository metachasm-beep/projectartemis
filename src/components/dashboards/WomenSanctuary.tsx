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
          <div className="flex gap-4 flex-1 min-h-0 items-start">

            {/* ── LEFT STATS (first 5) ─────────────────── */}
            <div className="flex flex-col gap-2.5 flex-1 min-w-0">
              {stats.slice(0, 5).map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -14, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ delay: 0.08 + idx * 0.07, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className={cn(
                    "relative flex items-center gap-3 px-4 py-3 rounded-2xl group/stat cursor-default w-full",
                    "transition-all duration-300 overflow-hidden",
                    SkeuSurface,
                    "hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.90),0_6px_18px_rgba(0,0,0,0.13)]",
                    "hover:translate-y-[-1px]",
                    "active:shadow-[inset_0_2px_6px_rgba(0,0,0,0.12)] active:translate-y-0"
                  )}
                >
                  <div className={cn("absolute -top-3 -right-3 w-14 h-14 rounded-full blur-xl opacity-50 bg-gradient-to-br pointer-events-none", stat.accent)} />
                  <div className={cn(
                    "shrink-0 w-8 h-8 rounded-xl flex items-center justify-center",
                    "bg-gradient-to-br from-white to-[#ede8e0]",
                    "shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_2px_4px_rgba(0,0,0,0.09)]",
                    "border border-[rgba(0,0,0,0.06)] text-mat-rose-gold",
                    "group-hover/stat:from-mat-rose-gold group-hover/stat:to-mat-rose-gold/80 group-hover/stat:text-white group-hover/stat:border-mat-rose-gold/20 transition-all duration-400"
                  )}>
                    {stat.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="mat-text-editorial-huge text-xl text-mat-noir leading-none">{stat.value}</p>
                    <h3 className="mat-text-editorial-caps text-[7px] text-mat-noir/38 tracking-[0.15em] uppercase mt-0.5 truncate">{stat.label}</h3>
                  </div>
                  <div className="absolute bottom-0 left-4 right-4 h-[1.5px] bg-mat-noir/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${50 + Math.abs(Math.sin(idx * 1.5)) * 45}%` }}
                      transition={{ duration: 1.6, delay: 0.4 + idx * 0.06 }}
                      className="h-full bg-gradient-to-r from-mat-rose-gold/50 to-mat-rose-gold/10"
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* ── TRUMP CARD (centre) ─────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className={cn("w-56 shrink-0 h-full rounded-2xl overflow-hidden flex flex-col group/card", SkeuSurface)}
            >
              {/* Portrait */}
              <div className="relative h-48 overflow-hidden shrink-0">
                <img
                  src={profile?.photos?.[0] || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400"}
                  alt={profile?.full_name}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover/card:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                {/* Name overlay on portrait */}
                <div className="absolute bottom-3 left-3 right-3">
                  <h2 className="mat-text-editorial-huge text-xl text-white leading-none drop-shadow-lg">
                    {profile?.full_name || 'Sovereign'}
                  </h2>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-white/80 text-[10px] font-light">{age} yrs</span>
                    {isVerified && <CheckCircle2 size={10} className="text-mat-rose-gold" />}
                  </div>
                </div>
                {/* Live badge */}
                <div className="absolute top-3 right-3">
                  <span className="px-2 py-0.5 bg-mat-rose-gold/90 backdrop-blur-sm rounded-full mat-text-editorial-caps text-[6px] text-white shadow-sm">● Live</span>
                </div>
              </div>

              {/* Bio data */}
              <div className="flex-1 p-4 flex flex-col justify-between overflow-y-auto custom-scrollbar">

                {/* Bio quote */}
                <p className="text-[9px] text-mat-noir/55 italic leading-relaxed border-l-2 border-mat-rose-gold/40 pl-2.5 mb-3">
                  "{bio}"
                </p>

                {/* Stat rows */}
                <div className="space-y-2 mb-3">
                  {[
                    { icon: <MapPin size={9} />,        label: 'Location',    value: profile?.city || 'Delhi' },
                    { icon: <Briefcase size={9} />,     label: 'Profession',  value: occupation },
                    { icon: <GraduationCap size={9} />, label: 'Education',   value: education },
                    { icon: <Ruler size={9} />,         label: 'Height',      value: height },
                    { icon: <Calendar size={9} />,      label: 'Member Since',value: String(memberSince) },
                  ].map((row, i) => (
                    <div key={i} className={cn("flex items-center gap-2 px-2.5 py-1.5 rounded-lg", SkeuSurface)}>
                      <span className="text-mat-rose-gold shrink-0">{row.icon}</span>
                      <span className="mat-text-editorial-caps text-[6px] text-mat-noir/35 tracking-wider uppercase shrink-0 w-14">{row.label}</span>
                      <span className="text-[9px] text-mat-noir font-medium truncate">{row.value}</span>
                    </div>
                  ))}
                </div>

                {/* Interests */}
                {interests.length > 0 && (
                  <div className="mb-3">
                    <p className="mat-text-editorial-caps text-[6px] text-mat-noir/30 tracking-wider mb-1.5 uppercase">Interests</p>
                    <div className="flex flex-wrap gap-1">
                      {interests.slice(0, 5).map((tag: string, i: number) => (
                        <span key={i} className={cn("px-2 py-0.5 rounded-full text-[7px] mat-text-editorial-caps text-mat-noir/60", SkeuSurface)}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Profile completeness bar */}
                <div className="mb-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="mat-text-editorial-caps text-[6px] text-mat-noir/35 tracking-wider uppercase">Profile Complete</span>
                    <span className="text-[9px] font-semibold text-mat-rose-gold">{completeness}%</span>
                  </div>
                  <div className="h-1 bg-mat-noir/8 rounded-full overflow-hidden shadow-inner">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${completeness}%` }}
                      transition={{ duration: 1.5, delay: 0.5 }}
                      className="h-full bg-gradient-to-r from-mat-rose-gold to-mat-rose-gold/60 rounded-full"
                    />
                  </div>
                </div>

                {/* CTA */}
                <button
                  onClick={() => setIsEditing(true)}
                  className={cn(
                    "w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[8px] mat-text-editorial-caps transition-all duration-400",
                    "bg-gradient-to-b from-[#1c1c1c] to-[#0e0e0e] text-white",
                    "shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_3px_8px_rgba(0,0,0,0.3)]",
                    "hover:from-mat-rose-gold hover:to-mat-rose-gold/80 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_4px_12px_rgba(183,110,121,0.4)]",
                    "active:scale-[0.98] active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]"
                  )}
                >
                  <Edit3 size={10} />
                  Edit Profile
                </button>
              </div>
            </motion.div>

            {/* ── RIGHT STATS (last 5) ─────────────────── */}
            <div className="flex flex-col gap-2.5 flex-1 min-w-0">
              {stats.slice(5).map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: 14, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ delay: 0.08 + idx * 0.07, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className={cn(
                    "relative flex items-center gap-3 px-4 py-3 rounded-2xl group/stat cursor-default w-full",
                    "transition-all duration-300 overflow-hidden",
                    SkeuSurface,
                    "hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.90),0_6px_18px_rgba(0,0,0,0.13)]",
                    "hover:translate-y-[-1px]",
                    "active:shadow-[inset_0_2px_6px_rgba(0,0,0,0.12)] active:translate-y-0"
                  )}
                >
                  <div className={cn("absolute -top-3 -right-3 w-14 h-14 rounded-full blur-xl opacity-50 bg-gradient-to-br pointer-events-none", stat.accent)} />
                  <div className={cn(
                    "shrink-0 w-8 h-8 rounded-xl flex items-center justify-center",
                    "bg-gradient-to-br from-white to-[#ede8e0]",
                    "shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_2px_4px_rgba(0,0,0,0.09)]",
                    "border border-[rgba(0,0,0,0.06)] text-mat-rose-gold",
                    "group-hover/stat:from-mat-rose-gold group-hover/stat:to-mat-rose-gold/80 group-hover/stat:text-white group-hover/stat:border-mat-rose-gold/20 transition-all duration-400"
                  )}>
                    {stat.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="mat-text-editorial-huge text-xl text-mat-noir leading-none">{stat.value}</p>
                    <h3 className="mat-text-editorial-caps text-[7px] text-mat-noir/38 tracking-[0.15em] uppercase mt-0.5 truncate">{stat.label}</h3>
                  </div>
                  <div className="absolute bottom-0 left-4 right-4 h-[1.5px] bg-mat-noir/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${50 + Math.abs(Math.sin((idx + 5) * 1.5)) * 45}%` }}
                      transition={{ duration: 1.6, delay: 0.4 + idx * 0.06 }}
                      className="h-full bg-gradient-to-r from-mat-rose-gold/50 to-mat-rose-gold/10"
                    />
                  </div>
                </motion.div>
              ))}
            </div>

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
