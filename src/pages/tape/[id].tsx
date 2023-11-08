import { useRouter } from 'next/router';

import { useTape } from '@/components/TapeContext';
import styles from '@/styles/Home.module.css';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import AudioPlayer from '@/components/AudioPlayer';

import {
  AudioFileWithUrls,
  ImageFileWithUrls,
  TapeInfoJSON,
} from '@/types/TapeInfo';
import NavSidebar from '@/components/NavSidebar';

import LoadingOverlay from '@/components/LoadingOverlay';
import FadeInAndOut from '@/components/FadeInAndOut';
import UDLOverlay from '@/components/UDLOverlay';
import InfoIcon from '@/components/Images/UI/InfoIcon';
import processItem from '@/components/Helper Functions/processItem';
import getTapeInfoJSON from '@/components/Helper Functions/getTapeInfoJSON';
import { Akord } from '@akord/akord-js';

const Tape = () => {
  const [sortedImageFiles, setSortedImagesFiles] = useState<
    ImageFileWithUrls[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({
    percentage: 0,
    state: 'Communicating with Akord',
  });
  const [udlOverlay, setUdlOverlay] = useState([
    { moduleId: 1, overlay: false },
    { moduleId: 3, overlay: false },
    { moduleId: 4, overlay: false },
    { moduleId: 5, overlay: false },
    { moduleId: 6, overlay: false },
    { moduleId: 7, overlay: false },
    { moduleId: 8, overlay: false },
    { moduleId: 9, overlay: false },
  ]);

  const toggleOverlay = (moduleId: number) => {
    setUdlOverlay((prev) =>
      prev.map((item) =>
        item.moduleId === moduleId ? { ...item, overlay: !item.overlay } : item
      )
    );
  };

  const router = useRouter();

  const { id } = router.query;
  const { tape, setTape } = useTape();

  const { imageFiles, audioFiles, color } = tape || {};

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
            profilePicture?: { name: string; url: string };
          }>[] = [];

          items.forEach((item) => {
            processPromises.push(processItem(item, tapeInfoJSON, akord));
          });

          const processResults = await Promise.all(processPromises);

          const audioFiles: AudioFileWithUrls[] = [];
          const imageFiles: ImageFileWithUrls[] = [];
          console.log('before processing');
          // Merge all the process results into audioFiles, imageFiles, and profilePicture
          processResults.forEach((result) => {
            if (result.audioFiles) {
              audioFiles.push(...result.audioFiles);
            }
            if (result.imageFiles) {
              imageFiles.push(...result.imageFiles);
            }
          });

          console.log('collected songs');
          console.log('collected images');

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
          });
          if (imageFiles) {
            const sortedImages = [...imageFiles].sort(
              (a, b) => a.moduleId - b.moduleId
            );
            setSortedImagesFiles(sortedImages);
          }
        }
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
          height={400}
          width={400}
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
                      onClick={() => toggleOverlay(1)}
                    >
                      {udlOverlay[0]?.overlay ? (
                        <UDLOverlay imageFile={imageFiles[0]} />
                      ) : null}
                      {renderFirstImage(1)}
                      <div className={styles.infoIcon}>
                        <InfoIcon color={'var(--artape-black)'} />
                      </div>
                    </div>

                    <div
                      className={styles.profileModuleRectangle}
                      style={{
                        backgroundColor: 'var(--artape-primary-color)',
                        overflow: 'auto',
                      }}
                    >
                      <AudioPlayer audioFiles={audioFiles} color={color} />
                    </div>

                    {sortedImageFiles &&
                      sortedImageFiles.map((image) => {
                        if (image.url) {
                          return image.moduleId === 6 ? (
                            <div
                              className={styles.profileModuleRectangle}
                              key={image.moduleId}
                              onClick={() => toggleOverlay(image.moduleId)}
                            >
                              {udlOverlay.find(
                                (item) => item.moduleId === image.moduleId
                              )?.overlay ? (
                                <UDLOverlay />
                              ) : null}

                              <Image
                                className={`${image.name} ${styles.objectFit}`}
                                src={image.url}
                                alt={image.name}
                                height={350}
                                width={700}
                              />
                              <div className={styles.infoIcon}>
                                <InfoIcon color={'var(--artape-black)'} />
                              </div>
                            </div>
                          ) : (
                            <div
                              className={styles.profileModule}
                              key={image.moduleId}
                              onClick={() => toggleOverlay(image.moduleId)}
                            >
                              {udlOverlay.find(
                                (item) => item.moduleId === image.moduleId
                              )?.overlay ? (
                                <UDLOverlay />
                              ) : null}

                              <Image
                                className={`${image.name} ${styles.objectFit}`}
                                src={image.url}
                                alt={image.name}
                                height={400}
                                width={400}
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
          </FadeInAndOut>
        )}
        ;
      </main>
    </>
  );
};

export default Tape;
