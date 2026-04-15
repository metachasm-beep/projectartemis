import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DiscoveryService, QueueStatus as IQueueStatus } from '@/services/discoveryService';
import { cn } from '@/lib/utils';
import { Loader2, TrendingUp } from 'lucide-react';

export const QueueStatus: React.FC = () => {
  const [status, setStatus] = useState<IQueueStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      const res = await DiscoveryService.getQueueStatus();
      setStatus(res);
      setLoading(false);
    };
    fetchStatus();
  }, []);

  if (loading) return (
    <div className="flex items-center gap-2 text-white/20 animate-pulse">
       <Loader2 size={12} className="animate-spin" />
       <span className="text-[10px] font-black uppercase tracking-[0.3em]">Calibrating Standing</span>
    </div>
  );

  const count = status?.count || 0;

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {count === 0 ? (
          <motion.div 
            key="processing"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="flex items-center gap-2 group"
          >
             <div className="w-1.5 h-1.5 rounded-full bg-mat-gold/30 animate-pulse" />
             <span className="text-[9px] md:text-[11px] font-black text-white/30 uppercase tracking-[0.4em] italic group-hover:text-mat-gold/50 transition-colors">
               Processing Standing...
             </span>
          </motion.div>
        ) : (
          <motion.div 
            key="active"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-1"
          >
            <div className="flex items-center gap-3">
              <TrendingUp size={14} className="text-mat-gold/60" />
              <p className="text-[13px] md:text-lg font-light text-mat-bone italic tracking-tighter leading-tight">
                You are currently being considered by{" "}
                <span className="text-mat-gold font-black not-italic px-1">
                  {count === 1 ? "A Sovereign" : `${count} Sovereigns`}
                </span>
              </p>
            </div>
            <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] text-white/20 ml-7">
              Your resonance is expanding across the Sanctuary.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
