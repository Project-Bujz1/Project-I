// import React, { useState, useEffect } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { motion, AnimatePresence } from 'framer-motion';
// import { CloseOutlined, MenuOutlined } from '@ant-design/icons';

// const CategoryNavigator = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [categories, setCategories] = useState([]);
//   const [subcategories, setSubcategories] = useState([]);
//   const [menuItems, setMenuItems] = useState([]);
//   const location = useLocation();
//   const navigate = useNavigate();
//   const orgId = localStorage.getItem('orgId');

//   useEffect(() => {
//     setIsOpen(false);
//   }, [location]);

//   useEffect(() => {
//     if (orgId) {
//       // Fetch categories
//       fetch('https://stage-smart-server-default-rtdb.firebaseio.com/categories.json')
//         .then((res) => res.json())
//         .then((data) => {
//           if (data) {
//             const matchedCategories = Object.entries(data)
//               .map(([id, category]) => ({ id, ...category }))
//               .filter(category => category.orgId === parseInt(orgId));
//             setCategories(matchedCategories);
//           }
//         });

//       // Fetch subcategories
//       fetch('https://stage-smart-server-default-rtdb.firebaseio.com/subcategories.json')
//         .then((res) => res.json())
//         .then((data) => {
//           if (data) {
//             const matchedSubcategories = Object.entries(data)
//               .map(([id, subcategory]) => ({ id, ...subcategory }))
//               .filter(subcategory => subcategory.orgId === parseInt(orgId));
//             setSubcategories(matchedSubcategories);
//           }
//         });

//       // Fetch menu items
//       fetch('https://stage-smart-server-default-rtdb.firebaseio.com/menu_items.json')
//         .then((res) => res.json())
//         .then((data) => {
//           if (data) {
//             const matchedMenuItems = Object.entries(data)
//               .map(([id, item]) => ({ id, ...item }))
//               .filter(item => item.orgId === parseInt(orgId));
//             setMenuItems(matchedMenuItems);
//           }
//         });
//     }
//   }, [orgId]);

//   const getCountsForCategory = (categoryId) => {
//     const subCount = subcategories.filter(sub => sub.categoryId === categoryId).length;
//     const subIds = subcategories
//       .filter(sub => sub.categoryId === categoryId)
//       .map(sub => sub.id);
//     const itemCount = menuItems.filter(item => 
//       subIds.includes(item.subcategoryId)
//     ).length;
    
//     return { subCount, itemCount };
//   };

//   const handleCategoryClick = (categoryId) => {
//     // You might need to modify this based on your routing structure
//     navigate('/home', { state: { selectedCategoryId: categoryId } });
//     setIsOpen(false);
//   };

//   if (location.pathname !== '/home') return null;

//   return (
//     <>
//       {/* Navigation Icon */}
//       <motion.div
//         className="nav-icon"
//         whileHover={{ scale: 1.1 }}
//         whileTap={{ scale: 0.95 }}
//         onClick={() => setIsOpen(!isOpen)}
//         style={{
//           position: 'fixed',
//           bottom: '20px',
//           right: '20px',
//           backgroundColor: isOpen ? '#f44336' : 'black',
//           color: 'white',
//           borderRadius: '50%',
//           width: '60px',
//           height: '60px',
//           display: 'flex',
//           justifyContent: 'center',
//           alignItems: 'center',
//           cursor: 'pointer',
//           boxShadow: '0px 10px 15px rgba(0, 0, 0, 0.3)',
//           zIndex: 1000,
//         }}
//       >
//         {isOpen ? (
//           <CloseOutlined style={{ fontSize: '24px' }} />
//         ) : (
//           <MenuOutlined style={{ fontSize: '24px' }} />
//         )}
//       </motion.div>

