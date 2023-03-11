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
  const audio = document.getElementById(songMetaData) as
    | HTMLAudioElement
    | null
    | undefined;
  const handlePlay = () => {
    if (isPlaying === index) {
      if (audio) {
        setisPlaying(0);
        audio?.pause();
        audio.currentTime = audio?.currentTime ?? 0;
      }
    } else {
      setisPlaying(index);
      audio?.play();
    }
  };

  const handleDuration = () => {
    if (audio) {
      const seconds = audio?.duration;
      let minutes = Math.floor(seconds / 60);
      minutes = minutes < 10 ? 0 + minutes : minutes;
      let extraSeconds = Math.floor(seconds % 60);
      extraSeconds = extraSeconds < 10 ? 0 + extraSeconds : extraSeconds;
      return `${minutes}:${extraSeconds}`;
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
                <span className={styles.duration}>{handleDuration()}</span>
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
