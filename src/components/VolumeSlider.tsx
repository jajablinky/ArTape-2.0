import React from 'react';
import styles from '@/styles/volumeSlider.module.css';
import VolumeIcon from './Images/UI/Volume';

const VolumeSlider = ({ volume, handleVolumeChange }) => {
  return (
    <>
      <VolumeIcon height={21} width={19} color={'var(--artape-black)'} />
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={handleVolumeChange}
        className={styles.volumeSlider}
      />
    </>
  );
};

export default VolumeSlider;
