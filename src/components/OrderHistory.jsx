import React, { useEffect, useState } from 'react';
import { List, Card, Button, Popconfirm, message, Tag, Empty, Spin, Badge, Input } from 'antd';
import { 
  DeleteOutlined, 
  ClockCircleOutlined, 
  TableOutlined, 
  DollarOutlined,
  ShoppingOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import FoodLoader from './FoodLoader';

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredOrders, setFilteredOrders] = useState([]);

  // Slide-up animation
  const slideUpAnimation = {
    animation: 'slideUp 0.6s ease-out',
    '@keyframes slideUp': {
      '0%': { opacity: 0, transform: 'translateY(30px)' },
      '100%': { opacity: 1, transform: 'translateY(0)' }
    }
  };

  // Modern restaurant background with pattern
  const backgroundStyle = {
    background: `
      linear-gradient(135deg, rgba(255, 77, 79, 0.05) 0%, rgba(255, 255, 255, 0.1) 100%),
      repeating-linear-gradient(45deg, rgba(255, 77, 79, 0.02) 0px, rgba(255, 77, 79, 0.02) 2px, transparent 2px, transparent 8px)
    `,
    minHeight: '100vh',
    padding: '15px',
    fontFamily: "'Poppins', sans-serif",
    marginTop : '25px'
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (orders.length) {
      const sorted = [...orders].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      const filtered = sorted.filter(order => 
        (order.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (order.items && order.items.some(item => item.name?.toLowerCase().includes(searchQuery.toLowerCase()))) ||
        order.status?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.tableNumber?.toString().includes(searchQuery)) ?? false
      );
      setFilteredOrders(filtered);
    }
  }, [orders, searchQuery]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      
      // Fetch all order history from Firebase
      const response = await fetch('https://smart-server-menu-database-default-rtdb.firebaseio.com/history.json');
      if (!response.ok) {
        throw new Error('Failed to fetch order history');
      }
      
      const data = await response.json();
      
      // Get the orgId from localStorage
      const orgId = localStorage.getItem('orgId');
      
      // If no orders, set an empty array
      if (!data) {
        setOrders([]);
        return;
      }
      
      // Convert the fetched object to an array and filter by orgId
      const fetchedOrders = Object.keys(data)
        ?.map((key) => ({ id: key, ...data[key] }))
        .filter((order) => order.orgId === orgId);
      
      setOrders(fetchedOrders);
    } catch (error) {
      console.error('Failed to fetch order history', error);
      message.error('Failed to fetch order history');
    } finally {
      setLoading(false);
    }
  };
  

  const handleDelete = async (orderId) => {
    try {
      // Fetch the current order history
      const response = await fetch('https://smart-server-menu-database-default-rtdb.firebaseio.com/history.json');
      if (!response.ok) {
        throw new Error('Failed to fetch order history for deletion');
      }
      
      const data = await response.json();
      
      // Loop through each Firebase-generated key and find the matching orderId
      const firebaseKeyToDelete = Object.keys(data).find((firebaseKey) => data[firebaseKey].id === orderId);
  
      // If no matching order is found, throw an error
      if (!firebaseKeyToDelete) {
        throw new Error('Order not found in Firebase');
      }
  
      // Delete the order at the found Firebase key
      const deleteResponse = await fetch(`https://smart-server-menu-database-default-rtdb.firebaseio.com/history/${firebaseKeyToDelete}.json`, {
        method: 'DELETE',
      });
  
      if (!deleteResponse.ok) {
        throw new Error(`Failed to delete order. Status: ${deleteResponse.status}`);
      }
  
      // Notify success and remove order from local state
      message.success('Order deleted successfully');
      setOrders((prevOrders) => prevOrders.filter((order) => order.id !== orderId));
  
    } catch (error) {
      console.error('Failed to delete order:', error);
      message.error('Failed to delete order. Please try again.');
    }
  };
  

  const getStatusInfo = (status) => {
    const statusConfig = {
      pending: {
        color: '#ffd700',
        icon: <ClockCircleOutlined />,
        text: 'Pending'
      },
      preparing: {
        color: '#1890ff',
        icon: <ShoppingOutlined />,
        text: 'Preparing'
      },
      ready: {
        color: '#52c41a',
        icon: <CheckCircleOutlined />,
        text: 'Ready'
      },
      delayed: {
        color: '#fa8c16',
        icon: <InfoCircleOutlined />,
        text: 'Delayed'
      },
      completed: {
        color: '#52c41a',
        icon: <CheckCircleOutlined />,
        text: 'Completed'
      }
    };
    return statusConfig[status] || { color: '#d9d9d9', icon: <InfoCircleOutlined />, text: status };
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: '#fff5f5'
      }}>
        <FoodLoader />
      </div>
    );
  }

  return (
    <div style={backgroundStyle}>
      <div style={{ 
        maxWidth: '1000px', 
        margin: '0 auto', 
        paddingTop: '70px'
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '40px',
          padding: '20px',
          background: 'white',
          borderRadius: '15px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
        }}>
          <h1 style={{ 
            color: '#ff4d4f',
            fontSize: '2.2rem',
            fontWeight: '700',
            margin: 0,
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            Order History
          </h1>
          <p style={{ 
            color: '#666',
            margin: '10px 0 20px',
            fontSize: '1rem' 
          }}>
            Track and manage your recent orders
          </p>
          <Input.Search
            placeholder="Search orders by ID, items, status, or table number..."
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ 
              maxWidth: '500px',
              margin: '0 auto'
            }}
            allowClear
          />
        </div>

        {filteredOrders.length === 0 ? (
          <Empty
            description={
              <span style={{ color: '#666', fontSize: '1.1rem' }}>
                {searchQuery ? 'No matching orders found' : 'No orders available'}
              </span>
            }
            style={{
              backgroundColor: 'white',
              padding: '60px',
              borderRadius: '15px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
            }}
          />
        ) : (
          <List
            grid={{ 
              gutter: [24, 24],
              xs: 1,
              sm: 1,
              md: 2,
              lg: 2,
              xl: 2,
              xxl: 3,
            }}
            dataSource={filteredOrders}
            renderItem={(order) => (
              <List.Item style={slideUpAnimation}>
                <Badge.Ribbon 
                  text={getStatusInfo(order.status).text}
                  color={getStatusInfo(order.status).color}
                >
                  <Card
                  hoverable
                    style={{
                      borderRadius: '15px',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                      border: 'none',
                      background: 'white',
                    }}
                    bodyStyle={{ padding: '25px' }}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '20px'
                    }}>
                      <div>
                        <h3 style={{
                          color: '#ff4d4f',
                          fontSize: '1.4rem',
                          fontWeight: '600',
                          margin: 0
                        }}>
                          #{order.id}
                        </h3>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          marginTop: '8px'
                        }}>
                          <TableOutlined style={{ color: '#ff4d4f' }} />
                          <span style={{ fontSize: '1.1rem' }}>Table {order.tableNumber}</span>
                        </div>
                      </div>
                      <div style={{
                        background: '#fff5f5',
                        padding: '10px 15px',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}>
                        <DollarOutlined style={{ color: '#ff4d4f' }} />
                        <span style={{ 
                          fontSize: '1.2rem', 
                          fontWeight: '600', 
                          color: '#ff4d4f' 
                        }}>
                          ₹{order.total}
                        </span>
                      </div>
                    </div>

                    <div style={{
                      background: '#fafafa',
                      borderRadius: '12px',
                      padding: '15px',
                      marginBottom: '20px'
                    }}>
                      {order?.items?.map((item, index) => (
                        <div 
                          key={index}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            padding: '10px',
                            borderBottom: index < order.items.length - 1 ? '1px solid #eee' : 'none',
                            fontSize: '0.95rem'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ 
                              background: '#ff4d4f',
                              color: 'white',
                              borderRadius: '50%',
                              width: '20px',
                              height: '20px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.8rem'
                            }}>
                              {item.quantity}
                            </span>
                            <span>{item.name}</span>
                          </div>
                          <span style={{ fontWeight: '500' }}>
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div style={{
                        fontSize: '0.9rem',
                        color: '#666',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}>
                        <ClockCircleOutlined />
                        {new Date(order.timestamp).toLocaleString()}
                      </div>
                      <Popconfirm
                        title="Delete this order?"
                        description="This action cannot be undone."
                        onConfirm={() => handleDelete(order.id)}
                        okText="Yes"
                        cancelText="No"
                        okButtonProps={{ danger: true }}
                      >
                        <Button 
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          style={{ fontSize: '16px' }}
                        >
                          Delete
                        </Button>
                      </Popconfirm>
                    </div>

                    {order.statusMessage && (
                      <div style={{
                        marginTop: '15px',
                        padding: '12px',
                        background: '#fffbe6',
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                        color: '#666',
                        border: '1px solid #ffe58f'
                      }}>
                        <InfoCircleOutlined style={{ marginRight: '8px', color: '#faad14' }} />
                        {order.statusMessage}
                      </div>
                    )}
                  </Card>
                </Badge.Ribbon>
              </List.Item>
            )}
          />
        )}
      </div>
    </div>
  );
}

export default OrderHistory;