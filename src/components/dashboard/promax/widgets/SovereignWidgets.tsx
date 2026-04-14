import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Sparkles, Compass, Eye, Star, Zap, ShieldCheck, HelpCircle } from 'lucide-react';
import { SkillOrchestrator } from '@/services/SkillOrchestrator';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

/**
 * 🥂 OracleWidget: The Invitation Hub
 */
export const OracleWidget: React.FC<{ metrics: any; onBeginDiscovery?: () => void }> = ({ metrics, onBeginDiscovery }) => {
  const { resonance, vibeStatus } = SkillOrchestrator.getOracleIntelligence(metrics?.matches || 0);

  return (
    <div className="h-full flex flex-col justify-between">
      <div className="space-y-4">
        <div className="flex justify-between items-center text-mat-slate/40">
          <div className="flex items-center gap-2">
            <span className="font-sans text-[11px] tracking-[0.2em] uppercase font-bold text-mat-gold">The Invitation</span>
            <Tooltip>
               <TooltipTrigger asChild>
                  <span className="px-3 py-1 bg-mat-ivory border border-mat-gold/20 rounded-full text-[10px] text-mat-gold font-bold tracking-widest cursor-help uppercase shadow-sm">{vibeStatus}</span>
               </TooltipTrigger>
               <TooltipContent side="top">Your alignment with the sanctuary</TooltipContent>
            </Tooltip>
          </div>
          <Compass size={16} className="text-mat-gold" />
        </div>
        <div className="space-y-1">
          <Tooltip>
             <TooltipTrigger asChild>
                <div className="flex items-baseline gap-2 cursor-help">
                  <span className="text-7xl font-bold text-mat-slate tracking-tighter leading-none italic" style={{ fontFamily: 'Playfair Display, serif' }}>
                     {(resonance * 100).toFixed(0)}
                  </span>
                  <span className="text-mat-gold text-lg font-display italic tracking-tight" style={{ fontFamily: 'Playfair Display, serif' }}>% Connection</span>
                </div>
             </TooltipTrigger>
             <TooltipContent side="right">Personal connection potential today</TooltipContent>
          </Tooltip>
          <p className="font-sans text-[10px] text-mat-slate/40 uppercase tracking-[0.2em] font-bold">Match Potential</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="p-4 bg-mat-ivory/50 border border-mat-gold/10 rounded-3xl shadow-inner italic text-[11px] text-mat-slate/60 leading-relaxed">
          The stars are aligning for a significant encounter. Your presence is radiating high stability.
        </div>
        <button 
          onClick={onBeginDiscovery}
          className="w-full py-5 bg-mat-gold text-white font-bold text-[11px] rounded-[2rem] hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-3 uppercase tracking-[0.3em] group shadow-[0_15px_30px_rgba(212,175,55,0.2),inset_0_-4px_0_rgba(0,0,0,0.1)]"
        >
          View Candidates
          <Sparkles size={14} className="group-hover:rotate-12 transition-transform" />
        </button>
      </div>
    </div>
  );
};

/**
 * 🌿 SanctuaryWidget: Daily Vitality
 */
