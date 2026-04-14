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
        <div className="flex justify-between items-center text-mat-slate/30">
          <div className="flex items-center gap-2">
            <span className="font-sans text-[11px] tracking-[0.2em] uppercase font-bold">The Invitation</span>
            <Tooltip>
               <TooltipTrigger asChild>
                  <span className="px-3 py-1 bg-white/20 border border-mat-slate/5 rounded-full text-[10px] text-mat-slate/40 font-bold tracking-widest cursor-help uppercase shadow-sm">{vibeStatus}</span>
               </TooltipTrigger>
               <TooltipContent side="top">Your current sanctuary alignment</TooltipContent>
            </Tooltip>
          </div>
          <Compass size={16} className="text-mat-slate/30" />
        </div>
        <div className="space-y-1">
          <Tooltip>
             <TooltipTrigger asChild>
                <div className="flex items-baseline gap-2 cursor-help">
                  <span className="text-8xl font-normal text-mat-slate tracking-tighter leading-none" style={{ fontFamily: 'Italiana, serif' }}>
                     {(resonance * 100).toFixed(0)}
                  </span>
                  <span className="text-mat-slate/40 text-xl font-display italic tracking-tight" style={{ fontFamily: 'Italiana, serif' }}>% Connection</span>
                </div>
             </TooltipTrigger>
             <TooltipContent side="right">Daily potential score</TooltipContent>
          </Tooltip>
          <p className="font-sans text-[10px] text-mat-slate/30 uppercase tracking-[0.2em] font-bold">Match Potential</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="p-4 bg-white/10 border border-mat-slate/5 rounded-[2rem] italic text-[11px] text-mat-slate/50 leading-relaxed shadow-inner">
          Aligning with the daily rhythm. Your presence is stable and receptive.
        </div>
        <button 
          onClick={onBeginDiscovery}
          className="w-full py-5 bg-mat-slate text-[#DED8D1] font-bold text-[11px] rounded-[1.8rem] hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-3 uppercase tracking-[0.3em] group shadow-[0_30px_60px_rgba(0,0,0,0.15)]"
        >
          View Candidates
          <Sparkles size={14} className="opacity-40 group-hover:scale-110 transition-transform" />
        </button>
      </div>
    </div>
  );
};

/**
 * 🌿 SanctuaryWidget: My Daily Vitality
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
               <div className="relative w-20 h-20 rounded-[2rem] overflow-hidden border-4 border-white shadow-xl">
                  <img src={profile.photos[0]} alt="User" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-mat-slate/5 mix-blend-multiply"></div>
               </div>
             ) : (
               <div className="w-20 h-20 rounded-[2rem] bg-white/10 border border-mat-slate/5 flex items-center justify-center shadow-inner">
                  <span className="font-display text-mat-slate/20 text-2xl">M</span>
               </div>
             )}
             <div className="space-y-0.5">
                <p className="font-sans text-[10px] text-mat-slate/30 uppercase tracking-[0.1em] font-bold">Identity</p>
                <p className="text-mat-slate font-normal text-2xl tracking-tight leading-none uppercase" style={{ fontFamily: 'Italiana, serif' }}>
                  {profile?.full_name || 'My Sanctuary'}
                </p>
             </div>
          </div>
        </div>

        <div className="space-y-3">
           <div className="flex items-center gap-3">
             <p className="font-sans text-[10px] text-mat-slate/40 font-bold uppercase tracking-[0.2em]">Rhythm</p>
             <span className="px-3 py-1 bg-white/40 border border-mat-slate/5 rounded-full text-[9px] text-mat-slate/60 font-bold tracking-widest whitespace-nowrap uppercase shadow-sm">{circadianStatus}</span>
           </div>
           <h3 className="text-5xl font-normal text-mat-slate leading-tight tracking-tighter uppercase" style={{ fontFamily: 'Italiana, serif' }}>Vitality.</h3>
        </div>
      </div>
      
      <div className="space-y-6">
        <div className="flex items-baseline gap-4">
           <span className="text-[10rem] font-normal text-mat-slate tracking-tighter leading-none" style={{ fontFamily: 'Italiana, serif' }}>
              {vitality.toFixed(1)}
           </span>
           <div className="space-y-2">
             <p className="text-[10px] text-mat-slate/30 font-bold tracking-widest uppercase">{(vitality * 100).toFixed(0)}% Harmony</p>
             <div className="w-24 h-2 bg-white/20 rounded-full overflow-hidden shadow-inner border border-mat-slate/5">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${vitality * 100}%` }}
                  className="h-full bg-mat-slate/20"
                />
             </div>
           </div>
        </div>
        
         <div className="grid grid-cols-2 gap-4">
           <div className="p-4 rounded-[1.5rem] bg-white/40 shadow-sm border border-white/10">
             <p className="font-sans text-[10px] text-mat-slate/40 uppercase mb-1 tracking-widest font-bold">Inner State</p>
             <p className="text-mat-slate/60 text-[12px] font-normal uppercase tracking-widest" style={{ fontFamily: 'Italiana, serif' }}>High Balance</p>
           </div>
           <div className="p-4 rounded-[1.5rem] bg-white/40 shadow-sm border border-white/10">
             <p className="font-sans text-[10px] text-mat-slate/40 uppercase mb-1 tracking-widest font-bold">Core Link</p>
             <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-mat-slate/30" />
               <p className="text-mat-slate/60 text-[12px] font-normal tracking-widest uppercase" style={{ fontFamily: 'Italiana, serif' }}>Radiant</p>
             </div>
           </div>
         </div>
      </div>
    </div>
  );
};

/**
 * 📜 InfluenceWidget: My Sanctuary Standin
 */
