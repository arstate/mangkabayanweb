
import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { SmartImage } from './ui/SmartImage';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      // Ubah state scroll ketika melewati 20px
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Beranda', href: '/#home', isHash: true },
    { name: 'Tentang Kami', href: '/#story', isHash: true },
    { name: 'Menu', href: '/#menu', isHash: true },
    { name: 'Fasilitas', href: '/#facilities', isHash: true },
    { name: 'Lokasi', href: '/#location', isHash: true },
  ];

  // Function to handle navigation and smooth scrolling
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement> | React.MouseEvent<HTMLButtonElement>, href: string, isHash: boolean) => {
    setIsMobileOpen(false);

    if (isHash) {
      const targetId = href.replace('/#', '');
      
      if (isHomePage) {
        // Jika sudah di homepage, cegah navigasi default dan lakukan smooth scroll manual
        e.preventDefault();
        const element = document.getElementById(targetId);
        if (element) {
          // Offset sedikit untuk header
          const headerOffset = 100;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
          });
          
          // Update URL hash tanpa jump
          window.history.pushState(null, '', href);
        }
      } else {
        // Jika di halaman lain (misal /menu), paksa navigasi menggunakan router
        // App.tsx akan menangani scrolling setelah halaman Home dimuat
        e.preventDefault();
        navigate(href);
      }
    }
  };

  // WhatsApp Icon Component
  const WhatsAppIcon = ({ className }: { className?: string }) => (
    <svg 
      viewBox="0 0 24 24" 
      width="18" 
      height="18" 
      fill="currentColor" 
      className={className}
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out`}
    >
      {/* Wrapper untuk mengatur padding container luar */}
      <div className={`transition-all duration-500 ease-in-out ${
        isScrolled 
          ? 'px-4 md:px-6 pt-6 pb-2' // Floating: turun sedikit (pt-6)
          : 'px-0 py-0' // Top: Full
      }`}>
        <div 
          className={`
            relative flex items-center justify-between px-6 py-3
            border border-white/10 transition-all duration-500 ease-in-out
            ${isScrolled 
              ? 'bg-mangka-primary/80 backdrop-blur-md shadow-lg rounded-full' // Floating Pill: Lebih transparan (/80)
              : 'bg-mangka-primary/85 backdrop-blur-sm shadow-none rounded-none rounded-b-[40px] md:py-5' // Full Width Top
            }
          `}
        >
          {/* Logo Section */}
          <Link to="/" onClick={(e) => isHomePage && window.scrollTo({top: 0, behavior: 'smooth'})} className="flex items-center z-20">
            <SmartImage 
              src="https://lh3.googleusercontent.com/drive-storage/AJQWtBNQaB8jsAj2zl5FMhWL8LJ58OkJlfCalJpdzs1qzfUEYCCLu9xq2gZIthdPYRqqLcmaDaMj89WDxJRdMRi9JnytTIOdTYhIbtrm=w800" 
              alt="Mangkabayan Surabaya" 
              className="h-12 md:h-14 w-auto object-contain"
            />
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              // Jika ini link hash (#)
              if (link.isHash) {
                 return (
                   <a
                     key={link.name}
                     href={link.href}
                     onClick={(e) => handleNavClick(e, link.href, true)}
                     className="text-white hover:text-mangka-secondary font-medium text-sm transition-colors duration-200 cursor-pointer"
                   >
                     {link.name}
                   </a>
                 )
              }
              // Link biasa (non-hash)
              return (
                <Link 
                  key={link.name} 
                  to={link.href}
                  className="text-white hover:text-mangka-secondary font-medium text-sm transition-colors duration-200"
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <a 
              href="https://wa.me/628113531888" 
              target="_blank" 
              rel="noreferrer"
              className="
                flex items-center gap-2
                bg-[#25D366] text-white 
                px-6 py-2.5 rounded-full 
                font-bold text-sm
                hover:bg-[#128C7E] hover:shadow-lg hover:scale-105
                transition-all duration-300
              "
            >
              <WhatsAppIcon className="fill-white" />
              <span>Reservasi</span>
            </a>
          </div>

          {/* Mobile Toggle */}
          <button 
            className="md:hidden z-20 text-white p-1"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
          >
            {isMobileOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`absolute left-4 right-4 md:hidden ${isScrolled ? 'top-24' : 'top-24'}`}
          >
            <div className="bg-mangka-primary/95 backdrop-blur-xl border border-white/20 rounded-[32px] shadow-xl p-6 flex flex-col gap-4 items-center">
              {navLinks.map((link) => {
                 if (link.isHash) {
                    return (
                      <a 
                        key={link.name}
                        href={link.href}
                        onClick={(e) => handleNavClick(e, link.href, true)}
                        className="text-white text-lg font-serif font-medium hover:text-mangka-secondary transition-colors"
                      >
                         {link.name}
                      </a>
                    )
                 }
                 return (
                    <Link 
                      key={link.name} 
                      to={link.href}
                      onClick={() => setIsMobileOpen(false)}
                      className="text-white text-lg font-serif font-medium hover:text-mangka-secondary transition-colors"
                    >
                      {link.name}
                    </Link>
                 )
              })}
              <a 
                href="https://wa.me/628113531888" 
                className="bg-[#25D366] text-white px-8 py-3 rounded-full font-bold w-full text-center mt-2 flex items-center justify-center gap-2"
              >
                <WhatsAppIcon className="fill-white" />
                Reservasi Sekarang
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
