import React from 'react';
import Color from 'colorjs.io';

type ColorPaletteModalProps = {
  colors: Record<string, string[]>;
  isOpen: boolean;
  onClose: () => void;
};

const ColorPaletteModal: React.FC<ColorPaletteModalProps> = ({ colors, isOpen, onClose }) => {
  if (!isOpen) return null;

  // Create a function to determine text color based on background
  const getTextColor = (backgroundColor: string): string => {
    try {
      const color = new Color(backgroundColor);
      // Calculate luminance - a simple approach
      const luminance = 
        0.299 * color.coords[0] + 
        0.587 * color.coords[1] + 
        0.114 * color.coords[2];
      
      // Return white for dark backgrounds, black for light backgrounds
      return luminance < 0.5 ? 'white' : 'black';
    } catch (error) {
      return 'black'; // Default fallback
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Color Palette</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          {Object.entries(colors).map(([hueName, colorValues]) => (
            <div key={hueName} className="color-scale">
              <h3>{hueName}</h3>
              <div className="color-chips">
                {colorValues.map((colorValue, index) => {
                  const textColor = getTextColor(colorValue);
                  return (
                    <div 
                      key={index} 
                      className="color-chip"
                      style={{ 
                        backgroundColor: colorValue,
                        color: textColor
                      }}
                    >
                      <span className="color-index">{index}</span>
                      <span className="color-value">{colorValue}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ColorPaletteModal; 