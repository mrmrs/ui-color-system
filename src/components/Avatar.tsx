import React from 'react';
import Color from 'colorjs.io';

type AvatarSize = 'sm' | 'md' | 'lg';

type AvatarProps = {
  backgroundColor: string;
  foregroundColor: string;
  size?: AvatarSize;
  initials?: string;
  showBorder?: boolean;
  borderLevel?: 'subtle' | 'strong';
};

const Avatar: React.FC<AvatarProps> = ({
  backgroundColor,
  foregroundColor,
  size = 'md',
  initials,
  showBorder = false,
  borderLevel = 'subtle'
}) => {
  // Generate random initials if not provided
  const getInitials = () => {
    if (initials) return initials;
    
    // Generate random two letters for avatar
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const first = letters[Math.floor(Math.random() * letters.length)];
    const second = letters[Math.floor(Math.random() * letters.length)];
    
    return `${first}${second}`;
  };
  
  // Get size dimensions
  const getSizeDimensions = () => {
    switch(size) {
      case 'sm': return { width: '32px', height: '32px', fontSize: '0.75rem' };
      case 'lg': return { width: '64px', height: '64px', fontSize: '1.25rem' };
      case 'md':
      default: return { width: '48px', height: '48px', fontSize: '1rem' };
    }
  };
  
  // Generate border color that's darker than the background but in the same hue
  const getBorderColor = () => {
    try {
      const color = new Color(backgroundColor);
      
      // Calculate a darker version of the same color for the border
      // For subtle borders, darken less; for strong borders, darken more
      const amount = borderLevel === 'subtle' ? 0.1 : 0.2;
      
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
  };

  const dimensions = getSizeDimensions();
  const borderColor = showBorder ? getBorderColor() : 'transparent';
  const borderWidth = showBorder ? '1px' : '0';
  const borderStyle = 'solid';
  
  return (
    <div 
      className="avatar"
      style={{
        backgroundColor,
        color: foregroundColor,
        width: dimensions.width,
        height: dimensions.height,
        fontSize: dimensions.fontSize,
        borderColor,
        borderWidth,
        borderStyle
      }}
    >
      {getInitials()}
    </div>
  );
};

export default Avatar; 
