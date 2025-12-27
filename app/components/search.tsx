import React from "react";
import SearchIcon from "./icons/SearchIcon";

export default function Search() {
    return (
        <div
            style={{
                display: "flex",
                width: "100%",
                height: "44px",
                minWidth: "360px",
                padding: "10px 16px",
                borderRadius: "6px",
                background: "var(--Colors-Search-Bar-Fill, #C2D4ED)",
                alignItems: "center",
                gap: "var(--Spacings-Gaps-8px, 8px)"
            }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--Spacings-Gaps-8px, 8px)"
                }}
            >
                <SearchIcon color="var(--Colors-Search-Bar-Placeholder, #6D7FD9)" />
                <p
                    style={{
                        color: "var(--Colors-Search-Bar-Placeholder, #6D7FD9)",
                        fontFamily: "Inter",
                        fontSize: "16px",
                        fontStyle: "normal",
                        fontWeight: "500",
                        lineHeight: "normal"
                    }}
                >
                    Search
                </p>
            </div>
        </div>
    );
};
