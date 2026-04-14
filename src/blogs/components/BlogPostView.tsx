import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Post } from '../data/posts';
import { DUMMY_ASPIRANTS } from '../../data/dummyProfiles';
import PerfectTextWrapper from './PerfectTextWrapper';

interface BlogPostViewProps {
  post: Post;
  onBack: () => void;
}

const BlogPostView: React.FC<BlogPostViewProps> = ({ post, onBack }) => {
  const [markdown, setMarkdown] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  const author = useMemo(() => {
    return DUMMY_ASPIRANTS.find(a => a.id === post.authorId);
  }, [post.authorId]);

  // Fetch the long-form content from the markdown file, or fallback to post.content
  useEffect(() => {
    if (post.markdownUrl && post.markdownUrl.trim() !== '') {
      setLoading(true);
      fetch(post.markdownUrl)
        .then(res => res.text())
        .then(text => {
          setMarkdown(text);
          setLoading(false);
        })
        .catch(err => {
          console.error("Failed to load article content:", err);
          setMarkdown("Error loading content. Please return to the archive.");
          setLoading(false);
        });
    } else {
      setMarkdown(post.content);
      setLoading(false);
    }
  }, [post.markdownUrl, post.content]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-[#030303] overflow-y-auto pt-20 pb-20 scroll-smooth"
    >
      {/* Top Navigation Bar — offset below Navbar (py-4 md:py-8) */}
      <div className="fixed top-0 left-0 right-0 z-[110] pt-20 md:pt-24 pb-4 px-6 md:px-8 flex justify-start items-end bg-gradient-to-b from-[#030303] via-[#030303]/80 to-transparent pointer-events-none">
        <button
          onClick={onBack}
          className="pointer-events-auto px-4 md:px-6 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl text-white/60 text-xs font-bold uppercase tracking-widest hover:text-white hover:border-white/20 transition-all flex items-center gap-2 group"
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

          <h1 className="text-4xl md:text-7xl text-white font-black tracking-tighter leading-none mb-8">
            <PerfectTextWrapper 
              text={post.title}
              font="900 72px 'Playfair Display'"
              maxWidth={800}
              lineHeight={80}
              className="md:block hidden"
            />
            <span className="md:hidden block leading-tight">{post.title}</span>
          </h1>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 max-w-fit">
            <img
              src={author?.img}
              alt={author?.name}
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              className="w-12 h-12 rounded-full object-cover border border-white/10"
            />
            <div>
              <p className="text-white font-bold text-sm tracking-tight">{author?.name ?? 'Matriarch Editorial'}</p>
              <p className="text-white/40 text-[10px] uppercase tracking-widest">{author?.vocation} • {author?.city}</p>
            </div>
          </div>
        </header>

        {/* Hero Image */}
        {post.image && (
          <div className="relative aspect-video md:aspect-[21/9] rounded-2xl md:rounded-3xl overflow-hidden mb-12 md:mb-16 border border-white/5">
            <img
              src={post.image}
              alt={post.title}
              onError={(e) => { (e.target as HTMLImageElement).parentElement!.style.display = 'none'; }}
              className="w-full h-full object-cover grayscale brightness-50 contrast-125 transition-all duration-1000 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-transparent opacity-60" />
          </div>
        )}

        {/* Article Body */}
        {loading ? (
          <div className="space-y-4">
            <div className="h-4 bg-white/5 rounded w-3/4 animate-pulse" />
            <div className="h-4 bg-white/5 rounded w-1/2 animate-pulse" />
            <div className="h-4 bg-white/5 rounded w-5/6 animate-pulse" />
          </div>
        ) : (
          <article className="prose prose-invert prose-rose max-w-none prose-p:text-white/70 prose-p:leading-relaxed prose-p:text-lg prose-headings:text-white prose-headings:font-black prose-headings:tracking-tighter prose-strong:text-white prose-blockquote:border-rose-500 prose-blockquote:bg-rose-500/5 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-xl">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {markdown}
            </ReactMarkdown>
          </article>
        )}

        {/* Footer Navigation */}
        <footer className="mt-24 pt-12 border-t border-white/5 text-center">
          <p className="text-white/20 text-xs uppercase tracking-[0.4em] mb-8">End of Entry</p>
          <button 
            onClick={onBack}
            className="px-12 py-4 rounded-full border border-white/10 bg-white/5 text-white/60 text-sm font-black uppercase tracking-widest hover:text-white hover:bg-rose-500 hover:border-rose-500 transition-all shadow-[0_0_20px_rgba(225,29,72,0)] hover:shadow-[0_0_20px_rgba(225,29,72,0.3)]"
          >
            Return to Sanctuary
          </button>
        </footer>
      </div>
    </motion.div>
  );
};

export default BlogPostView;
