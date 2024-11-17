import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import FoodLoader from './FoodLoader';

function OrderConfirmation() {
  const [orderStatus, setOrderStatus] = useState('Pending');
  const [statusMessage, setStatusMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const { orderId } = useParams();

  useEffect(() => {
    const fetchOrderStatus = async () => {
      try {
        const response = await fetch(`https://smart-server-menu-database-default-rtdb.firebaseio.com/history/${orderId}.json`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch order status');
        }
    
        const order = await response.json();
    
        // Set the order status and status message, with fallback values
        setOrderStatus(order?.status || 'Pending');
        setStatusMessage(order?.statusMessage || '');
      } catch (error) {
        console.error('Failed to fetch order status', error);
      } finally {
        setLoading(false);
      }
    };
    

    fetchOrderStatus();

    const interval = setInterval(fetchOrderStatus, 5000); // Fetch status every 5 seconds
    return () => clearInterval(interval); // Clean up the interval on component unmount
  }, [orderId]);

  if (loading) {
    return <div style={{marginTop : '150px'}}><FoodLoader />;</div> 
  }

  return (
    <div className="order-confirmation-container">
      <h2>Order Status: {orderStatus}</h2>
      <p>{statusMessage}</p>
      <div style={{marginTop : '150px'}}><FoodLoader />;</div> 
      <div className="btn-container">
        <Link to="/home" className="order-button">
          Order More Items
        </Link>
        <Link to="/order-summary" className="order-button">
          View Order Summary
        </Link>
      </div>
    </div>
  );
}

export default OrderConfirmation;