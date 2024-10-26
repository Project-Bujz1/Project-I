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

  const menuVariants = {
    closed: {
      width: 0,
      opacity: 0,
      x: 100,
    },
    open: {
      width: "350px",
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      }
    }
  };

  const categoryVariants = {
    closed: {
      height: 0,
      opacity: 0,
    },
    open: {
      height: "auto",
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  const renderSubcategories = (categoryId) => {
    const filteredSubs = subcategories.filter(sub => sub.categoryId === categoryId);
    return (
      <motion.div
        initial="closed"
        animate="open"
        exit="closed"
        variants={categoryVariants}
        style={{
          marginTop: '8px',
          marginLeft: '24px',
          borderLeft: '2px solid #fecdd3',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}
      >
        {filteredSubs.map(sub => (
          <motion.div
            key={sub.id}
            onClick={() => handleSubcategoryClick(sub)}
            style={{
              position: 'relative',
              paddingLeft: '16px',
              paddingRight: '12px',
              paddingTop: '8px',
              paddingBottom: '8px',
              cursor: 'pointer',
              borderRadius: '0 8px 8px 0',
              transition: 'all 0.2s ease'
            }}
            whileHover={{
              backgroundColor: '#fff1f2',
              x: 4
            }}
          >
            <div style={{
              position: 'absolute',
              left: '-5px',
              top: '50%',
              width: '8px',
              height: '8px',
              backgroundColor: 'red',
              borderRadius: '50%',
              transform: 'translateY(-50%)'
            }} />
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="red" strokeWidth="2">
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
                  <line x1="7" y1="7" x2="7.01" y2="7"/>
                </svg>
                <span style={{ color: '#374151' }}>{sub.name}</span>
              </div>
              <span style={{
                padding: '4px 8px',
                fontSize: '12px',
                backgroundColor: '#fff1f2',
                color: 'red',
                borderRadius: '9999px'
              }}>
                {menuItems.filter(item => item.subcategoryId === sub.id).length}
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    );
  };

  if (location.pathname !== '/home') return null;

  return (
    <>
      <motion.button
        style={{
          position: 'fixed',
          bottom: '150px',
          right: '24px',
          zIndex: 50,
          border: 'none',
          padding: 0,
          background: 'none',
          cursor: 'pointer'
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div style={{
          background: 'linear-gradient(to right top, #ef4444, red)',
          color: 'white',
          padding: '16px',
          borderRadius: '50%',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {isOpen ? (
              <path d="M18 6L6 18M6 6l12 12"/>
            ) : (
              <path d="M3 12h18M3 6h18M3 18h18"/>
            )}
          </svg>
        </div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            style={{
              position: 'fixed',
              bottom: '100px',
              right: '40px',
              zIndex: 40,
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              height: '50vh',
              width: '150px',
              overflow: 'hidden'
            }}
          >
            <div style={{
              padding: '16px',
              height: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '24px'
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="red" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: 600,
                  color: '#1f2937',
                  margin: 0
                }}>
                  Quick Navigation
                </h3>
              </div>
              
              <div style={{
                overflowY: 'auto',
                flex: 1,
                paddingRight: '8px'
              }}>
                {categories.map((category) => (
                  <div key={category.id} style={{ marginBottom: '16px' }}>
                    <motion.div
                      onClick={() => toggleCategoryExpansion(category.id)}
                      style={{
                        padding: '12px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        backgroundColor: expandedCategories[category.id] ? '#fff1f2' : 'white',
                        transition: 'all 0.2s ease'
                      }}
                      whileHover={{ backgroundColor: expandedCategories[category.id] ? '#ffe4e6' : '#f3f4f6' }}
                    >
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          style={{
                            transform: `rotate(${expandedCategories[category.id] ? '90deg' : '0deg'})`,
                            transition: 'transform 0.2s ease'
                          }}
                        >
                          <path d="M9 18l6-6-6-6"/>
                        </svg>
                        <span style={{
                          fontWeight: 500,
                          color: '#374151'
                        }}>
                          {category.name}
                        </span>
                      </div>
                    </motion.div>
                    <AnimatePresence>
                      {expandedCategories[category.id] && renderSubcategories(category.id)}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CategoryNavigator;