import React from 'react';

type CheckProps = {
  color: string;
  width: number;
  height: number;
};

const PrevIcon: React.FC<CheckProps> = ({
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
    <path d="M201.75,30.52a20,20,0,0,0-20.3.53L68,102V40a12,12,0,0,0-24,0V216a12,12,0,0,0,24,0V154l113.45,71A20,20,0,0,0,212,208.12V47.88A19.86,19.86,0,0,0,201.75,30.52ZM188,200.73,71.7,128,188,55.27Z"></path>
  </svg>
);

export default PrevIcon;
