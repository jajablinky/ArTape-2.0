import { useRouter } from 'next/router';

import { useTape } from '@/components/TapeContext';
import styles from '@/styles/Home.module.css';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import VideoPlayer from '@/components/VideoPlayer';
import MediaPlayer from '@/components/MediaPlayer';

import NavSidebar from '@/components/NavSidebar';

import LoadingOverlay from '@/components/LoadingOverlay';
import FadeInAndOut from '@/components/FadeInAndOut';

import InfoIcon from '@/components/Images/UI/InfoIcon';
import { handleSetModuleAndLastSelected } from '@/components/Helper Functions/handleSetModuleAndLastSelected';

import fetchData from '@/components/Helper Functions/fetchData';
import renderFirstModuleAdditional from '@/components/Helper Functions/renderFirstModuleAdditional';

interface Image {
  moduleId: number | string | null;
}

export type MediaClickType = {
  button: 'init' | 'play' | 'prev' | 'next' | 'module' | 'none';
  clickType: 'init' | 'none' | 'player' | 'audioModule' | 'videoModule';
};

const initialClickState: MediaClickType = { button: 'init', clickType: 'init' };

const Tape = () => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({
    percentage: 0,
    state: 'Communicating with Akord',
  });
  const [currentModuleIndex, setCurrentModuleIndex] = useState<number>(-1);
  const [mediaSelected, setMediaSelected] = useState<string>('');
  const [mediaClickType, setMediaClickType] =
    useState<MediaClickType>(initialClickState);
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false);
  const [isMediaPlaying, setIsMediaPlaying] = useState<boolean>(false);
  const [lastSelectedMedia, setLastSelectedMedia] = useState<number>(-1);

  const [volume, setVolume] = useState<number>(1);
  const [mediaProgress, setMediaProgress] = useState<number>(0);
  const [storedMediaProgress, setStoredMediaProgress] = useState<number>(0);
  const [seekMediaProgress, setSeekMediaProgress] = useState<number>(-1);
  const [audioFiles, setAudioFiles] = useState(null);
  const [videoFiles, setVideoFiles] = useState(null);
  const router = useRouter();

  const { id } = router.query;
  const { tape, setTape } = useTape();

  const { modules, color } = tape || {};

  useEffect(() => {
    if (id) {
      fetchData({
        setLoading,
        id,
        setTape,
        setAudioFiles,
        setVideoFiles,
        tape,
      });
    }
  }, [id]);

  return (
    <>
      <main
        className={styles.main}
        style={
          {
            '--artape-primary-color': color,
          } as React.CSSProperties
        }
      >
        {loading && <LoadingOverlay progress={progress} />}
        {!loading && tape && (
          <FadeInAndOut>
            <div className={styles.fullWrapper}>
              <div className={styles.fullContainer}>
                <NavSidebar setLoading={setLoading} router={router} />
                <div className={styles.mainContainer}>
                  <div className={styles.scrollableContainer}>
                    <div className={styles.gridProfile}>
                      <div
                        className={styles.profileModule}
                        onClick={() => {
                          handleSetModuleAndLastSelected(
                            0,
                            setLastSelectedMedia,
                            currentModuleIndex,
                            setCurrentModuleIndex
                          );
                          setMediaSelected('audio');
                          setMediaClickType({
                            button: 'module',
                            clickType: 'audioModule',
                          });
                        }}
                      >
                        {renderFirstModuleAdditional(tape)}
                        <div className={styles.infoIcon}>
                          <InfoIcon color={'var(--artape-black)'} />
                        </div>
                      </div>
                      <div
                        className={styles.profileModuleRectangle}
                        style={{
                          backgroundColor: 'var(--artape-primary-color)',
                        }}
                      >
                        <VideoPlayer
                          isVideoPlaying={isVideoPlaying}
                          setIsVideoPlaying={setIsVideoPlaying}
                          videoFiles={tape.modules[1]}
                          seekMediaProgress={seekMediaProgress}
                          color={color}
                          volume={volume}
                          setVolume={setVolume}
                          mediaProgress={mediaProgress}
                          setMediaProgress={setMediaProgress}
                          storedMediaProgress={storedMediaProgress}
                          setStoredMediaProgress={setStoredMediaProgress}
                          currentModuleIndex={currentModuleIndex}
                          setCurrentModuleIndex={setCurrentModuleIndex}
                          mediaSelected={mediaSelected}
                          setMediaSelected={setMediaSelected}
                          mediaClickType={mediaClickType}
                          setMediaClickType={setMediaClickType}
                          setLastSelectedMedia={setLastSelectedMedia}
                          isMediaPlaying={isMediaPlaying}
                          setIsMediaPlaying={setIsMediaPlaying}
                        />
                      </div>

                      {tape.modules &&
                        tape.modules.map((module, moduleIndex) => {
                          return module.additionalItem.map(
                            (image, imageIndex) => {
                              if (!image.url || moduleIndex === 0) {
                                // Assuming first module's images are not to be displayed
                                return null;
                              }

                              return (
                                <div
                                  className={styles.profileModule}
                                  onClick={() => {
                                    handleSetModuleAndLastSelected(
                                      moduleIndex, // Adjusted to use moduleIndex
                                      setLastSelectedMedia,
                                      currentModuleIndex,
                                      setCurrentModuleIndex
                                    );
                                    setMediaSelected('audio');
                                    setMediaClickType({
                                      button: 'module',
                                      clickType: 'audioModule',
                                    });
                                  }}
                                  key={`${moduleIndex}-${imageIndex}`} // Combined key from module and image indices
                                  style={{ aspectRatio: 1 / 1 }}
                                >
                                  <Image
                                    className={`${image.name} ${styles.objectFit}`}
                                    src={image.url}
                                    alt={image.name}
                                    fill={true}
                                  />
                                  <div className={styles.infoIcon}>
                                    <InfoIcon color={'var(--artape-black)'} />
                                  </div>
                                </div>
                              );
                            }
                          );
                        })}
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.AudioPlayer}>
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
                  setStoredMediaProgress={setStoredMediaProgress}
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
              </div>
            </div>
          </FadeInAndOut>
        )}
      </main>
    </>
  );
};

export default Tape;
