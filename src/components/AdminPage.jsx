// import React, { useState, useEffect, useRef } from 'react';
// import { 
//   Layout, Menu, Card, Badge, Tag, Select, Typography, notification, 
//   Switch, Spin, List, Avatar, Statistic, Row, Col, Progress
// } from 'antd';
// import { 
//   BellOutlined, CheckCircleOutlined, ClockCircleOutlined, 
//   ExclamationCircleOutlined, CloseCircleOutlined, SoundOutlined, 
//   DashboardOutlined, ShoppingCartOutlined, SettingOutlined, 
//   TableOutlined, UserOutlined
// } from '@ant-design/icons';

// const { Header, Sider, Content } = Layout;
// const { Option } = Select;
// const { Title, Text } = Typography;

// const AdminOrderComponent = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [newOrders, setNewOrders] = useState([]);
//   const [soundEnabled, setSoundEnabled] = useState(false);
//   const [collapsed, setCollapsed] = useState(false);
//   const [restaurantData, setRestaurantData] = useState({
//     seatingCapacity: 50,
//     tableCount: 10,
//     occupiedTables: 0
//   });
//   const ws = useRef(null);
//   const audioRef = useRef(new Audio('/notification.mp3'));
//   const orgId = localStorage.getItem('orgId');

//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const response = await fetch(`https://smartserver-json-server.onrender.com/history?orgId=${orgId}`);
//         if (!response.ok) {
//           throw new Error('Failed to fetch orders');
//         }
//         const data = await response.json();

//         const sortedOrders = data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
//         setOrders(sortedOrders);
//         updateRestaurantData(sortedOrders);
//       } catch (error) {
//         console.error('Failed to fetch orders', error);
//         notification.error({ message: 'Failed to fetch orders' });
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOrders();

//     ws.current = new WebSocket('wss://legend-sulfuric-ruby.glitch.me');

//     ws.current.onopen = () => {
//       console.log('WebSocket connected');
//     };

//     ws.current.onmessage = (event) => {
//       const data = JSON.parse(event.data);
//       if (data.type === 'newOrder' && data.order.orgId === orgId) {
//         setOrders(prevOrders => {
//           const updatedOrders = [data.order, ...prevOrders];
//           updateRestaurantData(updatedOrders);
//           return updatedOrders;
//         });
//         setNewOrders(prev => [...prev, data.order.id]);

//         if (soundEnabled) {
//           audioRef.current.play().catch(error => console.error('Error playing audio:', error));
//         }

//         notification.open({
//           message: 'New Order Arrived',
//           description: `Order #${data.order.id} has been placed for Table ${data.order.tableNumber}`,
//           icon: <BellOutlined style={{ color: '#1890ff' }} />,
//         });
//       } else if (data.type === 'statusUpdate' && data.orgId === orgId) {
//         setOrders(prevOrders => {
//           const updatedOrders = prevOrders.map(order =>
//             order.id === data.orderId ? { ...order, status: data.status, statusMessage: data.statusMessage } : order
//           );
//           updateRestaurantData(updatedOrders);
//           return updatedOrders;
//         });

//         if (soundEnabled) {
//           audioRef.current.play().catch(error => console.error('Error playing audio:', error));
//         }

//         notification.open({
//           message: 'Order Status Updated',
//           description: `Order #${data.orderId} status: ${data.status}`,
//           icon: data.status === 'cancelled' ? <CloseCircleOutlined style={{ color: '#ff4d4f' }} /> : <BellOutlined style={{ color: '#52c41a' }} />,
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

//   const updateRestaurantData = (currentOrders) => {
//     const occupiedTables = currentOrders.reduce((acc, order) => {
//       if (order.status !== 'cancelled' && order.status !== 'ready') {
//         acc += 1;
//       }
//       return acc;
//     }, 0);

//     setRestaurantData(prevData => ({
//       ...prevData,
//       occupiedTables: occupiedTables
//     }));
//   };

//   const handleUpdateStatus = async (orderId, newStatus) => {
//     try {
//       const updatedOrder = orders.find(order => order.id === orderId);
//       const statusMessage = getStatusMessage(newStatus);