export const InfluenceWidget: React.FC<{ metrics: any }> = ({ metrics }) => {
  const { rank, authorityScore } = SkillOrchestrator.getInfluenceStatus(metrics?.matches || 0);

  return (
    <div className="h-full flex flex-col justify-between py-1">
      <div className="space-y-2">
          <div className="flex items-center gap-3 text-mat-slate/30">
            <Star size={18} strokeWidth={2} />
            <span className="font-sans text-[11px] uppercase tracking-[0.2em] font-bold">My Standing</span>
          </div>
          <h4 className="text-4xl font-normal text-mat-slate tracking-tighter leading-none uppercase" style={{ fontFamily: 'Italiana, serif' }}>
            Presence.
          </h4>
      </div>
      
      <div className="space-y-4">
        <div className="bg-white/10 rounded-[2rem] p-6 border border-mat-slate/5 shadow-inner">
               <div className="flex items-center justify-between mb-6">
                  <Tooltip>
                     <TooltipTrigger asChild>
                        <div className="space-y-0.5 cursor-help">
                           <p className="font-sans text-[10px] text-mat-slate/30 uppercase tracking-[0.1em] font-bold">Rank</p>
                           <p className="text-mat-slate text-4xl font-normal" style={{ fontFamily: 'Italiana, serif' }}>{rank}</p>
                        </div>
                     </TooltipTrigger>
                     <TooltipContent side="top">Your position in the collective</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                     <TooltipTrigger asChild>
                        <div className="text-right cursor-help">
                          <p className="text-[16px] font-normal text-mat-slate/60" style={{ fontFamily: 'Italiana, serif' }}>{authorityScore.toFixed(0)}% Grace</p>
                          <div className="w-16 h-2 bg-white/20 rounded-full mt-2 overflow-hidden shadow-inner">
                             <motion.div 
                               initial={{ width: 0 }}
                               animate={{ width: `${authorityScore}%` }}
                               className="h-full bg-mat-slate/20"
                             />
                          </div>
                        </div>
                     </TooltipTrigger>
                     <TooltipContent side="left">Reflection of your standing</TooltipContent>
                  </Tooltip>
               </div>
               <p className="text-[10px] text-mat-slate/30 font-sans leading-tight uppercase tracking-widest font-bold">
                Daily presence is <span className="text-mat-slate/60">Exceptional</span>.
               </p>
            </div>
      </div>
    </div>
  );
};
