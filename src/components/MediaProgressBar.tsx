import React from 'react';
import styles from '@/styles/Home.module.css';

interface MediaProgressBarProps {
	mediaProgress: number;
	setMediaProgress: React.Dispatch<React.SetStateAction<number>>;
	songDuration: number;
}

const MediaProgressBar = ({
	mediaProgress, 
	setMediaProgress, 
	songDuration,
}: MediaProgressBarProps) => {
	const getMediaProgress = (e: React.ChangeEvent<HTMLInputElement>): void => {
		const newMediaProgress = parseFloat(e.target.value);
		console.log("current media progress:", mediaProgress);
		setMediaProgress(newMediaProgress);
	}

	return (
		<>
			<input
              type="range"
              name="progress"
              min="0"
              max={songDuration}
              step="0.01"
              value={mediaProgress}
              onChange={getMediaProgress}
              className={`${styles.progressBar} ${styles.slider}`}
            />
		</>
	)
};

export default MediaProgressBar;