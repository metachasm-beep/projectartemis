import React from 'react';
import { Shield, Users, BadgeCheck, MessageSquare } from 'lucide-react';
import CountUp from '@/components/ui/cyber/CountUp';

interface ArchiveStatusProps {
  metrics: {
    totalMen: number;
    totalWomen: number;
    verifiedProfiles: number;
    totalForumTopics: number;
  };
}

export const ArchiveStatus: React.FC<ArchiveStatusProps> = ({ metrics }) => {
  const items = [
    { label: 'Aspirants Registered', val: metrics.totalMen, icon: Shield },
    { label: 'Gaze Registry', val: metrics.totalWomen, icon: Users },
    { label: 'Verified Identities', val: metrics.verifiedProfiles, icon: BadgeCheck },
    { label: 'Archived Strings', val: metrics.totalForumTopics, icon: MessageSquare },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 px-10">
      {items.map((item) => (
        <div key={item.label} className="group relative">
           <div className="space-y-2">
              <span className="text-[9px] font-black text-[#D4AF37]/60 uppercase tracking-[0.4em] italic leading-none">{item.label}</span>
              <div className="flex items-end gap-3">
                 <div className="text-5xl font-display font-black text-[#1A1A1A] tracking-tighter leading-none">
                    <CountUp to={item.val} duration={2} />
                 </div>
                 <item.icon className="w-5 h-5 text-[#D4AF37]/20 mb-1 group-hover:text-[#D4AF37] transition-colors duration-700" />
              </div>
           </div>
           
           {/* Subtle Gold Rule */}
           <div className="absolute -bottom-4 left-0 w-8 h-[1px] bg-[#D4AF37]/40 group-hover:w-full transition-all duration-1000" />
        </div>
      ))}
    </div>
  );
};
