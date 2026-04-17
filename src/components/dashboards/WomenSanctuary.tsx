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
  Clock,
  MousePointer2,
  Flame
} from 'lucide-react';

import { LiquidMesh } from '@/components/dashboard/promax/LiquidMesh';
import { GlassCard } from '@/components/dashboard/promax/GlassCard';
import { Dock } from '@/components/dashboard/promax/Dock';
import { cn } from '@/lib/utils';
import { FAQ } from '@/components/FAQ';
import { VerificationPaymentModal } from '@/components/verification/VerificationPaymentModal';
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
    /* --- Updated Stats Matrix (Real Data Only) --- */
    { label: 'Profile Views',   value: String(metrics.profileViews || 0),          icon: <Eye size={13} />,          accent: 'from-rose-100 to-rose-50', description: "Total number of seekers who have engaged with your dossier." },
    { label: 'Trust Score',     value: `${completeness}%`,                          icon: <ShieldCheck size={13} />,  accent: 'from-amber-100 to-amber-50', description: "Profile integrity score based on dossier completeness." },
    { label: 'Matches',         value: String(metrics.matches || 0),                icon: <Heart size={13} />,        accent: 'from-pink-100 to-pink-50', description: "Successful protocol synchronizations with compatible aspirants." },
    { label: 'Selections',      value: String(metrics.profilesEngaged || 0),        icon: <LayoutGrid size={13} />,   accent: 'from-violet-100 to-violet-50', description: "Total number of aspirants you have evaluated." },
    { label: 'Saves',           value: String(metrics.saves || 0),                  icon: <Bookmark size={13} />,     accent: 'from-sky-100 to-sky-50', description: "Aspirants flagged for long-term sanctuary tracking." },
    { label: 'Time Online',     value: formatTime(metrics.sessionSeconds || 0),     icon: <Activity size={13} />,     accent: 'from-emerald-100 to-emerald-50', description: "Total duration of active presence within the protocol." },
    { label: 'Sanctum Rank',    value: metrics.safetyLevel ?? 'Standard',              icon: <Star size={13} />,         accent: 'from-teal-100 to-teal-50', description: "Your current authority level within the sanctuary registry." },
    { label: 'Response Pulse',  value: metrics.responseRate || 'High',             icon: <Zap size={13} />,          accent: 'from-yellow-100 to-yellow-50', description: "Real-time communication reliability index." },
  ];

  /* ─── Skeuomorphic raised surface class ─── */
  const SkeuSurface = "bg-gradient-to-b from-[#fdfcfa] to-[#ede8e0] shadow-[inset_0_1px_0_rgba(255,255,255,0.95),inset_0_-1px_0_rgba(0,0,0,0.05),0_4px_12px_rgba(0,0,0,0.08),0_1px_3px_rgba(0,0,0,0.05)] border border-[rgba(0,0,0,0.06)]";

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#f5f0ea] selection:bg-mat-rose-gold selection:text-white flex flex-col">
      <LiquidMesh />
      <PostProcessOverlay />

      <main className="relative z-10 w-full flex-1 flex flex-col px-6 pt-20 lg:px-14 lg:pt-4 min-h-0 gap-3">

        {/* ══ HEADER ══════════════════════════════════════ */}
        <header className="relative z-50 flex flex-row items-center justify-between shrink-0 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 14 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }} 
            className="space-y-0.5 hidden md:block"
          >
            <div className="flex items-center gap-3">
              <span className="w-7 h-[1px] bg-mat-rose-gold opacity-60" />
              <span className="mat-text-editorial-caps text-[7px] text-mat-noir/40 tracking-[0.25em]">Sanctuary Alpha</span>
            </div>
            <h1 className="mat-text-editorial-huge text-4xl lg:text-5xl text-mat-noir leading-none tracking-tight">
              Sovereign <span className="text-mat-rose-gold italic font-medium">Existence.</span>
            </h1>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 14 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.7, delay: 0.12, ease: [0.16, 1, 0.3, 1] }} 
            className="flex items-center gap-4 lg:gap-6 shrink-0"
          >
            {/* Cascaded avatars — Clickable Hitbox Fix */}
            <div className="hidden md:flex -space-x-2.5 items-center">
              {["1494790108377-be9c29b29330","1534528741775-53994a69daeb","1531746020798-e6953c6e8e04"].map((id, i) => (
                <motion.div 
                  key={i} 
                  whileHover={{ y: -3, scale: 1.1, zIndex: 20 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-8 h-8 rounded-full border-2 border-[#f5f0ea] overflow-hidden shadow-md cursor-pointer relative transition-zIndex duration-200"
                >
                  <img src={`https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=80&w=80`} alt="Member" className="w-full h-full object-cover" />
                </motion.div>
              ))}
              <div className="w-8 h-8 rounded-full border-2 border-[#f5f0ea] bg-[#e8e2d8] flex items-center justify-center text-[7px] mat-text-editorial-caps text-mat-noir/50 shadow-sm z-0 ring-1 ring-black/5">+1.2k</div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-3">
              <motion.button 
                whileHover={{ y: -2, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowFAQ(true)} 
                className="w-9 h-9 rounded-full bg-white/60 backdrop-blur-xl border border-white/80 shadow-[0_4px_12px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,1)] flex items-center justify-center text-mat-noir/40 hover:text-mat-rose-gold hover:bg-white transition-all duration-300"
              >
                <HelpCircle size={14} />
              </motion.button>
            </div>

            <motion.button
              whileHover={{ y: -1, shadow: "0 8px 25px rgba(0,0,0,0.5)" }}
              whileTap={{ scale: 0.98 }}
              onClick={!isVerified ? () => setShowVerification(true) : undefined}
              style={{ minWidth: 200 }}
              className={cn(
                "flex items-center gap-3 px-5 py-2.5 rounded-full transition-all duration-500",
                "bg-gradient-to-b from-[#1c1c1c] to-[#0a0a0a]",
                "shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_5px_15px_rgba(0,0,0,0.4)]",
                "border border-[rgba(255,255,255,0.08)]",
                !isVerified && "cursor-pointer",
                isVerified && "cursor-default"
              )}
            >
              <div className={cn("w-7 h-7 rounded-full flex items-center justify-center shrink-0 shadow-inner", isVerified ? "bg-mat-rose-gold/20 text-mat-rose-gold" : "bg-amber-500/20 text-amber-400")}>
                {isVerified ? <CheckCircle2 size={13} /> : <AlertCircle size={13} />}
              </div>
              <div className="flex flex-col items-start min-w-0">
                <span className="mat-text-editorial-caps text-[6px] text-mat-rose-gold/80 tracking-[0.4em] whitespace-nowrap uppercase font-black">Identity Protocol</span>
                <span className={cn("text-[11px] font-medium leading-tight truncate tracking-tight", isVerified ? "text-white/80" : "text-amber-400/90")}>
                  {isVerified ? "Sovereign Verified" : "Authenticate Now"}
                </span>
              </div>
              <div className={cn("ml-auto shrink-0 w-2 h-2 rounded-full", isVerified ? "bg-mat-rose-gold shadow-[0_0_10px_rgba(183,110,121,0.6)]" : "bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.6)] animate-pulse")} />
            </motion.button>
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
              <div className="relative z-10 p-5 md:p-14 w-full h-full flex flex-col justify-between text-white max-w-[95%] md:max-w-4xl">
                
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
                <div className="flex flex-col gap-4 md:gap-10">
                  <p className="text-white/90 font-serif italic font-light text-[12px] md:text-base lg:text-lg max-w-2xl leading-relaxed border-l-[2px] md:border-l-[3px] border-mat-rose-gold pl-4 md:pl-5 drop-shadow-md line-clamp-2 md:line-clamp-none">
                    "{bio}"
                  </p>
                  
                  <div className="flex flex-wrap items-center justify-between gap-6">
                    {/* Meta Data Row */}
                    <div className="flex flex-wrap items-center gap-4 md:gap-12">
                      {[
                        { icon: <MapPin size={14} />,        label: 'Location',    value: profile?.city || 'Delhi' },
                        { icon: <Briefcase size={14} />,     label: 'Profession',  value: occupation },
                        { icon: <GraduationCap size={14} />, label: 'Education',   value: education },
                      ].map((row, i) => (
                        <div key={i} className={cn("items-center gap-2 group/meta", i > 0 ? "hidden md:flex" : "flex")}>
                          <span className="text-mat-rose-gold/80 group-hover/meta:text-white transition-colors">{row.icon}</span>
                          <div className="flex flex-col">
                            <span className="mat-text-editorial-caps text-[6px] text-white/50 tracking-wider uppercase mb-0.5">{row.label}</span>
                            <span className="text-[10px] md:text-sm text-white/90 font-medium drop-shadow-sm">{row.value}</span>
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

            {/* ── FOOTNOTE STATS BLOCK: APPLE CINEMATIC BENTO ───────────── */}
            <div className="w-full shrink-0 flex-1 md:flex-[0.6] min-h-[220px] grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              
              {/* 🏆 Sanctum Rank: Hero Card */}
              <GlassCard 
                className="col-span-2 row-span-1 relative overflow-hidden group border-mat-gold/20" 
                delay={0.1}
                noPadding
              >
                <div className="absolute inset-0 z-0 opacity-10 group-hover:opacity-20 transition-opacity">
                  <div className="absolute inset-0 bg-gradient-to-br from-mat-gold/40 via-transparent to-mat-wine/40" />
                </div>
                <div className="relative z-10 h-full p-6 flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="mat-text-editorial-caps text-[7px] text-mat-gold tracking-[0.4em] uppercase font-black">Sanctum Status</p>
                    <h3 className="text-4xl font-bold italic text-mat-noir leading-none tracking-tighter" style={{ fontFamily: 'var(--font-display)' }}>
                      {metrics.safetyLevel ?? 'Standard'}
                    </h3>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-mat-gold/10 border border-mat-gold/20 flex items-center justify-center text-mat-gold">
                    <Star size={20} fill="currentColor" strokeWidth={1} />
                  </div>
                </div>
              </GlassCard>

              {/* 🛡️ Trust Score: High Impact Card */}
              <GlassCard 
                className="col-span-1 row-span-1 relative overflow-hidden" 
                delay={0.2}
                noPadding
              >
                <div className="h-full p-6 flex flex-col justify-between items-start">
                   <ShieldCheck size={16} className="text-mat-gold" />
                   <div className="space-y-0.5">
                      <p className="text-3xl font-bold text-mat-noir italic leading-none">{completeness}%</p>
                      <p className="mat-text-editorial-caps text-[7px] text-mat-noir/40 tracking-widest uppercase font-bold">Trust Score</p>
                   </div>
                </div>
              </GlassCard>

              {/* ⚡ Response Pulse */}
              <GlassCard className="col-span-1 row-span-1" delay={0.3} noPadding>
                <div className="h-full p-6 flex flex-col justify-between items-start">
                   <Flame size={16} className="text-mat-rose-gold animate-pulse" />
                   <div className="space-y-0.5">
                      <p className="text-2xl font-bold text-mat-noir italic leading-none">{metrics.responseRate || 'High'}</p>
                      <p className="mat-text-editorial-caps text-[7px] text-mat-noir/40 tracking-widest uppercase font-bold">Pulse</p>
                   </div>
                </div>
              </GlassCard>

              {/* 👁️ Views */}
              <GlassCard className="col-span-1 row-span-1" delay={0.4} noPadding>
                <div className="h-full p-6 flex flex-col justify-between items-start">
                  <Eye size={16} className="text-mat-noir/20" />
                  <div className="space-y-0.5">
                    <p className="text-3xl font-bold text-mat-noir italic leading-none">{metrics.profileViews || 0}</p>
                    <p className="mat-text-editorial-caps text-[7px] text-mat-noir/40 tracking-widest uppercase font-bold">Views</p>
                  </div>
                </div>
              </GlassCard>

              {/* ❤️ Matches */}
              <GlassCard className="col-span-1 row-span-1" delay={0.5} noPadding>
                <div className="h-full p-6 flex flex-col justify-between items-start">
                  <Heart size={16} className="text-mat-rose-gold" />
                  <div className="space-y-0.5">
                    <p className="text-3xl font-bold text-mat-noir italic leading-none">{metrics.matches || 0}</p>
                    <p className="mat-text-editorial-caps text-[7px] text-mat-noir/40 tracking-widest uppercase font-bold">Matches</p>
                  </div>
                </div>
              </GlassCard>

              {/* 🖱️ Selections */}
              <GlassCard className="col-span-1 row-span-1" delay={0.6} noPadding>
                <div className="h-full p-6 flex flex-col justify-between items-start">
                  <MousePointer2 size={16} className="text-mat-gold" />
                  <div className="space-y-0.5">
                    <p className="text-3xl font-bold text-mat-noir italic leading-none">{metrics.profilesEngaged || 0}</p>
                    <p className="mat-text-editorial-caps text-[7px] text-mat-noir/40 tracking-widest uppercase font-bold">Selections</p>
                  </div>
                </div>
              </GlassCard>

              {/* 🕒 Time Online */}
              <GlassCard className="col-span-1 row-span-1" delay={0.7} noPadding>
                <div className="h-full p-6 flex flex-col justify-between items-start">
                   <Clock size={16} className="text-mat-noir/30" />
                   <div className="space-y-0.5">
                      <p className="text-xl font-bold text-mat-noir italic leading-none">{formatTime(metrics.sessionSeconds || 0)}</p>
                      <p className="mat-text-editorial-caps text-[7px] text-mat-noir/40 tracking-widest uppercase font-bold">Time Online</p>
                   </div>
                </div>
              </GlassCard>

            </div>

          </div>
        </TooltipProvider>
      </main>

      <AnimatePresence>
        {showFAQ && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-0 backdrop-blur-xl bg-white"
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
