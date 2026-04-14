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
    <div className="relative w-full h-[100dvh] overflow-hidden bg-mat-cream selection:bg-mat-gold selection:text-white">
      {/* 🌌 High-Performance Liquid Mesh Background */}
      <LiquidMesh />

      {/* 🎞️ Global Post-Processing */}
      <PostProcessOverlay />

      {/* 🏰 Main Interface Layer */}
      <main className="relative z-10 w-full h-full pt-20 pb-10 px-8 flex flex-col gap-6">
        {/* 🎭 Header Zone (Compact Text Only) */}
        <header className="absolute top-10 left-10 z-20 flex items-center gap-6">
           <div className="space-y-1">
              <Badge variant="outline" className="px-4 py-1.5 border-mat-rose text-mat-rose text-[12px] uppercase tracking-[0.4em] font-black rounded-lg bg-mat-rose/5 backdrop-blur-md">
                Status: Verified & Syncing
              </Badge>
               <h1 className="text-mat-slate font-display italic text-3xl tracking-tighter leading-none">
                Welcome back, {profile?.full_name?.split(' ')[0] || 'User'}.
              </h1>
           </div>
        </header>

        {/* 🕸️ Dashboard Grid: Symmetrical 3-Column Layout (4-4-4) */}
        <TooltipProvider delayDuration={0}>
          <div className="flex-1 grid grid-cols-12 grid-rows-12 gap-4 pb-12 overflow-hidden h-full">
            
            {/* Left Column (Authority & Insights) */}
            <div className="col-span-12 lg:col-span-4 row-span-12 grid grid-rows-12 gap-4 h-full">
              <GlassCard className="row-span-6" delay={0.1}>
                <OracleWidget metrics={metrics} onBeginDiscovery={onBeginDiscovery} />
              </GlassCard>
              <GlassCard className="row-span-6" delay={0.4}>
                 <InfluenceWidget metrics={metrics} />
              </GlassCard>
            </div>

            {/* Center Column (Hero Anchor) */}
            <div className="col-span-12 lg:col-span-4 row-span-12 h-full overflow-hidden rounded-[3.5rem] border border-mat-gold/10 glass-surface shadow-2xl relative">
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
            </div>

            {/* Right Column (Design & Security) */}
            <div className="col-span-12 lg:col-span-4 row-span-12 grid grid-rows-12 gap-4 h-full">
              <GlassCard className="row-span-8" delay={0.2}>
                 <ThreeAnchor quality="high" />
                 <div className="h-full flex flex-col justify-between relative z-10">
                    <div className="space-y-1">
                       <p className="font-mono text-[13px] text-mat-wine font-black uppercase tracking-[0.4em] mb-1">Visual Overview</p>
                        <h2 className="text-5xl font-display italic text-mat-slate tracking-tighter leading-none">
                          Design <span className="opacity-20 text-mat-gold">& Style.</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {(() => {
                        const arc = SkillOrchestrator.getArchitectVisuals();
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
                                 whileHover={{ y: -3 }}
                                 className="space-y-3 p-4 bg-mat-gold/5 rounded-2xl border border-mat-gold/10 backdrop-blur-md cursor-help"
                               >
                                  <div className="w-10 h-10 bg-mat-gold/10 rounded-xl flex items-center justify-center border border-mat-gold/10">
                                    <stat.icon size={18} className={cn("text-mat-gold", stat.color.includes('rose') && "text-mat-rose")} strokeWidth={1.5} />
                                  </div>
                                  <div className="space-y-0.5">
                                     <p className="text-xl font-bold text-mat-slate italic tracking-tighter font-mono">{stat.val}</p>
                                     <p className="font-mono text-[10px] text-mat-slate/80 uppercase tracking-[0.2em]">{stat.label}</p>
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

              <GlassCard className="row-span-4" delay={0.5}>
                <div className="h-full flex flex-col justify-center px-4 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-mat-gold/10 rounded-xl border border-mat-gold/20">
                      <ShieldCheck size={20} className="text-mat-gold" strokeWidth={1.5} />
                    </div>
                    <div>
                       <p className="font-mono text-[11px] text-mat-slate/80 uppercase tracking-[0.4em]">Account Verification</p>
                       <p className="text-sm font-bold italic text-mat-slate tracking-widest leading-none mt-1">Status: <span className="text-mat-gold uppercase font-black">Verified</span></p>
                    </div>
                  </div>
                  
                  {!profile?.is_verified && (
                    <button 
                      onClick={() => setShowVerification(true)}
                      className="w-full py-3 border-2 border-mat-gold text-mat-gold text-[11px] font-black uppercase tracking-[0.3em] rounded-full hover:bg-mat-gold/10 transition-all font-mono"
                    >
                      Verify Now
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
