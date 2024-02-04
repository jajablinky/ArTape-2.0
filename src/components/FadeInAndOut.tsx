import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface FadeInAndOutProps {
  children: ReactNode;
}

const FadeInAndOut: React.FC<FadeInAndOutProps> = ({ children }) => {
  return (
    <motion.div
      className="transition"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        duration: 0.3,
      }}
      style={{ width: '100%' }}
    >
      {children}
    </motion.div>
  );
};

export default FadeInAndOut;
