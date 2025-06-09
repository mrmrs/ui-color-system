import React from 'react';
import { getWCAGComplianceLevel, getAPCAComplianceDescription, generateBorderColor, generateGradientBackground } from '../utils/colorUtils';
import type { ContrastAlgorithm, BackgroundVariant, GradientType, GradientDirection } from '../utils/colorUtils';

type GradientBadgeProps = {
  backgroundColor: string;
  foregroundColor: string;
  contrast: number;
  algorithm: ContrastAlgorithm;
  label?: string;
  bgHue?: string;
  fgHue?: string;
  compact?: boolean;
  showBorder?: boolean;
  borderLevel?: 'subtle' | 'strong';
  backgroundVariant?: BackgroundVariant;
  gradientType?: GradientType;
  gradientDirection?: GradientDirection;
  hueShift?: number;
};

const GradientBadge: React.FC<GradientBadgeProps> = ({
  backgroundColor,
  foregroundColor,
  contrast,
  algorithm,
  label = 'For Sale',
  bgHue,
  fgHue,
  compact = false,
  showBorder = false,
  borderLevel = 'subtle',
  backgroundVariant = 'solid',
  gradientType = 'linear',
  gradientDirection = 'to right',
  hueShift = 10
}) => {
  // Get compliance level based on algorithm
  const complianceInfo = algorithm === 'WCAG21'
    ? getWCAGComplianceLevel(contrast)
    : getAPCAComplianceDescription(contrast);

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

  if (compact) {
    return (
      <div 
        className="badge-compact"
        style={{ 
          background,
          color: foregroundColor,
          maxWidth: '16ch',
          ...borderStyles
        }}
      >
        {label}
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
