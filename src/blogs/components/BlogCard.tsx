import React from 'react';
import { motion } from 'framer-motion';
import type { Post } from '../data/posts';
import PerfectTextWrapper from './PerfectTextWrapper';

interface BlogCardProps {
  post: Post;
  index: number;
}

const BlogCard: React.FC<BlogCardProps> = ({ post, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group relative flex flex-col bg-[#0A0A0A] border border-white/5 rounded-3xl overflow-hidden hover:border-rose-500/30 transition-all hover:shadow-[0_0_40px_rgba(225,29,72,0.1)]"
    >
      {/* Image Section */}
      <div className="relative h-64 overflow-hidden">
        <motion.img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] to-transparent opacity-60" />
        
        {/* Category Badge */}
        <div className="absolute top-6 left-6 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 backdrop-blur-md">
          <span className="text-[10px] font-black tracking-widest text-rose-500 uppercase">{post.category}</span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-8 flex flex-col flex-grow">
        <div className="flex items-center gap-3 mb-4 text-[11px] font-medium text-white/40 tracking-widest uppercase">
          <span>{post.date}</span>
          <span className="w-1 h-1 rounded-full bg-white/20" />
          <span>{post.readTime}</span>
        </div>

        <div className="mb-4">
          <PerfectTextWrapper 
            text={post.title}
            font="600 24px 'Playfair Display'"
            maxWidth={320}
            lineHeight={32}
            className="text-white group-hover:text-rose-200 transition-colors"
            as="h3"
          />
        </div>

        <div className="mb-8 flex-grow">
          <PerfectTextWrapper 
            text={post.excerpt}
            font="400 15px 'Inter'"
            maxWidth={300}
            lineHeight={24}
            className="text-white/50"
            as="p"
          />
        </div>

        <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
          <span className="text-xs font-bold text-white uppercase tracking-widest group-hover:translate-x-1 transition-transform inline-flex items-center gap-2">
            Read Entry
            <span className="text-rose-500">→</span>
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default BlogCard;
