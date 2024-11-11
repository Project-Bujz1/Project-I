import React, { useState, useEffect } from 'react';
import { Card, Typography, List, Tag, Space, Button, message, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import { 
  ClockCircleOutlined, 
  SyncOutlined, 
  CheckOutlined, 
  ExclamationCircleOutlined,
  ShopOutlined 
} from '@ant-design/icons';
import FoodLoader from './FoodLoader';

const { Title, Text } = Typography;

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Main styles object
  const styles = {
    container: {
      padding: '16px',
      maxWidth: '100%',
      background: 'linear-gradient(135deg, #fff5f5 0%, #ffffff 100%)',
      minHeight: '100vh',
      marginTop : "100px"
    },
    header: {
      textAlign: 'center',
      marginBottom: '24px',
      position: 'relative',
      padding: '20px 0',
      borderBottom: '2px solid #ffeded',
    },
    headerTitle: {
      color: '#dc3545',
      fontSize: '28px',
      fontWeight: 'bold',
      margin: 0,
      fontFamily: "'Playfair Display', serif",
    },
    headerIcon: {
      fontSize: '24px',
      color: '#dc3545',
      marginRight: '8px',
    },
    card: {
      borderRadius: '12px',
      marginBottom: '16px',
      border: 'none',
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
      background: '#ffffff',
    },
    orderNumber: {
      color: '#dc3545',
      margin: '0',
      fontSize: '20px',
      fontWeight: '600',
    },
    statusContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '8px',
    },
    statusMessage: {
      color: '#666',
      fontSize: '14px',
      marginTop: '8px',
    },
    tableNumber: {
      background: '#fff5f5',
      padding: '8px 12px',
      borderRadius: '8px',
      color: '#dc3545',
      fontSize: '14px',
      fontWeight: '500',
    },
    viewButton: {
      width: '100%',
      height: '40px',
      backgroundColor: '#dc3545',
      borderColor: '#dc3545',
      borderRadius: '8px',
      fontWeight: '500',
      marginTop: '12px',
      boxShadow: '0 2px 4px rgba(220,53,69,0.2)',
    },
    loadingContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '200px',
      marginTop: '275px'
    },
    emptyState: {
      textAlign: 'center',
      padding: '40px 20px',
      color: '#666',
    },
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const orgId = localStorage.getItem('orgId');
        const tableNumber = localStorage.getItem('tableNumber');
    
        if (!orgId || !tableNumber) {
          throw new Error('Organization ID or Table Number not found in localStorage');
        }
    
        const response = await fetch(`https://smart-server-stage-db-default-rtdb.firebaseio.com/history.json?orgId=${orgId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }
    
        const data = await response.json();
        const ordersArray = Object.values(data || {});
        const filteredOrders = ordersArray.filter(order => 
          order.orgId === orgId && 
          order.tableNumber === tableNumber && 
           !['completed','cancelled'].includes(order.status)
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
      case 'pending': return '#faad14';
      case 'preparing': return '#1890ff';
      case 'ready': return '#52c41a';
      case 'delayed': return '#ff4d4f';
      case 'completed': return '#52c41a';
      default: return '#d9d9d9';
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <FoodLoader/>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Space align="center">
          <ShopOutlined style={styles.headerIcon} />
          <Title level={2} style={styles.headerTitle}>My Orders</Title>
        </Space>
      </div>

      <List
        dataSource={orders}
        locale={{ 
          emptyText: (
            <div style={styles.emptyState}>
              <ShopOutlined style={{ fontSize: '48px', color: '#dc3545', marginBottom: '16px' }} />
              <p>No active orders found for your table</p>
            </div>
          ) 
        }}
        renderItem={(order) => (
          <List.Item style={{ padding: 0, marginBottom: '16px' }}>
            <Card style={styles.card} bodyStyle={{ padding: '16px' }}>
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <div style={styles.statusContainer}>
                  <Title level={4} style={styles.orderNumber}>Order #{order.id}</Title>
                  <Tag 
                    style={{
                      borderRadius: '16px',
                      padding: '4px 12px',
                      border: 'none',
                      backgroundColor: `${getStatusColor(order.status)}20`,
                      color: getStatusColor(order.status),
                    }}
                  >
                    {getStatusIcon(order.status)}
                    <span style={{ marginLeft: '4px' }}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </Tag>
                </div>
                
                <Text style={styles.statusMessage}>{order.statusMessage}</Text>
                
                <div style={styles.tableNumber}>
                  <span>Table {order.tableNumber}</span>
                </div>

                <Button 
                  onClick={() => navigate(`/waiting/${order.id}`)}
                  type="primary"
                  style={styles.viewButton}
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