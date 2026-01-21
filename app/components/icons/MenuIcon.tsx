import React from "react";

type MenuIconProps = {
  color?: string;
  size?: number;
};

const MenuIcon: React.FC<MenuIconProps> = ({ color = "#6D7FD9", size = 24 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 12H21M3 6H21M3 18H21"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default MenuIcon;
