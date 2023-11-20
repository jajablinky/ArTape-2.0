import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from '@/styles/Home.module.css';

import Loader from './Loader';
import VolumeSlider from "./VolumeSlider";
import { VideoFileWithFiles } from "@/types/TapeInfo";


interface VideoPlayerProps {
  color: string;
  videoFiles: VideoFileWithFiles[];
  volume: number;
  setVolume: any;
  mediaProgress: number;
  setMediaProgress: any;
}

function formatToMinutes(duration: number): string {
  const minutes: number = Math.floor(duration / 60);
  const seconds: number = Math.round(duration % 60);
  const durationFormatted: string = `${minutes}:${seconds
    .toString()
    .padStart(2, '0')}`;
  return durationFormatted;
}

const VideoPlayer = ({ color, videoFiles, volume, setVolume, mediaProgress, setMediaProgress }: VideoPlayerProps) => {
  // insert react components
  const videoPlayer = useRef<HTMLVideoElement | null>(null);
  const [videoFetched, setVideoFetched] = useState<boolean>(true);
  const [currentVideoIndex, setCurrentVideoIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentVideo, setCurrentVideo] = useState<VideoFileWithFiles | null>(
    null
  );
  const [videoDuration, setVideoDuration] = useState<number>(0);
  const [currentProgress, setCurrentProgress] = useState<number>(0);
  const [bufferProgress, setBufferProgress] = useState<number>(0);

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
      if (isPlaying) videoPlayer.current.play();
    }

    return () => {
      if (videoPlayer.current) {
        videoPlayer.current.removeEventListener('ended', handleEnded);
      }
    };
  }, []);

  // Video Player Logic

  // volume change
  useEffect(() => {
    if (videoPlayer.current) videoPlayer.current.volume = volume;
  }, [volume]);

  // seek bar change
  useEffect(() => {
    if (videoPlayer.current) videoPlayer.current.currentTime = mediaProgress
  }, [mediaProgress]);

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
    );
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
    } else setCurrentVideoIndex(currentVideoIndex - 1);
  };

  const handleEnded = (): void => {
    console.log('video ended');
    handleNextVideo();
  };

  return (
    <>
      <motion.div
        className={styles.videoPlayerContainer}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.videoPlayerMiddle}>
          <video
            onClick={handlePauseResume}
            onEnded={handleEnded}
            ref={videoPlayer}
            preload="metadata"
            onDurationChange={(e) => setVideoDuration(e.currentTarget.duration)}
            onTimeUpdate={(e) => {
              setMediaProgress(e.currentTarget.currentTime);
              handleBufferProgress(e);
            }}
            onProgress={handleBufferProgress}
          />
        </div>

        {videoFetched ? (
          videoFiles.map((audioFile, index: number) => (
            <div key={index} className={styles.trackContainer}>
              {videoFetched && audioFile.videoUrl && (
                <video>
                  <source src={audioFile.videoUrl} type="video/mp4" />
                  Your browser does not support the video element.
                </video>
              )}
            </div>
          ))
        ) : (
          <Loader />
        )}
      </motion.div>
    </>
  );
};

export default VideoPlayer;
