// Map genre values to colors
export const GENRE_COLORS: Record<string, string> = {
    'afrobeats': '#E67E22',
    'alternative': '#5B21B6',
    'bollywood': '#C2185B',
    'country': '#8B4513',
    'electronic': '#0EA5E9',
    'hip hop': '#CA8A04',
    'k-pop': '#EC4899',
    'latin': '#E8590C',
    'metal': '#1E293B',
    'pop': '#1E40AF',
    'r&b': '#A855F7',
    'reggae': '#65A30D',
    'rock': '#991B1B',
    'soundtrack': '#0D9488',
};

// Helper function to convert hex to RGB
function hexToRgb(hex: string): { r: number; g: number; b: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: Number.parseInt(result[1], 16),
        g: Number.parseInt(result[2], 16),
        b: Number.parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
}

// Helper function to convert RGB to hex
function rgbToHex(r: number, g: number, b: number): string {
    return '#' + [r, g, b].map(x => {
        const hex = Math.round(Math.max(0, Math.min(255, x))).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }).join('').toUpperCase();
}

// Helper function to get lighter background for genres (unselected state)
export function getGenreLighterBackground(accentColor: string): string {
    const rgb = hexToRgb(accentColor);
    
    const gray = (rgb.r + rgb.g + rgb.b) / 3;
    const lightBg = {
        r: rgb.r + (255 - rgb.r) * 0.55 + (gray - rgb.r) * 0.08,
        g: rgb.g + (255 - rgb.g) * 0.55 + (gray - rgb.g) * 0.08,
        b: rgb.b + (255 - rgb.b) * 0.55 + (gray - rgb.b) * 0.08,
    };
    return rgbToHex(lightBg.r, lightBg.g, lightBg.b);
}

// Helper function to get darker text for genres (unselected state)
export function getGenreDarkerText(accentColor: string, genreValue?: string): string {
    const rgb = hexToRgb(accentColor);
    
    // Custom adjustments for specific genres - much lighter overall
    let factor = 0.8;
    if (genreValue === 'metal') {
        factor = 0.9;
    } else if (genreValue === 'pop') {
        factor = 0.7;
    } else if (genreValue === 'afrobeats' || genreValue === 'electronic' || 
               genreValue === 'hip hop' || genreValue === 'k-pop' || 
               genreValue === 'latin' || genreValue === 'r&b' || 
               genreValue === 'reggae') {
        factor = 0.65;
    }
    
    const darkText = {
        r: rgb.r * factor,
        g: rgb.g * factor,
        b: rgb.b * factor,
    };
    return rgbToHex(darkText.r, darkText.g, darkText.b);
}

// Helper function for selected genre background - darker
export function getSelectedGenreBackground(accentColor: string): string {
    const rgb = hexToRgb(accentColor);
    
    // Make it much lighter and less vibrant (move toward gray)
    const gray = (rgb.r + rgb.g + rgb.b) / 3;
    const selectedBg = {
        r: (rgb.r * 0.7 + gray * 0.3) * 0.9,
        g: (rgb.g * 0.7 + gray * 0.3) * 0.9,
        b: (rgb.b * 0.7 + gray * 0.3) * 0.9,
    };
    return rgbToHex(selectedBg.r, selectedBg.g, selectedBg.b);
}
