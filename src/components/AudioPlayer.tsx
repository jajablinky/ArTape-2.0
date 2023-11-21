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

interface AudioPlayerProps {
  color: string;
  audioFiles: AudioFileWithFiles[];
  volume: number;
  setVolume: any;
  mediaProgress: number;
  setMediaProgress: any;
  currentModuleIndex: any;
  setCurrentModuleIndex: any;
}

interface ProgressCSSProps extends React.CSSProperties {
  '--progress-width': number;
  '--buffer-width': number;
}

interface AudioProgressBarProps
  extends React.ComponentPropsWithoutRef<'input'> {
  duration: number;
  currentProgress: number;
  buffered: number;
}

function AudioProgressBar(props: AudioProgressBarProps) {
  const { duration, currentProgress, buffered, ...rest } = props;

  const progressBarWidth = isNaN(currentProgress / duration)
    ? 0
    : currentProgress / duration;
  const bufferedWidth = isNaN(buffered / duration) ? 0 : buffered / duration;

  const progressStyles: ProgressCSSProps = {
    '--progress-width': progressBarWidth,
    '--buffer-width': bufferedWidth,
  };
  return (
    <div className="absolute h-1 -top-[4px] left-0 right-0 group">
      <input
        type="range"
        name="progress"
        style={progressStyles}
        min={0}
        max={duration}
        value={currentProgress}
        {...rest}
      />
    </div>
  );
}

const AudioPlayer = ({
  color,
  audioFiles,
  volume,
  setVolume,
  mediaProgress,
  setMediaProgress,
  currentModuleIndex,
  setCurrentModuleIndex,
}: AudioPlayerProps) => {
  const [audioFetched, setAudioFetched] = useState<boolean>(true);
  const [isPlaying, setisPlaying] = useState<boolean>(false);
  const [currentSong, setCurrentSong] = useState<AudioFileWithFiles | null>(
    null
  );
  const audioPlayer = useRef<HTMLAudioElement | null>(null);
  const [hasPaused, setPause] = useState<boolean>(false);
  const [songDuration, setSongDuration] = useState<number>(0);
  const [bufferProgress, setBufferProgress] = useState<number>(0);

  // check if mouse button held
  const [mouseDown, setMouseDown] = useState<boolean>(false);
  onmousedown = function() {
    setMouseDown(true);
  }
  onmouseup = function() {
    setMouseDown(false);
  }


  useEffect(() => {
    if (!audioPlayer.current) {
      audioPlayer.current = new Audio();
    }
    console.log('useEffect currentModuleIndex:', currentModuleIndex);
    setCurrentSong(audioFiles[currentModuleIndex]);

    if (audioPlayer.current && currentModuleIndex !== -1 && audioFiles) {
      const currentAudioUrl = audioFiles[currentModuleIndex].audioUrl;
      if (currentAudioUrl) {
        console.log(currentSong?.fileName, "'s duration:", songDuration);
        audioPlayer.current.removeEventListener('ended', handleEnded);
        audioPlayer.current.src = currentAudioUrl;
        audioPlayer.current.addEventListener('ended', handleEnded);
      }
      if (isPlaying) audioPlayer.current.play();
    }

    return () => {
      if (audioPlayer.current) {
        audioPlayer.current.removeEventListener('ended', handleEnded);
      }
    };
  }, [currentModuleIndex]);

  /* Audio Player Logic */

  // volume change
  useEffect(() => {
    if (audioPlayer.current) audioPlayer.current.volume = volume;
  }, [volume]);

  // seek bar change
  useEffect(() => {
    if (audioPlayer.current && mouseDown) {
      handlePauseResume('pause');
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

  const handlePauseResume = (input?: string): void => {
    if (!audioPlayer.current) {
      console.log('no audio player');
      return;
    }

    if (isPlaying || input === "pause") {
      //seekTime = audioPlayer.current.currentTime;
      console.log('pause');
      audioPlayer.current?.pause();
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
    if ((!isPlaying && audioPlayer.current.readyState >= 2) || input === "play") {
      //audioPlayer.current.currentTime = seekTime;
      console.log('play');
      audioPlayer.current?.play();
      setisPlaying(true);
    }
  };

  const handleStop = (): void => {
    if (audioPlayer.current) {
      if (isPlaying) {
        console.log('stop');
        audioPlayer.current?.pause();
        setCurrentModuleIndex(0);
        setPause(false);
        audioPlayer.current.currentTime = 0;
      }
      setisPlaying(false);
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
    audioPlayer.current?.load();
    setisPlaying(true);
  };

  // Create handle prev media

  const handlePrevSong = (): void => {
    if (currentModuleIndex === -1) {
      return undefined;
    }
    if (currentModuleIndex === 0) {
      if (audioPlayer.current) {
        audioPlayer.current.currentTime = 0;
        audioPlayer.current.load();
        if (isPlaying) {
          audioPlayer.current.play();
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

  // const handleTrackSelect = (index: number) => {
  //   if (index === currentModuleIndex) {
  //     if (audioPlayer.current) {
  //       if (isPlaying) {
  //         audioPlayer.current.pause();
  //         setisPlaying(false);
  //       } else {
  //         audioPlayer.current.play();
  //         setisPlaying(true);
  //       }
  //     }
  //   } else {
  //     setCurrentModuleIndex(index);
  //     setisPlaying(true);
  //   }
  // };

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

export default AudioPlayer;
