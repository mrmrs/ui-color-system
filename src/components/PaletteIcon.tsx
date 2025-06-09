import React from 'react';

type PaletteIconProps = {
  size?: number;
  color?: string;
};

const PaletteIcon: React.FC<PaletteIconProps> = ({ 
  size = 20, 
  color = 'currentColor'
}) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="13.5" cy="6.5" r="2.5" />
      <circle cx="17.5" cy="10.5" r="2.5" />
      <circle cx="8.5" cy="7.5" r="2.5" />
      <circle cx="6.5" cy="12.5" r="2.5" />
      <circle cx="10.5" cy="17.5" r="2.5" />
      <circle cx="15.5" cy="15.5" r="2.5" />
      <path d="M12 2v20" />
      <path d="M2 12h20" />
    </svg>
  );
};

export default PaletteIcon; 