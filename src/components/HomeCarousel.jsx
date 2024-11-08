import React, { useState } from 'react';
import { Carousel } from 'antd';
import { useNavigate } from 'react-router-dom';
import './HomeCarousel.css'; // Import custom CSS

const HomeCarousel = (bannerImage) => {
  const [carouselImages, setCarouselImages] = useState([
    {
      id: 2,
      imageUrl: 'https://img.freepik.com/free-vector/flat-design-food-sale-banner_23-2149108165.jpg',
      title: 'Vegetarian Specials',
      description: 'Discover our delicious vegetarian options',
      linkUrl: '/vegetarian',
    },
    {
      id: 3,
      imageUrl: 'https://img.freepik.com/free-vector/hand-drawn-fast-food-sale-banner_23-2150970571.jpg',
      title: 'Order Now',
      description: 'Get your favorite meals delivered',
      linkUrl: '/menu',
    },
    // {
    //   id: 4,
    //   imageUrl: 'https://i.ytimg.com/vi/vz2zGfaq1ec/maxresdefault.jpg',
    //   title: 'Food Quotes',
    //   description: 'Inspirational words to savor your meal',
    //   linkUrl: '/quotes',
    // },
    {
      id: 5,
      imageUrl: 'https://img.freepik.com/free-vector/hand-drawn-fast-food-sale-banner_23-2150968575.jpg?semt=ais_hybrid',
      title: 'Red & White Combo',
      description: 'Feast on our signature red and white dishes',
      linkUrl: '/red-white',
    },
  ]);

  const navigate = useNavigate();

  const handleCarouselItemClick = (linkUrl) => {
    navigate(linkUrl);
  };

  return (
    <>
    {bannerImage && (
        <div className="banner-container">
          <img src="https://static.wixstatic.com/media/4430b8_c48862f5dd9645d6b0f868e50e85cea4~mv2.jpg/v1/fill/w_640,h_440,fp_0.50_0.50,q_80,usm_0.66_1.00_0.01,enc_auto/4430b8_c48862f5dd9645d6b0f868e50e85cea4~mv2.jpg" alt="Restaurant Banner" className="restaurant-banner" />
        </div>
      )}
    
    <Carousel autoplay dots={true} style={{ marginTop: '20px' }}>
      {carouselImages.map((image) => (
        <div
          key={image.id}
          onClick={() => handleCarouselItemClick(image.linkUrl)}
          className="carousel-item"
        >
            <img 
            src={image.imageUrl} 
            alt={image.title} 
            className="carousel-image" 
        />
          <div className="carousel-content">
            <h2 className="carousel-title">{image.title}</h2>
            <p className="carousel-description">{image.description}</p>
          </div>
        </div>
      ))}
    </Carousel>
    </>
  );
};

export default HomeCarousel;
