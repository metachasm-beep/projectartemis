import React, { useRef, useEffect, useState, useCallback } from 'react';
import { gsap } from 'gsap';

// ----- types ---------------------------------------------------------------

interface ParticleCardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  particleCount?: number;
  glowColor?: string;
  enableTilt?: boolean;
  clickEffect?: boolean;
  enableMagnetism?: boolean;
  disableAnimations?: boolean;
  onClick?: () => void;
}

export interface MagicBentoProps {
  cards: {
    id: string;
    title: string;
    description: string;
    label: string;
    color?: string;
    /** optional JSX content rendered inside the card */
    content?: React.ReactNode;
    onClick?: () => void;
  }[];
  spotlightRadius?: number;
  glowColor?: string;
  enableStars?: boolean;
  enableBorderGlow?: boolean;
  enableTilt?: boolean;
  enableMagnetism?: boolean;
  clickEffect?: boolean;
  className?: string;
}

// ----- constants -----------------------------------------------------------

const DEFAULT_GLOW = '180, 120, 60';     // warm gold to match Matriarch palette
const DEFAULT_PARTICLE_COUNT = 10;
const MOBILE_BREAKPOINT = 768;

// ----- helpers -------------------------------------------------------------

const createParticle = (x: number, y: number, color: string): HTMLDivElement => {
  const el = document.createElement('div');
  el.className = 'mb-particle';
  el.style.cssText = `
    position:absolute;width:4px;height:4px;border-radius:50%;
    background:rgba(${color},1);box-shadow:0 0 6px rgba(${color},0.6);
    pointer-events:none;z-index:100;left:${x}px;top:${y}px;
  `;
  return el;
};

const getSpotlightValues = (r: number) => ({ proximity: r * 0.5, fadeDistance: r * 0.75 });

const setCardGlow = (card: HTMLElement, mx: number, my: number, intensity: number, radius: number) => {
  const rect = card.getBoundingClientRect();
  card.style.setProperty('--glow-x', `${((mx - rect.left) / rect.width) * 100}%`);
  card.style.setProperty('--glow-y', `${((my - rect.top) / rect.height) * 100}%`);
  card.style.setProperty('--glow-intensity', intensity.toString());
  card.style.setProperty('--glow-radius', `${radius}px`);
};

// ----- ParticleCard --------------------------------------------------------

