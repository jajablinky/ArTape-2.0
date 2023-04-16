import { useState } from 'react';
import Head from 'next/head';
import styles from '@/styles/Home.module.css';
import Image from 'next/image';
import {
  useForm,
  SubmitHandler,
  FieldErrors,
  UseFormRegister,
} from 'react-hook-form';
import { useRouter } from 'next/router';
import { Akord } from '@akord/akord-js';

import { useTape } from '@/components/TapeContext';
import ArTapeLogo from '../../public/ArTAPE.svg';
import CassetteLogo from '../../public/Artape-Cassete-Logo.gif';
import Link from 'next/link';
import Loader from '@/components/Loader';

type VaultValues = {
  email: string;
  password: string;
};

type TapeInfo = {
  tapeName: string;
  vaultId: string;
};

type VaultSelectionFormProps = {
  tapeInfoOptions: TapeInfo[];
  setSelectedTapeInfo: (tapeInfo: TapeInfo) => void;
  handleSubmit: (
    onSubmit: SubmitHandler<VaultValues>
  ) => (
    e?: React.BaseSyntheticEvent<object, any, any> | undefined
  ) => Promise<void>;
  onSubmit: SubmitHandler<VaultValues>;
  loading?: boolean;
};

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
          borderBottom: '1px solid white',
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
          borderBottom: '1px solid white',
          textAlign: 'right',
        }}
      />
      {errors.password && <div>Password is required</div>}
      <button
        type="submit"
        style={{
          backgroundColor: 'white',
          color: 'black',
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
  handleSubmit,
  onSubmit,
  loading,
}: VaultSelectionFormProps) {
  return (
    <form
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        width: '300px',
      }}
      onSubmit={handleSubmit(onSubmit)}
    >
      {tapeInfoOptions.map((tapeInfo) => (
        <label key={tapeInfo.vaultId}>
          <input
            type="radio"
            name="vault"
            value={tapeInfo.vaultId}
            onChange={() => setSelectedTapeInfo(tapeInfo)}
          />
          {tapeInfo.tapeName}
        </label>
      ))}
      <button
        type="submit"
        style={{
          backgroundColor: 'white',
          color: 'black',
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
  const { tape, setTape } = useTape();
  const [loading, setLoading] = useState(false);
  const [akord, setAkord] = useState<Akord | null>();
  const [tapeInfoOptions, setTapeInfoOptions] = useState<TapeInfo[]>(
    []
  );
  const [isAuthenticated, authenticated] = useState(false);
  const [selectedTapeInfo, setSelectedTapeInfo] =
    useState<TapeInfo | null>(null);
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
    const { akord } = await Akord.auth.signIn(
      data.email,
      data.password
    );
    console.log('successful sign-in');
    authenticated(true);
    setAkord(akord);

    // select a vault and console log the vault id
    const vaults = await akord.vault.list();
    const tapeInfos = [];

    for (let i = 0; i < vaults.length; i++) {
      const vaultId = vaults[i].id;
      const { items } = await akord.stack.list(vaultId);
      for (let j = 0; j < items.length; j++) {
        if (items[j].name === 'tapeInfo.json') {
          tapeInfos.push({
            tapeName: vaults[i].name,
            vaultId,
          });
        }
      }
    }
    setTapeInfoOptions(tapeInfos);
    console.log(tapeInfos);

    setLoading(false);
  };

  const handleVaultSelection: SubmitHandler<
    VaultValues
  > = async () => {
    if (!selectedTapeInfo) return;
    const { vaultId } = selectedTapeInfo;
    // const vaultId = vaults[0].id;
    if (akord) {
      const { items } = await akord.stack.list(vaultId);
      let tapeInfoJSON;
      const audioPromises = items.map(async (item) => {
        if (item.name === 'tapeInfo.json') {
          const tapeInfoId = await item.id;
          const { data: decryptedTapeInfo } =
            await akord.stack.getVersion(tapeInfoId);
          const tapeInfoString = new TextDecoder().decode(
            decryptedTapeInfo
          );
          tapeInfoJSON = JSON.parse(tapeInfoString);
          console.log('collected audio metadata');
        }
        if (item.versions[0].type === 'audio/wav') {
          const audioId = item.id;
          const { data: decryptedAudio } =
            await akord.stack.getVersion(audioId);
          const blobUrl = URL.createObjectURL(
            new Blob([decryptedAudio])
          );
          return blobUrl;
        }
        return null;
      });

      const audioUrls = (await Promise.all(audioPromises)).filter(
        (url) => url !== null
      );
      console.log(audioUrls, 'collected songs');
      const filteredAudioUrls = audioUrls.filter(
        (url) => url !== null
      ) as string[];
      setTape({ audioUrls: filteredAudioUrls, tapeInfoJSON });

      console.log(tapeInfoOptions);

      router.push({
        pathname: `/tape/${[vaultId]}`,
      });
    }
  };

  return (
    <>
      <Head>
        <title>ArTape</title>
        <meta name="description" content="Modern Web3 listening" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
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
            <Image src={CassetteLogo} width={25} alt="artape-logo" />
            <ArTapeLogo color={'#ffffff'} />
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
            }}
          >
            {showVaultIdForm ? (
              !authenticated ? (
                <EmailPasswordForm
                  onSubmit={handleSubmit(onSubmit)}
                  loading={loading}
                  errors={errors}
                  register={register}
                />
              ) : (
                <VaultSelectionForm
                  tapeInfoOptions={tapeInfoOptions}
                  setSelectedTapeInfo={setSelectedTapeInfo}
                  handleSubmit={handleSubmit}
                  onSubmit={handleVaultSelection}
                />
              )
            ) : (
              <>
                <button
                  style={{
                    backgroundColor: 'white',
                    color: 'black',
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
                      color: '#ABABAB',
                      fontSize: '12px',
                    }}
                  >
                    Create A New Vault
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
