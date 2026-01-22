'use client';

import { useEffect, useState } from "react";
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

export default function ArtistPageClient({ artist }: Readonly<{ artist: Artist }>) {
    const [titleFontSize, setTitleFontSize] = useState("64px");
    const [countryDisplay] = useState(() => getCountryDisplay(artist.country));
    
    useEffect(() => {
        const getTitleFontSize = () => {
            const screenWidth = window.innerWidth;
            if (screenWidth >= 1280) return "64px";
            if (screenWidth >= 960) return "38px"; 
            if (screenWidth >= 777) return "34px";
            return "34px";
        };

        const handleResize = () => {
            setTitleFontSize(getTitleFontSize());
        };

        // Set initial value
        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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
                }}
            >
                <div
                    style={{
                        borderRadius: '8px',
                        background: artist.scraper_image_url 
                            ? `url(${artist.scraper_image_url}) center / cover no-repeat` 
                            : 'lightgray',
                        width: 'min(calc((100% - 24px) / 2), calc(100vh - 228px))',
                        aspectRatio: '1',
                    }}
                />
                <div
                    style={{
                        borderRadius: '8px',
                        width: 'min(calc((100% - 24px) / 2), calc(100vh - 228px))',
                        aspectRatio: '1',
                        alignItems: "flex-start",
                        justifyContent: "center",
                        display: 'flex',
                        flexDirection: 'column',
                        paddingLeft: '24px',
                        gap: '12px'
                    }}
                >
                    <h1
                        style={{
                            color: "var(--Colors-Text-Primary, #051411)",
                            fontFamily: "Inter",
                            fontSize: titleFontSize,
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
                        <div
                            style={{
                                display: "flex",
                                alignItems: "flex-start",
                                gap: '8px'
                            }}
                        >
                            <p
                                style={{
                                    width: "fit-content",
                                    color: "var(--Colors-Text-Primary, #051411)",
                                    fontFamily: "Inter",
                                    fontSize: "24px",
                                    fontStyle: "normal",
                                    fontWeight: "700",
                                    lineHeight: "normal",
                                    margin: 0,
                                }}
                            >
                                Artist Type:
                            </p>
                            <p
                                style={{
                                    width: "fit-content",
                                    color: "var(--Colors-Text-Primary, #051411)",
                                    fontFamily: "Inter",
                                    fontSize: "24px",
                                    fontStyle: "normal",
                                    fontWeight: "700",
                                    lineHeight: "normal",
                                    margin: 0,
                                }}
                            >
                                {formatType(artist.parsed_artist_type)}
                            </p>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "flex-start",
                                gap: '8px'
                            }}
                        >
                            <p
                                style={{
                                    width: "fit-content",
                                    color: "var(--Colors-Text-Primary, #051411)",
                                    fontFamily: "Inter",
                                    fontSize: "24px",
                                    fontStyle: "normal",
                                    fontWeight: "700",
                                    lineHeight: "normal",
                                    margin: 0,
                                }}
                            >
                                Gender:
                            </p>
                            <p
                                style={{
                                    width: "fit-content",
                                    color: "var(--Colors-Text-Primary, #051411)",
                                    fontFamily: "Inter",
                                    fontSize: "24px",
                                    fontStyle: "normal",
                                    fontWeight: "700",
                                    lineHeight: "normal",
                                    margin: 0,
                                }}
                            >
                                {formatGender(artist.gender)}
                            </p>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "flex-start",
                                gap: '8px'
                            }}
                        >
                            <p
                                style={{
                                    width: "fit-content",
                                    color: "var(--Colors-Text-Primary, #051411)",
                                    fontFamily: "Inter",
                                    fontSize: "24px",
                                    fontStyle: "normal",
                                    fontWeight: "700",
                                    lineHeight: "normal",
                                    margin: 0,
                                }}
                            >
                                Country:
                            </p>
                            <p
                                style={{
                                    width: "fit-content",
                                    color: "var(--Colors-Text-Primary, #051411)",
                                    fontFamily: "Inter",
                                    fontSize: "24px",
                                    fontStyle: "normal",
                                    fontWeight: "700",
                                    lineHeight: "normal",
                                    margin: 0,
                                }}
                            >
                                {countryDisplay}
                            </p>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "flex-start",
                                gap: '8px'
                            }}
                        >
                            <p
                                style={{
                                    width: "fit-content",
                                    color: "var(--Colors-Text-Primary, #051411)",
                                    fontFamily: "Inter",
                                    fontSize: "24px",
                                    fontStyle: "normal",
                                    fontWeight: "700",
                                    lineHeight: "normal",
                                    margin: 0,
                                }}
                            >
                                Birth Date:
                            </p>
                            <p
                                style={{
                                    width: "fit-content",
                                    color: "var(--Colors-Text-Primary, #051411)",
                                    fontFamily: "Inter",
                                    fontSize: "24px",
                                    fontStyle: "normal",
                                    fontWeight: "700",
                                    lineHeight: "normal",
                                    margin: 0,
                                }}
                            >
                                {artist.birth_date ?? "-"}
                            </p>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "flex-start",
                                gap: '8px'
                            }}
                        >
                            <p
                                style={{
                                    width: "fit-content",
                                    color: "var(--Colors-Text-Primary, #051411)",
                                    fontFamily: "Inter",
                                    fontSize: "24px",
                                    fontStyle: "normal",
                                    fontWeight: "700",
                                    lineHeight: "normal",
                                    margin: 0,
                                }}
                            >
                                Death Date:
                            </p>
                            <p
                                style={{
                                    width: "fit-content",
                                    color: "var(--Colors-Text-Primary, #051411)",
                                    fontFamily: "Inter",
                                    fontSize: "24px",
                                    fontStyle: "normal",
                                    fontWeight: "700",
                                    lineHeight: "normal",
                                    margin: 0,
                                }}
                            >
                                {artist.death_date ?? "-"}
                            </p>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "flex-start",
                                gap: '8px'
                            }}
                        >
                            <p
                                style={{
                                    width: "fit-content",
                                    color: "var(--Colors-Text-Primary, #051411)",
                                    fontFamily: "Inter",
                                    fontSize: "24px",
                                    fontStyle: "normal",
                                    fontWeight: "700",
                                    lineHeight: "normal",
                                    margin: 0,
                                }}
                            >
                                Debut Year:
                            </p>
                            <p
                                style={{
                                    width: "fit-content",
                                    color: "var(--Colors-Text-Primary, #051411)",
                                    fontFamily: "Inter",
                                    fontSize: "24px",
                                    fontStyle: "normal",
                                    fontWeight: "700",
                                    lineHeight: "normal",
                                    margin: 0,
                                }}
                            >
                                {artist.debut_year ?? "-"}
                            </p>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "flex-start",
                                gap: '8px'
                            }}
                        >
                            <p
                                style={{
                                    width: "fit-content",
                                    color: "var(--Colors-Text-Primary, #051411)",
                                    fontFamily: "Inter",
                                    fontSize: "24px",
                                    fontStyle: "normal",
                                    fontWeight: "700",
                                    lineHeight: "normal",
                                    margin: 0,
                                }}
                            >
                                Disband Year:
                            </p>
                            <p
                                style={{
                                    width: "fit-content",
                                    color: "var(--Colors-Text-Primary, #051411)",
                                    fontFamily: "Inter",
                                    fontSize: "24px",
                                    fontStyle: "normal",
                                    fontWeight: "700",
                                    lineHeight: "normal",
                                    margin: 0,
                                }}
                            >
                                {artist.disband_date ?? "-"}
                            </p>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "flex-start",
                                gap: '8px'
                            }}
                        >
                            <p
                                style={{
                                    width: "fit-content",
                                    color: "var(--Colors-Text-Primary, #051411)",
                                    fontFamily: "Inter",
                                    fontSize: "24px",
                                    fontStyle: "normal",
                                    fontWeight: "700",
                                    lineHeight: "normal",
                                    margin: 0,
                                }}
                            >
                                Member Count:
                            </p>
                            <p
                                style={{
                                    width: "fit-content",
                                    color: "var(--Colors-Text-Primary, #051411)",
                                    fontFamily: "Inter",
                                    fontSize: "24px",
                                    fontStyle: "normal",
                                    fontWeight: "700",
                                    lineHeight: "normal",
                                    margin: 0,
                                }}
                            >
                                {artist.member_count ?? "-"}
                            </p>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "flex-start",
                                gap: '8px'
                            }}
                        >
                            <p
                                style={{
                                    width: "fit-content",
                                    color: "var(--Colors-Text-Primary, #051411)",
                                    fontFamily: "Inter",
                                    fontSize: "24px",
                                    fontStyle: "normal",
                                    fontWeight: "700",
                                    lineHeight: "normal",
                                    margin: 0,
                                }}
                            >
                                Genre:
                            </p>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "flex-start",
                                    gap: '0px'
                                }}
                            >
                                <p
                                    style={{
                                        width: "fit-content",
                                        color: "var(--Colors-Text-Primary, #051411)",
                                        fontFamily: "Inter",
                                        fontSize: "24px",
                                        fontStyle: "normal",
                                        fontWeight: "700",
                                        lineHeight: "normal",
                                        margin: 0,
                                    }}
                                >
                                    {formatGenre(artist.primary_genre)}
                                </p>
                                {artist.secondary_genre && (
                                    <>
                                        <p
                                            style={{
                                                width: "fit-content",
                                                color: "var(--Colors-Text-Primary, #051411)",
                                                fontFamily: "Inter",
                                                fontSize: "24px",
                                                fontStyle: "normal",
                                                fontWeight: "700",
                                                lineHeight: "normal",
                                                margin: 0,
                                                paddingRight: "6px"
                                            }}
                                        >
                                            {","}
                                        </p>
                                        <p
                                            style={{
                                                width: "fit-content",
                                                color: "var(--Colors-Text-Primary, #051411)",
                                                fontFamily: "Inter",
                                                fontSize: "24px",
                                                fontStyle: "normal",
                                                fontWeight: "700",
                                                lineHeight: "normal",
                                                margin: 0,
                                            }}
                                        >
                                            {formatGenre(artist.secondary_genre)}
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "flex-start",
                                gap: '8px'
                            }}
                        >
                            <p
                                style={{
                                    width: "fit-content",
                                    color: "var(--Colors-Text-Primary, #051411)",
                                    fontFamily: "Inter",
                                    fontSize: "24px",
                                    fontStyle: "normal",
                                    fontWeight: "700",
                                    lineHeight: "normal",
                                    margin: 0,
                                }}
                            >
                                Life Status:
                            </p>
                            <p
                                style={{
                                    width: "fit-content",
                                    color: "var(--Colors-Text-Primary, #051411)",
                                    fontFamily: "Inter",
                                    fontSize: "24px",
                                    fontStyle: "normal",
                                    fontWeight: "700",
                                    lineHeight: "normal",
                                    margin: 0,
                                }}
                            >
                                {getLifeStatusLabel(artist.is_dead)}
                            </p>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "flex-start",
                                gap: '8px'
                            }}
                        >
                            <p
                                style={{
                                    width: "fit-content",
                                    color: "var(--Colors-Text-Primary, #051411)",
                                    fontFamily: "Inter",
                                    fontSize: "24px",
                                    fontStyle: "normal",
                                    fontWeight: "700",
                                    lineHeight: "normal",
                                    margin: 0,
                                }}
                            >
                                Group Status:
                            </p>
                            <p
                                style={{
                                    width: "fit-content",
                                    color: "var(--Colors-Text-Primary, #051411)",
                                    fontFamily: "Inter",
                                    fontSize: "24px",
                                    fontStyle: "normal",
                                    fontWeight: "700",
                                    lineHeight: "normal",
                                    margin: 0,
                                }}
                            >
                                {getGroupStatusLabel(artist.is_disbanded)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
