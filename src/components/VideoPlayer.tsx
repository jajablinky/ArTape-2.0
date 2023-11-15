import React, { useRef, useState, useEffect } from 'react';
import { VideoFileWithFiles } from '@/types/TapeInfo';

interface VideoPlayerProps {
	color: string;
	videoFiles: VideoFileWithFiles[];
}

function formatToMinutes(duration: number): string {
	const minutes: number = Math.floor(duration / 60);
	const seconds: number = Math.round(duration % 60);
	const durationFormatted: string = `${minutes}:${seconds
	  .toString()
	  .padStart(2, '0')}`;
	return durationFormatted;
}

const VideoPlayer = ({color, videoFiles}: VideoPlayerProps) => {
	// insert react components
	const videoPlayer = useRef<HTMLVideoElement | null>(null);
	const [videoFetched, setVideoFetched] = useState<boolean>(true);
	const [currentVideoIndex, setCurrentVideoIndex] = useState<number>(0);
	const [isPlaying, setIsPlaying] = useState<boolean>(false);
	const [volume, setVolume] = useState<number>(1);
	const [currentVideo, setCurrentVideo] = useState<VideoFileWithFiles | null>(null);
	const [videoDuration, setVideoDuration] = useState<number>(0);
	const [currentProgress, setCurrentProgress] = useState<number>(0);

	// insert functions & handlers
	useEffect(() => {
		if (!videoPlayer.current) {
			videoPlayer.current = new HTMLVideoElement;
		}

		if (videoPlayer.current && videoFiles) {
			const currentVideoUrl = videoFiles[0].videoUrl;
			if (currentVideoUrl) {
				console.log(videoFiles[0].fileName, "'s duration:", videoDuration);
				videoPlayer.current.removeEventListener('ended', handleEnded);
				videoPlayer.current.src = currentVideoUrl;
				videoPlayer.current.addEventListener('ended', handleEnded);
			}
			if (isPlaying) videoPlayer.current.play();
		}

		return () => {
			if (videoPlayer.current) {
				videoPlayer.current.removeEventListener('ended', handleEnded);
			}
		}
	}, []);

	// Video Player Logic
	const handleVolumeChange = (e:React.ChangeEvent<HTMLInputElement>): void => {
		const newVolume = parseFloat(e.target.value);
		setVolume(newVolume);

		if (videoPlayer.current) {
			videoPlayer.current.volume = newVolume;
		}
	};

	const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		const newProgress = parseFloat(e.target.value);
		setCurrentProgress(newProgress);

		if (videoPlayer.current) {
			videoPlayer.current.currentTime = newProgress;
		}
	};

	const handlePauseResume = (): void => {
		if (!videoPlayer.current) {
			console.log('no audio player');
			return;
		}
	
		if (isPlaying) {
			//seekTime = audioPlayer.current.currentTime;
			console.log('pause');
			videoPlayer.current?.pause();
			// may need to implement pause check (see audio player)
			setIsPlaying(false);
		}
		if (!isPlaying && videoPlayer.current.readyState >= 2) {
			//audioPlayer.current.currentTime = seekTime;
			console.log('play');
			videoPlayer.current?.play();
			setIsPlaying(true);
		}
	};

	const handleStop = (): void => {
		if (videoPlayer.current && isPlaying) {
			console.log('stop');
			videoPlayer.current.pause();
			setCurrentVideoIndex(0);
			videoPlayer.current.currentTime = 0;
			setIsPlaying(false);
		}
	};

	const handleNextVideo = (): void => {
		console.log('current video index:', currentVideoIndex);
		setCurrentVideoIndex(
			currentVideoIndex === videoFiles.length - 1 ? 0 : currentVideoIndex + 1
		)
		console.log('loading video', currentVideoIndex);
		videoPlayer.current?.load();
		setIsPlaying(true);
	};

	const handlePrevVideo = (): void => {
		if (currentVideoIndex === -1) {
			return undefined;
		}
		if (currentVideoIndex === 0 && videoPlayer.current) {
			videoPlayer.current.currentTime = 0;
			videoPlayer.current.load();
			if (isPlaying) videoPlayer.current.play();
		}
		else setCurrentVideoIndex(currentVideoIndex - 1);
	};

	const handleEnded = (): void => {
		console.log("video ended");
		handleNextVideo();
	};

	return (
		<video
			onEnded={handleEnded}
			ref={videoPlayer}
			preload="metadata"
		/>
	);
};

export default VideoPlayer;