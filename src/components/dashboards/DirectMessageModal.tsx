import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, Shield, Sparkles } from 'lucide-react';
import { AdminService } from '@/services/admin';

interface DirectMessageModalProps {
  userId: string;
  userName: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const DirectMessageModal: React.FC<DirectMessageModalProps> = ({ userId, userName, onClose, onSuccess }) => {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!message.trim() || sending) return;
    setSending(true);
    
    const ok = await AdminService.sendDirectAdminMessage(userId, message);
    if (ok) {
      onSuccess();
      onClose();
    } else {
      alert("Sovereign Transmission Failed: Uplink rejected.");
    }
    setSending(false);
  };

  return (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-mat-wine/30 backdrop-blur-3xl animate-in fade-in duration-500 overflow-y-auto">
      <motion.div 
        initial={{ scale: 0.95, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.95, y: 20, opacity: 0 }}
        className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-12 gap-6 relative"
      >
        {/* Bento Cell 1: Transmission Identity (Span 5) */}
        <div className="md:col-span-5 mat-glass-deep p-10 rounded-[3.5rem] bg-mat-cream/20 border border-mat-rose/10 flex flex-col justify-between space-y-12">
           <div className="space-y-6">
              <div className="flex items-center gap-3 text-[10px] font-black text-mat-rose uppercase tracking-[0.4em]">
                 <Shield size={16} /> Sanctuary Uplink
              </div>
              <h2 className="text-5xl font-black text-mat-wine italic leading-tight">Direct <br />Decree.</h2>
           </div>

           <div className="space-y-4">
              <div className="flex items-center gap-6 p-6 bg-white/40 rounded-3xl border border-mat-rose/10">
                 <div className="w-16 h-16 rounded-2xl bg-mat-wine text-white flex items-center justify-center font-black text-2xl shadow-mat-premium">
                    {userName[0]}
                 </div>
                 <div>
                    <div className="text-[10px] font-black text-mat-wine/30 uppercase tracking-widest">Recipient Identity</div>
                    <div className="text-xl font-bold text-mat-wine italic">{userName}</div>
                 </div>
              </div>
              <p className="text-[10px] text-mat-slate/40 leading-relaxed font-bold uppercase tracking-widest p-2">Establishing point-to-point resonance encryption...</p>
           </div>
        </div>

        {/* Bento Cell 2: Compose Area (Span 7) */}
        <div className="md:col-span-7 mat-glass-deep p-4 rounded-[4rem] bg-white border border-mat-rose/10 flex flex-col relative overflow-hidden group">
           <div className="absolute top-6 right-6 z-20">
              <button 
                onClick={onClose}
                className="w-12 h-12 rounded-full bg-mat-wine/5 flex items-center justify-center text-mat-wine/30 hover:text-mat-wine hover:bg-mat-wine/10 transition-all"
              >
                  <X size={24} />
              </button>
           </div>
           
           <div className="p-8 space-y-6 h-full flex flex-col">
              <div className="flex-1 relative group">
                  <textarea 
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type your decree..."
                      className="w-full h-full min-h-[300px] bg-mat-cream/5 border-none rounded-[2.5rem] p-10 text-xl italic focus:outline-none transition-all resize-none placeholder:text-mat-slate/20 text-mat-wine leading-relaxed"
                  />
                  <div className="absolute bottom-8 right-8 flex items-center gap-2 text-[9px] font-black text-mat-wine/20 uppercase tracking-[0.2em] mix-blend-difference">
                      <Sparkles size={12} /> Live Link Active
                  </div>
              </div>

              <div className="flex gap-4">
                  <button 
                      onClick={onClose}
                      className="flex-1 py-6 px-8 rounded-2xl font-black text-[10px] tracking-widest uppercase bg-mat-rose/5 text-mat-wine hover:bg-mat-rose/10 transition-all"
                  >
                      Retreat
                  </button>
                  <button 
                      onClick={handleSend}
                      disabled={!message.trim() || sending}
                      className="flex-[2] py-6 px-8 rounded-2xl font-black text-[10px] tracking-widest uppercase bg-mat-wine text-white hover:scale-[1.02] active:scale-[0.98] transition-all shadow-mat-premium flex items-center justify-center gap-4 disabled:opacity-20"
                  >
                      {sending ? (
                          <span className="animate-pulse">Transmitting...</span>
                      ) : (
                          <>
                              Broadcast Decree <Send size={18} />
                          </>
                      )}
                  </button>
              </div>
           </div>
        </div>
      </motion.div>
    </div>
  );
};
