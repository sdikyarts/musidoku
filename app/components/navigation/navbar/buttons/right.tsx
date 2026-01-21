import React from "react";
import Button from "../../../button";

const RightNavbarButtons: React.FC = () => {
    return (
        <div style={{
            display: "inline-flex",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: "var(--Spacings-Gaps-16px, 16px)",
        }}>
            <Button href="/login" text="Log In" size="medium" />
        </div>
    );
};

export default RightNavbarButtons;