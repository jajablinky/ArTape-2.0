import { useState } from 'react';
import { Akord } from '@akord/akord-js';
import Head from 'next/head';
import styles from '@/styles/Home.module.css';
import AudioPlayer from '@/components/AudioPlayer';
import Image from 'next/image';
import Modal from '@/components/Modal';

export default function Home() {
  const [akord, setAkord] = useState<Akord | null>();
  const [email, setEmail] = useState<string>('');
  const [pass, setPass] = useState<string>('');
  const [modalOpen, setModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(
    null
  );
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLogin = async (event: any) => {
    try {
      setIsLoading(true);
      event.preventDefault();
      if (!email) {
        throw new Error('Missing email');
      }
      if (!pass) {
        throw new Error('Missing pass');
      }
      const { jwtToken, wallet } = await Akord.auth.signIn(
        email,
        pass
      );
      const akord = await Akord.init(wallet, jwtToken);
      setAkord(akord);
      setIsLoading(false);
      setIsSuccess(true);
    } catch (e) {
      setIsLoading(false);
      setErrorMessage(e.message);
    }
  };

  const renderLoadingMessage = () => {
    if (isLoading) {
      return (
        <div className="loading" role="alert">
          <p>Loading</p>
        </div>
      );
    }
    return null;
  };

  const renderSuccessMessage = () => {
    if (isSuccess) {
      return (
        <div className="success" role="alert">
          <p>Success!</p>
        </div>
      );
    }
    return null;
  };

  const renderErrorMessage = () => {
    if (errorMessage) {
      return (
        <div className="alert alert-danger" role="alert">
          {errorMessage}
        </div>
      );
    }
    return null;
  };

  const loginForm = () => {
    return (
      <div style={{ width: '340px' }}>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <input
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Login
          </button>
        </form>
        {renderLoadingMessage()}
        {renderSuccessMessage()}
        {renderErrorMessage()}
      </div>
    );
  };

  const close = () => setModalOpen(false);
  const open = () => setModalOpen(true);

  return (
    <>
      <Head>
        <title>ArTape</title>
        <meta name="description" content="Modern Web3 listening" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div
          style={{
            display: 'flex',
            marginBottom: '10px',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <h1>So Loki</h1>
          </div>
          {loginForm()}
        </div>
        <div className={styles.gridProfile}>
          <div
            className={styles.profileModule}
            onClick={() => (modalOpen ? close() : open())}
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
              width={400}
              height={400}
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
        </div>
        {modalOpen && (
          <Modal
            modalOpen={modalOpen}
            handleClose={close}
            akord={akord}
          />
        )}
      </main>
    </>
  );
}
