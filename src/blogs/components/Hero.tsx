import React from 'react';
import DecryptedText from './bits/DecryptedText';
import BlurText from './bits/BlurText';
import { motion } from 'framer-motion';
import PerfectTextWrapper from './PerfectTextWrapper';
import StarBorder from '../../components/bits/StarBorder';

const Hero: React.FC = () => {
  return (
    <section className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#FFFDF9]">
      <div className="absolute inset-0 bg-rose-500/[0.03] pointer-events-none" />

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FFFDF9]/40 to-[#FFFDF9] pointer-events-none" />

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
            className="text-2xl sm:text-5xl md:text-9xl font-black tracking-tighter text-[#3C2F2F] select-none leading-none"
            parentClassName="mb-4 md:mb-6 px-4 w-full block"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 1, ease: "easeOut" }}
        >
          <BlurText 
            text="Reflections on love, intimacy, and the modern dating protocol"
            delay={30}
            animateBy="words"
            direction="bottom"
            className="text-base md:text-3xl text-[#3C2F2F]/60 font-light max-w-2xl mx-auto leading-tight italic px-4"
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
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full border border-[#3C2F2F]/10 bg-[#3C2F2F]/5 backdrop-blur-xl text-[#3C2F2F]/40 text-xs font-black uppercase tracking-[0.4em] hover:text-[#3C2F2F] hover:border-[#3C2F2F]/20 transition-all cursor-pointer group shadow-2xl shadow-rose-500/5"
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

          <StarBorder
            as="a"
            href="https://matriarchindia.com"
            color="#D4AF37"
            speed="4s"
            className="rounded-full no-underline group active:scale-95 transition-transform"
            innerStyle={{ 
              background: 'transparent', 
              border: 'none', 
              padding: '16px 40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <span className="text-[#3C2F2F] font-black uppercase tracking-[0.3em] text-[11px]">
              Back to Sanctuary
            </span>
          </StarBorder>
        </motion.div>
      </div>

      {/* Floating Meta Data */}
      <div className="absolute bottom-16 left-12 z-10 hidden lg:block">
        <div className="flex items-center gap-6 group">
          <div className="h-[2px] w-24 bg-rose-500 origin-left group-hover:scale-x-150 transition-transform duration-700" />
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#3C2F2F]/30">Frequency // 2026</p>
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-rose-500/50">Rose Ivory Edition</p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-16 right-12 z-10 hidden lg:block text-right">
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#3C2F2F]/30 mb-2">Sanctuary Standing</p>
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
