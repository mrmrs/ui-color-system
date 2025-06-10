import React, { useState, useEffect } from 'react';
import Button from './Button';
import ButtonOutline from './ButtonOutline';
import type { ContrastAlgorithm } from '../utils/colorUtils';

// Semantic UI variations
type VariantType = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';

// Props for the showcase
type ComponentsShowcaseProps = {
  palette: Record<string, string[]>;
  algorithm: ContrastAlgorithm;
  isDarkMode: boolean;
  pageBackgroundColor: string;
  regenerateKey?: number;
  onRegenerateComponent?: (componentType: string) => void;
};

// Icons for different button states
const Icons = {
  success: (
    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
  ),
  error: (
    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="15" y1="9" x2="9" y2="15"></line>
      <line x1="9" y1="9" x2="15" y2="15"></line>
    </svg>
  ),
  warning: (
    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
      <line x1="12" y1="9" x2="12" y2="13"></line>
      <line x1="12" y1="17" x2="12.01" y2="17"></line>
    </svg>
  ),
  info: (
    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="16" x2="12" y2="12"></line>
      <line x1="12" y1="8" x2="12.01" y2="8"></line>
    </svg>
  ),
  add: (
    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="8" x2="12" y2="16"></line>
      <line x1="8" y1="12" x2="16" y2="12"></line>
    </svg>
  ),
  settings: (
    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"></circle>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
    </svg>
  )
};

// Define mappings between semantic variants and palette hues
const getVariantColorMapping = (palette: Record<string, string[]>, isDarkMode: boolean): Record<VariantType, { bg: string, fg: string, icon?: React.ReactNode }> => {
  const hues = Object.keys(palette);
  const hasGreen = hues.includes('green');
  const hasRed = hues.includes('red');
  const hasYellow = hues.includes('yellow') || hues.includes('gold');
  const hasBlue = hues.includes('blue') || hues.includes('cyan');
  const hasPurple = hues.includes('purple') || hues.includes('violet') || hues.includes('indigo');
  const hasGray = hues.includes('gray') || hues.includes('slate-gray');

  // For dark mode, use higher indices (lighter colors)
  // For light mode, use lower indices (darker colors)
  const primaryIndex = isDarkMode ? 7 : 5;
  const secondaryIndex = isDarkMode ? 5 : 7;
  const textIndex = isDarkMode ? 14 : 2;
  const bgIndex = isDarkMode ? 2 : 14;

  // Define sensible defaults based on available hues
  const primaryHue = hasBlue ? (hues.includes('blue') ? 'blue' : 'cyan') : (hues[0] !== 'gray' ? hues[0] : hues[1]);
  const secondaryHue = hasPurple ? (hues.includes('purple') ? 'purple' : hues.includes('violet') ? 'violet' : 'indigo') : (hues[1] !== 'gray' ? hues[1] : hues[0]);
  const successHue = hasGreen ? 'green' : primaryHue;
  const errorHue = hasRed ? 'red' : (hues.includes('magenta') ? 'magenta' : primaryHue);
  const warningHue = hasYellow ? (hues.includes('yellow') ? 'yellow' : 'gold') : (hues.includes('orange') ? 'orange' : primaryHue);
  const infoHue = hasBlue ? (hues.includes('cyan') ? 'cyan' : 'blue') : primaryHue;
  const neutralHue = hasGray ? (hues.includes('gray') ? 'gray' : 'slate-gray') : hues[0];

  // Get foreground colors that ensure contrast
  const getTextColor = (bgColor: string) => {
    // Simple logic: use dark text on light backgrounds, light text on dark backgrounds
    // In a real app, we'd use a contrast calculation
    return isDarkMode ? palette[neutralHue][15] : palette[neutralHue][0];
  };

  return {
    default: {
      bg: palette[neutralHue][isDarkMode ? 3 : 13],
      fg: getTextColor(palette[neutralHue][isDarkMode ? 3 : 13])
    },
    primary: {
      bg: palette[primaryHue][primaryIndex],
      fg: getTextColor(palette[primaryHue][primaryIndex]),
      icon: Icons.add
    },
    secondary: {
      bg: palette[secondaryHue][secondaryIndex],
      fg: getTextColor(palette[secondaryHue][secondaryIndex]),
      icon: Icons.settings
    },
    success: {
      bg: palette[successHue][primaryIndex],
      fg: getTextColor(palette[successHue][primaryIndex]),
      icon: Icons.success
    },
    warning: {
      bg: palette[warningHue][primaryIndex],
      fg: getTextColor(palette[warningHue][primaryIndex]),
      icon: Icons.warning
    },
    error: {
      bg: palette[errorHue][primaryIndex],
      fg: getTextColor(palette[errorHue][primaryIndex]),
      icon: Icons.error
    },
    info: {
      bg: palette[infoHue][primaryIndex],
      fg: getTextColor(palette[infoHue][primaryIndex]),
      icon: Icons.info
    }
  };
};

