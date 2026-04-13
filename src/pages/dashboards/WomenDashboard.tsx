import React from 'react';
import { motion } from 'framer-motion';
import { VerificationPrompt } from "@/components/VerificationPrompt";
import { FAQ } from '@/components/FAQ';
import { staggerContainer } from '@/utils/animations';

import { HeroSection } from '@/components/dashboard/HeroSection';
import { HoverParallaxCard } from '@/components/dashboard/HoverParallaxCard';
import { ParallaxFold } from '@/components/dashboard/ParallaxFold';

import foldOneBg from '@/assets/fold_one_bg.jpg';
import foldTwoBg from '@/assets/fold_two_bg.jpg';

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
  Scroll
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";

interface WomenDashboardProps {
  profile: any;
  status: any;
  handleLogout: () => void;
  handleBoost: () => void;
}

/**
 * 🏛️ Women's Dashboard: The Inner Sanctuary
 * Implements the Sovereign Fold Protocol with dual-environment parallax.
 * GSD Compliant: Modular, PWA Optimized.
 */
export const WomenDashboard: React.FC<WomenDashboardProps> = ({ 
  profile,
  status, 
  handleBoost 
}) => {
  return (
    <motion.div 
      initial="initial"
      animate="animate"
      className="relative w-full"
    >
      {/* 🏹 FOLD 1: THE SOVEREIGN ARRIVAL */}
      <ParallaxFold 
        bgImage={foldOneBg} 
        overlayClassName="bg-mat-cream/50"
      >
        <motion.div variants={staggerContainer} className="space-y-24">
          <HeroSection points={status?.points} onBoost={handleBoost} />

          {/* Quick Actions / Aura Token Indicator */}
          <div className="flex flex-col md:flex-row gap-6">
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col gap-px bg-mat-rose/10 w-full md:w-auto overflow-hidden rounded-[2.5rem] mat-glass-deep border border-mat-rose/20 shadow-mat-premium z-10"
            >
              <div className="bg-mat-ivory/60 px-12 py-8 flex flex-col justify-center min-w-[200px] border-b border-mat-rose/5">
                <span className="mat-text-label-pro opacity-40">Aura Tokens</span>
                <div className="flex items-center gap-3">
                  <span className="text-4xl font-bold text-mat-wine italic">{status?.points || 0}</span>
                  <Zap size={20} className="text-mat-gold animate-pulse" />
                </div>
              </div>
              <button 
                onClick={handleBoost} 
                disabled={status?.points < 100}
                className="bg-mat-wine text-mat-cream px-12 py-6 mat-text-label-pro hover:bg-mat-wine-soft transition-all flex items-center justify-center gap-4 disabled:opacity-20 group"
              >
                {status?.points >= 100 ? "Activate Radiance" : "Gathering Energy"} 
                <Sparkles size={16} className={`group-hover:rotate-12 transition-transform ${status?.points >= 100 ? "text-mat-gold" : "text-white/20"}`} />
              </button>
            </motion.div>
          </div>

          {!profile?.is_verified && (
            <motion.div 
              whileHover={{ scale: 1.005 }}
              className="mat-glass-deep p-16 rounded-[4rem] border-mat-rose/10 shadow-mat-premium max-w-4xl"
            >
              <VerificationPrompt 
                userId={profile?.user_id} 
                role="woman" 
                onVerified={() => window.location.reload()} 
              />
            </motion.div>
          )}
        </motion.div>
      </ParallaxFold>

      {/* 🌑 FOLD 2: THE INNER REGISTRY */}
      <ParallaxFold 
        bgImage={foldTwoBg} 
        isDark={true}
        parallaxSpeed={0.4}
        className="border-t border-white/5"
      >
        <motion.div variants={staggerContainer} className="space-y-32">
          <div className="space-y-6">
            <Badge variant="outline" className="px-6 py-2 border-white/20 text-mat-gold rounded-full bg-white/5 backdrop-blur-md mat-text-label-pro">Sovereign Registry</Badge>
            <h2 className="mat-text-display-pro text-mat-cream">Your Absolute <br /><span className="italic opacity-30">Frequency.</span></h2>
          </div>

          {/* ─── BENTO MATRIX ─── */}
          <div className="bento-grid">
            <HoverParallaxCard role={profile?.role} isVerified={profile?.is_verified} />

            {/* Harmony Quotient */}
            <div className="bento-span-4 bento-item bg-black/60 text-mat-cream group shadow-2xl relative overflow-hidden backdrop-blur-3xl border border-white/10">
              <div className="flex flex-col h-full justify-between p-12 relative z-10">
                <div className="space-y-8">
                  <div className="flex justify-between items-start">
                    <h3 className="text-3xl font-bold italic leading-none text-white">Harmony <br /><span className="text-mat-rose/40">Index.</span></h3>
                    <Compass className="text-mat-gold w-8 h-8 animate-spin-slow" strokeWidth={1} />
                  </div>
                  <p className="text-white/30 mat-text-label-pro leading-relaxed italic normal-case">Divine resonance within the sanctuary order.</p>
                </div>
                <div className="py-12 border-y border-white/5 space-y-12">
                  <div className="flex justify-between items-end">
                    <span className="text-8xl font-bold text-mat-cream tracking-tighter italic" style={{ fontFamily: 'var(--font-display)' }}>
                      {Math.round(status?.rank_score || 0)}
                    </span>
                  </div>
                </div>
                <button className="w-full py-6 bg-white/5 text-white mat-text-label-pro rounded-2xl hover:bg-white/10 transition-all flex items-center justify-center gap-4 group border border-white/10">
                  Refine Narrative <Scroll size={14} className="group-hover:rotate-12 transition-transform" />
                </button>
              </div>
            </div>

            {/* Connection Arch */}
            <div className="bento-span-8 bento-item bg-white/5 backdrop-blur-3xl border border-white/10 p-16">
              <div className="space-y-16">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <h3 className="text-4xl font-bold italic leading-none text-white">Connection Arch.</h3>
                    <p className="mat-text-label-pro text-mat-rose">Live Presence Manifests</p>
                  </div>
                  <Heart className="text-white/10 w-12 h-12" fill="rgba(255,255,255,0.03)" />
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
                  {[
                    { label: 'New Seekers', val: '28', icon: Activity, color: 'text-white' },
                    { label: 'Dialogs', val: '4', icon: MessageCircle, color: 'text-mat-rose' },
                    { label: 'Admiration', val: '142', icon: Eye, color: 'text-white/40' },
                    { label: 'Tier Status', val: 'Elite', icon: Star, color: 'text-mat-gold' },
                  ].map((stat, i) => (
                    <div key={i} className="space-y-6 group">
                      <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:bg-white/10 transition-all shadow-sm">
                        <stat.icon size={20} className={`${stat.color} group-hover:scale-110 transition-transform`} />
                      </div>
                      <div className="space-y-1 border-l border-white/10 pl-4">
                        <p className="text-3xl font-bold text-white italic tracking-tighter">{stat.val}</p>
                        <p className="mat-text-label-pro opacity-40">{stat.label}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sanctuary Records */}
            <div className="bento-span-4 bento-item bg-white/5 backdrop-blur-2xl border-dashed border-white/10 group p-12">
              <div className="flex flex-col h-full justify-between gap-16">
                <div className="space-y-8">
                  <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-mat-rose group-hover:text-white transition-all border border-white/5">
                    <ShieldCheck size={28} strokeWidth={1} />
                  </div>
                  <h4 className="text-2xl font-bold italic leading-none text-white">Registry <br /><span className="text-white/20">Audit.</span></h4>
                </div>
                <div className="bg-black/40 rounded-3xl p-8 border border-white/5 space-y-6">
                  <div className="flex justify-between mat-text-label-pro opacity-60 text-[8px]">
                    <span className="text-white/40">Last Integrity Check</span>
                    <span className="text-mat-gold">3h Ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <FAQ />
        </motion.div>
      </ParallaxFold>

      <div className="py-32 text-center bg-mat-obsidian border-t border-white/5">
        <p className="text-[14px] font-black uppercase tracking-[1.5em] opacity-10 select-none text-mat-cream pointer-events-none">
          Matriarch // For Her. By Choice.
        </p>
      </div>
    </motion.div>
  );
};
