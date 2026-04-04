import React from 'react';
import { motion } from 'framer-motion';
import { Camera, CheckCircle2, Zap, Flame, Eye, MousePointerClick, Heart } from 'lucide-react';
import type { MatriarchProfile } from '@/types';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

// Ensure similar Aura Tier logic
function getAuraTier(score: number) {
  if (score >= 1000) return { label: 'OVEREIGN ARCHITECT', next: 5000 };
  if (score >= 500) return { label: 'VANGUARD', next: 1000 };
  if (score >= 100) return { label: 'ESTABLISHED PRESENCE', next: 500 };
  return { label: 'RISING ASPIRANT', next: 100 };
}

interface MenDossierProps {
  profile: MatriarchProfile;
  metrics: { impression: number; visit: number; save: number };
  setIsEditing: (val: boolean) => void;
  handleVerify: () => void;
}

export const MenDossier: React.FC<MenDossierProps> = ({ profile, metrics, setIsEditing, handleVerify }) => {
  const rankCount = profile.rank_boost_count || 0;
  const tier = getAuraTier(rankCount);
  
  const firstName = profile.full_name?.split(' ')[0] || 'Unknown';
  const lastName = profile.full_name?.split(' ').slice(1).join(' ') || '';

  return (
    <div className="w-full bg-mat-obsidian text-mat-cream min-h-screen pb-32">
      
      {/* ─── SCENE 1: THE MONOLITHIC HERO ─── */}
      <div className="relative w-full h-[75vh] md:h-[90vh] overflow-hidden">
        <img 
          src={profile.photos?.[0] || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.user_id}`} 
          alt="Identity Primary" 
          className="w-full h-full object-cover scale-105"
        />
        {/* Gradient shadow to ground the text perfectly */}
        <div className="absolute inset-0 bg-gradient-to-t from-mat-obsidian via-mat-obsidian/40 to-transparent"></div>
        
        {/* Floating Typography */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 1.5, ease: [0.2, 0.8, 0.2, 1] }}
          className="absolute bottom-12 md:bottom-24 left-6 md:left-16 lg:left-24"
        >
          <div className="space-y-4">
             <div className="flex items-center gap-4">
                <span className="px-4 py-1.5 border border-mat-gold/30 text-mat-gold text-[9px] uppercase tracking-[0.3em] font-black rounded-full backdrop-blur-md bg-mat-obsidian/30">
                  {tier.label}
                </span>
                {profile.is_verified && (
                  <span className="px-4 py-1.5 bg-mat-wine text-mat-cream text-[9px] uppercase tracking-[0.3em] font-black rounded-full flex items-center gap-2 shadow-[0_0_15px_rgba(114,47,55,0.5)]">
                    <CheckCircle2 size={12} /> Sealed
                  </span>
                )}
             </div>
             
             <h1 className="mat-text-display-pro text-mat-cream leading-[0.8] tracking-tighter text-[4rem] sm:text-[6rem] md:text-[8rem] lg:text-[10rem]">
                {firstName} <br />
                {lastName && <span className="text-mat-cream/40 italic font-light">{lastName}</span>}
             </h1>
          </div>
        </motion.div>

        {/* Narrative Update Action */}
        <button 
           onClick={() => setIsEditing(true)}
           className="absolute top-6 md:top-12 right-6 md:right-12 w-12 h-12 md:w-16 md:h-16 rounded-full bg-mat-obsidian/40 backdrop-blur-xl border border-white/10 text-mat-cream flex items-center justify-center hover:bg-mat-wine transition-colors duration-500 z-10 group"
        >
           <Camera size={20} className="group-hover:scale-110 transition-transform" />
        </button>
      </div>

      {/* ─── SCENE 2: THE AURA ENGINE (Metrics & Ascension) ─── */}
      <div className="px-6 md:px-16 lg:px-24 py-24 space-y-32">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-8">
           
           {/* Aura & Streak Readout - Minimalist Data Style */}
           <div className="col-span-1 border-white/10 md:col-span-5 space-y-16">
              <div>
                 <p className="text-[10px] font-black uppercase tracking-[0.5em] text-mat-gold mb-6 italic">Aura Power</p>
                 <div className="flex items-baseline gap-4">
                    <h2 className="text-[5rem] md:text-[7rem] font-black italic tracking-tighter leading-none">{rankCount}</h2>
                    <span className="text-white/30 text-xl md:text-3xl font-light italic">/ {tier.next}</span>
                 </div>
                 <Separator className="bg-white/10 my-8" />
                 <p className="text-sm text-white/50 font-light leading-relaxed">
                   Your resonance signature dictates your visibility to Sovereign Observers. Ascend to <span className="text-mat-gold">{tier.next} Aura</span> to unlock the next strata of the sanctuary.
                 </p>
              </div>

              <div>
                 <p className="text-[10px] font-black uppercase tracking-[0.5em] text-mat-rose mb-6 italic">Streak Ritual</p>
                 <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-mat-wine/10 border border-mat-rose/20 rounded-full flex flex-col items-center justify-center">
                       <Flame className="text-mat-rose mb-1" size={24} />
                       <span className="text-xl font-bold font-serif">{profile.consecutive_days || 0}</span>
                    </div>
                    <div className="space-y-1 border-l border-white/10 pl-6">
                       <p className="text-xs text-white/40 uppercase tracking-widest font-black">Consecutive Dawns</p>
                       <p className="text-[10px] text-mat-gold italic">+10 Aura Daily Gift active</p>
                    </div>
                 </div>
              </div>
           </div>

           {/* Identity Ascension Checklist */}
           <div className="col-span-1 md:col-span-6 md:col-start-7">
              <div className="p-8 md:p-12 border border-white/5 bg-white/[0.02] rounded-[3rem] space-y-12 relative overflow-hidden backdrop-blur-sm">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-mat-gold/5 blur-[100px] rounded-full mix-blend-screen pointer-events-none" />
                 
                 <div className="space-y-2 relative z-10">
                    <Zap className="text-mat-gold mb-4" size={24} />
                    <h3 className="text-3xl md:text-4xl font-bold italic text-white leading-tight">Identity <span className="text-mat-gold/60">Ascension.</span></h3>
                 </div>
                 
                 <div className="space-y-4 relative z-10">
                    {[
                      { label: 'Seal Identity (Verify)', done: !!profile.is_verified, val: '+100 Aura', act: handleVerify },
                      { label: 'Narrative Portrait', done: (profile.photos?.length || 0) > 0, val: '+50 Aura', act: () => setIsEditing(true) },
                      { label: 'Roots & Academy', done: !!profile.education && !!profile.city, val: '+30 Aura', act: () => setIsEditing(true) }
                    ].map((task, i) => (
                      <button 
                        key={i} 
                        onClick={task.act} 
                        className={cn(
                          "w-full flex justify-between items-center p-5 md:p-6 rounded-[2rem] border transition-all duration-500", 
                          task.done ? "bg-white/5 border-white/5 opacity-50" : "bg-mat-wine/10 border-mat-rose/20 hover:bg-mat-wine/20 hover:border-mat-rose shadow-[0_0_20px_rgba(114,47,55,0.1)]"
                        )}
                      >
                         <div className="flex items-center gap-4 md:gap-6">
                            <div className={cn("w-8 h-8 md:w-10 md:h-10 rounded-xl md:rounded-2xl flex items-center justify-center", task.done ? "bg-mat-rose/20 text-mat-rose" : "bg-white/5 text-white/30")}>
                               <CheckCircle2 size={16} />
                            </div>
                            <span className="text-[10px] md:text-xs font-black text-white uppercase tracking-[0.2em]">{task.label}</span>
                         </div>
                         <span className="text-[9px] md:text-[10px] font-black text-mat-gold italic">{task.val}</span>
                      </button>
                    ))}
                 </div>
                 {!profile.is_verified && <Button variant="gold" size="lg" onClick={handleVerify} className="w-full mt-8 rounded-full h-14 uppercase tracking-widest font-black text-[10px]">Begin Seal Ritual</Button>}
              </div>
           </div>
        </div>

        {/* ─── SCENE 3: THE ORACLE (Metrics) ─── */}
        <div className="py-12 border-t border-white/10">
           <div className="mb-12">
              <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40 mb-2 italic">The Oracle / Market Dynamics</p>
              <h3 className="text-3xl font-bold italic text-white">Observer Engagement</h3>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { l: 'Impressions', v: metrics.impression, i: Eye, sub: 'Times your profile appeared in the sanctuary.' },
                { l: 'Deep Dives', v: metrics.visit, i: MousePointerClick, sub: 'Observers who opened your full dossier.' },
                { l: 'Resonances', v: metrics.save, i: Heart, sub: 'Observers who sparked a connection.' }
              ].map((m, idx) => (
                <div key={idx} className="p-8 border border-white/5 bg-white/[0.01] rounded-[2rem] space-y-8 flex flex-col justify-between group hover:bg-white/[0.03] transition-colors">
                   <div className="space-y-4">
                      <div className="w-12 h-12 bg-mat-wine/10 rounded-2xl flex items-center justify-center text-mat-rose group-hover:scale-110 transition-transform">
                         <m.i size={20} />
                      </div>
                      <h4 className="text-[11px] font-black text-white/60 uppercase tracking-[0.2em]">{m.l}</h4>
                   </div>
                   <div>
                      <p className="text-5xl font-serif text-white">{m.v}</p>
                      <p className="text-[10px] font-medium text-white/30 leading-snug mt-4">{m.sub}</p>
                   </div>
                </div>
              ))}
           </div>
        </div>

      </div>
    </div>
  );
};
