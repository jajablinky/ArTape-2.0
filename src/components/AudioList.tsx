import React, { Dispatch, SetStateAction } from 'react';
import AudioItem from './AudioItem';
import { AudioFileState } from '../pages/create';

interface AudioListProps {
  audioFiles: AudioFileState[];
  setAudioFiles: Dispatch<SetStateAction<AudioFileState[] | null>>;
  renderFile: (
    file: AudioFileState,
    index: number
  ) => JSX.Element | null | undefined;
}

const AudioList: React.FC<AudioListProps> = ({
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
          renderFile={() => renderFile(audioFile, index)}
          index={index}
        />
      ))}
    </div>
  );
};

export default AudioList;
