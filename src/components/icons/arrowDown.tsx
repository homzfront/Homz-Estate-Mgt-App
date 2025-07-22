import React from "react";

interface ArrowDownProps {
  size?: number;
  color?: string;
  className?: string;
}

const ArrowDown: React.FC<ArrowDownProps> = ({
  size = 16,
  className = "#006AFF",
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.74707 10.6758C7.73459 10.6734 7.72237 10.6698 7.70996 10.667C7.72238 10.6698 7.73459 10.6734 7.74707 10.6758Z"
        fill="#292D32"
        stroke={className}
      />
      <path
        d="M4 6L8 10L12 6"
        stroke={className}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default ArrowDown;