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
              3 songs, 4:37 minutes
            </p>
            <p className={styles.artapeLink}>Watch Me Blue</p>
          </div>
          <AudioPlayer
            index={1}
            isPlaying={isPlaying}
            setisPlaying={setisPlaying}
            audioLink={
              "https://5jxkaucpt4jq2n5ceypa7tijr2vrqcrcgx567hisii27hymlqz2a.arweave.net/6m6gUE-fEw03oiYeD80JjqsYCiI1---dEkI18-GLhnQ"
            }
            songMetaData={"Blue Cowboy"}
          />
          <AudioPlayer
            index={2}
            isPlaying={isPlaying}
            setisPlaying={setisPlaying}
            audioLink={
              "https://cxdvxsxj6ps45rqsdjnskvgl2n3cc6bvohej5l27w7oof76rhcya.arweave.net/Fcdbyunz5c7GEhpbJVTL03YheDVxyJ6vX7fc4v_ROLA"
            }
            songMetaData={"American Pie"}
          />
          <AudioPlayer
            index={3}
            isPlaying={isPlaying}
            setisPlaying={setisPlaying}
            audioLink={
              "https://4hyskfaoe726dpdaczx3dmpswrqj4uydukvzozsuewmcan6wsovq.arweave.net/4fElFA4n9eG8YBZvsbHytGCeUwOiq5dmVCWYIDfWk6s"
            }
            songMetaData={"New Boots"}
          />
        </div>
      </main>
    </>
  );
}
