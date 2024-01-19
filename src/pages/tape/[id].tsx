import { useRouter } from 'next/router';

import { useTape } from '@/components/Context/TapeContext';
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

import { ModuleWithFiles, TrackWithFiles } from '@/types/TapeInfo';
import FirstModuleAdditional from '@/components/Helper Functions/FirstModuleAdditional';

interface Image {
  moduleId: number | string | null;
}




const Tape = () => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({
    percentage: 0,
    state: 'Communicating with Akord',
  });



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

  useEffect(() => {
    console.log(loading, 'loading');
  }, [loading]);

  return (
    <>
      {loading && <LoadingOverlay progress={progress} />}
      {!loading && tape && (
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
              <FirstModuleAdditional tape={tape} />
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
                  return module.additionalItem.map((image, imageIndex) => {
                    if (!image.url || moduleIndex === 0) {
                      // Assuming first module's images are not to be displayed
                      return null;
                    }
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
                        key={`${moduleIndex}-${imageIndex}`} // Combined key from module and image indices
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
                  });
                }
              )}
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
      )}
    </>
  );
};

export default Tape;
