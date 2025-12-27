import VerifiedIcon from "../icons/VerifiedIcon"

export default function ArtistCard() {
    return (
        <div
            style={{
                display: "flex",
                width: "185px",
                borderRadius: "6px",
                flexDirection: "column",
                alignItems: "center",
                gap: "12px",
            }}
        >
            <div
                style={{
                    width: "185px",
                    height: "185px",
                    background: "url(<path-to-image>) lightgray 50% / cover no-repeat",
                    flexShrink: "0",
                    aspectRatio: "329/185",
                    borderRadius: "6px",
                }}
            />
            <div
                style={{
                    display: "flex",
                    borderRadius: "6px",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    alignSelf: "stretch"
                }}
            >
                <p
                    style={{
                        width: "150px",
                        color: "var(--Colors-Text-Primary, #051411)",
                        fontFamily: "Inter",
                        fontSize: "16px",
                        fontStyle: "normal",
                        fontWeight: "600",
                        lineHeight: "normal"
                    }}
                >
                    Artist Name
                </p>
                <VerifiedIcon />
            </div>
        </div>
    )
}