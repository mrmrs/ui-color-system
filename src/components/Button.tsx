import React from 'react';
import { getWCAGComplianceLevel, getAPCAComplianceDescription, getBorderColorFromPalette, generatePaletteGradient } from '../utils/colorUtils';
import type { ContrastAlgorithm, BackgroundVariant, GradientType, GradientDirection, GradientHueMode } from '../utils/colorUtils';

type ButtonSize = 'sm' | 'md' | 'lg';

type ButtonProps = {
  backgroundColor: string;
  foregroundColor: string;
  contrast: number;
  algorithm: ContrastAlgorithm;
  bgHue?: string;
  fgHue?: string;
  bgIndex?: number;
  label?: string;
  size?: ButtonSize;
  showBorder?: boolean;
  borderLevel?: 'subtle' | 'strong';
  backgroundVariant?: BackgroundVariant;
  gradientType?: GradientType;
  gradientDirection?: GradientDirection;
  hueStep?: number;
  hueMode?: GradientHueMode;
  colorPalette?: Record<string, string[]>;
  onClick?: () => void;
};

const Button: React.FC<ButtonProps> = ({
  backgroundColor,
  foregroundColor,
  contrast,
  algorithm,
  bgHue,
  fgHue,
  bgIndex,
  label = 'Button',
  size = 'md',
  showBorder = false,
  borderLevel = 'subtle',
  backgroundVariant = 'solid',
  gradientType = 'linear',
  gradientDirection = 'to right',
  hueStep = 2,
  hueMode = 'same-hue',
  colorPalette = {},
  onClick
}) => {
  // Get compliance level based on algorithm
  const complianceInfo = algorithm === 'WCAG21'
    ? getWCAGComplianceLevel(contrast)
    : getAPCAComplianceDescription(contrast);

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

  // Define size-specific styles
  const sizeStyles = {
    sm: {
      padding: '8px 32px',
      fontSize: '12px',
      borderRadius: '4px'
    },
    md: {
      padding: '8px 32px',
      fontSize: '14px',
      borderRadius: '6px'
    },
    lg: {
      padding: '16px 32px',
      fontSize: '16px',
      borderRadius: '8px'
    }
  };

  const background = getBackground();
  const borderStyles = getBorder();

  return (
    <button
      className="color-system-button"
      style={{
        background,
        color: foregroundColor,
        ...sizeStyles[size],
        ...borderStyles,
        cursor: 'pointer',
        fontWeight: 500,
        transition: 'all 0.2s ease',
        border: borderStyles.borderWidth === '0' ? '1px solid transparent' : undefined,
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px'
      }}
      onClick={onClick}
    >
      {label}
<svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
    </button>
  );
};

export default Button; 
