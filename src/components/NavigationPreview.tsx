import React, { useState } from 'react';

type NavigationPreviewProps = {
  backgroundColor: string;
  foregroundColor: string;
};

const NavigationPreview: React.FC<NavigationPreviewProps> = ({ 
  backgroundColor, 
  foregroundColor 
}) => {
  const [activeNavItem, setActiveNavItem] = useState<string>('dashboard');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState<boolean>(false);
  
  // Navigation items
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'products', label: 'Products', icon: '📦' },
    { id: 'customers', label: 'Customers', icon: '👥' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];
  
  // Secondary items
  const secondaryItems = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'help', label: 'Help & Support', icon: '❓' },
    { id: 'logout', label: 'Logout', icon: '🚪' },
  ];

  // Toggle mobile navigation
  const toggleMobileNav = () => {
    setIsMobileNavOpen(!isMobileNavOpen);
  };
  
  // Lighter version of the background color for active states
  const getActiveBackground = () => {
    try {
      if (backgroundColor.includes('rgb') || backgroundColor.includes('rgba')) {
        // For RGB colors
        return backgroundColor.replace(')', ', 0.15)').replace('rgb', 'rgba');
      } else if (backgroundColor.includes('#')) {
        // For hex colors - simplistic approach
        return `${backgroundColor}30`; // 30 = 30% opacity in hex
      } else if (backgroundColor.includes('display-p3')) {
        // For display-p3 format
        return backgroundColor.replace(')', ' / 0.15)');
      }
      return backgroundColor; // Fallback
    } catch (e) {
      return backgroundColor;
    }
  };
  
  // Hover background - slightly lighter than active
  const getHoverBackground = () => {
    try {
      if (backgroundColor.includes('rgb') || backgroundColor.includes('rgba')) {
        // For RGB colors
        return backgroundColor.replace(')', ', 0.08)').replace('rgb', 'rgba');
      } else if (backgroundColor.includes('#')) {
        // For hex colors - simplistic approach
        return `${backgroundColor}15`; // 15 = 15% opacity in hex
      } else if (backgroundColor.includes('display-p3')) {
        // For display-p3 format
        return backgroundColor.replace(')', ' / 0.08)');
      }
      return backgroundColor; // Fallback
    } catch (e) {
      return backgroundColor;
    }
  };
  
  const activeBackground = getActiveBackground();
  const hoverBackground = getHoverBackground();
  
  return (
    <div className="navigation-preview">
      {/* Top Navigation Bar */}
      <div 
        className="top-navigation"
        style={{ 
          backgroundColor, 
          color: foregroundColor,
          borderColor: foregroundColor
        }}
      >
        <div className="top-nav-left">
          <div className="brand">
            <span className="brand-icon">🎨</span>
            <span className="brand-name">Color System</span>
          </div>
          
          <button 
            className="mobile-toggle"
            style={{ color: foregroundColor, borderColor: foregroundColor }}
            onClick={toggleMobileNav}
          >
            {isMobileNavOpen ? '✕' : '☰'}
          </button>
        </div>
        
        <div className="top-nav-center">
          <div 
            className="search-bar"
            style={{ 
              borderColor: foregroundColor,
              backgroundColor: 'transparent',
              color: foregroundColor
            }}
          >
            <span className="search-icon">🔍</span>
            <input 
              type="text" 
              placeholder="Search..." 
              style={{ color: foregroundColor, backgroundColor: 'transparent' }}
            />
          </div>
        </div>
        
        <div className="top-nav-right">
          <button 
            className="top-nav-button"
            style={{ color: foregroundColor }}
          >
            🔔
          </button>
          <button 
            className="top-nav-button"
            style={{ color: foregroundColor }}
          >
            ✉️
          </button>
          <div 
            className="user-profile"
            style={{ borderColor: foregroundColor }}
          >
            <span className="avatar">👤</span>
            <span className="username">User</span>
          </div>
        </div>
      </div>
      
      {/* Side Navigation */}
      <div 
        className={`side-navigation ${isMobileNavOpen ? 'mobile-open' : ''}`}
        style={{ 
          backgroundColor, 
          color: foregroundColor,
          borderColor: foregroundColor
        }}
      >
        <nav className="nav-menu">
          <ul className="nav-list">
            {navItems.map(item => (
              <li 
                key={item.id} 
                className={`nav-item ${activeNavItem === item.id ? 'active' : ''}`}
                onClick={() => setActiveNavItem(item.id)}
                style={{ 
                  backgroundColor: activeNavItem === item.id ? activeBackground : 'transparent',
                  color: foregroundColor
                }}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </li>
            ))}
          </ul>
          
          <div className="nav-divider" style={{ borderColor: foregroundColor }}></div>
          
          <ul className="nav-list secondary">
            {secondaryItems.map(item => (
              <li 
                key={item.id} 
                className="nav-item"
                style={{ color: foregroundColor }}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      
      {/* Content Area (just for demonstration) */}
      <div 
        className="content-preview"
        style={{ 
          backgroundColor: 'transparent',
          color: foregroundColor
        }}
      >
        <div className="content-header">
          <h3>{navItems.find(item => item.id === activeNavItem)?.label || 'Dashboard'}</h3>
          <div className="content-actions">
            <button style={{ 
              backgroundColor: foregroundColor, 
              color: backgroundColor,
              borderColor: foregroundColor
            }}>
              New Item
            </button>
          </div>
        </div>
        
        <div className="breadcrumbs" style={{ color: foregroundColor }}>
          <span>Home</span>
          <span className="breadcrumb-separator">/</span>
          <span>{navItems.find(item => item.id === activeNavItem)?.label || 'Dashboard'}</span>
        </div>
        
        <div className="content-placeholder">
          <p>Selected Navigation: {navItems.find(item => item.id === activeNavItem)?.label || 'Dashboard'}</p>
        </div>
      </div>
    </div>
  );
};

export default NavigationPreview; 