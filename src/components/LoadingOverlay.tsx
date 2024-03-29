import React from 'react';
import Loader from './Loader';
import styles from '@/styles/loader.module.css';
import ProgressBar from './LoadingProgressBar';
import FadeInAndOut from './FadeInAndOut';

const LoadingOverlay = ({ progress }) => {
  return (
    <div className={styles.loaderMain}>
      <Loader size="large" />
      <ProgressBar progress={progress} />
    </div>
  );
};

export default LoadingOverlay;
