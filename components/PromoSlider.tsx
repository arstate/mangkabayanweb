
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SmartImage } from './ui/SmartImage';

const banners = [
  "https://lh3.googleusercontent.com/pw/AP1GczMXB-MhG-mSfHg-qZQzpRMX3LEy1ZxJHSvSe-Gyw9xSDGxSPHQMEE4BProAk0WDPhy-b73K9CKBYdfsjyJPwQfqXNIAEut6jnzHqTXeRW62VsER5r4=w2400",
  "https://lh3.googleusercontent.com/pw/AP1GczMOxzyyGSmlXFTRen4-qtovBwVuIIOVrrNYAO8ISiBWwoBjP_PTmdVQhf0tiqsQBf5JVPeHvZsz_mld0FwfnkAPDNhojLB38IgKetU9mrEjl8Lsld8=w2400"
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

const getProxyUrl = (url: string) => {
  if (!url || url.startsWith('data:') || url.startsWith('blob:') || url.includes('wsrv.nl')) return url;
  return `https://wsrv.nl/?url=${encodeURIComponent(url)}&output=webp`;
};

export const PromoSlider: React.FC = () => {
  const [[page, direction], setPage] = useState([0, 0]);
  const imageIndex = Math.abs(page % banners.length);

  useEffect(() => {
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
    <section className="py-12 md:py-20 overflow-hidden relative z-10">
      <div className="container mx-auto px-4 md:px-6">
        <div className="relative w-full max-w-6xl mx-auto overflow-hidden rounded-[20px] md:rounded-[40px]">
          
          <div className="relative aspect-[16/8] md:aspect-[21/9]">
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
              <motion.div
                key={page}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { duration: 1.2, ease: [0.43, 0.13, 0.23, 0.96] },
                  opacity: { duration: 0.8 },
                  scale: { duration: 1.2 }
                }}
                className="absolute inset-0 w-full h-full flex items-center justify-center"
              >
                {/* Ambient Glow */}
                <div 
                  className="absolute inset-10 bg-cover bg-center blur-3xl opacity-20 rounded-full z-0 pointer-events-none"
                  style={{ backgroundImage: `url(${proxiedBanner})` }}
                />

                {/* Main Image */}
                <SmartImage 
                  src={currentBanner} 
                  alt={`Promo Banner ${imageIndex + 1}`}
                  className="relative z-10 w-full h-full object-cover shadow-2xl"
                  draggable="false"
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Pagination Dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20">
            {banners.map((_, idx) => (
              <div
                key={idx}
                className={`
                  h-1.5 rounded-full transition-all duration-500
                  ${idx === imageIndex ? 'bg-mangka-secondary w-6' : 'bg-white/40 w-1.5'}
                `}
              />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};
