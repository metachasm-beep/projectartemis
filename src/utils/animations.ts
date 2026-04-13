import { Variants } from 'framer-motion';

/**
 * 🏛️ Sovereign Reveal Variants
 * Designed for Luxury Minimalism and High-Fidelity PWAs.
 */

export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
};

export const maskReveal: Variants = {
  initial: { y: "100%", opacity: 0 },
  animate: { 
    y: 0, 
    opacity: 1,
    transition: { 
      duration: 1.2, 
      ease: [0.16, 1, 0.3, 1] 
    } 
  },
};

export const scaleInBreathe: Variants = {
  initial: { scale: 1.1, opacity: 0, filter: 'blur(10px)' },
  animate: { 
    scale: 1, 
    opacity: 1, 
    filter: 'blur(0px)',
    transition: { 
      duration: 2.5, 
      ease: [0.16, 1, 0.3, 1] 
    } 
  },
  breathe: {
    scale: [1, 1.02, 1],
    transition: {
      duration: 8,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

export const springSlide: Variants = {
  initial: { y: 40, opacity: 0 },
  animate: { 
    y: 0, 
    opacity: 1,
    transition: { 
      type: "spring",
      damping: 25,
      stiffness: 120,
    } 
  },
};

export const glassIn: Variants = {
  initial: { opacity: 0, backdropFilter: 'blur(0px)' },
  animate: { 
    opacity: 1, 
    backdropFilter: 'blur(24px)',
    transition: { duration: 1.5, ease: "easeOut" } 
  },
};
