import React from 'react';
import type { BackgroundVariant, GradientType, GradientDirection } from '../utils/colorUtils';

type BackgroundVariationControlsProps = {
  showBorders: boolean;
  onToggleBorders: () => void;
  borderLevel: 'subtle' | 'strong';
  onBorderLevelChange: (level: 'subtle' | 'strong') => void;
  backgroundVariant: BackgroundVariant;
  onBackgroundVariantChange: (variant: BackgroundVariant) => void;
  gradientType: GradientType;
  onGradientTypeChange: (type: GradientType) => void;
  gradientDirection: GradientDirection;
  onGradientDirectionChange: (direction: GradientDirection) => void;
  hueShift: number;
  onHueShiftChange: (shift: number) => void;
};

const BackgroundVariationControls: React.FC<BackgroundVariationControlsProps> = ({
  showBorders,
  onToggleBorders,
  borderLevel,
  onBorderLevelChange,
  backgroundVariant,
  onBackgroundVariantChange,
  gradientType,
  onGradientTypeChange,
  gradientDirection,
  onGradientDirectionChange,
  hueShift,
  onHueShiftChange
}) => {
  return (
    <div className="background-variation-controls">
      <h3>Background Variations</h3>
      
      <div className="control-section">
        <h4>Background Type</h4>
        <div className="control-options">
          <label className="radio-label">
            <input
              type="radio"
              name="backgroundVariant"
              value="solid"
              checked={backgroundVariant === 'solid'}
              onChange={() => onBackgroundVariantChange('solid')}
            />
            <span>Solid</span>
          </label>
          <label className="radio-label">
            <input
              type="radio"
              name="backgroundVariant"
              value="gradient"
              checked={backgroundVariant === 'gradient'}
              onChange={() => onBackgroundVariantChange('gradient')}
            />
            <span>Gradient</span>
          </label>
        </div>
      </div>
      
      {backgroundVariant === 'gradient' && (
        <>
          <div className="control-section">
            <h4>Gradient Type</h4>
            <div className="control-options">
              <label className="radio-label">
                <input
                  type="radio"
                  name="gradientType"
                  value="linear"
                  checked={gradientType === 'linear'}
                  onChange={() => onGradientTypeChange('linear')}
                />
                <span>Linear</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="gradientType"
                  value="radial"
                  checked={gradientType === 'radial'}
                  onChange={() => onGradientTypeChange('radial')}
                />
                <span>Radial</span>
              </label>
            </div>
          </div>
          
          {gradientType === 'linear' && (
            <div className="control-section">
              <h4>Gradient Direction</h4>
              <div className="control-options direction-options">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="gradientDirection"
                    value="to right"
                    checked={gradientDirection === 'to right'}
                    onChange={() => onGradientDirectionChange('to right')}
                  />
                  <span>→</span>
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="gradientDirection"
                    value="to bottom"
                    checked={gradientDirection === 'to bottom'}
                    onChange={() => onGradientDirectionChange('to bottom')}
                  />
                  <span>↓</span>
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="gradientDirection"
                    value="to bottom right"
                    checked={gradientDirection === 'to bottom right'}
                    onChange={() => onGradientDirectionChange('to bottom right')}
                  />
                  <span>↘</span>
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="gradientDirection"
                    value="to bottom left"
                    checked={gradientDirection === 'to bottom left'}
                    onChange={() => onGradientDirectionChange('to bottom left')}
                  />
                  <span>↙</span>
                </label>
              </div>
            </div>
          )}
          
          <div className="control-section">
            <h4>Hue Shift: {hueShift}°</h4>
            <input
              type="range"
              min="0"
              max="60"
              step="5"
              value={hueShift}
              onChange={(e) => onHueShiftChange(parseInt(e.target.value))}
              className="hue-shift-slider"
            />
          </div>
        </>
      )}
      
      <div className="control-section">
        <h4>Borders</h4>
        <div className="border-controls">
          <label className="toggle-label">
            <input
              type="checkbox"
              checked={showBorders}
              onChange={onToggleBorders}
            />
            <span>Show Borders</span>
          </label>
          
          {showBorders && (
            <div className="border-level-options">
              <label className="radio-label">
                <input
                  type="radio"
                  name="borderLevel"
                  value="subtle"
                  checked={borderLevel === 'subtle'}
                  onChange={() => onBorderLevelChange('subtle')}
                />
                <span>Subtle</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="borderLevel"
                  value="strong"
                  checked={borderLevel === 'strong'}
                  onChange={() => onBorderLevelChange('strong')}
                />
                <span>Strong</span>
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BackgroundVariationControls; 