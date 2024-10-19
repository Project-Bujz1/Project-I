import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';

const CartFooter = () => {
  const { cart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  // Calculate total items in cart
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Calculate total price
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Only show on home screen and when cart has items
  if (location.pathname !== '/home' || totalItems === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        exit={{ y: 100 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '16px',
          background: 'linear-gradient(90deg, red, #ef4444)', // Red gradient background
          boxShadow: '0 -4px 24px rgba(0, 0, 0, 0.3)', // Slightly stronger shadow
          borderTop: '1px solid #e5e7eb',
          zIndex: 50,
          borderRadius: '16px 16px 0 0', // Rounded top corners
          color: 'white',
        }}
      >
        <div 
          style={{
            maxWidth: '40rem',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
          }}
          onClick={() => navigate('/cart')}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{ position: 'relative' }}>
              <ShoppingCart style={{
                width: '28px',
                height: '28px',
                color: 'white', // White icon for contrast
              }} />
              <span style={{
                position: 'absolute',
                top: '-6px',
                right: '-6px',
                background: 'black',
                color: 'white',
                fontSize: '12px',
                borderRadius: '50%',
                width: '22px',
                height: '22px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold'
              }}>
                {totalItems}
              </span>
            </div>
            <span style={{
              fontWeight: 500,
              fontSize: '16px'
            }}>
              {totalItems} {totalItems === 1 ? 'item' : 'items'}
            </span>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            <span style={{
              fontWeight: 700,
              fontSize: '18px'
            }}>
              ₹{totalPrice.toFixed(2)}
            </span>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                background: 'white', // White background for the button
                color: 'black', // Black text for contrast
                padding: '10px 28px',
                borderRadius: '9999px',
                fontSize: '15px',
                fontWeight: 600,
                transition: 'background-color 0.3s',
                border: '2px solid red', // Red border for consistency
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.2)', // Subtle shadow for the button
              }}
              onClick={(e) => {
                e.stopPropagation();
                navigate('/cart');
              }}
            >
              View Cart
            </motion.button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CartFooter;
