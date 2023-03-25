import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import styles from '@/styles/Home.module.css';

interface BackdropProps {
  children: ReactNode;
  onClick: () => void;
}

const Backdrop: React.FC<BackdropProps> = ({
  children,
  onClick,
}: BackdropProps) => {
  return (
    <motion.div
      className={styles.backdrop}
      onClick={onClick}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {children}
    </motion.div>
  );
};

export default Backdrop;
