import React from 'react';
import { Shield, Users, Activity, Layers } from 'lucide-react';
import CountUp from '@/components/ui/cyber/CountUp';

interface SecurityMatrixProps {
  metrics: {
    totalMen: number;
    totalWomen: number;
    verifiedProfiles: number;
    totalForumTopics: number;
  };
}

export const SecurityMatrix: React.FC<SecurityMatrixProps> = ({ metrics }) => {
  const items = [
    { label: 'Active_Nodes', val: metrics.totalMen, icon: Users, color: 'text-purple-500' },
    { label: 'Neural_Registry', val: metrics.totalWomen, icon: Layers, color: 'text-cyan-500' },
    { label: 'Encrypted_IDs', val: metrics.verifiedProfiles, icon: Shield, color: 'text-emerald-500' },
    { label: 'Protocol_Logs', val: metrics.totalForumTopics, icon: Activity, color: 'text-blue-500' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 px-10">
      {items.map((item) => (
        <div key={item.label} className="group relative bg-[#0a0a0a] border border-white/5 p-8 rounded-2xl hover:border-purple-500/40 transition-all duration-500 overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
           {/* Background Mesh Fragment */}
           <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.1] transition-opacity duration-1000">
              <item.icon size={120} />
           </div>

           <div className="space-y-4 relative z-10">
              <div className="flex items-center gap-3">
                 <div className={`w-1.5 h-1.5 rounded-full bg-current ${item.color} animate-pulse`} />
                 <span className="text-[10px] font-mono font-black text-white/20 uppercase tracking-[0.4em] group-hover:text-white/60 transition-colors">{item.label}</span>
              </div>
              <div className="flex items-baseline gap-2">
                 <div className={`text-4xl font-mono font-black ${item.color} tracking-tighter tabular-nums`}>
                    <CountUp to={item.val} duration={1.5} />
                 </div>
                 <span className="text-[10px] font-mono font-bold text-white/10 uppercase tracking-widest">_STAT</span>
              </div>
           </div>
           
           {/* Scanline Effect */}
           <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-white/[0.02] to-transparent h-1/2 -translate-y-full group-hover:animate-[scan_3s_linear_infinite]" />
        </div>
      ))}
    </div>
  );
};
