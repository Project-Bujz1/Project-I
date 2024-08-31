// import React, { useState } from 'react';
// import { useCart } from '../contexts/CartContext';
// import { Modal, Button, Input } from 'antd';
// import { useNavigate } from 'react-router-dom';
// import { CheckCircleOutlined, CoffeeOutlined } from '@ant-design/icons';

// function OrderSummary() {
//   const { cart, clearCart } = useCart();
//   const navigate = useNavigate();
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [tableNumber, setTableNumber] = useState('');

//   const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

//   const handlePayClick = async () => {
//     if (!tableNumber) {
//       alert('Please enter your table number');
//       return;
//     }

//     const orderDetails = {
//       id: Date.now(), // unique ID based on timestamp
//       items: cart,
//       total: total.toFixed(2),
//       tableNumber,
//       timestamp: new Date().toISOString(),
//     };

//     try {
//       await fetch('http://localhost:3001/history', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(orderDetails),
//       });
//       clearCart(); // Clear the cart
//       setIsModalVisible(true); // Show the modal
//     } catch (error) {
//       console.error('Failed to save order', error);
//     }
//   };

//   const handleOk = () => {
//     setIsModalVisible(false);
//     navigate('/'); // Redirect to the root
//   };

//   return (
//     <div className="order-summary-container" style={{ marginTop: '75px' }}>
//       <h2 className="order-summary-title">Order Summary</h2>
//       {cart.map((item) => (
//         <div key={item.id} className="order-item">
//           <span className="item-name">
//             {item.name} x {item.quantity}
//           </span>
//           <span className="item-price">₹{(item.price * item.quantity).toFixed(2)}</span>
//         </div>
//       ))}
//       <div className="order-summary-total">
//         <div className="total-line">
//           <span>Total</span>
//           <span>₹{total.toFixed(2)}</span>
//         </div>
//       </div>
//       <Input
//         placeholder="Enter Table Number"
//         value={tableNumber}
//         onChange={(e) => setTableNumber(e.target.value)}
//         style={{ marginBottom: '10px' }}
//       />
//       <button className="pay-button" onClick={handlePayClick}>
//         Pay at Counter
//       </button>
//       <Modal
//         title="Thank You!"
//         visible={isModalVisible}
//         footer={[
//           <Button key="ok" type="primary" onClick={handleOk} style={{ backgroundColor: '#ff4d4f', borderColor: '#ff4d4f' }}>
//             OK
//           </Button>,
//         ]}
//         centered
//         style={{ top: 20 }}
//         bodyStyle={{ backgroundColor: '#fff5f5', color: '#ff4d4f', textAlign: 'center' }}
//       >
//         <div style={{ fontSize: '24px', marginBottom: '16px' }}>
//           <CheckCircleOutlined style={{ color: '#ff4d4f', marginRight: '8px' }} />
//           <CoffeeOutlined style={{ color: '#ff4d4f', marginRight: '8px' }} />
//         </div>
//         <p style={{ fontSize: '18px', fontWeight: 'bold' }}>Thank you for dining with us!</p>
//         <p>We hope you enjoyed your meal. See you next time!</p>
//       </Modal>
//     </div>
//   );
// }

// export default OrderSummary;

import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { Modal, Button, Input } from 'antd';
import { useNavigate } from 'react-router-dom';
import { CheckCircleOutlined, CoffeeOutlined } from '@ant-design/icons';
import FoodLoader from '../components/FoodLoader';

function OrderSummary() {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [tableNumber, setTableNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePayClick = async () => {
    if (!tableNumber) {
      alert('Please enter your table number');
      return;
    }

    setLoading(true);

    const orderDetails = {
      id: Date.now(),
      items: cart,
      total: total.toFixed(2),
      tableNumber,
      timestamp: new Date().toISOString(),
      status: 'pending',
      statusMessage: 'Your order is being processed'
    };

    try {
      const response = await fetch('http://localhost:3001/history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderDetails),
      });
      if (!response.ok) {
        throw new Error('Failed to save order');
      }
      const savedOrder = await response.json();
      clearCart();
      setIsModalVisible(true);
      navigate(`/order-confirmation/${savedOrder.id}`);
    } catch (error) {
      console.error('Failed to save order', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  if (loading) {
    return <FoodLoader />;
  }

  return (
    <div className="order-summary-container" style={{ marginTop: '75px' }}>
      <h2 className="order-summary-title">Order Summary</h2>
      {cart.map((item) => (
        <div key={item.id} className="order-item">
          <span className="item-name">
            {item.name} x {item.quantity}
          </span>
          <span className="item-price">₹{(item.price * item.quantity).toFixed(2)}</span>
        </div>
      ))}
      <div className="order-summary-total">
        <div className="total-line">
          <span>Total</span>
          <span>₹{total.toFixed(2)}</span>
        </div>
      </div>
      <Input
        placeholder="Enter Table Number"
        value={tableNumber}
        onChange={(e) => setTableNumber(e.target.value)}
        style={{ marginBottom: '10px' }}
      />
      <button className="pay-button" onClick={handlePayClick}>
        Pay at Counter
      </button>
      <Modal
        title="Thank You!"
        visible={isModalVisible}
        footer={[
          <Button key="ok" type="primary" onClick={handleOk} style={{ backgroundColor: '#ff4d4f', borderColor: '#ff4d4f' }}>
            OK
          </Button>,
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