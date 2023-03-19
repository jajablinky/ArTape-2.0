import Head from "next/head";
import styles from "@/styles/Home.module.css";
import AudioPlayer from "@/components/AudioPlayer";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <Head>
        <title>ArTape</title>
        <meta name="description" content="Modern Web3 listening" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div>
          <h1>So Loki</h1>
          <p>Vancouver, Canada</p>
        </div>
        <div className={styles.gridProfile}>
          <div className={styles.profileModule}>
            <AudioPlayer />
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
          <div className={styles.profileModule}>
            <Image
              src={"/artwork1.webp"}
              alt={"artwork-cry-eyes"}
              width={350}
              height={350}
            />
          </div>
        </div>
      </main>
    </>
  );
}
