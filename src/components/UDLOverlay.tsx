import { useEffect } from 'react';

import Link from 'next/link';
import FadeInAndOut from './FadeInAndOut';
import UdlBadge from './Images/UI/UdlBadge';
import Loader from './Loader';
import styles from '@/styles/udl.module.css';

const UDLOverlay = ({ imageFile }) => {
  useEffect(() => {
    console.log('image file overlay', imageFile);
  }, []);
  return (
    <FadeInAndOut>
      <div className={styles.udlOverlay}>
        <div className={styles.overlayHeader}>
          <div className={styles.udlBadgeIcon}>
            <UdlBadge />
          </div>
          <div>
            <p>Learn more about: </p>
            <a target="_blank" href="https://udlicense.arweave.dev/">
              <b>
                <p>UDL License Details </p>
              </b>
            </a>
          </div>
        </div>
        <div className={styles.udlList}>
          <div className={styles.udlListItem}>
            <p>Commercial-Use</p>
            <p>Allowed</p>
          </div>
          <div className={styles.udlListItem}>
            <p>Derivation</p>
            <p>Allowed With Credit</p>
          </div>
          <div className={styles.udlListItem}>
            <p>License-Fee</p>
            <p>One Time 10</p>
          </div>
          <div className={styles.udlListItem}>
            <p>Payment-Mode</p>
            <p>Global Distribution</p>
          </div>
          <div className={styles.udlListItem}>
            <p>License</p>
            <p>Global Distribution</p>
          </div>
        </div>
      </div>
    </FadeInAndOut>
  );
};

export default UDLOverlay;
