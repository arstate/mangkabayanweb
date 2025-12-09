import React from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  hoverEffect?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = "", 
  delay = 0,
  hoverEffect = false 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: delay, ease: "easeOut" }}
      whileHover={hoverEffect ? { y: -10, boxShadow: "0 25px 50px -12px rgba(63, 19, 7, 0.15)" } : {}}
      className={`
        relative overflow-hidden
        bg-white/60 backdrop-blur-xl 
        border border-white/50 
        shadow-[0_8px_32px_0_rgba(63,19,7,0.05)]
        rounded-glass
        ${className}
      `}
    >
      {/* Glossy reflection effect at top */}
      <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />
      
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};