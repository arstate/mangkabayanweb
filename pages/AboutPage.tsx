
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, MapPin, Award, Users } from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { SmartImage } from '../components/ui/SmartImage';

export const AboutPage: React.FC = () => {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F5F5] pt-32 pb-20 relative">
      {/* Background Pattern */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%233F1307' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        
        {/* Navigation & Header */}
        <div className="mb-12">
           <Link to="/" className="inline-flex items-center gap-2 text-mangka-primary hover:text-mangka-secondary transition-colors mb-6 font-bold group">
             <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Kembali ke Beranda
           </Link>
           <h1 className="font-serif text-4xl md:text-6xl font-bold text-mangka-primary mb-4">
             Tentang <span className="text-mangka-secondary">Kami</span>
           </h1>
           <p className="text-xl text-mangka-primary/70 font-serif max-w-2xl">
             Lebih dari sekadar restoran, Mangkabayan adalah perwujudan cinta terhadap kuliner Nusantara yang telah melintasi waktu.
           </p>
        </div>

        {/* Main Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          <div className="space-y-6">
            <h2 className="font-serif text-3xl font-bold text-mangka-primary">Awal Mula Perjalanan</h2>
            <div className="prose text-mangka-primary/80 leading-relaxed space-y-4">
              <p>
                Kisah kami bermula pada bulan <strong>Mei 1996</strong> di kota Cirebon. Didirikan oleh Bapak <strong>Robbyanto</strong>, Mangkabayan lahir dari kerinduan akan masakan Sunda yang otentik, higienis, dan dapat dinikmati oleh seluruh keluarga dalam suasana yang nyaman.
              </p>
              <p>
                Nama "Mang Kabayan" sendiri diambil dari tokoh cerita rakyat Sunda yang dikenal jujur, sederhana, dan jenaka—mencerminkan pelayanan kami yang ramah (Someah) dan bersahaja.
              </p>
              <p>
                Seiring berjalannya waktu, cita rasa khas kami mulai dikenal luas. Pada tahun 2004, kami membuka cabang pertama di Cibubur yang menjadi tonggak ekspansi kami, hingga akhirnya hadir di <strong>Surabaya</strong> untuk memanjakan lidah pecinta kuliner di Jawa Timur.
              </p>
            </div>
            
            <div className="flex gap-4 pt-4">
              <GlassCard className="flex-1 p-4 text-center bg-mangka-primary/5 border-none">
                <span className="block text-3xl font-bold text-mangka-secondary">1996</span>
                <span className="text-sm font-bold text-mangka-primary">Berdiri</span>
              </GlassCard>
              <GlassCard className="flex-1 p-4 text-center bg-mangka-primary/5 border-none">
                <span className="block text-3xl font-bold text-mangka-secondary">28+</span>
                <span className="text-sm font-bold text-mangka-primary">Tahun Pengalaman</span>
              </GlassCard>
            </div>
          </div>
          
          <div className="relative h-[500px]">
             <div className="absolute top-0 right-0 w-3/4 h-3/4 bg-orange-200 rounded-[40px] rotate-3 z-0"></div>
             <SmartImage 
               src="https://lh3.googleusercontent.com/drive-storage/AJQWtBNP15_A7aEmXe56Yz4CrTyTNvvc-i2qiSdC-JMtitqcBx4HFC3oRjyhsP7-q_ToHGXWNwCAVbofrU1SOqFr6p3zM_7xZi0-dqryJw=w1300"
               className="absolute inset-4 w-full h-full object-cover rounded-[32px] shadow-xl z-10"
               alt="Sejarah Mangkabayan"
             />
          </div>
        </div>

        {/* Vision & Mission */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
           <GlassCard className="p-8 md:col-span-2 bg-gradient-to-br from-white/80 to-orange-50/50">
              <h3 className="font-serif text-2xl font-bold text-mangka-primary mb-4 flex items-center gap-3">
                <Award className="text-mangka-secondary" /> Visi Kami
              </h3>
              <p className="text-lg text-mangka-primary/80 leading-relaxed italic">
                "Menjadi restoran Sunda & Seafood pilihan utama keluarga Indonesia yang melestarikan warisan kuliner dengan standar pelayanan dan kebersihan terbaik."
              </p>
           </GlassCard>
           
           <GlassCard className="p-8 bg-white/60">
              <h3 className="font-serif text-2xl font-bold text-mangka-primary mb-4 flex items-center gap-3">
                <Users className="text-mangka-secondary" /> Nilai Kami
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-mangka-primary font-medium"><CheckCircle size={18} className="text-mangka-secondary" /> Rasa Otentik</li>
                <li className="flex items-center gap-2 text-mangka-primary font-medium"><CheckCircle size={18} className="text-mangka-secondary" /> Pelayanan "Someah"</li>
                <li className="flex items-center gap-2 text-mangka-primary font-medium"><CheckCircle size={18} className="text-mangka-secondary" /> Bahan Baku Segar</li>
                <li className="flex items-center gap-2 text-mangka-primary font-medium"><CheckCircle size={18} className="text-mangka-secondary" /> Kebersihan Terjamin</li>
              </ul>
           </GlassCard>
        </div>

        {/* Gallery Section */}
        <div className="mb-20">
           <div className="text-center mb-10">
              <h2 className="font-serif text-3xl font-bold text-mangka-primary mb-3">Galeri Momen</h2>
              <p className="text-mangka-primary/70">Kenangan indah bersama pelanggan setia kami.</p>
           </div>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <SmartImage src="https://picsum.photos/600/600?random=20" className="w-full h-64 object-cover rounded-2xl hover:scale-105 transition-transform duration-500" alt="Gallery 1" />
              <SmartImage src="https://picsum.photos/600/600?random=21" className="w-full h-64 object-cover rounded-2xl hover:scale-105 transition-transform duration-500 md:translate-y-8" alt="Gallery 2" />
              <SmartImage src="https://picsum.photos/600/600?random=22" className="w-full h-64 object-cover rounded-2xl hover:scale-105 transition-transform duration-500" alt="Gallery 3" />
              <SmartImage src="https://picsum.photos/600/600?random=23" className="w-full h-64 object-cover rounded-2xl hover:scale-105 transition-transform duration-500 md:translate-y-8" alt="Gallery 4" />
           </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-mangka-primary text-white rounded-[40px] p-12 relative overflow-hidden">
          {/* Decorative Circles */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-mangka-secondary/20 rounded-full translate-x-1/2 translate-y-1/2"></div>
          
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="font-serif text-3xl md:text-4xl font-bold">Rasakan Kehangatan Mangkabayan</h2>
            <p className="text-white/80 text-lg">
              Kami menantikan kehadiran Anda dan keluarga untuk mencicipi hidangan terbaik kami di Surabaya.
            </p>
            <div className="flex justify-center gap-4 pt-4">
              <a href="https://wa.me/628113531888" className="bg-mangka-secondary text-white px-8 py-3 rounded-full font-bold hover:bg-white hover:text-mangka-primary transition-colors duration-300">
                Reservasi Sekarang
              </a>
              <Link to="/menu" className="bg-transparent border-2 border-white/30 text-white px-8 py-3 rounded-full font-bold hover:bg-white hover:text-mangka-primary transition-colors duration-300">
                Lihat Menu
              </Link>
            </div>
            
            <div className="flex items-center justify-center gap-2 mt-8 text-sm text-white/60">
               <MapPin size={16} />
               <span>Jl. Ketintang Madya No.156, Surabaya</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
    