import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  BookOpen, 
  MessageSquare, 
  CreditCard, 
  Settings, 
  User, 
  Crown,
  LayoutGrid
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface SpectralHeaderProps {
  activeTab: string;
  onTabChange: (tab: any) => void;
  roleFilter: string;
  onRoleFilterChange: (role: any) => void;
}

export const SpectralHeader: React.FC<SpectralHeaderProps> = ({ 
  activeTab, 
  onTabChange, 
  roleFilter, 
  onRoleFilterChange 
}) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const navItems = [
    { id: 'ROSTER', label: 'Control Panel', icon: LayoutGrid },
    { id: 'TITHE', label: 'Results', icon: Shield },
    { id: 'COMMUNICATIONS', label: 'Messages', icon: MessageSquare },
    { id: 'BUY_AURA', label: 'Buy Aura', icon: CreditCard },
    { id: 'JOURNAL', label: 'Manual', icon: BookOpen },
  ];

  return (
    <div className="w-full bg-[#fdfcfb]/80 backdrop-blur-2xl border-b border-[#D4AF37]/20 px-8 py-4 flex flex-col gap-6 sticky top-0 z-[1000] shadow-sm">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-[#D4AF37]/5 rounded-2xl border border-[#D4AF37]/20">
            <Crown className="text-[#D4AF37]" size={20} />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-display font-black text-[#1A1A1A] tracking-tight uppercase italic">
              Spectral <span className="text-[#D4AF37]">Archive.</span>
            </h1>
            <p className="text-[10px] font-bold text-[#1A1A1A]/40 uppercase tracking-[0.3em]">Sanctuary Stewardship • Active Registry</p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <div className="flex flex-col items-end">
            <span className="text-[8px] font-black text-[#D4AF37] uppercase tracking-[0.4em]">Sanctuary Time</span>
            <span className="text-sm font-royal font-bold text-[#1A1A1A] tabular-nums">
              {time.toLocaleTimeString([], { hour12: false })}
            </span>
          </div>
          <div className="h-8 w-px bg-[#D4AF37]/10" />
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/5 flex items-center justify-center">
                <Settings size={18} className="text-[#D4AF37]" />
             </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
           {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                  activeTab === item.id 
                    ? 'bg-[#D4AF37] text-[#1A1A1A] shadow-lg' 
                    : 'text-[#1A1A1A]/50 hover:bg-[#D4AF37]/5 hover:text-[#D4AF37]'
                }`}
              >
                <item.icon size={14} />
                {item.label}
              </button>
           ))}
        </div>

        <div className="flex items-center bg-[#D4AF37]/5 p-1 rounded-2xl border border-[#D4AF37]/10">
           {['man', 'woman', 'admin'].map((role) => (
              <button
                key={role}
                onClick={() => onRoleFilterChange(role === 'admin' ? (roleFilter === 'admin' ? 'all' : 'admin') : (roleFilter === role ? 'all' : role))}
                className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                  roleFilter === role 
                    ? 'bg-white text-[#1A1A1A] border border-[#D4AF37]/30 shadow-sm' 
                    : 'text-[#D4AF37]/40 hover:text-[#D4AF37]'
                }`}
              >
                {role}
              </button>
           ))}
        </div>
      </div>
    </div>
  );
};