// Toggle Switch Component
const Toggle: React.FC<{ isOn: boolean; variant: VariantType; colors: Record<VariantType, { bg: string, fg: string, icon?: React.ReactNode }> }> = ({ 
  isOn, 
  variant,
  colors 
}) => {
  const bgColor = colors[variant].bg;
  
  return (
    <div 
      style={{ 
        position: 'relative',
        width: '36px',
        height: '20px',
        borderRadius: '10px',
        backgroundColor: isOn ? bgColor : '#ccc',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
      }}
    >
      <div 
        style={{
          position: 'absolute',
          top: '2px',
          left: isOn ? '18px' : '2px',
          width: '16px',
          height: '16px',
          borderRadius: '50%',
          backgroundColor: 'white',
          transition: 'left 0.3s',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
        }}
      />
    </div>
  );
};

// Input Field Component
const Input: React.FC<{ 
  placeholder: string; 
  variant: VariantType; 
  colors: Record<VariantType, { bg: string, fg: string, icon?: React.ReactNode }>;
  pageBackgroundColor: string;
}> = ({ 
  placeholder, 
  variant,
  colors,
  pageBackgroundColor
}) => {
  const borderColor = colors[variant].bg;
  
  return (
    <div style={{ position: 'relative' }}>
      <input
        type="text"
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '8px 12px',
          fontSize: '14px',
          borderRadius: '4px',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: borderColor,
          backgroundColor: pageBackgroundColor,
          color: colors.default.fg,
          outline: 'none',
        }}
      />
      {variant !== 'default' && (
        <span style={{ 
          position: 'absolute', 
          right: '10px', 
          top: '50%', 
          transform: 'translateY(-50%)',
          color: borderColor
        }}>
          {colors[variant].icon}
        </span>
      )}
    </div>
  );
};

// Badge Component
const Badge: React.FC<{ 
  label: string; 
  variant: VariantType; 
  colors: Record<VariantType, { bg: string, fg: string, icon?: React.ReactNode }> 
}> = ({ 
  label, 
  variant,
  colors
}) => {
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      padding: '2px 8px',
      borderRadius: '12px',
      backgroundColor: colors[variant].bg,
      color: colors[variant].fg,
      fontSize: '12px',
      fontWeight: 500
    }}>
      {colors[variant].icon && <span style={{ display: 'flex', alignItems: 'center' }}>{colors[variant].icon}</span>}
      {label}
    </span>
  );
};

// Slider Component
const Slider: React.FC<{ 
  value: number; 
  variant: VariantType; 
  colors: Record<VariantType, { bg: string, fg: string, icon?: React.ReactNode }> 
}> = ({ 
  value, 
  variant,
  colors
}) => {
  return (
    <div style={{ padding: '10px 0' }}>
      <div style={{ 
        position: 'relative',
        height: '4px',
        backgroundColor: '#e0e0e0',
        borderRadius: '2px',
      }}>
        <div style={{
          position: 'absolute',
          left: 0,
          top: 0,
          height: '100%',
          width: `${value}%`,
          backgroundColor: colors[variant].bg,
          borderRadius: '2px',
        }} />
        <div style={{
          position: 'absolute',
          left: `${value}%`,
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: '16px',
          height: '16px',
          borderRadius: '50%',
          backgroundColor: colors[variant].bg,
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          cursor: 'pointer'
        }} />
      </div>
    </div>
  );
};

