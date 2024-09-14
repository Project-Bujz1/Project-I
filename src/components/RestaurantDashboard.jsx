import React, { useState, useEffect, useRef } from 'react';
import { 
  Layout, Menu, Card, Badge, Tag, Select, Typography, notification, 
  Switch, Spin, List, Avatar, Statistic, Row, Col, Progress, Drawer
} from 'antd';
import { 
  BellOutlined, CheckCircleOutlined, ClockCircleOutlined, 
  ExclamationCircleOutlined, CloseCircleOutlined, SoundOutlined, 
  DashboardOutlined, ShoppingCartOutlined, SettingOutlined, 
   UserOutlined, MenuOutlined
} from '@ant-design/icons';
import { MdOutlineTableRestaurant } from "react-icons/md";
const { Header, Content } = Layout;
const { Option } = Select;
const { Title, Text } = Typography;

export const RestaurantDashBoard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [restaurantData, setRestaurantData] = useState({
    seatingCapacity: 50,
    tableCount: 10,
    occupiedTables: 0
  });
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


  }, [ orgId]);

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


  const renderTableOccupancy = () => {
    const { tableCount, occupiedTables } = restaurantData;
    const tables = Array(tableCount).fill(null);
    
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
        {tables.map((_, index) => {
          const isOccupied = index < occupiedTables;
          return (
            <MdOutlineTableRestaurant
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
              prefix={<MdOutlineTableRestaurant />}
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
      <Layout className="site-layout" style={{marginTop: '95px'}}>
        <Content style={{ margin: '0 16px' }}>
          <div style={{ padding: 24, minHeight: 360, background: '#fff' }}>
            <Title level={2} style={{ marginBottom: 24, marginTop: 48 }}>Restaurant Dashboard</Title>
            {renderDashboard()}
          </div>
        </Content>
    </Layout>
  );
};

export default RestaurantDashBoard;