
import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MousePointer2, MoveUp, MoveDown, Activity, Zap, Cpu, Target, Hand, HelpCircle } from 'lucide-react';

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
  const [isTracking, setIsTracking] = useState(false); // State baru untuk visual feedback saat tracking hilang
  const [isLeftPinching, setIsLeftPinching] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const handsRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);
  
  const lastPos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const targetPos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const scrollVelocity = useRef(0);
  const isClickProcessing = useRef(false);

  // ANIMATION LOOP: Mengontrol pergerakan fisik kursor dan scroll
  useEffect(() => {
    let animationFrame: number;
    
    const updateUI = () => {
      // OPTIMASI LAG: Meningkatkan faktor interpolasi dari 0.2 ke 0.4
      // Nilai lebih tinggi = respons lebih cepat (kurang delay), tapi sedikit lebih kasar.
      // 0.4 adalah sweet spot antara smooth dan snappy.
      const lerpFactor = 0.4; 
      
      lastPos.current.x += (targetPos.current.x - lastPos.current.x) * lerpFactor;
      lastPos.current.y += (targetPos.current.y - lastPos.current.y) * lerpFactor;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${lastPos.current.x}px, ${lastPos.current.y}px, 0)`;
      }

      // Jalankan scroll jika ada kecepatan
      if (scrollVelocity.current !== 0) {
        window.scrollBy(0, scrollVelocity.current);
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
      setGestureMode('none');
      setIsTracking(false);
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
      modelComplexity: 0, // Lite mode for zero lag
      minDetectionConfidence: 0.5, // Sedikit diturunkan agar lebih mudah mendeteksi tangan cepat
      minTrackingConfidence: 0.5,
      selfieMode: true,
    });

    const onResults = (results: any) => {
      // Optimasi performa canvas readback
      const canvasCtx = canvasRef.current?.getContext('2d', { willReadFrequently: true });
      if (!canvasCtx || !canvasRef.current) return;

      canvasCtx.save();
      canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      canvasCtx.drawImage(results.image, 0, 0, canvasRef.current.width, canvasRef.current.height);

      let rightHandFound = false;
      let leftHandFound = false;

      if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        results.multiHandLandmarks.forEach((landmarks: any, index: number) => {
          const label = results.multiHandedness[index].label; 
          const isRightHand = label === 'Right'; 
          const isLeftHand = label === 'Left';

          // Visual Monitor
          window.drawConnectors(canvasCtx, landmarks, window.HAND_CONNECTIONS, { 
            color: isRightHand ? '#FF9D3B' : '#FFFFFF', 
            lineWidth: 1 
          });

          // LOGIKA TANGAN KANAN (NAVIGATION, SCROLL, RESET)
          if (isRightHand) {
            rightHandFound = true;
            
            // Landmarks ujung jari
            const tips = [8, 12, 16, 20].map(idx => landmarks[idx]);
            const pips = [6, 10, 14, 18].map(idx => landmarks[idx]);
            
            // Deteksi jari yang terangkat
            const upFingers = tips.filter((tip, i) => tip.y < pips[i].y).length;

            // 1. Mode Genggam (0 Jari): RESET KE TENGAH
            if (upFingers === 0) {
              setGestureMode('reset');
              scrollVelocity.current = 0;
              // Force reset target ke tengah
              targetPos.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
            }
            // 2. Mode Pointer (1 Jari): MOVE
            else if (upFingers === 1) {
              setGestureMode('pointer');
              scrollVelocity.current = 0;
              // Update target posisi normal
              targetPos.current = { 
                x: landmarks[8].x * window.innerWidth, 
                y: landmarks[8].y * window.innerHeight 
              };
            }
            // 3. Mode Scroll Up (2 Jari)
            else if (upFingers === 2) {
              setGestureMode('scroll-up');
              scrollVelocity.current = -18; // Sedikit dipercepat
              // Tetap update posisi X/Y kursor saat scroll agar tidak "tertinggal"
              targetPos.current = { 
                x: landmarks[8].x * window.innerWidth, 
                y: landmarks[8].y * window.innerHeight 
              };
            }
            // 4. Mode Scroll Down (3 Jari)
            else if (upFingers === 3) {
              setGestureMode('scroll-down');
              scrollVelocity.current = 18; // Sedikit dipercepat
              // Tetap update posisi X/Y kursor saat scroll
              targetPos.current = { 
                x: landmarks[8].x * window.innerWidth, 
                y: landmarks[8].y * window.innerHeight 
              };
            }
            else {
               // 4 atau 5 jari (Open Hand/Wave) -> Stop Scroll tapi Ikuti Tangan
               setGestureMode('none');
               scrollVelocity.current = 0;
               targetPos.current = { 
                x: landmarks[8].x * window.innerWidth, 
                y: landmarks[8].y * window.innerHeight 
              };
            }
          }

          // LOGIKA TANGAN KIRI (CLICK)
          if (isLeftHand) {
            leftHandFound = true;
            const thumbTip = landmarks[4];
            const leftIndexTip = landmarks[8];
            const dist = Math.hypot(thumbTip.x - leftIndexTip.x, thumbTip.y - leftIndexTip.y);

            if (dist < 0.05) { 
              setIsLeftPinching(true);
              if (!isClickProcessing.current) {
                isClickProcessing.current = true;
                const element = document.elementFromPoint(lastPos.current.x, lastPos.current.y);
                if (element) (element as HTMLElement).click();
                setTimeout(() => { isClickProcessing.current = false; }, 400);
              }
            } else {
              setIsLeftPinching(false);
            }
          }
        });
      }

      // Handling Lost Tracking
      if (rightHandFound) {
        if (!isTracking) setIsTracking(true);
      } else {
        // Jika tangan hilang, JANGAN reset posisi kursor. 
        // Biarkan di lastPos. Hanya ubah status visual.
        if (isTracking) setIsTracking(false);
        
        setGestureMode('none');
        scrollVelocity.current = 0;
      }

      if (!leftHandFound) setIsLeftPinching(false);

      canvasCtx.restore();
    };

    hands.onResults(onResults);
    handsRef.current = hands;

    const camera = new window.Camera(videoRef.current, {
      onFrame: async () => {
        if (handsRef.current) await handsRef.current.send({ image: videoRef.current });
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
  }, [isActive, isTracking]); // Add isTracking to dependency if needed inside, but purely logical refs don't need it. Kept for safety.

  return (
    <>
      {/* 1. MONITOR TESTING */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-6 z-[9999] pointer-events-none"
          >
            <div className="bg-mangka-primary/95 text-white text-[9px] px-3 py-1.5 rounded-t-xl backdrop-blur-md flex items-center justify-between border border-white/10">
              <div className="flex items-center gap-2">
                <Cpu size={10} className="text-green-400" />
                <span className="font-bold tracking-widest uppercase">
                  {isTracking ? "TRACKING ACTIVE" : "SEARCHING HAND..."}
                </span>
              </div>
            </div>
            <div className={`w-44 aspect-video bg-black/80 rounded-b-xl border border-white/10 overflow-hidden shadow-2xl transition-colors duration-500 ${isTracking ? 'border-green-500/30' : 'border-red-500/30'}`}>
              <canvas ref={canvasRef} className="w-full h-full" width={480} height={360} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. DYNAMIC AI CURSOR */}
      <div 
        ref={cursorRef}
        className={`fixed top-0 left-0 w-12 h-12 -mt-6 -ml-6 pointer-events-none z-[10000] transition-opacity duration-300 ${isActive ? 'block' : 'hidden'} ${isTracking ? 'opacity-100' : 'opacity-40'}`}
      >
        <div className={`
          w-full h-full rounded-full border-2 flex items-center justify-center backdrop-blur-sm transition-all duration-200
          ${gestureMode === 'scroll-up' || gestureMode === 'scroll-down' ? 'border-blue-400 bg-blue-400/20 shadow-[0_0_15px_rgba(96,165,250,0.5)]' : 'border-mangka-secondary bg-mangka-secondary/10 shadow-xl'}
          ${gestureMode === 'reset' ? 'border-red-400 bg-red-400/20 scale-125' : ''}
          ${isLeftPinching ? 'scale-75 border-white bg-white/50 shadow-[0_0_20px_white]' : ''}
          ${!isTracking ? 'border-gray-400 bg-gray-500/20 grayscale' : ''}
        `}>
          {!isTracking && <HelpCircle size={20} className="text-gray-400" />}
          {isTracking && gestureMode === 'scroll-up' && <MoveUp size={20} className="text-blue-400 animate-bounce" />}
          {isTracking && gestureMode === 'scroll-down' && <MoveDown size={20} className="text-blue-400 animate-bounce" />}
          {isTracking && gestureMode === 'pointer' && <MousePointer2 size={20} className={`${isLeftPinching ? 'text-white' : 'text-mangka-secondary'}`} />}
          {isTracking && gestureMode === 'reset' && <Target size={20} className="text-red-400 rotate-45" />}
          {isTracking && gestureMode === 'none' && <MousePointer2 size={20} className="text-mangka-secondary opacity-50" />}
        </div>
        
        {/* Click Pulse */}
        <AnimatePresence>
          {isLeftPinching && isTracking && (
            <motion.div 
              initial={{ scale: 0.5, opacity: 1 }}
              animate={{ scale: 3, opacity: 0 }}
              className="absolute inset-0 rounded-full border-2 border-white"
            />
          )}
        </AnimatePresence>
      </div>

      {/* 3. CONTROL PANEL */}
      <div className="fixed bottom-24 right-6 z-[9999] flex flex-col items-end gap-3 pointer-events-none">
        <motion.div layout className="pointer-events-auto bg-white/90 backdrop-blur-xl border border-mangka-primary/10 p-2.5 rounded-[32px] shadow-2xl">
          <video ref={videoRef} className="hidden" playsInline muted />
          <button
            onClick={toggleControl}
            className={`
              w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300
              ${isActive ? 'bg-mangka-primary text-white' : 'bg-white text-mangka-primary hover:bg-mangka-primary hover:text-white border border-mangka-primary/10'}
            `}
          >
            {isActive ? <Zap size={20} className="text-mangka-secondary fill-mangka-secondary" /> : <Hand size={20} />}
          </button>
        </motion.div>

        {/* Legend Guide */}
        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-mangka-primary/95 text-white text-[10px] p-4 rounded-3xl backdrop-blur-md border border-white/10 w-48 shadow-2xl"
            >
              <div className="space-y-3 opacity-90">
                <div className="flex items-center gap-2 text-mangka-secondary font-bold border-b border-white/10 pb-2 mb-2">
                  <Activity size={12} /> GESTURE GUIDE
                </div>
                <div className="flex justify-between"><span>✊ Genggam:</span> <span className="text-red-400 font-bold">RESET</span></div>
                <div className="flex justify-between"><span>☝️ 1 Jari:</span> <span className="text-gray-400">Navigasi</span></div>
                <div className="flex justify-between"><span>✌️ 2 Jari:</span> <span className="text-blue-400 font-bold">SCROLL ATAS</span></div>
                <div className="flex justify-between"><span>🤟 3 Jari:</span> <span className="text-blue-400 font-bold">SCROLL BAWAH</span></div>
                <div className="mt-2 pt-2 border-t border-white/10">
                   <div className="flex justify-between text-mangka-secondary"><span>Tangan Kiri:</span> <span className="font-bold underline">KLIK</span></div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};
