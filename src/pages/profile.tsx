import React from "react";
import styles from "@/styles/Home.module.css";

const profile = () => {
  return (
    <main>
      <div>
        <h1>So Loki</h1>
      </div>
      <div className={styles.gridProfile}>
        <div className={styles.profileModule}></div>
        <div className={styles.profileModule}></div>
        <div className={styles.profileModule}></div>
        <div className={styles.profileModule}></div>
        <div className={styles.profileModule}></div>
        <div className={styles.profileModule}></div>
        <div className={styles.profileModule}></div>
        <div className={styles.profileModule}></div>
        <div className={styles.profileModule}></div>
      </div>
    </main>
  );
};

export default profile;