const ParticleCard: React.FC<ParticleCardProps> = ({
  children,
  className = '',
  style,
  particleCount = DEFAULT_PARTICLE_COUNT,
  glowColor = DEFAULT_GLOW,
  enableTilt = false,
  clickEffect = true,
  enableMagnetism = false,
  disableAnimations = false,
  onClick,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement[]>([]);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const hoveredRef = useRef(false);
  const memoRef = useRef<HTMLDivElement[]>([]);
  const initializedRef = useRef(false);
  const magnetRef = useRef<gsap.core.Tween | null>(null);

  const initParticles = useCallback(() => {
    if (initializedRef.current || !ref.current) return;
    const { width, height } = ref.current.getBoundingClientRect();
    memoRef.current = Array.from({ length: particleCount }, () =>
      createParticle(Math.random() * width, Math.random() * height, glowColor)
    );
    initializedRef.current = true;
  }, [particleCount, glowColor]);

  const clearParticles = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    magnetRef.current?.kill();
    particlesRef.current.forEach(p => {
      gsap.to(p, { scale: 0, opacity: 0, duration: 0.3, ease: 'back.in(1.7)', onComplete: () => p.parentNode?.removeChild(p) });
    });
    particlesRef.current = [];
  }, []);

  const spawnParticles = useCallback(() => {
    if (!ref.current || !hoveredRef.current) return;
    if (!initializedRef.current) initParticles();

    memoRef.current.forEach((p, i) => {
      const tid = setTimeout(() => {
        if (!hoveredRef.current || !ref.current) return;
        const clone = p.cloneNode(true) as HTMLDivElement;
        ref.current.appendChild(clone);
        particlesRef.current.push(clone);
        gsap.fromTo(clone, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' });
        gsap.to(clone, { x: (Math.random() - 0.5) * 80, y: (Math.random() - 0.5) * 80, rotation: Math.random() * 360, duration: 2 + Math.random() * 2, ease: 'none', repeat: -1, yoyo: true });
        gsap.to(clone, { opacity: 0.3, duration: 1.5, ease: 'power2.inOut', repeat: -1, yoyo: true });
      }, i * 90);
      timeoutsRef.current.push(tid);
    });
  }, [initParticles]);

  useEffect(() => {
    if (disableAnimations || !ref.current) return;
    const el = ref.current;

    const onEnter = () => { hoveredRef.current = true; spawnParticles(); if (enableTilt) gsap.to(el, { rotateX: 5, rotateY: 5, duration: 0.3, ease: 'power2.out', transformPerspective: 1000 }); };
    const onLeave = () => {
      hoveredRef.current = false;
      clearParticles();
      if (enableTilt) gsap.to(el, { rotateX: 0, rotateY: 0, duration: 0.3, ease: 'power2.out' });
      if (enableMagnetism) gsap.to(el, { x: 0, y: 0, duration: 0.3, ease: 'power2.out' });
    };
    const onMove = (e: MouseEvent) => {
      if (!enableTilt && !enableMagnetism) return;
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left, y = e.clientY - rect.top;
      const cx = rect.width / 2, cy = rect.height / 2;
      if (enableTilt) gsap.to(el, { rotateX: ((y - cy) / cy) * -10, rotateY: ((x - cx) / cx) * 10, duration: 0.1, ease: 'power2.out', transformPerspective: 1000 });
      if (enableMagnetism) { magnetRef.current = gsap.to(el, { x: (x - cx) * 0.05, y: (y - cy) * 0.05, duration: 0.3, ease: 'power2.out' }); }
    };
    const onClick = (e: MouseEvent) => {
      if (!clickEffect) return;
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left, y = e.clientY - rect.top;
      const maxD = Math.max(Math.hypot(x, y), Math.hypot(x - rect.width, y), Math.hypot(x, y - rect.height), Math.hypot(x - rect.width, y - rect.height));
      const ripple = document.createElement('div');
      ripple.style.cssText = `position:absolute;width:${maxD*2}px;height:${maxD*2}px;border-radius:50%;background:radial-gradient(circle,rgba(${glowColor},0.4)0%,rgba(${glowColor},0.2)30%,transparent 70%);left:${x-maxD}px;top:${y-maxD}px;pointer-events:none;z-index:1000;`;
      el.appendChild(ripple);
      gsap.fromTo(ripple, { scale: 0, opacity: 1 }, { scale: 1, opacity: 0, duration: 0.8, ease: 'power2.out', onComplete: () => ripple.remove() });
    };

    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('mouseleave', onLeave);
    el.addEventListener('mousemove', onMove);
    el.addEventListener('click', onClick);

    return () => {
      hoveredRef.current = false;
      el.removeEventListener('mouseenter', onEnter);
      el.removeEventListener('mouseleave', onLeave);
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('click', onClick);
      clearParticles();
    };
  }, [spawnParticles, clearParticles, disableAnimations, enableTilt, enableMagnetism, clickEffect, glowColor]);

  return (
    <div
      ref={ref}
      className={`${className} relative overflow-hidden`}
      style={{ ...style, position: 'relative', overflow: 'hidden' }}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

// ----- GlobalSpotlight -----------------------------------------------------

const GlobalSpotlight: React.FC<{
  gridRef: React.RefObject<HTMLDivElement | null>;
  spotlightRadius: number;
  glowColor: string;
}> = ({ gridRef, spotlightRadius, glowColor }) => {
  const slRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!gridRef.current) return;

    const spotlight = document.createElement('div');
    spotlight.style.cssText = `
      position:fixed;width:${spotlightRadius * 2}px;height:${spotlightRadius * 2}px;border-radius:50%;pointer-events:none;
      background:radial-gradient(circle,rgba(${glowColor},0.18)0%,rgba(${glowColor},0.09)15%,rgba(${glowColor},0.04)30%,transparent 70%);
      z-index:200;opacity:0;transform:translate(-50%,-50%);mix-blend-mode:screen;
    `;
    document.body.appendChild(spotlight);
    slRef.current = spotlight;

    const { proximity, fadeDistance } = getSpotlightValues(spotlightRadius);

    const onMove = (e: MouseEvent) => {
      if (!slRef.current || !gridRef.current) return;
      const section = gridRef.current.closest('.mb-bento-section');
      const rect = section?.getBoundingClientRect();
      const inside = rect && e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;

      const cards = gridRef.current.querySelectorAll('.mb-card');

      if (!inside) {
        gsap.to(slRef.current, { opacity: 0, duration: 0.3, ease: 'power2.out' });
        cards.forEach(c => (c as HTMLElement).style.setProperty('--glow-intensity', '0'));
        return;
      }

      let minDist = Infinity;
      cards.forEach(c => {
        const cr = (c as HTMLElement).getBoundingClientRect();
        const cx = cr.left + cr.width / 2, cy = cr.top + cr.height / 2;
        const dist = Math.max(0, Math.hypot(e.clientX - cx, e.clientY - cy) - Math.max(cr.width, cr.height) / 2);
        minDist = Math.min(minDist, dist);
        const intensity = dist <= proximity ? 1 : dist <= fadeDistance ? (fadeDistance - dist) / (fadeDistance - proximity) : 0;
        setCardGlow(c as HTMLElement, e.clientX, e.clientY, intensity, spotlightRadius);
      });

      gsap.to(slRef.current, { left: e.clientX, top: e.clientY, duration: 0.1, ease: 'power2.out' });
      const op = minDist <= proximity ? 0.9 : minDist <= fadeDistance ? ((fadeDistance - minDist) / (fadeDistance - proximity)) * 0.9 : 0;
      gsap.to(slRef.current, { opacity: op, duration: op > 0 ? 0.2 : 0.5, ease: 'power2.out' });
    };

    const onLeave = () => {
      gridRef.current?.querySelectorAll('.mb-card').forEach(c => (c as HTMLElement).style.setProperty('--glow-intensity', '0'));
      if (slRef.current) gsap.to(slRef.current, { opacity: 0, duration: 0.3, ease: 'power2.out' });
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseleave', onLeave);
    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      slRef.current?.parentNode?.removeChild(slRef.current);
    };
  }, [gridRef, spotlightRadius, glowColor]);

  return null;
};

