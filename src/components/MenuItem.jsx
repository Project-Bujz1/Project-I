// import React, { useState, useEffect, useRef } from 'react';
// import { useCart } from '../contexts/CartContext';
// import { useCartIcon } from '../contexts/CartIconContext';
// import FlyingItemAnimation from './FlyingItemAnimation';
// import FoodLoader from './FoodLoader';
// import { Tooltip } from 'antd';

// function MenuItem({ item, onItemAdded }) {
//   const { cart, addToCart, updateQuantity, removeFromCart } = useCart();
//   const cartIconRef = useCartIcon();
//   const [quantity, setQuantity] = useState(0);
//   const [showAnimation, setShowAnimation] = useState(false);
//   const [animationStartPosition, setAnimationStartPosition] = useState({ x: 0, y: 0 });
//   const [imageLoaded, setImageLoaded] = useState(false);
//   const itemRef = useRef(null);

//   // Function to get food type icon
//   const getFoodTypeIcon = (type) => {
//     switch (type) {
//       case 'veg':
//         return <img src="https://img.icons8.com/?size=100&id=61083&format=png&color=000000" alt="Veg" style={{ width: '24px', marginRight: '8px' }} />;
//       case 'nonveg':
//         return <img src="https://img.icons8.com/?size=100&id=61082&format=png&color=000000" alt="Non-Veg" style={{ width: '24px', marginRight: '8px' }} />;
//       default:
//         return null;
//     }
//   };

//   const getImageUrl = (imageData) => {
//     if (!imageData) return '';
//     if (typeof imageData === 'string') {
//       return imageData;
//     }
//     if (imageData.file && imageData.file.url) {
//       return imageData.file.url;
//     }
//     return '';
//   };

//   useEffect(() => {
//     const cartItem = cart.find((cartItem) => cartItem.id === item.id);
//     if (cartItem) {
//       setQuantity(cartItem.quantity);
//     }
//   }, [cart, item.id]);

//   const triggerAnimation = () => {
//     const itemRect = itemRef.current.getBoundingClientRect();
//     setAnimationStartPosition({ x: itemRect.left, y: itemRect.top });
//     setShowAnimation(true);
//   };

//   const handleAddToCart = () => {
//     if (quantity === 0) {
//       addToCart(item);
//     } else {
//       updateQuantity(item.id, quantity + 1);
//     }
//     setQuantity(quantity + 1);
//     triggerAnimation();
//     if (onItemAdded) onItemAdded();
//   };

//   const handleIncreaseQuantity = () => {
//     updateQuantity(item.id, quantity + 1);
//     setQuantity(quantity + 1);
//     triggerAnimation();
//     if (onItemAdded) onItemAdded();
//   };

//   const handleDecreaseQuantity = () => {
//     if (quantity > 1) {
//       updateQuantity(item.id, quantity - 1);
//       setQuantity(quantity - 1);
//     } else if (quantity === 1) {
//       removeFromCart(item.id);
//       setQuantity(0);
//     }
//   };

//   const handleAnimationComplete = () => {
//     setShowAnimation(false);
//   };

//   const getCartIconPosition = () => {
//     if (cartIconRef && cartIconRef.current) {
//       const rect = cartIconRef.current.getBoundingClientRect();
//       return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
//     }
//     return { x: window.innerWidth - 60, y: 40 };
//   };

//   const handleImageLoad = () => {
//     setImageLoaded(true);
//   };

//   const handleImageError = (e) => {
//     console.error('Error loading image:', e);
//     e.target.src = '/path-to-your-fallback-image.jpg';
//   };

