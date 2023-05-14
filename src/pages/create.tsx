import { useState, useEffect } from 'react';
import { HexColorPicker } from 'react-colorful';
import { useTape } from '@/components/TapeContext';
import { useRouter } from 'next/router';

import { Akord } from '@akord/akord-js';

import styles from '@/styles/Home.module.css';

import Image from 'next/image';

import CassetteLogo from '../../public/Artape-Cassete-Logo.gif';

import { SubmitHandler, useForm } from 'react-hook-form';

import CassetteMemento from '@/components/Images/Mementos/CassetteMemento';

import PineappleMemento from '@/components/Images/Mementos/PineappleMemento';
import LoudMemento from '@/components/Images/Mementos/LoudMemento';
import MinimalMemento from '@/components/Images/Mementos/MinimalMemento';
import { getPineappleSvgContent } from '@/components/Images/Mementos/PineappleMemento';
import { getLoudSvgContent } from '@/components/Images/Mementos/LoudMemento';
import { getMinimalSvgContent } from '@/components/Images/Mementos/MinimalMemento';
import { getCassetteSvgContent } from '@/components/Images/Mementos/CassetteMemento';
import EditButton from '@/components/Images/UI/EditButton';
import UploadButton from '@/components/Images/UI/UploadButton';
import EditableAudioPlayer from '@/components/EditableAudioPlayer';

const createMetadataJSON = (data: VaultValues, audioStateFiles: { moduleId: number; audio: AudioFileState[] }, imageModules: ImageFileState[] | null, color: string) => {
  const metadata = {
    profilePicture: data.profilePicture[0].name,
    tapeArtistName: data.tapeArtistName,
    tapeDescription: data.tapeDescription,
    type: data.type,
    color: color,
    memento: data.memento,
    audioFiles: audioStateFiles
      ? audioStateFiles.audio.map((file) => ({
          trackNumber: file.trackNumber,
          name: file.name,
          artistName: file.artistName,
          duration: file.duration,
          albumPicture: file.albumPicture.name,
        }))
      : [],
    imageFiles: imageModules
      ? imageModules.map((file) => ({
          name: file.name,
          alt: file.alt,
          moduleId: file.moduleId,
        }))
      : [],
  };
  return metadata;
};

/* Types */

type ImageData = {
  file: File;
  name: string;
  alt: string;
  moduleId: number | null;
};

interface ImageFileState {
  imageFile: File;
  alt: string;
  name: string;
  moduleId: number | null;
}

export interface AudioFileState {
  audioFile: File;
  duration: number;
  name: string;
  artistName: string;
  trackNumber: number;
  albumPicture: File;
}

type ResultData = {
  type: 'audio' | 'image';
  data: File | AudioFileState | ImageData;
};

type VaultValues = {
  profilePicture: File[];
  tapeArtistName: string;
  file: string;
  memento: string;
  email: string;
  password: string;
  tapeDescription: string;
  type: string;
  color: string;
  moduleId: number;
  moduleFiles: File[];
  albumPicture: File[];
};

const loader = <Image src={CassetteLogo} width={15} alt="artape-logo" style={{ filter: 'invert(1)' }} />;

const getMementoSvgContent = (memento: string, color: string): Blob | null => {
  let svgContent: string | null = null;
  switch (memento) {
    case 'Pineapple':
      svgContent = getPineappleSvgContent(color);
      break;
    case 'Loud':
      svgContent = getLoudSvgContent(color);
      break;
    case 'Minimal':
      svgContent = getMinimalSvgContent(color);
      break;
    case 'Tape':
      svgContent = getCassetteSvgContent(color);
      break;
    default:
      return null;
  }

  if (svgContent) {
    return new Blob([svgContent], { type: 'text/html' });
  } else {
    return null;
  }
};

