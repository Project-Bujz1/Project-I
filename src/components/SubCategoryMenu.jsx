import React from 'react';

function SubcategoryMenu({ subcategories, selectedSubcategory, onSelectSubcategory }) {
  return (
    <div className="subcategory-menu">
      {subcategories.map((subcategory) => (
        <button
          key={subcategory.id}
          onClick={() => onSelectSubcategory(subcategory)}
          className={`subcategory-button ${selectedSubcategory?.id === subcategory.id ? 'active' : ''}`}
        >
          {subcategory.name}
        </button>
      ))}
    </div>
  );
}

export default SubcategoryMenu;