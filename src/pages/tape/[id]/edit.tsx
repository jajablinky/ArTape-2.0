import { useState, useEffect } from 'react';
import { HexColorPicker } from 'react-colorful';
import { useTape } from '@/components/TapeContext';
import { useRouter } from 'next/router';

import styles from '@/styles/Home.module.css';

import Image from 'next/image';

import CassetteLogo from '../../../../public/Artape-Cassete-Logo.gif';

import { SubmitHandler, useForm } from 'react-hook-form';

import CassetteMemento from '@/components/Images/Mementos/CassetteMemento';

import PineappleMemento from '@/components/Images/Mementos/PineappleMemento';
import LoudMemento from '@/components/Images/Mementos/LoudMemento';
import MinimalMemento from '@/components/Images/Mementos/MinimalMemento';

import UploadButton from '@/components/Images/UI/UploadButton';

import LoadingOverlay from '@/components/LoadingOverlay';
import AkordSignIn from '@/components/Helper Functions/AkordSignIn';
import getNextVersion from '@/components/Helper Functions/getNextVersion';
import EditModeEditableAudioPlayer from '@/components/EditModeEditableAudioPlayer';
import { SubmitValues } from '@/types/SubmitValues';
import getMementoSvgContent from '@/components/Helper Functions/getMementoSvgContent';
import { TapeWithAudioFiles, TapeWithImageFiles } from '@/types/TapeInfo';
import { blobUrlToFile } from '@/components/Helper Functions/blobUrltoFile';

type ModuleInfo = {
  file: File | null;
  url: string;
};

const loader = (
  <Image
    src={CassetteLogo}
    width={15}
    alt="artape-logo"
    style={{ filter: 'invert(1)' }}
  />
);

