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
  Zap
} from 'lucide-react';
import { turso, tursoHelpers } from '@/lib/turso';
import { MessagingService, MessagingMatch, CommMode, MatriarchMessage } from '@/lib/messaging';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

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
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const isWoman = userRole === 'woman';

  // 🔄 Resonance Polling (Fallback for real-time)
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const convResult = await turso.execute({
          sql: "SELECT id FROM conversations WHERE match_id = ?",
          args: [match.id]
        });
        const convId = convResult.rows[0].id as string;
        
        const msgResult = await turso.execute({
          sql: "SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at ASC",
          args: [convId]
        });
        setMessages(msgResult.rows as unknown as MatriarchMessage[]);
      } catch (e) {
        console.error("Chat History Error:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
    const interval = setInterval(fetchHistory, 3000);
    return () => clearInterval(interval);
  }, [match.id]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || sending) return;
    setSending(true);
    try {
      const convResult = await turso.execute({
        sql: "SELECT id FROM conversations WHERE match_id = ?",
        args: [match.id]
      });
      const convId = convResult.rows[0].id as string;
      
      const newMsg = await MessagingService.sendMessage(convId, currentUserId, inputValue);
      setMessages(prev => [...prev, newMsg]);
      setInputValue('');
    } catch (e: any) {
      alert(e.message || "Message transmission failed.");
    } finally {
      setSending(false);
    }
  };

  const updateMode = async (mode: CommMode) => {
    try {
      await MessagingService.setCommMode(match.id, currentUserId, mode);
      setCommMode(mode);
      setShowControls(false);
    } catch (e) {
      console.error("Mode Update Error:", e);
    }
  };

  // 🧩 Permission Gates
  const isModeRestricted = commMode === 'HOLD' || commMode === 'REVOKED';
  const isTimeLocked = commMode === 'DELAYED_TEXT' && match.delayed_unlock_at && new Date(match.delayed_unlock_at) > new Date() && !isWoman;
  const isPromptLocked = commMode === 'PROMPT_INTRO' && !isWoman && !match.prompts_completed;
  const canSend = !isModeRestricted && !isTimeLocked && !isPromptLocked;

  return (
    <div className="flex flex-col h-[75vh] md:h-[80vh] mat-glass rounded-[3rem] border-mat-rose/10 overflow-hidden shadow-mat-premium">
      {/* ─── Header ─── */}
      <div className="p-8 border-b border-mat-rose/10 flex items-center justify-between bg-white/40 backdrop-blur-md">
         <div className="flex items-center gap-6">
            <button onClick={onBack} className="p-3 rounded-2xl hover:bg-mat-wine/5 text-mat-rose transition-colors">
               <ChevronLeft size={20} />
            </button>
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-2xl overflow-hidden border border-mat-rose/10">
                  <img src={match.otherUser.avatar} alt="" className="w-full h-full object-cover" />
               </div>
               <div>
                  <h3 className="text-lg font-bold text-mat-wine italic leading-none">{match.otherUser.full_name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                     <div className="w-1.5 h-1.5 bg-mat-gold rounded-full animate-pulse" />
                     <p className="text-[8px] font-black uppercase tracking-[0.2em] text-mat-slate/40">{commMode.replace('_', ' ')} MODE</p>
                  </div>
               </div>
            </div>
         </div>
         
         <div className="flex items-center gap-2">
            {isWoman && (
              <button 
                onClick={() => setShowControls(!showControls)}
                className="p-4 rounded-2xl bg-mat-wine text-mat-cream hover:bg-mat-wine-soft shadow-sm transition-all"
              >
                 <Settings size={18} />
              </button>
            )}
            <button className="p-4 rounded-2xl hover:bg-mat-wine/5 text-mat-slate/40">
               <MoreVertical size={18} />
            </button>
         </div>
      </div>

      {/* ─── Control Hub (Woman Exclusive) ─── */}
      <AnimatePresence>
        {showControls && isWoman && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-mat-wine/5 border-b border-mat-rose/10 overflow-hidden"
          >
             <div className="p-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { mode: 'TEXT', icon: <Zap size={16} /> },
                  { mode: 'DELAYED_TEXT', icon: <Clock size={16} /> },
                  { mode: 'HOLD', icon: <Pause size={16} /> },
                  { mode: 'REVOKED', icon: <Trash2 size={16} /> },
                ].map((item) => (
                  <button
                    key={item.mode}
                    onClick={() => updateMode(item.mode as CommMode)}
                    className={cn(
                      "flex items-center gap-3 p-4 rounded-2xl text-[9px] font-black uppercase tracking-widest border transition-all",
                      commMode === item.mode 
                        ? "bg-mat-wine text-mat-cream border-mat-wine" 
                        : "bg-white/40 text-mat-wine border-mat-rose/10 hover:border-mat-rose"
                    )}
                  >
                    {item.icon} {item.mode.replace('_', ' ')}
                  </button>
                ))}
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Messages View ─── */}
      <div ref={scrollRef} className="flex-1 p-8 overflow-y-auto space-y-8 custom-scrollbar">
         {messages.length === 0 && !loading && (
           <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
              <Sparkles className="w-12 h-12 text-mat-rose/20 mb-4" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-mat-wine">Initial Resonance Awaited</p>
           </div>
         )}
         
         {messages.map((msg, i) => {
            const isMe = msg.sender_user_id === currentUserId;
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={cn("flex w-full", isMe ? "justify-end" : "justify-start")}
              >
                 <div className={cn(
                    "max-w-[80%] p-6 rounded-[2rem] shadow-sm text-sm font-medium leading-relaxed",
                    isMe 
                      ? "bg-mat-wine text-mat-cream rounded-tr-none" 
                      : "bg-white border border-mat-rose/10 text-mat-wine rounded-tl-none"
                 )}>
                    {msg.body}
                    <div className={cn("text-[7px] mt-3 uppercase tracking-widest font-black opacity-30 italic", isMe ? "text-right" : "text-left")}>
                       {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                 </div>
              </motion.div>
            );
         })}
      </div>

      {/* ─── Asymmetric Input / Status ─── */}
      <div className="p-8 bg-white/40 border-t border-mat-rose/10">
         {!canSend ? (
           <motion.div 
             initial={{ opacity: 0 }} 
             animate={{ opacity: 1 }}
             className="flex flex-col items-center justify-center py-4 space-y-4"
           >
              <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-mat-wine/5 border border-mat-rose/10 text-mat-wine/40">
                 <Lock size={14} />
                 <span className="text-[9px] font-black uppercase tracking-[0.4em] italic">
                    {isTimeLocked ? "Sanctuary Lock: 24h Remaining" : isPromptLocked ? "Story Completion Required" : "Communication Recessed"}
                 </span>
              </div>
              <p className="text-[10px] font-medium text-mat-slate/60 text-center max-w-sm italic">
                {isPromptLocked 
                  ? "You must fulfill the introductory story prompts requested by the woman before this resonance can deepen." 
                  : "The sanctuary is currently in a state of recession. Patience is the ultimate virtue of the devotee."}
              </p>
           </motion.div>
         ) : (
           <div className="flex items-center gap-4 bg-white rounded-[2rem] p-2 border border-mat-rose/10 shadow-sm focus-within:border-mat-wine transition-all">
              <input 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Share your resonance..."
                className="flex-1 bg-transparent border-none outline-none px-6 text-sm italic font-medium placeholder:text-mat-slate/20"
              />
              <button 
                onClick={handleSend}
                disabled={!inputValue.trim() || sending}
                className="w-14 h-14 bg-mat-wine text-mat-cream rounded-full flex items-center justify-center hover:bg-mat-wine-soft disabled:opacity-20 transition-all"
              >
                 {sending ? <Sparkles size={18} className="animate-spin" /> : <Send size={18} />}
              </button>
           </div>
         )}
      </div>
    </div>
  );
};

// Utility for App-wide usage
function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
