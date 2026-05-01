import React from 'react';
import { Shield, Users, Activity, Layers } from 'lucide-react';
import CountUp from '@/components/ui/cyber/CountUp';

interface EtherealStatusProps {
  metrics: {
    totalMen: number;
    totalWomen: number;
    verifiedProfiles: number;
    totalForumTopics: number;
  };
}

export const EtherealStatus: React.FC<EtherealStatusProps> = ({ metrics }) => {
  const items = [
    { label: 'Active Roster', val: metrics.totalMen, icon: Users, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { label: 'Feminine Registry', val: metrics.totalWomen, icon: Layers, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Verified Status', val: metrics.verifiedProfiles, icon: Shield, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'Network Data', val: metrics.totalForumTopics, icon: Activity, color: 'text-rose-500', bg: 'bg-rose-50' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-4 md:px-10">
      {items.map((item) => (
        <div key={item.label} className="group bg-white rounded-[2.5rem] p-6 md:p-8 border border-black/[0.03] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.03)] hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] transition-all duration-700">
           <div className="flex justify-between items-start mb-6">
              <div className={`p-4 rounded-2xl ${item.bg} ${item.color} transition-all duration-500 group-hover:scale-110`}>
                 <item.icon size={22} strokeWidth={1.5} />
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
           </div>
           
           <div className="space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{item.label}</p>
              <div className="text-4xl font-bold text-slate-900 tracking-tighter tabular-nums">
                 <CountUp to={item.val} duration={1.5} />
              </div>
           </div>
           
           <div className="mt-8 pt-6 border-t border-black/[0.02]">
              <div className="flex items-center gap-2">
                 <div className="flex -space-x-2">
                    {[1,2,3].map(i => (
                       <div key={i} className="w-5 h-5 rounded-full border-2 border-white bg-slate-100" />
                    ))}
                 </div>
                 <span className="text-[8px] font-bold text-slate-300 uppercase tracking-widest">+ Live Analytics</span>
              </div>
           </div>
        </div>
      ))}
    </div>
  );
};
