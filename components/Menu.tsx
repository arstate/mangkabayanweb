
import React from 'react';
import { Link } from 'react-router-dom';
import { GlassCard } from './ui/GlassCard';
import { MenuItem } from '../types';
import { Sparkles } from 'lucide-react';
import { SmartImage } from './ui/SmartImage';

const featuredMenu: MenuItem[] = [
  {
    id: 1,
    name: "Gurame Bakar",
    description: "Gurame bakar dengan bumbu kecap manis spesial yang meresap sempurna.",
    image: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    isRecommended: true
  },
  {
    id: 2,
    name: "Nasi Liwet Kastrol",
    description: "Nasi timbel bungkus daun pisang dengan lauk lengkap.",
    image: "https://lh3.googleusercontent.com/drive-storage/AJQWtBOMztMxWg891dALLylvHZPWw_rgtug-Bs7GpwZdWcwCzp2NytYXrrklSCJG9QwIq8EZtTkaksgxdwMWSzD1mCfFDEzpz2LpHJpAxQ=w800",
    isRecommended: true
  },
  {
    id: 3,
    name: "Udang Bakar Madu",
    description: "Udang pilihan dibakar dengan olesan madu murni.",
    image: "https://images.unsplash.com/photo-1625938145744-e38051524294?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 4,
    name: "Sayur Asem",
    description: "Kuah segar manis asam dengan jagung dan labu siam.",
    image: "https://lh3.googleusercontent.com/drive-storage/AJQWtBMAGd-zOSdtsVKR_cLyAnnLK2_KLh9f5mWW_mHq1J4bJ6irdYICzP87VdcaZC8q6XqoRCqtr8uJLG6Yt2RSYYJdXPCpb2b6I547PQ=w800",
  }
];

export const Menu: React.FC = () => {
  return (
    <section id="menu" className="py-20 bg-gradient-to-b from-transparent to-white/40">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-mangka-primary mb-4">
            Menu Andalan
          </h2>
          <p className="text-mangka-primary/70">
            Dipilih dari resep terbaik untuk memanjakan lidah Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredMenu.map((item, index) => (
            <GlassCard 
              key={item.id} 
              delay={index * 0.1} 
              hoverEffect={true}
              className="group h-full flex flex-col p-4"
            >
              <div className="relative overflow-hidden rounded-[24px] aspect-square mb-6">
                <SmartImage 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                {item.isRecommended && (
                  <div className="absolute top-3 right-3 bg-mangka-secondary text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                    <Sparkles size={12} /> Favorit
                  </div>
                )}
              </div>
              <div className="flex-1 flex flex-col">
                <h3 className="font-serif text-xl font-bold text-mangka-primary mb-2 group-hover:text-mangka-secondary transition-colors">
                  {item.name}
                </h3>
                <p className="text-sm text-mangka-primary/70 font-sans leading-relaxed mb-4 flex-1">
                  {item.description}
                </p>
                <Link to="/menu" className="w-full py-2 rounded-full border border-mangka-primary/20 text-mangka-primary text-sm font-bold hover:bg-mangka-primary hover:text-white transition-colors text-center block">
                  Lihat Detail
                </Link>
              </div>
            </GlassCard>
          ))}
        </div>
        
        <div className="text-center mt-12">
           <Link 
             to="/menu" 
             className="inline-block text-mangka-primary font-bold border-b-2 border-mangka-secondary pb-1 hover:text-mangka-secondary transition-colors"
           >
             Lihat Seluruh Menu
           </Link>
        </div>
      </div>
    </section>
  );
};
