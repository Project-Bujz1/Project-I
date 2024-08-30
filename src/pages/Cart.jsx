import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import OrderConfirmation from '../components/OrderConfirmation';

function Cart() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const navigate = useNavigate(); // Updated hook

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePlaceOrder = () => {
    // Simulate saving the order and redirecting to the confirmation page
    setOrderPlaced(true);
  };

  if (orderPlaced) {
    return <OrderConfirmation />;
  }

  return (
    <div className="cart-container" style={{ marginTop: "75px" }}>
      <h2 className="cart-title">Your Cart</h2>
      {cart.length === 0 ? (
        <p className="empty-cart-message">Your cart is empty.</p>
      ) : (
        <>
          {cart.map((item) => (
            <div key={item.id} className="cart-item">
              <div className="item-info">
                <h3 className="item-name">{item.name}</h3>
                <p className="item-price">₹{item.price} x {item.quantity}</p>
              </div>
              <div className="item-actions">
                <button
                  onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                  className="quantity-button"
                >
                  -
                </button>
                <span className="item-quantity">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="quantity-button"
                >
                  +
                </button>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="remove-button"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <div className="cart-total">
            <p className="total-text">Total: ₹{total.toFixed(2)}</p>
            <button
              onClick={handlePlaceOrder}
              className="place-order-button"
              style={{ backgroundColor: 'red', color: '#fff', padding: '10px 20px', border: 'none', borderRadius: '5px' , cursor: 'pointer'}}
            >
              Place Order
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
