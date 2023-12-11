import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import styles from "@/styles/Home.module.css";

import Loader from "./Loader";

import PrevIcon from "./Images/UI/PrevIcon";
import NextIcon from "./Images/UI/NextIcon";
import PlayIcon from "./Images/UI/PlayIcon";
import PauseIcon from "./Images/UI/PauseIcon";
import { AudioFileWithFiles } from "@/types/TapeInfo";
import { MediaClickType } from "@/pages/tape/[id]";

import Image from "next/image";
import VolumeSlider from "./VolumeSlider";
import MediaProgressBar from "./MediaProgressBar";

interface MediaPlayerProps {
  color: string;
  audioFiles: AudioFileWithFiles[];
  volume: number;
  setVolume: React.Dispatch<React.SetStateAction<number>>;
  mediaProgress: number;
  setMediaProgress: React.Dispatch<React.SetStateAction<number>>;
  storedMediaProgress: number;
  setStoredMediaProgress: React.Dispatch<React.SetStateAction<number>>;
  currentModuleIndex: number;
  setCurrentModuleIndex: React.Dispatch<React.SetStateAction<number>>;
  mediaSelected: string;
  setMediaSelected: React.Dispatch<React.SetStateAction<string>>;
  isVideoPlaying: boolean;
  setIsVideoPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  isMediaPlaying: boolean;
  setIsMediaPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  mediaClickType: MediaClickType;
  setMediaClickType: React.Dispatch<React.SetStateAction<MediaClickType>>;
  lastSelectedMedia: number;
}

