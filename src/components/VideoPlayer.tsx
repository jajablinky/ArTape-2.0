import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import styles from "@/styles/Home.module.css";

import { VideoFileWithFiles } from "@/types/TapeInfo";
import { MediaClickType } from "@/pages/tape/[id]";
import { handleSetModuleAndLastSelected } from "./Helper Functions/handleSetModuleAndLastSelected";

interface VideoPlayerProps {
  color: string;
  videoFiles: VideoFileWithFiles[];
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
  setLastSelectedMedia: React.Dispatch<React.SetStateAction<number>>;
}

const VideoPlayer = ({
  color,
  videoFiles,
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
  setLastSelectedMedia,
}: VideoPlayerProps) => {
  // insert react components
  const videoPlayer = useRef<HTMLVideoElement | null>(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState<number>(0);
  const [videoDuration, setVideoDuration] = useState<number>(0);
  const [currentProgress, setCurrentProgress] = useState<number>(0);

  const [bufferProgress, setBufferProgress] = useState<number>(0);

  const handleVideoPauseResume = (input?: string): void => {
    if (!videoPlayer.current) {
      console.log("no video player");
      return;
    }

    if (isVideoPlaying || input === "pause") {
      //seekTime = audioPlayer.current.currentTime;
      console.log("videoPauseResume pause");
      videoPlayer.current?.pause();
      // may need to implement pause check (see audio player)
      setIsVideoPlaying(false);
      if (mediaSelected !== 'audio') setIsMediaPlaying(false);
    } else if (
      (!isVideoPlaying && videoPlayer.current.readyState >= 2) ||
      input === "play"
    ) {
      //audioPlayer.current.currentTime = seekTime;
      console.log("play");
      videoPlayer.current?.play();
      setIsVideoPlaying(true);
      setIsMediaPlaying(true);
    }
  };

  // insert functions & handlers
  useEffect(() => {
    if (!videoPlayer.current) {
      videoPlayer.current = new HTMLVideoElement();
    }

    if (videoPlayer.current && videoFiles) {
      const currentVideoUrl = videoFiles[0].videoUrl;
      if (currentVideoUrl) {
        console.log(videoFiles[0].fileName, "'s duration:", videoDuration);
        videoPlayer.current.removeEventListener("ended", handleEnded);
        videoPlayer.current.src = currentVideoUrl;
        videoPlayer.current.addEventListener("ended", handleEnded);
      }
    }

    return () => {
      if (videoPlayer.current) {
        videoPlayer.current.removeEventListener("ended", handleEnded);
      }
    };
  }, []);

  // Video Player Logic

  // useEffect(()=>{
  //   //console.log('test isVideoPlaying:', isVideoPlaying);
  //   handleVideoPauseResume();
  // }, [isVideoPlaying]);

  useEffect(() => {
    // option 1: video selected
    if (mediaSelected === "video" && mediaClickType.clickType !== 'none') {
      console.log("selected video");
      // option 1a: clicked on video module
      if (mediaClickType.clickType === "videoModule") {
        console.log("module clicked");
        if (currentModuleIndex === 1) {
          // play/pause conditions
          if (isVideoPlaying) handleVideoPauseResume("pause");
          else handleVideoPauseResume("play");
        } else {
          // cannot play
          handleVideoPauseResume("pause");
          if (videoPlayer.current) videoPlayer.current.currentTime = 0;
        }
      }
      // option 1b: clicked on play/pause button
      else if (
        mediaClickType.button === "play" &&
        mediaClickType.clickType === "player"
      ) {
        if (isVideoPlaying) videoPlayer.current?.play();
        else videoPlayer.current?.pause();
      }
      // option 1c: video navigated to from another song
      else if (
        mediaClickType.button === "next" ||
        mediaClickType.button === "prev"
      ) {
        if (currentModuleIndex === 1) handleVideoPauseResume("play");
      }
    }
    // option 2: audio selected, stop video entirely
    else if (mediaSelected === "audio") {
      setIsVideoPlaying(false);
      handleVideoPauseResume("pause");
      if (videoPlayer.current) videoPlayer.current.currentTime = 0;
    }

    if (
      (mediaClickType.clickType === "player" ||
      mediaClickType.clickType === "videoModule") &&
      mediaClickType.button !== 'none' &&
      mediaClickType.button !== 'init'
    )
      return () => {setMediaClickType({ button: "none", clickType: "none" });};

    console.log('end info from VideoPlayer:');
    console.log('current module:', currentModuleIndex, ', mediaSelected:', mediaSelected, ', clickType:', mediaClickType);
  }, [currentModuleIndex, mediaSelected, mediaClickType]);

  // volume change
  useEffect(() => {
    if (videoPlayer.current && currentModuleIndex === 1)
      videoPlayer.current.volume = volume;
  }, [volume]);

  const handleBufferProgress: React.ReactEventHandler<HTMLAudioElement> = (
    e
  ) => {
    const video = e.currentTarget;
    const dur = video.duration;
    if (dur > 0) {
      for (let i = 0; i < video.buffered.length; i++) {
        if (
          video.buffered.start(video.buffered.length - 1 - i) <
          video.currentTime
        ) {
          const bufferedLength = video.buffered.end(
            video.buffered.length - 1 - i
          );
          setBufferProgress(bufferedLength);
          break;
        }
      }
    }
  };

  // next media is currently always audio
  const handleNextMedia = (): void => {
    console.log("current video index:", currentVideoIndex);
    setIsVideoPlaying(false);
    setCurrentModuleIndex(currentModuleIndex + 1);
    setMediaSelected("audio");
  };

  const handleEnded = (): void => {
    console.log("video ended");
    handleNextMedia();
  };

  return (
    <>
      <motion.div
        className={styles.videoPlayerContainer}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.videoPlayerMiddle}>
          <video
            onEnded={handleEnded}
            ref={videoPlayer}
            onClick={() => {
              handleSetModuleAndLastSelected(
                1,
                setLastSelectedMedia,
                currentModuleIndex,
                setCurrentModuleIndex
              );
              setMediaSelected("video");
              setMediaClickType({ button: "module", clickType: "videoModule" });
            }}
            preload="metadata"
            onDurationChange={(e) => setVideoDuration(e.currentTarget.duration)}
            // onTimeUpdate={(e) => {
            //   setMediaProgress(e.currentTarget.currentTime);
            //   setStoredMediaProgress(e.currentTarget.currentTime);
            //   handleBufferProgress(e);
            // }}
            onProgress={handleBufferProgress}
            style={{ width: "100%" }}
          />
        </div>
      </motion.div>
    </>
  );
};

export default VideoPlayer;
