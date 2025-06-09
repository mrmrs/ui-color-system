import { useState, useEffect, useMemo } from 'react'
import './App.css'
import Badge from './components/Badge'
import Avatar from './components/Avatar'
import BadgeFilter from './components/BadgeFilter'
import ColorPaletteModal from './components/ColorPaletteModal'
import PaletteIcon from './components/PaletteIcon'
import { 
  findAccessibleCombinations, 
  getWCAGComplianceLevel,
  getAPCAComplianceDescription,
  sortByBackgroundColor
} from './utils/colorUtils'
import type { ContrastAlgorithm, ColorCombination } from './utils/colorUtils'
import ThemePreview from './components/ThemePreview'
import ColorCodeExport from './components/ColorCodeExport'
import ContrastMeter from './components/ContrastMeter'
import BackgroundContextSwitcher from './components/BackgroundContextSwitcher'
import type { BackgroundMode } from './components/BackgroundContextSwitcher'
import BackgroundVariationControls from './components/BackgroundVariationControls'
import GradientBadge from './components/GradientBadge'
import GradientAvatar from './components/GradientAvatar'
import type { BackgroundVariant, GradientType, GradientDirection } from './utils/colorUtils'

const colors3 = {
    gray: [
      "#000000",
      "#171717",
      "#2f2f2f",
      "#464646",
      "#5e5e5e",
      "#757575",
      "#8c8c8c",
      "#a3a3a3",
      "#bababa",
      "#d1d1d1",
      "#e8e8e8",
      "#ffffff",
    ],
    "slate-gray": [
      "#09090b",
      "#1d1d22",
      "#313138",
      "#45444f",
      "#595866",
      "#6d6c7d",
      "#838292",
      "#9a9aa7",
      "#b2b1bb",
      "#c9c9d0",
      "#e1e0e4",
      "#f8f8f9",
    ],
    blue: [
      "#030b18",
      "#071e3f",
      "#0c3166",
      "#10448d",
      "#1556b4",
      "#1969db",
      "#317fed",
      "#5797f0",
      "#7daef4",
      "#a3c6f7",
      "#c9ddfa",
      "#eff5fe",
    ],
    indigo: [
      "#080614",
      "#19143f",
      "#2a216a",
      "#3a2e95",
      "#4b3bc0",
      "#5c49eb",
      "#725fff",
      "#8c7cff",
      "#a69aff",
      "#c0b7ff",
      "#dad5ff",
      "#f4f3ff",
    ],
    violet: [
      "#110517",
      "#2e0d3e",
      "#4b1465",
      "#681c8c",
      "#8424b3",
      "#a12cda",
      "#b543ec",
      "#c366f0",
      "#d089f3",
      "#deabf7",
      "#eccefa",
      "#f9f0fe",
    ],
    magenta: [
      "#13040f",
      "#350a2c",
      "#581148",
      "#7b1765",
      "#9e1e82",
      "#c1249e",
      "#d43cb2",
      "#dc61c1",
      "#e485cf",
      "#eca9dd",
      "#f4ceec",
      "#fcf2fa",
    ],
    red: [
      "#120205",
      "#39050f",
      "#5f0819",
      "#860b24",
      "#ac0e2e",
      "#d31138",
      "#e7284e",
      "#ec506f",
      "#f07790",
      "#f49fb0",
      "#f9c7d1",
      "#fdeef1",
    ],
    "red-orange": [
      "#190b05",
      "#3d1307",
      "#601b0a",
      "#84240c",
      "#a72c0e",
      "#cb3411",
      "#ee3c13",
      "#fe562f",
      "#fe7d5e",
      "#ffa48e",
      "#ffccbe",
      "#fff3ee",
    ],
    orange: [
      "#150d04",
      "#2e1c08",
      "#472a0c",
      "#603910",
      "#794714",
      "#a65d13",
      "#d37413",
      "#ff8a14",
      "#ffa54a",
      "#ffc081",
      "#ffdab7",
      "#fff5ed",
    ],
    gold: [
      "#140e05",
      "#2c1f0a",
      "#432f0e",
      "#5b4013",
      "#725118",
      "#946818",
      "#d4950d",
      "#eeb028",
      "#f2c259",
      "#f7d38a",
      "#fbe5bc",
      "#fff5e9",
    ],
    yellow: [
      "#111006",
      "#252405",
      "#3a3804",
      "#4e4d03",
      "#636101",
      "#777500",
      "#ccc500",
      "#fcf433",
      "#fdf67a",
      "#fdf89b",
      "#fef9bb",
      "#fefadb",
    ],
    green: [
      "#091108",
      "#0f2611",
      "#153c1a",
      "#1b5122",
      "#21662b",
      "#25833a",
      "#26b056",
      "#35d272",
      "#63dd90",
      "#90e8ae",
      "#bdf3cc",
      "#eafeea",
    ],
    teal: [
      "#07100c",
      "#0c231a",
      "#113628",
      "#164936",
      "#1b5b45",
      "#177f63",
      "#12a282",
      "#2abb9b",
      "#5acab1",
      "#8bdac7",
      "#bbe9dc",
      "#ecf8f2",
    ],
    cyan: [
      "#0a1211",
      "#102425",
      "#153639",
      "#1b484c",
      "#215a60",
      "#247981",
      "#24a9b6",
      "#28d6e6",
      "#57e0ec",
      "#85eaf2",
      "#b4f5f9",
      "#e2ffff",
    ],
}

