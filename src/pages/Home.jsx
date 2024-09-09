import React, { useState, useEffect } from 'react';
import CategoryCard from '../components/CategoryCard';
import SubcategoryCard from '../components/SubcategoryCard';
import MenuItem from '../components/MenuItem';
import FoodLoader from '../components/FoodLoader';

function Home({ cartIconRef, onItemAdded, searchTerm }) {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [loading, setLoading] = useState({ categories: true, subcategories: true, menuItems: true });
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    fetch('https://smartserver-json-server.onrender.com/categories')
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
        setLoading((prev) => ({ ...prev, categories: false }));
      });

    fetch('https://smartserver-json-server.onrender.com/subcategories')
      .then((res) => res.json())
      .then((data) => {
        setSubcategories(data);
        setLoading((prev) => ({ ...prev, subcategories: false }));
      });

    fetch('https://smartserver-json-server.onrender.com/menu_items')
      .then((res) => res.json())
      .then((data) => {
        setMenuItems(data);
        setLoading((prev) => ({ ...prev, menuItems: false }));
      });
  }, []);

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
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setSelectedSubcategory(null);
  };

  const handleBackToSubcategories = () => {
    setSelectedSubcategory(null);
  };

  const renderMenuItem = (item) => (
    <MenuItem 
      key={item.id} 
      item={item} 
      cartIconRef={cartIconRef} 
      onItemAdded={onItemAdded} 
    />
  );

  return (
    <div className="home-container" style={{ marginTop: '10px' }}>
      {searchTerm ? (
        <>
          <h2 className="section-title" style={{ fontFamily: 'Nerko One, sans-serif', fontSize: '30px', textAlign: 'center' }}>
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
              <h2 className="section-title" style={{ fontFamily: 'Nerko One, sans-serif', fontSize: '30px', textAlign: 'center', marginTop: '15px' }}>Menu Categories</h2>
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
              <button className="back-button" onClick={handleBackToCategories} style={{ marginTop: '16px', marginBottom: '0px' }}>
                ← Back to Categories
              </button>
              <h2 className="section-title">{selectedCategory.name}</h2>
              {loading.subcategories ? (
                <p>Loading subcategories...</p>
              ) : (
                <div className="card-grid">
                  {filteredSubcategories.map((subcategory) => (
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
              <button className="back-button" onClick={handleBackToSubcategories} style={{marginTop: '10px'}}>
                ← Back to {selectedCategory.name}
              </button>
              <h2 className="section-title">{selectedSubcategory.name}</h2>
              {loading.menuItems ? (
                <p>Loading menu items...</p>
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