const MediaPlayer = ({
  color,
  audioFiles,
  volume,
  setVolume,
  mediaProgress,
  setMediaProgress,
  storedMediaProgress,
  setStoredMediaProgress,
  currentModuleIndex,
  setCurrentModuleIndex,
  mediaSelected,
  setMediaSelected,
  isVideoPlaying,
  setIsVideoPlaying,
  isMediaPlaying,
  setIsMediaPlaying,
  mediaClickType,
  setMediaClickType,
  lastSelectedMedia,
}: MediaPlayerProps) => {
  const [audioFetched, setAudioFetched] = useState<boolean>(true);

  // need to raise this to [id] file
  //const [isMediaPlaying, setIsMediaPlaying] = useState<boolean>(false);

  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const audioPlayer = useRef<HTMLAudioElement | null>(null);
  const [songDuration, setSongDuration] = useState<number>(0);
  const [bufferProgress, setBufferProgress] = useState<number>(0);

  // check if mouse button held
  const [mouseDown, setMouseDown] = useState<boolean>(false);
  onmousedown = function () {
    setMouseDown(true);
  };
  onmouseup = function () {
    setMouseDown(false);
  };

  useEffect(() => {
    // This useEffect is for audio only
    console.log('sample text');
    if (!audioPlayer.current) {
      audioPlayer.current = new Audio();
    }

    // load music
    if (
      (mediaSelected === "audio" &&
        mediaClickType.clickType === "audioModule" &&
        lastSelectedMedia !== currentModuleIndex) ||
      (mediaClickType.clickType === "player" &&
        (mediaClickType.button === "prev" || mediaClickType.button === "next"))
    ) {
      //setCurrentSong(currentModuleIndex);

      if (audioPlayer.current && currentModuleIndex !== -1 && audioFiles) {
        const currentAudioUrl = audioFiles[currentModuleIndex].audioUrl;
        if (currentAudioUrl) {
          audioPlayer.current.removeEventListener("ended", handleEnded);
          audioPlayer.current.src = currentAudioUrl;
          audioPlayer.current.addEventListener("ended", handleEnded);
        }

        if (currentModuleIndex !== 1) {
          console.log("index selected is for audio");
          setIsAudioPlaying(true);
          setIsMediaPlaying(true);
          audioPlayer.current.play();
        } else {
          console.log("index selected is for video");
          setIsAudioPlaying(false);
          setIsMediaPlaying(true);
          audioPlayer.current.pause();
        }
      }

      // make a case for mediaSelected being video to make sure audio isn't playing

      return () => {
        if (audioPlayer.current) {
          audioPlayer.current.removeEventListener("ended", handleEnded);
        }
        // if (
        //   mediaClickType.button !== "none" ||
        //   mediaClickType.clickType !== "none"
        // )
        //   setMediaClickType({ button: "none", clickType: "none" });
      };
    } else if (
      lastSelectedMedia === currentModuleIndex &&
      mediaClickType.button !== "none" &&
      mediaClickType.button !== "init" &&
      mediaClickType.clickType === 'audioModule'
    ) {
      if (isAudioPlaying) {
        audioPlayer.current?.pause();
        setIsAudioPlaying(false);
        setIsMediaPlaying(false);
      } else {
        audioPlayer.current?.play();
        setIsAudioPlaying(true);
        setIsMediaPlaying(true);
      }
      // return () => {
      //   if (
      //     mediaClickType.button !== "none" ||
      //     mediaClickType.clickType !== "none"
      //   )
      //     setMediaClickType({ button: "none", clickType: "none" });
      // };
    } else if (mediaSelected === "video" && lastSelectedMedia === currentModuleIndex) {
      setIsAudioPlaying(false);
      handleAudioPauseResume("pause");
      // return () => {
      //   if (
      //     mediaClickType.button !== "none" ||
      //     mediaClickType.clickType !== "none"
      //   )
      //     setMediaClickType({ button: "none", clickType: "none" });
      // };
    }
    // console.log('end info from MediaPlayer:');
    // console.log('current module:', currentModuleIndex, ', mediaSelected:', mediaSelected, ', clickType:', mediaClickType);
  }, [currentModuleIndex, mediaSelected, mediaClickType]);

  /* Media Player Logic */

  // useEffect(() => {
  //   if (currentModuleIndex !== 1) {
  //     handlePauseResume('play');
  //   } else {
  //     handlePauseResume('pause');
  //     audioPlayer.current.currentTime = 0;
  //   }
  // }, [currentModuleIndex, mediaSelected]);

  // volume change
  useEffect(() => {
    if (audioPlayer.current) audioPlayer.current.volume = volume;
  }, [volume]);

  // seek bar change
  // note: this currently pauses media if mouse is held down anywhere on screen
  // useEffect(() => {
  //   if (audioPlayer.current && mouseDown) {
  //     handleAudioPauseResume('pause');
  //     audioPlayer.current.currentTime = mediaProgress;
  //   }
  // }, [mediaProgress]);

  const handleBufferProgress: React.ReactEventHandler<HTMLAudioElement> = (
    e
  ) => {
    const audio = e.currentTarget;
    const dur = audio.duration;
    if (dur > 0) {
      for (let i = 0; i < audio.buffered.length; i++) {
        if (
          audio.buffered.start(audio.buffered.length - 1 - i) <
          audio.currentTime
        ) {
          const bufferedLength = audio.buffered.end(
            audio.buffered.length - 1 - i
          );
          setBufferProgress(bufferedLength);
          break;
        }
      }
    }
  };

  const handleAudioPauseResume = (input?: string): void => {
    if (!audioPlayer.current) {
      console.log("no audio player");
      return;
    }
    if (isAudioPlaying || input === "pause" || mediaSelected !== "audio") {
      //seekTime = audioPlayer.current.currentTime;
      audioPlayer.current?.pause();
      setIsAudioPlaying(false);
    } else if (
      (!isAudioPlaying && audioPlayer.current.readyState >= 2) ||
      input === "play"
    ) {
      //audioPlayer.current.currentTime = seekTime;
      console.log("audioPauseResume play");
      audioPlayer.current?.play();
      setIsAudioPlaying(true);
    }
  };

  const handlePauseResume = (input?: string) => {
    if (input === 'pause') {
      console.log('pausing everything');
      setIsAudioPlaying(false);
      handleAudioPauseResume('pause');
      setIsVideoPlaying(false);
      setIsMediaPlaying(false);
    }
    else if (mediaSelected === "video") {
      if (isVideoPlaying && input !== 'play') {
        console.log('pausing video');
        setIsVideoPlaying(false);
        setIsMediaPlaying(false);
      } else {
        console.log('resuming video');
        setIsVideoPlaying(true);
        setIsMediaPlaying(true);
      }
    } else if (mediaSelected === "audio") {
      if (isAudioPlaying && input !== 'play') {
        console.log('pausing audio');
        handleAudioPauseResume("pause");
        setIsMediaPlaying(false);
      } else {
        console.log('resuming audio');
        handleAudioPauseResume("play");
        setIsMediaPlaying(true);
      }
    }
    console.log('mediaProgress:', mediaProgress);
    console.log('storedMediaProgress:', storedMediaProgress);
    setMediaClickType({ button: "play", clickType: "player" });
  };

  // Create handle next Media

  const handleNextMedia = (): void => {
    const tapeLength = audioFiles.length - 1;

    if (currentModuleIndex === 0) {
      setMediaSelected("video");
      audioPlayer.current?.pause();
      setIsAudioPlaying(false);
      console.log("media selected video");
    } else {
      setMediaSelected("audio");
      console.log("media selected audio");
    }
    if (currentModuleIndex !== tapeLength) {
      console.log("setting index:", currentModuleIndex);
      setCurrentModuleIndex(currentModuleIndex + 1);
      console.log("index is now", currentModuleIndex);
    } else if (currentModuleIndex === tapeLength) {
      console.log("setting index:", currentModuleIndex);
      setCurrentModuleIndex(0);
      console.log("index is now", currentModuleIndex);
    }
    if (mediaSelected === "audio") setIsAudioPlaying(true);
    setMediaClickType({ button: "next", clickType: "player" });
  };

  // Create handle prev media

  const handlePrevMedia = (): void => {
    if (currentModuleIndex === 0) {
      if (audioPlayer.current) {
        audioPlayer.current.currentTime = 0;
        if (isAudioPlaying) {
          audioPlayer.current.play();
        }
      }
    } else if (currentModuleIndex === 1) {
      setMediaSelected("audio");
      setCurrentModuleIndex(0);
      setIsAudioPlaying(true);
    } else if (currentModuleIndex === 2) {
      // if current module index is one after video player
      setMediaSelected("video");
      if (audioPlayer.current) {
        audioPlayer.current?.pause();
        audioPlayer.current.currentTime = 0;
        setIsAudioPlaying(false);
      }
      setCurrentModuleIndex(1);
    } else {
      setCurrentModuleIndex(currentModuleIndex - 1);
      setIsAudioPlaying(true);
    }

    console.log("prev", currentModuleIndex);
    setMediaClickType({ button: "prev", clickType: "player" });
  };

  const handleEnded = (): void => {
    console.log("song ended");
    handleNextMedia();
  };

  return (
    <>
      <motion.div
        className={styles.musicPlayerContainer}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.musicPlayerLeft}>
          <div className={styles.musicPlayerArtwork}>
            {/* <Image
              // src={image.url}
              // alt={image.name}
              height={60}
              width={60}
            /> */}
          </div>
          <div className={styles.musicPlayerText}>
            <p className={styles.songName}>Song Name</p>
            <p className={styles.artistName}>Artist Name</p>
          </div>
        </div>
        <div className={styles.musicPlayerMiddle}>
          <audio
            onEnded={handleEnded}
            ref={audioPlayer}
            preload="metadata"
            onDurationChange={(e) => setSongDuration(e.currentTarget.duration)}
            onTimeUpdate={(e) => {
              setMediaProgress(e.currentTarget.currentTime);
              setStoredMediaProgress(e.currentTarget.currentTime);
              handleBufferProgress(e);
            }}
            onProgress={handleBufferProgress}
          />
          <div className={styles.musicControls}>
            <button onClick={() => handlePrevMedia()}>
              <PrevIcon height={18} width={21} color={"var(--artape-black)"} />
            </button>

            {isMediaPlaying ? (
              <button onClick={() => handlePauseResume()}>
                <PauseIcon
                  height={21}
                  width={21}
                  color={"var(--artape-black)"}
                />
              </button>
            ) : (
              <button onClick={() => handlePauseResume()}>
                <PlayIcon
                  height={21}
                  width={21}
                  color={"var(--artape-black)"}
                />
              </button>
            )}
            <button
              onClick={() => handleNextMedia()}
              style={{ color: "var(--artape-black)" }}
            >
              <NextIcon height={18} width={21} color={"var(--artape-black)"} />
            </button>
          </div>
          <div className={styles.progressBarWrapper}>
            <p className={styles.progressTime}>0:00</p>
            <MediaProgressBar
              mediaProgress={mediaProgress}
              setMediaProgress={setMediaProgress}
              storedMediaProgress={storedMediaProgress}
              songDuration={songDuration}
              isAudioPlaying={isAudioPlaying}
              setIsAudioPlaying={setIsAudioPlaying}
              isVideoPlaying={isVideoPlaying}
              setIsVideoPlaying={setIsVideoPlaying}
              isMediaPlaying={isMediaPlaying}
              setIsMediaPlaying={setIsMediaPlaying}
              handlePauseResume={handlePauseResume}
            />
            <p className={styles.progressTime}>2:45</p>
          </div>
        </div>

        {audioFetched ? (
          audioFiles.map((audioFile, index: number) => (
            <div key={index} className={styles.trackContainer}>
              {audioFetched && audioFile.audioUrl && (
                <audio>
                  <source src={audioFile.audioUrl} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              )}
            </div>
          ))
        ) : (
          <Loader />
        )}
        <div className={styles.musicPlayerRight}>
          <VolumeSlider volume={volume} setVolume={setVolume} />
        </div>
      </motion.div>
    </>
  );
};

export default MediaPlayer;
