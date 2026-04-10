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
    <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-mat-wine/40 backdrop-blur-xl animate-in fade-in duration-300">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white p-1 rounded-[3rem] border border-mat-rose/20 shadow-[0_0_100px_rgba(114,24,39,0.15)] max-w-lg w-full overflow-hidden"
      >
        <div className="bg-mat-cream/30 p-8 space-y-8">
            <div className="flex justify-between items-start">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[10px] font-black text-mat-rose uppercase tracking-[0.3em]">
                        <Shield size={12} /> Sovereign Protocol
                    </div>
                    <h2 className="text-3xl font-light text-mat-wine italic">Direct <span className="text-mat-rose/50">Transmission.</span></h2>
                </div>
                <button 
                  onClick={onClose}
                  className="p-3 bg-white/60 text-mat-wine/40 hover:text-mat-wine hover:bg-white transition-all rounded-full"
                >
                    <X size={20} />
                </button>
            </div>

            <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-white/60 rounded-2xl border border-mat-rose/5">
                    <div className="w-12 h-12 rounded-xl bg-mat-wine text-white flex items-center justify-center font-bold text-lg">
                        {userName[0]}
                    </div>
                    <div>
                        <div className="text-[10px] font-black text-mat-wine/30 uppercase tracking-widest">Target Identity</div>
                        <div className="font-bold text-mat-wine italic">{userName}</div>
                    </div>
                </div>

                <div className="relative group">
                    <textarea 
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Compose your sovereign decree..."
                        className="w-full h-48 bg-white border border-mat-rose/10 rounded-[2rem] p-6 text-sm italic focus:outline-none focus:ring-2 focus:ring-mat-wine/10 transition-all resize-none placeholder:text-mat-slate/30 text-mat-wine"
                    />
                    <div className="absolute bottom-6 right-6 flex items-center gap-2 text-[9px] font-black text-mat-wine/20 uppercase tracking-widest">
                        <Sparkles size={10} /> Resonance Encoding Active
                    </div>
                </div>
            </div>

            <div className="flex gap-4">
                <button 
                    onClick={onClose}
                    className="flex-1 py-4 px-6 rounded-2xl font-black text-[10px] tracking-widest uppercase bg-mat-rose/10 text-mat-wine hover:bg-mat-rose/20 transition-all font-sans"
                >
                    Retreat
                </button>
                <button 
                    onClick={handleSend}
                    disabled={!message.trim() || sending}
                    className="flex-[2] py-4 px-6 rounded-2xl font-black text-[10px] tracking-widest uppercase bg-mat-wine text-white hover:bg-black transition-all shadow-lg font-sans flex items-center justify-center gap-3 disabled:opacity-50"
                >
                    {sending ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Transmitting...
                        </>
                    ) : (
                        <>
                            <Send size={16} /> Broadcast Decree
                        </>
                    )}
                </button>
            </div>
        </div>
      </motion.div>
    </div>
  );
};
