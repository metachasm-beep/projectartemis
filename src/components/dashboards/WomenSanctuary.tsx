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
  HelpCircle,
  X
} from 'lucide-react';

import { Badge } from "@/components/ui/badge";
import { LiquidMesh } from '@/components/dashboard/promax/LiquidMesh';
import { GlassCard } from '@/components/dashboard/promax/GlassCard';
import { Dock } from '@/components/dashboard/promax/Dock';
import { cn } from '@/lib/utils';
import { FAQ } from '@/components/FAQ';
import { AadhaarVerification } from '@/components/AadhaarVerification';
import { useAuth } from '@/hooks/useAuth';
import { PostProcessOverlay } from '@/components/dashboard/promax/PostProcessOverlay';
import { Aurora } from '@/components/dashboard/promax/Aurora';
import { OracleWidget, InfluenceWidget } from '@/components/dashboard/promax/widgets/SovereignWidgets';
import { ThreeAnchor } from '@/components/dashboard/promax/ThreeAnchor';
import { TrumpCard } from '@/components/discovery/TrumpCard';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { SkillOrchestrator } from '@/services/SkillOrchestrator';

/**
 * 🎨 Physical Texture SVG Filter for Skeuomorphism
 */
const TextureOverlay = () => (
  <svg style={{ display: 'none' }}>
    <filter id="grainy-texture">
      <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
      <feColorMatrix type="saturate" values="0" />
      <feComponentTransfer>
        <feFuncA type="linear" slope="0.05" />
      </feComponentTransfer>
      <feComposite operator="in" in2="SourceGraphic" />
    </filter>
  </svg>
);

interface WomenSanctuaryProps {
  profile: any;
  metrics: { matches: number; sessionSeconds: number };
  setIsEditing: (val: boolean) => void;
  onBeginDiscovery?: () => void;
}

