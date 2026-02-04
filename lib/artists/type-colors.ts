import { getLighterBackground, getDarkerText } from "./country-colors";

// Artist type accent colors
const SOLOIST_COLOR = "#D36E7D"; // Red accent
const GROUP_COLOR = "#6D7FD9"; // Blue accent

export type ArtistType = "solo" | "group";

export function getTypeAccentColor(type: ArtistType): string {
    return type === "solo" ? SOLOIST_COLOR : GROUP_COLOR;
}

export function getTypeColors(type: ArtistType, selected: boolean) {
    const accentColor = getTypeAccentColor(type);
    const darkerColor = getDarkerText(accentColor);
    
    if (selected) {
        return {
            backgroundColor: darkerColor,
            textColor: "#F3FDFB",
        };
    }
    
    return {
        backgroundColor: getLighterBackground(accentColor),
        textColor: darkerColor,
    };
}
