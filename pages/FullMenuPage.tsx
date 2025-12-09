import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, Filter } from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { MenuItem } from '../types';

// Data Menu Lengkap (Mock Data)
const allMenus: MenuItem[] = [
  // Ikan
  { id: 1, category: 'ikan', name: "Gurame Bakar Madu", description: "Ikan gurame bakar dengan olesan madu spesial.", image: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", isRecommended: true, price: "Rp 95.000" },
  { id: 2, category: 'ikan', name: "Gurame Pesmol", description: "Gurame goreng dengan bumbu kuning acar segar.", image: "https://images.unsplash.com/photo-1596707323565-5c1a1796be57?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", price: "Rp 98.000" },
  { id: 3, category: 'ikan', name: "Udang Bakar Madu", description: "Udang windu bakar saus madu.", image: "https://images.unsplash.com/photo-1625938145744-e38051524294?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", price: "Rp 85.000" },
  { id: 4, category: 'ikan', name: "Cumi Goreng Tepung", description: "Cumi ring goreng tepung renyah.", image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", price: "Rp 65.000" },

  // Ayam & Daging
  { id: 5, category: 'ayam_daging', name: "Ayam Bakar Bekakak", description: "Ayam utuh bakar bumbu rujak manis pedas.", image: "https://images.unsplash.com/photo-1619860860774-1e7e17397526?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", isRecommended: true, price: "Rp 110.000" },
  { id: 6, category: 'ayam_daging', name: "Ayam Goreng Lengkuas", description: "Ayam goreng dengan taburan lengkuas gurih.", image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", price: "Rp 35.000" },
  { id: 7, category: 'ayam_daging', name: "Gepuk Daging Sapi", description: "Daging sapi empuk bumbu manis gurih.", image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", price: "Rp 40.000" },

  // Sayur & Sambal
  { id: 8, category: 'sayur', name: "Nasi Liwet Kastrol", description: "Nasi liwet komplit teri & pete (Porsi 4 Org).", image: "https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", isRecommended: true, price: "Rp 65.000" },
  { id: 9, category: 'sayur', name: "Sayur Asem", description: "Sayur asem segar khas Sunda.", image: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", price: "Rp 25.000" },
  { id: 10, category: 'sayur', name: "Karedok", description: "Sayuran mentah segar dengan bumbu kacang.", image: "https://images.unsplash.com/photo-1604152135912-04a022e23696?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", price: "Rp 28.000" },
  { id: 11, category: 'sayur', name: "Tumis Kangkung Belacan", description: "Kangkung tumis terasi pedas.", image: "https://images.unsplash.com/photo-1560155016-bd4879ae8f21?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", price: "Rp 30.000" },

  // Minuman
  { id: 12, category: 'minuman', name: "Es Kelapa Jeruk", description: "Air kelapa murni dengan perasan jeruk segar.", image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", isRecommended: true, price: "Rp 25.000" },
  { id: 13, category: 'minuman', name: "Es Cendol", description: "Cendol kenyal dengan santan dan gula aren.", image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", price: "Rp 22.000" },
  { id: 14, category: 'minuman', name: "Wedang Jahe", description: "Minuman jahe hangat menyehatkan.", image: "https://images.unsplash.com/photo-1579618218290-798c966fc296?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", price: "Rp 18.000" }
];

const categories = [
  { id: 'all', label: 'Semua Menu' },
  { id: 'ikan', label: 'Ikan & Seafood' },
  { id: 'ayam_daging', label: 'Ayam & Daging' },
  { id: 'sayur', label: 'Nasi & Sayur' },
  { id: 'minuman', label: 'Minuman' },
];

export const FullMenuPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filteredMenu = activeCategory === 'all' 
    ? allMenus 
    : allMenus.filter(item => item.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#F5F5F5] pt-32 pb-20 relative">
       {/* Background Pattern */}
       <div 
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%233F1307' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
             <Link to="/" className="inline-flex items-center gap-2 text-mangka-primary hover:text-mangka-secondary transition-colors mb-4 font-bold">
               <ArrowLeft size={20} /> Kembali ke Beranda
             </Link>
             <h1 className="font-serif text-4xl md:text-5xl font-bold text-mangka-primary">
               Daftar Menu Lengkap
             </h1>
             <p className="text-mangka-primary/70 mt-2">
               Jelajahi kelezatan autentik khas Sunda kami.
             </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-3 mb-10">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`
                px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300
                ${activeCategory === cat.id 
                  ? 'bg-mangka-secondary text-white shadow-lg scale-105' 
                  : 'bg-white border border-mangka-primary/10 text-mangka-primary hover:bg-white/80'}
              `}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredMenu.map((item, index) => (
            <GlassCard 
              key={item.id} 
              delay={index * 0.05} 
              hoverEffect={true}
              className="group h-full flex flex-col p-4"
            >
              <div className="relative overflow-hidden rounded-[24px] aspect-square mb-6">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                {item.isRecommended && (
                  <div className="absolute top-3 right-3 bg-mangka-secondary text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg z-10">
                    <Sparkles size={12} /> Favorit
                  </div>
                )}
                {/* Overlay Price on Hover */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="bg-white text-mangka-primary font-bold px-4 py-2 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    {item.price}
                  </span>
                </div>
              </div>
              <div className="flex-1 flex flex-col">
                <h3 className="font-serif text-xl font-bold text-mangka-primary mb-2">
                  {item.name}
                </h3>
                <p className="text-sm text-mangka-primary/70 font-sans leading-relaxed mb-4 flex-1">
                  {item.description}
                </p>
                <div className="mt-auto flex items-center justify-between">
                  <span className="font-bold text-mangka-primary text-lg">{item.price}</span>
                  <button className="bg-mangka-primary/5 hover:bg-mangka-primary hover:text-white p-2 rounded-full transition-colors">
                     <span className="text-xs font-bold px-2">Pesan</span>
                  </button>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

        {filteredMenu.length === 0 && (
          <div className="text-center py-20 text-mangka-primary/50">
             <Filter size={48} className="mx-auto mb-4 opacity-50" />
             <p>Menu tidak ditemukan untuk kategori ini.</p>
          </div>
        )}

      </div>
    </div>
  );
};