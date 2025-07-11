import React from 'react';

type BadgeFilterProps = {
  hues: string[];
  selectedBgHue: string | null;
  selectedFgHue: string | null;
  onBgHueChange: (hue: string | null) => void;
  onFgHueChange: (hue: string | null) => void;
}

const BadgeFilter: React.FC<BadgeFilterProps> = ({
  hues,
  selectedBgHue,
  selectedFgHue,
  onBgHueChange,
  onFgHueChange
}) => {
  return (
    <div className="badge-filter" style={{ justifyContent: 'space-between'}}>
      <div className="filter-section" style={{ display: 'flex', alignItems: 'center', gap: '8px'}}>
          <label style={{ fontSize: '12px', margin: 0 }}>Background </label>
        <div className="hue-options">
          <button 
            className={selectedBgHue === null ? 'active' : ''} 
            onClick={() => onBgHueChange(null)}
          >
            All
          </button>
          {hues.map(hue => (
            <button 
              key={hue}
              className={selectedBgHue === hue ? 'active' : ''}
              onClick={() => onBgHueChange(hue)}
            >
              {hue}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-section" style={{ display: 'flex', alignItems: 'center', gap: '8px'}}>
        <label style={{ fontSize: '12px' }}>Color</label>
        <div className="hue-options">
          <button 
            className={selectedFgHue === null ? 'active' : ''} 
            onClick={() => onFgHueChange(null)}
          >
            All
          </button>
          {hues.map(hue => (
            <button 
              key={hue}
              className={selectedFgHue === hue ? 'active' : ''}
              onClick={() => onFgHueChange(hue)}
            >
              {hue}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BadgeFilter; 
