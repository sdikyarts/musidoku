import type { Artist } from "@/db/schema/artists";

export function createMockArtist(overrides?: Partial<Artist>): Artist {
  return {
    scraper_name: "Drake",
    spotify_id: "3TVXtAsR1Inumwj472S9r4",
    roster_order: 0,
    mb_id: "00000000-0000-0000-0000-000000000000",
    mb_type_raw: "Person",
    parsed_artist_type: "solo",
    gender: "male",
    country: "CA",
    birth_date: null,
    death_date: null,
    disband_date: null,
    debut_year: 2006,
    member_count: null,
    genres: "hip hop",
    primary_genre: "hip hop",
    secondary_genre: null,
    is_dead: false,
    is_disbanded: null,
    scraper_image_url: null,
    chartmasters_name: null,
    ...overrides,
  };
}

export const mockArtists = {
  drake: createMockArtist(),
  taylorSwift: createMockArtist({
    scraper_name: "Taylor Swift",
    spotify_id: "06HL4z0CvFAxyc27GXpf02",
    roster_order: 1,
    mb_id: "00000000-0000-0000-0000-000000000001",
    gender: "female",
    country: "US",
    genres: "pop",
    primary_genre: "pop",
  }),
};
