import React from 'react';
import { Reorder, useDragControls } from 'framer-motion';
import AudioItem from './AudioItem';

interface AudioListProps {
  audioFiles: File[];
  setAudioFiles: React.Dispatch<React.SetStateAction<File[]>>;
  renderFile: (file: File, index: number) => React.ReactNode;
}

const AudioList: React.FC<AudioListProps> = ({
  audioFiles,
  setAudioFiles,
  renderFile,
}) => {
  return (
    <Reorder.Group
      axis="y"
      values={audioFiles}
      onReorder={setAudioFiles}
      as="ol"
    >
      {audioFiles.map((file, index) => (
        <AudioItem
          key={file.name}
          file={file}
          renderFile={renderFile}
          index={index}
        />
      ))}
    </Reorder.Group>
  );
};

export default AudioList;
