import { useState, useEffect } from 'react';
import { HexColorPicker } from 'react-colorful';
import { useTape } from '@/components/TapeContext';
import { useRouter } from 'next/router';

import styles from '@/styles/Home.module.css';

import Image from 'next/image';

import CassetteLogo from '../../public/Artape-Cassete-Logo.gif';

import { FieldErrors, SubmitHandler, useForm } from 'react-hook-form';

import EditButton from '@/components/Images/UI/EditButton';
import UploadButton from '@/components/Images/UI/UploadButton';
import EditableAudioPlayer from '@/components/EditableAudioPlayer';

import LoadingOverlay from '@/components/LoadingOverlay';

import { UDL_LICENSE_TX_ID } from '@akord/akord-js';
import createMetadataJSON from '@/components/Helper Functions/createMetadataJSON';
import { SubmitValues } from '@/types/SubmitValues';
import AkordSignIn from '@/components/Helper Functions/AkordSignIn';

import { extractColorFromTags } from '@/components/Helper Functions/extractColorFromTags';
import Link from 'next/link';

/* Types */

const udl = {
  license: UDL_LICENSE_TX_ID,
  licenseFee: {
    type: 'Monthly',
    value: 5,
  },
  derivations: [
    {
      type: 'Allowed-With-RevenueShare',
      value: 30,
    },
    {
      type: 'Allowed-With-RevenueShare',
      value: 10,
      duration: {
        type: 'After',
        value: 2,
      },
    },
  ],
  commercialUses: [{ type: 'Allowed-With-Credit' }],
};

const loader = (
  <Image
    src={CassetteLogo}
    width={15}
    alt="artape-logo"
    style={{ filter: 'invert(1)' }}
  />
);

