import React, { useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

// Note: In a real environment, GSAP SplitText is a Club GSAP plugin. 
// If it's not available, we fall back to a simple split.
// For this PWA, I will assume we use the provided logic from react-bits.

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface MatriarchTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption';
  gold?: boolean;
  style?: React.CSSProperties;
}

export const MatriarchText: React.FC<MatriarchTextProps> = ({
  text,
  className = '',
  duration = 1,
  variant = 'body',
  gold = false,
  style = {}
}) => {
  const ref = useRef<HTMLParagraphElement>(null);
  const [, setInView] = useState(false);

  useGSAP(() => {
    if (!ref.current) return;
    
    gsap.from(ref.current, {
      opacity: 0,
      y: 20,
      duration: duration,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: ref.current,
        start: 'top 90%',
        onEnter: () => setInView(true)
      }
    });
  }, { scope: ref });

  const Tag = variant === 'h1' ? 'h1' : variant === 'h2' ? 'h2' : variant === 'h3' ? 'h3' : 'p';
  
  const getVariantClass = () => {
    switch(variant) {
      case 'h1': return 'text-5xl font-black uppercase tracking-widest';
      case 'h2': return 'text-3xl font-bold uppercase tracking-wider';
      case 'h3': return 'text-xl font-semibold uppercase tracking-wide';
      case 'caption': return 'text-xs uppercase tracking-widest opacity-60';
      default: return 'text-base';
    }
  };

  return (
    <Tag 
      ref={ref} 
      className={`${getVariantClass()} ${gold ? 'matriarch-title' : ''} ${className}`}
      style={{ ...style, margin: 0 }}
    >
      {text}
    </Tag>
  );
};

export default MatriarchText;
