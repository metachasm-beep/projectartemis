import React from 'react';
import { 
  ShieldCheck, 
  Zap, 
  Heart, 
  Crown,
  Activity,
  Sparkles,
  MessageCircle,
  Eye,
  Star,
  Compass,
  Scroll
} from 'lucide-react';

import { Badge } from "@/components/ui/badge";
import { VerificationPrompt } from "@/components/VerificationPrompt";
import { FAQ } from '@/components/FAQ';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { sanitizeBio } from '@/utils/trumpData';
import { SEO_COPY } from '@/content/copy';
import { staggerContainer, maskReveal, scaleInBreathe, springSlide, glassIn } from '@/utils/animations';

import heroWoman from '@/assets/hero_woman.jpg';
import parallaxWoman from '@/assets/parallax_woman.jpg';

interface WomenDashboardProps {
  profile: any;
  status: any;
  handleLogout: () => void;
  handleBoost: () => void;
}

export const WomenDashboard: React.FC<WomenDashboardProps> = ({ 
  profile,
  status, 
  handleBoost 
}) => {
  // ─── PARALLAX RITUAL ───
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const mouseX = (clientX - rect.left) / width - 0.5;
    const mouseY = (clientY - rect.top) / height - 0.5;
    
    x.set(mouseX);
    y.set(mouseY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div 
      initial="initial"
      animate="animate"
      variants={staggerContainer}
      className="space-y-24 pb-48 max-w-7xl mx-auto px-6 relative"
    >
      {/* ─── DYNAMIC BRAND HEADER: THE SOVEREIGN ARRIVAL ─── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 pb-16 border-b border-mat-rose/20 relative pt-12">
        <div className="space-y-8 relative z-10">
          <h1 className="sr-only">The Inner Sanctuary: Sovereign Dashboard | Matriarch</h1>
          <motion.div variants={springSlide}>
            <Badge variant="outline" className="mat-text-label-pro px-8 py-3 border-mat-rose/30 text-mat-rose rounded-full bg-white/40 backdrop-blur-md">The Inner Sanctuary</Badge>
          </motion.div>
          <div className="overflow-hidden">
             <motion.div variants={maskReveal} className="mat-text-display-pro text-mat-wine leading-[0.9]">
                Welcome to the <br />
                <span className="text-mat-rose/30 italic">Inner Sanctuary.</span>
             </motion.div>
          </div>
        </div>
        
        <motion.div variants={springSlide} className="flex flex-col gap-px bg-mat-rose/10 w-full md:w-auto overflow-hidden rounded-[2.5rem] mat-glass-deep border border-mat-rose/20 shadow-mat-premium z-10">
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

        {/* 🌸 Hero Background Image: Scale-In Breathe */}
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none overflow-hidden blur-2xl md:blur-none">
           <motion.img 
             variants={scaleInBreathe} 
             animate={["animate", "breathe"]}
             src={heroWoman} 
             className="w-full h-full object-cover transform-gpu"
           />
        </div>
      </div>

      {!profile?.is_verified && (
        <motion.div 
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
         <motion.div 
            variants={springSlide}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            className="bento-span-8 bento-item mat-glass-deep group min-h-[520px] p-2 bg-white/40 transform-gpu cursor-pointer"
         >
            <div className="flex flex-col md:flex-row h-full gap-12 bg-mat-cream/40 rounded-[2.5rem] p-10" style={{ transform: "translateZ(20px)" }}>
                <div className="relative shrink-0 w-full md:w-80 aspect-[3/4] md:h-full rounded-[3.5rem] overflow-hidden border border-mat-rose/10 shadow-2xl shadow-mat-wine/10">
                   <img 
                      src={parallaxWoman} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-all duration-1000 grayscale group-hover:grayscale-0 filter sepia-[0.1]" 
                      alt="Sovereign" 
                      style={{ transform: "translateZ(40px)" }}
                    />
                  <div className="absolute inset-0 bg-gradient-to-t from-mat-wine/60 via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-8 left-8 right-8 flex justify-between items-center z-10" style={{ transform: "translateZ(60px)" }}>
                     <div className="w-16 h-16 bg-white/20 backdrop-blur-2xl rounded-3xl flex items-center justify-center border border-white/30 shadow-2xl">
                        <Crown className="text-white w-8 h-8" />
                     </div>
                     <Badge className="bg-mat-wine/80 backdrop-blur-md text-white px-6 py-2 rounded-full mat-text-label-pro border border-white/10">{profile?.role?.toUpperCase() || 'MATRIARCH'}</Badge>
                  </div>
               </div>

               <div className="flex-1 flex flex-col justify-between py-6">
                  <div className="space-y-10">
                     <div className="space-y-3">
                        <span className="mat-text-label-pro text-mat-rose">Registry Identity</span>
                        <h2 className="text-6xl font-bold text-mat-wine italic leading-[0.9]">
                           {profile?.full_name?.split(' ')[0]} <br />
                           <span className="opacity-15">{profile?.full_name?.split(' ').slice(1).join(' ')}</span>
                        </h2>
                     </div>
                     
                     <div className="flex flex-wrap gap-4">
                        <Badge variant="outline" className="px-6 py-3 border-mat-rose/30 bg-mat-rose/5 text-mat-wine mat-text-label-pro rounded-2xl italic">{profile?.city || 'Sanctuary'}</Badge>
                        <Badge variant="outline" className="px-6 py-3 border-mat-gold/30 bg-mat-gold/5 text-mat-gold-deep mat-text-label-pro rounded-2xl italic">Protocol Verified</Badge>
                     </div>

                     <div className="relative">
                        <span className="absolute -left-6 top-0 bottom-0 w-1 bg-mat-rose/20 rounded-full" />
                        <p className="text-[17px] text-mat-slate font-medium leading-relaxed italic pr-8">
                           "{sanitizeBio(profile?.bio) || "Your sacred story awaits completion. Share your vision with the sanctuary."}"
                        </p>
                     </div>
                  </div>

                  <div className="pt-12 flex items-center gap-10">
                     <div className="flex items-center gap-3">
                        <Activity className="text-mat-rose animate-pulse" size={14} />
                        <span className="mat-text-label-pro opacity-40 italic">Syncing Engagement Assets...</span>
                     </div>
                  </div>
               </div>
            </div>
         </div>

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
