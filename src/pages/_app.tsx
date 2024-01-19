import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { TapeProvider, useTape } from '../components/Context/TapeContext';
import styles from '@/styles/Home.module.css';
import FadeInAndOut from '@/components/FadeInAndOut';
import NavSidebar from '@/components/NavSidebar';
import { useRouter } from 'next/router';
import MediaPlayerProvider from '@/components/Context/MediaPlayerProvider';

export default function App({ Component, pageProps }: AppProps) {
  const { tape, setTape } = useTape();
  const router = useRouter();

  return (
    <TapeProvider>
      <MediaPlayerProvider>
        <main className={styles.main}>
          <FadeInAndOut>
            <div className={styles.fullWrapper}>
              <div className={styles.fullContainer}>
                <NavSidebar router={router} />
                <Component {...pageProps} />
              </div>
            </div>
          </FadeInAndOut>
        </main>
      </MediaPlayerProvider>
    </TapeProvider>
  );
}
