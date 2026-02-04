// app/api/artists/countries/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { artists } from '@/db/schema/artists';
import { CountryKit } from '@andreasnicolaou/country-kit';
import { COUNTRY_COLORS } from '@/lib/flag-colors';

export async function GET() {
  try {
    // Get distinct countries from the database, ordered alphabetically
    const result = await db
      .selectDistinct({ country: artists.country })
      .from(artists)
      .orderBy(artists.country);

    // Map to include country name, emoji, and accent color
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
      .filter((c): c is { code: string; name: string; emoji: string; accentColor: string } => c !== null)
      .sort((a, b) => a.name.localeCompare(b.name));

    return NextResponse.json(countries);
  } catch (error) {
    console.error('Error fetching countries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch countries' },
      { status: 500 }
    );
  }
}
