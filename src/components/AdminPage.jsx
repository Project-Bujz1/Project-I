// import React, { useState, useEffect, useRef } from 'react';
// import { Card, Tag, Select, Typography, message, Spin, notification, Switch } from 'antd';
// import { CheckOutlined, ClockCircleOutlined, SyncOutlined, ExclamationCircleOutlined, BellOutlined, SoundOutlined, CloseCircleOutlined } from '@ant-design/icons';

// import notificationSound from './notification.mp3';

// const { Option } = Select;
// const { Title, Text } = Typography;

// const AdminOrderComponent = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [newOrders, setNewOrders] = useState([]);
//   const [soundEnabled, setSoundEnabled] = useState(false);
//   const ws = useRef(null);
//   const audioRef = useRef(new Audio(notificationSound));
//   const orgId = localStorage.getItem('orgId');

//   useEffect(() => {

    
//     fetchOrders();

//     // Set up WebSocket connection
//     ws.current = new WebSocket('wss://legend-sulfuric-ruby.glitch.me');

//     ws.current.onopen = () => {
//       console.log('WebSocket connected');
//     };

//     ws.current.onmessage = (event) => {
//       console.log('Received message:', event.data);
//       const data = JSON.parse(event.data);
//       if (data.type === 'newOrder' && data.order.orgId == orgId) {
//         // Add the new order to the beginning of the orders array
//         setOrders(prevOrders => [data.order, ...prevOrders]);
        
//         // Add the new order ID to the newOrders array for highlighting
//         setNewOrders(prev => [...prev, data.order.id]);

//         // Play sound notification if enabled
//         if (soundEnabled) {
//           audioRef.current.play().catch(error => console.error('Error playing audio:', error));
//         }

//         // Show visual notification
//         notification.open({
//           message: 'New Order Arrived',
//           description: `Order #${data.order.id} has been placed for Table ${data.order.tableNumber}`,
//           icon: <BellOutlined style={{ color: '#ff4d4f' }} />,
//           duration: 4.5,
//         });
//       } else if (data.type === 'statusUpdate' && data.orgId == orgId) {
//         setOrders(prevOrders =>
//           prevOrders?.map(order =>
//             order.id == data.orderId ? { ...order, status: data.status, statusMessage: data.statusMessage } : order
//           )
//         );

//         if (soundEnabled) {
//           audioRef.current.play().catch(error => console.error('Error playing audio:', error));
//         }

//         notification.open({
//           message: 'Order Status Updated',
//           description: `Order #${data.orderId} status: ${data.status}`,
//           icon: data.status === 'cancelled' ? <CloseCircleOutlined style={{ color: '#ff4d4f' }} /> : <BellOutlined style={{ color: '#1890ff' }} />,
//         });
//       }
//     };
//     ws.current.onerror = (error) => {
//       console.error('WebSocket error:', error);
//     };

//     return () => {
//       if (ws.current) {
//         ws.current.close();
//       }
//     };
//   }, [soundEnabled, orgId]);

//   const handleUpdateStatus = async (orderId, newStatus) => {
//     try {
//       const updatedOrder = orders.find(order => order.id === orderId);
//       const statusMessage = getStatusMessage(newStatus);
  
//       // PATCH the order status in Firebase
//       const response = await fetch(`https://smart-server-menu-database-default-rtdb.firebaseio.com/history/${orderId}.json`, {  // Add .json
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ status: newStatus, statusMessage, orgId }),
//       });
  
//       if (!response.ok) {
//         throw new Error('Failed to update order status');
//       }
  
//       // Update the order status locally
//       setOrders(prevOrders =>
//         prevOrders?.map(order =>
//           order.id === orderId ? { ...order, status: newStatus, statusMessage } : order
//         )
//       );
  
//       // Send status update through WebSocket
//       if (ws.current && ws.current.readyState === WebSocket.OPEN) {
//         const message = JSON.stringify({ 
//           type: 'statusUpdate', 
//           orderId: orderId, 
//           status: newStatus,
//           statusMessage: statusMessage,
//           orgId: orgId
//         });
//         console.log('Sending WebSocket message:', message);
//         ws.current.send(message);
//       } else {
//         console.error('WebSocket is not open. Status update not sent.');
//       }
  
