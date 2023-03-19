import React from "react";
import styles from "@/styles/Home.module.css";
import AudioPlayer from "@/components/AudioPlayer";

const profile = () => {
  return (
    <main>
      <div>
        <h1>So Loki</h1>
        <p>Vancouver, Canada</p>
      </div>
      <div className={styles.gridProfile}>
        <div className={styles.profileModule}>
          <AudioPlayer />
        </div>
        <div className={styles.profileModule}>photos</div>
        <div className={styles.profileModule}>photos</div>
        <div className={styles.profileModule}>photos</div>
        <div className={styles.profileModule}>photos</div>
        <div className={styles.profileModule}>photos</div>
        <div className={styles.profileModule}>photos</div>
        <div className={styles.profileModule}>photos</div>
        <div className={styles.profileModule}>photos</div>
      </div>
    </main>
  );
};

export default profile;
