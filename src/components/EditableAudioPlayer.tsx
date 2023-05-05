import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import styles from '@/styles/Home.module.css';
import Image from 'next/image';
import Loader from './Loader';
import UploadButton from './Images/UI/UploadButton';
import CheckIcon from './Images/UI/CheckIcon';

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
  audioFiles: AudioFile[];
  albumPictures: AlbumPictureFile;
  profilePicUrl: string;
}

function formatToMinutes(duration: number): string {
  const minutes: number = Math.floor(duration / 60);
  const seconds: number = Math.round(duration % 60);
  const durationFormatted: string = `${minutes}:${seconds
    .toString()
    .padStart(2, '0')}`;
  return durationFormatted;
}

function totalTapeLength(tapeInfo: TapeInfo): string {
  let totalDuration = 0;

  for (const track of tapeInfo.audioFiles) {
    totalDuration += track.duration;
  }

  return formatToMinutes(totalDuration);
}

const EditableAudioPlayer: React.FC<AudioPlayerProps> = ({
  audioFiles,
  profilePicUrl,
  register,
  watch,
}) => {
  const [isAudioUploaded, setIsAudioUploaded] = useState(false);
  const [isAlbumPictureUrl, setIsAlbumPictureUrl] = useState(false);

  const inputRef = useRef(null);
  const handleUploadButtonClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const albumPictureFile = watch('albumPicture-1');

  /* Audio Player Logic */
  return (
    <>
      <motion.div
        className={styles.musicPlayerContainer}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={styles.musicPlayerHeader}
          style={{
            backgroundImage: `url(${profilePicUrl})`,
            position: 'sticky',
            top: '0',
            height: '80px',
            objectFit: 'cover',
          }}
        >
          <audio />
        </div>

        <div className={styles.trackContainer}>
          <div
            className={styles.musicPlayerTrack}
            style={{ width: 'auto' }}
          >
            <div className={styles.musicPlayerLeftSide}>
              <div
                className={styles.songArt}
                style={{
                  position: 'relative',
                  border: '1px solid #ffffff',
                  objectFit: 'cover',
                  cursor: 'pointer',
                }}
              >
                <label
                  htmlFor={`albumPicture-1`}
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
                  {isAlbumPictureUrl ? (
                    <Image
                      src={isAlbumPictureUrl}
                      alt={`albumPicture-1`}
                      width={350}
                      height={350}
                      style={{
                        borderRadius: '12px',
                        objectFit: 'cover',
                        cursor: 'pointer',
                      }}
                    />
                  ) : (
                    <UploadButton color={'#ffffff'} />
                  )}
                  <input
                    {...register('albumPicture-1', {
                      required: true,
                    })}
                    id={'albumPicture-1'}
                    type="file"
                    name="profilePic"
                    accept="image/*"
                    style={{ display: 'none', width: '100%' }}
                  />
                </label>
              </div>
              <div className={styles.musicInfo}>
                <div className={styles.artistTitleTrack}>
                  <p>
                    {' '}
                    <input
                      {...register('ArtistName1', {
                        required: true,
                      })}
                      type="text"
                      placeholder="Artist Name"
                      style={{
                        color: 'var(--artape-black)',

                        background: 'transparent',
                        border: 'none',
                      }}
                    />
                  </p>
                  <h2>
                    <input
                      {...register('songName1', {
                        required: true,
                      })}
                      type="text"
                      placeholder="Song Name"
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
                {...register('audioFile-1', { required: true })}
                ref={inputRef}
                id="audioFile-1"
                type="file"
                name="audioFile-1"
                accept="audio/*"
                onChange={(e) =>
                  setIsAudioUploaded(e.target.files.length > 0)
                }
                style={{ display: 'none', width: '100%' }}
              />
              {isAudioUploaded ? (
                <button
                  onClick={handleUploadButtonClick}
                  style={{
                    background: 'transparent',
                    border: '1px solid var(--artape-white)',
                  }}
                >
                  <CheckIcon color={'#7ae166'} />
                </button>
              ) : (
                <button
                  onClick={handleUploadButtonClick}
                  style={{
                    background: 'transparent',
                    border: '1px solid var(--artape-white)',
                  }}
                >
                  Upload
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default EditableAudioPlayer;
