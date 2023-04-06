import React from 'react';
import Akord from '@akord/akord-js';
import Backdrop from '../Backdrop';
import styles from '@/styles/Home.module.css';
import AudioPlayer from '../AudioPlayer';

interface ModalProps {
  modalOpen: boolean;
  handleClose: () => void;
  text?: string;
  akord: Akord | null;
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
  modalOpen,
  handleClose,
  text,
  akord,
}: ModalProps) => {
  if (!modalOpen) {
    return null;
  }

  return (
    <Backdrop onClick={handleClose}>
      <AudioPlayer akord={akord} />
    </Backdrop>
  );
};

export default Modal;
