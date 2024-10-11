import React, { useState, useEffect } from 'react';
import { Card, Typography, List, Tag, Space, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ClockCircleOutlined, SyncOutlined, CheckOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const orgId = localStorage.getItem('orgId');
        const tableNumber = localStorage.getItem('tableNumber');
    
        if (!orgId || !tableNumber) {
          throw new Error('Organization ID or Table Number not found in localStorage');
        }
    
        // Fetch all orders from Firebase
        const response = await fetch(`https://db-for-smart-serve-menu-default-rtdb.firebaseio.com/history.json?orgId=${orgId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }
    
        const data = await response.json();
    
        // Convert the fetched data into an array
        const ordersArray = Object.values(data || {});
    
        // Filter orders where status is not 'completed' and the tableNumber matches
        const filteredOrders = ordersArray.filter(order => 
          order.orgId === orgId && 
          order.tableNumber === tableNumber && 
          order.status !== 'completed'
        );
    
        setOrders(filteredOrders);
      } catch (error) {
        console.error('Failed to fetch orders', error);
        message.error('Failed to load orders. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    

    fetchOrders();
  }, []);

  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending': return <ClockCircleOutlined style={{ color: '#faad14' }} />;
      case 'preparing': return <SyncOutlined spin style={{ color: '#1890ff' }} />;
      case 'ready': return <CheckOutlined style={{ color: '#52c41a' }} />;
      case 'delayed': return <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />;
      case 'completed': return <CheckOutlined style={{ color: '#52c41a' }} />;
      default: return null;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'warning';
      case 'preparing': return 'processing';
      case 'ready': return 'success';
      case 'delayed': return 'error';
      case 'completed': return 'success';
      default: return 'default';
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2} style={{ marginBottom: '16px' }}>My Orders</Title>
      <List
        loading={loading}
        dataSource={orders}
        locale={{ emptyText: 'No active orders found for your table' }}
        renderItem={(order) => (
          <List.Item>
            <Card style={{ width: '100%' }}>
              <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                <Space>
                  <Title level={4}>Order #{order.id}</Title>
                  <Tag color={getStatusColor(order.status)} icon={getStatusIcon(order.status)}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Tag>
                </Space>
                <Text>{order.statusMessage}</Text>
                <Text>Table Number: {order.tableNumber}</Text>
                <Button 
                  onClick={() => navigate(`/waiting/${order.id}`)}
                  type="primary"
                  style={{ backgroundColor: '#ff4d4f', borderColor: '#ff4d4f' }}
                >
                  View Details
                </Button>
              </Space>
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};

export default MyOrders;