// ----- MagicBento (main export) --------------------------------------------

const MagicBento: React.FC<MagicBentoProps> = ({
  cards,
  spotlightRadius = 400,
  glowColor = DEFAULT_GLOW,
  enableStars = true,
  enableBorderGlow = true,
  enableTilt = false,
  enableMagnetism = false,
  clickEffect = true,
  className = '',
}) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const shouldDisable = isMobile;

  const cardBase = `mb-card flex flex-col justify-between relative p-6 rounded-2xl border border-solid font-light overflow-hidden transition-all duration-300 cursor-pointer hover:-translate-y-0.5 ${enableBorderGlow ? 'mb-card--glow' : ''}`;

  const cardStyle = (color?: string) => ({
    backgroundColor: color ?? '#FDFBF7',
    borderColor: 'rgba(60, 47, 47, 0.08)',
    color: '#3C2F2F',
    '--glow-x': '50%',
    '--glow-y': '50%',
    '--glow-intensity': '0',
    '--glow-radius': `${spotlightRadius}px`,
  } as React.CSSProperties);

  return (
    <>
      <style>{`
        .mb-card--glow::after {
          content:'';position:absolute;inset:0;padding:5px;
          background:radial-gradient(var(--glow-radius) circle at var(--glow-x) var(--glow-y),
            rgba(${glowColor}, calc(var(--glow-intensity) * 0.8)) 0%,
            rgba(${glowColor}, calc(var(--glow-intensity) * 0.35)) 35%,
            transparent 65%);
          border-radius:inherit;
          -webkit-mask:linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite:xor;mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);
          mask-composite:exclude;pointer-events:none;z-index:1;
        }
        .mb-card--glow:hover { box-shadow:0 12px 40px rgba(60,47,47,0.06),0 0 40px rgba(${glowColor},0.08); }
      `}</style>

      <GlobalSpotlight gridRef={gridRef} spotlightRadius={spotlightRadius} glowColor={glowColor} />

      <div ref={gridRef} className={`mb-bento-section ${className}`}>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {cards.map((card, i) => {
            // Asymmetric layout: every 7th card is 8-col, prev is 4-col, rest alternate
            const isWide = i % 7 === 0;
            const colSpan = isWide ? 'md:col-span-8' : i % 7 === 1 ? 'md:col-span-4' : i % 2 === 0 ? 'md:col-span-5' : 'md:col-span-7';
            const minH = isWide ? 'min-h-[320px]' : 'min-h-[240px]';

            if (enableStars && !shouldDisable) {
              return (
                <ParticleCard
                  key={card.id}
                  className={`${cardBase} ${colSpan} ${minH}`}
                  style={cardStyle(card.color)}
                  glowColor={glowColor}
                  enableTilt={enableTilt}
                  enableMagnetism={enableMagnetism}
                  clickEffect={clickEffect}
                  disableAnimations={shouldDisable}
                  onClick={card.onClick}
                >
                  <span className="text-[9px] font-black uppercase tracking-[0.4em] text-rose-500/60">{card.label}</span>
                  {card.content && <div className="flex-1">{card.content}</div>}
                  <div>
                    <h3 className="text-lg font-black tracking-tight text-[#3C2F2F] mb-2 leading-tight">{card.title}</h3>
                    <p className="text-xs text-[#3C2F2F]/60 leading-relaxed font-medium line-clamp-3">{card.description}</p>
                  </div>
                </ParticleCard>
              );
            }

            return (
              <div
                key={card.id}
                className={`${cardBase} ${colSpan} ${minH}`}
                style={cardStyle(card.color)}
                onClick={card.onClick}
              >
                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-rose-500/60">{card.label}</span>
                {card.content && <div className="flex-1">{card.content}</div>}
                <div>
                  <h3 className="text-lg font-black tracking-tight text-[#3C2F2F] mb-2 leading-tight">{card.title}</h3>
                  <p className="text-xs text-[#3C2F2F]/50 leading-relaxed font-medium line-clamp-3">{card.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default MagicBento;
