import React from 'react';
import { Reorder } from 'framer-motion';
import AudioItem from './AudioItem';

interface Audio {
  audioFile: File;
  duration: number;
  name: string;
  artistName: string;
  trackNumber: number;
}

interface AudioListPropsInterface {
  audioFiles: Audio[];
  setAudioFiles: React.Dispatch<React.SetStateAction<Audio[]>>;
  renderFile: (audioFile: File, index: number) => React.ReactNode;
}

const AudioList: React.FC<AudioListPropsInterface> = ({
  audioFiles,
  setAudioFiles,
  renderFile,
}) => {
  return (
    <div>
      {audioFiles.map((audioFile, index: number) => (
        <AudioItem
          key={index}
          audioFile={audioFile}
          renderFile={(audioFile: File) =>
            renderFile(audioFile, index)
          }
          index={index}
        />
      ))}
    </div>
  );
};

export default AudioList;