const Create = () => {
  const router = useRouter();
  const [moduleFiles, setModuleFiles] = useState<Record<number, File>>({});
  const [moduleUrls, setModuleUrls] = useState<{
    [index: number]: string;
  }>({});
  const [selectedMemento, setSelectedMemento] = useState('Pineapple');
  const [profilePicUrl, setProfilePicUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [audioStateFiles, setAudioStateFiles] = useState<{
    moduleId: number;
    audio: AudioFileState[];
  } | null>({
    moduleId: 2,
    audio: [],
  });
  const [color, setColor] = useState('#aabbcc');

  const { tape, setTape } = useTape();

  const handleMementoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedMemento(event.target.value);
  };

  /* - Form Submit: Uploading when User Is Ready With All Files - */
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<VaultValues>();

  const watchedProfilePic = watch('profilePicture');
  useEffect(() => {
    if (watchedProfilePic?.length > 0) {
      setProfilePicUrl(URL.createObjectURL(watchedProfilePic[0]));
    } else {
      setProfilePicUrl;
    }
  }, [watchedProfilePic]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setModuleFiles((prevModuleFiles) => ({
        ...prevModuleFiles,
        [index]: files[0],
      }));
    }
  };

  const numberOfModules = 7;
  const modules = [];

  useEffect(() => {
    const keys = Object.keys(moduleFiles);
    keys.forEach((key) => {
      const file = moduleFiles[parseInt(key)];
      if (file) {
        setModuleUrls((prevModuleUrls) => ({
          ...prevModuleUrls,
          [key]: URL.createObjectURL(file),
        }));
      }
    });
  }, [moduleFiles]);

  for (let i = 1; i <= numberOfModules; i++) {
    if (i === 2) {
      modules.push(
        <div
          className={styles.profileModuleRectangle}
          style={{
            backgroundColor: 'var(--artape-primary-color)',
            overflow: 'auto',
          }}
          key={`audioModule${i}`}
        >
          <EditableAudioPlayer profilePicUrl={profilePicUrl} register={register} audioFiles={audioStateFiles} setAudioFiles={setAudioStateFiles} watch={watch} />
        </div>
      );
      continue;
    }
    modules.push(
      <div
        className={i === 6 ? styles.profileModuleRectangle : styles.profileModule}
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
          position: 'relative',
        }}
        key={`imageModule${i}`}
      >
        <label
          htmlFor={`imageModule${i}`}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
          }}
        >
          {moduleUrls[i] ? (
            <Image
              src={moduleUrls[i]}
              alt={`Module ${i}`}
              width={350}
              height={350}
              style={{
                borderRadius: '12px',
                objectFit: 'cover',
                cursor: 'pointer',
              }}
            />
          ) : (
            <UploadButton color={color} />
          )}
          <input
            {...register(`imageModule${i}` as keyof VaultValues, {
              required: true,
            })}
            id={`imageModule${i}`}
            type="file"
            name={`imageModule${i}`}
            accept="image/*"
            style={{ display: 'none', width: '100%' }}
            onChange={(e) => handleFileChange(e, i)}
          />
        </label>
      </div>
    );
  }
  useEffect(() => {
    console.log('Updated tape context: ', tape);
  }, [tape]);

  const onSubmit: SubmitHandler<VaultValues> = async (data, e) => {
    setLoading(true);
    console.log('submitting');
    let imageModules: any = [];
    let imageUploadModules: any = [];
    const processFiles = async () => {
      const filteredFiles = Object.values(moduleFiles);

      for (let index = 0; index < filteredFiles.length; index++) {
        let moduleId;
        const file = filteredFiles[index];

        if (file.type.startsWith('image')) {
          if (index === 0) {
            moduleId = index + 1;
          }
          if (index !== 0) {
            moduleId = index + 2;
          }

          const imageModule = {
            name: file.name,
            alt: file.name,
            moduleId: moduleId,
          };

          const imageUploadModule = {
            name: file.name,
            url: file,
            moduleId: moduleId,
          };
          imageModules.push(imageModule);
          imageUploadModules.push(imageUploadModule);
        }
      }
    };

    processFiles().then(() => {
      setLoading(false);
    });
    let tapeInfoJSONUpload: File | null = null;
    const metadataJSON = createMetadataJSON(data, audioStateFiles, imageModules, color);

    tapeInfoJSONUpload = new File([metadataJSON], 'tapeInfo.json', {
      type: 'application/json',
    });

    const { akord } = await Akord.auth.signIn(data.email, data.password);
    console.log('successful sign-in and verification');
    const { vaultId } = await akord.vault.create(data.tapeArtistName);
    console.log(`successfully created vault: ${vaultId}`);

    // // Upload Profile Pic
    // if (profilePicture) {
    //   const { stackId } = await akord.stack.create(vaultId, profilePicture, profilePicture.name);
    //   console.log(`Uploaded file: ${profilePicture.name}, Stack ID: ${stackId}`);
    // }

    // if (data.memento) {
    //   const mementoSvgContent = getMementoSvgContent(data.memento, color);
    //   if (mementoSvgContent) {
    //     const mementoSvgFile = new File([mementoSvgContent], `${data.memento}.svg`, { type: 'text/html' });
    //     const { stackId: mementoStackId } = await akord.stack.create(vaultId, mementoSvgFile, mementoSvgFile.name);
    //     console.log(`Uploaded memento: ${mementoSvgFile.name}, Stack ID: ${mementoStackId}`);
    //   }
    // }
    // // Upload audio files
    // if (audioStateFiles) {
    //   for (const { audioFile } of audioStateFiles.audio) {
    //     const { stackId } = await akord.stack.create(vaultId, audioFile, audioFile.name);
    //     console.log(`Uploaded file: ${audioFile.name}, Stack ID: ${stackId}`);
    //   }
    // }

    // // Upload image files
    // if (imageUploadModules) {
    //   for (const image of imageUploadModules) {
    //     const { stackId } = await akord.stack.create(vaultId, image.url, image.name);
    //     console.log(`Uploaded file: ${image.name}, Stack ID: ${stackId}`);
    //   }
    // }

    // // Upload tapeInfo.json
    // if (tapeInfoJSONUpload) {
    //   const { stackId } = await akord.stack.create(vaultId, tapeInfoJSONUpload, tapeInfoJSONUpload.name);
    //   console.log(`Uploaded file: ${tapeInfoJSONUpload.name}, Stack ID: ${stackId}`);
    // }

    // console.log('SUCCESS UPLOADED :)');

    // reformatting imageFiles and audioFiles to fit context when mapped per vault id at different page
    const imageFiles = imageUploadModules.map((imageModule) => {
      return {
        name: imageModule.name,
        url: URL.createObjectURL(imageModule.url),
      };
    });
    const audioFiles = audioStateFiles.audio.map((audioFile) => {
      return {
        name: audioFile.name,
        url: URL.createObjectURL(audioFile.audioFile),
      };
    });

    const profilePicture = {
      name: data.profilePicture[0].name,
      url: URL.createObjectURL(data.profilePicture[0]),
    };

    const albumPicture = {
      name: audioStateFiles.audio[0].albumPicture.name,
      url: URL.createObjectURL(audioStateFiles.audio[0].albumPicture),
    };
    setTape({
      audioFiles,
      imageFiles,
      tapeInfoJSON: metadataJSON,
      albumPicture,
      profilePicture,
    });
    router.push({
      pathname: `/tape/${[vaultId]}`,
    });
  };
  return (
    <>
      <main
        className={styles.main}
        style={
          {
            '--artape-primary-color': color,
          } as React.CSSProperties
        }
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.aboveGrid}>
            <h1 style={{ fontSize: '48px' }}>Create a Tape</h1>
            <div
              className={styles.emailPasswordForm}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '60px',
                width: '500px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '24px',
                }}
              >
                <p style={{ fontSize: '18px' }}>Sign in with Existing Akord Account</p>
                <input
                  {...register('email', { required: true })}
                  type="email"
                  placeholder="Email"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    borderBottom: '1px solid white',
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
                  }}
                />
                {errors.password && 'password is required'}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '24px' }}>
              <div className={styles.profileColorForm}>
                <p
                  style={{
                    fontSize: '18px',
                    background: 'var(--artape-white)',
                    border: '1px solid var(--artape-primary-color)',
                    padding: '10px',
                    borderRadius: '8px',
                  }}
                >
                  Pick Profile Color
                </p>
                <div
                  style={{
                    display: 'flex',
                  }}
                >
                  <HexColorPicker color={color} onChange={setColor} />
                </div>
              </div>
              <div className={styles.mementoForm}>
                <p style={{ fontSize: '18px' }}>Pick Memento</p>
                <div className={styles.switch}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    <label htmlFor="one" style={{ color: `${color}` }}>
                      Pineapple
                    </label>
                    <input {...register('memento')} className={styles.radioButton} name="memento" id="one" type="radio" value="Pineapple" onChange={handleMementoChange} />
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    <label htmlFor="two" style={{ color: `${color}` }}>
                      Loud
                    </label>
                    <input className={styles.radioButton} {...register('memento')} value="Loud" name="memento" id="two" type="radio" onChange={handleMementoChange} />
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    <label htmlFor="three" style={{ color: `${color}` }}>
                      Minimal
                    </label>
                    <input className={styles.radioButton} {...register('memento')} name="memento" value="Minimal" id="three" type="radio" onChange={handleMementoChange} />
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    <label htmlFor="four" style={{ color: `${color}` }}>
                      Tape
                    </label>
                    <input className={styles.radioButton} {...register('memento')} value="Tape" name="memento" id="four" type="radio" onChange={handleMementoChange} />
                  </div>
                </div>
              </div>
            </div>
            <div
              className={styles.artistHeader}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div
                className={styles.artistHeaderLeft}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '20px',
                }}
              >
                <div
                  className={styles.profilePicture}
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'pointer',
                    borderRadius: '12px',
                    position: 'relative',
                  }}
                >
                  {profilePicUrl ? (
                    <label
                      htmlFor="profilePicture"
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        cursor: 'pointer',
                      }}
                    >
                      <Image
                        src={profilePicUrl}
                        alt="Profile"
                        width={100}
                        height={100}
                        style={{
                          borderRadius: '12px',
                          objectFit: 'cover',
                          cursor: 'pointer',
                        }}
                      />
                    </label>
                  ) : (
                    <label
                      htmlFor="profilePicture"
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        cursor: 'pointer',
                      }}
                    >
                      <UploadButton color={color} />
                    </label>
                  )}
                  <input {...register('profilePicture')} id="profilePicture" type="file" name="profilePicture" accept="image/*" style={{ display: 'none', width: '100%' }} />
                </div>
                <div>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      gap: '12px',
                    }}
                  >
                    <input
                      {...register('tapeArtistName', {
                        required: true,
                      })}
                      type="text"
                      placeholder="Artist Name"
                      style={{
                        background: 'transparent',
                        fontWeight: 'bold',
                        border: 'none',
                        fontSize: '36px',
                        width: '250px',
                      }}
                    />
                    <span
                      style={{
                        fontWeight: 'normal',
                        fontSize: '36px',
                      }}
                    >
                      's Tape
                    </span>
                    <div className={styles.memento}>
                      {selectedMemento === 'Pineapple' && <PineappleMemento color={color} />}
                      {selectedMemento === 'Loud' && <LoudMemento color={color} />}
                      {selectedMemento === 'Minimal' && <MinimalMemento color={color} />}
                      {selectedMemento === 'Tape' && <CassetteMemento color={color} />}{' '}
                    </div>
                  </div>

                  <p style={{ fontWeight: 'lighter' }}>
                    <input
                      {...register('type', { required: true })}
                      type="text"
                      placeholder="Type (Musician / Podcaster / etc..)"
                      style={{
                        fontSize: '28px',
                        background: 'transparent',
                        border: 'none',
                      }}
                    />
                  </p>
                  <p
                    style={{
                      fontWeight: 'lighter',
                      color: '#656565',
                    }}
                  >
                    <input
                      {...register('tapeDescription', {
                        required: true,
                      })}
                      type="text"
                      placeholder="Add A Description"
                      style={{
                        fontSize: '20px',

                        background: 'transparent',
                        border: 'none',
                      }}
                    />
                  </p>
                </div>
              </div>
              <div className={styles.artistHeaderRight}>
                <EditButton color={color} />
              </div>
            </div>
          </div>

          <div className={styles.gridProfile}>{modules}</div>

          <button
            type="submit"
            className={styles.submitButton}
            style={{
              fontSize: '16px',
            }}
          >
            {loading ? (
              loader
            ) : (
              <>
                <span
                  style={{
                    marginRight: '20px',
                    color: 'var(--artape-white)',
                  }}
                >
                  Submit & Generate Tape
                </span>
                <svg width="16" height="16" viewBox="0 0 21 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.4844 15.2662C11.4844 15.8117 11.0455 16.2505 10.5 16.2505C9.95449 16.2505 9.51562 15.8117 9.51562 15.2662V3.8609L5.61914 7.75701C5.23359 8.14252 4.61016 8.14252 4.22871 7.75701C3.84727 7.3715 3.84316 6.74812 4.22871 6.36671L9.80273 0.789132C10.1883 0.403623 10.8117 0.403623 11.1932 0.789132L16.7754 6.36671C17.1609 6.75222 17.1609 7.3756 16.7754 7.75701C16.3898 8.13841 15.7664 8.14252 15.385 7.75701L11.4885 3.8609V15.2662H11.4844ZM12.7969 14.9381V12.9696H18.375C19.8229 12.9696 21 14.1466 21 15.5943V18.8753C21 20.323 19.8229 21.5 18.375 21.5H2.625C1.17715 21.5 0 20.323 0 18.8753V15.5943C0 14.1466 1.17715 12.9696 2.625 12.9696H8.20312V14.9381H2.625C2.26406 14.9381 1.96875 15.2334 1.96875 15.5943V18.8753C1.96875 19.2362 2.26406 19.5314 2.625 19.5314H18.375C18.7359 19.5314 19.0312 19.2362 19.0312 18.8753V15.5943C19.0312 15.2334 18.7359 14.9381 18.375 14.9381H12.7969ZM15.75 17.2348C15.75 16.9737 15.8537 16.7234 16.0383 16.5388C16.2229 16.3542 16.4733 16.2505 16.7344 16.2505C16.9954 16.2505 17.2458 16.3542 17.4304 16.5388C17.615 16.7234 17.7188 16.9737 17.7188 17.2348C17.7188 17.4958 17.615 17.7462 17.4304 17.9308C17.2458 18.1154 16.9954 18.2191 16.7344 18.2191C16.4733 18.2191 16.2229 18.1154 16.0383 17.9308C15.8537 17.7462 15.75 17.4958 15.75 17.2348Z" fill="var(--artape-white)" />
                </svg>
              </>
            )}
          </button>
        </form>
      </main>
    </>
  );
};

export default Create;
