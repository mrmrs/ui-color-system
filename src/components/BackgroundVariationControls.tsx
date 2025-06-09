import React from 'react';
import type { BackgroundVariant, GradientType, GradientDirection, GradientHueMode } from '../utils/colorUtils';

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
  hueStep: number;
  onHueStepChange: (step: number) => void;
  hueMode: GradientHueMode;
  onHueModeChange: (mode: GradientHueMode) => void;
  onRegenerateGradient?: () => void;
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
  hueStep,
  onHueStepChange,
  hueMode,
  onHueModeChange,
  onRegenerateGradient
}) => {
  // Check if regenerate button should be shown (for random or adjacent hue modes)
  const showRegenerateButton = 
    backgroundVariant === 'gradient' && 
    (hueMode === 'random-hue' || hueMode === 'adjacent-hue');

  return (
    <div className="background-variation-controls" style={{ borderRadius: 0, border: '1px solid currentColor', margin: '1em' }}>
      <div className="control-section">
        <h4 style={{ margin: 0, fontSize: '12px'}}>Background Type</h4>
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
            <h4 style={{ fontSize: '12px', margin: 0 }}>Gradient Type</h4>
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
              <h4 style={{ fontSize: '12px', margin: 0 }}>Direction</h4>
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
            <h4 style={{ fontSize: '12px', margin: 0 }}>Hue Mode</h4>
            <div className="control-options">
              <label className="radio-label">
                <input
                  type="radio"
                  name="hueMode"
                  value="same-hue"
                  checked={hueMode === 'same-hue'}
                  onChange={() => onHueModeChange('same-hue')}
                />
                <span>Same Hue</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="hueMode"
                  value="adjacent-hue"
                  checked={hueMode === 'adjacent-hue'}
                  onChange={() => onHueModeChange('adjacent-hue')}
                />
                <span>Adjacent</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="hueMode"
                  value="complementary-hue"
                  checked={hueMode === 'complementary-hue'}
                  onChange={() => onHueModeChange('complementary-hue')}
                />
                <span>Complementary</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="hueMode"
                  value="random-hue"
                  checked={hueMode === 'random-hue'}
                  onChange={() => onHueModeChange('random-hue')}
                />
                <span>Random</span>
              </label>
            </div>
            
            {showRegenerateButton && onRegenerateGradient && (
              <div style={{ marginTop: '8px' }}>
                <button 
                  onClick={onRegenerateGradient}
                  style={{ 
                    padding: '4px 8px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    background: 'transparent',
                    border: '1px solid currentColor',
                    borderRadius: '4px'
                  }}
                >
                  ↻ Regenerate
                </button>
              </div>
            )}
          </div>
          
          <div className="control-section">
            <label>
              {hueMode === 'same-hue' 
                ? (hueStep === 1 ? 'Adjacent color in palette' : `${hueStep} steps in palette`) 
                : `Intensity level ${hueStep}/5`}
              <br />
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={hueStep}
                onChange={(e) => onHueStepChange(parseInt(e.target.value))}
              />
            </label>
          </div>
        </>
      )}
      
      <div className="control-section">
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
                <span>Subtle (1 step)</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="borderLevel"
                  value="strong"
                  checked={borderLevel === 'strong'}
                  onChange={() => onBorderLevelChange('strong')}
                />
                <span>Strong (2 steps)</span>
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BackgroundVariationControls; 
