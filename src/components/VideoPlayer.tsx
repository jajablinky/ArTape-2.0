import React, { useRef, useState, useEffect } from 'react';
import { VideoFileWithFiles } from '@/types/TapeInfo';
import {} from './AudioPlayer';

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
	const [isPlaying, setIsPlaying] = useState<boolean>(false);
	const [volume, setVolume] = useState<number>(1);
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
	const handleEnded = (): void => {
		console.log("video ended");
	};

	return (
		
	);
};

export default VideoPlayer;