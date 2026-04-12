import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Shield, Users, ArrowRight, Eye, RefreshCw, Clock } from 'lucide-react';
import { AdminService } from '@/services/admin';
import { MagicChat } from '@/components/MagicChat';
import { Badge } from '@/components/ui/badge';
import DecryptedText from '../ui/cyber/DecryptedText';

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

    // 👁️ Monitor Mode: Reusing MagicChat with a specialized monitor bridge
    return (
      <div className="space-y-6">
        <button 
          onClick={() => setSelectedMatch(null)}
          className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-mat-wine/40 hover:text-mat-wine transition-colors"
        >
          <ArrowRight size={14} className="rotate-180" /> Back to Directory
        </button>
        <div className="bg-mat-cream/40 p-1 rounded-[3rem] border border-mat-rose/10">
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
    <div className="space-y-8">
      <div className="flex justify-between items-end">
         <div className="space-y-2">
            <h2 className="text-3xl font-black text-mat-wine tracking-tighter">
              <DecryptedText 
                text="SOVEREIGN EYES" 
                speed={100}
                sequential={true}
                animateOn="view"
                className="text-mat-wine"
                encryptedClassName="text-mat-rose/30"
              />
            </h2>
            <p className="text-[10px] font-bold uppercase tracking-widest text-mat-slate/40 flex items-center gap-2">
               <Shield size={10} className="text-mat-rose" /> Administrative Monitoring Conduit
            </p>
         </div>
         <button onClick={loadComms} className="p-3 bg-mat-wine/5 text-mat-wine rounded-full hover:bg-mat-wine/10 transition-all">
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
         </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
         {loading && comms.length === 0 ? (
            <div className="h-64 flex items-center justify-center opacity-20">
               <RefreshCw className="animate-spin" />
            </div>
         ) : comms.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center space-y-4 mat-glass rounded-[3rem] border-dashed border-mat-rose/20 opacity-40">
               <MessageSquare size={48} strokeWidth={0.5} />
               <p className="text-xs uppercase tracking-widest font-black">No Active Resonances Found</p>
            </div>
         ) : (
            <AnimatePresence>
               {comms.map((c, i) => (
                  <motion.div 
                    key={c.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => setSelectedMatch(c)}
                    className="group mat-glass-deep p-6 rounded-[2.5rem] border border-mat-rose/10 hover:border-mat-rose/40 hover:bg-white transition-all cursor-pointer flex items-center gap-8 shadow-sm"
                  >
                     {/* Identity Collision View */}
                     <div className="flex -space-x-8">
                        {[
                          { img: (function(){ try { return JSON.parse(c.woman_photos || '[]')[0]; } catch { return "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200"; }})(), name: c.woman_name },
                          { img: (function(){ try { return JSON.parse(c.man_photos || '[]')[0]; } catch { return "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200"; }})(), name: c.man_name }
                         ].map((user, idx) => {
                            const photos = (function(){
                               try {
                                  const raw = idx === 0 ? c.woman_photos : c.man_photos;
                                  return JSON.parse(raw || '[]');
                               } catch { return []; }
                            })();
                            return (
                               <div key={idx} className="w-16 h-16 rounded-[1.25rem] border-4 border-mat-cream overflow-hidden shadow-mat-premium group-hover:scale-105 transition-transform duration-500 bg-mat-rose/5">
                                  <img 
                                    src={user.img} 
                                    referrerPolicy="no-referrer" 
                                    crossOrigin="anonymous"
                                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all font-bold"
                                    onError={(e) => {
                                      const target = e.currentTarget;
                                      const currentSrc = target.src || '';
                                      
                                      // STAGE 1: Google Re-format
                                      if (currentSrc.includes('googleusercontent.com') && !currentSrc.includes('sz=300')) {
                                        const base = currentSrc.split('=')[0];
                                        target.src = `${base}=s300`;
                                        return;
                                      }

                                      // STAGE 2: Photo Array Fallback
                                      if (photos.length > 1 && target.src !== photos[1]) {
                                        target.src = photos[1];
                                        return;
                                      }

                                      // STAGE 3: Premium DiceBear
                                      target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}&backgroundColor=ffdfbf,ffd5dc,d1d4f9`;
                                      target.removeAttribute('crossorigin');
                                    }}
                                  />
                               </div>
                            );
                         })}
                     </div>

                     <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                           <h4 className="text-lg font-bold text-mat-wine italic">
                             {c.woman_name.split(' ')[0]} <span className="text-mat-rose/30 mx-1">&</span> {c.man_name.split(' ')[0]}
                           </h4>
                           <Badge variant="outline" className="text-[7px] font-black uppercase tracking-tighter px-2 border-mat-rose/20 text-mat-rose">
                              {c.current_comm_mode.replace('_', ' ')}
                           </Badge>
                        </div>
                        <p className="text-[11px] text-mat-slate/50 line-clamp-1 italic">
                           "{c.last_message || 'Resonance initiated...'}"
                        </p>
                     </div>

                     <div className="text-right space-y-2">
                        <div className="flex items-center gap-1 justify-end text-[8px] font-bold text-mat-slate/30 uppercase tracking-widest">
                           <Clock size={10} />
                           {c.last_message_at ? new Date(c.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Pending'}
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 bg-mat-wine text-white rounded-full text-[9px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0 shadow-lg">
                           <Eye size={12} /> Enter Gaze
                        </button>
                     </div>
                  </motion.div>
               ))}
            </AnimatePresence>
         )}
      </div>
    </div>
  );
};
