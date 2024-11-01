import React from 'react';
import { Card, Typography } from 'antd';

const { Text } = Typography;

const getImageUrl = (imageData) => {
  if (!imageData) return '';
  if (typeof imageData === 'string') return imageData;
  if (imageData.file?.url) return imageData.file.url;
  return '';
};
function CategoryCard({ category, onClick }) {
  return (
    <Card
      hoverable
      onClick={onClick}
      style={{
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
        textAlign: 'center',
        transition: 'transform 0.3s',
      }}
      bodyStyle={{
        padding: '16px',
      }}
      cover={
        category.image ? (
          <img
            alt={category.name}
            src={getImageUrl(category.image)}
            style={{ height: '120px', objectFit: 'cover', borderRadius: '12px 12px 0 0' }}
          />
        ) : (
          <div
            style={{
              height: '120px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '56px',
            }}
          >
            🍽️
          </div>
        )
      }
    >
      <Text strong style={{ fontSize: '16px' }}>{category.name}</Text>
    </Card>
  );
}

export default CategoryCard;
