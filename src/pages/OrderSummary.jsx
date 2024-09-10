import React, { useState, useRef } from 'react';
import { useCart } from '../contexts/CartContext';
import { Modal, Button, Input, Rate } from 'antd';
import { useNavigate } from 'react-router-dom';
import { CheckCircleOutlined, CoffeeOutlined } from '@ant-design/icons';
import FoodLoader from '../components/FoodLoader';

function OrderSummary() {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [tableNumber, setTableNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(0);
  const ws = useRef(null);

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
      const response = await fetch('https://smartserver-json-server.onrender.com/history', {
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
      // clearCart();

      // Send new order notification through WebSocket
      ws.current = new WebSocket('wss://legend-sulfuric-ruby.glitch.me');
      ws.current.onopen = () => {
        ws.current.send(JSON.stringify({ type: 'newOrder', order: savedOrder }));
      };

      // Redirect to WaitingScreen
      navigate(`/waiting/${savedOrder.id}`);
    } catch (error) {
      console.error('Failed to save order', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitFeedback = async () => {
    const feedbackDetails = {
      orderId: Date.now(),
      feedback,
      rating,
    };

    try {
      const response = await fetch('https://smartserver-json-server.onrender.com/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedbackDetails),
      });
      if (!response.ok) {
        throw new Error('Failed to save feedback');
      }
      alert('Thank you for your feedback!');
      setIsModalVisible(false);
      navigate('/home');
    } catch (error) {
      console.error('Failed to save feedback', error);
      alert('Failed to submit feedback. Please try again.');
    }
  };

  if (loading) {
    return <FoodLoader />;
  }

  return (
    <div className="order-summary-container" style={{ marginTop: '95px' }}>
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
        Confirm Order
      </button>
      <Modal
        title="Thank You!"
        visible={isModalVisible}
        footer={[
          <Button key="submit" type="primary" onClick={handleSubmitFeedback} style={{ backgroundColor: '#ff4d4f', borderColor: '#ff4d4f' }}>
            Submit Feedback
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
        <p>We hope you enjoyed your meal. Please provide your feedback below:</p>
        <Input.TextArea
          placeholder="Leave your feedback here..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          rows={4}
          style={{ marginBottom: '10px' }}
        />
        <Rate
          allowHalf
          value={rating}
          onChange={(value) => setRating(value)}
          style={{ marginBottom: '10px' }}
        />
      </Modal>
    </div>
  );
}

export default OrderSummary;