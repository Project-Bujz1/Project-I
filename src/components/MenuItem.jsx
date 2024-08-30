import React, { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';

function MenuItem({ item }) {
  const { cart, addToCart, updateQuantity } = useCart();
  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    const cartItem = cart.find((cartItem) => cartItem.id === item.id);
    if (cartItem) {
      setQuantity(cartItem.quantity);
    }
  }, [cart, item.id]);

  const handleAddToCart = () => {
    if (quantity === 0) {
      addToCart(item);
    } else {
      updateQuantity(item.id, quantity + 1);
    }
    setQuantity(quantity + 1);
  };

  const handleIncreaseQuantity = () => {
    updateQuantity(item.id, quantity + 1);
    setQuantity(quantity + 1);
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      updateQuantity(item.id, quantity - 1);
      setQuantity(quantity - 1);
    } else if (quantity === 1) {
      updateQuantity(item.id, 0);
      setQuantity(0);
    }
  };

  return (
    <div className="menu-item">
      <img src={item.image} alt={item.name} className="menu-item-image" />
      <div className="menu-item-content">
        <h3 className="menu-item-title">{item.name}</h3>
        <p className="menu-item-description">{item.description}</p>
        <div className="menu-item-footer">
          <span className="menu-item-price">₹{item.price}</span>
          {quantity > 0 ? (
            <div className="quantity-controls">
              <button onClick={handleDecreaseQuantity} className="quantity-btn">-</button>
              <span className="quantity-display">{quantity}</span>
              <button onClick={handleIncreaseQuantity} className="quantity-btn">+</button>
            </div>
          ) : (
            <button onClick={handleAddToCart} className="add-to-cart-btn">
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default MenuItem;
