import React, { useMemo } from 'react';
import { prepare, layout } from '@chenglou/pretext';

interface PerfectTextWrapperProps {
  text: string;
  font?: string; // e.g. "500 18px Inter"
  maxWidth: number;
  lineHeight: number;
  className?: string;
  as?: 'p' | 'h1' | 'h2' | 'h3' | 'span';
}

/**
 * A wrapper for @chenglou/pretext to ensure high-fidelity typography.
 * Pretext provides perfect line breaking and layout.
 */
const PerfectTextWrapper: React.FC<PerfectTextWrapperProps> = ({ 
  text, 
  font = "400 18px Inter", 
  maxWidth, 
  lineHeight, 
  className,
  as: Component = 'p'
}) => {
  const result = useMemo(() => {
    try {
      const prepared = prepare(text, font);
      return layout(prepared, maxWidth, lineHeight);
    } catch (e) {
      console.error('Pretext layout failed:', e);
      return { height: 'auto', lineCount: 0 };
    }
  }, [text, font, maxWidth, lineHeight]);

  return (
    <Component 
      className={className} 
      style={{ 
        height: result.height, 
        width: maxWidth === Infinity ? '100%' : maxWidth,
        overflow: 'hidden',
        font: font,
        lineHeight: `${lineHeight}px`
      }}
    >
      {text}
    </Component>
  );
};

export default PerfectTextWrapper;
