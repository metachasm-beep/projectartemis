import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Heart, MessageCircle, Bookmark, Share2, MoreHorizontal, Sparkles, X, Shield } from 'lucide-react';
import { Button } from '@heroui/react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ForumService } from '@/lib/forumService';
import { formatDistanceToNow } from 'date-fns';

export interface PostProps {
  id: string;
  category: string;
  title: string;
  content: string;
  author_id: string;
  author_name: string;
  author_avatar: string;
  created_at: string;
  real_likes: number;
  real_replies: number;
  total_aura_earned: number;
  author_role?: string;
}

export const ForumPost: React.FC<{ post: PostProps, onReply: (id: string) => void }> = ({ post, onReply }) => {
  const [likes, setLikes] = useState(post.real_likes);
  const [isLiked, setIsLiked] = useState(false); // In a fully stateful app, we'd sync this globally
  const [isSaved, setIsSaved] = useState(false);
  const [earnedAura, setEarnedAura] = useState(post.total_aura_earned || 0);
  const [showTipOptions, setShowTipOptions] = useState(false);

  const handleTip = async (amount: number) => {
    setShowTipOptions(false);
    try {
      await ForumService.tipTopic(post.id, post.author_id, amount);
      setEarnedAura((prev: number) => prev + amount);
      // PWA standard best-practice alert: In a fully styled app, replace with a toast framework.
      alert(`✨ Catalyst Successful! You transferred ${amount} Aura to ${post.author_name}.`);
    } catch (e: any) {
      alert(`❌ Strategy Failed: ${e.message || "Insufficient Aura Balance or Network Error."}`);
    }
  };

  const handleLike = async () => {
    // Optimistic UI
    setIsLiked(!isLiked);
    setLikes((prev: number) => isLiked ? prev - 1 : prev + 1);
    try {
      const liked = await ForumService.toggleLike(post.id);
      setIsLiked(liked);
    } catch {
      // Revert on failure
      setIsLiked(isLiked);
      setLikes((prev: number) => isLiked ? prev + 1 : prev - 1);
    }
  };

  const isAdminAuthor = post.author_role === 'admin';

  return (
    <div className={cn(
      "bg-[#1a1a1a] border rounded-3xl p-5 shadow-2xl break-inside-avoid mb-6 flex flex-col gap-4 group transition-all",
      isAdminAuthor 
        ? "border-mat-gold/50 shadow-[0_0_30px_rgba(212,175,55,0.15)] bg-[#1e1c14]" 
        : "border-white/5 hover:border-mat-gold/20"
    )}>
       
       <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
             <div className="relative">
                <img 
                  src={post.author_avatar} 
                  referrerPolicy="no-referrer"
                  alt={post.author_name} 
                  className={cn("w-8 h-8 rounded-full object-cover ring-2", isAdminAuthor ? "ring-mat-gold" : "ring-mat-gold/20")} 
                />
                {isAdminAuthor && (
                   <div className="absolute -top-1 -right-1 bg-mat-gold rounded-full p-0.5 shadow-sm">
                      <Shield size={8} fill="black" className="text-black" />
                   </div>
                )}
             </div>
             <div>
                <div className="flex items-center gap-2">
                   <p className={cn("text-[11px] font-black uppercase tracking-widest", isAdminAuthor ? "text-mat-gold" : "text-mat-cream")}>{post.author_name}</p>
                   {isAdminAuthor && (
                      <Badge variant="gold" className="text-[6px] h-3 px-1.5 font-black uppercase tracking-tighter">Architect</Badge>
                   )}
                </div>
                <p className="text-[9px] text-white/40 font-medium">
                   {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                </p>
             </div>
          </div>
          <Button isIconOnly variant="ghost" size="sm" className="text-white/30 -mr-2 min-w-0 w-8 h-8 p-0">
             <MoreHorizontal size={16} />
          </Button>
       </div>

       <div className="flex items-center gap-2 mt-1">
          <span className="text-[8px] uppercase tracking-[0.2em] font-black bg-mat-gold/10 text-mat-gold px-2 py-1 rounded-sm">
             {post.category}
          </span>
       </div>

       <div className="space-y-2">
          <h4 className="text-lg font-black font-['Impact'] italic tracking-wide leading-tight text-white">{post.title}</h4>
          <div className="prose prose-invert prose-p:text-xs prose-a:text-mat-gold prose-li:text-xs opacity-70 line-clamp-4">
             <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {post.content}
             </ReactMarkdown>
          </div>
       </div>

       <div className="flex items-center justify-between pt-3 border-t border-white/5 mt-2">
          <div className="flex gap-4">
             <button onClick={handleLike} className={`flex items-center gap-1.5 text-[10px] font-black tracking-widest transition-colors ${isLiked ? 'text-mat-rose' : 'text-white/40 hover:text-mat-rose'}`}>
                <Heart size={14} fill={isLiked ? "currentColor" : "none"} /> {likes}
             </button>
             <button onClick={() => onReply(post.id)} className="flex items-center gap-1.5 text-[10px] font-black tracking-widest text-white/40 hover:text-white transition-colors">
                <MessageCircle size={14} /> {post.real_replies}
             </button>
             
             <div className="relative">
                <button 
                  onClick={() => setShowTipOptions(!showTipOptions)}
                  className="flex items-center gap-1.5 text-[10px] font-black tracking-widest text-mat-gold/80 hover:text-mat-gold hover:scale-105 transition-all"
                >
                   <Sparkles size={14} /> {earnedAura}
                </button>

                <AnimatePresence>
                   {showTipOptions && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.9 }}
                        className="absolute bottom-full mb-3 left-0 z-50 bg-[#0a0a0a] border border-mat-gold/20 p-2 rounded-2xl shadow-2xl flex gap-2 min-w-[200px]"
                      >
                         <Button size="sm" className="bg-mat-gold/10 text-mat-gold font-bold hover:bg-mat-gold/20 h-8 px-3 text-[10px]" onPress={() => handleTip(10)}>+10</Button>
                         <Button size="sm" className="bg-mat-gold/10 text-mat-gold font-bold hover:bg-mat-gold/20 h-8 px-3 text-[10px]" onPress={() => handleTip(50)}>+50</Button>
                         <Button size="sm" className="bg-mat-gold/10 text-mat-gold font-bold hover:bg-mat-gold/20 h-8 px-3 text-[10px]" onPress={() => handleTip(100)}>+100</Button>
                         <button onClick={() => setShowTipOptions(false)} className="ml-1 text-white/20 hover:text-white">
                            <X size={12} />
                         </button>
                      </motion.div>
                   )}
                </AnimatePresence>
             </div>
          </div>
          <div className="flex gap-2">
             <button onClick={() => setIsSaved(!isSaved)} className={`p-1.5 rounded-full transition-colors ${isSaved ? 'text-mat-gold bg-mat-gold/10' : 'text-white/40 hover:bg-white/5'}`}>
                <Bookmark size={14} fill={isSaved ? "currentColor" : "none"} />
             </button>
             <button className="p-1.5 rounded-full text-white/40 hover:bg-white/5 transition-colors">
                <Share2 size={14} />
             </button>
          </div>
       </div>
    </div>
  );
};
