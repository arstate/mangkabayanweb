import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { GlassCard } from './ui/GlassCard';
import { SmartImage } from './ui/SmartImage';

export const Story: React.FC = () => {
  return (
    <section id="story" className="py-20 relative">
      <div className="container mx-auto px-4 md:px-6">
        <GlassCard className="p-8 md:p-12 lg:p-16">
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="md:w-1/2 space-y-6">
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-mangka-primary">
                Warisan Rasa <br/> Sejak <span className="text-mangka-secondary">1996</span>
              </h2>
              <div className="w-20 h-1 bg-mangka-secondary rounded-full" />
              <p className="text-lg text-mangka-primary/80 leading-relaxed font-sans">
                Bermula dari Cirebon, <strong>Mangkabayan</strong> hadir with visi mulia untuk melestarikan resep leluhur tanah Sunda. 
                Kami percaya bahwa setiap hidangan bercerita tentang kehangatan keluarga.
              </p>
              <p className="text-lg text-mangka-primary/80 leading-relaxed font-sans">
                Di cabang Surabaya, kami memadukan keaslian bumbu tradisional dengan hasil laut terbaik. 
                Filosofi kami sederhana: menyajikan makanan yang membuat Anda merasa <em>pulang ke rumah</em>.
              </p>
              
              <div className="pt-4">
                <Link 
                  to="/about" 
                  className="inline-flex items-center gap-2 bg-mangka-primary text-white px-8 py-3 rounded-full font-bold hover:bg-mangka-secondary transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Selengkapnya Tentang Kami
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 w-full">
              <div className="grid grid-cols-2 gap-4">
                <SmartImage 
                  src="https://lh3.googleusercontent.com/pw/AP1GczOz5BJ8nKPSEevbOo9wrPFioeQYVVtOyJ8gepZGltjr1FThu95lzCIwYQAsWhk6DFV2SOImfgP0dUSYt65VGFic3WMwqQzE1zWmgBb7X2VlaIYXto4=w2400" 
                  alt="Warisan Rasa 1" 
                  className="rounded-[32px] w-full h-64 object-cover transform translate-y-8" 
                />
                <SmartImage 
                  src="https://lh3.googleusercontent.com/pw/AP1GczMuoJHQiWPIiV3bFNEIWHS_LsMOb6zdYN44eKv5hPEeLSNvSG8WaNkP3AzmiGqR0sKcj4LHv3sj4WixqxaRPEBeYPTJG-zBATHZVQqO2z6WqS1fwqs=w2400" 
                  alt="Warisan Rasa 2" 
                  className="rounded-[32px] w-full h-64 object-cover" 
                />
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </section>
  );
};