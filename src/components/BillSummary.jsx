import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { FaFileInvoiceDollar } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { FileTextOutlined } from '@ant-design/icons';

const BillSummary = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { cart } = useCart();
  const location = useLocation();

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  if (location.pathname !== '/home' || cart.length === 0) return null;

  return (
    <>
      <motion.div
        className="bill-icon"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          backgroundColor: 'black',
          color: 'white',
          borderRadius: '50%',
          width: '60px',
          height: '60px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          zIndex: 1000,
        }}
      >
        <FileTextOutlined size={36} />
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{
              position: 'fixed',
              bottom: '80px',
              right: '20px',
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '20px',
              width: '300px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              zIndex: 1000,
            }}
          >
            <h3 style={{ marginTop: 0, color: '#333' }}>Bill Summary</h3>
            {cart.map((item) => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span>{item.name} x{item.quantity}</span>
                <span>₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div style={{ borderTop: '1px solid #eee', marginTop: '10px', paddingTop: '10px', fontWeight: 'bold' }}>
              <span>Total:</span>
              <span style={{ float: 'right' }}>₹{totalAmount.toFixed(2)}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default BillSummary;