const colors2 = {
    gray: [
      "#000000",
      "#1a1a1a",
      "#353535",
      "#4e4e4e",
      "#686868",
      "#808080",
      "#979797",
      "#adadad",
      "#c2c2c2",
      "#d7d7d7",
      "#ebebeb",
      "#ffffff",
    ],
    "slate-gray": [
      "#0c0c0e",
      "#26262c",
      "#403f49",
      "#595865",
      "#71707f",
      "#878697",
      "#9d9cad",
      "#b1b0c0",
      "#c4c4d0",
      "#d7d6e0",
      "#e8e8ee",
      "#fafafb",
    ],
    blue: [
      "#000b1f",
      "#01215e",
      "#033799",
      "#084dcf",
      "#1263fc",
      "#2178ff",
      "#378eff",
      "#53a3ff",
      "#75b8ff",
      "#9acdff",
      "#c3e2ff",
      "#edf6ff",
    ],
    indigo: [
      "#0b081f",
      "#23195e",
      "#3a2a99",
      "#523ccf",
      "#684ffc",
      "#7e63ff",
      "#9478ff",
      "#a88fff",
      "#bda7ff",
      "#d0c0ff",
      "#e4daff",
      "#f7f4ff",
    ],
    violet: [
      "#1a0023",
      "#44015c",
      "#6c0392",
      "#9009c2",
      "#b113eb",
      "#cc22ff",
      "#e138ff",
      "#ef54ff",
      "#f876ff",
      "#fd9bff",
      "#ffc3ff",
      "#ffedff",
    ],
    magenta: [
      "#170112",
      "#410333",
      "#6b0555",
      "#960776",
      "#c00998",
      "#eb0bb9",
      "#fc24cd",
      "#fd4dd6",
      "#fd76df",
      "#fe9fe9",
      "#fec8f2",
      "#fff0fc",
    ],
    red: [
      "#140505",
      "#3f0f10",
      "#6a191b",
      "#942425",
      "#bf2e30",
      "#ea383b",
      "#fe4e51",
      "#fe6f71",
      "#fe9091",
      "#ffb0b1",
      "#ffd1d2",
      "#fff1f2",
    ],
    "red-orange": [
      "#140602",
      "#3d1407",
      "#66210c",
      "#8f2f10",
      "#b83c15",
      "#e24a1a",
      "#f66030",
      "#f87d56",
      "#f99a7d",
      "#fbb8a3",
      "#fdd5c9",
      "#fef3ef",
    ],
    orange: [
      "#170a00",
      "#411a05",
      "#692a09",
      "#8e3b0a",
      "#af4c08",
      "#d76a00",
      "#f79700",
      "#ffb70d",
      "#ffc836",
      "#ffd96d",
      "#ffeaac",
      "#fffaf0",
    ],
    yellow: [
      "#0d0e01",
      "#2a2805",
      "#474308",
      "#635c0a",
      "#7e750a",
      "#998d07",
      "#d5c200",
      "#fde90d",
      "#fff32f",
      "#fff960",
      "#fffc9c",
      "#fbfedc",
    ],
    green: [
      "#011409",
      "#01311b",
      "#024d2d",
      "#02683c",
      "#018149",
      "#009953",
      "#00be5c",
      "#03d662",
      "#50eb94",
      "#89f2b8",
      "#b9f8d7",
      "#ebfff7",
    ],
    teal: [
      "#07100c",
      "#13261c",
      "#1c3c2c",
      "#1d533e",
      "#117156",
      "#039474",
      "#11b495",
      "#2bc3a7",
      "#51d1b9",
      "#7fdecc",
      "#b4ebdf",
      "#ecf8f2",
    ],
    cyan: [
      "#021313",
      "#072f30",
      "#0c4b4d",
      "#116568",
      "#147e81",
      "#169498",
      "#14b8be",
      "#1edae2",
      "#56e8ef",
      "#9eeff4",
      "#ccf7f9",
      "#e5ffff",
    ],
}