//   const styles = {
//     menuItem: {
//       border: '1px solid #ddd',
//       borderRadius: '8px',
//       overflow: 'hidden',
//       margin: '10px',
//       boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
//     },
//     imageContainer: {
//       position: 'relative',
//       width: '100%',
//       height: '150px',
//       overflow: 'hidden',
//     },
//     image: {
//       width: '100%',
//       height: '100%',
//       objectFit: 'cover',
//       transition: 'opacity 0.3s ease-in-out',
//       opacity: imageLoaded ? 1 : 0,
//     },
//     content: {
//       padding: '15px',
//     },
//     title: {
//       fontSize: '18px',
//       fontWeight: 'bold',
//       margin: '0 0 10px 0',
//     },
//     description: {
//       fontSize: '14px',
//       color: '#666',
//       margin: '0 0 15px 0',
//     },
//     footer: {
//       display: 'flex',
//       justifyContent: 'space-between',
//       alignItems: 'center',
//     },
//     price: {
//       fontSize: '16px',
//       fontWeight: 'bold',
//     },
//     quantityControls: {
//       display: 'flex',
//       alignItems: 'center',
//     },
//     quantityBtn: {
//       width: '30px',
//       height: '30px',
//       border: 'none',
//       background: '#f0f0f0',
//       cursor: 'pointer',
//       fontSize: '18px',
//     },
//     quantityDisplay: {
//       margin: '0 10px',
//       fontSize: '16px',
//     },
//     addToCartBtn: {
//       padding: '8px 15px',
//       background: item.isAvailable ? 'red' : '#ccc',
//       color: 'white',
//       border: 'none',
//       borderRadius: '4px',
//       cursor: item.isAvailable ? 'pointer' : 'not-allowed',
//       fontSize: '14px',
//     },
//   };
//   const imageUrl = getImageUrl(item.image);

//   return (
//     <div style={styles.menuItem} ref={itemRef}>
//       <div style={styles.imageContainer}>
//         {!imageLoaded && <FoodLoader />}
//         <img
//           src={imageUrl}
//           alt={item.name}
//           style={styles.image}
//           onLoad={handleImageLoad}
//           onError={handleImageError}
//         />
//       </div>
//       <div style={styles.content}>
//         <h3 style={styles.title}>
//           {getFoodTypeIcon(item.foodType)} {item.name}
//         </h3>
//         <p style={styles.description}>{item.description}</p>
//         <div style={styles.footer}>
//           <span style={styles.price}>₹{item.price}</span>
//           {quantity > 0 ? (
//             <div style={styles.quantityControls}>
//               <button onClick={handleDecreaseQuantity} style={styles.quantityBtn}>-</button>
//               <span style={styles.quantityDisplay}>{quantity}</span>
//               <button onClick={handleIncreaseQuantity} style={styles.quantityBtn}>+</button>
//             </div>
//           ) : (
//             <Tooltip title={item.isAvailable ? '' : 'This item is currently unavailable'}>
//               <button
//                 onClick={item.isAvailable ? handleAddToCart : undefined}
//                 style={styles.addToCartBtn}
//                 disabled={!item.isAvailable}
//               >
//                 Add to Cart
//               </button>
//             </Tooltip>
//           )}
//         </div>
//       </div>
//       {showAnimation && (
//         <FlyingItemAnimation
//           itemImage={imageUrl} // Use the processed imageUrl here as well
//           startPosition={animationStartPosition}
//           endPosition={getCartIconPosition()}
//           onAnimationComplete={handleAnimationComplete}
//         />
//       )}
//     </div>
//   );
// }

// export default MenuItem;





import React, { useState, useEffect, useRef } from 'react';
import { Button, Tooltip } from 'antd';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { useCart } from '../contexts/CartContext';
import { useCartIcon } from '../contexts/CartIconContext';
import FlyingItemAnimation from './FlyingItemAnimation';
import FoodLoader from './FoodLoader';

