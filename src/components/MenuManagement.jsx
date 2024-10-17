import React, { useState, useEffect } from 'react';
import { Layout, Menu, Form, Input, Button, Select, Table, Modal, message, Typography, Switch, Badge, Card, Tooltip, Tag, Space, Drawer } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, InfoCircleOutlined, ClockCircleOutlined, CheckCircleOutlined, StopOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const { Header, Content, Sider } = Layout;
const { Option } = Select;
const { Title, Text } = Typography;
const { TextArea } = Input;

const API_URL = 'https://stage-smart-server-default-rtdb.firebaseio.com';

// Styled Components
const StyledLayout = styled(Layout)`
  min-height: 100vh;
`;

const StyledSider = styled(Sider)`
  background: #fff;
  box-shadow: 2px 0 8px rgba(0,0,0,0.15);
  .ant-menu-item-selected {
    background-color: #ff00001a !important;
    color: #ff0000 !important;
  }
`;

const StyledContent = styled(Content)`
  padding: 24px;
  background: #f5f5f5;
`;

const StyledCard = styled(Card)`
  margin-bottom: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  .ant-card-head {
    background: #fafafa;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  }
`;

const ItemCard = styled(Card)`
  margin: 8px;
  border-radius: 8px;
  transition: all 0.3s;
  &:hover {
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }
`;

const StyledButton = styled(Button)`
  background: ${props => props.ghost ? 'transparent' : '#ff0000'};
  color: #ffffff;
  border: ${props => props.ghost ? '1px solid #ffffff' : 'none'};
  &:hover {
    background: #ffffff;
    color: #ff0000;
    border: 1px solid #ff0000;
  }
`;

const StyledTableContainer = styled.div`
  max-height: 400px;
  overflow-y: auto;
`;

const StyledTable = styled(Table)`
  .ant-table-thead > tr > th {
    background: #ff0000;
    color: #ffffff;
  }
  .ant-table-tbody > tr:hover > td {
    background: #fff0f0;
  }
`;

const StyledModal = styled(Modal)`
  .ant-modal-header {
    background: #ff0000;
    border-bottom: none;
  }
  .ant-modal-title {
    color: #ffffff;
  }
  .ant-modal-close-x {
    color: #ffffff;
  }
  .ant-modal-footer {
    border-top: none;
  }
`;

const StatusBadge = styled(Badge)`
  .ant-badge-status-dot {
    width: 8px;
    height: 8px;
  }
`;

