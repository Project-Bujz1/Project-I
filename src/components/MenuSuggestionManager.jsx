
import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Typography, Input, message, Modal, Tag, Spin, Button } from 'antd';
import { PlusOutlined, SaveOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Search } = Input;

const styles = {
container: {
    padding: '24px',
    maxWidth: '1200px',
    margin: '0 auto',
},
header: {
    color: '#ff4d4f',
    marginBottom: '24px',
},
menuCard: {
    marginBottom: '16px',
    position: 'relative',
},
imageContainer: {
    width: '120px',
    height: '120px',
    marginRight: '16px',
    overflow: 'hidden',
},
image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
},
itemContent: {
    display: 'flex',
    alignItems: 'flex-start',
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
    bottom: '24px',
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
    marginTop: '12px',
},
loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '200px',
},
};

const MenuSuggestionManager = () => {
const [menuItems, setMenuItems] = useState([]);
const [suggestions, setSuggestions] = useState({});
const [loading, setLoading] = useState(true);
const [modalVisible, setModalVisible] = useState(false);
const [selectedItem, setSelectedItem] = useState(null);
const [searchText, setSearchText] = useState('');
const [saving, setSaving] = useState(false);

useEffect(() => {
    fetchData();
}, []);

const fetchMenuItems = async () => {
    const orgId = parseInt(localStorage.getItem('orgId')); // Retrieve and parse orgId from localStorage
    
    try {
      const menuResponse = await fetch('https://stage-smart-server-default-rtdb.firebaseio.com/menu_items.json');
      const menuData = await menuResponse.json();
  
      if (menuData) {
        // Convert menuData to an array and filter based on orgId
        const matchedMenuItems = Object.entries(menuData)
          .map(([id, item]) => ({ id, ...item }))
          .filter(item => item.orgId === orgId);
  
        setMenuItems(matchedMenuItems);
      }
    } catch (error) {
      console.error("Error fetching menu items:", error);
    }
  };
  
  

const fetchData = async () => {
    try {
    // Fetch menu items
    // const menuResponse = await fetch('https://stage-smart-server-default-rtdb.firebaseio.com/menu_items.json');
    // const menuData = await menuResponse.json();
    // const itemsArray = Object.values(menuData);
    // setMenuItems(itemsArray);
    fetchMenuItems();

    // Fetch existing suggestions
    const suggestionsResponse = await fetch('https://stage-smart-server-default-rtdb.firebaseio.com/menu_suggestions.json');
    const suggestionsData = await suggestionsResponse.json();
    if (suggestionsData) {
        setSuggestions(suggestionsData);
    }
    } catch (error) {
    message.error('Failed to fetch data');
    console.error('Error fetching data:', error);
    } finally {
    setLoading(false);
    }
};

const handleOpenModal = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
    setSearchText('');
};
const getImageUrl = (imageData) => {
    if (!imageData) return '';
    if (typeof imageData === 'string') return imageData;
    if (imageData.file?.url) return imageData.file.url;
    return '';
  };
const handleSuggestionToggle = (suggestedItem) => {
    if (!selectedItem) return;

    setSuggestions(prev => {
    const currentSuggestions = prev[selectedItem.id] || [];
    if (currentSuggestions.includes(suggestedItem.id)) {
        return {
        ...prev,
        [selectedItem.id]: currentSuggestions.filter(id => id !== suggestedItem.id)
        };
    } else {
        if (currentSuggestions.length >= 5) {
        message.warning('Maximum 5 suggestions allowed');
        return prev;
        }
        return {
        ...prev,
        [selectedItem.id]: [...currentSuggestions, suggestedItem.id]
        };
    }
    });
};

const saveSuggestions = async () => {
    if (!selectedItem) return;
    
    const currentSuggestions = suggestions[selectedItem.id] || [];
    
    if (currentSuggestions.length < 3) {
        message.error('Please select at least 3 suggestions');
        return;
    }

    setSaving(true);
    try {
        // Create an array of full item objects for the suggestions
        const suggestionItems = currentSuggestions.map(suggestionId => {
            return menuItems.find(item => item.id === suggestionId);
        }).filter(Boolean); // Filter out any undefined items
        
        // Create a payload containing the selected item's ID and its suggestions
        const payload = {
            [selectedItem.id]: suggestionItems,
        };

        const response = await fetch('https://stage-smart-server-default-rtdb.firebaseio.com/menu_suggestions.json', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload), // Send the full item info
        });

        if (!response.ok) throw new Error('Failed to save suggestions');
        
        message.success('Suggestions saved successfully');
        setModalVisible(false);
    } catch (error) {
        message.error('Failed to save suggestions');
        console.error('Error saving suggestions:', error);
    } finally {
        setSaving(false);
    }
};


