import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Typography, Spin, message } from 'antd';
import { CheckOutlined, ClockCircleOutlined, SyncOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const WaitingScreen = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const ws = useRef(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`https://smartserver-json-server.onrender.com/history/${orderId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch order');
        }
        const data = await response.json();
        setOrder(data);
      } catch (error) {
        console.error('Failed to fetch order', error);
        message.error('Failed to fetch order');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();

    // Set up WebSocket connection
    ws.current = new WebSocket('ws://localhost:3001');

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'statusUpdate' && data.orderId === orderId) {
        setOrder(prevOrder => ({ ...prevOrder, status: data.status }));
      }
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [orderId]);

  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending': return <ClockCircleOutlined style={{ fontSize: '48px', color: '#faad14' }} />;
      case 'preparing': return <SyncOutlined spin style={{ fontSize: '48px', color: '#1890ff' }} />;
      case 'ready': return <CheckOutlined style={{ fontSize: '48px', color: '#52c41a' }} />;
      case 'delayed': return <ExclamationCircleOutlined style={{ fontSize: '48px', color: '#ff4d4f' }} />;
      default: return null;
    }
  };

  if (loading) {
    return <Spin size="large" />;
  }

  if (!order) {
    return <Title level={3}>Order not found</Title>;
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#fff5f5' }}>
      <Card style={{ width: 300, textAlign: 'center', borderRadius: '8px' }}>
        <Title level={3}>Order #{orderId}</Title>
        {getStatusIcon(order.status)}
        <Title level={4} style={{ marginTop: '16px' }}>{order.statusMessage || 'Processing your order'}</Title>
        <Text type="secondary">We'll notify you when your order status changes</Text>
      </Card>
    </div>
  );
};

export default WaitingScreen;