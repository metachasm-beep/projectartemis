import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Sparkles, Compass, Eye, Star, Zap, ShieldCheck, HelpCircle } from 'lucide-react';
import { SkillOrchestrator } from '@/services/SkillOrchestrator';

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
            <span className="font-mono text-[9px] tracking-[0.4em] uppercase font-black">Oracle Protocol</span>
            <span className="px-1.5 py-0 pb-1 bg-mat-wine/20 border border-mat-wine/30 rounded text-[7px] text-mat-wine font-bold tracking-widest">{vibeStatus}</span>
          </div>
          <Activity size={14} className="text-mat-wine animate-pulse" />
        </div>
        <div className="space-y-1">
          <div className="flex items-baseline gap-2">
            <span className="text-7xl font-bold text-mat-wine italic tracking-tighter leading-none" style={{ fontFamily: 'Playfair Display, serif' }}>
               {(resonance * 100).toFixed(0)}
            </span>
            <span className="text-mat-gold/60 text-sm font-mono tracking-widest">% RES</span>
          </div>
          <p className="font-mono text-[9px] opacity-40 uppercase tracking-[0.2em]">Resonance Amplitude</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="p-4 bg-mat-wine/5 border border-mat-wine/10 rounded-2xl backdrop-blur-md">
          <p className="text-[9px] text-mat-cream/60 leading-relaxed italic font-mono lowercase">
            &gt; ANALYZING_INTEGRITY...<br/>
            &gt; SYNC: {(resonance * 1.05).toFixed(2)} [STABLE]
          </p>
        </div>
        <button 
          onClick={onBeginDiscovery}
          className="w-full py-4 bg-mat-wine text-mat-cream font-mono text-[9px] rounded-2xl hover:bg-mat-gold hover:text-black transition-all flex items-center justify-center gap-3 font-black uppercase tracking-[0.3em] group shadow-lg shadow-mat-wine/20"
        >
          Initiate Ritual 
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
      {/* 🏛️ Integrated Identity (Pure Branding) */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
             {profile?.photos?.[0] ? (
               <div className="relative w-14 h-14 rounded-2xl overflow-hidden border border-mat-gold/30 shadow-lg">
                  <img src={profile.photos[0]} alt="Sovereign" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-mat-wine/40 to-transparent mix-blend-overlay"></div>
               </div>
             ) : (
               <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-md">
                  <span className="font-mono text-mat-gold/40 text-[8px] tracking-widest">ID</span>
               </div>
             )}
             <div className="space-y-0.5">
                <p className="font-mono text-[8px] text-white/30 uppercase tracking-[0.4em]">Logged Identity</p>
                <p className="text-mat-cream font-bold italic text-sm tracking-tight leading-none" style={{ fontFamily: 'Playfair Display, serif' }}>
                  {profile?.full_name || 'ANONYMOUS'}
                </p>
             </div>
          </div>
        </div>

        <div className="space-y-2">

           <div className="flex items-center gap-3">
             <p className="font-mono text-[9px] text-mat-gold/60 uppercase tracking-[0.5em]">Vitality Orbit</p>
             <span className="px-1.5 py-0 bg-mat-gold/10 border border-mat-gold/20 rounded text-[7px] text-mat-gold font-bold tracking-widest whitespace-nowrap">{circadianStatus}</span>
           </div>
           <h3 className="text-3xl font-bold italic text-white leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>Sanctuary Reserve.</h3>
        </div>
      </div>
      
      <div className="space-y-6">
        <div className="flex items-baseline gap-3">
           <span className="text-7xl font-bold text-mat-cream tracking-tighter italic leading-none" style={{ fontFamily: 'Fira Code, monospace' }}>
              {vitality.toFixed(2)}
           </span>
           <div className="space-y-1">
             <p className="text-[9px] text-mat-gold font-bold font-mono tracking-tighter uppercase">{(vitality * 100).toFixed(0)}% SYNC</p>
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
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <p className="font-mono text-[7px] opacity-40 uppercase mb-1 tracking-widest">Skin Health</p>
            <p className="text-mat-gold text-[10px] font-black italic">{skinLuminance}</p>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <p className="font-mono text-[7px] opacity-40 uppercase mb-1 tracking-widest">Cycle</p>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-mat-gold animate-pulse shadow-[0_0_5px_rgba(212,175,55,0.5)]" />
              <p className="text-white text-[10px] font-bold italic tracking-widest font-mono">LOCKED</p>
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
      <div className="space-y-3">
          <div className="flex items-center gap-3 text-white/30">
            <ShieldCheck size={16} strokeWidth={1.5} className="text-mat-gold" />
            <span className="font-mono text-[9px] uppercase tracking-[0.4em] font-black">Influence Domain</span>
          </div>
          <h4 className="text-3xl font-bold italic text-white tracking-widest leading-none drop-shadow-lg" style={{ fontFamily: 'Playfair Display, serif' }}>
            Social <span className="opacity-10 text-mat-gold">Regency.</span>
          </h4>
      </div>
      
      <div className="space-y-4">
        <div className="bg-mat-wine/5 rounded-3xl p-6 border border-white/5 shadow-inner">
           <div className="flex items-center justify-between mb-4">
              <div className="space-y-1">
                 <p className="font-mono text-[8px] text-white/30 uppercase tracking-[0.2em]">Authority Rank</p>
                 <p className="text-mat-gold text-xl font-bold italic leading-none" style={{ fontFamily: 'Playfair Display, serif' }}>{rank}</p>
              </div>
              <div className="text-right">
                <p className="text-[9px] font-mono text-mat-gold font-black">{authorityScore.toFixed(0)}%</p>
                <div className="w-10 h-1 bg-mat-gold/20 rounded-full mt-1 overflow-hidden">
                   <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: `${authorityScore}%` }}
                     className="h-full bg-mat-gold"
                   />
                </div>
              </div>
           </div>
           <p className="text-[9px] text-white/30 italic font-mono leading-tight uppercase tracking-tight">
            Registry verified. Status: {authorityScore > 50 ? 'ASCENDING' : 'SECURE'}.
           </p>
        </div>
      </div>
    </div>
  );
};

