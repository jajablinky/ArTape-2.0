import { FormEvent, useState } from 'react';
import Head from 'next/head';
import styles from '@/styles/Home.module.css';
import Image from 'next/image';
import {
  useForm,
  SubmitHandler,
  FieldErrors,
  UseFormRegister,
  UseFormHandleSubmit,
} from 'react-hook-form';
import { useRouter } from 'next/router';
import { Akord, Auth } from '@akord/akord-js';

import { useTape } from '@/components/TapeContext';
import ArTapeLogo from '../../public/ArTAPE.svg';
import CassetteLogo from '../../public/Artape-Cassete-Logo.gif';
import Link from 'next/link';
import Loader from '@/components/Loader';
import LoadingOverlay from '@/components/LoadingOverlay';
import AkordSignIn from '@/components/Helper Functions/AkordSignIn';

type VaultValues = {
  email: string;
  password: string;
};

type TapeInfo = {
  tapeName: string;
  vaultId: string;
};

interface VaultSelectionFormProps {
  tapeInfoOptions: TapeInfo[];
  setSelectedTapeInfo: (tapeInfo: TapeInfo) => void;
  handleSubmit: UseFormHandleSubmit<VaultValues>;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>; // Update this line
  loading: boolean;
}

type EmailPasswordFormProps = {
  onSubmit: (event: React.FormEvent) => void;
  loading: boolean;
  errors: FieldErrors<VaultValues>;
  register: UseFormRegister<VaultValues>;
};

function EmailPasswordForm({
  onSubmit,
  loading,
  errors,
  register,
}: EmailPasswordFormProps) {
  return (
    <form
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        width: '300px',
      }}
      onSubmit={onSubmit}
    >
      <input
        {...register('email', { required: true })}
        type="email"
        placeholder="Email"
        style={{
          background: 'transparent',
          border: 'none',
          borderBottom: '1px solid var(--artape-black)',
          textAlign: 'right',
        }}
      />
      {errors.email && <div>Email is required</div>}
      <input
        {...register('password', { required: true })}
        type="password"
        placeholder="Password"
        style={{
          background: 'transparent',
          border: 'none',
          borderBottom: '1px solid var(--artape-black)',
          textAlign: 'right',
        }}
      />
      {errors.password && <div>Password is required</div>}
      <button
        type="submit"
        style={{
          backgroundColor: 'var(--artape-black)',
          color: 'var(--artape-white)',
          fontSize: '12px',
        }}
      >
        {loading ? <Loader /> : <span>Go</span>}
      </button>
    </form>
  );
}

function VaultSelectionForm({
  tapeInfoOptions,
  setSelectedTapeInfo,
  onSubmit,
  loading,
}: VaultSelectionFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '32px',
        }}
      >
        {tapeInfoOptions.map((tapeInfo) => (
          <label
            key={tapeInfo.vaultId}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <input
              type="radio"
              name="vault"
              value={tapeInfo.vaultId}
              onChange={() => setSelectedTapeInfo(tapeInfo)}
            />
            {tapeInfo.tapeName}
          </label>
        ))}
      </div>
      <button
        type="submit"
        style={{
          background: 'transparent',
          border: '1px solid var(--artape-black)',
          fontSize: '12px',
        }}
      >
        {loading ? <Loader /> : 'Load Vault'}
      </button>
    </form>
  );
}

