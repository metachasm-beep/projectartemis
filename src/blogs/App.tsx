import React, { useEffect } from 'react';
import Hero from './components/Hero';
import BlogGrid from './components/BlogGrid';
import { motion, useScroll, useSpring } from 'framer-motion';

const Navbar: React.FC = () => (
  <nav className="fixed top-0 w-full z-50 px-6 py-8 flex items-center justify-between pointer-events-none">
    <div className="pointer-events-auto">
      <a href="/" className="text-white text-xl font-black tracking-tighter hover:text-rose-500 transition-colors">
        MATRIARCH<span className="text-rose-500">.</span>
      </a>
    </div>
    <div className="pointer-events-auto hidden md:flex items-center gap-8">
      {['Archive', 'Protocol', 'Identity'].map(item => (
        <a key={item} href={`/${item.toLowerCase()}`} className="text-[10px] font-black tracking-widest text-white/40 uppercase hover:text-white transition-colors">
          {item}
        </a>
      ))}
      <div className="px-4 py-1.5 rounded-full border border-white/20 bg-white/5 backdrop-blur-md text-[10px] font-black tracking-widest text-white uppercase cursor-pointer hover:bg-rose-500 hover:border-rose-500 transition-all">
        Join Sanctuary
      </div>
    </div>
  </nav>
);

const Footer: React.FC = () => (
  <footer className="py-20 px-12 border-t border-white/5 bg-[#030303] text-center">
    <div className="max-w-4xl mx-auto">
      <div className="mb-12">
        <h2 className="text-2xl font-black tracking-tighter text-white mb-4 italic">The Protocol of Modern Connection.</h2>
        <p className="text-white/40 text-sm max-w-lg mx-auto leading-relaxed">
          Matriarch is a curated sanctuary for high-value individuals seeking selective intention. 
          Our journal explores the microscopic interactions that define human connection.
        </p>
      </div>
      <div className="flex justify-center gap-8 mb-12">
        {['Instagram', 'Twitter', 'LinkedIn'].map(social => (
          <a key={social} href="#" className="text-[10px] font-black tracking-widest text-white/20 uppercase hover:text-white transition-colors underline decoration-rose-500/0 hover:decoration-rose-500 underline-offset-8">
            {social}
          </a>
        ))}
      </div>
      <div className="text-[9px] font-medium text-white/20 tracking-[0.3em] uppercase">
        © 2026 Matriarch Protocol. All Rights Reserved. Secretum Meum Mihi.
      </div>
    </div>
  </footer>
);

const App: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    // Notify window that blog app is ready to remove loader
    window.postMessage('MATRIARCH_SANCTUARY_READY', window.location.origin);
  }, []);

  return (
    <div className="min-h-screen bg-[#030303] selection:bg-rose-500 selection:text-white">
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-rose-500 z-[60] origin-left"
        style={{ scaleX }}
      />

      <Navbar />
      
      <main>
        <Hero />
        <BlogGrid />
      </main>

      <Footer />

      {/* Subtle Grain Overlay */}
      <div className="fixed inset-0 pointer-events-none z-[100] opacity-[0.03] mix-blend-overlay">
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
