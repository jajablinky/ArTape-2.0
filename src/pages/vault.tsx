import styles from '@/styles/Home.module.css';
import Image from 'next/image';

export default function VaultId() {
  return (
    <>
      <main className={styles.main}>
        <div>
          <h1>So Loki</h1>
        </div>

        <div className={styles.gridProfile}>
          <div className={styles.profileModule}>
            <Image
              src={'/artwork1.webp'}
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
          <div className={styles.profileModule}>
            <Image
              src={'/artwork1.webp'}
              alt={'artwork-cry-eyes'}
              width={350}
              height={350}
            />
          </div>
          <div className={styles.profileModule}>
            <Image
              src={'/artwork1.webp'}
              alt={'artwork-cry-eyes'}
              width={350}
              height={350}
            />
          </div>
          <div className={styles.profileModule}>
            <Image
              src={'/artwork1.webp'}
              alt={'artwork-cry-eyes'}
              width={350}
              height={350}
            />
          </div>
          <div className={styles.profileModuleRectangle}>
            <Image
              src={'/artwork1.webp'}
              alt={'artwork-cry-eyes'}
              width={350}
              height={350}
            />
          </div>
          <div className={styles.profileModule}>
            <Image
              src={'/artwork1.webp'}
              alt={'artwork-cry-eyes'}
              width={350}
              height={350}
            />
          </div>
        </div>
      </main>
    </>
  );
}
