import React from 'react';

type DataTablePreviewProps = {
  backgroundColor: string;
  foregroundColor: string;
};

const DataTablePreview: React.FC<DataTablePreviewProps> = ({ 
  backgroundColor, 
  foregroundColor 
}) => {
  // Sample data for the table
  const tableData = [
    { id: 1, name: 'Product A', category: 'Electronics', stock: 152, price: '$299.99' },
    { id: 2, name: 'Product B', category: 'Clothing', stock: 89, price: '$49.95' },
    { id: 3, name: 'Product C', category: 'Home Goods', stock: 0, price: '$129.00' },
    { id: 4, name: 'Product D', category: 'Electronics', stock: 37, price: '$199.50' },
    { id: 5, name: 'Product E', category: 'Accessories', stock: 241, price: '$19.99' },
  ];

  // Alternate row color (subtle variation of background)
  const getAlternateRowColor = () => {
    try {
      if (backgroundColor.includes('rgb') || backgroundColor.includes('rgba')) {
        // For RGB colors
        return backgroundColor.replace(')', ', 0.04)').replace('rgb', 'rgba');
      } else if (backgroundColor.includes('#')) {
        // For hex colors - simplistic approach
        return `${backgroundColor}10`; // 10 = 10% opacity in hex
      } else if (backgroundColor.includes('display-p3')) {
        // For display-p3 format
        return backgroundColor.replace(')', ' / 0.04)');
      }
      return backgroundColor; // Fallback
    } catch (e) {
      return backgroundColor;
    }
  };

  // Header background (slightly stronger variation)
  const getHeaderBackground = () => {
    try {
      if (backgroundColor.includes('rgb') || backgroundColor.includes('rgba')) {
        // For RGB colors
        return backgroundColor.replace(')', ', 0.08)').replace('rgb', 'rgba');
      } else if (backgroundColor.includes('#')) {
        // For hex colors - simplistic approach
        return `${backgroundColor}20`; // 20 = 20% opacity in hex
      } else if (backgroundColor.includes('display-p3')) {
        // For display-p3 format
        return backgroundColor.replace(')', ' / 0.08)');
      }
      return backgroundColor; // Fallback
    } catch (e) {
      return backgroundColor;
    }
  };

  const alternateRowColor = getAlternateRowColor();
  const headerBackground = getHeaderBackground();

  return (
    <div className="data-table-preview" style={{ color: foregroundColor, backgroundColor }}>
      <div className="data-table-header">
        <h3>Data Table Example</h3>
        <div className="table-controls">
          <button 
            className="table-control-button" 
            style={{ color: foregroundColor, borderColor: foregroundColor }}
          >
            Export
          </button>
          <input 
            type="text" 
            placeholder="Search..." 
            style={{ 
              color: foregroundColor, 
              borderColor: foregroundColor,
              backgroundColor: 'transparent'
            }}
          />
        </div>
      </div>

      <div className="data-table-wrapper">
        <table className="data-table" style={{ color: foregroundColor }}>
          <thead>
            <tr style={{ backgroundColor: headerBackground }}>
              <th style={{ borderColor: foregroundColor }}>ID</th>
              <th style={{ borderColor: foregroundColor }}>Name</th>
              <th style={{ borderColor: foregroundColor }}>Category</th>
              <th style={{ borderColor: foregroundColor }}>Stock</th>
              <th style={{ borderColor: foregroundColor }}>Price</th>
              <th style={{ borderColor: foregroundColor }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, index) => (
              <tr 
                key={row.id} 
                style={{ 
                  backgroundColor: index % 2 === 1 ? alternateRowColor : 'transparent'
                }}
              >
                <td style={{ borderColor: foregroundColor }}>{row.id}</td>
                <td style={{ borderColor: foregroundColor }}>{row.name}</td>
                <td style={{ borderColor: foregroundColor }}>{row.category}</td>
                <td style={{ borderColor: foregroundColor }}>
                  <span className={`stock-indicator ${row.stock === 0 ? 'out-of-stock' : ''}`} 
                    style={{ 
                      color: row.stock === 0 ? '#ef4444' : (row.stock < 50 ? '#f59e0b' : '#22c55e')
                    }}
                  >
                    {row.stock === 0 ? 'Out of stock' : row.stock}
                  </span>
                </td>
                <td style={{ borderColor: foregroundColor }}>{row.price}</td>
                <td style={{ borderColor: foregroundColor }}>
                  <div className="table-actions">
                    <button 
                      className="action-button" 
                      style={{ color: foregroundColor, borderColor: foregroundColor }}
                    >
                      Edit
                    </button>
                    <button 
                      className="action-button" 
                      style={{ color: foregroundColor, borderColor: foregroundColor }}
                    >
                      View
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="data-table-pagination" style={{ borderColor: foregroundColor }}>
        <span>Showing 1-5 of 25 entries</span>
        <div className="pagination-controls">
          <button style={{ color: foregroundColor, borderColor: foregroundColor }}>Previous</button>
          <button style={{ 
            backgroundColor: foregroundColor, 
            color: backgroundColor, 
            borderColor: foregroundColor 
          }}>1</button>
          <button style={{ color: foregroundColor, borderColor: foregroundColor }}>2</button>
          <button style={{ color: foregroundColor, borderColor: foregroundColor }}>3</button>
          <button style={{ color: foregroundColor, borderColor: foregroundColor }}>Next</button>
        </div>
      </div>
    </div>
  );
};

export default DataTablePreview; 