import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import styles from '@/styles/Home.module.css';
import Image from 'next/image';

import UploadButton from './Images/UI/UploadButton';
import CheckIcon from './Images/UI/CheckIcon';

import { TapeWithFiles } from '@/types/TapeInfo';
import createNewTape from './Helper Functions/createNewTape';

interface AudioPlayerProps {
  setTape: (tape: TapeWithFiles | null) => void;
  tape: TapeWithFiles | null;
  register: any;
  required: boolean;
}

const EditableAudioPlayer: React.FC<AudioPlayerProps> = ({
  setTape,
  tape,
  register,
  required,
}) => {
  const NUM_TRACKS = 3;
  const [artistNames, setArtistNames] = useState(Array(NUM_TRACKS).fill(''));
  const [songNames, setSongNames] = useState(Array(NUM_TRACKS).fill(''));
  const [clickedAudioTracks, setClickedAudioTrack] = useState([
    false,
    false,
    false,
  ]);

  // for preview
  const [albumPictureUrls, setAlbumPictureUrls] = useState<(string | null)[]>(
    Array(NUM_TRACKS).fill(null)
  );

  // this will set checkmark on upload button
  const handleUploadButtonClick = (index: number) => {
    const audioFile = document.getElementById(`audioFile${index}`);
    if (audioFile) {
      audioFile.click();
      setClickedAudioTrack((prevState) =>
        prevState.map((item, i) => (i === index - 1 ? true : item))
      );
    }
  };

  const handleAudioUpload = async (i: number, file: File) => {
    // create mode
    const getDuration = (file: File): Promise<number> => {
      return new Promise((resolve) => {
        const audio = new Audio(URL.createObjectURL(file));
        audio.addEventListener('loadedmetadata', () => {
          resolve(audio.duration);
        });
      });
    };
    const duration = await getDuration(file);

    // If tape is not null, update the audioFiles array
    if (tape !== null) {
      const newTape = { ...tape };

      if (!newTape.audioFiles[i - 1]) {
        // if there's no object at the given index
        newTape.audioFiles[i - 1] = {
          // create a new object
          audioFile: file,
          duration,
          audioUrl: URL.createObjectURL(file),
          name: '',
          artistName: '',
          trackNumber: i,
          albumPicture: '',
          albumPictureFile: null,
          albumPictureUrl: '',
          fileName: file.name,

          // other properties will be undefined
        };
      } else {
        // if there's an existing object at the given index
        newTape.audioFiles[i - 1].audioFile = file;
        newTape.audioFiles[i - 1].fileName = file.name;
        newTape.audioFiles[i - 1].audioUrl = URL.createObjectURL(file);
        newTape.audioFiles[i - 1].duration = duration;
      }

      setTape(newTape);
    } else {
      const newTape = createNewTape(i);

      newTape.audioFiles[i - 1] = {
        audioFile: file,
        duration: duration,
        audioUrl: URL.createObjectURL(file),
        name: '',
        artistName: '',
        trackNumber: i,
        albumPicture: '',
        albumPictureFile: null,
        albumPictureUrl: '',
        fileName: file.name,
      };

      setTape(newTape);
    }
  };

  const handleSongName = (i: number, e: any) => {
    // update artistNames state
    const newSongNames = [...songNames];
    newSongNames[i - 1] = e.target.value;
    setSongNames(newSongNames);

    if (tape !== null) {
      const newTape = { ...tape };
      if (!newTape.audioFiles[i - 1]) {
        // if there's no object at the given index
        newTape.audioFiles[i - 1] = {
          // create a new object with default values
          audioFile: null,
          duration: 0,
          audioUrl: '',
          name: e.target.value,
          artistName: '',
          trackNumber: i,
          albumPicture: '',
          albumPictureFile: null,
          albumPictureUrl: '',
          fileName: '',
        };
      } else {
        // if there's an existing object at the given index
        newTape.audioFiles[i - 1].name = e.target.value;
      }
      setTape(newTape);
    } else {
      const newTape = createNewTape(i);
      newTape.audioFiles[i - 1] = {
        audioFile: null,
        duration: 0,
        audioUrl: '',
        name: e.target.value,
        artistName: '',
        trackNumber: i,
        albumPicture: '',
        albumPictureFile: null,
        albumPictureUrl: '',
        fileName: '',
      };

      setTape(newTape);
    }
  };

  const handleArtistName = (i: number, e: any) => {
    // update artistNames state
    const newArtistNames = [...artistNames];
    newArtistNames[i - 1] = e.target.value;
    setArtistNames(newArtistNames);
    if (tape !== null) {
      const newTape = { ...tape };
      if (!newTape.audioFiles[i - 1]) {
        // if there's no object at the given index
        newTape.audioFiles[i - 1] = {
          // create a new object with default values
          audioFile: null,
          duration: 0,
          audioUrl: '',
          name: '',
          artistName: e.target.value,
          trackNumber: i,
          albumPicture: '',
          albumPictureFile: null,
          albumPictureUrl: '',
          fileName: '',
        };
      } else {
        // if there's an existing object at the given index
        newTape.audioFiles[i - 1].artistName = e.target.value;
      }
      setTape(newTape);
    } else {
      const newTape = createNewTape(i);
      newTape.audioFiles[i - 1] = {
        audioFile: null,
        duration: 0,
        audioUrl: '',
        name: '',
        artistName: e.target.value,
        trackNumber: i,
        albumPicture: '',
        albumPictureFile: null,
        albumPictureUrl: '',
        fileName: '',
      };

      setTape(newTape);
    }
  };

  const handleAlbumPictureUpload = (i: number, picture: File) => {
    console.log('click');
    const url = URL.createObjectURL(picture);
    setAlbumPictureUrls((prev) => {
      const updatedUrls = [...prev];
      updatedUrls[i - 1] = url;
      return updatedUrls;
    });

    if (tape !== null) {
      const newTape = { ...tape };
      if (!newTape.audioFiles[i - 1]) {
        // if there's no object at the given index
        newTape.audioFiles[i - 1] = {
          // create a new object with default values
          audioFile: null,
          duration: 0,
          audioUrl: '',
          name: '',
          artistName: '',
          trackNumber: i,
          albumPicture: picture.name,
          albumPictureFile: picture,
          albumPictureUrl: url,
          fileName: '',
        };
      } else {
        // if there's an existing object at the given index
        newTape.audioFiles[i - 1].albumPictureUrl = url;
        newTape.audioFiles[i - 1].albumPictureFile = picture;
      }

      setTape(newTape);
    } else {
      const newTape = createNewTape(i);
      // Update the specific index with the albumPicture
      newTape.audioFiles[i - 1] = {
        audioFile: null,
        duration: 0,
        audioUrl: '',
        name: '',
        artistName: '',
        trackNumber: i,
        albumPicture: picture.name,
        albumPictureFile: picture,
        albumPictureUrl: url,
        fileName: '',
      };

      setTape(newTape);
    }
  };

  return (
    <>
      <motion.div
        className={styles.musicPlayerContainer}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={styles.musicPlayerHeader}
          style={{
            position: 'sticky',
            top: '0',
            height: '80px',
            objectFit: 'cover',
          }}
        >
          <audio />
        </div>
        {Array.from({ length: NUM_TRACKS }, (_, i) => i + 1).map((i) => (
          <div key={i} className={styles.trackContainer}>
            <div className={styles.musicPlayerTrack} style={{ width: 'auto' }}>
              <div className={styles.musicPlayerLeftSide}>
                <div
                  className={styles.songArt}
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'pointer',
                    borderRadius: '12px',
                    position: 'relative',
                    border: '1px solid #ffffff',
                  }}
                >
                  {albumPictureUrls[i - 1] ? (
                    <label
                      htmlFor={`albumPicture${i}`}
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
                        src={albumPictureUrls[i - 1] || ''}
                        alt={`albumPicture${i}`}
                        width={75}
                        height={75}
                        style={{
                          objectFit: 'cover',
                          borderRadius: '12px',
                          cursor: 'pointer',
                        }}
                      />
                    </label>
                  ) : (
                    <label
                      htmlFor={`albumPicture${i}`}
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
                      <UploadButton color={'#ffffff'} />
                    </label>
                  )}
                  :
                  <input
                    {...register(`albumPicture${i}`, { required: required })}
                    onChange={(e) => {
                      if (e.target.files) {
                        handleAlbumPictureUpload(i, e.target.files[0]);
                      }
                    }}
                    id={`albumPicture${i}`}
                    type="file"
                    name="albumPicture"
                    accept="image/*"
                    style={{ display: 'none', width: '100%' }}
                  />
                </div>
                <div className={styles.musicInfo}>
                  <div className={styles.artistTitleTrack}>
                    <p>
                      <input
                        {...register(`artistName${i}`, { required: required })}
                        type="text"
                        placeholder={'Artist Name'}
                        value={artistNames[i - 1]}
                        onChange={(e) => {
                          handleArtistName(i, e);
                        }}
                        style={{
                          color: 'var(--artape-black)',
                          background: 'transparent',
                          border: 'none',
                        }}
                      />
                    </p>
                    <h2>
                      <input
                        {...register(`songName${i}`, { required: required })}
                        type="text"
                        value={songNames[i - 1]}
                        placeholder={'Song Name'}
                        onChange={(e) => {
                          handleSongName(i, e);
                        }}
                        style={{
                          fontSize: '20px',
                          background: 'transparent',
                          color: 'var(--artape-black)',
                          border: 'none',
                        }}
                      />
                    </h2>
                  </div>
                  <div className={styles.durationBuyMp3}>
                    <p>
                      <span className={styles.duration}></span>
                    </p>
                  </div>
                </div>
              </div>
              <div className={styles.musicPlayerRightSide}>
                <input
                  {...register(`audioFile${i}`, { required: required })}
                  onChange={(e) => {
                    if (e.target.files) handleAudioUpload(i, e.target.files[0]);
                  }}
                  id={`audioFile${i}`}
                  type="file"
                  name={`audioFile${i}`}
                  accept="audio/*"
                  style={{ display: 'none', width: '100%' }}
                />
                <button
                  type="button"
                  onClick={() => handleUploadButtonClick(i)}
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    background: 'var(--artape-primary-color)',
                    color: 'var(--artape-white)',
                    border: '1px solid var(--artape-white)',
                    width: '200px',
                    height: '60px',
                    padding: '0px',
                  }}
                >
                  {clickedAudioTracks[i - 1] ? (
                    <CheckIcon color="#05D00D" />
                  ) : (
                    'Upload'
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </>
  );
};

export default EditableAudioPlayer;
