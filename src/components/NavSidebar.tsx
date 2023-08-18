import { useEffect, useState } from 'react';
import styles from '@/styles/sidebar.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { NodeLike } from '@akord/akord-js';
import {
  AudioFileWithUrls,
  ImageFileWithUrls,
  TapeInfoJSON,
} from '@/types/TapeInfo';
import getTapeInfoJSON from './Helper Functions/getTapeInfoJSON';
import processItem from './Helper Functions/processItem';

const NavSidebar = ({
  profileAvatar,
  profileName,
  profileEmail,
  tapes,
  akord,
  setLoading,
  setTape,
  tape,
  router,
  setProgress,
}) => {
  const [profileAvatarURL, setProfileAvatarURL] = useState('');

  const handleProfilePhoto = async () => {
    let buffer = profileAvatar;
    let blob = new Blob([buffer], { type: 'image/jpg' });
    let profileAvatarURL = URL.createObjectURL(blob);
    setProfileAvatarURL(profileAvatarURL);
  };

  const handleVaultSelection = async (i: number) => {
    try {
      setProgress({
        percentage: 0,
        state: 'Communicating with Akord',
      });
      const vaultId = tapes[i].vaultId;
      setLoading(true);
      // Type guard to make sure that folders must contain an object with name
      type NamedNode = NodeLike & { name: string };
      // Find the most recent folder's id
      const folders = await akord.folder.listAll(vaultId);
      const namedFolders: NamedNode[] = folders.filter(
        (folder: NodeLike): folder is NamedNode => 'name' in folder
      );
      const { id } = namedFolders.reduce<NamedNode>(
        (highest: NamedNode, currentFolder: NamedNode): NamedNode => {
          const [highestMajor, highestMinor, highestPatch] = highest.name
            .split('.')
            .map(Number);
          const [currentMajor, currentMinor, currentPatch] = currentFolder.name
            .split('.')
            .map(Number);

          if (currentMajor > highestMajor) return currentFolder;
          if (currentMajor === highestMajor && currentMinor > highestMinor)
            return currentFolder;
          if (
            currentMajor === highestMajor &&
            currentMinor === highestMinor &&
            currentPatch > highestPatch
          )
            return currentFolder;

          return highest;
        },
        { name: '0.0.0', id: '' } as NamedNode
      );
      setProgress({
        percentage: 20,
        state: 'Working! Found Recent Version',
      });
      // List all items inside the most recent version of tape
      const items = await akord.stack.listAll(vaultId, { parentId: id });
      let tapeInfoJSON: TapeInfoJSON = {
        audioFiles: [],
        color: '',
        imageFiles: [],
        memento: '',
        profilePicture: '',
        tapeArtistName: '',
        tapeDescription: '',
        type: '',
      };

      const albumPictures: { [name: string]: string } = {};

      const tapeInfoPromises: Promise<TapeInfoJSON | null>[] = [];
      items.forEach((item) => {
        tapeInfoPromises.push(getTapeInfoJSON(item, akord));
      });

      const tapeInfoJSONs = await Promise.all(tapeInfoPromises);

      // Merge all the TapeInfoJSONs into tapeInfoJSON
      tapeInfoJSONs.forEach((tapeInfo) => {
        if (tapeInfo) {
          tapeInfoJSON = { ...tapeInfoJSON, ...tapeInfo };
        }
      });
      const processPromises: Promise<{
        audioFiles?: AudioFileWithUrls[];
        imageFiles?: ImageFileWithUrls[];
        profilePicture?: { name: string; url: string };
      }>[] = [];

      items.forEach((item) => {
        processPromises.push(
          processItem(item, tapeInfoJSON, akord, albumPictures)
        );
      });
      setProgress({
        percentage: 80,
        state: 'Processing',
      });
      const processResults = await Promise.all(processPromises);

      const audioFiles: AudioFileWithUrls[] = [];
      const imageFiles: ImageFileWithUrls[] = [];
      const profilePicture: { name: string; url: string } = {
        name: '',
        url: '',
      };

      // Merge all the process results into audioFiles, imageFiles, and profilePicture
      processResults.forEach((result) => {
        if (result.audioFiles) {
          audioFiles.push(...result.audioFiles);
        }
        if (result.imageFiles) {
          imageFiles.push(...result.imageFiles);
        }
        if (result.profilePicture) {
          profilePicture.name = result.profilePicture.name;
          profilePicture.url = result.profilePicture.url;
        }
      });

      console.log('collected songs');
      console.log('collected images');
      setProgress({
        percentage: 100,
        state: 'Success!',
      });
      setTape({
        ...tape,
        audioFiles,
        color: tapeInfoJSON?.color,
        imageFiles,
        memento: tapeInfoJSON?.memento,
        profilePicture,
        tapeArtistName: tapeInfoJSON?.tapeArtistName,
        tapeDescription: tapeInfoJSON?.tapeDescription,
        type: tapeInfoJSON?.type,
        tapeInfoJSON,
      });
      router.push({
        pathname: `/tape/${[vaultId]}`,
      });
      setLoading(false);
    } catch (e) {
      console.error('error: ', e);
      setLoading(false);
    }
  };

  useEffect(() => {
    handleProfilePhoto();
  }, []);

  return (
    <>
      <div className={styles.hideSidebar}>
        <div className={styles.sidebarContainer}>
          <div className={styles.top}>
            <div className={styles.profileMainHeader}>
              <div className={styles.profilePhoto}>
                <Image
                  className={styles.imageProfilePhoto}
                  src={profileAvatarURL}
                  alt={'profile-avatar'}
                  width={59}
                  height={59}
                />
              </div>
              <div className={styles.profileTextContent}>
                <h2>{profileName}</h2>
                <span>{profileEmail}</span>
              </div>
            </div>

            <div className={styles.profileStats}>
              {tapes.length > 1 ? (
                <div className={styles.vaultNumberStats}>
                  {tapes.length} Tapes
                </div>
              ) : (
                <div className={styles.vaultNumberStats}>
                  {tapes.length} Tape
                </div>
              )}
              <div className={styles.linkToAkord}>
                <Link href={'https://v2.akord.com/login'}>
                  Go See Akord Account
                </Link>
              </div>
            </div>
            <div className={styles.artapeSelectionHeader}>
              Artape Collection:
            </div>

            {tapes.map((tape: any, i: number) => {
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
            })}
          </div>
          <div className={styles.bottom}></div>
        </div>
      </div>
    </>
  );
};

export default NavSidebar;
