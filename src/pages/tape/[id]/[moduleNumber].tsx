import styles from '@/styles/Home.module.css';

import FadeInAndOut from '@/components/FadeInAndOut';
import LoadingOverlay from '@/components/LoadingOverlay';
import NavSidebar from '@/components/NavSidebar';
import React, { useEffect, useState } from 'react';

import { useRouter } from 'next/router';
import MediaPlayer from '@/components/MediaPlayer';

import { TrackWithFiles } from '@/types/TapeInfo';
import { handleSetModuleAndLastSelected } from '@/components/Helper Functions/handleSetModuleAndLastSelected';
import ModuleAdditional from '@/components/Helper Functions/ModuleAdditional';
import InfoIcon from '@/components/Images/UI/InfoIcon';
import fetchData from '@/components/Helper Functions/fetchData';
import { useMediaContext } from '@/components/Context/MediaPlayerContext';
import { useTape } from '@/components/Context/TapeContext';

const Module = () => {
  const [progress, setProgress] = useState({
    percentage: 0,
    state: 'Communicating with Akord',
  });

  const router = useRouter();

  const { moduleNumber, id } = router.query;
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
    // make a fetch data by module function
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
  }, [moduleNumber]);

  return (
    <>
      {loading && <LoadingOverlay progress={progress} />}
      {!loading && tape && (
        <>
          <FadeInAndOut>
            <div className={styles.scrollableContainer}>
              <div className={styles.songDetailTop}>
                <div className={styles.songMetadataTop}>
                  <b>
                    <p>Deep End</p>
                  </b>
                  <p>Foushee</p>

                  <p>2:30</p>
                </div>
                <div
                  className={styles.profileModuleDetail}
                  onClick={() => {
                    handleSetModuleAndLastSelected(
                      Number(moduleNumber),
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
                    moduleIndex={Number(moduleNumber)}
                  />
                </div>
              </div>
            </div>
          </FadeInAndOut>
        </>
      )}
    </>
  );
};

export default Module;
