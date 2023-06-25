import { FormEvent, useState } from 'react';
import Head from 'next/head';
import styles from '@/styles/Home.module.css';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useRouter } from 'next/router';
import { Akord, Auth, NodeLike } from '@akord/akord-js';

import { useTape } from '@/components/TapeContext';
import Link from 'next/link';
import Loader from '@/components/Loader';
import LoadingOverlay from '@/components/LoadingOverlay';
import AkordSignIn from '@/components/Helper Functions/AkordSignIn';

import { TapeInfo } from '@/types/TapeInfo';
import { VaultValues } from '@/types/VaultValues';

import EmailPasswordForm from '@/components/EmailPasswordForm';
import VaultSelectionForm from '@/components/VaultSelectionForm';
import ArTapeFontLogo from '@/components/Images/Logos/ArTapeFontLogo';

export default function Home() {
  /* -- State  -- */
  //
  //

  const [progress, setProgress] = useState({
    percentage: 0,
    state: 'Communicating with Akord',
  });
  const { tape, setTape } = useTape();
  const [loading, setLoading] = useState(false);
  const [akord, setAkord] = useState<Akord | null>();
  const [tapeInfoOptions, setTapeInfoOptions] = useState<TapeInfo[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [selectedTapeInfo, setSelectedTapeInfo] = useState<TapeInfo | null>(
    null
  );
  const [showVaultIdForm, setShowVaultIdForm] = useState(false);

  //
  //
  /* -- State  -- */

  const router = useRouter();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<VaultValues>();
  const onSubmit: SubmitHandler<VaultValues> = async (data) => {
    //
    setLoading(true);
    const akord = await AkordSignIn(data.email, data.password);
    setAkord(akord);

    setProgress({
      percentage: 20,
      state: `Successful Sign-in, welcome ${data.email}`,
    });

    // Display any ArTapes containing the correct tag
    const vaults = await akord.vault.listAll({
      tags: {
        values: ['ArTape'],
        searchCriteria: 'CONTAINS_SOME',
      },
    });
    const tapeInfos = [];

    for (let i = 0; i < vaults.length; i++) {
      const vaultId = vaults[i].id;

      tapeInfos.push({
        tapeName: vaults[i].name,
        vaultId,
      });
    }

    // display for user selection which vault to display
    setTapeInfoOptions(tapeInfos);
    setIsAuthenticated(true);

    setLoading(false);
  };

  const handleVaultSelection = async (event: FormEvent<HTMLFormElement>) => {
    if (!selectedTapeInfo) return;
    event.preventDefault(); // Add this line to prevent form
    setLoading(true);
    const { vaultId } = selectedTapeInfo;
    if (akord) {
      console.log('akord');

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

      // List all items inside the most recent version of tape
      const items = await akord.stack.listAll(vaultId, { parentId: id });
      let tapeInfoJSON: any;
      const imageFileNameToModuleId = new Map<string, string>();
      const audioPromises: Promise<string | null | void>[] = [];
      const imagePromises: Promise<string | null | void>[] = [];

      const audioFiles: { name: string; url: string | null }[] = [];
      const imageFiles: {
        name: string;
        url: string | null;
        moduleId: number;
      }[] = [];

      let profilePicture: { name: string; url: string } = {
        name: '',
        url: '',
      };
      let albumPicture: { name: string; url: string } = {
        name: '',
        url: '',
      };

      profilePicture.name = (tapeInfoJSON && tapeInfoJSON.profilePicture) || '';
      albumPicture.name =
        (tapeInfoJSON && tapeInfoJSON.audioFiles[0].albumPicture) || '';

      let tapeInfoPromise: Promise<void | null> = Promise.resolve();

      items.forEach((item) => {
        if (item.name === 'tapeInfo.json') {
          const tapeInfoId = item.id;
          tapeInfoPromise = akord.stack
            .getVersion(tapeInfoId)
            .then(({ data: decryptedTapeInfo }) => {
              const tapeInfoString = new TextDecoder().decode(
                decryptedTapeInfo
              );
              tapeInfoJSON = JSON.parse(tapeInfoString);
              if (tapeInfoJSON && tapeInfoJSON.imageFiles) {
                tapeInfoJSON.imageFiles.forEach((image: any) => {
                  imageFileNameToModuleId.set(image.name, image.moduleId);
                });
              }
              console.log('collected audio metadata');
              return null;
            });
        }
      });

      await tapeInfoPromise;

      items.forEach((item) => {
        if (item.versions[0].type.startsWith('audio')) {
          const audioId = item.id;
          const audioPromise = akord.stack
            .getVersion(audioId)
            .then(({ data: decryptedAudio }) => {
              const blobUrl = URL.createObjectURL(new Blob([decryptedAudio]));
              audioFiles.push({ name: item.name, url: blobUrl });
            });
          audioPromises.push(audioPromise);
        } else if (item.versions[0].type.startsWith('image')) {
          const imageId = item.id;
          const imagePromise = akord.stack
            .getVersion(imageId)
            .then(({ data: decryptedImage }) => {
              const blobUrl = URL.createObjectURL(new Blob([decryptedImage]));
              const moduleId =
                Number(imageFileNameToModuleId.get(item.name)) || 0;

              // Only add to imageFiles if it's not a profile picture or album picture
              if (
                item.name !== tapeInfoJSON.profilePicture &&
                item.name !== tapeInfoJSON.audioFiles[0].albumPicture &&
                item.name !== tapeInfoJSON.audioFiles[1].albumPicture &&
                item.name !== tapeInfoJSON.audioFiles[2].albumPicture
              ) {
                imageFiles.push({
                  name: item.name,
                  url: blobUrl,
                  moduleId,
                });
              }

              if (item.name === tapeInfoJSON.profilePicture) {
                profilePicture.name = item.name;
                profilePicture.url = blobUrl;
              }
              if (
                item.name === tapeInfoJSON.audioFiles[0].albumPicture ||
                item.name === tapeInfoJSON.audioFiles[1].albumPicture ||
                item.name === tapeInfoJSON.audioFiles[2].albumPicture
              ) {
                albumPicture.name = item.name;
                albumPicture.url = blobUrl;
              }
            });
          imagePromises.push(imagePromise);
        }
      });

      await Promise.all(audioPromises);
      await Promise.all(imagePromises);
      console.log(imageFiles);
      console.log('collected songs');
      console.log('collected images');
      setTape({
        audioFiles,
        imageFiles,
        tapeInfoJSON,
        albumPicture,
        profilePicture,
      });
      // router.push({
      //   pathname: `/tape/${[vaultId]}`,
      // });
    }
    setLoading(false);
  };
  return (
    <>
      <Head>
        <title>ArTape</title>
        <meta name="description" content="Modern Web3 listening" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        {loading ? <LoadingOverlay progress={progress} /> : null}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '64px',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '24px',
            }}
          >
            <Loader invert size="md" />
            <ArTapeFontLogo color={'--var(--artape-black)'} />
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
            }}
          >
            {showVaultIdForm && isAuthenticated ? (
              <VaultSelectionForm
                tapeInfoOptions={tapeInfoOptions}
                setSelectedTapeInfo={setSelectedTapeInfo}
                handleSubmit={handleSubmit}
                onSubmit={handleVaultSelection}
                loading={loading}
              />
            ) : showVaultIdForm ? (
              <EmailPasswordForm
                onSubmit={handleSubmit(onSubmit)}
                loading={loading}
                errors={errors}
                register={register}
              />
            ) : (
              <>
                <button
                  style={{
                    border: '1px solid var(--artape-black)',
                    background: 'transparent',
                    color: 'var(--artape-black)',
                    fontSize: '12px',
                  }}
                  onClick={() => setShowVaultIdForm(true)}
                >
                  Sign In
                </button>
                <Link href="/create">
                  <button
                    style={{
                      background: 'transparent',
                      color: 'var(--artape-black)',

                      fontSize: '12px',
                    }}
                  >
                    Create A New Tape
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
