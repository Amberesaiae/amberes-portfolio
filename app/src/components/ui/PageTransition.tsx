import { motion } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { pageVariants, reducedMotionVariants } from '../../styles/animationTokens';

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const prefersReducedMotion = useReducedMotion();
  
  return (
    <motion.div
      variants={prefersReducedMotion ? reducedMotionVariants : pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {children}
    </motion.div>
  );
}
