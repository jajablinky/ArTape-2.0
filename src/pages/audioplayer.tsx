import styles from "@/styles/Home.module.css";
import AudioPlayer from "@/components/AudioPlayer";

const profile = () => {
  return (
    <main className={styles.main}>
      <AudioPlayer />
    </main>
  );
};

export default profile;
