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
  mediaSelected: boolean;
  setMediaSelected: any;
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
}: MediaPlayerProps) => {
  const [audioFetched, setAudioFetched] = useState<boolean>(true);
  const [isPlaying, setisPlaying] = useState<boolean>(false);
  const [currentSong, setCurrentSong] = useState<AudioFileWithFiles | null>(
    null
  );
  const mediaPlayer = useRef<HTMLAudioElement | null>(null);
  const [hasPaused, setPause] = useState<boolean>(false);
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
    console.log('currentModuleIndex changed, now', currentModuleIndex);
    if (!mediaPlayer.current) {
      mediaPlayer.current = new Audio();
    }
    console.log('useEffect currentModuleIndex:', currentModuleIndex);
    setCurrentSong(audioFiles[currentModuleIndex]);

    if (mediaPlayer.current && currentModuleIndex !== -1 && audioFiles) {
      const currentAudioUrl = audioFiles[currentModuleIndex].audioUrl;
      if (currentAudioUrl) {
        console.log(currentSong?.fileName, "'s duration:", songDuration);
        mediaPlayer.current.removeEventListener('ended', handleEnded);
        mediaPlayer.current.src = currentAudioUrl;
        mediaPlayer.current.addEventListener('ended', handleEnded);
      }
      if (mediaSelected) setisPlaying(true);
      if (isPlaying) mediaPlayer.current.play();
      setMediaSelected(false);
    }

    return () => {
      if (mediaPlayer.current) {
        mediaPlayer.current.removeEventListener('ended', handleEnded);
      }
    };
  }, [currentModuleIndex || mediaSelected]);

  /* Media Player Logic */

  // volume change
  useEffect(() => {
    if (mediaPlayer.current) mediaPlayer.current.volume = volume;
  }, [volume]);

  // seek bar change
  // note: this currently pauses media if mouse is held down anywhere on screen
  useEffect(() => {
    if (mediaPlayer.current && mouseDown) {
      handlePauseResume('pause');
      mediaPlayer.current.currentTime = mediaProgress;
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

  const handlePauseResume = (input?: string): void => {
    if (!mediaPlayer.current) {
      console.log('no audio player');
      return;
    }

    if (isPlaying || input === 'pause') {
      //seekTime = mediaPlayer.current.currentTime;
      console.log('pause');
      mediaPlayer.current?.pause();
      console.log('pre check:', hasPaused);
      if (!hasPaused) {
        console.log('first pause');
        setPause(true);
      } else {
        console.log('already paused before!');
      }
      console.log('post check:', hasPaused);
      setisPlaying(false);
    }
    if (
      (!isPlaying && mediaPlayer.current.readyState >= 2) ||
      input === 'play'
    ) {
      //mediaPlayer.current.currentTime = seekTime;
      console.log('play');
      mediaPlayer.current?.play();
      setisPlaying(true);
    }
  };

  // Create handle next Media

  const handleNextSong = (): void => {
    if (hasPaused) {
      setPause(false);
      console.log('setting index to', currentModuleIndex + 1);
      setCurrentModuleIndex(currentModuleIndex + 1);
    }

    console.log('current index:', currentModuleIndex);
    setCurrentModuleIndex(
      currentModuleIndex === audioFiles.length - 1 ? 0 : currentModuleIndex + 1
    );
    console.log('loading song', currentModuleIndex);
    mediaPlayer.current?.load();
    setisPlaying(true);
  };

  // Create handle prev media

  const handlePrevSong = (): void => {
    if (currentModuleIndex === -1) {
      return undefined;
    }
    if (currentModuleIndex === 0) {
      if (mediaPlayer.current) {
        mediaPlayer.current.currentTime = 0;
        mediaPlayer.current.load();
        if (isPlaying) {
          mediaPlayer.current.play();
        }
      }
    } else {
      setCurrentModuleIndex(currentModuleIndex - 1);
    }
  };

  const handleEnded = (): void => {
    console.log('song ended');
    handleNextSong();
  };

  useEffect(() => {
    console.log(audioFiles);
  }, []);

  return (
    <>
      <motion.div
        className={styles.musicPlayerContainer}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.musicPlayerLeft}>
          <div className={styles.musicPlayerArtwork}>
            <Image
              // src={image.url}
              // alt={image.name}
              height={60}
              width={60}
            />
          </div>
          <div className={styles.musicPlayerText}>
            <p className={styles.songName}>Song Name</p>
            <p className={styles.artistName}>Artist Name</p>
          </div>
        </div>
        <div className={styles.musicPlayerMiddle}>
          <audio
            onEnded={handleEnded}
            ref={mediaPlayer}
            preload="metadata"
            onDurationChange={(e) => setSongDuration(e.currentTarget.duration)}
            onTimeUpdate={(e) => {
              setMediaProgress(e.currentTarget.currentTime);
              handleBufferProgress(e);
            }}
            onProgress={handleBufferProgress}
          />
          <div className={styles.musicControls}>
            {currentModuleIndex !== -1 ? (
              <button onClick={() => handlePrevSong()}>
                <PrevIcon
                  height={18}
                  width={21}
                  color={'var(--artape-black)'}
                />
              </button>
            ) : (
              ''
            )}

            {isPlaying ? (
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
