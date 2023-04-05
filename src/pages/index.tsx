import { useState } from 'react';
import Head from 'next/head';
import styles from '@/styles/Home.module.css';
import Image from 'next/image';
import Modal from '@/components/Modal';
import ArTapeLogo from '../../public/ArTAPE.svg';
import CassetteLogo from '../../public/Artape-Cassete-Logo.gif';

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
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
            flexDirection: 'column',
            gap: '64px',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '24px',
            }}
          >
            <Image src={CassetteLogo} width={25} alt="artape-logo" />
            <Image src={ArTapeLogo} width={300} alt="artape-logo" />
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
            }}
          >
            <button
              style={{
                backgroundColor: 'white',
                color: 'black',
                fontSize: '12px',
              }}
            >
              Enter In Vault Number
            </button>
            <button
              style={{
                background: 'transparent',
                color: '#ABABAB',
                fontSize: '12px',
              }}
            >
              Create A New Vault
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
