// import React from 'react';
// import { useCart } from '../contexts/CartContext';

// function MenuItem({ item }) {
//   const { addToCart } = useCart();

//   return (
//     <div className="menu-item">
//       <img src={item.image} alt={item.name} className="menu-item-image" />
//       <div className="menu-item-content">
//         <h3 className="menu-item-title">{item.name}</h3>
//         <p className="menu-item-description">{item.description}</p>
//         <div className="menu-item-footer">
//           <span className="menu-item-price">₹{item.price}</span>
//           <button onClick={() => addToCart(item)} className="add-to-cart-btn">
//             Add to Cart
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default MenuItem;
import React from 'react';
import { useCart } from '../contexts/CartContext';

function MenuItem({ item }) {
  const { addToCart } = useCart();

  return (
    <div className="menu-item">
      <img src={item.image} alt={item.name} className="menu-item-image" />
      <div className="menu-item-content">
        <h3 className="menu-item-title">{item.name}</h3>
        <p className="menu-item-description">{item.description}</p>
        <div className="menu-item-footer">
          <span className="menu-item-price">₹{item.price}</span>
          <button onClick={() => addToCart(item)} className="add-to-cart-btn">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default MenuItem;