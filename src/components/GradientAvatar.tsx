import React from 'react';
import { generateBorderColor, generateGradientBackground } from '../utils/colorUtils';
import type { BackgroundVariant, GradientType, GradientDirection } from '../utils/colorUtils';

type AvatarSize = 'sm' | 'md' | 'lg';

type GradientAvatarProps = {
  backgroundColor: string;
  foregroundColor: string;
  size?: AvatarSize;
  initials?: string;
  showBorder?: boolean;
  borderLevel?: 'subtle' | 'strong';
  backgroundVariant?: BackgroundVariant;
  gradientType?: GradientType;
  gradientDirection?: GradientDirection;
  hueShift?: number;
};

const GradientAvatar: React.FC<GradientAvatarProps> = ({
  backgroundColor,
  foregroundColor,
  size = 'md',
  initials,
  showBorder = false,
  borderLevel = 'subtle',
  backgroundVariant = 'solid',
  gradientType = 'linear',
  gradientDirection = 'to right',
  hueShift = 10
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
    if (backgroundVariant === 'solid') {
      return backgroundColor;
    } else {
      return generateGradientBackground(
        backgroundColor,
        gradientType,
        gradientDirection,
        hueShift
      );
    }
  };

  // Get border color if borders are enabled
  const getBorder = () => {
    if (showBorder) {
      return {
        borderColor: generateBorderColor(backgroundColor, borderLevel),
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
