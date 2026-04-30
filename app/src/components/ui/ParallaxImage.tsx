import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ParallaxImageProps {
  src?: string;
  videoSrc?: string;
  alt?: string;
  className?: string;
  offset?: number;
  containerClassName?: string;
  children?: React.ReactNode;
  objectFit?: 'cover' | 'contain';
  style?: React.CSSProperties;
}

export default function ParallaxImage({ 
  src, 
  videoSrc,
  alt = "", 
  className = "", 
  offset = 50,
  containerClassName = "",
  children,
  objectFit = 'cover',
  style
}: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [-offset, offset]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${containerClassName}`}>
      <motion.div style={{ y }} className="absolute inset-0 w-full h-[120%] -top-[10%]">
        {videoSrc ? (
          <video
            src={videoSrc}
            autoPlay
            loop
            muted
            playsInline
            className={`w-full h-full object-${objectFit} ${className}`}
            style={style}
          />
        ) : (
          <img
            src={src}
            alt={alt}
            className={`w-full h-full object-${objectFit} ${className}`}
            style={style}
          />
        )}
      </motion.div>
      {children}
    </div>
  );
}
