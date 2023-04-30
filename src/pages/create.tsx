import { useState, ChangeEvent, CSSProperties } from 'react';
import AudioList from '@/components/AudioList';
import { HexColorPicker } from 'react-colorful';

import { Akord } from '@akord/akord-js';

import styles from '@/styles/Home.module.css';

import Image from 'next/image';

import CassetteLogo from '../../public/Artape-Cassete-Logo.gif';
import avatarAnon from '../../public/Profile_avatar_placeholder_large.png';

import { SubmitHandler, useForm } from 'react-hook-form';

import CassetteMemento from '@/components/Images/Mementos/CassetteMemento';
import ArTapeLogo from '@/components/Images/Logo/ArTAPELogo';
import PineappleMemento from '@/components/Images/Mementos/PineappleMemento';
import LoudMemento from '@/components/Images/Mementos/LoudMemento';
import MinimalMemento from '@/components/Images/Mementos/MinimalMemento';
import { getPineappleSvgContent } from '@/components/Images/Mementos/PineappleMemento';
import { getLoudSvgContent } from '@/components/Images/Mementos/LoudMemento';
import { getMinimalSvgContent } from '@/components/Images/Mementos/MinimalMemento';
import { getCassetteSvgContent } from '@/components/Images/Mementos/CassetteMemento';
import EditButton from '@/components/Images/UI/EditButton';

const createMetadataJSON = (
  data: VaultValues,
  audioFiles: { moduleId: number; files: AudioFileState[] } | null,
  imageFiles: ImageFileState[] | null,
  profilePicName: string,
  memento: string,
  color: string
) => {
  const metadata = {
    profilePic: profilePicName,
    tapeArtistName: data.tapeArtistName,
    tapeDescription: data.tapeDescription,
    type: data.type,
    color: color,
    memento: memento,
    audioFiles: audioFiles
      ? audioFiles.files.map((file) => ({
          trackNumber: file.trackNumber,
          albumPicture: imageFiles?.[0].name ?? '',
          name: file.name,
          artistName: data.tapeArtistName,
          duration: file.duration,
        }))
      : [],
    imageFiles: imageFiles
      ? imageFiles
          .filter((file) => {
            const isProfilePic = file.name === profilePicName;
            const isAlbumPicture = audioFiles
              ? audioFiles.files.some(
                  (audioFile) => audioFile.albumPicture === file.name
                )
              : false;
            return !isProfilePic && !isAlbumPicture;
          })
          .map((file) => ({
            name: file.name,
            alt: file.alt,
            moduleId: file.moduleId,
          }))
      : [],
  };
  return JSON.stringify(metadata);
};

/* Types */

type AudioData = {
  file: File;
  duration: number;
  name: string;
  artistName: string;
  trackNumber: number;
  albumPicture: string;
};

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
  albumPicture: string;
}

type ResultData = {
  type: 'audio' | 'image';
  data: File | AudioData | ImageData;
};

