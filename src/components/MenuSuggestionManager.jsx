// import React, { useState, useEffect } from 'react';
// import { Card, Row, Col, Typography, Input, message, Modal, Tag, Spin, Button, Avatar } from 'antd';
// import { PlusOutlined, SaveOutlined } from '@ant-design/icons';

// const { Title, Text } = Typography;
// const { Search } = Input;

// const styles = {
//   container: {
//     padding: '24px',
//     maxWidth: '1200px',
//     margin: '0 auto',
//   },
//   header: {
//     color: '#ff4d4f',
//     marginBottom: '24px',
//   },
//   menuCard: {
//     marginBottom: '16px',
//     position: 'relative',
//   },
//   imageContainer: {
//     width: '120px',
//     height: '120px',
//     marginRight: '16px',
//     overflow: 'hidden',
//   },
//   image: {
//     width: '100%',
//     height: '100%',
//     objectFit: 'cover',
//   },
//   itemContent: {
//     display: 'flex',
//     alignItems: 'flex-start',
//   },
//   price: {
//     color: '#ff4d4f',
//     fontWeight: 'bold',
//     fontSize: '16px',
//     marginTop: '8px',
//   },
//   addSuggestionsButton: {
//     position: 'absolute',
//     right: '24px',
//     bottom: '24px',
//     backgroundColor: '#ff4d4f',
//     color: '#fff',
//   },
//   modalSearch: {
//     marginBottom: '16px',
//   },
//   suggestionCard: {
//     cursor: 'pointer',
//     marginBottom: '8px',
//     transition: 'all 0.3s',
//   },
//   selectedSuggestion: {
//     backgroundColor: '#fff1f0',
//     border: '1px solid #ff4d4f',
//   },
//   suggestionImage: {
//     width: '50px',
//     height: '50px',
//     objectFit: 'cover',
//     marginRight: '12px',
//     borderRadius: '4px',
//   },
//   tagsContainer: {
//     marginTop: '12px',
//     display: 'flex',
//     gap: '8px',
//     flexWrap: 'wrap',
//   },
//   tagImage: {
//     borderRadius: '50%',
//     width: '32px',
//     height: '32px',
//   },
//   loadingContainer: {
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     minHeight: '200px',
//   },
// };

// const MenuSuggestionManager = () => {
//   const [menuItems, setMenuItems] = useState([]);
//   const [suggestions, setSuggestions] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [selectedItem, setSelectedItem] = useState(null);
//   const [selectedSuggestions, setSelectedSuggestions] = useState([]);
//   const [searchText, setSearchText] = useState('');
//   const [saving, setSaving] = useState(false);

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       await fetchMenuItems();
//       await fetchSuggestions();
//     } catch (error) {
//       message.error('Failed to fetch data');
//       console.error('Error fetching data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchMenuItems = async () => {
//     const orgId = parseInt(localStorage.getItem('orgId'));
//     try {
//       const response = await fetch('https://stage-smart-server-default-rtdb.firebaseio.com/menu_items.json');
//       const data = await response.json();
//       if (data) {
//         const matchedMenuItems = Object.entries(data)
//           .map(([id, item]) => ({ id, ...item }))
//           .filter(item => item.orgId === orgId);

//         setMenuItems(matchedMenuItems);
//       }
//     } catch (error) {
//       console.error("Error fetching menu items:", error);
//     }
//   };

//   const fetchSuggestions = async () => {
//     try {
//       const response = await fetch('https://stage-smart-server-default-rtdb.firebaseio.com/menu_suggestions.json');
//       const data = await response.json();
//       if (data) {
//         setSuggestions(data);
//       }
//     } catch (error) {
//       console.error("Error fetching suggestions:", error);
//     }
//   };

//   const handleOpenModal = (item) => {
//     setSelectedItem(item);
//     setSelectedSuggestions(suggestions[item.id] || []);
//     setModalVisible(true);
//     setSearchText('');
//   };

//   const getImageUrl = (imageData) => {
//     if (!imageData) return '';
//     if (typeof imageData === 'string') return imageData;
//     if (imageData.file?.url) return imageData.file.url;
//     return '';
//   };

