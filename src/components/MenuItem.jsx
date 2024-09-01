import React, { useState, useEffect, useRef } from 'react';
import { useCart } from '../contexts/CartContext';
import { useCartIcon } from '../contexts/CartIconContext';
import FlyingItemAnimation from './FlyingItemAnimation';

function MenuItem({ item, onItemAdded }) {
  const { cart, addToCart, updateQuantity } = useCart();
  const cartIconRef = useCartIcon();
  const [quantity, setQuantity] = useState(0);
  const [showAnimation, setShowAnimation] = useState(false);
  const [animationStartPosition, setAnimationStartPosition] = useState({ x: 0, y: 0 });
  const itemRef = useRef(null);

  useEffect(() => {
    const cartItem = cart.find((cartItem) => cartItem.id === item.id);
    if (cartItem) {
      setQuantity(cartItem.quantity);
    }
  }, [cart, item.id]);

  const triggerAnimation = () => {
    const itemRect = itemRef.current.getBoundingClientRect();
    setAnimationStartPosition({ x: itemRect.left, y: itemRect.top });
    setShowAnimation(true);
  };

  const handleAddToCart = () => {
    if (quantity === 0) {
      addToCart(item);
    } else {
      updateQuantity(item.id, quantity + 1);
    }
    setQuantity(quantity + 1);
    triggerAnimation();
    if (onItemAdded) onItemAdded();
  };

  const handleIncreaseQuantity = () => {
    updateQuantity(item.id, quantity + 1);
    setQuantity(quantity + 1);
    triggerAnimation();
    if (onItemAdded) onItemAdded();
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

  const handleAnimationComplete = () => {
    setShowAnimation(false);
  };

  const getCartIconPosition = () => {
    if (cartIconRef && cartIconRef.current) {
      const rect = cartIconRef.current.getBoundingClientRect();
      return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    }
    return { x: window.innerWidth - 60, y: 40 }; // Fallback position
  };

  return (
    <div className="menu-item" ref={itemRef}>
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
      {showAnimation && (
        <FlyingItemAnimation
          itemImage={item.image}
          startPosition={animationStartPosition}
          endPosition={getCartIconPosition()}
          onAnimationComplete={handleAnimationComplete}
        />
      )}
    </div>
  );
}

export default MenuItem;