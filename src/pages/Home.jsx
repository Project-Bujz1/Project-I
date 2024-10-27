// Home.jsx
import React, { useState, useEffect } from 'react';
import CategoryCard from '../components/CategoryCard';
import SubcategoryCard from '../components/SubcategoryCard';
import MenuItem from '../components/MenuItem';
import FoodLoader from '../components/FoodLoader';
import { useLocation, useNavigate } from 'react-router-dom';
import CategoryNavigator from '../components/BillSummary';
import CartFooter from '../components/CartFooter';

function Home({ cartIconRef, onItemAdded, searchTerm }) {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [loading, setLoading] = useState({ categories: true, subcategories: true, menuItems: true });
  const [searchResults, setSearchResults] = useState([]);
  
  const orgId = localStorage.getItem('orgId');

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (orgId) {
      fetch('https://stage-smart-server-default-rtdb.firebaseio.com/categories.json')
        .then((res) => res.json())
        .then((data) => {
          if (data) {
            const matchedCategories = Object.entries(data)
              .map(([id, category]) => ({ id, ...category }))
              .filter(category => category.orgId === parseInt(orgId));
            setCategories(matchedCategories);
          }
          setLoading((prev) => ({ ...prev, categories: false }));
        });

      fetch('https://stage-smart-server-default-rtdb.firebaseio.com/subcategories.json')
        .then((res) => res.json())
        .then((data) => {
          if (data) {
            const matchedSubcategories = Object.entries(data)
              .map(([id, subcategory]) => ({ id, ...subcategory }))
              .filter(subcategory => subcategory.orgId === parseInt(orgId));
            setSubcategories(matchedSubcategories);
          }
          setLoading((prev) => ({ ...prev, subcategories: false }));
        });

      fetch('https://stage-smart-server-default-rtdb.firebaseio.com/menu_items.json')
        .then((res) => res.json())
        .then((data) => {
          if (data) {
            const matchedMenuItems = Object.entries(data)
              .map(([id, item]) => ({ id, ...item }))
              .filter(item => item.orgId === parseInt(orgId));
            setMenuItems(matchedMenuItems);
          }
          setLoading((prev) => ({ ...prev, menuItems: false }));
        });
    }
  }, [orgId]);

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
  const filteredSubcategories = selectedCategory
  ? subcategories.filter((sub) => sub.categoryId === selectedCategory.id)
  : [];

const filteredMenuItems = selectedSubcategory
  ? menuItems.filter((item) => item.subcategoryId === selectedSubcategory.id)
  : [];
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setSelectedSubcategory(null);
  };

  const handleSubcategoryClick = (subcategory) => {
    setSelectedSubcategory(subcategory);
    navigate(`?subcategoryId=${subcategory.id}`); // Update the URL with the subcategory ID
  };
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const subcategoryId = queryParams.get('subcategoryId');
    
    if (subcategoryId && subcategories.length > 0 && categories.length > 0) {
      const subcategory = subcategories.find(sub => sub.id === subcategoryId);
      if (subcategory) {
        const category = categories.find(cat => cat.id === subcategory.categoryId);
        setSelectedCategory(category);
        setSelectedSubcategory(subcategory);
      }
    }
  }, [location.search, subcategories, categories]);

  // Modify the back button handlers to update URL
  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    navigate('/home');
  };

  const handleBackToSubcategories = () => {
    setSelectedSubcategory(null);
    navigate(`/home`);
  };
  const renderMenuItem = (item) => (
    <MenuItem 
      key={item.id} 
      item={item} 
      cartIconRef={cartIconRef} 
      onItemAdded={onItemAdded} 
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
                <p>Loading subcategories...</p>
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
              <button className="back-button" onClick={handleBackToSubcategories} style={{marginTop: '26px'}}>
                ← Back to {selectedCategory.name}
              </button>
                            <h2 className="section-title">{selectedSubcategory.name}</h2>
              {loading.menuItems ? (
                <div className="loading-animation"
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  alignItems: 'center',
                  height: '200px', // Adjust height as needed
                }}>
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