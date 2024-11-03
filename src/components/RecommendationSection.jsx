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

const RecommendationSection = ({ isVisible, recommendations, onAddToCart }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!isVisible) return null;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h4 style={styles.title}>People usually pair this with</h4>
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