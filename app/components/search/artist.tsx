import React from 'react';
import Search from '../search';

export default function ArtistSearch() {
    return (
        <div
            style={{
                display: "flex",
                width: "100%",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "8px"
            }}
        >
            <Search />
        </div>
    );
};