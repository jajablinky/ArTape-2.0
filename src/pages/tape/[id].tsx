import { useRouter } from 'next/router';

import { useTape } from '@/components/TapeContext';
import styles from '@/styles/Home.module.css';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import AudioPlayer, { AudioFile } from '@/components/AudioPlayer';
import PineappleMemento from '@/components/Images/Mementos/PineappleMemento';
import LoudMemento from '@/components/Images/Mementos/LoudMemento';
import MinimalMemento from '@/components/Images/Mementos/MinimalMemento';
import CassetteMemento from '@/components/Images/Mementos/CassetteMemento';
import EditButton from '@/components/Images/UI/EditButton';

const Tape = () => {
  const [sortedImageFiles, setSortedImagesFiles] = useState<
    {
      name: string;
      url: string | null;
      moduleId: string;
    }[]
  >([]);

  const router = useRouter();
  const { id } = router.query;
  const { tape } = useTape();

  if (!tape) {
    return <div>No tape data available</div>;
  }
  const mementoGenerator = () => {
    if (tapeInfoJSON.memento === 'Pineapple') {
      return <PineappleMemento color={tapeInfoJSON.color} />;
    } else if (tapeInfoJSON.memento === 'Loud') {
      return <LoudMemento color={tapeInfoJSON.color} />;
    } else if (tapeInfoJSON.memento === 'Minimal') {
      return <MinimalMemento color={tapeInfoJSON.color} />;
    } else if (tapeInfoJSON.memento === 'Minimal') {
      return <CassetteMemento color={tapeInfoJSON.color} />;
    } else {
      return null;
    }
  };
  const { audioFiles, tapeInfoJSON, imageFiles, albumPicture, profilePicture } =
    tape;

  useEffect(() => {
    if (imageFiles && imageFiles.length > 0) {
      const filteredImageFiles = imageFiles.filter((image) => {
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
      (image) => image.moduleId === targetModuleId
    );

    if (targetImage) {
      return (
        <Image
          className={targetImage.name}
          src={targetImage.url}
          alt={targetImage.name}
          height={350}
          width={350}
          style={{ objectFit: 'cover' }}
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
            '--artape-primary-color': tapeInfoJSON.color,
          } as React.CSSProperties
        }
      >
        <div
          className={styles.artistHeader}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div
            className={styles.artistHeaderLeft}
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '20px',
            }}
          >
            <div
              className={styles.profilePicture}
              style={{
                borderRadius: '12px',
              }}
            >
              <Image
                width={100}
                height={100}
                alt={profilePicture.name}
                src={profilePicture.url}
                style={{
                  borderRadius: '12px',
                  objectFit: 'cover',
                }}
              />
            </div>
            <div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: '12px',
                }}
              >
                <h1>
                  <b>{tapeInfoJSON.tapeArtistName}</b>
                  <span style={{ fontWeight: 'normal' }}>'s Tape</span>
                </h1>
                <div className={styles.memento}>{mementoGenerator()}</div>
              </div>

              <p style={{ fontSize: '28px', fontWeight: 'lighter' }}>
                {tapeInfoJSON.type}
              </p>
              <p
                style={{
                  fontSize: '20px',
                  fontWeight: 'lighter',
                  color: '#656565',
                }}
              >
                {tapeInfoJSON.tapeDescription}
              </p>
            </div>
          </div>
          <div className={styles.artistHeaderRight}>
            <EditButton color={tapeInfoJSON.color} />
          </div>
        </div>

        <div className={styles.gridProfile}>
          <div className={styles.profileModule}>{renderFirstImage(1)}</div>
          <div
            className={styles.profileModuleRectangle}
            style={{
              backgroundColor: 'var(--artape-primary-color)',
              overflow: 'auto',
            }}
          >
            <AudioPlayer
              audioFiles={
                audioFiles.filter(
                  (audioFile) => audioFile.url !== null
                ) as AudioFile[]
              }
              tapeInfoJSON={tapeInfoJSON}
              albumPicture={albumPicture}
            />
          </div>
          {sortedImageFiles &&
            sortedImageFiles.map((image) => {
              if (image.url) {
                return parseInt(image.moduleId) === 6 ? (
                  <div
                    className={styles.profileModuleRectangle}
                    key={image.name}
                  >
                    <Image
                      className={image.name}
                      src={image.url}
                      alt={image.name}
                      height={350}
                      width={350}
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                ) : (
                  <div className={styles.profileModule} key={image.name}>
                    <Image
                      className={image.name}
                      src={image.url}
                      alt={image.name}
                      height={350}
                      width={350}
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                );
              }
            })}
        </div>
      </main>
    </>
  );
};

export default Tape;
