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
    <div className="relative w-full h-[100dvh] overflow-hidden bg-[#f5f0ea] selection:bg-mat-rose-gold selection:text-white flex flex-col">
      <LiquidMesh />
      <PostProcessOverlay />

      <main className="relative z-10 w-full flex-1 flex flex-col px-6 py-8 lg:px-20 lg:py-12 min-h-0">
        
        {/* ══ SOVEREIGN HEADER ══════════════════════════════ */}
        <header className="flex justify-between items-start shrink-0 mb-8 lg:mb-12">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-4 h-[1px] bg-mat-rose-gold" />
              <span className="mat-text-editorial-caps text-[8px] text-mat-noir/40 tracking-[0.4em]">Sovereign Sanctuary</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold italic text-mat-noir leading-none tracking-tighter" style={{ fontFamily: 'var(--font-display)' }}>
              Existence<span className="text-mat-rose-gold">.</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
             <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowFAQ(true)}
                className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-mat-noir/60"
             >
                <HelpCircle size={16} />
             </motion.button>
             <button 
               onClick={() => setIsEditing(true)}
               className="px-6 py-2.5 rounded-full bg-mat-noir text-white mat-text-editorial-caps text-[8px] tracking-widest font-black shadow-xl hover:bg-mat-rose-gold transition-colors"
             >
               Curate Identity
             </button>
          </div>
        </header>

        {/* ══ THE AURA MATRIX (Zero-Scroll Centrality) ═══════════════ */}
        <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 min-h-0">
          
          {/* Left Stats Column (Desktop) */}
          <div className="hidden lg:grid grid-cols-1 gap-6 w-48">
             {[stats[0], stats[1], stats[2], stats[3]].map((stat, i) => (
                <GlassCard key={i} delay={0.1 * i} noPadding className="p-4 border-white/40">
                   <div className="flex flex-col gap-2">
                      <div className="text-mat-rose-gold">{React.cloneElement(stat.icon as React.ReactElement, { size: 14 })}</div>
                      <div className="space-y-0.5">
                         <p className="text-xl font-bold text-mat-noir italic leading-none">{stat.value}</p>
                         <p className="mat-text-editorial-caps text-[7px] text-mat-noir/40 tracking-widest uppercase font-bold">{stat.label}</p>
                      </div>
                   </div>
                </GlassCard>
             ))}
          </div>

          {/* Central Aura Orb: The Identity Focal Point */}
          <div className="relative shrink-0">
             <motion.div 
               initial={{ scale: 0.8, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
               className="relative w-48 h-48 lg:w-80 lg:h-80 rounded-full p-2 bg-gradient-to-tr from-mat-rose-gold/40 via-white/20 to-mat-gold/40 shadow-2xl"
             >
                <div className="w-full h-full rounded-full overflow-hidden border-2 border-white/60 relative">
                   <img 
                      src={profile?.photos?.[0] || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=800"} 
                      alt="Identity" 
                      className="w-full h-full object-cover"
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-mat-noir/40 to-transparent" />
                </div>
                {/* Holographic Halo */}
                <motion.div 
                   animate={{ rotate: 360 }}
                   transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                   className="absolute -inset-4 border border-dashed border-mat-gold/30 rounded-full pointer-events-none"
                />
                <motion.div 
                   animate={{ rotate: -360 }}
                   transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                   className="absolute -inset-8 border border-dotted border-mat-rose-gold/20 rounded-full pointer-events-none"
                />
             </motion.div>
             
             {/* Float Labels (Desktop) */}
             <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-center w-full">
                <h2 className="text-2xl lg:text-3xl font-bold italic text-mat-noir leading-none tracking-tighter" style={{ fontFamily: 'var(--font-display)' }}>
                   {profile?.full_name || 'Sovereign'}
                </h2>
                <p className="mat-text-editorial-caps text-[8px] text-mat-noir/40 tracking-[0.4em] uppercase mt-2">Elite Registry ID: {profile?.user_id?.slice(0,8) || 'SANCTUM'}</p>
             </div>
          </div>

          {/* Right Stats Column (Desktop) */}
          <div className="hidden lg:grid grid-cols-1 gap-6 w-48">
             {[stats[4], stats[5], stats[6], stats[7]].map((stat, i) => (
                <GlassCard key={i} delay={0.4 + 0.1 * i} noPadding className="p-4 border-white/40">
                   <div className="flex flex-col gap-2">
                      <div className="text-mat-gold">{React.cloneElement(stat.icon as React.ReactElement, { size: 14 })}</div>
                      <div className="space-y-0.5">
                         <p className="text-xl font-bold text-mat-noir italic leading-none">{stat.value}</p>
                         <p className="mat-text-editorial-caps text-[7px] text-mat-noir/40 tracking-widest uppercase font-bold">{stat.label}</p>
                      </div>
                   </div>
                </GlassCard>
             ))}
          </div>

          {/* Mobile Grid (Alternative view for smaller screens) */}
          <div className="grid lg:hidden grid-cols-2 gap-4 w-full">
             {stats.map((stat, i) => (
                <GlassCard key={i} delay={0.1 * i} noPadding className="p-4 border-white/40">
                   <div className="flex items-center gap-3">
                      <div className="text-mat-rose-gold shrink-0">{React.cloneElement(stat.icon as React.ReactElement, { size: 12 })}</div>
                      <div className="space-y-0.5 overflow-hidden">
                         <p className="text-lg font-bold text-mat-noir italic leading-none truncate">{stat.value}</p>
                         <p className="mat-text-editorial-caps text-[6px] text-mat-noir/40 tracking-widest uppercase font-bold truncate">{stat.label}</p>
                      </div>
                   </div>
                </GlassCard>
             ))}
          </div>

        </div>

        {/* ══ FOOTER COMMANDS ═══════════════════════════════ */}
        <footer className="shrink-0 mt-8 flex flex-col items-center gap-6">
           <div className="flex items-center gap-8">
              {!isVerified && (
                 <motion.button
                   whileHover={{ scale: 1.02 }}
                   whileTap={{ scale: 0.98 }}
                   onClick={() => setShowVerification(true)}
                   className="flex items-center gap-2 px-6 py-3 bg-amber-500/10 border border-amber-500/20 rounded-full"
                 >
                    <AlertCircle size={14} className="text-amber-500" />
                    <span className="mat-text-editorial-caps text-[8px] text-amber-600 font-black tracking-widest">Verify Identity</span>
                 </motion.button>
              )}
           </div>
           
           <div className="flex items-center gap-4 opacity-40 mat-text-editorial-caps text-[7px] tracking-[0.3em] font-black uppercase text-mat-noir">
              <span>Sanctuary Registry</span>
              <span className="w-1 h-1 rounded-full bg-mat-noir/20" />
              <span>Alpha Protocol 5.0</span>
              <span className="w-1 h-1 rounded-full bg-mat-noir/20" />
              <span>{memberSince}</span>
           </div>
        </footer>

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
