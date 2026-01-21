import React from "react";
import Link from "next/link";

const Logo: React.FC = () => {
    return (
        <Link href="/" aria-label="Home">
            <span
                style={{
                    color: "#051411",
                    fontFamily: "Inter",
                    fontSize: 27,
                    fontStyle: "normal",
                    fontWeight: 800,
                    lineHeight: "normal",
                    letterSpacing: "normal",
                    textAlign: "center",
                }}
            >
                Musidoku
            </span>
        </Link>
    );
}

export default Logo;
