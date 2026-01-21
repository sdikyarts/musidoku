export function calculateHorizontalPadding(screenWidth?: number): number {
  if (typeof window === 'undefined' && !screenWidth) return 224; // Default for SSR
  
  const width = screenWidth ?? window.innerWidth;
  
  if (width >= 1440) {
    return 288;
  } else if (width >= 1280) {
    return 224;
  } else if (width >= 1096) {
    return 128;
  } else if (width >= 960) {
    return 96;
  } else if (width >= 640) {
    return 48;
  } else {
    return 24;
  }
}

export function calculateNavbarHorizontalPadding(screenWidth?: number): number {
  if (typeof window === 'undefined' && !screenWidth) return 96; // Default for SSR
  
  const width = screenWidth ?? window.innerWidth;
  
  // For 1096px and wider, keep current navbar padding (96px)
  if (width >= 1096) {
    return 96;
  }
  
  // For narrower screens, use the universal padding
  return calculateHorizontalPadding(width);
}
