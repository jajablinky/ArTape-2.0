import { useRouter } from 'next/router';

import { useTape } from '@/components/Context/TapeContext';
import styles from '@/styles/Home.module.css';

import { useEffect, useState } from 'react';
import VideoPlayer from '@/components/VideoPlayer';

import LoadingOverlay from '@/components/LoadingOverlay';

import InfoIcon from '@/components/Images/UI/InfoIcon';
import { handleSetModuleAndLastSelected } from '@/components/Helper Functions/handleSetModuleAndLastSelected';

import fetchData from '@/components/Helper Functions/fetchData';

import { ModuleWithFiles } from '@/types/TapeInfo';
import ModuleAdditional from '@/components/Helper Functions/ModuleAdditional';
import { useMediaContext } from '@/components/Context/MediaPlayerContext';

interface Image {
  moduleId: number | string | null;
}

const Tape = () => {
  const [progress, setProgress] = useState({
    percentage: 0,
    state: 'Communicating with Akord',
  });

  const router = useRouter();

  const { id } = router.query;
  const { tape, setTape } = useTape();

  const { modules, color } = tape || {};

  const {
    isVideoPlaying,
    setIsVideoPlaying,

    videoFiles,
    volume,
    setVolume,
    mediaProgress,
    setMediaProgress,
    storedMediaProgress,
    setStoredMediaProgress,
    seekMediaProgress,

    currentModuleIndex,
    setCurrentModuleIndex,
    mediaSelected,
    setMediaSelected,
    mediaClickType,
    setMediaClickType,

    isMediaPlaying,
    setIsMediaPlaying,
    setLastSelectedMedia,
    setAudioFiles,
    setVideoFiles,

    loading,
    setLoading,
  } = useMediaContext();

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

  useEffect(() => {
    console.log(loading, 'loading');
  }, [loading]);

  return (
    <>
      {loading && <LoadingOverlay progress={progress} />}
      {!loading && tape && (
        <>
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
                <ModuleAdditional
                  tape={tape}
                  currentModuleIndex={currentModuleIndex}
                  isMediaPlaying={isMediaPlaying}
                  moduleIndex={0}
                />{' '}
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
                  videoFiles={videoFiles}
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
                tape.modules.map(
                  (module: ModuleWithFiles, moduleIndex: number) => {
                    if (moduleIndex < 2) return null; // skip ID 0 and 1
                    return (
                      <div
                        className={`${styles.profileModule} moduleIndex${moduleIndex}`}
                        onClick={() => {
                          handleSetModuleAndLastSelected(
                            moduleIndex,
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
                        key={`${moduleIndex}`}
                      >
                        <div className={styles.infoIcon}>
                          <InfoIcon color={'var(--artape-black)'} />
                        </div>
                        {module.additionalItem.map((image, imageIndex) => {
                          if (!image.url) {
                            return null;
                          }
                          return (
                            <div
                              key={`${moduleIndex}-${imageIndex}`} // Combined key from module and image indices
                            >
                              <ModuleAdditional
                                tape={tape}
                                currentModuleIndex={currentModuleIndex}
                                isMediaPlaying={isMediaPlaying}
                                moduleIndex={moduleIndex}
                              />
                            </div>
                          );
                        })}
                        ;
                      </div>
                    );
                  }
                )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Tape;
