import React from "react";

type ChevronLeftIconProps = {
  size?: number;
  className?: string;
  color?: string;
};

const ChevronLeftIcon: React.FC<ChevronLeftIconProps> = ({
    size = 24,
    className,
    color = "currentColor",
}) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M9.02499 12C9.02499 11.8667 9.04566 11.7417 9.08699 11.625C9.12832 11.5083 9.19932 11.4 9.29999 11.3L13.9 6.7C14.0833 6.51667 14.3167 6.425 14.6 6.425C14.8833 6.425 15.1167 6.51667 15.3 6.7C15.4833 6.88333 15.575 7.11667 15.575 7.4C15.575 7.68333 15.4833 7.91667 15.3 8.1L11.4 12L15.3 15.9C15.4833 16.0833 15.575 16.3167 15.575 16.6C15.575 16.8833 15.4833 17.1167 15.3 17.3C15.1167 17.4833 14.8833 17.575 14.6 17.575C14.3167 17.575 14.0833 17.4833 13.9 17.3L9.29999 12.7C9.19999 12.6 9.12899 12.4917 9.08699 12.375C9.04499 12.2583 9.02432 12.1333 9.02499 12Z" fill={color}/>
    </svg>
  );
};

export default React.memo(ChevronLeftIcon);
