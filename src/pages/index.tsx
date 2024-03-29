import { FormEvent, useEffect, useState } from 'react';
import Head from 'next/head';
import styles from '@/styles/Home.module.css';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useRouter } from 'next/router';
import { Akord, Auth, NodeLike } from '@akord/akord-js';

import { useTape } from '@/components/Context/TapeContext';
import Link from 'next/link';
import Loader from '@/components/Loader';
import LoadingOverlay from '@/components/LoadingOverlay';
import AkordSignIn from '@/components/Helper Functions/AkordSignIn';

import {
  AudioFileWithUrls,
  ImageFileWithUrls,
  TapeInfo,
  TapeInfoJSON,
  VideoFileWithUrls,
} from '@/types/TapeInfo';
import { VaultValues } from '@/types/VaultValues';

import EmailPasswordForm from '@/components/EmailPasswordForm';
import VaultSelectionForm from '@/components/VaultSelectionForm';
import ArTapeFontLogo from '@/components/Images/Logos/ArTapeFontLogo';

import getTapeInfoJSON from '@/components/Helper Functions/getTapeInfoJSON';
import processItem from '@/components/Helper Functions/processItem';
import { extractColorFromTags } from '@/components/Helper Functions/extractColorFromTags';
import FadeInAndOut from '@/components/FadeInAndOut';

export default function Home() {
  /* -- State  -- */

  // Context & Variable States
  const { tape, setTape } = useTape();
  const [akord, setAkord] = useState<Akord | null>();

  // Loading States
  const [progress, setProgress] = useState({
    percentage: 0,
    state: 'Communicating with Akord',
  });
  const [loading, setLoading] = useState(false);

  // Tape Info States
  const [tapeInfoOptions, setTapeInfoOptions] = useState<TapeInfo[]>([]);
  const [selectedTapeInfo, setSelectedTapeInfo] = useState<TapeInfo | null>(
    null
  );

  // Boolean States
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [showVaultIdForm, setShowVaultIdForm] = useState(false);

  /* -- State  -- */

  const router = useRouter();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<VaultValues>();
  const onSubmit: SubmitHandler<VaultValues> = async (data) => {
    //
    try {
      setLoading(true);
      const akord = await AkordSignIn(data.email, data.password, setLoading);
      setAkord(akord);

      setProgress({
        percentage: 20,
        state: `Successful Sign-in, welcome ${data.email}`,
      });

      // Display any ArTapes containing the correct tag
      if (akord) {
        const vaults = await akord.vault.listAll({
          tags: {
            values: ['ArTape'],
            searchCriteria: 'CONTAINS_SOME',
          },
        });

        const tapeInfos = [];

        // including color- and using the hex code after it

        for (let i = 0; i < vaults.length; i++) {
          const vaultId = vaults[i].id;
          const tags = vaults[i].tags;
          const tapeName = vaults[i].name;
          const color = extractColorFromTags(tags);

          if (tapeName && vaultId && color) {
            tapeInfos.push({
              tapeName,
              vaultId,
              color,
            });
          }
        }

        // display for user selection which vault to display
        setTapeInfoOptions(tapeInfos);
        setIsAuthenticated(true);

        setLoading(false);
      }
    } catch (error) {
      console.error('there was an error try signing in again!', error);
      setLoading(false);
    }
  };

  const handleVaultSelection = async (event: FormEvent<HTMLFormElement>) => {
    try {
      if (!selectedTapeInfo) return;
      event.preventDefault(); // Add this line to prevent form
      setLoading(true);
      const { vaultId } = selectedTapeInfo;
      if (akord) {
        // List all items inside the most recent version of tape
        const items = await akord.stack.listAll(vaultId);
        let tapeInfoJSON: TapeInfoJSON = {
          audioFiles: [],
          color: '',
          imageFiles: [],
          tapeArtistName: '',
          type: '',
          videoFiles: [],
        };

        const profile = await akord.profile.get();
        const profileEmail = profile.email;
        const profileName = profile.name;
        const profileAvatar = profile.avatar;

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
          videoFiles?: VideoFileWithUrls[];
          profilePicture?: { name: string; url: string };
        }>[] = [];

        items.forEach((item) => {
          processPromises.push(processItem(item, tapeInfoJSON, akord));
        });

        const processResults = await Promise.all(processPromises);

        const audioFiles: AudioFileWithUrls[] = [];
        const imageFiles: ImageFileWithUrls[] = [];
        const videoFiles: VideoFileWithUrls[] = [];

        // Merge all the process results into audioFiles, imageFiles, videoFiles, and profilePicture
        processResults.forEach((result) => {
          if (result.audioFiles) {
            audioFiles.push(...result.audioFiles);
          }
          if (result.imageFiles) {
            imageFiles.push(...result.imageFiles);
          }
          if (result.videoFiles) {
            videoFiles.push(...result.videoFiles);
          }
        });

        console.log('collected songs');
        console.log('collected images');
        console.log('collected videos');

        setTape({
          akord,
          tapeInfoOptions,
          profileAvatar,
          profileEmail,
          profileName,
          audioFiles,
          color: tapeInfoJSON?.color,
          imageFiles,
          tapeArtistName: tapeInfoJSON?.tapeArtistName,
          type: tapeInfoJSON?.type,
          tapeInfoJSON,
          videoFiles,
        });
        router.push({
          pathname: `/tape/${[vaultId]}`,
        });
        setLoading(false);
      }
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
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
            justifyContent: 'center',
            width: '100%',
          }}
        >
          <FadeInAndOut>
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
          </FadeInAndOut>
          <FadeInAndOut>
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
                      background: 'var(--artape-black)',
                      color: 'var(--artape-white)',
                      fontSize: '12px',
                    }}
                    onClick={() => setShowVaultIdForm(true)}
                  >
                    View My Tapes
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
          </FadeInAndOut>
        </div>
      </main>
    </>
  );
}
