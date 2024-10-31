import React, { useState, useEffect } from 'react';

const FoodTypeFilter = ({ onFilterChange }) => {
  // Initialize state with true to show both veg and non-veg by default
  const [filters, setFilters] = useState({
    veg: true,
    nonVeg: true
  });

  // Handle toggle changes
  const handleToggle = (type) => {
    const newFilters = {
      ...filters,
      [type]: !filters[type]
    };
    setFilters(newFilters);
    onFilterChange(newFilters); // Notify parent component of changes
  };

  // CSS Styles
  const styles = {
    container: {
      position: 'sticky',
      top: 0,
      // backgroundColor: 'white',
      padding: '0px 16px',
      zIndex: 10,
    },
    toggleContainer: {
      display: 'flex',
      justifyContent: 'center',
      gap: '16px', // Decreased gap between toggles
      alignItems: 'center',
    },
    toggleWrapper: {
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer',
      padding: '6px 12px', // Reduced padding around the toggle
      borderRadius: '16px', // Reduced border radius for smaller size
      transition: 'all 0.3s ease',
    },
    toggle: {
      position: 'relative',
      width: '36px', // Reduced width
      height: '18px', // Reduced height
      // backgroundColor: '#e2e8f0',
      borderRadius: '9px', // Adjusted for smaller height
      marginRight: '6px', // Reduced margin
      transition: 'all 0.3s ease',
    },
    toggleCircle: {
      position: 'absolute',
      top: '1px', // Adjusted position for smaller size
      left: '1px',
      width: '16px', // Reduced circle width
      height: '16px', // Reduced circle height
      backgroundColor: 'white',
      borderRadius: '50%',
      transition: 'transform 0.3s ease',
    },
    label: {
      fontWeight: '500',
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
    }
  };
  

  return (
    <div style={styles.container}>
      <div style={styles.toggleContainer}>
        {/* Veg Toggle */}
        <div
          onClick={() => handleToggle('veg')}
          style={{
            ...styles.toggleWrapper,
            backgroundColor: filters.veg ? 'rgba(72, 187, 120, 0.1)' : 'transparent',
          }}
        >
          <div style={{
            ...styles.toggle,
            backgroundColor: filters.veg ? '#48BB78' : '#e2e8f0',
          }}>
            <div style={{
              ...styles.toggleCircle,
              transform: filters.veg ? 'translateX(20px)' : 'translateX(0)',
            }} />
          </div>
          <span style={{
            ...styles.label,
            color: filters.veg ? '#48BB78' : '#718096',
          }}>
            🥬
          </span>
        </div>

        {/* Non-Veg Toggle */}
        <div
          onClick={() => handleToggle('nonVeg')}
          style={{
            ...styles.toggleWrapper,
            backgroundColor: filters.nonVeg ? 'rgba(245, 101, 101, 0.1)' : 'transparent',
          }}
        >
          <div style={{
            ...styles.toggle,
            backgroundColor: filters.nonVeg ? '#F56565' : '#e2e8f0',
          }}>
            <div style={{
              ...styles.toggleCircle,
              transform: filters.nonVeg ? 'translateX(20px)' : 'translateX(0)',
            }} />
          </div>
          <span style={{
            ...styles.label,
            color: filters.nonVeg ? '#F56565' : '#718096',
          }}>
            🍖
          </span>
        </div>
      </div>
    </div>
  );
};

export default FoodTypeFilter;