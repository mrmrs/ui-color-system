import { useState } from 'react';
import { getWCAGComplianceLevel, getAPCAComplianceDescription } from '../utils/colorUtils';
import type { ContrastAlgorithm } from '../utils/colorUtils';

type ThemePreviewProps = {
  backgroundColor: string;
  foregroundColor: string;
  contrast: number;
  algorithm: ContrastAlgorithm;
};

const ThemePreview: React.FC<ThemePreviewProps> = ({
  backgroundColor,
  foregroundColor,
  contrast,
  algorithm
}) => {
  const [activeTab, setActiveTab] = useState<'card' | 'form' | 'article'>('card');

  // Get contrast rating
  const contrastRating = algorithm === 'WCAG21' 
    ? getWCAGComplianceLevel(contrast)
    : getAPCAComplianceDescription(contrast);

  return (
    <div className="theme-preview-container">
      <div className="theme-preview-tabs">
        <button 
          className={`theme-tab ${activeTab === 'card' ? 'active' : ''}`}
          onClick={() => setActiveTab('card')}
          style={{ 
            backgroundColor: activeTab === 'card' ? backgroundColor : 'transparent',
            color: activeTab === 'card' ? foregroundColor : backgroundColor
          }}
        >
          Card UI
        </button>
        <button 
          className={`theme-tab ${activeTab === 'form' ? 'active' : ''}`}
          onClick={() => setActiveTab('form')}
          style={{ 
            backgroundColor: activeTab === 'form' ? backgroundColor : 'transparent', 
            color: activeTab === 'form' ? foregroundColor : backgroundColor
          }}
        >
          Form UI
        </button>
        <button 
          className={`theme-tab ${activeTab === 'article' ? 'active' : ''}`}
          onClick={() => setActiveTab('article')}
          style={{ 
            backgroundColor: activeTab === 'article' ? backgroundColor : 'transparent',
            color: activeTab === 'article' ? foregroundColor : backgroundColor
          }}
        >
          Article
        </button>
      </div>

      <div className="theme-preview-content" style={{ backgroundColor, color: foregroundColor }}>
        {activeTab === 'card' && (
          <div className="card-preview">
            <div className="card-header">
              <h3>Product Card</h3>
              <span className="card-badge" style={{ backgroundColor: foregroundColor, color: backgroundColor }}>New</span>
            </div>
            <div className="card-body">
              <p>This is how your product cards could look with this color scheme. The contrast ratio is {contrast.toFixed(2)} ({contrastRating}).</p>
              <div className="card-actions">
                <button className="primary-button" style={{ backgroundColor: foregroundColor, color: backgroundColor }}>
                  Add to Cart
                </button>
                <button className="secondary-button" style={{ borderColor: foregroundColor }}>
                  Details
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'form' && (
          <div className="form-preview">
            <h3>Contact Form</h3>
            <div className="form-field">
              <label>Name</label>
              <input type="text" placeholder="Enter your name" style={{ borderColor: foregroundColor, backgroundColor: 'transparent' }} />
            </div>
            <div className="form-field">
              <label>Email</label>
              <input type="email" placeholder="Enter your email" style={{ borderColor: foregroundColor, backgroundColor: 'transparent' }} />
            </div>
            <div className="form-field">
              <label>Message</label>
              <textarea placeholder="Your message" style={{ borderColor: foregroundColor, backgroundColor: 'transparent' }}></textarea>
            </div>
            <div className="form-actions">
              <button style={{ backgroundColor: foregroundColor, color: backgroundColor }}>Submit</button>
            </div>
          </div>
        )}

        {activeTab === 'article' && (
          <div className="article-preview">
            <h2>Article Title</h2>
            <p className="article-meta">Posted on January 1, 2024 • 5 min read</p>
            <p>This is a sample article that demonstrates how text content would appear with this color scheme. Good typography with proper contrast is essential for readability.</p>
            <h3>Article Section</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. Maecenas non lacinia nisi. Nullam at velit vitae nisi sollicitudin varius.</p>
            <blockquote style={{ borderLeftColor: foregroundColor }}>
              This is a blockquote that provides emphasis to important content. The contrast ratio is {contrast.toFixed(2)}.
            </blockquote>
            <p>Additional paragraph with <a href="#" style={{ color: foregroundColor, textDecoration: 'underline' }}>linked text</a> to show how links would appear.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThemePreview; 