// const saveSuggestions = async () => {
//     if (!selectedItem) return;
//     const currentSuggestions = suggestions[selectedItem.id] || [];
    
//     if (currentSuggestions.length < 3) {
//     message.error('Please select at least 3 suggestions');
//     return;
//     }

//     setSaving(true);
//     try {
//     const response = await fetch('https://stage-smart-server-default-rtdb.firebaseio.com/menu_suggestions.json', {
//         method: 'PUT',
//         headers: {
//         'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(suggestions),
//     });

//     if (!response.ok) throw new Error('Failed to save suggestions');
    
//     message.success('Suggestions saved successfully');
//     setModalVisible(false);
//     } catch (error) {
//     message.error('Failed to save suggestions');
//     console.error('Error saving suggestions:', error);
//     } finally {
//     setSaving(false);
//     }
// };

const getFilteredItems = () => {
    return menuItems.filter(item => 
    item.id !== selectedItem?.id &&
    (item.name.toLowerCase().includes(searchText.toLowerCase()) ||
    item.description.toLowerCase().includes(searchText.toLowerCase()))
    );
};

const getSuggestionItems = (itemId) => {
    const suggestionIds = suggestions[itemId] || [];
    return suggestionIds.map(id => menuItems.find(item => item.id === id)).filter(Boolean);
};

if (loading) {
    return (
    <div style={styles.loadingContainer}>
        <Spin size="large" />
    </div>
    );
}

return (
    <div style={styles.container}>
    <Title level={2} style={styles.header}>Menu Item Suggestions</Title>

    <Row gutter={[16, 16]}>
        {menuItems.map(item => (
        <Col xs={24} md={12} key={item.id}>
            <Card>
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
                <div style={styles.tagsContainer}>
                    {getSuggestionItems(item.id).map(suggestion => (
                    <Tag color="red" key={suggestion.id}>
                        {suggestion.name}
                    </Tag>
                    ))}
                </div>
                </div>
            </div>
            <Button 
                type="primary"
                icon={<PlusOutlined />}
                style={styles.addSuggestionsButton}
                onClick={() => handleOpenModal(item)}
            >
                Set Suggestions
            </Button>
            </Card>
        </Col>
        ))}
    </Row>

    <Modal
        title={`Select Suggestions for ${selectedItem?.name}`}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
        <Button key="cancel" onClick={() => setModalVisible(false)}>
            Cancel
        </Button>,
        <Button
            key="save"
            type="primary"
            icon={<SaveOutlined />}
            loading={saving}
            onClick={saveSuggestions}
            disabled={!selectedItem || 
                    !suggestions[selectedItem.id] ||
                    suggestions[selectedItem.id].length < 3}
        >
            Save Suggestions
        </Button>
        ]}
        width={800}
    >
        <Search
        placeholder="Search menu items..."
        style={styles.modalSearch}
        onChange={(e) => setSearchText(e.target.value)}
        value={searchText}
        />
        
        <Text type="secondary">
        Selected: {suggestions[selectedItem?.id]?.length || 0}/5 (minimum 3 required)
        </Text>
        
        <div style={{ marginTop: '16px', maxHeight: '400px', overflowY: 'auto' }}>
        {getFilteredItems().map(item => (
            <Card
            key={item.id}
            style={{
                ...styles.suggestionCard,
                ...(suggestions[selectedItem?.id]?.includes(item.id) ? styles.selectedSuggestion : {})
            }}
            onClick={() => handleSuggestionToggle(item)}
            >
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <img
                src={getImageUrl(item.image)}
                alt={item.name}
                style={styles.suggestionImage}
                />
                <div>
                <Text strong>{item.name}</Text>
                <div style={{ color: '#ff4d4f' }}>₹{item.price}</div>
                </div>
            </div>
            </Card>
        ))}
        </div>
    </Modal>
    </div>
);
};

export default MenuSuggestionManager;