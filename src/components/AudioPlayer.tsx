import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import styles from '@/styles/Home.module.css';

import Loader from './Loader';
import StopIcon from './Images/UI/StopIcon';
import PrevIcon from './Images/UI/PrevIcon';
import NextIcon from './Images/UI/NextIcon';
import PlayIcon from './Images/UI/PlayIcon';
import PauseIcon from './Images/UI/PauseIcon';
import { AudioFileWithFiles } from '@/types/TapeInfo';
import ProgressBar from './ProgressBar';

interface AudioPlayerProps {
  color: string;
  audioFiles: AudioFileWithFiles[];
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

function formatToMinutes(duration: number): string {
  const minutes: number = Math.floor(duration / 60);
  const seconds: number = Math.round(duration % 60);
  const durationFormatted: string = `${minutes}:${seconds
    .toString()
    .padStart(2, '0')}`;
  return durationFormatted;
}

// function totalTapeLength(tapeInfo: TapeInfo): string {
//   let totalDuration = 0;

//   for (const track of tapeInfo.audioFiles) {
//     totalDuration += track.duration;
//   }

//   return formatToMinutes(totalDuration);
// }

const AudioPlayer = ({ color, audioFiles }: AudioPlayerProps) => {
  const [audioFetched, setAudioFetched] = useState<boolean>(true);
  const [currentSongIndex, setCurrentSongIndex] = useState<number>(0);
  const [isPlaying, setisPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(1);
  const [currentSong, setCurrentSong] = useState<AudioFileWithFiles | null>(
    null
  );

  const audioPlayer = useRef<HTMLAudioElement | null>(null);
  const [hasPaused, setPause] = useState<boolean>(false);
  const [storedIndex, setStoredIndex] = useState<number | null>(null);
  const [songDuration, setSongDuration] = useState<number>(0);
  const [currentProgress, setCurrentProgress] = useState<number>(0);
  const [bufferProgress, setBufferProgress] = useState<number>(0);

  useEffect(() => {
    if (!audioPlayer.current) {
      audioPlayer.current = new Audio();
    }
    console.log('useEffect currentSongIndex:', currentSongIndex);
    setCurrentSong(audioFiles[currentSongIndex]);

    if (audioPlayer.current && currentSongIndex !== -1 && audioFiles) {
      const currentAudioUrl = audioFiles[currentSongIndex].audioUrl;
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
  }, [currentSongIndex]);

  /* Audio Player Logic */

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);

    if (audioPlayer.current) {
      audioPlayer.current.volume = newVolume;
    }
  };

  const handleProgressChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const newProgress = parseFloat(e.target.value);
    setCurrentProgress(newProgress);

    if (audioPlayer.current) {
      audioPlayer.current.currentTime = newProgress;
    }
  };

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

