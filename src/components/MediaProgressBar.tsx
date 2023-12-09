import React, { useRef } from 'react';
import styles from '@/styles/Home.module.css';

interface MediaProgressBarProps {
	mediaProgress: number;
	setMediaProgress: React.Dispatch<React.SetStateAction<number>>;
	storedMediaProgress: number;
	songDuration: number;
	isVideoPlaying: boolean;
	setIsVideoPlaying: React.Dispatch<React.SetStateAction<boolean>>;
	isAudioPlaying: boolean;
	setIsAudioPlaying: React.Dispatch<React.SetStateAction<boolean>>;
	isMediaPlaying: boolean;
	setIsMediaPlaying: React.Dispatch<React.SetStateAction<boolean>>;
	handlePauseResume: (input?: string) => void;
}

const MediaProgressBar = ({
	mediaProgress, 
	setMediaProgress,
	storedMediaProgress,
	songDuration,
	isAudioPlaying,
	setIsAudioPlaying,
	isVideoPlaying,
	setIsVideoPlaying,
	isMediaPlaying,
	setIsMediaPlaying,
	handlePauseResume,
}: MediaProgressBarProps) => {
	let wasPlaying: boolean | null = null;
	const sliderRef = useRef(null);
	
	const handleMediaProgressChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		const sliderElement = document.getElementsByClassName(styles.slider);

		if (sliderElement.length > 0) {
			sliderElement[0].addEventListener("mousedown", (event) => {
				console.log('mouseDown event');
				if (wasPlaying === null) {
					wasPlaying = isMediaPlaying;
					console.log('wasPlaying:', wasPlaying);
					handlePauseResume('pause');
				}

				// pt 2
				const newMediaProgress = e.target.value;
				console.log('newMediaProgress:', newMediaProgress);
			});
		}
		
	}
	
	

	const doOnInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
		console.log('on input');
		const newMediaProgress = parseFloat(e.target.value);
		console.log("current media progress:", mediaProgress);
		setMediaProgress(newMediaProgress);
	}

	const doOnChange = (): void => {
		console.log('on change');
		if (wasPlaying) handlePauseResume();
	}

	// const getMediaProgress = (e: React.ChangeEvent<HTMLInputElement>): void => {
	// 	const newMediaProgress = parseFloat(e.target.value);
	// 	console.log("current media progress:", mediaProgress);
	// 	setMediaProgress(newMediaProgress);
	// }

	// possible steps
	// onBeforeInput: pause media (if not already paused)
	// onInput: set the time to the new one
	// onChange: resume media
	return (
		<>
			<input
              type="range"
              name="progress"
              min="0"
              max={songDuration}
              step="0.01"
              value={ isMediaPlaying ? (
				mediaProgress
			  ) : (
				storedMediaProgress
			  )}
			  onChange={(e) => handleMediaProgressChange(e)}
              className={`${styles.progressBar} ${styles.slider}`}
			  ref={sliderRef}
            />
		</>
	)
};

export default MediaProgressBar;