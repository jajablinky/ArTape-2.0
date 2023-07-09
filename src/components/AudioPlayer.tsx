import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import styles from '@/styles/Home.module.css';

import Loader from './Loader';
import StopIcon from './Images/UI/StopIcon.tsx';
import PrevIcon from './Images/UI/PrevIcon';
import NextIcon from './Images/UI/NextIcon';
import PlayIcon from './Images/UI/PlayIcon';
import { AudioFileWithFiles } from '@/types/TapeInfo';

interface AudioPlayerProps {
  color: string;
  audioFiles: AudioFileWithFiles[];
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
  const [currentSongIndex, setCurrentSongIndex] = useState<number>(-1);
  const [isPlaying, setisPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(1);
  const [currentSong, setCurrentSong] = useState<AudioFileWithFiles | null>(
    null
  );

  const audioPlayer = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioPlayer.current) {
      audioPlayer.current = new Audio();
    }
    setCurrentSong(audioFiles[currentSongIndex]);

    if (audioPlayer.current && currentSongIndex !== -1 && audioFiles) {
      const currentAudioUrl = audioFiles[currentSongIndex].audioUrl;
      if (currentAudioUrl) {
        audioPlayer.current.removeEventListener('ended', handleEnded);
        audioPlayer.current.src = currentAudioUrl;
        audioPlayer.current.addEventListener('ended', handleEnded);
      }

      if (isPlaying) {
        audioPlayer.current.play();
      } else {
        audioPlayer.current.pause();
      }
    }

    return () => {
      if (audioPlayer.current) {
        audioPlayer.current.removeEventListener('ended', handleEnded);
      }
    };
  }, [currentSongIndex, isPlaying]);

  /* Audio Player Logic */

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);

    if (audioPlayer.current) {
      audioPlayer.current.volume = newVolume;
    }
  };

  const handleStop = (): void => {
    if (audioPlayer.current) {
      if (isPlaying) {
        audioPlayer.current.pause();
        audioPlayer.current.currentTime = 0;
        setCurrentSongIndex(-1);
      }
      setisPlaying(!isPlaying);
    }
  };

  const handleNextSong = (): void => {
    setCurrentSongIndex(
      currentSongIndex === audioFiles.length - 1 ? 0 : currentSongIndex + 1
    );
    setisPlaying(true);
  };

  const handlePrevSong = (): void => {
    if (currentSongIndex === -1) {
      return undefined;
    }
    if (currentSongIndex === 0) {
      if (audioPlayer.current) {
        audioPlayer.current.currentTime = 0;
        if (!isPlaying) {
          setisPlaying(true);
        }
      }
    } else {
      setCurrentSongIndex(currentSongIndex - 1);
    }
  };

  const handleEnded = (): void => {
    handleNextSong();
  };

  const handleTrackSelect = (index: number) => {
    if (index === currentSongIndex) {
      if (audioPlayer.current) {
        if (isPlaying) {
          audioPlayer.current.pause();
        } else {
          audioPlayer.current.play();
        }
      }
      setisPlaying(!isPlaying);
    } else {
      setCurrentSongIndex(index);
      setisPlaying(true);
    }
  };

  useEffect(() => {
    console.log(audioFiles);
  });

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
          <audio onEnded={handleEnded} ref={audioPlayer} />
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
