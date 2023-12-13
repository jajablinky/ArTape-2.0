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
	seekMediaProgress,
	setSeekMediaProgress,
	storedMediaProgress,
	songDuration,
	isMediaPlaying,
	setIsMediaPlaying,
	handlePauseResume,
}: MediaProgressBarProps) => {
	const [mouseState, setMouseState] = useState<string>('');
	const [wasPlaying, setWasPlaying] = useState<boolean | null>(null);
	const sliderRef = useRef(null);
	
	const handleWasPlaying = async (
		isMediaPlaying: boolean | null,
	) => {
		const setWasPlayingPromise = new Promise((resolve) => {
			setWasPlaying(() => {
				resolve(isMediaPlaying);
				return isMediaPlaying;
			});
		});

		await setWasPlayingPromise;
		console.log('promise resolved');
	};

	useEffect(() => {
		console.log('wasPlaying changed to:', wasPlaying);

		handlePauseResume('pause');

		console.log('current state:', wasPlaying, mouseState);

		if (wasPlaying === null && mouseState === 'up') handlePauseResume('play');
	}, [wasPlaying]);

	const handleMediaProgressChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		const sliderElement = document.getElementsByClassName(styles.slider);

		if (sliderElement.length > 0) {
			sliderElement[0].addEventListener("mousedown", (event) => {
				setMouseState('down');
				//console.log('wasPlaying precheck:', wasPlaying);
				if (wasPlaying === null) handleWasPlaying(isMediaPlaying);

				// pt 2
				setSeekMediaProgress(parseFloat(e.target.value));
				setMediaProgress(parseFloat(e.target.value));
				//console.log('mouseDown seekMediaProgress:', seekMediaProgress);
			});
			sliderElement[0].addEventListener("mouseup", (event) => {
				setMouseState('up');
				setSeekMediaProgress(-1);
				//console.log('mouseUp seekMediaProgress:', seekMediaProgress);
				
				//console.log('mouseUp wasPlaying:', wasPlaying);
				if (wasPlaying) {
					console.log("was playing true, resuming audio");
					handleWasPlaying(null);
				}
			});
		}
		
	}

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
              //value={ () => {mediaProgress} }
			  onChange={(e) => handleMediaProgressChange(e)}
              className={`${styles.progressBar} ${styles.slider}`}
			  ref={sliderRef}
            />
		</>
	)
};

export default MediaProgressBar;