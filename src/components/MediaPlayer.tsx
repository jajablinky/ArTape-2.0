import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import styles from '@/styles/Home.module.css';

import Loader from './Loader';

import PrevIcon from './Images/UI/PrevIcon';
import NextIcon from './Images/UI/NextIcon';
import PlayIcon from './Images/UI/PlayIcon';
import PauseIcon from './Images/UI/PauseIcon';
import { TrackWithFiles } from '@/types/TapeInfo';
import { MediaClickType } from '@/pages/tape/[id]';

import Image from 'next/image';
import VolumeSlider from './VolumeSlider';
import MediaProgressBar from './MediaProgressBar';

interface MediaPlayerProps {
  color: string;
  audioFiles: TrackWithFiles[];
  videoFiles: TrackWithFiles[];
  volume: number;
  setVolume: React.Dispatch<React.SetStateAction<number>>;
  mediaProgress: number;
  setMediaProgress: React.Dispatch<React.SetStateAction<number>>;
  storedMediaProgress: number;
  setStoredMediaProgress: React.Dispatch<React.SetStateAction<number>>;
  seekMediaProgress: number;
  setSeekMediaProgress: React.Dispatch<React.SetStateAction<number>>;
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
  lastSelectedMedia: number;
}

const MediaPlayer = ({
  color,
  audioFiles,
  videoFiles,
  volume,
  setVolume,
  mediaProgress,
  setMediaProgress,
  storedMediaProgress,
  setStoredMediaProgress,
  seekMediaProgress,
  setSeekMediaProgress,
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
  lastSelectedMedia,
}: MediaPlayerProps) => {
  const [audioFetched, setAudioFetched] = useState<boolean>(true);

  // need to raise this to [id] file
  //const [isMediaPlaying, setIsMediaPlaying] = useState<boolean>(false);

  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const audioPlayer = useRef<HTMLAudioElement | null>(null);
  const [songDuration, setSongDuration] = useState<number>(0);
  const [bufferProgress, setBufferProgress] = useState<number>(0);

  // check if mouse button held
  const [mouseDown, setMouseDown] = useState<boolean>(false);
  onmousedown = function () {
    setMouseDown(true);
  };
  onmouseup = function () {
    setMouseDown(false);
  };

  // get song name
  const getCurrentMediaName = (): string => {
    if (mediaSelected === 'audio')
      return audioFiles[currentModuleIndex].metadata.name;
    else if (mediaSelected === 'video') return videoFiles[0].metadata.name;
    else return '-----';
  };

  // get artist name
  const getArtistName = (): string => {
    if (mediaSelected === 'audio')
      return audioFiles[currentModuleIndex].metadata.artistName;
    else if (mediaSelected === 'video')
      return videoFiles[0].metadata.artistName;
    else return '-----';
  };

  useEffect(() => {
    // This useEffect is for audio only

    if (!audioPlayer.current) {
      audioPlayer.current = new Audio();
    }

    // load music
    if (
      (mediaSelected === 'audio' &&
        mediaClickType.clickType === 'audioModule' &&
        lastSelectedMedia !== currentModuleIndex) ||
      (mediaClickType.clickType === 'player' &&
        (mediaClickType.button === 'prev' || mediaClickType.button === 'next'))
    ) {
      if (audioPlayer.current && currentModuleIndex !== -1 && audioFiles) {
        const currentAudioUrl = audioFiles[currentModuleIndex].url;
        if (currentAudioUrl) {
          audioPlayer.current.removeEventListener('ended', handleEnded);
          audioPlayer.current.src = currentAudioUrl;
          audioPlayer.current.addEventListener('ended', handleEnded);
        }

        if (currentModuleIndex !== 1) {
          setIsAudioPlaying(true);
          setIsMediaPlaying(true);
          audioPlayer.current.play();
        } else {
          setIsAudioPlaying(false);
          setIsMediaPlaying(true);
          audioPlayer.current.pause();
        }
      }

      // make a case for mediaSelected being video to make sure audio isn't playing
      return () => {
        if (audioPlayer.current) {
          audioPlayer.current.removeEventListener('ended', handleEnded);
        }
      };
    } else if (
      lastSelectedMedia === currentModuleIndex &&
      mediaClickType.button !== 'none' &&
      mediaClickType.button !== 'init' &&
      mediaClickType.clickType === 'audioModule'
    ) {
      if (isAudioPlaying) {
        audioPlayer.current?.pause();
        setIsAudioPlaying(false);
        setIsMediaPlaying(false);
      } else {
        audioPlayer.current?.play();
        setIsAudioPlaying(true);
        setIsMediaPlaying(true);
      }
    } else if (
      mediaSelected === 'video' &&
      lastSelectedMedia === currentModuleIndex
    ) {
      setIsAudioPlaying(false);
      handleAudioPauseResume('pause');
    }
  }, [currentModuleIndex, mediaSelected, mediaClickType]);

  /* Media Player Logic */

  // volume update
  useEffect(() => {
    if (audioPlayer.current) audioPlayer.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    // Function to update media progress if audio
    const handleTimeUpdate = () => {
      if (mediaSelected === 'audio' && audioPlayer.current) {
        setMediaProgress(audioPlayer.current.currentTime);
      }
    };

    // Attach event listener based on it being audio
    if (mediaSelected === 'audio' && audioPlayer.current) {
      audioPlayer.current.addEventListener('timeupdate', handleTimeUpdate);
    }
    // Cleanup function
    return () => {
      if (audioPlayer.current) {
        audioPlayer.current.removeEventListener('timeupdate', handleTimeUpdate);
      }
    };
  }, [mediaSelected]);

  // seeking
  useEffect(() => {
    if (
      audioPlayer.current &&
      mediaSelected === 'audio' &&
      seekMediaProgress !== -1
    ) {
      audioPlayer.current.currentTime = seekMediaProgress;
    }
  }, [seekMediaProgress]);

  const handleBufferProgress: React.ReactEventHandler<HTMLAudioElement> = (
    e
  ) => {
    const audio = e.currentTarget;
    const dur = audio.duration;
    if (dur > 0) {
      for (let i = 0; i < audio.buffered.length; i++) {
        if (
          audio.buffered.start(audio.buffered.length - 1 - i) <
          audio.currentTime
        ) {
          const bufferedLength = audio.buffered.end(
            audio.buffered.length - 1 - i
          );
          setBufferProgress(bufferedLength);
          break;
        }
      }
    }
  };

  const handleAudioPauseResume = (input?: string): void => {
    if (!audioPlayer.current) {
      return;
    }
    if (isAudioPlaying || input === 'pause' || mediaSelected !== 'audio') {
      audioPlayer.current?.pause();
      setIsAudioPlaying(false);
    } else if (
      (!isAudioPlaying && audioPlayer.current.readyState >= 2) ||
      input === 'play'
    ) {
      audioPlayer.current?.play();
      setIsAudioPlaying(true);
    }
  };

  const handlePauseResume = (input?: string) => {
    if (input === 'pause') {
      setIsAudioPlaying(false);
      handleAudioPauseResume('pause');
      setIsVideoPlaying(false);
      setIsMediaPlaying(false);
    } else if (mediaSelected === 'video') {
      if (isVideoPlaying && input !== 'play') {
        setIsVideoPlaying(false);
        setIsMediaPlaying(false);
      } else {
        setIsVideoPlaying(true);
        setIsMediaPlaying(true);
      }
    } else if (mediaSelected === 'audio') {
      if (isAudioPlaying && input !== 'play') {
        handleAudioPauseResume('pause');
        setIsMediaPlaying(false);
      } else {
        handleAudioPauseResume('play');
        setIsMediaPlaying(true);
      }
    }

    setMediaClickType({ button: 'play', clickType: 'player' });
  };

  // Create handle next Media

  const handleNextMedia = (): void => {
    const tapeLength = audioFiles.length - 1;

    if (currentModuleIndex === 0) {
      setMediaSelected('video');
      audioPlayer.current?.pause();
      setIsAudioPlaying(false);
    } else {
      setMediaSelected('audio');
    }
    if (currentModuleIndex !== tapeLength) {
      setCurrentModuleIndex(currentModuleIndex + 1);
    } else if (currentModuleIndex === tapeLength) {
      setCurrentModuleIndex(0);
    }
    if (mediaSelected === 'audio') setIsAudioPlaying(true);
    setMediaClickType({ button: 'next', clickType: 'player' });
  };

  // Create handle prev media

  const handlePrevMedia = (): void => {
    if (currentModuleIndex === 0) {
      if (audioPlayer.current) {
        audioPlayer.current.currentTime = 0;
        if (isAudioPlaying) {
          audioPlayer.current.play();
        }
      }
    } else if (currentModuleIndex === 1) {
      setMediaSelected('audio');
      setCurrentModuleIndex(0);
      setIsAudioPlaying(true);
    } else if (currentModuleIndex === 2) {
      // if current module index is one after video player
      setMediaSelected('video');
      if (audioPlayer.current) {
        audioPlayer.current?.pause();
        audioPlayer.current.currentTime = 0;
        setIsAudioPlaying(false);
      }
      setCurrentModuleIndex(1);
    } else {
      setCurrentModuleIndex(currentModuleIndex - 1);
      setIsAudioPlaying(true);
    }

    setMediaClickType({ button: 'prev', clickType: 'player' });
  };

  const handleEnded = (): void => {
    handleNextMedia();
  };

  return (
    <>
      <motion.div
        className={styles.musicPlayerContainer}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.musicPlayerLeft}>
          {/* <div className={styles.musicPlayerArtwork}> */}
          {/* <Image
              // src={image.url}
              // alt={image.name}
              height={60}
              width={60}
            /> */}
          {/* </div> */}
          <div className={styles.musicPlayerText}>
            <p className={styles.songName}>{getCurrentMediaName()}</p>
            <p className={styles.artistName}>{getArtistName()}</p>
          </div>
        </div>
        <div className={styles.musicPlayerMiddle}>
          <audio
            onEnded={handleEnded}
            ref={audioPlayer}
            preload="metadata"
            onDurationChange={(e) => setSongDuration(e.currentTarget.duration)}
            onProgress={handleBufferProgress}
          />
          <div className={styles.musicControls}>
            <button onClick={() => handlePrevMedia()}>
              <PrevIcon height={18} width={21} color={'var(--artape-black)'} />
            </button>

            {isMediaPlaying ? (
              <button onClick={() => handlePauseResume()}>
                <PauseIcon
                  height={21}
                  width={21}
                  color={'var(--artape-black)'}
                />
              </button>
            ) : (
              <button onClick={() => handlePauseResume()}>
                <PlayIcon
                  height={21}
                  width={21}
                  color={'var(--artape-black)'}
                />
              </button>
            )}
            <button
              onClick={() => handleNextMedia()}
              style={{ color: 'var(--artape-black)' }}
            >
              <NextIcon height={18} width={21} color={'var(--artape-black)'} />
            </button>
          </div>
          <div className={styles.progressBarWrapper}>
            <p className={styles.progressTime}>0:00</p>
            <MediaProgressBar
              mediaProgress={mediaProgress}
              setMediaProgress={setMediaProgress}
              seekMediaProgress={seekMediaProgress}
              setSeekMediaProgress={setSeekMediaProgress}
              storedMediaProgress={storedMediaProgress}
              songDuration={songDuration}
              isMediaPlaying={isMediaPlaying}
              setIsMediaPlaying={setIsMediaPlaying}
              handlePauseResume={handlePauseResume}
            />
            <p className={styles.progressTime}>2:45</p>
          </div>
        </div>
        <div className={styles.musicPlayerRight}>
          <VolumeSlider volume={volume} setVolume={setVolume} />
        </div>
      </motion.div>
    </>
  );
};

export default MediaPlayer;
