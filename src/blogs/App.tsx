import React, { useEffect, useState, useMemo, useRef } from 'react';
import Hero from './components/Hero';
import BlogGrid from './components/BlogGrid';
import BlogPostView from './components/BlogPostView';
import { BLOG_POSTS } from './data/posts';
import { motion, useScroll, useSpring, AnimatePresence, useTransform } from 'framer-motion';
import SplashCursor from './components/bits/SplashCursor';
import ManifestoEditor from './components/ManifestoEditor';
import { PenTool, CheckCircle, ArrowDown } from 'lucide-react';
import { ManifestoService, ManifestoSubmission } from '@/services/manifestoService';

const Navbar: React.FC<{ onArchiveClick: () => void }> = ({ onArchiveClick }) => (
  <nav className="fixed top-0 w-full z-[100] px-8 py-10 flex items-center justify-between pointer-events-none">
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

const Footer: React.FC = () => (
  <footer className="py-32 px-12 border-t border-white/5 bg-[#030303] relative overflow-hidden">
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-rose-500/50 to-transparent" />
    <div className="max-w-6xl mx-auto">
      <div className="grid md:grid-cols-2 gap-20 mb-20 items-start">
        <div className="space-y-8">
          <h2 className="text-4xl font-black tracking-tighter text-white italic">The Protocol of Modern Connection.</h2>
          <p className="text-white/40 text-lg max-w-lg leading-relaxed font-light">
            Matriarch is a curated sanctuary for high-value individuals seeking selective intention. 
            Our journal explores the microscopic interactions that define human connection.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-12">
           <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-rose-500">Navigation</h4>
              <ul className="space-y-4">
                 {['Archive', 'Protocol', 'Manifesto', 'Sanctuary'].map(item => (
                   <li key={item} className="text-[11px] font-bold text-white/30 uppercase tracking-widest hover:text-white transition-colors cursor-pointer">{item}</li>
                 ))}
              </ul>
           </div>
           <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-rose-500">Social</h4>
              <ul className="space-y-4">
                 {['Instagram', 'Twitter', 'LinkedIn'].map(social => (
                   <li key={social} className="text-[11px] font-bold text-white/30 uppercase tracking-widest hover:text-white transition-colors cursor-pointer">{social}</li>
                 ))}
              </ul>
           </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-between items-center pt-20 border-t border-white/5 gap-8">
        <div className="text-[9px] font-medium text-white/10 tracking-[0.4em] uppercase text-center md:text-left">
          © 2026 Matriarch Protocol. All Rights Reserved. Secretum Meum Mihi.
        </div>
        <div className="flex gap-4">
           {[1,2,3].map(i => (
             <div key={i} className="w-1.5 h-1.5 bg-rose-500/20 rounded-full" />
           ))}
        </div>
      </div>
    </div>
  </footer>
);

const App: React.FC = () => {
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [dynamicPosts, setDynamicPosts] = useState<any[]>([]);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"]);

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
             authorId: dp.author_id
          });
       }
    });
    return combined.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [dynamicPosts]);

  const selectedPost = useMemo(() => {
    return allPosts.find(p => p.id === selectedPostId);
  }, [selectedPostId, allPosts]);

  const loadDynamicPosts = async () => {
    const approved = await ManifestoService.getLiveManifestos();
    setDynamicPosts(approved);
  };

  useEffect(() => {
    window.postMessage('MATRIARCH_SANCTUARY_READY', window.location.origin);
    loadDynamicPosts();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [selectedPostId]);

  return (
    <div ref={containerRef} className="min-h-screen bg-[#030303] selection:bg-rose-500 selection:text-white overflow-x-hidden">
      <SplashCursor />
      
      <motion.div 
        style={{ y: backgroundY }}
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-50"
      >
        <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] bg-[radial-gradient(circle_at_50%_50%,_rgba(123,45,66,0.05)_0%,_transparent_50%)]" />
        <div className="absolute top-[20%] right-[-5%] w-[60%] h-[60%] bg-[radial-gradient(circle_at_50%_50%,_rgba(191,160,106,0.03)_0%,_transparent_50%)]" />
      </motion.div>

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
        onSuccess={() => {
          setShowSuccessToast(true);
          setTimeout(() => setShowSuccessToast(false), 5000);
        }}
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

      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-rose-500 z-[200] origin-left"
        style={{ scaleX }}
      />

      <Navbar onArchiveClick={() => setSelectedPostId(null)} />
      
      <main className="relative z-10">
        <AnimatePresence mode="wait">
          {selectedPost ? (
            <BlogPostView 
              key="post"
              post={selectedPost} 
              onBack={() => setSelectedPostId(null)} 
            />
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <section className="h-screen w-full flex items-center justify-center">
                <Hero />
              </section>

              <section className="min-h-screen w-full py-32 px-6 relative bg-[#030303]">
                 <motion.div style={{ y: contentY }} className="max-w-7xl mx-auto">
                    <div className="flex flex-col items-center mb-24 space-y-4">
                       <motion.div 
                          initial={{ scaleX: 0 }}
                          whileInView={{ scaleX: 1 }}
                          transition={{ duration: 1, ease: "circOut" }}
                          className="h-[1px] w-40 bg-gradient-to-r from-transparent via-rose-500 to-transparent" 
                       />
                       <h3 className="text-[12px] font-black uppercase tracking-[0.8em] text-white/20 italic">The Collective Frequency</h3>
                       <motion.div 
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          className="text-[10px] font-black uppercase tracking-[0.3em] text-rose-500/40"
                       >
                          Archives // Sorted by Recency
                       </motion.div>
                    </div>

                    <div className="grid gap-12">
                       <BlogGrid posts={allPosts} onSelect={(id) => setSelectedPostId(id)} />
                    </div>

                    <div className="mt-32 flex flex-col items-center gap-4 text-white/10 uppercase font-black text-[9px] tracking-[0.5em]">
                       <span>End of Archive</span>
                       <div className="w-px h-20 bg-gradient-to-b from-white/10 to-transparent" />
                    </div>
                 </motion.div>
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {!selectedPost && <Footer />}

      <div className="fixed inset-0 pointer-events-none z-[100] opacity-[0.05] mix-blend-overlay">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
      </div>
    </div>
  );
};

export default App;
