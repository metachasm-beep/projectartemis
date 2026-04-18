import React, { useEffect, useState, useMemo, useRef } from 'react';
import Hero from './components/Hero';
import BlogGrid from './components/BlogGrid';
import BlogPostView from './components/BlogPostView';
import { BLOG_POSTS } from './data/posts';
import { motion, AnimatePresence } from 'framer-motion';
import SplashCursor from './components/bits/SplashCursor';
import ManifestoEditor from './components/ManifestoEditor';
import { PenTool, CheckCircle, ArrowDown } from 'lucide-react';
import { ManifestoService } from '@/services/manifestoService';
import { PWAInstallFAB } from '@/components/ui/PWAInstallFAB';

// ---------- Nav ---------------------------------------------------------------

const NAV_LINKS: { label: string; href?: string; scroll?: string }[] = [];

const Navbar: React.FC<{ onArchiveClick: () => void }> = ({ onArchiveClick }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-[200] px-4 md:px-8 py-4 md:py-8 flex items-center justify-between pointer-events-none">
      <div className="pointer-events-auto">
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={onArchiveClick}
          className="text-[#3C2F2F] text-xl md:text-3xl font-black tracking-tighter hover:text-rose-500 transition-colors flex items-center gap-1"
        >
          MATRIARCH<span className="text-rose-500">.</span>
          <span className="text-[10px] font-black tracking-[0.4em] uppercase text-[#3C2F2F]/20 mt-2 ml-4 hidden lg:block italic">Journal Archive</span>
        </motion.button>
      </div>
      
      {/* Mobile Toggle */}
      <div className="pointer-events-auto md:hidden">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="w-10 h-10 rounded-full bg-[#3C2F2F]/5 border border-[#3C2F2F]/10 flex items-center justify-center text-[#3C2F2F]"
        >
          <div className="space-y-1">
            <div className={`w-4 h-0.5 bg-[#3C2F2F] transition-all ${isOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
            <div className={`w-4 h-0.5 bg-[#3C2F2F] transition-all ${isOpen ? 'opacity-0' : ''}`} />
            <div className={`w-4 h-0.5 bg-[#3C2F2F] transition-all ${isOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
          </div>
        </button>
      </div>

      <div className="pointer-events-auto hidden md:flex items-center gap-12">
        {NAV_LINKS.map(link => (
          link.scroll ? (
            <button
              key={link.label}
              onClick={() => document.getElementById(link.scroll!)?.scrollIntoView({ behavior: 'smooth' })}
              className="text-[9px] font-black tracking-[0.5em] text-[#3C2F2F]/40 uppercase hover:text-[#3C2F2F] transition-all hover:tracking-[0.7em] bg-transparent border-0 cursor-pointer"
            >
              {link.label}
            </button>
          ) : (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[9px] font-black tracking-[0.5em] text-[#3C2F2F]/40 uppercase hover:text-[#3C2F2F] transition-all hover:tracking-[0.7em] no-underline"
            >
              {link.label}
            </a>
          )
        ))}
        <motion.a
          href="https://matriarchindia.com"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 md:px-6 py-1.5 md:py-2 rounded-full border border-[#3C2F2F]/10 bg-[#3C2F2F]/5 backdrop-blur-2xl text-[9px] md:text-[10px] font-black tracking-widest text-[#3C2F2F] uppercase cursor-pointer hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all shadow-xl shadow-rose-500/5 no-underline"
        >
          Join Sanctuary
        </motion.a>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="fixed inset-0 bg-[#FFFDF9] z-[-1] flex flex-col items-center justify-center gap-8 md:hidden shadow-2xl"
          >
            {NAV_LINKS.map(link => (
              <button
                key={link.label}
                onClick={() => {
                   if (link.scroll) document.getElementById(link.scroll!)?.scrollIntoView({ behavior: 'smooth' });
                   else if (link.href) window.open(link.href, '_blank');
                   setIsOpen(false);
                }}
                className="text-2xl font-black tracking-[0.4em] text-[#3C2F2F]/30 uppercase hover:text-rose-500 transition-all"
              >
                {link.label}
              </button>
            ))}
            <a 
              href="https://matriarchindia.com" 
              className="mt-8 px-12 py-4 rounded-full border border-rose-500 text-rose-500 font-black uppercase tracking-[0.3em] text-[10px]"
            >
              Join Sanctuary
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

// ---------- Slim Footer -------------------------------------------------------
// Reduced by 90%: py-32 → py-3, all large elements stripped to a single bar

const INSTAGRAM_URL = 'https://www.instagram.com/matriarchindia?igsh=MXE0dTlrZGswejBlYQ==';

const Footer: React.FC<{ onManifestoClick: () => void }> = ({ onManifestoClick }) => {
  const handleFooterLink = (item: string) => {
    if (item === 'Archive') {
      document.getElementById('archive-fold')?.scrollIntoView({ behavior: 'smooth' });
    } else if (item === 'Manifesto') {
      onManifestoClick();
    } else if (item === 'Instagram') {
      window.open(INSTAGRAM_URL, '_blank');
    }
  };

  return (
    <footer className="py-4 px-8 border-t border-[#3C2F2F]/5 bg-[#FDFBF7]">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 md:gap-4">
        <span className="text-[9px] font-bold text-[#3C2F2F]/40 tracking-[0.35em] uppercase">
          © 2026 Matriarch Protocol · Secretum Meum Mihi
        </span>
        <div className="flex gap-4">
          {['Instagram'].map(item => (
            <button
              key={item}
              onClick={() => handleFooterLink(item)}
              className="text-[9px] font-black uppercase tracking-widest text-[#3C2F2F]/30 hover:text-rose-500 transition-colors cursor-pointer bg-transparent border-0"
            >
              {item}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          {[1, 2, 3].map(i => <div key={i} className="w-1 h-1 bg-rose-400/40 rounded-full" />)}
        </div>
      </div>
    </footer>
  );
};


// ---------- Main App ----------------------------------------------------------

const App: React.FC = () => {
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [dynamicPosts, setDynamicPosts] = useState<any[]>([]);

  const allPosts = useMemo(() => {
    const combined = [...BLOG_POSTS].map(p => ({
      ...p,
      sortDate: new Date(p.date).getTime() || 0
    }));

    dynamicPosts.forEach(dp => {
      if (!combined.find(p => p.id === dp.id)) {
        combined.push({
          ...dp,
          excerpt: dp.content.substring(0, 100) + '...',
          markdownUrl: '',
          category: 'Relationships',
          date: new Date(dp.created_at).toLocaleDateString(), // Display format
          sortDate: new Date(dp.created_at).getTime(), // Numeric timestamp for sorting
          readTime: '5 min read',
          image: dp.image_url,
          authorId: dp.author_id,
        } as any);
      }
    });

    return (combined as any[]).sort((a, b) => (b.sortDate || 0) - (a.sortDate || 0));
  }, [dynamicPosts]);

  const selectedPost = useMemo(() => allPosts.find(p => p.id === selectedPostId), [selectedPostId, allPosts]);

  useEffect(() => {
    window.postMessage('MATRIARCH_SANCTUARY_READY', window.location.origin);
    ManifestoService.getLiveManifestos().then(setDynamicPosts);
  }, []);

  useEffect(() => { window.scrollTo(0, 0); }, [selectedPostId]);

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-[#3C2F2F] selection:bg-rose-500/10 selection:text-rose-500 overflow-x-hidden">
      <SplashCursor />

      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-30">
        <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] bg-[radial-gradient(circle_at_50%_50%,_rgba(244,63,94,0.08)_0%,_transparent_50%)]" />
        <div className="absolute top-[20%] right-[-5%] w-[60%] h-[60%] bg-[radial-gradient(circle_at_50%_50%,_rgba(212,175,55,0.06)_0%,_transparent_50%)]" />
      </div>

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

      <Navbar onArchiveClick={() => setSelectedPostId(null)} />

      <main className="relative z-10">
        <AnimatePresence mode="wait">
          {selectedPost ? (
            <BlogPostView key="post" post={selectedPost} onBack={() => setSelectedPostId(null)} />
          ) : (
            <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>

              <section
                className="relative h-[100dvh] w-full flex items-center justify-center overflow-hidden"
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <Hero />
                </div>

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
                  <h2 className="text-[11px] font-black uppercase tracking-[0.8em] text-[#3C2F2F]/20 italic">The Collective Frequency</h2>
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-rose-500/50">Archives // Sorted by Recency</p>
                </motion.div>
              </section>

              <section
                id="archive-fold"
                className="relative min-h-screen w-full py-16 px-6 overflow-hidden"
              >
                <div className="max-w-7xl mx-auto">
                  <BlogGrid posts={allPosts} onSelect={(id) => setSelectedPostId(id)} />

                  <div className="mt-20 flex flex-col items-center gap-4 text-[#3C2F2F]/20 uppercase font-black text-[9px] tracking-[0.5em]">
                    <span>End of Archive</span>
                    <div className="w-px h-16 bg-gradient-to-b from-[#3C2F2F]/20 to-transparent" />
                  </div>
                </div>
              </section>

            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {!selectedPost && <Footer onManifestoClick={() => setIsEditorOpen(true)} />}
      <PWAInstallFAB variant="slate" />
    </div>
  );
};

export default App;
