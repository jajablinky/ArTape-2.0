import React from 'react';

type CheckProps = {
  color: string;
  width: number;
  height: number;
};

const NextIcon: React.FC<CheckProps> = ({
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
    <path d="M200,28a12,12,0,0,0-12,12v62l-113.45-71A20,20,0,0,0,44,47.88V208.12A20,20,0,0,0,74.55,225L188,154v62a12,12,0,0,0,24,0V40A12,12,0,0,0,200,28ZM68,200.73V55.27L184.3,128Z"></path>
  </svg>
);

export default NextIcon;
