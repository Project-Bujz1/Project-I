import React, { useState, useEffect } from 'react';
import { Card, Tag, Select, Typography, message } from 'antd';
import { CheckOutlined, ClockCircleOutlined, SyncOutlined } from '@ant-design/icons';

const { Option } = Select;
const { Title, Text } = Typography;

const AdminOrderComponent = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      // Simulated API response
      const response = await new Promise(resolve => 
        setTimeout(() => resolve([
          { id: 1, tableNumber: 5, items: ['Pizza', 'Coke'], status: 'Pending', timestamp: '2023-08-31 14:30:00' },
          { id: 2, tableNumber: 3, items: ['Burger', 'Fries', 'Shake'], status: 'Preparing', timestamp: '2023-08-31 14:45:00' },
          { id: 3, tableNumber: 7, items: ['Pasta', 'Garlic Bread', 'Wine'], status: 'Ready', timestamp: '2023-08-31 15:00:00' },
        ]), 1000)
      );
      setOrders(response);
    };
    fetchOrders();
  }, []);

  const handleUpdateStatus = (orderId, newStatus) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    message.success(`Order #${orderId} status updated to ${newStatus}`);
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Pending': return <ClockCircleOutlined />;
      case 'Preparing': return <SyncOutlined spin />;
      case 'Ready': return <CheckOutlined />;
      default: return null;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending': return 'gold';
      case 'Preparing': return 'blue';
      case 'Ready': return 'green';
      default: return 'default';
    }
  };

  return (
    <div style={{ padding: '16px', backgroundColor: '#fff5f5', minHeight: '100vh', marginTop: '50px' }}>
      <Title level={2} style={{ color: '#ff4d4f', marginBottom: '16px', textAlign: 'center' }}>Order Management</Title>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {orders.map(order => (
          <Card 
            key={order.id}
            hoverable
            style={{ backgroundColor: '#fff', borderRadius: '8px' }}
            bodyStyle={{ padding: '16px' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <Title level={4} style={{ margin: 0 }}>Order #{order.id}</Title>
              <Tag color="red">Table {order.tableNumber}</Tag>
            </div>
            <div style={{ marginBottom: '8px' }}>
              <Text strong>Items: </Text>
              {order.items.map((item, index) => (
                <Tag key={index} color="red" style={{ margin: '2px' }}>{item}</Tag>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text type="secondary">{order.timestamp}</Text>
              <Select
                value={order.status}
                style={{ width: 120 }}
                onChange={(newStatus) => handleUpdateStatus(order.id, newStatus)}
              >
                {['Pending', 'Preparing', 'Ready'].map((status) => (
                  <Option key={status} value={status}>
                    <Tag color={getStatusColor(status)} icon={getStatusIcon(status)}>
                      {status.toUpperCase()}
                    </Tag>
                  </Option>
                ))}
              </Select>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminOrderComponent;