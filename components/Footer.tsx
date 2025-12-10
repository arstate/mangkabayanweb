
import React from 'react';
import { MapPin, Phone, Instagram, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer id="location" className="bg-mangka-primary text-white pt-20 pb-10 rounded-t-[40px] mt-10">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
          
          {/* Brand */}
          <div className="space-y-6">
            <div>
              <img 
                src="https://lh3.googleusercontent.com/drive-storage/AJQWtBNcQA8v_mAc4qdd_SM028mNgL6CncLKUiFKSuFQ2_BRTYo1Lpls6l7YDxAw_iKvyi3_Xksgbx8xMZsxet7VSpOFlmixaJav_yq7Tw=w500" 
                alt="Mangkabayan Surabaya Logo" 
                className="w-48 h-auto mb-2"
                width="500"
                loading="lazy"
              />
            </div>
            <p className="text-white/70 font-sans leading-relaxed text-sm">
              Restoran keluarga dengan cita rasa khas Sunda dan hidangan laut yang otentik.
            </p>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-serif text-xl font-bold text-mangka-secondary">Kontak</h3>
            <div className="space-y-3">
              <a href="https://wa.me/628113531888" className="flex items-center gap-3 text-white/80 hover:text-white transition-colors">
                <Phone size={18} />
                <span>0811-3531-888</span>
              </a>
              <a href="mailto:info@mangkabayan.com" className="flex items-center gap-3 text-white/80 hover:text-white transition-colors">
                <Mail size={18} />
                <span>info@mangkabayan.com</span>
              </a>
              <a href="#" className="flex items-center gap-3 text-white/80 hover:text-white transition-colors">
                <Instagram size={18} />
                <span>@mangkabayan.sby</span>
              </a>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-4">
            <h3 className="font-serif text-xl font-bold text-mangka-secondary">Lokasi</h3>
            <div className="flex gap-3 text-white/80">
              <MapPin size={24} className="shrink-0 mt-1" />
              <address className="not-italic leading-relaxed">
                Jl. Ketintang Madya No.156,<br />
                Ketintang, Kec. Gayungan,<br />
                Surabaya, Jawa Timur 60231
              </address>
            </div>
          </div>

          {/* Opening Hours */}
          <div className="space-y-4">
            <h3 className="font-serif text-xl font-bold text-mangka-secondary">Jam Operasional</h3>
            <ul className="space-y-2 text-white/80 text-sm">
              <li className="flex justify-between">
                <span>Senin - Jumat</span>
                <span>10:00 - 22:00</span>
              </li>
              <li className="flex justify-between">
                <span>Sabtu - Minggu</span>
                <span>10:00 - 23:00</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/40">
          <p>&copy; {new Date().getFullYear()} Mangkabayan Surabaya. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
