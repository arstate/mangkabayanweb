import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';
import { GlassCard } from './ui/GlassCard';

export const Hero: React.FC = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center pt-28 pb-12 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-2/3 h-full bg-orange-100/30 rounded-l-[100px] -z-10" />
      <div className="absolute top-20 left-10 w-64 h-64 bg-mangka-secondary/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-mangka-primary/5 rounded-full blur-3xl -z-10" />

      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* Text Content */}
          <div className="lg:w-1/2 space-y-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-mangka-primary/10 text-mangka-primary text-sm font-bold tracking-wider mb-4 border border-mangka-primary/10">
                ESTABLISHED 1996
              </span>
              <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] text-mangka-primary mb-6">
                Cita Rasa <span className="text-mangka-secondary italic">Nusantara</span> <br />
                Nikmatnya Tiada Dua
              </h1>
              <p className="font-sans text-lg md:text-xl text-mangka-primary/80 leading-relaxed max-w-lg">
                Nikmati kehangatan masakan khas Sunda dan hidangan laut segar di Surabaya dengan suasana yang nyaman dan pelayanan sepenuh hati.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <a 
                href="#menu"
                className="group flex items-center justify-center gap-3 bg-mangka-primary text-white px-8 py-4 rounded-full font-bold hover:bg-mangka-secondary transition-colors duration-300"
              >
                Lihat Menu Kami
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <a 
                href="https://wa.me/628113531888" 
                className="flex items-center justify-center gap-3 bg-white border-2 border-mangka-primary/20 text-mangka-primary px-8 py-4 rounded-full font-bold hover:bg-mangka-primary/5 transition-colors duration-300"
              >
                Reservasi Meja
              </a>
            </motion.div>

            {/* Floating Trust Indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex items-center gap-4 pt-4"
            >
              <div className="flex -space-x-4">
                 {[1,2,3,4].map(i => (
                   <div key={i} className="w-12 h-12 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                     <img src={`https://picsum.photos/100/100?random=${i+10}`} alt="Customer" className="w-full h-full object-cover" />
                   </div>
                 ))}
              </div>
              <div>
                <div className="flex text-mangka-secondary">
                  {[1,2,3,4,5].map(i => <Star key={i} size={16} fill="currentColor" />)}
                </div>
                <p className="text-sm font-medium text-mangka-primary">Dipercaya ribuan keluarga</p>
              </div>
            </motion.div>
          </div>

          {/* Image Composition */}
          <div className="lg:w-1/2 relative">
             <div className="relative w-full aspect-[4/5] md:aspect-square lg:aspect-[4/5]">
                {/* Main Hero Image in Glass Container */}
                <GlassCard className="w-full h-full p-3 md:p-4 rotate-3 hover:rotate-0 transition-transform duration-500">
                  <div className="w-full h-full rounded-[32px] overflow-hidden relative">
                    <img 
                      src="https://lh3.googleusercontent.com/drive-storage/AJQWtBMn7SBtU_bKdJp9dfCTky9iV7Z3VI6VNpeI656AQiW9YTGqsXRn_7bBsoNPu_EP8QhyNWCr4CjbfMta73fSJEVKcQtAdJF7tcGKng=w1200" 
                      alt="Suasana Mangkabayan" 
                      className="w-full h-full object-cover scale-110 hover:scale-100 transition-transform duration-700"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-8">
                       <p className="text-white font-serif text-2xl italic">Signature Dish</p>
                       <p className="text-mangka-secondary font-bold text-3xl">Gurame Bakar</p>
                    </div>
                  </div>
                </GlassCard>
                
                {/* Floating Badge */}
                <motion.div 
                  animate={{ y: [0, -15, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  className="absolute -bottom-6 -left-6 md:bottom-10 md:-left-12"
                >
                  <GlassCard className="px-6 py-4 flex items-center gap-4 !bg-white/90">
                    <div className="bg-green-100 p-3 rounded-full text-green-700">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Bahan Baku</p>
                      <p className="text-mangka-primary font-bold text-lg">100% Segar</p>
                    </div>
                  </GlassCard>
                </motion.div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};