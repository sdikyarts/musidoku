'use client';

import { useState } from "react";
import { 
    formatGenre, 
    formatType, 
    formatGender, 
    getCountryDisplay, 
    getLifeStatusLabel, 
    getGroupStatusLabel 
} from "@/lib/artists/formatters";

type Artist = {
  scraper_name: string;
  scraper_image_url: string | null;
  parsed_artist_type: string;
  gender: string;
  country: string;
  birth_date: string | null;
  death_date: string | null;
  disband_date: string | null;
  debut_year: number | null;
  member_count: number | null;
  primary_genre: string;
  secondary_genre: string | null;
  is_dead: boolean | null;
  is_disbanded: boolean | null;
};

const infoLabelStyle = {
    width: "fit-content",
    color: "var(--Colors-Text-Primary, #051411)",
    fontFamily: "Inter",
    fontSize: "24px",
    fontStyle: "normal" as const,
    fontWeight: "700",
    lineHeight: "normal",
    margin: 0,
};

export default function ArtistPageClient({ artist }: Readonly<{ artist: Artist }>) {
    const [countryDisplay] = useState(() => getCountryDisplay(artist.country));
    
    const isGroup = artist.parsed_artist_type === 'group';
    const isSolo = artist.parsed_artist_type === 'solo';
    const isAlive = artist.is_dead === false;
    const isExisting = artist.is_disbanded === false;

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                backgroundColor: "var(--Colors-Background-Secondary, #F3FDFB)",
            }}
        >
            <div
                style={{
                    display: 'flex',
                    gap: '24px',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    maxWidth: '1600px',
                    padding: '20px',
                }}
            >
                <div
                    style={{
                        borderRadius: '8px',
                        background: artist.scraper_image_url 
                            ? `url(${artist.scraper_image_url}) center / cover no-repeat` 
                            : 'lightgray',
                        width: '700px',
                        height: '700px',
                        flexShrink: 0,
                    }}
                />
                <div
                    style={{
                        borderRadius: '8px',
                        width: '700px',
                        alignItems: "flex-start",
                        justifyContent: "center",
                        display: 'flex',
                        flexDirection: 'column',
                        paddingLeft: '24px',
                        gap: '12px',
                        flexShrink: 0,
                    }}
                >
                    <h1
                        style={{
                            color: "var(--Colors-Text-Primary, #051411)",
                            fontFamily: "Inter",
                            fontSize: "64px",
                            fontStyle: "normal",
                            fontWeight: "800",
                            textAlign: "left",
                            margin: 0,
                            wordWrap: "break-word",
                            overflowWrap: "break-word",
                            width: "100%",
                        }}
                    >
                        {artist.scraper_name}
                    </h1>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: "flex-start",
                            gap: '12px',
                            width: '100%',
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "flex-start", gap: '8px' }}>
                            <p style={infoLabelStyle}>Artist Type:</p>
                            <p style={infoLabelStyle}>{formatType(artist.parsed_artist_type)}</p>
                        </div>
                        
                        <div style={{ display: "flex", alignItems: "flex-start", gap: '8px' }}>
                            <p style={infoLabelStyle}>Gender:</p>
                            <p style={infoLabelStyle}>{formatGender(artist.gender)}</p>
                        </div>
                        
                        <div style={{ display: "flex", alignItems: "flex-start", gap: '8px' }}>
                            <p style={infoLabelStyle}>Country:</p>
                            <p style={infoLabelStyle}>{countryDisplay}</p>
                        </div>
                        
                        {!isGroup && (
                            <div style={{ display: "flex", alignItems: "flex-start", gap: '8px' }}>
                                <p style={infoLabelStyle}>Birth Date:</p>
                                <p style={infoLabelStyle}>{artist.birth_date ?? "-"}</p>
                            </div>
                        )}
                        
                        {!isGroup && !isAlive && (
                            <div style={{ display: "flex", alignItems: "flex-start", gap: '8px' }}>
                                <p style={infoLabelStyle}>Death Date:</p>
                                <p style={infoLabelStyle}>{artist.death_date ?? "-"}</p>
                            </div>
                        )}
                        
                        <div style={{ display: "flex", alignItems: "flex-start", gap: '8px' }}>
                            <p style={infoLabelStyle}>Debut Year:</p>
                            <p style={infoLabelStyle}>{artist.debut_year ?? "-"}</p>
                        </div>
                        
                        {!isSolo && !isExisting && (
                            <div style={{ display: "flex", alignItems: "flex-start", gap: '8px' }}>
                                <p style={infoLabelStyle}>Disband Year:</p>
                                <p style={infoLabelStyle}>{artist.disband_date ?? "-"}</p>
                            </div>
                        )}
                        
                        <div style={{ display: "flex", alignItems: "flex-start", gap: '8px' }}>
                            <p style={infoLabelStyle}>Member Count:</p>
                            <p style={infoLabelStyle}>{artist.member_count ?? "-"}</p>
                        </div>
                        
                        <div style={{ display: "flex", alignItems: "flex-start", gap: '8px' }}>
                            <p style={infoLabelStyle}>Genre:</p>
                            <div style={{ display: "flex", alignItems: "flex-start", gap: '0px' }}>
                                <p style={infoLabelStyle}>{formatGenre(artist.primary_genre)}</p>
                                {artist.secondary_genre && (
                                    <>
                                        <p style={{ ...infoLabelStyle, paddingRight: "6px" }}>{","}</p>
                                        <p style={infoLabelStyle}>{formatGenre(artist.secondary_genre)}</p>
                                    </>
                                )}
                            </div>
                        </div>
                        
                        {!isGroup && (
                            <div style={{ display: "flex", alignItems: "flex-start", gap: '8px' }}>
                                <p style={infoLabelStyle}>Life Status:</p>
                                <p style={infoLabelStyle}>{getLifeStatusLabel(artist.is_dead)}</p>
                            </div>
                        )}
                        
                        {!isSolo && (
                            <div style={{ display: "flex", alignItems: "flex-start", gap: '8px' }}>
                                <p style={infoLabelStyle}>Group Status:</p>
                                <p style={infoLabelStyle}>{getGroupStatusLabel(artist.is_disbanded)}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
