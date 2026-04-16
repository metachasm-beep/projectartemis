import React from 'react';
import { LogOut, RefreshCw, Zap, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

interface LuxuryDockProps {
  onSync: () => void;
  onBroadcast: () => void;
  onCulling: () => void;
  onLogout: () => void;
  loading: boolean;
}

export const LuxuryDock: React.FC<LuxuryDockProps> = ({
  onSync,
  onBroadcast,
  onCulling,
  onLogout,
  loading
}) => {
  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[5000] w-full max-w-4xl px-6">
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-[#fdfcfb]/90 backdrop-blur-3xl border border-[#D4AF37]/20 rounded-3xl p-3 flex items-center justify-between shadow-[0_20px_50px_rgba(212,175,55,0.1)] group"
      >
        <div className="flex items-center gap-1">
           <button 
             onClick={onSync}
             className="w-12 h-12 rounded-2xl flex items-center justify-center text-[#1A1A1A]/40 hover:text-[#D4AF37] hover:bg-[#D4AF37]/5 transition-all"
             title="Synchronize Archive"
           >
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
           </button>
        </div>

        <div className="flex-1 flex justify-center gap-6 px-4">
           <button 
             onClick={onBroadcast}
             className="px-8 py-3 bg-[#D4AF37] text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-[#BFA06A] hover:shadow-lg transition-all flex items-center gap-3 active:scale-95 shadow-md"
           >
              <Zap size={14} fill="currentColor" />
              Sovereign Broadcast
           </button>
           <button 
             onClick={onCulling}
             className="px-8 py-3 bg-white border border-[#D4AF37]/20 text-[#D4AF37] rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-[#D4AF37]/5 transition-all flex items-center gap-3 active:scale-95 shadow-sm"
           >
              <Activity size={14} />
              The Culling
           </button>
        </div>

        <div className="flex items-center gap-2">
           <button 
             onClick={onLogout}
             className="w-12 h-12 rounded-2xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white transition-all shadow-sm active:scale-95"
           >
              <LogOut size={18} />
           </button>
        </div>
      </motion.div>
    </div>
  );
};
