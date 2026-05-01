import React from 'react';
import { Power, Flame, Share2, RefreshCw, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface MinimalDockProps {
  onSync: () => void;
  onBroadcast: () => void;
  onCulling: () => void;
  onLogout: () => void;
  loading: boolean;
}

export const MinimalDock: React.FC<MinimalDockProps> = ({
  onSync,
  onBroadcast,
  onCulling,
  onLogout,
  loading
}) => {
  return (
    <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[5000] w-full max-w-xl px-2 md:px-6">
      <motion.div 
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="bg-white/90 backdrop-blur-3xl border border-black/[0.03] rounded-[2.5rem] p-4 flex items-center justify-between shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] ring-1 ring-white"
      >
        <div className="flex items-center gap-2">
           <button 
             onClick={onSync}
             className="w-14 h-14 rounded-2xl flex items-center justify-center bg-black/[0.02] text-slate-400 hover:text-slate-900 hover:bg-black/[0.05] transition-all"
             title="Synchronize"
           >
              <RefreshCw size={22} strokeWidth={1.5} className={loading ? 'animate-spin' : ''} />
           </button>
        </div>

        <div className="flex-1 flex justify-center gap-2 md:gap-4 px-2 md:px-6 border-x border-black/[0.03] mx-2">
           <button 
             onClick={onBroadcast}
             className="px-4 md:px-8 py-3 md:py-3.5 bg-slate-900 border border-slate-800 text-white rounded-[1.25rem] text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-slate-800 hover:scale-105 transition-all flex items-center gap-3 shadow-xl active:scale-95 group"
           >
              <Share2 size={16} strokeWidth={2} className="group-hover:rotate-12 transition-transform" />
              Manifest Decree
           </button>
           <button 
             onClick={onCulling}
             className="px-4 md:px-8 py-3 md:py-3.5 bg-rose-50 border border-rose-100 text-rose-500 rounded-[1.25rem] text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-rose-100 hover:scale-105 transition-all flex items-center gap-3 active:scale-95 group"
           >
              <Zap size={16} strokeWidth={2} className="group-hover:scale-110 transition-transform" />
              Excision
           </button>
        </div>

        <div className="flex items-center gap-2">
           <button 
             onClick={onLogout}
             className="w-14 h-14 rounded-2xl bg-slate-50 text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all border border-black/[0.02] active:scale-95"
             title="Terminate"
           >
              <Power size={22} strokeWidth={1.5} />
           </button>
        </div>
      </motion.div>
    </div>
  );
};
