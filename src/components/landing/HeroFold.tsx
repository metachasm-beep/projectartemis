import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
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
            {/* Cinematic Shadow Vignette */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-black/85" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Hero Content — MATRIARCH as dominant typographic anchor */}
      <motion.div 
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 flex flex-col items-center justify-center h-full text-center px-0"
      >

        {/* ── MATRIARCH — The Largest Text on the Page ── */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
          className="font-display font-light uppercase text-[#FDFCFB] leading-none w-full text-center"
          style={{
            fontSize: "clamp(2.8rem, 13vw, 10rem)",
            letterSpacing: "0.06em",
            wordBreak: "keep-all",
            whiteSpace: "nowrap",
            overflow: "visible",
          }}
        >
          MATRIARCH
        </motion.h1>

        {/* Hairline gold divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1.8, duration: 1.2, ease: "easeOut" }}
          className="w-24 md:w-40 h-px bg-mat-gold/60 my-6 md:my-8 origin-center"
        />

        {/* Sub-headline: "Ruled by Her Standard." */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.0, duration: 1.5 }}
          className="flex flex-col items-center gap-1"
        >
          <span className="mat-text-oracle-sub text-[clamp(0.6rem,2.5vw,0.9rem)] text-white/50 tracking-[0.4em]">
            Ruled by
          </span>
          <span className="mat-text-oracle-headline text-[clamp(1.6rem,5.5vw,4rem)] text-[#FDFCFB]/90 font-light italic">
            Her Standard<span className="text-mat-gold">.</span>
          </span>
        </motion.div>

        {/* Body copy */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 1.5 }}
          className="text-white/55 max-w-md text-sm md:text-base font-body font-light tracking-[0.06em] leading-relaxed mt-6 md:mt-8"
        >
          India's most exclusive network for elite professional networking and premium matchmaking.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.0, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 mt-8 md:mt-10 w-full max-w-sm sm:max-w-none sm:w-auto"
        >
          <StarBorder 
            onClick={() => setIsLoginModalOpen(true)} 
            className="w-full sm:w-auto px-8 py-4 md:px-12 md:py-5 text-base md:text-lg font-body tracking-[0.2em] bg-mat-gold text-white border-mat-gold"
          >
            GET STARTED
          </StarBorder>
          
          <button onClick={() => window.open('https://blogs.matriarchindia.com', '_blank')} className="w-full sm:w-auto">
            <StarBorder className="w-full px-8 py-4 md:px-12 md:py-5 text-base md:text-lg font-body tracking-[0.2em] bg-white/5 border-white/10 text-white/50 hover:text-white transition-colors">
              READ BLOGS
            </StarBorder>
          </button>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30"
        >
          <span className="text-[9px] tracking-[0.35em] font-body uppercase text-white">Scroll to Explore</span>
          <ArrowDown className="w-4 h-4 text-white" />
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
