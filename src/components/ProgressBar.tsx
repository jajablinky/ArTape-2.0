import React, { useState } from 'react';
import styles from '@/styles/loader.module.css';

function ProgressBar({ progress }) {
  return (
    <div className={styles.progressContainer}>
      <div className={styles.progressBar}>
        <div
          className={styles.progressBarFill}
          style={{ width: `${progress.percentage}%` }}
        ></div>
      </div>
      <div className={styles.progressBarLabel}>
        {progress.state} {progress.percentage}%
      </div>
    </div>
  );
}

export default ProgressBar;
