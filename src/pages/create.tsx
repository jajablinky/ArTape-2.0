import React, { useState } from 'react';
import styles from '@/styles/Home.module.css';
import Image from 'next/image';

import ArTapeLogo from '../../public/ArTAPE.svg';
import CassetteLogo from '../../public/Artape-Cassete-Logo.gif';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useRouter } from 'next/router';

type VaultValues = {
  email: string;
  password: string;
  file: string;
};

const loader = (
  <Image
    src={CassetteLogo}
    width={15}
    alt="artape-logo"
    style={{ filter: 'invert(1)' }}
  />
);

const create = () => {
  const [loading, setLoading] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [files, setFiles] = useState(null);
  const onChangeFiles = (e) => {
    const newFiles = Array.from(e.target.files);
    setFiles(newFiles);
  };

  const renderFile = (file: File, index: number) => {
    const fileType = file.type.split('/')[0];
    const fileURL = URL.createObjectURL(file);

    if (fileType === 'image') {
      return (
        <img
          src={fileURL}
          key={index}
          className="image"
          alt={`uploaded-image-${index}`}
        />
      );
    } else if (fileType === 'audio') {
      return (
        <audio
          key={index}
          controls
          style={{ width: '100%', marginTop: '10px' }}
        >
          <source src={fileURL} type={file.type} />
          Your Browser Does Not Support the Audio Element
        </audio>
      );
    }
  };

  const {
    register,
    handleSubmit,
    reset,
    formState,
    formState: { errors },
  } = useForm<VaultValues>();
  const onSubmit: SubmitHandler<VaultValues> = async (data) => {
    setLoading(true);
    if (data.email && data.password) {
      setUserInfo({ email: data.email, password: data.password });
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
          type="file"
          multiple
          {...register('file', { required: true })}
          onChange={onChangeFiles}
        />
        {errors.file && <p>Upload Multiple Files</p>}

        {files && files.map((file, index) => renderFile(file, index))}

        <button
          type="submit"
          style={{
            backgroundColor: 'white',
            color: 'black',
            fontSize: '12px',
          }}
        >
          {loading ? loader : <span>Upload</span>}
        </button>
      </form>
      <button onClick={() => setShowUploadForm(false)}>
        Go Back
      </button>
    </>
  );

  const accountInfoForm = (
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
        onClick={() => setShowUploadForm(true)}
      >
        {loading ? loader : <span>Go</span>}
      </button>
    </form>
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
            {showUploadForm ? uploadForm : accountInfoForm}
          </div>
        </div>
      </main>
    </>
  );
};

export default create;
