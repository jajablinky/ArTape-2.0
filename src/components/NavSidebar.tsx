import React from 'react';
import styles from '@/styles/sidebar.module.css';
import Image from 'next/image';
import dummyProfilePhoto from './Images/Images/dummyProfilePhoto.png';

const NavSidebar = () => {
  return (
    <>
      <div className={styles.sidebarContainer}>
        <div className={styles.top}>
          <div className={styles.profileMainHeader}>
            <div className={styles.profilePhoto}>
              <Image
                className={styles.imageProfilePhoto}
                src={dummyProfilePhoto}
                alt={'dummy-profile-photo'}
              />
            </div>
            <div className={styles.profileTextContent}>
              <h2>JAJABLINKY</h2>
              <span>gmillar6@gmail.com</span>
            </div>
          </div>

          <div className={styles.profileStats}>
            <div className={styles.vaultNumberStats}>150 Vaults</div>
            <div className={styles.vaultStorageStats}>150gb used</div>
          </div>
          <div className={styles.artapeSelectionHeader}>Artape Collection:</div>
          <div className={styles.artape}>
            <div
              className={styles.artapeColor}
              style={{ background: 'red' }}
            ></div>
            <div className={styles.artapeName}>Foushee</div>
          </div>
        </div>
        <div className={styles.bottom}></div>
      </div>
    </>
  );
};

export default NavSidebar;
