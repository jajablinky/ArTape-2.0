import React from 'react';

type MinimalMementoProps = {
  color: string;
};

const MinimalMemento: React.FC<MinimalMementoProps> = ({ color }) => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_32_192)">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M35.0807 11.51C30.3158 3.25714 19.7629 0.42949 11.51 5.19431C3.25714 9.95909 0.429491 20.512 5.19431 28.7649C9.95909 37.0178 20.512 39.8453 28.7649 35.0807C37.0178 30.3158 39.8453 19.7629 35.0807 11.51ZM37.1184 10.3336C31.7038 0.955276 19.7118 -2.25796 10.3336 3.15659C0.955274 8.57113 -2.25796 20.5631 3.15659 29.9414C8.57113 39.3197 20.5631 42.5328 29.9414 37.1184C39.3197 31.7038 42.5328 19.7118 37.1184 10.3336Z"
        fill={color}
      />
    </g>
    <defs>
      <clipPath id="clip0_32_192">
        <rect
          width="40"
          height="40"
          fill={color}
          transform="translate(0.137451 0.137451)"
        />
      </clipPath>
    </defs>
  </svg>
);

export default MinimalMemento;
