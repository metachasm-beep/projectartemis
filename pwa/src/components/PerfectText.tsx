import React, { useMemo } from 'react';
import { prepare, layout } from '@chenglou/pretext';

interface PerfectTextProps {
  text: string;
  font: string; // e.g. "500 18px Inter"
  maxWidth: number;
  lineHeight: number;
  className?: string;
}

const PerfectText: React.FC<PerfectTextProps> = ({ text, font, maxWidth, lineHeight, className }) => {
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
    <div 
      className={className} 
      style={{ 
        height: result.height, 
        width: maxWidth,
        overflow: 'hidden',
        font: font,
        lineHeight: `${lineHeight}px`
      }}
    >
      {text}
    </div>
  );
};

export default PerfectText;