//       message.success(`Order #${orderId} status updated to ${newStatus}`);
  
//       // Remove from newOrders if present
//       setNewOrders(prev => prev.filter(id => id !== orderId));
//     } catch (error) {
//       console.error('Failed to update order status', error);
//       message.error('Failed to update order status');
//     }
//   };
  

//   const getStatusMessage = (status) => {
//     switch (status) {
//       case 'pending': return 'Your order is being processed';
//       case 'preparing': return 'Your order is being prepared';
//       case 'ready': return 'Your order is ready for pickup';
//       case 'delayed': return 'Your order is delayed. We apologize for the inconvenience';
//       case 'completed': return 'Your order is completed.'
//       default: return 'Order status unknown';
//     }
//   };

//       const fetchOrders = async () => {
//       try {
//         // const orgId = localStorage.getItem('orgId');
//         // if (!orgId) {
//         //   throw new Error('No orgId found in localStorage');
//         // }
    
//         const response = await fetch(`https://smart-server-menu-database-default-rtdb.firebaseio.com/history.json`); // Add .json to the URL
//         if (!response.ok) {
//           throw new Error('Failed to fetch orders');
//         }
    
//         const data = await response.json();
    
//         // Convert Firebase object to an array
//         const ordersArray = Object?.values(data)?.filter(order => order?.orgId === orgId);
    
//         // Sort orders by timestamp
//         const sortedOrders = ordersArray?.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
//         setOrders(sortedOrders);
//       } catch (error) {
//         console.error('Failed to fetch orders', error);
//         message.error('Failed to fetch orders');
//       } finally {
//         setLoading(false);
//       }
//     };

//   const getStatusIcon = (status) => {
//     switch(status) {
//       case 'pending': return <ClockCircleOutlined />;
//       case 'preparing': return <SyncOutlined spin />;
//       case 'ready': return <CheckOutlined />;
//       case 'delayed': return <ExclamationCircleOutlined />;
//       case 'cancelled': return <CloseCircleOutlined />;
//       case 'completed': return <CheckOutlined/>;
//       default: return null;
//     }
//   };

//   const getStatusColor = (status) => {
//     switch(status) {
//       case 'pending': return 'gold';
//       case 'preparing': return 'blue';
//       case 'ready': return 'green';
//       case 'delayed': return 'orange';
//       case 'cancelled': return 'red';
//       case 'completed': return 'green';
//       default: return 'default';
//     }
//   };

//   if (loading) {
//     return <Spin size="large" />;
//   }

