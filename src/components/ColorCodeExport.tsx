import { useState } from 'react';
import Color from 'colorjs.io';

type ColorCodeExportProps = {
  background: string;
  foreground: string;
  bgHue?: string;
  fgHue?: string;
};

type ExportFormat = 'css' | 'tailwind' | 'figma' | 'swift';

const ColorCodeExport: React.FC<ColorCodeExportProps> = ({
  background,
  foreground,
  bgHue,
  fgHue
}) => {
  const [exportFormat, setExportFormat] = useState<ExportFormat>('css');
  
  // Convert colors to various formats
  const getHexValue = (colorValue: string): string => {
    try {
      const color = new Color(colorValue);
      return color.to("srgb").toString({format: "hex"});
    } catch (error) {
      return colorValue; // Return original if conversion fails
    }
  };
  
  const getRgbValue = (colorValue: string): string => {
    try {
      const color = new Color(colorValue);
      const rgb = color.to("srgb");
      const r = Math.round(rgb.coords[0] * 255);
      const g = Math.round(rgb.coords[1] * 255);
      const b = Math.round(rgb.coords[2] * 255);
      return `rgb(${r}, ${g}, ${b})`;
    } catch (error) {
      return colorValue; // Return original if conversion fails
    }
  };

  // Background and foreground in different formats
  const bgHex = getHexValue(background);
  const fgHex = getHexValue(foreground);
  const bgRgb = getRgbValue(background);
  const fgRgb = getRgbValue(foreground);
  
  // Generate code based on selected format
  const generateCode = (): string => {
    const bgVarName = bgHue ? `--color-${bgHue}-bg` : '--color-bg';
    const fgVarName = fgHue ? `--color-${fgHue}-fg` : '--color-fg';
    
    switch (exportFormat) {
      case 'css':
        return `:root {
  /* Color variables */
  ${bgVarName}: ${bgHex};
  ${fgVarName}: ${fgHex};
}

/* Usage example */
.element {
  background-color: var(${bgVarName});
  color: var(${fgVarName});
}`;

      case 'tailwind':
        return `// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        '${bgHue || 'background'}': '${bgHex}',
        '${fgHue || 'foreground'}': '${fgHex}',
      }
    }
  }
}

<!-- Usage example -->
<div class="bg-${bgHue || 'background'} text-${fgHue || 'foreground'}">
  Your content here
</div>`;

      case 'figma':
        return `// Figma Variables
Name: ${bgHue || 'Background'} / ${fgHue || 'Foreground'} 
Background: ${bgHex} (${bgRgb})
Foreground: ${fgHex} (${fgRgb})

// You can copy these values directly into Figma's color picker`;

      case 'swift':
        return `// SwiftUI Colors
import SwiftUI

extension Color {
    static let customBackground = Color("${bgHue || 'Background'}")
    static let customForeground = Color("${fgHue || 'Foreground'}")
}

// Color assets (Add to Assets.xcassets)
// ${bgHue || 'Background'}: ${bgHex}
// ${fgHue || 'Foreground'}: ${fgHex}

// Usage
struct ContentView: View {
    var body: some View {
        Text("Hello, world!")
            .foregroundColor(.customForeground)
            .background(.customBackground)
    }
}`;
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateCode())
      .then(() => {
        alert('Code copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  };

  return (
    <div className="color-code-export">
      <h3>Export Color Code</h3>
      
      <div className="format-selector">
        <label>Select Format:</label>
        <div className="format-buttons">
          <button 
            className={`format-button ${exportFormat === 'css' ? 'active' : ''}`}
            onClick={() => setExportFormat('css')}
          >
            CSS Variables
          </button>
          <button 
            className={`format-button ${exportFormat === 'tailwind' ? 'active' : ''}`}
            onClick={() => setExportFormat('tailwind')}
          >
            Tailwind CSS
          </button>
          <button 
            className={`format-button ${exportFormat === 'figma' ? 'active' : ''}`}
            onClick={() => setExportFormat('figma')}
          >
            Figma
          </button>
          <button 
            className={`format-button ${exportFormat === 'swift' ? 'active' : ''}`}
            onClick={() => setExportFormat('swift')}
          >
            SwiftUI
          </button>
        </div>
      </div>
      
      <div className="code-preview">
        <pre><code>{generateCode()}</code></pre>
      </div>
      
      <button className="copy-button" onClick={copyToClipboard}>
        Copy to Clipboard
      </button>
    </div>
  );
};

export default ColorCodeExport; 