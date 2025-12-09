
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

// Konfigurasi System Prompt berdasarkan Data PDF
const SYSTEM_INSTRUCTION = `
Anda adalah "Mang Asisten", asisten virtual AI untuk Restoran Mangkabayan Surabaya.
Tugas Anda adalah melayani pelanggan dengan gaya bicara: Bahasa Indonesia Formal namun Friendly (Ramah, Hangat, Seperti keluarga), dan Sopan. Cocok untuk semua kalangan (keluarga, pejabat, anak muda).
PENTING: Jawablah dengan SINGKAT, PADAT, dan JELAS. Ambil poin intinya saja. Jangan bertele-tele.

Pengetahuan Anda (Database):
1. **Identitas**: Mangkabayan Surabaya, Restoran Khas Sunda & Hidangan Laut. Tagline: "Cita Rasa Nusantara, Nikmatnya Tiada Dua".
2. **Lokasi**: Jl. Ketintang Madya No.156, Ketintang, Kec. Gayungan, Surabaya, Jawa Timur 60231.
3. **Kontak**: Reservasi WA 0811-3531-888. Email info@mangkabayan.com. IG: @mangkabayan.sby.
4. **Jam Buka**: Senin-Jumat (10:00-22:00), Sabtu-Minggu (10:00-23:00).
5. **Menu Andalan**: Gurame Bakar Madu, Nasi Liwet Kastrol (Favorit), Udang Bakar Madu, Sayur Asem, Ayam Bakar Bekakak.
6. **Harga**: Gurame ~95k-100k. Menu paket tersedia.
7. **Fasilitas**: VIP Room (AC), Saung Lesehan (Suasana pedesaan), Parkir Luas, Free Wi-Fi, Kapasitas 200+ orang.
8. **Sejarah**: Berdiri Mei 1996 di Cirebon (Pendiri: Robbyanto). Cabang pertama 2004 di Cibubur. Pernah dikunjungi Presiden SBY.
9. **Values**: Rasa Otentik, Keramahan Sunda (Someah), Warisan Lokal.

Jika ditanya hal di luar restoran, jawab sopan bahwa Anda hanya bisa membantu seputar Mangkabayan.
`;

interface Message {
  role: 'user' | 'model';
  text: string;
}

export const ChatAI: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Sampurasun! Ada yang bisa Mang Asisten bantu untuk reservasi atau info menu hari ini?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll ke bawah
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen, isLoading]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: "AIzaSyDixFiE3KbwMdqC6V3qvMzO9gkoUDdQDrI" });
      const chat = ai.chats.create({
        model: 'gemini-2.5-flash-lite-latest',
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
        },
        history: messages.map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        }))
      });

      const result = await chat.sendMessage({ message: userMsg });
      const responseText = result.text;

      setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: 'Mohon maaf, Mang Asisten sedang gangguan sinyal. Boleh diulang?' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end pointer-events-none">
      <AnimatePresence mode="wait">
        {isOpen ? (
          <motion.div
            key="chat-window"
            layoutId="chat-container"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="pointer-events-auto w-[90vw] md:w-[380px] h-[500px] flex flex-col rounded-[32px] overflow-hidden border border-white/40 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] backdrop-blur-2xl bg-white/60"
            style={{
              boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.2), inset 0 0 0 1px rgba(255, 255, 255, 0.3)",
            }}
          >
            {/* Header Glass */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-mangka-primary/10 to-mangka-secondary/10 border-b border-white/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-inner overflow-hidden border border-white/50">
                   <img 
                      src="https://lh3.googleusercontent.com/drive-storage/AJQWtBM9-6sEavzc_FRWJ6rItt5I4nhGD6PMIxUuA0KWq4XBUaq2eBoNn8x-O6j4d69_1ZE5JqzHJo3Cw8FTcse-V_5QFD7CoulGq5pX=w200" 
                      alt="Logo Mangkabayan"
                      className="w-full h-full object-cover"
                   />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-mangka-primary">Mang Asisten</h3>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"/>
                    <span className="text-xs text-mangka-primary/60 font-sans">Online</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-black/5 rounded-full transition-colors text-mangka-primary/70"
              >
                <X size={20} />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-mangka-primary/20 scrollbar-track-transparent">
              {messages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`
                      max-w-[80%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm
                      ${msg.role === 'user' 
                        ? 'bg-mangka-primary text-white rounded-br-none' 
                        : 'bg-white/80 text-mangka-primary rounded-bl-none border border-white/50'}
                    `}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/80 p-3 rounded-2xl rounded-bl-none border border-white/50 flex gap-1 items-center">
                    <span className="w-2 h-2 bg-mangka-secondary/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}/>
                    <span className="w-2 h-2 bg-mangka-secondary/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}/>
                    <span className="w-2 h-2 bg-mangka-secondary/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}/>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white/40 border-t border-white/30">
              <div className="flex items-center gap-2 bg-white/70 backdrop-blur-md rounded-full px-4 py-2 border border-white/50 shadow-inner focus-within:ring-2 focus-within:ring-mangka-secondary/50 transition-all">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Tanya menu atau reservasi..."
                  className="flex-1 bg-transparent border-none outline-none text-mangka-primary placeholder:text-mangka-primary/40 text-sm py-1"
                />
                <button 
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="p-2 bg-mangka-secondary text-white rounded-full hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-orange-500/30"
                >
                  <Send size={16} />
                </button>
              </div>
              <div className="text-center mt-2">
                <p className="text-[10px] text-mangka-primary/40 font-sans flex items-center justify-center gap-1">
                  <Sparkles size={10} /> Powered by Gemini AI
                </p>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.button
            key="chat-button"
            layoutId="chat-container"
            onClick={() => setIsOpen(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="pointer-events-auto group relative flex items-center justify-center w-16 h-16 rounded-full bg-white/40 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_0_rgba(31,38,135,0.25)] text-mangka-primary overflow-hidden"
            style={{
               boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.2), inset 0 0 0 1px rgba(255, 255, 255, 0.4)"
            }}
          >
            {/* Gloss Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-transparent to-transparent opacity-50 pointer-events-none" />
            
            <div className="relative z-10 bg-mangka-secondary w-12 h-12 rounded-full flex items-center justify-center shadow-lg group-hover:bg-mangka-primary transition-colors duration-300">
               <MessageCircle className="text-white w-6 h-6" />
            </div>
            
            {/* Notification Dot */}
            <span className="absolute top-3 right-3 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};
    