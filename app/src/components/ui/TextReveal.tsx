import { motion } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
}

export default function TextReveal({ text, className = "", delay = 0 }: TextRevealProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.span
      initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: prefersReducedMotion ? 0.01 : 0.75,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      style={{ display: 'inline-block' }}
      className={className}
    >
      {text}
    </motion.span>
  );
}
