import React from 'react';
import { Shield, Users, BadgeCheck, MessageSquare, ArrowUpRight, Globe, Zap, Cpu } from 'lucide-react';
import SpotlightCard from '@/components/ui/cyber/SpotlightCard';
import CountUp from '@/components/ui/cyber/CountUp';
import ShinyText from '@/components/ui/cyber/ShinyText';

interface ObserverBentoProps {
  metrics: {
    totalMen: number;
    totalWomen: number;
    verifiedProfiles: number;
    totalForumTopics: number;
  };
}

export const ObserverBento: React.FC<ObserverBentoProps> = ({ metrics }) => {
  const items = [
    { 
      label: 'Aspirants', 
      val: metrics.totalMen, 
      icon: Shield, 
      desc: 'Active male nodes currently in sanctuary.',
      grid: 'md:col-span-2 md:row-span-2'
    },
    { 
      label: 'Gaze Registry', 
      val: metrics.totalWomen, 
      icon: Users,
      desc: 'Global profile resonance.',
      grid: 'md:col-span-1 md:row-span-1'
    },
    { 
      label: 'Verified', 
      val: metrics.verifiedProfiles, 
      icon: BadgeCheck,
      desc: 'Validated identity links.',
      grid: 'md:col-span-1 md:row-span-1'
    },
    { 
      label: 'Communications', 
      val: metrics.totalForumTopics, 
      icon: MessageSquare,
      desc: 'Encrypted thread volume.',
      grid: 'md:col-span-2 md:row-span-1'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 px-10">
      {items.map((item, i) => (
        <SpotlightCard 
          key={item.label}
          spotlightColor="rgba(16, 185, 129, 0.05)"
          className={`bg-slate-950/20 border-emerald-500/10 p-10 flex flex-col justify-between group h-full ${item.grid}`}
        >
          <div className="flex justify-between items-start">
             <div className="p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl text-emerald-500 group-hover:bg-emerald-500 group-hover:text-black transition-all">
                <item.icon size={24} />
             </div>
             <ArrowUpRight className="text-emerald-500/20 group-hover:text-emerald-500 transition-colors" size={20} />
          </div>

          <div className="space-y-4">
             <div className="space-y-1">
                <div className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500/40 italic">
                   <ShinyText text={item.label} speed={4} />
                </div>
                <div className="text-6xl font-black text-white tracking-tighter">
                   <CountUp to={item.val} duration={1.5} />
                </div>
             </div>
             <p className="text-[10px] font-bold text-emerald-500/20 uppercase tracking-widest leading-relaxed">
                {item.desc}
             </p>
          </div>

          {/* Glitch Overlay Effect on Item 1 */}
          {i === 0 && (
             <div className="absolute inset-0 pointer-events-none bg-emerald-500/[0.01] animate-pulse rounded-[inherit]" />
          )}
        </SpotlightCard>
      ))}
    </div>
  );
};
