import React from 'react';

function CategoryCard({ category, onClick }) {
  return (
    <div className="category-card" onClick={onClick}>
      <div className="category-icon">🍽️</div>
      <h3>{category.name}</h3>
    </div>
  );
}

export default CategoryCard;