type VaultValues = {
  profilePic: File[]; // Update this line
  tapeArtistName: string;
  file: string;
  memento: string;
  email: string;
  password: string;
  tapeDescription: string;
  type: string;
  color: string;
  moduleId: number;
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

const getMementoSvgContent = (
  memento: string,
  color: string
): Blob | null => {
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
  const [profilePicUrl, setProfilePicUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [audioFiles, setAudioFiles] = useState<{
    moduleId: number;
    files: AudioFileState[];
  } | null>({
    moduleId: 2,
    files: [],
  });
  const [color, setColor] = useState('#aabbcc');
  const [imageFiles, setImageFiles] = useState<
    ImageFileState[] | null
  >(null);

  const updateAllAudioFiles = (
    imageFiles: ImageFileState[] | null,
    data: VaultValues
  ) => {
    if (!audioFiles) return null;

    const updatedFiles = audioFiles.files.map((audioFile, index) => ({
      ...audioFile,
      albumPicture: imageFiles?.[0].name ?? '',
      artistName: data.tapeArtistName,
      trackNumber: index + 1,
    }));

    return {
      moduleId: audioFiles.moduleId,
      files: updatedFiles,
    };
  };

  const handleProfilePic = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicUrl(URL.createObjectURL(file));
    }
  };

  /* - Form Submit: Uploading when User Is Ready With All Files - */
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VaultValues>();

  const onSubmit: SubmitHandler<VaultValues> = async (data) => {
    setLoading(true);
    let updatedAudioFiles = updateAllAudioFiles(imageFiles, data);

    let tapeInfo: File | null = null;

    if (audioFiles && imageFiles) {
      const profilePic = data.profilePic;
      let profilePicName = profilePic[0].name;

      const metadataJSON = createMetadataJSON(
        data,
        updatedAudioFiles,
        imageFiles,
        profilePicName,
        data.memento,
        color
      );

      console.log(metadataJSON);

      tapeInfo = new File([metadataJSON], 'tapeInfo.json', {
        type: 'application/json',
      });
    } else {
      console.error('Audio or image files are missing');
    }

    if ((data.email && data.password && imageFiles) || audioFiles) {
      const { akord } = await Akord.auth.signIn(
        data.email,
        data.password
      );
      console.log('successful sign-in and verification');
      const { vaultId } = await akord.vault.create(
        data.tapeArtistName
      );
      console.log(`successfully created vault: ${vaultId}`);

      const profilePic = data.profilePic[0];
      let profilePicName = data.profilePic[0].name;

      // Upload Profile Pic
      if (profilePic) {
        const { stackId } = await akord.stack.create(
          vaultId,
          profilePic,
          profilePic.name
        );
        console.log(
          `Uploaded file: ${profilePic.name}, Stack ID: ${stackId}`
        );
        profilePicName = profilePic.name;
      }

      if (data.memento) {
        const mementoSvgContent = getMementoSvgContent(
          data.memento,
          color
        );
        if (mementoSvgContent) {
          const mementoSvgFile = new File(
            [mementoSvgContent],
            `${data.memento}.svg`,
            { type: 'text/html' }
          );
          const { stackId: mementoStackId } =
            await akord.stack.create(
              vaultId,
              mementoSvgFile,
              mementoSvgFile.name
            );
          console.log(
            `Uploaded memento: ${mementoSvgFile.name}, Stack ID: ${mementoStackId}`
          );
        }
      }

      // Upload audio files
      if (audioFiles) {
        for (const { audioFile } of audioFiles.files) {
          const { stackId } = await akord.stack.create(
            vaultId,
            audioFile,
            audioFile.name
          );
          console.log(
            `Uploaded file: ${audioFile.name}, Stack ID: ${stackId}`
          );
        }
      }

      // Upload image files
      if (imageFiles) {
        for (const imageFileState of imageFiles) {
          const { stackId } = await akord.stack.create(
            vaultId,
            imageFileState.imageFile,
            imageFileState.name
          );
          console.log(
            `Uploaded file: ${imageFileState.name}, Stack ID: ${stackId}`
          );
        }
      }

      // Upload tapeInfo.json
      if (tapeInfo) {
        const { stackId } = await akord.stack.create(
          vaultId,
          tapeInfo,
          tapeInfo.name
        );
        console.log(
          `Uploaded file: ${tapeInfo.name}, Stack ID: ${stackId}`
        );
      }
      console.log('SUCCESS UPLOADED :)');
    }

    setLoading(false);
  };

  /**** Helper Functions ****/

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
            const albumPicture = '';
            return {
              type: 'audio',
              data: {
                file,
                duration,
                name: file.name,
                artistName,
                trackNumber,
                albumPicture,
              },
            };
          } else if (file.type.startsWith('image')) {
            const moduleId = null;
            return {
              type: 'image',
              data: {
                file,
                name: file.name,
                alt: file.name,
                moduleId,
              },
            };
          }
        }
      );

      const results = (await Promise.all(filePromises)).filter(
        (result): result is ResultData => result !== undefined
      );

      const newAudioFiles = results
        .filter((result) => result.type === 'audio')
        .map((result, index) => {
          const trackNumber =
            (audioFiles?.files.length || 0) + index + 1;
          return {
            audioFile: (result.data as AudioData).file,
            albumPicture: (result.data as AudioData).albumPicture,
            duration: (result.data as AudioData).duration,
            name: (result.data as AudioData).name,
            artistName: (result.data as AudioData).artistName,
            trackNumber: trackNumber,
          };
        });

      const lastModuleId = imageFiles?.length
        ? imageFiles[imageFiles.length - 1].moduleId
        : 0;

      const newImageFiles = results
        .filter((result) => result.type === 'image')
        .map((result, index) => {
          let moduleId = lastModuleId + index + 1;
          moduleId =
            moduleId > 2
              ? moduleId
              : moduleId === 2
              ? moduleId - 1
              : moduleId;
          return {
            imageFile: (result.data as ImageData).file,
            alt: (result.data as ImageData).alt,
            name: (result.data as ImageData).name,
            moduleId: moduleId,
          };
        });

      setImageFiles((prevImageFiles) => {
        if (prevImageFiles) {
          return [...prevImageFiles, ...newImageFiles];
        } else {
          return newImageFiles;
        }
      });

      setAudioFiles((prevAudioFiles) => {
        if (
          !prevAudioFiles ||
          prevAudioFiles.moduleId !== 2 ||
          prevAudioFiles.files.length !== 0
        ) {
          return { moduleId: 2, files: newAudioFiles };
        } else {
          return {
            moduleId: prevAudioFiles.moduleId,
            files: [...prevAudioFiles.files, ...newAudioFiles],
          };
        }
      });
    }
  };

  // // Upload Form

  const uploadForm = (
    <>
      <form
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '40px',
          width: '300px',
        }}
        onSubmit={handleSubmit(onSubmit)}
      >
        <div
          className="profile-picture-container"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <label htmlFor="profilePic">Add an Artist Profile</label>
          <Image
            src={profilePicUrl || avatarAnon}
            width={100}
            height={100}
            alt="profile-pic"
            style={{ borderRadius: '1000px', objectFit: 'contain' }}
          />

          <input
            {...register('profilePic', { required: true })}
            type="file"
            onChange={handleProfilePic}
          />
        </div>
        <input
          {...register('tapeArtistName', { required: true })}
          type="text"
          placeholder="Add Your Tape Artist Name"
          style={{
            background: 'transparent',
            border: 'none',
            borderBottom: '1px solid white',
            textAlign: 'right',
          }}
        />
        <input
          {...register('type', { required: true })}
          type="text"
          placeholder="Add A Type (Musician / Podcaster / etc..)"
          style={{
            background: 'transparent',
            border: 'none',
            borderBottom: '1px solid white',
            textAlign: 'right',
          }}
        />
        <input
          {...register('tapeDescription', { required: true })}
          type="text"
          placeholder="Add A Description"
          style={{
            background: 'transparent',
            border: 'none',
            borderBottom: '1px solid white',
            textAlign: 'right',
          }}
        />
        <div
          className="pick-profile-color-container"
          style={{
            display: 'flex',
            flexDirection: 'column',
            textAlign: 'center',
            gap: '12px',
          }}
        >
          <p>Pick Profile Color</p>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <HexColorPicker color={color} onChange={setColor} />
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            gap: '20px',
            justifyContent: 'center',
          }}
        >
          {/* Cassette Memento*/}
          <PineappleMemento color={color} />
          <LoudMemento color={color} />
          <MinimalMemento color={color} />
          <CassetteMemento color={color} />
        </div>

        <div className={styles.switch}>
          <input
            {...register('memento')}
            name="memento"
            id="one"
            type="radio"
            value="Pineapple"
          />
          <label htmlFor="one" style={{ color: `${color}` }}>
            Pineapple
          </label>
          <input
            {...register('memento')}
            value="Loud"
            name="memento"
            id="two"
            type="radio"
          />
          <label htmlFor="two" style={{ color: `${color}` }}>
            Loud
          </label>
          <input
            {...register('memento')}
            name="memento"
            value="Minimal"
            id="three"
            type="radio"
          />
          <label htmlFor="three" style={{ color: `${color}` }}>
            Minimal
          </label>
          <input
            {...register('memento')}
            value="Tape"
            name="memento"
            id="four"
            type="radio"
          />
          <label htmlFor="four" style={{ color: `${color}` }}>
            Tape
          </label>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          <label htmlFor="file">Upload Audio and Images</label>
          <input
            type="file"
            multiple
            {...register('file', { required: true })}
            onChange={onChangeFiles}
          />
        </div>
        {errors.file && <p>Need to upload a file.</p>}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          <p>Enter in Username Info</p>
          <div
            className="email-password"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '28px',
            }}
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
          </div>
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
              <span style={{ marginRight: '5px' }}>Generate</span>
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
      <main
        className={styles.main}
        style={
          {
            '--artape-primary-color': color,
          } as React.CSSProperties
        }
      >
        <p>Pick Profile Color</p>
        <div
          style={{
            display: 'flex',
          }}
        >
          <HexColorPicker color={color} onChange={setColor} />
        </div>
        <p>Pick Memento</p>
        <div className={styles.switch}>
          <input
            {...register('memento')}
            name="memento"
            id="one"
            type="radio"
            value="Pineapple"
          />
          <label htmlFor="one" style={{ color: `${color}` }}>
            Pineapple
          </label>
          <input
            {...register('memento')}
            value="Loud"
            name="memento"
            id="two"
            type="radio"
          />
          <label htmlFor="two" style={{ color: `${color}` }}>
            Loud
          </label>
          <input
            {...register('memento')}
            name="memento"
            value="Minimal"
            id="three"
            type="radio"
          />
          <label htmlFor="three" style={{ color: `${color}` }}>
            Minimal
          </label>
          <input
            {...register('memento')}
            value="Tape"
            name="memento"
            id="four"
            type="radio"
          />
          <label htmlFor="four" style={{ color: `${color}` }}>
            Tape
          </label>
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
                borderRadius: '12px',
              }}
            ></div>
            <div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: '12px',
                }}
              >
                <b>
                  <input
                    {...register('tapeArtistName', {
                      required: true,
                    })}
                    type="text"
                    placeholder="Artist Name"
                    style={{
                      background: 'transparent',
                      border: 'none',
                      fontSize: '36px',
                    }}
                  />
                </b>
                <span
                  style={{ fontWeight: 'normal', fontSize: '36px' }}
                >
                  's Tape
                </span>
                <div className={styles.memento}>
                  <PineappleMemento color={color} />
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
                  {...register('tapeDescription', { required: true })}
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

        <div className={styles.gridProfile}>
          <div className={styles.profileModule}></div>

          <div
            className={styles.profileModuleRectangle}
            style={{
              backgroundColor: 'var(--artape-primary-color)',
              overflow: 'auto',
            }}
          ></div>
          <div className={styles.profileModule}></div>
          <div className={styles.profileModule}></div>
          <div className={styles.profileModule}></div>

          <div className={styles.profileModuleRectangle}></div>
          <div className={styles.profileModule}></div>
        </div>
      </main>
    </>
  );
};

export default Create;
