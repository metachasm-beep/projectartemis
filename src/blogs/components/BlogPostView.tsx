import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Post } from '../data/posts';
import { DUMMY_ASPIRANTS } from '../../data/dummyProfiles';
import PerfectTextWrapper from './PerfectTextWrapper';
import { ArticleSEO } from '@/components/seo/ArticleSEO';
import { OptimizedImage } from '@/components/common/OptimizedImage';
import { Heart, ShieldCheck, Sparkles, UserCircle } from 'lucide-react';
import { ManifestoService } from '@/services/manifestoService';
import { supabase } from '@/lib/supabase';

interface BlogPostViewProps {
  post: Post;
  onBack: () => void;
  currentUser: any;
  onLoginPrompt: () => void;
}

const BlogPostView: React.FC<BlogPostViewProps> = ({ post, onBack, currentUser, onLoginPrompt }) => {
  const [markdown, setMarkdown] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [likesCount, setLikesCount] = useState<number>(0);
  const [hasLiked, setHasLiked] = useState<boolean>(false);
  const [isLiking, setIsLiking] = useState(false);

  const author = useMemo(() => {
    return DUMMY_ASPIRANTS.find(a => a.id === post.authorId);
  }, [post.authorId]);

  // Check if author is male (starts with m)
  const isMaleAuthor = author?.id.startsWith('m');

  useEffect(() => {
    const fetchLikes = async () => {
      const count = await ManifestoService.getLikesCount(post.id);
      setLikesCount(count);
      if (currentUser) {
        const liked = await ManifestoService.checkUserLike(post.id, currentUser.id);
        setHasLiked(liked);
      }
    };
    fetchLikes();
  }, [post.id, currentUser]);

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

  const handleLike = async () => {
    if (!currentUser) {
      onLoginPrompt();
      return;
    }
    if (isLiking) return;

    setIsLiking(true);
    try {
      const result = await ManifestoService.toggleLike(post.id, currentUser.id);
      setHasLiked(result.liked);
      setLikesCount(prev => result.liked ? prev + 1 : prev - 1);
    } catch (err) {
      console.error("LIKE_TOGGLE_ERROR:", err);
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <>
      <ArticleSEO post={post} author={author} />
      <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-[#FFFDF9] overflow-y-auto pt-20 pb-20 scroll-smooth"
    >
      {/* Top Navigation Bar — offset below Navbar (py-4 md:py-8) */}
      <div className="fixed top-0 left-0 right-0 z-[110] pt-20 md:pt-24 pb-4 px-6 md:px-8 flex justify-start items-end bg-gradient-to-b from-[#FFFDF9] via-[#FFFDF9]/80 to-transparent pointer-events-none">
        <button
          onClick={onBack}
          className="pointer-events-auto px-4 md:px-6 py-2 rounded-full border border-[#3C2F2F]/10 bg-[#3C2F2F]/5 backdrop-blur-xl text-[#3C2F2F]/60 text-xs font-bold uppercase tracking-widest hover:text-[#3C2F2F] hover:border-[#3C2F2F]/20 transition-all flex items-center gap-2 group"
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
            <span className="w-1.5 h-[1px] bg-[#3C2F2F]/20" />
            <span className="text-[#3C2F2F]/50">{post.date}</span>
          </div>

          <h1 className="text-4xl md:text-7xl text-[#3C2F2F] font-black tracking-tighter leading-none mb-8">
            <PerfectTextWrapper 
              text={post.title}
              font="900 72px 'Playfair Display'"
              maxWidth={800}
              lineHeight={80}
              className="md:block hidden"
            />
            <span className="md:hidden block leading-tight">{post.title}</span>
          </h1>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#3C2F2F]/5 border border-[#3C2F2F]/5 max-w-fit">
              <OptimizedImage
                src={author?.img || ''}
                alt={author?.name || 'Matriarch Editorial'}
                width={48}
                height={48}
                className="w-12 h-12 rounded-full object-cover border border-[#3C2F2F]/10"
              />
              <div>
                <p className="text-[#3C2F2F] font-bold text-sm tracking-tight">{author?.name ?? 'Matriarch Editorial'}</p>
                <p className="text-[#3C2F2F]/50 text-[10px] uppercase tracking-widest leading-none">{author?.vocation} • {author?.city}</p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLike}
              className={`flex items-center gap-3 px-6 py-4 rounded-2xl border transition-all ${
                hasLiked 
                  ? 'bg-rose-500 border-rose-500 text-white shadow-lg shadow-rose-500/20' 
                  : 'bg-[#3C2F2F]/5 border-[#3C2F2F]/10 text-[#3C2F2F]/60 hover:border-rose-500/30 hover:text-rose-500'
              }`}
            >
              <Heart size={20} fill={hasLiked ? "currentColor" : "none"} className={hasLiked ? "animate-pulse" : ""} />
              <span className="text-sm font-black tracking-widest leading-none">{likesCount}</span>
            </motion.button>
          </div>
        </header>

        {/* Resonance Protocol Info - Only for male authors */}
        {isMaleAuthor && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 p-6 rounded-[2rem] bg-mat-gold/5 border border-mat-gold/10 flex gap-6 items-start"
          >
            <div className="w-12 h-12 rounded-2xl bg-mat-gold/10 flex items-center justify-center text-mat-gold shrink-0">
              <Sparkles size={24} />
            </div>
            <div className="space-y-2">
               <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-mat-gold">Resonance Protocol</h4>
               <p className="text-[11px] font-bold text-mat-wine/60 leading-relaxed">
                 Liking this manifesto signals intellectual resonance. Female users can initiate a match by establishing resonance here and then establishing a direct connection through the Aspirant's full profile.
               </p>
               <button 
                 onClick={() => {
                   // In a real app, this would navigate to the profile
                   window.location.href = `https://matriarchindia.com/discovery?id=${author?.id}`;
                 }}
                 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-rose-500 hover:gap-3 transition-all"
               >
                 View Author Profile <Sparkles size={12} />
               </button>
            </div>
          </motion.div>
        )}

        {/* Hero Image */}
        {post.image && (
          <div className="relative aspect-video md:aspect-[21/9] rounded-2xl md:rounded-3xl overflow-hidden mb-12 md:mb-16 border border-[#3C2F2F]/10">
            <OptimizedImage
              src={post.image}
              alt={post.title}
              width={1200}
              height={630}
              priority={true}
              className="w-full h-full object-cover grayscale brightness-105 contrast-[1.1] transition-all duration-1000 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#FFFDF9]/40 via-transparent to-transparent opacity-60" />
          </div>
        )}

        {/* Article Body */}
        {loading ? (
          <div className="space-y-4">
            <div className="h-4 bg-[#3C2F2F]/5 rounded w-3/4 animate-pulse" />
            <div className="h-4 bg-[#3C2F2F]/5 rounded w-1/2 animate-pulse" />
            <div className="h-4 bg-[#3C2F2F]/5 rounded w-5/6 animate-pulse" />
          </div>
        ) : (
          <article className="prose prose-rose max-w-none prose-p:text-[#3C2F2F]/90 prose-p:leading-relaxed prose-p:text-lg prose-headings:text-[#3C2F2F] prose-headings:font-black prose-headings:tracking-tighter prose-strong:text-[#3C2F2F] prose-blockquote:border-rose-500 prose-blockquote:bg-rose-500/5 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-xl">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {markdown}
            </ReactMarkdown>
          </article>
        )}

        {/* Footer Navigation */}
        <footer className="mt-24 pt-12 border-t border-[#3C2F2F]/10 text-center">
          <p className="text-[#3C2F2F]/20 text-xs uppercase tracking-[0.4em] mb-8">End of Entry</p>
          <button 
            onClick={onBack}
            className="px-12 py-4 rounded-full border border-[#3C2F2F]/10 bg-[#3C2F2F]/5 text-[#3C2F2F]/60 text-sm font-black uppercase tracking-widest hover:text-white hover:bg-rose-500 hover:border-rose-500 transition-all shadow-xl shadow-rose-500/10"
          >
            Return to Sanctuary
          </button>
        </footer>
      </div>
    </motion.div>
  </>
);
};

export default BlogPostView;
