
import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MousePointer2, MoveUp, MoveDown, Activity, Zap, Cpu, Target, Hand, AlertCircle } from 'lucide-react';

declare global {
  interface Window {
    Hands: any;
    Camera: any;
    drawConnectors: any;
    drawLandmarks: any;
    HAND_CONNECTIONS: any;
  }
}

export const HandControl: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [gestureMode, setGestureMode] = useState<'pointer' | 'scroll-up' | 'scroll-down' | 'reset' | 'none'>('none');
  const [isLeftPinching, setIsLeftPinching] = useState(false);
  const [isHandVisible, setIsHandVisible] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const handsRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);
  
  // Posisi kursor dengan sistem smoothing
  const currentPos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const targetPos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const scrollVelocity = useRef(0);
  const isClickProcessing = useRef(false);

  // ANIMATION LOOP: High-Performance Smooth Movement
  useEffect(() => {
    let animationFrame: number;
    
    const updateUI = () => {
      // Mewah & Mulus: Menggunakan Lerp (Linear Interpolation) 0.15 untuk rasa 'fluid'
      const lerpFactor = 0.15;
      currentPos.current.x += (targetPos.current.x - currentPos.current.x) * lerpFactor;
      currentPos.current.y += (targetPos.current.y - currentPos.current.y) * lerpFactor;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${currentPos.current.x}px, ${currentPos.current.y}px, 0)`;
      }

      if (scrollVelocity.current !== 0) {
        window.scrollBy({ top: scrollVelocity.current, behavior: 'auto' });
      }

      animationFrame = requestAnimationFrame(updateUI);
    };

    if (isActive) {
      animationFrame = requestAnimationFrame(updateUI);
    }
    return () => cancelAnimationFrame(animationFrame);
  }, [isActive]);

  const toggleControl = async () => {
    if (!isActive) {
      setIsActive(true);
    } else {
      if (cameraRef.current) cameraRef.current.stop();
      setIsActive(false);
      setIsHandVisible(false);
      setGestureMode('none');
      scrollVelocity.current = 0;
    }
  };

  useEffect(() => {
    if (!isActive || !videoRef.current || !canvasRef.current) return;

    const hands = new window.Hands({
      locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });

    hands.setOptions({
      maxNumHands: 2,
      modelComplexity: 0, // Lite model for speed
      minDetectionConfidence: 0.55, // Sedikit diturunkan agar lebih stabil saat tangan bergerak cepat
      minTrackingConfidence: 0.55,
      selfieMode: true,
    });

    const onResults = (results: any) => {
      const canvasCtx = canvasRef.current?.getContext('2d');
      if (!canvasCtx || !canvasRef.current) return;

      canvasCtx.save();
      canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      
      // Matikan render video di canvas monitor jika tidak diperlukan untuk performa maksimal
      // Namun kita tetap gambar landmark tipis untuk feedback
      
      let rightHandFound = false;
      let leftHandFound = false;

      if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        setIsHandVisible(true);
        results.multiHandLandmarks.forEach((landmarks: any, index: number) => {
          const label = results.multiHandedness[index].label; 
          const isRightHand = label === 'Right'; 
          const isLeftHand = label === 'Left';

          // Render landmark saja (Tanpa video background agar ringan)
          window.drawConnectors(canvasCtx, landmarks, window.HAND_CONNECTIONS, { 
            color: isRightHand ? '#FF9D3B' : '#E5E7EB', 
            lineWidth: 2 
          });

          if (isRightHand) {
            rightHandFound = true;
            
            // Perhitungan Jari (Optimasi deteksi)
            const tips = [8, 12, 16, 20];
            const pips = [6, 10, 14, 18];
            let upFingers = 0;
            
            tips.forEach((tipIdx, i) => {
              if (landmarks[tipIdx].y < landmarks[pips[i]].y) upFingers++;
            });

            // Update Target Posisi (EMA Smoothing)
            // Menggunakan landmark jari telunjuk (8)
            const rawX = landmarks[8].x * window.innerWidth;
            const rawY = landmarks[8].y * window.innerHeight;
            
            targetPos.current = { x: rawX, y: rawY };

            // Gesture Mapping
            if (upFingers === 0) {
              setGestureMode('reset');
              scrollVelocity.current = 0;
            } else if (upFingers === 1) {
              setGestureMode('pointer');
              scrollVelocity.current = 0;
            } else if (upFingers === 2) {
              setGestureMode('scroll-up');
              scrollVelocity.current = -12;
            } else if (upFingers >= 3) {
              setGestureMode('scroll-down');
              scrollVelocity.current = 12;
            }
          }

          if (isLeftHand) {
            leftHandFound = true;
            const thumbTip = landmarks[4];
            const indexTip = landmarks[8];
            const dist = Math.hypot(thumbTip.x - indexTip.x, thumbTip.y - indexTip.y);

            // Toleransi klik ditingkatkan sedikit
            if (dist < 0.06) { 
              setIsLeftPinching(true);
              if (!isClickProcessing.current) {
                isClickProcessing.current = true;
                const element = document.elementFromPoint(currentPos.current.x, currentPos.current.y);
                if (element) (element as HTMLElement).click();
                setTimeout(() => { isClickProcessing.current = false; }, 350);
              }
            } else {
              setIsLeftPinching(false);
            }
          }
        });
      } else {
        // Tangan tidak terdeteksi
        setIsHandVisible(false);
        setGestureMode('none');
        scrollVelocity.current = 0;
        // Persistence: targetPos TIDAK diubah, kursor tetap di tempat terakhir
      }

      canvasCtx.restore();
    };

    hands.onResults(onResults);
    handsRef.current = hands;

    const camera = new window.Camera(videoRef.current, {
      onFrame: async () => {
        if (handsRef.current) {
          await handsRef.current.send({ image: videoRef.current });
        }
      },
      width: 480,
      height: 360,
    });
    camera.start();
    cameraRef.current = camera;

    return () => {
      camera.stop();
      hands.close();
    };
  }, [isActive]);

  return (
    <>
      {/* MONITORING INTERFACE */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="fixed bottom-6 left-6 z-[9999] pointer-events-none group"
          >
            <div className="bg-mangka-primary/90 text-white text-[10px] px-4 py-2 rounded-t-2xl backdrop-blur-xl border border-white/10 flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${isHandVisible ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
              <span className="font-bold tracking-widest uppercase">AI HAND ENGINE</span>
            </div>
            <div className="w-48 aspect-video bg-black/40 rounded-b-2xl border border-white/10 overflow-hidden shadow-2xl relative">
              {!isHandVisible && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 text-white/60 text-[10px] gap-2">
                  <AlertCircle size={16} />
                  <span>Tangan Tidak Terdeteksi</span>
                </div>
              )}
              <canvas ref={canvasRef} className="w-full h-full object-cover" width={480} height={360} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LUXURY AI CURSOR */}
      <div 
        ref={cursorRef}
        className={`fixed top-0 left-0 w-14 h-14 -mt-7 -ml-7 pointer-events-none z-[10000] transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className={`
          relative w-full h-full rounded-full border-2 flex items-center justify-center backdrop-blur-[2px] transition-all duration-300
          ${!isHandVisible ? 'scale-75 opacity-40 border-gray-400' : 'scale-100 border-mangka-secondary'}
          ${gestureMode === 'scroll-up' || gestureMode === 'scroll-down' ? 'border-blue-400 bg-blue-400/10 shadow-[0_0_20px_rgba(96,165,250,0.4)]' : 'bg-mangka-secondary/5 shadow-xl'}
          ${isLeftPinching ? 'scale-90 border-white bg-white/40 shadow-[0_0_30px_white]' : ''}
        `}>
          {/* Central Dot */}
          <div className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${isHandVisible ? 'bg-mangka-secondary' : 'bg-gray-400'}`} />
          
          {/* Dynamic Icons */}
          <div className="absolute inset-0 flex items-center justify-center">
            {gestureMode === 'scroll-up' && <MoveUp size={18} className="text-blue-400 animate-bounce" />}
            {gestureMode === 'scroll-down' && <MoveDown size={18} className="text-blue-400 animate-bounce" />}
            {gestureMode === 'pointer' && isHandVisible && <MousePointer2 size={16} className={`transition-colors ${isLeftPinching ? 'text-white' : 'text-mangka-secondary'}`} />}
            {gestureMode === 'reset' && <Target size={18} className="text-red-400" />}
          </div>
          
          {/* Lost Signal Pulse */}
          {!isHandVisible && isActive && (
             <motion.div 
               animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
               transition={{ repeat: Infinity, duration: 2 }}
               className="absolute inset-0 rounded-full border border-white/20"
             />
          )}
        </div>
      </div>

      {/* FLOATING ACTION PANEL */}
      <div className="fixed bottom-24 right-6 z-[9999] flex flex-col items-end gap-4 pointer-events-none">
        <motion.div 
          layout 
          className="pointer-events-auto bg-white/80 backdrop-blur-2xl border border-white/40 p-3 rounded-[35px] shadow-[0_20px_50px_rgba(0,0,0,0.1)]"
        >
          <video ref={videoRef} className="hidden" playsInline muted />
          <button
            onClick={toggleControl}
            className={`
              w-14 h-14 rounded-full flex flex-col items-center justify-center transition-all duration-500
              ${isActive ? 'bg-mangka-primary text-white scale-110' : 'bg-white text-mangka-primary hover:bg-mangka-primary hover:text-white border border-mangka-primary/10'}
            `}
          >
            {isActive ? <Zap size={22} className="text-mangka-secondary fill-mangka-secondary animate-pulse" /> : <Hand size={22} />}
            <span className="text-[7px] font-bold mt-1 uppercase tracking-tighter">
              {isActive ? 'Live' : 'Hand'}
            </span>
          </button>
        </motion.div>

        {/* ELEGANT GESTURE GUIDE */}
        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ opacity: 0, x: 20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.9 }}
              className="bg-mangka-primary/95 text-white/90 text-[10px] p-5 rounded-[30px] backdrop-blur-xl border border-white/10 w-52 shadow-2xl"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-mangka-secondary font-bold border-b border-white/5 pb-2 mb-2 tracking-widest uppercase">
                  <Activity size={12} /> Intelligence
                </div>
                <div className="flex justify-between items-center group">
                  <span className="text-white/60">Navigasi:</span> 
                  <span className="bg-white/10 px-2 py-0.5 rounded-md font-mono">☝️ Jari</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/60">Klik Menu:</span> 
                  <span className="text-mangka-secondary font-bold">👌 Pinch L</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/60">Scroll Up:</span> 
                  <span className="text-blue-400 font-bold">✌️ Jari</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/60">Scroll Down:</span> 
                  <span className="text-blue-400 font-bold">🤟 Jari</span>
                </div>
                <div className="mt-3 pt-3 border-t border-white/5 text-[9px] text-center italic text-white/40">
                  "Gerakkan tangan dengan tenang untuk hasil maksimal"
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};