/**
 * 🏛️ Women's Sanctuary 2.0: Sovereign Control Center (Pro Max)
 * Redesigned for absolute zero-scroll immersive PC experience.
 * Replaces legacy WomenSanctuary with a high-density bento architecture.
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

  const handleLogout = () => {
     window.location.href = '/signin';
  };

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden bg-white selection:bg-[#D81E05] selection:text-white">
      {/* 🏛️ Swiss Monolith Foundation (Stark Grid) */}
      <div className="absolute inset-0 z-0 bg-white">
        {/* Subtle grid lines for architectural reference */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:40px_40px]" />
      </div>

      {/* 🎞️ Global Post-Processing */}
      <PostProcessOverlay />

      {/* 🏰 Main Interface Layer */}
      <main className="relative z-10 w-full h-full pt-20 pb-10 px-8 flex flex-col gap-6">
        {/* 🎭 Header Zone (Compact Text Only) */}
        <header className="absolute top-12 left-12 z-20 flex items-center gap-8">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-1 bg-[#D81E05]" />
                <span className="text-[#0A0A0A]/40 text-[10px] uppercase tracking-[0.4em] font-bold">Protocol Index 01</span>
              </div>
               <h1 className="text-[#0A0A0A] font-sans font-bold text-7xl tracking-[-0.05em] leading-[0.9] mt-2 uppercase" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                 {profile?.full_name?.split(' ')[0] || 'User'} <span className="text-[#D81E05]">.Live</span>
              </h1>
            </div>
        </header>

        {/* 🕸️ Dashboard Grid: Symmetrical 3-Column Layout (4-4-4) */}
        <TooltipProvider delayDuration={0}>
          <div className="flex-1 grid grid-cols-12 grid-rows-12 gap-4 pb-12 overflow-hidden h-full">
            
            {/* Left Column (Authority & Insights) */}
            <div className="col-span-12 lg:col-span-4 row-span-12 grid grid-rows-12 gap-8 h-full">
              <GlassCard className="row-span-6 bg-white border-2 border-[#0A0A0A] shadow-none rounded-none" delay={0.1}>
                {/* 📐 Clinical Layout */}
                <div className="absolute top-0 right-0 p-4 border-l-2 border-b-2 border-[#0A0A0A] text-[10px] font-bold font-mono">INSIGHT_A.1</div>
                <OracleWidget metrics={metrics} onBeginDiscovery={onBeginDiscovery} />
              </GlassCard>
              <GlassCard className="row-span-6 bg-[#0A0A0A] border-2 border-[#0A0A0A] shadow-none rounded-none" delay={0.4}>
                 <div className="absolute top-0 right-0 p-4 border-l-2 border-b-2 border-white/20 text-white/40 text-[10px] font-bold font-mono">STATUS_B.2</div>
                 <InfluenceWidget metrics={metrics} />
              </GlassCard>
            </div>

            {/* Center Column (Hero Anchor - Full Color) */}
            <div className="col-span-12 lg:col-span-4 row-span-12 h-full overflow-hidden border-2 border-[#0A0A0A] bg-white shadow-none relative">
              <TrumpCard 
                 isDashboard
                 profile={{
                   id: profile?.user_id || '0',
                   name: profile?.full_name || 'Anonymous',
                   age: profile?.age || 24,
                   city: profile?.city || 'Delhi',
                   img: profile?.photos?.[0] || '',
                   status: profile?.tier || 'Aspirant',
                   bio: profile?.bio || 'No bio available.',
                   height_str: profile?.height || '5\'6"',
                   vocation: profile?.vocation || 'Member',
                   tier: profile?.tier || 'Aspirant',
                   is_verified: profile?.is_verified,
                   absolute_rank: (profile as any)?.absolute_rank,
                   rank_tier: profile?.tier
                 }} 
              />
              <div className="absolute bottom-0 left-0 w-full h-8 bg-[#D81E05] z-10 flex items-center justify-center">
                 <span className="text-white text-[9px] font-bold tracking-[0.5em] uppercase">Human_Focus.Live</span>
              </div>
            </div>

            {/* Right Column (Design & Security) */}
            <div className="col-span-12 lg:col-span-4 row-span-12 grid grid-rows-12 gap-8 h-full">
              <GlassCard className="row-span-8 bg-[#F2F2F2] border-2 border-[#0A0A0A] shadow-none rounded-none" delay={0.2}>
                 <ThreeAnchor quality="high" />
                 <div className="h-full flex flex-col justify-between relative z-10">
                    <div className="space-y-0.5">
                       <p className="text-[10px] text-[#0A0A0A]/40 font-bold uppercase tracking-[0.5em] mb-4">Metric.System.03</p>
                        <h2 className="text-7xl font-sans font-bold text-[#0A0A0A] tracking-[-0.05em] leading-[0.85] uppercase" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                          Vitality <br/><span className="text-[#D81E05]">Index.</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {(() => {
                        const stats = [
                          { label: 'Views', val: `${arc.gazeDepth}`, icon: Eye, color: 'text-white', tip: 'Total visual impressions' },
                          { label: 'Rating', val: arc.assetPurity.toString(), icon: Star, color: 'text-mat-gold', tip: 'Asset purity index' },
                          { label: 'Quality', val: arc.lightingStability, icon: Zap, color: 'text-mat-rose', tip: 'Lighting & consistency stability' },
                          { label: 'System', val: 'STABLE', icon: Activity, color: 'text-mat-gold', tip: 'Real-time rendering status' },
                        ];
                        
                        return stats.map((stat, i) => (
                           <Tooltip key={i}>
                             <TooltipTrigger asChild>
                               <motion.div 
                                 whileHover={{ backgroundColor: '#D81E05', color: 'white' }}
                                 className="space-y-4 p-6 bg-white border border-[#0A0A0A] shadow-none cursor-help transition-all group"
                               >
                                  <div className="w-10 h-1 border-b-2 border-current" />
                                  <div className="space-y-0.5">
                                     <p className="text-4xl font-sans font-bold tracking-tight" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>{stat.val}</p>
                                     <p className="font-sans text-[10px] opacity-40 uppercase tracking-[0.2em] font-bold group-hover:opacity-100">{stat.label}</p>
                                  </div>
                                </motion.div>
                             </TooltipTrigger>
                             <TooltipContent side="top">
                               <p className="text-[11px] uppercase tracking-widest font-bold">{stat.tip}</p>
                             </TooltipContent>
                           </Tooltip>
                        ));
                      })()}
                    </div>
                  </div>
              </GlassCard>

              <GlassCard className="row-span-4 bg-[#D81E05] border-2 border-[#D81E05] shadow-none rounded-none text-white" delay={0.5}>
                <div className="h-full flex flex-col justify-center px-8 space-y-6">
                  <div className="flex items-center gap-6">
                    <div className="p-3 bg-white/20 border border-white/30">
                      <ShieldCheck size={24} className="text-white" strokeWidth={2} />
                    </div>
                    <div>
                       <p className="font-sans text-[10px] opacity-60 uppercase tracking-[0.4em] font-bold">Safety.Protocol</p>
                       <p className="text-xl font-sans font-bold tracking-tight uppercase" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Absolute Privacy</p>
                    </div>
                  </div>
                  
                  {!profile?.is_verified && (
                    <button 
                      onClick={() => setShowVerification(true)}
                      className="w-full py-6 bg-white text-[#D81E05] text-[12px] font-bold uppercase tracking-[0.3em] hover:bg-[#0A0A0A] hover:text-white transition-all active:scale-[0.98]"
                    >
                      Authenticate
                    </button>
                  )}
                </div>
              </GlassCard>
            </div>
          </div>
        </TooltipProvider>

        {/* 🚀 Floating Command Dock (Zero-Scroll Navigation) */}
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50">
          <Dock 
            onShowFAQ={() => setShowFAQ(true)}
            onShowVerification={!profile?.is_verified ? () => setShowVerification(true) : undefined}
          />
        </div>
      </main>

      {/* 🧩 FAQ Premium Modal (Liquid Glass) */}
      <AnimatePresence>
        {showFAQ && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 lg:p-12 backdrop-blur-3xl bg-mat-slate/60"
            onClick={() => setShowFAQ(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 30, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-4xl bg-mat-ivory border border-mat-gold/20 rounded-[4rem] p-10 lg:p-20 shadow-2xl max-h-[75vh] overflow-y-auto relative glass-surface"
            >
               <button 
                 onClick={() => setShowFAQ(false)}
                 className="absolute top-10 right-10 w-12 h-12 bg-mat-gold/10 rounded-full flex items-center justify-center text-mat-gold hover:bg-mat-gold/20 transition-all z-20"
               >
                 <X size={24} />
               </button>
               
               <div className="space-y-12">
                  <div className="space-y-4">
                    <h2 className="text-5xl font-display text-mat-slate leading-tight uppercase font-black tracking-tighter">
                      Help <span className="text-mat-gold">& Support</span>
                    </h2>
                    <p className="text-mat-slate opacity-40 uppercase tracking-widest text-xs">Frequently Asked Questions</p>
                  </div>
                  
                  <div className="pointer-events-auto">
                    <FAQ />
                  </div>
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🧩 Verification Modal */}
      <AnimatePresence>
        {showVerification && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-mat-slate/80 backdrop-blur-3xl" onClick={() => setShowVerification(false)}>
             <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={e => e.stopPropagation()}
                className="relative w-full max-w-xl rounded-[3.5rem] bg-mat-ivory border border-mat-gold/20 p-8 shadow-2xl"
             >
                <button onClick={() => setShowVerification(false)} className="absolute top-8 right-8 text-mat-slate/40 hover:text-mat-slate"><X size={24} /></button>
                <AadhaarVerification 
                  userId={profile.user_id} 
                  onVerified={async () => {
                     await refreshProfile();
                     setShowVerification(false);
                  }} 
                />
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default WomenSanctuary;