//       const response = await fetch(`https://smartserver-json-server.onrender.com/history/${orderId}`, {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ status: newStatus, statusMessage, orgId }),
//       });

//       if (!response.ok) {
//         throw new Error('Failed to update order status');
//       }

//       setOrders(prevOrders => {
//         const updatedOrders = prevOrders.map(order =>
//           order.id === orderId ? { ...order, status: newStatus, statusMessage } : order
//         );
//         updateRestaurantData(updatedOrders);
//         return updatedOrders;
//       });

//       if (ws.current && ws.current.readyState === WebSocket.OPEN) {
//         const message = JSON.stringify({ 
//           type: 'statusUpdate', 
//           orderId: orderId, 
//           status: newStatus,
//           statusMessage: statusMessage,
//           orgId: orgId
//         });
//         ws.current.send(message);
//       }

//       notification.success({ message: `Order #${orderId} status updated to ${newStatus}` });

//       setNewOrders(prev => prev.filter(id => id !== orderId));
//     } catch (error) {
//       console.error('Failed to update order status', error);
//       notification.error({ message: 'Failed to update order status' });
//     }
//   };

//   const getStatusMessage = (status) => {
//     switch (status) {
//       case 'pending': return 'Your order is being processed';
//       case 'preparing': return 'Your order is being prepared';
//       case 'ready': return 'Your order is ready for pickup';
//       case 'delayed': return 'Your order is delayed. We apologize for the inconvenience';
//       case 'cancelled': return 'Your order has been cancelled';
//       default: return 'Order status unknown';
//     }
//   };

//   const getStatusIcon = (status) => {
//     switch(status) {
//       case 'pending': return <ClockCircleOutlined style={{ color: '#faad14' }} />;
//       case 'preparing': return <Spin size="small" />;
//       case 'ready': return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
//       case 'delayed': return <ExclamationCircleOutlined style={{ color: '#fa8c16' }} />;
//       case 'cancelled': return <CloseCircleOutlined style={{ color: '#f5222d' }} />;
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
//       default: return 'default';
//     }
//   };

//   const renderTableOccupancy = () => {
//     const { tableCount, occupiedTables } = restaurantData;
//     const tables = Array(tableCount).fill(null);
    
//     return (
//       <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
//         {tables.map((_, index) => {
//           const isOccupied = index < occupiedTables;
//           return (
//             <TableOutlined
//               key={index}
//               style={{
//                 fontSize: '24px',
//                 color: isOccupied ? '#ff4d4f' : '#52c41a',
//               }}
//             />
//           );
//         })}
//       </div>
//     );
//   };

//   const renderOrderList = () => (
//     <List
//       itemLayout="horizontal"
//       dataSource={orders}
//       renderItem={order => (
//         <List.Item
//           extra={
//             <Select
//               defaultValue={order.status}
//               style={{ width: 120 }}
//               onChange={(value) => handleUpdateStatus(order.id, value)}
//             >
//               <Option value="pending">Pending</Option>
//               <Option value="preparing">Preparing</Option>
//               <Option value="ready">Ready</Option>
//               <Option value="delayed">Delayed</Option>
//               <Option value="cancelled">Cancelled</Option>
//             </Select>
//           }
//         >
//           <List.Item.Meta
//             avatar={
//               <Avatar style={{ backgroundColor: getStatusColor(order.status), verticalAlign: 'middle' }} size="large">
//                 {getStatusIcon(order.status)}
//               </Avatar>
//             }
//             title={<a href="#">Order #{order.id}</a>}
//             description={
//               <div>
//                 <Tag color="#ff4d4f">Table {order.tableNumber}</Tag>
//                 <Text>Total: ₹{order.total}</Text>
//               </div>
//             }
//           />
//           <div>
//             {order.items.map((item, index) => (
//               <Tag key={index} style={{ marginBottom: 4 }}>
//                 {item.name} x{item.quantity}
//               </Tag>
//             ))}
//           </div>
//         </List.Item>
//       )}
//     />
//   );

