import React, { Suspense } from 'react';
import Spline from '@splinetool/react-spline';
import DecryptedText from './bits/DecryptedText';
import BlurText from './bits/BlurText';
import { motion } from 'framer-motion';

const Hero: React.FC = () => {
  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-[#030303]">
      {/* Spline Background */}
      <div className="absolute inset-0 z-0">
        <Suspense fallback={<div className="w-full h-full bg-[#030303] animate-pulse" />}>
          <Spline 
            scene="https://prod.spline.design/kZ9s743P9q771s7N/scene.splinecode" 
            className="w-full h-full"
          />
        </Suspense>
      </div>

      {/* Overlay Gradient */}
      <div className="absolute inset-0 z-5 bg-gradient-to-b from-transparent via-[#030303]/20 to-[#030303] pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl translate-y-[-10%] sm:translate-y-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <DecryptedText 
            text="MATRIARCH JOURNAL"
            speed={60}
            maxIterations={15}
            animateOn="view"
            revealDirection="center"
            className="text-5xl md:text-8xl font-black tracking-tighter text-white"
            parentClassName="mb-4"
          />
        </motion.div>

        <BlurText 
          text="Late-night reflections on love, intimacy, and the modern dating protocol."
          delay={50}
          animateBy="words"
          direction="bottom"
          className="text-lg md:text-2xl text-white/60 font-medium max-w-2xl mx-auto"
        />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="mt-12"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-white/80 text-sm font-semibold hover:bg-white/10 transition-all cursor-pointer group">
            Scroll to Explore
            <motion.span
              animate={{ y: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="group-hover:text-rose-500"
            >
              ↓
            </motion.span>
          </div>
        </motion.div>
      </div>

      {/* Floating UI elements for 'Premium' feel */}
      <div className="absolute bottom-10 left-10 z-10 hidden md:block">
        <div className="flex flex-col gap-2">
          <div className="h-[1px] w-20 bg-rose-500" />
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/40">Established 2026</p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
