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

interface WomenDashboardProps {
  profile: any;
  status: any;
  handleLogout: () => void;
  handleBoost: () => void;
}

/**
 * 🏛️ Women's Dashboard 2.0: Sovereign Control Center (Pro Max)
 * Redesigned for radical zero-scroll immersive PC experience.
 * Powered by Liquid Glass & Aurora Backgrounds.
 */
export const WomenDashboard: React.FC<WomenDashboardProps> = ({ 
  profile,
  status, 
  handleLogout,
  handleBoost 
}) => {
  const [showFAQ, setShowFAQ] = React.useState(false);

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden bg-mat-obsidian selection:bg-mat-wine selection:text-white">
      {/* 🌌 High-Fidelity Aurora Background */}
      <div className="absolute inset-0 z-0">
        <Aurora 
          colorStops={['#0C0A09', '#4B1A24', '#1a0d10']} 
          amplitude={1.2} 
          speed={0.5} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-mat-obsidian via-transparent to-transparent opacity-60" />
      </div>

      {/* 🏰 Main Interface Layer */}
      <main className="relative z-10 w-full h-full p-8 lg:p-12 flex flex-col gap-8">
        
        {/* Top Header: Sovereign Branding */}
        <header className="flex justify-between items-end">
          <div className="space-y-2">
            <Badge variant="outline" className="px-4 py-1.5 border-mat-gold/30 text-mat-gold rounded-full bg-mat-gold/5 mat-text-label-pro text-[9px] uppercase tracking-tighter shadow-mat-gold/10">
              Registry: Elite Sanctum Verified
            </Badge>
            <h1 className="text-5xl font-bold text-mat-cream tracking-tighter italic leading-none" style={{ fontFamily: 'var(--font-display)' }}>
              Sovereign Presence<span className="text-mat-gold">.</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-right hidden lg:block">
              <p className="mat-text-label-pro opacity-40 text-[9px] uppercase tracking-[0.2em]">Logged Identity</p>
              <p className="text-mat-cream font-bold italic text-sm">{profile?.display_name || 'Anonymous'}</p>
            </div>
            <button 
               onClick={() => setShowFAQ(true)}
               className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-mat-gold hover:bg-white/10 transition-all group"
            >
               <HelpCircle size={20} className="group-hover:rotate-12 transition-transform" />
            </button>
          </div>
        </header>

        {/* 12-Column Grid Matrix */}
        <div className="flex-1 grid grid-cols-12 gap-6 lg:gap-8 pb-12">
          
          {/* Left Column: Core Identity & Control (4 cols) */}
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-6 lg:gap-8">
            
            {/* Aura Token Control Card */}
            <GlassCard className="flex-1 min-h-[300px]" delay={0.1}>
              <div className="h-full flex flex-col justify-between">
                <div className="space-y-6">
                  <div className="flex justify-between items-center text-white/40">
                    <span className="mat-text-label-pro text-[10px] tracking-widest uppercase font-black">Energy Balance</span>
                    <Zap size={16} className="text-mat-gold" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-[5.5rem] font-bold text-mat-wine italic tracking-tighter leading-none">{status?.points || 0}</span>
                      <span className="text-mat-gold/60 text-lg font-black animate-pulse">Hz</span>
                    </div>
                    <p className="mat-text-label-pro text-[10px] opacity-40 uppercase tracking-[0.2em]">Radiance Potential</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-mat-wine/10 border border-mat-wine/20 rounded-2xl">
                    <p className="text-[10px] text-mat-cream/60 leading-relaxed italic">
                      Verify connection strength to multiply frequency rewards.
                    </p>
                  </div>
                  <button 
                    onClick={handleBoost}
                    disabled={status?.points < 100}
                    className="w-full py-5 bg-mat-wine text-mat-cream mat-text-label-pro text-[10px] rounded-2xl hover:bg-mat-gold hover:text-black transition-all flex items-center justify-center gap-3 disabled:opacity-20 shadow-2xl shadow-mat-wine/20 font-black uppercase tracking-widest"
                  >
                    {status?.points >= 100 ? "Activate Radiance Protocol" : "Gathering Energy..."} 
                    <Sparkles size={14} strokeWidth={3} className={status?.points >= 100 ? "animate-spin-slow" : "opacity-20"} />
                  </button>
                </div>
              </div>
            </GlassCard>

            {/* Verification / Security Card */}
            <GlassCard className="h-auto" delay={0.2}>
              <div className="space-y-6">
                <div className="flex items-center gap-4 text-mat-gold">
                  <ShieldCheck size={22} strokeWidth={1.5} />
                  <span className="mat-text-label-pro text-[11px] uppercase tracking-[0.3em] font-black">Registry Integrity</span>
                </div>
                
                {profile?.is_verified ? (
                  <div className="space-y-2">
                    <p className="text-xl font-bold italic text-white leading-tight">Seal of Truth: <span className="text-mat-gold">Applied</span></p>
                    <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        className="bg-mat-gold h-full"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-[11px] text-white/60 leading-relaxed">Identity verification pending. Apply the Seal of Truth to unlock high-definition discovery protocols.</p>
                    <button 
                      onClick={() => window.location.href = '#verification'}
                      className="px-6 py-3 border border-mat-gold/30 text-mat-gold text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-mat-gold/10 transition-colors"
                    >
                      Begin Verification
                    </button>
                  </div>
                )}
              </div>
            </GlassCard>
          </div>

          {/* Right Mainframe: Data Matrix (8 cols) */}
          <div className="col-span-12 lg:col-span-8 flex flex-col gap-6 lg:gap-8">
            
            {/* Top Wide: Connection Arch */}
            <GlassCard className="flex-[1.5]" delay={0.3}>
              <div className="h-full flex flex-col justify-between relative overflow-hidden">
                {/* Visual Anchor */}
                <div className="absolute top-0 right-0 opacity-5 -mr-12 -mt-12 scale-150 rotate-12">
                   <Heart size={300} fill="white" />
                </div>
                
                <div className="space-y-2">
                   <p className="mat-text-label-pro text-[10px] text-mat-rose uppercase tracking-[0.4em]">Live Matrix</p>
                   <h2 className="text-6xl font-bold italic text-mat-cream tracking-tighter leading-none" style={{ fontFamily: 'var(--font-display)' }}>
                     Connection <span className="opacity-20 text-mat-gold">Arch.</span>
                   </h2>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                  {[
                    { label: 'New Seekers', val: '28', icon: Activity, color: 'text-white' },
                    { label: 'Active Dialogs', val: '4', icon: MessageCircle, color: 'text-mat-rose' },
                    { label: 'Admiration Index', val: '142', icon: Eye, color: 'text-white/40' },
                    { label: 'Status Rank', val: 'Elite', icon: Star, color: 'text-mat-gold' },
                  ].map((stat, i) => (
                    <motion.div 
                      key={i} 
                      whileHover={{ y: -5 }}
                      className="space-y-4"
                    >
                       <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                         <stat.icon size={20} className={stat.color} strokeWidth={1.5} />
                       </div>
                       <div className="space-y-1">
                          <p className="text-4xl font-bold text-white italic tracking-tighter">{stat.val}</p>
                          <p className="mat-text-label-pro text-[9px] opacity-40 uppercase tracking-[0.2em]">{stat.label}</p>
                       </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </GlassCard>

            {/* Bottom Split: Metric Harmony */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 min-h-[250px]">
              
              <GlassCard className="h-full" delay={0.4}>
                <div className="h-full flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                       <p className="mat-text-label-pro text-[9px] text-mat-gold uppercase tracking-[0.4em]">Resonance</p>
                       <h3 className="text-3xl font-bold italic text-white leading-none">Harmony Index.</h3>
                    </div>
                    <div className="p-4 bg-mat-gold/10 rounded-2xl border border-mat-gold/20">
                      <Compass className="text-mat-gold w-6 h-6 animate-spin-slow" strokeWidth={1} />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-4">
                     <span className="text-7xl font-bold text-mat-cream tracking-tighter italic leading-none" style={{ fontFamily: 'var(--font-display)' }}>
                        {Math.round(status?.rank_score || 0)}
                     </span>
                     <p className="text-[10px] text-white/30 italic max-w-[150px] leading-tight">Strategic frequency alignment verified in local sector.</p>
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="h-full" delay={0.5}>
                 <div className="h-full flex flex-col justify-between">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 text-white/60">
                          <ShieldCheck size={20} strokeWidth={1} />
                          <span className="mat-text-label-pro text-[10px] uppercase tracking-widest font-black">Registry Audit</span>
                        </div>
                        <h4 className="text-2xl font-bold italic text-white/40 leading-tight">Integrity Status: <span className="text-mat-gold">Stable</span></h4>
                    </div>
                    
                    <div className="bg-black/40 rounded-[2rem] p-6 border border-white/5 flex items-center justify-between">
                       <div className="space-y-1">
                          <p className="text-[10px] text-white/40 leading-none">Last Audit Protocol</p>
                          <p className="text-mat-gold text-[12px] font-bold italic">Active | 3h Ago</p>
                       </div>
                       <motion.div 
                         initial={{ rotate: 0 }}
                         animate={{ rotate: 360 }}
                         transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                         className="flex gap-1"
                       >
                          <div className="w-2 h-2 rounded-full bg-mat-gold shadow-[0_0_15px_rgba(202,138,4,0.5)]" />
                          <div className="w-2 h-2 rounded-full bg-mat-gold/40" />
                          <div className="w-2 h-2 rounded-full bg-mat-gold/10" />
                       </motion.div>
                    </div>
                 </div>
              </GlassCard>
            </div>
          </div>
        </div>

        {/* 🚀 Floating Command Dock (Zero-Scroll Navigation) */}
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50">
          <Dock handleLogout={handleLogout || (() => {})} />
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

      <style>{`
        .shadow-mat-premium {
          box-shadow: 0 50px 100px -20px rgba(0,0,0,0.5), 0 30px 60px -30px rgba(0,0,0,0.6);
        }
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
