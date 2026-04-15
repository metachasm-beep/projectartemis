import React from 'react';

/**
 * 🎞️ PostProcessOverlay: Global Aesthetic Filter
 * Applies chromatic aberration and procedural grain to the entire viewport.
 */
export const PostProcessOverlay: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-[999] overflow-hidden">
      {/* 🏗️ Static Grain Mask */}
      <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </div>
  );
};

export default PostProcessOverlay;
