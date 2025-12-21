import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, Filter, X, ZoomIn } from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { MenuItem } from '../types';
import { SmartImage } from '../components/ui/SmartImage';

// Data Menu Lengkap (Sesuai Permintaan)
const allMenus: MenuItem[] = [
  // Kategori: Ikan
  { id: 1, category: 'ikan', name: "Gurame Goreng Kering", description: "Ikan gurame digoreng garing hingga ke tulang, renyah dan gurih.", image: "https://images.unsplash.com/photo-1596707323565-5c1a1796be57?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
  { id: 2, category: 'ikan', name: "Gurame Bakar", description: "Menu andalan! Gurame bakar dengan bumbu kecap manis spesial yang meresap sempurna.", image: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", isRecommended: true },
  { id: 3, category: 'ikan', name: "Gurame Goreng Legian", description: "Gurame goreng disiram saus khas Legian yang kaya rempah.", image: "https://images.unsplash.com/photo-1580651315530-69c8e0026377?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
  { id: 4, category: 'ikan', name: "Gurame Asam Manis", description: "Gurame fillet goreng tepung disiram saus asam manis segar.", image: "https://images.unsplash.com/photo-1535141192574-5d4897c12636?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
  { id: 5, category: 'ikan', name: "Cumi Goreng Tepung", description: "Potongan cumi segar dibalut tepung berbumbu renyah.", image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
  { id: 6, category: 'ikan', name: "Udang Bakar Madu", description: "Udang pilihan dibakar dengan olesan madu murni.", image: "https://images.unsplash.com/photo-1625938145744-e38051524294?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", isRecommended: true },
  { id: 7, category: 'ikan', name: "Udang Telur Asin", description: "Udang goreng berbalut saus telur asin yang creamy dan gurih.", image: "https://images.unsplash.com/photo-1606850246029-dd00bd5d0e1a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },

  // Kategori: Ayam & Daging
  { id: 8, category: 'ayam_daging', name: "Ayam Goreng Kremes", description: "Ayam goreng bumbu kuning dengan taburan kremes yang melimpah.", image: "https://lh3.googleusercontent.com/pw/AP1GczMbJPFoaySUDxifRqdYb9pYdaHTCb-7IDLmxnSZAis4AexmIkR1avt6v_PJAhoyxoGVjio9OjHfDx3zaqO7ZpACndaPqSEOLTYbdVLcLaUQ6Clgqso=w2400" },
  { id: 9, category: 'ayam_daging', name: "Ayam Bakar", description: "Ayam bakar bumbu rujak dengan cita rasa manis pedas legit.", image: "https://lh3.googleusercontent.com/pw/AP1GczN1y86KP_RzPllK3Jc-Z8IcPrBymLUJV_tR4jmaaUSEFEQ3JlK2ZV9smklIJyKwUWLKvmp1UOqIkRA508haWbfvwgZueegn-xlWtRfxLNfmr_5SNkk=w2400", isRecommended: true },
  { id: 10, category: 'ayam_daging', name: "Gepuk Goreng", description: "Daging sapi gepuk empuk dengan rasa manis gurih khas Sunda.", image: "https://lh3.googleusercontent.com/pw/AP1GczMgDuq0OssUBKgVyhvhy_fhSh50DxDWkYbPXXX0StAurEHrwccIR-KBV7a32lkl2OLtI_Cv96YkIycDwV9Pohm5RDoyZGap2-Qd5woY5PPxeUT7A7o=w2400" },
  { id: 11, category: 'ayam_daging', name: "Ayam Goreng Mentega", description: "Potongan ayam digoreng dan ditumis dengan saus mentega gurih.", image: "https://lh3.googleusercontent.com/pw/AP1GczNlfaVWqfVHFcGZafnCjt-lYOOi-NpC8OBTwJj73hSFfW5YUKFISmgUm9Zg-uLocVv7cmJX2b5Mmpo0k3G7ljhxSzRwXS9re4vWUGO2TcM5Oo54-ew=w2400" },
  { id: 12, category: 'ayam_daging', name: "Sapi Lada Hitam", description: "Daging sapi iris dimasak dengan saus lada hitam pedas hangat.", image: "https://lh3.googleusercontent.com/pw/AP1GczNCNVEwmOFwKiN8EJ_8LKm_pIjaJIxQu7U2VuQKNZwyEfQ0bXzcQvLQeuPHO12ZkM1kETQve9SrVZL47ZjcLa52Z5MW-Of4ywF7pl2TWw4fNIkikOs=w2400" },
  { id: 13, category: 'ayam_daging', name: "Sapi Rica-Rica", description: "Olahan daging sapi dengan bumbu rica-rica pedas aromatik.", image: "https://lh3.googleusercontent.com/pw/AP1GczP99_CWT4iUQzlL91eswVh0wSMuoSlaSF4zkVViKghqLFBAj8lDk-IcVczIz5GlA7hFmJyFOwNbgvT6Fq5Fz0hs7ekpbLEAHqss-JoZxMPvOzaihd8=w2400" },
  { id: 32, category: 'ayam_daging', name: "Sop Buntut", description: "Sop buntut sapi yang empuk dengan kuah kaldu rempah yang kaya rasa.", image: "https://lh3.googleusercontent.com/pw/AP1GczPr2xtiGyWlfARnZTFfaUZaE1LzwkVKwlt9YttPyRfAllYoyWwolVALvOArEZhMcS5eDlNABffmWCT2ktqycnVggc-5OceIHnUjN9dLepG9Awb8kjk=w2400" },

  // Kategori: Nasi & Mie
  { id: 14, category: 'nasi_mie', name: "Nasi Timbel Komplit", description: "Nasi pulen bungkus daun pisang, tahu, tempe, sambal, lalap + Lauk Pilihan (Ayam/Gepuk/Gurame).", image: "https://lh3.googleusercontent.com/pw/AP1GczPdXv52j621XoHlgC0205DW_kTt3To_Q5kaEGVfkH95H61wcRghUbLPBjWvFaS4Ybeoou_yaoyYrBYvlkKPzL8elJTX_u64l5ZbEZMHsqFi4hTWL-I=w2400", isRecommended: true },
  { id: 15, category: 'nasi_mie', name: "Nasi Bakar Komplit", description: "Nasi berbumbu rempah dibakar daun pisang + Lauk Pilihan (Ayam/Cumi Asin/Telor Asin).", image: "https://lh3.googleusercontent.com/pw/AP1GczO14J7tWw6qFyLSshtoYDigo_WGF-3ddyMCBugvDxAm9pYkuHPfLeLSB4quWR_ti-Tv8QfRo9-Lr6w2zJSlUtFR3Ioen7ldmM1ZGoTaWOTxFeUVidw=w2400" },
  { id: 16, category: 'nasi_mie', name: "Nasi Goreng Seafood", description: "Nasi goreng spesial dengan topping seafood (Udang, Cumi, Bakso Ikan) yang melimpah.", image: "https://lh3.googleusercontent.com/pw/AP1GczOMBdRSPSLB3RTLMijfilx5NZaoFeQUS9FipW8VVRrIqzdAq3Dnmrcj242dYq2b-fpqNrIQotteSv28KrqOY4sBxlUEMP1thLqP6gLku7JQSp9YkI4=w2400" },
  { id: 17, category: 'nasi_mie', name: "Mie Goreng", description: "Mie goreng jawa dengan sayuran dan suwiran ayam.", image: "https://lh3.googleusercontent.com/pw/AP1GczMexChmxZcrr5RfinAJhXLKW1BPhYgg6HO39nxuOW8Ezmbb93-vXNrsVE7fdjMH7OMXeHgotEzjRln0ELVkAIoG0w7tDkhCyR9kpVKLG1qmDCdSEco=w2400" },

  // Kategori: Sayuran & Tumisan
  { id: 18, category: 'sayuran', name: "Kangkung Kriuk", description: "Daun kangkung digoreng tepung crispy, camilan sehat yang bikin nagih.", image: "https://images.unsplash.com/photo-1560155016-bd4879ae8f21?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
  { id: 19, category: 'sayuran', name: "Kangkung Polos", description: "Tumis kangkung bawang putih yang simpel dan segar.", image: "https://images.unsplash.com/photo-1560155016-bd4879ae8f21?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
  { id: 20, category: 'sayuran', name: "Sayur Asem", description: "Kuah segar manis asam dengan jagung, labu siam, kacang panjang.", image: "https://lh3.googleusercontent.com/pw/AP1GczNZw1eVrLS1SrKW_M2iXFq6OVKNX_V6oMgkqWOuylUBFTdQ8dbCUDPZzOoJOt5K6CYVvrIjyHL9bUwFsKXcc2Trx5-WsMdcOiOBfCfHWgiqfml8kRo=w2400" },
  { id: 21, category: 'sayuran', name: "Karedok", description: "Salad sayur mentah khas Sunda dengan bumbu kacang kencur.", image: "https://lh3.googleusercontent.com/pw/AP1GczPsCa2_GaOHKZ1--rHcdgzotoXdEUmlZyERIDkG4wjRPpJSrJNl73ZDUlfpt48B2M2S4tfw-_nIIUpERqn4ylQetLQPkTDlHGbZ9XTz32MiUUir__M=w2400" },
  { id: 22, category: 'sayuran', name: "Tumis Kangkung Balacan", description: "Kangkung tumis dengan terasi yang harum dan gurih.", image: "https://lh3.googleusercontent.com/pw/AP1GczP-xPp8KWopM_ueeUqVyVQzsAy49rdnTDjBsSxji8o2KClo8pK11U_xGrbjk6Op_CSXFnfwTQlyj8ifJ066LsmutMAWvx-yffZLlNL-i8S__6xUqZw=w2400" },

  // Kategori: Pepes & Tahu/Tempe
  { id: 23, category: 'pepes', name: "Pepes Jamur", description: "Jamur tiram berbumbu pepes dikukus dalam daun pisang.", image: "https://lh3.googleusercontent.com/pw/AP1GczO0edOiPtlZvuTfZXoBsUzEtkJkHGrTf8SW49nWdwO9sGc5-RsyfjZDZUf3mJ7ZD6G4xFuShWui2UK9yPLljXderK5_6eKiQIfBsEXfLushsNan7LA=w2400" },
  { id: 24, category: 'pepes', name: "Pepes Tahu", description: "Tahu putih lembut berbumbu rempah kukus.", image: "https://lh3.googleusercontent.com/pw/AP1GczPqJ6eEkjjoMzR9dS88c5Xw7xFmsSP6TZ3k1UmXsFH6LmqarJyraWIzLvcKluvklrOD6E2Zq8-0YmqGDDw0HO1NVeJpb8_C4z8MUEZ5mTcHje_iMZA=w2400" },
  { id: 25, category: 'pepes', name: "Tempe Goreng Tepung", description: "Tempe goreng dengan balutan tepung renyah.", image: "https://lh3.googleusercontent.com/pw/AP1GczMw7e-MpTb924_wEKn-IxoYbu3MNDYmlQFfJ7MrZunyDJZbI_iO6KvYWr4zKXtphsjPv56fbyjaa7PkLCMW4G9d38hyQRc3cZuXXwmRhkXIFNeaxxI=w2400" },

  // Kategori: Sambal
  { id: 26, category: 'sambal', name: "Sambal Dadak Spc Mang Kabayan", description: "Sambal terasi segar yang diulek dadakan, pedas nendang.", image: "https://lh3.googleusercontent.com/pw/AP1GczPCWB8FjfjBDkaWBUPsor-NwcApSjjCPKKGyOIRkrRg6cszjyZg88c-gUCWhhOezeu4ImNGqZI2Ix2LSk3gePITKMiYmnRJRsxFbvgmbYbbnc8kW0k=w2400" },
  { id: 27, category: 'sambal', name: "Sambal Mangga", description: "Sambal dengan irisan mangga muda yang asam segar.", image: "https://lh3.googleusercontent.com/pw/AP1GczPr0ovYz6_3PaQUwIOxSRr5_SZpa8hJso5cq_Bb8eAlqlrR_6WqQjVTYs6_MTPRnVYyMp76gxQHFDiy5zVDlpNBDs1ksRXlXSVmGMXDeFoBi7RTsM=w2400" },

  // Kategori: Minuman
  { id: 28, category: 'minuman', name: "Es Special Mang Kabayan", description: "Campuran kelapa muda, alpukat, nangka, dengan sirup spesial.", image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", isRecommended: true },
  { id: 29, category: 'minuman', name: "Es Teler", description: "Potongan buah segar, alpukat, nangka dengan santan dan susu.", image: "https://images.unsplash.com/photo-1546173159-315724a31696?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
  { id: 30, category: 'minuman', name: "Jus Buah Segar", description: "Pilihan jus buah asli: Alpukat, Sirsak, atau Jeruk.", image: "https://images.unsplash.com/photo-1613478223719-2ab802602423?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
  { id: 31, category: 'minuman', name: "Kelapa Muda", description: "Air kelapa muda utuh, segar dan alami.", image: "https://lh3.googleusercontent.com/pw/AP1GczOeqJfnIybCHxwY1t-dsDErQ3nLg_drzD6NCDvVdXuYW7UkZaQiHna-s-mkBfzO8oVlOcjb9UQOP4sjvP0iyhyx9nGsfauDNKb2GOvO3J83mIhskfQ=w2400" }
];

const categories = [
  { id: 'all', label: 'Semua' },
  { id: 'ikan', label: 'Ikan' },
  { id: 'ayam_daging', label: 'Ayam & Daging' },
  { id: 'nasi_mie', label: 'Nasi & Mie' },
  { id: 'sayuran', label: 'Sayuran' },
  { id: 'pepes', label: 'Pepes & Tahu' },
  { id: 'sambal', label: 'Sambal' },
  { id: 'minuman', label: 'Minuman' },
];

export const FullMenuPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

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
               Daftar Menu
             </h1>
             <p className="text-mangka-primary/70 mt-2">
               Klik pada foto menu untuk melihat detail.
             </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-10 overflow-x-auto pb-4 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`
                px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 whitespace-nowrap
                ${activeCategory === cat.id 
                  ? 'bg-mangka-secondary text-white shadow-lg' 
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
              className="group h-full flex flex-col p-4 cursor-pointer"
            >
              <div 
                className="relative overflow-hidden rounded-[24px] aspect-square mb-6"
                onClick={() => setSelectedItem(item)}
              >
                <SmartImage 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                {item.isRecommended && (
                  <div className="absolute top-3 right-3 bg-mangka-secondary text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg z-10">
                    <Sparkles size={12} /> Favorit
                  </div>
                )}
                {/* Overlay Icon on Hover */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                   <div className="bg-white/90 p-3 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform">
                      <ZoomIn size={24} className="text-mangka-primary" />
                   </div>
                </div>
              </div>
              
              <div className="flex-1 flex flex-col" onClick={() => setSelectedItem(item)}>
                <h3 className="font-serif text-xl font-bold text-mangka-primary mb-2 group-hover:text-mangka-secondary transition-colors">
                  {item.name}
                </h3>
                <p className="text-sm text-mangka-primary/70 font-sans leading-relaxed line-clamp-2">
                  {item.description}
                </p>
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

      {/* Pop-up Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative w-full max-w-3xl bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button 
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 z-20 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full backdrop-blur-sm transition-colors"
              >
                <X size={24} />
              </button>

              {/* Image Section */}
              <div className="w-full md:w-1/2 h-64 md:h-auto relative bg-gray-100">
                <SmartImage 
                  src={selectedItem.image} 
                  alt={selectedItem.name} 
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content Section */}
              <div className="w-full md:w-1/2 p-8 flex flex-col justify-center bg-white">
                <div className="mb-2">
                   <span className="inline-block px-3 py-1 bg-mangka-primary/10 text-mangka-primary text-xs font-bold rounded-full uppercase tracking-wider mb-2">
                     {categories.find(c => c.id === selectedItem.category)?.label}
                   </span>
                   {selectedItem.isRecommended && (
                      <span className="inline-block ml-2 px-3 py-1 bg-mangka-secondary/10 text-mangka-secondary text-xs font-bold rounded-full uppercase tracking-wider">
                         <Sparkles size={10} className="inline mr-1" /> Favorit
                      </span>
                   )}
                </div>
                
                <h2 className="font-serif text-3xl font-bold text-mangka-primary mb-4">
                  {selectedItem.name}
                </h2>
                <div className="w-16 h-1 bg-mangka-secondary rounded-full mb-6"></div>
                <p className="text-mangka-primary/80 font-sans text-lg leading-relaxed mb-8">
                  {selectedItem.description}
                </p>
                
                <a 
                   href="https://wa.me/628113531888" 
                   target="_blank"
                   rel="noreferrer"
                   className="inline-flex items-center justify-center gap-2 bg-mangka-primary text-white py-3 px-6 rounded-full font-bold hover:bg-mangka-secondary transition-colors"
                >
                   Pesan via WhatsApp
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};