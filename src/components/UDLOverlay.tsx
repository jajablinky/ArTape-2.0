import Link from 'next/link';
import FadeInAndOut from './FadeInAndOut';
import UdlBadge from './Images/UI/UdlBadge';
import Loader from './Loader';
import styles from '@/styles/udl.module.css';

const UDLOverlay = () => {
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
              <p>UDL License Details </p>
            </a>
          </div>
        </div>
      </div>
    </FadeInAndOut>
  );
};

export default UDLOverlay;
