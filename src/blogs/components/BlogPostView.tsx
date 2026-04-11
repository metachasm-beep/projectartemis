import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Post } from '../data/posts';
import { DUMMY_ASPIRANTS } from '../../data/dummyProfiles';
import PerfectTextWrapper from './PerfectTextWrapper';

interface BlogPostViewProps {
  post: Post;
  onBack: () => void;
}

const BlogPostView: React.FC<BlogPostViewProps> = ({ post, onBack }) => {
  const author = useMemo(() => {
    return DUMMY_ASPIRANTS.find(a => a.id === post.authorId);
  }, [post.authorId]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-[#030303] overflow-y-auto pt-20 pb-20"
    >
      {/* Top Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 z-[110] p-6 flex justify-between items-center bg-gradient-to-b from-[#030303] to-transparent pointer-events-none">
        <button 
          onClick={onBack}
          className="pointer-events-auto px-6 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl text-white/60 text-xs font-bold uppercase tracking-widest hover:text-white hover:border-white/20 transition-all flex items-center gap-2 group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span>
          Archive
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-6">
        {/* Header Section */}
        <header className="mb-16">
          <div className="flex items-center gap-4 mb-6 text-rose-500 text-xs font-bold uppercase tracking-[0.3em]">
            <span>{post.category}</span>
            <span className="w-1.5 h-[1px] bg-white/20" />
            <span className="text-white/40">{post.date}</span>
          </div>

          <h1 className="text-5xl md:text-7xl text-white font-black tracking-tighter leading-none mb-8">
            <PerfectTextWrapper 
              text={post.title}
              font="900 72px 'Playfair Display'"
              maxWidth={800}
              lineHeight={80}
              className="md:block hidden"
            />
            <span className="md:hidden block">{post.title}</span>
          </h1>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 max-w-fit">
            <img 
              src={author?.img} 
              alt={author?.name} 
              className="w-12 h-12 rounded-full object-cover border border-white/10"
            />
            <div>
              <p className="text-white font-bold text-sm tracking-tight">{author?.name}</p>
              <p className="text-white/40 text-[10px] uppercase tracking-widest">{author?.vocation} • {author?.city}</p>
            </div>
          </div>
        </header>

        {/* Hero Image */}
        <div className="relative aspect-[21/9] rounded-3xl overflow-hidden mb-16 border border-white/5">
          <img 
            src={post.image} 
            alt={post.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-transparent opacity-60" />
        </div>

        {/* Article Body */}
        <article className="prose prose-invert prose-rose max-w-none">
          <div className="text-white/80 text-lg md:text-xl leading-relaxed font-light space-y-8">
            {post.content.split('\n\n').map((paragraph, i) => (
              <p key={i}>
                {paragraph}
              </p>
            ))}
          </div>
        </article>

        {/* Footer Navigation */}
        <footer className="mt-24 pt-12 border-t border-white/5 text-center">
          <p className="text-white/20 text-xs uppercase tracking-[0.4em] mb-8">End of Entry</p>
          <button 
            onClick={onBack}
            className="px-12 py-4 rounded-full border border-white/10 bg-white/5 text-white/60 text-sm font-black uppercase tracking-widest hover:text-white hover:bg-rose-500 hover:border-rose-500 transition-all"
          >
            Return to Sanctuary
          </button>
        </footer>
      </div>
    </motion.div>
  );
};

export default BlogPostView;
