import { useRouter } from 'next/router';

import { useTape } from '@/components/TapeContext';
import styles from '@/styles/Home.module.css';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import VideoPlayer from '@/components/VideoPlayer';
import MediaPlayer from '@/components/MediaPlayer';

import {
  AudioFileWithUrls,
  ImageFileWithUrls,
  VideoFileWithUrls,
  TapeInfoJSON,
} from '@/types/TapeInfo';
import NavSidebar from '@/components/NavSidebar';

import LoadingOverlay from '@/components/LoadingOverlay';
import FadeInAndOut from '@/components/FadeInAndOut';

import InfoIcon from '@/components/Images/UI/InfoIcon';
import processItem from '@/components/Helper Functions/processItem';
import getTapeInfoJSON from '@/components/Helper Functions/getTapeInfoJSON';
import { handleSetModuleAndLastSelected } from '@/components/Helper Functions/handleSetModuleAndLastSelected';
import { Akord } from '@akord/akord-js';

export type MediaClickType = {
  button: 'init' | 'play' | 'prev' | 'next' | 'module' | 'none';
  clickType: 'init' | 'none' | 'player' | 'audioModule' | 'videoModule';
};

const initialClickState: MediaClickType = { button: 'init', clickType: 'init' }

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
  const [mediaClickType, setMediaClickType] = useState<MediaClickType>(initialClickState);
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

  const { imageFiles, audioFiles, videoFiles, color } = tape || {};

  interface Image {
    moduleId: number | string | null;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('fetching');
        setLoading(true);
        const akord = new Akord(); // a public instance
        const singleVaultId = Array.isArray(id) ? id[0] : id;
        if (akord && singleVaultId) {
          // List all items inside the tape
          const items = await akord.stack.listAll(singleVaultId);
          let tapeInfoJSON: TapeInfoJSON = {
            audioFiles: [],
            color: '',
            imageFiles: [],
            tapeArtistName: '',
            type: '',
            videoFiles: [],
          };

          // commented out because its public and there is no profile
          // const profile = await akord.profile.get();
          // const profileEmail = profile.email;
          // const profileName = profile.name;
          // const profileAvatar = profile.avatar;

          const tapeInfoPromises: Promise<TapeInfoJSON | null>[] = [];
          items.forEach((item) => {
            tapeInfoPromises.push(getTapeInfoJSON(item, akord));
          });

          const tapeInfoJSONs = await Promise.all(tapeInfoPromises);
          // Merge all the TapeInfoJSONs into tapeInfoJSON
          tapeInfoJSONs.forEach((tapeInfo) => {
            if (tapeInfo) {
              tapeInfoJSON = { ...tapeInfoJSON, ...tapeInfo };
            }
          });
          const processPromises: Promise<{
            audioFiles?: AudioFileWithUrls[];
            imageFiles?: ImageFileWithUrls[];
            videoFiles?: VideoFileWithUrls[];
            profilePicture?: { name: string; url: string };
          }>[] = [];

          items.forEach((item) => {
            processPromises.push(processItem(item, tapeInfoJSON, akord));
          });

          const processResults = await Promise.all(processPromises);

          const audioFiles: AudioFileWithUrls[] = [];
          const imageFiles: ImageFileWithUrls[] = [];
          const videoFiles: VideoFileWithUrls[] = [];
          console.log('before processing');
          // Merge all the process results into audioFiles, imageFiles, and profilePicture
          processResults.forEach((result) => {
            if (result.audioFiles) {
              audioFiles.push(...result.audioFiles);
            }
            if (result.imageFiles) {
              imageFiles.push(...result.imageFiles);
            }
            if (result.videoFiles) {
              videoFiles.push(...result.videoFiles);
            }
          });

          console.log('collected songs');
          console.log('collected images');
          console.log('collected videos');

          setTape({
            akord,
            // profileAvatar,
            // profileEmail,
            // profileName,
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
                          handleSetModuleAndLastSelected(0, setLastSelectedMedia, currentModuleIndex, setCurrentModuleIndex);
                          setMediaSelected('audio');
                          setMediaClickType({button: 'module', clickType: 'audioModule'});
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
                                  handleSetModuleAndLastSelected(image.moduleId - 1, setLastSelectedMedia, currentModuleIndex, setCurrentModuleIndex);
                                  setMediaSelected('audio');
                                  setMediaClickType({button: 'module', clickType: 'audioModule'});
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
