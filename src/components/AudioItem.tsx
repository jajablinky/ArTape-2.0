import React from 'react';
import { AudioFileState } from '@/pages/create';

interface DraggableItemProps {
  audioFile: AudioFileState;
  renderFile: (
    audioFile: AudioFileState,
    index: number
  ) => React.ReactNode;
  index: number;
}

const AudioItem: React.FC<DraggableItemProps> = ({
  audioFile,
  renderFile,
  index,
}) => {
  return (
    <div key={index}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {renderFile(audioFile, index)}
      </div>
    </div>
  );
};

export default AudioItem;
