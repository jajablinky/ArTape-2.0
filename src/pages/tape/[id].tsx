import { useRouter } from 'next/router';
import { useTape } from '@/components/TapeContext';
import styles from '@/styles/Home.module.css';
import Image from 'next/image';
import { useEffect } from 'react';
import AudioPlayer, { AudioFile } from '@/components/AudioPlayer';

const Tape = () => {
  const router = useRouter();
  const { id } = router.query;
  const { tape } = useTape();

  if (!tape) {
    // Handle the case when there is no tape data available
    return <div>No tape data available</div>;
  }

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
              backgroundImage: `url(${imageFiles[1].url})`,
            }}
          ></div>
          <div>
            <h1>
              <b>{tapeInfoJSON.tapeArtistName}</b>
              <span style={{ fontWeight: 'normal' }}>'s Tape</span>
            </h1>
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
                      key={index}
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
                    <div key={index} className={styles.profileModule}>
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
