import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Heart, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  ChevronRight,
  Zap
} from 'lucide-react';
import { turso } from '@/lib/turso';
import { MessagingService, MessagingMatch } from '@/lib/messaging';
import { Badge } from './ui/badge';

interface InboxProps {
  currentUserId: string;
  userRole: 'woman' | 'man';
  onSelectMatch: (match: MessagingMatch & { otherUser: any }) => void;
}

export const SanctuaryInbox: React.FC<InboxProps> = ({ currentUserId, userRole, onSelectMatch }) => {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      setLoading(true);
      try {
        const query = userRole === 'woman' 
          ? "SELECT m.*, p.full_name, p.photos FROM matches m JOIN profiles p ON m.man_user_id = p.user_id WHERE m.woman_user_id = ? AND m.status = 'ACTIVE' ORDER BY m.selected_at DESC"
          : "SELECT m.*, p.full_name, p.photos FROM matches m JOIN profiles p ON m.woman_user_id = p.user_id WHERE m.man_user_id = ? AND m.status = 'ACTIVE' ORDER BY m.selected_at DESC";
        
        const res = await turso.execute({
          sql: query,
          args: [currentUserId]
        });

        setMatches(res.rows.map(r => ({
          ...r,
          otherUser: {
            full_name: r.full_name,
            avatar: JSON.parse(r.photos as string || '[]')[0] || `https://api.dicebear.com/7.x/avataaars/svg?seed=${r.id}`
          }
        })));
      } catch (e) {
        console.error("Inbox Fetch Error:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [currentUserId, userRole]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 space-y-4 opacity-40">
       <Sparkles className="animate-spin text-mat-rose" />
       <p className="mat-text-label-pro text-[9px]">Sifting Resonant Frequencies...</p>
    </div>
  );

  if (matches.length === 0) return (
    <div className="flex flex-col items-center justify-center py-40 px-12 text-center space-y-8 mat-glass rounded-[3rem] border-dashed border-mat-rose/20">
       <div className="p-8 rounded-[2rem] bg-mat-wine/5 text-mat-wine/20">
          <Heart size={48} strokeWidth={0.5} />
       </div>
       <div className="space-y-4">
          <h3 className="text-2xl font-bold italic text-mat-wine">No Active Sanctuary Resonances</h3>
          <p className="text-mat-slate/40 text-[10px] uppercase tracking-widest max-w-xs mx-auto leading-relaxed">
            {userRole === 'woman' 
              ? "Discover seekers in the Home tab and initiate your first sanctuary connection." 
              : "Connection begins when a woman initiates resonance. Your story is being shared."}
          </p>
       </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <AnimatePresence>
        {matches.map((match, idx) => (
          <motion.div
            key={match.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            onClick={() => onSelectMatch(match)}
            className="group cursor-pointer mat-glass hover:bg-white/80 border-mat-rose/10 p-8 rounded-[2.5rem] flex items-center gap-6 transition-all shadow-sm hover:shadow-mat-rose duration-500"
          >
             <div className="relative">
                <div className="w-20 h-20 rounded-[1.75rem] overflow-hidden border-2 border-mat-rose/10 group-hover:border-mat-rose/40 transition-colors">
                   <img src={match.otherUser.avatar} alt="" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                </div>
                {match.current_comm_mode === 'TEXT' && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-mat-gold rounded-full flex items-center justify-center border-2 border-mat-cream shadow-sm">
                     <Zap size={10} fill="black" />
                  </div>
                )}
             </div>

             <div className="flex-1 space-y-2">
                <div className="flex justify-between items-start">
                   <h4 className="text-xl font-bold text-mat-wine italic leading-none">{match.otherUser.full_name.split(' ')[0]}</h4>
                   <ChevronRight size={14} className="text-mat-rose/20 group-hover:text-mat-rose group-hover:translate-x-1 transition-all" />
                </div>
                <div className="flex flex-wrap gap-2">
                   <Badge variant="outline" className="text-[8px] px-2 border-mat-rose/10 text-mat-rose uppercase font-black tracking-widest bg-mat-rose/5">
                      {match.current_comm_mode.replace('_', ' ')}
                   </Badge>
                   {match.prompts_completed && (
                     <Badge variant="gold" className="text-[7px] px-2 font-black uppercase tracking-widest">PROMPTS SEALED</Badge>
                   )}
                </div>
                <p className="text-[9px] text-mat-slate/40 uppercase tracking-widest font-medium italic mt-2">
                   {match.current_comm_mode === 'DELAYED_TEXT' ? "Sanctuary Locked..." : "Resonant dialogue active"}
                </p>
             </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
