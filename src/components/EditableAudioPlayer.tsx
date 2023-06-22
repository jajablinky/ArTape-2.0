import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import styles from '@/styles/Home.module.css';
import Image from 'next/image';
import Loader from './Loader';
import UploadButton from './Images/UI/UploadButton';
import CheckIcon from './Images/UI/CheckIcon';

import { AudioFileState } from '@/pages/create';

interface Track {
  track_number: number;
  title: string;
  duration: number;
  id: string;
  artist: string;
  src: string;
}

interface Tape {
  tracks: Track[]; // Add the tracks property here
}

interface TapeInfo {
  tapeArtistName: string;
  type: string;
  audioFiles: {
    trackNumber: number;
    name: string;
    duration: number;
    artistName: string;
  }[];
}

export interface AudioFile {
  name: string;
  url: string;
}

export interface AlbumPictureFile {
  name: string;
  url: string | null;
}

interface AudioPlayerProps {
  tapeInfoJSON: TapeInfo;
  audioFiles: {
    moduleId: number;
    audio: AudioFileState[];
  };
  setAudioFiles: (audioFiles: {
    moduleId: number;
    audio: AudioFileState[];
  }) => void;
  albumPictures: AlbumPictureFile;
  profilePicUrl: string;
  register: any;
  required: boolean;
}

const EditableAudioPlayer: React.FC<AudioPlayerProps> = ({
  audioFiles,
  setAudioFiles,
  profilePicUrl,
  watch,
  register,
  required,
  tapeInfoJSON,
}) => {
  const NUM_TRACKS = 3;
  const [artistNames, setArtistNames] = useState(Array(NUM_TRACKS).fill(''));
  const [songNames, setSongNames] = useState(Array(NUM_TRACKS).fill(''));
  const [clickedAudioTracks, setClickedAudioTrack] = useState([
    false,
    false,
    false,
  ]);

  const [albumPictureFiles, setAlbumPictureFiles] = useState<(File | null)[]>(
    Array(NUM_TRACKS).fill(null)
  );
  const [albumPictureUrls, setAlbumPictureUrls] = useState<(string | null)[]>(
    Array(NUM_TRACKS).fill(null)
  );

  // in edit mode
  useEffect(() => {
    if (tapeInfoJSON) {
      setArtistNames(tapeInfoJSON.audioFiles.map((file) => file.artistName));
      setSongNames(tapeInfoJSON.audioFiles.map((file) => file.name));
    }
  }, [tapeInfoJSON]);

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
    // console.log('audioFiles', ...audioFiles.audio); // Log the audioFiles prop
    let artistName;
    let songName;
    //handling case for edit or create mode
    if (tapeInfoJSON) {
      //edit mode
      const artistName = artistNames[i - 1];
      const songName = songNames[i - 1];
    } else {
      //create mode
      artistName = await watch(`artistName${i}`);
      songName = await watch(`songName${i}`);
    }
    const albumPictureFile = albumPictureFiles[i - 1];
    if (file && artistName && songName && albumPictureFile) {
      const getDuration = (file: File): Promise<number> => {
        return new Promise((resolve) => {
          const audio = new Audio(URL.createObjectURL(file));
          audio.addEventListener('loadedmetadata', () => {
            resolve(audio.duration);
          });
        });
      };
      const duration = await getDuration(file);

      const newAudioFile: AudioFileState = {
        audioFile: file,
        duration,
        name: songName,
        artistName: artistName,
        trackNumber: i,
        albumPicture: albumPictureFile,
      };

      if (audioFiles.audio) {
        const updatedAudioFiles = [...audioFiles.audio];
        updatedAudioFiles[i - 1] = newAudioFile;
        setAudioFiles({ moduleId: 2, audio: updatedAudioFiles });
      }
    } else {
      console.error(
        'Please upload and fill in all details before uploading, (artist name, song name, album picture, and audio track)'
      );
    }
  };

  const handleAlbumPictureUpload = (i: number, picture: File) => {
    const url = URL.createObjectURL(picture);
    setAlbumPictureUrls((prev) => {
      const updatedUrls = [...prev];
      updatedUrls[i - 1] = url;
      console.log(updatedUrls);
      return updatedUrls;
    });
    setAlbumPictureFiles((prev) => {
      const updatedFiles = [...prev];
      updatedFiles[i - 1] = picture;
      return updatedFiles;
    });
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
                        src={albumPictureUrls[i - 1]}
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
                    onChange={(e) =>
                      handleAlbumPictureUpload(i, e.target.files[0])
                    }
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
                      {tapeInfoJSON ? (
                        <input
                          {...register(`artistName${i}`, {
                            required: required,
                          })}
                          type="text"
                          value={artistNames[i - 1]}
                          onChange={(e) => {
                            const newArtistNames = [...artistNames];
                            newArtistNames[i - 1] = e.target.value;
                            setArtistNames(newArtistNames);
                          }}
                          style={{
                            color: 'var(--artape-black)',
                            background: 'transparent',
                            border: 'none',
                          }}
                        />
                      ) : (
                        <input
                          {...register(`artistName${i}`, {
                            required: required,
                          })}
                          type="text"
                          placeholder="Artist Name"
                          style={{
                            color: 'var(--artape-black)',
                            background: 'transparent',
                            border: 'none',
                          }}
                        />
                      )}
                    </p>
                    <h2>
                      {tapeInfoJSON ? (
                        <input
                          {...register(`songName${i}`, { required: required })}
                          type="text"
                          value={songNames[i - 1]}
                          onChange={(e) => {
                            const newSongNames = [...songNames];
                            newSongNames[i - 1] = e.target.value;
                            setSongNames(newSongNames);
                          }}
                          style={{
                            fontSize: '20px',
                            background: 'transparent',
                            color: 'var(--artape-black)',
                            border: 'none',
                          }}
                        />
                      ) : (
                        <input
                          {...register(`songName${i}`, { required: required })}
                          type="text"
                          placeholder="Song Name"
                          style={{
                            fontSize: '20px',
                            background: 'transparent',
                            color: 'var(--artape-black)',
                            border: 'none',
                          }}
                        />
                      )}
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
                    handleAudioUpload(i, e.target.files[0]);
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

// Pass down Error
// Make Required
