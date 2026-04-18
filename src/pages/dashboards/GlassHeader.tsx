import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  BookOpen, 
  MessageSquare, 
  CreditCard, 
  Archive, 
  Settings, 
  Fingerprint,
  Zap
} from 'lucide-react';

interface GlassHeaderProps {
  activeTab: string;
  onTabChange: (tab: any) => void;
  roleFilter: string;
  onRoleFilterChange: (role: any) => void;
  onLogout?: () => void;
  onViewSwitch?: (view: 'man' | 'woman' | 'admin') => void;
}

export const GlassHeader: React.FC<GlassHeaderProps> = ({ 
  activeTab, 
  onTabChange, 
  roleFilter, 
  onRoleFilterChange,
  onLogout,
  onViewSwitch
}) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const navItems = [
    { id: 'ROSTER', label: 'Control Panel', icon: Archive },
    { id: 'TITHE', label: 'Results', icon: Shield },
    { id: 'COMMUNICATIONS', label: 'Messages', icon: MessageSquare },
    { id: 'MODERATION', label: 'Blog Moderation', icon: Zap },
    { id: 'JOURNAL', label: 'Manual', icon: BookOpen },
  ];

  return (
    <div className="w-full bg-white/40 backdrop-blur-3xl border-b border-black/[0.03] px-10 py-5 flex flex-col gap-6 sticky top-0 z-[1000] shadow-[0_1px_0_rgba(255,255,255,1)]">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-5">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05)] border border-black/[0.02]">
            <Fingerprint className="text-slate-800" size={24} strokeWidth={1.5} />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              ETHEREAL <span className="font-light text-slate-400">ARCHIVE</span>
            </h1>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.4em]">Protocol Management System // Ver 0.4.1</p>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-10">
          <div className="flex flex-col items-end gap-0.5">
             <span className="text-[8px] font-black text-slate-300 uppercase tracking-[0.3em]">Operational Time</span>
             <span className="text-sm font-medium text-slate-800 tabular-nums">
               {time.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
             </span>
          </div>
          <div className="h-10 w-px bg-black/[0.05]" />
          <div className="flex items-center gap-2">
            <button 
              className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all border border-transparent hover:border-black/[0.03]"
            >
               <Settings size={20} strokeWidth={1.5} />
            </button>
            <button 
              onClick={onLogout}
              className="px-6 h-10 rounded-xl flex items-center justify-center text-[10px] font-bold uppercase tracking-widest text-rose-500 hover:bg-rose-50 transition-all border border-transparent hover:border-rose-100"
            >
               Excision (Logout)
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
             {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`flex items-center gap-2.5 px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                    activeTab === item.id 
                      ? 'bg-slate-900 text-white shadow-xl' 
                      : 'text-slate-900 hover:bg-black/[0.03] hover:text-slate-800'
                  }`}
                >
                  <item.icon size={14} strokeWidth={2} />
                  {item.label}
                </button>
             ))}
          </div>
          
          {activeTab === 'ROSTER' && (
            <div className="flex items-center bg-slate-100/50 p-1 rounded-2xl border border-black/[0.02]">
               {['all', 'man', 'woman'].map((r: any) => (
                  <button
                    key={r}
                    onClick={() => onRoleFilterChange(r)}
                    className={`px-5 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all ${
                      roleFilter === r 
                        ? 'bg-white text-slate-900 shadow-sm' 
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    {r}
                  </button>
               ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end gap-1.5">
             <span className="text-[7px] font-black text-slate-300 uppercase tracking-widest mr-2">Sovereign Portal Toggle</span>
             <div className="flex items-center bg-black/[0.02] p-1 rounded-2xl border border-black/[0.03] shadow-inner">
                {['man', 'woman', 'admin'].map((role: any) => (
                   <button
                     key={role}
                     onClick={() => onViewSwitch?.(role)}
                     className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                       role === 'admin' 
                         ? 'bg-slate-900 text-white shadow-md' 
                         : 'text-slate-900 hover:text-slate-700 hover:bg-white/40'
                     }`}
                   >
                     <Layers size={10} />
                     View As {role}
                   </button>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
