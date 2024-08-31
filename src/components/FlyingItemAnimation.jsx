import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';

const FlyingItemAnimation = ({ itemImage, startPosition, endPosition, onAnimationComplete }) => {
  const controls = useAnimation();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const animateItem = async () => {
      await controls.start({
        x: endPosition.x - startPosition.x,
        y: endPosition.y - startPosition.y,
        scale: 0.5,
        opacity: 0.7,
        transition: { duration: 0.8, ease: 'easeInOut' }
      });
      setIsVisible(false);
      onAnimationComplete();
    };

    animateItem();
  }, [controls, startPosition, endPosition, onAnimationComplete]);

  if (!isVisible) return null;

  return (
    <motion.img
      src={itemImage}
      alt="Flying item"
      initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
      animate={controls}
      style={{
        position: 'fixed',
        left: startPosition.x,
        top: startPosition.y,
        width: '50px',
        height: '50px',
        borderRadius: '25px',
        zIndex: 9999,
      }}
    />
  );
};

export default FlyingItemAnimation;