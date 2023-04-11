import React, { useState } from 'react';
import { Reorder } from 'framer-motion';
import AudioItem from './AudioItem';

interface AudioListProps {
  audioFiles: {
    audioFile: File;
    duration: number;
    name: string;
    artistName: string;
    trackNumber: number;
  }[];
  setAudioFiles: React.Dispatch<React.SetStateAction<any>>;
  renderFile: (audioFile: File, index: number) => React.ReactNode;
}

const AudioList: React.FC<AudioListProps> = ({
  audioFiles,
  setAudioFiles,
  renderFile,
}) => {
  const initialTrackInfo = audioFiles.reduce<Record<string, any>>(
    (acc, audioFile) => {
      acc[audioFile.name] = {
        name: '',
        artistName: '',
      };
      return acc;
    },
    {}
  );

  const [trackInfo, setTrackInfo] =
    useState<Record<string, any>>(initialTrackInfo);

  return (
    <Reorder.Group
      axis="y"
      values={audioFiles}
      onReorder={setAudioFiles}
      as="ol"
    >
      {audioFiles.map((audioFile, index) => (
        <AudioItem
          key={audioFile.name}
          audioFile={audioFile}
          renderFile={renderFile}
          index={index}
          trackInfo={trackInfo}
          setTrackInfo={setTrackInfo}
        />
      ))}
    </Reorder.Group>
  );
};

export default AudioList;
