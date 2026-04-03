import React, { useRef } from 'react';
import VariableProximity from '../components/VariableProximity';
import ShinyText from '../components/ShinyText';
import GlassSurface from '../components/GlassSurface';
import PerfectText from '../components/PerfectText';
import SovereignPlasma from '../components/SovereignPlasma';
import { motion } from 'framer-motion';

interface LandingProps {
  onLogin: () => void;
}

export const Landing: React.FC<LandingProps> = ({ onLogin }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div 
      ref={containerRef}
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-6 bg-[#060010]"
    >
      {/* High-Fidelity Sovereign Plasma Background */}
      <SovereignPlasma opacity={0.6} />

      <div className="z-10 flex flex-col items-center max-w-4xl w-full text-center">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8 }}
           className="mb-8"
        >
          <VariableProximity
            label="MATRIARCH"
            fromFontVariationSettings="'wght' 400, 'opsz' 9"
            toFontVariationSettings="'wght' 900, 'opsz' 144"
            containerRef={containerRef}
            radius={250}
            falloff="exponential"
            className="text-[15vw] sm:text-[140px] font-black leading-none tracking-tighter text-gold italic drop-shadow-[0_0_30px_rgba(212,175,55,0.3)]"
          />
        </motion.div>

        <div className="mb-16 flex justify-center">
          <PerfectText
            text="The first Sovereign Social System for the Elite. Curated by AI, governed by the Matriarch, and secured by the DPDPA 2026 framework. Welcome to the future of high-value connection."
            font="300 20px Inter"
            maxWidth={700}
            lineHeight={34}
            className="text-white/80 text-center tracking-wide"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="w-full max-w-[320px]"
        >
          <GlassSurface
            borderRadius={32}
            brightness={25}
            opacity={0.3}
            blur={15}
            className="cursor-pointer border border-gold/40 hover:border-gold transition-colors duration-500 overflow-hidden group shadow-[0_0_50px_rgba(212,175,55,0.15)] hover:shadow-[0_0_70px_rgba(212,175,55,0.25)]"
          >
            <button 
              onClick={onLogin}
              className="w-full h-full py-5 px-8 flex items-center justify-center gap-4 relative"
            >
              <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Google G Icon (Simplified SVG) */}
              <svg width="24" height="24" viewBox="0 0 24 24" className="mr-2">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>

              <ShinyText 
                text="CONTINUE WITH GOOGLE" 
                speed={3} 
                shineColor="#D4AF37"
                className="font-black text-sm tracking-widest"
              />
            </button>
          </GlassSurface>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="mt-12 text-[10px] tracking-[0.3em] font-medium uppercase"
        >
          Exclusive access for Matriarch Sovereigns only.
        </motion.p>
      </div>
    </div>
  );
};

export default Landing;
