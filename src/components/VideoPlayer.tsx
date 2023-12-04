import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from '@/styles/Home.module.css';

import { VideoFileWithFiles } from '@/types/TapeInfo';

interface VideoPlayerProps {
  color: string;
  videoFiles: VideoFileWithFiles[];
  volume: number;
  setVolume: any;
  mediaProgress: number;
  setMediaProgress: any;
  currentModuleIndex: number;
  setCurrentModuleIndex: any;
  mediaSelected: string;
  setMediaSelected: any;
}

const VideoPlayer = ({
  color,
  videoFiles,
  volume,
  setVolume,
  mediaProgress,
  setMediaProgress,
  currentModuleIndex,
  setCurrentModuleIndex,
  mediaSelected,
  setMediaSelected,
}: VideoPlayerProps) => {
  // insert react components
  const videoPlayer = useRef<HTMLVideoElement | null>(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [videoDuration, setVideoDuration] = useState<number>(0);
  const [currentProgress, setCurrentProgress] = useState<number>(0);
  const [click, setClick] = useState(0);

  const [bufferProgress, setBufferProgress] = useState<number>(0);

  const handleVideoPauseResume = (input?: string): void => {
    if (!videoPlayer.current) {
      console.log('no video player');
      return;
    }

    if (isPlaying || input === 'pause') {
      //seekTime = audioPlayer.current.currentTime;
      console.log('pause');
      videoPlayer.current?.pause();
      // may need to implement pause check (see audio player)
      setIsPlaying(false);
    }
    else if ((!isPlaying && videoPlayer.current.readyState >= 2) || input === 'play') {
      //audioPlayer.current.currentTime = seekTime;
      console.log('play');
      videoPlayer.current?.play();
      setIsPlaying(true);
    }
  };

  // insert functions & handlers
  useEffect(() => {
    if (!videoPlayer.current) {
      videoPlayer.current = new HTMLVideoElement();
    }

    if (videoPlayer.current && videoFiles) {
      const currentVideoUrl = videoFiles[0].videoUrl;
      if (currentVideoUrl) {
        console.log(videoFiles[0].fileName, "'s duration:", videoDuration);
        videoPlayer.current.removeEventListener('ended', handleEnded);
        videoPlayer.current.src = currentVideoUrl;
        videoPlayer.current.addEventListener('ended', handleEnded);
      }
    }

    return () => {
      if (videoPlayer.current) {
        videoPlayer.current.removeEventListener('ended', handleEnded);
      }
    };
  }, []);

  // Video Player Logic

  useEffect(() => {
    if (currentModuleIndex === 1) {
      handleVideoPauseResume('play');
    }
    else {
      handleVideoPauseResume('pause');
      videoPlayer.current.currentTime = 0;
    }
  }, [currentModuleIndex, mediaSelected, click]);

  // volume change
  useEffect(() => {
    if (videoPlayer.current && currentModuleIndex === 1)
      videoPlayer.current.volume = volume;
  }, [volume]);

  const handleBufferProgress: React.ReactEventHandler<HTMLAudioElement> = (
    e
  ) => {
    const video = e.currentTarget;
    const dur = video.duration;
    if (dur > 0) {
      for (let i = 0; i < video.buffered.length; i++) {
        if (
          video.buffered.start(video.buffered.length - 1 - i) <
          video.currentTime
        ) {
          const bufferedLength = video.buffered.end(
            video.buffered.length - 1 - i
          );
          setBufferProgress(bufferedLength);
          break;
        }
      }
    }
  };

  const handleNextMedia = (): void => {
    console.log('current video index:', currentVideoIndex);
    setCurrentModuleIndex(currentModuleIndex + 1);
    setIsPlaying(true);
  };

  const handleEnded = (): void => {
    console.log('video ended');
    handleNextMedia();
  };

  return (
    <>
      <motion.div
        className={styles.videoPlayerContainer}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.videoPlayerMiddle}>
          <video
            onEnded={handleEnded}
            ref={videoPlayer}
            onClick={() => {
              setCurrentModuleIndex(1);
              setMediaSelected('video');
              setClick(click + 1);
            }}
            preload="metadata"
            onDurationChange={(e) => setVideoDuration(e.currentTarget.duration)}
            onTimeUpdate={(e) => {
              setMediaProgress(e.currentTarget.currentTime);
              handleBufferProgress(e);
            }}
            onProgress={handleBufferProgress}
            style={{ width: '100%' }}
          />
        </div>
      </motion.div>
    </>
  );
};

export default VideoPlayer;
