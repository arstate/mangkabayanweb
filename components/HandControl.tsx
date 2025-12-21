
import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Hand, MousePointer2, MoveVertical, Activity, Zap } from 'lucide-react';

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
  const [gestureMode, setGestureMode] = useState<'pointer' | 'scroll' | 'none'>('none');
  const [isLeftPinching, setIsLeftPinching] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const handsRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);
  
  // Refs untuk kalkulasi stabilitas & scroll
  const lastPos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const scrollVelocity = useRef(0);
  const isClickProcessing = useRef(false);

  // Toggle Control
  const toggleControl = async () => {
    if (!isActive) {
      setIsActive(true);
    } else {
      if (cameraRef.current) cameraRef.current.stop();
      setIsActive(false);
      setGestureMode('none');
      scrollVelocity.current = 0;
    }
  };

  // Loop untuk Continuous Scroll
  useEffect(() => {
    let scrollAnimationFrame: number;
    const applyScroll = () => {
      if (scrollVelocity.current !== 0) {
        window.scrollBy({
          top: scrollVelocity.current,
          behavior: 'auto'
        });
      }
      scrollAnimationFrame = requestAnimationFrame(applyScroll);
    };
    
    if (isActive) {
      scrollAnimationFrame = requestAnimationFrame(applyScroll);
    }
    return () => cancelAnimationFrame(scrollAnimationFrame);
  }, [isActive]);

  useEffect(() => {
    if (!isActive || !videoRef.current || !canvasRef.current) return;

    const hands = new window.Hands({
      locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });

    hands.setOptions({
      maxNumHands: 2, // DETEKSI DUA TANGAN
      modelComplexity: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.7,
    });

    const onResults = (results: any) => {
      const canvasCtx = canvasRef.current?.getContext('2d');
      if (!canvasCtx || !canvasRef.current) return;

      canvasCtx.save();
      canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      canvasCtx.drawImage(results.image, 0, 0, canvasRef.current.width, canvasRef.current.height);

      let rightHandFound = false;
      let leftHandFound = false;

      if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        results.multiHandLandmarks.forEach((landmarks: any, index: number) => {
          const label = results.multiHandedness[index].label; 
          // Note: MediaPipe label is inverted due to mirroring
          const isRightHand = label === 'Left'; 
          const isLeftHand = label === 'Right';

          // Visual Feedback on Monitor
          window.drawConnectors(canvasCtx, landmarks, window.HAND_CONNECTIONS, { 
            color: isRightHand ? '#FF9D3B' : '#FFFFFF', 
            lineWidth: 2 
          });
          window.drawLandmarks(canvasCtx, landmarks, { 
            color: isRightHand ? '#3F1307' : '#FF9D3B', 
            lineWidth: 1, 
            radius: 3 
          });

          // --- LOGIKA TANGAN KANAN (CURSOR & SCROLL) ---
          if (isRightHand) {
            rightHandFound = true;
            const indexTip = landmarks[8];
            const middleTip = landmarks[12];
            const indexPip = landmarks[6];
            const middlePip = landmarks[10];

            const isIndexUp = indexTip.y < indexPip.y;
            const isMiddleUp = middleTip.y < middlePip.y;

            // Pointer Mode
            if (isIndexUp && !isMiddleUp) {
              setGestureMode('pointer');
              scrollVelocity.current = 0;

              const targetX = (1 - indexTip.x) * window.innerWidth;
              const targetY = indexTip.y * window.innerHeight;
              
              // Exponential Smoothing (Stabilizer)
              const smoothedX = lastPos.current.x + (targetX - lastPos.current.x) * 0.15;
              const smoothedY = lastPos.current.y + (targetY - lastPos.current.y) * 0.15;
              
              lastPos.current = { x: smoothedX, y: smoothedY };
              setCursorPos({ x: smoothedX, y: smoothedY });
            } 
            // Continuous Scroll Mode (2 Jari)
            else if (isIndexUp && isMiddleUp) {
              setGestureMode('scroll');
              const centerY = 0.5; // Titik netral tengah layar kamera
              const deadZone = 0.05;
              const diff = indexTip.y - centerY;

              if (Math.abs(diff) > deadZone) {
                // Kecepatan variabel berdasarkan jarak dari center
                scrollVelocity.current = diff * 50; 
              } else {
                scrollVelocity.current = 0;
              }
            } else {
              setGestureMode('none');
              scrollVelocity.current = 0;
            }
          }

          // --- LOGIKA TANGAN KIRI (KLIK CUBIT) ---
          if (isLeftHand) {
            leftHandFound = true;
            const thumbTip = landmarks[4];
            const leftIndexTip = landmarks[8];
            
            // Jarak antara jempol dan telunjuk kiri
            const dist = Math.hypot(thumbTip.x - leftIndexTip.x, thumbTip.y - leftIndexTip.y);

            if (dist < 0.04) { // Cubitan Terdeteksi
              setIsLeftPinching(true);
              if (!isClickProcessing.current) {
                isClickProcessing.current = true;
                const element = document.elementFromPoint(lastPos.current.x, lastPos.current.y);
                if (element) (element as HTMLElement).click();
                
                // Haptic feedback simulation via visual
                setTimeout(() => { isClickProcessing.current = false; }, 300);
              }
            } else {
              setIsLeftPinching(false);
            }
          }
        });
      }

      if (!rightHandFound) {
        setGestureMode('none');
        scrollVelocity.current = 0;
      }
      if (!leftHandFound) {
        setIsLeftPinching(false);
      }

      canvasCtx.restore();
    };

    hands.onResults(onResults);
    handsRef.current = hands;

    const camera = new window.Camera(videoRef.current, {
      onFrame: async () => {
        if (handsRef.current) await handsRef.current.send({ image: videoRef.current });
      },
      width: 640,
      height: 480,
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
      {/* 1. MONITOR TESTING */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="fixed bottom-6 left-6 z-[9999] pointer-events-none flex flex-col gap-2"
          >
            <div className="bg-mangka-primary/90 text-white text-[10px] px-3 py-2 rounded-t-xl backdrop-blur-md flex items-center justify-between border border-white/10">
              <div className="flex items-center gap-2">
                <Activity size={12} className="text-green-400 animate-pulse" />
                <span>DUAL-HAND AI MONITOR</span>
              </div>
              <div className="flex gap-2">
                <span className={`w-2 h-2 rounded-full ${gestureMode !== 'none' ? 'bg-orange-500' : 'bg-white/20'}`} title="Right Hand" />
                <span className={`w-2 h-2 rounded-full ${isLeftPinching ? 'bg-blue-500' : 'bg-white/20'}`} title="Left Hand" />
              </div>
            </div>
            <div className="w-56 aspect-video bg-black rounded-b-xl border border-white/20 overflow-hidden shadow-2xl relative">
              <canvas ref={canvasRef} className="w-full h-full mirror" width={640} height={480} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. CURSOR VIRTUAL */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            animate={{ 
              x: cursorPos.x - 20,
              y: cursorPos.y - 20,
              scale: isLeftPinching ? 0.7 : 1
            }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className="fixed top-0 left-0 w-12 h-12 pointer-events-none z-[10000]"
          >
            <div className={`
              w-full h-full rounded-full border-2 flex items-center justify-center backdrop-blur-md transition-all duration-200
              ${gestureMode === 'scroll' ? 'border-blue-400 bg-blue-400/30' : 'border-mangka-secondary bg-mangka-secondary/20'}
              ${isLeftPinching ? 'border-white bg-white/40 shadow-[0_0_20px_rgba(255,255,255,0.8)]' : 'shadow-xl'}
            `}>
              {gestureMode === 'scroll' ? (
                <MoveVertical size={20} className="text-blue-500 animate-bounce" />
              ) : (
                <MousePointer2 size={20} className={`${isLeftPinching ? 'text-white' : 'text-mangka-secondary'}`} />
              )}
            </div>
            
            {/* Click Visual Pulse */}
            <AnimatePresence>
              {isLeftPinching && (
                <motion.div 
                  initial={{ scale: 0.5, opacity: 1 }}
                  animate={{ scale: 2.5, opacity: 0 }}
                  className="absolute inset-0 rounded-full border-2 border-mangka-secondary"
                />
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. CONTROL PANEL */}
      <div className="fixed bottom-24 right-6 z-[9999] flex flex-col items-end gap-3 pointer-events-none">
        <motion.div 
          layout
          className="pointer-events-auto bg-white/80 backdrop-blur-xl border border-white/50 p-3 rounded-[32px] shadow-2xl flex flex-col items-center gap-2"
        >
          <video ref={videoRef} className="hidden" playsInline muted />
          
          <button
            onClick={toggleControl}
            className={`
              w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 shadow-lg
              ${isActive ? 'bg-mangka-primary text-white scale-110' : 'bg-white text-mangka-primary border border-mangka-primary/10 hover:bg-mangka-primary hover:text-white'}
            `}
          >
            {isActive ? <Zap size={20} className="text-mangka-secondary" /> : <Hand size={20} />}
          </button>
        </motion.div>

        {/* Guide Panel */}
        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-mangka-primary/95 text-white text-[10px] p-4 rounded-3xl backdrop-blur-md border border-white/10 w-56 shadow-2xl"
            >
              <p className="font-bold border-b border-white/10 pb-2 mb-2 text-mangka-secondary tracking-widest uppercase flex items-center gap-2">
                <Hand size={12} /> PRO GESTURE SYSTEM
              </p>
              <div className="space-y-3 opacity-90">
                <div className="flex flex-col gap-1">
                  <span className="text-mangka-secondary font-bold">TANGAN KANAN:</span>
                  <div className="flex justify-between pl-2"><span>1 Jari:</span> <span className="text-gray-400 italic">Navigasi</span></div>
                  <div className="flex justify-between pl-2"><span>2 Jari:</span> <span className="text-gray-400 italic">Continuous Scroll</span></div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-blue-400 font-bold">TANGAN KIRI:</span>
                  <div className="flex justify-between pl-2"><span>Cubit:</span> <span className="bg-blue-500/50 px-2 rounded font-bold">KLIK KIRI</span></div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};
