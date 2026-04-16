import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Shield, ArrowRight, Eye, RefreshCw, Activity, Lock } from 'lucide-react';
import { AdminService } from '@/services/admin';
import { MagicChat } from '@/components/MagicChat';
import { Badge } from '@/components/ui/badge';

export const AdminCommunicationsHub: React.FC = () => {
  const [comms, setComms] = useState<any[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const loadComms = async () => {
    setLoading(true);
    const data = await AdminService.getGlobalCommunications();
    setComms(data);
    setLoading(false);
  };

  useEffect(() => {
    loadComms();
    const interval = setInterval(loadComms, 30000); 
    return () => clearInterval(interval);
  }, []);

  const safeParse = (json: string) => {
    try { return JSON.parse(json || '[]'); } catch { return []; }
  };

  if (selectedMatch) {
    return (
      <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-500 pb-24 px-10">
        <button 
          onClick={() => setSelectedMatch(null)}
          className="flex items-center gap-4 text-[10px] font-mono font-black uppercase tracking-[0.5em] text-cyan-500/60 hover:text-cyan-400 transition-all group"
        >
          <div className="p-3 bg-cyan-500/5 rounded-xl border border-cyan-500/20 group-hover:bg-cyan-500/20 transition-all">
            <ArrowRight size={14} className="rotate-180" />
          </div> 
          TERMINATE_MONITORING_UPLINK
        </button>
        <div className="bg-[#050505] p-2 rounded-[3rem] border border-purple-500/20 shadow-[0_0_100px_rgba(168,85,247,0.1)]">
           <MagicChat 
             match={{
               ...selectedMatch,
               otherUser: {
                 full_name: selectedMatch.woman_name,
                 avatar: safeParse(selectedMatch.woman_photos)[0] || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200"
               }
             } as any}
             currentUserId="ADMIN" 
             userRole="admin" 
             onBack={() => setSelectedMatch(null)}
             isAdminMonitor={true}
           />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-24 px-10">
      <div className="flex justify-between items-center px-4 md:px-0 border-b border-white/5 pb-8">
          <div className="space-y-2">
             <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_10px_#06b6d4] animate-pulse" />
                <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">SIGINT <span className="text-cyan-500">MONITOR</span></h2>
             </div>
             <p className="text-[9px] font-mono font-bold text-white/20 uppercase tracking-[0.4em] flex items-center gap-2 italic">
                <Shield size={12} className="text-purple-500" /> ACTIVE_PAYLOAD_MONITORING_CONDUIT
             </p>
          </div>
          <button 
            onClick={loadComms} 
            className="w-14 h-14 rounded-xl bg-black border border-white/10 text-cyan-500 hover:bg-cyan-500/10 hover:text-cyan-400 transition-all shadow-sm active:scale-90"
          >
             <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
         {loading && comms.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-cyan-500/20">
               <RefreshCw className="animate-spin w-12 h-12" />
            </div>
         ) : comms.length === 0 ? (
            <div className="py-32 flex flex-col items-center justify-center text-center space-y-6 bg-black/40 rounded-3xl border border-white/5 opacity-60">
                <Lock size={48} className="text-white/10" strokeWidth={1} />
                <p className="text-[10px] font-mono font-black text-white/20 uppercase tracking-[0.5em] italic">SILENCE_IN_NETWORK_CHANNELS</p>
            </div>
         ) : (
            <AnimatePresence>
               {comms.map((c, i) => (
                  <motion.div 
                    key={c.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.03 }}
                    className="group"
                  >
                     <div className="bg-[#080808] border border-white/5 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-8 hover:border-cyan-500/40 hover:shadow-[0_0_40px_rgba(6,182,212,0.1)] transition-all duration-500 group relative overflow-hidden">
                        {/* Digital Scan Reveal */}
                        <div className="absolute inset-y-0 left-0 w-1 bg-cyan-500 shadow-[0_0_15px_#06b6d4] opacity-0 group-hover:opacity-100 transition-opacity" />
                        
                        <div className="flex items-center gap-8 flex-1 relative z-10">
                           <div className="flex -space-x-4">
                              {[c.man_photos, c.woman_photos].map((p, idx) => (
                                 <div key={idx} className="w-14 h-14 rounded-xl border-2 border-black overflow-hidden bg-white/5 shadow-xl">
                                    <img 
                                      src={JSON.parse(p || '[]')[0] || "https://api.dicebear.com/7.x/avataaars/svg?seed=neutral"} 
                                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                                    />
                                 </div>
                              ))}
                           </div>
                           <div className="space-y-1">
                              <h4 className="text-xl font-black text-white italic tracking-tighter uppercase whitespace-nowrap group-hover:text-cyan-400 transition-colors">
                                {c.man_name.split(' ')[0]} <span className="text-white/20">::</span> {c.woman_name.split(' ')[0]}
                              </h4>
                              <div className="flex items-center gap-6 text-[8px] font-mono font-black text-white/20 uppercase tracking-[0.4em]">
                                 <span className="flex items-center gap-2 italic"><Activity size={10} className="text-cyan-500/40" /> {new Date(c.last_message_at).toLocaleTimeString([], { hour12: false })}_TX</span>
                                 <Badge variant="outline" className="text-[7px] border-cyan-500/20 text-cyan-500 px-3 py-1 bg-cyan-500/5">NODE_ENCRYPTION_ACTIVE</Badge>
                              </div>
                           </div>
                        </div>

                        <div className="flex items-center gap-8 relative z-10">
                           <div className="hidden lg:flex flex-col items-end text-right space-y-1">
                              <span className="text-[7px] font-mono font-black text-white/20 uppercase tracking-[0.4em] italic leading-none">Signal_Quality</span>
                              <div className="flex gap-1.5 justify-end">
                                 {[1,2,3,4,5].map(b => (
                                    <div key={b} className={`w-1 h-3 rounded-full ${b <= 4 ? 'bg-cyan-500' : 'bg-white/10'}`} />
                                 ))}
                              </div>
                           </div>
                           <button 
                             onClick={() => setSelectedMatch(c)}
                             className="px-8 py-3.5 bg-cyan-600/10 border border-cyan-500/20 text-cyan-400 rounded-xl font-mono font-black text-[10px] tracking-[0.25em] uppercase hover:bg-cyan-600 hover:text-white transition-all shadow-md flex items-center gap-3 active:scale-95"
                           >
                              <Eye size={16} /> OPEN_CONDUIT
                           </button>
                        </div>
                     </div>
                  </motion.div>
               ))}
            </AnimatePresence>
         )}
      </div>
    </div>
  );
};
