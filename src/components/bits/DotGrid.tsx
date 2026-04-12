'use client';
import React, { useRef, useEffect, useCallback, useMemo } from 'react';

// Lightweight, non-WebGL dot grid — uses Canvas 2D only.
// Dramatically less GPU-intensive than shader-based alternatives.

const throttle = (func: (...args: any[]) => void, limit: number) => {
  let lastCall = 0;
  return function (this: any, ...args: any[]) {
    const now = performance.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      func.apply(this, args);
    }
  };
};

interface Dot {
  cx: number;
  cy: number;
}

export interface DotGridProps {
  dotSize?: number;
  gap?: number;
  baseColor?: string;
  className?: string;
  style?: React.CSSProperties;
}

function hexToRgb(hex: string) {
  const m = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  if (!m) return { r: 0, g: 0, b: 0 };
  return {
    r: parseInt(m[1], 16),
    g: parseInt(m[2], 16),
    b: parseInt(m[3], 16),
  };
}

const DotGrid: React.FC<DotGridProps> = ({
  dotSize = 3,
  gap = 28,
  baseColor = '#BFA06A',
  className = '',
  style,
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotsRef = useRef<Dot[]>([]);

  const baseRgb = useMemo(() => hexToRgb(baseColor), [baseColor]);

  const buildGrid = useCallback(() => {
    const wrap = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const { width, height } = wrap.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.scale(dpr, dpr);

    const cols = Math.floor((width + gap) / (dotSize + gap));
    const rows = Math.floor((height + gap) / (dotSize + gap));
    const cell = dotSize + gap;

    const gridW = cell * cols - gap;
    const gridH = cell * rows - gap;

    const startX = (width - gridW) / 2 + dotSize / 2;
    const startY = (height - gridH) / 2 + dotSize / 2;

    const dots: Dot[] = [];
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        dots.push({ cx: startX + x * cell, cy: startY + y * cell });
      }
    }
    dotsRef.current = dots;
  }, [dotSize, gap]);

  // Single draw — no animation loop needed; dots are static.
  const drawDots = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = `rgb(${baseRgb.r},${baseRgb.g},${baseRgb.b})`;

    const path = new Path2D();
    for (const dot of dotsRef.current) {
      path.arc(dot.cx, dot.cy, dotSize / 2, 0, Math.PI * 2);
      path.moveTo(dot.cx + dotSize / 2, dot.cy); // reset arc starting point
    }
    ctx.fill(path);
  }, [baseRgb, dotSize]);

  useEffect(() => {
    buildGrid();
    drawDots();

    let ro: ResizeObserver | null = null;
    const handleResize = () => {
      buildGrid();
      drawDots();
    };

    if ('ResizeObserver' in window) {
      ro = new ResizeObserver(handleResize);
      wrapperRef.current && ro.observe(wrapperRef.current);
    } else {
      window.addEventListener('resize', handleResize);
    }
    return () => {
      if (ro) ro.disconnect();
      else window.removeEventListener('resize', handleResize);
    };
  }, [buildGrid, drawDots]);

  return (
    <div
      ref={wrapperRef}
      className={`w-full h-full relative ${className}`}
      style={style}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />
    </div>
  );
};

export default DotGrid;
