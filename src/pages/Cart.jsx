import React, { useState } from 'react'; 
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';

function Cart() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePlaceOrder = () => {
    setOrderPlaced(true);
    navigate('/order-summary');
  };

  const handleBrowseMenu = () => {
    navigate('/home');
  };
  
  const getImageUrl = (imageData) => {
    if (!imageData) return '';
    if (typeof imageData === 'string') {
      return imageData;
    }
    if (imageData.file && imageData.file.url) {
      return imageData.file.url;
    }
    return '';
  };

  const scrollStyles = {
    maxHeight: '400px',
    overflowY: 'auto',
    padding: '10px',
    border: '1px solid #ddd',
    marginBottom: '20px',
    scrollbarWidth: 'thin', // Firefox-only
    scrollbarColor: 'red transparent', // Firefox-only

    /* Inline style for WebKit browsers */
    WebkitOverflowScrolling: 'touch',
  };

  return (
    <div className="cart-container" style={{ marginTop: '135px', marginBottom: '200px',  padding: '20px' }}>
      <h2 className="cart-title">Your Cart</h2>
      {cart.length === 0 ? (
        <div
          className="empty-cart"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '200px',
            textAlign: 'center'
          }}
        >
          <p className="empty-cart-message">Your cart is empty.</p>
          <button
            onClick={handleBrowseMenu}
            className="browse-menu-button"
            style={{
              backgroundColor: 'red',
              color: '#fff',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              marginTop: '10px'
            }}
          >
            Browse Menu
          </button>
        </div>
      ) : (
        <>
          <div 
            className="cart-items-container" 
            style={{
              ...scrollStyles,
              overflowY: 'auto',
              maxHeight: '400px',
              marginBottom: '20px',
            }}
          >
            {cart.map((item) => (
              <div key={item.id} className="cart-item" style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                <img src={getImageUrl(item.image)} alt={item.name} style={{ width: '100px', height: '100px', marginRight: '20px' }} />
                <div className="item-info">
                  <h3 className="item-name">{item.name}</h3>
                  <p className="item-price">₹{item.price} x {item.quantity}</p>
                </div>
                <div className="item-actions" style={{ marginLeft: 'auto' }}>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="quantity-button"
                    style={{ marginRight: '10px' }}
                  >
                    -
                  </button>
                  <span className="item-quantity">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="quantity-button"
                    style={{ marginLeft: '10px', marginRight: '20px' }}
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="remove-button"
                    style={{
                      backgroundColor: 'red',
                      color: '#fff',
                      padding: '5px 10px',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer'
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="cart-actions" style={{ textAlign: 'right' }}>
            <p className="total-text">Total: ₹{total.toFixed(2)}</p>
            <div className="button-group" style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={handlePlaceOrder}
                className="cart-button"
                style={{
                  backgroundColor: 'red',
                  color: '#fff',
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  marginRight: '10px'
                }}
              >
                Place Order
              </button>
              <button
                onClick={() => navigate('/home')}
                className="cart-button"
                style={{
                  backgroundColor: 'red',
                  color: '#fff',
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                Add More Items
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
