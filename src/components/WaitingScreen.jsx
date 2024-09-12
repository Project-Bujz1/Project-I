import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Typography, Spin, message, notification, Button, Modal, Input, Rate, Switch, Progress, Tooltip } from 'antd';
import { CheckOutlined, ClockCircleOutlined, SyncOutlined, ExclamationCircleOutlined, BellOutlined, CloseOutlined, CoffeeOutlined, SoundOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useCart } from '../contexts/CartContext'; 
import { IoVolumeMuteOutline } from "react-icons/io5";

import notificationSound from './notification.mp3';

const { Title, Text } = Typography;
const { TextArea } = Input;

const WaitingScreen = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const ws = useRef(null);
  const audioRef = useRef(new Audio(notificationSound));

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orgId = localStorage.getItem('orgId'); // Get the orgId from localStorage
        const response = await fetch(`https://smartserver-json-server.onrender.com/history?id=${orderId}&orgId=${orgId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch order');
        }
        const data = await response.json();
        if (data.length === 0) {
          throw new Error('Order not found');
        }
        setOrder(data[0]);
      } catch (error) {
        console.error('Failed to fetch order', error);
        message.error('Failed to fetch order');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();

    // Set up WebSocket connection
    ws.current = new WebSocket('wss://legend-sulfuric-ruby.glitch.me');

    ws.current.onopen = () => {
      console.log('WebSocket connected');
      const orgId = localStorage.getItem('orgId');
      ws.current.send(JSON.stringify({ type: 'subscribe', orgId: orgId }));
    };

    ws.current.onmessage = (event) => {
      console.log('Received message:', event.data);
      const data = JSON.parse(event.data);
      if (data.type === 'statusUpdate' && data.orderId == orderId && data.orgId === localStorage.getItem('orgId')) {
        const newStatus = data.status;
        const newStatusMessage = data.statusMessage;
        setOrder(prevOrder => ({ ...prevOrder, status: newStatus, statusMessage: newStatusMessage }));
        
        if (soundEnabled) {
          audioRef.current.play().catch(error => console.error('Error playing audio:', error));
        }

        notification.open({
          message: 'Order Status Updated',
          description: `Your order status has been updated to: ${newStatus}`,
          icon: <BellOutlined style={{ color: '#1890ff' }} />,
          duration: 4.5,
        });
      }
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [orderId, soundEnabled]);

  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending': return <ClockCircleOutlined style={{ fontSize: '48px', color: '#faad14' }} />;
      case 'preparing': return <SyncOutlined spin style={{ fontSize: '48px', color: '#1890ff' }} />;
      case 'ready': return <CheckOutlined style={{ fontSize: '48px', color: '#52c41a' }} />;
      case 'delayed': return <ExclamationCircleOutlined style={{ fontSize: '48px', color: '#ff4d4f' }} />;
      default: return null;
    }
  };

  const getStatusProgress = (status) => {
    switch (status) {
      case 'pending': return 25;
      case 'preparing': return 50;
      case 'ready': return 100;
      case 'delayed': return 75;
      default: return 0;
    }
  };

  const handleCancelOrder = async () => {
    try {
      const orgId = localStorage.getItem('orgId');
      const response = await fetch(`https://smartserver-json-server.onrender.com/history/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: 'cancelled',
          statusMessage: 'Your order has been cancelled'
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to cancel the order');
      }
      
      // Update local state
      setOrder(prevOrder => ({ ...prevOrder, status: 'cancelled', statusMessage: 'Your order has been cancelled' }));

      // Send WebSocket message to notify admin
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        const message = JSON.stringify({
          type: 'statusUpdate',
          orderId: orderId,
          orgId: orgId,
          status: 'cancelled',
          statusMessage: 'Order has been cancelled by the customer'
        });
        ws.current.send(message);
      }

      message.success('Order has been cancelled successfully');
      clearCart(); // Clear the cart when order is completed
      // navigate(`/order-confirmation/${orderId}`);
    } catch (error) {
      console.error('Failed to cancel the order', error);
      message.error('Failed to cancel the order. Please try again.');
    }
  };

  const handleCompleteOrder = () => {
    clearCart(); // Clear the cart when order is completed
    setIsModalVisible(true);
  };

  const handleSubmitFeedback = async () => {
    const feedbackDetails = {
      orderId: orderId,
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
      message.success('Thank you for your feedback!');
      setIsModalVisible(false);
      // navigate(`/order-confirmation/${orderId}`);
      navigate('/home');

    } catch (error) {
      console.error('Failed to save feedback', error);
      message.error('Failed to submit feedback. Please try again.');
    }
  };

  if (loading) {
    return <Spin size="large" />;
  }

  if (!order) {
    return <Title level={3}>Order not found</Title>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '20px', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center' }}>
        <Switch
          checkedChildren={<SoundOutlined />}
          unCheckedChildren={<IoVolumeMuteOutline  />}
          checked={soundEnabled}
          onChange={setSoundEnabled}
          style={{ backgroundColor: '#ff4d4f', borderColor: '#ff4d4f' }}
        />
        <Text style={{ marginLeft: '8px', color: '#ff4d4f' }}>Sound Notifications</Text>
      </div>
      <Card
        style={{
          width: '100%',
          maxWidth: '400px',
          textAlign: 'center',
          borderRadius: '16px',
          border: '1px solid #e9ecef',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          padding: '20px',
          background: '#fff',
          transition: 'transform 0.3s ease',
          ':hover': {
            transform: 'translateY(-5px)',
          }
        }}
      >
        <Title level={3} style={{ color: '#343a40' }}>Order #{orderId}</Title>
        <Progress
          type="circle"
          percent={getStatusProgress(order.status)}
          format={() => getStatusIcon(order.status)}
          width={80}
          strokeColor={{
            '0%': '#108ee9',
            '100%': '#87d068',
          }}
        />
        <Title level={4} style={{ marginTop: '16px', color: '#343a40' }}>{order.statusMessage}</Title>
        <Text type="secondary" style={{ color: '#6c757d' }}>We'll notify you when your order status changes</Text>
        <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
    <Tooltip title="Cancel your order" placement="bottom">
      <Button
        icon={<CloseOutlined />}
        onClick={handleCancelOrder}
        type="default"
        disabled={order.status !== 'pending' && order.status !== 'preparing'}
        style={{ backgroundColor: '#f8f9fa', color: '#ff4d4f', borderColor: '#e9ecef', fontWeight: 'bold' }}
      >
        Cancel
      </Button>
    </Tooltip>
 <Tooltip title="Complete your order" placement="bottom">
 <Button
   icon={<CheckOutlined />}
   onClick={handleCompleteOrder}
   type="primary"
   disabled={order.status !== 'ready'}
   style={{ backgroundColor: '#ff4d4f', borderColor: '#ff4d4f', fontWeight: 'bold' }}
 >
   Complete
 </Button>
</Tooltip>
</div>
</Card>
<Modal
title="Thank You!"
visible={isModalVisible}
onOk={handleSubmitFeedback}
onCancel={() => setIsModalVisible(false)}
okText="Submit Feedback"
cancelText="Later"
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
};

export default WaitingScreen;