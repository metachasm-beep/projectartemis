import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Heart, MessageCircle, Bookmark, Share2, MoreHorizontal } from 'lucide-react';
import { Button } from '@heroui/react';
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
}

export const ForumPost: React.FC<{ post: PostProps, onReply: (id: string) => void }> = ({ post, onReply }) => {
  const [likes, setLikes] = useState(post.real_likes);
  const [isLiked, setIsLiked] = useState(false); // In a fully stateful app, we'd sync this globally
  const [isSaved, setIsSaved] = useState(false);

  const handleLike = async () => {
    // Optimistic UI
    setIsLiked(!isLiked);
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
    try {
      const liked = await ForumService.toggleLike(post.id);
      setIsLiked(liked);
    } catch {
      // Revert on failure
      setIsLiked(isLiked);
      setLikes(prev => isLiked ? prev + 1 : prev - 1);
    }
  };

  return (
    <div className="bg-[#1a1a1a] border border-white/5 rounded-3xl p-5 shadow-2xl break-inside-avoid mb-6 flex flex-col gap-4 group hover:border-mat-gold/20 transition-all">
       
       <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
             <img src={post.author_avatar} alt={post.author_name} className="w-8 h-8 rounded-full object-cover ring-2 ring-mat-gold/20" />
             <div>
                <p className="text-[11px] font-black uppercase tracking-widest text-mat-cream">{post.author_name}</p>
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
