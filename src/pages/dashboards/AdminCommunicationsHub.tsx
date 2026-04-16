import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Shield, ArrowRight, Eye, RefreshCw, Clock, Terminal } from 'lucide-react';
import { AdminService } from '@/services/admin';
import { MagicChat } from '@/components/MagicChat';
import { Badge } from '@/components/ui/badge';
import DecryptedText from '@/components/ui/cyber/DecryptedText';

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
    const interval = setInterval(loadComms, 30000); // Periodic pulse
    return () => clearInterval(interval);
  }, []);

  if (selectedMatch) {
    const safeParse = (json: string) => {
      try { return JSON.parse(json || '[]'); } catch { return []; }
    };

    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <button 
          onClick={() => setSelectedMatch(null)}
          className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500/60 hover:text-emerald-500 transition-all group"
        >
          <div className="p-2 bg-emerald-500/5 rounded-lg group-hover:bg-emerald-500/20 transition-all">
            <ArrowRight size={14} className="rotate-180" />
          </div> 
          Terminate Monitoring Session
        </button>
        <div className="bg-slate-900/60 p-1 rounded-[3rem] border border-emerald-500/10 shadow-[0_0_50px_rgba(16,185,129,0.05)]">
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
    <div className="space-y-12 pb-20">
      <div className="flex justify-between items-center px-4 md:px-0">
          <div className="space-y-2">
             <div className="flex items-center gap-3">
                <span className="w-8 h-[2px] bg-emerald-500/40" />
                <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">
                  <DecryptedText 
                    text="SOVEREIGN EYES" 
                    speed={80}
                    sequential={true}
                    className="text-white"
                  />
                </h2>
             </div>
             <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500/30 flex items-center gap-2 italic">
                <Shield size={10} className="text-emerald-500 animate-pulse" /> Administrative Monitoring Conduit
             </p>
          </div>
          <button 
            onClick={loadComms} 
            className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-black transition-all active:scale-90"
          >
             <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
         {loading && comms.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-emerald-500/20">
               <RefreshCw className="animate-spin w-10 h-10" />
            </div>
         ) : comms.length === 0 ? (
            <div className="py-32 flex flex-col items-center justify-center text-center space-y-6 bg-white/[0.01] rounded-[3rem] border border-white/5 opacity-40">
                <Terminal size={48} className="text-emerald-500/40" />
                <p className="text-[10px] uppercase tracking-[0.3em] font-black text-emerald-500/40">No Active Resonances Found in Matrix</p>
            </div>
         ) : (
            <AnimatePresence>
               {comms.map((c, i) => (
                  <motion.div 
                    key={c.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="group"
                  >
                     <div className="bg-slate-900/40 border border-emerald-500/10 rounded-[2rem] p-8 flex flex-col md:flex-row items-center justify-between gap-8 hover:bg-emerald-500/[0.02] hover:border-emerald-500/20 transition-all duration-500 relative overflow-hidden">
                        {/* Scanning Line */}
                        <div className="absolute inset-x-0 h-[1px] bg-emerald-500/20 top-0 opacity-0 group-hover:opacity-100 animate-[scan_2s_linear_infinite]" />
                        
                        <div className="flex items-center gap-8 flex-1">
                           <div className="flex -space-x-4">
                              {[c.man_photos, c.woman_photos].map((p, idx) => (
                                 <div key={idx} className="w-14 h-14 rounded-2xl border-2 border-slate-950 overflow-hidden bg-slate-800 shadow-xl">
                                    <img 
                                      src={JSON.parse(p || '[]')[0] || "https://api.dicebear.com/7.x/avataaars/svg?seed=neutral"} 
                                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                                    />
                                 </div>
                              ))}
                           </div>
                           <div className="space-y-1">
                              <h4 className="text-xl font-black text-white italic tracking-tighter uppercase whitespace-nowrap">
                                {c.man_name.split(' ')[0]} <span className="text-emerald-500/40">&</span> {c.woman_name.split(' ')[0]}
                              </h4>
                              <div className="flex items-center gap-4 text-[8px] font-black text-emerald-500/40 uppercase tracking-[0.3em]">
                                 <span className="flex items-center gap-1.5"><Clock size={10} /> {new Date(c.last_message_at).toLocaleTimeString()}</span>
                                 <span className="w-1 h-1 rounded-full bg-emerald-500/20" />
                                 <Badge variant="outline" className="text-[7px] border-emerald-500/20 text-emerald-500/60 px-2">ENCRYPTED</Badge>
                              </div>
                           </div>
                        </div>

                        <div className="flex items-center gap-6">
                           <div className="hidden lg:flex flex-col items-end text-right">
                              <span className="text-[7px] font-black text-emerald-500/20 uppercase tracking-[0.4em]">Signal Integrity</span>
                              <div className="flex gap-1 mt-1">
                                 {[1,2,3,4].map(b => (
                                    <div key={b} className={`w-1 h-3 rounded-full ${b <= 3 ? 'bg-emerald-500' : 'bg-emerald-500/20'}`} />
                                 ))}
                              </div>
                           </div>
                           <button 
                             onClick={() => setSelectedMatch(c)}
                             className="px-8 py-4 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-2xl font-black text-[9px] tracking-[0.4em] uppercase hover:bg-emerald-500 hover:text-black transition-all shadow-[0_0_20px_rgba(16,185,129,0.05)] flex items-center gap-3 active:scale-95"
                           >
                              <Eye size={14} /> Open Conduit
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
