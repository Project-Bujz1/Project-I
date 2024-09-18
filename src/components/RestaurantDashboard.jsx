// import React, { useState, useEffect } from 'react';
// import { 
//   Layout, Card, Typography, notification, 
//   Spin, Statistic, Row, Col, Progress, Switch
// } from 'antd';
// import { 
//   ShoppingCartOutlined, UserOutlined, SettingOutlined
// } from '@ant-design/icons';
// import { MdOutlineTableRestaurant } from "react-icons/md";

// const { Content } = Layout;
// const { Title } = Typography;

// export const RestaurantDashboard = () => {
//   const [restaurant, setRestaurant] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [settings, setSettings] = useState({
//     enableRestaurantManagement: true,
//     enableHistory: true,
//   });
//   const orgId = localStorage.getItem('orgId');

//   useEffect(() => {
//     const fetchRestaurantData = async () => {
//       try {
//         const response = await fetch(`https://smartserver-json-server.onrender.com/restaurants?orgId=${orgId}`);
//         if (!response.ok) {
//           throw new Error('Failed to fetch restaurant data');
//         }
//         const data = await response.json();
//         if (data.length > 0) {
//           setRestaurant(data[0]);
//           // Fetch settings if they exist, otherwise use defaults
//           const settingsResponse = await fetch(`https://smartserver-json-server.onrender.com/settings/${orgId}`);
//           if (settingsResponse.ok) {
//             const settingsData = await settingsResponse.json();
//             setSettings(settingsData);
//           }
//         } else {
//           throw new Error('Restaurant not found');
//         }
//       } catch (error) {
//         console.error('Failed to fetch restaurant data', error);
//         notification.error({ message: 'Failed to fetch restaurant data' });
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRestaurantData();
//   }, [orgId]);

//   const updateSettings = async (key, value) => {
//     try {
//       const updatedSettings = { ...settings, [key]: value };
//       setSettings(updatedSettings);

//       const response = await fetch(`https://smartserver-json-server.onrender.com/settings/${orgId}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(updatedSettings),
//       });

//       if (!response.ok) {
//         throw new Error('Failed to update settings');
//       }

//       notification.success({ message: 'Settings updated successfully' });
//     } catch (error) {
//       console.error('Failed to update settings', error);
//       notification.error({ message: 'Failed to update settings' });
//     }
//   };

//   const renderTableOccupancy = () => {
//     if (!restaurant) return null;
//     const tableCount = Math.ceil(restaurant.seatingCapacity / 4); // Assuming 4 seats per table
//     const occupiedTables = Math.ceil(restaurant.peopleCount / 4);
//     const tables = Array(tableCount).fill(null);
    
//     return (
//       <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
//         {tables.map((_, index) => {
//           const isOccupied = index < occupiedTables;
//           return (
//             <MdOutlineTableRestaurant
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

//   const renderDashboard = () => (
//     <>
//       <Row gutter={[16, 16]}>
//         <Col xs={24} sm={8}>
//           <Card>
//             <Statistic
//               title="Total Capacity"
//               value={restaurant.seatingCapacity}
//               valueStyle={{ color: '#ff4d4f' }}
//               prefix={<UserOutlined />}
//             />
//           </Card>
//         </Col>
//         <Col xs={24} sm={8}>
//           <Card>
//             <Statistic
//               title="Current Occupancy"
//               value={restaurant.peopleCount}
//               valueStyle={{ color: '#ff4d4f' }}
//               prefix={<ShoppingCartOutlined />}
//             />
//           </Card>
//         </Col>
//         <Col xs={24} sm={8}>
//           <Card>
//             <Statistic
//               title="Tables Occupied"
//               value={`${Math.ceil(restaurant.peopleCount / 4)}/${Math.ceil(restaurant.seatingCapacity / 4)}`}
//               valueStyle={{ color: '#ff4d4f' }}
//               prefix={<MdOutlineTableRestaurant />}
//             />
//           </Card>
//         </Col>
//       </Row>
//       <Card style={{ marginTop: 16 }}>
//         <Title level={4}>Table Occupancy</Title>
//         {renderTableOccupancy()}
//         <Progress
//           percent={(restaurant.peopleCount / restaurant.seatingCapacity) * 100}
//           status="active"
//           strokeColor={{
//             '0%': '#52c41a',
//             '100%': '#ff4d4f',
//           }}
//           style={{ marginTop: 16 }}
//         />
//       </Card>
//       <Card style={{ marginTop: 16 }}>
//         <Title level={4}>Settings</Title>
//         <Row gutter={[16, 16]}>
//           <Col span={12}>
//             <Switch
//               checked={settings.enableRestaurantManagement}
//               onChange={(checked) => updateSettings('enableRestaurantManagement', checked)}
//             /> Enable Restaurant Management
//           </Col>
//           <Col span={12}>
//             <Switch
//               checked={settings.enableHistory}
//               onChange={(checked) => updateSettings('enableHistory', checked)}
//             /> Enable History
//           </Col>
//         </Row>
//       </Card>
//     </>
//   );

//   if (loading) {
//     return (
//       <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
//         <Spin size="large" tip="Loading restaurant data..." />
//       </div>
//     );
//   }

//   return (
//     <Layout className="site-layout" style={{marginTop: '95px'}}>
//       <Content style={{ margin: '0 16px' }}>
//         <div style={{ padding: 24, minHeight: 360, background: '#fff' }}>
//           <Title level={2} style={{ marginBottom: 24, marginTop: 48 }}>Restaurant Dashboard</Title>
//           {restaurant ? renderDashboard() : <p>No restaurant data available.</p>}
//         </div>
//       </Content>
//     </Layout>
//   );
// };

// export default RestaurantDashboard;

// import React, { useState, useEffect } from 'react';
// import { 
//   Layout, Card, Typography, notification, 
//   Spin, Statistic, Row, Col, Progress, Switch, Tooltip
// } from 'antd';
// import { 
//   UserOutlined, SettingOutlined, HistoryOutlined,
//   TableOutlined, DollarOutlined, ShoppingOutlined
// } from '@ant-design/icons';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

// const { Content } = Layout;
// const { Title, Text } = Typography;