//   return (
//     <div style={{ padding: '16px', backgroundColor: '#fff5f5', minHeight: '100vh', marginTop: '110px' }}>
//       <Title level={2} style={{ color: '#ff4d4f', marginBottom: '16px', textAlign: 'center' }}>Order Management</Title>
//       <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
//         <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '16px' }}>
//           <Switch
//             checkedChildren={<SoundOutlined />}
//             unCheckedChildren={<SoundOutlined />}
//             checked={soundEnabled}
//             onChange={setSoundEnabled}
//           />
//           <Text style={{ marginLeft: '8px' }}>Sound Notifications</Text>
//         </div>
//         {orders?.map(order => (
//           <Card 
//             key={order.id}
//             hoverable
//             style={{ 
//               backgroundColor: '#fff', 
//               borderRadius: '8px',
//               boxShadow: newOrders.some(newOrder => newOrder === order.id) ? '0 0 10px #ff4d4f' : 'none',
//               animation: newOrders.some(newOrder => newOrder === order.id) ? 'pulse 2s infinite' : 'none'
//             }}
//             bodyStyle={{ padding: '16px' }}
//           >
//             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
//               <Title level={4} style={{ margin: 0 }}>Order #{order.id}</Title>
//               <Tag color="red">Table {order.tableNumber}</Tag>
//             </div>
//             <div style={{ marginBottom: '8px' }}>
//               <Text strong>Items: </Text>
//               {order?.items?.map((item, index) => (
//                 <Tag key={index} color="red" style={{ margin: '2px' }}>
//                   {item.name} x{item.quantity}
//                 </Tag>
//               ))}
//             </div>
//             <div style={{ marginBottom: '8px' }}>
//               <Text strong>Total: </Text>
//               <Text>₹{order.total}</Text>
//             </div>
//             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//               <Text type="secondary">{new Date(order.timestamp).toLocaleString()}</Text>
//     <Select
//       value={order.status || 'pending'}
//       style={{ width: 120 }}
//       onChange={(newStatus) => handleUpdateStatus(order.id, newStatus)}
//       disabled={order.status === 'cancelled'}
//     >
//       {['pending', 'preparing', 'ready', 'delayed', 'cancelled', 'completed']?.map((status) => (
//         <Option key={status} value={status}>
//           <Tag color={getStatusColor(status)} icon={getStatusIcon(status)}>
//             {status.toUpperCase()}
//           </Tag>
//         </Option>
//       ))}
//     </Select>
//             </div>
//             <div style={{ marginTop: '8px' }}>
//               <Text type="secondary">{order.statusMessage || getStatusMessage(order.status || 'pending')}</Text>
//             </div>
//           </Card>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default AdminOrderComponent;
import React, { useState, useEffect, useRef } from 'react';
import { Card, Tag, Select, Typography, message, Spin, notification, Switch, Badge, Empty } from 'antd';
import {
  CheckOutlined,
  ClockCircleOutlined,
  SyncOutlined,
  ExclamationCircleOutlined,
  BellOutlined,
  SoundOutlined,
  CloseCircleOutlined,
  DollarOutlined,
  ShoppingOutlined,
  TableOutlined
} from '@ant-design/icons';
import notificationSound from './notification.mp3';
import FoodLoader from './FoodLoader';

const { Option } = Select;
const { Title, Text } = Typography;

