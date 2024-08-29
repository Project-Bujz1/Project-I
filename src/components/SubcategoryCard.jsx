import React from 'react';

function SubcategoryCard({ subcategory, onClick }) {
  return (
    <div className="subcategory-card" onClick={onClick}>
      <div className="subcategory-icon">🍳</div>
      <h3>{subcategory.name}</h3>
    </div>
  );
}

export default SubcategoryCard;