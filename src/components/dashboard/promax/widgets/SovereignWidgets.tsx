import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Sparkles, Compass, Eye, Star, Zap, ShieldCheck, HelpCircle } from 'lucide-react';
import { SkillOrchestrator } from '@/services/SkillOrchestrator';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

/**
 * 👁️ OracleWidget: The Insight Hub (Condensed)
 */
export const OracleWidget: React.FC<{ metrics: any; onBeginDiscovery?: () => void }> = ({ metrics, onBeginDiscovery }) => {
  const { resonance, vibeStatus } = SkillOrchestrator.getOracleIntelligence(metrics?.matches || 0);

  return (
    <div className="h-full flex flex-col justify-between">
      <div className="space-y-4">
        <div className="flex justify-between items-center text-white/40">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[12px] tracking-[0.4em] uppercase font-black text-white">Discovery Status</span>
            <Tooltip>
               <TooltipTrigger asChild>
                  <span className="px-2 py-0.5 bg-mat-wine/30 border border-mat-wine/40 rounded text-[11px] text-mat-wine font-black tracking-widest cursor-help">{vibeStatus}</span>
               </TooltipTrigger>
               <TooltipContent side="top">Current vibe alignment status</TooltipContent>
            </Tooltip>
          </div>
          <Activity size={14} className="text-mat-wine animate-pulse" />
        </div>
        <div className="space-y-1">
          <Tooltip>
             <TooltipTrigger asChild>
                <div className="flex items-baseline gap-2 cursor-help">
                  <span className="text-6xl font-bold text-mat-wine italic tracking-tighter leading-none" style={{ fontFamily: 'Playfair Display, serif' }}>
                     {(resonance * 100).toFixed(0)}
                  </span>
                  <span className="text-mat-gold/60 text-sm font-mono tracking-widest">% MATCH</span>
                </div>
             </TooltipTrigger>
             <TooltipContent side="right">Real-time resonance score with the sanctuary network</TooltipContent>
          </Tooltip>
          <p className="font-mono text-[11px] text-white/80 uppercase tracking-[0.2em]">Match Potential</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="p-4 bg-mat-wine/5 border border-mat-wine/10 rounded-2xl backdrop-blur-md">
          <p className="text-[11px] text-mat-cream leading-relaxed italic font-mono lowercase">
            &gt; OPTIMIZING_SEARCH...<br/>
            &gt; STATUS: {(resonance * 1.05).toFixed(2)} [STABLE]
          </p>
        </div>
        <button 
          onClick={onBeginDiscovery}
          className="w-full py-5 bg-mat-wine text-mat-cream font-mono text-[13px] rounded-2xl hover:bg-mat-gold hover:text-black transition-all flex items-center justify-center gap-3 font-black uppercase tracking-[0.3em] group shadow-lg shadow-mat-wine/20"
        >
          Find Matches 
          <Sparkles size={12} strokeWidth={3} className="group-hover:animate-spin" />
        </button>
      </div>
    </div>
  );
};

/**
 * 🌿 SanctuaryWidget: The Vitality Hub & Identity Center
 */
