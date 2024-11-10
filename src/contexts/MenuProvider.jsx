import React, { createContext, useContext, useState, useEffect } from 'react';

const MenuContext = createContext();

export function MenuProvider({ children }) {
  const [menuData, setMenuData] = useState({
    categories: [],
    subcategories: [],
    menuItems: [],
    recommendations: {},
  });
  
  // Track loading state for each data type
  const [loading, setLoading] = useState({
    categories: true,
    subcategories: true,
    menuItems: true,
    overall: true
  });
  
  const [error, setError] = useState(null);
  const orgId = localStorage.getItem('orgId');

  useEffect(() => {
    if (orgId) {
      // Set all loading states to true initially
      setLoading({
        categories: true,
        subcategories: true,
        menuItems: true,
        overall: true
      });

      Promise.all([
        fetch('https://smart-server-stage-db-default-rtdb.firebaseio.com/categories.json')
          .then(res => res.json())
          .then(data => {
            setLoading(prev => ({ ...prev, categories: false }));
            return data;
          }),
        fetch('https://smart-server-stage-db-default-rtdb.firebaseio.com/subcategories.json')
          .then(res => res.json())
          .then(data => {
            setLoading(prev => ({ ...prev, subcategories: false }));
            return data;
          }),
        fetch('https://smart-server-stage-db-default-rtdb.firebaseio.com/menu_items.json')
          .then(res => res.json())
          .then(data => {
            setLoading(prev => ({ ...prev, menuItems: false }));
            return data;
          }),
        fetch('https://smart-server-stage-db-default-rtdb.firebaseio.com/menu_suggestions.json')
          .then(res => res.json())
      ])
        .then(([catData, subData, menuData, sugData]) => {
          const processedData = {
            categories: [],
            subcategories: [],
            menuItems: [],
            recommendations: {}
          };

          // Process categories
          if (catData) {
            processedData.categories = Object.entries(catData)
              .map(([id, category]) => ({ id, ...category }))
              .filter(category => category.orgId === parseInt(orgId));
          }

          // Process subcategories
          if (subData) {
            processedData.subcategories = Object.entries(subData)
              .map(([id, subcategory]) => ({ id, ...subcategory }))
              .filter(subcategory => subcategory.orgId === parseInt(orgId));
          }

          // Process menu items and suggestions
          if (menuData) {
            const menuItemsArray = Object.entries(menuData)
              .map(([id, item]) => ({ id, ...item }))
              .filter(item => item.orgId === parseInt(orgId));
            
            processedData.menuItems = menuItemsArray;

            // Process recommendations
            if (sugData) {
              Object.entries(sugData).forEach(([itemId, suggestionIds]) => {
                const suggestedItems = menuItemsArray.filter(menuItem => 
                  suggestionIds.some(suggestion => 
                    suggestion.name === menuItem.name && 
                    suggestion.orgId.toString() === orgId
                  )
                );
                if (suggestedItems.length > 0) {
                  processedData.recommendations[itemId] = suggestedItems;
                }
              });
            }
          }

          setMenuData(processedData);
          setLoading(prev => ({ ...prev, overall: false }));
        })
        .catch(error => {
          console.error('Error fetching menu data:', error);
          setError(error);
          setLoading({
            categories: false,
            subcategories: false,
            menuItems: false,
            overall: false
          });
        });
    }
  }, [orgId]);

  const value = {
    ...menuData,
    loading,
    error,
    refreshData: () => {
      setLoading({
        categories: true,
        subcategories: true,
        menuItems: true,
        overall: true
      });
      const event = new Event('refresh-menu-data');
      window.dispatchEvent(event);
    }
  };

  return (
    <MenuContext.Provider value={value}>
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu() {
  const context = useContext(MenuContext);
  if (context === undefined) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
}   