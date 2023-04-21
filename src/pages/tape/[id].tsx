import { useRouter } from 'next/router';
import { useTape } from '@/components/TapeContext';
import styles from '@/styles/Home.module.css';
import Image from 'next/image';
import { useEffect } from 'react';
import AudioPlayer from '@/components/AudioPlayer';

const Tape = () => {
  const router = useRouter();
  const { id } = router.query;
  const { tape } = useTape();

  if (!tape) {
    // Handle the case when there is no tape data available
    return <div>No tape data available</div>;
  }

  useEffect(() => {
    console.log(audioFiles);
  }, []);
  const { audioFiles, tapeInfoJSON, imageFiles } = tape;
  return (
    <>
      <main className={styles.main}>
        <div>
          <h1>So Loki</h1>
        </div>
        <div className={styles.gridProfile}>
          <div>
            {imageFiles[0].url && (
              <Image
                className={imageFiles[0].name}
                src={imageFiles[0].url}
                alt={imageFiles[0].name}
                width={350}
                height={350}
              />
            )}
          </div>
          <div
            className={styles.profileModuleRectangle}
            style={{
              cursor: 'pointer',
              backgroundColor: 'var(--artape-primary-color)',
            }}
          >
            {/* <AudioPlayer
              audioFiles={audioFiles}
              tapeInfoJSON={tapeInfoJSON}
            /> */}
          </div>
          {imageFiles &&
            imageFiles
              .filter((image) => parseInt(image.moduleId) >= 3)
              .sort(
                (a, b) => parseInt(a.moduleId) - parseInt(b.moduleId)
              )
              .map((image, index) => {
                if (image.url) {
                  return parseInt(image.moduleId) === 3 ? (
                    <div
                      key={index}
                      className={styles.profileModuleRectangle}
                    >
                      <Image
                        className={image.name}
                        src={image.url}
                        alt={image.name}
                        width={350}
                        height={350}
                      />
                    </div>
                  ) : (
                    <div key={index} className={styles.profileModule}>
                      <Image
                        className={image.name}
                        src={image.url}
                        alt={image.name}
                        width={350}
                        height={350}
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