const Edit = () => {
  const { tape, setTape } = useTape();
  if (!tape) {
    return <div>No tape data available</div>;
  }
  const {
    audioFiles,
    tapeInfoJSON,
    imageFiles,
    profilePicture,
    color,
    memento,
    tapeArtistName,
    tapeDescription,
    type,
  } = tape;

  const [progress, setProgress] = useState({
    percentage: 0,
    state: 'Generating',
  });
  const [vaultId, setVaultId] = useState('');

  const router = useRouter();
  const [moduleFiles, setModuleFiles] = useState<Record<number, File>>({});
  const [initialModules, setInitialModules] = useState<
    Record<number, ModuleInfo>
  >({});
  const [selectedMemento, setSelectedMemento] = useState(memento);
  // Profile Pic States
  const [profilePicUrl, setProfilePicUrl] = useState(profilePicture.url);
  const [loading, setLoading] = useState(false);

  const [finishEdit, setFinishEdit] = useState(false);
  const { id } = router.query;

  const handleMementoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedMemento(event.target.value);
  };

  const mementoGenerator = () => {
    if (tapeInfoJSON) {
      if (tapeInfoJSON.memento === 'Pineapple') {
        return <PineappleMemento color={color} />;
      } else if (tapeInfoJSON.memento === 'Loud') {
        return <LoudMemento color={color} />;
      } else if (tapeInfoJSON.memento === 'Minimal') {
        return <MinimalMemento color={color} />;
      } else if (tapeInfoJSON.memento === 'Minimal') {
        return <CassetteMemento color={color} />;
      } else {
        return null;
      }
    }
  };

  /* - Form Submit: Uploading when User Is Ready With All Files - */
  const {
    register,
    handleSubmit,
    watch,
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

  const handleColorChange = (newColor: string) => {
    setTape((prevTape: TapeWithAudioFiles) => ({
      ...prevTape,
      color: newColor,
      tapeInfoJSON: {
        ...prevTape.tapeInfoJSON,
        color: newColor,
      },
    }));
  };

  const handleProfilePictureChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setProfilePicUrl(url);
      setTape((prevTape: TapeWithImageFiles) => ({
        ...prevTape,
        profilePicture: {
          ...prevTape.profilePicture,
          url: url,
        },
        tapeInfoJSON: {
          ...prevTape.tapeInfoJSON,
          profilePicture: file.name,
        },
      }));
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTape((prevTape: TapeWithImageFiles) => ({
      ...prevTape,
      [name]: value,
      tapeInfoJSON: {
        ...prevTape.tapeInfoJSON,
        [name]: value,
      },
    }));
  };

  useEffect(() => {
    const fetchInitialModules = async () => {
      setLoading(true); // Start loading
      try {
        // initializing initial files
        let newInitialImageModules: { [key: number]: any } = {};
        let newInitialAudioTracks: { [key: number]: any } = {};

        // sorting all the image files and audio files
        const sortedImageFiles = [...imageFiles].sort(
          (a, b) => a.moduleId - b.moduleId
        );
        const sortedAudioFiles = [...audioFiles].sort(
          (a, b) => a.trackNumber - b.trackNumber
        );
        // initializing newImageFiles array
        const newImageFiles = [];
        const newAudioFiles = [];

        //cycling through each imageFile in sortedImageFiles
        for (let audioFile of sortedAudioFiles) {
          const file = await blobUrlToFile(audioFile.url, audioFile.name);
          newInitialAudioTracks[audioFile.trackNumber] = {
            url: audioFile.url,
            file: file,
          };
          newAudioFiles.push({
            ...audioFile,
            file: file,
          });
        }

        //cycling through each imageFile in sortedImageFiles
        for (let imageFile of sortedImageFiles) {
          const file = await blobUrlToFile(imageFile.url, imageFile.name);
          newInitialImageModules[imageFile.moduleId] = {
            url: imageFile.url,
            file: file,
          };
          newImageFiles.push({
            ...imageFile,
            file: file,
          });
        }

        setTape({
          ...tape,
          imageFiles: newImageFiles,
          audioFiles: newAudioFiles,
        });

        setInitialModules(newInitialImageModules);
      } catch (error) {
        console.error('There was an error', error);
      }
      setLoading(false); // End loading
    };
    fetchInitialModules();
  }, []);

  const handleImageFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    // need to update initialModules
    try {
      const files = e.target.files;
      if (files && files.length > 0) {
        const newImageFile = {
          url: URL.createObjectURL(files[0]),
          moduleId: index,
          name: files[0].name,
          alt: files[0].name,
          file: files[0],
        };

        setInitialModules((prev) => ({
          ...prev,
          [index]: newImageFile,
        }));

        setTape((prevTape: TapeWithImageFiles) => {
          const updatedImageFiles = [...prevTape.imageFiles];
          const newImageTapeInfo = {
            moduleId: index,
            name: files[0].name,
            alt: files[0].name,
          };
          const existingFileIndex = updatedImageFiles.findIndex(
            (file) => file.moduleId === index
          );
          if (existingFileIndex !== -1) {
            // replace existing file if it exists
            updatedImageFiles[existingFileIndex] = newImageFile;
          } else {
            // add new file if it doesn't exist
            updatedImageFiles.push(newImageFile);
          }
          if (prevTape.tapeInfoJSON) {
            const updatedTapeInfoImageFiles = [
              ...prevTape.tapeInfoJSON.imageFiles,
            ];

            const existingTapeInfoFileIndex =
              updatedTapeInfoImageFiles.findIndex(
                (file) => file.moduleId === index
              );
            if (existingTapeInfoFileIndex !== -1) {
              // replace existing file in tapeInfoJSON if it exists
              updatedTapeInfoImageFiles[existingTapeInfoFileIndex] =
                newImageTapeInfo;
            } else {
              // add new file to tapeInfoJSON if it doesn't exist
              updatedTapeInfoImageFiles.push(newImageTapeInfo);
            }

            return {
              ...prevTape,
              imageFiles: updatedImageFiles,
              tapeInfoJSON: {
                ...prevTape.tapeInfoJSON,
                imageFiles: updatedTapeInfoImageFiles,
              },
            };
          }
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const numberOfModules = 7;
  const modules = [];

  // to push the audio module
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
          <EditModeEditableAudioPlayer
            required={false}
            register={register}
            tape={tape}
            setTape={setTape}
            watch={watch}
            tapeInfoJSON={tapeInfoJSON}
          />
        </div>
      );
      continue;
    }

    const imageModuleKey = `imageModule${i}` as keyof SubmitValues;

    // push all the image modules
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
          border:
            errors[imageModuleKey] &&
            Object.keys(errors).includes(imageModuleKey)
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
          {initialModules[i] && initialModules[i].url ? (
            <Image
              src={
                initialModules[i] && initialModules[i].url
                  ? initialModules[i].url
                  : 'default-image-url'
              }
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
            {...register(`imageModule${i}` as keyof SubmitValues, {})}
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
    setProgress({ percentage: 5, state: 'Communicating with Akord' });

    console.log('submitting');
    let imageModules: any = [];
    let imageUploadModules: any = [];

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

    const processAndUploadFiles = async () => {
      try {
        // Calculate total number of files to upload
        const totalFilesToUpload =
          1 + // for tapeInfo.json
          (profilePicture ? 1 : 0) + // for profile picture
          (memento ? 1 : 0) + // for memento
          (audioFiles ? audioFiles.length : 0) + // for audio files
          imageUploadModules.length; // for image files

        let completedUploads = 0;

        let tapeInfoJSONUpload: File | null = null;
        const metadata = tapeInfoJSON;

        // Convert metadata object into a JSON string
        const metadataJSON = JSON.stringify(metadata);

        tapeInfoJSONUpload = new File([metadataJSON], 'tapeInfo.json', {
          type: 'application/json',
        });

        const akord = await AkordSignIn(data.email, data.password);

        if (akord && id) {
          if (typeof id !== 'string') {
            throw new Error(
              `Expected id to be a string, but received ${typeof id}`
            );
          }
          await akord.vault.rename(id, tapeArtistName);
          console.log('rename complete');

          // get all the folders in akord vault and sort them
          // Find the most recent folder's id
          const folders = await akord.folder.listAll(id);
          const { name } = folders.reduce(
            (highest, currentFolder) => {
              const [highestMajor, highestMinor, highestlowlowest] =
                highest.name.split('.').map(Number);
              const [currentMajor, currentMinor, currentlowlowest] =
                currentFolder.name.split('.').map(Number);

              if (currentMajor > highestMajor) return currentFolder;
              if (currentMajor === highestMajor && currentMinor > highestMinor)
                return currentFolder;
              if (
                currentMajor === highestMajor &&
                currentMinor === highestMinor &&
                currentlowlowest > highestlowlowest
              )
                return currentFolder;

              return highest;
            },
            { name: '0.0.0', id: '' }
          );

          const versionToCreate = getNextVersion(name);

          const { folderId } = await akord.folder.create(id, versionToCreate);
          console.log(`successfully created folder: ${folderId}`);
          setProgress({
            percentage: Math.round(
              (completedUploads / totalFilesToUpload) * 100
            ),
            state: `Successful Sign-in to Akord! and renamed vault ${vaultId}`,
          });
          setVaultId(id);

          // Upload Profile Pic
          if (profilePicture && akord) {
            console.log('uploading profile pic');
            // Fetch the blob data from the URL
            const response = await fetch(profilePicture.url);
            const blob = await response.blob();

            // Create a new File instance
            const file = new File([blob], profilePicture.name, {
              type: blob.type,
            });

            const { stackId } = await akord.stack.create(id, file, file.name);
            await akord.stack.move(stackId, folderId);
            completedUploads += 1;
            setProgress({
              percentage: Math.round(
                (completedUploads / totalFilesToUpload) * 100
              ),
              state: `Uploaded Profile Picture!`,
            });
            console.log(`Uploaded file: ${file.name}, Stack ID: ${stackId}`);
          }

          //edit and upload memento
          if (memento || tapeInfoJSON) {
            const mementoSvgContent = getMementoSvgContent(
              selectedMemento,
              color
            );
            if (mementoSvgContent && akord) {
              const mementoSvgFile = new File(
                [mementoSvgContent],
                `${selectedMemento}.svg`,
                { type: 'text/html' }
              );
              const { stackId: mementoStackId } = await akord.stack.create(
                id,
                mementoSvgFile,
                mementoSvgFile.name
              );
              setTape({ ...tape, memento: memento });
              await akord.stack.move(mementoStackId, folderId);
              console.log(
                `Uploaded memento: ${mementoSvgFile.name}, Stack ID: ${mementoStackId}`
              );
            }
          }

          // Upload audio files
          if (audioFiles && akord) {
            for (const { audioFile, name } of audioFiles) {
              console.log(audioFile);
              try {
                const { stackId } = await akord.stack.create(
                  vaultId,
                  audioFile,
                  name
                );
                await akord.stack.move(stackId, folderId);
                completedUploads += 1;
                setProgress({
                  percentage: Math.round(
                    (completedUploads / totalFilesToUpload) * 100
                  ),
                  state: `Uploaded audio file: ${name}`,
                });
                console.log(`Uploaded file: ${name}, Stack ID: ${stackId}`);
              } catch (error) {
                console.log(error);
                setLoading(false);
                setProgress({ percentage: 0, state: 'initial' });
              }
            }
          }

          // Upload image files
          if (imageFiles && akord) {
            for (const image of imageFiles) {
              const { stackId } = await akord.stack.create(
                vaultId,
                image.file,
                image.name
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

          console.log('UPLOAD COMPLETE');
        }
      } catch (error) {
        setLoading(false);
        console.error(error);
      }
    };

    processAndUploadFiles().then(() => {
      setProgress({ percentage: 100, state: 'Success!' });
      console.log(tape);
      setFinishEdit(true);
      setLoading(false);
    });
  };
  useEffect(() => {
    if (finishEdit) {
      // router.push({
      //   pathname: `/tape/${[id]}`,
      // });
    }
  }, [finishEdit, router]);

  useEffect(() => {
    console.log(tape);
  }, [tape]);

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
        {loading ? <LoadingOverlay progress={progress} /> : null}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.aboveGrid}>
            <h1 style={{ fontSize: '48px' }}>Edit Tape</h1>
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
                  <HexColorPicker color={color} onChange={handleColorChange} />
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
                      {...register('memento')}
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
                      {...register('memento')}
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
                      {...register('memento')}
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
                      {...register('memento')}
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
                    {...register('profilePicture')}
                    id="profilePicture"
                    type="file"
                    onChange={handleProfilePictureChange}
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
                      {...register('tapeArtistName')}
                      type="text"
                      placeholder={tapeArtistName || 'Artist Name'}
                      onChange={handleDescriptionChange}
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
                      {selectedMemento === '' && mementoGenerator()}
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
                      {...register('type')}
                      type="text"
                      placeholder={type || 'Type'}
                      onChange={handleDescriptionChange}
                      style={{
                        border: errors.type ? '1px solid red' : 'none',
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
                      {...register('tapeDescription', {})}
                      type="text"
                      placeholder={tapeDescription}
                      onChange={handleDescriptionChange}
                      style={{
                        fontSize: '20px',

                        background: 'transparent',
                        border: errors.tapeDescription
                          ? '1px solid red'
                          : 'none',
                      }}
                    />
                  </p>
                </div>
              </div>
              <div className={styles.artistHeaderRight}></div>
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
                  Finish Editing
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

export default Edit;
