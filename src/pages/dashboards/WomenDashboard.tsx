import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VerificationPrompt } from "@/components/VerificationPrompt";
import { FAQ } from '@/components/FAQ';
import { staggerContainer } from '@/utils/animations';

import foldTwoBg from '@/assets/haseeb-jamil-qCn0kU9M_uk-unsplash.jpg';

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
  HelpCircle
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";

interface WomenDashboardProps {
  profile: any;
  status: any;
  handleLogout: () => void;
  handleBoost: () => void;
}

/**
 * 🏛️ Women's Dashboard: Single-Screen Control Center
 * Redesigned for zero-scroll immersive PC experience.
 * GSD Compliant: Modular, PWA Optimized.
 */
export const WomenDashboard: React.FC<WomenDashboardProps> = ({ 
  profile,
  status, 
  handleBoost 
}) => {
  const [showFAQ, setShowFAQ] = React.useState(false);

  return (
    <motion.div 
      initial="initial"
      animate="animate"
      className="relative w-full lg:h-screen lg:overflow-hidden bg-mat-obsidian flex flex-col lg:flex-row transition-all duration-700 font-sans"
    >
      {/* 🌌 Static High-Fidelity Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-40">
        <img src={foldTwoBg} alt="" className="w-full h-full object-cover blur-sm scale-105" />
        <div className="absolute inset-0 bg-gradient-to-br from-mat-obsidian via-transparent to-mat-wine/20" />
      </div>

      {/* 🏰 Sidebar: The Sovereign Profile */}
      <aside className="relative z-10 w-full lg:w-96 border-b lg:border-b-0 lg:border-r border-white/5 bg-black/40 backdrop-blur-xl flex flex-col p-8 lg:p-12 shrink-0">
        <div className="space-y-12 h-full flex flex-col justify-between">
          <div className="space-y-16">
            <div className="space-y-4">
              <Badge variant="outline" className="px-4 py-1.5 border-mat-gold/30 text-mat-gold rounded-full bg-mat-gold/5 mat-text-label-pro text-[10px]">Registry: Established</Badge>
              <div className="space-y-1">
                <h1 className="text-4xl font-bold italic text-mat-cream leading-tight tracking-tighter" style={{ fontFamily: 'var(--font-display)' }}>
                  Sovereign <br />Presence.
                </h1>
                <p className="mat-text-label-pro opacity-40 text-[10px] tracking-[0.2em]">{profile?.display_name || 'Anonymous'}</p>
              </div>
            </div>

            {/* Aura Token Control Tile */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="group relative overflow-hidden rounded-[2.5rem] mat-glass-deep border border-white/10 shadow-2xl"
            >
              <div className="p-8 space-y-4">
                <div className="flex justify-between items-center text-white/40">
                  <span className="mat-text-label-pro text-[9px] tracking-widest uppercase">Aura Tokens</span>
                  <Zap size={14} />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-mat-wine italic tracking-tighter">{status?.points || 0}</span>
                  <span className="text-mat-gold/40 text-xs font-black animate-pulse">Hz</span>
                </div>
                <button 
                  onClick={handleBoost}
                  disabled={status?.points < 100}
                  className="w-full py-4 bg-mat-wine text-mat-cream mat-text-label-pro text-[10px] rounded-2xl hover:bg-mat-cream hover:text-mat-wine transition-all flex items-center justify-center gap-3 mt-4 disabled:opacity-20 translate-z-0"
                >
                  {status?.points >= 100 ? "Activate Radiance" : "Gathering Energy"} <Sparkles size={12} strokeWidth={3} className={status?.points >= 100 ? "text-mat-gold" : "opacity-20"} />
                </button>
              </div>
            </motion.div>
          </div>

          <div className="space-y-8">
            {!profile?.is_verified && (
              <div className="bg-mat-wine/10 border border-mat-wine/20 p-6 rounded-3xl backdrop-blur-md">
                <div className="flex items-start gap-4">
                   <ShieldCheck className="text-mat-wine shrink-0" size={20} />
                   <div className="space-y-1">
                      <p className="text-[11px] font-bold text-mat-cream italic">Unverified Identity</p>
                      <p className="text-[9px] text-white/40 leading-tight">Apply the Seal of Truth to unlock full discovery access.</p>
                      <button 
                        onClick={() => window.location.href = '#verification'}
                        className="text-[9px] text-mat-gold font-bold uppercase tracking-widest mt-2 hover:underline"
                      >
                        Begin Protocol
                      </button>
                   </div>
                </div>
              </div>
            )}

            <div className="pt-8 border-t border-white/5 mt-auto">
               <button 
                 onClick={() => setShowFAQ(true)}
                 className="flex items-center gap-4 text-white/40 hover:text-mat-gold transition-colors group"
               >
                 <HelpCircle size={18} className="group-hover:rotate-12 transition-transform" />
                 <span className="mat-text-label-pro text-[10px] uppercase tracking-[0.3em]">Knowledge Base</span>
               </button>
            </div>
          </div>
        </div>
      </aside>

      {/* 🛰️ Main Board: The Command Mainframe */}
      <main className="relative z-10 flex-1 p-6 lg:p-12 overflow-y-auto lg:overflow-hidden">
        <motion.div 
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="lg:h-full flex flex-col gap-6 lg:gap-8"
        >
          {/* Upper Grid: Connection Arch */}
          <section className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-8 lg:p-12 flex-1 shadow-mat-premium flex flex-col justify-between group overflow-hidden relative min-h-[300px]">
            <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12 group-hover:rotate-0 transition-transform duration-1000">
               <Heart size={200} fill="white" />
            </div>
            
            <div className="space-y-4">
              <Badge variant="outline" className="px-4 py-1 border-white/10 text-white/40 rounded-full bg-white/5 mat-text-label-pro text-[8px]">Live Activity Matrix</Badge>
              <h2 className="text-5xl font-bold italic tracking-tighter text-mat-cream leading-none" style={{ fontFamily: 'var(--font-display)' }}>
                Connection <br /><span className="opacity-20 text-mat-gold">Arch.</span>
              </h2>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-12 lg:mt-0 relative z-10">
              {[
                { label: 'New Seekers', val: '28', icon: Activity, color: 'text-white' },
                { label: 'Dialogs', val: '4', icon: MessageCircle, color: 'text-mat-rose' },
                { label: 'Admiration', val: '142', icon: Eye, color: 'text-white/40' },
                { label: 'Tier Status', val: 'Elite', icon: Star, color: 'text-mat-gold' },
              ].map((stat, i) => (
                <div key={i} className="space-y-4 group/item">
                   <div className="w-10 h-10 lg:w-12 lg:h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover/item:bg-white/10 transition-all">
                     <stat.icon size={18} className={stat.color} />
                   </div>
                   <div className="space-y-1">
                      <p className="text-3xl font-bold text-white italic tracking-tighter">{stat.val}</p>
                      <p className="mat-text-label-pro text-[9px] opacity-40 uppercase tracking-[0.2em]">{stat.label}</p>
                   </div>
                </div>
              ))}
            </div>
          </section>

          {/* Lower Grid: Split Status */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 h-auto lg:h-[35%] min-h-[250px]">
            <motion.div 
              whileHover={{ scale: 1.01 }}
              className="bg-black/80 backdrop-blur-3xl border border-white/5 rounded-[3rem] p-8 flex flex-col justify-between group relative overflow-hidden shadow-2xl"
            >
              <div className="flex justify-between items-start relative z-10">
                <div className="space-y-2">
                   <p className="mat-text-label-pro text-[9px] text-mat-gold uppercase tracking-[0.4em]">Resonance</p>
                   <h3 className="text-3xl font-bold italic text-white leading-none">Harmony Index.</h3>
                </div>
                <div className="p-4 bg-mat-gold/10 rounded-2xl border border-mat-gold/20">
                  <Compass className="text-mat-gold w-6 h-6 animate-spin-slow" strokeWidth={1} />
                </div>
              </div>
              <div className="py-2 relative z-10 box-border">
                 <span className="text-7xl font-bold text-mat-cream tracking-tighter italic leading-none" style={{ fontFamily: 'var(--font-display)' }}>
                    {Math.round(status?.rank_score || 0)}
                 </span>
                 <p className="text-[10px] text-white/30 italic mt-4 max-w-[200px]">Strategic frequency alignment verified in local sector.</p>
              </div>
            </motion.div>

            <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-8 flex flex-col justify-between group">
               <div className="space-y-4">
                  <div className="flex items-center gap-4 text-white/60">
                    <ShieldCheck size={20} strokeWidth={1} />
                    <span className="mat-text-label-pro text-[10px] uppercase tracking-widest font-black">Registry Audit</span>
                  </div>
                  <h4 className="text-xl font-bold italic text-white/40 leading-tight">Protocol Integrity: <span className="text-mat-gold">Stable</span></h4>
               </div>
               
               <div className="bg-black/40 rounded-3xl p-6 border border-white/5 flex items-center justify-between mt-4">
                  <div className="space-y-1">
                     <p className="text-[10px] text-white/40 leading-none">Last Integrity Check</p>
                     <p className="text-mat-gold text-[12px] font-bold italic">3h Ago</p>
                  </div>
                  <div className="flex gap-1">
                     <div className="w-1.5 h-1.5 rounded-full bg-mat-gold shadow-mat-gold animate-pulse" />
                     <div className="w-1.5 h-1.5 rounded-full bg-mat-gold/40" />
                     <div className="w-1.5 h-1.5 rounded-full bg-mat-gold/20" />
                  </div>
               </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* 🧩 FAQ Modal / Overlay */}
      <AnimatePresence>
        {showFAQ && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 lg:p-12 backdrop-blur-2xl bg-black/60"
            onClick={() => setShowFAQ(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-4xl bg-mat-obsidian border border-white/10 rounded-[4rem] p-8 lg:p-12 shadow-mat-premium max-h-[85vh] overflow-y-auto relative"
            >
               <button 
                 onClick={() => setShowFAQ(false)}
                 className="absolute top-8 right-8 w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-white/40 hover:text-white transition-all z-20"
               >
                 &times;
               </button>
               <div className="py-8">
                <FAQ />
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
