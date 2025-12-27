import React from 'react';
import ArtistSearch from '../components/search/artist';
import ArtistCard from '../components/cards/ArtistCard';

export default function ArtistsPage() {
  return (
    <main
      style={{
        display: "flex",
        justifyContent: "center",
        width: "100%",
        padding: "0 128px",
        flexDirection: "column",
        alignItems: "center",
        gap: "36px"
      }}
    >
      <div 
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "var(--Spacings-Gaps-48px, 48px)",
          alignSelf: "stretch"
        }}>
          <div
            style={{
              display: "flex",
              width: "60%",
              flexDirection: "column",
              alignItems: "center",
              gap: "var(--Spacings-Gaps-12px, 12px)"
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px"
              }}
            >
              <h1
                style={{
                  color: "var(--Colors-Text-Primary, #051411)",
                  fontFamily: "Inter",
                  fontSize: "42px",
                  fontStyle: "normal",
                  fontWeight: "800",
                  lineHeight: "normal",
                  textAlign: "center"
                }}
              >
                MusiDoku
              </h1>
              <h1
                style={{
                  background: "linear-gradient(92deg, var(--Colors-Accent-Accent-1, #6D7FD9) 0.17%, var(--Colors-Primary-Primary-1, #3CC3BA) 100.17%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontFamily: "Inter",
                  fontSize: "42px",
                  fontStyle: "normal",
                  fontWeight: "600",
                  lineHeight: "normal",
                  textAlign: "center"
                }}
              >
                Artists Roster
              </h1>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "5px"
              }}
            >
              <p
                style={{
                  color: "var(--Colors-Text-Tertiary, #404B49)",
                  fontFamily: "Inter",
                  fontSize: "16px",
                  fontStyle: "normal",
                  fontWeight: "550",
                  lineHeight: "24px",
                  textAlign: "center"
                }}
              >
                All artists you can pick within the MusiDoku gameplay. Collect all the artists in the roster! New artists will be added to Artists Roster periodically.
              </p>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              width: "100%",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "12px"
            }}
          >
            <ArtistSearch />
          </div>
      </div>
      <div
        style={{
          display: "flex",
          width: "100%",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "var(--Spacings-Gaps-36px, 36px)"
        }}
      >
        <div
          style={{
            display: "grid",
            width: "100%",
            gridTemplateColumns: "repeat(6, minmax(0, 1fr))",
            gap: "24px"
          }}
        >
          <ArtistCard />
          <ArtistCard />
          <ArtistCard />
          <ArtistCard />
          <ArtistCard />
          <ArtistCard />
          <ArtistCard />
          <ArtistCard />
        </div>
      </div>
    </main>
  );
}
