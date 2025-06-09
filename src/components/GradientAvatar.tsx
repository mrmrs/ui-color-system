import React from 'react';
import { getBorderColorFromPalette, generatePaletteGradient } from '../utils/colorUtils';
import type { BackgroundVariant, GradientType, GradientDirection, GradientHueMode } from '../utils/colorUtils';

type AvatarSize = 'sm' | 'md' | 'lg';

type GradientAvatarProps = {
  backgroundColor: string;
  foregroundColor: string;
  size?: AvatarSize;
  initials?: string;
  bgHue?: string;
  bgIndex?: number;
  showBorder?: boolean;
  borderLevel?: 'subtle' | 'strong';
  backgroundVariant?: BackgroundVariant;
  gradientType?: GradientType;
  gradientDirection?: GradientDirection;
  hueStep?: number;
  hueMode?: GradientHueMode;
  colorPalette?: Record<string, string[]>;
};

const GradientAvatar: React.FC<GradientAvatarProps> = ({
  backgroundColor,
  foregroundColor,
  size = 'md',
  initials,
  bgHue,
  bgIndex,
  showBorder = false,
  borderLevel = 'subtle',
  backgroundVariant = 'solid',
  gradientType = 'linear',
  gradientDirection = 'to right',
  hueStep = 2,
  hueMode = 'same-hue',
  colorPalette = {}
}) => {
  // Generate random initials if none provided
  const displayInitials = initials || generateRandomInitials();
  
  // Determine size classes
  const sizeClasses = {
    sm: 'avatar-sm',
    md: 'avatar-md',
    lg: 'avatar-lg'
  };
  
  // Generate background based on variant
  const getBackground = () => {
    if (backgroundVariant === 'solid' || Object.keys(colorPalette).length === 0) {
      return backgroundColor;
    } else {
      return generatePaletteGradient(
        backgroundColor,
        bgHue,
        bgIndex,
        colorPalette,
        gradientType,
        gradientDirection,
        hueStep,
        hueMode
      );
    }
  };

  // Get border color if borders are enabled
  const getBorder = () => {
    if (showBorder && Object.keys(colorPalette).length > 0) {
      return {
        borderColor: getBorderColorFromPalette(
          backgroundColor,
          borderLevel,
          colorPalette,
          bgHue,
          bgIndex
        ),
        borderWidth: '1px',
        borderStyle: 'solid' as const
      };
    }
    return {
      borderColor: 'transparent',
      borderWidth: '0',
      borderStyle: 'solid' as const
    };
  };

  const background = getBackground();
  const borderStyles = getBorder();
  
  return (
    <div 
      className={`avatar ${sizeClasses[size]}`}
      style={{
        background,
        color: foregroundColor,
        ...borderStyles
      }}
    >
      {displayInitials}
    </div>
  );
};

// Helper function to generate random 2-letter initials
function generateRandomInitials(): string {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const firstLetter = alphabet[Math.floor(Math.random() * alphabet.length)];
  const secondLetter = alphabet[Math.floor(Math.random() * alphabet.length)];
  return `${firstLetter}${secondLetter}`;
}

export default GradientAvatar; 