// Card Component
const Card: React.FC<{ 
  title: string; 
  content: string;
  variant: VariantType; 
  colors: Record<VariantType, { bg: string, fg: string, icon?: React.ReactNode }>;
  pageBackgroundColor: string;
}> = ({ 
  title, 
  content, 
  variant,
  colors,
  pageBackgroundColor
}) => {
  return (
    <div style={{
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      backgroundColor: pageBackgroundColor,
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: colors[variant].bg
    }}>
      <div style={{
        padding: '12px 16px',
        backgroundColor: colors[variant].bg,
        color: colors[variant].fg,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '14px',
        fontWeight: 600
      }}>
        {colors[variant].icon && colors[variant].icon}
        {title}
      </div>
      <div style={{
        padding: '16px',
        color: colors.default.fg
      }}>
        {content}
      </div>
    </div>
  );
};

// Alert Component
const Alert: React.FC<{ 
  message: string; 
  variant: VariantType; 
  colors: Record<VariantType, { bg: string, fg: string, icon?: React.ReactNode }>;
}> = ({ 
  message, 
  variant,
  colors
}) => {
  // For alerts, we want a more subtle background
  const getAlertBgColor = (color: string) => {
    // We'd use a proper calculation in a real app
    return color + '20'; // Add transparency
  };

  return (
    <div style={{
      padding: '12px 16px',
      borderRadius: '6px',
      backgroundColor: getAlertBgColor(colors[variant].bg),
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: colors[variant].bg,
      color: colors[variant].bg,
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    }}>
      {colors[variant].icon && <span style={{ display: 'flex' }}>{colors[variant].icon}</span>}
      <span>{message}</span>
    </div>
  );
};

