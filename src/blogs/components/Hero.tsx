import React from 'react';
import LightRays from './bits/LightRays';
import DecryptedText from './bits/DecryptedText';
import BlurText from './bits/BlurText';
import { motion } from 'framer-motion';
import PerfectTextWrapper from './PerfectTextWrapper';
import StarBorder from '../../components/bits/StarBorder';

const Hero: React.FC = () => {
  return (
    <section className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#030303]">
      <div className="absolute inset-0 opacity-40">
        <LightRays 
          raysColor="#FFFFFF" 
          raysSpeed={0.3}
          lightSpread={1.5}
          rayLength={2}
          mouseInfluence={0.03}
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#030303]/40 to-[#030303] pointer-events-none" />

      <div className="relative z-10 text-center px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <DecryptedText 
            text="MATRIARCH JOURNAL"
            speed={40}
            maxIterations={20}
            animateOn="view"
            revealDirection="center"
            className="text-2xl sm:text-5xl md:text-9xl font-black tracking-tighter text-white select-none leading-none"
            parentClassName="mb-4 md:mb-6 px-4 w-full block"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 1, ease: "easeOut" }}
        >
          <BlurText 
            text="Late-night reflections on love, intimacy, and the modern dating protocol."
            delay={30}
            animateBy="words"
            direction="bottom"
            className="text-base md:text-3xl text-white/50 font-light max-w-2xl mx-auto leading-tight italic px-4"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8"
        >
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl text-white/40 text-xs font-black uppercase tracking-[0.4em] hover:text-white hover:border-white/20 transition-all cursor-pointer group shadow-2xl shadow-rose-500/5"
          >
            Scroll to Explore
            <motion.span
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="text-rose-500 text-lg"
            >
              ↓
            </motion.span>
          </motion.div>

          <a href="https://matriarchindia.com">
            <StarBorder
              as="div"
              color="#F0A3EA"
              speed="4s"
              className="rounded-full"
            >
              <button className="px-10 py-4 rounded-full text-white font-black uppercase tracking-[0.3em] text-[11px] bg-black hover:bg-white/5 transition-all border-none">
                Back to Sanctuary
              </button>
            </StarBorder>
          </a>
        </motion.div>
      </div>

      {/* Floating Meta Data */}
      <div className="absolute bottom-16 left-12 z-10 hidden lg:block">
        <div className="flex items-center gap-6 group">
          <div className="h-[2px] w-24 bg-rose-500 origin-left group-hover:scale-x-150 transition-transform duration-700" />
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20">Frequency // 2026</p>
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-rose-500/40">Obsidian Edition</p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-16 right-12 z-10 hidden lg:block text-right">
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 mb-2">Sanctuary Standing</p>
        <div className="flex gap-1 justify-end">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="w-1 h-1 bg-rose-500/20 rounded-full" />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
