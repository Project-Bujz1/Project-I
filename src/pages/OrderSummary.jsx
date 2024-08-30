// import React from 'react';
// import { useCart } from '../contexts/CartContext';


// function OrderSummary() {
//   const { cart, clearCart } = useCart();

//   const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
//   const handlePayClick = () => {
//     // Perform any additional actions if needed
//     clearCart(); // Clear the cart after payment
//   };
//   return (
//     <div className="order-summary-container" style={{marginTop: "75px"}}>
//       <h2 className="order-summary-title">Order Summary</h2>
//       {cart.map((item) => (
//         <div key={item.id} className="order-item">
//           <span className="item-name">{item.name} x {item.quantity}</span>
//           <span className="item-price">₹{(item.price * item.quantity).toFixed(2)}</span>
//         </div>
//       ))}
//       <div className="order-summary-total">
//         <div className="total-line">
//           <span>Total</span>
//           <span>₹{total.toFixed(2)}</span>
//         </div>
//       </div>
//       <button className="pay-button" onClick={handlePayClick}>Pay at Counter</button>
//     </div>
//   );
// }

// export default OrderSummary;
import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { Modal, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { CheckCircleOutlined, CoffeeOutlined } from '@ant-design/icons';

function OrderSummary() {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePayClick = () => {
    clearCart(); // Clear the cart
    setIsModalVisible(true); // Show the modal
  };

  const handleOk = () => {
    setIsModalVisible(false);
    navigate('/'); // Redirect to the root
  };

  return (
    <div className="order-summary-container" style={{marginTop: "75px"}}>
      <h2 className="order-summary-title">Order Summary</h2>
      {cart.map((item) => (
        <div key={item.id} className="order-item">
          <span className="item-name">{item.name} x {item.quantity}</span>
          <span className="item-price">₹{(item.price * item.quantity).toFixed(2)}</span>
        </div>
      ))}
      <div className="order-summary-total">
        <div className="total-line">
          <span>Total</span>
          <span>₹{total.toFixed(2)}</span>
        </div>
      </div>
      <button className="pay-button" onClick={handlePayClick} >Pay at Counter</button>
      <Modal
        title="Thank You!"
        visible={isModalVisible}
        footer={[
          <Button key="ok" type="primary" onClick={handleOk} style={{ backgroundColor: '#ff4d4f', borderColor: '#ff4d4f' }}>
            OK
          </Button>
        ]}
        centered
        style={{ top: 20 }}
        bodyStyle={{ backgroundColor: '#fff5f5', color: '#ff4d4f', textAlign: 'center' }}
      >
        <div style={{ fontSize: '24px', marginBottom: '16px' }}>
          <CheckCircleOutlined style={{ color: '#ff4d4f', marginRight: '8px' }} />
          <CoffeeOutlined style={{ color: '#ff4d4f', marginRight: '8px' }} />
        </div>
        <p style={{ fontSize: '18px', fontWeight: 'bold' }}>Thank you for dining with us!</p>
        <p>We hope you enjoyed your meal. See you next time!</p>
      </Modal>
    </div>
  );
}

export default OrderSummary;