// export const RestaurantDashboard = () => {
//   const [restaurant, setRestaurant] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [settings, setSettings] = useState({
//     enableRestaurantManagement: true,
//     enableHistory: true,
//   });
//   const [orderHistory, setOrderHistory] = useState([]);
//   const orgId = localStorage.getItem('orgId');

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [restaurantResponse, settingsResponse, orderHistoryResponse] = await Promise.all([
//           fetch(`https://smartserver-json-server.onrender.com/restaurants?orgId=${orgId}`),
//           fetch(`https://smartserver-json-server.onrender.com/settings/${orgId}`),
//           fetch(`https://smartserver-json-server.onrender.com/history?orgId=${orgId}`)
//         ]);

//         if (!restaurantResponse.ok) throw new Error('Failed to fetch restaurant data');
//         const restaurantData = await restaurantResponse.json();
//         if (restaurantData.length > 0) setRestaurant(restaurantData[0]);
//         else throw new Error('Restaurant not found');

//         if (settingsResponse.ok) {
//           const settingsData = await settingsResponse.json();
//           setSettings(settingsData);
//         }

//         if (orderHistoryResponse.ok) {
//           const orderHistoryData = await orderHistoryResponse.json();
//           setOrderHistory(orderHistoryData);
//         }
//       } catch (error) {
//         console.error('Failed to fetch data', error);
//         notification.error({ message: 'Failed to fetch data' });
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [orgId]);

//   const updateSettings = async (key, value) => {
//     try {
//       const updatedSettings = { ...settings, [key]: value };
//       setSettings(updatedSettings);

//       const response = await fetch(`https://smartserver-json-server.onrender.com/settings/${orgId}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(updatedSettings),
//       });

//       if (!response.ok) throw new Error('Failed to update settings');
//       notification.success({ message: 'Settings updated successfully' });
//     } catch (error) {
//       console.error('Failed to update settings', error);
//       notification.error({ message: 'Failed to update settings' });
//     }
//   };

//   const calculateOccupancy = () => {
//     if (!restaurant || !orderHistory.length) return 0;
//     const activeOrders = orderHistory.filter(order => order.status === 'active');
//     return activeOrders.reduce((sum, order) => sum + order.partySize, 0);
//   };

//   const renderTableOccupancy = () => {
//     if (!restaurant) return null;
//     const occupancy = calculateOccupancy();
//     const tables = Array(restaurant.seatingCapacity).fill(null);
    
//     return (
//       <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
//         {tables.map((_, index) => {
//           const isOccupied = index < occupancy;
//           return (
//             <Tooltip title={isOccupied ? 'Occupied' : 'Available'} key={index}>
//               <TableOutlined
//                 style={{
//                   fontSize: '24px',
//                   color: isOccupied ? '#ff4d4f' : '#52c41a',
//                 }}
//               />
//             </Tooltip>
//           );
//         })}
//       </div>
//     );
//   };

//   const renderOrderHistoryChart = () => {
//     const chartData = orderHistory
//       .slice(-7)
//       .map(order => ({
//         date: new Date(order.date).toLocaleDateString(),
//         revenue: order.total
//       }));

//     return (
//       <ResponsiveContainer width="100%" height={300}>
//         <BarChart data={chartData}>
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="date" />
//           <YAxis />
//           <RechartsTooltip />
//           <Bar dataKey="revenue" fill="#8884d8" />
//         </BarChart>
//       </ResponsiveContainer>
//     );
//   };

//   const renderDashboard = () => {
//     const occupancy = calculateOccupancy();
//     const occupancyPercentage = (occupancy / restaurant.peopleCount) * 100;
//     const totalRevenue = orderHistory.reduce((sum, order) => sum + order.total, 0);

//     return (
//       <>
//         <Row gutter={[16, 16]}>
//           <Col xs={24} sm={8}>
//             <Card hoverable>
//               <Statistic
//                 title="Total Capacity"
//                 value={restaurant.peopleCount}
//                 valueStyle={{ color: '#1890ff' }}
//                 prefix={<UserOutlined />}
//               />
//             </Card>
//           </Col>
//           <Col xs={24} sm={8}>
//             <Card hoverable>
//               <Statistic
//                 title="Current Occupancy"
//                 value={occupancy}
//                 valueStyle={{ color: '#52c41a' }}
//                 prefix={<ShoppingOutlined />}
//               />
//             </Card>
//           </Col>
//           <Col xs={24} sm={8}>
//             <Card hoverable>
//               <Statistic
//                 title="Tables Available"
//                 value={`${restaurant.seatingCapacity - occupancy}/${restaurant.seatingCapacity}`}
//                 valueStyle={{ color: '#faad14' }}
//                 prefix={<TableOutlined />}
//               />
//             </Card>
//           </Col>
//         </Row>
//         <Card hoverable style={{ marginTop: 16 }}>
//           <Title level={4}>Table Occupancy</Title>
//           {renderTableOccupancy()}
//           <Progress
//             percent={occupancyPercentage}
//             status="active"
//             strokeColor={{
//               '0%': '#52c41a',
//               '100%': '#ff4d4f',
//             }}
//             style={{ marginTop: 16 }}
//           />
//         </Card>
//         <Card hoverable style={{ marginTop: 16 }}>
//           <Title level={4}>Revenue Overview</Title>
//           <Statistic
//             title="Total Revenue"
//             value={totalRevenue}
//             precision={2}
//             valueStyle={{ color: '#3f8600' }}
//             prefix={<DollarOutlined />}
//           />
//           {renderOrderHistoryChart()}
//         </Card>
//         <Card hoverable style={{ marginTop: 16 }}>
//           <Title level={4}>Settings</Title>
//           <Row gutter={[16, 16]}>
//             <Col span={12}>
//               <Switch
//                 checked={settings.enableRestaurantManagement}
//                 onChange={(checked) => updateSettings('enableRestaurantManagement', checked)}
//               /> <Text>Enable Restaurant Management</Text>
//             </Col>
//             <Col span={12}>
//               <Switch
//                 checked={settings.enableHistory}
//                 onChange={(checked) => updateSettings('enableHistory', checked)}
//               /> <Text>Enable History</Text>
//             </Col>
//           </Row>
//         </Card>
//       </>
//     );
//   };

//   if (loading) {
//     return (
//       <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
//         <Spin size="large" tip="Loading restaurant data..." />
//       </div>
//     );
//   }

//   return (
//     <Layout className="site-layout" style={{marginTop: '95px'}}>
//       <Content style={{ margin: '0 16px' }}>
//         <div style={{ padding: 24, minHeight: 360, background: '#fff' }}>
//           <Title level={2} style={{ marginBottom: 24, marginTop: 48 }}>Restaurant Dashboard</Title>
//           {restaurant ? renderDashboard() : <p>No restaurant data available.</p>}
//         </div>
//       </Content>
//     </Layout>
//   );
// };

// export default RestaurantDashboard;

// import React, { useState, useEffect } from 'react';
// import { 
//   Layout, Card, Typography, notification, 
//   Spin, Statistic, Row, Col, Progress, Switch
// } from 'antd';
// import { 
//   UserOutlined, TableOutlined, DollarOutlined, ShoppingOutlined
// } from '@ant-design/icons';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

// const { Content } = Layout;
// const { Title, Text } = Typography;

// export const RestaurantDashboard = () => {
//   const [restaurant, setRestaurant] = useState(null);
//   const [history, setHistory] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [settings, setSettings] = useState({
//     enableRestaurantManagement: true,
//     enableHistory: true,
//   });
//   const orgId = localStorage.getItem('orgId');

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Simulating API calls with the provided data
//         const restaurantData = {
//           "id": "2",
//           "orgId": "1",
//           "name": "Biryanis and More",
//           "seatingCapacity": 30,
//           "peopleCount": 120,
//         };
//         const historyData = [
//           {
//             "id": 1725095422360,
//             "items": [
//               {
//                 "id": 3,
//                 "name": "Vegetable Pulav",
//                 "price": 180,
//                 "quantity": 1
//               }
//             ],
//             "total": "180.00",
//             "tableNumber": "1",
//             "timestamp": "2024-08-31T09:10:22.360Z"
//           },
//         ];
//         const settingsData = {
//           "id": "1",
//           "orgId": "1",
//           "enableRestaurantManagement": true,
//           "enableHistory": true
//         };

//         setRestaurant(restaurantData);
//         setHistory(historyData);
//         setSettings(settingsData);
//       } catch (error) {
//         console.error('Failed to fetch data', error);
//         notification.error({ message: 'Failed to fetch data' });
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [orgId]);

