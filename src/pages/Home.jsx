import React, { useState, useEffect } from 'react';
import CategoryCard from '../components/CategoryCard';
import SubcategoryCard from '../components/SubcategoryCard';
import MenuItem from '../components/MenuItem';
import FoodLoader from '../components/FoodLoader';
import { useLocation, useNavigate } from 'react-router-dom';
import CategoryNavigator from '../components/BillSummary';
import CartFooter from '../components/CartFooter';
import FoodTypeFilter from '../components/FoodTypeFilter';

function Home({ cartIconRef, onItemAdded, searchTerm }) {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [recommendations, setRecommendations] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [loading, setLoading] = useState({ categories: true, subcategories: true, menuItems: true });
  const [searchResults, setSearchResults] = useState([]);
  const [filters, setFilters] = useState({ veg: true, nonVeg: true });
  
  const orgId = localStorage.getItem('orgId');

  const location = useLocation();
  const navigate = useNavigate();
  // Modified fetchData to include recommendations
  useEffect(() => {
    if (orgId) {
      Promise.all([
        fetch('https://stage-smart-server-default-rtdb.firebaseio.com/categories.json'),
        fetch('https://stage-smart-server-default-rtdb.firebaseio.com/subcategories.json'),
        fetch('https://stage-smart-server-default-rtdb.firebaseio.com/menu_items.json'),
        fetch('https://stage-smart-server-default-rtdb.firebaseio.com/menu_suggestions.json')
      ])
        .then(([catRes, subRes, menuRes, sugRes]) => 
          Promise.all([catRes.json(), subRes.json(), menuRes.json(), sugRes.json()])
        )
        .then(([catData, subData, menuData, sugData]) => {
          // Process categories
          if (catData) {
            const matchedCategories = Object.entries(catData)
              .map(([id, category]) => ({ id, ...category }))
              .filter(category => category.orgId === parseInt(orgId));
            setCategories(matchedCategories);
          }

          // Process subcategories
          if (subData) {
            const matchedSubcategories = Object.entries(subData)
              .map(([id, subcategory]) => ({ id, ...subcategory }))
              .filter(subcategory => subcategory.orgId === parseInt(orgId));
            setSubcategories(matchedSubcategories);
          }

          // Process menu items and suggestions together
          if (menuData) {
            const menuItemsArray = Object.entries(menuData)
              .map(([id, item]) => ({ id, ...item }))
              .filter(item => item.orgId === parseInt(orgId));
            setMenuItems(menuItemsArray);

            // Process recommendations
            if (sugData) {
              const processedRecommendations = {};
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
              setRecommendations(processedRecommendations);
            }
          }

          setLoading({
            categories: false,
            subcategories: false,
            menuItems: false
          });
        })
        .catch(error => {
          console.error('Error fetching data:', error);
          setLoading({
            categories: false,
            subcategories: false,
            menuItems: false
          });
        });
    }
  }, [orgId]);

  // Search functionality
  useEffect(() => {
    if (searchTerm) {
      const filteredItems = menuItems.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(filteredItems);
      setSelectedCategory(null);
      setSelectedSubcategory(null);
    } else {
      setSearchResults([]);
    }
  }, [searchTerm, menuItems]);
  

// Mobile Back Navigation Handler
useEffect(() => {
  const handleBrowserBack = (event) => {
    event.preventDefault();

    if (selectedSubcategory) {
      // Going back from subcategory to category view
      setSelectedSubcategory(null);
      navigate(`/home?categoryId=${selectedCategory.id}`, { replace: true });
    } else if (selectedCategory) {
      // Going back from category to main categories view
      setSelectedCategory(null);
      navigate('/home', { replace: true });
    } else {
      // If on the main categories screen, let the app close
      if (window.history.length > 1) {
        window.history.back();
      }
    }
  };

  // Add event listener for popstate
  window.addEventListener('popstate', handleBrowserBack);

  // Cleanup listener
  return () => {
    window.removeEventListener('popstate', handleBrowserBack);
  };
}, [selectedCategory, selectedSubcategory, navigate]);


  // Restore state from URL
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const categoryId = queryParams.get('categoryId');
    const subcategoryId = queryParams.get('subcategoryId');
    
    if (subcategoryId && subcategories.length > 0 && categories.length > 0) {
      const subcategory = subcategories.find(sub => sub.id === subcategoryId);
      if (subcategory) {
        const category = categories.find(cat => cat.id === subcategory.categoryId);
        setSelectedCategory(category);
        setSelectedSubcategory(subcategory);
      }
    } else if (categoryId && categories.length > 0) {
      const category = categories.find(cat => cat.id === categoryId);
      if (category) {
        setSelectedCategory(category);
      }
    }
  }, [location.search, subcategories, categories]);

  // Category and Subcategory Selection Handlers
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setSelectedSubcategory(null);
    navigate(`/home?categoryId=${category.id}`);
  };

  const handleSubcategoryClick = (subcategory) => {
    const category = categories.find(cat => cat.id === subcategory.categoryId);
    setSelectedCategory(category);
    setSelectedSubcategory(subcategory);
    navigate(`/home?categoryId=${category.id}&subcategoryId=${subcategory.id}`);
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    navigate('/home');
  };

  const handleBackToSubcategories = () => {
    setSelectedSubcategory(null);
    navigate(`/home?categoryId=${selectedCategory.id}`);
  };

  // Filter and render logic (keep existing logic)
  const filteredSubcategories = selectedCategory
    ? subcategories.filter((sub) => sub.categoryId === selectedCategory.id)
    : [];

  const filteredMenuItems = selectedSubcategory
    ? menuItems
        .filter((item) => item.subcategoryId === selectedSubcategory.id)
        .filter(
          (item) =>
            (filters.veg && item.foodType === 'veg') ||
            (filters.nonVeg && item.foodType === 'nonveg')
        )
    : [];

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const renderMenuItem = (item) => (
    <MenuItem 
      key={item.id} 
      item={item} 
      cartIconRef={cartIconRef} 
      onItemAdded={onItemAdded}
      recommendations={recommendations[item.id] || []}
    />
  );

  // Add this useEffect to handle changes in URL
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const subcategoryId = queryParams.get('subcategoryId');
    if (subcategoryId) {
      const subcategory = subcategories.find((sub) => sub.id === subcategoryId);
      if (subcategory) {
        setSelectedSubcategory(subcategory);
        setSelectedCategory(categories.find((cat) => cat.id === subcategory.categoryId)); // Set selected category based on subcategory
      }
    }
  }, [subcategories, categories]);
  return (
    <div className="home-container" style={{  marginBottom: '150px',
      paddingBottom: '70px', // Reduced padding to match new footer height
      minHeight: '100vh',    // Ensure full viewport height
      position: 'relative'  }}>
      <CategoryNavigator
        onCategorySelect={setSelectedCategory}
        onSubcategorySelect={(subcategory) => {
          const category = categories.find(cat => cat.id === subcategory.categoryId);
          setSelectedCategory(category);
          setSelectedSubcategory(subcategory);
        }}
      />
      <CartFooter />
      
      {searchTerm ? (
        <>
          <h2 className="section-title" style={{ fontFamily: 'Nerko One, sans-serif', fontSize: '30px', textAlign: 'center', marginTop: '55px' }}>
            Search Results for "{searchTerm}"
          </h2>
          {searchResults.length > 0 ? (
            <div className="menu-items-grid">
              {searchResults.map(renderMenuItem)}
            </div>
          ) : (
            <p style={{ textAlign: 'center' }}>No items found.</p>
          )}
        </>
      ) : (
        <>
          {!selectedCategory && (
            <>
              <h2 className="section-title" style={{ fontFamily: 'Nerko One, sans-serif', fontSize: '30px', textAlign: 'center', marginTop: '20px' }}>Menu Categories</h2>
              {loading.categories ? (
                <FoodLoader />
              ) : (
                <div className="card-grid">
                  {categories.map((category) => (
                    <CategoryCard
                      key={category.id}
                      category={category}
                      onClick={() => handleCategoryClick(category)}
                    />
                  ))}
                </div>
              )}
            </>
          )}

          {selectedCategory && !selectedSubcategory && (
            <>
              <button className="back-button" onClick={handleBackToCategories} style={{ marginTop: '24px', marginBottom: '0px' }}>
                ← Back to Categories
              </button>
              <h2 className="section-title">{selectedCategory.name}</h2>
              {loading.subcategories ? (
                <>
                <div className="loading-animation"
                style={{
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
          alignItems: 'center',
          height: '200px',
        }}
      >
        <img src="/assets/LoadingMenuItems.gif" alt="Loading menu items..." />
        <h1>Loading Sub Categories</h1>
      </div>
                </>
              ) : (
                <div className="card-grid">
                  {filteredSubcategories?.map((subcategory) => (
                    <SubcategoryCard
                      key={subcategory.id}
                      subcategory={subcategory}
                      onClick={() => handleSubcategoryClick(subcategory)}
                    />
                  ))}
                </div>
              )}
            </>
          )}

{selectedSubcategory && (
  <>
    <div
      style={{
        position: 'sticky',
        top: 90,
        // backgroundColor: '#fff',
        zIndex: 1000,
        padding: '10px 0',
        // boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <button
        className="back-button"
        onClick={handleBackToSubcategories}
        style={{ margin: '0 10px' }}
      >
        ← {selectedCategory.name}
      </button>
      <FoodTypeFilter onFilterChange={handleFilterChange} />
    </div>
    
    <h2 className="section-title">{selectedSubcategory.name}</h2>
    {loading.menuItems ? (
                <div className="loading-animation"
                style={{
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
          alignItems: 'center',
          height: '200px',
        }}
      >
        <img src="/assets/LoadingMenuItems.gif" alt="Loading menu items..." />
        <h1>Loading Menu Items</h1>
      </div>
    ) : (
      <div className="menu-items-grid">
        {filteredMenuItems.map(renderMenuItem)}
      </div>
    )}
  </>
)}
        </>
      )}
    </div>
  );
}

export default Home;