import React from 'react';
import styles from '@/styles/volumeSlider.module.css';
import VolumeIcon from './Images/UI/Volume';

const VolumeSlider = ({ volume, setVolume }) => {
  const getNewVolume = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newVolume = parseFloat(e.target.value);
    console.log("changing volume to", newVolume);
    setVolume(newVolume);
  }

  return (
    <>
      <VolumeIcon height={21} width={19} color={'var(--artape-black)'} />
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={getNewVolume}
        className={`${styles.slider}`}
      />
    </>
  );
};

export default VolumeSlider;
