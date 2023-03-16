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
  const audioPlayer = useRef<HTMLAudioElement>(new Audio());

  useEffect(() => {
    audioPlayer.current.src = songs[currentSongIndex].src;
    if (isPlaying) {
      audioPlayer.current.play();
    } else {
      audioPlayer.current.pause();
    }
  }, [currentSongIndex, isPlaying]);

  const handlePlayPause = (): void => {
    setisPlaying(!isPlaying);
  };

  const handleNextSong = (): void => {
    setCurrentSongIndex(
      currentSongIndex === songs.length - 1 ? 0 : currentSongIndex + 1
    );
  };

  const handlePrevSong = (): void => {
    setCurrentSongIndex(currentSongIndex === 0 ? 0 : currentSongIndex - 1);
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
          </div>
          <audio onEnded={handleEnded} ref={audioPlayer} />
          <ul>
            {songs.map((song: Song, index: number) => (
              <li key={index} onClick={() => handleTrackSelect(index)}>
                {song.title}
              </li>
            ))}
          </ul>
        </div>
      </main>
    </>
  );
}
