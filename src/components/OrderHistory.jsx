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
      
      // Fetch all order history from Firebase
      const response = await fetch('https://db-for-smart-serve-menu-default-rtdb.firebaseio.com/history.json');
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
      const filteredOrders = Object.keys(data)
        ?.map((key) => ({ id: key, ...data[key] }))
        .filter((order) => order.orgId === orgId);
      
      setOrders(filteredOrders);
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
      const response = await fetch('https://db-for-smart-serve-menu-default-rtdb.firebaseio.com/history.json');
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
      const deleteResponse = await fetch(`https://db-for-smart-serve-menu-default-rtdb.firebaseio.com/history/${firebaseKeyToDelete}.json`, {
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
  

  // const handleDelete = async (orderId) => {
  //   try {
  //     const response = await fetch(`https://db-for-smart-serve-menu-default-rtdb.firebaseio.com/history/${orderId}.json`, {
  //       method: 'DELETE',
  //     });
      
  //     if (!response.ok) {
  //       throw new Error('Failed to delete order');
  //     }
      
  //     message.success('Order deleted successfully');
      
  //     // Remove the deleted order from the current list of orders
  //     setOrders((prevOrders) => prevOrders.filter((order) => order.id !== orderId));
  //   } catch (error) {
  //     console.error('Failed to delete order', error);
  //     message.error('Failed to delete order. Please try again.');
  //   }
  // };
  

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'gold';
      case 'preparing': return 'blue';
      case 'ready': return 'green';
      case 'delayed': return 'orange';
      case 'completed': return 'green';
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
                {order?.items?.map((item, index) => (
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