import React from 'react';

type PineappleProps = {
  color: string;
};

const PineappleMemento: React.FC<PineappleProps> = ({ color }) => (
  <svg
    width="44"
    height="44"
    viewBox="0 0 54 54"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clip-path="url(#clip0_32_193)">
      <path
        d="M23.3826 24.2948L19.2968 17.0978L19.2503 17.1247L16.5688 12.5014C12.7656 15.1849 10.1248 19.4059 9.55076 24.2601L23.3826 24.2948Z"
        fill={color}
      />
      <path
        d="M29.9153 28.0579L36.4791 39.6199C40.0171 36.9094 42.4474 32.8254 42.9735 28.1647L29.9153 28.0579Z"
        fill={color}
      />
      <path
        d="M42.973 24.344C42.4251 19.5036 39.8233 15.2858 36.06 12.5831C35.5422 14.2641 34.5083 16.549 33.1191 18.9556L30.0274 24.3115L42.973 24.344Z"
        fill={color}
      />
      <path
        d="M26.257 9.43348C24.0534 9.43348 21.9488 9.85714 20.0201 10.6275L26.7108 22.4131L29.8062 17.0508C31.2132 14.6134 32.6947 12.5533 33.9006 11.2661C31.6071 10.0944 29.0092 9.43348 26.257 9.43348Z"
        fill={color}
      />
      <path
        d="M9.54092 28.1688C10.0872 32.9986 12.6786 37.2087 16.4284 39.9124L19.062 35.347L19.1991 35.4261L23.4827 28.0053L14.7864 27.9341L14.7864 28.1688L9.54092 28.1688Z"
        fill={color}
      />
      <path
        d="M26.257 43.0805C28.7322 43.0805 31.0825 42.546 33.1988 41.5861L26.682 30.1068L19.9083 41.8413C21.8673 42.6402 24.0108 43.0805 26.257 43.0805Z"
        fill={color}
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M36.1276 9.8813L36.178 9.91183C36.1675 9.90434 36.1566 9.89738 36.1455 9.89094C36.1396 9.88757 36.1337 9.88436 36.1276 9.8813Z"
        fill={color}
      />
    </g>
    <defs>
      <clipPath id="clip0_32_193">
        <rect
          width="39"
          height="39"
          fill={color}
          transform="translate(19.5) rotate(30)"
        />
      </clipPath>
    </defs>
  </svg>
);

export default PineappleMemento;