const MenuItem = ({ item, onItemAdded }) => {
  const { cart, addToCart, updateQuantity, removeFromCart } = useCart();
  const cartIconRef = useCartIcon();
  const [quantity, setQuantity] = useState(0);
  const [showAnimation, setShowAnimation] = useState(false);
  const [animationStartPosition, setAnimationStartPosition] = useState({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const itemRef = useRef(null);

  const styles = {
    card: {
      display: 'flex',
      background: '#fff',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      overflow: 'hidden',
      height: '180px',
      marginBottom: '16px',
      border: '1px solid #f0f0f0'
    },
    contentSection: {
      flex: 1,
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    },
    imageSection: {
      position: 'relative',
      width: '180px',
      height: '180px'
    },
    image: {
      width: '100%',
      height: '100%',
      borderRadius: '25px',
      padding: '10px',
      objectFit: 'cover',
      transition: 'opacity 0.3s ease-in-out',
      opacity: imageLoaded ? 1 : 0
    },
    header: {
      marginBottom: '8px'
    },
    titleWrapper: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '8px'
    },
    foodTypeIcon: {
      width: '24px',
      marginRight: '8px'
    },
    title: {
      fontSize: '16px',
      fontWeight: 'bold',
      margin: 0
    },
    description: {
      fontSize: '14px',
      color: '#666',
      margin: '0 0 8px 0',
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    },
    price: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: 'red'
    },
    quantityControls: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    quantityDisplay: {
      width: '32px',
      textAlign: 'center',
      fontSize: '16px'
    },
    addToCartButton: {
      position: 'absolute',
      bottom: 18,
      left: 50,
      right: 0,
      borderRadius: '8px',
      padding: '8px', 
      border: 'none',
      background: 'red',
      color: 'white',
      cursor: 'pointer',
      transition: 'background 0.3s',
      width: '50%',
      fontSize: '16px',
      fontWeight: 'bold',
    },
    disabledAddToCartButton: {
      background: '#d9d9d9',
      cursor: 'not-allowed'
    },
    loaderContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f5f5f5'
    }
  };

  const getFoodTypeIcon = (type) => {
    switch (type) {
      case 'veg':
        return <img src="https://img.icons8.com/?size=100&id=61083&format=png&color=000000" alt="Veg" style={styles.foodTypeIcon} />;
      case 'nonveg':
        return <img src="https://img.icons8.com/?size=100&id=61082&format=png&color=000000" alt="Non-Veg" style={styles.foodTypeIcon} />;
      default:
        return null;
    }
  };

  const getImageUrl = (imageData) => {
    if (!imageData) return '';
    if (typeof imageData === 'string') return imageData;
    if (imageData.file?.url) return imageData.file.url;
    return '';
  };

  useEffect(() => {
    const cartItem = cart.find((cartItem) => cartItem.id === item.id);
    setQuantity(cartItem?.quantity || 0);
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

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      updateQuantity(item.id, quantity - 1);
      setQuantity(quantity - 1);
    } else if (quantity === 1) {
      removeFromCart(item.id);
      setQuantity(0);
    }
  };

  const handleAnimationComplete = () => {
    setShowAnimation(false);
  };

  const getCartIconPosition = () => {
    if (cartIconRef?.current) {
      const rect = cartIconRef.current.getBoundingClientRect();
      return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    }
    return { x: window.innerWidth - 60, y: 40 };
  };

  const imageUrl = getImageUrl(item.image);

  return (
    <div style={styles.card} ref={itemRef}>
      <div style={styles.contentSection}>
        <div>
          <div style={styles.titleWrapper}>
            <h1>{getFoodTypeIcon(item.foodType)}</h1>
            <h3 style={styles.title}>{item.name}</h3>
          </div>
          <p style={styles.description}>{item.description}</p>
          <div style={styles.price}>₹{item.price}</div>
        </div>
        
        {quantity > 0 && (
          <div style={styles.quantityControls}>
            <Button 
              type="primary"
              shape="circle"
              icon={<MinusOutlined />}
              onClick={handleDecreaseQuantity}
              size="middle"
              danger
            />
            <span style={styles.quantityDisplay}>{quantity}</span>
            <Button
              type="primary" 
              shape="circle"
              icon={<PlusOutlined />}
              onClick={handleAddToCart}
              size="middle"
              danger
            />
          </div>
        )}
      </div>

      <div style={styles.imageSection}>
        {!imageLoaded && (
          <div style={styles.loaderContainer}>
            <FoodLoader />
          </div>
        )}
        <img
          src={imageUrl}
          alt={item.name}
          style={styles.image}
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            console.error('Error loading image:', e);
            e.target.src = '/path-to-your-fallback-image.jpg';
          }}
        />
        
        {quantity === 0 && (
          <Tooltip title={item.isAvailable ? '' : 'This item is currently unavailable'}>
            <button
              onClick={item.isAvailable ? handleAddToCart : undefined}
              disabled={!item.isAvailable}
              style={{
                ...styles.addToCartButton,
                ...(item.isAvailable ? {} : styles.disabledAddToCartButton)
              }}
            >
              ADD
            </button>
          </Tooltip>
        )}
      </div>

      {showAnimation && (
        <FlyingItemAnimation
          itemImage={imageUrl}
          startPosition={animationStartPosition}
          endPosition={getCartIconPosition()}
          onAnimationComplete={handleAnimationComplete}
        />
      )}
    </div>
  );
};

export default MenuItem;