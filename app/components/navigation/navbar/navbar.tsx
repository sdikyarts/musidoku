'use client';

import React, { useEffect, useState } from "react";
import LeftNavbarButtons from "./buttons/left";
import RightNavbarButtons from "./buttons/right";
import { calculateNavbarHorizontalPadding } from "@/lib/layout/padding";

const Navbar: React.FC = () => {
    const [padding, setPadding] = useState(96);

    useEffect(() => {
        const updatePadding = () => {
            const newPadding = calculateNavbarHorizontalPadding();
            setPadding(newPadding);
        };

        updatePadding();
        window.addEventListener('resize', updatePadding);
        return () => window.removeEventListener('resize', updatePadding);
    }, []);

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
            padding: `17px ${padding}px`,
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
