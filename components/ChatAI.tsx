
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { SmartImage } from './ui/SmartImage';

const SYSTEM_INSTRUCTION = `
Anda adalah "Mang Asisten", asisten virtual AI untuk Restoran Mangkabayan Surabaya.
Gaya bicara Anda sopan, ramah (Someah), dan sangat membantu.
Jawablah dengan SINGKAT, PADAT, dan JELAS.
Gunakan bahasa Indonesia yang baik, sesekali gunakan istilah Sunda seperti "Wilujeng Sumping", "Mangga", atau "Hatur Nuhun" untuk memberikan kesan otentik.

Informasi penting untuk Anda:
- Lokasi: Jl. Ketintang Madya No.156, Ketintang, Kec. Gayungan, Surabaya.
- Spesialisasi: Hidangan otentik Sunda dan Seafood Segar.
- Menu Favorit: Gurame Bakar, Nasi Liwet Kastrol, Udang Bakar Madu, Karedok.
- Fasilitas: Ruang Meeting Private AC, Saung Lesehan, Parkir Sangat Luas, Free Wi-Fi.
- Jam Operasional: 10:00 - 22:00 (Weekdays), 10:00 - 23:00 (Weekend).
- Kontak Reservasi: WhatsApp 0811-3531-888.
`;

interface Message {
  role: 'user' | 'model';
  text: string;
}

export const ChatAI: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Sampurasun! Wilujeng sumping di Mangkabayan Surabaya. Ada yang bisa Mang Asisten bantu untuk info menu atau reservasi hari ini?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      // Inisialisasi API Key dari process.env.API_KEY yang sudah diset di Vercel
      const apiKey = process.env.API_KEY;
      
      if (!apiKey) {
        throw new Error("API Key tidak ditemukan. Pastikan sudah diset di Vercel Environment Variables.");
      }

      const ai = new GoogleGenAI({ apiKey });
      
      // Menggunakan model gemini-2.5-flash sesuai permintaan user
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ role: 'user', parts: [{ text: userMsg }] }],
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.7,
          topP: 0.9,
        }
      });

      const text = response.text;
      if (text) {
        setMessages(prev => [...prev, { role: 'model', text }]);
      } else {
        throw new Error("Respon AI kosong");
      }
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { 
        role: 'model', 
        text: 'Hampura, Mang Asisten sedang mengalami sedikit kendala teknis. Silakan hubungi WhatsApp kami di 0811-3531-888 untuk reservasi langsung.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end pointer-events-none">
      <AnimatePresence mode="wait">
        {isOpen ? (
          <motion.div
            key="chat-window"
            initial={{ opacity: 0, scale: 0.9, y: 30, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.9, y: 30, filter: 'blur(10px)' }}
            className="pointer-events-auto w-[90vw] md:w-[400px] h-[580px] flex flex-col rounded-[32px] overflow-hidden border border-white/40 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.4)] backdrop-blur-3xl bg-white/80"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 bg-gradient-to-r from-mangka-primary/10 to-mangka-secondary/10 border-b border-white/20">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-white overflow-hidden border-2 border-mangka-secondary/20 shadow-inner">
                     <SmartImage 
                        src="https://lh3.googleusercontent.com/pw/AP1GczOBZrDaNNLefC1q0tty73jfvBxgFbqteaw0PP6KZJwGPb1MNPGLKihXG1yxkxWoKPeIBLcKJ-kWcLXaa0T73Vfrl0y2ZjonMdpCLNPPbOiNLVdpkgg=w2400" 
                        alt="Logo Mangkabayan"
                        className="w-full h-full object-cover"
                     />
                  </div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                <div>
                  <h3 className="font-serif font-bold text-mangka-primary leading-tight">Mang Asisten</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-[10px] text-mangka-primary/50 font-bold tracking-wider uppercase">Online</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="p-2 text-mangka-primary/50 hover:text-mangka-primary hover:bg-white/50 rounded-full transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Chat Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-hide">
              {messages.map((msg, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`
                    max-w-[85%] p-4 rounded-2xl text-[13px] leading-relaxed shadow-sm
                    ${msg.role === 'user' 
                      ? 'bg-mangka-primary text-white rounded-tr-none' 
                      : 'bg-white text-mangka-primary border border-white/60 rounded-tl-none'}
                  `}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/40 backdrop-blur-sm p-3 rounded-2xl rounded-tl-none border border-white/60 flex items-center gap-2">
                    <Loader2 size={14} className="animate-spin text-mangka-secondary" />
                    <span className="text-[11px] text-mangka-primary/60 italic">Mang Asisten sedang memproses...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Footer */}
            <div className="p-5 bg-white/30 border-t border-white/20">
              <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md rounded-full px-5 py-2.5 border border-mangka-primary/10 shadow-inner focus-within:ring-2 focus-within:ring-mangka-secondary/20 transition-all">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ketik pesan..."
                  className="flex-1 bg-transparent border-none outline-none text-sm text-mangka-primary placeholder:text-mangka-primary/30"
                />
                <button 
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className={`
                    p-2 rounded-full transition-all
                    ${isLoading || !input.trim() 
                      ? 'text-mangka-primary/10 bg-mangka-primary/5' 
                      : 'bg-mangka-secondary text-white shadow-lg hover:scale-110 active:scale-95'}
                  `}
                >
                  <Send size={18} />
                </button>
              </div>
              <p className="text-center text-[9px] text-mangka-primary/30 mt-3 font-bold uppercase tracking-widest">
                Protected by Gemini AI • Mang Asisten v3.1
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.button
            key="chat-button"
            onClick={() => setIsOpen(true)}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            className="pointer-events-auto relative flex items-center justify-center group"
          >
            <div className="absolute inset-0 bg-mangka-secondary/30 rounded-full blur-2xl group-hover:bg-mangka-secondary/50 transition-all"></div>
            
            <div className="relative w-18 h-18 md:w-20 md:h-20 flex items-center justify-center rounded-full bg-white/30 backdrop-blur-xl border border-white/50 shadow-2xl">
               <div className="bg-mangka-primary w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center shadow-xl group-hover:bg-mangka-secondary transition-all duration-500 overflow-hidden">
                  <MessageCircle className="text-white w-7 h-7 md:w-8 md:h-8" />
               </div>
            </div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="absolute right-full mr-4 bg-white/90 backdrop-blur-lg px-4 py-2 rounded-2xl shadow-xl border border-white/50 whitespace-nowrap text-xs font-bold text-mangka-primary pointer-events-none hidden md:block"
            >
              Tanya Mang Asisten? 👋
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};
