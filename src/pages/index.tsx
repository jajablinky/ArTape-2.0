import Head from "next/head";
import styles from "@/styles/Home.module.css";
import AudioPlayer from "@/components/AudioPlayer";

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
        <AudioPlayer />
      </main>
    </>
  );
}
