import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SmartImage } from './ui/SmartImage';

const banners = [
  "https://lh3.googleusercontent.com/drive-storage/AJQWtBMg5SHVi9xbMN1J3_EFLvfP_cLKh-KY40DZY6yCKhjp0EOrEjax2UMOFylV02Hkp25jDMPAkbkm2qlXjt-iUhj4i-MDldL5PPjj=w1600",
  "https://lh3.googleusercontent.com/drive-storage/AJQWtBMXGRreAy7TvlTDEew0VixTQiwE6avoVKJnBkeDJzBS-OINb4i8vUudlRvStwE10p6jrAuoPyFKY_G5GZjtulH1cx3QNY8hqK34=w1600"
];

// Helper to get proxied URL for background images (since SmartImage only works for <img>)
const getProxiedUrl = (url: string) => {
   const encodedUrl = encodeURIComponent(url);
   return `https://wsrv.nl/?url=${encodedUrl}&output=webp&blur=20`;
};

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
                {/* Soft Ambient Glow (Using Proxied URL for optimization) */}
                <div 
                  className="absolute inset-6 -bottom-2 bg-cover bg-center blur-3xl opacity-30 rounded-[50px] z-0 transform translate-y-4 scale-95 pointer-events-none"
                  style={{ backgroundImage: `url(${getProxiedUrl(banners[imageIndex])})` }}
                />

                {/* Main Image */}
                <div className="relative z-10 w-full h-full rounded-[20px] md:rounded-[40px] shadow-2xl border border-white/20 bg-white/10 backdrop-blur-sm overflow-hidden">
                   <SmartImage 
                    src={banners[imageIndex]} 
                    alt={`Promo Banner ${imageIndex + 1}`}
                    className="w-full h-full object-contain md:object-cover"
                    draggable={false}
                   />
                </div>
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