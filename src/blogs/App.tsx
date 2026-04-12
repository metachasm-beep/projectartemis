import React, { useEffect, useState, useMemo, useRef } from 'react';
import Hero from './components/Hero';
import BlogGrid from './components/BlogGrid';
import BlogPostView from './components/BlogPostView';
import { BLOG_POSTS } from './data/posts';
import { motion, useScroll, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import SplashCursor from './components/bits/SplashCursor';
import ManifestoEditor from './components/ManifestoEditor';
import { PenTool, CheckCircle, ArrowDown } from 'lucide-react';
import { ManifestoService } from '@/services/manifestoService';

// ---------- Nav ---------------------------------------------------------------

const Navbar: React.FC<{ onArchiveClick: () => void }> = ({ onArchiveClick }) => (
  <nav className="fixed top-0 w-full z-[100] px-8 py-8 flex items-center justify-between pointer-events-none">
    <div className="pointer-events-auto">
      <motion.button
        whileHover={{ scale: 1.05 }}
        onClick={onArchiveClick}
        className="text-white text-3xl font-black tracking-tighter hover:text-rose-500 transition-colors flex items-center gap-1"
      >
        MATRIARCH<span className="text-rose-500">.</span>
        <span className="text-[10px] font-black tracking-[0.4em] uppercase text-white/20 mt-2 ml-4 hidden md:block italic">Journal Archive</span>
      </motion.button>
    </div>
    <div className="pointer-events-auto hidden md:flex items-center gap-12">
      {['Archive', 'Protocol', 'Identity'].map(item => (
        <a key={item} href={`/${item.toLowerCase()}`} className="text-[9px] font-black tracking-[0.5em] text-white/30 uppercase hover:text-white transition-all hover:tracking-[0.7em]">
          {item}
        </a>
      ))}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="px-6 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-2xl text-[10px] font-black tracking-widest text-white uppercase cursor-pointer hover:bg-rose-500 hover:border-rose-500 transition-all shadow-xl shadow-rose-500/10"
      >
        Join Sanctuary
      </motion.div>
    </div>
  </nav>
);

// ---------- Slim Footer -------------------------------------------------------
// Reduced by 90%: py-32 → py-3, all large elements stripped to a single bar

const Footer: React.FC = () => (
  <footer className="py-3 px-8 border-t border-white/5 bg-[#030303]">
    <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
      <span className="text-[8px] font-medium text-white/15 tracking-[0.35em] uppercase">
        © 2026 Matriarch Protocol · Secretum Meum Mihi
      </span>
      <div className="flex gap-3">
        {['Archive', 'Manifesto', 'Instagram'].map(item => (
          <span key={item} className="text-[8px] font-black uppercase tracking-widest text-white/15 hover:text-white/40 transition-colors cursor-pointer">
            {item}
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        {[1, 2, 3].map(i => <div key={i} className="w-1 h-1 bg-rose-500/20 rounded-full" />)}
      </div>
    </div>
  </footer>
);


// ---------- Main App ----------------------------------------------------------

const App: React.FC = () => {
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [dynamicPosts, setDynamicPosts] = useState<any[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const archiveRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] });

  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // --- Per-section parallax using dedicated scroll hooks ---
  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const { scrollYProgress: archiveProgress } = useScroll({ target: archiveRef, offset: ['start end', 'end start'] });

  const heroY = useTransform(heroProgress, [0, 1], ['0%', '25%']);
  const heroScale = useTransform(heroProgress, [0, 1], [1, 1.05]);
  const archiveY = useTransform(archiveProgress, [0, 1], ['4%', '-4%']);

  // Global ambient background drift
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);

  const allPosts = useMemo(() => {
    const combined = [...BLOG_POSTS];
    dynamicPosts.forEach(dp => {
      if (!combined.find(p => p.id === dp.id)) {
        combined.push({
          ...dp,
          excerpt: dp.content.substring(0, 100) + '...',
          markdownUrl: '',
          category: 'Relationships',
          date: new Date(dp.created_at).toLocaleDateString(),
          readTime: '5 min read',
          image: dp.image_url,
          authorId: dp.author_id,
        });
      }
    });
    return combined.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [dynamicPosts]);

  const selectedPost = useMemo(() => allPosts.find(p => p.id === selectedPostId), [selectedPostId, allPosts]);

  useEffect(() => {
    window.postMessage('MATRIARCH_SANCTUARY_READY', window.location.origin);
    ManifestoService.getLiveManifestos().then(setDynamicPosts);
  }, []);

  useEffect(() => { window.scrollTo(0, 0); }, [selectedPostId]);

  return (
    <div ref={containerRef} className="min-h-screen bg-[#030303] selection:bg-rose-500 selection:text-white overflow-x-hidden">
      <SplashCursor />

      {/* Ambient background — parallaxed */}
      <motion.div
        style={{ y: bgY }}
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-50"
      >
        <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] bg-[radial-gradient(circle_at_50%_50%,_rgba(123,45,66,0.05)_0%,_transparent_50%)]" />
        <div className="absolute top-[20%] right-[-5%] w-[60%] h-[60%] bg-[radial-gradient(circle_at_50%_50%,_rgba(191,160,106,0.03)_0%,_transparent_50%)]" />
      </motion.div>

      {/* Success toast */}
      <AnimatePresence>
        {showSuccessToast && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="fixed top-8 left-1/2 -translate-x-1/2 z-[300] bg-green-500/90 backdrop-blur-xl text-white px-8 py-3 rounded-full flex items-center gap-3 font-black text-xs uppercase tracking-widest shadow-2xl shadow-green-500/20"
          >
            <CheckCircle size={18} />
            Transmission Received. Subject to Curation.
          </motion.div>
        )}
      </AnimatePresence>

      <ManifestoEditor
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSuccess={() => { setShowSuccessToast(true); setTimeout(() => setShowSuccessToast(false), 5000); }}
      />

      {!selectedPost && (
        <motion.button
          whileHover={{ scale: 1.1, rotate: -5 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsEditorOpen(true)}
          className="fixed bottom-12 right-12 z-50 p-6 bg-rose-500 text-white rounded-full shadow-2xl shadow-rose-500/40 group overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          <div className="relative flex items-center gap-3">
            <PenTool size={24} />
            <span className="max-w-0 group-hover:max-w-[200px] overflow-hidden whitespace-nowrap transition-all duration-500 text-xs font-black uppercase tracking-widest">Initiate Manifesto</span>
          </div>
        </motion.button>
      )}

      {/* Scroll progress bar */}
      <motion.div className="fixed top-0 left-0 right-0 h-[1px] bg-rose-500 z-[200] origin-left" style={{ scaleX }} />

      <Navbar onArchiveClick={() => setSelectedPostId(null)} />

      <main className="relative z-10">
        <AnimatePresence mode="wait">
          {selectedPost ? (
            <BlogPostView key="post" post={selectedPost} onBack={() => setSelectedPostId(null)} />
          ) : (
            <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>

              {/* ── FOLD 1: Hero ─────────────────────────────────────────── */}
              <section
                ref={heroRef}
                className="relative h-[100dvh] w-full flex items-center justify-center overflow-hidden"
              >
                {/* Parallaxed hero inner */}
                <motion.div
                  style={{ y: heroY, scale: heroScale }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <Hero />
                </motion.div>

                {/* Scroll hint */}
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/20"
                >
                  <span className="text-[9px] tracking-[0.4em] font-black uppercase">Scroll to Archive</span>
                  <ArrowDown size={14} />
                </motion.div>
              </section>

              {/* ── FOLD 2: Frequency label ──────────────────────────────── */}
              <section className="relative py-24 flex items-center justify-center overflow-hidden ">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="text-center space-y-4"
                >
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    transition={{ duration: 1, ease: 'circOut' }}
                    className="h-[1px] w-40 bg-gradient-to-r from-transparent via-rose-500 to-transparent mx-auto"
                  />
                  <h2 className="text-[11px] font-black uppercase tracking-[0.8em] text-white/20 italic">The Collective Frequency</h2>
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-rose-500/40">Archives // Sorted by Recency</p>
                </motion.div>
              </section>

              {/* ── FOLD 3: Archive (MagicBento) ─────────────────────────── */}
              <section
                ref={archiveRef}
                className="relative min-h-screen w-full py-16 px-6 overflow-hidden"
              >
                <motion.div style={{ y: archiveY }} className="max-w-7xl mx-auto">
                  <BlogGrid posts={allPosts} onSelect={(id) => setSelectedPostId(id)} />

                  <div className="mt-20 flex flex-col items-center gap-4 text-white/10 uppercase font-black text-[9px] tracking-[0.5em]">
                    <span>End of Archive</span>
                    <div className="w-px h-16 bg-gradient-to-b from-white/10 to-transparent" />
                  </div>
                </motion.div>
              </section>

            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {!selectedPost && <Footer />}

      {/* Film grain overlay */}
      <div className="fixed inset-0 pointer-events-none z-[100] opacity-[0.035] mix-blend-overlay">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <filter id="bgn">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#bgn)" />
        </svg>
      </div>
    </div>
  );
};

export default App;
