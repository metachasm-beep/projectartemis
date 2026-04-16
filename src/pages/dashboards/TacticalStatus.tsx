import React, { useState, useEffect } from 'react';
import { Shield, Zap, Wifi, Activity, Terminal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface TacticalStatusProps {
  metrics: {
    totalMen: number;
    totalWomen: number;
  };
}

export const TacticalStatus: React.FC<TacticalStatusProps> = ({ metrics }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-10 py-6 bg-slate-950/40 border-b border-emerald-500/10 backdrop-blur-xl relative overflow-hidden group">
      {/* Scanning Line Animation */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-5">
         <div className="w-full h-[2px] bg-emerald-400 absolute animate-[scan_4s_linear_infinite]" 
              style={{ backgroundImage: 'linear-gradient(to right, transparent, #10b981, transparent)' }} />
      </div>

      <div className="flex items-center gap-8 relative z-10">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 text-emerald-500 mb-1">
             <Shield size={14} className="animate-pulse" />
             <span className="text-[10px] font-black uppercase tracking-[0.4em]">Sovereign Oversight</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-widest uppercase italic">
            Observer <span className="text-emerald-500/30">Protocol.</span>
          </h1>
        </div>

        <div className="hidden lg:flex items-center gap-px bg-emerald-500/5 p-1 rounded-xl border border-emerald-500/10">
           <div className="px-4 py-2 flex flex-col items-center">
              <span className="text-[8px] font-bold text-emerald-500/40 uppercase tracking-widest">Nodes</span>
              <span className="text-xs font-mono font-black text-white">{(metrics.totalMen + metrics.totalWomen).toLocaleString()}</span>
           </div>
           <div className="w-px h-8 bg-emerald-500/10" />
           <div className="px-4 py-2 flex flex-col items-center">
              <span className="text-[8px] font-bold text-emerald-500/40 uppercase tracking-widest">Uplink</span>
              <div className="flex items-center gap-1.5">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
                 <span className="text-xs font-mono font-black text-white italic">Active</span>
              </div>
           </div>
        </div>
      </div>

      <div className="flex items-center gap-8 relative z-10">
        <div className="hidden md:flex flex-col items-end text-right">
           <div className="flex items-center gap-2 text-emerald-500/40">
              <Activity size={12} />
              <span className="text-[9px] font-black uppercase tracking-widest">System Entropy</span>
           </div>
           <span className="text-xs font-mono font-bold text-white/60 tabular-nums">
             {time.toLocaleTimeString([], { hour12: false })}
           </span>
        </div>

        <div className="flex items-center gap-3">
           <div className="w-10 h-10 rounded-xl bg-emerald-500/5 border border-emerald-500/20 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-black transition-all duration-500 cursor-crosshair">
              <Terminal size={18} />
           </div>
           <Badge variant="outline" className="border-emerald-500/30 text-emerald-500 text-[10px] uppercase font-black px-4 py-1.5 rounded-lg bg-emerald-500/5">
             Operator Mode v1.4
           </Badge>
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0% { top: -10%; }
          100% { top: 110%; }
        }
      `}</style>
    </div>
  );
};