//   const updateSettings = async (key, value) => {
//     try {
//       const updatedSettings = { ...settings, [key]: value };
//       setSettings(updatedSettings);
//       // Simulating API call to update settings
//       console.log('Settings updated:', updatedSettings);
//       notification.success({ message: 'Settings updated successfully' });
//     } catch (error) {
//       console.error('Failed to update settings', error);
//       notification.error({ message: 'Failed to update settings' });
//     }
//   };

//   const calculateOccupancy = () => {
//     if (!restaurant || !history.length) return 0;
//     // For this example, we'll use the number of orders as a proxy for occupancy
//     return history.length;
//   };

//   const renderTableOccupancy = () => {
//     if (!restaurant) return null;
//     const occupancy = calculateOccupancy();
//     const tables = Array(restaurant.seatingCapacity).fill(null);
    
//     return (
//       <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
//         {tables.map((_, index) => {
//           const isOccupied = index < occupancy;
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

//   const renderOrderHistoryChart = () => {
//     const chartData = history.map(order => ({
//       date: new Date(order.timestamp).toLocaleDateString(),
//       revenue: parseFloat(order.total)
//     }));

//     return (
//       <ResponsiveContainer width="100%" height={300}>
//         <BarChart data={chartData}>
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="date" />
//           <YAxis />
//           <RechartsTooltip />
//           <Bar dataKey="revenue" fill="#8884d8" />
//         </BarChart>
//       </ResponsiveContainer>
//     );
//   };

//   const renderDashboard = () => {
//     const occupancy = calculateOccupancy();
//     const occupancyPercentage = (occupancy / restaurant.seatingCapacity) * 100;
//     const totalRevenue = history.reduce((sum, order) => sum + parseFloat(order.total), 0);

//     return (
//       <>
//         <Row gutter={[16, 16]}>
//           <Col xs={24} sm={8}>
//             <Card hoverable>
//               <Statistic
//                 title="Total Capacity"
//                 value={restaurant.peopleCount}
//                 valueStyle={{ color: '#1890ff' }}
//                 prefix={<UserOutlined />}
//               />
//             </Card>
//           </Col>
//           <Col xs={24} sm={8}>
//             <Card hoverable>
//               <Statistic
//                 title="Current Occupancy"
//                 value={occupancy}
//                 valueStyle={{ color: '#52c41a' }}
//                 prefix={<ShoppingOutlined />}
//               />
//             </Card>
//           </Col>
//           <Col xs={24} sm={8}>
//             <Card hoverable>
//               <Statistic
//                 title="Tables Available"
//                 value={`${restaurant.seatingCapacity - occupancy}/${restaurant.seatingCapacity}`}
//                 valueStyle={{ color: '#faad14' }}
//                 prefix={<TableOutlined />}
//               />
//             </Card>
//           </Col>
//         </Row>
//         <Card hoverable style={{ marginTop: 16 }}>
//           <Title level={4}>Table Occupancy</Title>
//           {renderTableOccupancy()}
//           <Progress
//             percent={occupancyPercentage}
//             status="active"
//             strokeColor={{
//               '0%': '#52c41a',
//               '100%': '#ff4d4f',
//             }}
//             style={{ marginTop: 16 }}
//           />
//         </Card>
//         <Card hoverable style={{ marginTop: 16 }}>
//           <Title level={4}>Revenue Overview</Title>
//           <Statistic
//             title="Total Revenue"
//             value={totalRevenue}
//             precision={2}
//             valueStyle={{ color: '#3f8600' }}
//             prefix={<DollarOutlined />}
//           />
//           {renderOrderHistoryChart()}
//         </Card>
//         <Card hoverable style={{ marginTop: 16 }}>
//           <Title level={4}>Settings</Title>
//           <Row gutter={[16, 16]}>
//             <Col span={12}>
//               <Switch
//                 checked={settings.enableRestaurantManagement}
//                 onChange={(checked) => updateSettings('enableRestaurantManagement', checked)}
//               /> <Text>Enable Restaurant Management</Text>
//             </Col>
//             <Col span={12}>
//               <Switch
//                 checked={settings.enableHistory}
//                 onChange={(checked) => updateSettings('enableHistory', checked)}
//               /> <Text>Enable History</Text>
//             </Col>
//           </Row>
//         </Card>
//       </>
//     );
//   };

//   if (loading) {
//     return (
//       <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
//         <Spin size="large" tip="Loading restaurant data..." />
//       </div>
//     );
//   }

//   return (
//     <Layout className="site-layout" style={{marginTop: '95px'}}>
//       <Content style={{ margin: '0 16px' }}>
//         <div style={{ padding: 24, minHeight: 360, background: '#fff' }}>
//           <Title level={2} style={{ marginBottom: 24, marginTop: 48 }}>Restaurant Dashboard</Title>
//           {restaurant ? renderDashboard() : <p>No restaurant data available.</p>}
//         </div>
//       </Content>
//     </Layout>
//   );
// };

// export default RestaurantDashboard;

// import React, { useState, useEffect } from 'react';
// import { 
//   Layout, Card, Typography, notification, Spin, Statistic, Row, Col, Progress, Switch,
//   Select, DatePicker, Space
// } from 'antd';
// import { 
//   UserOutlined, TableOutlined, ShoppingOutlined
// } from '@ant-design/icons';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
// import axios from 'axios';

// const { Content } = Layout;
// const { Title, Text } = Typography;
// const { RangePicker } = DatePicker;

