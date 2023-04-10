import { Reorder, useDragControls } from 'framer-motion';
import React from 'react';
import ReorderIcon from './dragIcon';

interface DraggableItemProps {
  file: File;
  renderFile: (file: File, index: number) => React.ReactNode;
  index: number;
}

const AudioItem: React.FC<DraggableItemProps> = ({
  file,
  renderFile,
  index,
}) => {
  const dragControls = useDragControls();

  return (
    <Reorder.Item
      key={file.name}
      value={file}
      dragListener={false}
      dragControls={dragControls}
      style={{ display: 'flex', alignItems: 'center' }}
    >
      {renderFile(file, index)}
      <ReorderIcon dragControls={dragControls} />
    </Reorder.Item>
  );
};

export default AudioItem;
