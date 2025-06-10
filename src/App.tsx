import React, { useState, useMemo, useEffect } from 'react';
import './App.css';
import Badge from './components/Badge';
import Avatar from './components/Avatar';
import BadgeFilter from './components/BadgeFilter';
import ColorPaletteModal from './components/ColorPaletteModal';
import PaletteIcon from './components/PaletteIcon';
import { 
  findAccessibleCombinations, 
  getWCAGComplianceLevel,
  getAPCAComplianceDescription,
  sortByBackgroundColor,
  calculateContrast
} from './utils/colorUtils';
import type { ContrastAlgorithm, ColorCombination } from './utils/colorUtils';
import ThemePreview from './components/ThemePreview';
import ColorCodeExport from './components/ColorCodeExport';
import ContrastMeter from './components/ContrastMeter';
import BackgroundContextSwitcher from './components/BackgroundContextSwitcher';
import type { BackgroundMode } from './components/BackgroundContextSwitcher';
import BackgroundVariationControls from './components/BackgroundVariationControls';
import GradientBadge from './components/GradientBadge';
import GradientAvatar from './components/GradientAvatar';
import type { BackgroundVariant, GradientType, GradientDirection, GradientHueMode } from './utils/colorUtils';
import Button from './components/Button';
import ButtonOutline, { ButtonOutlinePreview } from './components/ButtonOutline';
import DashboardView from './components/DashboardView';
import { palettes } from './data/colorPalettes';

// Define available color palettes
type ColorPalette = 'palette1' | 'palette2' | 'palette3' | 'oklab';

const colorPalettes = {
  palette1: {
    name: 'Display P3 Palette',
    colors: palettes.p3
  },
  palette2: {
    name: 'RGB Palette 1',
    colors: palettes.rgb1
  },
  palette3: {
    name: 'RGB Palette 2',
    colors: palettes.rgb2
  },
  oklab: {
    name: 'OKLab Palette',
    colors: palettes.oklab
  }
};

// Extract hue names for filtering - we'll update this based on selected palette
const getHueNames = (palette: ColorPalette) => Object.keys(colorPalettes[palette].colors);

// Define threshold options
const thresholdOptions = {
  'WCAG21': [
    { value: 3, label: '3' },
    { value: 4.5, label: '4.5' },
    { value: 7, label: '7' }
  ],
  'APCA': [
    { value: 60, label: '60' },
    { value: 75, label: '75' },
    { value: 90, label: '90' }
  ]
};

// UI component types for filtering
type UIComponentType = 'badge' | 'avatar' | 'button' | 'all';

