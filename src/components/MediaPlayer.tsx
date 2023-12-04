import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import styles from '@/styles/Home.module.css';

import Loader from './Loader';

import PrevIcon from './Images/UI/PrevIcon';
import NextIcon from './Images/UI/NextIcon';
import PlayIcon from './Images/UI/PlayIcon';
import PauseIcon from './Images/UI/PauseIcon';
import { AudioFileWithFiles } from '@/types/TapeInfo';

import Image from 'next/image';
import VolumeSlider from './VolumeSlider';
import MediaProgressBar from './MediaProgressBar';

interface MediaPlayerProps {
  color: string;
  audioFiles: AudioFileWithFiles[];
  volume: number;
  setVolume: any;
  mediaProgress: number;
  setMediaProgress: any;
  currentModuleIndex: number;
  setCurrentModuleIndex: any;
  mediaSelected: string;
  setMediaSelected: any;
  setIsVideoPlaying: any;
  isVideoPlaying: boolean;
}

const MediaPlayer = ({
  color,
  audioFiles,
  volume,
  setVolume,
  mediaProgress,
  setMediaProgress,
  currentModuleIndex,
  setCurrentModuleIndex,
  mediaSelected,
  setMediaSelected,
  isVideoPlaying,
  setIsVideoPlaying,
}: MediaPlayerProps) => {
  const [audioFetched, setAudioFetched] = useState<boolean>(true);
  const [isMediaPlaying, setIsMediaPlaying] = useState<boolean>(true);
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [currentSong, setCurrentSong] = useState<AudioFileWithFiles | null>(
    null
  );
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

  useEffect(() => {
    // This useEffect is for audio only
    if (mediaSelected === 'audio') {
      if (!audioPlayer.current) {
        audioPlayer.current = new Audio();
      }

      setCurrentSong(audioFiles[currentModuleIndex]);

      if (
        audioPlayer.current &&
        currentModuleIndex !== -1 &&
        audioFiles &&
        currentModuleIndex !== 1
      ) {
        const currentAudioUrl = audioFiles[currentModuleIndex].audioUrl;
        if (currentAudioUrl) {
          audioPlayer.current.removeEventListener('ended', handleEnded);
          audioPlayer.current.src = currentAudioUrl;
          audioPlayer.current.addEventListener('ended', handleEnded);
        }

        if (currentModuleIndex !== 1) setIsAudioPlaying(true);
        else setIsAudioPlaying(false);

        if (isAudioPlaying) audioPlayer.current.play();
      }

      // make a case for mediaSelected being video to make sure audio isn't playing

      return () => {
        if (audioPlayer.current) {
          audioPlayer.current.removeEventListener('ended', handleEnded);
        }
      };
    }
    if (mediaSelected === 'video') {
      setIsAudioPlaying(false);
      handleAudioPauseResume();
    }
  }, [currentModuleIndex, mediaSelected]);

  /* Media Player Logic */

  useEffect(() => {
    if (currentModuleIndex !== 1) {
      handlePauseResume('play');
    } else {
      handlePauseResume('pause');
      audioPlayer.current.currentTime = 0;
    }
  }, [currentModuleIndex, mediaSelected]);

  // volume change
  useEffect(() => {
    if (audioPlayer.current) audioPlayer.current.volume = volume;
  }, [volume]);

  // seek bar change
  // note: this currently pauses media if mouse is held down anywhere on screen
  useEffect(() => {
    if (audioPlayer.current && mouseDown) {
      handleAudioPauseResume('pause');
      audioPlayer.current.currentTime = mediaProgress;
    }
  }, [mediaProgress]);

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
      console.log('no audio player');
      return;
    }
    if (isAudioPlaying || input === 'pause' || mediaSelected !== 'audio') {
      //seekTime = audioPlayer.current.currentTime;
      audioPlayer.current?.pause();
      setIsAudioPlaying(false);
    } else if (
      (!isAudioPlaying && audioPlayer.current.readyState >= 2) ||
      input === 'play'
    ) {
      //audioPlayer.current.currentTime = seekTime;
      console.log('play');
      audioPlayer.current?.play();
      setIsAudioPlaying(true);
    }
  };

  const handlePauseResume = (input: string): void => {
    if (mediaSelected === 'video') {
      setIsVideoPlaying((prev: boolean) => !prev);
      setIsMediaPlaying((prev: boolean) => !prev);
    }
    if (mediaSelected === 'audio') {
      handleAudioPauseResume('pause');
      setIsMediaPlaying((prev: boolean) => !prev);
    }
  };

  // Create handle next Media

  const handleNextSong = (): void => {
    const tapeLength = audioFiles.length - 1;

    if (currentModuleIndex !== tapeLength) {
      console.log('setting index:', currentModuleIndex);
      setCurrentModuleIndex(currentModuleIndex + 1);
      console.log('index is now', currentModuleIndex);
    }
    else if (currentModuleIndex === tapeLength) {
      console.log('setting index:', currentModuleIndex);
      setCurrentModuleIndex(0);
      console.log('index is now', currentModuleIndex);
    }
    if (currentModuleIndex === 0) {
      setMediaSelected('video');
      audioPlayer.current?.pause();
      setIsAudioPlaying(false);
      console.log('media selected video');
    } else {
      setMediaSelected('audio');
      console.log('media selected audio');
      if (!isAudioPlaying) {
        setIsAudioPlaying(true);
      }
    }
    setIsAudioPlaying(true);
  };

  // Create handle prev media

  const handlePrevSong = (): void => {
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
    } else if (currentModuleIndex === 2) {
      // if current module index is one after video player
      setMediaSelected('video');
      if (audioPlayer.current) {
        audioPlayer.current?.pause();
        audioPlayer.current.currentTime = 0;
      }
      setCurrentModuleIndex(1);
    } else {
      setCurrentModuleIndex(currentModuleIndex - 1);
    }
    setIsAudioPlaying(true);

    console.log('prev', currentModuleIndex);
  };

  const handleEnded = (): void => {
    console.log('song ended');
    handleNextSong();
  };

  return (
    <>
      <motion.div
        className={styles.musicPlayerContainer}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.musicPlayerLeft}>
          <div className={styles.musicPlayerArtwork}>
            {/* <Image
              // src={image.url}
              // alt={image.name}
              height={60}
              width={60}
            /> */}
          </div>
          <div className={styles.musicPlayerText}>
            <p className={styles.songName}>Song Name</p>
            <p className={styles.artistName}>Artist Name</p>
          </div>
        </div>
        <div className={styles.musicPlayerMiddle}>
          <audio
            onEnded={handleEnded}
            ref={audioPlayer}
            preload="metadata"
            onDurationChange={(e) => setSongDuration(e.currentTarget.duration)}
            onTimeUpdate={(e) => {
              setMediaProgress(e.currentTarget.currentTime);
              handleBufferProgress(e);
            }}
            onProgress={handleBufferProgress}
          />
          <div className={styles.musicControls}>
            <button onClick={() => handlePrevSong()}>
              <PrevIcon height={18} width={21} color={'var(--artape-black)'} />
            </button>

            {isMediaPlaying ? (
              <button onClick={() => handlePauseResume('pause')}>
                <PauseIcon
                  height={21}
                  width={21}
                  color={'var(--artape-black)'}
                />
              </button>
            ) : (
              <button onClick={() => handlePauseResume('pause')}>
                <PlayIcon
                  height={21}
                  width={21}
                  color={'var(--artape-black)'}
                />
              </button>
            )}
            <button
              onClick={() => handleNextSong()}
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
              songDuration={songDuration}
            />
            <p className={styles.progressTime}>2:45</p>
          </div>
        </div>

        {audioFetched ? (
          audioFiles.map((audioFile, index: number) => (
            <div key={index} className={styles.trackContainer}>
              {audioFetched && audioFile.audioUrl && (
                <audio>
                  <source src={audioFile.audioUrl} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              )}
            </div>
          ))
        ) : (
          <Loader />
        )}
        <div className={styles.musicPlayerRight}>
          <VolumeSlider volume={volume} setVolume={setVolume} />
        </div>
      </motion.div>
    </>
  );
};

export default MediaPlayer;
