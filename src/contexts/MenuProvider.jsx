// import React, { createContext, useContext, useState, useEffect } from 'react';

// const MenuContext = createContext();

// export function MenuProvider({ children }) {
//   const [menuData, setMenuData] = useState({
//     categories: [],
//     subcategories: [],
//     menuItems: [],
//     recommendations: {},
//   });
  
//   // Track loading state for each data type
//   const [loading, setLoading] = useState({
//     categories: true,
//     subcategories: true,
//     menuItems: true,
//     overall: true
//   });
  
//   const [error, setError] = useState(null);
//   const orgId = localStorage.getItem('orgId');

//   useEffect(() => {
//     if (orgId) {
//       // Set all loading states to true initially
//       setLoading({
//         categories: true,
//         subcategories: true,
//         menuItems: true,
//         overall: true
//       });

//       Promise.all([
//         fetch('https://smart-server-stage-db-default-rtdb.firebaseio.com/categories.json')
//           .then(res => res.json())
//           .then(data => {
//             setLoading(prev => ({ ...prev, categories: false }));
//             return data;
//           }),
//         fetch('https://smart-server-stage-db-default-rtdb.firebaseio.com/subcategories.json')
//           .then(res => res.json())
//           .then(data => {
//             setLoading(prev => ({ ...prev, subcategories: false }));
//             return data;
//           }),
//         fetch('https://smart-server-stage-db-default-rtdb.firebaseio.com/menu_items.json')
//           .then(res => res.json())
//           .then(data => {
//             setLoading(prev => ({ ...prev, menuItems: false }));
//             return data;
//           }),
//         fetch('https://smart-server-stage-db-default-rtdb.firebaseio.com/menu_suggestions.json')
//           .then(res => res.json())
//       ])
//         .then(([catData, subData, menuData, sugData]) => {
//           const processedData = {
//             categories: [],
//             subcategories: [],
//             menuItems: [],
//             recommendations: {}
//           };

//           // Process categories
//           if (catData) {
//             processedData.categories = Object.entries(catData)
//               .map(([id, category]) => ({ id, ...category }))
//               .filter(category => category.orgId === parseInt(orgId));
//           }

//           // Process subcategories
//           if (subData) {
//             processedData.subcategories = Object.entries(subData)
//               .map(([id, subcategory]) => ({ id, ...subcategory }))
//               .filter(subcategory => subcategory.orgId === parseInt(orgId));
//           }

//           // Process menu items and suggestions
//           if (menuData) {
//             const menuItemsArray = Object.entries(menuData)
//               .map(([id, item]) => ({ id, ...item }))
//               .filter(item => item.orgId === parseInt(orgId));
            
//             processedData.menuItems = menuItemsArray;

//             // Process recommendations
//             if (sugData) {
//               Object.entries(sugData).forEach(([itemId, suggestionIds]) => {
//                 const suggestedItems = menuItemsArray.filter(menuItem => 
//                   suggestionIds.some(suggestion => 
//                     suggestion.name === menuItem.name && 
//                     suggestion.orgId.toString() === orgId
//                   )
//                 );
//                 if (suggestedItems.length > 0) {
//                   processedData.recommendations[itemId] = suggestedItems;
//                 }
//               });
//             }
//           }

//           setMenuData(processedData);
//           setLoading(prev => ({ ...prev, overall: false }));
//         })
//         .catch(error => {
//           console.error('Error fetching menu data:', error);
//           setError(error);
//           setLoading({
//             categories: false,
//             subcategories: false,
//             menuItems: false,
//             overall: false
//           });
//         });
//     }
//   }, [orgId]);

//   const value = {
//     ...menuData,
//     loading,
//     error,
//     refreshData: () => {
//       setLoading({
//         categories: true,
//         subcategories: true,
//         menuItems: true,
//         overall: true
//       });
//       const event = new Event('refresh-menu-data');
//       window.dispatchEvent(event);
//     }
//   };

//   return (
//     <MenuContext.Provider value={value}>
//       {children}
//     </MenuContext.Provider>
//   );
// }

// export function useMenu() {
//   const context = useContext(MenuContext);
//   if (context === undefined) {
//     throw new Error('useMenu must be used within a MenuProvider');
//   }
//   return context;
// }   

import React, { createContext, useContext, useState, useEffect } from 'react';

const MenuContext = createContext();

export function MenuProvider({ children }) {
  const [menuData, setMenuData] = useState({
    categories: [],
    subcategories: [],
    menuItems: [],
    recommendations: {},
  });
  
  const [loading, setLoading] = useState({
    categories: true,
    subcategories: true,
    menuItems: true,
    overall: true
  });
  
  const [error, setError] = useState(null);
  const [dataInitialized, setDataInitialized] = useState(false);
  const orgId = localStorage.getItem('orgId');

  const fetchData = async (url) => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching from ${url}:`, error);
      throw error;
    }
  };

  useEffect(() => {
    if (!orgId) return;

    const loadData = async () => {
      setLoading(prev => ({
        ...prev,
        overall: true
      }));

      try {
        // Fetch categories first since they're needed immediately
        setLoading(prev => ({ ...prev, categories: true }));
        const catData = await fetchData('https://smart-server-stage-db-default-rtdb.firebaseio.com/categories.json');
        const processedCategories = catData ? 
          Object.entries(catData)
            .map(([id, category]) => ({ id, ...category }))
            .filter(category => category.orgId === parseInt(orgId)) : 
          [];
        
        setMenuData(prev => ({ ...prev, categories: processedCategories }));
        setLoading(prev => ({ ...prev, categories: false }));

        // Fetch other data in parallel
        const [subData, menuData, sugData] = await Promise.all([
          fetchData('https://smart-server-stage-db-default-rtdb.firebaseio.com/subcategories.json'),
          fetchData('https://smart-server-stage-db-default-rtdb.firebaseio.com/menu_items.json'),
          fetchData('https://smart-server-stage-db-default-rtdb.firebaseio.com/menu_suggestions.json')
        ]);

        const processedSubcategories = subData ?
          Object.entries(subData)
            .map(([id, subcategory]) => ({ id, ...subcategory }))
            .filter(subcategory => subcategory.orgId === parseInt(orgId)) :
          [];

        const menuItemsArray = menuData ?
          Object.entries(menuData)
            .map(([id, item]) => ({ id, ...item }))
            .filter(item => item.orgId === parseInt(orgId)) :
          [];

        const processedRecommendations = {};
        if (sugData && menuItemsArray.length > 0) {
          Object.entries(sugData).forEach(([itemId, suggestionIds]) => {
            const suggestedItems = menuItemsArray.filter(menuItem => 
              suggestionIds.some(suggestion => 
                suggestion.name === menuItem.name && 
                suggestion.orgId.toString() === orgId
              )
            );
            if (suggestedItems.length > 0) {
              processedRecommendations[itemId] = suggestedItems;
            }
          });
        }

        setMenuData(prev => ({
          ...prev,
          subcategories: processedSubcategories,
          menuItems: menuItemsArray,
          recommendations: processedRecommendations
        }));

        setLoading({
          categories: false,
          subcategories: false,
          menuItems: false,
          overall: false
        });
        
        setDataInitialized(true);
      } catch (error) {
        console.error('Error fetching menu data:', error);
        setError(error);
        setLoading({
          categories: false,
          subcategories: false,
          menuItems: false,
          overall: false
        });
      }
    };

    loadData();
  }, [orgId]);

  const value = {
    ...menuData,
    loading,
    error,
    dataInitialized,
    refreshData: () => {
      setDataInitialized(false);
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