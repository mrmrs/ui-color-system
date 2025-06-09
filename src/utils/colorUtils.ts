import Color from 'colorjs.io';

export type ContrastAlgorithm = 'WCAG21' | 'APCA';

export type ColorCombination = {
  background: string;
  foreground: string;
  contrast: number;
  bgHue?: string;
  fgHue?: string;
  bgIndex?: number; // Add index for locating in palette
};

export type BackgroundVariant = 'solid' | 'gradient';
export type GradientType = 'linear' | 'radial';
export type GradientDirection = 'to right' | 'to bottom' | 'to bottom right' | 'to bottom left';
export type StepDirection = 'lighter' | 'darker';
export type GradientHueMode = 'same-hue' | 'adjacent-hue' | 'complementary-hue' | 'random-hue';
export type AdjacentDirection = 'next' | 'prev' | 'both';

/**
 * Calculate contrast between two colors using the specified algorithm
 */
export function calculateContrast(
  foreground: string, 
  background: string, 
  algorithm: ContrastAlgorithm
): number {
  try {
    const fg = new Color(foreground);
    const bg = new Color(background);
    
    if (algorithm === 'WCAG21') {
      return Color.contrast(fg, bg, 'WCAG21');
    } else {
      return Math.abs(Color.contrast(fg, bg, 'APCA'));
    }
  } catch (error) {
    console.error('Error calculating contrast:', error);
    return 0;
  }
}

/**
 * Find all accessible color combinations based on the given algorithm and threshold
 */
export function findAccessibleCombinations(
  colorPalette: Record<string, string[]>,
  algorithm: ContrastAlgorithm,
  threshold: number,
  limit?: number
): ColorCombination[] {
  const combinations: ColorCombination[] = [];
  
  // Loop through all color scales
  Object.entries(colorPalette).forEach(([bgHueName, bgHueScale]) => {
    // For each color in this scale
    bgHueScale.forEach((backgroundColor, bgIndex) => {
      // Check against all other colors
      Object.entries(colorPalette).forEach(([fgHueName, fgHueScale]) => {
        fgHueScale.forEach((foregroundColor) => {
          const contrast = calculateContrast(foregroundColor, backgroundColor, algorithm);
          
          // Check if contrast meets threshold
          if ((algorithm === 'WCAG21' && contrast >= threshold) || 
              (algorithm === 'APCA' && contrast >= threshold)) {
            combinations.push({
              background: backgroundColor,
              foreground: foregroundColor,
              contrast,
              bgHue: bgHueName,
              fgHue: fgHueName,
              bgIndex
            });
          }
        });
      });
    });
  });
  
  // Sort by contrast ratio, highest first
  combinations.sort((a, b) => b.contrast - a.contrast);
  
  // Apply limit if specified
  return limit ? combinations.slice(0, limit) : combinations;
}

/**
 * Sort color combinations by background color (from darkest to lightest)
 */
export function sortByBackgroundColor(combinations: ColorCombination[]): ColorCombination[] {
  return [...combinations].sort((a, b) => {
    // Convert colors to RGB and calculate approximate luminance
    try {
      const colorA = new Color(a.background);
      const colorB = new Color(b.background);
      
      // Calculate simple luminance (can be refined for more accurate sorting)
      const luminanceA = colorA.coords[0] * 0.299 + colorA.coords[1] * 0.587 + colorA.coords[2] * 0.114;
      const luminanceB = colorB.coords[0] * 0.299 + colorB.coords[1] * 0.587 + colorB.coords[2] * 0.114;
      
      // Sort from darkest to lightest
      return luminanceA - luminanceB;
    } catch (error) {
      return 0;
    }
  });
}

/**
 * Get the WCAG compliance level based on the contrast ratio
 */
export function getWCAGComplianceLevel(contrastRatio: number): 'AAA' | 'AA' | 'A' | 'Fail' {
  if (contrastRatio >= 7) return 'AAA';
  if (contrastRatio >= 4.5) return 'AA';
  if (contrastRatio >= 3) return 'A';
  return 'Fail';
}

/**
 * Get a short description of APCA compliance based on the contrast value
 */
export function getAPCAComplianceDescription(contrastValue: number): string {
  if (contrastValue >= 90) return 'Perfect';
  if (contrastValue >= 75) return 'Excellent';
  if (contrastValue >= 60) return 'Good';
  if (contrastValue >= 45) return 'Acceptable';
  if (contrastValue >= 30) return 'Minimal';
  return 'Insufficient';
}

/**
 * Get a different color from the same hue family to use as a border
 * This uses colors from the palette instead of manipulating colors
 */
export function getBorderColorFromPalette(
  backgroundColor: string,
  borderLevel: 'subtle' | 'strong',
  colorPalette: Record<string, string[]>,
  bgHue?: string,
  bgIndex?: number
): string {
  // Default to original color if missing info
  if (!bgHue || bgIndex === undefined || !colorPalette[bgHue]) {
    return backgroundColor;
  }
  
  const hueColors = colorPalette[bgHue];
  const step = borderLevel === 'subtle' ? 1 : 2;
  
  // Get a darker color for border (or lighter if we're at the dark end)
  const isAlreadyDark = bgIndex <= 3;
  const targetIndex = isAlreadyDark 
    ? Math.min(bgIndex + step, hueColors.length - 1) // Go lighter
    : Math.max(bgIndex - step, 0); // Go darker
  
  return hueColors[targetIndex] || backgroundColor;
}

/**
 * Get an adjacent hue family from the palette
 */
