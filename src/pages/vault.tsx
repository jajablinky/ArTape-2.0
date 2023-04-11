import { useState } from 'react';
import styles from '@/styles/Home.module.css';
import Image from 'next/image';
import Modal from '@/components/Modal';

export default function VaultId() {
  const [modalOpen, setModalOpen] = useState(false);
  const close = () => setModalOpen(false);
  const open = () => setModalOpen(true);

  return (
    <>
      <main className={styles.main}>
        <div>
          <h1>So Loki</h1>
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
          <Modal modalOpen={modalOpen} handleClose={close} />
        )}
      </main>
    </>
  );
}
