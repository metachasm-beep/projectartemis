import React from 'react';
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
import { motion } from 'framer-motion';
import { Badge } from "@/components/ui/badge";
import { VerificationPrompt } from "@/components/VerificationPrompt";
import { FAQ } from '@/components/FAQ';
import { staggerContainer, springSlide } from '@/utils/animations';

import { HeroSection } from '@/components/dashboard/HeroSection';
import { HoverParallaxCard } from '@/components/dashboard/HoverParallaxCard';

interface WomenDashboardProps {
  profile: any;
  status: any;
  handleLogout: () => void;
  handleBoost: () => void;
}

/**
 * 🏛️ Women's Dashboard: The Inner Sanctuary
 * Orchestrates high-fidelity modular components for a luxury minimalist arrival.
 * GSD Compliant: Modular, PWA Optimized (transform-gpu).
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
      variants={staggerContainer}
      className="space-y-24 pb-48 max-w-7xl mx-auto px-6 relative"
    >
      <HeroSection points={status?.points} onBoost={handleBoost} />

      {/* ─── QUICK ACTIONS RITUAL ─── */}
      <motion.div variants={springSlide} className="flex flex-col md:flex-row gap-6">
        <div className="flex flex-col gap-px bg-mat-rose/10 w-full md:w-auto overflow-hidden rounded-[2.5rem] mat-glass-deep border border-mat-rose/20 shadow-mat-premium z-10">
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
        </div>
      </motion.div>

      {!profile?.is_verified && (
        <motion.div 
          variants={springSlide}
          whileHover={{ scale: 1.005 }}
          className="mat-glass-deep p-16 rounded-[4rem] border-mat-rose/10 shadow-mat-premium"
        >
           <VerificationPrompt 
              userId={profile?.user_id} 
              role="woman" 
              onVerified={() => window.location.reload()} 
           />
        </motion.div>
      )}

      {/* ─── BENTO MATRIX: HIGH-DENSITY SOVEREIGN DATA ─── */}
      <div className="bento-grid">
         {/* 1. Sovereign Identity (Large) - Parallax Enabled */}
         <HoverParallaxCard role={profile?.role} isVerified={profile?.is_verified} />

         {/* 2. Harmony Quotient (Small) */}
         <motion.div variants={springSlide} className="bento-span-4 bento-item bg-mat-obsidian text-mat-cream group shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-mat-wine/30 via-transparent to-transparent pointer-events-none" />
            <div className="flex flex-col h-full justify-between p-12 relative z-10">
               <div className="space-y-8">
                  <div className="flex justify-between items-start">
                     <h3 className="text-3xl font-bold italic leading-none">Harmony <br /><span className="text-mat-rose/40">Index.</span></h3>
                     <Compass className="text-mat-gold w-8 h-8 animate-spin-slow" strokeWidth={1} />
                  </div>
                  <p className="text-mat-cream/30 mat-text-label-pro leading-relaxed italic normal-case">Divine resonance within the sanctuary order.</p>
               </div>

               <div className="py-12 border-y border-white/5 space-y-12">
                  <div className="flex justify-between items-end">
                     <span className="text-8xl font-bold text-mat-cream tracking-tighter italic" style={{ fontFamily: 'var(--font-display)' }}>
                        {Math.round(status?.rank_score || 0)}
                     </span>
                     <div className="text-right space-y-1">
                        <p className="text-[10px] font-bold uppercase text-mat-gold tracking-[0.3em]">Aura: Radiant</p>
                        <p className="mat-text-label-pro opacity-20 italic">Celestial Scale</p>
                     </div>
                  </div>
                  
                  <div className="space-y-5">
                     <div className="flex justify-between mat-text-label-pro opacity-40">
                        <span>Authenticity Pulse</span>
                        <span className="text-mat-gold">{status?.profile_completeness_pct || 94}%</span>
                     </div>
                     <div className="h-2 bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
                        <motion.div 
                           initial={{ width: 0 }} 
                           animate={{ width: `${status?.profile_completeness_pct || 94}%` }} 
                           className="h-full bg-mat-gold shadow-[0_0_30px_rgba(191,160,106,0.5)] rounded-full" 
                        />
                     </div>
                  </div>
               </div>

               <button className="w-full py-6 bg-mat-cream text-mat-wine mat-text-label-pro rounded-2xl hover:scale-[1.02] transition-all flex items-center justify-center gap-4 group">
                  Refine Narrative <Scroll size={14} className="group-hover:rotate-12 transition-transform" />
               </button>
            </div>
         </motion.div>

         {/* 3. Connection Archway (Medium) */}
         <motion.div variants={springSlide} className="bento-span-8 bento-item mat-glass-deep p-16">
            <div className="space-y-16">
               <div className="flex justify-between items-start">
                  <div className="space-y-2">
                     <h3 className="text-4xl font-bold italic leading-none text-mat-wine">Connection Arch.</h3>
                     <p className="mat-text-label-pro text-mat-rose">Live Presence Manifests</p>
                  </div>
                  <Heart className="text-mat-wine/10 w-12 h-12" fill="rgba(123,45,66,0.03)" />
               </div>

               <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
                  {[
                    { label: 'New Seekers', val: '28', icon: Activity, color: 'text-mat-wine' },
                    { label: 'Dialogs', val: '4', icon: MessageCircle, color: 'text-mat-rose' },
                    { label: 'Admiration', val: '142', icon: Eye, color: 'text-mat-slate' },
                    { label: 'Tier Status', val: 'Elite', icon: Star, color: 'text-mat-gold' },
                  ].map((stat, i) => (
                    <div key={i} className="space-y-6 group">
                       <div className="w-14 h-14 bg-mat-ivory/80 rounded-2xl flex items-center justify-center border border-mat-rose/10 group-hover:bg-mat-cream transition-all shadow-sm">
                          <stat.icon size={20} className={`${stat.color} group-hover:scale-110 transition-transform`} />
                       </div>
                       <div className="space-y-1 border-l border-mat-rose/10 pl-4">
                          <p className="text-3xl font-bold text-mat-wine italic tracking-tighter">{stat.val}</p>
                          <p className="mat-text-label-pro opacity-40">{stat.label}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
         </motion.div>

         {/* 4. Sanctuary Records (Small) */}
         <motion.div variants={springSlide} className="bento-span-4 bento-item mat-glass-liquid border-dashed border-mat-rose/30 group p-12">
            <div className="flex flex-col h-full justify-between gap-16">
               <div className="space-y-8">
                  <div className="w-16 h-16 mat-glass rounded-2xl flex items-center justify-center text-mat-rose group-hover:text-mat-wine transition-all shadow-premium-gold">
                     <ShieldCheck size={28} strokeWidth={1} />
                  </div>
                  <div className="space-y-3">
                    <h4 className="text-2xl font-bold italic leading-none text-mat-wine">Registry <br /><span className="text-mat-rose/40">Audit.</span></h4>
                    <p className="mat-text-label-pro leading-relaxed italic normal-case opacity-60 pr-4">All historical resonances are encrypted and stored within the Sovereign Registry.</p>
                  </div>
               </div>
               
               <div className="bg-mat-wine/5 rounded-3xl p-8 border border-mat-wine/5 space-y-6">
                  <div className="flex justify-between mat-text-label-pro opacity-60">
                     <span>Last Integrity Check</span>
                     <span className="text-mat-wine">3h Ago</span>
                  </div>
                  <div className="h-px bg-mat-wine/10" />
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <p className="text-[9px] font-bold text-mat-wine uppercase tracking-[0.4em] italic">System: Sovereign Secure</p>
                  </div>
               </div>
            </div>
         </motion.div>
      </div>

      <FAQ />

      <div className="py-32 text-center border-t border-mat-rose/10">
         <p className="text-[14px] font-black uppercase tracking-[1.5em] opacity-10 select-none text-mat-wine pointer-events-none">
            Matriarch // For Her. By Choice.
         </p>
      </div>
    </motion.div>
  );
};
