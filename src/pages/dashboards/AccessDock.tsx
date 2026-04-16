import React from 'react';
import { Power, ShieldAlert, Cpu, Share2, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

interface AccessDockProps {
  onSync: () => void;
  onBroadcast: () => void;
  onCulling: () => void;
  onLogout: () => void;
  loading: boolean;
}

export const AccessDock: React.FC<AccessDockProps> = ({
  onSync,
  onBroadcast,
  onCulling,
  onLogout,
  loading
}) => {
  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[5000] w-full max-w-2xl px-6">
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-black/95 backdrop-blur-2xl border-2 border-purple-500/20 rounded-2xl p-4 flex items-center justify-between shadow-[0_0_50px_rgba(168,85,247,0.15)] ring-1 ring-purple-500/10"
      >
        <div className="flex items-center gap-2">
           <button 
             onClick={onSync}
             className="w-12 h-12 rounded-xl flex items-center justify-center bg-white/5 text-cyan-500 hover:bg-cyan-500/10 hover:text-cyan-400 transition-all border border-white/5 hover:border-cyan-500/30"
             title="Sync_Matrix"
           >
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
           </button>
        </div>

        <div className="flex-1 flex justify-center gap-4 px-6">
           <button 
             onClick={onBroadcast}
             className="px-8 py-3 bg-purple-600/10 border border-purple-500/40 text-purple-400 rounded-xl text-[10px] font-mono font-black uppercase tracking-[0.2em] hover:bg-purple-600 hover:text-white transition-all flex items-center gap-3 active:scale-95 shadow-[0_0_20px_rgba(168,85,247,0.1)] group"
           >
              <Share2 size={14} className="group-hover:rotate-12 transition-transform" />
              SOVEREIGN_TX
           </button>
           <button 
             onClick={onCulling}
             className="px-8 py-3 bg-red-600/10 border border-red-500/40 text-red-500 rounded-xl text-[10px] font-mono font-black uppercase tracking-[0.2em] hover:bg-red-600 hover:text-white transition-all flex items-center gap-3 active:scale-95 shadow-[0_0_20px_rgba(239,68,68,0.1)] group"
           >
              <ShieldAlert size={14} className="group-hover:scale-110 transition-transform" />
              THE_CULLING
           </button>
        </div>

        <div className="flex items-center gap-2">
           <button 
             onClick={onLogout}
             className="w-12 h-12 rounded-xl bg-purple-600 text-white flex items-center justify-center hover:bg-black hover:text-purple-500 hover:border-purple-500/40 border border-transparent transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)] active:scale-95"
             title="Terminate_Session"
           >
              <Power size={18} />
           </button>
        </div>
      </motion.div>
    </div>
  );
};
