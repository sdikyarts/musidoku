import VerifiedIcon from "../icons/VerifiedIcon";

type ArtistCardProps = {
  name: string;
  imageUrl?: string | null;
};

export default function ArtistCard({ name, imageUrl }: ArtistCardProps) {
  const background = imageUrl ? `url(${imageUrl}) center / cover no-repeat` : "lightgray";

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        borderRadius: "6px",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "12px",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "185px",
          background,
          flexShrink: "0",
          aspectRatio: "329/185",
          borderRadius: "8px",
        }}
      />
      <div
        style={{
          display: "flex",
          borderRadius: "6px",
          justifyContent: "space-between",
          alignItems: "center",
          alignSelf: "stretch",
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
    </div>
  );
}
