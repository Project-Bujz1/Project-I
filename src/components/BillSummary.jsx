import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { CloseOutlined, FileTextOutlined } from '@ant-design/icons';

const BillSummary = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { cart } = useCart();
  const location = useLocation();
  const [prevTotalAmount, setPrevTotalAmount] = useState(0);

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  useEffect(() => {
    setPrevTotalAmount(totalAmount);
  }, [totalAmount]);

  if (location.pathname !== '/home' || cart.length === 0) return null;

  return (
    <>
      {/* Bill Icon with Shadow */}
      <motion.div
        className="bill-icon"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          backgroundColor: isOpen ? '#f44336' : 'black',
          color: 'white',
          borderRadius: '50%',
          width: '60px',
          height: '60px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
          boxShadow: '0px 10px 15px rgba(0, 0, 0, 0.3)', // Shadow effect
          zIndex: 1000,
        }}
      >
        {isOpen ? (
          <CloseOutlined style={{ fontSize: '24px' }} />
        ) : (
          <FileTextOutlined style={{ fontSize: '24px' }} />
        )}
      </motion.div>

      {/* Animated Rectangle Popup */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ width: '0px', opacity: 0 }}
            animate={{ width: '300px', opacity: 1 }}
            exit={{ width: '0px', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            style={{
              position: 'fixed',
              bottom: '20px',
              right: '90px',
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              zIndex: 1000,
            }}
          >
            <h3 style={{ margin: 0, color: '#333', fontWeight: 'bold' }}>Bill Summary</h3>
            {cart.map((item) => (
              <motion.div
                key={item.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '10px',
                  fontSize: '16px',
                }}
              >
                <span>{item.name} x{item.quantity}</span>
                <motion.span
                  animate={{
                    scale: totalAmount > prevTotalAmount ? 1.3 : 1,
                    color: totalAmount > prevTotalAmount ? '#4CAF50' : '#333',
                  }}
                  transition={{ duration: 0.3 }}
                  style={{ fontSize: '16px' }}
                >
                  ₹{(item.price * item.quantity).toFixed(2)}
                </motion.span>
              </motion.div>
            ))}
            <div style={{ borderTop: '1px solid #eee', marginTop: '10px', paddingTop: '10px', fontWeight: 'bold' }}>
              <span>Total:</span>
              <span style={{ float: 'right' }}>₹{totalAmount.toFixed(2)}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Animated Badge */}
      <AnimatePresence>
        {totalAmount > prevTotalAmount && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1.2, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.5, type: 'spring', stiffness: 120 }}
            style={{
              position: 'fixed',
              bottom: '80px',
              right: '40px',
              fontSize: '18px',
              color: '#4CAF50',
              fontWeight: 'bold',
              background: '#f44336',
              borderRadius: '50%',
              padding: '10px',
              color: 'white',
              boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.3)', // Shadow effect for badge
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <span>+₹{(totalAmount - prevTotalAmount).toFixed(2)}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default BillSummary;
