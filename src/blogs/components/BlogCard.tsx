import React from 'react';
import { motion } from 'framer-motion';
import type { Post } from '../data/posts';
import PerfectTextWrapper from './PerfectTextWrapper';

interface BlogCardProps {
  post: Post;
  index: number;
  onSelect: (postId: string) => void;
  isFeatured?: boolean;
}

const BlogCard: React.FC<BlogCardProps> = ({ post, index, onSelect, isFeatured = false }) => {
  return (
    <motion.div
      onClick={() => onSelect(post.id)}
      className={`group relative flex flex-col bg-[#0A0A0A] border border-white/5 rounded-[2rem] overflow-hidden hover:border-rose-500/30 transition-all duration-500 hover:shadow-[0_0_80px_rgba(225,29,72,0.05)] cursor-pointer h-full ${
        isFeatured ? "md:flex-row" : "flex-col"
      }`}
    >
      {/* Background Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-rose-500/0 via-transparent to-rose-500/0 group-hover:from-rose-500/[0.02] group-hover:to-rose-500/[0.02] transition-colors duration-700" />

      {/* Image Section */}
      <div className={`relative h-full overflow-hidden shrink-0 ${
        isFeatured ? "md:w-1/2" : "h-72 w-full"
      }`}>
        <motion.img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-[1.5s] ease-[cubic-bezier(0.22,1,0.36,1)]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/20 to-transparent opacity-80" />
        
        {/* Category Badge */}
        <div className="absolute top-8 left-8">
           <div className="px-5 py-2 rounded-full bg-black/40 border border-white/10 backdrop-blur-2xl shadow-2xl">
              <span className="text-[9px] font-black tracking-[0.3em] text-rose-500 uppercase">{post.category}</span>
           </div>
        </div>
      </div>

      {/* Content Section */}
      <div className={`relative p-10 flex flex-col justify-center ${
        isFeatured ? "md:w-1/2" : "w-full flex-grow"
      }`}>
        <div className="flex items-center gap-4 mb-8">
          <span className="text-[10px] font-black text-white/20 tracking-[0.4em] uppercase">{post.date}</span>
          <div className="w-1.5 h-1.5 rounded-full bg-rose-500/40" />
          <span className="text-[10px] font-black text-white/20 tracking-[0.4em] uppercase">{post.readTime}</span>
        </div>

        <div className="mb-6">
           <h3 className={`text-white font-black tracking-tighter leading-[1.1] transition-colors group-hover:text-rose-100 ${
              isFeatured ? "text-4xl md:text-5xl" : "text-2xl"
           }`}>
              {post.title}
           </h3>
        </div>

        <div className="mb-10">
           <p className={`text-white/40 font-light leading-relaxed italic ${
              isFeatured ? "text-lg" : "text-sm"
           }`}>
              {post.excerpt}
           </p>
        </div>

        <div className="mt-auto flex items-center justify-between">
          <div className="h-[1px] w-12 bg-white/10 group-hover:w-20 group-hover:bg-rose-500 transition-all duration-700" />
          <motion.div 
            whileHover={{ x: 5 }}
            className="text-[10px] font-black text-white uppercase tracking-[0.3em] group-hover:text-rose-500 transition-colors flex items-center gap-3"
          >
            Deep Dive
            <span className="text-lg leading-none">→</span>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default BlogCard;

