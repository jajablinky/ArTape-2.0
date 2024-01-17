import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from '@/styles/Home.module.css';

import { TrackWithFiles } from '@/types/TapeInfo';
import { MediaClickType } from '@/pages/tape/[id]';
import { handleSetModuleAndLastSelected } from './Helper Functions/handleSetModuleAndLastSelected';

interface VideoPlayerProps {
  color: string;
  videoFiles: TrackWithFiles[] | null;
  volume: number;
  setVolume: React.Dispatch<React.SetStateAction<number>>;
  mediaProgress: number;
  setMediaProgress: React.Dispatch<React.SetStateAction<number>>;
  seekMediaProgress: number;
  storedMediaProgress: number;
  setStoredMediaProgress: React.Dispatch<React.SetStateAction<number>>;
  currentModuleIndex: number;
  setCurrentModuleIndex: React.Dispatch<React.SetStateAction<number>>;
  mediaSelected: string;
  setMediaSelected: React.Dispatch<React.SetStateAction<string>>;
  isVideoPlaying: boolean;
  setIsVideoPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  isMediaPlaying: boolean;
  setIsMediaPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  mediaClickType: MediaClickType;
  setMediaClickType: React.Dispatch<React.SetStateAction<MediaClickType>>;
  setLastSelectedMedia: React.Dispatch<React.SetStateAction<number>>;
}

const VideoPlayer = ({
  color,
  videoFiles,
  volume,
  setVolume,
  mediaProgress,
  setMediaProgress,
  storedMediaProgress,
  setStoredMediaProgress,
  seekMediaProgress,
  currentModuleIndex,
  setCurrentModuleIndex,
  mediaSelected,
  setMediaSelected,
  isVideoPlaying,
  setIsVideoPlaying,
  isMediaPlaying,
  setIsMediaPlaying,
  mediaClickType,
  setMediaClickType,
  setLastSelectedMedia,
}: VideoPlayerProps) => {
  // insert react components
  const videoPlayer = useRef<HTMLVideoElement | null>(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState<number>(0);
  const [videoDuration, setVideoDuration] = useState<number>(0);
  const [currentProgress, setCurrentProgress] = useState<number>(0);

  const [bufferProgress, setBufferProgress] = useState<number>(0);

  const handleVideoPauseResume = (input?: string): void => {
    if (!videoPlayer.current) {
      return;
    }

    if (isVideoPlaying || input === 'pause') {
      //seekTime = audioPlayer.current.currentTime;

      videoPlayer.current?.pause();
      // may need to implement pause check (see audio player)
      setIsVideoPlaying(false);
      if (mediaSelected !== 'audio') setIsMediaPlaying(false);
    } else if (
      (!isVideoPlaying && videoPlayer.current.readyState >= 2) ||
      input === 'play'
    ) {
      //audioPlayer.current.currentTime = seekTime;

      videoPlayer.current?.play();
      setIsVideoPlaying(true);
      setIsMediaPlaying(true);
    }
  };

  // insert functions & handlers
  useEffect(() => {
    if (!videoPlayer.current) {
      videoPlayer.current = new HTMLVideoElement();
    }

    if (videoPlayer.current && videoFiles) {
      const currentVideoUrl = videoFiles[0].url;
      if (currentVideoUrl) {
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

  useEffect(() => {
    // option 1: video selected
    if (mediaSelected === 'video' && mediaClickType.clickType !== 'none') {
      // option 1a: clicked on video module
      if (mediaClickType.clickType === 'videoModule') {
        if (currentModuleIndex === 1) {
          // play/pause conditions
          if (isVideoPlaying) handleVideoPauseResume('pause');
          else handleVideoPauseResume('play');
        } else {
          // cannot play
          handleVideoPauseResume('pause');
          if (videoPlayer.current) videoPlayer.current.currentTime = 0;
        }
      }
      // option 1b: clicked on play/pause button
      else if (
        mediaClickType.button === 'play' &&
        mediaClickType.clickType === 'player'
      ) {
        if (isVideoPlaying) videoPlayer.current?.play();
        else videoPlayer.current?.pause();
      }
      // option 1c: video navigated to from another song
      else if (
        mediaClickType.button === 'next' ||
        mediaClickType.button === 'prev'
      ) {
        if (currentModuleIndex === 1) handleVideoPauseResume('play');
      }
    }
    // option 2: audio selected, stop video entirely
    else if (mediaSelected === 'audio') {
      setIsVideoPlaying(false);
      handleVideoPauseResume('pause');
      if (videoPlayer.current) videoPlayer.current.currentTime = 0;
    }

    if (
      (mediaClickType.clickType === 'player' ||
        mediaClickType.clickType === 'videoModule') &&
      mediaClickType.button !== 'none' &&
      mediaClickType.button !== 'init'
    )
      return () => {
        setMediaClickType({ button: 'none', clickType: 'none' });
      };
  }, [currentModuleIndex, mediaSelected, mediaClickType]);

  // volume change
  useEffect(() => {
    if (videoPlayer.current && currentModuleIndex === 1)
      videoPlayer.current.volume = volume;
  }, [volume]);

  // Video Seeking
  useEffect(() => {
    if (
      videoPlayer.current &&
      mediaSelected === 'video' &&
      seekMediaProgress !== -1
    ) {
      videoPlayer.current.currentTime = seekMediaProgress;
    }
  }, [seekMediaProgress]);

  // Video Value
  useEffect(() => {
    // Function to update media progress if video updating as time is progressing in video
    const handleTimeUpdate = () => {
      if (mediaSelected === 'video' && videoPlayer.current) {
        setMediaProgress(videoPlayer.current.currentTime);
      }
    };

    // Attach event listener based on it being video
    if (mediaSelected === 'video' && videoPlayer.current) {
      videoPlayer.current.addEventListener('timeupdate', handleTimeUpdate);
    }
    // Cleanup function
    return () => {
      if (videoPlayer.current) {
        videoPlayer.current.removeEventListener('timeupdate', handleTimeUpdate);
      }
    };
  }, [mediaSelected]);

  // next media is currently always audio
  const handleNextMedia = (): void => {
    setIsVideoPlaying(false);
    setCurrentModuleIndex(currentModuleIndex + 1);
    setMediaSelected('audio');
  };

  const handleEnded = (): void => {
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
              handleSetModuleAndLastSelected(
                1,
                setLastSelectedMedia,
                currentModuleIndex,
                setCurrentModuleIndex
              );
              setMediaSelected('video');
              setMediaClickType({ button: 'module', clickType: 'videoModule' });
            }}
            preload="metadata"
            style={{ width: '100%' }}
          />
        </div>
      </motion.div>
    </>
  );
};

export default VideoPlayer;
