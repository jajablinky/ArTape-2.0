import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import styles from '@/styles/Home.module.css';
import Image from 'next/image';
import { Akord } from '@akord/akord-js';
import tapeInfo from '../tapeInfo.json';

interface Track {
  track_number: number;
  title: string;
  duration: number;
  id: string;
  artist: string;
  src: string;
}

interface Tape {
  id: string;
  title: string;
  type: string;
  duration: string;
  tracks: Track[];
}

function formatToMinutes(duration: number) {
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;
  const durationFormatted = `${minutes}:${seconds
    .toString()
    .padStart(2, '0')}`;
  return durationFormatted;
}

function totalTapeLength(tape: Tape): string {
  let totalDuration = 0;

  for (const track of tape.tracks) {
    totalDuration += track.duration;
  }

  const minutes = Math.floor(totalDuration / 60);
  const seconds = totalDuration % 60;

  const totalDurationFormatted = `${minutes}:${seconds
    .toString()
    .padStart(2, '0')}`;
  return totalDurationFormatted;
}

const tape: Tape[] = {
  id: tapeInfo.tape.id,
  title: tapeInfo.tape.title,
  type: tapeInfo.tape.type,
  length: tapeInfo.tape.length,
  duration: totalTapeLength(tapeInfo.tape),
  tracks: tapeInfo.tape.tracks,
};

const AudioPlayer = ({ akord }) => {
  const [audioFetched, setAudioFetched] = useState<boolean>(false);

  const [vaultName, setVaultName] = useState<string>('');
  const [currentSongIndex, setCurrentSongIndex] =
    useState<number>(-1);
  const [isPlaying, setisPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(1);
  const [currentSong, setCurrentSong] = useState<Track | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const audioPlayer = useRef<HTMLAudioElement | null>(null);
  const handleVolumeChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);

    if (audioPlayer.current) {
      audioPlayer.current.volume = newVolume;
    }
  };

  // fetching audio
  useEffect(() => {
    const fetchAuthData = async () => {
      try {
        console.log('fetching');
        // Getting List of Vaults
        const vaults = await akord.vault.list();
        const vaultId = await vaults[0].id;

        // Getting list of items within Vault
        const { items } = await akord.stack.list(vaultId);
        const audioUrls = [];
        for (let i = 0; i < items.length; i++) {
          // Cycle through items to get IDs if they are audio objects
          if (items[i].name === 'tapeInfo.json') {
            const tapeInfoId = await items[i].id;
          }
          if (items[i].versions[0].type === 'audio/wav') {
            const audioId = await items[i].id;
            const { data: decryptedAudio } =
              await akord.stack.getVersion(audioId);
            const blobUrl = URL.createObjectURL(
              new Blob([decryptedAudio])
            );
            audioUrls[i] = blobUrl;
          }
        }

        // Update the tape.tracks array with the fetched URLs
        const updatedTracks = await tape.tracks.map((track) => ({
          ...track,
          src: audioUrls[track.track_number],
        }));
        tape.tracks = updatedTracks;
        setAudioFetched(true);
      } catch (error) {
        console.error(error);
      }
    };

    fetchAuthData();
  }, [akord]);

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
        <div className={styles.musicPlayerHeader}>
          <audio onEnded={handleEnded} ref={audioPlayer} />
          <h2 className={styles.profileName}>{tape.title}</h2>
          <p className={styles.amounttotalDuration}>
            `{tape.length} tracks, {tape.duration} Duration`
          </p>
          <p className={styles.artapeLink}>{}</p>
          <p className={styles.currentSongTitle}>
            {currentSong?.title}
          </p>
          {currentSongIndex !== -1 ? (
            <button onClick={() => handlePrevSong()}>
              Prev Song
            </button>
          ) : (
            ''
          )}
          <button onClick={() => handleNextSong()}>Next Song</button>
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
                  <div className={styles.songArt}></div>
                  <div className={styles.musicInfo}>
                    <div className={styles.artistTitleTrack}>
                      <h1>{track.title}</h1>
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
                  <div className={styles.playButton}>
                    {isPlaying && currentSongIndex === index ? (
                      <Image
                        src={'/stopButton.svg'}
                        alt={'Stop Button'}
                        width={25.5}
                        height={25.5}
                      />
                    ) : (
                      <Image
                        src={'/startButton.svg'}
                        alt={'Play Button'}
                        width={25.5}
                        height={25.5}
                      />
                    )}
                  </div>
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
          <p>'loading'</p>
        )}
      </motion.div>
    </>
  );
};

export default AudioPlayer;
