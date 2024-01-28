import styles from '@/styles/Home.module.css';

import FadeInAndOut from '@/components/FadeInAndOut';
import LoadingOverlay from '@/components/LoadingOverlay';
import NavSidebar from '@/components/NavSidebar';
import React, { useEffect, useState } from 'react';
import { useTape } from '@/components/TapeContext';
import { useRouter } from 'next/router';
import MediaPlayer from '@/components/MediaPlayer';
import { MediaClickType } from '../[id]';
import { TrackWithFiles } from '@/types/TapeInfo';
import { handleSetModuleAndLastSelected } from '@/components/Helper Functions/handleSetModuleAndLastSelected';
import ModuleAdditional from '@/components/Helper Functions/ModuleAdditional';
import InfoIcon from '@/components/Images/UI/InfoIcon';
import fetchData from '@/components/Helper Functions/fetchData';

const initialClickState: MediaClickType = { button: 'init', clickType: 'init' };

const Module = () => {
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
  const [mediaDuration, setMediaDuration] = useState<number>(0);
  const [mediaProgress, setMediaProgress] = useState<number>(0);
  const [storedMediaProgress, setStoredMediaProgress] = useState<number>(0);
  const [seekMediaProgress, setSeekMediaProgress] = useState<number>(-1);
  const [audioFiles, setAudioFiles] = useState<TrackWithFiles[] | null>(null);
  const [videoFiles, setVideoFiles] = useState<TrackWithFiles[] | null>(null);
  const router = useRouter();

  const { moduleNumber, id } = router.query;

  const { tape, setTape } = useTape();
  const { modules, color } = tape || {};

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
  }, [moduleNumber]);

  useEffect(() => {
    console.log(tape);
  }, []);

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
                        <div className={styles.infoIcon}>
                          <InfoIcon color={'var(--artape-black)'} />
                        </div>
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
                    mediaDuration={mediaDuration}
                    setMediaDuration={setMediaDuration}
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
            </div>
          </FadeInAndOut>
        )}
      </main>
    </>
  );
};

export default Module;
