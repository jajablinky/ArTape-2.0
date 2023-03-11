import React from "react";
import { SetStateAction, Dispatch } from "react";

import styles from "@/styles/Home.module.css";
import Image from "next/image";

const AudioPlayer = ({
  index,
  isPlaying,
  setisPlaying,
  audioLink,
  songMetaData,
}: {
  index: number;
  isPlaying: number;
  setisPlaying: Dispatch<SetStateAction<number>>;
  audioLink: string;
  songMetaData: string;
}) => {
  const handlePlay = () => {
    const audio = document.getElementById(songMetaData);
    if (isPlaying === index) {
      setisPlaying(0);
      audio.pause();
      audio.currentTime = 0;
    } else {
      setisPlaying(index);
      audio.play();
    }
  };

  return (
    <>
      <audio id={songMetaData} src={audioLink} preload="metadata"></audio>
      <button className={styles.musicPlayerTrack} onClick={() => handlePlay()}>
        <div className={styles.musicPlayerLeftSide}>
          <div className={styles.songArt}></div>
          <div className={styles.musicInfo}>
            <div className={styles.artistTitleTrack}>
              <h1>{songMetaData}</h1>
            </div>
            <div className={styles.durationBuyMp3}>
              <p>
                <span className={styles.duration}>4:14</span>
              </p>
            </div>
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
    </>
  );
};

export default AudioPlayer;
