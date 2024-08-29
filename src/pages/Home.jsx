import React, { useState, useEffect } from 'react';
import CategoryCard from '../components/CategoryCard';
import SubcategoryCard from '../components/SubcategoryCard';
import MenuItem from '../components/MenuItem';

function Home() {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);

  useEffect(() => {
    fetch('https://smartserver-json-server.onrender.com/categories')
      .then((res) => res.json())
      .then((data) => setCategories(data));

    fetch('https://smartserver-json-server.onrender.com/subcategories')
      .then((res) => res.json())
      .then((data) => setSubcategories(data));

    fetch('https://smartserver-json-server.onrender.com/menu_items')
      .then((res) => res.json())
      .then((data) => setMenuItems(data));
  }, []);

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

  return (
    <div className="home-container" style={{marginTop: "10px"}}>
      {!selectedCategory && (
        <>
          <h2 className="section-title" style={{fontFamily: 'Nerko One, sans-serif', fontSize: "30px", textAlign: 'center'}}>Menu Categories</h2>
          <div className="card-grid">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                onClick={() => handleCategoryClick(category)}
              />
            ))}
          </div>
        </>
      )}

      {selectedCategory && !selectedSubcategory && (
        <>
          <button className="back-button" onClick={handleBackToCategories} style={{marginTop: "16px", marginBottom: "0px"}}>
            ← Back to Categories
          </button>
          <h2 className="section-title">{selectedCategory.name}</h2>
          <div className="card-grid">
            {filteredSubcategories.map((subcategory) => (
              <SubcategoryCard
                key={subcategory.id}
                subcategory={subcategory}
                onClick={() => handleSubcategoryClick(subcategory)}
              />
            ))}
          </div>
        </>
      )}

      {selectedSubcategory && (
        <>
          <button className="back-button" onClick={handleBackToSubcategories}>
            ← Back to {selectedCategory.name}
          </button>
          <h2 className="section-title">{selectedSubcategory.name}</h2>
          <div className="menu-items-grid">
            {filteredMenuItems.map((item) => (
              <MenuItem key={item.id} item={item} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Home;