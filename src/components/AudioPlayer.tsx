import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import styles from '@/styles/Home.module.css';
import Image from 'next/image';
import Loader from './Loader';

interface Track {
  track_number: number;
  title: string;
  duration: number;
  id: string;
  artist: string;
  src: string;
}

interface Tape {
  title: string;
  length: number;
  type: string;
  duration: string;
  tracks: Track[]; // Add the tracks property here
}

interface TapeInfo {
  tapeArtistName: string;
  type: string;
  audioFiles: {
    trackNumber: number;
    name: string;
    duration: number;
    artistName: string;
  }[];
}

export interface AudioFile {
  name: string;
  url: string;
}

export interface AlbumPictureFile {
  name: string;
  url: string | null;
}

interface AudioPlayerProps {
  tapeInfoJSON: TapeInfo;
  audioFiles: AudioFile[];
  albumPicture: AlbumPictureFile;
}

function formatToMinutes(duration: number): string {
  const minutes: number = Math.floor(duration / 60);
  const seconds: number = Math.round(duration % 60);
  const durationFormatted: string = `${minutes}:${seconds
    .toString()
    .padStart(2, '0')}`;
  return durationFormatted;
}

function totalTapeLength(tapeInfo: TapeInfo): string {
  let totalDuration = 0;

  for (const track of tapeInfo.audioFiles) {
    totalDuration += track.duration;
  }

  return formatToMinutes(totalDuration);
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({
  tapeInfoJSON,
  audioFiles,
  albumPicture,
}) => {
  const [tape, setTape] = useState<Tape>({
    title: tapeInfoJSON.tapeArtistName,
    length: tapeInfoJSON.audioFiles.length,
    type: tapeInfoJSON.type,
    duration: totalTapeLength(tapeInfoJSON),
    tracks: audioFiles.map((audioFile) => {
      const audioInfo = tapeInfoJSON.audioFiles.find(
        (item) => item.name + '.mp3' === audioFile.name
      ) || { trackNumber: 0, name: '', duration: 0, artistName: '' };
      return {
        track_number: audioInfo.trackNumber,
        title: audioInfo.name,
        duration: audioInfo.duration,
        id: audioInfo.trackNumber.toString(),
        artist: audioInfo.artistName,
        src: audioFile.url,
      };
    }),
  });

  const [audioFetched, setAudioFetched] = useState<boolean>(true);
  const [currentSongIndex, setCurrentSongIndex] = useState<number>(-1);
  const [isPlaying, setisPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(1);
  const [currentSong, setCurrentSong] = useState<Track | null>(null);

  const audioPlayer = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    console.log('Tape Use Effect: ', tape);
    console.log('AlbumPicture: ', albumPicture);
  }, [tape, albumPicture]);

  useEffect(() => {
    if (!audioPlayer.current) {
      audioPlayer.current = new Audio();
    }
    setCurrentSong(tape.tracks[currentSongIndex]);

    if (audioPlayer.current && currentSongIndex !== -1) {
      audioPlayer.current.removeEventListener('ended', handleEnded);
      audioPlayer.current.src = tape.tracks[currentSongIndex].src;
      audioPlayer.current.addEventListener('ended', handleEnded);

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
      currentSongIndex === tape.length - 1 ? 0 : currentSongIndex + 1
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
          <p className={styles.amounttotalDuration}>
            `{tape.length} tracks, {tape.duration} tape length`
          </p>
          <p className={styles.artapeLink}>{}</p>
          <p className={styles.currentSongTitle}>{currentSong?.title}</p>
          {currentSongIndex !== -1 ? (
            <button onClick={() => handlePrevSong()}>Prev Song</button>
          ) : (
            ''
          )}
          <button
            onClick={() => handleNextSong()}
            style={{ color: 'var(--artape-primary-color)' }}
          >
            Next Song
          </button>
          {isPlaying ? (
            <button onClick={() => handleStop()}>Stop</button>
          ) : null}
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
          tape.tracks.map((track: Track, index: number) => (
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
                      backgroundImage: `url(${albumPicture.url})`,
                      objectFit: 'cover',
                    }}
                  ></div>
                  <div className={styles.musicInfo}>
                    <div className={styles.artistTitleTrack}>
                      <p>{track.artist}</p>
                      <h2>{track.title}</h2>
                    </div>
                    <div className={styles.durationBuyMp3}>
                      <p>
                        <span className={styles.duration}>
                          {formatToMinutes(track.duration)}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className={styles.musicPlayerRightSide}>
                  {isPlaying && currentSongIndex === index ? (
                    <Image
                      src={'/stopButton.svg'}
                      alt={'Stop Button'}
                      width={20}
                      height={20}
                    />
                  ) : (
                    <Image
                      src={'/startButton.svg'}
                      alt={'Play Button'}
                      width={20}
                      height={20}
                    />
                  )}
                </div>
              </button>
              {audioFetched && (
                <audio>
                  <source src={track.src} type="audio/mpeg" />
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
