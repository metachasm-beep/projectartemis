import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import MatriarchLogo from "@/components/MatriarchLogo";
import StarBorder from "@/components/bits/StarBorder";
import { ArrowDown } from "lucide-react";
import { supabase } from "@/lib/supabase";

const IMAGES = [
  "/assets/slideshow/h_1.png",
  "/assets/slideshow/h_2.png",
  "/assets/slideshow/h_3.png",
  "/assets/slideshow/h_4.png",
  "/assets/slideshow/h_5.jpeg",
  "/assets/slideshow/h_6.jpeg",
  "/assets/slideshow/h_7.jpeg",
  "/assets/slideshow/h_8.jpeg"
];

const HeroFold: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Parallax transforms: minimal scale to prevent aggressive cropping
  const backgroundScale = useTransform(scrollYProgress, [0, 1], [1, 1.02]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  
  // Logo transforms: stays fixed, but dims slightly to feel integrated
  const logoOpacity = useTransform(scrollYProgress, [0.8, 1], [1, 0]);

  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setImageIndex((prev) => (prev + 1) % IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section 
      ref={containerRef}
      className="relative h-[100dvh] w-full overflow-hidden snap-start snap-always bg-mat-cream"
    >
      {/* 1. Fixed Logo Layer (Requested: Fixed, other folds scroll over) */}


      {/* 2. Parallax Background Slideshow */}
      <motion.div style={{ scale: backgroundScale }} className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={imageIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${IMAGES[imageIndex]})` }}
          />
        </AnimatePresence>
        {/* Soft Sanctuary Vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-mat-cream/60 to-mat-cream" />
      </motion.div>

      {/* 3. Hero Content */}
      <motion.div 
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6"
      >
        <motion.span 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-mat-rose font-display tracking-[0.2em] text-sm mb-6 uppercase"
        >
          Elite Community
        </motion.span>
        
        <motion.h1 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-4xl md:text-8xl font-display text-mat-slate mb-6 md:mb-8 leading-tight max-w-4xl px-4"
        >
          Curating the <br/>
          <span className="text-mat-gold italic font-display">Exceptional.</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-mat-slate/70 max-w-xl text-lg md:text-xl font-light leading-relaxed mb-12"
        >
          India's most exclusive network for high-value connections and refined companionship.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto px-4 sm:px-0"
        >
          <StarBorder 
            onClick={() => supabase.auth.signInWithOAuth({ 
              provider: 'google', 
              options: { redirectTo: window.location.origin } 
            })} 
            className="w-full sm:w-auto px-6 py-3 md:px-10 md:py-4 text-lg md:text-xl font-display tracking-widest bg-mat-gold text-white border-mat-gold"
          >
            GET STARTED
          </StarBorder>
          
          <button onClick={() => window.open('https://blogs.matriarchindia.com', '_blank')} className="w-full sm:w-auto">
            <StarBorder className="px-6 py-3 md:px-10 md:py-4 text-lg md:text-xl font-display tracking-widest bg-mat-cream-deep border-mat-gold/10 text-mat-slate/60 hover:text-mat-slate transition-colors">
              READ BLOGS
            </StarBorder>
          </button>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40"
        >
          <span className="text-[10px] tracking-[0.3em] font-display uppercase">Scroll to Explore</span>
          <ArrowDown className="w-4 h-4" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroFold;