// Removed from here as we already have it defined as colors1

// Original display-p3 color palette
const colors1 = {
  gray: [
    'color(display-p3 0 0 0)', // 0 - Black
    'color(display-p3 0.07 0.07 0.07)',
    'color(display-p3 0.14 0.14 0.14)',
    'color(display-p3 0.21 0.21 0.21)',
    'color(display-p3 0.29 0.29 0.29)',
    'color(display-p3 0.36 0.36 0.36)',
    'color(display-p3 0.43 0.43 0.43)',
    'color(display-p3 0.5 0.5 0.5)',
    'color(display-p3 0.6 0.6 0.6)',
    'color(display-p3 0.7 0.7 0.7)',
    'color(display-p3 0.78 0.78 0.78)',
    'color(display-p3 0.85 0.85 0.85)',
    'color(display-p3 0.9 0.9 0.9)',
    'color(display-p3 0.94 0.94 0.94)',
    'color(display-p3 0.97 0.97 0.97)',
    'color(display-p3 0.99 0.99 0.99)' // 15 - Almost White
  ],
  red: [
    'color(display-p3 0.07 0 0)',
    'color(display-p3 0.14 0 0)',
    'color(display-p3 0.21 0 0)',
    'color(display-p3 0.29 0 0)',
    'color(display-p3 0.36 0 0)',
    'color(display-p3 0.43 0 0)',
    'color(display-p3 0.5 0 0)',
    'color(display-p3 0.6 0.05 0.05)',
    'color(display-p3 0.7 0.1 0.1)',
    'color(display-p3 0.78 0.15 0.15)',
    'color(display-p3 0.85 0.25 0.25)',
    'color(display-p3 0.9 0.35 0.35)',
    'color(display-p3 0.94 0.5 0.5)',
    'color(display-p3 0.97 0.7 0.7)',
    'color(display-p3 0.99 0.85 0.85)',
    'color(display-p3 0.995 0.93 0.93)'
  ],
  redorange: [
    'color(display-p3 0.07 0.01 0)',
    'color(display-p3 0.14 0.02 0)',
    'color(display-p3 0.21 0.03 0)',
    'color(display-p3 0.29 0.04 0)',
    'color(display-p3 0.36 0.05 0)',
    'color(display-p3 0.43 0.06 0)',
    'color(display-p3 0.5 0.08 0)',
    'color(display-p3 0.6 0.12 0.05)',
    'color(display-p3 0.7 0.18 0.1)',
    'color(display-p3 0.78 0.25 0.15)',
    'color(display-p3 0.85 0.35 0.2)',
    'color(display-p3 0.9 0.45 0.3)',
    'color(display-p3 0.94 0.6 0.45)',
    'color(display-p3 0.97 0.75 0.65)',
    'color(display-p3 0.99 0.87 0.82)',
    'color(display-p3 0.995 0.94 0.91)'
  ],
  orange: [
    'color(display-p3 0.07 0.02 0)',
    'color(display-p3 0.14 0.05 0)',
    'color(display-p3 0.21 0.07 0)',
    'color(display-p3 0.29 0.1 0)',
    'color(display-p3 0.36 0.12 0)',
    'color(display-p3 0.43 0.15 0)',
    'color(display-p3 0.5 0.18 0)',
    'color(display-p3 0.6 0.25 0.05)',
    'color(display-p3 0.7 0.35 0.1)',
    'color(display-p3 0.78 0.45 0.15)',
    'color(display-p3 0.85 0.55 0.2)',
    'color(display-p3 0.9 0.65 0.3)',
    'color(display-p3 0.94 0.75 0.45)',
    'color(display-p3 0.97 0.85 0.65)',
    'color(display-p3 0.99 0.92 0.82)',
    'color(display-p3 0.995 0.96 0.91)'
  ],
  gold: [
    'color(display-p3 0.07 0.04 0)',
    'color(display-p3 0.14 0.08 0)',
    'color(display-p3 0.21 0.12 0)',
    'color(display-p3 0.29 0.17 0)',
    'color(display-p3 0.36 0.21 0)',
    'color(display-p3 0.43 0.25 0)',
    'color(display-p3 0.5 0.3 0)',
    'color(display-p3 0.6 0.4 0.05)',
    'color(display-p3 0.7 0.5 0.1)',
    'color(display-p3 0.78 0.6 0.15)',
    'color(display-p3 0.85 0.7 0.2)',
    'color(display-p3 0.9 0.78 0.3)',
    'color(display-p3 0.94 0.85 0.45)',
    'color(display-p3 0.97 0.92 0.65)',
    'color(display-p3 0.99 0.96 0.82)',
    'color(display-p3 0.995 0.98 0.91)'
  ],
  yellow: [
    'color(display-p3 0.07 0.07 0)',
    'color(display-p3 0.14 0.14 0)',
    'color(display-p3 0.21 0.21 0)',
    'color(display-p3 0.29 0.29 0)',
    'color(display-p3 0.36 0.36 0)',
    'color(display-p3 0.43 0.43 0)',
    'color(display-p3 0.5 0.5 0)',
    'color(display-p3 0.6 0.6 0.05)',
    'color(display-p3 0.7 0.7 0.1)',
    'color(display-p3 0.78 0.78 0.15)',
    'color(display-p3 0.85 0.85 0.2)',
    'color(display-p3 0.9 0.9 0.35)',
    'color(display-p3 0.94 0.94 0.5)',
    'color(display-p3 0.97 0.97 0.7)',
    'color(display-p3 0.99 0.99 0.85)',
    'color(display-p3 0.995 0.995 0.93)'
  ],
  green: [
    'color(display-p3 0 0.07 0)',
    'color(display-p3 0 0.14 0)',
    'color(display-p3 0 0.21 0)',
    'color(display-p3 0 0.29 0)',
    'color(display-p3 0 0.36 0)',
    'color(display-p3 0 0.43 0)',
    'color(display-p3 0 0.5 0)',
    'color(display-p3 0.05 0.6 0.05)',
    'color(display-p3 0.1 0.7 0.1)',
    'color(display-p3 0.15 0.78 0.15)',
    'color(display-p3 0.25 0.85 0.25)',
    'color(display-p3 0.35 0.9 0.35)',
    'color(display-p3 0.5 0.94 0.5)',
    'color(display-p3 0.7 0.97 0.7)',
    'color(display-p3 0.85 0.99 0.85)',
    'color(display-p3 0.93 0.995 0.93)'
  ],
  cyan: [
    'color(display-p3 0 0.07 0.07)',
    'color(display-p3 0 0.14 0.14)',
    'color(display-p3 0 0.21 0.21)',
    'color(display-p3 0 0.29 0.29)',
    'color(display-p3 0 0.36 0.36)',
    'color(display-p3 0 0.43 0.43)',
    'color(display-p3 0 0.5 0.5)',
    'color(display-p3 0.05 0.6 0.6)',
    'color(display-p3 0.1 0.7 0.7)',
    'color(display-p3 0.15 0.78 0.78)',
    'color(display-p3 0.25 0.85 0.85)',
    'color(display-p3 0.35 0.9 0.9)',
    'color(display-p3 0.5 0.94 0.94)',
    'color(display-p3 0.7 0.97 0.97)',
    'color(display-p3 0.85 0.99 0.99)',
    'color(display-p3 0.93 0.995 0.995)'
  ],
  blue: [
    'color(display-p3 0 0 0.07)',
    'color(display-p3 0 0 0.14)',
    'color(display-p3 0 0 0.21)',
    'color(display-p3 0 0 0.29)',
    'color(display-p3 0 0 0.36)',
    'color(display-p3 0 0 0.43)',
    'color(display-p3 0 0 0.5)',
    'color(display-p3 0.05 0.05 0.6)',
    'color(display-p3 0.1 0.1 0.7)',
    'color(display-p3 0.15 0.15 0.78)',
    'color(display-p3 0.25 0.25 0.85)',
    'color(display-p3 0.35 0.35 0.9)',
    'color(display-p3 0.5 0.5 0.94)',
    'color(display-p3 0.7 0.7 0.97)',
    'color(display-p3 0.85 0.85 0.99)',
    'color(display-p3 0.93 0.93 0.995)'
  ],
  purple: [
    'color(display-p3 0.04 0 0.07)',
    'color(display-p3 0.08 0 0.14)',
    'color(display-p3 0.12 0 0.21)',
    'color(display-p3 0.17 0 0.29)',
    'color(display-p3 0.21 0 0.36)',
    'color(display-p3 0.25 0 0.43)',
    'color(display-p3 0.3 0 0.5)',
    'color(display-p3 0.35 0.05 0.6)',
    'color(display-p3 0.45 0.1 0.7)',
    'color(display-p3 0.55 0.15 0.78)',
    'color(display-p3 0.65 0.25 0.85)',
    'color(display-p3 0.75 0.35 0.9)',
    'color(display-p3 0.83 0.5 0.94)',
    'color(display-p3 0.9 0.7 0.97)',
    'color(display-p3 0.95 0.85 0.99)',
    'color(display-p3 0.97 0.93 0.995)'
  ],
  magenta: [
    'color(display-p3 0.07 0 0.07)',
    'color(display-p3 0.14 0 0.14)',
    'color(display-p3 0.21 0 0.21)',
    'color(display-p3 0.29 0 0.29)',
    'color(display-p3 0.36 0 0.36)',
    'color(display-p3 0.43 0 0.43)',
    'color(display-p3 0.5 0 0.5)',
    'color(display-p3 0.6 0.05 0.6)',
    'color(display-p3 0.7 0.1 0.7)',
    'color(display-p3 0.78 0.15 0.78)',
    'color(display-p3 0.85 0.25 0.85)',
    'color(display-p3 0.9 0.35 0.9)',
    'color(display-p3 0.94 0.5 0.94)',
    'color(display-p3 0.97 0.7 0.97)',
    'color(display-p3 0.99 0.85 0.99)',
    'color(display-p3 0.995 0.93 0.995)'
  ],
  fucsia: [
    'color(display-p3 0.07 0 0.04)',
    'color(display-p3 0.14 0 0.08)',
    'color(display-p3 0.21 0 0.12)',
    'color(display-p3 0.29 0 0.17)',
    'color(display-p3 0.36 0 0.21)',
    'color(display-p3 0.43 0 0.25)',
    'color(display-p3 0.5 0 0.3)',
    'color(display-p3 0.6 0.05 0.4)',
    'color(display-p3 0.7 0.1 0.5)',
    'color(display-p3 0.78 0.15 0.6)',
    'color(display-p3 0.85 0.25 0.7)',
    'color(display-p3 0.9 0.35 0.8)',
    'color(display-p3 0.94 0.5 0.88)',
    'color(display-p3 0.97 0.7 0.94)',
    'color(display-p3 0.99 0.85 0.97)',
    'color(display-p3 0.995 0.93 0.99)'
  ],
}