export const SanctuaryWidget: React.FC<{ 
  metrics: any; 
  profile?: any; 
}> = ({ metrics, profile }) => {
  const { vitality, circadianStatus } = SkillOrchestrator.getVitalityMetrics(metrics?.sessionSeconds || 0);

  return (
    <div className="h-full flex flex-col justify-between py-2">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
             {profile?.photos?.[0] ? (
               <div className="relative w-16 h-16 rounded-[1.5rem] overflow-hidden border-2 border-white shadow-lg">
                  <img src={profile.photos[0]} alt="User" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-mat-gold/10 mix-blend-overlay"></div>
               </div>
             ) : (
               <div className="w-16 h-16 rounded-[1.5rem] bg-mat-ivory border border-mat-gold/10 flex items-center justify-center shadow-inner">
                  <span className="font-display italic text-mat-gold text-lg">M</span>
               </div>
             )}
             <div className="space-y-0.5">
                <p className="font-sans text-[10px] text-mat-slate/40 uppercase tracking-[0.2em] font-bold">Personal Identity</p>
                <p className="text-mat-slate font-bold text-xl tracking-tight leading-none italic uppercase" style={{ fontFamily: 'Playfair Display, serif' }}>
                  {profile?.full_name || 'My Sanctuary'}
                </p>
             </div>
          </div>
        </div>

        <div className="space-y-2">
           <div className="flex items-center gap-3">
             <p className="font-sans text-[10px] text-mat-gold font-bold uppercase tracking-[0.2em]">Activity Rhythm</p>
             <span className="px-3 py-1 bg-mat-ivory border border-mat-gold/20 rounded-full text-[9px] text-mat-gold font-bold tracking-widest whitespace-nowrap uppercase shadow-sm">{circadianStatus}</span>
           </div>
           <h3 className="text-4xl font-bold text-mat-slate leading-tight italic tracking-tighter uppercase" style={{ fontFamily: 'Playfair Display, serif' }}>Daily Vitality.</h3>
        </div>
      </div>
      
      <div className="space-y-6">
        <div className="flex items-baseline gap-3">
           <span className="text-8xl font-bold text-mat-slate tracking-tighter leading-none italic" style={{ fontFamily: 'Playfair Display, serif' }}>
              {vitality.toFixed(1)}
           </span>
           <div className="space-y-2">
             <p className="text-[10px] text-mat-gold font-bold tracking-widest uppercase">{(vitality * 100).toFixed(0)}% OPTIMAL</p>
             <div className="w-20 h-2 bg-mat-ivory rounded-full overflow-hidden shadow-inner border border-mat-gold/5">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${vitality * 100}%` }}
                  className="h-full bg-mat-gold shadow-[0_0_10px_rgba(212,175,55,0.4)]"
                />
             </div>
           </div>
        </div>
        
         <div className="grid grid-cols-2 gap-4">
           <div className="p-4 rounded-2xl bg-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.02),0_1px_1px_rgba(255,255,255,1)] border border-mat-gold/5">
             <p className="font-sans text-[10px] text-mat-slate/40 uppercase mb-1 tracking-widest font-bold">Inner Balance</p>
             <p className="text-mat-gold text-[11px] font-bold uppercase tracking-widest italic" style={{ fontFamily: 'Playfair Display, serif' }}>High Harmony</p>
           </div>
           <div className="p-4 rounded-2xl bg-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.02),0_1px_1px_rgba(255,255,255,1)] border border-mat-gold/5">
             <p className="font-sans text-[10px] text-mat-slate/40 uppercase mb-1 tracking-widest font-bold">Aura Sync</p>
             <div className="flex items-center gap-2">
               <div className="w-2.5 h-2.5 rounded-full bg-mat-gold shadow-[0_0_8px_rgba(212,175,55,0.6)]" />
               <p className="text-mat-slate text-[11px] font-bold tracking-widest uppercase italic" style={{ fontFamily: 'Playfair Display, serif' }}>Radiant</p>
             </div>
           </div>
         </div>
      </div>
    </div>
  );
};

/**
 * 📜 InfluenceWidget: My Standing
 */
export const InfluenceWidget: React.FC<{ metrics: any }> = ({ metrics }) => {
  const { rank, authorityScore } = SkillOrchestrator.getInfluenceStatus(metrics?.matches || 0);

  return (
    <div className="h-full flex flex-col justify-between py-1">
      <div className="space-y-2">
          <div className="flex items-center gap-3 text-mat-gold">
            <Star size={18} strokeWidth={2} />
            <span className="font-sans text-[11px] uppercase tracking-[0.2em] font-bold">Personal Standing</span>
          </div>
          <h4 className="text-3xl font-bold text-mat-slate tracking-tighter leading-none italic uppercase" style={{ fontFamily: 'Playfair Display, serif' }}>
            My <span className="text-mat-gold">Presence.</span>
          </h4>
      </div>
      
      <div className="space-y-4">
        <div className="bg-mat-ivory/50 rounded-[2rem] p-5 border border-mat-gold/10 shadow-inner">
               <div className="flex items-center justify-between mb-4">
                  <Tooltip>
                     <TooltipTrigger asChild>
                        <div className="space-y-0.5 cursor-help">
                           <p className="font-sans text-[10px] text-mat-slate/40 uppercase tracking-[0.1em] font-bold">Circle Rank</p>
                           <p className="text-mat-slate text-3xl font-bold italic" style={{ fontFamily: 'Playfair Display, serif' }}>{rank}</p>
                        </div>
                     </TooltipTrigger>
                     <TooltipContent side="top">Your current standing within the sanctuary</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                     <TooltipTrigger asChild>
                        <div className="text-right cursor-help">
                          <p className="text-[14px] font-bold text-mat-gold italic" style={{ fontFamily: 'Playfair Display, serif' }}>{authorityScore.toFixed(0)}% Grace</p>
                          <div className="w-14 h-2 bg-mat-gold/10 rounded-full mt-2 overflow-hidden shadow-inner">
                             <motion.div 
                               initial={{ width: 0 }}
                               animate={{ width: `${authorityScore}%` }}
                               className="h-full bg-mat-gold"
                             />
                          </div>
                        </div>
                     </TooltipTrigger>
                     <TooltipContent side="left">Reflection of your engagement quality</TooltipContent>
                  </Tooltip>
               </div>
               <p className="text-[10px] text-mat-slate/40 font-sans leading-tight uppercase tracking-widest font-bold">
                Account stability is <span className="text-mat-gold">Exceptional</span>.
               </p>
            </div>
      </div>
    </div>
  );
};
