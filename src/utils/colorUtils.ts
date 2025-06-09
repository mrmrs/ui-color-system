import Color from 'colorjs.io';

export type ContrastAlgorithm = 'WCAG21' | 'APCA';

export type ColorCombination = {
  background: string;
  foreground: string;
  contrast: number;
  bgHue?: string;
  fgHue?: string;
};

export type BackgroundVariant = 'solid' | 'gradient';
export type GradientType = 'linear' | 'radial';
export type GradientDirection = 'to right' | 'to bottom' | 'to bottom right' | 'to bottom left';

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
    bgHueScale.forEach((backgroundColor) => {
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
              fgHue: fgHueName
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
 * Generate a border color that's darker/lighter than the background but in the same hue
 */
export function generateBorderColor(
  backgroundColor: string,
  level: 'subtle' | 'strong' = 'subtle'
): string {
  try {
    const color = new Color(backgroundColor);
    
    // Calculate a darker version of the same color for the border
    // For subtle borders, darken less; for strong borders, darken more
    const amount = level === 'subtle' ? 0.1 : 0.2;
    
    let borderColor;
    
    // If the background is already very dark, lighten instead
    if (color.luminance < 0.2) {
      borderColor = color.clone().lighten(amount);
    } else {
      borderColor = color.clone().darken(amount);
    }
    
    return borderColor.toString();
  } catch (error) {
    // If there's an error, return a fallback
    return backgroundColor;
  }
}

/**
 * Generate a gradient background using colors from the same or nearby hue
 */
export function generateGradientBackground(
  baseColor: string,
  type: GradientType = 'linear',
  direction: GradientDirection = 'to right',
  hueShift: number = 10
): string {
  try {
    const color = new Color(baseColor);
    
    // Create a variation of the color by shifting the hue slightly
    const endColor = color.clone();
    
    // Shift the hue, maintaining the same lightness
    endColor.hsl.h = (endColor.hsl.h + hueShift) % 360;
    
    // Format gradient based on type
    if (type === 'linear') {
      return `linear-gradient(${direction}, ${color.toString()}, ${endColor.toString()})`;
    } else {
      return `radial-gradient(circle, ${color.toString()}, ${endColor.toString()})`;
    }
  } catch (error) {
    // If there's an error, return the original color as a solid background
    return baseColor;
  }
}

/**
 * Get a complementary color by shifting the hue by a specific amount
 * This is useful for generating color pairs that work well together
 */
export function getShiftedHueColor(
  baseColor: string,
  hueShift: number = 30
): string {
  try {
    const color = new Color(baseColor);
    const shiftedColor = color.clone();
    
    // Shift the hue by the specified amount
    shiftedColor.hsl.h = (shiftedColor.hsl.h + hueShift) % 360;
    
    return shiftedColor.toString();
  } catch (error) {
    return baseColor;
  }
} 