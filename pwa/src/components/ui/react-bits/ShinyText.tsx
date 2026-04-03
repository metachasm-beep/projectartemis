import { motion, useMotionValue, useAnimationFrame, useTransform } from 'framer-motion';
import { useState } from 'react';

interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
}

const ShinyText: React.FC<ShinyTextProps> = ({ text, disabled = false, speed = 5, className = '' }) => {
  const [isHovered, setIsHovered] = useState(false);
  const progress = useMotionValue(0);

  useAnimationFrame((time: number) => {
    if (disabled) return;
    const p = (time / 1000 * speed) % 100;
    progress.set(p);
  });

  const backgroundPosition = useTransform(progress, (p: number) => `${150 - p * 2}% center`);

  return (
    <motion.span
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        backgroundImage: 'linear-gradient(120deg, rgba(255, 255, 255, 0) 40%, rgba(255, 255, 255, 0.8) 50%, rgba(255, 255, 255, 0) 60%)',
        backgroundSize: '200% 100%',
        backgroundPosition,
        WebkitBackgroundClip: 'text',
        animationDuration: `${speed}s`,
      }}
      className={`inline-block text-transparent bg-clip-text transition-all duration-300 ${isHovered ? 'scale-105' : ''} ${className}`}
    >
      {text}
    </motion.span>
  );
};

export default ShinyText;
