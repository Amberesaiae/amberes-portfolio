import React from 'react';
import { motion, useSpring, useMotionValue, useTransform } from 'framer-motion';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  tiltRange?: number;
  intensity?: number;
}

export default function TiltCard({ 
  children, 
  className = "", 
  tiltRange = 7,
  intensity = 50 
}: TiltCardProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [tiltRange, -tiltRange]), { stiffness: 100, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-tiltRange, tiltRange]), { stiffness: 100, damping: 20 });

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const xPct = mouseX / rect.width - 0.5;
    const yPct = mouseY / rect.height - 0.5;

    x.set(xPct);
    y.set(yPct);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ 
        rotateX, 
        rotateY,
        transformStyle: "preserve-3d"
      }}
      className={className}
    >
      <div style={{ transform: `translateZ(${intensity}px)`, transformStyle: "preserve-3d" }}>
        {children}
      </div>
    </motion.div>
  );
}
