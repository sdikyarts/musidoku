import Link from "next/link";
import VerifiedIcon from "../icons/VerifiedIcon";

type ArtistCardProps = {
  id: string;
  name: string;
  imageUrl?: string | null;
};

export default function ArtistCard({ id, name, imageUrl }: Readonly<ArtistCardProps>) {
  const background = imageUrl ? `url(${imageUrl}) center / cover no-repeat` : "lightgray";

  return (
    <Link
      href={`/artists/${id}`}
      style={{
        display: "flex",
        width: "200px",
        borderRadius: "6px",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "12px",
        textDecoration: "none",
        cursor: "pointer",
      }}
    >
      <div
        style={{
          width: "200px",
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
          width: "200px",
          gap: "8px",
        }}
      >
        <p
          style={{
            width: "100%",
            color: "var(--Colors-Text-Primary, #051411)",
            fontFamily: "Inter",
            fontSize: "16px",
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
