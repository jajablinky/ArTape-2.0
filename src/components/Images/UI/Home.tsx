import React from 'react';

type CheckProps = {
  color: string;
};

const Home: React.FC<CheckProps> = ({ color }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill={color}
    viewBox="0 0 256 256"
  >
    <path d="M240,208H224V115.55a16,16,0,0,0-5.17-11.78l-80-75.48a1.14,1.14,0,0,1-.11-.11,16,16,0,0,0-21.53,0l-.11.11L37.17,103.77A16,16,0,0,0,32,115.55V208H16a8,8,0,0,0,0,16H240a8,8,0,0,0,0-16ZM48,115.55l.11-.1L128,40l79.9,75.43.11.1V208H160V160a16,16,0,0,0-16-16H112a16,16,0,0,0-16,16v48H48ZM144,208H112V160h32Z"></path>
  </svg>
);

export default Home;
