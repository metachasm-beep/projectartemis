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
import { OracleWidget, InfluenceWidget } from '@/components/dashboard/promax/widgets/SovereignWidgets';
import { ThreeAnchor } from '@/components/dashboard/promax/ThreeAnchor';
import { TrumpCard } from '@/components/discovery/TrumpCard';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { SkillOrchestrator } from '@/services/SkillOrchestrator';

interface WomenSanctuaryProps {
  profile: any;
  metrics: { matches: number; sessionSeconds: number };
  setIsEditing: (val: boolean) => void;
  onBeginDiscovery?: () => void;
}

/**
 * 🏛️ Women's Sanctuary 3.0: High-Fidelity Refractive Dashboard
 * Redesigned for the 'Liquid Glassmorphism' movement.
 * Features suspended animation, refractive glass layers, and editorial typography.
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

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden bg-mat-ivory selection:bg-mat-accent-blue selection:text-white">
      {/* 🌊 Liquid Foundation */}
      <LiquidMesh />

      {/* 🎞️ Global Post-Processing */}
      <PostProcessOverlay />

      {/* 🏰 Main Sanctuary Layer */}
      <main className="relative z-10 w-full h-full pt-20 pb-10 px-8 flex flex-col gap-6">
        {/* 🎭 Editorial Header (Floating in flux) */}
        <header className="absolute top-12 left-12 z-20">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="space-y-1"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-[1px] bg-mat-black/10" />
                <span className="mat-text-label-pro text-mat-black/40">Protocol Index 01</span>
              </div>
              <h1 className="mat-text-editorial font-light text-8xl tracking-tighter text-mat-black">
                {profile?.full_name?.split(' ')[0] || 'User'}<span className="text-mat-accent-blue italic font-medium">.Live</span>
              </h1>
            </motion.div>
        </header>

        {/* 🕸️ Sanctuary Grid: Refractive Bento Layout */}
        <TooltipProvider delayDuration={0}>
          <div className="flex-1 grid grid-cols-12 grid-rows-12 gap-8 pb-12 overflow-hidden h-full mt-16 px-4">
            
            {/* Left Column (Authority & Sovereignty) */}
            <div className="col-span-12 lg:col-span-3 row-span-12 grid grid-rows-12 gap-8 h-full">
              <GlassCard className="row-span-7" delay={0.1}>
                <div className="absolute top-8 left-8">
                   <p className="mat-text-label-pro text-[9px] mb-2opacity-40">System_Oracle</p>
                   <div className="w-8 h-[1px] bg-mat-black/20" />
                </div>
                <div className="h-full pt-12">
                   <OracleWidget metrics={metrics} onBeginDiscovery={onBeginDiscovery} />
                </div>
              </GlassCard>
              <GlassCard className="row-span-5 bg-mat-accent-blue/5 border-mat-accent-blue/20" delay={0.4}>
                 <div className="absolute top-0 right-0 p-6 text-mat-accent-blue/30 text-[9px] font-black font-body uppercase tracking-widest">STATUS_B.2</div>
                 <InfluenceWidget metrics={metrics} />
              </GlassCard>
            </div>

            {/* Center Column (Human Focus - The Focal Point) */}
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="col-span-12 lg:col-span-5 row-span-12 h-full relative"
            >
              <div className="absolute inset-0 rounded-[3.5rem] bg-white/40 backdrop-blur-3xl border border-white/50 shadow-2xl overflow-hidden">
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
                <div className="absolute bottom-0 left-0 w-full h-12 bg-white/20 backdrop-blur-md z-10 flex items-center justify-center border-t border-white/30">
                   <span className="mat-text-label-pro text-mat-black/60 text-[9px]">Human_Focus.Refractive</span>
                </div>
              </div>
            </motion.div>

            {/* Right Column (Metrics & Security) */}
            <div className="col-span-12 lg:col-span-4 row-span-12 grid grid-rows-12 gap-8 h-full">
              <GlassCard className="row-span-8" delay={0.2}>
                 <div className="absolute top-0 right-0 p-8 z-0 opacity-10 blur-sm scale-125">
                    <ThreeAnchor quality="high" />
                 </div>
                 <div className="h-full flex flex-col justify-between relative z-10">
                    <div className="space-y-4">
                        <p className="mat-text-label-pro text-mat-accent-blue">Registry Metadata</p>
                        <h2 className="mat-text-editorial text-7xl font-light text-mat-black leading-[0.9] tracking-tighter">
                          Vitality <br/><span className="italic font-medium text-mat-accent-blue">Index.</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {(() => {
                        const arc = SkillOrchestrator.getArchitectVisuals();
                        const stats = [
                          { label: 'Gaze', val: `${arc.gazeDepth}`, icon: Eye, tip: 'Visual focus depth' },
                          { label: 'Asset', val: arc.assetPurity.toString(), icon: Star, tip: 'Purity score' },
                          { label: 'Flux', val: arc.lightingStability, icon: Zap, tip: 'System resonance' },
                          { label: 'State', val: 'STABLE', icon: Activity, tip: 'Refraction stability' },
                        ];
                        
                        return stats.map((stat, i) => (
                           <Tooltip key={i}>
                             <TooltipTrigger asChild>
                               <motion.div 
                                 whileHover={{ backgroundColor: 'rgba(77, 159, 255, 0.1)', scale: 1.02 }}
                                 className="space-y-4 p-6 bg-white/10 border border-white/20 rounded-3xl cursor-help transition-all group backdrop-blur-md"
                               >
                                  <div className="w-8 h-[1px] bg-mat-black/10 group-hover:bg-mat-accent-blue transition-colors" />
                                  <div className="space-y-0.5">
                                     <p className="mat-text-satoshi text-3xl font-medium tracking-tight text-mat-black">{stat.val}</p>
                                     <p className="mat-text-label-pro text-[8px] group-hover:text-mat-accent-blue transition-colors">{stat.label}</p>
                                  </div>
                                </motion.div>
                             </TooltipTrigger>
                             <TooltipContent side="top">
                               <p className="mat-text-label-pro text-[10px] lowercase">{stat.tip}</p>
                             </TooltipContent>
                           </Tooltip>
                        ));
                      })()}
                    </div>
                  </div>
              </GlassCard>

              <GlassCard className="row-span-4 bg-mat-accent-blue border-transparent text-white" delay={0.5}>
                <div className="h-full flex flex-col justify-center px-8 space-y-6">
                  <div className="flex items-center gap-6">
                    <div className="p-4 bg-white/20 rounded-full backdrop-blur-md">
                      <ShieldCheck size={28} className="text-white" strokeWidth={1} />
                    </div>
                    <div>
                       <p className="mat-text-label-pro text-white/60 text-[9px]">Refractive.Security</p>
                       <p className="mat-text-satoshi text-xl font-medium uppercase tracking-widest text-white leading-none">Identity Guard</p>
                    </div>
                  </div>
                  
                  {!profile?.is_verified && (
                    <button 
                      onClick={() => setShowVerification(true)}
                      className="w-full py-5 bg-white text-mat-accent-blue mat-text-label-pro text-[11px] rounded-2xl hover:bg-mat-black hover:text-white transition-all active:scale-[0.98] shadow-xl"
                    >
                      Authenticate Presence
                    </button>
                  )}
                </div>
              </GlassCard>
            </div>
          </div>
        </TooltipProvider>

        {/* 🚀 Prismatic Command Dock */}
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50">
          <Dock 
            onShowFAQ={() => setShowFAQ(true)}
            onShowVerification={!profile?.is_verified ? () => setShowVerification(true) : undefined}
          />
        </div>
      </main>

      {/* 🧩 FAQ Refractive Modal */}
      <AnimatePresence>
        {showFAQ && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 lg:p-12 backdrop-blur-3xl bg-mat-black/20"
            onClick={() => setShowFAQ(false)}
          >
            <GlassCard className="w-full max-w-4xl p-0 h-auto max-h-[85vh] overflow-hidden rounded-[4rem]" delay={0}>
               <button 
                 onClick={() => setShowFAQ(false)}
                 className="absolute top-10 right-10 w-12 h-12 bg-mat-black/5 rounded-full flex items-center justify-center text-mat-black/40 hover:text-mat-accent-blue transition-all z-20"
               >
                 <X size={24} />
               </button>
               
               <div className="p-10 lg:p-20 space-y-12 overflow-y-auto max-h-[80vh] custom-scrollbar">
                  <div className="space-y-4">
                    <h2 className="mat-text-editorial text-6xl text-mat-black leading-tight">
                      Sovereign <span className="italic font-medium text-mat-accent-blue">Knowledge.</span>
                    </h2>
                    <p className="mat-text-label-pro opacity-40">System Synchronization Protocol</p>
                  </div>
                  
                  <div className="pointer-events-auto">
                    <FAQ />
                  </div>
               </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🧩 Verification Refractive Modal */}
      <AnimatePresence>
        {showVerification && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-mat-black/40 backdrop-blur-2xl" onClick={() => setShowVerification(false)}>
             <GlassCard className="w-full max-w-xl p-0 rounded-[3.5rem]" delay={0}>
                <button onClick={() => setShowVerification(false)} className="absolute top-8 right-8 text-mat-black/20 hover:text-mat-black z-20"><X size={24} /></button>
                <div className="p-10">
                  <AadhaarVerification 
                    userId={profile.user_id} 
                    onVerified={async () => {
                       await refreshProfile();
                       setShowVerification(false);
                    }} 
                  />
                </div>
             </GlassCard>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WomenSanctuary;
