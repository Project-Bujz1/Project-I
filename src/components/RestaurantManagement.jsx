import React, { useState, useEffect } from 'react';
import {
  Layout,
  Form,
  Input,
  InputNumber,
  Button,
  Switch,
  Upload,
  message,
  Spin,
  Card,
  Row,
  Col,
  Typography,
  Space,
  Tabs,
} from 'antd';
import {
  UploadOutlined,
  SaveOutlined,
  ShopOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
  TeamOutlined,
  CoffeeOutlined,
  DollarOutlined,
  SettingOutlined,
  PieChartOutlined,
} from '@ant-design/icons';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'antd/dist/antd.css';

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;
const { TabPane } = Tabs;

// Custom marker icon for the map
const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const RestaurantManagement = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [restaurant, setRestaurant] = useState(null);
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    fetchRestaurantData();
  }, []);

  const fetchRestaurantData = async () => {
    try {
      setLoading(true);
      const orgId = localStorage.getItem('orgId');
      const response = await fetch('https://smartserver-json-server.onrender.com/restaurants');
      if (response.ok) {
        const data = await response.json();
        const restaurantData = data.find(r => r.orgId === orgId);
        if (restaurantData) {
          setRestaurant({
            ...restaurantData,
            settings: restaurantData.settings || {
              enableOnlineOrdering: true,
              enableReservations: true,
              enableLoyaltyProgram: false,
              enableMenuCustomization: true,
              enableTableManagement: true,
              enableInventoryManagement: false,
              enableStaffManagement: true,
              enableAnalytics: true,
              enableCustomerFeedback: true,
              enableMarketingTools: false,
            }
          });
          form.setFieldsValue(restaurantData);
          if (restaurantData.logo) {
            setFileList([
              {
                uid: '-1',
                name: 'restaurant-logo.png',
                status: 'done',
                url: restaurantData.logo,
              },
            ]);
          }
        } else {
          message.error("No restaurant found for this organization.");
        }
      }
    } catch (error) {
      console.error("Error fetching restaurant data:", error);
      message.error("Failed to fetch restaurant data.");
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const updatedRestaurant = {
        ...restaurant,
        ...values,
        logo: fileList[0]?.url || restaurant.logo,
      };
      const response = await fetch(`https://smartserver-json-server.onrender.com/restaurants/${restaurant.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedRestaurant),
      });
      if (response.ok) {
        message.success("Restaurant information updated successfully");
        setRestaurant(updatedRestaurant);
      } else {
        message.error("Failed to update restaurant information");
      }
    } catch (error) {
      console.error("Error updating restaurant information:", error);
      message.error("An error occurred while updating restaurant information");
    } finally {
      setLoading(false);
    }
  };

  const handleLogoChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const MapComponent = ({ position }) => {
    const map = useMap();
    useEffect(() => {
      if (position) {
        map.setView(position, 13);
      }
    }, [position, map]);
    return position ? <Marker position={position} icon={customIcon} /> : null;
  };

  if (!restaurant) {
    return (
      <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <Spin size="large" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Header style={{ background: '#fff', padding: '0 20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <ShopOutlined style={{ fontSize: '24px', marginRight: '10px', color: '#1890ff' }} />
          <Title level={3} style={{ margin: 0, color: '#1890ff' }}>Restaurant Management</Title>
        </div>
      </Header>
      <Content style={{ padding: '24px' }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={restaurant}
        >
          <Tabs defaultActiveKey="1" style={{ background: '#fff', padding: '24px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <TabPane tab={<span><ShopOutlined />Basic Info</span>} key="1">
              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="logo"
                    label="Restaurant Logo"
                    valuePropName="fileList"
                    getValueFromEvent={handleLogoChange}
                  >
                    <Upload
                      listType="picture-card"
                      fileList={fileList}
                      beforeUpload={() => false}
                      maxCount={1}
                    >
                      {fileList.length === 0 && <UploadOutlined />}
                    </Upload>
                  </Form.Item>
                  <Form.Item name="name" label="Restaurant Name" rules={[{ required: true }]}>
                    <Input prefix={<ShopOutlined />} placeholder="Enter restaurant name" />
                  </Form.Item>
                  <Form.Item name="cuisineType" label="Cuisine Type" rules={[{ required: true }]}>
                    <Input prefix={<CoffeeOutlined />} placeholder="Enter cuisine type" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item name="address" label="Address" rules={[{ required: true }]}>
                    <Input.TextArea prefix={<EnvironmentOutlined />} placeholder="Enter address" />
                  </Form.Item>
                  <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
                    <Input prefix={<PhoneOutlined />} placeholder="Enter phone number" />
                  </Form.Item>
                  <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
                    <Input prefix={<MailOutlined />} placeholder="Enter email address" />
                  </Form.Item>
                </Col>
              </Row>
            </TabPane>
            <TabPane tab={<span><PieChartOutlined />Details</span>} key="2">
              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <Form.Item name="seatingCapacity" label="Table Count" rules={[{ required: true }]}>
                    <InputNumber min={1} prefix={<TeamOutlined />} style={{ width: '100%' }} />
                  </Form.Item>
                  <Form.Item name="averagePrice" label="Average Price" rules={[{ required: true }]}>
                    <InputNumber
                      min={0}
                      formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={value => value.replace(/\$\s?|(,*)/g, '')}
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label="Location">
                    <div style={{ height: '300px', width: '100%', borderRadius: '8px', overflow: 'hidden' }}>
                      <MapContainer center={restaurant.position || [0, 0]} zoom={13} style={{ height: '100%', width: '100%' }}>
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <MapComponent position={restaurant.position} />
                      </MapContainer>
                    </div>
                  </Form.Item>
                </Col>
              </Row>
            </TabPane>
            <TabPane tab={<span><SettingOutlined />Settings</span>} key="3">
              <Row gutter={[16, 16]}>
                {Object.entries(restaurant.settings).map(([key, value]) => (
                  <Col xs={24} sm={12} md={8} lg={6} key={key}>
                    <Form.Item name={['settings', key]} valuePropName="checked" label={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}>
                      <Switch />
                    </Form.Item>
                  </Col>
                ))}
              </Row>
            </TabPane>
          </Tabs>
          <Form.Item style={{ marginTop: '16px', textAlign: 'right' }}>
            <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loading} size="large">
              Save Restaurant Information
            </Button>
          </Form.Item>
        </Form>
      </Content>
      <Footer style={{ textAlign: 'center', background: '#f0f2f5' }}>
        Restaurant Management System ©{new Date().getFullYear()} Created by Your Company
      </Footer>
    </Layout>
  );
};

export default RestaurantManagement;