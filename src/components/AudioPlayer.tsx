import React from "react";
import { SetStateAction, Dispatch } from "react";

import styles from "@/styles/Home.module.css";
import Image from "next/image";

const AudioPlayer = ({
  index,
  isPlaying,
  setisPlaying,
}: {
  index: number;
  isPlaying: number;
  setisPlaying: Dispatch<SetStateAction<number>>;
}) => {
  const handlePlay = () => {
    if (isPlaying === index) {
      setisPlaying(0);
    } else {
      setisPlaying(index);
    }
  };

  return (
    <button className={styles.musicPlayerTrack} onClick={() => handlePlay()}>
      <source src="https://wghl3omv7p34qicdhl4iwe545yuqorbg6xz2ewdndenxeqivxo3q.arweave.net/sY69uZX798ggQzr4ixO87ikHRCb186JYbRkbckEVu7c" />
      <div className={styles.musicPlayerLeftSide}>
        <div className={styles.artistTitleTrack}>
          <h1>Foo Fighters - Best of You</h1>
        </div>
        <div className={styles.durationBuyMp3}>
          <p>
            <span className={styles.duration}>4:14</span> -{" "}
            <span className={styles.buymp3}>PLAY THIS SONG</span>
          </p>
        </div>
      </div>
      <div className={styles.musicPlayerRightSide}>
        <div className={styles.playButton}>
          {isPlaying !== index ? (
            <Image
              src={"/startButton.svg"}
              alt={"Play Button"}
              width={25.5}
              height={25.5}
            />
          ) : (
            <Image
              src={"/stopButton.svg"}
              alt={"Stop Button"}
              width={25.5}
              height={25.5}
            />
          )}
        </div>
      </div>
    </button>
  );
};

export default AudioPlayer;
