import React, { useState } from 'react';
import { Carousel } from 'antd';
import { useNavigate } from 'react-router-dom';
import './HomeCarousel.css'; // Import custom CSS

const HomeCarousel = (bannerImage) => {
  const [carouselImages, setCarouselImages] = useState([
    {
      id: 2,
      imageUrl: 'https://www.shutterstock.com/image-photo/table-scene-assorted-take-out-260nw-1744848056.jpg',
      title: 'Vegetarian Specials',
      description: 'Discover our delicious vegetarian options',
      // linkUrl: '/vegetarian',
    },
    {
      id: 3,
      imageUrl: 'https://t3.ftcdn.net/jpg/07/11/98/78/360_F_711987860_gjr8VZVIJrFJH2Royf6rXkyeVSfBBVdL.jpg',
      title: 'Order Now',
      description: 'Get your favorite meals delivered',
      // linkUrl: '/menu',
    },
    {
      id: 4,
      imageUrl: 'https://www.shutterstock.com/image-illustration/restaurant-banner-design-amazing-more-260nw-2284290005.jpg',
      title: 'Food Quotes',
      description: 'Inspirational words to savor your meal',
      // linkUrl: '/quotes',
    },
    {
      id: 5,
      imageUrl: 'https://img.pikbest.com/templates/20240528/fast-food-restaurant-banner-template_10587852.jpg!w700wp',
      title: 'Red & White Combo',
      description: 'Feast on our signature red and white dishes',
      // linkUrl: '/red-white',
    },
  ]);

  const navigate = useNavigate();

  // const handleCarouselItemClick = (linkUrl) => {
  //   navigate(linkUrl);
  // };

  return (
    <>
    {/* {bannerImage && (
        <div className="banner-container">
          <img src="https://static.wixstatic.com/media/4430b8_c48862f5dd9645d6b0f868e50e85cea4~mv2.jpg/v1/fill/w_640,h_440,fp_0.50_0.50,q_80,usm_0.66_1.00_0.01,enc_auto/4430b8_c48862f5dd9645d6b0f868e50e85cea4~mv2.jpg" alt="Restaurant Banner" className="restaurant-banner" />
        </div>
      )} */}
    
    <Carousel autoplay dots={true} style={{marginTop : "35px"}}>
      {carouselImages.map((image) => (
        <div
          key={image.id}
          // onClick={() => handleCarouselItemClick(image.linkUrl)}
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
