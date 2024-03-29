import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import styles from '@/styles/Home.module.css';

import PrevIcon from './Images/UI/PrevIcon';
import NextIcon from './Images/UI/NextIcon';
import PlayIcon from './Images/UI/PlayIcon';
import PauseIcon from './Images/UI/PauseIcon';
import { TrackWithFiles } from '@/types/TapeInfo';
import { MediaClickType, useMediaContext } from './Context/MediaPlayerContext';
import fallbackImage from './Images/Images/dummyProfilePhoto.png';

import VolumeSlider from './VolumeSlider';
import MediaProgressBar from './MediaProgressBar';
import { useTape } from './Context/TapeContext';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import getTimeInMinutes from './Helper Functions/getTimeInMinutes';
import Image from 'next/image';

const MediaPlayer = () => {
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const audioPlayer = useRef<HTMLAudioElement | null>(null);
  const [songDuration, setSongDuration] = useState<number>(0);
  const [bufferProgress, setBufferProgress] = useState<number>(0);

  const { tape } = useTape();
  const {
    isVideoPlaying,
    setIsVideoPlaying,
    audioFiles,
    videoFiles,
    volume,
    setVolume,
    mediaDuration,
    setMediaDuration,
    mediaProgress,
    setMediaProgress,
    storedMediaProgress,
    seekMediaProgress,
    setSeekMediaProgress,
    currentModuleIndex,
    setCurrentModuleIndex,
    mediaSelected,
    setMediaSelected,
    mediaClickType,
    setMediaClickType,
    lastSelectedMedia,
    isMediaPlaying,
    setIsMediaPlaying,
    color,
    loading,
  } = useMediaContext();

  // get song name
  const getCurrentMediaName = (): string => {
    if (mediaSelected === 'audio' && audioFiles)
      return currentModuleIndex === 0
        ? audioFiles[currentModuleIndex].metadata.name
        : audioFiles[currentModuleIndex - 1].metadata.name;
    else if (mediaSelected === 'video' && videoFiles)
      return videoFiles[0].metadata.name;
    else return '-----';
  };

  // get artist name
  const getArtistName = (): string => {
    if (mediaSelected === 'audio' && audioFiles)
      return currentModuleIndex === 0
        ? audioFiles[currentModuleIndex].metadata.artistName
        : audioFiles[currentModuleIndex - 1].metadata.artistName;
    else if (mediaSelected === 'video' && videoFiles)
      return videoFiles[0].metadata.artistName;
    else return '-----';
  };

  // get media image
  const getMediaImage = (): string | StaticImport => {
    if (tape) {
      if (tape.modules[currentModuleIndex].additionalItem[0]) {
        const currentModuleIndexUrl =
          tape.modules[currentModuleIndex].additionalItem[0].url;
        const firstModuleIndexUrl = tape.modules[0].additionalItem[0].url;

        if (currentModuleIndexUrl && firstModuleIndexUrl) {
          if (mediaSelected === 'audio' && audioFiles && tape) {
            return currentModuleIndexUrl;
          } else if (mediaSelected === 'video' && tape) {
            return firstModuleIndexUrl;
          }
        }
      }
    }
    return fallbackImage;
  };

  useEffect(() => {
    if (!audioPlayer.current) {
      audioPlayer.current = new Audio();
    }

    if (
      (mediaSelected === 'audio' &&
        mediaClickType.clickType === 'audioModule' &&
        lastSelectedMedia !== currentModuleIndex) ||
      (mediaClickType.clickType === 'player' &&
        (mediaClickType.button === 'prev' || mediaClickType.button === 'next'))
    ) {
      if (audioPlayer.current && currentModuleIndex !== -1 && audioFiles) {
        const currentAudioUrl =
          currentModuleIndex === 0
            ? audioFiles[currentModuleIndex].url
            : audioFiles[currentModuleIndex - 1].url;
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
    if (!audioFiles) return;

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

  // update media duration when song duration changes
  useEffect(() => {
    if (mediaSelected === 'audio') setMediaDuration(songDuration);
  }, [songDuration, mediaSelected]);

  return (
    <div className={styles.AudioPlayer}>
      <motion.div
        className={styles.musicPlayerContainer}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.musicPlayerLeft}>
          <div className={styles.musicPlayerArtwork}>
            {/* <Image src={getMediaImage()} alt={'test'} height={60} width={60} /> */}
          </div>
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
            <p className={styles.progressTime}>
              {getTimeInMinutes(mediaProgress)}
            </p>
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
            <p className={styles.progressTime}>
              {getTimeInMinutes(mediaDuration)}
            </p>
          </div>
        </div>
        <div className={styles.musicPlayerRight}>
          <VolumeSlider volume={volume} setVolume={setVolume} />
        </div>
      </motion.div>
    </div>
  );
};

export default MediaPlayer;
