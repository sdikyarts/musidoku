import Link from "next/link";
import VerifiedIcon from "../icons/VerifiedIcon";

type ArtistCardProps = {
  id: string;
  name: string;
  imageUrl?: string | null;
  cardSize?: number;
};

export default function ArtistCard({ id, name, imageUrl, cardSize = 200 }: Readonly<ArtistCardProps>) {
  const background = imageUrl ? `url(${imageUrl}) center / cover no-repeat` : "lightgray";
  const fontSize = cardSize < 200 ? "14px" : "16px";
  const gap = cardSize < 200 ? "8px" : "12px";

  return (
    <Link
      href={`/artists/${id}`}
      style={{
        display: "flex",
        width: `${cardSize}px`,
        borderRadius: "6px",
        flexDirection: "column",
        alignItems: "flex-start",
        gap,
        textDecoration: "none",
        cursor: "pointer",
      }}
    >
      <div
        style={{
          width: `${cardSize}px`,
          aspectRatio: "1",
          background,
          flexShrink: "0",
          borderRadius: "8px",
        }}
      />
      <div
        style={{
          display: "flex",
          borderRadius: "6px",
          justifyContent: "space-between",
          alignItems: "center",
          width: `${cardSize}px`,
          gap: "8px",
        }}
      >
        <p
          style={{
            width: "100%",
            color: "var(--Colors-Text-Primary, #051411)",
            fontFamily: "Inter",
            fontSize,
            fontStyle: "normal",
            fontWeight: "700",
            lineHeight: "normal",
            margin: 0,
          }}
        >
          {name}
        </p>
        <VerifiedIcon />
      </div>
    </Link>
  );
}
