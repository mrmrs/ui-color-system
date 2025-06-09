import React from 'react';
import Color from 'colorjs.io';
import { calculateContrast } from '../utils/colorUtils';

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

  // Format contrast for display, with color coding based on accessibility level
  const formatContrast = (contrast: number, algorithm: 'WCAG21' | 'APCA'): React.ReactNode => {
    let color;
    let label = algorithm === 'WCAG21' ? contrast.toFixed(1) : Math.abs(contrast).toFixed(0);
    
    if (algorithm === 'WCAG21') {
      if (contrast >= 7) color = 'rgb(0, 200, 0)'; // AAA - Green
      else if (contrast >= 4.5) color = 'rgb(200, 200, 0)'; // AA - Yellow
      else if (contrast >= 3) color = 'rgb(255, 140, 0)'; // A - Orange
      else color = 'rgb(255, 70, 70)'; // Fail - Red
    } else {
      // APCA values (using absolute value since APCA can be negative)
      const absContrast = Math.abs(contrast);
      if (absContrast >= 90) color = 'rgb(0, 200, 0)'; // Perfect - Green
      else if (absContrast >= 75) color = 'rgb(100, 200, 100)'; // Excellent - Light Green
      else if (absContrast >= 60) color = 'rgb(200, 200, 0)'; // Good - Yellow
      else if (absContrast >= 45) color = 'rgb(255, 140, 0)'; // Acceptable - Orange
      else color = 'rgb(255, 70, 70)'; // Insufficient - Red
    }
    
    return <span style={{ color, fontWeight: 'bold' }}>{label}</span>;
  };

  const modalStyle: React.CSSProperties = {
    maxWidth: '96vw',
    maxHeight: '96vh',
    overflowY: 'auto',
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={modalStyle}>
        <div className="modal-header">
          <h2 style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0, padding: '16px' }}>🎨 Palette</h2>
          <button className="close-button" style={{ marginRight: '16px' }}onClick={onClose}>×</button>
        </div>
        
        <div className="contrast-legend" style={{ padding: '0 16px', marginBottom: '8px', fontSize: '12px', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
          <p style={{ margin: 0, fontWeight: 'bold' }}>Legend:</p>
          <div>WCAG 2.1: <span style={{ color: 'rgb(0, 200, 0)' }}>≥7 (AAA)</span> | <span style={{ color: 'rgb(200, 200, 0)' }}>≥4.5 (AA)</span> | <span style={{ color: 'rgb(255, 140, 0)' }}>≥3 (A)</span> | <span style={{ color: 'rgb(255, 70, 70)' }}>&lt;3 (Fail)</span></div>
          <div>APCA: <span style={{ color: 'rgb(0, 200, 0)' }}>≥90 (Perfect)</span> | <span style={{ color: 'rgb(100, 200, 100)' }}>≥75 (Excellent)</span> | <span style={{ color: 'rgb(200, 200, 0)' }}>≥60 (Good)</span> | <span style={{ color: 'rgb(255, 140, 0)' }}>≥45 (Acceptable)</span> | <span style={{ color: 'rgb(255, 70, 70)' }}>&lt;45 (Insufficient)</span></div>
        </div>
        
        <div className="modal-body" style={{ display: 'grid', gap: '4px' }}>
          {Object.entries(colors).map(([hueName, colorValues]) => (
            <div key={hueName} className="color-scale">
              <h3 style={{ display: 'none', fontSize: '14px', marginTop: 0, marginBottom: '8px' }}>{hueName}</h3>
              <div className="color-chips" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(96px, 1fr))', gap: '4px' }}>
                {colorValues.map((colorValue, index) => {
                  const textColor = getTextColor(colorValue);
                  
                  // Calculate contrast with white and black
                  const whiteContrastWCAG = calculateContrast('white', colorValue, 'WCAG21');
                  const blackContrastWCAG = calculateContrast('black', colorValue, 'WCAG21');
                  const whiteContrastAPCA = calculateContrast('white', colorValue, 'APCA');
                  const blackContrastAPCA = calculateContrast('black', colorValue, 'APCA');
                  
                  return (
                    <div 
                      key={index} 
                      className="color-chip"
                      style={{ 
                        backgroundColor: colorValue,
                        color: textColor,
                        padding: '8px',
                        borderRadius: '4px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <code className="color-index" style={{ fontWeight: '400', fontSize: '10px' }}>{index}</code>
                      </div>
                      <div style={{ fontSize: '11px' }}>
                        <div style={{ color: 'white' }}>
                          <span title="WCAG contrast with white" style={{ height: '8px', width: '8px', borderRadius: '9999px', background: 'white'}}></span>
                          <div>
                            <span style={{ marginRight: '4px' }}>W {formatContrast(whiteContrastWCAG, 'WCAG21')}</span>
                            <span>A {formatContrast(whiteContrastAPCA, 'APCA')}</span>
                          </div>
                        </div>
                        <div style={{ color: 'black'}}>
                          <span title="WCAG contrast with black" style={{ height: '8px', width: '8px', background: 'black', borderRadius: '9999px' }}></span>
                          <div>
                            <span style={{ marginRight: '4px' }}>W {formatContrast(blackContrastWCAG, 'WCAG21')}</span>
                            <span>A {formatContrast(blackContrastAPCA, 'APCA')}</span>
                          </div>
                        </div>
                      </div>
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