const Create = () => {
  const [progress, setProgress] = useState({
    percentage: 0,
    state: 'Generating',
  });
  const router = useRouter();
  const [imageFiles, setImageFiles] = useState<Record<number, File>>({});
  const [moduleUrls, setModuleUrls] = useState<{
    [index: number]: string;
  }>({});
  const [selectedMemento, setSelectedMemento] = useState('Pineapple');
  const [profilePicUrl, setProfilePicUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [color, setColor] = useState('#0022ff');

  const { tape, setTape } = useTape();

  const handleMementoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedMemento(event.target.value);
  };
  //
  /* - Form Submit: Uploading when User Is Ready With All Files - */
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<SubmitValues>();

  const watchedProfilePic = watch('profilePicture');
  useEffect(() => {
    if (watchedProfilePic?.length > 0) {
      setProfilePicUrl(URL.createObjectURL(watchedProfilePic[0]));
    } else {
      setProfilePicUrl;
    }
  }, [watchedProfilePic]);

  const handleImageFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setImageFiles((prevModuleFiles) => ({
        ...prevModuleFiles,
        [index]: files[0],
      }));
    }
  };

  const numberOfModules = 7;
  const modules = [];

  useEffect(() => {
    const keys = Object.keys(imageFiles);
    keys.forEach((key) => {
      const file = imageFiles[parseInt(key)];
      if (file) {
        setModuleUrls((prevModuleUrls) => ({
          ...prevModuleUrls,
          [key]: URL.createObjectURL(file),
        }));
      }
    });
  }, [imageFiles]);

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
          <EditableAudioPlayer
            required={true}
            register={register}
            setTape={setTape}
            tape={tape}
          />
        </div>
      );
      continue;
    }
    modules.push(
      <div
        className={
          i === 6 ? styles.profileModuleRectangle : styles.profileModule
        }
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
          position: 'relative',
          border: errors[`imageModule${i}` as keyof FieldErrors<SubmitValues>]
            ? '1px solid red'
            : '1px solid var(--artape-primary-color)',
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
            {...register(`imageModule${i}` as keyof SubmitValues, {
              required: true,
            })}
            id={`imageModule${i}`}
            type="file"
            name={`imageModule${i}`}
            accept="image/*"
            style={{ display: 'none', width: '100%' }}
            onChange={(e) => handleImageFileChange(e, i)}
          />
        </label>
      </div>
    );
  }

  const onSubmit: SubmitHandler<SubmitValues> = async (data, e) => {
    setLoading(true);
    console.log(tape);
    setProgress({ percentage: 5, state: 'Communicating with Akord' });
    console.log('submitting');
    let imageModules: any = [];
    let imageUploadModules: any = [];

    const filteredImageFiles = Object.values(imageFiles);
    for (let index = 0; index < filteredImageFiles.length; index++) {
      let moduleId;
      const file = filteredImageFiles[index];
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

    const processAndUploadFiles = async () => {
      try {
        // Calculate total number of files to upload
        const totalFilesToUpload =
          1 + // for tapeInfo.json
          (tape?.profilePicture ? 1 : 0) + // for profile picture
          (data.memento ? 1 : 0) + // for memento
          (tape?.audioFiles ? tape.audioFiles.length : 0) + // for audio files
          imageUploadModules.length; // for image files

        let completedUploads = 0;
        let tapeInfoJSONUpload: File | null = null;
        const metadata = createMetadataJSON(data, tape, color, imageModules);

        // Convert metadata object into a JSON string
        const metadataJSON = JSON.stringify(metadata);

        tapeInfoJSONUpload = new File([metadataJSON], 'tapeInfo.json', {
          type: 'application/json',
        });

        const akord = await AkordSignIn(data.email, data.password, setLoading);

        if (akord) {
          const profile = await akord.profile.get();
          const profileEmail = profile.email;
          const profileName = profile.name;
          const profileAvatar = profile.avatar;

          const { vaultId } = await akord.vault.create(data.tapeArtistName, {
            tags: ['ArTape', 'Music', `color-${color}`],
          });
          const { folderId } = await akord.folder.create(vaultId, '1.0.0');
          console.log(`successfully created vault: ${vaultId}`);
          setProgress({
            percentage: 12,
            state: `Successful Sign-in to Akord! and created vault ${vaultId}`,
          });

          // Upload Profile Pic
          if (data.profilePicture[0]) {
            const { stackId } = await akord.stack.create(
              vaultId,
              data.profilePicture[0],
              data.profilePicture[0].name,
              { udl }
            );
            const { transactionId } = await akord.stack.move(stackId, folderId);
            completedUploads += 1;
            setProgress({
              percentage: Math.round(
                (completedUploads / totalFilesToUpload) * 100
              ),
              state: `Uploaded Profile Picture!`,
            });
            console.log(
              `Uploaded file: ${data.profilePicture[0].name}, Stack ID: ${stackId}`
            );
          }

          if (data.memento) {
            const mementoSvgContent = getMementoSvgContent(data.memento, color);
            if (mementoSvgContent) {
              const mementoSvgFile = new File(
                [mementoSvgContent],
                `${data.memento}.svg`,
                { type: 'text/html' }
              );
              const { stackId: mementoStackId } = await akord.stack.create(
                vaultId,
                mementoSvgFile,
                mementoSvgFile.name,
                { udl }
              );
              await akord.stack.move(mementoStackId, folderId);
              console.log(
                `Uploaded memento: ${mementoSvgFile.name}, Stack ID: ${mementoStackId}`
              );
            }
          }

          // Create operation to upload album picture for each audio file making sure there is no duplicates
          // Upload audio files
          if (tape?.audioFiles) {
            for (const { audioFile } of tape.audioFiles) {
              try {
                if (audioFile === null) {
                  continue; // if audioFile is null, we skip this iteration
                }
                const { stackId } = await akord.stack.create(
                  vaultId,
                  audioFile,
                  audioFile.name,
                  { udl }
                );
                await akord.stack.move(stackId, folderId);
                completedUploads += 1;
                setProgress({
                  percentage: Math.round(
                    (completedUploads / totalFilesToUpload) * 100
                  ),
                  state: `Uploaded audio file: ${audioFile.name}`,
                });
                console.log(
                  `Uploaded file: ${audioFile.name}, Stack ID: ${stackId}`
                );
              } catch (error) {
                console.log(error);
                setLoading(false);
                setProgress({ percentage: 0, state: 'initial' });
              }
            }
          }

          // Upload image files
          if (imageUploadModules) {
            for (const image of imageUploadModules) {
              const { stackId } = await akord.stack.create(
                vaultId,
                image.url,
                image.name,
                { udl }
              );
              await akord.stack.move(stackId, folderId);

              completedUploads += 1;
              setProgress({
                percentage: Math.round(
                  (completedUploads / totalFilesToUpload) * 100
                ),
                state: `Uploaded image file: ${image.name}`,
              });
              console.log(`Uploaded file: ${image.name}, Stack ID: ${stackId}`);
            }
          }

          // Upload tapeInfo.json
          if (tapeInfoJSONUpload) {
            const { stackId } = await akord.stack.create(
              vaultId,
              tapeInfoJSONUpload,
              tapeInfoJSONUpload.name
            );
            const { transactionId } = await akord.stack.move(stackId, folderId);
            completedUploads += 1;
            setProgress({
              percentage: Math.round(
                (completedUploads / totalFilesToUpload) * 100
              ),
              state: `Uploaded tapeInfo.json`,
            });
            console.log(
              `Uploaded file: ${tapeInfoJSONUpload.name}, Stack ID: ${stackId}`
            );
          }

          // reformatting imageFiles and audioFiles to fit context when mapped per vault id at different page
          const imageFiles = imageUploadModules.map((imageModule: any) => {
            return {
              name: imageModule.name,
              url: URL.createObjectURL(imageModule.url),
              moduleId: imageModule.moduleId,
            };
          });

          const profilePicture = {
            name: data.profilePicture[0].name,
            url: URL.createObjectURL(data.profilePicture[0]),
          };

          const tapeDescription = metadata?.tapeDescription;
          const tapeArtistName = metadata?.tapeArtistName;
          const memento = metadata?.memento;
          const type = metadata?.type;

          const tapeInfoOptions = [];

          // grab vaults and store tape informations in context for sidebar navigation in next page
          const vaults = await akord.vault.listAll({
            tags: {
              values: ['ArTape'],
              searchCriteria: 'CONTAINS_SOME',
            },
          });
          for (let i = 0; i < vaults.length; i++) {
            const vaultId = vaults[i].id;
            const tags = vaults[i].tags;
            const tapeName = vaults[i].name;
            const color = extractColorFromTags(tags);

            if (tapeName && vaultId && color) {
              tapeInfoOptions.push({
                tapeName,
                vaultId,
                color,
              });
            }
          }

          setTape({
            ...tape,
            akord,
            tapeInfoOptions,
            profileAvatar,
            profileEmail,
            profileName,
            profilePicture,
            imageFiles,
            type,
            tapeDescription,
            tapeArtistName,
            memento,
            color,
            tapeInfoJSON: metadata,
            audioFiles: tape?.audioFiles || [],
          });
          console.log(metadata);
          console.log('UPLOAD COMPLETE');
          return vaultId;
        }
      } catch (error) {
        setLoading(false);
        console.error(error);
      }
    };

    processAndUploadFiles().then((vaultId) => {
      setProgress({ percentage: 100, state: 'Success!' });
      setLoading(false);
      router.push({
        pathname: `/tape/${vaultId}`,
      });
    });
  };

  return (
    <>
      <main
        className={styles.main}
        style={
          {
            '--artape-primary-color': color,
            justifyContent: 'center',
          } as React.CSSProperties
        }
      >
        {loading ? <LoadingOverlay progress={progress} /> : null}
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
                <div className={styles.linkToAkord}>
                  Don't have Akord account?{' '}
                  <Link
                    href={'https://v2.akord.com/https://v2.akord.com/signup'}
                  >
                    Sign Up for Akord!
                  </Link>
                </div>
                <p style={{ fontSize: '18px' }}>
                  Sign in with Existing Akord Account
                </p>
                <input
                  {...register('email', { required: true })}
                  type="email"
                  placeholder="Email"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    borderBottom: errors.email
                      ? '1px solid red'
                      : '1px solid black',
                  }}
                />
                {errors.email && (
                  <p className={styles.error}>email is required</p>
                )}
                <input
                  {...register('password', { required: true })}
                  type="password"
                  placeholder="Password"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    borderBottom: errors.password
                      ? '1px solid red'
                      : '1px solid black',
                  }}
                />
                {errors.password && (
                  <p className={styles.error}>password is required</p>
                )}
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
                    <input
                      {...register('memento', {
                        required: true,
                      })}
                      className={styles.radioButton}
                      name="memento"
                      id="one"
                      type="radio"
                      value="Pineapple"
                      onChange={handleMementoChange}
                    />
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
                    <input
                      className={styles.radioButton}
                      {...register('memento', {
                        required: true,
                      })}
                      value="Loud"
                      name="memento"
                      id="two"
                      type="radio"
                      onChange={handleMementoChange}
                    />
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
                    <input
                      className={styles.radioButton}
                      {...register('memento', {
                        required: true,
                      })}
                      name="memento"
                      value="Minimal"
                      id="three"
                      type="radio"
                      onChange={handleMementoChange}
                    />
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
                    <input
                      className={styles.radioButton}
                      {...register('memento', {
                        required: true,
                      })}
                      value="Tape"
                      name="memento"
                      id="four"
                      type="radio"
                      onChange={handleMementoChange}
                    />
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
                    border: '1px solid var(--artape-primary-color)',
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
                        border: errors.profilePicture
                          ? '1px solid red'
                          : 'none',
                      }}
                    >
                      <UploadButton color={color} />
                    </label>
                  )}
                  <input
                    {...register('profilePicture', {
                      required: true,
                    })}
                    id="profilePicture"
                    type="file"
                    name="profilePicture"
                    accept="image/*"
                    style={{ display: 'none', width: '100%' }}
                  />
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
                        border: errors.tapeArtistName
                          ? '1px solid red'
                          : 'none',

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
                      {selectedMemento === 'Pineapple' && (
                        <PineappleMemento color={color} />
                      )}
                      {selectedMemento === 'Loud' && (
                        <LoudMemento color={color} />
                      )}
                      {selectedMemento === 'Minimal' && (
                        <MinimalMemento color={color} />
                      )}
                      {selectedMemento === 'Tape' && (
                        <CassetteMemento color={color} />
                      )}{' '}
                    </div>
                  </div>

                  <p style={{ fontWeight: 'lighter' }}>
                    <input
                      {...register('type', { required: true })}
                      type="text"
                      placeholder="Type (Musician / Podcaster / etc..)"
                      style={{
                        border: errors.tapeArtistName
                          ? '1px solid red'
                          : 'none',
                        fontSize: '28px',
                        background: 'transparent',
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
                        border: errors.tapeArtistName
                          ? '1px solid red'
                          : 'none',
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
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 21 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11.4844 15.2662C11.4844 15.8117 11.0455 16.2505 10.5 16.2505C9.95449 16.2505 9.51562 15.8117 9.51562 15.2662V3.8609L5.61914 7.75701C5.23359 8.14252 4.61016 8.14252 4.22871 7.75701C3.84727 7.3715 3.84316 6.74812 4.22871 6.36671L9.80273 0.789132C10.1883 0.403623 10.8117 0.403623 11.1932 0.789132L16.7754 6.36671C17.1609 6.75222 17.1609 7.3756 16.7754 7.75701C16.3898 8.13841 15.7664 8.14252 15.385 7.75701L11.4885 3.8609V15.2662H11.4844ZM12.7969 14.9381V12.9696H18.375C19.8229 12.9696 21 14.1466 21 15.5943V18.8753C21 20.323 19.8229 21.5 18.375 21.5H2.625C1.17715 21.5 0 20.323 0 18.8753V15.5943C0 14.1466 1.17715 12.9696 2.625 12.9696H8.20312V14.9381H2.625C2.26406 14.9381 1.96875 15.2334 1.96875 15.5943V18.8753C1.96875 19.2362 2.26406 19.5314 2.625 19.5314H18.375C18.7359 19.5314 19.0312 19.2362 19.0312 18.8753V15.5943C19.0312 15.2334 18.7359 14.9381 18.375 14.9381H12.7969ZM15.75 17.2348C15.75 16.9737 15.8537 16.7234 16.0383 16.5388C16.2229 16.3542 16.4733 16.2505 16.7344 16.2505C16.9954 16.2505 17.2458 16.3542 17.4304 16.5388C17.615 16.7234 17.7188 16.9737 17.7188 17.2348C17.7188 17.4958 17.615 17.7462 17.4304 17.9308C17.2458 18.1154 16.9954 18.2191 16.7344 18.2191C16.4733 18.2191 16.2229 18.1154 16.0383 17.9308C15.8537 17.7462 15.75 17.4958 15.75 17.2348Z"
                    fill="var(--artape-white)"
                  />
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
