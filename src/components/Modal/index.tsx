import React from 'react';
import Backdrop from '../Backdrop';
import styles from '@/styles/Home.module.css';
import AudioPlayer from '../AudioPlayer';

interface ModalProps {
  handleClose: () => void;
  text: string;
}

const dropIn = {
  hidden: { y: '-100vh', opacity: 0 },
  visible: {
    y: '0',
    opacity: 1,
    transition: {
      duration: 0.1,
      type: 'spring',
      damping: 25,
      stiffness: 500,
    },
  },
  exit: { y: '100vh', opacity: 0 },
};

const Modal: React.FC<ModalProps> = ({
  handleClose,
  text,
}: ModalProps) => {
  return (
    <Backdrop onClick={handleClose}>
      <AudioPlayer />
    </Backdrop>
  );
};

export default Modal;
