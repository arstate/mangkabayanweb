
import React from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { PromoSlider } from './components/PromoSlider';
import { Story } from './components/Story';
import { Menu } from './components/Menu';
import { Facilities } from './components/Facilities';
import { Footer } from './components/Footer';
import { FullMenuPage } from './pages/FullMenuPage';
import { AboutPage } from './pages/AboutPage';
import { ChatAI } from './components/ChatAI';

// Component for the Landing Page sections
const Home = () => {
  // Handle hash scrolling after component mounts or updates
  const location = useLocation();
  
  React.useEffect(() => {
    // Jika ada hash di URL (misal: /#menu)
    if (location.hash) {
      const targetId = location.hash.substring(1);
      
      // Beri sedikit jeda agar DOM ter-render sepenuhnya sebelum scroll
      setTimeout(() => {
        const element = document.getElementById(targetId);
        if (element) {
          // Kita gunakan perhitungan manual agar scroll tidak tertutup navbar (offset)
          const headerOffset = 100;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 500); // 500ms delay untuk memastikan halaman siap
    } else {
      // Jika kembali ke Home tanpa hash, scroll ke paling atas
      window.scrollTo(0, 0);
    }
  }, [location]);

  return (
    <>
      <Hero />
      <PromoSlider />
      <Story />
      <Menu />
      <Facilities />
      <Footer />
    </>
  );
};

function App() {
  return (
    <HashRouter>
      <main className="relative bg-[#F5F5F5] min-h-screen">
        {/* Global Background Pattern */}
        <div 
          className="fixed inset-0 pointer-events-none opacity-[0.03] z-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%233F1307' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2v-4h4v-2h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
        
        <Navbar />
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<FullMenuPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>

        {/* Floating AI Chat Assistant */}
        <ChatAI />
      </main>
    </HashRouter>
  );
}

export default App;
