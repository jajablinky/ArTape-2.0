import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { TapeProvider, useTape } from '../components/Context/TapeContext';
import styles from '@/styles/Home.module.css';
import FadeInAndOut from '@/components/FadeInAndOut';
import NavSidebar from '@/components/NavSidebar';
import { useRouter } from 'next/router';
import MediaPlayerProvider from '@/components/Context/MediaPlayerProvider';
import MediaPlayer from '@/components/MediaPlayer';
import { useMediaContext } from '@/components/Context/MediaPlayerContext';
import { useEffect } from 'react';

export default function App({ Component, pageProps }: AppProps) {
  const { tape, setTape } = useTape();
  const router = useRouter();
  const {
    isVideoPlaying,
    setIsVideoPlaying,
    audioFiles,
    videoFiles,
    volume,
    setVolume,
    mediaProgress,
    setMediaProgress,
    storedMediaProgress,

    seekMediaProgress,
    setSeekMediaProgress,
    currentModuleIndex,
    setCurrentModuleIndex,
    mediaSelected,
    setMediaSelected,
    mediaClickType,
    setMediaClickType,
    lastSelectedMedia,
    isMediaPlaying,
    setIsMediaPlaying,
    color,
    loading,
  } = useMediaContext();

  return (
    <TapeProvider>
      <MediaPlayerProvider>
        <main className={styles.main}>
          <FadeInAndOut>
            <div className={styles.fullWrapper}>
              <div className={styles.fullContainer}>
                <NavSidebar router={router} />
                <Component {...pageProps} />
              </div>
            </div>
            {!loading ? (
              <MediaPlayer
                setIsVideoPlaying={setIsVideoPlaying}
                isVideoPlaying={isVideoPlaying}
                audioFiles={audioFiles}
                videoFiles={videoFiles}
                color={color}
                volume={volume}
                setVolume={setVolume}
                mediaProgress={mediaProgress}
                setMediaProgress={setMediaProgress}
                storedMediaProgress={storedMediaProgress}
                seekMediaProgress={seekMediaProgress}
                setSeekMediaProgress={setSeekMediaProgress}
                currentModuleIndex={currentModuleIndex}
                setCurrentModuleIndex={setCurrentModuleIndex}
                mediaSelected={mediaSelected}
                setMediaSelected={setMediaSelected}
                mediaClickType={mediaClickType}
                setMediaClickType={setMediaClickType}
                lastSelectedMedia={lastSelectedMedia}
                isMediaPlaying={isMediaPlaying}
                setIsMediaPlaying={setIsMediaPlaying}
              />
            ) : null}
          </FadeInAndOut>
        </main>
      </MediaPlayerProvider>
    </TapeProvider>
  );
}
