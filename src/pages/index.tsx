import Head from "next/head";

import styles from "@/styles/Home.module.css";
import AudioPlayer from "@/components/AudioPlayer";
import { useState } from "react";

type SetisPlaying = (value: number) => void;

export default function Home() {
  // 0 === !isPlaying
  const [isPlaying, setisPlaying] = useState<number>(0);

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
            <p className={styles.amountSongTotalDuration}>
              3 songs, 59:56 minutes
            </p>
            <p className={styles.artapeLink}>ARTAPE</p>
          </div>
          <AudioPlayer
            index={1}
            isPlaying={isPlaying}
            setisPlaying={setisPlaying}
          />
          <AudioPlayer
            index={2}
            isPlaying={isPlaying}
            setisPlaying={setisPlaying}
          />
          <AudioPlayer
            index={3}
            isPlaying={isPlaying}
            setisPlaying={setisPlaying}
          />
        </div>
      </main>
    </>
  );
}
