import React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Crown } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { springSlide } from '@/utils/animations';
import parallaxWoman from '@/assets/parallax_woman.jpg';

interface HoverParallaxCardProps {
  role?: string;
  isVerified?: boolean;
}

/**
 * 🎨 HoverParallaxCard
 * Implements 3D coordinate-based tilt and shift.
 * GSD Compliant: Modular, PWA Optimized (transform-gpu).
 */
export const HoverParallaxCard: React.FC<HoverParallaxCardProps> = ({ 
  role = 'MATRIARCH',
  isVerified = true
}) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Moderate stiffness for luxury "oceanic" feel
  const mouseXSpring = useSpring(x, { stiffness: 100, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 100, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const clientX = 'touches' in e ? (e as React.TouchEvent).touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? (e as React.TouchEvent).touches[0].clientY : (e as React.MouseEvent).clientY;
    
    const mouseX = (clientX - rect.left) / width - 0.5;
    const mouseY = (clientY - rect.top) / height - 0.5;
    
    x.set(mouseX);
    y.set(mouseY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div 
      variants={springSlide}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchMove={handleMouseMove}
      onTouchEnd={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className="bento-span-8 bento-item mat-glass-deep group min-h-[520px] p-2 bg-white/40 transform-gpu cursor-pointer relative"
    >
      <div 
        className="flex flex-col md:flex-row h-full gap-12 bg-mat-cream/40 rounded-[2.5rem] p-10 relative overflow-hidden" 
        style={{ transform: "translateZ(20px)" }}
      >
        <div className="relative shrink-0 w-full md:w-80 aspect-[3/4] md:h-full rounded-[3.5rem] overflow-hidden border border-mat-rose/10 shadow-2xl shadow-mat-wine/10">
          <img 
            src={parallaxWoman} 
            className="w-full h-full object-cover group-hover:scale-110 transition-all duration-1000 grayscale group-hover:grayscale-0 filter sepia-[0.1] transform-gpu" 
            alt="Sovereign Identity" 
            style={{ transform: "translateZ(40px)" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-mat-wine/60 via-transparent to-transparent opacity-80" />
          
          <div 
            className="absolute bottom-8 left-8 right-8 flex justify-between items-center z-10" 
            style={{ transform: "translateZ(60px)" }}
          >
            <div className="w-16 h-16 bg-white/20 backdrop-blur-2xl rounded-3xl flex items-center justify-center border border-white/30 shadow-2xl">
              <Crown className="text-white w-8 h-8" />
            </div>
            <Badge className="bg-mat-wine/80 backdrop-blur-md text-white px-6 py-2 rounded-full mat-text-label-pro border border-white/10">
              {role.toUpperCase()}
            </Badge>
          </div>
        </div>

        <div className="flex flex-col justify-center space-y-6" style={{ transform: "translateZ(30px)" }}>
           <h4 className="mat-text-display-pro text-mat-wine text-5xl opacity-40 italic">Identity.</h4>
           <div className="space-y-4">
              <p className="mat-text-label-pro opacity-60 leading-relaxed">
                Your sovereign profile is elevated within the root ascent.
              </p>
              <div className="h-px w-24 bg-mat-rose/30" />
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                 <span className="text-[10px] font-bold uppercase tracking-widest text-mat-wine">Verified Portal</span>
              </div>
           </div>
        </div>
      </div>
    </motion.div>
  );
};
