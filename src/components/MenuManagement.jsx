  import React, { useState, useEffect } from 'react';
  import { Layout,Menu, Form, Input, Button, Select, Modal, message, Typography, Switch, Badge, Card, Tooltip, Space, Row, Col, Empty } from 'antd';
  import { PlusOutlined, EditOutlined, DeleteOutlined, InfoCircleOutlined, AppstoreOutlined, TagsOutlined, TagOutlined } from '@ant-design/icons';

  const { Content, Sider } = Layout;
  const { Option } = Select;
  const { Title, Text } = Typography;
  const { TextArea } = Input;
  const { Meta } = Card;

  const API_URL = 'https://stage-smart-server-default-rtdb.firebaseio.com';

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

    const MenuItem = ({ item }) => (
      <Card
        hoverable
        className="menu-item-card"
        style={{
          marginBottom: '16px',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
        }}
        actions={[
          <Tooltip title="Edit">
            <EditOutlined 
              key="edit" 
              onClick={(e) => {
                e.stopPropagation();
                setEditingItem(item);
                form.setFieldsValue(item);
                setIsModalVisible(true);
              }}
              style={{ color: '#1890ff' }}
            />
          </Tooltip>,
          <Tooltip title="Delete">
            <DeleteOutlined 
              key="delete" 
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(item.firebaseId);
              }}
              style={{ color: '#ff4d4f' }}
            />
          </Tooltip>
        ]}
      >
        <div style={{ padding: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <img
                src={item.image || '/api/placeholder/80/80'}
                alt={item.name}
                style={{ 
                  width: '80px', 
                  height: '80px', 
                  objectFit: 'cover', 
                  borderRadius: '8px',
                  border: '1px solid #f0f0f0'
                }}
              />
              <div>
                <Text strong style={{ fontSize: '16px', display: 'block', marginBottom: '4px' }}>
                  {item.name}
                </Text>
                <Text type="secondary" style={{ fontSize: '14px' }}>
                  {categories.find(c => c.firebaseId === item.categoryId)?.name} → {' '}
                  {subcategories.find(s => s.firebaseId === item.subcategoryId)?.name}
                </Text>
                <Text style={{ color: '#ff4d4f', fontSize: '18px', fontWeight: 'bold', display: 'block', marginTop: '8px' }}>
                  ₹{item.price}
                </Text>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Switch
                checked={item.isAvailable}
                onChange={(checked) => handleAvailabilityChange(item.firebaseId, checked)}
                style={{ 
                  backgroundColor: item.isAvailable ? '#52c41a' : '#f5f5f5',
                  marginRight: '8px'
                }}
              />
              <Badge 
                status={item.isAvailable ? 'success' : 'error'} 
                text={item.isAvailable ? 'Available' : 'Unavailable'}
                style={{ marginLeft: '8px' }}
              />
            </div>
          </div>
          {item.description && (
            <Text type="secondary" style={{ display: 'block', marginTop: '8px' }}>
              {item.description}
            </Text>
          )}
        </div>
      </Card>
    );

    const CategoryCard = ({ item, type }) => (
      <Card
        hoverable
        className="category-card"
        style={{
          marginBottom: '16px',
          borderRadius: '12px',
          backgroundColor: type === 'category' ? '#fff0f6' : '#f6ffed'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Space>
            {type === 'category' ? 
              <TagsOutlined style={{ fontSize: '20px', color: '#eb2f96' }} /> :
              <TagOutlined style={{ fontSize: '20px', color: '#52c41a' }} />
            }
            <div>
              <Text strong style={{ fontSize: '16px', display: 'block' }}>
                {item.name}
              </Text>
              {type === 'subcategory' && (
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  {categories.find(c => c.firebaseId === item.categoryId)?.name}
                </Text>
              )}
            </div>
          </Space>
          <Space>
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => {
                setEditingItem(item);
                form.setFieldsValue(item);
                setIsModalVisible(true);
              }}
            />
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(item.firebaseId)}
            />
          </Space>
        </div>
      </Card>
    );

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
      <Layout style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
        <Sider
          width={250}
          style={{
            background: '#fff',
            boxShadow: '2px 0 8px rgba(0,0,0,0.06)',
            overflow: 'auto',
            position: 'fixed',
            height: '100vh',
            left: 0
          }}
        >
          <div style={{ 
            padding: '24px 16px', 
            borderBottom: '1px solid #f0f0f0',
            textAlign: 'center'
          }}>
            <Title level={4} style={{ color: '#ff4d4f', margin: 0 }}>Menu Management</Title>
          </div>
          <Menu
            mode="inline"
            selectedKeys={[activeTab]}
            style={{ borderRight: 0 }}
            onClick={({ key }) => setActiveTab(key)}
          >
            <Menu.Item key="menu_items" icon={<AppstoreOutlined />}>
              Menu Items
            </Menu.Item>
            <Menu.Item key="categories" icon={<TagsOutlined />}>
              Categories
            </Menu.Item>
            <Menu.Item key="subcategories" icon={<TagOutlined />}>
              Subcategories
            </Menu.Item>
          </Menu>
        </Sider>

        <Layout style={{ marginLeft: 250, minHeight: '100vh' }}>
          <Content style={{ margin: '24px', overflow: 'initial' }}>
            <Card
              title={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
                    style={{ 
                      backgroundColor: '#ff4d4f', 
                      borderColor: '#ff4d4f',
                      borderRadius: '6px'
                    }}
                  >
                    Add New
                  </Button>
                </div>
              }
              style={{ 
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
              }}
            >
              <Row gutter={[16, 16]}>
                {activeTab === 'menu_items' ? (
                  menuItems.length > 0 ? (
                    menuItems.map(item => (
                      <Col xs={24} sm={24} md={24} lg={12} xl={12} key={item.firebaseId}>
                        <MenuItem item={item} />
                      </Col>
                    ))
                  ) : (
                    <Col span={24}>
                      <Empty description="No menu items found" />
                    </Col>
                  )
                ) : activeTab === 'categories' ? (
                  categories.length > 0 ? (
                    categories.map(category => (
                      <Col xs={24} sm={24} md={12} lg={8} xl={8} key={category.firebaseId}>
                        <CategoryCard item={category} type="category" />
                      </Col>
                    ))
                  ) : (
                    <Col span={24}>
                      <Empty description="No categories found" />
                    </Col>
                  )
                ) : (
                  subcategories.length > 0 ? (
                    subcategories.map(subcategory => (
                      <Col xs={24} sm={24} md={12} lg={8} xl={8} key={subcategory.firebaseId}>
                        <CategoryCard item={subcategory} type="subcategory" />
                      </Col>
                    ))
                  ) : (
                    <Col span={24}>
                      <Empty description="No subcategories found" />
                    </Col>
                  )
                )}
              </Row>
            </Card>
          </Content>
        </Layout>

        <Modal
          title={
            <Text strong style={{ fontSize: '18px' }}>
              {editingItem ? 'Edit Item' : 'Add New Item'}
            </Text>
          }
          visible={isModalVisible}
          onCancel={() => {
            setIsModalVisible(false);
            setEditingItem(null);
            form.resetFields();
          }}
          footer={null}
          style={{ top: 20 }}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={editingItem ? handleUpdate : handleCreate}
          >
            {renderFormItems()}
            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit"
                style={{ 
                  backgroundColor: '#ff4d4f', 
                  borderColor: '#ff4d4f',
                  width: '100%',
                  height: '40px',
                  borderRadius: '6px'
                }}
              >
                {editingItem ? 'Update' : 'Create'}
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </Layout>
    );
  };

  export default MenuManagement;