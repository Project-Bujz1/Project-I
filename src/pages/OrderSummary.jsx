import React, { useState, useRef, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import { Modal, Button, Input, Rate, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { CheckCircleOutlined, CoffeeOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import FoodLoader from '../components/FoodLoader';

function OrderSummary() {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [tableNumber, setTableNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(0);
  const [seatingCapacity, setSeatingCapacity] = useState(0);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const ws = useRef(null);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  useEffect(() => {
    const fetchSeatingCapacity = async () => {
      try {
        const orgId = localStorage.getItem('orgId');
        if (!orgId) {
          console.error('No orgId found in localStorage');
          return;
        }
    
        const response = await fetch('https://db-for-smart-serve-menu-default-rtdb.firebaseio.com/restaurants.json'); // Add .json
        if (!response.ok) {
          throw new Error('Failed to fetch restaurant data');
        }
    
        const restaurants = await response.json();
    
        // Convert Firebase data object into an array
        const restaurantsArray = Object.values(restaurants);
        const restaurant = restaurantsArray.find(r => r.orgId === orgId);
    
        if (restaurant) {
          setSeatingCapacity(parseInt(restaurant.seatingCapacity, 10)); // Parse seating capacity as integer
        } else {
          console.error('No restaurant found for the given orgId');
        }
      } catch (error) {
        console.error('Error fetching restaurant data:', error);
      }
    };
    

    // Check if a tableNumber is already in localStorage
    const savedTableNumber = localStorage.getItem('tableNumber');
    if (savedTableNumber) {
      setTableNumber(savedTableNumber); // Set the table number from localStorage
    }

    fetchSeatingCapacity();
  }, []);

  const handleTableNumberChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setTableNumber(value);
      localStorage.setItem('tableNumber', value); // Save to localStorage
    }
  };

  const handlePayClick = async () => {
    if (!tableNumber) {
      showErrorModal('Please enter your table number');
      return;
    }
  
    const tableNum = parseInt(tableNumber);
    if (isNaN(tableNum) || tableNum < 1 || tableNum > seatingCapacity) {
      showErrorModal(`Please enter a valid table number between 1 and ${seatingCapacity}`);
      return;
    }
  
    setLoading(true);
  
    const orgId = localStorage.getItem('orgId'); // Get the orgId from localStorage
  
    const orderDetails = {
      id: Date.now(), // Use timestamp as order ID
      orgId: orgId,   // Include orgId
      items: cart,
      total: total.toFixed(2),
      tableNumber,
      timestamp: new Date().toISOString(),
      status: 'pending',
      statusMessage: 'Your order is being processed',
    };
  
    try {
      // Firebase requires the .json extension in the URL
      const response = await fetch('https://db-for-smart-serve-menu-default-rtdb.firebaseio.com/history.json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderDetails),
      });
  
      if (!response.ok) {
        throw new Error('Failed to save order');
      }
  
      const savedOrder = await response.json(); // Firebase returns the order ID as part of the response
  
      // Initialize WebSocket connection to notify about the new order
      ws.current = new WebSocket('wss://legend-sulfuric-ruby.glitch.me');
      ws.current.onopen = () => {
        ws.current.send(JSON.stringify({ type: 'newOrder', order: { ...orderDetails, id: savedOrder.name } }));
      };
  
      navigate(`/waiting/${savedOrder.name}`); // Use Firebase's generated order ID
    } catch (error) {
      console.error('Failed to save order', error);
      showErrorModal('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  

  const showErrorModal = (message) => {
    setErrorMessage(message);
    setErrorModalVisible(true);
  };

  const handleSubmitFeedback = async () => {
    // ... (feedback submission logic remains unchanged)
  };

  if (loading) {
    return <FoodLoader />;
  }

  return (
    <div className="order-summary-container" style={{ marginTop: '115px' }}>
      <h2 className="order-summary-title">Confirm Order</h2>
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
        placeholder={`Enter Table Number (1-${seatingCapacity})`}
        value={tableNumber}
        onChange={handleTableNumberChange}
        style={{ marginBottom: '10px' }}
      />

      <button className="pay-button" onClick={handlePayClick}>
        Confirm Order
      </button>

      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', color: '#ff4d4f' }}>
            <ExclamationCircleOutlined style={{ marginRight: '8px' }} />
            Error
          </div>
        }
        visible={errorModalVisible}
        onOk={() => setErrorModalVisible(false)}
        onCancel={() => setErrorModalVisible(false)}
        footer={[
          <Button key="ok" type="primary" onClick={() => setErrorModalVisible(false)} style={{ backgroundColor: '#ff4d4f', borderColor: '#ff4d4f' }}>
            OK
          </Button>,
        ]}
        centered
        bodyStyle={{ backgroundColor: '#fff5f5', color: '#ff4d4f', textAlign: 'center' }}
      >
        <p style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '16px' }}>{errorMessage}</p>
      </Modal>

      {/* Feedback Modal remains unchanged */}
    </div>
  );
}

export default OrderSummary;