import React, { useEffect, useRef, useState } from "react";
import { SetStateAction, Dispatch } from "react";

import styles from "@/styles/Home.module.css";
import Image from "next/image";

interface AudioPlayerProps {
  trackNumber: number;
  isPlaying: number;
  setisPlaying: Dispatch<SetStateAction<number>>;
  audioLink: string;
  songTitle: string;
  audioListLength: number;
}

const AudioPlayer = ({
  trackNumber,
  isPlaying,
  setisPlaying,
  audioLink,
  songTitle,
  audioListLength,
}: AudioPlayerProps) => {
  const [duration, setDuration] = useState("");

  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.addEventListener("loadedmetadata", () => {
        const seconds = audio.duration;
        let minutes = Math.floor(seconds / 60);
        minutes = minutes < 10 ? 0 + minutes : minutes;
        let extraSeconds = Math.floor(seconds % 60);
        extraSeconds = extraSeconds < 10 ? 0 + extraSeconds : extraSeconds;
        setDuration(`${minutes}:${extraSeconds}`);
      });
    }
  }, [audioRef]);

  const handleDuration = () => {
    return duration;
  };

  const handlePlay = (trackNumber: number) => {
    const audio = audioRef.current;
    if (audio) {
      if (isPlaying === trackNumber) {
        if (audio.paused) {
          audio.currentTime = 0;
          audio.play();
          setisPlaying(trackNumber);
        } else {
          audio.pause();
        }
      } else {
        audio.currentTime = 0;
        audio.play();
        setisPlaying(trackNumber);
      }
    }
  };

  const handleEnded = () => {
    if (trackNumber + 1 < audioListLength) {
      setisPlaying(trackNumber + 1);
    } else {
      setisPlaying(0);
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        id={`audio-${trackNumber}`}
        src={audioLink}
        preload="metadata"
        onEnded={handleEnded}
      ></audio>
      <button
        className={styles.musicPlayerTrack}
        onClick={() => handlePlay(trackNumber)}
      >
        <div className={styles.musicPlayerLeftSide}>
          <div className={styles.songArt}></div>
          <div className={styles.musicInfo}>
            <div className={styles.artistTitleTrack}>
              <h1>{songTitle}</h1>
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
            {isPlaying !== trackNumber ? (
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