//       {/* Category Navigation Menu */}
//       <AnimatePresence>
//         {isOpen && (
//           <motion.div
//             initial={{ width: '0px', opacity: 0 }}
//             animate={{ width: '300px', opacity: 1 }}
//             exit={{ width: '0px', opacity: 0 }}
//             transition={{ type: 'spring', stiffness: 200, damping: 25 }}
//             style={{
//               position: 'fixed',
//               bottom: '20px',
//               right: '90px',
//               backgroundColor: 'white',
//               borderRadius: '12px',
//               padding: '20px',
//               boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
//               zIndex: 1000,
//               maxHeight: '80vh',
//               overflowY: 'auto',
//             }}
//           >
//             <h3 style={{ margin: '0 0 15px 0', color: '#333', fontWeight: 'bold' }}>
//               Menu Navigation
//             </h3>
//             {categories.map((category) => {
//               const { subCount, itemCount } = getCountsForCategory(category.id);
//               return (
//                 <motion.div
//                   key={category.id}
//                   onClick={() => handleCategoryClick(category.id)}
//                   whileHover={{ backgroundColor: '#f5f5f5' }}
//                   style={{
//                     padding: '12px',
//                     borderRadius: '8px',
//                     marginBottom: '8px',
//                     cursor: 'pointer',
//                     border: '1px solid #eee',
//                   }}
//                 >
//                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                     <span style={{ fontSize: '16px', fontWeight: '500' }}>{category.name}</span>
//                     <div style={{ display: 'flex', gap: '10px' }}>
//                       <span style={{ 
//                         fontSize: '12px', 
//                         backgroundColor: '#e0e0e0', 
//                         padding: '4px 8px', 
//                         borderRadius: '12px' 
//                       }}>
//                         {subCount} Subcategories
//                       </span>
//                       <span style={{ 
//                         fontSize: '12px', 
//                         backgroundColor: '#e0e0e0', 
//                         padding: '4px 8px', 
//                         borderRadius: '12px' 
//                       }}>
//                         {itemCount} Items
//                       </span>
//                     </div>
//                   </div>
//                 </motion.div>
//               );
//             })}
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </>
//   );
// };

// export default CategoryNavigator;

// import React, { useState, useEffect } from 'react';
// import { useLocation } from 'react-router-dom';
// import { motion, AnimatePresence } from 'framer-motion';
// import { CloseOutlined, MenuOutlined } from '@ant-design/icons';


// const CategoryNavigator = ({ onCategorySelect, onSubcategorySelect }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [categories, setCategories] = useState([]);
//   const [subcategories, setSubcategories] = useState([]);
//   const [menuItems, setMenuItems] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const location = useLocation();
//   const orgId = localStorage.getItem('orgId');

//   useEffect(() => {
//     setIsOpen(false);
//   }, [location]);

//   useEffect(() => {
//     if (orgId) {
//       // Fetch categories
//       fetch('https://stage-smart-server-default-rtdb.firebaseio.com/categories.json')
//         .then((res) => res.json())
//         .then((data) => {
//           if (data) {
//             const matchedCategories = Object.entries(data)
//               .map(([id, category]) => ({ id, ...category }))
//               .filter(category => category.orgId === parseInt(orgId));
//             setCategories(matchedCategories);
//           }
//         });

//       // Fetch subcategories
//       fetch('https://stage-smart-server-default-rtdb.firebaseio.com/subcategories.json')
//         .then((res) => res.json())
//         .then((data) => {
//           if (data) {
//             const matchedSubcategories = Object.entries(data)
//               .map(([id, subcategory]) => ({ id, ...subcategory }))
//               .filter(subcategory => subcategory.orgId === parseInt(orgId));
//             setSubcategories(matchedSubcategories);
//           }
//         });

//       // Fetch menu items
//       fetch('https://stage-smart-server-default-rtdb.firebaseio.com/menu_items.json')
//         .then((res) => res.json())
//         .then((data) => {
//           if (data) {
//             const matchedMenuItems = Object.entries(data)
//               .map(([id, item]) => ({ id, ...item }))
//               .filter(item => item.orgId === parseInt(orgId));
//             setMenuItems(matchedMenuItems);
//           }
//         });
//     }
//   }, [orgId]);