const MenuManagement = () => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('menu_items');
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [availabilityDrawer, setAvailabilityDrawer] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Get orgId from localStorage
  const orgId = localStorage.getItem('orgId');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [categoriesRes, subcategoriesRes, menuItemsRes] = await Promise.all([
        fetch(`${API_URL}/categories.json`),
        fetch(`${API_URL}/subcategories.json`),
        fetch(`${API_URL}/menu_items.json`)
      ]);
      const [categoriesData, subcategoriesData, menuItemsData] = await Promise.all([
        categoriesRes.json(),
        subcategoriesRes.json(),
        menuItemsRes.json()
      ]);
  
      const categoriesArray = categoriesData ? Object.entries(categoriesData)
        .map(([firebaseId, data]) => ({ firebaseId, ...data }))
        .filter(item => item && item.orgId === parseInt(orgId)) : [];
      const subcategoriesArray = subcategoriesData ? Object.entries(subcategoriesData)
        .map(([firebaseId, data]) => ({ firebaseId, ...data }))
        .filter(item => item && item.orgId === parseInt(orgId)) : [];
      const menuItemsArray = menuItemsData ? Object.entries(menuItemsData)
        .map(([firebaseId, data]) => ({ firebaseId, ...data }))
        .filter(item => item && item.orgId === parseInt(orgId)) : [];
  
      setCategories(categoriesArray);
      setSubcategories(subcategoriesArray);
      setMenuItems(menuItemsArray);
    } catch (error) {
      console.error('Error fetching data:', error);
      message.error('Failed to fetch data');
    }
    setLoading(false);
  };

  const handleCreate = async (values) => {
    const type = activeTab === 'categories' ? 'categories' : activeTab === 'subcategories' ? 'subcategories' : 'menu_items';
    try {
      const response = await fetch(`${API_URL}/${type}.json`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, orgId: parseInt(orgId) })
      });
      if (response.ok) {
        const data = await response.json();
        const newItem = { firebaseId: data.name, ...values, orgId: parseInt(orgId) };
        updateLocalState(type, 'add', newItem);
        setIsModalVisible(false);
        form.resetFields();
        message.success('Item created successfully');
      }
    } catch (error) {
      console.error(`Error creating ${type}:`, error);
      message.error('Failed to create item');
    }
  };

  const handleUpdate = async (values) => {
    const type = activeTab === 'categories' ? 'categories' : activeTab === 'subcategories' ? 'subcategories' : 'menu_items';
    try {
      if (!editingItem || !editingItem.firebaseId) {
        throw new Error('No item selected for update');
      }

      const response = await fetch(`${API_URL}/${type}/${editingItem.firebaseId}.json`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, orgId: parseInt(orgId) })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update item');
      }

      const updatedItem = { ...editingItem, ...values, orgId: parseInt(orgId) };
      updateLocalState(type, 'update', updatedItem);
      setIsModalVisible(false);
      setEditingItem(null);
      form.resetFields();
      message.success('Item updated successfully');
    } catch (error) {
      console.error(`Error updating ${type}:`, error);
      message.error(`Failed to update item: ${error.message}`);
    }
  };

  const handleDelete = async (firebaseId) => {
    const type = activeTab === 'categories' ? 'categories' : activeTab === 'subcategories' ? 'subcategories' : 'menu_items';
    try {
      const response = await fetch(`${API_URL}/${type}/${firebaseId}.json`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete item');
      }

      updateLocalState(type, 'delete', { firebaseId });
      message.success('Item deleted successfully');
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
      message.error(`Failed to delete item: ${error.message}`);
    }
  };

  const updateLocalState = (type, action, item) => {
    const updateState = (prevState) => {
      switch (action) {
        case 'add':
          return [...prevState, item];
        case 'update':
          return prevState.map(i => i.firebaseId === item.firebaseId ? { ...i, ...item } : i);
        case 'delete':
          return prevState.filter(i => i.firebaseId !== item.firebaseId);
        default:
          return prevState;
      }
    };

    switch (type) {
      case 'categories':
        setCategories(updateState);
        break;
      case 'subcategories':
        setSubcategories(updateState);
        break;
      case 'menu_items':
        setMenuItems(updateState);
        break;
    }
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    form.setFieldsValue({ subcategoryId: null });
  };

  const columns = {
    categories: [
      { title: 'Name', dataIndex: 'name', key: 'name' },
      {
        title: 'Actions',
        key: 'actions',
        width: 150,
        render: (_, record) => (
          <>
            <Button icon={<EditOutlined />} onClick={() => {
              setEditingItem(record);
              form.setFieldsValue(record);
              setIsModalVisible(true);
            }} />
            <Button icon={<DeleteOutlined />} onClick={() => handleDelete(record.firebaseId)} style={{ marginLeft: 8 }} />
          </>
        ),
      },
    ],
    subcategories: [
      { title: 'Name', dataIndex: 'name', key: 'name' },
      { title: 'Category', dataIndex: 'categoryId', key: 'categoryId', render: (categoryId) => categories.find(c => c.id === categoryId)?.name },
      {
        title: 'Actions',
        key: 'actions',
        render: (_, record) => (
          <>
            <Button icon={<EditOutlined />} onClick={() => {
              setEditingItem(record);
              form.setFieldsValue(record);
              setIsModalVisible(true);
            }} />
            <Button icon={<DeleteOutlined />} onClick={() => handleDelete(record.firebaseId)} style={{ marginLeft: 8 }} />
          </>
        ),
      },
    ],
    menuItems: [
      { title: 'Name', dataIndex: 'name', key: 'name' },
      { title: 'Description', dataIndex: 'description', key: 'description' },
      { title: 'Price', dataIndex: 'price', key: 'price' },
      { title: 'Category', dataIndex: 'categoryId', key: 'categoryId', render: (categoryId) => categories.find(c => c.id === categoryId)?.name },
      { title: 'Subcategory', dataIndex: 'subcategoryId', key: 'subcategoryId', render: (subcategoryId) => subcategories.find(s => s.id === subcategoryId)?.name },
      {
        title: 'Actions',
        key: 'actions',
        width: 150,
        render: (_, record) => (
          <>
            <Button icon={<EditOutlined />} onClick={() => {
              setEditingItem(record);
              form.setFieldsValue(record);
              setIsModalVisible(true);
            }} />
            <Button icon={<DeleteOutlined />} onClick={() => handleDelete(record.firebaseId)} style={{ marginLeft: 8 }} />
          </>
        ),
      },
    ],
  };

  const renderAvailabilityDrawer = () => (
    <Drawer
      title="Set Item Availability"
      placement="right"
      onClose={() => setAvailabilityDrawer(false)}
      visible={availabilityDrawer}
      width={400}
    >
      {selectedItem && (
        <Form layout="vertical" initialValues={selectedItem}>
          <Form.Item label="Availability Status">
            <Switch
              checkedChildren="Available"
              unCheckedChildren="Unavailable"
              defaultChecked={selectedItem.isAvailable}
              onChange={(checked) => handleAvailabilityChange(selectedItem.firebaseId, checked)}
            />
          </Form.Item>
          <Form.Item label="Unavailability Reason" name="unavailabilityReason">
            <TextArea
              rows={4}
              placeholder="Enter reason for unavailability (optional)"
              disabled={selectedItem.isAvailable}
            />
          </Form.Item>
          <Form.Item label="Expected Available Date" name="expectedAvailableDate">
            <Input
              type="date"
              disabled={selectedItem.isAvailable}
            />
          </Form.Item>
          <Button type="primary" onClick={() => handleSaveAvailability(selectedItem.firebaseId)}>
            Save Changes
          </Button>
        </Form>
      )}
    </Drawer>
  );

  const handleAvailabilityChange = async (firebaseId, isAvailable) => {
    try {
      await fetch(`${API_URL}/menu_items/${firebaseId}.json`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isAvailable })
      });
      
      setMenuItems(prev => prev.map(item => 
        item.firebaseId === firebaseId ? { ...item, isAvailable } : item
      ));
      
      message.success(`Item ${isAvailable ? 'available' : 'unavailable'} status updated`);
    } catch (error) {
      message.error('Failed to update availability status');
    }
  };

  const handleSaveAvailability = async (firebaseId) => {
    try {
      const values = await form.validateFields();
      await fetch(`${API_URL}/menu_items/${firebaseId}.json`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      });
      
      setMenuItems(prev => prev.map(item => 
        item.firebaseId === firebaseId ? { ...item, ...values } : item
      ));
      
      setAvailabilityDrawer(false);
      message.success('Availability details updated successfully');} catch (error) {
        console.error('Error saving availability:', error);
        message.error('Failed to update availability details');
      }
    };
  
    const menuItemColumns = [
      {
        title: 'Item',
        dataIndex: 'name',
        key: 'name',
        render: (text, record) => (
          <Space>
            <img
              src={record.image || '/api/placeholder/50/50'}
              alt={text}
              style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }}
            />
            <Space direction="vertical" size={0}>
              <Text strong>{text}</Text>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {categories.find(c => c.firebaseId === record.categoryId)?.name} → 
                {subcategories.find(s => s.firebaseId === record.subcategoryId)?.name}
              </Text>
            </Space>
          </Space>
        ),
      },
      {
        title: 'Price',
        dataIndex: 'price',
        key: 'price',
        render: price => `₹${price}`,
        width: 100,
      },
      {
        title: 'Status',
        key: 'status',
        width: 150,
        render: (_, record) => (
          <Space>
            <StatusBadge
              status={record.isAvailable ? 'success' : 'error'}
              text={record.isAvailable ? 'Available' : 'Unavailable'}
            />
            {!record.isAvailable && record.unavailabilityReason && (
              <Tooltip title={record.unavailabilityReason}>
                <InfoCircleOutlined style={{ color: '#ff4d4f' }} />
              </Tooltip>
            )}
          </Space>
        ),
      },
      {
        title: 'Actions',
        key: 'actions',
        width: 200,
        render: (_, record) => (
          <Space>
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => {
                setEditingItem(record);
                form.setFieldsValue(record);
                setIsModalVisible(true);
              }}
            />
            <Button
              type="text"
              icon={<ClockCircleOutlined />}
              onClick={() => {
                setSelectedItem(record);
                setAvailabilityDrawer(true);
              }}
            />
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.firebaseId)}
            />
          </Space>
        ),
      },
    ];
  
    const renderFormItems = () => {
      switch (activeTab) {
        case 'categories':
          return (
            <>
              <Form.Item name="name" label="Category Name" rules={[{ required: true, message: 'Please input the category name!' }]}>
                <Input />
              </Form.Item>
            </>
          );
        case 'subcategories':
          return (
            <>
              <Form.Item name="name" label="Subcategory Name" rules={[{ required: true, message: 'Please input the subcategory name!' }]}>
                <Input />
              </Form.Item>
              <Form.Item name="categoryId" label="Category" rules={[{ required: true, message: 'Please select a category!' }]}>
                <Select onChange={handleCategoryChange}>
                  {categories.map(category => (
                    <Option key={category.firebaseId} value={category.firebaseId}>{category.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </>
          );
        case 'menu_items':
          return (
            <>
              <Form.Item name="name" label="Item Name" rules={[{ required: true, message: 'Please input the item name!' }]}>
                <Input />
              </Form.Item>
              <Form.Item name="description" label="Description">
                <TextArea rows={4} />
              </Form.Item>
              <Form.Item name="price" label="Price" rules={[{ required: true, message: 'Please input the price!' }]}>
                <Input type="number" prefix="₹" />
              </Form.Item>
              <Form.Item name="categoryId" label="Category" rules={[{ required: true, message: 'Please select a category!' }]}>
                <Select onChange={handleCategoryChange}>
                  {categories.map(category => (
                    <Option key={category.firebaseId} value={category.firebaseId}>{category.name}</Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name="subcategoryId" label="Subcategory" rules={[{ required: true, message: 'Please select a subcategory!' }]}>
                <Select disabled={!selectedCategory}>
                  {subcategories
                    .filter(subcat => subcat.categoryId === selectedCategory)
                    .map(subcategory => (
                      <Option key={subcategory.firebaseId} value={subcategory.firebaseId}>{subcategory.name}</Option>
                    ))}
                </Select>
              </Form.Item>
              <Form.Item name="isAvailable" label="Available" valuePropName="checked">
                <Switch />
              </Form.Item>
            </>
          );
        default:
          return null;
      }
    };
  
    return (
      <StyledLayout style={{marginTop: "100px"}}>
        <StyledSider width={250}>
          <div style={{ padding: '24px 16px', textAlign: 'center' }}>
            <Title level={4} style={{ color: '#ff0000', margin: 0 }}>Menu Management</Title>
          </div>
          <Menu
            mode="inline"
            selectedKeys={[activeTab]}
            onClick={({ key }) => setActiveTab(key)}
          >
            <Menu.Item key="menu_items" icon={<PlusOutlined />}>
              Menu Items
            </Menu.Item>
            <Menu.Item key="categories" icon={<PlusOutlined />}>
              Categories
            </Menu.Item>
            <Menu.Item key="subcategories" icon={<PlusOutlined />}>
              Subcategories
            </Menu.Item>
          </Menu>
        </StyledSider>
        <StyledContent>
          <StyledCard>
            <Space style={{ marginBottom: 16, justifyContent: 'space-between', width: '100%' }}>
              <Title level={4} style={{ margin: 0 }}>
                {activeTab === 'menu_items' ? 'Menu Items' : 
                 activeTab === 'categories' ? 'Categories' : 'Subcategories'}
              </Title>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  setEditingItem(null);
                  form.resetFields();
                  setIsModalVisible(true);
                }}
              >
                Add New {activeTab === 'menu_items' ? 'Item' : 
                        activeTab === 'categories' ? 'Category' : 'Subcategory'}
              </Button>
            </Space>
            
            <StyledTable
              columns={activeTab === 'menu_items' ? menuItemColumns : columns[activeTab]}
              dataSource={
                activeTab === 'menu_items' ? menuItems :
                activeTab === 'categories' ? categories : subcategories
              }
              loading={loading}
              rowKey="firebaseId"
              pagination={{ pageSize: 10 }}
            />
          </StyledCard>
          
          <StyledModal
            title={editingItem ? 'Edit Item' : 'Add New Item'}
            visible={isModalVisible}
            onCancel={() => {
              setIsModalVisible(false);
              setEditingItem(null);
              form.resetFields();
            }}
            footer={null}
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={editingItem ? handleUpdate : handleCreate}
            >
              {renderFormItems()}
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  {editingItem ? 'Update' : 'Create'}
                </Button>
              </Form.Item>
            </Form>
          </StyledModal>
          
          {renderAvailabilityDrawer()}
        </StyledContent>
      </StyledLayout>
    );
  };
  
  export default MenuManagement;
