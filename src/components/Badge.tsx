import React from 'react';
import { getWCAGComplianceLevel, getAPCAComplianceDescription } from '../utils/colorUtils';
import type { ContrastAlgorithm } from '../utils/colorUtils';

type BadgeProps = {
  backgroundColor: string;
  foregroundColor: string;
  contrast: number;
  algorithm: ContrastAlgorithm;
  label?: string;
  bgHue?: string;
  fgHue?: string;
  compact?: boolean;
}

const Badge = ({ 
  backgroundColor, 
  foregroundColor, 
  contrast,
  algorithm,
  label = 'For Sale',
  bgHue,
  fgHue,
  compact = false
}: BadgeProps) => {
  // Get compliance level based on algorithm
  const complianceInfo = algorithm === 'WCAG21'
    ? getWCAGComplianceLevel(contrast)
    : getAPCAComplianceDescription(contrast);

  if (compact) {
    return (
      <div 
        className="badge-compact"
        style={{ 
          backgroundColor,
          color: foregroundColor,
          maxWidth: '16ch',
          borderWidth: '1px',
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
          backgroundColor,
          color: foregroundColor,
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
          <span>BG: {backgroundColor}</span>
          <span>FG: {foregroundColor}</span>
        </div>
      </div>
    </div>
  );
};

export default Badge; 
