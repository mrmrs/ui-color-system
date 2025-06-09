import React from 'react';
import { getWCAGComplianceLevel, getAPCAComplianceDescription, getBorderColorFromPalette, generatePaletteGradient } from '../utils/colorUtils';
import type { ContrastAlgorithm, BackgroundVariant, GradientType, GradientDirection, GradientHueMode } from '../utils/colorUtils';

type GradientBadgeProps = {
  backgroundColor: string;
  foregroundColor: string;
  contrast: number;
  algorithm: ContrastAlgorithm;
  label?: string;
  bgHue?: string;
  fgHue?: string;
  bgIndex?: number;
  compact?: boolean;
  showBorder?: boolean;
  borderLevel?: 'subtle' | 'strong';
  backgroundVariant?: BackgroundVariant;
  gradientType?: GradientType;
  gradientDirection?: GradientDirection;
  hueStep?: number;
  hueMode?: GradientHueMode;
  colorPalette?: Record<string, string[]>;
};

const GradientBadge: React.FC<GradientBadgeProps> = ({
  backgroundColor,
  foregroundColor,
  contrast,
  algorithm,
  label = 'Click',
  bgHue,
  fgHue,
  bgIndex,
  compact = false,
  showBorder = false,
  borderLevel = 'subtle',
  backgroundVariant = 'solid',
  gradientType = 'linear',
  gradientDirection = 'to right',
  hueStep = 2,
  hueMode = 'same-hue',
  colorPalette = {}
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

  const background = getBackground();
  const borderStyles = getBorder();

  if (compact) {
    return (
      <div 
        className="badge-compact"
        style={{ 
          background,
          color: foregroundColor,
          maxWidth: '16ch',
	  display: 'inline-flex',
	  alignItems: 'center',
	  gap: '4px',
          ...borderStyles
        }}
      >
        {label}
<svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </div>
    );
  }

  return (
    <div className="badge-container">
      <div 
        className="badge" 
        style={{ 
          background,
          color: foregroundColor,
          ...borderStyles
        }}
      >
        {label}
      </div>
      <div className="badge-info">
        <div className="contrast-info">
          <span>Contrast: {contrast.toFixed(2)}</span>
          <span className={`compliance-level ${algorithm === 'WCAG21' ? complianceInfo.toLowerCase() : ''}`}>
            {complianceInfo}
          </span>
        </div>
        {(bgHue || fgHue) && (
          <div className="hue-info">
            {bgHue && <span>BG: {bgHue}</span>}
            {fgHue && <span>FG: {fgHue}</span>}
          </div>
        )}
        <div className="color-codes">
          <span>BG: {backgroundVariant === 'gradient' ? 'Gradient' : backgroundColor}</span>
          <span>FG: {foregroundColor}</span>
        </div>
      </div>
    </div>
  );
};

export default GradientBadge; 
