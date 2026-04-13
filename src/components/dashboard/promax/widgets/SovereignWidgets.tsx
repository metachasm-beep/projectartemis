import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Sparkles, Compass, Eye, Star, Zap, ShieldCheck } from 'lucide-react';
import { SkillOrchestrator } from '@/services/SkillOrchestrator';

/**
 * 👁️ OracleWidget: The Insight Hub
 */
export const OracleWidget: React.FC<{ metrics: any; onBeginDiscovery?: () => void }> = ({ metrics, onBeginDiscovery }) => {
  const { resonance, vibeStatus } = SkillOrchestrator.getOracleIntelligence(metrics?.matches || 0);

  return (
    <div className="h-full flex flex-col justify-between">
      <div className="space-y-6">
        <div className="flex justify-between items-center text-white/40">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] tracking-[0.4em] uppercase font-black">Oracle Protocol</span>
            <span className="px-2 py-0.5 bg-mat-wine/20 border border-mat-wine/30 rounded text-[8px] text-mat-wine font-bold tracking-widest">{vibeStatus}</span>
          </div>
          <Activity size={16} className="text-mat-wine animate-pulse" />
        </div>
        <div className="space-y-2">
          <div className="flex items-baseline gap-2">
            <span className="text-[5.5rem] font-bold text-mat-wine italic tracking-tighter leading-none" style={{ fontFamily: 'Playfair Display, serif' }}>
               {(resonance * 100).toFixed(0)}
            </span>
            <span className="text-mat-gold/60 text-lg font-mono tracking-widest">% RES</span>
          </div>
          <p className="font-mono text-[10px] opacity-40 uppercase tracking-[0.2em]">Live Resonance Amplitude</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="p-5 bg-[#722f37]/10 border border-[#722f37]/20 rounded-3xl backdrop-blur-md">
          <p className="text-[10px] text-mat-cream/80 leading-relaxed italic font-mono lowercase">
            &gt; ANALYZING_SUITOR_INTEGRITY...<br/>
            &gt; SYNC_THRESHOLD: {(resonance * 1.05).toFixed(2)} [HIGH]<br/>
            &gt; FREQUENCY: STABLE_ALPHA
          </p>
        </div>
        <button 
          onClick={onBeginDiscovery}
          className="w-full py-5 bg-[#722f37] text-mat-cream font-mono text-[10px] rounded-3xl hover:bg-mat-gold hover:text-black transition-all flex items-center justify-center gap-3 shadow-[0_20px_40px_rgba(114,47,55,0.3)] font-black uppercase tracking-[0.3em] group"
        >
          Initiate Discovery Ritual 
          <Sparkles size={14} strokeWidth={3} className="group-hover:animate-spin" />
        </button>
      </div>
    </div>
  );
};

/**
 * 🌿 SanctuaryWidget: The Vitality Hub
 */
export const SanctuaryWidget: React.FC<{ metrics: any }> = ({ metrics }) => {
  const { vitality, circadianStatus, skinLuminance } = SkillOrchestrator.getVitalityMetrics(metrics?.sessionSeconds || 0);

  return (
    <div className="h-full flex flex-col justify-between">
      <div className="flex justify-between items-start">
        <div className="space-y-3">
           <div className="flex items-center gap-3">
             <p className="font-mono text-[10px] text-mat-gold uppercase tracking-[0.5em]">Sanctuary Resonance</p>
             <span className="px-2 py-0.5 bg-mat-gold/10 border border-mat-gold/20 rounded text-[8px] text-mat-gold font-bold tracking-widest">{circadianStatus}</span>
           </div>
           <h3 className="text-4xl font-bold italic text-white leading-none" style={{ fontFamily: 'Playfair Display, serif' }}>Vitality Orbit.</h3>
        </div>
        <div className="p-5 bg-mat-gold/10 rounded-3xl border border-mat-gold/20 backdrop-blur-2xl shadow-xl shadow-mat-gold/5">
          <Compass className="text-mat-gold w-8 h-8 animate-spin-slow" strokeWidth={1} />
        </div>
      </div>
      
      <div className="space-y-8">
        <div className="flex items-baseline gap-4">
           <span className="text-8xl font-bold text-mat-cream tracking-tighter italic leading-none" style={{ fontFamily: 'Fira Code, monospace' }}>
              {vitality.toFixed(2)}
           </span>
           <p className="text-[11px] text-white/30 italic max-w-[180px] leading-relaxed font-mono tracking-tight uppercase">
            Metabolic Sync: <span className="text-mat-gold">{vitality > 0.85 ? 'PEAK' : 'OPTIMIZING'}</span>
           </p>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 group cursor-default">
            <p className="font-mono text-[8px] opacity-40 uppercase mb-1">Skin Health</p>
            <p className="text-mat-gold text-sm font-bold italic group-hover:text-white transition-colors">{skinLuminance}</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 group cursor-default">
            <p className="font-mono text-[8px] opacity-40 uppercase mb-1">Circadian</p>
            <p className="text-mat-gold text-sm font-bold italic group-hover:text-white transition-colors">LOCKED</p>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * 📜 InfluenceWidget: The Authority Hub
 */
export const InfluenceWidget: React.FC<{ metrics: any }> = ({ metrics }) => {
  const { rank, authorityScore } = SkillOrchestrator.getInfluenceStatus(metrics?.matches || 0);

  return (
    <div className="h-full flex flex-col justify-between">
      <div className="space-y-6">
          <div className="flex items-center gap-4 text-white/40">
            <ShieldCheck size={20} strokeWidth={1.5} className="text-mat-gold" />
            <span className="font-mono text-[10px] uppercase tracking-[0.4em] font-black">Influence Protocol</span>
          </div>
          <h4 className="text-4xl font-bold italic text-white tracking-widest leading-none drop-shadow-lg" style={{ fontFamily: 'Playfair Display, serif' }}>
            Social <span className="opacity-10 text-mat-gold">Regency.</span>
          </h4>
      </div>
      
      <div className="space-y-6">
        <div className="bg-[#0a0a0a]/80 rounded-[2.5rem] p-8 border border-white/5 shadow-2xl">
           <div className="flex items-center justify-between mb-4">
              <div className="space-y-1">
                 <p className="font-mono text-[9px] text-white/30 uppercase tracking-[0.2em]">Authority Rank</p>
                 <p className="text-mat-gold text-2xl font-bold italic leading-none" style={{ fontFamily: 'Playfair Display, serif' }}>{rank}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-mono text-mat-gold font-bold">{authorityScore.toFixed(1)}%</p>
                <div className="w-12 h-1 bg-mat-gold/20 rounded-full mt-1 overflow-hidden">
                   <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: `${authorityScore}%` }}
                     className="h-full bg-mat-gold"
                   />
                </div>
              </div>
           </div>
           <p className="text-[11px] text-white/40 italic font-mono leading-tight">
            Network strength verified. Resonance arch currently {authorityScore > 50 ? 'EXPANDING' : 'STABILIZING'}.
           </p>
        </div>
      </div>
    </div>
  );
};