// const CurrencyIcon = () => (
//   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <path d="M18 7c0-5.333-8-5.333-8 0" />
//     <path d="M10 7v14" />
//     <path d="M6 21h12" />
//     <path d="M6 13h10" />
//   </svg>
// );

// export const RestaurantDashboard = () => {
//   const [restaurant, setRestaurant] = useState(null);
//   const [history, setHistory] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [settings, setSettings] = useState({});
//   const [dateRange, setDateRange] = useState([null, null]);
//   const [analysisType, setAnalysisType] = useState('daily');
//   const orgId = localStorage.getItem('orgId');

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [restaurantRes, historyRes, settingsRes] = await Promise.all([
//           axios.get(`https://smartserver-json-server.onrender.com/restaurants?orgId=${orgId}`),
//           axios.get(`https://smartserver-json-server.onrender.com/history`),
//           axios.get(`https://smartserver-json-server.onrender.com/settings?orgId=${orgId}`)
//         ]);

//         setRestaurant(restaurantRes.data[0]);
//         setHistory(historyRes.data);
//         setSettings(settingsRes.data[0]);
//       } catch (error) {
//         console.error('Failed to fetch data', error);
//         notification.error({ message: 'Failed to fetch data' });
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [orgId]);

//   const updateSettings = async (key, value) => {
//     try {
//       const updatedSettings = { ...settings, [key]: value };
//       await axios.patch(`https://smartserver-json-server.onrender.com/settings/${settings.id}`, updatedSettings);
//       setSettings(updatedSettings);
//       notification.success({ message: 'Settings updated successfully' });
//     } catch (error) {
//       console.error('Failed to update settings', error);
//       notification.error({ message: 'Failed to update settings' });
//     }
//   };

//   const calculateOccupancy = () => {
//     if (!restaurant || !history.length) return 0;
//     return history.length; // This is a simplification, you might want to implement a more accurate calculation
//   };

//   const renderTableOccupancy = () => {
//     if (!restaurant) return null;
//     const occupancy = calculateOccupancy();
//     const tables = Array(restaurant.seatingCapacity).fill(null);
    
//     return (
//       <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
//         {tables.map((_, index) => {
//           const isOccupied = index < occupancy;
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

//   const filterDataByDateRange = (data) => {
//     if (!dateRange[0] || !dateRange[1]) return data;
//     const [start, end] = dateRange;
//     return data.filter(item => {
//       const itemDate = new Date(item.timestamp);
//       return itemDate >= start && itemDate <= end;
//     });
//   };

//   const aggregateData = (data) => {
//     const aggregated = {};
//     data.forEach(item => {
//       const date = new Date(item.timestamp);
//       let key;
//       switch (analysisType) {
//         case 'daily':
//           key = date.toISOString().split('T')[0];
//           break;
//         case 'weekly':
//           const weekStart = new Date(date.setDate(date.getDate() - date.getDay()));
//           key = weekStart.toISOString().split('T')[0];
//           break;
//         case 'monthly':
//           key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
//           break;
//         case 'yearly':
//           key = date.getFullYear().toString();
//           break;
//         default:
//           key = date.toISOString().split('T')[0];
//       }
//       if (!aggregated[key]) {
//         aggregated[key] = { date: key, revenue: 0, itemsSold: {} };
//       }
//       aggregated[key].revenue += parseFloat(item.total);
//       item.items.forEach(orderItem => {
//         if (!aggregated[key].itemsSold[orderItem.name]) {
//           aggregated[key].itemsSold[orderItem.name] = 0;
//         }
//         aggregated[key].itemsSold[orderItem.name] += orderItem.quantity;
//       });
//     });
//     return Object.values(aggregated);
//   };

//   const renderRevenueChart = () => {
//     const filteredData = filterDataByDateRange(history);
//     const chartData = aggregateData(filteredData);

//     return (
//       <ResponsiveContainer width="100%" height={300}>
//         <LineChart data={chartData}>
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="date" />
//           <YAxis />
//           <Tooltip />
//           <Line type="monotone" dataKey="revenue" stroke="#8884d8" activeDot={{ r: 8 }} />
//         </LineChart>
//       </ResponsiveContainer>
//     );
//   };

//   const renderTopItems = () => {
//     const filteredData = filterDataByDateRange(history);
//     const itemSales = {};
//     filteredData.forEach(order => {
//       order.items.forEach(item => {
//         if (!itemSales[item.name]) itemSales[item.name] = 0;
//         itemSales[item.name] += item.quantity;
//       });
//     });
//     const sortedItems = Object.entries(itemSales).sort((a, b) => b[1] - a[1]);
//     return (
//       <ul style={{ paddingLeft: '20px' }}>
//         {sortedItems.slice(0, 5).map(([name, quantity]) => (
//           <li key={name}>{name}: {quantity} sold</li>
//         ))}
//       </ul>
//     );
//   };

//   const renderDashboard = () => {
//     const occupancy = calculateOccupancy();
//     const occupancyPercentage = (occupancy / restaurant.seatingCapacity) * 100;
//     const totalRevenue = history.reduce((sum, order) => sum + parseFloat(order.total), 0);

//     return (
//       <Space direction="vertical" size="large" style={{ width: '100%' }}>
//         <Row gutter={[16, 16]}>
//           <Col xs={24} sm={8}>
//             <Card hoverable>
//               <Statistic
//                 title="Total Capacity"
//                 value={restaurant.peopleCount}
//                 valueStyle={{ color: '#1890ff' }}
//                 prefix={<UserOutlined />}
//               />
//             </Card>
//           </Col>
//           <Col xs={24} sm={8}>
//             <Card hoverable>
//               <Statistic
//                 title="Current Occupancy"
//                 value={occupancy}
//                 valueStyle={{ color: '#52c41a' }}
//                 prefix={<ShoppingOutlined />}
//               />
//             </Card>
//           </Col>
//           <Col xs={24} sm={8}>
//             <Card hoverable>
//               <Statistic
//                 title="Tables Available"
//                 value={`${restaurant.seatingCapacity - occupancy}/${restaurant.seatingCapacity}`}
//                 valueStyle={{ color: '#faad14' }}
//                 prefix={<TableOutlined />}
//               />
//             </Card>
//           </Col>
//         </Row>
//         <Card hoverable>
//           <Title level={4}>Table Occupancy</Title>
//           {renderTableOccupancy()}
//           <Progress
//             percent={occupancyPercentage}
//             status="active"
//             strokeColor={{
//               '0%': '#52c41a',
//               '100%': '#ff4d4f',
//             }}
//             style={{ marginTop: '16px' }}
//           />
//         </Card>
//         <Card hoverable>
//           <Title level={4}>Revenue Overview</Title>
//           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
//             <Statistic
//               title="Total Revenue"
//               value={totalRevenue}
//               precision={2}
//               valueStyle={{ color: '#3f8600' }}
//               prefix={<CurrencyIcon />}
//             />
//             <Space>
//               <Select
//                 defaultValue="daily"
//                 onChange={setAnalysisType}
//                 style={{ width: 120 }}
//               >
//                 <Select.Option value="daily">Daily</Select.Option>
//                 <Select.Option value="weekly">Weekly</Select.Option>
//                 <Select.Option value="monthly">Monthly</Select.Option>
//                 <Select.Option value="yearly">Yearly</Select.Option>
//               </Select>
//               <RangePicker onChange={setDateRange} />
//             </Space>
//           </div>
//           {renderRevenueChart()}
//         </Card>
//         <Card hoverable>
//           <Title level={4}>Top Selling Items</Title>
//           {renderTopItems()}
//         </Card>
//         <Card hoverable>
//           <Title level={4}>Settings</Title>
//           <Row gutter={[16, 16]}>
//             <Col span={12}>
//               <Switch
//                 checked={settings.enableRestaurantManagement}
//                 onChange={(checked) => updateSettings('enableRestaurantManagement', checked)}
//               /> <Text>Enable Restaurant Management</Text>
//             </Col>
//             <Col span={12}>
//               <Switch
//                 checked={settings.enableHistory}
//                 onChange={(checked) => updateSettings('enableHistory', checked)}
//               /> <Text>Enable History</Text>
//             </Col>
//           </Row>
//         </Card>
//       </Space>
//     );
//   };

//   if (loading) {
//     return (
//       <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
//         <Spin size="large" tip="Loading restaurant data..." />
//       </div>
//     );
//   }

//   return (
//     <Layout className="site-layout" style={{ marginTop: '24px' }}>
//       <Content style={{ margin: '0 16px' }}>
//         <div style={{ padding: 24, minHeight: 360, background: '#fff' }}>
//           <Title level={2} style={{ marginBottom: 24 }}>Restaurant Dashboard</Title>
//           {restaurant ? renderDashboard() : <p>No restaurant data available.</p>}
//         </div>
//       </Content>
//     </Layout>
//   );
// };

// export default RestaurantDashboard;


// import React, { useState, useEffect } from 'react';
// import { 
//   Layout, Card, Typography, notification, Spin, Statistic, Row, Col, Progress, Switch,
//   Select, DatePicker, Space, Button, Drawer
// } from 'antd';
// import { 
//   UserOutlined, TableOutlined, ShoppingOutlined, MenuOutlined, BarChartOutlined,
//   SettingOutlined, CloseOutlined
// } from '@ant-design/icons';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
// import axios from 'axios';

// const { Content } = Layout;
// const { Title, Text } = Typography;
// const { RangePicker } = DatePicker;

// const CurrencyIcon = () => (
//   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <path d="M18 7c0-5.333-8-5.333-8 0" />
//     <path d="M10 7v14" />
//     <path d="M6 21h12" />
//     <path d="M6 13h10" />
//   </svg>
// );

// const themeColors = {
//   primary: '#e53935',
//   secondary: '#ffffff',
//   text: '#333333',
//   background: '#f5f5f5',
// };

// const styles = {
//   layout: {
//     background: themeColors.background,
//     minHeight: '100vh',
//   },
//   header: {
//     position: 'fixed',
//     zIndex: 1,
//     width: '100%',
//     background: themeColors.primary,
//     padding: '10px 20px',
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   headerTitle: {
//     color: themeColors.secondary,
//     margin: 0,
//   },
//   content: {
//     margin: '64px 16px 0',
//     overflow: 'initial',
//     padding: '24px',
//     minHeight: 'calc(100vh - 64px)',
//   },
//   card: {
//     borderRadius: '10px',
//     boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
//     marginBottom: '20px',
//   },
//   statCard: {
//     background: themeColors.primary,
//     color: themeColors.secondary,
//     borderRadius: '10px',
//     padding: '20px',
//     height: '100%',
//   },
//   chartCard: {
//     background: themeColors.secondary,
//     borderRadius: '10px',
//     padding: '20px',
//   },
//   settingsCard: {
//     background: themeColors.secondary,
//     borderRadius: '10px',
//     padding: '20px',
//   },
// };

// export const RestaurantDashboard = () => {
//   const [restaurant, setRestaurant] = useState(null);
//   const [history, setHistory] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [settings, setSettings] = useState({});
//   const [dateRange, setDateRange] = useState([null, null]);
//   const [analysisType, setAnalysisType] = useState('daily');
//   const [drawerVisible, setDrawerVisible] = useState(false);
//   const orgId = localStorage.getItem('orgId');

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [restaurantRes, historyRes, settingsRes] = await Promise.all([
//           axios.get(`https://smartserver-json-server.onrender.com/restaurants?orgId=${orgId}`),
//           axios.get(`https://smartserver-json-server.onrender.com/history`),
//           axios.get(`https://smartserver-json-server.onrender.com/settings?orgId=${orgId}`)
//         ]);

//         setRestaurant(restaurantRes.data[0]);
//         setHistory(historyRes.data);
//         setSettings(settingsRes.data[0]);
//       } catch (error) {
//         console.error('Failed to fetch data', error);
//         notification.error({ message: 'Failed to fetch data' });
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [orgId]);

//   const updateSettings = async (key, value) => {
//     try {
//       const updatedSettings = { ...settings, [key]: value };
//       await axios.patch(`https://smartserver-json-server.onrender.com/settings/${settings.id}`, updatedSettings);
//       setSettings(updatedSettings);
//       notification.success({ message: 'Settings updated successfully' });
//     } catch (error) {
//       console.error('Failed to update settings', error);
//       notification.error({ message: 'Failed to update settings' });
//     }
//   };

//   const calculateOccupancy = () => {
//     if (!restaurant || !history.length) return 0;
//     return history.length;
//   };

//   const renderTableOccupancy = () => {
//     if (!restaurant) return null;
//     const occupancy = calculateOccupancy();
//     const tables = Array(restaurant.seatingCapacity).fill(null);
    
//     return (
//       <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
//         {tables.map((_, index) => {
//           const isOccupied = index < occupancy;
//           return (
//             <TableOutlined
//               key={index}
//               style={{
//                 fontSize: '24px',
//                 color: isOccupied ? themeColors.primary : themeColors.secondary,
//                 background: isOccupied ? themeColors.secondary : themeColors.primary,
//                 padding: '5px',
//                 borderRadius: '5px',
//               }}
//             />
//           );
//         })}
//       </div>
//     );
//   };

//   const filterDataByDateRange = (data) => {
//     if (!dateRange[0] || !dateRange[1]) return data;
//     const [start, end] = dateRange;
//     return data.filter(item => {
//       const itemDate = new Date(item.timestamp);
//       return itemDate >= start && itemDate <= end;
//     });
//   };

//   const aggregateData = (data) => {
//     const aggregated = {};
//     data.forEach(item => {
//       const date = new Date(item.timestamp);
//       let key;
//       switch (analysisType) {
//         case 'daily':
//           key = date.toISOString().split('T')[0];
//           break;
//         case 'weekly':
//           const weekStart = new Date(date.setDate(date.getDate() - date.getDay()));
//           key = weekStart.toISOString().split('T')[0];
//           break;
//         case 'monthly':
//           key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
//           break;
//         case 'yearly':
//           key = date.getFullYear().toString();
//           break;
//         default:
//           key = date.toISOString().split('T')[0];
//       }
//       if (!aggregated[key]) {
//         aggregated[key] = { date: key, revenue: 0, itemsSold: {} };
//       }
//       aggregated[key].revenue += parseFloat(item.total);
//       item.items.forEach(orderItem => {
//         if (!aggregated[key].itemsSold[orderItem.name]) {
//           aggregated[key].itemsSold[orderItem.name] = 0;
//         }
//         aggregated[key].itemsSold[orderItem.name] += orderItem.quantity;
//       });
//     });
//     return Object.values(aggregated);
//   };

//   const renderRevenueChart = () => {
//     const filteredData = filterDataByDateRange(history);
//     const chartData = aggregateData(filteredData);

//     return (
//       <ResponsiveContainer width="100%" height={300}>
//         <LineChart data={chartData}>
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="date" />
//           <YAxis />
//           <Tooltip />
//           <Line type="monotone" dataKey="revenue" stroke={themeColors.primary} activeDot={{ r: 8 }} />
//         </LineChart>
//       </ResponsiveContainer>
//     );
//   };

//   const renderTopItems = () => {
//     const filteredData = filterDataByDateRange(history);
//     const itemSales = {};
//     filteredData.forEach(order => {
//       order.items.forEach(item => {
//         if (!itemSales[item.name]) itemSales[item.name] = 0;
//         itemSales[item.name] += item.quantity;
//       });
//     });
//     const sortedItems = Object.entries(itemSales).sort((a, b) => b[1] - a[1]);
//     return (
//       <ul style={{ paddingLeft: '20px', color: themeColors.text }}>
//         {sortedItems.slice(0, 5).map(([name, quantity]) => (
//           <li key={name}>{name}: {quantity} sold</li>
//         ))}
//       </ul>
//     );
//   };

//   const renderDashboard = () => {
//     const occupancy = calculateOccupancy();
//     const occupancyPercentage = (occupancy / restaurant.seatingCapacity) * 100;
//     const totalRevenue = history.reduce((sum, order) => sum + parseFloat(order.total), 0);

//     return (
//       <Space direction="vertical" size="large" style={{ width: '100%' }}>
//         <Row gutter={[16, 16]}>
//           <Col xs={24} sm={8}>
//             <Card style={styles.statCard}>
//               <Statistic
//                 title={<span style={{ color: themeColors.secondary }}>Total Capacity</span>}
//                 value={restaurant.peopleCount}
//                 valueStyle={{ color: themeColors.secondary }}
//                 prefix={<UserOutlined />}
//               />
//             </Card>
//           </Col>
//           <Col xs={24} sm={8}>
//             <Card style={styles.statCard}>
//               <Statistic
//                 title={<span style={{ color: themeColors.secondary }}>Current Occupancy</span>}
//                 value={occupancy}
//                 valueStyle={{ color: themeColors.secondary }}
//                 prefix={<ShoppingOutlined />}
//               />
//             </Card>
//           </Col>
//           <Col xs={24} sm={8}>
//             <Card style={styles.statCard}>
//               <Statistic
//                 title={<span style={{ color: themeColors.secondary }}>Tables Available</span>}
//                 value={`${restaurant.seatingCapacity - occupancy}/${restaurant.seatingCapacity}`}
//                 valueStyle={{ color: themeColors.secondary }}
//                 prefix={<TableOutlined />}
//               />
//             </Card>
//           </Col>
//         </Row>
//         <Card style={styles.card}>
//           <Title level={4} style={{ color: themeColors.primary }}>Table Occupancy</Title>
//           {renderTableOccupancy()}
//           <Progress
//             percent={occupancyPercentage}
//             status="active"
//             strokeColor={{
//               '0%': themeColors.primary,
//               '100%': themeColors.primary,
//             }}
//             style={{ marginTop: '16px' }}
//           />
//         </Card>
//         <Card style={styles.chartCard}>
//           <Title level={4} style={{ color: themeColors.primary }}>Revenue Overview</Title>
//           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap' }}>
//             <Statistic
//               title={<span style={{ color: themeColors.text }}>Total Revenue</span>}
//               value={totalRevenue}
//               precision={2}
//               valueStyle={{ color: themeColors.primary }}
//               prefix={<CurrencyIcon />}
//             />
//             <Space wrap>
//               <Select
//                 defaultValue="daily"
//                 onChange={setAnalysisType}
//                 style={{ width: 120 }}
//               >
//                 <Select.Option value="daily">Daily</Select.Option>
//                 <Select.Option value="weekly">Weekly</Select.Option>
//                 <Select.Option value="monthly">Monthly</Select.Option>
//                 <Select.Option value="yearly">Yearly</Select.Option>
//               </Select>
//               <RangePicker onChange={setDateRange} />
//             </Space>
//           </div>
//           {renderRevenueChart()}
//         </Card>
//         <Card style={styles.card}>
//           <Title level={4} style={{ color: themeColors.primary }}>Top Selling Items</Title>
//           {renderTopItems()}
//         </Card>
//       </Space>
//     );
//   };

//   const renderSettings = () => (
//     <Card style={styles.settingsCard}>
//       <Title level={4} style={{ color: themeColors.primary }}>Settings</Title>
//       <Row gutter={[16, 16]}>
//         <Col span={24}>
//           <Switch
//             checked={settings.enableRestaurantManagement}
//             onChange={(checked) => updateSettings('enableRestaurantManagement', checked)}
//           /> <Text style={{ color: themeColors.text }}>Enable Restaurant Management</Text>
//         </Col>
//         <Col span={24}>
//           <Switch
//             checked={settings.enableHistory}
//             onChange={(checked) => updateSettings('enableHistory', checked)}
//           /> <Text style={{ color: themeColors.text }}>Enable History</Text>
//         </Col>
//       </Row>
//     </Card>
//   );

//   if (loading) {
//     return (
//       <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: themeColors.background }}>
//         <Spin size="large" tip="Loading restaurant data..." />
//       </div>
//     );
//   }

//   return (
//     <Layout style={styles.layout}>
//       <div style={styles.header}>
//         <Title level={3} style={styles.headerTitle}>Restaurant Dashboard</Title>
//         <Button type="text" icon={<MenuOutlined />} onClick={() => setDrawerVisible(true)} style={{ color: themeColors.secondary }} />
//       </div>
//       <Content style={styles.content}>
//         {restaurant ? renderDashboard() : <p style={{ color: themeColors.text }}>No restaurant data available.</p>}
//       </Content>
//       <Drawer
//         title="Dashboard Menu"
//         placement="right"
//         closable={false}
//         onClose={() => setDrawerVisible(false)}
//         visible={drawerVisible}
//         width={300}
//         bodyStyle={{ background: themeColors.background }}
//         headerStyle={{ background: themeColors.primary, color: themeColors.secondary }}
//       >
//         <Space direction="vertical" size="large" style={{ width: '100%' }}>
//           <Button icon={<BarChartOutlined />} block>Analytics</Button>
//           <Button icon={<SettingOutlined />} block>Settings</Button>
//           <Button icon={<CloseOutlined />} onClick={() => setDrawerVisible(false)} block>Close Menu</Button>
//         </Space>
//         {renderSettings()}
//       </Drawer>
//     </Layout>
//   );
// };

// export default RestaurantDashboard;

import React, { useState, useEffect } from 'react';
import { 
  Layout, Card, Typography, notification, Spin, Statistic, Row, Col, Progress, Switch,
  Select, DatePicker, Space, Button, Drawer
} from 'antd';
import { 
  UserOutlined, TableOutlined, ShoppingOutlined, MenuOutlined, BarChartOutlined,
  SettingOutlined, CloseOutlined
} from '@ant-design/icons';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import axios from 'axios';

const { Content } = Layout;
const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const CurrencyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 7c0-5.333-8-5.333-8 0" />
    <path d="M10 7v14" />
    <path d="M6 21h12" />
    <path d="M6 13h10" />
  </svg>
);

const themeColors = {
  primary: '#e53935',
  secondary: '#ffffff',
  text: '#333333',
  background: '#f5f5f5',
};

const styles = {
  layout: {
    background: themeColors.background,
    minHeight: '100vh',
    marginTop: '115px'
  },
  header: {
    // position: 'fixed',
    zIndex: 1,
    width: '100%',
    background: themeColors.primary,
    padding: '10px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    color: themeColors.secondary,
    margin: 0,
  },
  content: {
    margin: '64px 16px 0',
    overflow: 'initial',
    padding: '24px',
    minHeight: 'calc(100vh - 64px)',
  },
  card: {
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    marginBottom: '20px',
  },
  statCard: {
    background: themeColors.primary,
    color: themeColors.secondary,
    borderRadius: '10px',
    padding: '20px',
    height: '100%',
  },
  chartCard: {
    background: themeColors.secondary,
    borderRadius: '10px',
    padding: '20px',
  },
  settingsCard: {
    background: themeColors.secondary,
    borderRadius: '10px',
    padding: '0px',
  },
};

export const RestaurantDashboard = () => {
  const [restaurant, setRestaurant] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({});
  const [dateRange, setDateRange] = useState([null, null]);
  const [analysisType, setAnalysisType] = useState('daily');
  const [drawerVisible, setDrawerVisible] = useState(false);
  const orgId = localStorage.getItem('orgId');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [restaurantRes, historyRes, settingsRes] = await Promise.all([
          axios.get(`https://smartserver-json-server.onrender.com/restaurants?orgId=${orgId}`),
          axios.get(`https://smartserver-json-server.onrender.com/history`),
          axios.get(`https://smartserver-json-server.onrender.com/settings?orgId=${orgId}`)
        ]);

        setRestaurant(restaurantRes.data[0]);
        setHistory(historyRes.data);
        setSettings(settingsRes.data[0]);
      } catch (error) {
        console.error('Failed to fetch data', error);
        notification.error({ message: 'Failed to fetch data' });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [orgId]);

  const updateSettings = async (key, value) => {
    try {
      const updatedSettings = { ...settings, [key]: value };
      await axios.patch(`https://smartserver-json-server.onrender.com/settings/${settings.id}`, updatedSettings);
      setSettings(updatedSettings);
      notification.success({ message: 'Settings updated successfully' });
    } catch (error) {
      console.error('Failed to update settings', error);
      notification.error({ message: 'Failed to update settings' });
    }
  };

  const calculateOccupancy = () => {
    if (!restaurant || !history.length) return 0;
    return history.length;
  };

  const renderTableOccupancy = () => {
    if (!restaurant) return null;
    const occupancy = calculateOccupancy();
    const tables = Array(restaurant.seatingCapacity).fill(null);
    
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
        {tables.map((_, index) => {
          const isOccupied = index < occupancy;
          return (
            <TableOutlined
              key={index}
              style={{
                fontSize: '24px',
                color: isOccupied ? themeColors.primary : themeColors.secondary,
                background: isOccupied ? themeColors.secondary : themeColors.primary,
                padding: '5px',
                borderRadius: '5px',
              }}
            />
          );
        })}
      </div>
    );
  };

  const filterDataByDateRange = (data) => {
    if (!dateRange[0] || !dateRange[1]) return data;
    const [start, end] = dateRange;
    return data.filter(item => {
      const itemDate = new Date(item.timestamp);
      return itemDate >= start && itemDate <= end;
    });
  };

  const aggregateData = (data) => {
    const aggregated = {};
    data.forEach(item => {
      const date = new Date(item.timestamp);
      let key;
      switch (analysisType) {
        case 'daily':
          key = date.toISOString().split('T')[0];
          break;
        case 'weekly':
          const weekStart = new Date(date.setDate(date.getDate() - date.getDay()));
          key = weekStart.toISOString().split('T')[0];
          break;
        case 'monthly':
          key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          break;
        case 'yearly':
          key = date.getFullYear().toString();
          break;
        default:
          key = date.toISOString().split('T')[0];
      }
      if (!aggregated[key]) {
        aggregated[key] = { date: key, revenue: 0, itemsSold: {} };
      }
      aggregated[key].revenue += parseFloat(item.total);
      item.items.forEach(orderItem => {
        if (!aggregated[key].itemsSold[orderItem.name]) {
          aggregated[key].itemsSold[orderItem.name] = 0;
        }
        aggregated[key].itemsSold[orderItem.name] += orderItem.quantity;
      });
    });
    return Object.values(aggregated);
  };

  const renderRevenueChart = () => {
    const filteredData = filterDataByDateRange(history);
    const chartData = aggregateData(filteredData);

    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="revenue" stroke={themeColors.primary} activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    );
  };
  const renderTopItems = () => {
    const filteredData = filterDataByDateRange(history);
    const itemSales = {};
    filteredData.forEach(order => {
      order.items.forEach(item => {
        if (!itemSales[item.name]) itemSales[item.name] = 0;
        itemSales[item.name] += item.quantity;
      });
    });
    const sortedItems = Object.entries(itemSales).sort((a, b) => b[1] - a[1]);
    
    const data = sortedItems.slice(0, 5).map(([name, quantity]) => ({
      name,
      value: quantity,
    }));

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

    return (
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    );
  };
  const renderTopItemsList = () => {
    const filteredData = filterDataByDateRange(history);
    const itemSales = {};
    filteredData.forEach(order => {
      order.items.forEach(item => {
        if (!itemSales[item.name]) itemSales[item.name] = 0;
        itemSales[item.name] += item.quantity;
      });
    });
    const sortedItems = Object.entries(itemSales).sort((a, b) => b[1] - a[1]);
    return (
      <ul style={{ paddingLeft: '20px', color: themeColors.text }}>
        {sortedItems.slice(0, 5).map(([name, quantity]) => (
          <li key={name}>{name}: {quantity} sold</li>
        ))}
      </ul>
    );
  };

  const renderDashboard = () => {
    const occupancy = calculateOccupancy();
    const occupancyPercentage = (occupancy / restaurant.seatingCapacity) * 100;
    const totalRevenue = history.reduce((sum, order) => sum + parseFloat(order.total), 0);

    return (
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={8}>
            <Card style={styles.statCard}>
              <Statistic
                title={<span style={{ color: themeColors.secondary }}>Total Capacity</span>}
                value={restaurant.peopleCount}
                valueStyle={{ color: themeColors.secondary }}
                prefix={<UserOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card style={styles.statCard}>
              <Statistic
                title={<span style={{ color: themeColors.secondary }}>Current Occupancy</span>}
                value={occupancy}
                valueStyle={{ color: themeColors.secondary }}
                prefix={<ShoppingOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card style={styles.statCard}>
              <Statistic
                title={<span style={{ color: themeColors.secondary }}>Tables Available</span>}
                value={`${restaurant.seatingCapacity - occupancy}/${restaurant.seatingCapacity}`}
                valueStyle={{ color: themeColors.secondary }}
                prefix={<TableOutlined />}
              />
            </Card>
          </Col>
        </Row>
        <Card style={styles.card}>
          <Title level={4} style={{ color: themeColors.primary }}>Table Occupancy</Title>
          {renderTableOccupancy()}
          <Progress
            percent={occupancyPercentage}
            status="active"
            strokeColor={{
              '0%': themeColors.primary,
              '100%': themeColors.primary,
            }}
            style={{ marginTop: '16px' }}
          />
        </Card>
        <Card style={styles.chartCard}>
          <Title level={4} style={{ color: themeColors.primary }}>Revenue Overview</Title>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap' }}>
            <Statistic
              title={<span style={{ color: themeColors.text }}>Total Revenue</span>}
              value={totalRevenue}
              precision={2}
              valueStyle={{ color: themeColors.primary }}
              prefix={<CurrencyIcon />}
            />
            <Space wrap>
              <Select
                defaultValue="daily"
                onChange={setAnalysisType}
                style={{ width: 120 }}
              >
                <Select.Option value="daily">Daily</Select.Option>
                <Select.Option value="weekly">Weekly</Select.Option>
                <Select.Option value="monthly">Monthly</Select.Option>
                <Select.Option value="yearly">Yearly</Select.Option>
              </Select>
              <RangePicker onChange={setDateRange} />
            </Space>
            {/* {renderRevenueChart()} */}
          </div>
       
        </Card>
        <Card style={styles.card}>
          <Title level={4} style={{ color: themeColors.primary }}>Top Selling Items</Title>
          {renderTopItemsList()}
        </Card>
        <Card style={styles.card} title="Top Selling Items">
          {renderTopItems()}
        </Card>

      
      </Space>
    );
  };

  const renderSettings = () => (
    <Card style={styles.settingsCard}>
      <Title level={4} style={{ color: themeColors.primary }}>Settings</Title>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Switch
            checked={settings.enableRestaurantManagement}
            onChange={(checked) => updateSettings('enableAdminManagement', checked)}
          /> <Text style={{ color: themeColors.text }}>Admin Mnagenement</Text>
        </Col>
        <Col span={24}>
          <Switch
            checked={settings.enableHistory}
            onChange={(checked) => updateSettings('enableHistoryManagement', checked)}
          /> <Text style={{ color: themeColors.text }}>History Management</Text>
        </Col>
        <Col span={24}>
          <Switch
            checked={settings.enableHistory}
            onChange={(checked) => updateSettings('enableMenuManagement', checked)}
          /> <Text style={{ color: themeColors.text }}>Menu Management</Text>
        </Col>
        <Col span={24}>
          <Switch
            checked={settings.enableHistory}
            onChange={(checked) => updateSettings('enableRestaurantManagement', checked)}
          /> <Text style={{ color: themeColors.text }}>Restaurant Management</Text>
        </Col>
      </Row>
    </Card>
  );

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: themeColors.background }}>
        <Spin size="large" tip="Loading restaurant data..." />
      </div>
    );
  }

  return (
    <Layout style={styles.layout}>
      <div style={styles.header}>
        <Title level={3} style={styles.headerTitle}>Restaurant Dashboard</Title>
        <Button type="text" icon={<MenuOutlined />} onClick={() => setDrawerVisible(true)} style={{ color: themeColors.secondary }} />
      </div>
      <Content style={styles.content}>
        {restaurant ? renderDashboard() : <p style={{ color: themeColors.text }}>No restaurant data available.</p>}
        {renderSettings()}
      </Content>
      <Drawer
  title="Dashboard Menu"
  placement="right"
  closable={false}
  onClose={() => setDrawerVisible(false)}
  visible={drawerVisible}
  width={300}
  bodyStyle={{ background: themeColors.background }}
  headerStyle={{ background: themeColors.primary, color: themeColors.secondary }}
  extra={
    <Button
      icon={<CloseOutlined />}
      onClick={() => setDrawerVisible(false)}
      style={{ color: themeColors.secondary, background: 'transparent', border: 'none' }}
    />
  }
>
  <Space direction="vertical" size="large" style={{ width: '100%' }}>
    <Button  style={{marginBottom: '10px'}} icon={<SettingOutlined />} block>Settings</Button>
  </Space>
  {renderSettings()}
</Drawer>

    </Layout>
  );
};

export default RestaurantDashboard;
