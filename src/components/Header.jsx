import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Input, Badge, Tooltip, Modal } from 'antd';
import { TiThMenu } from 'react-icons/ti';
import { AiOutlineShoppingCart, AiOutlineFileText } from 'react-icons/ai';
import { IoPowerSharp } from "react-icons/io5";
import { useCart } from '../contexts/CartContext';
import { useCartIcon } from '../contexts/CartIconContext';
import './Header.css';
import CartHitEffect from './CartHitEffect';

const { Search } = Input;
const role = localStorage.getItem('role');

function Header({ toggleDrawer, onSearch }) {
  const { cart } = useCart();
  const cartIconRef = useCartIcon();
  const navigate = useNavigate();
  const location = useLocation();
  const [showHitEffect, setShowHitEffect] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSignOutModalVisible, setIsSignOutModalVisible] = useState(false);
  const [restaurantLogo, setRestaurantLogo] = useState('');
  const [isLogoModalVisible, setIsLogoModalVisible] = useState(false);

  useEffect(() => {
    fetchRestaurantLogo();
  }, []);

  const fetchRestaurantLogo = async () => {
    try {
      const response = await fetch('http://localhost:3002/restaurant');
      if (response.ok) {
        const data = await response.json();
        setRestaurantLogo(data.logo);
      }
    } catch (error) {
      console.error("Error fetching restaurant logo:", error);
    }
  };

  const handleOrderSummaryClick = () => {
    navigate('/order-summary');
  };

  const handleSignOut = () => {
    setIsSignOutModalVisible(true);
  };

  const handleConfirmSignOut = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('role');
    setIsSignOutModalVisible(false);
    navigate('/');
  };

  const handleCancelSignOut = () => {
    setIsSignOutModalVisible(false);
  };

  const triggerHitEffect = () => {
    setShowHitEffect(true);
    setTimeout(() => setShowHitEffect(false), 300);
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    if (onSearch) {
      onSearch(value);
    }
    if (location.pathname !== '/home') {
      navigate('/home');
    }
  };

  const handleLogoClick = () => {
    setIsLogoModalVisible(true);
  };

  return (
    <header className="header">
      <div className="header__container">
        <div className="header__content">
          <div className="header__left">
            <TiThMenu className="header__menu-button" onClick={toggleDrawer} />
            <Link to="/home" className="header__logo">
              <img 
                src={process.env.PUBLIC_URL + '/assets/logo-transparent-png.png'} 
                alt="Smart Server" 
                className="header__logo-image" 
              />
              <span className="header__logo-text">Smart Server</span>
            </Link>
          </div>
          <div className="header__center">
  <Search
    placeholder="Search menu..."
    className="header__search-input"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    onSearch={handleSearch}
  />
  {restaurantLogo && (
    <div className="header__restaurant-logo-container">
      <img 
        src={restaurantLogo}
        alt="Restaurant Logo"
        className="header__restaurant-logo"
        onClick={handleLogoClick}
      />
    </div>
  )}
</div>

          <div className="header__right">
            {role === 'customer' && (
              <>
                <Tooltip title="Order Summary">
                  <AiOutlineFileText 
                    onClick={handleOrderSummaryClick} 
                    className="header__icon"
                  />
                </Tooltip>
                <Tooltip title="Cart">
                  <Link to="/cart" className="header__cart-icon">
                    <Badge count={cart.length} offset={[10, 0]}>
                      <div ref={cartIconRef} style={{ position: 'relative' }}>
                        <AiOutlineShoppingCart className="header__icon" style={{marginTop: "8px"}} />
                        {showHitEffect && <CartHitEffect />}
                      </div>
                    </Badge>
                  </Link>
                </Tooltip>
              </>
            )}
            <Tooltip title="Sign Out">
              <IoPowerSharp
                onClick={handleSignOut} 
                className="header__icon"
              />
            </Tooltip>
          </div>
        </div>
      </div>

      {/* Sign Out Confirmation Modal */}
      <Modal
        title="Confirm Sign Out"
        visible={isSignOutModalVisible}
        onOk={handleConfirmSignOut}
        onCancel={handleCancelSignOut}
        okText="Yes, Sign Out"
        cancelText="Cancel"
        style={{
          content: {
            background: 'linear-gradient(135deg, #ffffff, #fff0f0)',
            borderRadius: '1rem',
            overflow: 'hidden',
            boxShadow: '0 10px 25px rgba(255, 0, 0, 0.1)',
          }
        }}
        bodyStyle={{
          padding: '12px',
          fontSize: '1rem',
          color: '#333333',
        }}
        headStyle={{
          background: '#ff0000',
          borderBottom: 'none',
          padding: '8px 12px',
        }}
        titleStyle={{
          color: '#ffffff',
          fontSize: '1.5rem',
          fontWeight: 'bold',
        }}
        footerStyle={{
          borderTop: 'none',
          padding: '8px 12px',
        }}
        okButtonProps={{
          style: {
            backgroundColor: '#ff0000',
            borderColor: '#ff0000',
            color: '#ffffff',
            borderRadius: '0.5rem',
            fontWeight: 'bold',
            height: '30px',
            padding: '0 20px',
            transition: 'all 0.3s ease',
          }
        }}
        cancelButtonProps={{
          style: {
            borderColor: '#ff0000',
            color: '#ff0000',
            borderRadius: '0.5rem',
            fontWeight: 'bold',
            height: '30px',
            padding: '0 20px',
            transition: 'all 0.3s ease',
          }
        }}
      >
        <p>Are you sure you want to sign out?</p>
      </Modal>

      {/* Restaurant Logo Modal */}
      <Modal
        visible={isLogoModalVisible}
        onCancel={() => setIsLogoModalVisible(false)}
        footer={null}
        width={400}
        style={{
          content: {
            background: 'linear-gradient(135deg, #ffffff, #fff0f0)',
            borderRadius: '1rem',
            overflow: 'hidden',
            boxShadow: '0 10px 25px rgba(255, 0, 0, 0.1)',
          }
        }}
        bodyStyle={{
          padding: '20px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <img 
          src={restaurantLogo}
          alt="Restaurant Logo"
          style={{
            maxWidth: '100%',
            maxHeight: '300px',
            objectFit: 'contain',
            borderRadius: '10px',
          }}
        />
      </Modal>
    </header>
  );
}

export default Header;