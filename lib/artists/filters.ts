// Server-side functions for fetching filter data
import { db } from '@/lib/db';
import { artists } from '@/db/schema/artists';
import { CountryKit } from '@andreasnicolaou/country-kit';
import { COUNTRY_COLORS } from '@/lib/flag-colors';

export type CountryOption = {
  code: string;
  name: string;
  emoji: string;
  accentColor: string;
};

export type GenreOption = {
  value: string;
  label: string;
};

export async function getCountries(): Promise<CountryOption[]> {
  const result = await db
    .selectDistinct({ country: artists.country })
    .from(artists)
    .orderBy(artists.country);

  const countries = result
    .map((row) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const countryData = CountryKit.getCountryByCode(row.country.toLowerCase() as any);
      if (!countryData?.name || !countryData?.emoji) {
        return null;
      }
      return {
        code: row.country,
        name: countryData.name,
        emoji: countryData.emoji,
        accentColor: COUNTRY_COLORS[row.country] || '#8A9AAA',
      };
    })
    .filter((c): c is CountryOption => c !== null)
    .sort((a, b) => a.name.localeCompare(b.name));

  return countries;
}

export async function getGenres(): Promise<string[]> {
  const result = await db
    .select({
      primary_genre: artists.primary_genre,
      secondary_genre: artists.secondary_genre,
    })
    .from(artists);

  const genreSet = new Set<string>();
  
  for (const row of result) {
    if (row.primary_genre) {
      genreSet.add(row.primary_genre);
    }
    if (row.secondary_genre) {
      genreSet.add(row.secondary_genre);
    }
  }

  return Array.from(genreSet).sort((a, b) => a.localeCompare(b));
}
