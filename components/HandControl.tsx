
import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MousePointer2, MoveUp, MoveDown, Activity, Zap, Target, Hand, Cpu } from 'lucide-react';

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
  
  // High-performance movement references
  const currentPos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const targetPos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const scrollVelocity = useRef(0);
  const isClickProcessing = useRef(false);

  // LOOP UTAMA: Pergerakan Kursor & Scroll
  useEffect(() => {
    let animationFrame: number;
    
    const updateUI = () => {
      // Smoothing kursor dengan Lerp (Linear Interpolation)
      const lerpFactor = 0.18;
      currentPos.current.x += (targetPos.current.x - currentPos.current.x) * lerpFactor;
      currentPos.current.y += (targetPos.current.y - currentPos.current.y) * lerpFactor;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${currentPos.current.x}px, ${currentPos.current.y}px, 0)`;
      }

      // Scroll Dinamis: Kecepatan tinggi (45px per frame)
      if (scrollVelocity.current !== 0) {
        window.scrollBy({
          top: scrollVelocity.current,
          behavior: 'auto'
        });
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
      modelComplexity: 0, // Mode tercepat (Lite)
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
      selfieMode: true,
    });

    const onResults = (results: any) => {
      const canvasCtx = canvasRef.current?.getContext('2d');
      if (!canvasCtx || !canvasRef.current) return;

      // MODE GELAP: Membersihkan canvas dengan warna hitam pekat
      canvasCtx.save();
      canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      canvasCtx.fillStyle = '#000000';
      canvasCtx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      
      // GRID DEKORATIF (Radar style)
      canvasCtx.strokeStyle = 'rgba(255, 157, 59, 0.05)';
      canvasCtx.lineWidth = 1;
      for(let i=0; i<canvasRef.current.width; i+=20) {
        canvasCtx.beginPath(); canvasCtx.moveTo(i, 0); canvasCtx.lineTo(i, canvasRef.current.height); canvasCtx.stroke();
      }
      for(let j=0; j<canvasRef.current.height; j+=20) {
        canvasCtx.beginPath(); canvasCtx.moveTo(0, j); canvasCtx.lineTo(canvasRef.current.width, j); canvasCtx.stroke();
      }

      let rightHandFound = false;
      let leftHandFound = false;

      if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        setIsHandVisible(true);
        results.multiHandLandmarks.forEach((landmarks: any, index: number) => {
          const label = results.multiHandedness[index].label; 
          const isRightHand = label === 'Right'; 
          const isLeftHand = label === 'Left';

          // HANYA GAMBAR SKELETON (Tanpa Video Preview)
          window.drawConnectors(canvasCtx, landmarks, window.HAND_CONNECTIONS, { 
            color: isRightHand ? '#FF9D3B' : '#FFFFFF', 
            lineWidth: 2 
          });
          window.drawLandmarks(canvasCtx, landmarks, {
            color: isRightHand ? '#FF9D3B' : '#FFFFFF',
            lineWidth: 1,
            radius: 2
          });

          // LOGIKA NAVIGASI (Tangan Kanan)
          if (isRightHand) {
            rightHandFound = true;
            
            const tips = [8, 12, 16, 20];
            const pips = [6, 10, 14, 18];
            let upFingers = 0;
            tips.forEach((tipIdx, i) => {
              if (landmarks[tipIdx].y < landmarks[pips[i]].y) upFingers++;
            });

            // Target Kursor (EMA Filter)
            const rawX = landmarks[8].x * window.innerWidth;
            const rawY = landmarks[8].y * window.innerHeight;
            targetPos.current = { x: rawX, y: rawY };

            // GESTURE MAPPING & SPEED BOOST
            if (upFingers === 0) {
              setGestureMode('reset');
              scrollVelocity.current = 0;
            } else if (upFingers === 1) {
              setGestureMode('pointer');
              scrollVelocity.current = 0;
            } else if (upFingers === 2) {
              setGestureMode('scroll-up');
              scrollVelocity.current = -45; // SPEED BOOST UP
            } else if (upFingers >= 3) {
              setGestureMode('scroll-down');
              scrollVelocity.current = 45; // SPEED BOOST DOWN
            }
          }

          // LOGIKA KLIK (Tangan Kiri)
          if (isLeftHand) {
            leftHandFound = true;
            const thumbTip = landmarks[4];
            const indexTip = landmarks[8];
            const dist = Math.hypot(thumbTip.x - indexTip.x, thumbTip.y - indexTip.y);

            if (dist < 0.055) { 
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
        setIsHandVisible(false);
        setGestureMode('none');
        scrollVelocity.current = 0;
      }

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
  }, [isActive]);

  return (
    <>
      {/* 1. TELEMETRY MONITOR (DARK MODE) */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="fixed bottom-6 left-6 z-[9999] pointer-events-none"
          >
            <div className="bg-black/95 text-white text-[10px] px-4 py-2 rounded-t-2xl border-t border-x border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${isHandVisible ? 'bg-mangka-secondary animate-pulse' : 'bg-red-500'}`} />
                <span className="font-bold tracking-widest uppercase flex items-center gap-2">
                  <Cpu size={12} /> Neural Engine
                </span>
              </div>
              <span className="text-white/40 font-mono tracking-tighter">fps: 60.0</span>
            </div>
            <div className="w-56 aspect-video bg-black rounded-b-2xl border-b border-x border-white/10 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] relative">
              <canvas ref={canvasRef} className="w-full h-full" width={480} height={360} />
              <div className="absolute inset-0 border border-white/5 pointer-events-none" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. LUXURY CURSOR */}
      <div 
        ref={cursorRef}
        className={`fixed top-0 left-0 w-16 h-16 -mt-8 -ml-8 pointer-events-none z-[10000] transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className={`
          relative w-full h-full rounded-full border flex items-center justify-center transition-all duration-300
          ${!isHandVisible ? 'scale-75 opacity-30 border-white/20' : 'scale-100 border-mangka-secondary bg-mangka-secondary/5 shadow-[0_0_25px_rgba(255,157,59,0.3)]'}
          ${gestureMode === 'scroll-up' || gestureMode === 'scroll-down' ? 'border-blue-400 bg-blue-400/10 shadow-[0_0_30px_rgba(96,165,250,0.5)]' : ''}
          ${isLeftPinching ? 'scale-90 border-white bg-white/30 shadow-[0_0_40px_white]' : ''}
        `}>
          {/* Central Core */}
          <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${isHandVisible ? 'bg-mangka-secondary' : 'bg-white/20'}`} />
          
          {/* Dynamic Icons */}
          <div className="absolute inset-0 flex items-center justify-center">
            {gestureMode === 'scroll-up' && <MoveUp size={24} className="text-blue-400 animate-bounce" />}
            {gestureMode === 'scroll-down' && <MoveDown size={24} className="text-blue-400 animate-bounce" />}
            {gestureMode === 'pointer' && isHandVisible && <MousePointer2 size={20} className={`${isLeftPinching ? 'text-white' : 'text-mangka-secondary'}`} />}
            {gestureMode === 'reset' && <Target size={22} className="text-red-500" />}
          </div>

          {/* Radar Ripple Effect */}
          {isHandVisible && (
            <motion.div 
              animate={{ scale: [1, 1.5], opacity: [0.3, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="absolute inset-0 rounded-full border border-mangka-secondary/30"
            />
          )}
        </div>
      </div>

      {/* 3. FLOATING ACTION PANEL */}
      <div className="fixed bottom-24 right-6 z-[9999] flex flex-col items-end gap-4 pointer-events-none">
        <motion.div layout className="pointer-events-auto bg-white/80 backdrop-blur-3xl border border-white/40 p-3 rounded-[40px] shadow-2xl">
          <video ref={videoRef} className="hidden" playsInline muted />
          <button
            onClick={toggleControl}
            className={`
              w-14 h-14 rounded-full flex flex-col items-center justify-center transition-all duration-500
              ${isActive ? 'bg-mangka-primary text-white scale-110' : 'bg-white text-mangka-primary hover:bg-mangka-primary hover:text-white border border-mangka-primary/10 shadow-xl'}
            `}
          >
            {isActive ? <Zap size={24} className="text-mangka-secondary fill-mangka-secondary animate-pulse" /> : <Hand size={24} />}
            <span className="text-[7px] font-bold mt-1 uppercase tracking-widest">
              {isActive ? 'Live' : 'Hand'}
            </span>
          </button>
        </motion.div>

        {/* ELEGANT LEGEND */}
        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-black/95 text-white/90 text-[10px] p-6 rounded-[32px] border border-white/10 w-52 shadow-[0_20px_60px_rgba(0,0,0,0.4)]"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-mangka-secondary font-bold border-b border-white/5 pb-3 mb-2 tracking-widest uppercase">
                  <Activity size={12} /> Neural Map
                </div>
                <div className="flex justify-between items-center text-white/50">
                  <span>Pointer:</span> <span className="text-white bg-white/10 px-2 py-0.5 rounded">☝️ 1 Finger</span>
                </div>
                <div className="flex justify-between items-center text-white/50">
                  <span>Quick Click:</span> <span className="text-mangka-secondary font-bold">👌 Left Pinch</span>
                </div>
                <div className="flex justify-between items-center text-white/50">
                  <span>Hyper Scroll:</span> <span className="text-blue-400 font-bold">✌️/🤟 Fingers</span>
                </div>
                <div className="mt-4 pt-4 border-t border-white/5 text-[9px] text-center italic text-white/30">
                  "Skeletal tracking active. No video data recorded."
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};
