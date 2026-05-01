import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useViewport } from '../../hooks/useViewport';
import { useReducedMotion } from '../../hooks/useReducedMotion';

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
  disableOnMobile?: boolean; // New prop to disable parallax on mobile
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
  style,
  disableOnMobile = true, // Default to true for better mobile performance
}: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { isMobile } = useViewport();
  const prefersReducedMotion = useReducedMotion();
  
  // Disable parallax on mobile or when user prefers reduced motion
  const shouldDisableParallax = (disableOnMobile && isMobile) || prefersReducedMotion;
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Always call useTransform (hooks must be called unconditionally)
  const y = useTransform(scrollYProgress, [0, 1], [-offset, offset]);

  // For mobile, use CSS transform instead of Framer Motion
  if (shouldDisableParallax) {
    return (
      <div ref={ref} className={`relative overflow-hidden ${containerClassName}`}>
        <div className="absolute inset-0 w-full h-full">
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
              loading="lazy"
              decoding="async"
            />
          )}
        </div>
        {children}
      </div>
    );
  }

  // Desktop: Full parallax effect with Framer Motion
  return (
    <div ref={ref} className={`relative overflow-hidden ${containerClassName}`}>
      <motion.div 
        style={{ y }} 
        className="absolute inset-0 w-full h-[120%] -top-[10%]"
        // Use will-change only during scroll for better performance
        onViewportEnter={() => {
          if (ref.current) {
            ref.current.style.willChange = 'transform';
          }
        }}
        onViewportLeave={() => {
          if (ref.current) {
            ref.current.style.willChange = 'auto';
          }
        }}
      >
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
            loading="lazy"
            decoding="async"
          />
        )}
      </motion.div>
      {children}
    </div>
  );
}
