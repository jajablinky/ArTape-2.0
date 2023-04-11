import React from 'react';

interface DraggableItemProps {
  audioFile: {
    audioFile: File;
    duration: number;
    name: string;
    artistName: string;
    trackNumber: number;
  };
  renderFile: (
    audioFile: {
      audioFile: File;
      duration: number;
      name: string;
      artistName: string;
      trackNumber: number;
    },
    index: number
  ) => React.ReactNode;
  index: number;
  trackInfo: Record<string, any>;
  setTrackInfo: React.Dispatch<
    React.SetStateAction<Record<string, any>>
  >;
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
