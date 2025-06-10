import React from 'react';

export type BackgroundMode = 'default' | 'dark1' | 'dark2' | 'dark3' | 'light1' | 'light2' | 'light3';

type BackgroundContextSwitcherProps = {
  currentMode: BackgroundMode;
  onModeChange: (mode: BackgroundMode) => void;
};

const BackgroundContextSwitcher: React.FC<BackgroundContextSwitcherProps> = ({
  currentMode,
  onModeChange
}) => {
  // Background colors for each mode
  const backgroundColors = {
    default: 'white',
    dark1: '#000000', // Black
    dark2: '#171717', // Dark gray 1
    dark3: '#2f2f2f', // Dark gray 2
    light1: '#ffffff', // White
    light2: '#f8f8f8', // Light gray 1
    light3: '#e8e8e8'  // Light gray 2
  };

  // Friendly names for display
  const modeNames = {
    default: 'Default',
    dark1: 'Black',
    dark2: 'Dark Gray 1',
    dark3: 'Dark Gray 2',
    light1: 'White',
    light2: 'Light Gray 1',
    light3: 'Light Gray 2'
  };

  // Text colors for each mode (dark modes get white text, light modes get black text)
  const textColors = {
    default: 'black',
    dark1: 'white',
    dark2: 'white',
    dark3: 'white',
    light1: 'black',
    light2: 'black',
    light3: 'black'
  };

  // Cycle to the next mode
  const cycleMode = () => {
    const modes: BackgroundMode[] = ['default', 'dark1', 'dark2', 'dark3', 'light1', 'light2', 'light3'];
    const currentIndex = modes.indexOf(currentMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    onModeChange(modes[nextIndex]);
  };

  return (
    <div className="background-switcher">
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'black', padding: '4px 8px', borderRadius: '9999px' }}>
        {Object.entries(backgroundColors).map(([mode, color]) => (
          <div 
            key={mode} 
            className={`mode-dot ${currentMode === mode ? 'active' : ''}`}
            style={{ backgroundColor: color }}
            onClick={() => onModeChange(mode as BackgroundMode)}
            title={modeNames[mode as BackgroundMode]}
          />
        ))}

      <button 
        onClick={cycleMode}
        style={{ 
          appearance: 'none',
          WebkitAppearance: 'none',
          backgroundColor: 'transparent',
          color: 'white',
          borderColor: 'none',
          borderWidth: 0,
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          padding: '2px 8px',
          fontSize: '10px',
          borderRadius: '6px',
        }}
      >
        <span className="switcher-icon">🔄</span>
        <span className="switcher-text">
          {modeNames[currentMode]}
        </span>
      </button>
      </div>
    </div>
  );
};

export default BackgroundContextSwitcher; 
