// import React from 'react';
// import { Emoji } from 'react-apple-emojis';
// import { Card, Typography, Space } from 'antd';
// import './WelcomeSection.css'; // Import custom styles

// const { Title, Text } = Typography;

// const getImageUrl = (imageData) => {
//     if (!imageData) return '';
//     if (typeof imageData === 'string') return imageData;
//     if (imageData.file?.url) return imageData.file.url;
//     return '';
//   };

//   const WelcomeSection = ({ menuItems, title, caption, emojis }) => {
//     return (
//     <div className="welcome-section">
//       <div className="welcome-header">
//       <Text style={{ fontSize: 30 }}>{emojis}</Text>
//         <h1 className="welcome-title">{title}😊</h1>
//       </div>
//       <Text className="welcome-subtitle">
//         {caption}
//       </Text>
//       <div className="menu-items">
//         {menuItems.slice(0, 10).map((item) => (
//           <Card
//             key={item.id}
//             hoverable
//             className="menu-card"
//             cover={
//               <img
//                 src={getImageUrl(item.image)}
//                 alt={item.name}
//                 className="menu-card-image"
//               />
//             }
//           >
//             {/* <Space direction="vertical" size={0}>
//               <Title level={5} className="menu-card-title">{item.name}</Title>
//               <Text type="secondary" className="menu-card-price">₹{item.price}</Text>
//             </Space> */}
//           </Card>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default WelcomeSection;
import React from 'react';
import { Typography } from 'antd';
import './WelcomeSection.css';
import { useCart } from '../contexts/CartContext';

const { Text } = Typography;

const WelcomeSection = ({ menuItems, title, caption, emojis }) => {
  const { addToCart } = useCart();

  const getImageUrl = (imageData) => {
    if (!imageData) return '';
    if (typeof imageData === 'string') return imageData;
    if (imageData.file?.url) return imageData.file.url;
    return '';
  };

  const handleAddToCart = (item, event) => {
    event.stopPropagation();
    addToCart(item);
  };

  return (
    <div className="welcome-section">
      <div className="welcome-header">
        <Text style={{ fontSize: 30 }}>{emojis}</Text>
        <h1 className="welcome-title">{title}😊</h1>
      </div>
      <Text className="welcome-subtitle">
        {caption}
      </Text>
      <div className="menu-scroll-container">
        <div className="menu-items">
          {menuItems.slice(0, 10).map((item) => (
            <div key={item.id} className="menu-card">
              <div className="menu-card-image-container">
                <img
                  src={getImageUrl(item.image)}
                  alt={item.name}
                  className="menu-card-image"
                />
                <button 
                  className="add-to-cart-button"
                  onClick={(e) => handleAddToCart(item, e)}
                >
                  ADD
                </button>
                <div className="menu-card-content">
                  <h3 className="menu-card-title">{item.name}</h3>
                  <p className="menu-card-price">₹{item.price}</p>
                </div>
                {item.isVeg && (
                  <div className="veg-badge">
                    <span className="veg-icon"></span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WelcomeSection;