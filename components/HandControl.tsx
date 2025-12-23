
import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MousePointer2, MoveUp, MoveDown, Activity, Zap, Target, Hand, Cpu, Focus } from 'lucide-react';

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
  
  const currentPos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const targetPos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const scrollVelocity = useRef(0);
  const isClickProcessing = useRef(false);

  const isCalibrated = useRef(false);
  const handAnchor = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    let animationFrame: number;
    
    const updateUI = () => {
      const lerpFactor = 0.20;
      currentPos.current.x += (targetPos.current.x - currentPos.current.x) * lerpFactor;
      currentPos.current.y += (targetPos.current.y - currentPos.current.y) * lerpFactor;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${currentPos.current.x}px, ${currentPos.current.y}px, 0)`;
      }

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
    const nextState = !isActive;
    setIsActive(nextState);

    window.dispatchEvent(new CustomEvent('handTrackerToggled', { 
      detail: { active: nextState } 
    }));

    if (!nextState) {
      if (cameraRef.current) cameraRef.current.stop();
      setIsHandVisible(false);
      setGestureMode('none');
      scrollVelocity.current = 0;
      isCalibrated.current = false;
    }
  };

  useEffect(() => {
    if (!isActive || !videoRef.current || !canvasRef.current) return;

    const hands = new window.Hands({
      locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });

    hands.setOptions({
      maxNumHands: 2,
      modelComplexity: 0,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
      selfieMode: true,
    });

    const onResults = (results: any) => {
      const canvasCtx = canvasRef.current?.getContext('2d');
      if (!canvasCtx || !canvasRef.current) return;

      if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        setIsHandVisible(true);
        results.multiHandLandmarks.forEach((landmarks: any, index: number) => {
          const label = results.multiHandedness[index].label; 
          const isRightHand = label === 'Right'; 
          const isLeftHand = label === 'Left';

          if (isRightHand) {
            const tips = [8, 12, 16, 20];
            const pips = [6, 10, 14, 18];
            let upFingers = 0;
            tips.forEach((tipIdx, i) => {
              if (landmarks[tipIdx].y < landmarks[pips[i]].y) upFingers++;
            });

            const currentHandX = landmarks[8].x;
            const currentHandY = landmarks[8].y;

            if (upFingers === 0) {
              setGestureMode('reset');
              scrollVelocity.current = 0;
              isCalibrated.current = false; 
              targetPos.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
              currentPos.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
            } 
            else if (upFingers === 1) {
              setGestureMode('pointer');
              scrollVelocity.current = 0;

              if (!isCalibrated.current) {
                handAnchor.current = { x: currentHandX, y: currentHandY };
                isCalibrated.current = true;
              }

              const gain = 2.5;
              const offsetX = (currentHandX - handAnchor.current.x) * window.innerWidth * gain;
              const offsetY = (currentHandY - handAnchor.current.y) * window.innerHeight * gain;

              targetPos.current = { 
                x: (window.innerWidth / 2) + offsetX, 
                y: (window.innerHeight / 2) + offsetY 
              };
            } 
            else if (upFingers === 2) {
              setGestureMode('scroll-up');
              // Dimodifikasi: Diperlambat dari 75 menjadi 15 untuk kenyamanan UX
              scrollVelocity.current = -20;
            } else if (upFingers >= 3) {
              setGestureMode('scroll-down');
              // Dimodifikasi: Diperlambat dari 75 menjadi 15 untuk kenyamanan UX
              scrollVelocity.current = 20;
            }
          }

          if (isLeftHand) {
            const thumbTip = landmarks[4];
            const indexTip = landmarks[8];
            const dist = Math.hypot(thumbTip.x - indexTip.x, thumbTip.y - indexTip.y);

            if (dist < 0.055) { 
              setIsLeftPinching(true);
              if (!isClickProcessing.current) {
                isClickProcessing.current = true;
                let element = document.elementFromPoint(currentPos.current.x, currentPos.current.y);
                while (element && typeof (element as any).click !== 'function') {
                  element = element.parentElement;
                }
                if (element && typeof (element as any).click === 'function') {
                  (element as any).click();
                }
                setTimeout(() => { isClickProcessing.current = false; }, 400);
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
      <video ref={videoRef} className="hidden" playsInline muted />
      <canvas ref={canvasRef} className="hidden" width={480} height={360} />

      {/* LUXURY AI CURSOR */}
      <div 
        ref={cursorRef}
        className={`fixed top-0 left-0 w-16 h-16 -mt-8 -ml-8 pointer-events-none z-[10000] transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className={`
          relative w-full h-full rounded-full border flex items-center justify-center transition-all duration-300
          ${!isHandVisible ? 'scale-75 opacity-20 border-white/20' : 'scale-100 border-mangka-secondary bg-mangka-secondary/5 shadow-[0_0_30px_rgba(255,157,59,0.4)]'}
          ${gestureMode === 'reset' ? 'border-red-500 bg-red-500/10 scale-125 shadow-[0_0_40px_rgba(239,68,68,0.6)]' : ''}
          ${gestureMode === 'scroll-up' || gestureMode === 'scroll-down' ? 'border-blue-400 bg-blue-400/10' : ''}
          ${isLeftPinching ? 'scale-90 border-white bg-white/40 shadow-[0_0_50px_white]' : ''}
        `}>
          <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${isHandVisible ? 'bg-mangka-secondary' : 'bg-white/20'}`} />
          <div className="absolute inset-0 flex items-center justify-center">
            {gestureMode === 'scroll-up' && <MoveUp size={24} className="text-blue-400 animate-bounce" />}
            {gestureMode === 'scroll-down' && <MoveDown size={24} className="text-blue-400 animate-bounce" />}
            {gestureMode === 'pointer' && isHandVisible && <MousePointer2 size={20} className={`${isLeftPinching ? 'text-white' : 'text-mangka-secondary'}`} />}
            {gestureMode === 'reset' && <Focus size={24} className="text-red-500 animate-pulse" />}
          </div>
          {gestureMode === 'pointer' && isCalibrated.current && (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute -inset-2 border border-dashed border-mangka-secondary/20 rounded-full"
            />
          )}
        </div>
      </div>

      {/* FLOATING ACTION PANEL */}
      <div className="fixed bottom-6 left-6 z-[9999] flex flex-col items-start gap-4 pointer-events-none">
        
        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-black/95 text-white/90 text-[10px] p-6 rounded-[32px] border border-white/10 w-52 shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-mangka-secondary font-bold border-b border-white/10 pb-3 mb-2 tracking-widest uppercase">
                  <Activity size={12} /> AI Navigator
                </div>
                <div className="flex justify-between items-center text-white/50">
                  <span className="font-bold text-red-400">✊ Fist:</span> <span className="text-white font-mono">Center</span>
                </div>
                <div className="flex justify-between items-center text-white/50">
                  <span>Pointer:</span> <span className="text-white bg-white/10 px-2 py-0.5 rounded">☝️ 1 Finger</span>
                </div>
                <div className="flex justify-between items-center text-white/50">
                  <span>Scroll:</span> <span className="text-blue-400 font-bold">✌️/🤟 Move</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="pointer-events-auto bg-white/90 backdrop-blur-3xl border border-white/40 p-3 rounded-[40px] shadow-2xl">
          <button
            onClick={toggleControl}
            className={`
              w-14 h-14 rounded-full flex flex-col items-center justify-center transition-all duration-500
              ${isActive ? 'bg-mangka-primary text-white scale-110' : 'bg-white text-mangka-primary hover:bg-mangka-primary hover:text-white border border-mangka-primary/10 shadow-xl'}
            `}
          >
            {isActive ? <Zap size={24} className="text-mangka-secondary fill-mangka-secondary animate-pulse" /> : <Hand size={24} />}
            <span className="text-[7px] font-bold mt-1 uppercase tracking-widest">
              {isActive ? 'Stop' : 'Hand'}
            </span>
          </button>
        </div>
      </div>
    </>
  );
};
