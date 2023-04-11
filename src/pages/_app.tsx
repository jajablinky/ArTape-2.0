import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { TapeProvider } from '../components/TapeContext';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <TapeProvider>
      <Component {...pageProps} />
    </TapeProvider>
  );
}
