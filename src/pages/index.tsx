import Head from "next/head";

import { Inter } from "@next/font/google";
import styles from "@/styles/Home.module.css";
import AudioPlayer from "@/components/AudioPlayer";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <Head>
        <title>ArTape</title>
        <meta name="description" content="Modern Web3 listening" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className="App">
          <div className="music-player-container">
            <div className="music-player-header">
              <h2 className="profile-name">SO LOKI</h2>
              <p className="amount-songs-total-duration">
                3 songs, 59:56 minutes
              </p>
              <p className="artape-link">ARTAPE</p>
            </div>
            <AudioPlayer />
            <AudioPlayer />
            <AudioPlayer />
          </div>
        </div>
      </main>
    </>
  );
}
