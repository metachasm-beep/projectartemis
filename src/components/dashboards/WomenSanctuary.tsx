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
      <main className="relative z-10 w-full h-full p-8 lg:p-12 flex flex-col gap-8">
        
        {/* 🏛️ Top Header: Sovereign Branding */}
        <header className="flex justify-between items-end mb-4">
          <div className="space-y-2">
            <Badge variant="outline" className="px-5 py-2 border-mat-gold/20 text-mat-gold rounded-full bg-mat-gold/5 font-mono text-[9px] uppercase tracking-[0.3em] backdrop-blur-md">
              Registry: Elite Sanctum Verified [PROTOCOL_v2.0]
            </Badge>
            <h1 className="text-6xl font-bold text-mat-cream tracking-tighter italic leading-none drop-shadow-2xl" style={{ fontFamily: 'Playfair Display, serif' }}>
              Sovereign Presence<span className="text-mat-gold font-sans">.</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-8">
            <div className="text-right hidden lg:block">
              <p className="font-mono text-[9px] text-white/30 uppercase tracking-[0.4em]">Logged Identity</p>
              <p className="text-mat-cream font-bold italic text-lg leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
                {profile?.full_name || 'ANONYMOUS_PRESENCE'}
              </p>
            </div>
            <button 
               onClick={() => setShowFAQ(true)}
               className="w-14 h-14 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-mat-gold hover:bg-white/10 transition-all group backdrop-blur-xl"
            >
               <HelpCircle size={22} className="group-hover:rotate-12 transition-transform" />
            </button>
          </div>
        </header>

        {/* 🕸️ The Sovereign Matrix: 12-Column Grid */}
        <div className="flex-1 grid grid-cols-12 grid-rows-6 gap-6 lg:gap-8 pb-16">
          
          {/* 👁️ Zone 1: The Oracle (Top-Left / Insight) */}
          <GlassCard className="col-span-12 lg:col-span-4 row-span-3" delay={0.1}>
            <OracleWidget metrics={metrics} onBeginDiscovery={onBeginDiscovery} />
          </GlassCard>

          {/* 🏛️ Zone 2: The Architect (Top-Right / Vision) */}
          <GlassCard className="col-span-12 lg:col-span-8 row-span-2" delay={0.2}>
             <ThreeAnchor quality="high" />
             <div className="h-full flex flex-col justify-between relative z-10">
                <div className="space-y-2">
                   <p className="font-mono text-[10px] text-mat-wine uppercase tracking-[0.6em] mb-2">Vision Matrix</p>
                   <h2 className="text-7xl font-bold italic text-mat-cream tracking-tighter leading-none" style={{ fontFamily: 'Playfair Display, serif' }}>
                     Aesthetic <span className="opacity-10 text-mat-gold">Sovereignty.</span>
                   </h2>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
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
                        whileHover={{ y: -5 }}
                        className="space-y-4"
                      >
                         <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 backdrop-blur-md">
                           <stat.icon size={22} className={stat.color} strokeWidth={1.5} />
                         </div>
                         <div className="space-y-1">
                            <p className="text-3xl font-bold text-white italic tracking-tighter font-mono">{stat.val}</p>
                            <p className="font-mono text-[9px] opacity-30 uppercase tracking-[0.2em]">{stat.label}</p>
                         </div>
                      </motion.div>
                    ));
                  })()}
                </div>
              </div>
          </GlassCard>

          {/* 🌿 Zone 3: The Sanctuary (Middle-Right / Harmony) */}
          <GlassCard className="col-span-12 lg:col-span-4 row-span-4" delay={0.3}>
            <SanctuaryWidget metrics={metrics} />
          </GlassCard>

          {/* 📜 Zone 4: The Influence (Bottom-Left / Authority) */}
          <GlassCard className="col-span-12 lg:col-span-4 row-span-3" delay={0.4}>
             <InfluenceWidget metrics={metrics} />
          </GlassCard>

          {/* 🛡️ Zone 5: Registry Integrity (Bottom-Right / Command) */}
          <GlassCard className="col-span-12 lg:col-span-4 row-span-1" delay={0.5}>
            <div className="h-full flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="p-4 bg-mat-gold/10 rounded-2xl border border-mat-gold/20">
                  <ShieldCheck size={24} className="text-mat-gold" strokeWidth={1.5} />
                </div>
                <div>
                   <p className="font-mono text-[9px] text-white/30 uppercase tracking-[0.5em]">Registry Integrity</p>
                   <p className="text-sm font-bold italic text-white tracking-widest">Protocol: <span className="text-mat-gold">STABLE</span></p>
                </div>
              </div>
              
              {!profile?.is_verified && (
                <button 
                  onClick={() => setShowVerification(true)}
                  className="px-6 py-3 border border-mat-gold/20 text-mat-gold text-[9px] font-black uppercase tracking-[0.3em] rounded-full hover:bg-mat-gold/10 transition-all font-mono"
                >
                  Apply Protocol
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