//   const getCountsForCategory = (categoryId) => {
//     const subCount = subcategories.filter(sub => sub.categoryId === categoryId).length;
//     const subIds = subcategories
//       .filter(sub => sub.categoryId === categoryId)
//       .map(sub => sub.id);
//     const itemCount = menuItems.filter(item => 
//       subIds.includes(item.subcategoryId)
//     ).length;
    
//     return { subCount, itemCount };
//   };

//   const handleCategoryClick = (category) => {
//     setSelectedCategory(category);
//     onCategorySelect(category);
//     setIsOpen(false);
//   };

//   const handleSubcategoryClick = (subcategory) => {
//     onSubcategorySelect(subcategory);
//     setIsOpen(false);
//   };

//   const renderSubcategories = (categoryId) => {
//     const filteredSubs = subcategories.filter(sub => sub.categoryId === categoryId);
//     return filteredSubs.map(sub => (
//       <motion.div
//         key={sub.id}
//         onClick={() => handleSubcategoryClick(sub)}
//         whileHover={{ backgroundColor: '#f5f5f5' }}
//         style={{
//           padding: '8px 12px 8px 24px',
//           marginTop: '4px',
//           borderRadius: '6px',
//           cursor: 'pointer',
//           fontSize: '14px',
//           backgroundColor: '#f9f9f9',
//         }}
//       >
//         {sub.name}
//       </motion.div>
//     ));
//   };

//   if (location.pathname !== '/home') return null;

//   return (
//     <>
//       {/* Navigation Icon */}
//       <motion.div
//         className="nav-icon"
//         whileHover={{ scale: 1.1 }}
//         whileTap={{ scale: 0.95 }}
//         onClick={() => setIsOpen(!isOpen)}
//         style={{
//           position: 'fixed',
//           bottom: '20px',
//           right: '20px',
//           backgroundColor: isOpen ? '#f44336' : 'black',
//           color: 'white',
//           borderRadius: '50%',
//           width: '60px',
//           height: '60px',
//           display: 'flex',
//           justifyContent: 'center',
//           alignItems: 'center',
//           cursor: 'pointer',
//           boxShadow: '0px 10px 15px rgba(0, 0, 0, 0.3)',
//           zIndex: 1000,
//         }}
//       >
//         {isOpen ? (
//           <CloseOutlined style={{ fontSize: '24px' }} />
//         ) : (
//           <MenuOutlined style={{ fontSize: '24px' }} />
//         )}
//       </motion.div>

//       {/* Category Navigation Menu */}
//       <AnimatePresence>
//         {isOpen && (
//           <motion.div
//             initial={{ width: '0px', opacity: 0 }}
//             animate={{ width: '300px', opacity: 1 }}
//             exit={{ width: '0px', opacity: 0 }}
//             transition={{ type: 'spring', stiffness: 200, damping: 25 }}
//             style={{
//               position: 'fixed',
//               bottom: '20px',
//               right: '90px',
//               backgroundColor: 'white',
//               borderRadius: '12px',
//               padding: '20px',
//               boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
//               zIndex: 1000,
//               maxHeight: '80vh',
//               overflowY: 'auto',
//             }}
//           >
//             <h3 style={{ margin: '0 0 15px 0', color: '#333', fontWeight: 'bold' }}>
//               Menu Navigation
//             </h3>
//             {categories.map((category) => {
//               const { subCount, itemCount } = getCountsForCategory(category.id);
//               return (
//                 <div key={category.id}>
//                   <motion.div
//                     onClick={() => handleCategoryClick(category)}
//                     whileHover={{ backgroundColor: '#f5f5f5' }}
//                     style={{
//                       padding: '12px',
//                       borderRadius: '8px',
//                       marginBottom: '4px',
//                       cursor: 'pointer',
//                       border: '1px solid #eee',
//                       backgroundColor: selectedCategory?.id === category.id ? '#f0f0f0' : 'white',
//                     }}
//                   >
//                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                       <span style={{ fontSize: '16px', fontWeight: '500' }}>{category.name}</span>
//                       <div style={{ display: 'flex', gap: '10px' }}>
//                         <span style={{ 
//                           fontSize: '12px', 
//                           backgroundColor: '#e0e0e0', 
//                           padding: '4px 8px', 
//                           borderRadius: '12px' 
//                         }}>
//                           {subCount} Subcategories
//                         </span>
//                         <span style={{ 
//                           fontSize: '12px', 
//                           backgroundColor: '#e0e0e0', 
//                           padding: '4px 8px', 
//                           borderRadius: '12px' 
//                         }}>
//                           {itemCount} Items
//                         </span>
//                       </div>
//                     </div>
//                   </motion.div>
//                   {selectedCategory?.id === category.id && renderSubcategories(category.id)}
//                 </div>
//               );
//             })}
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </>
//   );
// };

