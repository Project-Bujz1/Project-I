import React, { useState, useEffect } from 'react';
import {
  Layout,
  Menu,
  Form,
  Input,
  Button,
  Select,
  Modal,
  message,
  Typography,
  Switch,
  Badge,
  Card,
  Tooltip,
  Space,
  Row,
  Col,
  Empty,
  Radio,
  Drawer,
  Upload,
  Dropdown
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
  AppstoreOutlined,
  TagsOutlined,
  TagOutlined,
  MenuOutlined,
  SearchOutlined,
  FilterOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined
} from '@ant-design/icons';

const { Content, Sider } = Layout;
const { Option } = Select;
const { Title, Text } = Typography;
const { TextArea } = Input;

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
  const [siderCollapsed, setSiderCollapsed] = useState(window.innerWidth <= 768);
  const [drawerVisible, setDrawerVisible] = useState(false);
    const [imageInputType, setImageInputType] = useState('url');
  
  // Add new state variables for search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  // Filter and sort functions
  const filterAndSortItems = (items) => {
    let filteredItems = [...items];

    // Search filter
    if (searchTerm) {
      filteredItems = filteredItems.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategories.length > 0) {
      filteredItems = filteredItems.filter(item =>
        selectedCategories.includes(item.categoryId)
      );
    }

    // Subcategory filter
    if (selectedSubcategories.length > 0) {
      filteredItems = filteredItems.filter(item =>
        selectedSubcategories.includes(item.subcategoryId)
      );
    }

    // Availability filter
    if (availabilityFilter !== 'all') {
      filteredItems = filteredItems.filter(item =>
        availabilityFilter === 'available' ? item.isAvailable : !item.isAvailable
      );
    }

    // Price range filter
    filteredItems = filteredItems.filter(item =>
      item.price >= priceRange[0] && item.price <= priceRange[1]
    );

    // Sorting
    filteredItems.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'category':
          comparison = categories.find(c => c.id === a.categoryId)?.name.localeCompare(
            categories.find(c => c.id === b.categoryId)?.name
          ) || 0;
          break;
        default:
          comparison = 0;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filteredItems;
  };


  // Search and Filter component
  const SearchAndFilters = () => (
    <Card style={{ marginBottom: 16, borderRadius: '12px' }}>
      <Row gutter={[16, 16]} align="middle">
        <Col xs={24} sm={24} md={8}>
          <Input
            placeholder="Search items..."
            prefix={<SearchOutlined />}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            allowClear
          />
        </Col>
        
        <Col xs={24} sm={12} md={8}>
          <Select
            mode="multiple"
            placeholder="Filter by category"
            value={selectedCategories}
            onChange={setSelectedCategories}
            style={{ width: '100%' }}
            maxTagCount="responsive"
          >
            {categories.map(category => (
              <Select.Option key={category.id} value={category.id}>
                {category.name}
              </Select.Option>
            ))}
          </Select>
        </Col>

        <Col xs={24} sm={12} md={8}>
          <Select
            mode="multiple"
            placeholder="Filter by subcategory"
            value={selectedSubcategories}
            onChange={setSelectedSubcategories}
            style={{ width: '100%' }}
            maxTagCount="responsive"
          >
            {subcategories.map(subcategory => (
              <Select.Option key={subcategory.id} value={subcategory.id}>
                {subcategory.name}
              </Select.Option>
            ))}
          </Select>
        </Col>

        <Col xs={24} sm={12} md={8}>
          <Select
            placeholder="Filter by availability"
            value={availabilityFilter}
            onChange={setAvailabilityFilter}
            style={{ width: '100%' }}
          >
            <Select.Option value="all">All Items</Select.Option>
            <Select.Option value="available">Available Only</Select.Option>
            <Select.Option value="unavailable">Unavailable Only</Select.Option>
          </Select>
        </Col>

        <Col xs={24} sm={12} md={8}>
          <Select
            placeholder="Sort by"
            value={sortBy}
            onChange={setSortBy}
            style={{ width: '100%' }}
            dropdownRender={menu => (
              <div>
                {menu}
                <div style={{ padding: '8px', borderTop: '1px solid #f0f0f0' }}>
                  <Space>
                    <Button
                      type={sortOrder === 'asc' ? 'primary' : 'text'}
                      icon={<SortAscendingOutlined />}
                      onClick={() => setSortOrder('asc')}
                      size="small"
                    >
                      Ascending
                    </Button>
                    <Button
                      type={sortOrder === 'desc' ? 'primary' : 'text'}
                      icon={<SortDescendingOutlined />}
                      onClick={() => setSortOrder('desc')}
                      size="small"
                    >
                      Descending
                    </Button>
                  </Space>
                </div>
              </div>
            )}
          >
            <Select.Option value="name">Name</Select.Option>
            <Select.Option value="price">Price</Select.Option>
            <Select.Option value="category">Category</Select.Option>
          </Select>
        </Col>

        <Col xs={24} sm={12} md={8}>
          <Space>
            <Button
              type="primary"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategories([]);
                setSelectedSubcategories([]);
                setAvailabilityFilter('all');
                setPriceRange([0, 10000]);
                setSortBy('name');
                setSortOrder('asc');
              }}
            >
              Reset Filters
            </Button>
          </Space>
        </Col>
      </Row>
    </Card>
  );
   // Get orgId from localStorage
  const orgId = localStorage.getItem('orgId');

  useEffect(() => {
    fetchData();
    const handleResize = () => {
      setSiderCollapsed(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchData = async () => {

    setLoading(true);

    try {

      const [categoriesRes, subcategoriesRes, menuItemsRes] = await Promise.all(

        [

          fetch(`${API_URL}/categories.json`),

          fetch(`${API_URL}/subcategories.json`),

          fetch(`${API_URL}/menu_items.json`),

        ]

      );

      const [categoriesData, subcategoriesData, menuItemsData] =

        await Promise.all([

          categoriesRes.json(),

          subcategoriesRes.json(),

          menuItemsRes.json(),

        ]);



      const categoriesArray = categoriesData

        ? Object.entries(categoriesData)

            .map(([firebaseId, data]) => ({ firebaseId, ...data }))

            .filter(item => item && item.orgId === parseInt(orgId))

        : [];

      const subcategoriesArray = subcategoriesData

        ? Object.entries(subcategoriesData)

            .map(([firebaseId, data]) => ({ firebaseId, ...data }))

            .filter(item => item && item.orgId === parseInt(orgId))

        : [];

      const menuItemsArray = menuItemsData

        ? Object.entries(menuItemsData)

            .map(([firebaseId, data]) => ({ firebaseId, ...data }))

            .filter(item => item && item.orgId === parseInt(orgId))

        : [];



      setCategories(categoriesArray);

      setSubcategories(subcategoriesArray);

      setMenuItems(menuItemsArray);

    } catch (error) {

      console.error('Error fetching data:', error);

      message.error('Failed to fetch data');

    }

    setLoading(false);

  };

// Also update the handleCreate function to properly handle both image types
const handleCreate = async values => {
  const type = activeTab === 'categories'
    ? 'categories'
    : activeTab === 'subcategories'
    ? 'subcategories'
    : 'menu_items';
    
  try {
    // Handle image data for menu items
    let imageData;
    if (type === 'menu_items') {
      if (imageInputType === 'url') {
        imageData = values.imageUrl;
      } else if (imageInputType === 'upload' && values.imageUpload?.[0]) {
        imageData = {
          file: {
            url: values.imageUpload[0].url || values.imageUpload[0].thumbUrl,
            name: values.imageUpload[0].name
          }
        };
      }
    }

    const dataToCreate = {
      ...values,
      image: imageData,
      orgId: parseInt(orgId)
    };

    // Remove unnecessary fields
    delete dataToCreate.imageUrl;
    delete dataToCreate.imageUpload;

    const response = await fetch(`${API_URL}/${type}.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataToCreate),
    });

    if (response.ok) {
      const data = await response.json();
      const newItem = {
        firebaseId: data.name,
        ...dataToCreate,
      };
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
const handleUpdate = async values => {
  const type = activeTab === 'categories'
    ? 'categories'
    : activeTab === 'subcategories'
    ? 'subcategories'
    : 'menu_items';
    
  try {
    if (!editingItem || !editingItem.firebaseId) {
      throw new Error('No item selected for update');
    }

    // Handle image data based on input type
    let imageData;
    if (type === 'menu_items') {
      if (imageInputType === 'url') {
        imageData = values.imageUrl;
      } else if (imageInputType === 'upload' && values.imageUpload?.[0]) {
        imageData = {
          file: {
            url: values.imageUpload[0].url || values.imageUpload[0].thumbUrl,
            name: values.imageUpload[0].name
          }
        };
      }
    }

    const dataToUpdate = {
      ...values,
      image: imageData,
      orgId: parseInt(orgId)
    };

    // Remove unnecessary fields
    delete dataToUpdate.imageUrl;
    delete dataToUpdate.imageUpload;

    const response = await fetch(
      `${API_URL}/${type}/${editingItem.firebaseId}.json`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToUpdate),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update item');
    }

    const updatedItem = { ...editingItem, ...dataToUpdate };
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

// Helper function to get the correct image URL
const getImageUrl = (imageData) => {
  if (!imageData) return '/api/placeholder/80/80';
  
  if (typeof imageData === 'string') {
    return imageData; // Direct URL
  }
  
  if (imageData.file && imageData.file.url) {
    return imageData.file.url; // Uploaded file URL
  }
  
  return '/api/placeholder/80/80'; // Fallback
};

const handleDelete = async firebaseId => {

  const type =

    activeTab === 'categories'

      ? 'categories'

      : activeTab === 'subcategories'

      ? 'subcategories'

      : 'menu_items';

  try {

    const response = await fetch(`${API_URL}/${type}/${firebaseId}.json`, {

      method: 'DELETE',

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

  const updateState = prevState => {

    switch (action) {

      case 'add':

        return [...prevState, item];

      case 'update':

        return prevState.map(i =>

          i.firebaseId === item.firebaseId ? { ...i, ...item } : i

        );

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

      body: JSON.stringify({ isAvailable }),

    });



    setMenuItems(prev =>

      prev.map(item =>

        item.firebaseId === firebaseId ? { ...item, isAvailable } : item

      )

    );



    message.success(

      `Item ${isAvailable ? 'available' : 'unavailable'} status updated`

    );

  } catch (error) {

    message.error('Failed to update availability status');

  }

};



const handleSaveAvailability = async firebaseId => {

  try {

    const values = await form.validateFields();

    await fetch(`${API_URL}/menu_items/${firebaseId}.json`, {

      method: 'PATCH',

      headers: { 'Content-Type': 'application/json' },

      body: JSON.stringify(values),

    });



    setMenuItems(prev =>

      prev.map(item =>

        item.firebaseId === firebaseId ? { ...item, ...values } : item

      )

    );



    setAvailabilityDrawer(false);

    message.success('Availability details updated successfully');

  } catch (error) {

    console.error('Error saving availability:', error);

    message.error('Failed to update availability details');

  }

};



const handleCategoryChange = categoryId => {

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

          <Button

            icon={<EditOutlined />}

            onClick={() => {

              setEditingItem(record);

              form.setFieldsValue(record);

              setIsModalVisible(true);

            }}

          />

          <Button

            icon={<DeleteOutlined />}

            onClick={() => handleDelete(record.firebaseId)}

            style={{ marginLeft: 8 }}

          />

        </>

      ),

    },

  ],

  subcategories: [

    { title: 'Name', dataIndex: 'name', key: 'name' },

    {

      title: 'Category',

      dataIndex: 'categoryId',

      key: 'categoryId',

      render: categoryId => categories.find(c => c.id === categoryId)?.name,

    },

    {

      title: 'Actions',

      key: 'actions',

      render: (_, record) => (

        <>

          <Button

            icon={<EditOutlined />}

            onClick={() => {

              setEditingItem(record);

              form.setFieldsValue(record);

              setIsModalVisible(true);

            }}

          />

          <Button

            icon={<DeleteOutlined />}

            onClick={() => handleDelete(record.firebaseId)}

            style={{ marginLeft: 8 }}

          />

        </>

      ),

    },

  ],

  menuItems: [

    { title: 'Name', dataIndex: 'name', key: 'name' },

    { title: 'Description', dataIndex: 'description', key: 'description' },

    { title: 'Price', dataIndex: 'price', key: 'price' },

    {

      title: 'Category',

      dataIndex: 'categoryId',

      key: 'categoryId',

      render: categoryId => categories.find(c => c.id === categoryId)?.name,

    },

    {

      title: 'Subcategory',

      dataIndex: 'subcategoryId',

      key: 'subcategoryId',

      render: subcategoryId =>

        subcategories.find(s => s.id === subcategoryId)?.name,

    },

    {

      title: 'Actions',

      key: 'actions',

      width: 150,

      render: (_, record) => (

        <>

          <Button

            icon={<EditOutlined />}

            onClick={() => {

              setEditingItem(record);

              form.setFieldsValue(record);

              setIsModalVisible(true);

            }}

          />

          <Button

            icon={<DeleteOutlined />}

            onClick={() => handleDelete(record.firebaseId)}

            style={{ marginLeft: 8 }}

          />

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
  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
}}
actions={[
  <Tooltip title="Edit">
    <EditOutlined
      key="edit"
      onClick={(e) => {
        e.stopPropagation();
        setEditingItem(item);
        if (typeof item.image === 'string') {
          setImageInputType('url');
          form.setFieldsValue({
            ...item,
            imageUrl: item.image // Set the URL in the imageUrl field
          });
        } else if (item.image?.file) {
          setImageInputType('upload');
          form.setFieldsValue({
            ...item,
            imageUpload: [{
              uid: '-1',
              name: 'current-image',
              status: 'done',
              url: item.image.file.url
            }]
          });
        }
        else {
          // No image case
          setImageInputType('url');
          form.setFieldsValue({
            ...item,
            imageUrl: ''
          });
        }
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
  </Tooltip>,
]}
>
<div style={{ padding: '12px' }}>
  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <img
        // src={
        //   typeof item.image === 'string'
        //     ? item.image // Image is a URL
        //     : item.image?.file?.url || '/api/placeholder/80/80' // Image is a file object or fallback
        // }
        src={getImageUrl(item.image)}
        alt={item.name}
        style={{
          width: '80px',
          height: '80px',
          objectFit: 'cover',
          borderRadius: '8px',
          border: '1px solid #f0f0f0',
        }}
        onError={(e) => {
          e.target.src = '/api/placeholder/80/80';
        }}
      />
      <div style={{ flex: 1 }}>
        <Text strong style={{ fontSize: '16px', display: 'block', marginBottom: '4px' }}>
          {item.name}
        </Text>
        <Text type="secondary" style={{ fontSize: '14px' }}>
          {categories.find((c) => c.firebaseId === item.categoryId)?.name} →{' '}
          {subcategories.find((s) => s.firebaseId === item.subcategoryId)?.name}
        </Text>
      </div>
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Text style={{ color: '#ff4d4f', fontSize: '18px', fontWeight: 'bold' }}>
        ₹{item.price}
      </Text>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Switch
          checked={item.isAvailable}
          onChange={(checked) => handleAvailabilityChange(item.firebaseId, checked)}
          style={{ backgroundColor: item.isAvailable ? '#52c41a' : '#f5f5f5' }}
        />
        <Badge
          status={item.isAvailable ? 'success' : 'error'}
          text={item.isAvailable ? 'Available' : 'Unavailable'}
        />
      </div>
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
    className='category-card'
    style={{
      marginBottom: '16px',
      borderRadius: '12px',
      backgroundColor: type === 'category' ? '#fff0f6' : '#f6ffed',
    }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Space>
        {type === 'category' ? (
          <TagsOutlined style={{ fontSize: '20px', color: '#eb2f96' }} />
        ) : (
          <TagOutlined style={{ fontSize: '20px', color: '#52c41a' }} />
        )}
        <div>
          <Text strong style={{ fontSize: '16px', display: 'block' }}>
            {item.name}
          </Text>
          {type === 'subcategory' && (
            <Text type='secondary' style={{ fontSize: '12px' }}>
              {categories.find((c) => c.firebaseId === item.categoryId)?.name}
            </Text>
          )}
        </div>
      </Space>
      <Space>
        <Button
          type='text'
          icon={<EditOutlined />}
          onClick={() => {
            setEditingItem(item);
            form.setFieldsValue(item);
            setIsModalVisible(true);
          }}
        />
        <Button
          type='text'
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleDelete(item.firebaseId)}
        />
      </Space>
    </div>
  </Card>
);

  const renderFormItems = () => {  
    const handleImageInputTypeChange = (e) => {
      setImageInputType(e.target.value);
    };
  
    switch (activeTab) {
      case 'categories':
        return (
          <>
            <Form.Item
              name="name"
              label="Category Name"
              rules={[{ required: true, message: 'Please input the category name!' }]}
            >
              <Input />
            </Form.Item>
          </>
        );
      case 'subcategories':
        return (
          <>
            <Form.Item
              name="name"
              label="Subcategory Name"
              rules={[{ required: true, message: 'Please input the subcategory name!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="categoryId"
              label="Category"
              rules={[{ required: true, message: 'Please select a category!' }]}
            >
              <Select onChange={handleCategoryChange}>
                {categories.map((category) => (
                  <Option key={category.id} value={category.id}>
                    {category.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </>
        );
      case 'menu_items':
        return (
          <>
            <Form.Item
              name="name"
              label="Item Name"
              rules={[{ required: true, message: 'Please input the item name!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="description"
              label="Description"
            >
              <Input.TextArea rows={4} />
            </Form.Item>
            <Form.Item
              name="price"
              label="Price"
              rules={[{ required: true, message: 'Please input the price!' }]}
            >
              <Input type="number" prefix="₹" />
            </Form.Item>
            {/* Image Input Type Selection */}
            <Form.Item label="Image Input Type">
              <Radio.Group onChange={handleImageInputTypeChange} value={imageInputType}>
                <Radio value="url">Provide URL</Radio>
                <Radio value="upload">Upload from System</Radio>
              </Radio.Group>
            </Form.Item>
            {/* Conditional Rendering Based on Image Input Type */}
            {imageInputType === 'url' ? (
              <Form.Item
                name="imageUrl"
                label="Image URL"
                rules={[{ required: true, message: 'Please provide the image URL!' }]}
              >
                <Input />
              </Form.Item>
            ) : (
              <Form.Item
                name="imageUpload"
                label="Upload Image"
                valuePropName="fileList"
                getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
                rules={[{ required: true, message: 'Please upload the image!' }]}
              >
                <Upload
                  name="image"
                  listType="picture"
                  beforeUpload={() => false} // Prevent automatic upload
                >
                  <Button>Click to Upload</Button>
                </Upload>
              </Form.Item>
            )}
            <Form.Item
              name="categoryId"
              label="Category"
              rules={[{ required: true, message: 'Please select a category!' }]}
            >
              <Select onChange={handleCategoryChange}>
                {categories.map((category) => (
                  <Option key={category.id} value={category.id}>
                    {category.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="subcategoryId"
              label="Subcategory"
              rules={[{ required: true, message: 'Please select a subcategory!' }]}
            >
              <Select disabled={!selectedCategory}>
                {subcategories
                  .filter((subcat) => subcat.categoryId === selectedCategory)
                  .map((subcategory) => (
                    <Option key={subcategory.id} value={subcategory.id}>
                      {subcategory.name}
                    </Option>
                  ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="isAvailable"
              label="Available"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </>
        );
      default:
        return null;
    }
  };
  
  
  const renderSiderContent = () => (
    <>
      <div style={{ padding: '24px 16px', borderBottom: '1px solid #f0f0f0', textAlign: 'center' }}>
        <Title level={4} style={{ color: '#ff4d4f', margin: 0 }}>
          Menu Management
        </Title>
      </div>
      <Menu
        mode='inline'
        selectedKeys={[activeTab]}
        style={{ borderRight: 0 }}
        onClick={({ key }) => {
          setActiveTab(key);
          if (window.innerWidth <= 768) {
            setDrawerVisible(false);
          }
        }}
      >
        <Menu.Item key='menu_items' icon={<AppstoreOutlined />}>
          Menu Items
        </Menu.Item>
        <Menu.Item key='categories' icon={<TagsOutlined />}>
          Categories
        </Menu.Item>
        <Menu.Item key='subcategories' icon={<TagOutlined />}>
          Subcategories
        </Menu.Item>
      </Menu>
    </>
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {window.innerWidth > 768 ? (
        <Sider
          width={250}
          // collapsible
          collapsed={siderCollapsed}
          // onCollapse={setSiderCollapsed}
          style={{
            background: '#fff',
            boxShadow: '2px 0 8px rgba(0,0,0,0.06)',
            overflow: 'auto',
            height: '100vh',
            position: 'fixed',
            left: 0,
          }}
        >
          {renderSiderContent()}
        </Sider>
      ) : (
        <Drawer
          placement='left'
          closable={false}
          onClose={() => setDrawerVisible(false)}
          visible={drawerVisible}
          bodyStyle={{ padding: 0 }}
        >
          {renderSiderContent()}
        </Drawer>
      )}

      <Layout style={{ marginLeft: window.innerWidth > 768 ? (siderCollapsed ? 80 : 250) : 0, marginTop: '100px' }}>
        <Content style={{ margin: '24px', overflow: 'initial' }}>
          {/* Add SearchAndFilters component when viewing menu items */}
          {activeTab === 'menu_items' && <SearchAndFilters />}
          
          <Card
            title={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {window.innerWidth <= 768 && (
                  <Button icon={<MenuOutlined />} onClick={() => setDrawerVisible(true)} />
                )}
                <Title level={4} style={{ margin: 0 }}>
                  {activeTab === 'menu_items'
                    ? 'Menu Items'
                    : activeTab === 'categories'
                    ? 'Categories'
                    : 'Subcategories'}
                </Title>
                <Button
                  type='primary'
                  icon={<PlusOutlined />}
                  onClick={() => {
                    setEditingItem(null);
                    form.resetFields();
                    setIsModalVisible(true);
                  }}
                  style={{
                    backgroundColor: '#ff4d4f',
                    borderColor: '#ff4d4f',
                    borderRadius: '6px',
                  }}
                >
                  Add New
                </Button>
              </div>
            }
            style={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
          >
            <Row gutter={[16, 16]}>
              {activeTab === 'menu_items' ? (
                menuItems.length > 0 ? (
                  filterAndSortItems(menuItems).map((item) => (
                    <Col xs={24} sm={24} md={24} lg={12} xl={12} key={item.firebaseId}>
                      <MenuItem item={item} />
                    </Col>
                  ))
                ) : (
                  <Col span={24}>
                    <Empty description='No menu items found' />
                  </Col>
                )
              ) : activeTab === 'categories' ? (
                categories.length > 0 ? (
                  categories.map((category) => (
                    <Col xs={24} sm={24} md={12} lg={8} xl={8} key={category.firebaseId}>
                      <CategoryCard item={category} type='category' />
                    </Col>
                  ))
                ) : (
                  <Col span={24}>
                    <Empty description='No categories found' />
                  </Col>
                )
              ) : subcategories.length > 0 ? (
                subcategories.map((subcategory) => (
                  <Col xs={24} sm={24} md={12} lg={8} xl={8} key={subcategory.firebaseId}>
                    <CategoryCard item={subcategory} type='subcategory' />
                  </Col>
                ))
              ) : (
                <Col span={24}>
                  <Empty description='No subcategories found' />
                </Col>
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
        <Form form={form} layout='vertical' onFinish={editingItem ? handleUpdate : handleCreate}>
          {renderFormItems()}
          <Form.Item>
            <Button
              type='primary'
              htmlType='submit'
              style={{
                backgroundColor: '#ff4d4f',
                borderColor: '#ff4d4f',
                width: '100%',
                height: '40px',
                borderRadius: '6px',
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