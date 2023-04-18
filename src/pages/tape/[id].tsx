import { useRouter } from 'next/router';
import { useTape } from '@/components/TapeContext';
import styles from '@/styles/Home.module.css';
import Image from 'next/image';

const Tape = () => {
  const router = useRouter();
  const { id } = router.query;
  const { tape } = useTape();

  if (!tape) {
    // Handle the case when there is no tape data available
    return <div>No tape data available</div>;
  }

  const { audioUrls, tapeInfoJSON, imageUrls } = tape;
  return (
    <>
      <main className={styles.main}>
        <div>
          <h1>So Loki</h1>
        </div>

        <div className={styles.gridProfile}>
          <div className={styles.profileModule}>
            <Image
              src={imageUrls[0]}
              alt={'artwork-cry-eyes'}
              width={350}
              height={350}
            />
          </div>
          <div
            className={styles.profileModuleRectangle}
            style={{
              cursor: 'pointer',
              backgroundColor: 'var(--artape-primary-color)',
            }}
          >
            Music Player
          </div>
          {imageUrls
            ? imageUrls.map((url, index) => (
                <div className={styles.profileModule}>
                  <Image
                    src={url}
                    alt={'artwork-cry-eyes'}
                    width={350}
                    height={350}
                  />
                </div>
              ))
            : null}
        </div>
        <div>
          {audioUrls ? (
            <>
              <h1>Audio URLs:</h1>
              <ul>
                {audioUrls.map((url, index) => (
                  <li key={index}>{url}</li>
                ))}
              </ul>{' '}
            </>
          ) : null}
          {imageUrls ? (
            <>
              <h1>Image URLs:</h1>
              <ul>
                {imageUrls.map((url, index) => (
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
        </div>
      </main>
    </>
  );
};

export default Tape;
