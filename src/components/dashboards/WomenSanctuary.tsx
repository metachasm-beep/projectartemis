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
  Settings,
  HelpCircle,
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
    saves?: number;
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
  const age         = profile?.age ?? (profile?.date_of_birth ? new Date().getFullYear() - new Date(profile.date_of_birth).getFullYear() : '--');
  const occupation  = profile?.occupation ?? '--';
  const education   = profile?.education ?? '--';
  const height      = profile?.height ? `${profile.height} cm` : '-- cm';
  const bio         = profile?.bio ?? 'Awaiting identity narrative...';
  const interests   = profile?.interests ?? [];
  const memberSince = profile?.created_at ? new Date(profile.created_at).getFullYear() : '--';

  /* ── Engagement stats ── */
  const stats = [
    { label: 'Profile Views',   value: String(metrics.profileViews || 0),          icon: <Eye size={13} />,          accent: 'from-rose-100 to-rose-50' },
    { label: 'Trust Score',     value: `${completeness}%`,                          icon: <ShieldCheck size={13} />,  accent: 'from-amber-100 to-amber-50' },
    { label: 'Matches',         value: String(metrics.matches || 0),                icon: <Heart size={13} />,        accent: 'from-pink-100 to-pink-50' },
    { label: 'Profiles Viewed', value: String(metrics.profilesEngaged || 0),        icon: <LayoutGrid size={13} />,   accent: 'from-violet-100 to-violet-50' },
    { label: 'Interactions',    value: String(metrics.saves || 0),                  icon: <MessageCircle size={13} />,accent: 'from-sky-100 to-sky-50' },
    { label: 'Time Online',     value: formatTime(metrics.sessionSeconds || 0),     icon: <Activity size={13} />,     accent: 'from-emerald-100 to-emerald-50' },
    { label: 'Response Rate',   value: metrics.responseRate ?? 'N/A',              icon: <Sparkles size={13} />,     accent: 'from-fuchsia-100 to-fuchsia-50' },
    { label: 'Vibe Rating',     value: metrics.vibeRating ? String(metrics.vibeRating) : '--', icon: <Compass size={13} />,      accent: 'from-orange-100 to-orange-50' },
    { label: 'Daily Streak',    value: `${metrics.activeStreak || 0}d`,             icon: <Zap size={13} />,          accent: 'from-yellow-100 to-yellow-50' },
    { label: 'Security Level',  value: metrics.safetyLevel ?? 'Standard',              icon: <Star size={13} />,         accent: 'from-teal-100 to-teal-50' },
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
              {/* Migrated Dock Actions */}
              <div className="flex items-center gap-1.5 mr-2">
                <button onClick={() => setShowFAQ(true)} className="w-9 h-9 rounded-full bg-white/50 backdrop-blur-xl border border-white/60 shadow-[0_2px_8px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,1)] flex items-center justify-center text-mat-noir/40 hover:text-mat-rose-gold hover:bg-white hover:scale-105 transition-all">
                  <HelpCircle size={14} />
                </button>
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
          <div className="flex-1 w-full flex flex-col min-h-0 gap-6 pb-6">

            {/* ── EDITORIAL BROADSHEET TRUMP CARD (Top 60%) ────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="w-full flex-1 md:flex-[1.4] min-h-0 rounded-[2.5rem] lg:rounded-[3rem] overflow-hidden flex relative group/hero shadow-[0_30px_80px_rgba(0,0,0,0.15)]"
            >
              {/* Cinematic Photography */}
              <div className="absolute inset-0 z-0">
                <img
                  src={profile?.photos?.[0] || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=1600"}
                  alt={profile?.full_name}
                  className="w-full h-full object-cover transition-transform duration-[2.5s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/hero:scale-[1.03]"
                  style={{ objectPosition: 'center 30%' }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-mat-noir/90 via-mat-noir/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-mat-noir/80 via-transparent to-transparent" />
              </div>

              {/* Editorial Content Overlay */}
              <div className="relative z-10 p-8 md:p-12 lg:p-14 w-full h-full flex flex-col justify-between text-white max-w-[85%] lg:max-w-4xl">
                
                {/* Top Identity Block */}
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="mat-text-fluid-huge drop-shadow-2xl leading-none">
                      {profile?.full_name || 'Sovereign'}
                    </h2>
                    <div className="flex items-center gap-3 mt-4">
                      <span className="text-white/90 text-sm md:text-base font-light tracking-wider drop-shadow-md">{age} yrs</span>
                      {isVerified && (
                        <span className="flex items-center gap-1.5 px-3 py-1 bg-white/10 border border-white/20 rounded-full backdrop-blur-md shadow-lg">
                          <CheckCircle2 size={12} className="text-mat-rose-gold" />
                          <span className="text-white/90 mat-text-editorial-caps text-[7px] tracking-[0.2em]">Verified</span>
                        </span>
                      )}
                    </div>
                  </div>
                  {/* Live badge */}
                  <div className="shrink-0 hidden md:block">
                    <span className="px-4 py-1.5 bg-mat-rose-gold/80 backdrop-blur-md rounded-full mat-text-editorial-caps text-[8px] tracking-[0.2em] text-white shadow-xl">
                      ● Live Instance
                    </span>
                  </div>
                </div>

                {/* Bottom Footer Block */}
                <div className="flex flex-col gap-8 md:gap-10">
                  <p className="text-white/90 font-serif italic font-light text-sm md:text-base lg:text-lg max-w-2xl leading-relaxed border-l-[3px] border-mat-rose-gold pl-5 drop-shadow-md">
                    "{bio}"
                  </p>
                  
                  <div className="flex flex-wrap items-center justify-between gap-6">
                    {/* Meta Data Row */}
                    <div className="flex flex-wrap items-center gap-6 md:gap-12">
                      {[
                        { icon: <MapPin size={16} />,        label: 'Location',    value: profile?.city || 'Delhi' },
                        { icon: <Briefcase size={16} />,     label: 'Profession',  value: occupation },
                        { icon: <GraduationCap size={16} />, label: 'Education',   value: education },
                      ].map((row, i) => (
                        <div key={i} className="flex items-center gap-3 group/meta">
                          <span className="text-mat-rose-gold/80 group-hover/meta:text-white transition-colors">{row.icon}</span>
                          <div className="flex flex-col">
                            <span className="mat-text-editorial-caps text-[7px] text-white/50 tracking-wider uppercase mb-0.5">{row.label}</span>
                            <span className="text-xs md:text-sm text-white/90 font-medium drop-shadow-sm">{row.value}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Edit CTA */}
                    <button
                      onClick={() => setIsEditing(true)}
                      className={cn(
                        "flex items-center justify-center gap-2 px-6 py-3.5 md:py-4 rounded-xl text-[9px] md:text-[10px] mat-text-editorial-caps font-semibold transition-all duration-400 shrink-0",
                        "bg-white text-mat-noir border border-transparent shadow-[0_8px_30px_rgba(0,0,0,0.2)]",
                        "hover:bg-mat-rose-gold hover:text-white hover:border-mat-rose-gold hover:shadow-[0_10px_30px_rgba(183,110,121,0.5)]"
                      )}
                    >
                      <Edit3 size={14} />
                      Curate Dossier
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* ── FOOTNOTE STATS BLOCK (Bottom 40%) ───────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                "w-full shrink-0 flex-1 md:flex-[0.6] min-h-[220px] rounded-[2.5rem] p-6 lg:p-8 flex flex-col justify-center relative overflow-hidden", 
                SkeuSurface
              )}
            >
              {/* Subtle accent light */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/40 blur-3xl rounded-full pointer-events-none -translate-y-1/2 translate-x-1/4" />
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-x-6 gap-y-6 lg:gap-x-10 lg:gap-y-8 w-full relative z-10">
                {stats.map((stat, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + idx * 0.05, duration: 0.4 }}
                    className="relative flex items-center justify-between group/stat py-3 border-b border-mat-noir/[0.05] hover:border-mat-rose-gold/40 transition-colors"
                  >
                    <div className="flex flex-col min-w-0 pr-4">
                      <h3 className="mat-text-editorial-caps text-[7px] md:text-[8px] text-mat-noir/40 tracking-[0.25em] lg:tracking-[0.3em] uppercase mb-1.5">{stat.label}</h3>
                      <p className="mat-text-fluid-huge font-light text-mat-noir leading-none">{stat.value}</p>
                    </div>
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-[inset_0_1px_0_rgba(255,255,255,1),0_2px_8px_rgba(0,0,0,0.05)] text-mat-rose-gold transition-all duration-500",
                      "bg-gradient-to-b from-white to-[#ece8e0] border border-[rgba(0,0,0,0.03)]",
                      "group-hover/stat:from-mat-rose-gold group-hover/stat:to-mat-rose-gold/90 group-hover/stat:text-white"
                    )}>
                      {React.cloneElement(stat.icon as React.ReactElement, { size: 16 })}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

          </div>
        </TooltipProvider>
      </main>

      <AnimatePresence>
        {showFAQ && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-0 backdrop-blur-3xl bg-white"
            onClick={() => setShowFAQ(false)}
          >
            <div 
              className="w-full h-full flex flex-col relative bg-white overflow-hidden" 
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              <button 
                onClick={() => setShowFAQ(false)} 
                className="absolute top-12 right-12 w-16 h-16 bg-black text-white hover:bg-mat-rose-gold transition-all z-20 flex items-center justify-center"
              >
                <X size={32} strokeWidth={1} />
              </button>
              
              <div className="flex-1 w-full overflow-y-auto custom-scrollbar px-8 md:px-24 py-32">
                <div className="max-w-6xl mx-auto space-y-24">
                  <div className="flex flex-col items-start space-y-8">
                    <span className="text-[12px] uppercase font-black tracking-[0.6em] opacity-20">Sanctuary Intelligence Protocol</span>
                    <h2 className="font-serif italic text-7xl md:text-9xl tracking-tighter leading-[0.85] opacity-90 max-w-4xl">
                      The Gnosis of <br /><span className="opacity-30">Selection.</span>
                    </h2>
                  </div>
                  <div className="w-full h-px bg-black/10" />
                  <div className="pointer-events-auto"><FAQ /></div>
                </div>
              </div>
            </div>
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
