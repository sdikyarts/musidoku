// Convert hex to RGB
function hexToRgb(hex: string): { r: number; g: number; b: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: Number.parseInt(result[1], 16),
        g: Number.parseInt(result[2], 16),
        b: Number.parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
}

// Convert RGB to hex
function rgbToHex(r: number, g: number, b: number): string {
    return '#' + [r, g, b].map(x => {
        const hex = Math.round(Math.max(0, Math.min(255, x))).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }).join('').toUpperCase();
}

// Create a lighter version for unselected background (visible over #E5F4F8)
export function getLighterBackground(accentColor: string): string {
    const rgb = hexToRgb(accentColor);
    // Mix with white to create a light tint (60% white)
    const lightBg = {
        r: rgb.r + (255 - rgb.r) * 0.6,
        g: rgb.g + (255 - rgb.g) * 0.6,
        b: rgb.b + (255 - rgb.b) * 0.6,
    };
    return rgbToHex(lightBg.r, lightBg.g, lightBg.b);
}

// Create a lighter darker version for text (readable on light background) and selected pill background
export function getDarkerText(accentColor: string): string {
    const rgb = hexToRgb(accentColor);
    // Lighten the darkening - use 75% instead of 65% for a lighter result
    const darkText = {
        r: rgb.r * 0.75,
        g: rgb.g * 0.75,
        b: rgb.b * 0.75,
    };
    return rgbToHex(darkText.r, darkText.g, darkText.b);
}
