import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Sparkles, Compass, Eye, Star, Zap, ShieldCheck, HelpCircle } from 'lucide-react';
import { SkillOrchestrator } from '@/services/SkillOrchestrator';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

/**
 * 🥂 OracleWidget: The Protocol Hub
 */
export const OracleWidget: React.FC<{ metrics: any; onBeginDiscovery?: () => void }> = ({ metrics, onBeginDiscovery }) => {
  const { resonance, vibeStatus } = SkillOrchestrator.getOracleIntelligence(metrics?.matches || 0);

  return (
    <div className="h-full flex flex-col justify-between">
      <div className="space-y-4">
        <div className="flex justify-between items-center text-[#0A0A0A]/30">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-[#D81E05]" />
            <span className="font-sans text-[10px] tracking-[0.4em] uppercase font-bold">Protocol_Alpha</span>
          </div>
          <Compass size={16} className="text-[#0A0A0A]" />
        </div>
        <div className="space-y-0.5">
          <div className="flex items-baseline gap-2">
            <span className="text-8xl font-bold text-[#0A0A0A] tracking-[-0.05em] leading-none uppercase" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
               {(resonance * 100).toFixed(0)}
            </span>
            <span className="text-[#D81E05] text-4xl font-bold tracking-tighter" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>%</span>
          </div>
          <p className="font-sans text-[10px] text-[#0A0A0A]/40 uppercase tracking-[0.3em] font-bold">Resonance Index</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="p-1 border-t-2 border-[#0A0A0A] pt-4 flex justify-between items-end">
          <div className="max-w-[70%] text-[10px] text-[#0A0A0A]/60 leading-tight uppercase font-bold tracking-widest">
            System identifies high-alignment patterns. Frequency is stable.
          </div>
          <div className="text-right text-[9px] font-mono text-[#0A0A0A]/20">001/SYNC</div>
        </div>
        <button 
          onClick={onBeginDiscovery}
          className="w-full py-6 bg-[#0A0A0A] text-white font-bold text-[12px] hover:bg-[#D81E05] transition-all flex items-center justify-center gap-4 uppercase tracking-[0.4em] group"
        >
          INITIATE DISCOVERY
          <Sparkles size={14} className="opacity-40 group-hover:opacity-100" />
        </button>
      </div>
    </div>
  );
};

/**
 * 🌿 SanctuaryWidget: Vitality Index
 */
export const SanctuaryWidget: React.FC<{ 
  metrics: any; 
  profile?: any; 
 }> = ({ metrics, profile }) => {
  const { vitality, circadianStatus } = SkillOrchestrator.getVitalityMetrics(metrics?.sessionSeconds || 0);

  return (
    <div className="h-full flex flex-col justify-between py-4">
      <div className="space-y-10">
        <div className="flex items-center justify-between border-b-2 border-white/20 pb-6">
           <div className="flex items-center gap-6">
             {profile?.photos?.[0] ? (
               <div className="w-24 h-24 border-2 border-white relative">
                  <img src={profile.photos[0]} alt="User" className="w-full h-full object-cover grayscale" />
                  <div className="absolute inset-0 bg-[#D81E05]/10 mix-blend-multiply" />
               </div>
             ) : (
               <div className="w-24 h-24 bg-white/10 border-2 border-white/20" />
             )}
             <div className="space-y-1">
                <p className="font-sans text-[10px] text-white/40 uppercase tracking-[0.4em] font-bold">Subject_Reference</p>
                <p className="text-white font-bold text-3xl tracking-tight uppercase" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                  {profile?.full_name || 'Anonymous'}
                </p>
             </div>
          </div>
        </div>

        <div className="space-y-1">
           <p className="font-sans text-[10px] text-[#D81E05] font-bold uppercase tracking-[0.4em]">Vitality_Status</p>
           <h3 className="text-6xl font-bold text-white tracking-[-0.05em] uppercase" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>INDEX:A1.</h3>
        </div>
      </div>
      
      <div className="space-y-8">
        <div className="flex items-baseline gap-6">
           <span className="text-[12rem] font-bold text-white tracking-tighter leading-none" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
              {vitality.toFixed(1)}
           </span>
           <div className="space-y-3">
             <p className="text-[12px] text-[#D81E05] font-bold tracking-[0.3em] uppercase">SYSTEM_STABLE</p>
             <div className="w-32 h-1 bg-white/10 relative">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${vitality * 100}%` }}
                  className="h-full bg-white"
                />
             </div>
           </div>
        </div>
        
         <div className="grid grid-cols-2 gap-1">
           <div className="p-6 border-2 border-white/10 bg-white/5">
             <p className="font-sans text-[10px] text-white/20 uppercase mb-2 tracking-[0.3em] font-bold">Balance</p>
             <p className="text-white text-xl font-bold uppercase" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Optimal</p>
           </div>
           <div className="p-6 border-2 border-white/10 bg-white/5">
             <p className="font-sans text-[10px] text-white/20 uppercase mb-2 tracking-[0.3em] font-bold">Harmonics</p>
             <div className="flex items-center gap-2">
               <div className="w-2 h-2 bg-[#D81E05]" />
               <p className="text-white text-xl font-bold tracking-tight uppercase" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Active</p>
             </div>
           </div>
         </div>
      </div>
    </div>
  );
};

/**
 * 📜 InfluenceWidget: Standing Index
 */
export const InfluenceWidget: React.FC<{ metrics: any }> = ({ metrics }) => {
  const { rank, authorityScore } = SkillOrchestrator.getInfluenceStatus(metrics?.matches || 0);

  return (
    <div className="h-full flex flex-col justify-between py-2 text-white">
      <div className="space-y-1">
          <div className="flex items-center gap-3 text-white/40">
            <Star size={18} strokeWidth={2} />
            <span className="font-sans text-[10px] uppercase tracking-[0.4em] font-bold">Authority_Reference</span>
          </div>
          <h4 className="text-5xl font-bold text-white tracking-[-0.05em] uppercase" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
            RANKING.
          </h4>
      </div>
      
      <div className="space-y-8">
        <div className="border-t-2 border-white/10 pt-10">
               <div className="flex items-center justify-between mb-8">
                  <div className="space-y-1">
                     <p className="font-sans text-[10px] text-white/20 uppercase tracking-[0.2em] font-bold">Placement</p>
                     <p className="text-white text-7xl font-bold tracking-tighter" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>#{rank.replace('#','')}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-[#D81E05]" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>{authorityScore.toFixed(0)}% Grace</p>
                    <div className="w-24 h-1 bg-white/10 mt-3 relative">
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: `${authorityScore}%` }}
                         className="h-full bg-white"
                       />
                    </div>
                  </div>
               </div>
               <div className="flex justify-between items-center text-[10px] font-mono text-white/20 uppercase tracking-widest">
                  <span>REF.002.STAND</span>
                  <span className="text-[#D81E05]">Verification_Active</span>
               </div>
            </div>
      </div>
    </div>
  );
};
