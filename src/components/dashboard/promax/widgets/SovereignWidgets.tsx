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
            <span className="font-mono text-[10px] tracking-[0.4em] uppercase font-black text-indigo-400">Discovery Protocol</span>
            <Tooltip>
               <TooltipTrigger asChild>
                  <span className="px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 rounded text-[9px] text-indigo-400 font-black tracking-[.2em] cursor-help uppercase">{vibeStatus}</span>
               </TooltipTrigger>
               <TooltipContent side="top">Current vibe alignment status</TooltipContent>
            </Tooltip>
          </div>
          <Activity size={14} className="text-indigo-500 animate-pulse" />
        </div>
        <div className="space-y-1">
          <Tooltip>
             <TooltipTrigger asChild>
                <div className="flex items-baseline gap-2 cursor-help">
                  <span className="text-6xl font-black text-white tracking-tighter leading-none font-body">
                     {(resonance * 100).toFixed(0)}
                  </span>
                  <span className="text-indigo-400/60 text-sm font-mono tracking-widest">% MATCH</span>
                </div>
             </TooltipTrigger>
             <TooltipContent side="right">Real-time resonance score with the sanctuary network</TooltipContent>
          </Tooltip>
          <p className="font-mono text-[9px] text-white/40 uppercase tracking-[0.4em]">Current Resonance</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl backdrop-blur-md">
          <p className="text-[10px] text-indigo-300 leading-relaxed font-mono uppercase tracking-widest">
            &gt; OPTIMIZING_SEARCH...<br/>
            &gt; STATUS: {(resonance * 1.05).toFixed(2)} [ACTIVE]
          </p>
        </div>
        <button 
          onClick={onBeginDiscovery}
          className="w-full py-5 bg-indigo-500 text-white font-body font-black text-[11px] rounded-2xl hover:bg-indigo-400 transition-all flex items-center justify-center gap-3 uppercase tracking-[0.4em] group shadow-xl shadow-indigo-500/20"
        >
          Begin Discovery
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
               <div className="relative w-14 h-14 rounded-2xl overflow-hidden border border-indigo-500/30 shadow-2xl">
                  <img src={profile.photos[0]} alt="User" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/40 to-transparent mix-blend-overlay"></div>
               </div>
             ) : (
               <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-md">
                  <span className="font-mono text-indigo-400 text-[10px] font-black tracking-widest">ID</span>
               </div>
             )}
             <div className="space-y-0.5">
                <p className="font-mono text-[9px] text-white/40 uppercase tracking-[0.4em]">Auth Identity</p>
                <p className="text-white font-black text-lg tracking-tight leading-none font-body uppercase">
                  {profile?.full_name || 'ANONYMOUS'}
                </p>
             </div>
          </div>
        </div>

        <div className="space-y-2">

           <div className="flex items-center gap-3">
             <p className="font-mono text-[9px] text-indigo-400 font-black uppercase tracking-[0.5em]">Activity Pulse</p>
             <span className="px-2 py-0.5 bg-indigo-500/20 border border-indigo-500/30 rounded text-[9px] text-indigo-400 font-black tracking-[.2em] whitespace-nowrap uppercase">{circadianStatus}</span>
           </div>
           <h3 className="text-3xl font-black text-white leading-tight font-body tracking-tighter uppercase">Nexus Vitality.</h3>
        </div>
      </div>
      
      <div className="space-y-6">
        <div className="flex items-baseline gap-3">
           <span className="text-7xl font-black text-white tracking-tighter leading-none font-body">
              {vitality.toFixed(2)}
           </span>
           <div className="space-y-1">
             <p className="text-[10px] text-indigo-400 font-black font-mono tracking-tighter uppercase">{(vitality * 100).toFixed(0)}% OPTIMAL</p>
             <div className="w-16 h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${vitality * 100}%` }}
                  className="h-full bg-indigo-500"
                />
             </div>
           </div>
        </div>
        
         <div className="grid grid-cols-2 gap-3">
           <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
             <p className="font-mono text-[9px] text-white/40 uppercase mb-1 tracking-widest">Integrity</p>
             <p className="text-indigo-400 text-[10px] font-black uppercase tracking-widest">{skinLuminance}</p>
           </div>
           <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
             <p className="font-mono text-[9px] text-white/40 uppercase mb-1 tracking-widest">Uplink</p>
             <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_8px_rgba(94,106,210,0.8)]" />
               <p className="text-white text-[10px] font-black tracking-[.2em] font-mono uppercase">Online</p>
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
            <ShieldCheck size={18} strokeWidth={2} className="text-indigo-400" />
            <span className="font-mono text-[10px] uppercase tracking-[0.4em] font-black">Influence Protocol</span>
          </div>
          <h4 className="text-2xl font-black text-white tracking-tighter leading-none font-body uppercase">
            Nexus <span className="text-indigo-500">Authority.</span>
          </h4>
      </div>
      
      <div className="space-y-2">
        <div className="bg-white/[0.03] rounded-3xl p-4 border border-white/5 shadow-inner">
               <div className="flex items-center justify-between mb-2">
                  <Tooltip>
                     <TooltipTrigger asChild>
                        <div className="space-y-0.5 cursor-help">
                           <p className="font-mono text-[9px] text-white/40 uppercase tracking-[0.2em]">Global Rank</p>
                           <p className="text-white text-2xl font-black font-body">{rank}</p>
                        </div>
                     </TooltipTrigger>
                     <TooltipContent side="top">Your absolute position in the Matriarch League</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                     <TooltipTrigger asChild>
                        <div className="text-right cursor-help">
                          <p className="text-[12px] font-mono text-indigo-400 font-black">{authorityScore.toFixed(0)}%</p>
                          <div className="w-10 h-1 bg-indigo-500/20 rounded-full mt-1 overflow-hidden">
                             <motion.div 
                               initial={{ width: 0 }}
                               animate={{ width: `${authorityScore}%` }}
                               className="h-full bg-indigo-400"
                             />
                          </div>
                        </div>
                     </TooltipTrigger>
                     <TooltipContent side="left">Dynamic influence score based on engagement quality</TooltipContent>
                  </Tooltip>
               </div>
               <p className="text-[9px] text-white/30 font-mono leading-tight uppercase tracking-widest">
                Account verified. Protocol Status: <span className="text-indigo-400">{authorityScore > 50 ? 'ASCENDING' : 'STABLE'}</span>.
               </p>
            </div>
      </div>
    </div>
  );
};
