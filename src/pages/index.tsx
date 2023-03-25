import { useState } from "react";
import Head from "next/head";
import styles from "@/styles/Home.module.css";
import AudioPlayer from "@/components/AudioPlayer";
import Image from "next/image";
import Modal from "@/components/Modal";

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);

  const close = () => setModalOpen(false);
  const open = () => setModalOpen(true);

  return (
    <>
      <Head>
        <title>ArTape</title>
        <meta name="description" content="Modern Web3 listening" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div style={{ display: "flex", marginBottom: "10px" }}>
          <div>
            <h1>So Loki</h1>
          </div>
        </div>
        <div className={styles.gridProfile}>
          <div
            className={styles.profileModule}
            onClick={() => (modalOpen ? close() : open())}
            style={{
              cursor: "pointer",
              backgroundColor: "var(--artape-primary-color)",
            }}
          >
            Play
          </div>
          <div className={styles.profileModule}>
            <Image
              src={"/artwork1.webp"}
              alt={"artwork-cry-eyes"}
              width={400}
              height={400}
            />
          </div>
          <div className={styles.profileModule}>
            <Image
              src={"/artwork1.webp"}
              alt={"artwork-cry-eyes"}
              width={350}
              height={350}
            />
          </div>
          <div className={styles.profileModule}>
            <Image
              src={"/artwork1.webp"}
              alt={"artwork-cry-eyes"}
              width={350}
              height={350}
            />
          </div>
          <div className={styles.profileModule}>
            <Image
              src={"/artwork1.webp"}
              alt={"artwork-cry-eyes"}
              width={350}
              height={350}
            />
          </div>
          <div className={styles.profileModule}>
            <Image
              src={"/artwork1.webp"}
              alt={"artwork-cry-eyes"}
              width={350}
              height={350}
            />
          </div>
          <div className={styles.profileModule}>
            <Image
              src={"/artwork1.webp"}
              alt={"artwork-cry-eyes"}
              width={350}
              height={350}
            />
          </div>
          <div className={styles.profileModule}>
            <Image
              src={"/artwork1.webp"}
              alt={"artwork-cry-eyes"}
              width={350}
              height={350}
            />
          </div>
          <div className={styles.profileModule}>
            <Image
              src={"/artwork1.webp"}
              alt={"artwork-cry-eyes"}
              width={350}
              height={350}
            />
          </div>
        </div>
        {modalOpen && <Modal modalOpen={modalOpen} handleClose={close} />}
      </main>
    </>
  );
}
