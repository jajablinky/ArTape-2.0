import { Reorder, useDragControls } from 'framer-motion';
import React from 'react';
import ReorderIcon from './dragIcon';

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
  trackInfo,
  setTrackInfo,
}) => {
  const dragControls = useDragControls();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    const newTrackInfo = {
      ...trackInfo,
      [audioFile.name]: {
        ...trackInfo[audioFile.name],
        [field]: e.target.value,
      },
    };
    setTrackInfo(newTrackInfo);
  };

  return (
    <Reorder.Item
      key={audioFile.name}
      value={audioFile}
      dragListener={false}
      dragControls={dragControls}
    >
      <input
        type="text"
        placeholder="Track Name"
        value={
          trackInfo && trackInfo[audioFile.name]
            ? trackInfo[audioFile.name].trackName || ''
            : ''
        }
        onChange={(e) => handleInputChange(e, 'trackName')}
      />
      <input
        type="text"
        placeholder="Artist Name"
        value={
          trackInfo && trackInfo[audioFile.name]
            ? trackInfo[audioFile.name].artistName || ''
            : ''
        }
        onChange={(e) => handleInputChange(e, 'artistName')}
      />
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {renderFile(audioFile, index)}
        <ReorderIcon dragControls={dragControls} />
      </div>
    </Reorder.Item>
  );
};

export default AudioItem;
