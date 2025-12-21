import React from 'react';
import { GlassCard } from './ui/GlassCard';
import { Car, Wifi, Crown } from 'lucide-react';
import { Facility } from '../types';

const facilities: Facility[] = [
  {
    id: 1,
    title: "Meeting Room",
    icon: "https://lh3.googleusercontent.com/pw/AP1GczO6kHj8XHin8SxqcpyAymckeV4lvo34-aSZ7QR-1QWzLWbUS-FYRnl_VLrlx1TM9-bZzyKXlDI8hT_DivQrsTYhsXU6-LpXUgUukW8mGnJcsFZm1ko=w2400",
    description: "Ruang privat ber-AC untuk meeting atau acara keluarga intim."
  },
  {
    id: 2,
    title: "Saung Lesehan",
    icon: "https://lh3.googleusercontent.com/pw/AP1GczNTte2gM2N4F_iXsCenDbtrGyCF9f2uz3M_s31VAroqcfaazjq6dQtmDEMYxxOchjd5aWv475qTENY-SdJlHl04G9Ey9g5CUnhbrofTXgUioyzw2hA=w2400",
    description: "Nikmati suasana santai khas pedesaan dengan duduk lesehan."
  },
  {
    id: 3,
    title: "Parkir Luas",
    icon: "https://lh3.googleusercontent.com/pw/AP1GczPSx4NMZ7Fs9QZe5UfSni5Ct8QDueBVD2FMXug4VlEYsifqxWsgn0z5Glb5fCCU6qKT5ntCqgRdy13aOkM21LrgPxXKvfw4hSDIhvUjP7QH-WGSyiM=w2400",
    description: "Area parkir aman dan luas untuk kenyamanan kendaraan Anda."
  },
  {
    id: 4,
    title: "Free Wi-Fi",
    icon: Wifi,
    description: "Koneksi internet cepat di seluruh area restoran."
  }
];

export const Facilities: React.FC = () => {
  return (
    <section id="facilities" className="py-20 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute -left-20 top-1/3 w-96 h-96 bg-orange-200/20 rounded-full blur-[100px]" />
      
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <div className="lg:col-span-1 space-y-6">
            <h2 className="font-serif text-4xl font-bold text-mangka-primary">
              Fasilitas & <br/> Kenyamanan
            </h2>
            <p className="text-mangka-primary/80 font-sans leading-relaxed">
              Mangkabayan Surabaya dirancang untuk mengakomodasi berbagai kebutuhan Anda, mulai dari makan malam keluarga hingga gathering perusahaan.
            </p>
            <GlassCard className="inline-flex flex-col gap-2 p-6 !bg-mangka-primary/5">
              <span className="text-4xl font-serif font-bold text-mangka-secondary">200+</span>
              <span className="text-sm font-bold uppercase tracking-wider text-mangka-primary">Kapasitas Tamu</span>
            </GlassCard>
          </div>
          
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {facilities.map((fac, idx) => (
                <GlassCard key={fac.id} delay={idx * 0.1} hoverEffect={true} className="p-6 flex items-start gap-4">
                  <div className="p-3 bg-orange-100 rounded-2xl text-mangka-secondary flex items-center justify-center w-12 h-12 shrink-0">
                    {typeof fac.icon === 'string' ? (
                      <img 
                        src={fac.icon} 
                        className="w-7 h-7 object-contain" 
                        style={{ 
                          // Filter to convert white icon to #FF9D3B
                          filter: 'invert(63%) sepia(93%) saturate(1633%) hue-rotate(340deg) brightness(101%) contrast(104%)' 
                        }} 
                        alt={fac.title} 
                      />
                    ) : (
                      <fac.icon size={24} />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-mangka-primary mb-1">{fac.title}</h3>
                    <p className="text-sm text-mangka-primary/70">{fac.description}</p>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};