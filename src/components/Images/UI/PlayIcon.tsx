import React from 'react';

type CheckProps = {
  color: string;
  width: number;
  height: number;
};

const PlayIcon: React.FC<CheckProps> = ({
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
    <path d="M234.49,111.07,90.41,22.94A20,20,0,0,0,60,39.87V216.13a20,20,0,0,0,30.41,16.93l144.08-88.13a19.82,19.82,0,0,0,0-33.86ZM84,208.85V47.15L216.16,128Z"></path>
  </svg>
);

export default PlayIcon;
