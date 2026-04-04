import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { turso } from '@/lib/turso';
import { supabase } from '@/lib/supabase';
import { Send, ChevronLeft, ShieldCheck, Heart, Info, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
}

interface ChatRoomProps {
  otherUserId: string;
  onBack?: () => void;
}

export const ChatRoom: React.FC<ChatRoomProps> = ({ otherUserId, onBack }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [otherUser, setOtherUser] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initChat = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        
        // Fetch users info for verification checks
        const usersResult = await turso.execute(
          "SELECT user_id, full_name, role, is_verified, photos FROM profiles WHERE user_id IN (?, ?)",
          [user.id, otherUserId]
        );
        
        const cur = usersResult.rows.find(r => r.user_id === user.id);
        const oth = usersResult.rows.find(r => r.user_id === otherUserId);
        
        setCurrentUser(cur);
        setOtherUser(oth);

        fetchMessages(user.id);
      } catch (err) {
        console.error("Chat init failed:", err);
      }
    };

    const fetchMessages = async (userId: string) => {
      try {
        const result = await turso.execute(`
          SELECT * FROM messages 
          WHERE (sender_id = ? AND receiver_id = ?) 
             OR (sender_id = ? AND receiver_id = ?)
          ORDER BY created_at ASC
        `, [userId, otherUserId, otherUserId, userId]);

        setMessages(result.rows as any);
        setLoading(false);
      } catch (err) {
        console.error("Fetch messages failed:", err);
      }
    };

    initChat();
    const interval = setInterval(() => {
      if (currentUser) fetchMessages(currentUser.user_id);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [otherUserId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sending || !otherUser || !currentUser) return;

    // "Verified Souls" Restriction
    if (!currentUser.is_verified || !otherUser.is_verified) {
      alert("Both souls must be verified by the Matriarch to resonant dialogues.");
      return;
    }

    // "Women Initiate Only" Logic:
    // If no messages exists, only women can send.
    if (messages.length === 0 && currentUser.role === 'man') {
      alert("A seeker walks a path of patience. Connection begins only when she initiates.");
      return;
    }

    setSending(true);
    try {
      const msgId = crypto.randomUUID();
      await turso.execute(
        "INSERT INTO messages (id, sender_id, receiver_id, content) VALUES (?, ?, ?, ?)",
        [msgId, currentUser.user_id, otherUserId, newMessage.trim()]
      );
      setNewMessage('');
      // Optimistic update
      setMessages(prev => [...prev, {
        id: msgId,
        sender_id: currentUser.user_id,
        receiver_id: otherUserId,
        content: newMessage.trim(),
        created_at: new Date().toISOString()
      }]);
    } catch (err) {
      console.error("Send failed:", err);
    } finally {
      setSending(false);
    }
  };

  if (loading) return (
    <div className="flex-1 flex flex-col items-center justify-center space-y-6">
       <Clock className="w-8 h-8 text-mat-wine/20 animate-spin" />
       <p className="text-[10px] uppercase tracking-widest text-mat-slate/40">Synchronizing Resonance...</p>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-mat-rose/10 flex items-center justify-between bg-white/40">
         <div className="flex items-center gap-4">
            {onBack && (
              <button onClick={onBack} className="lg:hidden p-2 -ml-2 text-mat-wine/60">
                 <ChevronLeft size={24} />
              </button>
            )}
            <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-mat-rose/10 shadow-sm">
               <img src={JSON.parse(otherUser?.photos || '[]')[0] || `https://api.dicebear.com/7.x/avataaars/svg?seed=${otherUserId}`} alt="" className="w-full h-full object-cover" />
            </div>
            <div>
               <h3 className="font-bold text-mat-wine italic">{otherUser?.full_name}</h3>
               <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[8px] h-4 tracking-tighter text-mat-gold/60 border-mat-gold/20 uppercase font-black">
                     {otherUser?.is_verified ? 'Verified Soul' : 'Aspirant'}
                  </Badge>
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
               </div>
            </div>
         </div>
         <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end opacity-20">
               <span className="text-[8px] font-black uppercase tracking-widest text-mat-wine">Signal Integrity</span>
               <div className="flex gap-1 mt-1">
                  {[1,2,3,4].map(i => <div key={i} className="w-1 h-3 bg-mat-wine rounded-full" />)}
               </div>
            </div>
            <ShieldCheck className="text-mat-rose/20 w-6 h-6" />
         </div>
      </div>

      {/* Messages Scroll Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 custom-scrollbar bg-gradient-to-b from-transparent to-mat-ivory/20"
      >
         {messages.length === 0 ? (
           <div className="h-full flex flex-col items-center justify-center text-center space-y-8 p-12 opacity-40">
              <div className="w-20 h-20 bg-mat-cream rounded-[2.5rem] flex items-center justify-center mx-auto border border-mat-rose/5">
                 <Heart className="w-10 h-10 text-mat-rose/20" strokeWidth={1} fill="currentColor" />
              </div>
              <div className="space-y-3">
                 <h4 className="text-xl font-bold text-mat-wine italic">A Sacred Silence.</h4>
                 <p className="text-[10px] uppercase tracking-[0.2em] leading-relaxed max-w-xs">
                    Connection awaits the first intentional resonance. 
                    {currentUser?.role === 'man' ? " A seeker walks with patience." : " You hold the power of initiation."}
                 </p>
              </div>
           </div>
         ) : (
           messages.map((msg) => (
             <motion.div
               key={msg.id}
               initial={{ opacity: 0, y: 10, scale: 0.98 }}
               animate={{ opacity: 1, y: 0, scale: 1 }}
               className={`flex ${msg.sender_id === currentUser?.user_id ? 'justify-end' : 'justify-start'}`}
             >
                <div className={`max-w-[85%] md:max-w-[70%] p-5 rounded-3xl text-sm leading-relaxed shadow-sm transition-all ${
                  msg.sender_id === currentUser?.user_id 
                  ? 'bg-mat-wine text-mat-cream rounded-tr-none' 
                  : 'bg-mat-cream text-mat-wine border border-mat-rose/10 rounded-tl-none font-medium italic'
                }`}>
                   {msg.content}
                   <div className={`text-[8px] mt-2 opacity-40 uppercase tracking-widest text-right`}>
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                   </div>
                </div>
             </motion.div>
           ))
         )}
      </div>

      {/* Input UI */}
      <div className="p-6 md:p-8 bg-white/60 border-t border-mat-rose/10 transition-all focus-within:bg-white">
         {(!currentUser?.is_verified || !otherUser?.is_verified) ? (
           <div className="h-16 flex items-center justify-center gap-3 bg-red-50/50 rounded-2xl border border-red-100 text-red-500/60 overflow-hidden">
              <Info size={14} />
              <span className="text-[9px] font-bold uppercase tracking-widest italic">Verification Seal Required for Dialogue.</span>
           </div>
         ) : (
           <form onSubmit={handleSendMessage} className="flex gap-4">
              <input 
                 value={newMessage}
                 onChange={(e) => setNewMessage(e.target.value)}
                 disabled={sending}
                 placeholder={messages.length === 0 && currentUser?.role === 'man' ? "Awaiting her initiation..." : "Weave your dialogue..."}
                 className="flex-1 h-14 bg-mat-cream border border-mat-rose/10 rounded-2xl px-6 text-[13px] tracking-tight focus:outline-none focus:ring-1 focus:ring-mat-rose/40 placeholder:text-mat-slate/20 transition-all font-medium italic"
              />
              <motion.button 
                 whileTap={{ scale: 0.95 }}
                 disabled={sending || !newMessage.trim()}
                 className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all bg-mat-wine text-mat-cream shadow-mat-premium hover:bg-mat-wine-soft disabled:opacity-20`}
              >
                 <Send size={18} className={sending ? 'animate-pulse' : ''} />
              </motion.button>
           </form>
         )}
         <p className="mt-4 text-center text-[8px] font-black uppercase tracking-[0.4em] text-mat-wine/10 select-none">MATRIARCH PROTOCOL SECURED</p>
      </div>
    </div>
  );
};
