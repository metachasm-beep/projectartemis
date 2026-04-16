import React from 'react';
import { 
  LogOut, 
  RefreshCw, 
  Zap, 
  Activity, 
  Globe, 
  Cpu, 
  LayoutPanelLeft 
} from 'lucide-react';
import { motion } from 'framer-motion';

interface CommandBladeProps {
  onLogout: () => void;
  onSync: () => void;
  onBroadcast: () => void;
  onCulling: () => void;
  loading: boolean;
}

export const CommandBlade: React.FC<CommandBladeProps> = ({ 
  onLogout, 
  onSync, 
  onBroadcast, 
  onCulling, 
  loading 
}) => {
  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[5000] w-full max-w-4xl px-6">
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", damping: 20, stiffness: 100 }}
        className="bg-slate-950/80 backdrop-blur-3xl border border-emerald-500/20 rounded-full p-2 flex items-center justify-between shadow-[0_0_40px_rgba(0,0,0,0.5)] group"
      >
        <div className="flex items-center gap-1.5 p-1 border-r border-emerald-500/10 mr-4">
           <button 
             onClick={onSync}
             className="w-12 h-12 rounded-full flex items-center justify-center text-emerald-500/60 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all active:scale-90"
             title="Synchronize Matrix"
           >
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
           </button>
           <button 
             onClick={() => window.alert("Terminal Output: No anomalies detected.")}
             className="w-12 h-12 rounded-full flex items-center justify-center text-emerald-500/60 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all"
             title="Global Health"
           >
              <Cpu size={18} />
           </button>
        </div>

        <div className="flex-1 flex justify-center gap-4 px-4">
           <button 
             onClick={onBroadcast}
             className="px-8 py-3 bg-emerald-500/5 border border-emerald-500/20 text-emerald-500 rounded-full text-[10px] font-black uppercase tracking-[0.3em] hover:bg-emerald-500 hover:text-black transition-all shadow-[0_0_20px_rgba(16,185,129,0.1)] flex items-center gap-3 active:scale-95"
           >
              <Zap size={14} className="fill-current" />
              Sovereign Broadcast
           </button>
           <button 
             onClick={onCulling}
             className="px-8 py-3 bg-red-500/5 border border-red-500/20 text-red-500 rounded-full text-[10px] font-black uppercase tracking-[0.3em] hover:bg-red-500 hover:text-white transition-all shadow-[0_0_20px_rgba(239,68,68,0.1)] flex items-center gap-3 active:scale-95"
           >
              <Activity size={14} />
              The Culling
           </button>
        </div>

        <div className="flex items-center gap-1.5 p-1 border-l border-emerald-500/10 ml-4">
           <div className="hidden lg:flex flex-col items-end px-4">
              <span className="text-[7px] font-bold text-emerald-500/30 uppercase tracking-[0.4em]">Control State</span>
              <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Locked</span>
           </div>
           <button 
             onClick={onLogout}
             className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 hover:bg-emerald-500 hover:text-black transition-all shadow-lg active:scale-90"
             title="Terminate Session"
           >
              <LogOut size={18} />
           </button>
        </div>

        {/* Tactical Glow Effect */}
        <div className="absolute inset-0 rounded-full bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none blur-xl" />
      </motion.div>
    </div>
  );
};
