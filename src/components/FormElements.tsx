import React, { useState, useEffect } from 'react';

type FormElementsProps = {
  palette: Record<string, string[]>;
  isDarkMode: boolean;
  pageBackgroundColor: string;
};

// Common variant types
type VariantType = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';

const FormElements: React.FC<FormElementsProps> = ({ 
  palette, 
  isDarkMode,
  pageBackgroundColor 
}) => {
  // Generate random placeholder values for regeneration
  const [randomSeed, setRandomSeed] = useState(Math.floor(Math.random() * 1000));
  
  // Update random seed when component is re-rendered with a new key
  useEffect(() => {
    setRandomSeed(Math.floor(Math.random() * 1000));
  }, []);
  
  // Generate random placeholders
  const placeholders = {
    input1: ['Enter your name', 'Type your username', 'Enter text here', 'Your full name'][randomSeed % 4],
    input2: ['Email address', 'Your email', 'Work email', 'Enter email'][randomSeed % 4],
    textarea: ['Tell us about yourself', 'Add your comments', 'Describe your experience', 'Additional notes'][randomSeed % 4],
    select: ['Select an option', 'Choose one', 'Pick a value', 'Select item'][randomSeed % 4]
  };
  
  // Random checkbox state
  const [checkboxState, setCheckboxState] = useState({
    checkbox1: Boolean(randomSeed % 2),
    checkbox2: Boolean((randomSeed + 1) % 2),
    radio1: randomSeed % 3
  });
  
  // Random slider value
  const sliderValue = 20 + (randomSeed % 60);

  // Determine appropriate colors from the palette
  const hues = Object.keys(palette);
  const hasGreen = hues.includes('green');
  const hasRed = hues.includes('red');
  const hasBlue = hues.includes('blue') || hues.includes('cyan');
  const hasPurple = hues.includes('purple') || hues.includes('violet') || hues.includes('indigo');
  const hasGray = hues.includes('gray') || hues.includes('slate-gray');
  
  // Choose appropriate hues based on availability
  const primaryHue = hasBlue ? (hues.includes('blue') ? 'blue' : 'cyan') : (hues[0] !== 'gray' ? hues[0] : hues[1]);
  const secondaryHue = hasPurple ? (hues.includes('purple') ? 'purple' : hues.includes('violet') ? 'violet' : 'indigo') : (hues[1] !== 'gray' ? hues[1] : hues[0]);
  const successHue = hasGreen ? 'green' : primaryHue;
  const errorHue = hasRed ? 'red' : (hues.includes('magenta') ? 'magenta' : primaryHue);
  const neutralHue = hasGray ? (hues.includes('gray') ? 'gray' : 'slate-gray') : hues[0];
  
  // For dark mode, use higher indices (lighter colors)
  // For light mode, use lower indices (darker colors)
  const colorIndex = isDarkMode ? 7 : 5;
  const lightColorIndex = isDarkMode ? 3 : 13; // For subtle backgrounds
  
  // Function to get a text color with good contrast against a background
  const getTextColor = (bgHue: string, bgIndex: number) => {
    // Simple contrast determination
    return isDarkMode ? palette[neutralHue][15] : palette[neutralHue][0];
  };
  
  // Get colors for various form states
  const colorMap = {
    default: {
      bg: palette[neutralHue][lightColorIndex],
      border: palette[neutralHue][colorIndex],
      text: getTextColor(neutralHue, lightColorIndex)
    },
    primary: {
      bg: palette[primaryHue][lightColorIndex],
      border: palette[primaryHue][colorIndex],
      text: palette[primaryHue][colorIndex]
    },
    secondary: {
      bg: palette[secondaryHue][lightColorIndex],
      border: palette[secondaryHue][colorIndex],
      text: palette[secondaryHue][colorIndex]
    },
    success: {
      bg: palette[successHue][lightColorIndex],
      border: palette[successHue][colorIndex],
      text: palette[successHue][colorIndex]
    },
    error: {
      bg: palette[errorHue][lightColorIndex],
      border: palette[errorHue][colorIndex],
      text: palette[errorHue][colorIndex]
    }
  };

  return (
    <div style={{ marginBottom: '32px' }}>
      <h3 style={{ marginBottom: '16px', fontSize: '16px' }}>Form Elements</h3>
      
      <div style={{ 
        backgroundColor: pageBackgroundColor,
        padding: '24px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`
      }}>
        <div style={{ marginBottom: '24px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px',
            fontSize: '14px',
            fontWeight: 500
          }}>
            Default Text Input
          </label>
          <input 
            type="text" 
            placeholder={placeholders.input1}
            style={{
              width: '100%',
              padding: '8px 12px',
              fontSize: '14px',
              borderRadius: '4px',
              border: `1px solid ${colorMap.default.border}`,
              backgroundColor: pageBackgroundColor,
              color: colorMap.default.text,
              outline: 'none',
            }}
          />
        </div>
        
        <div style={{ marginBottom: '24px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px',
            fontSize: '14px',
            fontWeight: 500,
            color: colorMap.primary.text
          }}>
            Primary Text Input
          </label>
          <input 
            type="text" 
            placeholder={placeholders.input2}
            style={{
              width: '100%',
              padding: '8px 12px',
              fontSize: '14px',
              borderRadius: '4px',
              border: `1px solid ${colorMap.primary.border}`,
              backgroundColor: pageBackgroundColor,
              color: colorMap.default.text,
              outline: 'none',
            }}
          />
        </div>
        
        <div style={{ marginBottom: '24px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px',
            fontSize: '14px',
            fontWeight: 500,
            color: colorMap.error.text
          }}>
            Error Text Input
          </label>
          <input 
            type="text" 
            placeholder={placeholders.input1}
            style={{
              width: '100%',
              padding: '8px 12px',
              fontSize: '14px',
              borderRadius: '4px',
              border: `1px solid ${colorMap.error.border}`,
              backgroundColor: pageBackgroundColor,
              color: colorMap.default.text,
              outline: 'none',
            }}
          />
          <div style={{ 
            marginTop: '4px', 
            fontSize: '12px', 
            color: colorMap.error.text 
          }}>
            This field is required
          </div>
        </div>
        
        <div style={{ marginBottom: '24px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px',
            fontSize: '14px',
            fontWeight: 500
          }}>
            Text Area
          </label>
          <textarea 
            placeholder={placeholders.textarea}
            rows={4}
            style={{
              width: '100%',
              padding: '8px 12px',
              fontSize: '14px',
              borderRadius: '4px',
              border: `1px solid ${colorMap.default.border}`,
              backgroundColor: pageBackgroundColor,
              color: colorMap.default.text,
              outline: 'none',
              resize: 'vertical'
            }}
          />
        </div>
        
        <div style={{ marginBottom: '24px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px',
            fontSize: '14px',
            fontWeight: 500
          }}>
            Select Input
          </label>
          <div style={{ position: 'relative' }}>
            <select 
              style={{
                width: '100%',
                padding: '8px 12px',
                fontSize: '14px',
                borderRadius: '4px',
                border: `1px solid ${colorMap.default.border}`,
                backgroundColor: pageBackgroundColor,
                color: colorMap.default.text,
                outline: 'none',
                appearance: 'none'
              }}
            >
              <option value="">{placeholders.select}</option>
              <option value="1">Option 1</option>
              <option value="2">Option 2</option>
              <option value="3">Option 3</option>
            </select>
            <div style={{ 
              position: 'absolute', 
              top: '50%', 
              right: '12px', 
              transform: 'translateY(-50%)',
              pointerEvents: 'none'
            }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
          </div>
        </div>
        
        <div style={{ marginBottom: '24px' }}>
          <div style={{ 
            display: 'flex', 
            gap: '16px',
            flexWrap: 'wrap'
          }}>
            <label style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer'
            }}>
              <input 
                type="checkbox" 
                checked={checkboxState.checkbox1}
                onChange={() => setCheckboxState(prev => ({ ...prev, checkbox1: !prev.checkbox1 }))}
                style={{
                  accentColor: colorMap.primary.border
                }}
              />
              <span>Checkbox 1</span>
            </label>
            
            <label style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer'
            }}>
              <input 
                type="checkbox" 
                checked={checkboxState.checkbox2}
                onChange={() => setCheckboxState(prev => ({ ...prev, checkbox2: !prev.checkbox2 }))}
                style={{
                  accentColor: colorMap.secondary.border
                }}
              />
              <span>Checkbox 2</span>
            </label>
          </div>
        </div>
        
        <div style={{ marginBottom: '24px' }}>
          <div style={{ 
            display: 'flex', 
            gap: '16px',
            flexWrap: 'wrap'
          }}>
            <label style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer'
            }}>
              <input 
                type="radio" 
                name="radioGroup"
                checked={checkboxState.radio1 === 0}
                onChange={() => setCheckboxState(prev => ({ ...prev, radio1: 0 }))}
                style={{
                  accentColor: colorMap.primary.border
                }}
              />
              <span>Radio 1</span>
            </label>
            
            <label style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer'
            }}>
              <input 
                type="radio" 
                name="radioGroup"
                checked={checkboxState.radio1 === 1}
                onChange={() => setCheckboxState(prev => ({ ...prev, radio1: 1 }))}
                style={{
                  accentColor: colorMap.primary.border
                }}
              />
              <span>Radio 2</span>
            </label>
            
            <label style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer'
            }}>
              <input 
                type="radio" 
                name="radioGroup"
                checked={checkboxState.radio1 === 2}
                onChange={() => setCheckboxState(prev => ({ ...prev, radio1: 2 }))}
                style={{
                  accentColor: colorMap.primary.border
                }}
              />
              <span>Radio 3</span>
            </label>
          </div>
        </div>
        
        <div style={{ marginBottom: '24px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px',
            fontSize: '14px',
            fontWeight: 500
          }}>
            Range Slider ({sliderValue})
          </label>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={sliderValue}
            onChange={(e) => {/* This would update state in a real app */}}
            style={{
              width: '100%',
              accentColor: colorMap.primary.border
            }}
          />
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
          <button style={{
            padding: '8px 16px',
            borderRadius: '4px',
            border: 'none',
            backgroundColor: 'transparent',
            color: colorMap.default.text,
            cursor: 'pointer',
            fontSize: '14px'
          }}>
            Cancel
          </button>
          <button style={{
            padding: '8px 16px',
            borderRadius: '4px',
            border: 'none',
            backgroundColor: colorMap.primary.border,
            color: getTextColor(primaryHue, colorIndex),
            cursor: 'pointer',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <span>Submit</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormElements; 