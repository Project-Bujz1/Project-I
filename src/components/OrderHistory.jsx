import React, { useEffect, useState } from 'react';
import { List, Card, Button, Popconfirm, message, Tag } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import FoodLoader from './FoodLoader';

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://smartserver-json-server.onrender.com/history');
      if (!response.ok) {
        throw new Error('Failed to fetch order history');
      }
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch order history', error);
      message.error('Failed to fetch order history');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (orderId) => {
    try {
      const response = await fetch(`https://smartserver-json-server.onrender.com/history/${orderId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete order');
      }
      message.success('Order deleted successfully');
      setOrders((prevOrders) => prevOrders.filter((order) => order.id !== orderId));
    } catch (error) {
      console.error('Failed to delete order', error);
      message.error('Failed to delete order. Please try again.');
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'gold';
      case 'preparing': return 'blue';
      case 'ready': return 'green';
      case 'delayed': return 'orange';
      default: return 'default';
    }
  };

  if (loading) {
    return <div style={{marginTop: '150px'}}> <FoodLoader />;</div>
  }

  return (
    <div className="order-history-container" style={{ padding: '20px', maxWidth: '800px', margin: 'auto', color: '#ff4d4f', marginTop: '95px' }}>
      <h2 style={{ textAlign: 'center', color: '#ff4d4f' }}>Order History</h2>
      <List
        grid={{ gutter: 16, column: 1 }}
        dataSource={orders}
        renderItem={(order) => (
          <List.Item>
            <Card
              title={`Order #${order.id} (Table: ${order.tableNumber})`}
              extra={
                <Popconfirm
                  title="Are you sure to delete this order?"
                  onConfirm={() => handleDelete(order.id)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button type="primary" danger icon={<DeleteOutlined />}>
                    Delete
                  </Button>
                </Popconfirm>
              }
              style={{ backgroundColor: '#fff5f5', borderColor: '#ff4d4f' }}
            >
              <p><strong>Total:</strong> ₹{order.total}</p>
              <ul>
                {order.items.map((item, index) => (
                  <li key={index}>
                    {item.name} x {item.quantity} - ₹{(item.price * item.quantity).toFixed(2)}
                  </li>
                ))}
              </ul>
              <p><strong>Status:</strong> <Tag color={getStatusColor(order.status)}>{order.status}</Tag></p>
              <p><strong>Status Message:</strong> {order.statusMessage}</p>
              <p><strong>Timestamp:</strong> {new Date(order.timestamp).toLocaleString()}</p>
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
}

export default OrderHistory;