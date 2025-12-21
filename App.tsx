
import React, { useState, useEffect, useRef } from 'react';
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
import { HandControl } from './components/HandControl';

// Custom Easing Function: Ease-In-Out Cubic (Mulus & Mewah)
const easeInOutCubic = (t: number): number => {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};

// Global variabel untuk melacak jika ada scroll yang sedang berjalan
let isScrolling = false;

const smoothScrollTo = (targetY: number, duration: number = 1800) => {
  if (isScrolling) return; // Cegah double trigger
  
  isScrolling = true;
  const startY = window.pageYOffset;
  const difference = targetY - startY;
  let startTime: number | null = null;

  const step = (currentTime: number) => {
    if (!startTime) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
    
    const easedProgress = easeInOutCubic(progress);
    window.scrollTo(0, startY + (difference * easedProgress));

    if (timeElapsed < duration) {
      window.requestAnimationFrame(step);
    } else {
      isScrolling = false;
    }
  };

  window.requestAnimationFrame(step);
};

const Home = () => {
  const location = useLocation();
  const autoScrollRef = useRef<boolean>(true);
  const timeoutIdRef = useRef<number | null>(null);
  
  // Urutan navigasi otomatis (Looping)
  const sections = ['home', 'story', 'menu', 'facilities'];

  useEffect(() => {
    const stopAutoScroll = () => {
      if (autoScrollRef.current) {
        autoScrollRef.current = false;
        if (timeoutIdRef.current) {
          clearTimeout(timeoutIdRef.current);
          timeoutIdRef.current = null;
        }
      }
    };

    const events = ['wheel', 'touchstart', 'mousedown', 'keydown', 'pointerdown'];
    events.forEach(event => window.addEventListener(event, stopAutoScroll, { passive: true }));

    return () => {
      events.forEach(event => window.removeEventListener(event, stopAutoScroll));
      if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
    };
  }, []);

  useEffect(() => {
    if (!location.hash && autoScrollRef.current) {
      const runSequence = (index: number) => {
        if (!autoScrollRef.current) return;

        const currentIndex = index % sections.length;
        const targetId = sections[currentIndex];
        const element = document.getElementById(targetId);
        
        if (element) {
          const headerOffset = 85; 
          const rect = element.getBoundingClientRect();
          const targetY = rect.top + window.pageYOffset - headerOffset;

          smoothScrollTo(targetY, 2000);

          timeoutIdRef.current = window.setTimeout(() => {
            runSequence(currentIndex + 1);
          }, 6000);
        } else {
          runSequence(currentIndex + 1);
        }
      };

      timeoutIdRef.current = window.setTimeout(() => {
        runSequence(1);
      }, 4000);
    }
  }, []);

  useEffect(() => {
    if (location.hash) {
      autoScrollRef.current = false;
      const targetId = location.hash.substring(1);
      
      setTimeout(() => {
        const element = document.getElementById(targetId);
        if (element) {
          const headerOffset = 100;
          const rect = element.getBoundingClientRect();
          const targetY = rect.top + window.pageYOffset - headerOffset;
          smoothScrollTo(targetY, 1500);
        }
      }, 100);
    }
  }, [location.hash]);

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

        <ChatAI />
        <HandControl />
      </main>
    </HashRouter>
  );
}

export default App;