// Define available color palettes
type ColorPalette = 'palette1' | 'palette2' | 'palette3';

const colorPalettes = {
  palette1: {
    name: 'Display P3 Palette',
    colors: colors1
  },
  palette2: {
    name: 'RGB Palette 1',
    colors: colors2
  },
  palette3: {
    name: 'RGB Palette 2',
    colors: colors3
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
type UIComponentType = 'badge' | 'avatar' | 'all';

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
  const [activePalette, setActivePalette] = useState<ColorPalette>('palette1');
  const [backgroundMode, setBackgroundMode] = useState<BackgroundMode>('default');
  const [showBorders, setShowBorders] = useState<boolean>(false);
  const [borderLevel, setBorderLevel] = useState<'subtle' | 'strong'>('subtle');
  const [backgroundVariant, setBackgroundVariant] = useState<BackgroundVariant>('solid');
  const [gradientType, setGradientType] = useState<GradientType>('linear');
  const [gradientDirection, setGradientDirection] = useState<GradientDirection>('to right');
  const [hueShift, setHueShift] = useState<number>(15);

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
    setActivePalette(palette);
    // Reset hue filters when changing palettes
    setSelectedBgHue(null);
    setSelectedFgHue(null);
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

  // Handle hue shift change
  const handleHueShiftChange = (shift: number) => {
    setHueShift(shift);
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
                  hueShift={hueShift}
                />
              )}
              
              {(componentType === 'all' || componentType === 'avatar') && (
                <GradientAvatar 
                  backgroundColor={combo.background}
                  foregroundColor={combo.foreground}
                  size="sm"
                  showBorder={showBorders}
                  borderLevel={borderLevel}
                  backgroundVariant={backgroundVariant}
                  gradientType={gradientType}
                  gradientDirection={gradientDirection}
                  hueShift={hueShift}
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
        color: textColors[backgroundMode]
      }}
    >
      {/* Site Header with Filters */}
      <header style={{ borderBottom: '1px solid rgba(0,0,0,2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
            </select></label>
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
              </select>
</label>
          </div>
          </div>
      </header>

      {/* Main Content - UI Components */}
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
                hueShift={hueShift}
                onHueShiftChange={handleHueShiftChange}
              />
            </div>

            <div className="results-summary">
              Found {filteredCombinations.length} accessible combinations using {colorPalettes[activePalette].name}
              {selectedBgHue !== null && ` with ${selectedBgHue} backgrounds`}
              {selectedFgHue !== null && ` and ${selectedFgHue} text`}.
            </div>

            {/* Massive Grid of UI Components */}
            <div className="content-layout">
              {/* Background Hue Sections */}
              <div className="bg-hue-sections">
                {Object.keys(combinationsByBackgroundHue).length > 0 ? (
                  Object.entries(combinationsByBackgroundHue).map(([bgHue, combinations]) => (
                    <div key={bgHue} className="bg-hue-section">
                      <h3 className="bg-hue-title">{bgHue}</h3>
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
                        backgroundColor={selectedCombination.background}
                        foregroundColor={selectedCombination.foreground}
                        contrast={selectedCombination.contrast}
                        algorithm={algorithm}
                        bgHue={selectedCombination.bgHue}
                        fgHue={selectedCombination.fgHue}
                        label="Badge"
                        showBorder={showBorders}
                        borderLevel={borderLevel}
                        backgroundVariant={backgroundVariant}
                        gradientType={gradientType}
                        gradientDirection={gradientDirection}
                        hueShift={hueShift}
                      />
                      <GradientAvatar 
                        backgroundColor={selectedCombination.background}
                        foregroundColor={selectedCombination.foreground}
                        size="md"
                        showBorder={showBorders}
                        borderLevel={borderLevel}
                        backgroundVariant={backgroundVariant}
                        gradientType={gradientType}
                        gradientDirection={gradientDirection}
                        hueShift={hueShift}
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

      {/* View Palette Button */}
      <button className="view-palette-button" onClick={togglePaletteModal}>
        <PaletteIcon size={18} />
        <span>View Color Palette</span>
      </button>

      {/* Color Palette Modal */}
      <ColorPaletteModal 
        colors={colorPalettes[activePalette].colors}
        isOpen={isPaletteModalOpen}
        onClose={togglePaletteModal}
      />

      {/* Background Context Switcher */}
      <BackgroundContextSwitcher 
        currentMode={backgroundMode}
        onModeChange={handleBackgroundModeChange}
      />
    </div>
  )
}

export default App
