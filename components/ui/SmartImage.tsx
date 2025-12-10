import React, { useState, useEffect } from 'react';

interface SmartImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  fallbackSrc?: string;
}

export const SmartImage: React.FC<SmartImageProps> = ({ src, alt, className, ...props }) => {
  // States
  // 0: Try Proxy (Optimized & Cached)
  // 1: Try Original (Direct Link)
  // 2: Retry Original (Cache Buster)
  // 3: Failed
  const [loadState, setLoadState] = useState<number>(0);
  const [currentSrc, setCurrentSrc] = useState<string>('');

  useEffect(() => {
    // Reset state when src prop changes
    setLoadState(0);
  }, [src]);

  useEffect(() => {
    if (!src) return;

    if (loadState === 0) {
      // Step 1: Use wsrv.nl proxy for caching, resizing to WebP, and reliability
      // We encode the URL to handle special characters in Google Drive links safely
      const encodedUrl = encodeURIComponent(src);
      // w=1200 limit width to prevent massive downloads, output=webp for performance
      setCurrentSrc(`https://wsrv.nl/?url=${encodedUrl}&output=webp`);
    } else if (loadState === 1) {
      // Step 2: Fallback to original URL
      setCurrentSrc(src);
    } else if (loadState === 2) {
      // Step 3: Retry original with cache buster
      const separator = src.includes('?') ? '&' : '?';
      setCurrentSrc(`${src}${separator}retry=${Date.now()}`);
    }
  }, [src, loadState]);

  const handleError = () => {
    if (loadState < 2) {
      // Move to next state
      // Delay slightly to prevent rapid flickering
      setTimeout(() => {
        setLoadState(prev => prev + 1);
      }, 100);
    } else {
      console.error(`Failed to load image after retries: ${src}`);
      // Optional: Set a placeholder here if needed
      setLoadState(3); 
    }
  };

  return (
    <img
      src={currentSrc}
      alt={alt || "Image"}
      className={`${className} ${loadState === 3 ? 'opacity-50 grayscale' : ''} transition-opacity duration-300`}
      onError={handleError}
      loading="lazy"
      {...props}
    />
  );
};