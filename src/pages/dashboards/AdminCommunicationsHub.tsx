import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, ArrowRight, Eye, RefreshCw, Activity, Lock, Fingerprint } from 'lucide-react';
import { AdminService } from '@/services/admin';
import { MagicChat } from '@/components/MagicChat';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export const AdminCommunicationsHub: React.FC = () => {
  const [comms, setComms] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
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

  const filteredComms = comms.filter(c => {
    const q = searchQuery.toLowerCase();
    return (c.man_name || '').toLowerCase().includes(q) || 
           (c.woman_name || '').toLowerCase().includes(q);
  });

  if (selectedMatch) {
    return (
      <div className="space-y-12 animate-in fade-in slide-in-from-bottom-10 duration-700 pb-24 px-10">
        <div className="flex justify-between items-center">
          <button 
            onClick={() => setSelectedMatch(null)}
            className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.5em] text-slate-400 hover:text-slate-900 transition-all group"
          >
            <div className="p-3 bg-white rounded-xl border border-black/[0.03] group-hover:bg-slate-50 transition-all shadow-sm">
              <ArrowRight size={14} className="rotate-180" strokeWidth={1.5} />
            </div> 
            TERMINATE_MONITORING_CONDUIT
          </button>

          <div className="flex items-center gap-12 bg-white/40 px-10 py-4 rounded-[2rem] border border-black/[0.03] backdrop-blur-md">
             {[
               { name: selectedMatch.man_name, photos: selectedMatch.man_photos, role: 'man' },
               { name: selectedMatch.woman_name, photos: selectedMatch.woman_photos, role: 'woman' }
             ].map((u, idx) => (
               <div key={idx} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl overflow-hidden border border-black/[0.05]">
                     <img src={safeParse(u.photos)[0] || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.name}`} className="w-full h-full object-cover" />
                  </div>
                  <div>
                     <p className="text-[10px] font-bold text-slate-900 leading-none uppercase italic">{u.name}</p>
                     <p className="text-[7px] font-black text-slate-300 uppercase tracking-widest mt-1">{u.role}</p>
                  </div>
               </div>
             ))}
          </div>
        </div>

        <div className="bg-white/40 p-2 rounded-[3.5rem] border border-black/[0.03] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)] backdrop-blur-3xl overflow-hidden">
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-4 md:px-0 border-b border-black/[0.03] pb-8 gap-8">
          <div className="space-y-2">
             <div className="flex items-center gap-4">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-900" />
                <h2 className="text-3xl font-bold text-slate-900 uppercase italic tracking-tighter">SIGINT <span className="font-light text-slate-400">CHANNEL</span></h2>
             </div>
             <p className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.4em] flex items-center gap-2 italic">
                <Shield size={12} className="text-slate-400" /> Passive Resonance Monitoring Pipeline
             </p>
          </div>
          
          <div className="flex items-center gap-6 w-full md:w-auto">
             <div className="relative flex-1 md:w-80 group">
                <Activity className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-slate-900" />
                <input 
                  type="text"
                  placeholder="FILTER BY IDENTITY..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-14 pl-16 pr-6 bg-white border border-black/[0.03] rounded-2xl text-[9px] font-bold uppercase tracking-widest focus:ring-4 focus:ring-slate-100 transition-all outline-none"
                />
             </div>
             <button 
               onClick={loadComms} 
               className="w-14 h-14 rounded-[2rem] bg-white border border-black/[0.03] text-slate-400 hover:text-slate-900 transition-all shadow-sm active:scale-90 flex items-center justify-center shrink-0"
             >
                <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
             </button>
          </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
         {loading && comms.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-slate-200">
               <RefreshCw className="animate-spin w-12 h-12" />
            </div>
         ) : filteredComms.length === 0 ? (
            <div className="py-40 flex flex-col items-center justify-center text-center space-y-8 bg-white/40 rounded-[3rem] border border-black/[0.02] shadow-sm opacity-60">
                <Lock size={48} className="text-slate-200" strokeWidth={1} />
                <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.5em] italic">NO_MATCHING_RESONANCE_DETECTION</p>
            </div>
         ) : (
            <AnimatePresence>
               {filteredComms.map((c, i) => (
                  <motion.div 
                    key={c.id}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: i * 0.05 }}
                    className="group"
                  >
                     <div className="bg-white border border-black/[0.02] rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center justify-between gap-10 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] transition-all duration-700 group relative overflow-hidden">
                        {/* Soft Reveal Gradient */}
                        <div className="absolute inset-y-0 left-0 w-1 bg-slate-900 opacity-0 group-hover:opacity-100 transition-opacity" />
                        
                        <div className="flex items-center gap-10 flex-1 relative z-10">
                           <div className="flex -space-x-4">
                              {[c.man_photos, c.woman_photos].map((p, idx) => (
                                 <div key={idx} className="w-16 h-16 rounded-[1.75rem] border-4 border-white overflow-hidden bg-slate-50 shadow-sm group-hover:scale-110 transition-transform duration-1000">
                                    <img 
                                      src={safeParse(p)[0] || `https://api.dicebear.com/7.x/avataaars/svg?seed=${idx}`} 
                                      className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000"
                                    />
                                 </div>
                              ))}
                           </div>
                           <div className="space-y-1.5">
                              <h4 className="text-2xl font-bold text-slate-900 italic tracking-tighter uppercase whitespace-nowrap group-hover:text-slate-900 transition-colors">
                                {(c.man_name || 'Anonymous').toString().split(' ')[0]} <span className="text-slate-300 font-light">&</span> {(c.woman_name || 'Anonymous').toString().split(' ')[0]}
                              </h4>
                              <div className="flex items-center gap-6 text-[8px] font-bold text-slate-300 uppercase tracking-[0.4em]">
                                 <span className="flex items-center gap-2 italic"><Fingerprint size={12} className="text-slate-400" /> {new Date(c.last_message_at).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' })} // TX_LOG</span>
                                 <Badge variant="outline" className="text-[7px] border-slate-100 text-slate-400 px-3 py-1 bg-slate-50 italic">ENCRYPTED_SIG</Badge>
                              </div>
                           </div>
                        </div>

                        <div className="flex items-center gap-10 relative z-10">
                           <div className="hidden lg:flex flex-col items-end text-right space-y-1.5">
                              <span className="text-[7px] font-bold text-slate-300 uppercase tracking-[0.4em] italic leading-none">Signal Quality</span>
                              <div className="flex gap-1.5 justify-end">
                                 {[1,2,3,4,5].map(b => (
                                    <div key={b} className={`w-1 h-3 rounded-full ${b <= 4 ? 'bg-slate-900' : 'bg-slate-50'}`} />
                                 ))}
                              </div>
                           </div>
                           <TooltipProvider>
                             <Tooltip>
                               <TooltipTrigger asChild>
                                 <button 
                                   onClick={() => setSelectedMatch(c)}
                                   className="px-10 py-4 bg-white border border-black/[0.05] text-slate-500 rounded-2xl font-bold text-[10px] tracking-[0.3em] uppercase hover:bg-slate-900 hover:text-white hover:border-slate-800 transition-all shadow-sm flex items-center gap-3 active:scale-95"
                                 >
                                   <Eye size={18} strokeWidth={1.5} /> OPEN_SIGINT
                                 </button>
                               </TooltipTrigger>
                               <TooltipContent>Monitor Resonance Signal</TooltipContent>
                             </Tooltip>
                           </TooltipProvider>
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
