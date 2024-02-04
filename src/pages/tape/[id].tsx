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
    mediaDuration,
    setMediaDuration,
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
    if (id && !tape) {
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

  const handleModuleDetailFocus = (moduleNumber: number) => {
    router.push(`${id}/${moduleNumber}`);
  };
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
                <div
                  className={styles.infoIcon}
                  onClick={() => handleModuleDetailFocus(0)}
                >
                  <InfoIcon color={'var(--artape-black)'} />
                </div>
                <ModuleAdditional
                  tape={tape}
                  currentModuleIndex={currentModuleIndex}
                  isMediaPlaying={isMediaPlaying}
                  moduleIndex={0}
                />{' '}
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
                  volume={volume}
                  setVolume={setVolume}
                  mediaDuration={mediaDuration}
                  setMediaDuration={setMediaDuration}
                  mediaProgress={mediaProgress}
                  setMediaProgress={setMediaProgress}
                  currentModuleIndex={currentModuleIndex}
                  setCurrentModuleIndex={setCurrentModuleIndex}
                  mediaSelected={mediaSelected}
                  setMediaSelected={setMediaSelected}
                  mediaClickType={mediaClickType}
                  setMediaClickType={setMediaClickType}
                  setLastSelectedMedia={setLastSelectedMedia}
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