// export default CategoryNavigator;

// import React, { useState, useEffect } from 'react';
// import { useLocation } from 'react-router-dom';
// import { motion, AnimatePresence } from 'framer-motion';
// import { CloseOutlined, MenuOutlined } from '@ant-design/icons';
// import './categoryNavigator.css'; // Added for custom styles

// const CategoryNavigator = ({ onCategorySelect, onSubcategorySelect }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [categories, setCategories] = useState([]);
//   const [subcategories, setSubcategories] = useState([]);
//   const [menuItems, setMenuItems] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const location = useLocation();
//   const orgId = localStorage.getItem('orgId');

//   useEffect(() => {
//     setIsOpen(false);
//   }, [location]);

//   useEffect(() => {
//     if (orgId) {
//       // Fetch categories
//       fetch('https://stage-smart-server-default-rtdb.firebaseio.com/categories.json')
//         .then((res) => res.json())
//         .then((data) => {
//           if (data) {
//             const matchedCategories = Object.entries(data)
//               .map(([id, category]) => ({ id, ...category }))
//               .filter(category => category.orgId === parseInt(orgId));
//             setCategories(matchedCategories);
//           }
//         });

//       // Fetch subcategories
//       fetch('https://stage-smart-server-default-rtdb.firebaseio.com/subcategories.json')
//         .then((res) => res.json())
//         .then((data) => {
//           if (data) {
//             const matchedSubcategories = Object.entries(data)
//               .map(([id, subcategory]) => ({ id, ...subcategory }))
//               .filter(subcategory => subcategory.orgId === parseInt(orgId));
//             setSubcategories(matchedSubcategories);
//           }
//         });

//       // Fetch menu items
//       fetch('https://stage-smart-server-default-rtdb.firebaseio.com/menu_items.json')
//         .then((res) => res.json())
//         .then((data) => {
//           if (data) {
//             const matchedMenuItems = Object.entries(data)
//               .map(([id, item]) => ({ id, ...item }))
//               .filter(item => item.orgId === parseInt(orgId));
//             setMenuItems(matchedMenuItems);
//           }
//         });
//     }
//   }, [orgId]);

//   const handleCategoryClick = (category) => {
//     setSelectedCategory(category);
//     onCategorySelect(category);
//   };

//   const handleSubcategoryClick = (subcategory) => {
//     onSubcategorySelect(subcategory);
//   };

//   const renderSubcategories = (categoryId) => {
//     const filteredSubs = subcategories.filter(sub => sub.categoryId === categoryId);
//     return filteredSubs.map(sub => (
//       <motion.div
//         key={sub.id}
//         onClick={() => handleSubcategoryClick(sub)}
//         whileHover={{ backgroundColor: '#fff5f5' }}
//         style={{
//           padding: '8px 12px',
//           margin: '4px 0',
//           borderRadius: '6px',
//           cursor: 'pointer',
//           backgroundColor: '#ffebeb',
//           color: 'black',
//         }}
//       >
//         {sub.name} - {menuItems.filter(item => item.subcategoryId === sub.id).length} Items
//       </motion.div>
//     ));
//   };

