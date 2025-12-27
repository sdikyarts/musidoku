import React from "react";
import Button from "../../../../button";

const LeftNavbarButtonsMenu: React.FC = () => {
    return (
        <div style={{
            display: "flex",
            alignItems: "flex-start"
        }}>
            <Button href="/artists" text="Artists Roster" size="medium" variant="ghost" />
            <Button href="/about" text="How To Play?" size="medium" variant="ghost" />
        </div>
    );
};

export default LeftNavbarButtonsMenu;