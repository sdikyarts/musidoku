import { CountryKit } from "@andreasnicolaou/country-kit";

export const formatGenre = (genre: string): string => {
    if (genre === 'hip hop') {
        return 'Hip-Hop';
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
