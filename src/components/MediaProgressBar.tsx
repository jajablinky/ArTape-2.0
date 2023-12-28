import React, { useRef, useState, useEffect } from 'react';
import styles from '@/styles/Home.module.css';

interface MediaProgressBarProps {
  mediaProgress: number;
  setMediaProgress: React.Dispatch<React.SetStateAction<number>>;
  seekMediaProgress: number;
  setSeekMediaProgress: React.Dispatch<React.SetStateAction<number>>;
  storedMediaProgress: number;
  songDuration: number;
  isMediaPlaying: boolean;
  setIsMediaPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  handlePauseResume: (input?: string) => void;
}

const MediaProgressBar = ({
  mediaProgress,
  setMediaProgress,
  setSeekMediaProgress,
  songDuration,
  isMediaPlaying,
  handlePauseResume,
}: MediaProgressBarProps) => {
  const [wasPlaying, setWasPlaying] = useState<boolean | null>(null);
  const sliderRef = useRef(null);

  const handleMediaProgressChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const newValue = parseFloat(e.target.value);
    setSeekMediaProgress(newValue);
    setMediaProgress(newValue);
  };

  return (
    <>
      <input
        type="range"
        name="progress"
        min="0"
        max={songDuration}
        step="0.01"
        value={mediaProgress}
        onChange={handleMediaProgressChange}
        className={`${styles.progressBar} ${styles.slider}`}
        ref={sliderRef}
        onMouseDown={() => {
          setWasPlaying(isMediaPlaying);
          if (isMediaPlaying) handlePauseResume('pause');
        }}
        onMouseUp={() => {
          if (wasPlaying) handlePauseResume('play');
        }}
      />
    </>
  );
};

export default MediaProgressBar;
