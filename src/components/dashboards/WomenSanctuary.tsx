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
import { Aurora } from '@/components/dashboard/promax/Aurora';
import { GlassCard } from '@/components/dashboard/promax/GlassCard';
import { Dock } from '@/components/dashboard/promax/Dock';
import { FAQ } from '@/components/FAQ';
import { AadhaarVerification } from '@/components/AadhaarVerification';
import { useAuth } from '@/hooks/useAuth';
import { PostProcessOverlay } from '@/components/dashboard/promax/PostProcessOverlay';
import { OracleWidget, SanctuaryWidget, InfluenceWidget } from '@/components/dashboard/promax/widgets/SovereignWidgets';
import { ThreeAnchor } from '@/components/dashboard/promax/ThreeAnchor';
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
    <div className="relative w-full h-[100dvh] overflow-hidden bg-mat-obsidian selection:bg-mat-wine selection:text-white">
      {/* 🌌 High-Fidelity Aurora Background */}
      <div className="absolute inset-0 z-0 scale-105">
        <Aurora 
          colorStops={['#0a0a0a', '#722f37', '#0a0a0a']} 
          amplitude={1.4} 
          speed={0.4}
          quality="high"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-80" />
      </div>

      {/* 🎞️ Global Post-Processing */}
      <PostProcessOverlay />

      {/* 🏰 Main Interface Layer */}
      <main className="relative z-10 w-full h-full p-6 lg:p-10 flex flex-col gap-6">
        
        {/* 🕸️ The Sovereign Matrix: 12-Column Grid (Squeezed for Zero-Scroll) */}
        <div className="flex-1 grid grid-cols-12 grid-rows-12 gap-5 lg:gap-6 pb-20">
          
          {/* 👁️ Zone 1: The Oracle (Insight) */}
          <GlassCard className="col-span-12 lg:col-span-4 row-span-6" delay={0.1}>
            <OracleWidget metrics={metrics} onBeginDiscovery={onBeginDiscovery} />
          </GlassCard>

          {/* 🏛️ Zone 2: The Architect (Vision) */}
          <GlassCard className="col-span-12 lg:col-span-8 row-span-4" delay={0.2}>
             <ThreeAnchor quality="high" />
             <div className="h-full flex flex-col justify-between relative z-10">
                <div className="space-y-1">
                   <p className="font-mono text-[9px] text-mat-wine uppercase tracking-[0.6em] mb-1">Vision Matrix</p>
                   <h2 className="text-6xl font-bold italic text-mat-cream tracking-tighter leading-none" style={{ fontFamily: 'Playfair Display, serif' }}>
                     Aesthetic <span className="opacity-10 text-mat-gold">Sovereignty.</span>
                   </h2>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  {(() => {
                    const arc = SkillOrchestrator.getArchitectVisuals();
                    return [
                      { label: 'Gaze Depth', val: `${arc.gazeDepth}%`, icon: Eye, color: 'text-white' },
                      { label: 'Asset Purity', val: arc.assetPurity.toString(), icon: Star, color: 'text-mat-gold' },
                      { label: 'Shader Status', val: arc.lightingStability, icon: Zap, color: 'text-mat-rose' },
                      { label: 'Sync Status', val: 'LIVE', icon: Activity, color: 'text-mat-gold' },
                    ].map((stat, i) => (
                      <motion.div 
                        key={i} 
                        whileHover={{ y: -3 }}
                        className="space-y-3"
                      >
                         <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 backdrop-blur-md">
                           <stat.icon size={20} className={stat.color} strokeWidth={1.5} />
                         </div>
                         <div className="space-y-0.5">
                            <p className="text-2xl font-bold text-white italic tracking-tighter font-mono">{stat.val}</p>
                            <p className="font-mono text-[8px] opacity-30 uppercase tracking-[0.2em]">{stat.label}</p>
                         </div>
                      </motion.div>
                    ));
                  })()}
                </div>
              </div>
          </GlassCard>

          {/* 🌿 Zone 3: The Sanctuary (Identity Hub) */}
          <GlassCard className="col-span-12 lg:col-span-4 row-span-8" delay={0.3}>
            <SanctuaryWidget 
               metrics={metrics} 
               profile={profile}
               onShowFAQ={() => setShowFAQ(true)}
               onShowVerification={() => setShowVerification(true)}
            />
          </GlassCard>

          {/* 📜 Zone 4: The Influence (Authority) */}
          <GlassCard className="col-span-12 lg:col-span-4 row-span-6" delay={0.4}>
             <InfluenceWidget metrics={metrics} />
          </GlassCard>

          {/* 🛡️ Zone 5: Registry Integrity (Command) */}
          <GlassCard className="col-span-12 lg:col-span-4 row-span-2" delay={0.5}>
            <div className="h-full flex items-center justify-between px-2">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-mat-gold/10 rounded-xl border border-mat-gold/20">
                  <ShieldCheck size={20} className="text-mat-gold" strokeWidth={1.5} />
                </div>
                <div>
                   <p className="font-mono text-[8px] text-white/30 uppercase tracking-[0.5em]">Integrity Protocol</p>
                   <p className="text-xs font-bold italic text-white tracking-widest">Status: <span className="text-mat-gold">STABLE</span></p>
                </div>
              </div>
              
              {!profile?.is_verified && (
                <button 
                  onClick={() => setShowVerification(true)}
                  className="px-5 py-2.5 border border-mat-gold/20 text-mat-gold text-[8px] font-black uppercase tracking-[0.3em] rounded-full hover:bg-mat-gold/10 transition-all font-mono"
                >
                  Apply
                </button>
              )}
            </div>
          </GlassCard>
        </div>

        {/* 🚀 Floating Command Dock (Zero-Scroll Navigation) */}
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50">
          <Dock handleLogout={handleLogout} />
        </div>
      </main>

      {/* 🧩 FAQ Premium Modal (Liquid Glass) */}
      <AnimatePresence>
        {showFAQ && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 lg:p-12 backdrop-blur-3xl bg-black/60"
            onClick={() => setShowFAQ(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 30, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-4xl bg-mat-obsidian/90 border border-white/10 rounded-[4rem] p-10 lg:p-20 shadow-[0_0_100px_rgba(75,26,36,0.2)] max-h-[75vh] overflow-y-auto relative glass-surface"
            >
               <button 
                 onClick={() => setShowFAQ(false)}
                 className="absolute top-10 right-10 w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all z-20"
               >
                 <X size={24} />
               </button>
               
               <div className="space-y-12">
                  <div className="space-y-4">
                    <h2 className="text-5xl mat-text-display-pro text-white leading-tight uppercase font-black tracking-tighter">
                      Sovereign <span className="mat-text-gradient-gold">Gnosis</span>
                    </h2>
                    <p className="mat-text-label-pro opacity-40 uppercase tracking-widest text-xs">Knowledge Base Protocol</p>
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
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-black/80 backdrop-blur-3xl" onClick={() => setShowVerification(false)}>
             <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={e => e.stopPropagation()}
                className="relative w-full max-w-xl rounded-[3.5rem] bg-mat-obsidian border border-mat-gold/20 p-8 shadow-2xl"
             >
                <button onClick={() => setShowVerification(false)} className="absolute top-8 right-8 text-white/40 hover:text-white"><X size={24} /></button>
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