//   const handleSuggestionToggle = (suggestedItem) => {
//     setSelectedSuggestions(prev => {
//       if (prev.includes(suggestedItem.id)) {
//         return prev.filter(id => id !== suggestedItem.id);
//       } else {
//         if (prev.length >= 5) {
//           message.warning('Maximum 5 suggestions allowed');
//           return prev;
//         }
//         return [...prev, suggestedItem.id];
//       }
//     });
//   };

//   const saveSuggestions = async () => {
//     if (!selectedItem) return;

//     if (selectedSuggestions.length < 3) {
//       message.error('Please select at least 3 suggestions');
//       return;
//     }

//     setSaving(true);
//     try {
//       const payload = {
//         ...suggestions,
//         [selectedItem.id]: selectedSuggestions,
//       };

//       const response = await fetch('https://stage-smart-server-default-rtdb.firebaseio.com/menu_suggestions.json', {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(payload),
//       });

//       if (!response.ok) throw new Error('Failed to save suggestions');

//       setSuggestions(payload);
//       message.success('Suggestions saved successfully');
//       setModalVisible(false);
//     } catch (error) {
//       message.error('Failed to save suggestions');
//       console.error('Error saving suggestions:', error);
//     } finally {
//       setSaving(false);
//     }
//   };

//   const getFilteredItems = () => {
//     return menuItems.filter(item => 
//       item.id !== selectedItem?.id &&
//       (item.name.toLowerCase().includes(searchText.toLowerCase()) ||
//       item.description.toLowerCase().includes(searchText.toLowerCase()))
//     );
//   };

//   const getSuggestionItems = (itemId) => {
//     const suggestionIds = suggestions[itemId] || [];
//     return suggestionIds.map(id => menuItems.find(item => item.id === id)).filter(Boolean);
//   };

//   if (loading) {
//     return (
//       <div style={styles.loadingContainer}>
//         <Spin size="large" />
//       </div>
//     );
//   }

//   return (
//     <div style={styles.container}>
//       <Title level={2} style={styles.header}>Menu Item Suggestions</Title>

//       <Row gutter={[16, 16]}>
//         {menuItems.map(item => (
//           <Col xs={24} md={12} key={item.id}>
//             <Card style={styles.menuCard}>
//               <div style={styles.itemContent}>
//                 <div style={styles.imageContainer}>
//                   <img
//                     src={getImageUrl(item.image)}
//                     alt={item.name}
//                     style={styles.image}
//                   />
//                 </div>
//                 <div style={{ flex: 1 }}>
//                   <Title level={4}>{item.name}</Title>
//                   <Text type="secondary">{item.description}</Text>
//                   <div style={styles.price}>₹{item.price}</div>
//                   <div style={styles.tagsContainer}>
//                     {getSuggestionItems(item.id).map(suggestion => (
//                       <Avatar 
//                         src={getImageUrl(suggestion.image)} 
//                         alt={suggestion.name}
//                         style={styles.tagImage} 
//                         key={suggestion.id}
//                       />
//                     ))}
//                   </div>
//                 </div>
//               </div>
//               <Button 
//                 type="primary"
//                 icon={<PlusOutlined />}
//                 style={styles.addSuggestionsButton}
//                 onClick={() => handleOpenModal(item)}
//               >
//                 {suggestions[item.id] && suggestions[item.id].length > 0 ? 'Update Suggestions' : 'Set Suggestions'}
//               </Button>
//             </Card>
//           </Col>
//         ))}
//       </Row>

//       <Modal
//         title={`Select Suggestions for ${selectedItem?.name}`}
//         open={modalVisible}
//         onCancel={() => setModalVisible(false)}
//         footer={[
//           <Button key="cancel" onClick={() => setModalVisible(false)}>
//             Cancel
//           </Button>,
//           <Button
//             key="save"
//             type="primary"
//             icon={<SaveOutlined />}
//             loading={saving}
//             onClick={saveSuggestions}
//           >
//             Save Suggestions
//           </Button>,
//         ]}
//       >
//         <Search
//           placeholder="Search menu items..."
//           style={styles.modalSearch}
//           onChange={(e) => setSearchText(e.target.value)}
//         />

