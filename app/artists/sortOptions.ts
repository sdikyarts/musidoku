export type ArtistSortValue =
  | "roster-asc"
  | "roster-desc"
  | "name-asc"
  | "name-desc"
  | "debut-asc"
  | "debut-desc";

export const DEFAULT_ARTIST_SORT: ArtistSortValue = "roster-asc";

export const SORT_OPTIONS: ReadonlyArray<{
  value: ArtistSortValue;
  label: string;
}> = [
  { value: "roster-asc", label: "Roster Number (Asc.)" },
  { value: "roster-desc", label: "Roster Number (Desc.)" },
  { value: "name-asc", label: "Artist Name (A-Z)" },
  { value: "name-desc", label: "Artist Name (Z-A)" },
  { value: "debut-asc", label: "Debut Year (Earliest)" },
  { value: "debut-desc", label: "Debut Year (Latest)" },
];

const validSorts = new Set<ArtistSortValue>(SORT_OPTIONS.map((option) => option.value));

export type SortableArtist = {
  name: string;
  debutYear?: number | null;
};

export function parseSortParam(rawSort: string | null): ArtistSortValue {
  if (rawSort && validSorts.has(rawSort as ArtistSortValue)) {
    return rawSort as ArtistSortValue;
  }

  return DEFAULT_ARTIST_SORT;
}

export function sortArtists<T extends SortableArtist>(
  artists: T[],
  requestedSort: ArtistSortValue | null | undefined,
): T[] {
  const sortValue =
    requestedSort && validSorts.has(requestedSort) ? requestedSort : DEFAULT_ARTIST_SORT;

  if (sortValue === "roster-asc") {
    return [...artists];
  }

  if (sortValue === "roster-desc") {
    return [...artists].reverse();
  }

  const sortedArtists = [...artists];
  const compareNames = (a: T, b: T) =>
    a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
  const normalizeYear = (year: number | null | undefined, fallback: number) =>
    Number.isFinite(year) ? (year as number) : fallback;

  switch (sortValue) {
    case "name-asc":
      sortedArtists.sort(compareNames);
      break;
    case "name-desc":
      sortedArtists.sort((a, b) => compareNames(b, a));
      break;
    case "debut-asc":
      sortedArtists.sort((a, b) => {
        const yearA = normalizeYear(a.debutYear, Number.POSITIVE_INFINITY);
        const yearB = normalizeYear(b.debutYear, Number.POSITIVE_INFINITY);
        if (yearA !== yearB) {
          return yearA - yearB;
        }
        return compareNames(a, b);
      });
      break;
    case "debut-desc":
      sortedArtists.sort((a, b) => {
        const yearA = normalizeYear(a.debutYear, Number.NEGATIVE_INFINITY);
        const yearB = normalizeYear(b.debutYear, Number.NEGATIVE_INFINITY);
        if (yearA !== yearB) {
          return yearB - yearA;
        }
        return compareNames(a, b);
      });
      break;
    default:
      break;
  }

  return sortedArtists;
}
