
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SmartImage } from './ui/SmartImage';

const banners = [
  "https://lh3.googleusercontent.com/drive-storage/AJQWtBMQrSLXP0TXeNTlPTvdNcurY-uSU1gRzvHgTtJXayRRh_37SWID9c-kiFWu6RGvLSrbKwwigiRvoQEOlkMR7TpLWykAkpIQOkxnbQ=w800",
  "https://lh3.googleusercontent.com/drive-storage/AJQWtBObcv3nAWY2IkgaazFutaW8X1PcyK_fHMGspr56ytcy2GMaNKuu_63lMWkK5-VJnfcjIcYsDX4pmScsIRkFaIDdDWQ3jYehOOdy8g=w800"
];

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
    scale: 0.95
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0,
    scale: 0.95
  })
};

// Helper function to get proxy URL for background images (CSS)
const getProxyUrl = (url: string) => {
  if (!url || url.startsWith('data:') || url.startsWith('blob:') || url.includes('wsrv.nl')) return url;
  return `https://wsrv.nl/?url=${encodeURIComponent(url)}&output=webp`;
};

export const PromoSlider: React.FC = () => {
  const [[page, direction], setPage] = useState([0, 0]);

  // Infinite pagination logic
  const imageIndex = Math.abs(page % banners.length);

  useEffect(() => {
    // Diperlambat jadi 7 detik
    const timer = setInterval(() => {
      paginate(1);
    }, 7000); 
    return () => clearInterval(timer);
  }, [page]);

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };

  const currentBanner = banners[imageIndex];
  const proxiedBanner = getProxyUrl(currentBanner);

  return (
    // overflow-visible is crucial to prevent shadow clipping
    <section className="py-12 md:py-20 overflow-visible relative z-10">
      <div className="container mx-auto px-4 md:px-6">
        <div className="relative w-full max-w-6xl mx-auto">
          
          {/* Container Aspect Ratio */}
          <div className="relative aspect-[16/8] md:aspect-[21/9]">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={page}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { duration: 1.2, ease: "easeInOut" }, // Animasi slide diperhalus dan diperlambat
                  opacity: { duration: 0.8 },
                  scale: { duration: 1.2 }
                }}
                className="absolute inset-0 w-full h-full flex items-center justify-center"
              >
                {/* Soft Ambient Glow */}
                <div 
                  className="absolute inset-6 -bottom-2 bg-cover bg-center blur-3xl opacity-30 rounded-[50px] z-0 transform translate-y-4 scale-95 pointer-events-none"
                  style={{ backgroundImage: `url(${proxiedBanner})` }}
                />

                {/* Main Image */}
                <SmartImage 
                  src={currentBanner} 
                  alt={`Promo Banner ${imageIndex + 1}`}
                  className="relative z-10 w-full h-full object-contain md:object-cover rounded-[20px] md:rounded-[40px] shadow-2xl border border-white/20 bg-white/10 backdrop-blur-sm"
                  draggable="false"
                />
              </motion.div>
            </AnimatePresence>

            {/* Pagination Dots */}
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-20">
              {banners.map((_, idx) => (
                <div
                  key={idx}
                  className={`
                    h-2.5 rounded-full transition-all duration-500 shadow-sm
                    ${idx === imageIndex ? 'bg-mangka-secondary w-8' : 'bg-mangka-primary/20 w-2.5'}
                  `}
                />
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
