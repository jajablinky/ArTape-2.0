import Head from "next/head";

import styles from "@/styles/Home.module.css";
import { useEffect, useRef, useState } from "react";

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

export default function Home() {
  const [currentSongIndex, setCurrentSongIndex] = useState<number>(0);
  const [isPlaying, setisPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(1);

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

    if (audioPlayer.current) {
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

  const handlePlayPause = (): void => {
    if (audioPlayer.current) {
      if (isPlaying) {
        audioPlayer.current.pause();
      } else {
        audioPlayer.current.play();
      }
      setisPlaying(!isPlaying);
    }
  };

  const handleStop = (): void => {
    if (audioPlayer.current) {
      if (isPlaying) {
        audioPlayer.current.pause();
        audioPlayer.current.currentTime = 0;
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
    setCurrentSongIndex(index);
    setisPlaying(true);
  };

  return (
    <>
      <Head>
        <title>ArTape</title>
        <meta name="description" content="Modern Web3 listening" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.musicPlayerContainer}>
          <div className={styles.musicPlayerHeader}>
            <h2 className={styles.profileName}>SO LOKI</h2>
            <p className={styles.amounttotalDuration}>3 songs, 4:37 minutes</p>
            <p className={styles.artapeLink}>Watch Me Blue</p>
            <button onClick={() => handlePrevSong()}>Prev Song</button>
            <button onClick={() => handleNextSong()}>Next Song</button>
            <button onClick={() => handlePlayPause()}>
              {isPlaying ? "Pause" : "Play"}
            </button>
            {isPlaying ? (
              <button onClick={() => handleStop()}>"Stop"</button>
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
          <audio onEnded={handleEnded} ref={audioPlayer} />
          <ul>
            {songs.map((song: Song, index: number) => (
              <li
                style={{ cursor: "pointer" }}
                key={index}
                onClick={() => handleTrackSelect(index)}
              >
                {song.title}
              </li>
            ))}
          </ul>
        </div>
      </main>
    </>
  );
}
