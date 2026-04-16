import React from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

/**
 * 📸 OPTIMIZED IMAGE:
 * A Cloudinary-aware component that enforces SEO best practices:
 * 1. Alt tags for crawlability.
 * 2. Width/Height to prevent Layout Shift (CLS).
 * 3. f_auto, q_auto transformations for performance.
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = ({ 
  src, 
  alt, 
  className, 
  width, 
  height,
  priority = false 
}) => {
  // Extract Cloudinary ID or clean URL
  const isCloudinary = src.includes('cloudinary.com');
  
  let optimizedSrc = src;
  if (isCloudinary && !src.includes('/upload/')) {
    // If it's a raw Cloudinary URL, we can inject transformations
    // This is a simple implementation; a more robust one would use the Cloudinary SDK
    optimizedSrc = src.replace('/upload/', '/upload/f_auto,q_auto,c_fill,g_auto/');
  }

  return (
    <img
      src={optimizedSrc}
      alt={alt}
      className={className}
      width={width}
      height={height}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        target.style.display = 'none';
      }}
    />
  );
};
