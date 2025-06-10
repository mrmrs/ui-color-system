import React, { useState } from 'react';
import ComponentsShowcase from './ComponentsShowcase';
import DataVisualization from './DataVisualization';
import ChartsPreview from './ChartsPreview';
import FormElements from './FormElements';
import type { ContrastAlgorithm } from '../utils/colorUtils';

type DashboardViewProps = {
  palette: Record<string, string[]>;
  algorithm: ContrastAlgorithm;
  isDarkMode: boolean;
  pageBackgroundColor: string;
};

const DashboardView: React.FC<DashboardViewProps> = ({
  palette,
  algorithm,
  isDarkMode,
  pageBackgroundColor
}) => {
  // Maintain regeneration keys for different component sections
  const [regenerationKeys, setRegenerationKeys] = useState({
    componentsShowcase: 0,
    buttons: 0,
    badges: 0,
    inputs: 0,
    toggles: 0,
    sliders: 0,
    cards: 0,
    alerts: 0,
    charts: 0,
    barChart: 0,
    lineChart: 0,
    pieChart: 0,
    forms: 0
  });

  // Handle regeneration of all components
  const handleRegenerateAll = () => {
    setRegenerationKeys(prev => {
      const newKeys = { ...prev };
      // Increment all keys
      Object.keys(newKeys).forEach(key => {
        newKeys[key as keyof typeof newKeys] += 1;
      });
      return newKeys;
    });
  };

  // Handle regeneration of specific component
  const handleRegenerateComponent = (componentType: string) => {
    setRegenerationKeys(prev => ({
      ...prev,
      [componentType]: prev[componentType as keyof typeof prev] + 1
    }));
  };

  // Handle regeneration of chart
  const handleRegenerateChart = (chartType: string) => {
    setRegenerationKeys(prev => ({
      ...prev,
      [chartType + 'Chart']: prev[(chartType + 'Chart') as keyof typeof prev] + 1,
      charts: prev.charts + 1
    }));
  };

  // Get first available color for charts
  const hues = Object.keys(palette);
  const primaryColorHue = hues.filter(hue => hue !== 'gray' && hue !== 'slate-gray')[0];
  const secondaryColorHue = hues.filter(hue => hue !== 'gray' && hue !== 'slate-gray' && hue !== primaryColorHue)[0] || primaryColorHue;
  const accentColorHue = hues.filter(hue => hue !== 'gray' && hue !== 'slate-gray' && hue !== primaryColorHue && hue !== secondaryColorHue)[0] || secondaryColorHue;
  
  const colorIndex = isDarkMode ? 7 : 5;
  const primaryColor = palette[primaryColorHue][colorIndex];
  const secondaryColor = palette[secondaryColorHue][colorIndex];
  const accentColor = palette[accentColorHue][colorIndex];

  return (
    <div style={{ 
      minHeight: '100vh',
      transition: 'background-color 0.3s, color 0.3s'
    }}>
      <div style={{ padding: '0 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '20px', margin: 0 }}>Design System Demo</h2>
          <button
            onClick={handleRegenerateAll}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: palette[primaryColorHue][colorIndex],
              color: '#ffffff',
              border: 'none',
              borderRadius: '4px',
              padding: '8px 16px',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            <span style={{ fontSize: '16px' }}>↻</span> Regenerate All
          </button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <h3>Nivo Charts</h3>
          <button 
            onClick={() => handleRegenerateComponent('charts')}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              cursor: 'pointer',
              fontSize: '12px',
              color: primaryColor,
            }}
          >
            <span style={{ fontSize: '14px' }}>↻</span> Regenerate Charts
          </button>
        </div>
        <div style={{ 
          backgroundColor: pageBackgroundColor,
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '30px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
        }}>
          <ChartsPreview
            key={`charts-${regenerationKeys.charts}-${regenerationKeys.barChart}-${regenerationKeys.lineChart}-${regenerationKeys.pieChart}`}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
            accentColor={accentColor}
            backgroundColor={pageBackgroundColor}
            textColor={isDarkMode ? '#ffffff' : '#000000'}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <h3>Custom Charts</h3>
          <button 
            onClick={() => handleRegenerateComponent('dataviz')}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              cursor: 'pointer',
              fontSize: '12px',
              color: primaryColor,
            }}
          >
            <span style={{ fontSize: '14px' }}>↻</span> Regenerate Visualizations
          </button>
        </div>
        <DataVisualization
          key={`dataviz-${regenerationKeys.charts}-${regenerationKeys.barChart}-${regenerationKeys.lineChart}-${regenerationKeys.pieChart}`}
          palette={palette}
          isDarkMode={isDarkMode}
          pageBackgroundColor={pageBackgroundColor}
          onRegenerateChart={(chartType) => {
            console.log(`Regenerating ${chartType} chart`);
            handleRegenerateChart(chartType);
          }}
        />
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', marginTop: '20px' }}>
          <h3>Form Elements</h3>
          <button 
            onClick={() => handleRegenerateComponent('forms')}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              cursor: 'pointer',
              fontSize: '12px',
              color: primaryColor,
            }}
          >
            <span style={{ fontSize: '14px' }}>↻</span> Regenerate Forms
          </button>
        </div>
        <FormElements
          key={`forms-${regenerationKeys.forms}-${regenerationKeys.buttons}-${regenerationKeys.badges}-${regenerationKeys.inputs}-${regenerationKeys.toggles}-${regenerationKeys.sliders}-${regenerationKeys.cards}-${regenerationKeys.alerts}`}
          palette={palette}
          isDarkMode={isDarkMode}
          pageBackgroundColor={pageBackgroundColor}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', marginTop: '20px' }}>
          <h3>UI Components</h3>
          <button 
            onClick={() => handleRegenerateComponent('showcase')}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              cursor: 'pointer',
              fontSize: '12px',
              color: primaryColor,
            }}
          >
            <span style={{ fontSize: '14px' }}>↻</span> Regenerate Components
          </button>
        </div>
        <ComponentsShowcase 
          key={`showcase-${regenerationKeys.componentsShowcase}-${regenerationKeys.buttons}-${regenerationKeys.badges}-${regenerationKeys.inputs}-${regenerationKeys.toggles}-${regenerationKeys.sliders}-${regenerationKeys.cards}-${regenerationKeys.alerts}`}
          palette={palette} 
          algorithm={algorithm} 
          isDarkMode={isDarkMode} 
          pageBackgroundColor={pageBackgroundColor}
          regenerateKey={regenerationKeys.componentsShowcase}
          onRegenerateComponent={(componentType) => {
            console.log(`Regenerating ${componentType} component`);
            handleRegenerateComponent(componentType);
          }}
        />
      </div>
    </div>
  );
};

export default DashboardView;