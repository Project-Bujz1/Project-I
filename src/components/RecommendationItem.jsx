import React, { useState } from 'react';
import { Button, Spin } from 'antd';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';

const styles = {
  card: {
    display: 'flex',
    background: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    overflow: 'hidden',
    height: '140px',
    border: '1px solid #f0f0f0',
    minWidth: '300px',
    marginRight: '16px'
  },
  contentSection: {
    flex: 1,
    padding: '12px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  imageSection: {
    position: 'relative',
    width: '140px',
    height: '140px'
  },
  image: {
    width: '100%',
    height: '100%',
    padding: '8px',
    objectFit: 'cover',
    transition: 'opacity 0.3s ease-in-out'
  },
  titleWrapper: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '8px'
  },
  foodTypeIcon: {
    width: '20px',
    marginRight: '8px'
  },
  title: {
    fontSize: '14px',
    fontWeight: 'bold',
    margin: 0
  },
  description: {
    fontSize: '12px',
    color: '#666',
    margin: '0 0 8px 0',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  price: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#ff4d4f'
  },
  quantityControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  quantityDisplay: {
    width: '32px',
    textAlign: 'center',
    fontSize: '14px'
  }
};


const RecommendationItem = ({ item, onAddToCart, collapsed }) => {
    const [quantity, setQuantity] = useState(0);
    const [imageLoaded, setImageLoaded] = useState(false);
  
    const handleAddToCart = () => {
      setQuantity(quantity + 1);
      onAddToCart(item);
    };
    const getImageUrl = (imageData) => {
      if (!imageData) return '';
      if (typeof imageData === 'string') return imageData;
      if (imageData.file?.url) return imageData.file.url;
      return '';
    };
    const handleDecreaseQuantity = () => {
      if (quantity > 0) {
        setQuantity(quantity - 1);
      }
    };
    const getFoodTypeIcon = (type) => {
        switch (type) {
          case 'veg':
            return "https://img.icons8.com/?size=100&id=61083&format=png&color=000000";
          case 'nonveg':
            return "https://img.icons8.com/?size=100&id=61082&format=png&color=000000";
          default:
            return null;
        }
      };
    if (collapsed) {
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '140px' }}>
          <img
            src={getImageUrl(item.image)}
            alt={item.name}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              objectFit: 'cover',
            }}
          />
          <span style={{
            fontSize: '14px',
            fontWeight: 'bold',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '80px'
          }}>
            {item.name}
          </span>
        </div>
      );
    }
  
    return (
      <div style={styles.card}>
        <div style={styles.contentSection}>
          <div>
            <div style={styles.titleWrapper}>
              <img 
                src={getFoodTypeIcon(item.foodType)} 
                alt={item.foodType} 
                style={styles.foodTypeIcon}
              />
              <h3 style={styles.title}>{item.name}</h3>
            </div>
            {/* <p style={styles.description}>{item.description}</p> */}
            <div style={styles.price}>₹{item.price}</div>
          </div>
          
          {quantity === 0 ? (
            <Button
              type="primary"
              danger
              size="small"
              onClick={handleAddToCart}
              style={{ width: '80px' }}
            >
              ADD
            </Button>
          ) : (
            <div style={styles.quantityControls}>
              <Button 
                type="primary"
                shape="circle"
                icon={<MinusOutlined />}
                onClick={handleDecreaseQuantity}
                size="small"
                danger
              />
              <span style={styles.quantityDisplay}>{quantity}</span>
              <Button
                type="primary"
                shape="circle"
                icon={<PlusOutlined />}
                onClick={handleAddToCart}
                size="small"
                danger
              />
            </div>
          )}
        </div>
        <div style={styles.imageSection}>
          {!imageLoaded && (
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)'
            }}>
              <Spin />
            </div>
          )}
          <img
            src={getImageUrl(item.image)}
            alt={item.name}
            style={{ ...styles.image, opacity: imageLoaded ? 1 : 0 }}
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              console.error('Error loading image:', e);
              e.target.src = '/path-to-your-fallback-image.jpg';
            }}
          />
        </div>
      </div>
    );
  };
  
  export default RecommendationItem;
  