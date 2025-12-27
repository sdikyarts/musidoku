import React from "react";
import LeftNavbarButtons from "./buttons/left";
import RightNavbarButtons from "./buttons/right";

const Navbar: React.FC = () => {
    return (
        <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 100,
            display: "flex",
            width: "100%",
            height: "64px",
            overflow: "hidden",
            padding: "17px 96px",
            background: "var(--Colors-Background-Background, #F3FDFB)",
            justifyContent: "space-between",
            alignItems: "center",
            boxSizing: "border-box"
        }}>
            <LeftNavbarButtons />
            <RightNavbarButtons />
        </div>
    );
};

export default Navbar;