function App() {
  // State for the configuration
  const [algorithm, setAlgorithm] = useState<ContrastAlgorithm>('APCA'); // Default to APCA
  const [threshold, setThreshold] = useState<number>(90); // Default to 90 (Optimal)
  const [accessibleCombinations, setAccessibleCombinations] = useState<ColorCombination[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedBgHue, setSelectedBgHue] = useState<string | null>(null);
  const [selectedFgHue, setSelectedFgHue] = useState<string | null>(null);
  const [selectedCombination, setSelectedCombination] = useState<ColorCombination | null>(null);
  const [isPaletteModalOpen, setIsPaletteModalOpen] = useState<boolean>(false);
  const [componentType, setComponentType] = useState<UIComponentType>('all');
  const [activePalette, setActivePalette] = useState<ColorPalette>('oklab');
  const [backgroundMode, setBackgroundMode] = useState<BackgroundMode>('default');
  const [showBorders, setShowBorders] = useState<boolean>(false);
  const [borderLevel, setBorderLevel] = useState<'subtle' | 'strong'>('subtle');
  const [backgroundVariant, setBackgroundVariant] = useState<BackgroundVariant>('solid');
  const [gradientType, setGradientType] = useState<GradientType>('linear');
  const [gradientDirection, setGradientDirection] = useState<GradientDirection>('to right');
  const [hueStep, setHueStep] = useState<number>(2);
  const [hueMode, setHueMode] = useState<GradientHueMode>('same-hue');
  const [gradientKey, setGradientKey] = useState<number>(0);
  const [showDashboardView, setShowDashboardView] = useState<boolean>(false);

  // Get hue names for the current palette
  const hueNames = useMemo(() => getHueNames(activePalette), [activePalette]);

  // Background colors for different modes
  const backgroundColors = {
    default: 'white',
    dark1: '#000000', // Black
    dark2: '#171717', // Dark gray 1
    dark3: '#2f2f2f', // Dark gray 2
    light1: '#ffffff', // White
    light2: '#f8f8f8', // Light gray 1
    light3: '#e8e8e8'  // Light gray 2
  };

  // Text colors for different modes
  const textColors = {
    default: 'black',
    dark1: 'white',
    dark2: 'white',
    dark3: 'white',
    light1: 'black',
    light2: 'black',
    light3: 'black'
  };
  
  // Determine if we're in dark mode for additional styling
  const isDarkMode = backgroundMode === 'dark1' || backgroundMode === 'dark2' || backgroundMode === 'dark3';

  // Calculate accessible color combinations based on current settings
  useEffect(() => {
    setLoading(true);
    
    // Use setTimeout to prevent UI freeze with large color sets
    setTimeout(() => {
      const combinations = findAccessibleCombinations(
        colorPalettes[activePalette].colors, 
        algorithm, 
        threshold
      );
      
      // Sort by background color for better visual grouping
      const sortedCombinations = sortByBackgroundColor(combinations);
      
      setAccessibleCombinations(sortedCombinations);
      setLoading(false);
      
      // Reset selected combination if it doesn't meet the new criteria
      if (selectedCombination) {
        const stillExists = combinations.some(
          c => c.background === selectedCombination.background && c.foreground === selectedCombination.foreground
        );
        if (!stillExists) {
          setSelectedCombination(null);
        }
      }
    }, 0);
  }, [algorithm, threshold, activePalette]);

  // Filter combinations based on selected hues
  const filteredCombinations = useMemo(() => {
    return accessibleCombinations.filter(combo => {
      const bgHueMatch = selectedBgHue === null || combo.bgHue === selectedBgHue;
      const fgHueMatch = selectedFgHue === null || combo.fgHue === selectedFgHue;
      return bgHueMatch && fgHueMatch;
    });
  }, [accessibleCombinations, selectedBgHue, selectedFgHue]);

  // Group combinations by background hue
  const combinationsByBackgroundHue = useMemo(() => {
    const grouped: Record<string, ColorCombination[]> = {};
    
    filteredCombinations.forEach(combo => {
      const bgHue = combo.bgHue || 'unknown';
      if (!grouped[bgHue]) {
        grouped[bgHue] = [];
      }
      grouped[bgHue].push(combo);
    });
    
    return grouped;
  }, [filteredCombinations]);

  // Handle algorithm change
  const handleAlgorithmChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newAlgorithm = e.target.value as ContrastAlgorithm;
    setAlgorithm(newAlgorithm);

    // Set appropriate default thresholds when algorithm changes
    if (newAlgorithm === 'WCAG21') {
      setThreshold(4.5); // AA threshold
    } else {
      setThreshold(90); // Optimal APCA threshold
    }
  };

  // Handle threshold change
  const handleThresholdChange = (value: number) => {
    setThreshold(value);
  };

  // Handle combination click to select it
  const handleCombinationClick = (combo: ColorCombination) => {
    setSelectedCombination(combo);
  };

  // Toggle color palette modal
  const togglePaletteModal = () => {
    setIsPaletteModalOpen(prev => !prev);
  };

  // Handle component type filter change
  const handleComponentTypeChange = (type: UIComponentType) => {
    setComponentType(type);
  };

  // Handle palette change
  const handlePaletteChange = (palette: ColorPalette) => {
    const previousPalette = activePalette;
    const newPaletteHues = Object.keys(colorPalettes[palette].colors);
    
    // Set the new palette
    setActivePalette(palette);
    
    // Check if the selected hues exist in the new palette
    const newBgHue = selectedBgHue && newPaletteHues.includes(selectedBgHue) 
      ? selectedBgHue 
      : null;
      
    const newFgHue = selectedFgHue && newPaletteHues.includes(selectedFgHue) 
      ? selectedFgHue 
      : null;
    
    // Only update the hue filters if they changed
    if (newBgHue !== selectedBgHue) {
      setSelectedBgHue(newBgHue);
    }
    
    if (newFgHue !== selectedFgHue) {
      setSelectedFgHue(newFgHue);
    }
  };

  // Handle background mode change
  const handleBackgroundModeChange = (mode: BackgroundMode) => {
    setBackgroundMode(mode);
  };

  // Toggle borders
  const handleToggleBorders = () => {
    setShowBorders(!showBorders);
  };

  // Handle border level change
  const handleBorderLevelChange = (level: 'subtle' | 'strong') => {
    setBorderLevel(level);
  };

  // Handle background variant change
  const handleBackgroundVariantChange = (variant: BackgroundVariant) => {
    setBackgroundVariant(variant);
  };

  // Handle gradient type change
  const handleGradientTypeChange = (type: GradientType) => {
    setGradientType(type);
  };

  // Handle gradient direction change
  const handleGradientDirectionChange = (direction: GradientDirection) => {
    setGradientDirection(direction);
  };

  // Handle hue step change
  const handleHueStepChange = (step: number) => {
    setHueStep(step);
  };

  // Add hueMode handler
  const handleHueModeChange = (mode: GradientHueMode) => {
    setHueMode(mode);
  };

  // Regenerate gradient designs with new random variations
  const handleRegenerateGradient = () => {
    setGradientKey(prevKey => prevKey + 1);
  };

  // Get current palette colors
  const currentPaletteColors = useMemo(() => {
    return colorPalettes[activePalette].colors;
  }, [activePalette]);

  // Toggle Dashboard View
  const toggleDashboardView = () => {
    setShowDashboardView(!showDashboardView);
  };

  // Render UI components (badges and/or avatars) based on filter
  const renderUIComponents = (combinations: ColorCombination[]) => {
    return (
      <div className="ui-components-grid">
        {combinations.map((combo, index) => (
          <div 
            key={index}
            className={`ui-component-wrapper ${selectedCombination === combo ? 'selected' : ''}`}
            onClick={() => handleCombinationClick(combo)}
          >
            <div className="ui-component-item">
              {(componentType === 'all' || componentType === 'badge') && (
                <GradientBadge 
                  key={`badge-${index}-${gradientKey}`}
                  backgroundColor={combo.background}
                  foregroundColor={combo.foreground}
                  contrast={combo.contrast}
                  algorithm={algorithm}
                  compact={true}
                  showBorder={showBorders}
                  borderLevel={borderLevel}
                  backgroundVariant={backgroundVariant}
                  gradientType={gradientType}
                  gradientDirection={gradientDirection}
                  hueStep={hueStep}
                  hueMode={hueMode}
                  bgHue={combo.bgHue}
                  bgIndex={combo.bgIndex}
                  colorPalette={currentPaletteColors}
                />
              )}
              
              {(componentType === 'all' || componentType === 'avatar') && (
                <GradientAvatar 
                  key={`avatar-${index}-${gradientKey}`}
                  backgroundColor={combo.background}
                  foregroundColor={combo.foreground}
                  size="sm"
                  showBorder={showBorders}
                  borderLevel={borderLevel}
                  backgroundVariant={backgroundVariant}
                  gradientType={gradientType}
                  gradientDirection={gradientDirection}
                  hueStep={hueStep}
                  hueMode={hueMode}
                  bgHue={combo.bgHue}
                  bgIndex={combo.bgIndex}
                  colorPalette={currentPaletteColors}
                />
              )}
              
              {(componentType === 'all' || componentType === 'button') && (
                <Button 
                  key={`button-${index}-${gradientKey}`}
                  backgroundColor={combo.background}
                  foregroundColor={combo.foreground}
                  contrast={combo.contrast}
                  algorithm={algorithm}
                  label="Button"
                  size="sm"
                  showBorder={showBorders}
                  borderLevel={borderLevel}
                  backgroundVariant={backgroundVariant}
                  gradientType={gradientType}
                  gradientDirection={gradientDirection}
                  hueStep={hueStep}
                  hueMode={hueMode}
                  bgHue={combo.bgHue}
                  bgIndex={combo.bgIndex}
                  colorPalette={currentPaletteColors}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div 
      className={`app-container ${isDarkMode ? 'dark-mode' : ''}`}
      style={{
        backgroundColor: backgroundColors[backgroundMode],
        color: textColors[backgroundMode],
        position: 'relative',
      }}
    >
      {/* Site Header with Filters */}
      <header style={{ zIndex: 999, backgroundColor: backgroundColors[backgroundMode], position: 'sticky', top: 0, left: 0, right: 0, borderBottom: '1px solid rgba(0,0,0,2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <a href='#0' style={{display: 'block', padding: '8px', marginRight: '24px' }}>
          <div style={{ display: 'flex', boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.05)',alignItems: 'center', justifyContent: 'center',  borderRadius: '9999px', height: '24px', width: '24px', background: 'conic-gradient(red, orange, yellow, green, blue, indigo, magenta, red)'}}><div style={{ borderRadius: '9999px', width: '16px', height:'16px', boxShadow: 'inset 0 0 0 1px solid rgba(0,0,0,.05)', backgroundColor: backgroundColors[backgroundMode] }}/></div>
        </a>
        <div style={{ marginLeft: 'auto', display: 'flex' }}>
          <div className="filter-group">
            <label htmlFor="algorithm" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '16px', textTransform: 'uppercase' }}>
              <span style={{ }}>◐</span>
              <select 
                style={{ fontSize: '.75rem' }}
                id="algorithm" 
                value={algorithm} 
                onChange={handleAlgorithmChange}
              >
                <option value="WCAG21">WCAG 2.1</option>
                <option value="APCA">APCA</option>
              </select>
            </label>
          </div>
        
          <div className="filter-group threshold-group" style={{ marginLeft: '16px', marginRight: '32px' }}>
            <label style={{ fontSize: '10px', textTransform: 'uppercase', display: 'none' }}>Threshold</label>
            <div className="threshold-options">
              {thresholdOptions[algorithm].map((option) => (
                <label key={option.value} className="radio-label">
                  <input
                    type="radio"
                    name="threshold"
                    value={option.value}
                    checked={threshold === option.value}
                    onChange={() => handleThresholdChange(option.value)}
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </div>
              
          <div style={{ paddingRight: '16px', paddingTop: '4px', paddingBottom: '4px' }}className="filter-group palette-group">
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: '4px'}}><span>🎨</span>
              <select 
                value={activePalette} 
                onChange={(e) => handlePaletteChange(e.target.value as ColorPalette)}
                style={{ fontSize: '12px' }}
              >
                <option value="palette1">{colorPalettes.palette1.name}</option>
                <option value="palette2">{colorPalettes.palette2.name}</option>
                <option value="palette3">{colorPalettes.palette3.name}</option>
                <option value="oklab">{colorPalettes.oklab.name}</option>
              </select>
            </label>
          </div>

          {/* Add Dashboard View Toggle Button */}
          <button
            onClick={toggleDashboardView}
            style={{
              marginLeft: '16px',
              padding: '5px 10px',
              backgroundColor: selectedCombination ? selectedCombination.background : '#4C7BF4',
              color: selectedCombination ? selectedCombination.foreground : 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            {showDashboardView ? 'Color Grid View' : 'Dashboard View'}
          </button>
        </div>
      </header>
      
      {showDashboardView ? (
        <DashboardView 
          palette={colorPalettes[activePalette].colors}
          algorithm={algorithm}
          isDarkMode={isDarkMode}
          pageBackgroundColor={backgroundColors[backgroundMode]}
        />
      ) : (
        /* Main Content - UI Components */
        <main className="content">
          {loading ? (
            <div className="loading">Calculating accessible combinations...</div>
          ) : (
            <>
              <div className="filter-controls">
                <BadgeFilter 
                  hues={hueNames}
                  selectedBgHue={selectedBgHue}
                  selectedFgHue={selectedFgHue}
                  onBgHueChange={setSelectedBgHue}
                  onFgHueChange={setSelectedFgHue}
                />

                <div className="component-type-filter">
                  <div className="component-options">
                    <button 
                      className={componentType === 'all' ? 'active' : ''}
                      onClick={() => handleComponentTypeChange('all')}
                    >
                      All Components
                    </button>
                    <button 
                      className={componentType === 'badge' ? 'active' : ''}
                      onClick={() => handleComponentTypeChange('badge')}
                    >
                      Badges
                    </button>
                    <button 
                      className={componentType === 'avatar' ? 'active' : ''}
                      onClick={() => handleComponentTypeChange('avatar')}
                    >
                      Avatars
                    </button>
                    <button 
                      className={componentType === 'button' ? 'active' : ''}
                      onClick={() => handleComponentTypeChange('button')}
                    >
                      Buttons
                    </button>
                  </div>
                </div>
                
                {/* Add Background Variation Controls */}
                <BackgroundVariationControls 
                  showBorders={showBorders}
                  onToggleBorders={handleToggleBorders}
                  borderLevel={borderLevel}
                  onBorderLevelChange={handleBorderLevelChange}
                  backgroundVariant={backgroundVariant}
                  onBackgroundVariantChange={handleBackgroundVariantChange}
                  gradientType={gradientType}
                  onGradientTypeChange={handleGradientTypeChange}
                  gradientDirection={gradientDirection}
                  onGradientDirectionChange={handleGradientDirectionChange}
                  hueStep={hueStep}
                  onHueStepChange={handleHueStepChange}
                  hueMode={hueMode}
                  onHueModeChange={handleHueModeChange}
                  onRegenerateGradient={handleRegenerateGradient}
                />
              </div>

              <div style={{ fontSize: '10px', fontFamily: 'monospace', textAlign: 'center' }}>
                <span>
                {filteredCombinations.length} accessible combinations
                {selectedBgHue !== null && ` with ${selectedBgHue} backgrounds`}
                {selectedFgHue !== null && ` and ${selectedFgHue} text`}
                </span>
              </div>

              {/* Massive Grid of UI Components */}
              <div className="content-layout">
                {/* Background Hue Sections */}
                <div className="bg-hue-sections">
                  {Object.keys(combinationsByBackgroundHue).length > 0 ? (
                    Object.entries(combinationsByBackgroundHue).map(([bgHue, combinations]) => (
                      <div key={bgHue} className="bg-hue-section" style={{ padding: '16px' }}>
                        <h3 style={{ fontSize: '12px', marginTop: 0, marginBottom: '16px', textTransform: 'capitalize' }}>{bgHue}</h3>
                        {renderUIComponents(combinations)}
                      </div>
                    ))
                  ) : (
                    <div className="no-results">No accessible combinations found with current settings</div>
                  )}
                </div>

                {/* Selected Combination Detail */}
                <div className="detail-panel">
                  {selectedCombination ? (
                    <>
                      <h3>Selected Combination</h3>
                      <div className="selected-components">
                        <GradientBadge 
                          key={`selected-badge-${gradientKey}`}
                          backgroundColor={selectedCombination.background}
                          foregroundColor={selectedCombination.foreground}
                          contrast={selectedCombination.contrast}
                          algorithm={algorithm}
                          bgHue={selectedCombination.bgHue}
                          fgHue={selectedCombination.fgHue}
                          bgIndex={selectedCombination.bgIndex}
                          label="Badge"
                          showBorder={showBorders}
                          borderLevel={borderLevel}
                          backgroundVariant={backgroundVariant}
                          gradientType={gradientType}
                          gradientDirection={gradientDirection}
                          hueStep={hueStep}
                          hueMode={hueMode}
                          colorPalette={currentPaletteColors}
                        />
                        <GradientAvatar 
                          key={`selected-avatar-${gradientKey}`}
                          backgroundColor={selectedCombination.background}
                          foregroundColor={selectedCombination.foreground}
                          size="md"
                          showBorder={showBorders}
                          borderLevel={borderLevel}
                          backgroundVariant={backgroundVariant}
                          gradientType={gradientType}
                          gradientDirection={gradientDirection}
                          hueStep={hueStep}
                          hueMode={hueMode}
                          bgHue={selectedCombination.bgHue}
                          bgIndex={selectedCombination.bgIndex}
                          colorPalette={currentPaletteColors}
                        />
                        <Button 
                          key={`selected-button-${gradientKey}`}
                          backgroundColor={selectedCombination.background}
                          foregroundColor={selectedCombination.foreground}
                          contrast={selectedCombination.contrast}
                          algorithm={algorithm}
                          bgHue={selectedCombination.bgHue}
                          fgHue={selectedCombination.fgHue}
                          bgIndex={selectedCombination.bgIndex}
                          label="Button"
                          size="md"
                          showBorder={showBorders}
                          borderLevel={borderLevel}
                          backgroundVariant={backgroundVariant}
                          gradientType={gradientType}
                          gradientDirection={gradientDirection}
                          hueStep={hueStep}
                          hueMode={hueMode}
                          colorPalette={currentPaletteColors}
                        />
                        <ButtonOutlinePreview
                          key={`selected-button-outline-${gradientKey}`}
                          outlineColor={selectedCombination.foreground}
                          pageBackgroundColor={backgroundColors[backgroundMode]}
                          contrast={calculateContrast(selectedCombination.foreground, backgroundColors[backgroundMode], algorithm)}
                          algorithm={algorithm}
                          bgHue={selectedCombination.bgHue}
                          fgHue={selectedCombination.fgHue}
                          label="Outline"
                          size="md"
                        />
                      </div>
                      
                      <div className="color-info">
                        <div><strong>Background:</strong> {selectedCombination.background}</div>
                        <div><strong>Foreground:</strong> {selectedCombination.foreground}</div>
                        <div><strong>Contrast:</strong> {selectedCombination.contrast.toFixed(2)}</div>
                        <div>
                          <strong>Rating:</strong> {
                            algorithm === 'WCAG21' 
                              ? getWCAGComplianceLevel(selectedCombination.contrast)
                              : getAPCAComplianceDescription(selectedCombination.contrast)
                          }
                        </div>
                        
                        <ContrastMeter 
                          contrast={selectedCombination.contrast}
                          algorithm={algorithm}
                        />
                      </div>
                      
                      <ThemePreview 
                        backgroundColor={selectedCombination.background}
                        foregroundColor={selectedCombination.foreground}
                        contrast={selectedCombination.contrast}
                        algorithm={algorithm}
                      />
                      
                      <ColorCodeExport 
                        background={selectedCombination.background}
                        foreground={selectedCombination.foreground}
                        bgHue={selectedCombination.bgHue}
                        fgHue={selectedCombination.fgHue}
                      />
                    </>
                  ) : (
                    <div className="no-selection">
                      <p>Click on a component to see details</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </main>
      )}

      {/* View Palette Button */}
      <button className="view-palette-button" onClick={togglePaletteModal}>
        <PaletteIcon size={18} />
        <span>View Color Palette</span>
      </button>

      {/* Color Palette Modal */}
      <ColorPaletteModal 
        colors={currentPaletteColors}
        isOpen={isPaletteModalOpen}
        onClose={togglePaletteModal}
      />

      {/* Background Context Switcher */}
      <BackgroundContextSwitcher 
        currentMode={backgroundMode}
        onModeChange={handleBackgroundModeChange}
      />
    </div>
  );
}

export default App;
