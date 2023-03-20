import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import styles from "@/styles/Home.module.css";
import Image from "next/image";

interface Song {
  title: string;
  src: string;
}

const songs: Song[] = [
  {
    title: "Blue Cowboy",
    src: "https://5jxkaucpt4jq2n5ceypa7tijr2vrqcrcgx567hisii27hymlqz2a.arweave.net/6m6gUE-fEw03oiYeD80JjqsYCiI1---dEkI18-GLhnQ",
  },
  {
    title: "Dearly Departed",
    src: "https://cxdvxsxj6ps45rqsdjnskvgl2n3cc6bvohej5l27w7oof76rhcya.arweave.net/Fcdbyunz5c7GEhpbJVTL03YheDVxyJ6vX7fc4v_ROLA",
  },
  {
    title: "Helmut Lang",
    src: "https://4hyskfaoe726dpdaczx3dmpswrqj4uydukvzozsuewmcan6wsovq.arweave.net/4fElFA4n9eG8YBZvsbHytGCeUwOiq5dmVCWYIDfWk6s",
  },
];

const AudioPlayer = () => {
  const [currentSongIndex, setCurrentSongIndex] = useState<number>(-1);
  const [isPlaying, setisPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(1);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);

  const audioPlayer = useRef<HTMLAudioElement | null>(null);
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);

    if (audioPlayer.current) {
      audioPlayer.current.volume = newVolume;
    }
  };

  useEffect(() => {
    if (!audioPlayer.current) {
      audioPlayer.current = new Audio();
    }
    setCurrentSong(songs[currentSongIndex]);

    if (audioPlayer.current && currentSongIndex !== -1) {
      audioPlayer.current.removeEventListener("ended", handleEnded);
      audioPlayer.current.src = songs[currentSongIndex].src;
      audioPlayer.current.addEventListener("ended", handleEnded);

      if (isPlaying) {
        audioPlayer.current.play();
      } else {
        audioPlayer.current.pause();
      }
    }

    return () => {
      if (audioPlayer.current) {
        audioPlayer.current.removeEventListener("ended", handleEnded);
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
      currentSongIndex === songs.length - 1 ? 0 : currentSongIndex + 1
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
          <h2 className={styles.profileName}>SO LOKI</h2>
          <p className={styles.amounttotalDuration}>3 songs, 4:37 minutes</p>
          <p className={styles.artapeLink}>Watch Me Blue</p>
          <p className={styles.currentSongTitle}>{currentSong?.title}</p>
          {currentSongIndex !== -1 ? (
            <button onClick={() => handlePrevSong()}>Prev Song</button>
          ) : (
            ""
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
        {songs.map((song: Song, index: number) => (
          <button
            className={styles.musicPlayerTrack}
            key={index}
            onClick={() => handleTrackSelect(index)}
          >
            <div className={styles.musicPlayerLeftSide}>
              <div className={styles.songArt}></div>
              <div className={styles.musicInfo}>
                <div className={styles.artistTitleTrack}>
                  <h1>{song.title}</h1>
                </div>
                <div className={styles.durationBuyMp3}>
                  <p>
                    <span className={styles.duration}>1:30</span>
                  </p>
                </div>
              </div>
            </div>
            <div className={styles.musicPlayerRightSide}>
              <div className={styles.playButton}>
                {isPlaying && currentSongIndex === index ? (
                  <Image
                    src={"/stopButton.svg"}
                    alt={"Stop Button"}
                    width={25.5}
                    height={25.5}
                  />
                ) : (
                  <Image
                    src={"/startButton.svg"}
                    alt={"Play Button"}
                    width={25.5}
                    height={25.5}
                  />
                )}
              </div>
            </div>
          </button>
        ))}
      </motion.div>
    </>
  );
};

export default AudioPlayer;