//   if (location.pathname !== '/home') return null;

//   return (
//     <>
//       <motion.div
//         className="nav-icon"
//         whileHover={{ scale: 1.1 }}
//         whileTap={{ scale: 0.95 }}
//         onClick={() => setIsOpen(!isOpen)}
//         style={{
//           position: 'fixed',
//           bottom: '20px',
//           right: '20px',
//           backgroundColor: isOpen ? '#f44336' : 'black',
//           color: 'white',
//           borderRadius: '50%',
//           width: '60px',
//           height: '60px',
//           display: 'flex',
//           justifyContent: 'center',
//           alignItems: 'center',
//           cursor: 'pointer',
//           boxShadow: '0px 10px 15px rgba(0, 0, 0, 0.3)',
//           zIndex: 1000,
//         }}
//       >
//         {isOpen ? <CloseOutlined style={{ fontSize: '24px' }} /> : <MenuOutlined style={{ fontSize: '24px' }} />}
//       </motion.div>

//       <AnimatePresence>
//         {isOpen && (
//           <motion.div
//             initial={{ width: '0px', opacity: 0 }}
//             animate={{ width: '300px', opacity: 1 }}
//             exit={{ width: '0px', opacity: 0 }}
//             transition={{ type: 'spring', stiffness: 200, damping: 25 }}
//             className="category-navigator"
//           >
//             <h3 style={{ margin: '0 0 15px 0', color: 'black', fontWeight: 'bold' }}>
//               Quick Navigation
//             </h3>
//             {categories.map((category) => (
//               <div key={category.id} className="category-item">
//                 <motion.div
//                   onClick={() => handleCategoryClick(category)}
//                   whileHover={{ backgroundColor: '#ffe0e0' }}
//                   style={{
//                     padding: '12px',
//                     borderRadius: '8px',
//                     cursor: 'pointer',
//                     border: '1px solid #eee',
//                     backgroundColor: selectedCategory?.id === category.id ? '#ffcccc' : '#ffffff',
//                   }}
//                 >
//                   <span style={{ fontSize: '16px', fontWeight: '500' }}>{category.name}</span>
//                   <span style={{ fontSize: '12px', marginLeft: '10px', color: '#888' }}>
//                     {subcategories.filter(sub => sub.categoryId === category.id).length} Subcategories
//                   </span>
//                 </motion.div>
//                 {selectedCategory?.id === category.id && renderSubcategories(category.id)}
//               </div>
//             ))}
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </>
//   );
// };

// export default CategoryNavigator;
// CategoryNavigator.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CloseOutlined, MenuOutlined, PlusOutlined, MinusOutlined } from '@ant-design/icons';
import './categoryNavigator.css';

