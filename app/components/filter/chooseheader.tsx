'use client';

import React from "react";

type Props = {
    choose?: string;
};

export default function ChooseHeader({ choose }: Readonly<Props>) {
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "4px",
                color: "#6D7FD9",
                fontFamily: "Inter",
                fontSize: "13px",
                fontStyle: "normal",
                fontWeight: 550,
                lineHeight: "normal",
                textTransform: "uppercase",
            }}
        >
            <p>Choose</p>
            <p
                style={{
                    display: "flex",
                    width: "100%"
                }}
            >
                {choose}
            </p>
        </div>
    );
}