//   const renderDashboard = () => (
//     <>
//       <Row gutter={[16, 16]}>
//         <Col xs={24} sm={8}>
//           <Card>
//             <Statistic
//               title="Total Orders"
//               value={orders.length}
//               valueStyle={{ color: '#ff4d4f' }}
//               prefix={<ShoppingCartOutlined />}
//             />
//           </Card>
//         </Col>
//         <Col xs={24} sm={8}>
//           <Card>
//             <Statistic
//               title="Tables Occupied"
//               value={`${restaurantData.occupiedTables}/${restaurantData.tableCount}`}
//               valueStyle={{ color: '#ff4d4f' }}
//               prefix={<TableOutlined />}
//             />
//           </Card>
//         </Col>
//         <Col xs={24} sm={8}>
//           <Card>
//             <Statistic
//               title="Seating Capacity"
//               value={restaurantData.seatingCapacity}
//               valueStyle={{ color: '#ff4d4f' }}
//               prefix={<UserOutlined />}
//             />
//           </Card>
//         </Col>
//       </Row>
//       <Card style={{ marginTop: 16 }}>
//         <Title level={4}>Table Occupancy</Title>
//         {renderTableOccupancy()}
//         <Progress
//           percent={(restaurantData.occupiedTables / restaurantData.tableCount) * 100}
//           status="active"
//           strokeColor={{
//             '0%': '#52c41a',
//             '100%': '#ff4d4f',
//           }}
//           style={{ marginTop: 16 }}
//         />
//       </Card>
//     </>
//   );

//   if (loading) {
//     return (
//       <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
//         <Spin size="large" tip="Loading orders..." />
//       </div>
//     );
//   }

//   return (
//     <Layout style={{ minHeight: '100vh' }}>
//       <Layout className="site-layout">
//         <Header style={{ padding: 0, background: '#fff' }}>
//           <div style={{ float: 'right', marginRight: 24 }}>
//             <Switch
//               checkedChildren={<SoundOutlined />}
//               unCheckedChildren={<SoundOutlined />}
//               checked={soundEnabled}
//               onChange={setSoundEnabled}
//               style={{ marginRight: 16 }}
//             />
//             <Badge count={newOrders.length}>
//               <BellOutlined style={{ fontSize: 24 }} />
//             </Badge>
//           </div>
//         </Header>
//         <Content style={{ margin: '0 16px' }}>
//           <div style={{ padding: 24, minHeight: 360, background: '#fff' }}>
//             <Title level={2} style={{ marginBottom: 24 }}>Restaurant Dashboard</Title>
//             {renderDashboard()}
//             <Title level={3} style={{ marginTop: 24, marginBottom: 16 }}>Order Management</Title>
//             {renderOrderList()}
//           </div>
//         </Content>
//       </Layout>
//     </Layout>
//   );
// };

// export default AdminOrderComponent;

import React, { useState, useEffect, useRef } from 'react';
import { 
  Layout, Menu, Card, Badge, Tag, Select, Typography, notification, 
  Switch, Spin, List, Avatar, Statistic, Row, Col, Progress, Drawer
} from 'antd';
import { 
  BellOutlined, CheckCircleOutlined, ClockCircleOutlined, 
  ExclamationCircleOutlined, CloseCircleOutlined, SoundOutlined, 
  DashboardOutlined, ShoppingCartOutlined, SettingOutlined, 
  TableOutlined, UserOutlined, MenuOutlined
} from '@ant-design/icons';

const { Header, Content } = Layout;
const { Option } = Select;
const { Title, Text } = Typography;

