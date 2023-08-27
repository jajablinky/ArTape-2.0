import { useRouter } from 'next/router';

import { useTape } from '@/components/TapeContext';
import styles from '@/styles/Home.module.css';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import AudioPlayer from '@/components/AudioPlayer';
import PineappleMemento from '@/components/Images/Mementos/PineappleMemento';
import LoudMemento from '@/components/Images/Mementos/LoudMemento';
import MinimalMemento from '@/components/Images/Mementos/MinimalMemento';
import CassetteMemento from '@/components/Images/Mementos/CassetteMemento';
import EditButton from '@/components/Images/UI/EditButton';
import { ImageFileWithUrls } from '@/types/TapeInfo';
import NavSidebar from '@/components/NavSidebar';
import { profile } from 'console';
import LoadingOverlay from '@/components/LoadingOverlay';
import FadeInAndOut from '@/components/FadeInAndOut';

const Tape = () => {
  const [sortedImageFiles, setSortedImagesFiles] = useState<
    ImageFileWithUrls[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({
    percentage: 0,
    state: 'Communicating with Akord',
  });

  const router = useRouter();
  const { id } = router.query;
  const { tape, setTape } = useTape();

  if (!tape) {
    return <div>No tape data available</div>;
  }
  const mementoGenerator = () => {
    if (memento === 'Pineapple') {
      return <PineappleMemento color={color} />;
    } else if (memento === 'Loud') {
      return <LoudMemento color={color} />;
    } else if (memento === 'Minimal') {
      return <MinimalMemento color={color} />;
    } else if (memento === 'Minimal') {
      return <CassetteMemento color={color} />;
    } else {
      return null;
    }
  };
  const {
    audioFiles,
    color,
    memento,
    tapeArtistName,
    tapeDescription,
    type,
    imageFiles,
    profilePicture,
    profileAvatar,
    profileEmail,
    profileName,
    tapeInfoOptions,
    akord,
  } = tape;

  interface Image {
    moduleId: number | string | null;
  }

  useEffect(() => {
    if (imageFiles && imageFiles.length > 0) {
      const filteredImageFiles = imageFiles.filter((image: Image) => {
        if (image)
          return (
            image.moduleId !== 1 &&
            image.moduleId !== null &&
            typeof image.moduleId !== 'string'
          );
      });
      const sortedImages = [...filteredImageFiles].sort(
        (a, b) => a.moduleId - b.moduleId
      );
      setSortedImagesFiles(sortedImages);
    }
  }, [imageFiles]);

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

  const handleEditClick = () => {
    router.push({
      pathname: `/tape/${[id]}/edit`,
    });
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
        {loading ? <LoadingOverlay progress={progress} /> : null}
        <FadeInAndOut>
          <div className={styles.fullContainer}>
            <NavSidebar
              profileAvatar={profileAvatar}
              profileEmail={profileEmail}
              profileName={profileName}
              tapes={tapeInfoOptions}
              akord={akord}
              setLoading={setLoading}
              setTape={setTape}
              tape={tape}
              router={router}
              setProgress={setProgress}
            />
            <div className={styles.mainContainer}>
              <div className={styles.scrollableContainer}>
                <div className={styles.gridProfile}>
                  <div className={styles.profileModule}>
                    {renderFirstImage(1)}
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
                            key={image.name}
                          >
                            <Image
                              className={`${image.name} ${styles.objectFit}`}
                              src={image.url}
                              alt={image.name}
                              height={350}
                              width={700}
                            />
                          </div>
                        ) : (
                          <div
                            className={styles.profileModule}
                            key={image.name}
                          >
                            <Image
                              className={`${image.name} ${styles.objectFit}`}
                              src={image.url}
                              alt={image.name}
                              height={400}
                              width={400}
                            />
                          </div>
                        );
                      }
                    })}
                </div>
              </div>
            </div>
          </div>
        </FadeInAndOut>
      </main>
    </>
  );
};

export default Tape;
