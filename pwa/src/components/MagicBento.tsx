import React, { useRef, useEffect, useCallback, useState } from 'react';
import { gsap } from 'gsap';
import './MagicBento.css';

const DEFAULT_PARTICLE_COUNT = 8;
const DEFAULT_GLOW_COLOR = '212, 175, 55'; // Matriarch Gold
const MOBILE_BREAKPOINT = 768;

interface BentoItem {
  id: string;
  title: string;
  description: string;
  label: string;
  color?: string;
  size?: 'small' | 'medium' | 'large';
  content?: React.ReactNode;
}

interface MagicBentoProps {
  items: BentoItem[];
  textAutoHide?: boolean;
  enableBorderGlow?: boolean;
  disableAnimations?: boolean;
  particleCount?: number;
  enableTilt?: boolean;
  glowColor?: string;
  enableMagnetism?: boolean;
}

const createParticleElement = (x: number, y: number, color: string) => {
  const el = document.createElement('div');
  el.className = 'particle';
  el.style.cssText = `
    position: absolute;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: rgba(${color}, 1);
    box-shadow: 0 0 6px rgba(${color}, 0.6);
    pointer-events: none;
    z-index: 100;
    left: ${x}px;
    top: ${y}px;
  `;
  return el;
};

interface ParticleCardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  disableAnimations?: boolean;
  particleCount?: number;
  glowColor?: string;
  enableTilt?: boolean;
  enableMagnetism?: boolean;
}

const ParticleCard: React.FC<ParticleCardProps> = ({
  children,
  className = '',
  disableAnimations = false,
  style,
  particleCount = DEFAULT_PARTICLE_COUNT,
  glowColor = DEFAULT_GLOW_COLOR,
  enableTilt = true,
  enableMagnetism = true
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement[]>([]);
  const isHoveredRef = useRef(false);
  const magnetismAnimationRef = useRef<gsap.core.Tween | null>(null);

  const clearParticles = useCallback(() => {
    particlesRef.current.forEach(particle => {
      gsap.to(particle, {
        scale: 0,
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
          particle.parentNode?.removeChild(particle);
        }
      });
    });
    particlesRef.current = [];
  }, []);

  const animateParticles = useCallback(() => {
    if (!cardRef.current || !isHoveredRef.current) return;

    for (let i = 0; i < particleCount; i++) {
      const rect = cardRef.current.getBoundingClientRect();
      const x = Math.random() * rect.width;
      const y = Math.random() * rect.height;
      
      const particle = createParticleElement(x, y, glowColor);
      cardRef.current.appendChild(particle);
      particlesRef.current.push(particle);

      gsap.fromTo(particle, 
        { scale: 0, opacity: 0 }, 
        { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' }
      );

      gsap.to(particle, {
        x: (Math.random() - 0.5) * 60,
        y: (Math.random() - 0.5) * 60,
        duration: 2 + Math.random() * 2,
        ease: 'none',
        repeat: -1,
        yoyo: true
      });
    }
  }, [particleCount, glowColor]);

  useEffect(() => {
    if (disableAnimations || !cardRef.current) return;
    const element = cardRef.current;

    const onMouseEnter = () => {
      isHoveredRef.current = true;
      animateParticles();
    };

    const onMouseLeave = () => {
      isHoveredRef.current = false;
      clearParticles();
      gsap.to(element, { rotateX: 0, rotateY: 0, x: 0, y: 0, duration: 0.3 });
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      if (enableTilt) {
        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;
        gsap.to(element, { rotateX, rotateY, duration: 0.1, transformPerspective: 1000 });
      }

      if (enableMagnetism) {
        const magX = (x - centerX) * 0.05;
        const magY = (y - centerY) * 0.05;
        magnetismAnimationRef.current = gsap.to(element, { x: magX, y: magY, duration: 0.3 });
      }
    };

    element.addEventListener('mouseenter', onMouseEnter);
    element.addEventListener('mouseleave', onMouseLeave);
    element.addEventListener('mousemove', onMouseMove);

    return () => {
      element.removeEventListener('mouseenter', onMouseEnter);
      element.removeEventListener('mouseleave', onMouseLeave);
      element.removeEventListener('mousemove', onMouseMove);
      clearParticles();
    };
  }, [animateParticles, clearParticles, disableAnimations, enableTilt, enableMagnetism]);

  return (
    <div ref={cardRef} className={`${className} bento-card-wrapper`} style={style}>
      {children}
    </div>
  );
};

export const MagicBento: React.FC<MagicBentoProps> = ({
  items,
  textAutoHide = false,
  enableBorderGlow = true,
  disableAnimations = false,
  particleCount = DEFAULT_PARTICLE_COUNT,
  enableTilt = true,
  glowColor = DEFAULT_GLOW_COLOR,
  enableMagnetism = true
}) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const shouldDisableAnimations = disableAnimations || isMobile;

  return (
    <div ref={gridRef} className="magic-bento-grid">
      {items.map((item) => (
        <ParticleCard
          key={item.id}
          className={`magic-bento-card size-${item.size || 'small'} ${textAutoHide ? 'autohide' : ''} ${enableBorderGlow ? 'glow' : ''}`}
          style={{ '--bento-glow-color': glowColor } as any}
          disableAnimations={shouldDisableAnimations}
          particleCount={particleCount}
          glowColor={glowColor}
          enableTilt={enableTilt}
          enableMagnetism={enableMagnetism}
        >
          <div className="bento-card-label">{item.label}</div>
          <div className="bento-card-content">
            {item.content ? item.content : (
              <>
                <h3 className="bento-card-title">{item.title}</h3>
                <p className="bento-card-description">{item.description}</p>
              </>
            )}
          </div>
        </ParticleCard>
      ))}
    </div>
  );
};

export default MagicBento;
