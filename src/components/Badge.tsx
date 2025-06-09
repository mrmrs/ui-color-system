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
  label = 'Sale',
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
          maxWidth: '32ch',
          borderWidth: '1px',
	  display: 'inline-flex',
	  alignItems: 'center',
	  gap: '4px',
        }}
      >
        {label}
		<svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 16 16 12 12 8"></polyline><line x1="8" y1="12" x2="16" y2="12"></line></svg>
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
