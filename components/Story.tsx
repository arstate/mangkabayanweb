import React from 'react';
import { GlassCard } from './ui/GlassCard';

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
                Bermula dari Cirebon, <strong>Mangkabayan</strong> hadir dengan visi mulia untuk melestarikan resep leluhur tanah Sunda. 
                Kami percaya bahwa setiap hidangan bercerita tentang kehangatan keluarga.
              </p>
              <p className="text-lg text-mangka-primary/80 leading-relaxed font-sans">
                Di cabang Surabaya, kami memadukan keaslian bumbu tradisional dengan hasil laut terbaik. 
                Filosofi kami sederhana: menyajikan makanan yang membuat Anda merasa <em>pulang ke rumah</em>.
              </p>
            </div>
            <div className="md:w-1/2 w-full">
              <div className="grid grid-cols-2 gap-4">
                <img 
                  src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                  alt="Interior Restoran" 
                  className="rounded-[32px] w-full h-64 object-cover transform translate-y-8" 
                />
                <img 
                  src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                  alt="Suasana Makan" 
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