import React from 'react';

type CheckProps = {
  color: string;
  width: number;
  height: number;
};

const PauseIcon: React.FC<CheckProps> = ({
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
    <path d="m10,10 v80 h20 v-80 m40,0 v80 h20 v-80 z"></path>
  </svg>
);

export default PauseIcon;