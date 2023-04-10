import React, { useState, ChangeEvent, CSSProperties } from 'react';
import AudioList from '@/components/AudioList';

import styles from '@/styles/Home.module.css';

import Image from 'next/image';
import ArTapeLogo from '../../public/ArTAPE.svg';
import CassetteLogo from '../../public/Artape-Cassete-Logo.gif';
import dragIcon from '../../public/Drag-Icon.svg';

import { SubmitHandler, useForm } from 'react-hook-form';

import { Akord } from '@akord/akord-js';

/* Types */
type VaultValues = {
  email: string;
  password: string;
  file: string;
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
  const [items, setItems] = useState([0, 1, 2, 3]);
  const [loading, setLoading] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [audioFiles, setAudioFiles] = useState<File[]>([]);

  const [numAudioFiles, setNumAudioFiles] = useState(0);
  const [numImageFiles, setNumImageFiles] = useState(0);
  const [files, setFiles] = useState<File[] | null>(null);

  /* Form Submit */
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VaultValues>();
  const onSubmit: SubmitHandler<VaultValues> = async (data) => {
    setLoading(true);

    if (data.email && data.password && files) {
      const { jwtToken, wallet, akord } = await Akord.auth.signIn(
        data.email,
        data.password
      );
      console.log('successful sign-in and verification');
      const { vaultId } = await akord.vault.create('my first vault');
      console.log(`successfully created vault: ${vaultId}`);
      for (const file of files) {
        const { stackId } = await akord.stack.create(
          vaultId,
          file,
          'file'
        );
        console.log(
          `Uploaded file: ${file.name}, Stack ID: ${stackId}`
        );
      }
      console.log('uploaded files');
    }
    setLoading(false);
  };

  const onChangeFiles = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      let audioCount = 0;
      let imageCount = 0;
      const newAudioFiles: File[] = [];
      const newImageFiles: File[] = [];

      newFiles.forEach((file) => {
        if (file.type.startsWith('audio')) {
          audioCount++;
          newAudioFiles.push(file);
        } else if (file.type.startsWith('image')) {
          imageCount++;
          newImageFiles.push(file);
        }
      });

      setAudioFiles((prevAudioFiles) => [
        ...prevAudioFiles,
        ...newAudioFiles,
      ]);
      setFiles((prevFiles) => {
        if (prevFiles) {
          return [...prevFiles, ...newImageFiles];
        } else {
          return newImageFiles;
        }
      });

      setNumAudioFiles(audioCount);
      setNumImageFiles(imageCount);
    }
  };

  /* Rendering files is purely for preview to let user know of what files they have uploaded and how many */
  const renderFileList = (files: File[] | null) => {
    if (!files) {
      return null;
    }

    const imageFiles: File[] = [];

    files.forEach((file) => {
      const fileType = file.type.split('/')[0];
      if (fileType === 'image') {
        imageFiles.push(file);
      }
    });

    return (
      <>
        {imageFiles.length > 0 && (
          <>
            <h3>Images: {imageFiles.length}</h3>
            <div style={filePreviewContainerStyle}>
              {imageFiles.map((file, index) =>
                renderFile(file, index)
              )}
            </div>
          </>
        )}
        {audioFiles.length > 0 && (
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

  const renderFile = (file: File, index: number) => {
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
        <input
          type="file"
          multiple
          {...register('file', { required: true })}
          onChange={onChangeFiles}
        />
        {errors.file && <p>Upload Multiple Files</p>}

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            marginTop: '10px',
            width: '100%',
          }}
        >
          {renderFileList(files)}
        </div>

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
              <span style={{ marginRight: '5px' }}>Upload</span>
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
