import React, { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import { motion } from 'framer-motion';
import { Image, Tooltip } from 'antd';

const DiningExtrasBubble = () => {
  const { cart, addToCart } = useCart();
  const [showBubble, setShowBubble] = useState(false);
  const [bubblePosition, setBubblePosition] = useState({ x: 0, y: 0 });

  const additionalItems = [
    { id: 'water-bottle', name: 'Water Bottle', image: '/api/placeholder/50/50', quote: 'Stay hydrated for a perfect dining experience!' },
    { id: 'lemon', name: 'Lemon', image: '/api/placeholder/50/50', quote: 'Add a zesty twist to your meal!' },
    { id: 'onions', name: 'Onions', image: '/api/placeholder/50/50', quote: 'Enhance the flavors with a little crunch!' },
  ];

  useEffect(() => {
    // Check if any additional items are not in the cart
    const hasUnaddedItems = additionalItems.some(item => !cart.some(cartItem => cartItem.id === item.id));
    if (hasUnaddedItems) {
      // Show the bubble if there are any unaddded items
      setShowBubble(true);

      // Update the bubble position periodically
      const interval = setInterval(() => {
        const x = Math.floor(Math.random() * (window.innerWidth - 200));
        const y = Math.floor(Math.random() * (window.innerHeight - 200));
        setBubblePosition({ x, y });
      }, 3000);

      return () => clearInterval(interval);
    } else {
      setShowBubble(false);
    }
  }, [cart, additionalItems]);

  const handleAddItem = (item) => {
    addToCart(item);
    setShowBubble(false);
  };

  return (
    showBubble && (
      <motion.div
        className="dining-extras-bubble"
        initial={{ x: bubblePosition.x, y: bubblePosition.y }}
        animate={{ x: bubblePosition.x, y: bubblePosition.y }}
        transition={{ duration: 3, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
        style={{
          position: 'fixed',
          width: '200px',
          padding: '16px',
          backgroundColor: '#f00',
          color: '#fff',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          zIndex: 9999,
        }}
      >
        <h3 style={{ marginBottom: '8px' }}>Dining Extras</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
          {additionalItems.map((item) => (
            <Tooltip key={item.id} title={item.quote}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  margin: '8px',
                  cursor: 'pointer',
                }}
                onClick={() => handleAddItem(item)}
              >
                <Image src={item.image} alt={item.name} width={50} height={50} />
                <span style={{ fontSize: '12px', marginTop: '4px' }}>{item.name}</span>
              </div>
            </Tooltip>
          ))}
        </div>
      </motion.div>
    )
  );
};

export default DiningExtrasBubble;