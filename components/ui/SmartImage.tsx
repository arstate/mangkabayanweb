
import React, { useState, useEffect } from 'react';
import { ImageOff } from 'lucide-react';

interface SmartImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
}

export const SmartImage: React.FC<SmartImageProps> = ({ src, className, alt, ...props }) => {
  const [currentSrc, setCurrentSrc] = useState<string>('');
  const [retryCount, setRetryCount] = useState(0);
  const [hasError, setHasError] = useState(false);

  // Helper to generate proxy URL (wsrv.nl)
  const getProxyUrl = (url: string) => {
    if (!url || url.startsWith('data:') || url.startsWith('blob:') || url.includes('wsrv.nl')) return url;
    return `https://wsrv.nl/?url=${encodeURIComponent(url)}&output=webp`;
  };

  useEffect(() => {
    if (!src) return;
    setRetryCount(0);
    setHasError(false);
    // Start with proxy
    setCurrentSrc(getProxyUrl(src));
  }, [src]);

  const handleError = () => {
    if (retryCount === 0) {
      // Proxy failed, try original
      console.warn(`[SmartImage] Proxy failed for ${alt || src}, falling back to original.`);
      setCurrentSrc(src);
      setRetryCount(1);
    } else if (retryCount === 1) {
      // Original failed, try cache busting
      console.warn(`[SmartImage] Original failed for ${alt || src}, retrying.`);
      const separator = src.includes('?') ? '&' : '?';
      setCurrentSrc(`${src}${separator}t=${Date.now()}`);
      setRetryCount(2);
    } else {
      setHasError(true);
    }
  };

  if (hasError) {
    return (
      <div className={`flex items-center justify-center bg-gray-200 text-gray-400 ${className}`} aria-label={alt}>
        <ImageOff size={24} />
      </div>
    );
  }

  return (
    <img 
      src={currentSrc}
      alt={alt}
      className={className}
      onError={handleError}
      loading="lazy"
      {...props}
    />
  );
};
