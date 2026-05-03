import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import MatriarchLogo from "@/components/MatriarchLogo";
import StarBorder from "@/components/bits/StarBorder";
import { ArrowDown } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { LoginModal } from "@/components/auth/LoginModal";

import { AdminService } from "@/services/admin";

const CLOUDINARY_PREFIX = "https://res.cloudinary.com/dsmbhnjg5/image/fetch/f_auto,q_auto,w_1200,c_limit/https://www.matriarchindia.com";

export const DEFAULT_IMAGES = [
  `${CLOUDINARY_PREFIX}/assets/slideshow/h_1.png`,
  `${CLOUDINARY_PREFIX}/assets/slideshow/h_2.png`,
  `${CLOUDINARY_PREFIX}/assets/slideshow/h_3.png`,
  `${CLOUDINARY_PREFIX}/assets/slideshow/h_4.png`,
  `${CLOUDINARY_PREFIX}/assets/slideshow/h_5.jpeg`,
  `${CLOUDINARY_PREFIX}/assets/slideshow/h_6.jpeg`,
  `${CLOUDINARY_PREFIX}/assets/slideshow/h_7.jpeg`,
  `${CLOUDINARY_PREFIX}/assets/slideshow/h_8.jpeg`
];

const HeroFold: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showHeavyAssets, setShowHeavyAssets] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [heroImages, setHeroImages] = useState<string[]>(DEFAULT_IMAGES);

  useEffect(() => {
    // 🏎️ PERFORMANCE: Hydration Yield
    // Defers the heavy WebGL/Slideshow background to allow the text content to settle on the main thread.
    const yieldHydration = () => {
      setShowHeavyAssets(true);
      console.log("MATRIARCH_PERF: Hero Hydration Yield Complete.");
    };

    const fetchImages = async () => {
      try {
        const images = await AdminService.getHeroImages();
        if (images && images.length > 0) {
          setHeroImages(images.map((img: any) => img.url));
        }
      } catch (e) {
        console.warn("Hero Gallery Recall Fail:", e);
      }
    };

    fetchImages();

    if (window.requestIdleCallback) {
      window.requestIdleCallback(() => yieldHydration());
    } else {
      setTimeout(yieldHydration, 400); // 🏎️ Conservative yield for slower devices
    }
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Parallax transforms: minimal scale to prevent aggressive cropping
  // 🚀 Cinematic Zoom Out: 30% range for desktop, 20% for mobile
  const backgroundScale = useTransform(
    scrollYProgress, 
    [0, 1], 
    [typeof window !== 'undefined' && window.innerWidth > 1024 ? 1.0 : 1.1, 1.0]
  );
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  
  // Logo transforms: stays fixed, but dims slightly to feel integrated
  // @ts-ignore
  const logoOpacity = useTransform(scrollYProgress, [0.8, 1], [1, 0]);

  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    if (!showHeavyAssets) return;
    const timer = setInterval(() => {
      setImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 7500); // 🏎️ Increased timing by 50%
    return () => clearInterval(timer);
  }, [showHeavyAssets, heroImages.length]);

  return (
    <section 
      ref={containerRef}
      className="relative h-[100dvh] w-full overflow-hidden snap-start snap-always bg-[#0A0A0B]"
    >
      {/* 2. Parallax Background Slideshow */}
      <AnimatePresence>
        {showHeavyAssets && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            style={{ scale: backgroundScale }} 
            className="absolute inset-0 z-0"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={imageIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 3 }}
                className="absolute inset-0 mat-ken-burns"
              >
                 <img 
                    src={heroImages[imageIndex]} 
                    alt={`Exclusive Sanctuary Visual ${imageIndex + 1}`}
                    className="absolute inset-0 w-full h-full object-cover mat-portrait-aesthetic"
                    // @ts-ignore - fetchpriority is supported but not always in React types
                    fetchpriority={imageIndex === 0 ? "high" : "low"}
                    loading={imageIndex === 0 ? "eager" : "lazy"}
                 />
              </motion.div>
            </AnimatePresence>
            {/* Cinematic Shadow Vignette (Removes White Tint) */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Hero Content (Infinite Gaze - Asymmetric Editorial) */}
      <motion.div 
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 flex flex-col items-center md:items-start justify-center h-full text-center md:text-left px-6 md:px-24 pt-32 md:pt-0"
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.5, duration: 1.5, ease: "easeOut" }}
          className="max-w-4xl"
        >
          <motion.h1 
            className="leading-[1.1] mb-8 md:mb-12 flex flex-col items-center md:items-start"
          >
            <span className="mat-text-oracle-sub text-[clamp(1rem,4vw,1.2rem)] mb-4 text-white/60">Curating the</span>
            <span className="mat-text-oracle-headline text-[clamp(3rem,12vw,9.5rem)] text-[#FDFCFB]">
              Exceptional<span className="mat-text-gold">.</span>
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.2, duration: 1.5 }}
            className="text-white/70 max-w-xl text-base md:text-xl font-body font-light tracking-[0.05em] leading-relaxed mb-12"
          >
            India's most exclusive network for <br className="hidden md:block" /> elite professional networking and premium matchmaking.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.8, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto"
          >
            <StarBorder 
              onClick={() => setIsLoginModalOpen(true)} 
              className="w-full sm:w-auto px-8 py-4 md:px-12 md:py-5 text-lg md:text-xl font-display tracking-[0.2em] bg-mat-gold text-white border-mat-gold"
            >
              GET STARTED
            </StarBorder>
            
            <button onClick={() => window.open('https://blogs.matriarchindia.com', '_blank')} className="w-full sm:w-auto">
              <StarBorder className="px-8 py-4 md:px-12 md:py-5 text-lg md:text-xl font-display tracking-[0.2em] bg-[#1a1a1a]/5 border-[#1a1a1a]/10 text-[#1a1a1a]/60 hover:text-[#1a1a1a] transition-colors">
                READ BLOGS
              </StarBorder>
            </button>
          </motion.div>
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

      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </section>
  );
};

export default HeroFold;
