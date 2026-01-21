import React from "react";
import Logo from "../../../logo";
import LeftNavbarButtonsMenu from "./left/leftbuttons";

const LeftNavbarButtons: React.FC = () => {
    return (
        <div style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--Spacings-Gaps-18px, 18px)"
        }}>
            <Logo />
            <LeftNavbarButtonsMenu />
        </div>
    );
};

export default LeftNavbarButtons;