// Main ComponentsShowcase component
const ComponentsShowcase: React.FC<ComponentsShowcaseProps> = ({
  palette,
  algorithm,
  isDarkMode,
  pageBackgroundColor,
  regenerateKey,
  onRegenerateComponent
}) => {
  const [randomKey, setRandomKey] = useState(0);
  const variantColors = getVariantColorMapping(palette, isDarkMode);
  const variants: VariantType[] = ['default', 'primary', 'secondary', 'success', 'warning', 'error', 'info'];

  // Update randomKey when regenerateKey changes
  useEffect(() => {
    setRandomKey(prev => prev + 1);
  }, [regenerateKey]);

  // Generate random slider values
  const getRandomSliderValue = (index: number) => {
    // Create a deterministic but changing value based on variant, index and randomKey
    const seed = (index + 1) * (randomKey + 1);
    return Math.min(20 + (seed * 13) % 70, 90);
  };

  // Helper for section headers with regenerate button
  const SectionHeader = ({ title, componentType }: { title: string, componentType: string }) => (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      marginBottom: '16px' 
    }}>
      <h3 style={{ fontSize: '16px', margin: 0 }}>{title}</h3>
      {onRegenerateComponent && (
        <button 
          onClick={() => {
            if (onRegenerateComponent) {
              onRegenerateComponent(componentType);
              setRandomKey(prev => prev + 1);
            }
          }}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            cursor: 'pointer',
            fontSize: '12px',
            color: variantColors.primary.bg,
          }}
        >
          <span style={{ fontSize: '14px' }}>↻</span> Regenerate
        </button>
      )}
    </div>
  );

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ marginBottom: '24px', fontSize: '18px' }}>UI Components Showcase</h2>
      
      {/* Buttons Section */}
      <section style={{ marginBottom: '32px' }}>
        <SectionHeader title="Buttons" componentType="buttons" />
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '16px' }}>
          {variants.map(variant => (
            <Button
              key={`btn-${variant}-${randomKey}`}
              backgroundColor={variantColors[variant].bg}
              foregroundColor={variantColors[variant].fg}
              contrast={0} // We'd calculate this properly
              algorithm={algorithm}
              label={variant.charAt(0).toUpperCase() + variant.slice(1)}
              size="md"
              onClick={() => {}}
            />
          ))}
        </div>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          {variants.map(variant => (
            <ButtonOutline
              key={`btn-outline-${variant}-${randomKey}`}
              outlineColor={variantColors[variant].bg}
              pageBackgroundColor={pageBackgroundColor}
              contrast={0} // We'd calculate this properly
              algorithm={algorithm}
              label={variant.charAt(0).toUpperCase() + variant.slice(1)}
              size="md"
            />
          ))}
        </div>
      </section>
      
      {/* Badges Section */}
      <section style={{ marginBottom: '32px' }}>
        <SectionHeader title="Badges" componentType="badges" />
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {variants.map(variant => (
            <Badge
              key={`badge-${variant}-${randomKey}`}
              label={variant.charAt(0).toUpperCase() + variant.slice(1)}
              variant={variant}
              colors={variantColors}
            />
          ))}
        </div>
      </section>
      
      {/* Inputs Section */}
      <section style={{ marginBottom: '32px' }}>
        <SectionHeader title="Inputs" componentType="inputs" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
          {variants.map(variant => (
            <Input
              key={`input-${variant}-${randomKey}`}
              placeholder={`${variant.charAt(0).toUpperCase() + variant.slice(1)} input`}
              variant={variant}
              colors={variantColors}
              pageBackgroundColor={pageBackgroundColor}
            />
          ))}
        </div>
      </section>
      
      {/* Toggles Section */}
      <section style={{ marginBottom: '32px' }}>
        <SectionHeader title="Toggles" componentType="toggles" />
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          {variants.map(variant => (
            <div key={`toggle-${variant}-${randomKey}`} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Toggle isOn={true} variant={variant} colors={variantColors} />
              <span style={{ fontSize: '14px' }}>{variant.charAt(0).toUpperCase() + variant.slice(1)}</span>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', marginTop: '16px' }}>
          {variants.map(variant => (
            <div key={`toggle-off-${variant}-${randomKey}`} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Toggle isOn={false} variant={variant} colors={variantColors} />
              <span style={{ fontSize: '14px' }}>{variant.charAt(0).toUpperCase() + variant.slice(1)} (Off)</span>
            </div>
          ))}
        </div>
      </section>
      
      {/* Sliders Section */}
      <section style={{ marginBottom: '32px' }}>
        <SectionHeader title="Sliders" componentType="sliders" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '24px' }}>
          {variants.map((variant, index) => (
            <div key={`slider-${variant}-${randomKey}`}>
              <div style={{ marginBottom: '4px', fontSize: '14px' }}>{variant.charAt(0).toUpperCase() + variant.slice(1)}</div>
              <Slider value={getRandomSliderValue(index)} variant={variant} colors={variantColors} />
            </div>
          ))}
        </div>
      </section>
      
      {/* Cards Section */}
      <section style={{ marginBottom: '32px' }}>
        <SectionHeader title="Cards" componentType="cards" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px' }}>
          {variants.map(variant => (
            <Card
              key={`card-${variant}-${randomKey}`}
              title={`${variant.charAt(0).toUpperCase() + variant.slice(1)} Card`}
              content="This is a sample card component with semantic styling applied to demonstrate how different variants appear."
              variant={variant}
              colors={variantColors}
              pageBackgroundColor={pageBackgroundColor}
            />
          ))}
        </div>
      </section>
      
      {/* Alerts Section */}
      <section style={{ marginBottom: '32px' }}>
        <SectionHeader title="Alerts" componentType="alerts" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {variants.filter(v => v !== 'default').map(variant => (
            <Alert
              key={`alert-${variant}-${randomKey}`}
              message={`This is a ${variant} alert message to demonstrate semantic styling.`}
              variant={variant}
              colors={variantColors}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default ComponentsShowcase; 