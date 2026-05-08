'use client';
import { motion } from 'framer-motion';

export const Reveal = ({ children, delay = 0, x = 0, y = 30 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ 
        duration: 0.8, 
        delay, 
        ease: [0.21, 0.47, 0.32, 0.98] 
      }}
    >
      {children}
    </motion.div>
  );
};

export const Floating = ({ children, duration = 4 }) => {
  return (
    <motion.div
      animate={{ 
        y: [0, -15, 0],
        rotate: [0, 1, 0]
      }}
      transition={{ 
        duration, 
        repeat: Infinity, 
        ease: "easeInOut" 
      }}
    >
      {children}
    </motion.div>
  );
};

export const Tilt = ({ children }) => {
  return (
    <motion.div
      whileHover={{ 
        scale: 1.02, 
        rotateX: -2, 
        rotateY: 2,
        z: 50
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{ perspective: 1000 }}
    >
      {children}
    </motion.div>
  );
};
