import React, { useState, useEffect } from 'react';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsiveLine } from '@nivo/line';
import { ResponsivePie } from '@nivo/pie';

interface ChartsPreviewProps {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
}

const ChartsPreview: React.FC<ChartsPreviewProps> = ({
  primaryColor,
  secondaryColor,
  accentColor,
  backgroundColor,
  textColor,
}) => {
  // Generate random data for charts
  const generateRandomData = () => {
    // Random bar data
    const barData = Array.from({ length: 6 }, (_, i) => ({
      month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][i],
      dataset1: Math.floor(Math.random() * 20) + 5,
      dataset2: Math.floor(Math.random() * 15) + 5,
    }));

    // Random line data
    const lineData = [
      {
        id: 'dataset1',
        color: primaryColor,
        data: Array.from({ length: 6 }, (_, i) => ({
          x: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][i],
          y: Math.floor(Math.random() * 20) + 5,
        })),
      },
      {
        id: 'dataset2',
        color: secondaryColor,
        data: Array.from({ length: 6 }, (_, i) => ({
          x: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][i],
          y: Math.floor(Math.random() * 15) + 5,
        })),
      },
    ];

    // Random pie data
    const pieData = [
      { id: 'Category 1', label: 'Category 1', value: Math.floor(Math.random() * 20) + 5, color: primaryColor },
      { id: 'Category 2', label: 'Category 2', value: Math.floor(Math.random() * 20) + 5, color: secondaryColor },
      { id: 'Category 3', label: 'Category 3', value: Math.floor(Math.random() * 10) + 5, color: accentColor },
      { id: 'Category 4', label: 'Category 4', value: Math.floor(Math.random() * 10) + 5, color: 'rgba(153, 102, 255, 0.6)' },
    ];

    return { barData, lineData, pieData };
  };

  // Initialize with random data
  const [data, setData] = useState(generateRandomData());

  // Regenerate data when props change (key change will trigger this)
  useEffect(() => {
    setData(generateRandomData());
  }, [primaryColor, secondaryColor, accentColor]);

  // Common theme for charts
  const theme = {
    textColor,
    fontSize: 11,
    axis: {
      domain: {
        line: {
          stroke: `${textColor}22`,
          strokeWidth: 1,
        },
      },
      ticks: {
        line: {
          stroke: `${textColor}22`,
          strokeWidth: 1,
        },
        text: {
          fill: textColor,
        },
      },
      legend: {
        text: {
          fill: textColor,
        },
      },
    },
    grid: {
      line: {
        stroke: `${textColor}22`,
        strokeWidth: 1,
      },
    },
    legends: {
      text: {
        fill: textColor,
      },
    },
    tooltip: {
      container: {
        background: backgroundColor,
        color: textColor,
        fontSize: 12,
      },
    },
  };

  return (
    <div className="charts-preview" style={{ color: textColor }}>
      <h3>Data Visualization</h3>
      <div className="charts-grid">
        <div className="chart-container">
          <h4>Bar Chart</h4>
          <div style={{ height: '200px' }}>
            <ResponsiveBar
              data={data.barData}
              keys={['dataset1', 'dataset2']}
              indexBy="month"
              margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
              padding={0.3}
              colors={[primaryColor, secondaryColor]}
              borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Month',
                legendPosition: 'middle',
                legendOffset: 32,
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Value',
                legendPosition: 'middle',
                legendOffset: -40,
              }}
              labelSkipWidth={12}
              labelSkipHeight={12}
              labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
              theme={theme}
              animate={true}
              isInteractive={true}
              legends={[
                {
                  dataFrom: 'keys',
                  anchor: 'top',
                  direction: 'row',
                  justify: false,
                  translateX: 0,
                  translateY: -20,
                  itemsSpacing: 2,
                  itemWidth: 100,
                  itemHeight: 20,
                  itemDirection: 'left-to-right',
                  symbolSize: 12,
                },
              ]}
            />
          </div>
        </div>
        <div className="chart-container">
          <h4>Line Chart</h4>
          <div style={{ height: '200px' }}>
            <ResponsiveLine
              data={data.lineData}
              margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
              xScale={{ type: 'point' }}
              yScale={{
                type: 'linear',
                min: 'auto',
                max: 'auto',
                stacked: false,
                reverse: false,
              }}
              curve="monotoneX"
              axisTop={null}
              axisRight={null}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Month',
                legendOffset: 36,
                legendPosition: 'middle',
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Value',
                legendOffset: -40,
                legendPosition: 'middle',
              }}
              colors={[primaryColor, secondaryColor]}
              pointSize={10}
              pointColor={{ from: 'color', modifiers: [] }}
              pointBorderWidth={2}
              pointBorderColor={{ from: 'color', modifiers: [['darker', 0.3]] }}
              enablePointLabel={false}
              pointLabel="y"
              pointLabelYOffset={-12}
              useMesh={true}
              theme={theme}
              legends={[
                {
                  anchor: 'top',
                  direction: 'row',
                  justify: false,
                  translateX: 0,
                  translateY: -20,
                  itemsSpacing: 0,
                  itemDirection: 'left-to-right',
                  itemWidth: 80,
                  itemHeight: 20,
                  symbolSize: 12,
                  symbolShape: 'circle',
                },
              ]}
            />
          </div>
        </div>
        <div className="chart-container">
          <h4>Pie Chart</h4>
          <div style={{ height: '200px' }}>
            <ResponsivePie
              data={data.pieData}
              margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
              innerRadius={0.5}
              padAngle={0.7}
              cornerRadius={3}
              activeOuterRadiusOffset={8}
              borderWidth={1}
              borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
              colors={{ scheme: 'category10' }}
              arcLinkLabelsSkipAngle={10}
              arcLinkLabelsTextColor={textColor}
              arcLinkLabelsThickness={2}
              arcLinkLabelsColor={{ from: 'color' }}
              arcLabelsSkipAngle={10}
              arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
              theme={theme}
              legends={[
                {
                  anchor: 'top',
                  direction: 'row',
                  justify: false,
                  translateX: 0,
                  translateY: -20,
                  itemsSpacing: 0,
                  itemWidth: 100,
                  itemHeight: 20,
                  itemTextColor: '#999',
                  itemDirection: 'left-to-right',
                  symbolSize: 12,
                  symbolShape: 'circle',
                },
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartsPreview; 