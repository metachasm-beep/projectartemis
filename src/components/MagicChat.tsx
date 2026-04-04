import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  ShieldAlert, 
  Lock, 
  Sparkles, 
  ChevronLeft,
  Settings,
  AudioLines,
  Video,
  Pause,
  Trash2,
  MoreVertical,
  Zap,
  Clock,
  Unlock,
  ShieldCheck,
  Heart
} from 'lucide-react';
import { turso } from '@/lib/turso';
import { supabase } from '@/lib/supabase';
import { MessagingService, MessagingMatch, CommMode, MatriarchMessage } from '@/lib/messaging';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { cn } from '@/lib/utils';

interface ChatProps {
  match: MessagingMatch & { otherUser: any };
  currentUserId: string;
  userRole: 'woman' | 'man';
  onBack: () => void;
}

export const MagicChat: React.FC<ChatProps> = ({ match, currentUserId, userRole, onBack }) => {
  const [messages, setMessages] = useState<MatriarchMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [commMode, setCommMode] = useState<CommMode>(match.current_comm_mode);
  const [showControls, setShowControls] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const [showBloom, setShowBloom] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const isWoman = userRole === 'woman';
  const convIdRef = useRef<string | null>(null);

  // 🏹 Resonance Initialization
  useEffect(() => {
    let channel: any = null;
    const initSanctuary = async () => {
      try {
        const convResult = await turso.execute({
          sql: "SELECT id FROM conversations WHERE match_id = ?",
          args: [match.id]
        });
        const convId = convResult.rows[0].id as string;
        convIdRef.current = convId;
        
        const msgResult = await turso.execute({
          sql: "SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at ASC",
          args: [convId]
        });
        setMessages(msgResult.rows as unknown as MatriarchMessage[]);
        setLoading(false);

        // 🏵️ Bloom Ceremony check
        const bloomKey = `mat_bloom_${match.id}`;
        if (!localStorage.getItem(bloomKey)) {
           setShowBloom(true);
           localStorage.setItem(bloomKey, 'true');
        }

        channel = supabase.channel(`resonance_${convId}`)
          .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${convId}` }, (p) => {
             const newMsg = p.new as MatriarchMessage;
             setMessages(prev => (prev.find(m => m.id === newMsg.id) ? prev : [...prev, newMsg]));
          })
          .on('presence', { event: 'sync' }, () => {
             const state = channel.presenceState();
             const otherPresence = Object.values(state).flat().filter((p: any) => p.user_id !== currentUserId);
             // @ts-ignore
             setOtherUserTyping(otherPresence.some(p => p.isTyping));
          })
          .subscribe(async (s) => { if (s === 'SUBSCRIBED') await channel.track({ user_id: currentUserId, isTyping: false }); });

      } catch (e) { setLoading(false); }
    };
    initSanctuary();
    return () => { if (channel) channel.unsubscribe(); };
  }, [match.id, currentUserId]);

  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [messages, otherUserTyping]);

  const handleSend = async () => {
    if (!inputValue.trim() || sending || !convIdRef.current) return;
    setSending(true);
    try {
      const newMsg = await MessagingService.sendMessage(convIdRef.current, currentUserId, inputValue);
      setMessages(prev => (prev.find(m => m.id === newMsg.id) ? prev : [...prev, newMsg]));
      setInputValue('');
    } catch (e: any) { alert(e.message || "Sanctuary transmission failed."); }
    finally { setSending(false); }
  };

  const updateMode = async (mode: CommMode) => {
    try {
      await MessagingService.setCommMode(match.id, currentUserId, mode);
      setCommMode(mode);
      setShowControls(false);
    } catch (e) { console.error("Mode Sync Error:", e); }
  };

  // 🧩 Permission Rituals
  const isHold = commMode === 'HOLD';
  const isRevoked = commMode === 'REVOKED';
  const isTimeLocked = commMode === 'DELAYED_TEXT' && match.delayed_unlock_at && new Date(match.delayed_unlock_at) > new Date() && !isWoman;
  const isPromptLocked = commMode === 'PROMPT_INTRO' && !isWoman && !match.prompts_completed;
  const canSend = !isHold && !isRevoked && !isTimeLocked && !isPromptLocked;

  const getStatusLabel = () => {
    if (isHold) return { l: "Sanctuary in Recess", s: "The connection is being held for reflection.", i: Pause };
    if (isRevoked) return { l: "Connection Terminated", s: "The Matriarch has revoked this sanctuary resonance.", i: Lock };
    if (isTimeLocked) return { l: "Temporal Lock Active", s: "Resonance will be granted when the time is right.", i: Clock };
    if (isPromptLocked) return { l: "Aura Prompt Required", s: "Patience. She must initiate the ritual questions.", i: Zap };
    return { l: "Sanctuary Open", s: "Resonant dialogue is manifesting.", i: Sparkles };
  };
  const status = getStatusLabel();

  return (
    <div className="relative flex flex-col h-[75vh] md:h-[80vh] mat-glass-deep rounded-[3rem] border-mat-rose/10 overflow-hidden shadow-mat-premium mat-bloom-entry">
      {/* 🌸 Ceremony Bloom Overlay */}
      <AnimatePresence>
        {showBloom && (
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-[200] bg-mat-wine flex flex-col items-center justify-center p-12 text-center text-mat-cream space-y-12">
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.3 }} className="w-32 h-32 rounded-full border border-mat-gold/40 flex items-center justify-center text-mat-gold shadow-mat-gold"><Heart size={64} fill="currentColor" /></motion.div>
              <div className="space-y-4">
                 <h2 className="text-6xl font-bold mat-text-display-pro italic">Sanctuary <br /> Established.</h2>
                 <p className="text-sm italic opacity-60 tracking-[0.2em] uppercase max-w-sm">A sovereign connection has bloomed. Handle this resonance with ultimate care.</p>
              </div>
              <Button onClick={() => setShowBloom(false)} className="h-20 px-12 bg-mat-gold text-mat-wine rounded-[2.5rem] font-black uppercase tracking-widest text-[11px] shadow-mat-gold">Enter Presence</Button>
           </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Header ─── */}
      <div className="p-8 border-b border-mat-rose/5 flex items-center justify-between bg-white/40 backdrop-blur-2xl">
         <div className="flex items-center gap-6">
            <button onClick={onBack} className="p-4 rounded-2xl hover:bg-mat-wine/5 text-mat-rose transition-all"><ChevronLeft size={24} /></button>
            <div className="flex items-center gap-5">
               <div className="w-14 h-14 rounded-2xl overflow-hidden border border-mat-rose/10 shadow-sm transition-transform hover:scale-105">
                  <img src={match.otherUser.avatar} alt="" className="w-full h-full object-cover grayscale brightness-110" />
               </div>
               <div>
                  <h3 className="text-xl font-bold text-mat-wine italic leading-none">{match.otherUser.full_name}</h3>
                  <div className="flex items-center gap-2 mt-2">
                     <div className="w-2 h-2 bg-mat-gold rounded-full shadow-[0_0_10px_#BFA06A] animate-pulse" />
                     <p className="mat-text-label-pro !text-[7px] text-mat-wine/40">{commMode.replace('_',' ')} MODE</p>
                  </div>
               </div>
            </div>
         </div>
         <div className="flex items-center gap-4">
            {isWoman && (
              <button onClick={() => setShowControls(!showControls)} className={cn("p-5 rounded-[1.75rem] transition-all shadow-md", showControls ? "bg-mat-wine text-mat-cream" : "bg-white/60 text-mat-wine border border-mat-rose/10")}>
                 <Settings size={20} />
              </button>
            )}
         </div>
      </div>

      {/* ─── Persistent Status Context ─── */}
      <div className="bg-mat-wine/5 border-b border-mat-rose/5 px-8 py-4 flex items-center justify-center gap-4">
         <status.i size={14} className="text-mat-rose opacity-60" />
         <p className="text-[9px] font-black uppercase tracking-widest text-mat-wine/60 italic">{status.l} — <span className="opacity-40">{status.s}</span></p>
      </div>

      {/* ─── Control Hub (Woman Exclusive) ─── */}
      <AnimatePresence>
        {showControls && isWoman && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="bg-mat-cream border-b border-mat-rose/10 overflow-hidden shadow-inner">
             <div className="p-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                {['TEXT', 'DELAYED_TEXT', 'HOLD', 'REVOKED'].map((m) => (
                  <button key={m} onClick={() => updateMode(m as CommMode)} className={cn("flex flex-col items-center justify-center gap-3 p-6 rounded-[2rem] text-[9px] font-black uppercase tracking-[0.2em] border transition-all", commMode === m ? "bg-mat-wine text-mat-cream border-mat-wine shadow-mat-premium scale-[1.05]" : "bg-white/40 text-mat-wine border-mat-rose/5 hover:border-mat-rose/40")}>
                    {m === 'TEXT' ? <Zap size={18} /> : m === 'HOLD' ? <Pause size={18} /> : m === 'REVOKED' ? <Lock size={18} /> : <Clock size={18} />}
                    {m.replace('_', ' ')}
                  </button>
                ))}
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Messages View ─── */}
      <div ref={scrollRef} className="flex-1 p-10 overflow-y-auto space-y-12 custom-scrollbar bg-mat-cream-deep/20">
         {messages.map((msg, i) => {
            const isMe = msg.sender_user_id === currentUserId;
            return (
              <motion.div key={msg.id} initial={{ opacity: 0, y: 10, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} className={cn("flex w-full", isMe ? "justify-end" : "justify-start")}>
                 <div className={cn("max-w-[70%] p-8 rounded-[2.5rem] text-[15px] leading-relaxed shadow-sm", isMe ? "bg-mat-wine text-mat-cream rounded-tr-none shadow-mat-rose/20" : "bg-white border border-mat-rose/5 text-mat-wine rounded-tl-none")}>
                    {msg.body}
                    <p className={cn("text-[7px] mt-4 uppercase tracking-widest opacity-20 font-black italic", isMe ? "text-right" : "text-left")}>{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                 </div>
              </motion.div>
            );
         })}
         {otherUserTyping && (
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2 p-4">
              {[0, 0.2, 0.4].map(d => <div key={d} className="w-1.5 h-1.5 bg-mat-rose rounded-full animate-bounce" style={{animationDelay:`${d}s`}} />)}
           </motion.div>
         )}
      </div>

      {/* ─── Sovereign Asymmetric Input ─── */}
      <div className="p-10 bg-white/40 border-t border-mat-rose/5 backdrop-blur-3xl">
         {!canSend ? (
           <div className="flex flex-col items-center justify-center py-6 text-center space-y-5 animate-in fade-in slide-in-from-bottom-4">
              <div className="flex items-center gap-4 px-10 py-5 rounded-[2rem] bg-mat-wine/5 border border-mat-rose/10 text-mat-wine/60 shadow-inner">
                 <Lock size={18} className="opacity-40" />
                 <span className="text-[11px] font-black uppercase tracking-[0.4em] italic">Resonance Shielded</span>
              </div>
              <p className="text-[10px] uppercase font-black tracking-widest text-mat-wine/20 max-w-sm leading-relaxed">{status.s}</p>
           </div>
         ) : (
           <div className="flex items-center gap-6 bg-white rounded-[2.5rem] p-4 border border-mat-rose/10 shadow-mat-premium focus-within:border-mat-wine focus-within:shadow-mat-rose/10 transition-all group">
              <input value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSend()} placeholder="Share your resonance..." className="flex-1 bg-transparent border-none outline-none px-6 text-sm italic font-bold placeholder:text-mat-slate/20 text-mat-wine" />
              <button onClick={handleSend} disabled={!inputValue.trim() || sending} className="w-20 h-20 bg-mat-wine text-mat-cream rounded-full flex items-center justify-center hover:bg-mat-wine-soft shadow-mat-premium transition-all active:scale-95 disabled:opacity-10">
                 {sending ? <Sparkles size={24} className="animate-spin" /> : <Send size={24} />}
              </button>
           </div>
         )}
      </div>
    </div>
  );
};