const AdminOrderComponent = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newOrders, setNewOrders] = useState([]);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const ws = useRef(null);
  const audioRef = useRef(new Audio(notificationSound));
  const orgId = localStorage.getItem('orgId');

  // Your existing WebSocket and data fetching logic remains the same

  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        color: '#ffd700',
        icon: <ClockCircleOutlined />,
        text: 'Pending',
        bgColor: '#fffbe6'
      },
      preparing: {
        color: '#1890ff',
        icon: <SyncOutlined spin />,
        text: 'Preparing',
        bgColor: '#e6f7ff'
      },
      ready: {
        color: '#52c41a',
        icon: <CheckOutlined />,
        text: 'Ready',
        bgColor: '#f6ffed'
      },
      delayed: {
        color: '#fa8c16',
        icon: <ExclamationCircleOutlined />,
        text: 'Delayed',
        bgColor: '#fff7e6'
      },
      cancelled: {
        color: '#ff4d4f',
        icon: <CloseCircleOutlined />,
        text: 'Cancelled',
        bgColor: '#fff1f0'
      },
      completed: {
        color: '#52c41a',
        icon: <CheckOutlined />,
        text: 'Completed',
        bgColor: '#f6ffed'
      }
    };
    return configs[status] || configs.pending;
  };
  useEffect(() => {
    fetchOrders();

    // Set up WebSocket connection
    ws.current = new WebSocket('wss://legend-sulfuric-ruby.glitch.me');

    ws.current.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.current.onmessage = (event) => {
      console.log('Received message:', event.data);
      const data = JSON.parse(event.data);
      if (data.type === 'newOrder' && data.order.orgId == orgId) {
        // Add the new order to the beginning of the orders array
        setOrders(prevOrders => [data.order, ...prevOrders]);
        
        // Add the new order ID to the newOrders array for highlighting
        setNewOrders(prev => [...prev, data.order.id]);

        // Play sound notification if enabled
        if (soundEnabled) {
          audioRef.current.play().catch(error => console.error('Error playing audio:', error));
        }

        // Show visual notification
        notification.open({
          message: 'New Order Arrived',
          description: `Order #${data.order.id} has been placed for Table ${data.order.tableNumber}`,
          icon: <BellOutlined style={{ color: '#ff4d4f' }} />,
          duration: 4.5,
        });
      } else if (data.type === 'statusUpdate' && data.orgId == orgId) {
        setOrders(prevOrders =>
          prevOrders?.map(order =>
            order.id == data.orderId ? { ...order, status: data.status, statusMessage: data.statusMessage } : order
          )
        );

        if (soundEnabled) {
          audioRef.current.play().catch(error => console.error('Error playing audio:', error));
        }

        notification.open({
          message: 'Order Status Updated',
          description: `Order #${data.orderId} status: ${data.status}`,
          icon: data.status === 'cancelled' ? <CloseCircleOutlined style={{ color: '#ff4d4f' }} /> : <BellOutlined style={{ color: '#1890ff' }} />,
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
  }, [soundEnabled, orgId]);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const updatedOrder = orders.find(order => order.id === orderId);
      const statusMessage = getStatusMessage(newStatus);
  
      // PATCH the order status in Firebase
      const response = await fetch(`https://smart-server-menu-database-default-rtdb.firebaseio.com/history/${orderId}.json`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus, statusMessage }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update order status');
      }
  
      // Update the order status locally
      setOrders(prevOrders =>
        prevOrders?.map(order =>
          order.id === orderId ? { ...order, status: newStatus, statusMessage } : order
        )
      );
  
      // Send status update through WebSocket
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        const message = JSON.stringify({ 
          type: 'statusUpdate', 
          orderId: orderId, 
          status: newStatus,
          statusMessage: statusMessage,
          orgId: orgId
        });
        console.log('Sending WebSocket message:', message);
        ws.current.send(message);
      } else {
        console.error('WebSocket is not open. Status update not sent.');
      }
  
      message.success(`Order #${orderId} status updated to ${newStatus}`);
  
      // Remove from newOrders if present
      setNewOrders(prev => prev.filter(id => id !== orderId));
    } catch (error) {
      console.error('Failed to update order status', error);
      message.error('Failed to update order status');
    }
  };

  const getStatusMessage = (status) => {
    switch (status) {
      case 'pending': return 'Your order is being processed';
      case 'preparing': return 'Your order is being prepared';
      case 'ready': return 'Your order is ready for pickup';
      case 'delayed': return 'Your order is delayed. We apologize for the inconvenience';
      case 'completed': return 'Your order is completed.';
      case 'cancelled': return 'Your order is cancelled';
      default: return 'Order status unknown';
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch(`https://smart-server-menu-database-default-rtdb.firebaseio.com/history.json`);
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
  
      const data = await response.json();
  
      // Convert Firebase object to an array, using the key as the id
      const ordersArray = Object.entries(data).map(([key, order]) => ({
        ...order,
        id: order.id || key // Use the order's id if it exists, otherwise use the Firebase key
      })).filter(order => order.orgId === orgId);
  
      // Sort orders by timestamp
      const sortedOrders = ordersArray?.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setOrders(sortedOrders);
    } catch (error) {
      console.error('Failed to fetch orders', error);
      message.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending': return <ClockCircleOutlined />;
      case 'preparing': return <SyncOutlined spin />;
      case 'ready': return <CheckOutlined />;
      case 'delayed': return <ExclamationCircleOutlined />;
      case 'cancelled': return <CloseCircleOutlined />;
      case 'completed': return <CheckOutlined/>;
      default: return null;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'gold';
      case 'preparing': return 'blue';
      case 'ready': return 'green';
      case 'delayed': return 'orange';
      case 'cancelled': return 'red';
      case 'completed': return 'green';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#fff5f5'
      }}>
        <FoodLoader/>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fff5f5 0%, #fff 100%)',
      padding: '20px',
      paddingTop: '90px'
    }}>
      <div style={{
        maxWidth: '1600px',
        margin: '0 auto',
        padding: '20px',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '30px',
          flexWrap: 'wrap',
          gap: '20px',
          background: 'white',
          padding: '20px',
          borderRadius: '15px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
        }}>
          <Title level={2} style={{ 
            margin: 0,
            color: '#ff4d4f',
            fontSize: '2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
          <h1 style={{ 
            color: '#ff4d4f',
            fontSize: '1.5rem',
            fontWeight: '700',
            margin: 0,
            textTransform: 'uppercase',
          }}>
            Manage Orders
          </h1>
          </Title>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: '#fff5f5',
            padding: '10px 20px',
            borderRadius: '8px'
          }}>
            <Switch
              checkedChildren={<SoundOutlined />}
              unCheckedChildren={<SoundOutlined />}
              checked={soundEnabled}
              onChange={setSoundEnabled}
              style={{ backgroundColor: soundEnabled ? '#ff4d4f' : undefined }}
            />
            <Text>Notifications</Text>
          </div>
        </div>

        {orders.length === 0 ? (
          <Empty
            description="No orders yet"
            style={{
              background: 'white',
              padding: '40px',
              borderRadius: '15px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
            }}
          />
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '20px',
            padding: '10px'
          }}>
            {orders?.map(order => (
              <Badge.Ribbon
                key={order.id}
                text={getStatusConfig(order.status).text}
                color={getStatusConfig(order.status).color}
              >
                <Card
                  hoverable
                  style={{
                    borderRadius: '15px',
                    boxShadow: newOrders.includes(order.id) 
                      ? '0 0 20px rgba(255, 77, 79, 0.3)'
                      : '0 4px 12px rgba(0,0,0,0.05)',
                    animation: newOrders.includes(order.id)
                      ? 'pulse 2s infinite'
                      : 'none',
                    border: 'none',
                    background: getStatusConfig(order.status).bgColor
                  }}
                  bodyStyle={{ padding: '20px' }}
                >
                  <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '20px'
                  }}>
                    <div>
                      <h3  style={{
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

                  </div>
                  <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      marginBottom: '25px',
                      background: '#fff',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
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

                  <div style={{
                    background: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: '10px',
                    padding: '15px',
                    marginBottom: '5px'
                  }}>
                    <Text strong style={{ display: 'block', marginBottom: '10px' }}>
                      Order Items
                    </Text>
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '8px'
                    }}>
                      {order?.items?.map((item, index) => (
                        <Tag
                          key={index}
                          style={{
                            padding: '4px 8px',
                            borderRadius: '6px',
                            margin: 0,
                            background: '#fff',
                            border: '1px solid #ffccc7'
                          }}
                        >
                          <Text strong style={{ color: '#ff4d4f' }}>{item.quantity}x</Text>
                          <Text> {item.name}</Text>
                        </Tag>
                      ))}
                    </div>
                  </div>

                  <div style={{
                    marginTop: '15px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                  }}>
                    <Select
                      value={order.status || 'pending'}
                      style={{
                        width: '100%',
                        marginBottom: '10px'
                      }}
                      onChange={(newStatus) => handleUpdateStatus(order.id, newStatus)}
                      // disabled={order.status === 'cancelled'}
                    >
                      {['pending', 'preparing', 'ready', 'delayed', 'cancelled', 'completed']?.map((status) => (
                        <Option key={status} value={status}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}>
                            {getStatusConfig(status).icon}
                            <Text>{status.toUpperCase()}</Text>
                          </div>
                        </Option>
                      ))}
                    </Select>

                    <Text type="secondary" style={{
                      fontSize: '0.9rem',
                      padding: '8px',
                      background: 'rgba(255, 255, 255, 0.8)',
                      borderRadius: '6px'
                    }}>
                      {order.statusMessage || getStatusMessage(order.status || 'pending')}
                    </Text>
                              {/* Show the order description if it exists */}
          {order.description && (
            <Text style={{ fontSize: '0.9rem', color: '#555', marginTop: '10px' }}>
              Notes: {order.description}
            </Text>
          )}

                    <Text type="secondary" style={{
                      fontSize: '0.8rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}>
                      <ClockCircleOutlined />
                      {new Date(order.timestamp).toLocaleString()}
                    </Text>
                  </div>
                </Card>
              </Badge.Ribbon>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrderComponent;