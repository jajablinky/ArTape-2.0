import { useEffect, useState } from 'react';
import styles from '@/styles/sidebar.module.css';
import Image from 'next/image';
import SidebarHide from './Images/UI/SidebarHide';

import Loader from './Loader';
import prestonPlaceholderPhoto from '../components/Images/Images/dummyProfilePhoto.png';
import { NextRouter } from 'next/router';
import Home from './Images/UI/Home';
import Explore from './Images/UI/Explore';

interface NavSidebarProps {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  router: NextRouter;
}

const NavSidebar = ({ setLoading, router }: NavSidebarProps) => {
  const [sidebarMini, setSidebarMini] = useState(false);
  const [vaultId, setVaultId] = useState(0);

  const tapes = [
    { color: 'red', tapeName: 'Tape Name' },
    { color: 'red', tapeName: 'Tape Name' },
    { color: 'red', tapeName: 'Tape Name' },
  ];

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1000) {
        setSidebarMini(true);
      } else {
        setSidebarMini(false);
      }
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleVaultSelection = async (i: number) => {
    try {
      setLoading(true);
      router.push({
        pathname: `/tape/${[vaultId]}`,
      });
      setLoading(false);
    } catch (e) {
      console.error('error: ', e);
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className={styles.sidebarContainer}
        style={{ width: sidebarMini ? '80px' : '315px' }}
      >
        <button
          className={styles.sidebarHideButton}
          style={{ transform: sidebarMini ? 'rotate(180deg)' : 'none' }}
          onClick={() => setSidebarMini((prev) => !prev)}
        >
          <SidebarHide color={'var(--artape-black)'} />
        </button>
        <div
          className={`${styles.sidebarContent} ${
            sidebarMini ? styles.bigSidebarHide : ''
          }`}
        >
          <div className={styles.top}>
            <div className={styles.profileMainHeader}>
              <Loader invert size="md" />
              <div className={styles.profileTextContent}>
                <h1>Welcome, Preston</h1>
                <Image
                  src={prestonPlaceholderPhoto}
                  alt={`${prestonPlaceholderPhoto}`}
                  width={24}
                  style={{ borderRadius: '1000px' }}
                />
              </div>
            </div>
            <div className={`${styles.module} ${styles.artapeHeader}`}>
              <Home color="var(--artape-black)" />
              HOME
            </div>
            <div className={`${styles.module} ${styles.artapeHeader}`}>
              <Explore color="var(--artape-black)" />
              EXPLORE
            </div>
            <div className={styles.artapeList}>
              {tapes.map((tape: any, i: number) => {
                return (
                  <div
                    className={`${styles.module} ${styles.artape}`}
                    onClick={() => handleVaultSelection(i)}
                    key={i}
                  >
                    <div className={styles.artapeName}>{tape.tapeName}</div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className={styles.bottom}></div>
        </div>
      </div>
    </>
  );
};

export default NavSidebar;
