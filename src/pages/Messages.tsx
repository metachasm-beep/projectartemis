import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { turso } from '@/lib/turso';
import { supabase } from '@/lib/supabase';
import { MessageCircle, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ChatRoom } from '@/components/ChatRoom';

interface Conversation {
  other_user_id: string;
  full_name: string;
  avatar_url: string;
  last_message: string;
  last_message_at: string;
  unread_count: number;
}

export const Messages: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const fetchConversations = async () => {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        setCurrentUser(user);

        // Fetch all conversations where user is participant
        // We join with profiles to get the other user's info
        const result = await turso.execute(`
          SELECT 
            CASE WHEN sender_id = ? THEN receiver_id ELSE sender_id END as other_user_id,
            MAX(created_at) as last_message_at,
            (SELECT content FROM messages WHERE (sender_id = ? AND receiver_id = other_user_id) OR (sender_id = other_user_id AND receiver_id = ?) ORDER BY created_at DESC LIMIT 1) as last_message,
            p.full_name,
            p.photos
          FROM messages m
          JOIN profiles p ON p.user_id = (CASE WHEN m.sender_id = ? THEN m.receiver_id ELSE m.sender_id END)
          WHERE sender_id = ? OR receiver_id = ?
          GROUP BY other_user_id
          ORDER BY last_message_at DESC
        `, [user.id, user.id, user.id, user.id, user.id, user.id]);

        const formatted: Conversation[] = result.rows.map((row: any) => ({
          other_user_id: row.other_user_id,
          full_name: row.full_name,
          avatar_url: JSON.parse(row.photos || '[]')[0] || '',
          last_message: row.last_message,
          last_message_at: row.last_message_at,
          unread_count: 0 // TODO: Add unread logic if needed
        }));

        setConversations(formatted);
      } catch (err) {
        console.error("Inbox load failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
    
    // Polling for new messages (Standard Turso security/simplicity)
    const interval = setInterval(fetchConversations, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading && conversations.length === 0) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
         <div className="flex gap-2">
            {[1,2,3].map(i => <div key={i} className="w-3 h-3 bg-mat-wine rounded-full animate-bounce" style={{animationDelay: `${i*0.1}s`}} />)}
         </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[75vh]">
        
        {/* Sidebar / Conversation List */}
        <div className={`lg:col-span-4 flex flex-col space-y-6 ${selectedUserId ? 'hidden lg:flex' : 'flex'}`}>
           <div className="space-y-4">
              <div className="flex items-center justify-between">
                 <h2 className="text-3xl font-bold text-mat-wine italic" style={{fontFamily: 'var(--font-display)'}}>Whispers</h2>
                 <Badge variant="outline" className="border-mat-rose/20 text-mat-rose text-[9px] uppercase tracking-widest px-3">Verified Souls</Badge>
              </div>
              <div className="relative">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-mat-slate/30 w-4 h-4" />
                 <input 
                    placeholder="Search dialogues..." 
                    className="w-full h-12 bg-mat-ivory border border-mat-rose/10 rounded-2xl pl-12 pr-4 text-xs tracking-wide focus:outline-none focus:border-mat-rose/40 transition-all"
                 />
              </div>
           </div>

           <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar pr-2">
              {conversations.length === 0 ? (
                <div className="text-center py-20 opacity-40 italic">
                   <p className="text-xs uppercase tracking-widest">No active dialogues found.</p>
                </div>
              ) : (
                conversations.map((conv) => (
                  <motion.button
                    key={conv.other_user_id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedUserId(conv.other_user_id)}
                    className={`w-full p-6 rounded-3xl flex items-center gap-4 transition-all border ${
                      selectedUserId === conv.other_user_id 
                      ? 'bg-mat-wine text-mat-cream border-mat-wine shadow-mat-premium' 
                      : 'bg-mat-ivory/50 border-mat-rose/5 hover:bg-mat-ivory hover:border-mat-rose/20'
                    }`}
                  >
                     <div className="relative">
                        <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-sm border border-black/5">
                           <img src={conv.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${conv.other_user_id}`} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
                     </div>
                     <div className="flex-1 text-left min-w-0">
                        <div className="flex justify-between items-start">
                           <h4 className="font-bold text-sm tracking-tight truncate">{conv.full_name}</h4>
                           <span className={`text-[8px] uppercase tracking-widest ${selectedUserId === conv.other_user_id ? 'text-mat-cream/40' : 'text-mat-slate/30'}`}>
                             {new Date(conv.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                           </span>
                        </div>
                        <p className={`text-[10px] truncate mt-1 ${selectedUserId === conv.other_user_id ? 'text-mat-cream/60' : 'text-mat-slate/40'}`}>
                           {conv.last_message}
                        </p>
                     </div>
                  </motion.button>
                ))
              )}
           </div>
        </div>

        {/* Chat Area */}
        <div className={`lg:col-span-8 bg-mat-ivory/30 rounded-[3rem] border border-mat-rose/10 overflow-hidden ${selectedUserId ? 'flex flex-col' : 'hidden lg:flex flex-col items-center justify-center p-20 text-center opacity-40'}`}>
           {selectedUserId ? (
             <ChatRoom 
                otherUserId={selectedUserId} 
                onBack={() => setSelectedUserId(null)} 
             />
           ) : (
             <div className="space-y-6">
                <div className="w-20 h-20 bg-mat-cream rounded-[2rem] flex items-center justify-center mx-auto shadow-sm">
                   <MessageCircle className="w-10 h-10 text-mat-wine/20" strokeWidth={1.5} />
                </div>
                <div className="space-y-2">
                   <h3 className="text-xl font-bold text-mat-wine italic">Open a Sanctuary Window</h3>
                   <p className="text-[10px] uppercase tracking-[0.3em]">Select a dialogue to begin resonance</p>
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};