const AdminOrderComponent = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newOrders, setNewOrders] = useState([]);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [restaurantData, setRestaurantData] = useState({
    seatingCapacity: 50,
    tableCount: 10,
    occupiedTables: 0
  });
  const ws = useRef(null);
  const audioRef = useRef(new Audio('/notification.mp3'));
  const orgId = localStorage.getItem('orgId');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`https://smartserver-json-server.onrender.com/history?orgId=${orgId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }
        const data = await response.json();

        const sortedOrders = data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setOrders(sortedOrders);
        updateRestaurantData(sortedOrders);
      } catch (error) {
        console.error('Failed to fetch orders', error);
        notification.error({ message: 'Failed to fetch orders' });
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();

    ws.current = new WebSocket('wss://legend-sulfuric-ruby.glitch.me');

    ws.current.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'newOrder' && data.order.orgId === orgId) {
        setOrders(prevOrders => {
          const updatedOrders = [data.order, ...prevOrders];
          updateRestaurantData(updatedOrders);
          return updatedOrders;
        });
        setNewOrders(prev => [...prev, data.order.id]);

        if (soundEnabled) {
          audioRef.current.play().catch(error => console.error('Error playing audio:', error));
        }

        notification.open({
          message: 'New Order Arrived',
          description: `Order #${data.order.id} has been placed for Table ${data.order.tableNumber}`,
          icon: <BellOutlined style={{ color: '#1890ff' }} />,
        });
      } else if (data.type === 'statusUpdate' && data.orgId === orgId) {
        setOrders(prevOrders => {
          const updatedOrders = prevOrders.map(order =>
            order.id === data.orderId ? { ...order, status: data.status, statusMessage: data.statusMessage } : order
          );
          updateRestaurantData(updatedOrders);
          return updatedOrders;
        });

        if (soundEnabled) {
          audioRef.current.play().catch(error => console.error('Error playing audio:', error));
        }

        notification.open({
          message: 'Order Status Updated',
          description: `Order #${data.orderId} status: ${data.status}`,
          icon: data.status === 'cancelled' ? <CloseCircleOutlined style={{ color: '#ff4d4f' }} /> : <BellOutlined style={{ color: '#52c41a' }} />,
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

  const updateRestaurantData = (currentOrders) => {
    const occupiedTables = currentOrders.reduce((acc, order) => {
      if (order.status !== 'cancelled' && order.status !== 'ready') {
        acc += 1;
      }
      return acc;
    }, 0);

    setRestaurantData(prevData => ({
      ...prevData,
      occupiedTables: occupiedTables
    }));
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const updatedOrder = orders.find(order => order.id === orderId);
      const statusMessage = getStatusMessage(newStatus);

      const response = await fetch(`https://smartserver-json-server.onrender.com/history/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus, statusMessage, orgId }),
      });

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }

      setOrders(prevOrders => {
        const updatedOrders = prevOrders.map(order =>
          order.id === orderId ? { ...order, status: newStatus, statusMessage } : order
        );
        updateRestaurantData(updatedOrders);
        return updatedOrders;
      });

      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        const message = JSON.stringify({ 
          type: 'statusUpdate', 
          orderId: orderId, 
          status: newStatus,
          statusMessage: statusMessage,
          orgId: orgId
        });
        ws.current.send(message);
      }

      notification.success({ message: `Order #${orderId} status updated to ${newStatus}` });

      setNewOrders(prev => prev.filter(id => id !== orderId));
    } catch (error) {
      console.error('Failed to update order status', error);
      notification.error({ message: 'Failed to update order status' });
    }
  };

  const getStatusMessage = (status) => {
    switch (status) {
      case 'pending': return 'Your order is being processed';
      case 'preparing': return 'Your order is being prepared';
      case 'ready': return 'Your order is ready for pickup';
      case 'delayed': return 'Your order is delayed. We apologize for the inconvenience';
      case 'cancelled': return 'Your order has been cancelled';
      default: return 'Order status unknown';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending': return <ClockCircleOutlined style={{ color: '#faad14' }} />;
      case 'preparing': return <Spin size="small" />;
      case 'ready': return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'delayed': return <ExclamationCircleOutlined style={{ color: '#fa8c16' }} />;
      case 'cancelled': return <CloseCircleOutlined style={{ color: '#f5222d' }} />;
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
      default: return 'default';
    }
  };

  const renderTableOccupancy = () => {
    const { tableCount, occupiedTables } = restaurantData;
    const tables = Array(tableCount).fill(null);
    
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
        {tables.map((_, index) => {
          const isOccupied = index < occupiedTables;
          return (
            <TableOutlined
              key={index}
              style={{
                fontSize: '24px',
                color: isOccupied ? '#ff4d4f' : '#52c41a',
              }}
            />
          );
        })}
      </div>
    );
  };

  const renderOrderList = () => (
    <List
      itemLayout="vertical"
      dataSource={orders}
      renderItem={order => (
        <List.Item
          extra={
            <Select
              defaultValue={order.status}
              style={{ width: '100%', marginTop: 8 }}
              onChange={(value) => handleUpdateStatus(order.id, value)}
            >
              <Option value="pending">Pending</Option>
              <Option value="preparing">Preparing</Option>
              <Option value="ready">Ready</Option>
              <Option value="delayed">Delayed</Option>
              <Option value="cancelled">Cancelled</Option>
            </Select>
          }
        >
          <List.Item.Meta
            avatar={
              <Avatar style={{ backgroundColor: getStatusColor(order.status), verticalAlign: 'middle' }} size="large">
                {getStatusIcon(order.status)}
              </Avatar>
            }
            title={<a href="#">Order #{order.id}</a>}
            description={
              <div>
                <Tag color="#ff4d4f">Table {order.tableNumber}</Tag>
                <Text>Total: ₹{order.total}</Text>
              </div>
            }
          />
          <div style={{ marginTop: 8 }}>
            {order.items.map((item, index) => (
              <Tag key={index} style={{ marginBottom: 4 }}>
                {item.name} x{item.quantity}
              </Tag>
            ))}
          </div>
        </List.Item>
      )}
    />
  );

  const renderDashboard = () => (
    <>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Total Orders"
              value={orders.length}
              valueStyle={{ color: '#ff4d4f' }}
              prefix={<ShoppingCartOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Tables Occupied"
              value={`${restaurantData.occupiedTables}/${restaurantData.tableCount}`}
              valueStyle={{ color: '#ff4d4f' }}
              prefix={<TableOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Seating Capacity"
              value={restaurantData.seatingCapacity}
              valueStyle={{ color: '#ff4d4f' }}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
      </Row>
      <Card style={{ marginTop: 16 }}>
        <Title level={4}>Table Occupancy</Title>
        {renderTableOccupancy()}
        <Progress
          percent={(restaurantData.occupiedTables / restaurantData.tableCount) * 100}
          status="active"
          strokeColor={{
            '0%': '#52c41a',
            '100%': '#ff4d4f',
          }}
          style={{ marginTop: 16 }}
        />
      </Card>
    </>
  );

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" tip="Loading orders..." />
      </div>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Layout className="site-layout">
        <Header style={{ padding: 0, background: '#fff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 16px' }}>
            <MenuOutlined style={{ fontSize: 24 }} onClick={() => setDrawerVisible(true)} />
            <div>
              <Switch
                checkedChildren={<SoundOutlined />}
                unCheckedChildren={<SoundOutlined />}
                checked={soundEnabled}
                onChange={setSoundEnabled}
                style={{ marginRight: 16 }}
              />
              <Badge count={newOrders.length}>
                <BellOutlined style={{ fontSize: 24 }} />
              </Badge>
            </div>
          </div>
        </Header>
        <Content style={{ margin: '0 16px' }}>
          <div style={{ padding: 24, minHeight: 360, background: '#fff' }}>
            <Title level={2} style={{ marginBottom: 24, marginTop: 48 }}>Restaurant Dashboard</Title>
            {renderDashboard()}
            <Title level={3} style={{ marginTop: 24, marginBottom: 16 }}>Order Management</Title>
            {renderOrderList()}
          </div>
        </Content>
      </Layout>
      <Drawer
        title="Menu"
        placement="left"
        closable={true}
        onClose={() => setDrawerVisible(false)}
        visible={drawerVisible}
      >
        <Menu mode="vertical" defaultSelectedKeys={['1']}>
          <Menu.Item key="1" icon={<DashboardOutlined />}>
            Dashboard
          </Menu.Item>
          <Menu.Item key="2" icon={<ShoppingCartOutlined />}>
            Orders
          </Menu.Item>
          <Menu.Item key="3" icon={<SettingOutlined />}>
            Settings
          </Menu.Item>
        </Menu>
      </Drawer>
    </Layout>
  );
};

export default AdminOrderComponent;