  const handlePauseResume = (): void => {
    if (!audioPlayer.current) {
      console.log('no audio player');
      return;
    }

    if (isPlaying) {
      //seekTime = audioPlayer.current.currentTime;
      console.log('pause');
      audioPlayer.current?.pause();
      console.log('pre check:', hasPaused);
      if (!hasPaused) {
        console.log('first pause');
        setStoredIndex(currentSongIndex);
        setPause(true);
      } else {
        console.log('already paused before!');
      }
      console.log('post check:', hasPaused);
      console.log('current stored index:', storedIndex);
      setisPlaying(false);
    }
    if (!isPlaying && audioPlayer.current.readyState >= 2) {
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
        setCurrentSongIndex(0);
        setPause(false);
        audioPlayer.current.currentTime = 0;
      }
      setisPlaying(false);
    }
  };

  const handleNextSong = (): void => {
    if (hasPaused) {
      setPause(false);
      console.log('setting index to', storedIndex);
      setCurrentSongIndex(storedIndex);
      console.log('has paused current song index:', currentSongIndex);
      setStoredIndex(null);
    }

    console.log('current index:', currentSongIndex);
    setCurrentSongIndex(
      currentSongIndex === audioFiles.length - 1 ? 0 : currentSongIndex + 1
    );
    console.log('loading song', currentSongIndex);
    audioPlayer.current?.load();
    setisPlaying(true);
  };

  const handlePrevSong = (): void => {
    if (currentSongIndex === -1) {
      return undefined;
    }
    if (currentSongIndex === 0) {
      if (audioPlayer.current) {
        audioPlayer.current.currentTime = 0;
        audioPlayer.current.load();
        if (!isPlaying) {
          setisPlaying(true);
        }
      }
    } else {
      setCurrentSongIndex(currentSongIndex - 1);
    }
  };

  const handleEnded = (): void => {
    console.log('song ended');
    handleNextSong();
  };

  const handleTrackSelect = (index: number) => {
    if (index === currentSongIndex) {
      if (audioPlayer.current) {
        if (isPlaying) {
          audioPlayer.current.pause();
          setisPlaying(false);
        } else {
          audioPlayer.current.play();
          setisPlaying(true);
        }
      }
    } else {
      setCurrentSongIndex(index);
      setisPlaying(true);
    }
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
        <div
          className={styles.musicPlayerHeader}
          style={{
            position: 'sticky',
            top: '0',
          }}
        >
          <audio
            onEnded={handleEnded}
            ref={audioPlayer}
            preload="metadata"
            onDurationChange={(e) => setSongDuration(e.currentTarget.duration)}
            onTimeUpdate={(e) => {
              setCurrentProgress(e.currentTarget.currentTime);
              handleBufferProgress(e);
            }}
            onProgress={handleBufferProgress}
          />
          <div className={styles.musicControls}>
            {currentSongIndex !== -1 ? (
              <button onClick={() => handlePrevSong()}>
                <PrevIcon
                  height={30}
                  width={30}
                  color={'var(--artape-primary-color)'}
                />
              </button>
            ) : (
              ''
            )}

            {isPlaying ? (
              <button onClick={() => handlePauseResume()}>
                <PauseIcon
                  height={30}
                  width={30}
                  color={'var(--artape-primary-color)'}
                />
              </button>
            ) : (
              <button onClick={() => handlePauseResume()}>
                <PlayIcon
                  height={30}
                  width={30}
                  color={'var(--artape-primary-color)'}
                />
              </button>
            )}

            {isPlaying ? (
              <button onClick={() => handleStop()}>
                <StopIcon
                  height={30}
                  width={30}
                  color={'var(--artape-primary-color)'}
                />
              </button>
            ) : null}
            <button
              onClick={() => handleNextSong()}
              style={{ color: 'var(--artape-primary-color)' }}
            >
              <NextIcon
                height={30}
                width={30}
                color={'var(--artape-primary-color)'}
              />
            </button>
          </div>
          <input
            type="range"
            name="progress"
            min="0"
            max={songDuration}
            step="0.01"
            value={currentProgress}
            onChange={handleProgressChange}
            className={styles.ProgressBar}
          />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className={styles.volumeSlider}
          />
        </div>

        {audioFetched ? (
          audioFiles.map((audioFile, index: number) => (
            <div key={index} className={styles.trackContainer}>
              <button
                className={styles.musicPlayerTrack}
                key={index}
                onClick={() => handleTrackSelect(index)}
              >
                <div className={styles.musicPlayerLeftSide}>
                  <div
                    className={styles.songArt}
                    style={{
                      backgroundImage: `url(${audioFiles[index].albumPictureUrl})`,
                      objectFit: 'cover',
                    }}
                  ></div>
                  <div className={styles.musicInfo}>
                    <div className={styles.artistTitleTrack}>
                      <p>{audioFile.artistName}</p>
                      <h2>{audioFile.name}</h2>
                    </div>
                    <div className={styles.durationBuyMp3}>
                      <p>
                        <span className={styles.duration}>
                          {formatToMinutes(audioFile.duration)}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className={styles.musicPlayerRightSide}>
                  {isPlaying && currentSongIndex === index ? (
                    <StopIcon
                      height={15}
                      width={15}
                      color={'var(--artape-primary-color)'}
                    />
                  ) : (
                    <PlayIcon
                      height={15}
                      width={15}
                      color={'var(--artape-primary-color)'}
                    />
                  )}
                </div>
              </button>
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
      </motion.div>
    </>
  );
};

export default AudioPlayer;
