import React, { useState, useEffect } from 'react';

type DataVisualizationProps = {
  palette: Record<string, string[]>;
  isDarkMode: boolean;
  pageBackgroundColor: string;
  onRegenerateChart?: (chartType: string) => void;
};

// Simple data visualization components that leverage the palette
const DataVisualization: React.FC<DataVisualizationProps> = ({ 
  palette, 
  isDarkMode,
  pageBackgroundColor,
  onRegenerateChart
}) => {
  // Local regeneration state
  const [chartKeys, setChartKeys] = useState({
    bar: 0,
    line: 0,
    pie: 0
  });

  // Generate random data for charts
  const generateRandomData = (length: number, min: number, max: number) => {
    return Array.from({ length }, () => Math.floor(Math.random() * (max - min + 1)) + min);
  };

  // Chart data with randomization
  const [barData, setBarData] = useState(generateRandomData(8, 30, 80));
  const [lineData, setLineData] = useState(generateRandomData(12, 25, 70));
  const [pieData, setPieData] = useState(generateRandomData(5, 10, 30));

  // Regenerate specific chart type
  const handleRegenerateChart = (chartType: string) => {
    setChartKeys(prev => ({
      ...prev,
      [chartType]: prev[chartType as keyof typeof prev] + 1
    }));

    // Generate new random data based on chart type
    if (chartType === 'bar') {
      setBarData(generateRandomData(8, 30, 80));
    } else if (chartType === 'line') {
      setLineData(generateRandomData(12, 25, 70));
    } else if (chartType === 'pie') {
      setPieData(generateRandomData(5, 10, 30));
    }

    if (onRegenerateChart) {
      onRegenerateChart(chartType);
    }
  };

  // Chart header component with regenerate button
  const ChartHeader = ({ title, chartType }: { title: string, chartType: string }) => {
    const hues = Object.keys(palette);
    const colorHue = hues.filter(hue => hue !== 'gray' && hue !== 'slate-gray')[0];
    const buttonColor = palette[colorHue][isDarkMode ? 7 : 5];
    
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '12px'
      }}>
        <h4 style={{ fontSize: '14px', margin: 0 }}>{title}</h4>
        <button 
          onClick={() => handleRegenerateChart(chartType)}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            cursor: 'pointer',
            fontSize: '12px',
            color: buttonColor,
          }}
        >
          <span style={{ fontSize: '14px' }}>↻</span> Regenerate
        </button>
      </div>
    );
  };
  
  // Get appropriate colors from the palette
  const hues = Object.keys(palette);
  const colorKeys = hues.filter(hue => hue !== 'gray' && hue !== 'slate-gray').slice(0, 5);
  if (colorKeys.length < 3) {
    // If not enough color hues, duplicate some
    while (colorKeys.length < 5) {
      colorKeys.push(colorKeys[colorKeys.length % colorKeys.length]);
    }
  }
  
  // Get color indices based on dark/light mode
  const colorIndex = isDarkMode ? 7 : 6; // Mid-bright for dark mode, mid-dark for light mode
  
  // Helper to get colors with a step offset for variations
  const getColorWithOffset = (hue: string, baseIndex: number, offset: number = 0) => {
    const targetIndex = Math.min(Math.max(baseIndex + offset, 0), 15);
    return palette[hue][targetIndex];
  };
  
  return (
    <div style={{ paddingTop: '32px', paddingBottom: '32px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
        {/* Bar Chart */}
        <div style={{ 
          backgroundColor: pageBackgroundColor,
          padding: '16px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
        }}>
          <ChartHeader title="Bar Chart" chartType="bar" />
          <div style={{ 
            height: '180px', 
            display: 'flex', 
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            padding: '0 10px'
          }}>
            {barData.map((value, index) => (
              <div 
                key={`bar-${index}-${chartKeys.bar}`}
                style={{
                  height: `${value}%`,
                  width: '24px',
                  backgroundColor: getColorWithOffset(colorKeys[0], colorIndex, Math.floor(index / 2) - 2),
                  borderRadius: '3px 3px 0 0',
                  transition: 'height 0.3s'
                }}
              />
            ))}
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            paddingTop: '8px',
            borderTop: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
            marginTop: '8px',
            fontSize: '12px'
          }}>
            <span>Category A</span>
            <span>Category H</span>
          </div>
        </div>
        
        {/* Line Chart */}
        <div style={{ 
          backgroundColor: pageBackgroundColor,
          padding: '16px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
        }}>
          <ChartHeader title="Line Chart" chartType="line" />
          <div style={{ 
            height: '180px', 
            position: 'relative',
            padding: '10px 0'
          }}>
            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
              {/* Grid lines */}
              <line x1="0" y1="0" x2="100" y2="0" stroke={isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} strokeWidth="0.5" />
              <line x1="0" y1="25" x2="100" y2="25" stroke={isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} strokeWidth="0.5" />
              <line x1="0" y1="50" x2="100" y2="50" stroke={isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} strokeWidth="0.5" />
              <line x1="0" y1="75" x2="100" y2="75" stroke={isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} strokeWidth="0.5" />
              <line x1="0" y1="100" x2="100" y2="100" stroke={isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} strokeWidth="0.5" />

              {/* Line series */}
              <polyline
                points={lineData.map((value, index) => 
                  `${index * (100 / (lineData.length - 1))},${100 - value}`
                ).join(' ')}
                fill="none"
                stroke={getColorWithOffset(colorKeys[1], colorIndex)}
                strokeWidth="2"
              />
              
              {/* Data points */}
              {lineData.map((value, index) => (
                <circle
                  key={`point-${index}-${chartKeys.line}`}
                  cx={`${index * (100 / (lineData.length - 1))}`}
                  cy={`${100 - value}`}
                  r="2"
                  fill={getColorWithOffset(colorKeys[1], colorIndex, 2)}
                />
              ))}
            </svg>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            paddingTop: '8px',
            borderTop: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
            marginTop: '8px',
            fontSize: '12px'
          }}>
            <span>Jan</span>
            <span>Dec</span>
          </div>
        </div>
        
        {/* Pie Chart */}
        <div style={{ 
          backgroundColor: pageBackgroundColor,
          padding: '16px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
        }}>
          <ChartHeader title="Pie Chart" chartType="pie" />
          <div style={{ 
            height: '180px', 
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative'
          }}>
            <svg width="140" height="140" viewBox="0 0 100 100">
              {/* We'll create a simple pie chart with color segments */}
              {pieData.map((value, index) => {
                // Calculate the SVG arc parameters
                const total = pieData.reduce((a, b) => a + b, 0);
                const startAngle = pieData.slice(0, index).reduce((a, b) => a + b, 0) * 360 / total;
                const endAngle = startAngle + value * 360 / total;
                
                // Convert to radians for the math
                const startRad = (startAngle - 90) * Math.PI / 180;
                const endRad = (endAngle - 90) * Math.PI / 180;
                
                // Calculate the SVG arc path
                const x1 = 50 + 40 * Math.cos(startRad);
                const y1 = 50 + 40 * Math.sin(startRad);
                const x2 = 50 + 40 * Math.cos(endRad);
                const y2 = 50 + 40 * Math.sin(endRad);
                
                // Use a different color for each segment
                const pieColor = getColorWithOffset(colorKeys[index % colorKeys.length], colorIndex, index - 2);
                
                // SVG arc flags
                const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;
                
                return (
                  <path
                    key={`pie-${index}-${chartKeys.pie}`}
                    d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                    fill={pieColor}
                  />
                );
              })}
              <circle cx="50" cy="50" r="25" fill={pageBackgroundColor} />
            </svg>
            <div style={{ 
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: '18px',
              fontWeight: 'bold'
            }}>
              100%
            </div>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            paddingTop: '8px',
            borderTop: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
            marginTop: '8px',
            fontSize: '12px'
          }}>
            {pieData.map((value, index) => (
              <div key={`legend-${index}-${chartKeys.pie}`} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ 
                  width: '12px', 
                  height: '12px', 
                  borderRadius: '2px',
                  backgroundColor: getColorWithOffset(colorKeys[index % colorKeys.length], colorIndex, index - 2)
                }}></div>
                <span>Segment {String.fromCharCode(65 + index)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataVisualization; 
