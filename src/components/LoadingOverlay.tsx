import React from 'react';
import Loader from './Loader';
import styles from '@/styles/loader.module.css';

const LoadingOverlay = () => {
  return (
    <div className={styles.loaderMain}>
      <Loader size="large" />
    </div>
  );
};

export default LoadingOverlay;
