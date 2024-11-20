import React, { useState, useEffect } from 'react';
import { 
  Layout, Card, Typography, notification, Spin, Statistic, Row, Col, Progress, Switch,
  Select, DatePicker, Space, Button, Drawer, Empty
} from 'antd';
import { 
  UserOutlined, TableOutlined, ShoppingOutlined, MenuOutlined, BarChartOutlined,
  SettingOutlined, CloseOutlined
} from '@ant-design/icons';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import axios from 'axios';
import FoodLoader from './FoodLoader';

const { Content } = Layout;
const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const CurrencyIcon = () => (
  <span style={{ fontSize: '16px', fontWeight: 'bold' }}>₹</span>
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
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState([null, null]);
  const [analysisType, setAnalysisType] = useState('daily');
  const orgId = localStorage.getItem('orgId');

  useEffect(() => {
    fetchOrders();
  }, [orgId]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://smart-server-menu-database-default-rtdb.firebaseio.com/history.json`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();

      // Convert the fetched object to an array and filter by orgId
      const ordersArray = data ? Object.entries(data)
        .map(([key, order]) => ({
          ...order,
          id: order.id || key
        }))
        .filter(order => order.orgId === orgId) : [];

      const sortedOrders = ordersArray.sort((a, b) => 
        new Date(b.timestamp) - new Date(a.timestamp)
      );
      
      setOrders(sortedOrders);
    } catch (error) {
      console.error('Failed to fetch orders', error);
      notification.error({ message: 'Failed to fetch orders' });
    } finally {
      setLoading(false);
    }
  };

  const calculateOccupancy = () => {
    if (!orders.length) return 0;
    return orders.filter(order => 
      !['completed', 'cancelled'].includes(order.status)
    ).length;
  };

  const calculateTotalRevenue = () => {
    if (!orders.length) return 0;
    return orders.reduce((sum, order) => {
      if (order.status === 'completed') {
        return sum + (parseFloat(order.total) || 0);
      }
      return sum;
    }, 0);
  };

  const calculateSeatingCapacity = () => {
    // You might want to adjust this based on your actual data structure
    return 20; // Default value or fetch from settings if available
  };

  const renderDashboard = () => {
    const occupancy = calculateOccupancy();
    const seatingCapacity = calculateSeatingCapacity();
    const occupancyPercentage = (occupancy / seatingCapacity) * 100;

    return (
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={8}>
            <Card style={styles.statCard}>
              <Statistic
                title={<span style={{ color: themeColors.secondary }}>Total Orders</span>}
                value={orders.length}
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
                value={`${seatingCapacity - occupancy}/${seatingCapacity}`}
                valueStyle={{ color: themeColors.secondary }}
                prefix={<TableOutlined />}
              />
            </Card>
          </Col>
        </Row>

        {/* Revenue Chart */}
        <Card style={styles.chartCard}>
          <Title level={4} style={{ color: themeColors.primary }}>Revenue Overview</Title>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap' }}>
            <Statistic
              title={<span style={{ color: themeColors.text }}>Total Revenue</span>}
              value={calculateTotalRevenue()}
              precision={2}
              valueStyle={{ color: themeColors.primary }}
              prefix={<CurrencyIcon />}
              formatter={(value) => value.toLocaleString('en-IN')}
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
              <RangePicker 
                onChange={(dates) => setDateRange(dates)}
                format="DD-MM-YYYY"
              />
            </Space>
          </div>
          {renderRevenueChart()}
        </Card>

        {/* Top Items Chart */}
        <Card style={styles.card}>
          <Title level={4} style={{ color: themeColors.primary }}>Top Selling Items</Title>
          {renderTopItems()}
        </Card>
      </Space>
    );
  };

  const renderRevenueChart = () => {
    const filteredData = filterDataByDateRange(orders);
    const chartData = aggregateData(filteredData);

    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tickFormatter={(date) => {
              const formattedDate = new Date(date);
              return formattedDate.toLocaleDateString('en-IN');
            }}
          />
          <YAxis 
            tickFormatter={(value) => `₹${value.toLocaleString('en-IN')}`}
          />
          <Tooltip 
            formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Revenue']}
            labelFormatter={(date) => new Date(date).toLocaleDateString('en-IN')}
          />
          <Line 
            type="monotone" 
            dataKey="revenue" 
            stroke={themeColors.primary} 
            activeDot={{ r: 8 }} 
          />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  const renderTopItems = () => {
    const filteredData = filterDataByDateRange(orders);
    const itemSales = {};
    
    // Only count completed orders and ensure items exist
    filteredData
      .filter(order => order.status === 'completed' && Array.isArray(order.items))
      .forEach(order => {
        order.items.forEach(item => {
          if (item && item.name) {  // Check if item and item.name exist
            if (!itemSales[item.name]) itemSales[item.name] = 0;
            itemSales[item.name] += item.quantity || 1;
          }
        });
      });

    const data = Object.entries(itemSales)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, value]) => ({ name, value }));

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

    return (
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`${value} orders`, 'Quantity']} />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  const filterDataByDateRange = (data) => {
    // If no date range is selected or dateRange is null, return all data
    if (!dateRange || !dateRange[0] || !dateRange[1]) return data;
    
    return data.filter(item => {
      if (!item || !item.timestamp) return false;
      const itemDate = new Date(item.timestamp);
      return itemDate >= dateRange[0] && itemDate <= dateRange[1];
    });
  };

  const aggregateData = (data) => {
    const aggregated = {};
    data.forEach(item => {
      if (!item || !item.timestamp) return; // Skip invalid items

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

      // Safely add revenue
      const total = parseFloat(item.total) || 0;
      aggregated[key].revenue += total;

      // Safely process items
      if (Array.isArray(item.items)) {
        item.items.forEach(orderItem => {
          if (orderItem && orderItem.name) {
            if (!aggregated[key].itemsSold[orderItem.name]) {
              aggregated[key].itemsSold[orderItem.name] = 0;
            }
            aggregated[key].itemsSold[orderItem.name] += orderItem.quantity || 1;
          }
        });
      }
    });
    return Object.values(aggregated);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: themeColors.background }}>
        <FoodLoader/>
      </div>
    );
  }

  return (
    <Layout style={styles.layout}>
      <div style={styles.header}>
        <Title level={3} style={styles.headerTitle}>Restaurant Dashboard</Title>
      </div>
      <Content style={styles.content}>
        {orders.length > 0 ? renderDashboard() : 
          <Empty 
            description="No orders data available" 
            style={{ 
              background: 'white', 
              padding: '40px', 
              borderRadius: '15px',
              marginTop: '20px'
            }} 
          />
        }
      </Content>
    </Layout>
  );
};

export default RestaurantDashboard;
