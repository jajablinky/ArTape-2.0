import { useState } from 'react';
import Head from 'next/head';
import styles from '@/styles/Home.module.css';
import Image from 'next/image';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useRouter } from 'next/router';
import { Akord } from '@akord/akord-js';

import ArTapeLogo from '../../public/ArTAPE.svg';
import CassetteLogo from '../../public/Artape-Cassete-Logo.gif';
import Link from 'next/link';

type VaultValues = {
  email: string;
  password: string;
};

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [akord, setAkord] = useState<Akord | null>();
  const router = useRouter();

  const {
    register,
    formState: { errors, isSubmitSuccessful },
    handleSubmit,
  } = useForm<VaultValues>();
  const onSubmit: SubmitHandler<VaultValues> = async (data) => {
    setLoading(true);
    const { jwtToken, wallet } = await Akord.auth.signIn(
      data.email,
      data.password
    );
    const akordInstance = await Akord.init(wallet, jwtToken);
    console.log(akordInstance);
    setAkord(akordInstance);
    // select first vault and console log the vault id
    const vaults = await akordInstance.vault.list();
    const vaultId = vaults[0].id;
    console.log(vaultId);

    setLoading(false);
  };

  const [showVaultIdForm, setShowVaultIdForm] = useState(false);

  const loader = (
    <Image
      src={CassetteLogo}
      width={15}
      alt="artape-logo"
      style={{ filter: 'invert(1)' }}
    />
  );

  const vaultIdInputForm = (
    <form
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        width: '300px',
      }}
      onSubmit={handleSubmit(onSubmit)}
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
      {errors.email && 'email is required'}
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
      {errors.password && 'password is required'}

      <button
        type="submit"
        style={{
          backgroundColor: 'white',
          color: 'black',
          fontSize: '12px',
        }}
      >
        {loading ? loader : <span>Go</span>}
      </button>
    </form>
  );
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
            <Image src={ArTapeLogo} width={300} alt="artape-logo" />
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
            }}
          >
            {showVaultIdForm ? (
              vaultIdInputForm
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
