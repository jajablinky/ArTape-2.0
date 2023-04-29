import { useRouter } from 'next/router';
import { useTape } from '@/components/TapeContext';
import styles from '@/styles/Home.module.css';
import Image from 'next/image';
import { useEffect } from 'react';
import AudioPlayer, { AudioFile } from '@/components/AudioPlayer';
import PineappleMemento from '@/components/Images/Mementos/PineappleMemento';
import LoudMemento from '@/components/Images/Mementos/LoudMemento';
import MinimalMemento from '@/components/Images/Mementos/MinimalMemento';
import CassetteMemento from '@/components/Images/Mementos/CassetteMemento';
import EditButton from '@/components/Images/UI/EditButton';

const Tape = () => {
  const router = useRouter();
  const { id } = router.query;
  const { tape } = useTape();

  if (!tape) {
    // Handle the case when there is no tape data available
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
  const { audioFiles, tapeInfoJSON, imageFiles } = tape;
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
                backgroundImage: `url(${imageFiles[0].url})`,
              }}
            ></div>
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
                  <span style={{ fontWeight: 'normal' }}>
                    's Tape
                  </span>
                </h1>
                <div className={styles.memento}>
                  {mementoGenerator()}
                </div>
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
          <div className={styles.profileModule}>
            {imageFiles[0].url && (
              <Image
                className={imageFiles[0].name}
                src={imageFiles[0].url}
                alt={imageFiles[0].name}
                height={350}
                width={350}
                style={{ objectFit: 'cover' }}
              />
            )}
          </div>
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
              imageFiles={imageFiles}
            />
          </div>
          {imageFiles &&
            imageFiles
              .filter((image) => parseInt(image.moduleId) >= 3)
              .sort(
                (a, b) => parseInt(a.moduleId) - parseInt(b.moduleId)
              )
              .map((image, index) => {
                if (image.url) {
                  return parseInt(image.moduleId) === 6 ? (
                    <div
                      key={image.name}
                      className={styles.profileModuleRectangle}
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
                    <div
                      key={image.name}
                      className={styles.profileModule}
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
                  );
                }
                return null;
              })}
        </div>
        {/* <div>
          {audioFiles ? (
            <>
              <h1>Audio URLs:</h1>
              <ul>
                {audioFiles.map((url, index) => (
                  <li key={index}>{url}</li>
                ))}
              </ul>{' '}
            </>
          ) : null}
          {imageFiles ? (
            <>
              <h1>Image URLs:</h1>
              <ul>
                {imageFiles.map((url, index) => (
                  <li key={index}>{url}</li>
                ))}
              </ul>{' '}
            </>
          ) : null}
          {tapeInfoJSON ? (
            <>
              <h1>Tape Info Metadata:</h1>
              <p>{JSON.stringify(tapeInfoJSON, null, 2)}</p>
            </>
          ) : null}
        </div> */}
      </main>
    </>
  );
};

export default Tape;
