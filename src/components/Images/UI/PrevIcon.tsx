import React from 'react';

type CheckProps = {
  color: string;
  width: number;
  height: number;
};

const PrevIcon: React.FC<CheckProps> = ({
  color = '#000000',
  width = 19,
  height = 22,
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 19 22"
    fill={color}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1.19508 0.5C1.43378 0.5 1.6627 0.592187 1.83148 0.756282C2.00026 0.920376 2.09508 1.14294 2.09508 1.375V8.94703L15.5467 0.767969C15.8176 0.602635 16.129 0.510706 16.4488 0.501699C16.7685 0.492692 17.0849 0.566935 17.3652 0.716741C17.6454 0.866546 17.8795 1.08647 18.043 1.35374C18.2065 1.62101 18.2935 1.92591 18.2951 2.23688V19.7631C18.2917 20.0734 18.2036 20.3772 18.0397 20.6434C17.8758 20.9097 17.642 21.1288 17.3623 21.2782C17.0826 21.4277 16.7671 21.5022 16.4481 21.4941C16.129 21.486 15.818 21.3955 15.5467 21.232L2.09508 13.053V20.625C2.09508 20.8571 2.00026 21.0796 1.83148 21.2437C1.6627 21.4078 1.43378 21.5 1.19508 21.5C0.956387 21.5 0.727468 21.4078 0.558685 21.2437C0.389902 21.0796 0.295082 20.8571 0.295082 20.625V1.375C0.295082 1.14294 0.389902 0.920376 0.558685 0.756282C0.727468 0.592187 0.956387 0.5 1.19508 0.5ZM16.4951 19.7423V2.25547L2.11308 11.0055L16.4951 19.7423Z"
      fill="#221616"
    />
    <path
      d="M16.4951 19.7423V2.25547L2.11308 11.0055L16.4951 19.7423Z"
      fill="#221616"
    />
  </svg>
);

export default PrevIcon;
