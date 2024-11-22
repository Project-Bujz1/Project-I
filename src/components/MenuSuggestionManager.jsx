import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Typography, Input, message, Modal, Spin, Button, Avatar } from 'antd';
import { CloseOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons';
import FoodLoader from './FoodLoader';

const { Title, Text } = Typography;
const { Search } = Input;

const styles = {
  container: {
    marginTop: '60px',
  },
  stickyHeader: {
    position: 'sticky',
    top: '64px',
    zIndex: 100,
    backgroundColor: '#fff',
    // padding: '0px 0',
    marginBottom: '16px',
    borderBottom: '1px solid #f0f0f0',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    width: '100%',
  },
  contentContainer: {
    padding: '0 0px',
  },
  header: {
    color: '#ff4d4f',
    marginBottom: '16px',
    fontSize: '1.5rem',
    paddingLeft: '8px',
  },
  searchInput: {
    marginBottom: '16px',
    paddingLeft: '8px',
    paddingRight: '8px',
  },
  menuCard: {
    marginBottom: '12px',
    position: 'relative',
    paddingBottom: '50px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  imageContainer: {
    width: '100px',
    height: '100px',
    overflow: 'hidden',
    flexShrink: 0,
    borderRadius: '8px',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  itemContent: {
    display: 'flex',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: '16px',
    marginBottom: '16px',
  },
  price: {
    color: '#ff4d4f',
    fontWeight: 'bold',
    fontSize: '16px',
    marginTop: '8px',
  },
  addSuggestionsButton: {
    position: 'absolute',
    right: '24px',
    bottom: '16px',
    backgroundColor: '#ff4d4f',
    color: '#fff',
  },
  modalSearch: {
    marginBottom: '16px',
  },
  suggestionCard: {
    cursor: 'pointer',
    marginBottom: '8px',
    transition: 'all 0.3s',
  },
  selectedSuggestion: {
    backgroundColor: '#fff1f0',
    border: '1px solid #ff4d4f',
  },
  suggestionImage: {
    width: '50px',
    height: '50px',
    objectFit: 'cover',
    marginRight: '12px',
    borderRadius: '4px',
  },
  tagsContainer: {
    marginTop: '8px',
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    width: '100%',
    minHeight: '32px',
    padding: '8px',
    backgroundColor: '#f5f5f5',
    borderRadius: '6px',
  },
  suggestionTag: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    backgroundColor: '#fff',
    padding: '4px 8px',
    borderRadius: '16px',
    border: '1px solid #e8e8e8',
  },
  suggestionName: {
    fontSize: '12px',
    color: '#666',
    marginLeft: '4px',
  },
  loadingContainer: {
    marginTop: '100px',
  },
};

const MenuSuggestionManager = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [suggestions, setSuggestions] = useState({});
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedSuggestions, setSelectedSuggestions] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const [menuResponse, suggestionsResponse] = await Promise.all([
          fetch('https://smart-server-menu-database-default-rtdb.firebaseio.com/menu_items.json'),
          fetch('https://smart-server-menu-database-default-rtdb.firebaseio.com/menu_suggestions.json')
        ]);
        const menuData = await menuResponse.json();
        const suggestionsData = await suggestionsResponse.json();

        if (menuData) {
          const orgId = parseInt(localStorage.getItem('orgId'));
          const matchedMenuItems = Object.entries(menuData)
            .map(([id, item]) => ({ id, ...item }))
            .filter(item => item.orgId === orgId);
          setMenuItems(matchedMenuItems);
        }

        if (suggestionsData) {
          setSuggestions(suggestionsData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        message.error('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const handleOpenModal = (item) => {
    setSelectedItem(item);
    setSelectedSuggestions(suggestions[item.id] || []); // Set specific suggestions for this item
    setModalVisible(true);
    setSearchText('');
  };

  const getImageUrl = (imageData) => {
    if (!imageData) return '/placeholder.jpg'; // Fallback image
    if (typeof imageData === 'string') return imageData; // Direct URL
    if (imageData.url) return imageData.url; // For URL field
    if (imageData.file?.url) return imageData.file.url; // For nested file structure
    return '/placeholder.jpg';
  };

  const handleSuggestionToggle = (suggestedItem) => {
    setSelectedSuggestions(prev => {
      const exists = prev.find(item => item.id === suggestedItem.id);
      if (exists) {
        return prev.filter(item => item.id !== suggestedItem.id);
      }
      if (prev.length >= 5) {
        message.warning('Maximum 5 suggestions allowed');
        return prev;
      }
      return [...prev, suggestedItem];
    });
  };

  const saveSuggestions = async () => {
    if (!selectedItem) return;

    if (selectedSuggestions.length < 3) {
      message.error('Please select at least 3 suggestions');
      return;
    }

    setSaving(true);
    try {
      const updatedSuggestions = {
        ...suggestions,
        [selectedItem.id]: selectedSuggestions,
      };

      const response = await fetch('https://smart-server-menu-database-default-rtdb.firebaseio.com/menu_suggestions.json', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedSuggestions),
      });

      if (!response.ok) throw new Error('Failed to save suggestions');

      setSuggestions(updatedSuggestions);
      message.success('Suggestions saved successfully');
      setModalVisible(false);
    } catch (error) {
      console.error('Error saving suggestions:', error);
      message.error('Failed to save suggestions');
    } finally {
      setSaving(false);
    }
  };

  const getFilteredItems = () => {
    if (!selectedItem) return [];
    return menuItems.filter(item => 
      item.id !== selectedItem.id &&
      (item.name.toLowerCase().includes(searchText.toLowerCase()) ||
       item.description?.toLowerCase().includes(searchText.toLowerCase()))
    );
  };

  const handleSearch = (value) => {
    setSearchText(value.toLowerCase());
  };

  const filteredMenuItems = menuItems.filter(item =>
    item.name.toLowerCase().includes(searchText) || 
    (item.description && item.description.toLowerCase().includes(searchText))
  );

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <FoodLoader />
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.stickyHeader}>
        <Title level={2} style={styles.header}>Menu Item Suggestions</Title>
        <Search
          placeholder="Search menu items..."
          onSearch={handleSearch}
          onChange={(e) => handleSearch(e.target.value)}
          style={styles.searchInput}
        />
      </div>

      <div style={styles.contentContainer}>
        <Row gutter={[16, 16]}>
          {filteredMenuItems.map(item => (
            <Col xs={24} md={12} key={item.id}>
              <Card style={styles.menuCard}>
                {suggestions[item.id]?.length > 0 && (
                  <>
                    <div style={styles.suggestionLabel}>Current Suggestions:</div>
                    <div style={styles.tagsContainer}>
                      {suggestions[item.id].map(suggestion => (
                        <div key={suggestion.id} style={styles.suggestionTag}>
                          <Avatar 
                            src={getImageUrl(suggestion.image)} 
                            alt={suggestion.name}
                            style={styles.tagImage}
                          />
                          <span style={styles.suggestionName}>{suggestion.name}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
                <div style={styles.itemContent}>
                  <div style={styles.imageContainer}>
                    <img
                      src={getImageUrl(item.image)}
                      alt={item.name}
                      style={styles.image}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <Title level={4}>{item.name}</Title>
                    <Text type="secondary">{item.description}</Text>
                    <div style={styles.price}>₹{item.price}</div>
                  </div>
                </div>
                <Button 
                  type="primary"
                  icon={<PlusOutlined />}
                  style={styles.addSuggestionsButton}
                  onClick={() => handleOpenModal(item)}
                >
                  {suggestions[item.id]?.length > 0 ? 'Update Suggestions' : 'Set Suggestions'}
                </Button>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      <Modal
        title={`Select Suggestions for ${selectedItem?.name}`}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="cancel" icon={<CloseOutlined />} onClick={() => setModalVisible(false)}>
            Cancel
          </Button>,
          <Button
            key="save"
            type="primary"
            icon={<SaveOutlined />}
            loading={saving}
            style={{ backgroundColor: '#ff4d4f', borderColor: '#ff4d4f' }}
            onClick={saveSuggestions}
          >
            Save Suggestions
          </Button>
        ]}
      >
         <Search
          placeholder="Search menu items..."
          style={styles.modalSearch}
          onChange={(e) => setSearchText(e.target.value)}
        />

        <div style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '16px' }}>
          <Row gutter={[8, 8]}>
            {getFilteredItems().map(suggestedItem => (
              <Col xs={24} md={12} key={suggestedItem.id}>
                <Card
                  hoverable
                  onClick={() => handleSuggestionToggle(suggestedItem)}
                  style={{
                    ...styles.suggestionCard,
                    ...(selectedSuggestions.some(item => item.id === suggestedItem.id) && styles.selectedSuggestion),
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img
                      src={getImageUrl(suggestedItem.image)}
                      alt={suggestedItem.name}
                      style={styles.suggestionImage}
                    />
                    <div>
                      <Text>{suggestedItem.name}</Text>
                      <div style={{ fontSize: '12px' }}>{suggestedItem.description}</div>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
              </Modal>
    </div>
  );
};

export default MenuSuggestionManager;
