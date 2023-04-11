import { useState, ChangeEvent, CSSProperties } from 'react';
import AudioList from '@/components/AudioList';

import styles from '@/styles/Home.module.css';

import Image from 'next/image';
import ArTapeLogo from '../../public/ArTAPE.svg';
import CassetteLogo from '../../public/Artape-Cassete-Logo.gif';

import { SubmitHandler, useForm } from 'react-hook-form';

import { Akord } from '@akord/akord-js';

/* Types */

type FileData = {
  file: File;
  duration: number;
  name: string;
  artistName: string;
  trackNumber: number;
};

type ResultData = {
  type: 'audio' | 'image';
  data: File | FileData;
};

type VaultValues = {
  profilePic: string;
  tapeName: string;
  file: string;
  memento: string;
  email: string;
  password: string;
};

type User = {
  jwtToken?: any;
  wallet?: any;
};

const loader = (
  <Image
    src={CassetteLogo}
    width={15}
    alt="artape-logo"
    style={{ filter: 'invert(1)' }}
  />
);

const filePreviewContainerStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  gap: '10px',
  width: '100%',
};

const Create = () => {
  const [loading, setLoading] = useState(false);
  const [audioFiles, setAudioFiles] = useState<
    Array<{
      audioFile: File;
      duration: number;
      name: string;
      artistName: string;
      trackNumber: number;
    }>
  >([]);
  const [imageFiles, setImageFiles] = useState<File[] | null>(null);

  /* - Form Submit: Uploading when User Is Ready With All Files - */
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VaultValues>();

  const onSubmit: SubmitHandler<VaultValues> = async (data) => {
    setLoading(true);

    if ((data.email && data.password && imageFiles) || audioFiles) {
      const { akord } = await Akord.auth.signIn(
        data.email,
        data.password
      );
      console.log('successful sign-in and verification');
      const { vaultId } = await akord.vault.create('my first vault');
      console.log(`successfully created vault: ${vaultId}`);
      for (const { audioFile } of audioFiles) {
        const { stackId } = await akord.stack.create(
          vaultId,
          audioFile,
          'file'
        );
        console.log(
          `Uploaded file: ${audioFile.name}, Stack ID: ${stackId}`
        );
      }
    }
    console.log('uploaded files');

    setLoading(false);
  };

  const getAudioDuration = (file: File): Promise<number> => {
    return new Promise((resolve, reject) => {
      const audio = new Audio(URL.createObjectURL(file));
      audio.addEventListener('loadedmetadata', () => {
        resolve(audio.duration);
      });
      audio.addEventListener('error', () => {
        reject(new Error('Error loading audio file metadata.'));
      });
    });
  };

  const onChangeFiles = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);

      const filePromises = newFiles.map(
        async (file): Promise<ResultData | undefined> => {
          if (file.type.startsWith('audio')) {
            const duration = await getAudioDuration(file);

            const artistName = ''; // Add logic to extract artist name
            const trackNumber = 0; // Add logic to extract track number

            return {
              type: 'audio',
              data: {
                file,
                duration,
                name: file.name,
                artistName,
                trackNumber,
              },
            };
          } else if (file.type.startsWith('image')) {
            return { type: 'image', data: file };
          }
        }
      );

      const results = (await Promise.all(filePromises)).filter(
        (result): result is ResultData => result !== undefined
      );

      const newAudioFiles = results
        .filter((result) => result.type === 'audio')
        .map((result) => ({
          audioFile: (result.data as FileData).file,
          duration: (result.data as FileData).duration,
          name: (result.data as FileData).name,
          artistName: (result.data as FileData).artistName,
          trackNumber: (result.data as FileData).trackNumber,
        }));

      const newImageFiles = results
        .filter((result) => result.type === 'image')
        .map((result) => result.data as File);

      setAudioFiles((prevAudioFiles) => {
        if (prevAudioFiles) {
          return [...prevAudioFiles, ...newAudioFiles];
        } else {
          return newAudioFiles;
        }
      });
      setImageFiles((prevImageFiles) => {
        if (prevImageFiles) {
          return [...prevImageFiles, ...newImageFiles];
        } else {
          return newImageFiles;
        }
      });
    }
  };

  /* Rendering Preview and Edit files */

  // // Helper Function
  const renderFile = (file: File, index: number) => {
    if (!file) {
      return null;
    }
    const fileType = file.type.split('/')[0];
    const fileURL = URL.createObjectURL(file);
    if (fileType === 'image') {
      return (
        <Image
          src={fileURL}
          key={index}
          className="image"
          alt={`uploaded-image-${index}`}
          width={100}
          height={100}
          style={{ objectFit: 'contain' }}
        />
      );
    } else if (fileType === 'audio') {
      return (
        <audio
          key={index}
          controls
          style={{ maxWidth: '100%', maxHeight: '100%' }}
        >
          <source src={fileURL} type={file.type} />
          Your Browser Does Not Support the Audio Element
        </audio>
      );
    }
  };

  const renderFileList = (
    imageFiles: File[] | null,
    audioFiles: File[] | null
  ) => {
    if (!imageFiles && !audioFiles) {
      return null;
    }

    return (
      <>
        {imageFiles && imageFiles.length > 0 && (
          <>
            <h3>Images: {imageFiles.length}</h3>
            <div style={filePreviewContainerStyle}>
              {imageFiles.map((imageFile, index) =>
                renderFile(imageFile, index)
              )}
            </div>
          </>
        )}
        {audioFiles && audioFiles.length > 0 && (
          <>
            <h3>Audio: {audioFiles.length}</h3>
            <div style={filePreviewContainerStyle}>
              <AudioList
                audioFiles={audioFiles}
                setAudioFiles={setAudioFiles}
                renderFile={renderFile}
              />
            </div>
          </>
        )}
      </>
    );
  };

  const uploadForm = (
    <>
      <form
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          width: '300px',
        }}
        onSubmit={handleSubmit(onSubmit)}
      >
        <div></div>
        <label htmlFor="profilePic">
          Add an Artist Profile
          <input
            {...register('profilePic', { required: true })}
            type="file"
          />
        </label>
        <input
          {...register('tapeName', { required: true })}
          type="text"
          placeholder="Add Your Tape Name"
          style={{
            background: 'transparent',
            border: 'none',
            borderBottom: '1px solid white',
            textAlign: 'right',
          }}
        />
        <div className={styles.switch}>
          <input name="switch" id="one" type="radio" />
          <label htmlFor="one">Pineapple</label>
          <input name="switch" id="two" type="radio" />
          <label htmlFor="two">Loud</label>
          <input name="switch" id="three" type="radio" />
          <label htmlFor="three">Minimal</label>
          <input name="switch" id="four" type="radio" />
          <label htmlFor="four">Tape</label>
        </div>

        <label htmlFor="file">
          Upload audio+ and images+
          <input
            type="file"
            multiple
            {...register('file', { required: true })}
            onChange={onChangeFiles}
          />
        </label>

        {errors.file && <p>Need to upload a file.</p>}
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

        {/* * * - Rendering Files JSX - Images and Audio * */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            marginTop: '10px',
            width: '100%',
          }}
        >
          {renderFileList(
            imageFiles,
            audioFiles
              ? audioFiles.map(({ audioFile }) => audioFile)
              : null
          )}
        </div>
        {/* * * - Submit Form Button * */}
        <button
          type="submit"
          style={{
            backgroundColor: 'white',
            color: 'black',
            fontSize: '12px',
          }}
        >
          {loading ? (
            loader
          ) : (
            <>
              <span style={{ marginRight: '5px' }}>
                Submit & Generate
              </span>
              <svg
                width="12"
                height="12"
                viewBox="0 0 21 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.4844 15.2662C11.4844 15.8117 11.0455 16.2505 10.5 16.2505C9.95449 16.2505 9.51562 15.8117 9.51562 15.2662V3.8609L5.61914 7.75701C5.23359 8.14252 4.61016 8.14252 4.22871 7.75701C3.84727 7.3715 3.84316 6.74812 4.22871 6.36671L9.80273 0.789132C10.1883 0.403623 10.8117 0.403623 11.1932 0.789132L16.7754 6.36671C17.1609 6.75222 17.1609 7.3756 16.7754 7.75701C16.3898 8.13841 15.7664 8.14252 15.385 7.75701L11.4885 3.8609V15.2662H11.4844ZM12.7969 14.9381V12.9696H18.375C19.8229 12.9696 21 14.1466 21 15.5943V18.8753C21 20.323 19.8229 21.5 18.375 21.5H2.625C1.17715 21.5 0 20.323 0 18.8753V15.5943C0 14.1466 1.17715 12.9696 2.625 12.9696H8.20312V14.9381H2.625C2.26406 14.9381 1.96875 15.2334 1.96875 15.5943V18.8753C1.96875 19.2362 2.26406 19.5314 2.625 19.5314H18.375C18.7359 19.5314 19.0312 19.2362 19.0312 18.8753V15.5943C19.0312 15.2334 18.7359 14.9381 18.375 14.9381H12.7969ZM15.75 17.2348C15.75 16.9737 15.8537 16.7234 16.0383 16.5388C16.2229 16.3542 16.4733 16.2505 16.7344 16.2505C16.9954 16.2505 17.2458 16.3542 17.4304 16.5388C17.615 16.7234 17.7188 16.9737 17.7188 17.2348C17.7188 17.4958 17.615 17.7462 17.4304 17.9308C17.2458 18.1154 16.9954 18.2191 16.7344 18.2191C16.4733 18.2191 16.2229 18.1154 16.0383 17.9308C15.8537 17.7462 15.75 17.4958 15.75 17.2348Z"
                  fill="black"
                />
              </svg>
            </>
          )}
        </button>
      </form>
    </>
  );

  return (
    <>
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
            {uploadForm}
          </div>
        </div>
      </main>
    </>
  );
};

export default Create;
