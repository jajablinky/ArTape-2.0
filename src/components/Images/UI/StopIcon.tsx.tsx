import React from 'react';

type CheckProps = {
  color: string;
  width: number;
  height: number;
};

const StopIcon: React.FC<CheckProps> = ({
  color = '#000000',
  width = 30,
  height = 30,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    fill={color}
    viewBox="0 0 256 256"
  >
    <path d="M200.73,36H55.27A19.3,19.3,0,0,0,36,55.27V200.73A19.3,19.3,0,0,0,55.27,220H200.73A19.3,19.3,0,0,0,220,200.73V55.27A19.3,19.3,0,0,0,200.73,36ZM196,196H60V60H196Z"></path>
  </svg>
);

export default StopIcon;
