import { useRouter } from 'next/router';

import { useTape } from '@/components/TapeContext';
import styles from '@/styles/Home.module.css';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import VideoPlayer from '@/components/VideoPlayer';
import MediaPlayer from '@/components/MediaPlayer';

import { TapeInfoJSON } from '@/types/TapeInfo';
import NavSidebar from '@/components/NavSidebar';

import LoadingOverlay from '@/components/LoadingOverlay';
import FadeInAndOut from '@/components/FadeInAndOut';

import InfoIcon from '@/components/Images/UI/InfoIcon';
import processItem from '@/components/Helper Functions/processItem';
import getTapeInfoJSON from '@/components/Helper Functions/getTapeInfoJSON';
import { handleSetModuleAndLastSelected } from '@/components/Helper Functions/handleSetModuleAndLastSelected';
import { Akord, FileVersion } from '@akord/akord-js';
import { File } from 'buffer';

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
        const singleVaultId = Array.isArray(id) ? id[0] : id;

        if (akord && singleVaultId) {
          // Retrieve all folders from the specified vault
          const folders = await akord.folder.listAll(singleVaultId);
          console.log('All Folders retrieved: ', folders);

          // Creating a Map to store each folder for quick access by folder ID
          const folderMap = new Map();
          folders.forEach((folder) => {
            folderMap.set(folder.id, {
              ...folder,
              trackId: '',
              additionalId: '',
            });
          });

          // Filtering and transforming the folders that start with 'module' into the desired structure
          const folderIds = folders
            .filter((folder) => folder.name.startsWith('module')) // Filter out only folders starting with 'module'
            .map((folder) => {
              // Find the associated 'Track' and 'Additional' folders by checking the parentId
              const trackFolder = folders.find(
                (f) => f.parentId === folder.id && f.name === 'Track'
              );
              const additionalFolder = folders.find(
                (f) => f.parentId === folder.id && f.name === 'Additional'
              );

              // Return the transformed object with all required properties
              return {
                name: folder.name,
                folderId: folder.id,
                trackId: trackFolder ? trackFolder.id : '',
                additionalId: additionalFolder ? additionalFolder.id : '',
              };
            });

          // Logging the final array of folder IDs with their associated Track and Additional IDs
          console.log('Updated module folder ids: ', folderIds);

          // Listing all tracks

          const fetchItemDetails = async (
            vaultId: string,
            parentId: string
          ) => {
            const items = await akord.stack.listAll(vaultId, { parentId });
            if (items.length > 0) {
              const itemFile = items[0].versions[0];
              const itemName = items[0].name;
              return { file: itemFile, fileName: itemName };
            }
            return { file: null, fileName: '' };
          };

          // Initialize an array to store the module data
          const tape = [];

          for (let i = 0; i < folderIds.length; i++) {
            // Skip additionalId for folderIds[1]
            let additionalItemDetails = { file: null, fileName: '' };
            if (i !== 1) {
              additionalItemDetails = await fetchItemDetails(
                singleVaultId,
                folderIds[i].additionalId
              );
            }

            const trackItemDetails = await fetchItemDetails(
              singleVaultId,
              folderIds[i].trackId
            );

            tape.push({
              moduleName: folderIds[i].name,
              trackItem: trackItemDetails,
              additionalItem: additionalItemDetails,
            });
          }

          console.log(tape);
          // let tapeInfoJSON: TapeInfoJSON = {
          //   tapeArtistName: '',
          //   type: '',
          //   color: '',
          //   modules: [],
          // };

          // // Get tapeInfoJson from Akord Vault
          // const tapeInfoPromises: Promise<TapeInfoJSON | null>[] = [];
          // items.forEach((item) => {
          //   tapeInfoPromises.push(getTapeInfoJSON(item, akord));
          // });
          // const tapeInfoJSONs = await Promise.all(tapeInfoPromises);
          // // Merge all the TapeInfoJSONs into tapeInfoJSON
          // tapeInfoJSONs.forEach((tapeInfo) => {
          //   if (tapeInfo) {
          //     tapeInfoJSON = { ...tapeInfoJSON, ...tapeInfo };
          //   }
          // });

          // //process
          // const processPromises: Promise<{
          //   audioFiles?: AudioFileWithUrls[];
          //   imageFiles?: ImageFileWithUrls[];
          //   videoFiles?: VideoFileWithUrls[];
          // }>[] = [];
          // items.forEach((item) => {
          //   processPromises.push(processItem(item, tapeInfoJSON, akord));
          // });
          // const processResults = await Promise.all(processPromises);
          // const audioFiles: AudioFileWithUrls[] = [];
          // const imageFiles: ImageFileWithUrls[] = [];
          // const videoFiles: VideoFileWithUrls[] = [];
          // console.log('before processing');
          // // Merge all the process results into audioFiles, imageFiles, and profilePicture
          // processResults.forEach((result) => {
          //   if (result.audioFiles) {
          //     audioFiles.push(...result.audioFiles);
          //   }
          //   if (result.imageFiles) {
          //     imageFiles.push(...result.imageFiles);
          //   }
          //   if (result.videoFiles) {
          //     videoFiles.push(...result.videoFiles);
          //   }
          // });
          console.log('collected songs');
          console.log('collected images');
          console.log('collected videos');

          setTape({
            akord,
            audioFiles,
            color: tapeInfoJSON?.color,
            imageFiles,
            tapeArtistName: tapeInfoJSON?.tapeArtistName,
            tapeInfoJSON,
            videoFiles,
          });
          if (imageFiles) {
            const sortedImages = [...imageFiles].sort(
              (a, b) => a.moduleId - b.moduleId
            );
            setSortedImagesFiles(sortedImages);
          }
        }
        console.log('fetching');
        setLoading(false);
      } catch (e) {
        console.error(e);
        console.log('error');
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const renderFirstImage = (targetModuleId: number) => {
    const targetImage = imageFiles.find(
      (image: Image) => image.moduleId === targetModuleId
    );

    if (targetImage) {
      return (
        <Image
          className={`${targetImage.name} ${styles.objectFit}`}
          src={targetImage.url || ''}
          alt={targetImage.name}
          fill={true}
        />
      );
    } else {
      // Handle the case when the image with the target moduleId is not found
      return <div>No image found for the moduleId: {targetModuleId}</div>;
    }
  };

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
