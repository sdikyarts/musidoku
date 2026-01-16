export const TYPE_OPTIONS = [
  { label: "Soloists", value: "solo" },
  { label: "Groups", value: "group" },
];

export type ArtistTypeValue = "solo" | "group";

export const typeValueToLabel: Record<ArtistTypeValue, string> = {
  solo: "Soloists",
  group: "Groups",
};