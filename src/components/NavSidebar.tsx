import { useEffect, useState } from 'react';
import styles from '@/styles/sidebar.module.css';
import Image from 'next/image';
import { NodeLike } from '@akord/akord-js';
import {
  AudioFileWithUrls,
  ImageFileWithUrls,
  TapeInfoJSON,
} from '@/types/TapeInfo';
import getTapeInfoJSON from './Helper Functions/getTapeInfoJSON';
import processItem from './Helper Functions/processItem';
import SidebarHide from './Images/UI/SidebarHide';
import Link from 'next/link';
import Loader from './Loader';
import prestonPlaceholderPhoto from '../components/Images/Images/dummyProfilePhoto.png';

//

const NavSidebar = ({
  // profileAvatar,
  // profileName,
  // profileEmail,
  // akord,
  setLoading,
  setTape,
  tape,
  router,
  setProgress,
}) => {
  const [profileAvatarURL, setProfileAvatarURL] = useState('');
  const [sidebarMini, setSidebarMini] = useState(false);
  const [vaultId, setVaultId] = useState(0);

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

  // useEffect(() => {
  //   handleProfilePhoto();
  // }, []);

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
        <div className={styles.sidebarContent}>
          <div className={sidebarMini ? styles.bigSidebarHide : ''}>
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

              {/* {tapes.map((tape: any, i: number) => {
              return (
                <div
                  className={styles.artape}
                  style={{ background: tape.color }}
                  onClick={() => handleVaultSelection(i)}
                  key={tape.name}
                >
                  <div className={styles.artapeName}>{tape.tapeName}</div>
                </div>
              );
            })} */}
            </div>
            <div className={styles.bottom}></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NavSidebar;
