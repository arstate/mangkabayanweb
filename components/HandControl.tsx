
import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Hand, MousePointer2, MoveVertical, Activity } from 'lucide-react';

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
  const [cursorPos, setCursorPos] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const handsRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);
  
  // Ref untuk state internal agar lancar di loop requestAnimationFrame
  const lastPos = useRef({ x: 0, y: 0 });
  const lastScrollY = useRef(0);
  const pinchDistHistory = useRef<number[]>([]);
  const isPinching = useRef(false);

  // Toggle Hand Control
  const toggleControl = async () => {
    if (!isActive) {
      setIsActive(true);
    } else {
      if (cameraRef.current) cameraRef.current.stop();
      setIsActive(false);
      setGestureMode('none');
    }
  };

  useEffect(() => {
    if (!isActive || !videoRef.current || !canvasRef.current) return;

    const hands = new window.Hands({
      locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });

    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.7,
    });

    const onResults = (results: any) => {
      const canvasCtx = canvasRef.current?.getContext('2d');
      if (!canvasCtx || !canvasRef.current) return;

      // Draw testing monitor in bottom left
      canvasCtx.save();
      canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      canvasCtx.drawImage(results.image, 0, 0, canvasRef.current.width, canvasRef.current.height);

      if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        const landmarks = results.multiHandLandmarks[0];
        
        // Draw landmarks for testing
        window.drawConnectors(canvasCtx, landmarks, window.HAND_CONNECTIONS, { color: '#FF9D3B', lineWidth: 2 });
        window.drawLandmarks(canvasCtx, landmarks, { color: '#3F1307', lineWidth: 1, radius: 2 });

        // Logic Landmarks:
        // 4: Jempol Tip, 8: Telunjuk Tip, 12: Tengah Tip
        const thumbTip = landmarks[4];
        const indexTip = landmarks[8];
        const middleTip = landmarks[12];
        const indexPip = landmarks[6];
        const middlePip = landmarks[10];

        // 1. Cek jumlah jari terangkat
        const isIndexUp = indexTip.y < indexPip.y;
        const isMiddleUp = middleTip.y < middlePip.y;

        // Pointer Mode (1 Jari)
        if (isIndexUp && !isMiddleUp) {
          setGestureMode('pointer');
          // Map coordinates (Mirroring: 1 - x)
          const targetX = (1 - indexTip.x) * window.innerWidth;
          const targetY = indexTip.y * window.innerHeight;
          
          // Smoothing
          const smoothedX = lastPos.current.x + (targetX - lastPos.current.x) * 0.3;
          const smoothedY = lastPos.current.y + (targetY - lastPos.current.y) * 0.3;
          
          lastPos.current = { x: smoothedX, y: smoothedY };
          setCursorPos({ x: smoothedX, y: smoothedY });

          // Click Detection (Pinch Out)
          const dist = Math.hypot(thumbTip.x - indexTip.x, thumbTip.y - indexTip.y);
          pinchDistHistory.current.push(dist);
          if (pinchDistHistory.current.length > 5) pinchDistHistory.current.shift();

          const startDist = pinchDistHistory.current[0];
          const currentDist = dist;

          // Jika jarak meningkat drastis (pinch out)
          if (startDist < 0.05 && currentDist > 0.12 && !isPinching.current) {
            isPinching.current = true;
            // Trigger Click
            const element = document.elementFromPoint(smoothedX, smoothedY);
            if (element) (element as HTMLElement).click();
            
            // Visual Feedback: Ripple effect trigger
            setTimeout(() => { isPinching.current = false; }, 500);
          }
        } 
        // Scroll Mode (2 Jari)
        else if (isIndexUp && isMiddleUp) {
          setGestureMode('scroll');
          const avgY = (indexTip.y + middleTip.y) / 2;
          
          if (lastScrollY.current !== 0) {
            const diff = (avgY - lastScrollY.current) * 2000;
            window.scrollBy(0, diff);
          }
          lastScrollY.current = avgY;
        } else {
          setGestureMode('none');
          lastScrollY.current = 0;
        }
      } else {
        setGestureMode('none');
        lastScrollY.current = 0;
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
      {/* 1. MONITOR TESTING (KIRI BAWAH) */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="fixed bottom-6 left-6 z-[9999] pointer-events-none flex flex-col gap-2"
          >
            <div className="bg-mangka-primary/90 text-white text-[10px] px-3 py-1.5 rounded-t-xl backdrop-blur-md flex items-center gap-2 border border-white/10">
              <Activity size={12} className="text-green-400 animate-pulse" />
              <span>AI HAND DETECTOR MONITOR</span>
            </div>
            <div className="w-48 aspect-video bg-black rounded-b-xl border border-white/20 overflow-hidden shadow-2xl relative">
              <canvas ref={canvasRef} className="w-full h-full mirror" width={640} height={480} />
              <div className="absolute top-2 right-2 px-2 py-0.5 bg-mangka-secondary text-white text-[8px] font-bold rounded">LIVE</div>
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
              scale: isPinching.current ? 0.8 : 1
            }}
            className="fixed top-0 left-0 w-10 h-10 pointer-events-none z-[10000]"
          >
            <div className={`
              w-full h-full rounded-full border-2 flex items-center justify-center backdrop-blur-md transition-all duration-300
              ${gestureMode === 'scroll' ? 'border-blue-400 bg-blue-400/20' : 'border-mangka-secondary bg-mangka-secondary/20'}
              ${isPinching.current ? 'scale-125 border-white bg-white/40' : ''}
            `}>
              {gestureMode === 'scroll' ? (
                <MoveVertical size={16} className="text-blue-500" />
              ) : (
                <MousePointer2 size={16} className={`${isPinching.current ? 'text-white' : 'text-mangka-secondary'}`} />
              )}
            </div>
            
            {/* Click Visualizer */}
            <AnimatePresence>
              {isPinching.current && (
                <motion.div 
                  initial={{ scale: 0.5, opacity: 1 }}
                  animate={{ scale: 2, opacity: 0 }}
                  className="absolute inset-0 rounded-full border-2 border-white"
                />
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. CONTROL PANEL (KANAN BAWAH) */}
      <div className="fixed bottom-24 right-6 z-[9999] flex flex-col items-end gap-3 pointer-events-none">
        <motion.div 
          layout
          className="pointer-events-auto bg-white/80 backdrop-blur-xl border border-white/50 p-3 rounded-[32px] shadow-2xl flex flex-col items-center gap-2"
        >
          {/* Hidden Video for Processing */}
          <video ref={videoRef} className="hidden" playsInline muted />
          
          <button
            onClick={toggleControl}
            className={`
              w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 shadow-lg
              ${isActive ? 'bg-mangka-primary text-white scale-110' : 'bg-white text-mangka-primary border border-mangka-primary/10 hover:bg-mangka-primary hover:text-white'}
            `}
          >
            {isActive ? <Camera size={20} /> : <Hand size={20} />}
          </button>
        </motion.div>

        {/* Info Guide */}
        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-mangka-primary/95 text-white text-[10px] p-3 rounded-2xl backdrop-blur-md border border-white/10 w-48 shadow-xl"
            >
              <p className="font-bold border-b border-white/10 pb-1 mb-1 text-mangka-secondary tracking-widest uppercase">Panduan Gestur</p>
              <ul className="space-y-1 opacity-90">
                <li className="flex justify-between items-center">
                  <span>1 Jari:</span> 
                  <span className="bg-white/10 px-1.5 py-0.5 rounded">Pointer</span>
                </li>
                <li className="flex justify-between items-center">
                  <span>2 Jari:</span> 
                  <span className="bg-white/10 px-1.5 py-0.5 rounded">Scroll</span>
                </li>
                <li className="flex justify-between items-center">
                  <span>Cubit Keluar:</span> 
                  <span className="bg-mangka-secondary px-1.5 py-0.5 rounded text-[8px] font-bold">KLIK</span>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};