//         <Row gutter={[8, 8]}>
//           {getFilteredItems().map(suggestedItem => (
//             <Col xs={24} md={12} key={suggestedItem.id}>
//               <Card
//                 hoverable
//                 onClick={() => handleSuggestionToggle(suggestedItem)}
//                 style={{
//                   ...styles.suggestionCard,
//                   ...(selectedSuggestions.includes(suggestedItem.id) ? styles.selectedSuggestion : {}),
//                 }}
//               >
//                 <div style={{ display: 'flex', alignItems: 'center' }}>
//                   <img
//                     src={getImageUrl(suggestedItem.image)}
//                     alt={suggestedItem.name}
//                     style={styles.suggestionImage}
//                   />
//                   <div>
//                     <Title level={5}>{suggestedItem.name}</Title>
//                     <Text type="secondary">{suggestedItem.description}</Text>
//                   </div>
//                 </div>
//               </Card>
//             </Col>
//           ))}
//         </Row>
//       </Modal>
//     </div>
//   );
// };

// export default MenuSuggestionManager;
import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Typography, Input, message, Modal, Spin, Button, Avatar } from 'antd';
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
      marginTop: '12px',
      display: 'flex',
      gap: '8px',
      flexWrap: 'wrap',
    },
    tagImage: {
      borderRadius: '50%',
      width: '32px',
      height: '32px',
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
  const [selectedSuggestions, setSelectedSuggestions] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [saving, setSaving] = useState(false);

  // Fetch both menu items and suggestions simultaneously
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const [menuResponse, suggestionsResponse] = await Promise.all([
          fetch('https://stage-smart-server-default-rtdb.firebaseio.com/menu_items.json'),
          fetch('https://stage-smart-server-default-rtdb.firebaseio.com/menu_suggestions.json')
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

  // Update selectedSuggestions when modal is opened
  const handleOpenModal = (item) => {
    setSelectedItem(item);
    // Ensure we're getting the latest suggestions for this item
    setSelectedSuggestions(suggestions[item.id] || []);
    setModalVisible(true);
    setSearchText('');
  };

  const getImageUrl = (imageData) => {
    if (!imageData) return '/placeholder.jpg'; // Add a default placeholder
    if (typeof imageData === 'string') return imageData;
    if (imageData.file?.url) return imageData.file.url;
    return '/placeholder.jpg';
  };

  const handleSuggestionToggle = (suggestedItem) => {
    setSelectedSuggestions(prev => {
      const newSuggestions = prev.includes(suggestedItem.id)
        ? prev.filter(id => id !== suggestedItem.id)
        : prev.length >= 5
          ? (message.warning('Maximum 5 suggestions allowed'), prev)
          : [...prev, suggestedItem.id];
      return newSuggestions;
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

      const response = await fetch('https://stage-smart-server-default-rtdb.firebaseio.com/menu_suggestions.json', {
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

  const getSuggestionItems = (itemId) => {
    const suggestionIds = suggestions[itemId] || [];
    return suggestionIds
      .map(id => menuItems.find(item => item.id === id))
      .filter(Boolean); // Remove any undefined items
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
            <Card style={styles.menuCard}>
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
                      <Avatar 
                        key={suggestion.id}
                        src={getImageUrl(suggestion.image)} 
                        alt={suggestion.name}
                        style={styles.tagImage}
                      />
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
                {suggestions[item.id]?.length > 0 ? 'Update Suggestions' : 'Set Suggestions'}
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
          >
            Save Suggestions
          </Button>,
        ]}
      >
        <Search
          placeholder="Search menu items..."
          style={styles.modalSearch}
          onChange={(e) => setSearchText(e.target.value)}
        />

        <Row gutter={[8, 8]}>
          {getFilteredItems().map(suggestedItem => (
            <Col xs={24} md={12} key={suggestedItem.id}>
              <Card
                hoverable
                onClick={() => handleSuggestionToggle(suggestedItem)}
                style={{
                  ...styles.suggestionCard,
                  ...(selectedSuggestions.includes(suggestedItem.id) ? styles.selectedSuggestion : {}),
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <img
                    src={getImageUrl(suggestedItem.image)}
                    alt={suggestedItem.name}
                    style={styles.suggestionImage}
                  />
                  <div>
                    <Title level={5}>{suggestedItem.name}</Title>
                    <Text type="secondary">{suggestedItem.description}</Text>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Modal>
    </div>
  );
};

export default MenuSuggestionManager;