import React from 'react';
import { getWCAGComplianceLevel, getAPCAComplianceDescription } from '../utils/colorUtils';
import type { ContrastAlgorithm } from '../utils/colorUtils';

type ContrastMeterProps = {
  contrast: number;
  algorithm: ContrastAlgorithm;
};

const ContrastMeter: React.FC<ContrastMeterProps> = ({
  contrast,
  algorithm
}) => {
  // Different thresholds for each algorithm
  const getThresholds = () => {
    if (algorithm === 'WCAG21') {
      return [3, 4.5, 7];
    } else {
      // APCA thresholds
      return [45, 60, 75, 90];
    }
  };
  
  const thresholds = getThresholds();
  
  // Calculate percentage for the meter
  const calculatePercentage = (): number => {
    if (algorithm === 'WCAG21') {
      // WCAG: Max visual at 10:1 (scale 0-10)
      const maxVisual = 10;
      return Math.min((contrast / maxVisual) * 100, 100);
    } else {
      // APCA: Max visual at 110 (scale 0-110)
      const maxVisual = 110;
      return Math.min((contrast / maxVisual) * 100, 100);
    }
  };
  
  const percentage = calculatePercentage();
  
  // Determine color based on compliance level
  const getColor = (): string => {
    if (algorithm === 'WCAG21') {
      const level = getWCAGComplianceLevel(contrast);
      switch (level) {
        case 'AAA': return '#10b981'; // green
        case 'AA': return '#22c55e'; // lighter green
        case 'A': return '#f59e0b'; // amber
        default: return '#ef4444'; // red
      }
    } else {
      if (contrast >= 90) return '#10b981'; // Perfect - green
      if (contrast >= 75) return '#22c55e'; // Excellent - lighter green  
      if (contrast >= 60) return '#22d3ee'; // Good - teal
      if (contrast >= 45) return '#f59e0b'; // Acceptable - amber
      return '#ef4444'; // red
    }
  };
  
  // Get text description of compliance
  const getComplianceText = (): string => {
    if (algorithm === 'WCAG21') {
      return `${getWCAGComplianceLevel(contrast)} (${contrast.toFixed(2)}:1)`;
    } else {
      return `${getAPCAComplianceDescription(contrast)} (${contrast.toFixed(0)} Lc)`;
    }
  };
  
  return (
    <div className="contrast-meter">
      <div className="contrast-meter-header">
        <span className="contrast-rating">{getComplianceText()}</span>
      </div>
      
      <div className="meter-container">
        <div 
          className="meter-fill" 
          style={{ 
            width: `${percentage}%`,
            backgroundColor: getColor()
          }}
        />
        
        {/* Threshold markers */}
        {thresholds.map((threshold, index) => {
          const thresholdPercentage = algorithm === 'WCAG21' 
            ? (threshold / 10) * 100 
            : (threshold / 110) * 100;
            
          return (
            <div 
              key={index}
              className="threshold-marker"
              style={{ left: `${thresholdPercentage}%` }}
            >
              <div className="marker-line"></div>
              <span className="marker-label">{threshold}</span>
            </div>
          );
        })}
      </div>
      
      <div className="contrast-legend">
        {algorithm === 'WCAG21' ? (
          <>
            <span className="legend-item fail">Fail</span>
            <span className="legend-item a">A</span>
            <span className="legend-item aa">AA</span>
            <span className="legend-item aaa">AAA</span>
          </>
        ) : (
          <>
            <span className="legend-item fail">Insufficient</span>
            <span className="legend-item minimal">Minimal</span>
            <span className="legend-item good">Good</span>
            <span className="legend-item excellent">Excellent</span>
          </>
        )}
      </div>
    </div>
  );
};

export default ContrastMeter; 