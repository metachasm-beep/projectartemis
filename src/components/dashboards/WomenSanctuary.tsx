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
      {/* 🌌 High-Performance Liquid Mesh Background */}
      <LiquidMesh />

      {/* 🎞️ Global Post-Processing */}
      <PostProcessOverlay />

      {/* 🏰 Main Interface Layer */}
      <main className="relative z-10 w-full h-full pt-28 pb-10 px-8 flex flex-col gap-12">
        {/* 🎭 Header Zone */}
        <header className="absolute top-10 left-10 z-20 flex items-center gap-6">
           {profile?.photos?.[0] ? (
             <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-mat-gold/30 shadow-[0_0_30px_rgba(212,175,55,0.2)]">
                <img src={profile.photos[0]} alt="User" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-tr from-mat-wine/30 to-transparent mix-blend-overlay"></div>
             </div>
           ) : (
             <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-md">
                <span className="font-mono text-mat-gold/50 text-[10px] tracking-widest uppercase">ID</span>
             </div>
           )}
           <div className="space-y-1">
              <Badge variant="outline" className="px-4 py-1.5 border-mat-gold text-mat-gold text-[12px] uppercase tracking-[0.4em] font-black rounded-lg bg-mat-gold/10 backdrop-blur-md">
                Status: Verified & Syncing
              </Badge>
              <h1 className="text-mat-cream font-bold italic text-2xl tracking-tighter leading-none" style={{ fontFamily: 'Playfair Display, serif' }}>
                Welcome back, {profile?.full_name?.split(' ')[0] || 'User'}.
              </h1>
           </div>
        </header>

        {/* 🕸️ Dashboard Grid: 12-Column Layout */}
        <div className="flex-1 grid grid-cols-12 grid-rows-12 gap-5 lg:gap-6 pb-12">
          
          {/* 👁️ Discovery Zone (Insights) */}
          <GlassCard className="col-span-12 lg:col-span-4 row-span-6" delay={0.1}>
            <OracleWidget metrics={metrics} onBeginDiscovery={onBeginDiscovery} />
          </GlassCard>

          {/* 🏛️ Design Zone (Results) */}
          <GlassCard className="col-span-12 lg:col-span-8 row-span-4" delay={0.2}>
             <ThreeAnchor quality="high" />
             <div className="h-full flex flex-col justify-between relative z-10">
                <div className="space-y-1">
                   <p className="font-mono text-[13px] text-mat-wine font-black uppercase tracking-[0.4em] mb-1">Visual Overview</p>
                   <h2 className="text-6xl font-bold italic text-mat-cream tracking-tighter leading-none" style={{ fontFamily: 'Playfair Display, serif' }}>
                     Design <span className="opacity-10 text-mat-gold">& Style.</span>
                   </h2>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  {(() => {
                    const arc = SkillOrchestrator.getArchitectVisuals();
                    return [
                      { label: 'Views', val: `${arc.gazeDepth}`, icon: Eye, color: 'text-white' },
                      { label: 'Rating', val: arc.assetPurity.toString(), icon: Star, color: 'text-mat-gold' },
                      { label: 'Quality', val: arc.lightingStability, icon: Zap, color: 'text-mat-rose' },
                      { label: 'System', val: 'STABLE', icon: Activity, color: 'text-mat-gold' },
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
                            <p className="font-mono text-[11px] text-white/80 uppercase tracking-[0.2em]">{stat.label}</p>
                         </div>
                       </motion.div>
                    ));
                  })()}
                </div>
              </div>
          </GlassCard>

          {/* 🌿 Profile Zone (Identity Hub) */}
          <GlassCard className="col-span-12 lg:col-span-4 row-span-8" delay={0.3}>
            <SanctuaryWidget 
               metrics={metrics} 
               profile={profile}
            />
          </GlassCard>

          {/* 📜 Activity Zone (Performance) */}
          <GlassCard className="col-span-12 lg:col-span-4 row-span-6" delay={0.4}>
             <InfluenceWidget metrics={metrics} />
          </GlassCard>

          {/* 🛡️ Account Zone (Security) */}
          <GlassCard className="col-span-12 lg:col-span-4 row-span-2" delay={0.5}>
            <div className="h-full flex items-center justify-between px-2">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-mat-gold/10 rounded-xl border border-mat-gold/20">
                  <ShieldCheck size={20} className="text-mat-gold" strokeWidth={1.5} />
                </div>
                <div>
                   <p className="font-mono text-[11px] text-white/80 uppercase tracking-[0.4em]">Account Verification</p>
                   <p className="text-sm font-bold italic text-white tracking-widest">Status: <span className="text-mat-gold">VERIFIED</span></p>
                </div>
              </div>
              
              {!profile?.is_verified && (
                <button 
                  onClick={() => setShowVerification(true)}
                  className="px-6 py-3 border-2 border-mat-gold text-mat-gold text-[11px] font-black uppercase tracking-[0.3em] rounded-full hover:bg-mat-gold/10 transition-all font-mono"
                >
                  Verify Now
                </button>
              )}
            </div>
          </GlassCard>
        </div>

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
                      Help <span className="mat-text-gradient-gold">& Support</span>
                    </h2>
                    <p className="mat-text-label-pro opacity-40 uppercase tracking-widest text-xs">Frequently Asked Questions</p>
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
