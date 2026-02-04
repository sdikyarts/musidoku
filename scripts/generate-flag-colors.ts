import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import sharp from 'sharp';

// Background color to check contrast against
const BACKGROUND_COLOR = { r: 194, g: 212, b: 237 }; // #C2D4ED

// Calculate relative luminance for WCAG contrast
function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

// Calculate contrast ratio
function getContrastRatio(color1: { r: number; g: number; b: number }, color2: { r: number; g: number; b: number }): number {
  const lum1 = getLuminance(color1.r, color1.g, color1.b);
  const lum2 = getLuminance(color2.r, color2.g, color2.b);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}

// Convert RGB to hex
function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => {
    const hex = Math.round(x).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('').toUpperCase();
}

// Lighten a color
function lightenColor(color: { r: number; g: number; b: number }, amount: number = 0.3): { r: number; g: number; b: number } {
  return {
    r: Math.min(255, color.r + (255 - color.r) * amount),
    g: Math.min(255, color.g + (255 - color.g) * amount),
    b: Math.min(255, color.b + (255 - color.b) * amount),
  };
}

// Darken a color
function darkenColor(color: { r: number; g: number; b: number }, amount: number = 0.3): { r: number; g: number; b: number } {
  return {
    r: Math.max(0, color.r * (1 - amount)),
    g: Math.max(0, color.g * (1 - amount)),
    b: Math.max(0, color.b * (1 - amount)),
  };
}

// Make color more muted/pastel
function muteColor(color: { r: number; g: number; b: number }, amount: number = 0.35): { r: number; g: number; b: number } {
  // Mix with a neutral gray to create muted effect
  const mixColor = { r: 160, g: 160, b: 160 };
  return {
    r: color.r * (1 - amount) + mixColor.r * amount,
    g: color.g * (1 - amount) + mixColor.g * amount,
    b: color.b * (1 - amount) + mixColor.b * amount,
  };
}

async function analyzeFlagColor(countryCode: string): Promise<string> {
  try {
    // Try to load the SVG flag from country-flag-icons
    const flagPath = join(process.cwd(), 'node_modules', 'country-flag-icons', '3x2', `${countryCode}.svg`);
    const svgBuffer = readFileSync(flagPath);
    
    // Convert SVG to PNG and get dominant colors
    const image = await sharp(svgBuffer)
      .resize(100, 100)
      .png()
      .toBuffer();
    
    const { dominant } = await sharp(image).stats();
    
    // Mute the dominant color
    const mutedColor = muteColor(dominant, 0.35);
    
    // Try both lighter and darker versions
    const lighterVersion = lightenColor(mutedColor, 0.25);
    const darkerVersion = darkenColor(mutedColor, 0.25);
    
    // Check contrast with original flag color
    const contrastWithLighter = getContrastRatio(lighterVersion, dominant);
    const contrastWithDarker = getContrastRatio(darkerVersion, dominant);
    
    // Choose the version with better contrast to the flag
    let chosenColor = contrastWithLighter > contrastWithDarker ? lighterVersion : darkerVersion;
    
    // Ensure minimum contrast with background
    const bgContrast = getContrastRatio(chosenColor, BACKGROUND_COLOR);
    if (bgContrast < 2.2) {
      // If still too light, darken more
      chosenColor = darkenColor(chosenColor, 0.2);
    }
    
    // Final check - ensure it's not too dark
    const finalBgContrast = getContrastRatio(chosenColor, BACKGROUND_COLOR);
    if (finalBgContrast > 4.5) {
      // Too dark, lighten a bit
      chosenColor = lightenColor(chosenColor, 0.15);
    }
    
    return rgbToHex(chosenColor.r, chosenColor.g, chosenColor.b);
  } catch (error) {
    console.error(`Error processing ${countryCode}:`, error);
    // Return a default muted color
    return '#8A9AAA';
  }
}

async function generateAllColors() {
  // List of country codes from your database
  const countryCodes = [
    'AR', 'AU', 'BR', 'CA', 'CO', 'FR', 'IN', 'JP', 'KR', 'MX',
    'GB', 'US', 'DE', 'IT', 'ES', 'NL', 'SE', 'NO', 'DK', 'FI',
    'PL', 'PT', 'GR', 'TR', 'RU', 'CN', 'TH', 'VN', 'PH', 'ID',
    'MY', 'SG', 'NZ', 'ZA', 'EG', 'NG', 'KE', 'CL', 'PE', 'VE',
    'UY', 'EC', 'BO', 'PY', 'CR', 'PA', 'CU', 'DO', 'GT', 'HN',
    'SV', 'NI', 'JM', 'TT', 'BB', 'BS', 'BZ', 'GY', 'SR', 'HT',
    'PR', 'IE', 'IS', 'LU', 'BE', 'CH', 'AT', 'CZ', 'SK', 'HU',
    'RO', 'BG', 'HR', 'SI', 'RS', 'BA', 'MK', 'AL', 'XK', 'ME',
    'LT', 'LV', 'EE', 'BY', 'UA', 'MD', 'GE', 'AM', 'AZ', 'KZ',
    'UZ', 'TM', 'KG', 'TJ', 'AF', 'PK', 'BD', 'LK', 'NP', 'BT',
    'MM', 'KH', 'LA', 'MN', 'TW', 'HK', 'MO', 'IL', 'JO', 'LB',
    'SY', 'IQ', 'IR', 'SA', 'AE', 'KW', 'QA', 'BH', 'OM', 'YE',
    'PS', 'CY', 'MT',
  ];
  
  const colors: Record<string, string> = {};
  
  console.log('Analyzing flag colors with contrast optimization...');
  for (const code of countryCodes) {
    const color = await analyzeFlagColor(code);
    colors[code] = color;
    console.log(`${code}: ${color}`);
  }
  
  // Generate the TypeScript code
  const output = `// Auto-generated flag accent colors
// Generated by scripts/generate-flag-colors.ts
// Colors are optimized for contrast against both flag and background (#C2D4ED)

const COUNTRY_COLORS: Record<string, string> = ${JSON.stringify(colors, null, 2).replace(/"([^"]+)":/g, '$1:')};

export { COUNTRY_COLORS };
`;
  
  writeFileSync(join(process.cwd(), 'lib', 'flag-colors.ts'), output);
  console.log('\nColors generated successfully!');
}

generateAllColors().catch(console.error);
