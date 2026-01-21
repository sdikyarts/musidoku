import React from "react";

type MusicNoteIconProps = {
  color?: string;
  size?: number;
};

const MusicNoteIcon: React.FC<MusicNoteIconProps> = ({
    color = "currentColor",
    size = 24,
}) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none">
            <path d="M10 21C8.9 21 7.95833 20.6083 7.175 19.825C6.39167 19.0417 6 18.1 6 17C6 15.9 6.39167 14.9583 7.175 14.175C7.95833 13.3917 8.9 13 10 13C10.3833 13 10.7377 13.046 11.063 13.138C11.3883 13.23 11.7007 13.3673 12 13.55V4C12 3.71667 12.096 3.47933 12.288 3.288C12.48 3.09667 12.7173 3.00067 13 3H17C17.2833 3 17.521 3.096 17.713 3.288C17.905 3.48 18.0007 3.71733 18 4V6C18 6.28333 17.904 6.521 17.712 6.713C17.52 6.905 17.2827 7.00067 17 7H14V17C14 18.1 13.6083 19.0417 12.825 19.825C12.0417 20.6083 11.1 21 10 21Z" fill={color}/>
        </svg>
    );
};

export default MusicNoteIcon;