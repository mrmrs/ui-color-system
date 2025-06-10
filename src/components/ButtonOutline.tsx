import React from 'react';
import { calculateContrast } from '../utils/colorUtils';
import type { ContrastAlgorithm } from '../utils/colorUtils';

type ButtonSize = 'sm' | 'md' | 'lg';

type ButtonOutlineProps = {
  outlineColor: string;
  pageBackgroundColor: string;
  contrast: number;
  algorithm: ContrastAlgorithm;
  bgHue?: string;
  fgHue?: string;
  label?: string;
  size?: ButtonSize;
  borderWidth?: string;
  onClick?: () => void;
};

const ButtonOutline: React.FC<ButtonOutlineProps> = ({
  outlineColor,
  pageBackgroundColor,
  contrast,
  algorithm,
  bgHue,
  fgHue,
  label = 'Button',
  size = 'md',
  borderWidth = '1px',
  onClick
}) => {
  // Define size-specific styles
  const sizeStyles = {
    sm: {
      padding: '4px 8px',
      fontSize: '12px',
      borderRadius: '4px'
    },
    md: {
      padding: '8px 16px',
      fontSize: '14px',
      borderRadius: '6px'
    },
    lg: {
      padding: '12px 24px',
      fontSize: '16px',
      borderRadius: '8px'
    }
  };

  // Check if the outline color has sufficient contrast with the page background
  const isAccessible = (algorithm === 'WCAG21' && contrast >= 4.5) || 
                      (algorithm === 'APCA' && Math.abs(contrast) >= 60);

  // If not accessible, add a warning indicator
  const accessibilityWarning = !isAccessible ? (
    <span 
      style={{ 
        position: 'absolute', 
        top: '-8px', 
        right: '-8px',
        backgroundColor: 'rgba(255, 70, 70, 0.9)',
        color: 'white',
        borderRadius: '50%',
        width: '16px',
        height: '16px',
        fontSize: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold'
      }}
      title={`Low contrast: ${contrast.toFixed(2)} - May be difficult to see against the page background`}
    >
      !
    </span>
  ) : null;

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        className="color-system-button-outline"
        style={{
          backgroundColor: 'transparent',
          color: outlineColor,
          border: `${borderWidth} solid ${outlineColor}`,
          ...sizeStyles[size],
          cursor: 'pointer',
          fontWeight: 500,
          transition: 'all 0.2s ease',
          position: 'relative'
        }}
        onClick={onClick}
      >
        {label}
      </button>
      {accessibilityWarning}
    </div>
  );
};

// Component to show both normal and hover states
export const ButtonOutlinePreview: React.FC<ButtonOutlineProps> = (props) => {
  // Calculate contrast on hover (simulated inverse: background becomes outline color, text becomes page background)
  const hoverContrast = calculateContrast(
    props.pageBackgroundColor, 
    props.outlineColor, 
    props.algorithm
  );

  // Define size-specific styles (same as in ButtonOutline)
  const sizeStyles = {
    sm: {
      padding: '4px 8px',
      fontSize: '12px',
      borderRadius: '4px'
    },
    md: {
      padding: '8px 16px',
      fontSize: '14px',
      borderRadius: '6px'
    },
    lg: {
      padding: '12px 24px',
      fontSize: '16px',
      borderRadius: '8px'
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div>
        <ButtonOutline {...props} />
        <span style={{ marginLeft: '8px', fontSize: '12px', opacity: 0.7 }}>
          Normal: {props.contrast.toFixed(1)}
        </span>
      </div>
      <div>
        <button
          className="color-system-button-outline-hover"
          style={{
            backgroundColor: props.outlineColor,
            color: props.pageBackgroundColor,
            border: `${props.borderWidth || '1px'} solid ${props.outlineColor}`,
            ...sizeStyles[props.size || 'md'],
            cursor: 'pointer',
            fontWeight: 500,
            transition: 'all 0.2s ease',
          }}
        >
          {props.label || 'Button'}
        </button>
        <span style={{ marginLeft: '8px', fontSize: '12px', opacity: 0.7 }}>
          Hover: {hoverContrast.toFixed(1)}
        </span>
      </div>
    </div>
  );
};

export default ButtonOutline; 