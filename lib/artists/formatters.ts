import { CountryKit } from "@andreasnicolaou/country-kit";

export const formatGenre = (genre: string): string => {
    // Special cases for specific genres
    const specialCases: Record<string, string> = {
        'hip hop': 'Hip-Hop',
        'k-pop': 'K-Pop',
        'r&b': 'R&B',
    };
    
    if (specialCases[genre]) {
        return specialCases[genre];
    }
    
    return genre
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join('-');
};

export const formatType = (parsed_artist_type: string): string => {
    if (parsed_artist_type === 'solo') {
        return 'Soloist';
    }
    return parsed_artist_type.charAt(0).toUpperCase() + parsed_artist_type.slice(1);
};

export const formatGender = (gender: string): string => {
    return gender.charAt(0).toUpperCase() + gender.slice(1);
};

export const getCountryDisplay = (countryCode: string): string => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const country = CountryKit.getCountryByCode(countryCode.toLowerCase() as any);
    if (country?.emoji && country?.name) {
        return `${country.emoji} ${country.name}`;
    }
    return countryCode;
};

export const getLifeStatusLabel = (isDead: boolean | null): string => {
    if (isDead === null) return "-";
    return isDead ? "Deceased" : "Alive";
};

export const getGroupStatusLabel = (isDisbanded: boolean | null): string => {
    if (isDisbanded === null) return "-";
    return isDisbanded ? "Disbanded" : "Existing";
};

/**
 * Converts a 0-indexed roster_order from the database to a 1-indexed display number.
 * Database stores roster_order starting from 0, but we display it starting from 1.
 * 
 * @param rosterOrder - The roster_order value from the database (0-indexed, can be null)
 * @returns The display number (1-indexed), defaults to 1 if rosterOrder is null
 * 
 * @example
 * formatRosterNumber(0) // returns 1 (Drake is #1)
 * formatRosterNumber(199) // returns 200
 * formatRosterNumber(null) // returns 1
 */
export const formatRosterNumber = (rosterOrder: number | null | undefined): number => {
    return (rosterOrder ?? 0) + 1;
};
