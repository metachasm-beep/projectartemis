import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Terminal, 
  Cpu, 
  Network, 
  Settings, 
  ArrowRightLeft,
  Lock,
  Zap
} from 'lucide-react';

interface TerminalHeaderProps {
  activeTab: string;
  onTabChange: (tab: any) => void;
  roleFilter: string;
  onRoleFilterChange: (role: any) => void;
}

export const TerminalHeader: React.FC<TerminalHeaderProps> = ({ 
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
    { id: 'ROSTER', label: 'Control Panel', icon: Cpu },
    { id: 'TITHE', label: 'Results', icon: Network },
    { id: 'COMMUNICATIONS', label: 'Messages', icon: Terminal },
    { id: 'BUY_AURA', label: 'Buy Aura', icon: Zap },
    { id: 'JOURNAL', label: 'Manual', icon: Lock },
  ];

  return (
    <div className="w-full bg-[#050505]/90 backdrop-blur-xl border-b border-purple-500/20 px-8 py-4 flex flex-col gap-6 sticky top-0 z-[1000] shadow-[0_10px_30px_rgba(168,85,247,0.05)]">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.1)]">
            <ShieldCheck className="text-purple-500" size={20} />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-black text-white tracking-tight uppercase italic flex items-center gap-2">
              HACKER <span className="text-purple-500">ROYAL.</span>
            </h1>
            <p className="text-[9px] font-mono font-bold text-cyan-500/40 uppercase tracking-[0.4em]">ADMIN_LEVEL_01 • REGISTRY_UPLINK_STABLE</p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-10">
          <div className="flex flex-col items-end gap-1">
             <div className="flex gap-1">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className={`w-1 h-3 rounded-full ${i < 3 ? 'bg-cyan-500' : 'bg-cyan-500/20'}`} />
                ))}
             </div>
             <span className="text-[10px] font-mono font-bold text-white tabular-nums">
               {time.toLocaleTimeString()}
             </span>
          </div>
          <div className="h-8 w-px bg-white/10" />
          <button className="p-3 hover:bg-purple-500/10 text-white/40 hover:text-purple-500 transition-all rounded-xl border border-transparent hover:border-purple-500/20">
             <Settings size={18} />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
           {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center gap-2.5 px-6 py-3 rounded-xl text-[10px] font-mono font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap border-2 ${
                  activeTab === item.id 
                    ? 'bg-purple-600 border-purple-400 text-white shadow-[0_0_20px_rgba(168,85,247,0.3)]' 
                    : 'bg-black/40 border-white/5 text-white/40 hover:text-white hover:border-purple-500/40'
                }`}
              >
                <item.icon size={14} className={activeTab === item.id ? 'animate-pulse' : ''} />
                {item.label}
              </button>
           ))}
        </div>

        <div className="flex items-center bg-black/60 p-1.5 rounded-xl border border-cyan-500/10">
           {['man', 'woman', 'admin'].map((role) => (
              <button
                key={role}
                onClick={() => onRoleFilterChange(role === 'admin' ? (roleFilter === 'admin' ? 'all' : 'admin') : (roleFilter === role ? 'all' : role))}
                className={`px-5 py-2 rounded-lg text-[9px] font-mono font-black uppercase tracking-widest transition-all ${
                  roleFilter === role 
                    ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]' 
                    : 'text-cyan-500/30 hover:text-cyan-500'
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