const CategoryNavigator = ({ onCategorySelect, onSubcategorySelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState({});
  const location = useLocation();
  const navigate = useNavigate();
  const orgId = localStorage.getItem('orgId');

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  useEffect(() => {
    if (orgId) {
      // Fetch categories
      fetch('https://stage-smart-server-default-rtdb.firebaseio.com/categories.json')
        .then((res) => res.json())
        .then((data) => {
          if (data) {
            const matchedCategories = Object.entries(data)
              .map(([id, category]) => ({ id, ...category }))
              .filter(category => category.orgId === parseInt(orgId));
            setCategories(matchedCategories);
          }
        });

      // Fetch subcategories
      fetch('https://stage-smart-server-default-rtdb.firebaseio.com/subcategories.json')
        .then((res) => res.json())
        .then((data) => {
          if (data) {
            const matchedSubcategories = Object.entries(data)
              .map(([id, subcategory]) => ({ id, ...subcategory }))
              .filter(subcategory => subcategory.orgId === parseInt(orgId));
            setSubcategories(matchedSubcategories);
          }
        });

      // Fetch menu items
      fetch('https://stage-smart-server-default-rtdb.firebaseio.com/menu_items.json')
        .then((res) => res.json())
        .then((data) => {
          if (data) {
            const matchedMenuItems = Object.entries(data)
              .map(([id, item]) => ({ id, ...item }))
              .filter(item => item.orgId === parseInt(orgId));
            setMenuItems(matchedMenuItems);
          }
        });
    }
  }, [orgId]);

  const toggleCategoryExpansion = (categoryId) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const handleCategoryClick = (category) => {
    if (onCategorySelect) {
      onCategorySelect(category);
    }
  };

  const handleSubcategoryClick = (subcategory) => {
    // Update URL and close navigator
    navigate(`/home?subcategoryId=${subcategory.id}`);
    setIsOpen(false);
    
    // Call the callback if provided
    if (onSubcategorySelect) {
      onSubcategorySelect(subcategory);
    }
  };

  // Add this useEffect to handle URL params
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const subcategoryId = queryParams.get('subcategoryId');
    
    if (subcategoryId) {
      const subcategory = subcategories.find(sub => sub.id === subcategoryId);
      if (subcategory) {
        // Expand the parent category
        setExpandedCategories(prev => ({
          ...prev,
          [subcategory.categoryId]: true
        }));
      }
    }
  }, [location.search, subcategories]);
  const renderSubcategories = (categoryId) => {
    const filteredSubs = subcategories.filter(sub => sub.categoryId === categoryId);
    return filteredSubs.map(sub => (
      <motion.div
        key={sub.id}
        onClick={() => handleSubcategoryClick(sub)}
        whileHover={{ backgroundColor: '#fff5f5' }}
        style={{
          padding: '8px 12px',
          margin: '4px 0',
          borderRadius: '6px',
          cursor: 'pointer',
          backgroundColor: '#ffebeb',
          color: 'black',
          paddingLeft: '20px', // Indentation for subcategories
        }}
      >
        {sub.name}
        <span style={{ float: 'right', color: '#888' }}>
          {menuItems.filter(item => item.subcategoryId === sub.id).length}
        </span>
      </motion.div>
    ));
  };

  if (location.pathname !== '/home') return null;

  return (
    <>
      <motion.div
        className="nav-icon"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          backgroundColor: isOpen ? '#f44336' : 'black',
          color: 'white',
          borderRadius: '50%',
          width: '60px',
          height: '60px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
          boxShadow: '0px 10px 15px rgba(0, 0, 0, 0.3)',
          zIndex: 1000,
        }}
      >
        {isOpen ? <CloseOutlined style={{ fontSize: '24px' }} /> : <MenuOutlined style={{ fontSize: '24px' }} />}
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ width: '0px', opacity: 0 }}
            animate={{ width: '300px', opacity: 1 }}
            exit={{ width: '0px', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            className="category-navigator"
          >
            <h3 style={{ margin: '0 0 15px 0', color: 'black', fontWeight: 'bold' }}>
              Quick Navigation
            </h3>
            {categories.map((category) => (
              <div key={category.id} className="category-item">
                <motion.div
                  onClick={() => toggleCategoryExpansion(category.id)}
                  whileHover={{ backgroundColor: '#ffe0e0' }}
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    border: '1px solid #eee',
                    backgroundColor: expandedCategories[category.id] ? '#ffcccc' : '#ffffff',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ fontSize: '16px', fontWeight: '500' }}>{category.name}</span>
                  {expandedCategories[category.id] ? (
                    <MinusOutlined style={{ color: 'red', marginLeft: '10px' }} />
                  ) : (
                    <PlusOutlined style={{ color: 'red', marginLeft: '10px' }} />
                  )}
                </motion.div>
                {expandedCategories[category.id] && renderSubcategories(category.id)}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CategoryNavigator;