export function getAdjacentHue(
  currentHue: string,
  direction: 'next' | 'prev' | 'both',
  colorPalette: Record<string, string[]>
): string | string[] {
  const hueNames = Object.keys(colorPalette);
  const currentIndex = hueNames.indexOf(currentHue);
  
  if (currentIndex === -1) return currentHue;
  
  if (direction === 'both') {
    const nextHue = hueNames[(currentIndex + 1) % hueNames.length];
    const prevHue = hueNames[(currentIndex - 1 + hueNames.length) % hueNames.length];
    return [nextHue, prevHue];
  } else if (direction === 'next') {
    return hueNames[(currentIndex + 1) % hueNames.length];
  } else {
    return hueNames[(currentIndex - 1 + hueNames.length) % hueNames.length];
  }
}

/**
 * Get a random hue from the palette (different from current)
 */
export function getRandomHue(
  currentHue: string,
  colorPalette: Record<string, string[]>
): string {
  const hueNames = Object.keys(colorPalette);
  if (hueNames.length <= 1) return currentHue;
  
  // Filter out the current hue
  const availableHues = hueNames.filter(hue => hue !== currentHue);
  
  // Return a random hue from the available options
  const randomIndex = Math.floor(Math.random() * availableHues.length);
  return availableHues[randomIndex];
}

/**
 * Get a complementary hue (approximately opposite on the color wheel)
 */
export function getComplementaryHue(
  currentHue: string,
  colorPalette: Record<string, string[]>
): string {
  const hueNames = Object.keys(colorPalette);
  const currentIndex = hueNames.indexOf(currentHue);
  
  if (currentIndex === -1) return currentHue;
  
  // Get a hue that's approximately opposite in the list
  const halfLength = Math.floor(hueNames.length / 2);
  return hueNames[(currentIndex + halfLength) % hueNames.length];
}

/**
 * Get another color for gradient end based on hue mode and steps
 */
export function getGradientEndColor(
  backgroundColor: string,
  hueStep: number,
  hueMode: GradientHueMode,
  colorPalette: Record<string, string[]>,
  bgHue?: string,
  bgIndex?: number
): string {
  // Default to original color if missing info
  if (!bgHue || bgIndex === undefined || !colorPalette[bgHue]) {
    return backgroundColor;
  }
  
  // For same hue, just move up or down the scale
  if (hueMode === 'same-hue') {
    const hueColors = colorPalette[bgHue];
    // For dark colors go lighter, for light colors go darker for better contrast
    const isAlreadyDark = bgIndex <= (hueColors.length / 3);
    const targetIndex = isAlreadyDark 
      ? Math.min(bgIndex + hueStep, hueColors.length - 1)  // Go lighter
      : Math.max(bgIndex - hueStep, 0);  // Go darker
    
    return hueColors[targetIndex] || backgroundColor;
  }
  
  // For adjacent hue, get the neighboring hue family (either next, prev, or both)
  else if (hueMode === 'adjacent-hue') {
    // For "both" direction, randomly choose between next and prev for variation
    const direction = Math.random() > 0.5 ? 'next' : 'prev';
    const adjacentHue = getAdjacentHue(bgHue, direction, colorPalette) as string;
    
    // Get a color at similar depth from the adjacent hue
    if (colorPalette[adjacentHue]) {
      const adjacentColors = colorPalette[adjacentHue];
      // Adjust index if the two scales have different lengths
      const normalizedIndex = Math.floor(
        (bgIndex / colorPalette[bgHue].length) * adjacentColors.length
      );
      return adjacentColors[normalizedIndex] || backgroundColor;
    }
  }
  
  // For complementary hue, get an approximately opposite hue
  else if (hueMode === 'complementary-hue') {
    const complementaryHue = getComplementaryHue(bgHue, colorPalette);
    
    // Get a color at similar depth from the complementary hue
    if (colorPalette[complementaryHue]) {
      const complementaryColors = colorPalette[complementaryHue];
      // Adjust index if the two scales have different lengths
      const normalizedIndex = Math.floor(
        (bgIndex / colorPalette[bgHue].length) * complementaryColors.length
      );
      return complementaryColors[normalizedIndex] || backgroundColor;
    }
  }
  
  // For random hue, get a random hue from the palette
  else if (hueMode === 'random-hue') {
    const randomHue = getRandomHue(bgHue, colorPalette);
    
    // Get a color at similar depth from the random hue
    if (colorPalette[randomHue]) {
      const randomColors = colorPalette[randomHue];
      // Adjust index if the two scales have different lengths
      const normalizedIndex = Math.floor(
        (bgIndex / colorPalette[bgHue].length) * randomColors.length
      );
      return randomColors[normalizedIndex] || backgroundColor;
    }
  }
  
  // Fallback to original color
  return backgroundColor;
}

/**
 * Generate a gradient background using colors from the palette
 */
export function generatePaletteGradient(
  backgroundColor: string,
  bgHue: string | undefined,
  bgIndex: number | undefined,
  colorPalette: Record<string, string[]>,
  type: GradientType = 'linear',
  direction: GradientDirection = 'to right',
  hueStep: number = 2,
  hueMode: GradientHueMode = 'same-hue'
): string {
  // If missing info, return solid background
  if (!bgHue || bgIndex === undefined || !colorPalette[bgHue]) {
    return backgroundColor;
  }
  
  // Get another color from the palette based on hue mode
  const endColor = getGradientEndColor(
    backgroundColor,
    hueStep,
    hueMode,
    colorPalette,
    bgHue,
    bgIndex
  );
  
  // Format gradient based on type
  if (type === 'linear') {
    return `linear-gradient(${direction}, ${backgroundColor}, ${endColor})`;
  } else {
    return `radial-gradient(circle, ${backgroundColor}, ${endColor})`;
  }
} 