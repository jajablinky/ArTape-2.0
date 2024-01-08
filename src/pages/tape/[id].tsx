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
import getTapeInfoJSON from '@/components/Helper Functions/getTapeInfoJSON';
import { handleSetModuleAndLastSelected } from '@/components/Helper Functions/handleSetModuleAndLastSelected';
import { Akord, FileVersion } from '@akord/akord-js';
import fetchItemFile from '@/components/Helper Functions/fetchItemFile';
import getFolderIds from './getFolderIds';
import {
  ImageWithFile,
  ModuleAudioFile,
  ModuleVideoFile,
  ModulesWithFiles,
} from '@/types/TapeInfo';

interface Image {
  moduleId: number | string | null;
}
interface folderIdProps {
  name: string;
  folderId: string;
  trackId: string;
  additionalId: string;
}

export type MediaClickType = {
  button: 'init' | 'play' | 'prev' | 'next' | 'module' | 'none';
  clickType: 'init' | 'none' | 'player' | 'audioModule' | 'videoModule';
};

const initialClickState: MediaClickType = { button: 'init', clickType: 'init' };

const Tape = () => {
  const [sortedImageFiles, setSortedImagesFiles] = useState<
    ImageFileWithUrls[]
  >([]);
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

  const router = useRouter();

  const { id } = router.query;
  const { tape, setTape } = useTape();

  const { modules, color } = tape || {};

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('fetching');
        setLoading(true);
        const akord = new Akord(); // a public instance

        // retrieve single vault Id
        const singleVaultId = Array.isArray(id) ? id[0] : id;

        if (akord && singleVaultId) {
          /* 
          Step 1:
          Retrieving folder ids from vault and storing in an array 
          */
          const { mediaFolderIds, tapeInfoFolderId } = await getFolderIds(
            akord,
            singleVaultId
          );

          /* 
          Step 2:
          Get files, and urls from modules
          */

          let tapeInfoDetails = await fetchItemFile(
            singleVaultId,
            tapeInfoFolderId,
            akord
          );

          // Get tapeInfo.json
          const tapeInfoFile = tapeInfoDetails[0].arrayBuffer;
          const tapeInfoJSON = getTapeInfoJSON(tapeInfoFile);

          if (!tapeInfoJSON) {
            console.error('Tape info JSON is invalid');
            return;
          }

          const modulePromises = mediaFolderIds.map(async (folder, i) => {
            let additionalItemFiles =
              i !== 1
                ? await fetchItemFile(singleVaultId, folder.additionalId, akord)
                : [];
            let trackItemFile = await fetchItemFile(
              singleVaultId,
              folder.trackId,
              akord
            );

            const additional = additionalItemFiles.map((file) => ({
              name: file.fileName,
              time: tapeInfoJSON.modules[i].additional[0].time,
              url: file.url,
              file: file.file,
              alt: file.fileName,
            }));

            const track = {
              type: tapeInfoJSON.modules[i].track.type,
              metadata: {
                name: tapeInfoJSON.modules[i].track.metadata.name,
                artistName: tapeInfoJSON.modules[i].track.metadata.artistName,
                duration: tapeInfoJSON.modules[i].track.metadata.duration,
                fileName: trackItemFile[0].fileName,
              },
              url: trackItemFile[0].url,
              file: trackItemFile[0].file,
            };

            return {
              moduleName: folder.name,
              trackItem: track,
              additionalItem: additional,
            };
          });

          const modules = await Promise.all(modulePromises);
          console.log('modules: ', modules);
          /*
          Step 4:
          Set Tape Context
          */

          setTape({
            akord,
            color: tapeInfoJSON.color,
            modules,
            tapeInfoJSON,
          });
        }

        // [
        //   {
        //     name: modules[i].moduleName,
        //     trackItem:{
        //       name: ,
        //       artistName: ,
        //       duration: ,
        //       fileName: modules[],
        //       file: ,
        //       url: ,
        //     }
        //     additionalItem:[{

        //     }]
        //   }
        // ]

        setLoading(false);
      } catch (e) {
        console.error(e);
        console.log('error trying to fetch tape');
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // const renderFirstImage = (targetModuleId: number) => {
  //   const targetImage = imageFiles.find(
  //     (image: Image) => image.moduleId === targetModuleId
  //   );

  //   if (targetImage) {
  //     return (
  //       <Image
  //         className={`${targetImage.name} ${styles.objectFit}`}
  //         src={targetImage.url || ''}
  //         alt={targetImage.name}
  //         fill={true}
  //       />
  //     );
  //   } else {
  //     // Handle the case when the image with the target moduleId is not found
  //     return <div>No image found for the moduleId: {targetModuleId}</div>;
  //   }
  // };

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
                <NavSidebar
                  // profileAvatar={profileAvatar}
                  // profileEmail={profileEmail}
                  // profileName={profileName}
                  // tapes={tapeInfoOptions}
                  // akord={akord}
                  setLoading={setLoading}
                  setTape={setTape}
                  tape={tape}
                  router={router}
                  setProgress={setProgress}
                />
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
                        {renderFirstImage(1)}
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

                      {sortedImageFiles &&
                        sortedImageFiles.map((image) => {
                          if (image.url) {
                            return image.moduleId === 1 ? null : (
                              <div
                                className={styles.profileModule}
                                onClick={() => {
                                  handleSetModuleAndLastSelected(
                                    image.moduleId - 1,
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
                                key={image.moduleId}
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