export const SanctuaryWidget: React.FC<{ 
  metrics: any; 
  profile?: any; 
}> = ({ metrics, profile }) => {
  const { vitality, circadianStatus, skinLuminance } = SkillOrchestrator.getVitalityMetrics(metrics?.sessionSeconds || 0);

  return (
    <div className="h-full flex flex-col justify-between py-2">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
             {profile?.photos?.[0] ? (
               <div className="relative w-14 h-14 rounded-2xl overflow-hidden border border-mat-gold/30 shadow-lg">
                  <img src={profile.photos[0]} alt="User" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-mat-wine/40 to-transparent mix-blend-overlay"></div>
               </div>
             ) : (
               <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-md">
                  <span className="font-mono text-mat-gold text-[11px] font-black tracking-widest">ID</span>
               </div>
             )}
             <div className="space-y-0.5">
                <p className="font-mono text-[11px] text-white/80 uppercase tracking-[0.4em]">Profile Info</p>
                <p className="text-mat-cream font-bold italic text-sm tracking-tight leading-none" style={{ fontFamily: 'Playfair Display, serif' }}>
                  {profile?.full_name || 'ANONYMOUS'}
                </p>
             </div>
          </div>
        </div>

        <div className="space-y-2">

           <div className="flex items-center gap-3">
             <p className="font-mono text-[11px] text-mat-gold font-black uppercase tracking-[0.5em]">User Activity</p>
             <span className="px-2 py-0.5 bg-mat-gold/20 border border-mat-gold/30 rounded text-[11px] text-mat-gold font-bold tracking-widest whitespace-nowrap">{circadianStatus}</span>
           </div>
           <h3 className="text-3xl font-bold italic text-white leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>Daily Progress.</h3>
        </div>
      </div>
      
      <div className="space-y-6">
        <div className="flex items-baseline gap-3">
           <span className="text-7xl font-bold text-mat-cream tracking-tighter italic leading-none" style={{ fontFamily: 'Fira Code, monospace' }}>
              {vitality.toFixed(2)}
           </span>
           <div className="space-y-1">
             <p className="text-[12px] text-mat-gold font-black font-mono tracking-tighter uppercase">{(vitality * 100).toFixed(0)}% ACTIVE</p>
             <div className="w-16 h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${vitality * 100}%` }}
                  className="h-full bg-mat-gold opacity-50"
                />
             </div>
           </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-white/10 border border-white/20">
            <p className="font-mono text-[11px] text-white/60 uppercase mb-1 tracking-widest">Profile Health</p>
            <p className="text-mat-gold text-[12px] font-black italic">{skinLuminance}</p>
          </div>
          <div className="p-3 rounded-xl bg-white/10 border border-white/20">
            <p className="font-mono text-[11px] text-white/60 uppercase mb-1 tracking-widest">Status</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-mat-gold animate-pulse shadow-[0_0_5px_rgba(212,175,55,0.7)]" />
              <p className="text-white text-[12px] font-bold italic tracking-widest font-mono">ONLINE</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * 📜 InfluenceWidget: The Authority Hub (Condensed)
 */
export const InfluenceWidget: React.FC<{ metrics: any }> = ({ metrics }) => {
  const { rank, authorityScore } = SkillOrchestrator.getInfluenceStatus(metrics?.matches || 0);

  return (
    <div className="h-full flex flex-col justify-between py-1">
      <div className="space-y-1.5">
          <div className="flex items-center gap-3 text-white">
            <ShieldCheck size={18} strokeWidth={2} className="text-mat-gold" />
            <span className="font-mono text-[12px] uppercase tracking-[0.4em] font-black">Activity Rank</span>
          </div>
          <h4 className="text-2xl font-bold italic text-white tracking-widest leading-none drop-shadow-lg" style={{ fontFamily: 'Playfair Display, serif' }}>
            My <span className="opacity-10 text-mat-gold">Standing.</span>
          </h4>
      </div>
      
      <div className="space-y-2">
        <div className="bg-mat-wine/5 rounded-3xl p-4 border border-white/5 shadow-inner">
               <div className="flex items-center justify-between mb-2">
                  <Tooltip>
                     <TooltipTrigger asChild>
                        <div className="space-y-0.5 cursor-help">
                           <p className="font-mono text-[11px] text-white/60 uppercase tracking-[0.2em]">Global Rank</p>
                           <p className="text-mat-gold text-2xl font-bold italic leading-none" style={{ fontFamily: 'Playfair Display, serif' }}>{rank}</p>
                        </div>
                     </TooltipTrigger>
                     <TooltipContent side="top">Your absolute position in the Matriarch League</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                     <TooltipTrigger asChild>
                        <div className="text-right cursor-help">
                          <p className="text-[12px] font-mono text-mat-gold font-black">{authorityScore.toFixed(0)}%</p>
                          <div className="w-10 h-1 bg-mat-gold/20 rounded-full mt-1 overflow-hidden">
                             <motion.div 
                               initial={{ width: 0 }}
                               animate={{ width: `${authorityScore}%` }}
                               className="h-full bg-mat-gold"
                             />
                          </div>
                        </div>
                     </TooltipTrigger>
                     <TooltipContent side="left">Dynamic influence score based on engagement quality</TooltipContent>
                  </Tooltip>
               </div>
               <p className="text-[10px] text-white/60 italic font-mono leading-tight uppercase tracking-tight">
                Account verified. Status: {authorityScore > 50 ? 'ASCENDING' : 'SECURE'}.
               </p>
            </div>
      </div>
    </div>
  );
};