export default function Home() {
  {
    /* -- State  -- */
  }
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
  {
    /* -- State  -- */
  }

  const router = useRouter();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<VaultValues>();
  const onSubmit: SubmitHandler<VaultValues> = async (data) => {
    setLoading(true);
    const akord = await AkordSignIn(data.email, data.password);
    setAkord(akord);
    setProgress({
      percentage: 20,
      state: `Successful Sign-in, welcome ${data.email}`,
    });
    // search for vaults based on tags instead

    ////// add code

    // select a vault and console log the vault id
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
    console.log(tapeInfos);
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
      const { items } = await akord.stack.list(vaultId);
      let tapeInfoJSON: any;
      const imageFileNameToModuleId = new Map<string, string>();
      const audioPromises: Promise<string | null | void>[] = [];
      const imagePromises: Promise<string | null | void>[] = [];

      const audioFiles: { name: string; url: string | null }[] = [];
      const imageFiles: {
        name: string;
        url: string | null;
        moduleId: string;
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
              const moduleId = imageFileNameToModuleId.get(item.name) || '';
              imageFiles.push({
                name: item.name,
                url: blobUrl,
                moduleId,
              });
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
      console.log('collected songs');
      console.log('collected images');
      setTape({
        audioFiles,
        imageFiles,
        tapeInfoJSON,
        albumPicture,
        profilePicture,
      });

      router.push({
        pathname: `/tape/${[vaultId]}`,
      });
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
            <svg
              width="314"
              height="66"
              viewBox="0 0 314 66"
              fill="var(--artape-black)"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.3555 16.3418L0.736328 52.2305C0.492188 53.207 0.394531 54.1836 0.394531 55.1113C0.394531 57.0645 0.882812 58.8711 1.85938 60.5312C3.32422 63.0703 5.52148 64.7793 8.5 65.6582C9.47656 65.9023 10.4531 66 11.3809 66C13.2852 66 15.0918 65.5117 16.8008 64.5352C19.291 63.0703 21 60.873 21.8789 57.8945L22.5137 55.5508L10.3555 16.3418ZM33.4512 8.13867C32.4746 5.16016 30.9609 3.1582 28.8613 2.08398C26.8105 0.960938 24.9062 0.423828 23.1484 0.423828C22.0742 0.423828 20.9512 0.570312 19.8281 0.912109C16.8984 1.88867 14.8965 3.40234 13.7734 5.50195C12.6504 7.55273 12.1133 9.45703 12.1133 11.2148C12.1133 12.2891 12.2598 13.4121 12.6016 14.5352L26.127 58.2852C27.1523 61.2148 28.666 63.2168 30.7168 64.3398C32.8164 65.4629 34.7207 66 36.4785 66C37.5527 66 38.6758 65.8535 39.7988 65.5117C42.7285 64.5352 44.7305 63.0215 45.8535 60.9219C46.9277 58.8223 47.4648 56.918 47.4648 55.1602C47.4648 54.0859 47.3184 53.0117 47.0254 51.8887L33.4512 8.13867Z"
                fill="var(--artape-black)"
              />
              <path
                d="M77.4941 37.7773H66.5566C64.3105 37.7773 62.2598 37.2891 60.3555 36.2637C58.4512 35.2871 56.8887 33.9199 55.6191 32.2109V55.0625C55.6191 58.0898 56.6934 60.6777 58.8418 62.8262C60.9414 64.9746 63.5293 66 66.5566 66C69.584 66 72.1719 64.9746 74.3203 62.8262C76.4199 60.6777 77.4941 58.0898 77.4941 55.0625V37.7773ZM66.5566 35.0918H91.8008C94.8281 35.0918 97.416 34.0664 99.5156 31.918C101.664 29.7695 102.738 27.2305 102.738 24.2031C102.738 21.1758 101.664 18.6367 99.5156 16.4883C97.416 14.3887 94.8281 13.3145 91.8008 13.3145H66.5566C63.5781 13.3145 60.9902 14.3887 58.8418 16.4883C56.7422 18.6367 55.668 21.1758 55.668 24.2031C55.668 27.2305 56.7422 29.7695 58.8418 31.918C60.9902 34.0664 63.5781 35.0918 66.5566 35.0918Z"
                fill="var(--artape-black)"
              />
              <path
                d="M125.932 31.625L151.176 21.4688C154.008 20.248 156.01 18.2949 157.182 15.6094C157.768 14.2422 158.061 12.875 158.061 11.459C158.061 10.0918 157.768 8.67578 157.23 7.25977C156.01 4.42773 154.105 2.42578 151.42 1.30273C150.053 0.716797 148.637 0.423828 147.221 0.423828C145.854 0.423828 144.486 0.667969 143.07 1.20508L117.777 11.3613C114.945 12.582 112.943 14.4863 111.82 17.1719C111.234 18.5391 110.941 19.9551 110.941 21.3711C110.941 22.7383 111.186 24.1055 111.723 25.5215C112.943 28.4023 114.896 30.4043 117.582 31.5273C118.949 32.1133 120.365 32.4062 121.781 32.4062C123.148 32.4062 124.516 32.1621 125.932 31.625ZM145.414 26.6445L126.908 34.0664C125.785 34.5547 124.662 34.7988 123.539 34.9453V55.0625C123.539 58.0898 124.613 60.6777 126.762 62.8262C128.91 64.9746 131.449 66 134.477 66C137.504 66 140.092 64.9746 142.24 62.8262C144.389 60.6777 145.414 58.0898 145.414 55.0625V26.6445Z"
                fill="var(--artape-black)"
              />
              <path
                d="M164.75 16.3418L155.131 52.2305C154.887 53.207 154.789 54.1836 154.789 55.1113C154.789 57.0645 155.277 58.8711 156.254 60.5312C157.719 63.0703 159.916 64.7793 162.895 65.6582C163.871 65.9023 164.848 66 165.775 66C167.68 66 169.486 65.5117 171.195 64.5352C173.686 63.0703 175.395 60.873 176.273 57.8945L176.908 55.5508L164.75 16.3418ZM187.846 8.13867C186.869 5.16016 185.355 3.1582 183.256 2.08398C181.205 0.960938 179.301 0.423828 177.543 0.423828C176.469 0.423828 175.346 0.570312 174.223 0.912109C171.293 1.88867 169.291 3.40234 168.168 5.50195C167.045 7.55273 166.508 9.45703 166.508 11.2148C166.508 12.2891 166.654 13.4121 166.996 14.5352L180.521 58.2852C181.547 61.2148 183.061 63.2168 185.111 64.3398C187.211 65.4629 189.115 66 190.873 66C191.947 66 193.07 65.8535 194.193 65.5117C197.123 64.5352 199.125 63.0215 200.248 60.9219C201.322 58.8223 201.859 56.918 201.859 55.1602C201.859 54.0859 201.713 53.0117 201.42 51.8887L187.846 8.13867Z"
                fill="var(--artape-black)"
              />
              <path
                d="M253.227 35.4824L253.422 35.3848C253.422 35.3359 253.422 35.3359 253.471 35.3359C253.52 35.2871 253.568 35.2871 253.617 35.2383L253.715 35.1406H253.764C253.764 35.0918 253.764 35.0918 253.812 35.043C253.861 34.9941 253.91 34.9941 253.959 34.9453H254.008V34.8965C254.057 34.8477 254.154 34.7988 254.203 34.75C255.766 33.334 256.84 31.625 257.426 29.7207V29.623C257.475 29.5742 257.475 29.5254 257.475 29.4766C257.523 29.4277 257.523 29.3789 257.523 29.3301C257.523 29.2812 257.523 29.2812 257.572 29.2324V29.0371H257.621V28.9883C257.621 28.9395 257.621 28.8418 257.67 28.793V28.6953C257.67 28.6465 257.67 28.5977 257.719 28.5488V28.4512C257.719 28.4023 257.719 28.3047 257.768 28.2559V28.0117C257.816 27.9629 257.816 27.9629 257.816 27.9141V27.6211L257.865 27.5234V27.3281C257.865 27.084 257.914 26.791 257.914 26.5469C257.914 24.4473 257.279 22.4941 256.107 20.5898V20.541C256.059 20.541 256.059 20.541 256.059 20.4922L256.01 20.4434C255.961 20.3945 255.961 20.3945 255.961 20.3457L255.912 20.2969V20.248C255.863 20.1992 255.814 20.1504 255.766 20.1016V20.0527C255.717 20.0527 255.717 20.0527 255.717 20.0039C255.668 19.9551 255.668 19.9062 255.619 19.8574C255.57 19.8574 255.57 19.8574 255.57 19.8086L255.521 19.7598C255.473 19.7109 255.473 19.7109 255.473 19.6621C255.424 19.6133 255.375 19.5645 255.326 19.5156L255.277 19.4668C255.229 19.418 255.18 19.3203 255.131 19.2715C254.301 18.3438 253.324 17.6113 252.299 17.0254L227.348 1.9375C225.492 0.912109 223.637 0.375 221.732 0.375C220.854 0.375 219.926 0.472656 219.047 0.716797C216.264 1.40039 214.018 3.06055 212.309 5.69727C211.283 7.50391 210.746 9.35938 210.746 11.2637C210.746 12.1426 210.844 13.0703 211.088 13.9492C211.771 16.7812 213.432 19.0273 216.068 20.6875L226.859 27.2305L224.467 28.8906L214.652 22.9824C213.09 22.0059 211.771 20.7852 210.746 19.3691V55.0625C210.746 58.0898 211.82 60.6777 213.969 62.7773C216.068 64.9258 218.656 66 221.684 66C224.711 66 227.299 64.9258 229.447 62.7773C231.547 60.6777 232.621 58.0898 232.621 55.0625V49.8379L253.178 35.5312H253.227V35.4824Z"
                fill="var(--artape-black)"
              />
              <path
                d="M280.717 58.0898L298.441 65.2188C299.857 65.7559 301.225 66 302.592 66C304.008 66 305.424 65.707 306.791 65.1211C309.477 63.998 311.43 61.9961 312.65 59.1641C313.188 57.7969 313.432 56.4297 313.432 55.0625C313.432 53.8418 313.236 52.6699 312.797 51.498C311.918 49.0078 310.307 47.0547 308.012 45.6387L282.963 57.2598C282.23 57.6016 281.449 57.8945 280.717 58.0898ZM272.66 13.1191C269.877 14.4863 268.168 16.1465 267.436 18.1484C266.703 20.1016 266.312 21.7617 266.312 22.9824C266.312 24.4961 266.654 26.0586 267.338 27.6211C268.363 29.7695 269.828 31.3809 271.732 32.5039L296.781 20.8828C298.734 20.0527 300.688 19.6133 302.592 19.6133C304.447 19.6133 306.254 20.0039 308.012 20.7852C310.453 19.2715 311.967 17.6113 312.553 15.7559C313.139 13.9492 313.432 12.4844 313.432 11.3613C313.432 9.84766 313.09 8.33398 312.406 6.77148C311.039 3.98828 309.379 2.23047 307.426 1.49805C305.424 0.765625 303.861 0.423828 302.592 0.423828C301.029 0.423828 299.467 0.716797 297.904 1.40039L272.66 13.1191ZM272.66 34.9941C269.877 36.3613 268.168 38.0215 267.436 40.0234C266.703 41.9766 266.312 43.6367 266.312 44.8574C266.312 46.3711 266.654 47.9336 267.338 49.4961C268.705 52.2793 270.365 54.0371 272.367 54.7695C274.32 55.502 275.932 55.8438 277.201 55.8438C278.764 55.8438 280.277 55.502 281.84 54.8672L307.084 43.1484C309.867 41.7812 311.576 40.1211 312.309 38.1191C313.041 36.166 313.432 34.5059 313.432 33.2852C313.432 31.7715 313.09 30.209 312.406 28.6465C311.039 25.8633 309.379 24.1055 307.426 23.373C305.424 22.6406 303.861 22.2988 302.592 22.2988C301.029 22.2988 299.467 22.5918 297.904 23.2754L272.66 34.9941Z"
                fill="var(--artape-black)"
              />
            </svg>
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
