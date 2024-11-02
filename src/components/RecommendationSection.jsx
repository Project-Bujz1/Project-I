import React, { useState, useEffect } from 'react';
import { Button, Spin, message } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import axios from 'axios';
import RecommendationItem from './RecommendationItem';

const styles = {
  container: {
    marginTop: '16px',
    background: '#f5f5f5',
    padding: '16px',
    borderRadius: '8px'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px'
  },
  title: {
    fontSize: '16px',
    fontWeight: 'bold',
    margin: 0
  },
  scrollContainer: {
    display: 'flex',
    overflowX: 'auto',
    scrollBehavior: 'smooth',
    WebkitOverflowScrolling: 'touch',
    msOverflowStyle: '-ms-autohiding-scrollbar',
    paddingBottom: '8px'
  },
  collapsedView: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  moreCount: {
    fontSize: '14px',
    color: '#666',
    fontWeight: 'bold'
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '32px'
  }
};

const RecommendationSection = ({ isVisible, parentItemId, onAddToCart }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [isExpanded, setIsExpanded] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        // Fetch suggestions mapping
        const suggestionsResponse = await axios.get(
          'https://stage-smart-server-default-rtdb.firebaseio.com/menu_suggestions.json'
        );
        const suggestionsData = suggestionsResponse.data || {};
        
        // Get suggestion IDs for the parent item
        const suggestionIds = suggestionsData[parentItemId] || [];
        
        if (suggestionIds.length === 0) {
          setLoading(false);
          return;
        }

        // Fetch all menu items
        const menuResponse = await axios.get(
          'https://stage-smart-server-default-rtdb.firebaseio.com/menu_items.json'
        );
        const menuItems = Object.values(menuResponse.data);
// Assuming you have access to menuItems and suggestionIds
const orgId = localStorage.getItem("orgId"); // Get the orgId from local storage

const suggestedItems = menuItems.filter(item => {
    // Find if the suggestionId matches with the menuItems
    const suggestion = suggestionIds.find(s => s.name === item.name);

    // Check if suggestion exists and orgId and name match
    return suggestion && suggestion.orgId.toString() === orgId && suggestion.name === item.name;
});


        setRecommendations(suggestedItems);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
        message.error('Failed to load recommendations');
        setLoading(false);
      }
    };

    if (isVisible && parentItemId) {
      fetchRecommendations();
    }
  }, [isVisible, parentItemId]);

  if (!isVisible) return null;

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <Spin size="large" />
      </div>
    );
  }

  if (recommendations.length === 0) return null;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h4 style={styles.title}>Recommended Pairings</h4>
        <Button
          type="text"
          icon={isExpanded ? <UpOutlined /> : <DownOutlined />}
          onClick={() => setIsExpanded(!isExpanded)}
        />
      </div>
      
      {isExpanded ? (
        <div style={styles.scrollContainer}>
          {recommendations.map((item) => (
            <RecommendationItem 
              key={item.id} 
              item={item}
              onAddToCart={onAddToCart}
              collapsed={false}
            />
          ))}
        </div>
      ) : (
        <div style={styles.collapsedView}>
          <RecommendationItem 
            item={recommendations[0]}
            onAddToCart={onAddToCart}
            collapsed={true}
          />
          <div style={styles.moreCount}>
            +{recommendations.length - 1} more
          </div>
        </div>
      )}
    </div>
  );
};

export default RecommendationSection;