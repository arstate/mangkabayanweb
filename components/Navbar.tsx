import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
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

  // Function to handle navigation
  const handleNavClick = (href: string, isHash: boolean) => {
    setIsMobileOpen(false);
    if (isHash && isHomePage) {
      // If we are already on home page, just scroll to id
      const elementId = href.replace('/#', '');
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    // If not on home page, Link component handles navigation to /#id
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'py-2' : 'py-4 md:py-6'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div 
          className={`
            relative flex items-center justify-between px-6 py-3
            bg-mangka-primary/85 backdrop-blur-md border border-white/10
            shadow-lg rounded-full transition-all duration-300
            ${isScrolled ? 'bg-mangka-primary shadow-black/20' : 'bg-mangka-primary/85'}
          `}
        >
          {/* Logo Section */}
          <Link to="/" className="flex items-center z-20">
            <img 
              src="https://lh3.googleusercontent.com/drive-storage/AJQWtBNz62XJW_8Atikr1z2r7aTv6ACDAHD8infsA7NfmxhtcRrYgQFlS8l07pbE-ggQGhw671u-D9fLWJob3pzAzHx_byIuwIMxm-nO=w800" 
              alt="Mangkabayan Surabaya" 
              // Added brightness-0 invert to make the logo white on the dark background
              className="h-12 md:h-14 w-auto object-contain brightness-0 invert"
            />
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              // Custom logic: If on homepage, use anchor tag behavior manually to avoid reload
              if (isHomePage && link.isHash) {
                 return (
                   <a
                     key={link.name}
                     href={link.href.replace('/', '')} // becomes #home
                     className="text-white hover:text-mangka-secondary font-medium text-sm transition-colors duration-200 cursor-pointer"
                   >
                     {link.name}
                   </a>
                 )
              }
              // If on other page, use Link to go to /#hash
              return (
                <Link 
                  key={link.name} 
                  to={link.href} // becomes /#home
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
            className="absolute top-20 left-4 right-4 md:hidden"
          >
            <div className="bg-mangka-primary/95 backdrop-blur-xl border border-white/20 rounded-[32px] shadow-xl p-6 flex flex-col gap-4 items-center">
              {navLinks.map((link) => {
                 // simplified mobile logic
                 if (isHomePage && link.isHash) {
                    return (
                      <a 
                        key={link.name}
                        href={link.href.replace('/', '')}
                        onClick={() => setIsMobileOpen(false)}
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