
import React from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Story } from './components/Story';
import { Menu } from './components/Menu';
import { Facilities } from './components/Facilities';
import { Footer } from './components/Footer';
import { FullMenuPage } from './pages/FullMenuPage';
import { ChatAI } from './components/ChatAI';

// Component for the Landing Page sections
const Home = () => {
  // Handle hash scrolling after component mounts or updates
  const location = useLocation();
  
  React.useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location]);

  return (
    <>
      <Hero />
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
        </Routes>

        {/* Floating AI Chat Assistant */}
        <ChatAI />
      </main>
    </HashRouter>
  );
}

export default App;
