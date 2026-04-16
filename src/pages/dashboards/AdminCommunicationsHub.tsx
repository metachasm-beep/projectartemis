import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Shield, ArrowRight, Eye, RefreshCw, Clock, Crown } from 'lucide-react';
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

  if (selectedMatch) {
    const safeParse = (json: string) => {
      try { return JSON.parse(json || '[]'); } catch { return []; }
    };

    return (
      <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-24 px-10">
        <button 
          onClick={() => setSelectedMatch(null)}
          className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.5em] text-[#D4AF37]/60 hover:text-[#D4AF37] transition-all group"
        >
          <div className="p-3 bg-[#D4AF37]/5 rounded-xl group-hover:bg-[#D4AF37]/10 transition-all">
            <ArrowRight size={14} className="rotate-180" />
          </div> 
          Terminate Monitoring Session
        </button>
        <div className="bg-[#f0ede9]/40 p-1.5 rounded-[4rem] border border-[#D4AF37]/10 shadow-[0_40px_100px_rgba(212,175,55,0.05)]">
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
    <div className="space-y-16 pb-24 px-10">
      <div className="flex justify-between items-center px-4 md:px-0 border-b border-[#D4AF37]/10 pb-8">
          <div className="space-y-4">
             <div className="flex items-center gap-4">
                <span className="w-8 h-[1px] bg-[#D4AF37]" />
                <h2 className="text-4xl font-display font-black text-[#1A1A1A] uppercase italic tracking-tighter">Sovereign <span className="text-[#D4AF37]">Eyes</span></h2>
             </div>
             <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#1A1A1A]/30 flex items-center gap-2 italic">
                <Shield size={12} className="text-[#D4AF37]" /> Administrative Monitoring Conduit
             </p>
          </div>
          <button 
            onClick={loadComms} 
            className="p-5 rounded-full bg-white border border-[#D4AF37]/20 text-[#D4AF37] hover:bg-[#D4AF37]/5 transition-all shadow-sm active:scale-90"
          >
             <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
      </div>

      <div className="grid grid-cols-1 gap-8">
         {loading && comms.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-[#D4AF37]/20">
               <RefreshCw className="animate-spin w-12 h-12" />
            </div>
         ) : comms.length === 0 ? (
            <div className="py-40 flex flex-col items-center justify-center text-center space-y-8 bg-white/40 rounded-[4rem] border border-[#D4AF37]/10 opacity-60">
                <Crown size={48} className="text-[#D4AF37]/40" strokeWidth={1} />
                <p className="text-[10px] uppercase tracking-[0.5em] font-black text-[#1A1A1A]/40 italic">No Active Resonances Found in Archive</p>
            </div>
         ) : (
            <AnimatePresence>
               {comms.map((c, i) => (
                  <motion.div 
                    key={c.id}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: i * 0.05 }}
                    className="group"
                  >
                     <div className="bg-white border border-[#D4AF37]/10 rounded-[3rem] p-10 flex flex-col md:flex-row items-center justify-between gap-10 hover:border-[#D4AF37]/40 hover:shadow-2xl transition-all duration-1000 group shadow-sm relative overflow-hidden">
                        {/* Soft Gold Gradient Reveal */}
                        <div className="absolute inset-x-0 h-full bg-gradient-to-r from-[#D4AF37]/[0.02] to-transparent -translate-x-full group-hover:translate-x-0 transition-transform duration-1000" />
                        
                        <div className="flex items-center gap-10 flex-1 relative z-10">
                           <div className="flex -space-x-6">
                              {[c.man_photos, c.woman_photos].map((p, idx) => (
                                 <div key={idx} className="w-16 h-16 rounded-[1.8rem] border-4 border-white overflow-hidden bg-[#D4AF37]/5 shadow-xl">
                                    <img 
                                      src={JSON.parse(p || '[]')[0] || "https://api.dicebear.com/7.x/avataaars/svg?seed=neutral"} 
                                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000"
                                    />
                                 </div>
                              ))}
                           </div>
                           <div className="space-y-2">
                              <h4 className="text-2xl font-display font-black text-[#1A1A1A] italic tracking-tighter uppercase whitespace-nowrap">
                                {c.man_name.split(' ')[0]} <span className="text-[#D4AF37]/30">&</span> {c.woman_name.split(' ')[0]}
                              </h4>
                              <div className="flex items-center gap-6 text-[9px] font-black text-[#1A1A1A]/20 uppercase tracking-[0.4em]">
                                 <span className="flex items-center gap-2 italic"><Clock size={12} className="text-[#D4AF37]/40" /> {new Date(c.last_message_at).toLocaleTimeString()}</span>
                                 <Badge variant="outline" className="text-[7px] border-[#D4AF37]/20 text-[#D4AF37] px-3 py-1 bg-[#D4AF37]/5">ENCRYPTED</Badge>
                              </div>
                           </div>
                        </div>

                        <div className="flex items-center gap-10 relative z-10">
                           <div className="hidden lg:flex flex-col items-end text-right space-y-2">
                              <span className="text-[7px] font-black text-[#D4AF37]/40 uppercase tracking-[0.5em] italic">Signal Integrity</span>
                              <div className="flex gap-1.5 justify-end">
                                 {[1,2,3,4,5].map(b => (
                                    <div key={b} className={`w-1 h-3 rounded-full ${b <= 4 ? 'bg-[#D4AF37]' : 'bg-[#D4AF37]/20'}`} />
                                 ))}
                              </div>
                           </div>
                           <button 
                             onClick={() => setSelectedMatch(c)}
                             className="px-10 py-5 bg-white text-[#D4AF37] border border-[#D4AF37]/20 rounded-2xl font-black text-[10px] tracking-[0.4em] uppercase hover:bg-[#D4AF37] hover:text-white transition-all shadow-md flex items-center gap-3 active:scale-95"
                           >
                              <Eye size={16} /> Open Conduit
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
